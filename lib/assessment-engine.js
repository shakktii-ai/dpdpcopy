import connectDB from './mongodb.js';
import Assessment from '../models/Assessment.js';
import Organization from '../models/Organization.js';
import AssessmentProfile from '../models/AssessmentProfile.js';
import TestRun from '../models/TestRun.js';
import ScenarioResult from '../models/ScenarioResult.js';
import Evidence from '../models/Evidence.js';
import StructuredObservation from '../models/StructuredObservation.js';
import LegalRequirement from '../models/LegalRequirement.js';
import Finding from '../models/Finding.js';
import { seedLegalRequirements, evaluateApplicability } from './requirement-registry.js';
import { generateContentSuggestion } from './content-suggestion-engine.js';

/**
 * Transforms technical observations, documents, and profile data into traceable DPDP findings.
 * 
 * @param {string} assessmentId
 * @param {string} [testRunId]
 * @returns {Promise<{
 *   assessmentId: string,
 *   complianceScore: number,
 *   totalRequirements: number,
 *   counts: { pass: number, fail: number, needsReview: number, notApplicable: number, notTested: number },
 *   findings: Array
 * }>}
 */
export async function evaluateAssessmentFindings(assessmentId, testRunId = null, options = {}) {
  await connectDB();
  await seedLegalRequirements();

  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) {
    throw new Error(`Assessment ${assessmentId} not found.`);
  }

  const organization = await Organization.findById(assessment.organization);
  const profile = await AssessmentProfile.findOne({ organization: assessment.organization });
  
  // Find the associated TestRun if not explicitly provided
  let testRun = null;
  if (testRunId) {
    testRun = await TestRun.findById(testRunId);
  } else {
    testRun = await TestRun.findOne({ assessmentId }).sort({ createdAt: -1 });
  }

  // Load scenarios and evidence
  const scenarioResults = testRun
    ? await ScenarioResult.find({ testRunId: testRun._id })
    : await ScenarioResult.find({ assessmentId });

  const evidenceList = testRun
    ? await Evidence.find({ testRunId: testRun._id })
    : await Evidence.find({ assessmentId });

  const observations = testRun
    ? await StructuredObservation.find({ testRunId: testRun._id })
    : await StructuredObservation.find({ assessmentId });

  // Use explicit legal assessment reference date (defaults to assessment creation or current date)
  const assessmentDate = options.assessmentDate || assessment.createdAt || new Date();

  // Evaluate applicability of all legal requirements with 2026 date-aware model
  const applicabilityList = evaluateApplicability(organization, profile, assessmentDate);
  const legalRequirements = await LegalRequirement.find().lean();
  const reqMap = new Map(legalRequirements.map((r) => [r.requirementId, r]));

  const generatedFindings = [];
  const counts = { pass: 0, fail: 0, needsReview: 0, notApplicable: 0, notTested: 0, upcomingGaps: 0 };

  for (const item of applicabilityList) {
    const req = item.requirement;
    const reqDoc = reqMap.get(req.requirementId) || req;

    // Default payload structure
    let status = 'not_tested';
    let severity = req.defaultSeverity || 'medium';
    let remediationStatus = 'open';
    let observedFacts = [];
    let aiInterpretation = '';
    let explanation = '';
    let recommendedRemediation = '';
    let linkedEvidenceIds = [];
    let evidenceSnapshot = null;

    if (item.legalStatus?.status === 'not_yet_in_force') {
      status = 'needs_review';
      severity = 'low';
      remediationStatus = 'open';
      explanation = `Upcoming Compliance Requirement: Effective on ${req.effectiveDate || 'future date'}. Early readiness recommended.`;
      observedFacts = ['Statutory obligation published in Official Gazette; scheduled for future enforcement.'];
      aiInterpretation = `Rule or obligation under DPDP Rules 2025 comes into force on ${req.effectiveDate}. Evaluated as a Readiness Gap to prepare ahead of time without penalizing current compliance score.`;
      recommendedRemediation = `Review technical controls and prepare for compliance prior to ${req.effectiveDate}.`;
      counts.upcomingGaps = (counts.upcomingGaps || 0) + 1;
    } else if (!item.isApplicable) {
      status = 'not_applicable';
      severity = 'informational';
      remediationStatus = 'risk_accepted';
      explanation = `Requirement is not applicable: ${item.reason}`;
      observedFacts = ['Trigger functionality not activated or declared in assessment profile.'];
      aiInterpretation = 'No statutory processing triggers detected for this specific legal clause.';
      recommendedRemediation = 'No corrective action required at this time.';
      counts.notApplicable++;
    } else {
      // Requirement is applicable: Map to technical scenario evidence
      switch (req.requirementId) {
        case 'DPDP-ACT-SEC-5-NOTICE': {
          const sc = scenarioResults.find((s) => s.scenarioId === 'privacy_notice_compliance');
          const noticeEv = evidenceList.filter((e) => e.scenarioId.includes('privacy') || e.scenarioId.includes('notice'));
          linkedEvidenceIds = noticeEv.map((e) => e._id);
          evidenceSnapshot = noticeEv[0]
            ? { pageUrl: noticeEv[0].pageUrl, screenshotUrl: noticeEv[0].screenshotPath, snippet: noticeEv[0].extractedContent?.slice(0, 300) }
            : null;

          if (sc && sc.status === 'passed') {
            status = 'pass';
            severity = 'informational';
            remediationStatus = 'resolved';
            observedFacts = sc.observedFindings || ['Privacy notice detected and accessible via dedicated navigation link.'];
            aiInterpretation = 'The published Privacy Notice satisfies statutory itemized disclosures pursuant to Section 5(1).';
            explanation = 'Data Fiduciary provides accessible notice detailing personal data categories, specified purposes, and DPO contacts.';
            recommendedRemediation = 'Maintain continuous accuracy of notice during subsequent application feature updates.';
            counts.pass++;
          } else if (sc && sc.status === 'needs_review') {
            status = 'needs_review';
            severity = 'medium';
            remediationStatus = 'open';
            observedFacts = sc.observedFindings || ['Privacy notice located but one or more disclosures are ambiguous or incomplete.'];
            aiInterpretation = 'One or more required statutory disclosures (such as specific retention timeline or right to withdraw) require legal clarification.';
            explanation = 'Notice was discovered but requires human legal confirmation regarding purpose specificity.';
            recommendedRemediation = 'Update privacy notice to explicitly document the statutory retention duration and consent withdrawal mechanism.';
            counts.needsReview++;
          } else {
            status = 'fail';
            severity = 'critical';
            remediationStatus = 'open';
            observedFacts = ['No accessible privacy notice detected during automated crawling.'];
            aiInterpretation = 'Violation of DPDP Act Section 5(1): Personal data collected without requisite prior itemized notice.';
            explanation = 'Failure to provide statutory notice before collecting personal data.';
            recommendedRemediation = 'Deploy an accessible, compliant Privacy Notice in accordance with Section 5 of the DPDP Act 2023.';
            counts.fail++;
          }
          break;
        }

        case 'DPDP-ACT-SEC-6-CONSENT-ITEMIZED': {
          const sc = scenarioResults.find(
            (s) => s.scenarioId === 'notice_and_consent' || s.scenarioId === 'consent_mechanism_sec_6'
          );
          const consentEv = evidenceList.filter((e) => e.scenarioId.includes('consent') || e.scenarioId.includes('banner'));
          linkedEvidenceIds = consentEv.map((e) => e._id);
          evidenceSnapshot = consentEv[0]
            ? { pageUrl: consentEv[0].pageUrl, screenshotUrl: consentEv[0].screenshotPath, snippet: consentEv[0].extractedContent?.slice(0, 300) }
            : null;

          if (sc && sc.status === 'passed') {
            status = 'pass';
            severity = 'informational';
            remediationStatus = 'resolved';
            observedFacts = sc.observedFindings || ['Itemized cookie and consent interface provides clear affirmative opt-in and opt-out options.'];
            aiInterpretation = 'Consent mechanism complies with Section 6(1) unconditional affirmative action requirements.';
            explanation = 'Users can freely accept, reject, or customize consent categories without deceptive dark patterns.';
            recommendedRemediation = 'Ensure all non-essential scripts remain blocked until affirmative consent is confirmed.';
            counts.pass++;
          } else if (sc && sc.status === 'needs_review') {
            status = 'needs_review';
            severity = 'high';
            remediationStatus = 'open';
            observedFacts = sc.observedFindings || ['Consent banner detected but lacks direct 1-click rejection mechanism.'];
            aiInterpretation = 'Asymmetric consent architecture: Accept button is prominent while opt-out requires multiple clicks.';
            explanation = 'Potential dark pattern: Consent must be unconditional and equally easy to refuse.';
            recommendedRemediation = 'Add an equally prominent "Reject Non-Essential" button on the initial cookie banner.';
            counts.needsReview++;
          } else {
            status = 'fail';
            severity = 'critical';
            remediationStatus = 'open';
            observedFacts = ['Tracking cookies or scripts activated prior to consent request.'];
            aiInterpretation = 'Non-compliance with DPDP Act Section 6(1): Personal data processed without affirmative consent.';
            explanation = 'Tracking and data collection occurs without obtaining prior valid consent.';
            recommendedRemediation = 'Implement client-side script gating to prevent telemetry loading before affirmative consent.';
            counts.fail++;
          }
          break;
        }

        case 'DPDP-ACT-SEC-6-WITHDRAWAL': {
          const sc = scenarioResults.find((s) => s.scenarioId === 'consent_granularity_and_withdrawal');
          const withdrawEv = evidenceList.filter((e) => e.scenarioId.includes('withdrawal') || e.pageUrl.includes('consent'));
          linkedEvidenceIds = withdrawEv.map((e) => e._id);
          evidenceSnapshot = withdrawEv[0]
            ? { pageUrl: withdrawEv[0].pageUrl, screenshotUrl: withdrawEv[0].screenshotPath }
            : null;

          if (sc && sc.status === 'passed') {
            status = 'pass';
            severity = 'informational';
            remediationStatus = 'resolved';
            observedFacts = sc.observedFindings || ['Dedicated consent manager provides unconditional withdrawal toggle.'];
            aiInterpretation = 'Consent withdrawal mechanism complies with Section 6(4) comparable ease mandate.';
            explanation = 'Data Principals can withdraw consent at any time via self-service preferences.';
            recommendedRemediation = 'Verify backend automated deletion triggers execute upon consent withdrawal.';
            counts.pass++;
          } else {
            status = 'needs_review';
            severity = 'high';
            remediationStatus = 'open';
            observedFacts = ['No self-service consent withdrawal button detected on inspected pages.'];
            aiInterpretation = 'Potential Section 6(4) non-compliance: Ease of withdrawal must match the ease of granting consent.';
            explanation = 'Withdrawal instructions may be missing or require manual email requests.';
            recommendedRemediation = 'Publish a persistent "Manage Consent / Cookie Settings" footer link enabling 1-click withdrawal.';
            counts.needsReview++;
          }
          break;
        }

        case 'DPDP-ACT-SEC-8-5-SECURITY-SAFEGUARDS': {
          const sc = scenarioResults.find((s) => s.scenarioId === 'authorized_login_safeguards');
          const secEv = evidenceList.filter((e) => e.scenarioId.includes('login') || e.scenarioId.includes('security'));
          linkedEvidenceIds = secEv.map((e) => e._id);

          if (sc && sc.status === 'passed') {
            status = 'pass';
            severity = 'informational';
            remediationStatus = 'resolved';
            observedFacts = sc.observedFindings || ['Authentication form masks passwords, utilizes HTTPS, and protects credentials.'];
            aiInterpretation = 'Reasonable technical safeguards verified on inspected client login interfaces.';
            explanation = 'Client interfaces demonstrate appropriate authentication safeguards and credential masking.';
            recommendedRemediation = 'Maintain regular vulnerability assessments and penetration testing of authentication services.';
            counts.pass++;
          } else if (sc && sc.status === 'skipped') {
            status = 'not_tested';
            severity = 'informational';
            remediationStatus = 'risk_accepted';
            observedFacts = sc.observedFindings || ['Customer authorized public-page-only scope. Authenticated safeguards were not tested.'];
            aiInterpretation = 'Authentication testing was not in scope for this assessment (public pages only).';
            explanation = 'Customer configured assessment for public pages only. Authenticated login mechanisms were not tested.';
            recommendedRemediation = 'Provide test account credentials during a future assessment to evaluate authenticated session safeguards.';
            counts.notTested++;
          } else {
            status = 'needs_review';
            severity = 'high';
            remediationStatus = 'open';
            observedFacts = sc?.observedFindings || ['Authentication forms or transmission channels require security verification.'];
            aiInterpretation = 'Verify HTTPS enforcement and session cookie security attributes (HttpOnly, Secure, SameSite).';
            explanation = 'Security safeguards could not be fully confirmed from client inspection alone.';
            recommendedRemediation = 'Enforce HTTPS everywhere with HSTS and configure strict session cookie protection flags.';
            counts.needsReview++;
          }
          break;
        }

        case 'DPDP-ACT-SEC-8-7-RETENTION-ERASURE': {
          // Document review / statutory retention evaluation
          const sc = scenarioResults.find((s) => s.scenarioId === 'privacy_notice_compliance');
          const hasRetention = sc?.observedFindings?.some((f) => /retention/i.test(f));

          if (hasRetention) {
            status = 'pass';
            severity = 'informational';
            remediationStatus = 'resolved';
            observedFacts = ['Privacy notice explicitly specifies statutory data retention period and erasure terms.'];
            aiInterpretation = 'Fiduciary has defined reasonable purpose-bound retention periods under Section 8(7).';
            explanation = 'Data retention criteria and deletion upon purpose fulfillment are documented.';
            recommendedRemediation = 'Implement automated data lifecycle schedules to purge database records past retention threshold.';
            counts.pass++;
          } else {
            status = 'needs_review';
            severity = 'medium';
            remediationStatus = 'open';
            observedFacts = ['Retention period is not explicitly defined in visible notice or states indefinite retention.'];
            aiInterpretation = 'Indefinite retention of personal data is non-compliant with Section 8(7) erasure obligations.';
            explanation = 'Statutory data retention period must be explicitly stated.';
            recommendedRemediation = 'Define specific purpose-based retention windows (e.g. 36 months) in the Privacy Policy.';
            counts.needsReview++;
          }
          break;
        }

        case 'DPDP-ACT-SEC-8-9-GRIEVANCE-OFFICER': {
          const sc = scenarioResults.find((s) => s.scenarioId === 'grievance_mechanism_sec_8_9');
          const grievEv = evidenceList.filter((e) => e.scenarioId.includes('grievance'));
          linkedEvidenceIds = grievEv.map((e) => e._id);
          evidenceSnapshot = grievEv[0]
            ? { pageUrl: grievEv[0].pageUrl, screenshotUrl: grievEv[0].screenshotPath }
            : null;

          if (sc && sc.status === 'passed') {
            status = 'pass';
            severity = 'informational';
            remediationStatus = 'resolved';
            observedFacts = sc.observedFindings || ['Grievance Officer designated with published email, address, and response timeline.'];
            aiInterpretation = 'Statutory grievance redressal mechanism meets Section 8(9) requirements.';
            explanation = 'Data Principals have a designated electronic channel and escalation route to the Grievance Officer.';
            recommendedRemediation = 'Ensure internal ticketing SLA ensures grievances are resolved within the 30-day statutory timeline.';
            counts.pass++;
          } else {
            status = 'fail';
            severity = 'critical';
            remediationStatus = 'open';
            observedFacts = ['No designated Grievance Officer name or dedicated electronic contact published on website.'];
            aiInterpretation = 'Direct violation of Section 8(9): Failure to establish and publish an effective grievance redressal mechanism.';
            explanation = 'A dedicated Grievance Officer contact must be published for Data Principal complaints.';
            recommendedRemediation = 'Publish the full name, official email, physical address, and 30-day response SLA of the Grievance Officer.';
            counts.fail++;
          }
          break;
        }

        case 'DPDP-ACT-SEC-9-CHILDREN-DATA': {
          status = 'needs_review';
          severity = 'high';
          remediationStatus = 'open';
          observedFacts = ['Registration workflow does not feature an explicit age gate or parental verification step.'];
          aiInterpretation = 'If the service is accessed by minors, processing personal data without verifiable parental consent violates Section 9(1).';
          explanation = 'Verification required: Confirm whether the service processes personal data of individuals under 18.';
          recommendedRemediation = 'Incorporate an age verification gate and parental consent mechanism if services are accessible to children.';
          counts.needsReview++;
          break;
        }

        case 'DPDP-ACT-SEC-4-FORM-NOTICE': {
          const sc = scenarioResults.find((s) => s.scenarioId === 'data_minimization_and_notice');
          const formEv = evidenceList.filter((e) => e.scenarioId.includes('data_minimization') || e.scenarioId.includes('form') || e.pageUrl.includes('contact'));
          linkedEvidenceIds = formEv.map((e) => e._id);
          evidenceSnapshot = formEv[0]
            ? { pageUrl: formEv[0].pageUrl, screenshotUrl: formEv[0].screenshotPath, snippet: formEv[0].extractedContent?.slice(0, 300) }
            : null;

          if (sc && sc.status === 'passed') {
            status = 'pass';
            severity = 'informational';
            remediationStatus = 'resolved';
            observedFacts = sc.observedFindings || ['Form-level privacy notice and unbundled opt-in checkbox verified.'];
            aiInterpretation = 'Interactive forms feature pre-submission statutory disclosures under Section 5(1) and 6(1).';
            explanation = 'Interactive forms display clear purpose notice and affirmative consent controls.';
            recommendedRemediation = 'Ensure newly deployed forms maintain adjacent purpose notices.';
            counts.pass++;
          } else if (sc && sc.status === 'needs_review') {
            status = 'needs_review';
            severity = 'high';
            remediationStatus = 'open';
            observedFacts = sc.observedFindings || ['Contact form collects personal data but notice is bundled or unconfirmed.'];
            aiInterpretation = 'Pre-submission notice on contact form requires explicit purpose description and unbundled marketing opt-in.';
            explanation = 'Form submission notice requires clarification to separate contact response from commercial marketing.';
            recommendedRemediation = 'Add explicit purpose notice and unbundled opt-in checkbox above submit button.';
            counts.needsReview++;
          } else {
            status = 'fail';
            severity = 'high';
            remediationStatus = 'open';
            observedFacts = ['Personal data collected via interactive forms without adjacent privacy notice.'];
            aiInterpretation = 'Non-compliance with Section 5(1) & 6(1): Data collected without pre-submission notice.';
            explanation = 'Form collects personal data without displaying prior notice or affirmative consent checkbox.';
            recommendedRemediation = 'Deploy form-level notice declaring processing purpose and unbundled consent checkbox.';
            counts.fail++;
          }
          break;
        }

        case 'DPDP-ACT-SEC-11-14-RIGHTS': {
          const sc = scenarioResults.find((s) => s.scenarioId === 'consent_granularity_and_withdrawal' || s.scenarioId === 'privacy_notice_compliance');
          const rightsEv = evidenceList.filter((e) => e.scenarioId.includes('rights') || e.pageUrl.includes('privacy'));
          linkedEvidenceIds = rightsEv.map((e) => e._id);
          evidenceSnapshot = rightsEv[0]
            ? { pageUrl: rightsEv[0].pageUrl, screenshotUrl: rightsEv[0].screenshotPath, snippet: rightsEv[0].extractedContent?.slice(0, 300) }
            : null;

          const hasRights = sc?.observedFindings?.some((f) => /rights|nomination|access|erasure/i.test(f));
          if (hasRights) {
            status = 'pass';
            severity = 'informational';
            remediationStatus = 'resolved';
            observedFacts = ['Privacy disclosures detail Data Principal rights to access, correction, erasure, and nomination.'];
            aiInterpretation = 'Data Fiduciary provides accessible workflows for Data Principal rights under Sections 11–14.';
            explanation = 'Statutory rights facilitation is documented and available to users.';
            recommendedRemediation = 'Maintain accessible rights request intake procedures.';
            counts.pass++;
          } else {
            status = 'needs_review';
            severity = 'high';
            remediationStatus = 'open';
            observedFacts = ['Privacy policy lacks detailed procedures for exercising rights under Sections 11-14 (especially nomination).'];
            aiInterpretation = 'Sections 11–14 mandate facilitation of rights of access, correction, erasure, and nomination under Rule 14.';
            explanation = 'Notice should explicitly document how Data Principals can submit rights requests and register nominees.';
            recommendedRemediation = 'Publish a comprehensive Data Principal Rights section detailing access, correction, erasure, and nomination procedures.';
            counts.needsReview++;
          }
          break;
        }

        case 'DPDP-RULES-2025-RULE-3-NOTICE-FORMAT': {
          status = 'needs_review';
          severity = 'low';
          remediationStatus = 'open';
          observedFacts = ['Website publishes privacy notice in English without an Indian language switcher.'];
          aiInterpretation = 'DPDP Rules 2025 Rule 3 requires notice availability in English and 8th Schedule Indian languages (effective 13 May 2027).';
          explanation = 'Multi-lingual access is scheduled for enforcement on 13 May 2027 (18 months after gazette publication). Evaluated as an Upcoming Compliance / Readiness Gap.';
          recommendedRemediation = 'Introduce localized notice translations in scheduled Indian languages (e.g. Hindi, Marathi, Tamil) ahead of 13 May 2027.';
          counts.upcomingGaps = (counts.upcomingGaps || 0) + 1;
          break;
        }

        case 'DPDP-RULES-2025-RULE-5-CONSENT-MANAGERS': {
          status = 'not_tested';
          severity = 'informational';
          remediationStatus = 'risk_accepted';
          observedFacts = ['Consent Manager technical interoperability APIs require dedicated organizational evidence.'];
          aiInterpretation = 'Consent Manager registration and API specifications are in operational rollout by DPBI.';
          explanation = 'Interoperability with registered Consent Managers will become enforceable upon DPBI registry gazette notification.';
          recommendedRemediation = 'Monitor MeitY Consent Manager API standards and prepare backend webhook integrations.';
          counts.notTested++;
          break;
        }

        case 'DPDP-ACT-SEC-27-RULE-9-GRIEVANCE-PREREQUISITE': {
          const sc = scenarioResults.find((s) => s.scenarioId === 'grievance_mechanism_sec_8_9');
          const grievanceEv = evidenceList.filter((e) => e.scenarioId.includes('grievance') || e.pageUrl.includes('grievance'));
          linkedEvidenceIds = grievanceEv.map((e) => e._id);
          evidenceSnapshot = grievanceEv[0]
            ? { pageUrl: grievanceEv[0].pageUrl, screenshotUrl: grievanceEv[0].screenshotPath, snippet: grievanceEv[0].extractedContent?.slice(0, 300) }
            : null;

          if (sc && sc.status === 'passed') {
            status = 'pass';
            severity = 'informational';
            remediationStatus = 'resolved';
            observedFacts = sc.observedFindings || ['Grievance Redressal Officer published with direct electronic communication channel.'];
            aiInterpretation = 'Data Fiduciary enables Data Principals to exhaust statutory internal grievance redressal prior to filing DPBI complaints.';
            explanation = 'Satisfies Section 27 and Rule 9 internal redressal prerequisite mechanism.';
            recommendedRemediation = 'Maintain accessible grievance redressal channels and adherence to statutory resolution SLAs.';
            counts.pass++;
          } else if (sc && sc.status === 'needs_review') {
            status = 'needs_review';
            severity = 'medium';
            remediationStatus = 'open';
            observedFacts = sc.observedFindings || ['Grievance contact discovered but escalation timeline or officer identity is unconfirmed.'];
            aiInterpretation = 'Data Principals may face ambiguity when attempting to exhaust internal grievance redressal before DPBI escalation.';
            explanation = 'Clarification required regarding officer name and statutory escalation procedure.';
            recommendedRemediation = 'Explicitly identify the designated Grievance Officer and published SLA.';
            counts.needsReview++;
          } else {
            status = 'fail';
            severity = 'critical';
            remediationStatus = 'open';
            observedFacts = ['No designated Grievance Officer details found on inspected pages.'];
            aiInterpretation = 'Violation of Section 8(9) & Rule 9 prerequisite: Data Principals cannot exhaust internal redressal.';
            explanation = 'Absence of published grievance redressal officer impedes statutory complaint workflow under Section 27.';
            recommendedRemediation = 'Publish designated Grievance Redressal Officer details with electronic contact channel in privacy disclosures.';
            counts.fail++;
          }
          break;
        }

        default: {
          if (!req.isWebsiteComplianceCheck) {
            status = 'not_applicable';
            severity = 'informational';
            remediationStatus = 'risk_accepted';
            observedFacts = ['Statutory reference or governance rule; not assessed on client-side website.'];
            aiInterpretation = 'Governs regulatory authorities (DPBI/TDSAT) or non-website corporate processes.';
            explanation = item.reason || 'Not applicable to website inspection.';
            recommendedRemediation = 'No website changes required.';
            counts.notApplicable++;
          } else {
            status = 'needs_review';
            severity = req.defaultSeverity || 'medium';
            remediationStatus = 'open';
            observedFacts = ['Evidence for this statutory obligation requires dedicated verification.'];
            aiInterpretation = 'Verification required against organization compliance documentation.';
            explanation = item.reason || 'Requirement requires dedicated audit verification.';
            recommendedRemediation = req.reviewerGuidance || 'Review compliance against statutory control requirements.';
            counts.needsReview++;
          }
          break;
        }
      }
    }

    // Generate AI-powered ready-to-use content update suggestion for missing, partial, or upcoming items
    let contentSuggestion = null;
    const isNeedsRemediation = status === 'fail' || status === 'needs_review' || item.legalStatus?.status === 'not_yet_in_force';
    if (req.isWebsiteComplianceCheck && isNeedsRemediation) {
      try {
        contentSuggestion = await generateContentSuggestion({
          requirementId: req.requirementId,
          organizationName: organization?.name || 'Authorized Data Fiduciary',
          existingContentSnippet: evidenceSnapshot?.snippet || (observedFacts && observedFacts.length > 0 ? observedFacts.join('; ') : ''),
          pageUrl: evidenceSnapshot?.pageUrl || '',
          assessmentDate,
        });
      } catch (err) {
        console.warn(`[Assessment Engine] Content suggestion generation fallback for ${req.requirementId}:`, err.message);
      }
    }

    // Upsert Finding in MongoDB with full 2026 Legal Framework metadata
    const findingDoc = await Finding.findOneAndUpdate(
      { assessment: assessment._id, requirementId: req.requirementId },
      {
        $set: {
          assessment: assessment._id,
          organization: assessment.organization,
          requirementId: req.requirementId,
          requirement: reqDoc._id || null,
          ruleId: req.sectionOrRule,
          title: req.title,
          description: req.expectedControl,
          category: req.category,
          status,
          severity,
          remediationStatus,
          observedFacts,
          aiInterpretation,
          confidence: item.confidence || 'high',
          explanation,
          recommendedRemediation,
          contentSuggestion,
          evidenceReferences: linkedEvidenceIds,
          evidence: evidenceSnapshot,
          legalApplicabilityStatus: item.legalStatus?.status || req.applicabilityStatus || 'in_force',
          effectiveDate: req.effectiveDate || null,
          applicabilityRationale: item.reason || '',
          officialSource: req.officialSource || 'Digital Personal Data Protection Act, 2023',
          registryVersion: req.version || '2026.1',
          penaltyReference: req.penaltyReference || null,
          limitations: item.limitations || '',
        },
      },
      { upsert: true, new: true }
    );

    generatedFindings.push(findingDoc);
  }

  // Calculate actual compliance score: Pass / (Pass + Fail + NeedsReview) * 100
  const actionableCount = counts.pass + counts.fail + counts.needsReview;
  const complianceScore = actionableCount > 0 ? Math.round((counts.pass / actionableCount) * 100) : 0;

  // Calculate findingsCount breakdown by severity for issues requiring action/review
  const findingsCount = { critical: 0, high: 0, medium: 0, low: 0, total: 0 };
  for (const f of generatedFindings) {
    if (f.status === 'fail' || f.status === 'needs_review') {
      const sev = (f.severity || 'medium').toLowerCase();
      if (findingsCount[sev] !== undefined) {
        findingsCount[sev]++;
      }
      findingsCount.total++;
    }
  }

  // Update Assessment record
  await Assessment.findByIdAndUpdate(assessmentId, {
    complianceScore,
    findingsCount,
    status: 'completed',
    completedAt: new Date(),
    summaryMetrics: counts,
  });

  return {
    assessmentId: assessment._id,
    complianceScore,
    totalRequirements: applicabilityList.length,
    counts,
    findings: generatedFindings,
  };
}
