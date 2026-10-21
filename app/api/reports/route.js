import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb.js';
import Assessment from '../../../models/Assessment.js';
import Organization from '../../../models/Organization.js';
import Finding from '../../../models/Finding.js';
import ScenarioResult from '../../../models/ScenarioResult.js';
import { requireAuth, ROLES } from '../../../lib/auth.js';
import { generatePdfReport, generateExcelReport } from '../../../lib/report-generator.js';
import { evaluateAssessmentFindings } from '../../../lib/assessment-engine.js';
import { getAssessmentSummary, getAssessmentSummaries } from '../../../lib/assessment-summary.js';

export const dynamic = 'force-dynamic';

/**
 * GET /api/reports
 * Generates and streams PDF / Excel reports or lists standardized assessment summaries.
 */
export async function GET(request) {
  try {
    const { session, errorResponse } = requireAuth(request);
    if (errorResponse) return errorResponse;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');
    const format = searchParams.get('format')?.toLowerCase();

    const isPlatformAdmin = session.role === 'admin' || session.role === ROLES.PLATFORM_ADMINISTRATOR;

    // 1. Binary PDF or Excel Download
    if (assessmentId && (format === 'pdf' || format === 'excel')) {
      const targetAssessment = await Assessment.findById(assessmentId);
      if (!targetAssessment) {
        return NextResponse.json({ success: false, error: 'Assessment not found' }, { status: 404 });
      }

      if (
        !isPlatformAdmin &&
        session.organizationId &&
        String(targetAssessment.organization) !== String(session.organizationId)
      ) {
        return NextResponse.json(
          { success: false, error: 'Forbidden. You do not have access to this organization report.' },
          { status: 403 }
        );
      }

      // Ensure findings exist for this assessment; if not, trigger evaluation
      const existingFindings = await Finding.countDocuments({ assessment: assessmentId });
      if (existingFindings === 0 && targetAssessment.status === 'completed') {
        await evaluateAssessmentFindings(assessmentId);
      }

      if (format === 'pdf') {
        const pdfBuffer = await generatePdfReport(assessmentId);
        return new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="DPDP-Assessment-Report-${assessmentId.slice(-6)}.pdf"`,
            'Content-Length': String(pdfBuffer.length),
          },
        });
      }

      if (format === 'excel') {
        const excelBuffer = await generateExcelReport(assessmentId);
        return new NextResponse(excelBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="DPDP-Assessment-Report-${assessmentId.slice(-6)}.xlsx"`,
            'Content-Length': String(excelBuffer.length),
          },
        });
      }
    }

    // 2. Specific Assessment Report Metadata
    if (assessmentId) {
      const assessment = await Assessment.findById(assessmentId)
        .populate('organization', 'name industry type dpoName dpoEmail');

      if (!assessment) {
        return NextResponse.json({ success: false, error: 'Assessment not found' }, { status: 404 });
      }

      if (
        !isPlatformAdmin &&
        session.organizationId &&
        String(assessment.organization?._id || assessment.organization) !== String(session.organizationId)
      ) {
        return NextResponse.json(
          { success: false, error: 'Forbidden. You do not have access to this organization report.' },
          { status: 403 }
        );
      }

      let findings = await Finding.find({ assessment: assessmentId }).sort({ createdAt: 1 });
      if (findings.length === 0 && assessment.status === 'completed') {
        const evalResult = await evaluateAssessmentFindings(assessmentId);
        findings = evalResult.findings;
      }

      const rawScenarios = await ScenarioResult.find({ assessmentId })
        .populate('evidenceIds')
        .sort({ createdAt: 1 })
        .lean();

      const SCENARIO_METADATA = {
        notice_and_consent: {
          sectionRef: 'Section 5(1), 6(1)',
          rulesRef: 'Rule 3 (2025)',
          penaltyCap: 'Up to ₹250 Cr',
          penaltyText: 'Statutory Cap: Up to ₹250 Cr (Schedule Item 2)',
          remediation: 'Deploy an affirmative, prominent cookie consent notice with clear Accept and Reject options before any tracking or analytics cookies are set.',
          legalStatus: 'in_force',
        },
        privacy_notice_compliance: {
          sectionRef: 'Section 5',
          rulesRef: 'Rule 3 & 4 (2025)',
          penaltyCap: 'Up to ₹50 Cr',
          penaltyText: 'Statutory Cap: Up to ₹50 Cr (Schedule Item 3)',
          remediation: 'Publish an itemized privacy notice declaring Data Fiduciary identity, itemized data collection categories, specific purpose specifications, retention periods, user rights, and Grievance Officer details.',
          legalStatus: 'in_force',
        },
        grievance_mechanism_sec_8_9: {
          sectionRef: 'Section 8(9)',
          rulesRef: 'Rule 8 (2025)',
          penaltyCap: 'Up to ₹50 Cr',
          penaltyText: 'Statutory Cap: Up to ₹50 Cr (Schedule Item 3)',
          remediation: 'Prominently publish the designated Grievance Officer name, official email, physical address, and statutory turnaround SLA (30-day escalation timeline) with DPBI appeal information.',
          legalStatus: 'in_force',
        },
        data_minimization_and_notice: {
          sectionRef: 'Section 4, 6(1)',
          rulesRef: 'Rule 3 (2025)',
          penaltyCap: 'Up to ₹50 Cr',
          penaltyText: 'Statutory Cap: Up to ₹50 Cr (Schedule Item 3)',
          remediation: 'Place purpose-specific consent notices and opt-in checkboxes directly adjacent to interactive form submission buttons.',
          legalStatus: 'in_force',
        },
        consent_granularity_and_withdrawal: {
          sectionRef: 'Section 6(4)',
          rulesRef: 'Rule 5 (2025)',
          penaltyCap: 'Up to ₹50 Cr',
          penaltyText: 'Statutory Cap: Up to ₹50 Cr (Schedule Item 3)',
          remediation: 'Provide granular category consent toggles and a persistent, 1-click cookie preference/consent withdrawal center across all pages.',
          legalStatus: 'in_force',
        },
        authorized_login_safeguards: {
          sectionRef: 'Section 8(5)',
          rulesRef: 'Rule 6 (2025)',
          penaltyCap: 'Up to ₹250 Cr',
          penaltyText: 'Statutory Cap: Up to ₹250 Cr (Schedule Item 1)',
          remediation: 'Enforce HTTPS encryption, credential masking in password fields, and strict session isolation across authenticated user pathways.',
          legalStatus: 'in_force',
        },
      };

      const scenarios = rawScenarios.map((sc) => {
        const meta = SCENARIO_METADATA[sc.scenarioId] || {};
        const firstEvidence = Array.isArray(sc.evidenceIds) && sc.evidenceIds.length > 0 ? sc.evidenceIds[0] : null;
        const screenshotUrl = firstEvidence?.screenshotPath || firstEvidence?.metadata?.cloudinaryUrl || firstEvidence?.metadata?.localUrlPath || null;
        return {
          ...sc,
          sectionReference: meta.sectionRef || sc.dpdpReference || 'DPDP Act, 2023',
          rulesReference: meta.rulesRef || 'DPDP Rules, 2025',
          penaltyCap: meta.penaltyCap || 'Up to ₹50 Cr',
          penaltyText: meta.penaltyText || 'Statutory Cap: Up to ₹50 Cr',
          recommendedRemediation: meta.remediation || 'Align website disclosures with statutory DPDP requirements.',
          legalApplicabilityStatus: sc.legalApplicabilityStatus || meta.legalStatus || 'in_force',
          effectiveDate: '2023-08-11',
          officialSource: 'Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025',
          screenshotUrl,
          pageUrl: firstEvidence?.pageUrl || assessment.targetUrl || '',
        };
      });

      const scenarioCounts = {
        total: scenarios.length,
        pass: scenarios.filter((s) => s.status === 'passed' || s.status === 'compliant').length,
        fail: scenarios.filter((s) => s.status === 'failed' || s.status === 'action_needed').length,
        needs_review: scenarios.filter((s) => s.status === 'needs_review').length,
        excluded: scenarios.filter((s) => ['skipped', 'not_applicable', 'not_tested'].includes(s.status)).length,
      };

      const summary = await getAssessmentSummary(assessment);

      return NextResponse.json({
        success: true,
        report: {
          ...summary,
          assessment,
          organization: assessment.organization,
          target: { url: summary.targetUrl, name: summary.websiteName },
          findings,
          scenarios,
          scenarioCounts,
          isFinal: assessment.status === 'completed',
        },
      });
    }

    // 3. List all assessments available for reporting (One Source of Truth)
    const query = (!isPlatformAdmin && session.organizationId) ? { organization: session.organizationId } : {};
    const reportsList = await getAssessmentSummaries(query);

    return NextResponse.json({
      success: true,
      reports: reportsList,
    });
  } catch (err) {
    console.error('Error in reports route:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
