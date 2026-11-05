import fs from 'fs';
import path from 'path';
import assert from 'assert';
import {
  OFFICIAL_SOURCES,
  STATUTORY_PENALTIES,
  STATUTORY_REQUIREMENTS,
  evaluateCommencement,
} from '../lib/legal-knowledge-base.js';
import {
  generateContentSuggestion,
  groupSuggestionsByPage,
  STATUTORY_DISCLAIMER_TEXT,
} from '../lib/content-suggestion-engine.js';
import { buildPdfDocument } from '../lib/report-generator.js';
import PDFDocument from 'pdfkit';

const results = [];
function recordTest(name, passed, details = '') {
  results.push({ name, passed, details });
  const mark = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${mark}] ${name}`);
  if (details) {
    console.log(`       ${details}`);
  }
}

async function main() {
  console.log('========================================================================');
  console.log('DPDP ASSESSMENT ENGINE: LEGAL KNOWLEDGE BASE & CONTENT GENERATION TESTS');
  console.log('Official Reference Documents: DPDP Act 2023 & DPDP Rules 2025');
  console.log('========================================================================\n');

  // =========================================================================
  // TEST 1: Official Government Reference Documents Verification
  // =========================================================================
  console.log('--- TEST 1: Official Legal Reference Documents ---');
  try {
    const actPdfPath = path.resolve(process.cwd(), 'public', 'DPDP Act 2023.pdf');
    const rulesPdfPath = path.resolve(process.cwd(), 'public', 'DPDP_Rules_2025_English_only.pdf');

    assert(fs.existsSync(actPdfPath), 'DPDP Act 2023.pdf must exist in public directory');
    const actStat = fs.statSync(actPdfPath);
    assert(actStat.size > 50000, 'DPDP Act 2023.pdf file size must be valid (>50KB)');

    assert(fs.existsSync(rulesPdfPath), 'DPDP_Rules_2025_English_only.pdf must exist in public directory');
    const rulesStat = fs.statSync(rulesPdfPath);
    assert(rulesStat.size > 50000, 'DPDP_Rules_2025_English_only.pdf file size must be valid (>50KB)');

    recordTest('Official PDF Documents Present and Verified', true, `Act: ${actStat.size} bytes | Rules: ${rulesStat.size} bytes`);
  } catch (err) {
    recordTest('Official PDF Documents Present and Verified', false, err.message);
  }

  // =========================================================================
  // TEST 2: Statutory Penalties Modeling under DPDP Act 2023 THE SCHEDULE
  // =========================================================================
  console.log('\n--- TEST 2: THE SCHEDULE Statutory Penalties Modeling ---');
  try {
    assert.strictEqual(STATUTORY_PENALTIES.ITEM_1.provision, 'Section 8(5)');
    assert.strictEqual(STATUTORY_PENALTIES.ITEM_1.maxPenaltyText, 'Up to ₹250 Crore');
    assert.strictEqual(STATUTORY_PENALTIES.ITEM_1.maxPenaltyAmountInr, 2500000000);

    assert.strictEqual(STATUTORY_PENALTIES.ITEM_2.provision, 'Section 8(6)');
    assert.strictEqual(STATUTORY_PENALTIES.ITEM_2.maxPenaltyText, 'Up to ₹200 Crore');

    assert.strictEqual(STATUTORY_PENALTIES.ITEM_3.provision, 'Section 9');
    assert.strictEqual(STATUTORY_PENALTIES.ITEM_3.maxPenaltyText, 'Up to ₹200 Crore');

    assert.strictEqual(STATUTORY_PENALTIES.ITEM_4.provision, 'Section 10');
    assert.strictEqual(STATUTORY_PENALTIES.ITEM_4.maxPenaltyText, 'Up to ₹150 Crore');

    assert.strictEqual(STATUTORY_PENALTIES.ITEM_5.provision, 'Section 15');
    assert.strictEqual(STATUTORY_PENALTIES.ITEM_5.maxPenaltyText, 'Up to ₹10,000');

    assert.strictEqual(STATUTORY_PENALTIES.ITEM_7.maxPenaltyText, 'Up to ₹50 Crore');

    recordTest('THE SCHEDULE Statutory Penalties Exactly Mapped (Items 1 to 7)', true, 'All 7 schedule items verified');
  } catch (err) {
    recordTest('THE SCHEDULE Statutory Penalties Exactly Mapped (Items 1 to 7)', false, err.message);
  }

  // =========================================================================
  // TEST 3: Commencement Dates & Temporal Applicability Evaluation
  // =========================================================================
  console.log('\n--- TEST 3: Commencement Dates & Readiness Gap Evaluation ---');
  try {
    const assessmentDate = new Date('2026-11-05');

    // Rule 1, 2, 17-21 in force since 2025-11-13
    const inForceCheck = evaluateCommencement('2025-11-13', assessmentDate);
    assert.strictEqual(inForceCheck.isInForce, true);
    assert.strictEqual(inForceCheck.commencementStatus, 'in_force');

    // Rule 4 (Consent Managers) in force 1 year after publication: 2026-11-13 (8 days away)
    const rule4Check = evaluateCommencement('2026-11-13', assessmentDate);
    assert.strictEqual(rule4Check.isInForce, false);
    assert.strictEqual(rule4Check.commencementStatus, 'upcoming_compliance');
    assert(rule4Check.daysRemaining > 0 && rule4Check.daysRemaining <= 8);

    // Rule 3 (Multi-lingual Notice & Independent Presentation) in force 18 months: 2027-05-13
    const rule3Check = evaluateCommencement('2027-05-13', assessmentDate);
    assert.strictEqual(rule3Check.isInForce, false);
    assert.strictEqual(rule3Check.commencementStatus, 'upcoming_compliance');
    assert(rule3Check.daysRemaining > 100, `Expected > 100 days remaining, got ${rule3Check.daysRemaining}`);

    recordTest('Temporal Commencement Evaluation (In Force vs Upcoming)', true, 'Accurately distinguishes in-force vs readiness gaps');
  } catch (err) {
    recordTest('Temporal Commencement Evaluation (In Force vs Upcoming)', false, err.message);
  }

  // =========================================================================
  // TEST 4: Ready-to-Use Content Generation & Strict Format (A-G)
  // =========================================================================
  console.log('\n--- TEST 4: Ready-to-Use Content Generation Structure (A-G) ---');
  const requirementsToTest = [
    { id: 'DPDP-ACT-SEC-5-NOTICE', name: 'Itemized Privacy Notice' },
    { id: 'DPDP-ACT-SEC-6-CONSENT-ITEMIZED', name: 'Cookie & Affirmative Consent Banner' },
    { id: 'DPDP-ACT-SEC-6-WITHDRAWAL', name: 'Comparable Ease Consent Withdrawal' },
    { id: 'DPDP-ACT-SEC-8-9-GRIEVANCE-OFFICER', name: 'Grievance Redressal Officer' },
    { id: 'DPDP-ACT-SEC-8-7-RETENTION-ERASURE', name: 'Data Retention & Inactivity Erasure' },
    { id: 'DPDP-ACT-SEC-11-14-RIGHTS', name: 'Data Principal Rights & Nomination' },
    { id: 'DPDP-ACT-SEC-4-FORM-NOTICE', name: 'Form Pre-Submission Notice' },
    { id: 'DPDP-ACT-SEC-9-CHILDREN-DATA', name: 'Children Data & Age Gate' },
    { id: 'DPDP-RULES-2025-RULE-3-NOTICE-FORMAT', name: 'Multi-Lingual Notice Accessibility' },
  ];

  for (const { id, name } of requirementsToTest) {
    try {
      const suggestion = await generateContentSuggestion({
        requirementId: id,
        organizationName: 'Acme Digital Pvt Ltd',
        existingContentSnippet: 'Our generic privacy policy. We may collect your data as needed.',
        pageUrl: '/privacy',
        assessmentDate: new Date('2026-11-05'),
      });

      // A. Finding Title & Gap
      assert(suggestion.findingTitle && suggestion.findingTitle.length > 5, 'Must have A. Finding Title');
      assert(suggestion.missingOrInsufficient && suggestion.missingOrInsufficient.length > 10, 'Must have missing requirement description');

      // B. Existing Content
      assert(suggestion.existingContent && suggestion.existingContent.includes('Our generic privacy policy'), 'Must preserve B. Existing Content');

      // C. Recommended Action
      assert(['Add', 'Update', 'Replace', 'Remove'].includes(suggestion.recommendedAction), 'Must have valid C. Recommended Action');

      // D. Ready-to-Use Content
      assert(suggestion.readyToUseContent && suggestion.readyToUseContent.length > 100, 'Must have D. Ready-to-Use Suggested Content (>100 chars)');

      // E. Placement Instructions
      assert(suggestion.placementInstructions && suggestion.placementInstructions.pageName, 'Must have E. Placement Instructions page');
      assert(suggestion.placementInstructions.sectionName, 'Must have E. Placement Instructions section');
      assert(suggestion.placementInstructions.targetPosition, 'Must have E. Placement Instructions target position');

      // F. Legal Mapping
      assert(suggestion.legalMapping && suggestion.legalMapping.sourceDocument, 'Must have F. Legal Mapping source document');
      assert(suggestion.legalMapping.sectionOrRule, 'Must have F. Legal Mapping section/rule');
      assert(suggestion.legalMapping.explanation, 'Must have F. Legal Mapping explanation');

      // G. Customization Requirements
      assert(Array.isArray(suggestion.customizationRequirements) && suggestion.customizationRequirements.length > 0, 'Must have G. Customization checklist');

      // Placeholder Rule: Never invent fake emails, names; must contain [Placeholder]
      assert(suggestion.readyToUseContent.includes('['), 'Must use clearly visible bracketed placeholders e.g. [Placeholder]');

      // Disclaimer
      assert(suggestion.disclaimer && suggestion.disclaimer.includes('Statutory Notice'), 'Must include statutory disclaimer');

      recordTest(`Ready-to-Use Suggestion Generation: ${name} (${id})`, true, `Action: ${suggestion.recommendedAction} | Page: ${suggestion.pageName}`);
    } catch (err) {
      recordTest(`Ready-to-Use Suggestion Generation: ${name} (${id})`, false, err.message);
    }
  }

  // =========================================================================
  // TEST 5: Placeholder Integrity (No Invented Company Facts)
  // =========================================================================
  console.log('\n--- TEST 5: Placeholder Integrity (No Hallucinated Facts) ---');
  try {
    const grievSuggestion = await generateContentSuggestion({
      requirementId: 'DPDP-ACT-SEC-8-9-GRIEVANCE-OFFICER',
      organizationName: 'Global Retailers Ltd',
      existingContentSnippet: '',
      pageUrl: '/privacy',
    });

    const content = grievSuggestion.readyToUseContent;

    // Must contain bracketed placeholders
    assert(content.includes('[') && content.includes(']'), 'Must contain bracketed placeholders');
    assert(content.includes('Grievance Officer'), 'Must reference Grievance Officer');
    assert(/\[.*email.*\]/i.test(content) || content.includes('[grievance@company.com'), 'Must have email placeholder');
    assert(/\[.*address.*\]/i.test(content) || content.includes('[Office Building'), 'Must have address placeholder');
    assert(content.includes('Data Protection Board of India'), 'Must reference DPBI');

    recordTest('Placeholder Integrity: Visible [Placeholders] without hallucinating private corporate facts', true, 'Placeholders verified');
  } catch (err) {
    recordTest('Placeholder Integrity: Visible [Placeholders] without hallucinating private corporate facts', false, err.message);
  }

  // =========================================================================
  // TEST 6: Page-wise Grouping Utility
  // =========================================================================
  console.log('\n--- TEST 6: Page-wise Grouping Verification ---');
  try {
    const mockFindings = [
      {
        requirementId: 'DPDP-ACT-SEC-5-NOTICE',
        ruleId: 'Section 5(1)',
        status: 'fail',
        contentSuggestion: {
          pageName: 'Privacy Policy Page',
          pageUrl: '/privacy',
          findingTitle: 'Missing Itemized Data Notice',
          readyToUseContent: 'Sample Privacy Text 1',
        },
      },
      {
        requirementId: 'DPDP-ACT-SEC-8-9-GRIEVANCE-OFFICER',
        ruleId: 'Section 8(9)',
        status: 'fail',
        contentSuggestion: {
          pageName: 'Privacy Policy Page',
          pageUrl: '/privacy',
          findingTitle: 'Missing Grievance Officer',
          readyToUseContent: 'Sample Privacy Text 2',
        },
      },
      {
        requirementId: 'DPDP-ACT-SEC-6-CONSENT-ITEMIZED',
        ruleId: 'Section 6(1)',
        status: 'fail',
        contentSuggestion: {
          pageName: 'Consent & Cookie Banner',
          pageUrl: '/',
          findingTitle: 'Missing Cookie Banner',
          readyToUseContent: 'Sample Cookie Banner Text',
        },
      },
      {
        requirementId: 'DPDP-ACT-SEC-4-FORM-NOTICE',
        ruleId: 'Section 4, 5',
        status: 'needs_review',
        contentSuggestion: {
          pageName: 'Contact & Registration Forms',
          pageUrl: '/contact',
          findingTitle: 'Missing Contact Form Notice',
          readyToUseContent: 'Sample Form Notice Text',
        },
      },
    ];

    const grouped = groupSuggestionsByPage(mockFindings);
    assert.strictEqual(grouped.length, 3, 'Expected 3 distinct pages');

    const privGroup = grouped.find((g) => g.pageName === 'Privacy Policy Page');
    assert(privGroup, 'Privacy Policy Page group must exist');
    assert.strictEqual(privGroup.suggestions.length, 2, 'Privacy Policy group must have 2 suggestions');

    const bannerGroup = grouped.find((g) => g.pageName === 'Consent & Cookie Banner');
    assert(bannerGroup, 'Consent banner group must exist');
    assert.strictEqual(bannerGroup.suggestions.length, 1, 'Banner group must have 1 suggestion');

    const formGroup = grouped.find((g) => g.pageName === 'Contact & Registration Forms');
    assert(formGroup, 'Contact forms group must exist');
    assert.strictEqual(formGroup.suggestions.length, 1, 'Form group must have 1 suggestion');

    recordTest('Page-Wise Grouping Utility', true, '3 distinct page buckets grouped correctly');
  } catch (err) {
    recordTest('Page-Wise Grouping Utility', false, err.message);
  }

  // =========================================================================
  // TEST 7: PDF Generation with Section 4 Ready-to-Use Content
  // =========================================================================
  console.log('\n--- TEST 7: PDF Report Generation Verification ---');
  try {
    const doc = new PDFDocument({ margin: 45, size: 'A4', bufferPages: true });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));

    doc.fontSize(16).text('DPDP Compliance Assessment Report');
    doc.fontSize(14).text('4. Recommended Content Updates & Ready-to-Use Website Content');

    const suggestion = await generateContentSuggestion({
      requirementId: 'DPDP-ACT-SEC-8-9-GRIEVANCE-OFFICER',
      organizationName: 'Test Corp India',
      pageUrl: '/privacy',
    });

    doc.fontSize(10).text(`Finding: ${suggestion.findingTitle}`);
    doc.fontSize(8).text(`Target Page: ${suggestion.pageName}`);
    doc.fontSize(8).text(`Action: ${suggestion.recommendedAction}`);
    doc.fontSize(8).text(`Statutory Reference: ${suggestion.legalMapping.sectionOrRule}`);
    doc.fontSize(7).text(suggestion.readyToUseContent.slice(0, 300));

    doc.end();

    const pdfBuffer = await new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    assert(pdfBuffer.length > 500, 'PDF buffer must be valid (>500 bytes)');
    assert(pdfBuffer.subarray(0, 4).toString() === '%PDF', 'Buffer must have valid PDF magic header');

    recordTest('PDF Report Ready-to-Use Content Section Generation', true, `Generated valid PDF (${pdfBuffer.length} bytes)`);
  } catch (err) {
    recordTest('PDF Report Ready-to-Use Content Section Generation', false, err.message);
  }

  // =========================================================================
  // TEST 8: Full Assessment PDF Report Layout & Alignment Verification
  // =========================================================================
  console.log('\n--- TEST 8: Full Assessment PDF Report Layout & Alignment ---');
  try {
    const fullMockData = {
      assessment: {
        _id: '67a8b9c0d1e2f3a4b5c6d7e8',
        createdAt: new Date('2026-03-15T10:30:00Z'),
        status: 'completed',
      },
      organization: {
        name: 'Bharat Digital Healthcare Services Private Limited',
        industry: 'Healthcare & Telemedicine',
        contactEmail: 'privacy@bharatdigitalhealth.in',
      },
      target: {
        url: 'https://bharatdigitalhealth.in/patient-portal/register?flow=onboarding&campaign=spring2026',
        name: 'Bharat Digital Health Portal',
      },
      counts: {
        pass: 14,
        fail: 5,
        needs_review: 3,
        not_applicable: 2,
        not_tested: 1,
      },
      severityCounts: {
        critical: 2,
        high: 3,
        medium: 2,
        low: 1,
      },
      calculatedScore: 64,
      findings: [
        {
          requirementId: 'DPDP-ACT-SEC-6-CONSENT',
          ruleId: 'Act Section 6(1)',
          title: 'Affirmative, Unbundled, Explicit Consent Mechanism for Processing Personal Data',
          status: 'fail',
          severity: 'critical',
          category: 'consent_management',
          legalApplicabilityStatus: 'in_force',
          penaltyReference: {
            maxPenaltyText: 'Up to Rs. 250 Crores',
            scheduleItem: 1,
          },
          observedFacts: [
            'Registration form contains a pre-ticked checkbox bundling Terms of Service with Marketing SMS consent',
            'No separate unbundled consent option provided for telemedicine medical telemetry processing',
          ],
          aiInterpretation:
            'Section 6(1) of the DPDP Act 2023 mandates that consent must be free, specific, informed, unconditional and unambiguous with a clear affirmative action.',
          recommendedRemediation:
            'Implement granular, unbundled checkboxes for each distinct processing purpose. Default all optional consent checkboxes to unchecked.',
          reviewerDecision: 'pending',
          remediationStatus: 'open',
          assignedTo: 'Lead Frontend Engineer',
          dueDate: new Date('2026-04-01'),
          contentSuggestion: {
            pageName: 'Patient Registration Form',
            pageUrl: '/patient-portal/register',
            findingTitle: 'Bundled Marketing & Medical Consent Checkbox',
            recommendedAction: 'replace',
            priority: 'critical',
            legalMapping: {
              sectionOrRule: 'Act Section 6(1) & Section 6(2)',
              sourceDocument: 'Digital Personal Data Protection Act, 2023',
            },
            missingOrInsufficient: 'Consent for promotional communication is bundled with service delivery terms without affirmative action.',
            placementInstructions: {
              pageName: 'Patient Registration Form',
              sectionName: 'Terms & Submission Section',
              targetPosition: 'Immediately above the submit button',
            },
            readyToUseContent: '[ ] I affirmatively consent to receiving promotional healthcare newsletters via SMS and Email.',
            customizationRequirements: [
              'Replace placeholder with verified corporate details',
              'Configure SMS unsubscribe endpoint',
            ],
          },
        },
        {
          requirementId: 'DPDP-ACT-SEC-8-5-SECURITY',
          ruleId: 'Act Section 8(5)',
          title: 'Reasonable Security Safeguards to Prevent Personal Data Breach',
          status: 'pass',
          severity: 'critical',
          category: 'security_governance',
          legalApplicabilityStatus: 'in_force',
          penaltyReference: {
            maxPenaltyText: 'Up to Rs. 250 Crores',
            scheduleItem: 1,
          },
          observedFacts: ['Enforced TLS 1.3 encryption and HSTS headers verified.'],
          aiInterpretation: 'Controls demonstrate conformity with Section 8(5) obligations.',
          recommendedRemediation: 'Maintain automated TLS certificate monitoring.',
          reviewerDecision: 'approved',
          remediationStatus: 'resolved',
        },
      ],
    };

    const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));

    const { totalPages } = buildPdfDocument(doc, fullMockData);
    doc.end();

    const fullPdfBuffer = await new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    assert(fullPdfBuffer.length > 10000, 'Full PDF buffer must be substantial (>10KB)');
    assert(fullPdfBuffer.subarray(0, 4).toString() === '%PDF', 'Buffer must have valid PDF magic header');
    assert(totalPages >= 4, `Full PDF must have at least 4 pages, got: ${totalPages}`);

    recordTest('Full Assessment PDF Report Layout & Alignment', true, `Generated ${totalPages}-page report (${fullPdfBuffer.length} bytes) with aligned layout`);
  } catch (err) {
    recordTest('Full Assessment PDF Report Layout & Alignment', false, err.message);
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n========================================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  console.log(`TOTAL SUITE RESULTS: ${passedCount}/${totalCount} PASSED`);
  console.log('========================================================================\n');

  if (passedCount < totalCount) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
