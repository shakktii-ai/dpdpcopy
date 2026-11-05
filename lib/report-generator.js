import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import connectDB from './mongodb.js';
import Assessment from '../models/Assessment.js';
import Organization from '../models/Organization.js';
import Finding from '../models/Finding.js';
import LegalRequirement from '../models/LegalRequirement.js';
import ScenarioResult from '../models/ScenarioResult.js';
import Evidence from '../models/Evidence.js';
import { computeAssessmentSummary } from './assessment-summary.js';

/**
 * Loads all related assessment data for reporting.
 */
async function loadReportData(assessmentId) {
  await connectDB();

  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) {
    throw new Error(`Assessment not found: ${assessmentId}`);
  }

  const organization = await Organization.findById(assessment.organization);
  const findings = await Finding.find({ assessment: assessment._id }).sort({
    createdAt: 1,
  });

  const legalRequirements = await LegalRequirement.find().lean();
  const reqMap = new Map(legalRequirements.map((r) => [r.requirementId, r]));

  const scenarioResults = await ScenarioResult.find({ assessmentId: assessment._id });
  const evidenceList = await Evidence.find({ assessmentId: assessment._id });

  // Use authoritative shared assessment summary
  const summary = computeAssessmentSummary({
    assessment,
    findings,
    scenarioResults,
    evidenceCount: evidenceList.length,
  });

  return {
    assessment,
    organization: organization || { name: 'Unassigned Organization', industry: 'General', contactEmail: '' },
    target: { url: summary.targetUrl || 'N/A', name: summary.websiteName || 'Evaluated Asset' },
    findings,
    reqMap,
    scenarioResults,
    evidenceList,
    counts: summary.counts || { pass: 0, fail: 0, needs_review: 0, not_applicable: 0, not_tested: 0 },
    severityCounts: summary.severityCounts || { critical: 0, high: 0, medium: 0, low: 0 },
    calculatedScore: summary.complianceScore !== null ? summary.complianceScore : 0,
    scoreDisplay: summary.scoreDisplay,
    totalFindings: findings.length,
  };
}

/**
 * Renders the full statutory compliance assessment into a PDFDocument instance.
 * Separated to allow direct, deterministic testing with any fixture dataset.
 *
 * @param {PDFKit.PDFDocument} doc
 * @param {Object} data
 */
export function buildPdfDocument(doc, data) {
  const { assessment, organization, target, findings, counts, severityCounts, calculatedScore } = data;

  const primaryColor = '#0f172a'; // slate-900
  const accentCyan = '#0284c7';   // sky-600
  const successColor = '#16a34a'; // green-600
  const dangerColor = '#dc2626';  // red-600
  const warningColor = '#d97706'; // amber-600
  const neutralMuted = '#64748b'; // slate-500

  const orgName = organization?.name || 'Unassigned Organization';
  const orgIndustry = organization?.industry || 'Technology / Digital Services';
  const targetUrl = target?.url || 'N/A';
  const totalFindingsCount = findings.length || 1;

  function renderPageHeader(title) {
    doc.rect(40, 36, 515, 3).fill(accentCyan);
    doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor);
    doc.text(title, 40, 46, { width: 515 });
    doc.y = 70;
  }

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  doc.rect(0, 0, doc.page.width, 10).fill(accentCyan);
  doc.rect(0, 10, doc.page.width, 90).fill(primaryColor);
  doc.rect(0, 100, doc.page.width, 2).fill('#38bdf8');

  // Badge on top right
  doc.roundedRect(415, 26, 140, 18, 4).fill('#1e293b').stroke(accentCyan);
  doc.fillColor('#38bdf8').fontSize(8).font('Helvetica-Bold');
  doc.text('STATUTORY AUDIT REPORT', 415, 30, { align: 'center', width: 140 });

  doc.fillColor('#ffffff').fontSize(19).font('Helvetica-Bold');
  doc.text('DPDP COMPLIANCE ASSESSMENT REPORT', 40, 30, { width: 365 });
  doc.fontSize(8.5).font('Helvetica').fillColor('#94a3b8');
  doc.text('Statutory Audit under Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025', 40, 68, { width: 515 });

  // 1. Profile Box
  const profileY = 116;
  const profileRows = [
    { label: 'Organization Name:', value: orgName },
    { label: 'Industry / Sector:', value: orgIndustry },
    { label: 'Target Asset URL:', value: targetUrl },
    { label: 'Assessment ID:', value: String(assessment._id || 'N/A') },
    { label: 'Assessment Date:', value: new Date(assessment.createdAt || Date.now()).toLocaleDateString('en-IN', { dateStyle: 'long' }) },
    { label: 'Evaluation Engine:', value: 'Playwright DOM Sandbox & Gemini Multi-Modal Agent' },
    { label: 'Statutory Baseline:', value: 'Ministry of Electronics and Information Technology (MeitY) Official Gazettes' },
  ];

  let calculatedProfileHeight = 32;
  for (const r of profileRows) {
    const vHeight = doc.heightOfString(r.value, { width: 355, size: 8.5 });
    calculatedProfileHeight += Math.max(14, vHeight) + 4;
  }

  doc.roundedRect(40, profileY, 515, calculatedProfileHeight, 6).fill('#f8fafc').stroke('#cbd5e1');
  doc.fontSize(10).font('Helvetica-Bold').fillColor(primaryColor);
  doc.text('ASSESSMENT PROFILE & TARGET SCOPE', 52, profileY + 12);
  doc.rect(52, profileY + 26, 490, 0.5).fill('#e2e8f0');

  let curProfY = profileY + 34;
  for (const r of profileRows) {
    const vHeight = doc.heightOfString(r.value, { width: 355, size: 8.5 });
    const rowH = Math.max(14, vHeight);
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#475569').text(r.label, 52, curProfY, { width: 125 });
    doc.font('Helvetica').fontSize(8.5).fillColor(primaryColor).text(r.value, 182, curProfY, { width: 355 });
    curProfY += rowH + 4;
  }

  // 2. Score Card
  const scoreTop = profileY + calculatedProfileHeight + 12;
  const scoreHeight = 90;
  const scoreColor = calculatedScore >= 70 ? successColor : dangerColor;
  doc.roundedRect(40, scoreTop, 515, scoreHeight, 6).fill('#ffffff').stroke('#e2e8f0');
  doc.rect(40, scoreTop, 4, scoreHeight).fill(scoreColor);

  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(primaryColor);
  doc.text('STATUTORY COMPLIANCE INDEX', 52, scoreTop + 10);

  doc.fontSize(36).font('Helvetica-Bold').fillColor(scoreColor);
  doc.text(`${calculatedScore}%`, 52, scoreTop + 26);

  const scoreLabel = calculatedScore >= 70 ? 'SATISFACTORY COMPLIANCE BASELINE' : 'SUBSTANTIAL COMPLIANCE GAPS IDENTIFIED';
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(scoreColor);
  doc.text(scoreLabel, 165, scoreTop + 28);

  doc.fontSize(8).font('Helvetica').fillColor(neutralMuted);
  doc.text(
    `Evaluated across ${findings.length} statutory checkpoints under the DPDP Act 2023 & DPDP Rules 2025.`,
    165,
    scoreTop + 44,
    { width: 375 }
  );

  // 4 Horizontal Pills
  const pills = [
    { label: `Pass: ${counts.pass || 0}`, bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', x: 165, w: 85 },
    { label: `Fail: ${counts.fail || 0}`, bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', x: 258, w: 85 },
    { label: `Review: ${counts.needs_review || 0}`, bg: '#fffbeb', border: '#fde68a', text: '#b45309', x: 351, w: 92 },
    { label: `N/A: ${counts.not_applicable || 0}`, bg: '#f8fafc', border: '#e2e8f0', text: '#64748b', x: 451, w: 85 },
  ];
  for (const p of pills) {
    doc.roundedRect(p.x, scoreTop + 62, p.w, 18, 4).fill(p.bg).stroke(p.border);
    doc.fillColor(p.text).font('Helvetica-Bold').fontSize(8);
    doc.text(p.label, p.x, scoreTop + 66, { align: 'center', width: p.w });
  }

  // 3. Risk & Liability Summary Box
  const riskTop = scoreTop + scoreHeight + 12;
  const riskHeight = 82;
  doc.roundedRect(40, riskTop, 515, riskHeight, 6).fill('#f8fafc').stroke('#e2e8f0');

  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(primaryColor);
  doc.text('REGULATORY LIABILITY & RISK EXPOSURE (THE SCHEDULE)', 52, riskTop + 10);
  doc.rect(52, riskTop + 24, 490, 0.5).fill('#e2e8f0');

  // Col 1: Max Penalty
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(neutralMuted).text('Statutory Penalty Cap', 52, riskTop + 30);
  doc.font('Helvetica-Bold').fontSize(14).fillColor('#b91c1c').text('Rs. 250 Crores', 52, riskTop + 42);
  doc.font('Helvetica').fontSize(7).fillColor(neutralMuted).text('Max under Item 1 of Schedule', 52, riskTop + 60);

  // Col 2: Priority Remediations
  const highGaps = (severityCounts.critical || 0) + (severityCounts.high || 0);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(neutralMuted).text('High / Critical Findings', 225, riskTop + 30);
  doc.font('Helvetica-Bold').fontSize(14).fillColor('#d97706').text(`${highGaps} Provisions`, 225, riskTop + 42);
  doc.font('Helvetica').fontSize(7).fillColor(neutralMuted).text('Requiring immediate remediation', 225, riskTop + 60);

  // Col 3: Enforcement Authority
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(neutralMuted).text('Enforcement Authority', 395, riskTop + 30);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(primaryColor).text('DPBI', 395, riskTop + 42);
  doc.font('Helvetica').fontSize(7).fillColor(neutralMuted).text('Data Protection Board of India', 395, riskTop + 60);

  // 4. Statutory Disclaimer Box
  const discTop = riskTop + riskHeight + 12;
  const discHeight = 82;
  doc.roundedRect(40, discTop, 515, discHeight, 6).fill('#fffbeb').stroke('#fde68a');
  doc.rect(40, discTop, 4, discHeight).fill('#d97706');

  doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#92400e');
  doc.text('REGULATORY NOTICE & ASSESSMENT AID DISCLAIMER', 52, discTop + 10);

  doc.fontSize(7.5).font('Helvetica').fillColor('#78350f').lineGap(2);
  doc.text(
    'This assessment report is an automated diagnostic aid designed to support Data Fiduciaries in evaluating website readiness against the Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025. This document DOES NOT constitute government certification, legal representation, or a statutory guarantee of immunity from regulatory enforcement by the Data Protection Board of India (DPBI). Technical observations are empirical and limited to client-side automated inspection.',
    52,
    discTop + 24,
    { width: 490 }
  );

  // 5. Custody / Methodology note on cover
  const noteTop = discTop + discHeight + 14;
  doc.roundedRect(40, noteTop, 515, 54, 6).fill('#f1f5f9').stroke('#e2e8f0');
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor(primaryColor);
  doc.text('AUDIT TRAIL & METHODOLOGY ASSURANCE', 52, noteTop + 8);
  doc.fontSize(7).font('Helvetica').fillColor('#475569').lineGap(1.5);
  doc.text('• Primary Legal Base: Gazette of India DPDP Act 2023 (Act No. 22 of 2023) & DPDP Rules 2025 (G.S.R. MeitY).', 52, noteTop + 22, { width: 490 });
  doc.text('• Statutory Phasing: Commencement dates strictly evaluated under DPDP Rules 2025 Rule 1(2). Future rules marked Upcoming.', 52, noteTop + 33, { width: 490 });

  // ==========================================
  // PAGE 2: EXECUTIVE SUMMARY & METHODOLOGY
  // ==========================================
  doc.addPage();
  renderPageHeader('1. Executive Summary & Audit Methodology');

  doc.fontSize(8.5).font('Helvetica').fillColor('#334155').lineGap(2.5);
  doc.text(
    `On ${new Date(assessment.createdAt || Date.now()).toLocaleDateString()}, an evidence-based statutory DPDP evaluation was executed against ${targetUrl}. The testing pipeline engaged automated browser sandboxes (Playwright Chromium) and Gemini multi-modal analytical interpretation to verify statutory disclosures, affirmative consent mechanisms, grievance redressal pathways, and credential safeguards.`
  );
  doc.moveDown(0.8);

  // 1.1 Breakdown Table
  doc.fontSize(10.5).font('Helvetica-Bold').fillColor(primaryColor);
  doc.text('1.1 Statutory Checkpoint Evaluation Breakdown');
  doc.moveDown(0.4);

  const tableHeaders = ['Evaluation Status', 'Count', 'Percentage', 'Statutory Interpretation & Implication'];
  const tableRows = [
    { status: 'Passed', count: counts.pass || 0, pct: `${Math.round(((counts.pass || 0) / totalFindingsCount) * 100)}%`, desc: 'Compliant technical and disclosure controls verified active on web asset.', bg: '#f0fdf4', badge: '#15803d' },
    { status: 'Failed', count: counts.fail || 0, pct: `${Math.round(((counts.fail || 0) / totalFindingsCount) * 100)}%`, desc: 'Statutory non-conformity detected; exposes fiduciary to potential regulatory inquiry.', bg: '#fef2f2', badge: '#b91c1c' },
    { status: 'Needs Review', count: counts.needs_review || 0, pct: `${Math.round(((counts.needs_review || 0) / totalFindingsCount) * 100)}%`, desc: 'Ambiguous wording or dynamic workflow requiring human legal/compliance verification.', bg: '#fffbeb', badge: '#b45309' },
    { status: 'Not Applicable', count: counts.not_applicable || 0, pct: `${Math.round(((counts.not_applicable || 0) / totalFindingsCount) * 100)}%`, desc: 'Trigger condition not present on evaluated interface (e.g. child processing, biometrics).', bg: '#f8fafc', badge: '#64748b' },
    { status: 'Not Tested', count: counts.not_tested || 0, pct: `${Math.round(((counts.not_tested || 0) / totalFindingsCount) * 100)}%`, desc: 'Requires offline corporate evidence (e.g. formal DPO appointment, vendor contracts).', bg: '#f8fafc', badge: '#64748b' },
  ];

  let tableY = doc.y;
  // Header row
  doc.rect(40, tableY, 515, 20).fill(primaryColor);
  doc.fontSize(8).font('Helvetica-Bold').fillColor('#ffffff');
  doc.text(tableHeaders[0], 48, tableY + 5, { width: 105 });
  doc.text(tableHeaders[1], 155, tableY + 5, { width: 50, align: 'center' });
  doc.text(tableHeaders[2], 210, tableY + 5, { width: 65, align: 'center' });
  doc.text(tableHeaders[3], 285, tableY + 5, { width: 260 });
  tableY += 20;

  for (let i = 0; i < tableRows.length; i++) {
    const row = tableRows[i];
    const descHeight = doc.heightOfString(row.desc, { width: 255, size: 7.5 });
    const rowHeight = Math.max(20, descHeight + 8);

    doc.rect(40, tableY, 515, rowHeight).fill(i % 2 === 0 ? '#ffffff' : '#f8fafc').stroke('#e2e8f0');

    // Status pill
    doc.roundedRect(48, tableY + (rowHeight - 14) / 2, 90, 14, 3).fill(row.bg);
    doc.fillColor(row.badge).font('Helvetica-Bold').fontSize(7.5);
    doc.text(row.status, 48, tableY + (rowHeight - 14) / 2 + 3, { width: 90, align: 'center' });

    // Count & Pct
    doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(8);
    doc.text(String(row.count), 155, tableY + (rowHeight - 10) / 2, { width: 50, align: 'center' });
    doc.text(row.pct, 210, tableY + (rowHeight - 10) / 2, { width: 65, align: 'center' });

    // Description
    doc.font('Helvetica').fontSize(7.5).fillColor('#334155');
    doc.text(row.desc, 285, tableY + 4, { width: 255 });

    tableY += rowHeight;
  }

  doc.y = tableY + 16;

  // 1.2 Assessment Methodology & Evidence Standards
  doc.fontSize(10.5).font('Helvetica-Bold').fillColor(primaryColor);
  doc.text('1.2 Assessment Methodology & Evidence Standards');
  doc.moveDown(0.4);

  const methodologyPoints = [
    { title: 'Deterministic DOM Verification:', desc: 'Direct element selectors, form actions, encryption cipher verification, and cookie flags.' },
    { title: 'Empirical Evidence Isolation:', desc: 'Technical website observations are strictly recorded separately from AI statutory interpretations.' },
    { title: 'Gemini Multi-Modal Interpretation:', desc: 'Evaluates transparency, dark pattern absence, and multi-lingual accessibility without fabricating facts.' },
    { title: 'Non-Assumption Principle:', desc: 'Absence of evidence is NEVER marked as compliant (categorized as Needs Review or Failed).' },
    { title: 'Enforceability Phasing:', desc: 'Provisions are categorized based on official gazetted commencement dates under DPDP Rules 2025.' },
  ];

  for (const mp of methodologyPoints) {
    doc.font('Helvetica-Bold').fontSize(8).fillColor(primaryColor).text(`• ${mp.title} `, 45, doc.y, { continued: true });
    doc.font('Helvetica').fontSize(8).fillColor('#334155').text(mp.desc);
    doc.moveDown(0.2);
  }

  doc.moveDown(0.6);

  // 1.3 Legal Reference Base & Phasing
  doc.fontSize(10.5).font('Helvetica-Bold').fillColor(primaryColor);
  doc.text('1.3 Legal Reference Base & Commencement Temporal Status');
  doc.moveDown(0.4);

  const phaseBoxY = doc.y;
  doc.roundedRect(40, phaseBoxY, 515, 68, 6).fill('#f1f5f9').stroke('#cbd5e1');
  doc.fontSize(8).font('Helvetica-Bold').fillColor(primaryColor);
  doc.text('STATUTORY PHASING SCHEDULE (DPDP RULES, 2025 RULE 1)', 52, phaseBoxY + 8);
  doc.fontSize(7.5).font('Helvetica').fillColor('#334155').lineGap(2);
  doc.text('• Phase 1 (Immediate - 13 Nov 2025): Rules 1, 2, 17–21 in force upon gazette publication.', 52, phaseBoxY + 22);
  doc.text('• Phase 2 (12 Months - 13 Nov 2026): Rule 4 (Consent architecture, notices & withdrawal mechanisms).', 52, phaseBoxY + 34);
  doc.text('• Phase 3 (18 Months - 13 May 2027): Rules 3, 5–16, 22, 23 (Multi-lingual notice, SAR, grievance timelines) — Classified as Upcoming Readiness Gaps.', 52, phaseBoxY + 46, { width: 490 });

  doc.y = phaseBoxY + 80;

  // ==========================================
  // PAGE 3: DETAILED STATUTORY FINDINGS
  // ==========================================
  doc.addPage();
  renderPageHeader('2. Detailed Statutory Findings & Traceable Evidence');

  for (let i = 0; i < findings.length; i++) {
    const f = findings[i];

    const titleStr = `${f.requirementId} — ${f.ruleId}: ${f.title}`;
    const hTitle = Math.max(14, doc.heightOfString(titleStr, { width: 375, size: 9.5 }));

    const factsStr = (f.observedFacts && f.observedFacts.length > 0)
      ? f.observedFacts.map((s, idx) => `${idx + 1}. ${s}`).join('\n')
      : 'No empirical observed facts recorded.';
    const hFacts = Math.max(12, doc.heightOfString(factsStr, { width: 368, size: 8, lineGap: 1.5 }));

    const interpStr = f.aiInterpretation || f.explanation || 'Statutory evaluation based on client-side interface analysis.';
    const hInterp = Math.max(12, doc.heightOfString(interpStr, { width: 368, size: 8, lineGap: 1.5 }));

    const remStr = f.recommendedRemediation || 'No immediate corrective action required.';
    const hRem = Math.max(12, doc.heightOfString(remStr, { width: 368, size: 8, lineGap: 1.5 }));

    const metaHeight = 16;
    const auditHeight = 12;

    const totalCardHeight =
      10 + // top pad
      Math.max(hTitle, 18) +
      6 +  // gap
      metaHeight +
      6 +  // gap
      (hFacts + 4) +
      6 +  // gap
      (hInterp + 4) +
      6 +  // gap
      (hRem + 4) +
      8 +  // gap
      auditHeight +
      10;  // bottom pad

    // Check page break BEFORE drawing
    if (doc.y + totalCardHeight > 780) {
      doc.addPage();
      renderPageHeader('2. Detailed Statutory Findings & Traceable Evidence (Cont.)');
    }

    const cardTop = doc.y;

    const statusColors =
      f.status === 'pass'
        ? { bg: '#f0fdf4', border: '#bbf7d0', accent: successColor, badgeBg: '#dcfce7', badgeText: '#15803d' }
        : f.status === 'fail'
        ? { bg: '#fef2f2', border: '#fecaca', accent: dangerColor, badgeBg: '#fee2e2', badgeText: '#b91c1c' }
        : f.status === 'needs_review'
        ? { bg: '#fffbeb', border: '#fde68a', accent: warningColor, badgeBg: '#fef3c7', badgeText: '#b45309' }
        : { bg: '#f8fafc', border: '#e2e8f0', accent: neutralMuted, badgeBg: '#f1f5f9', badgeText: '#475569' };

    doc.roundedRect(40, cardTop, 515, totalCardHeight, 5).fill(statusColors.bg).stroke(statusColors.border);
    doc.rect(40, cardTop, 4, totalCardHeight).fill(statusColors.accent);

    // Title and Status Badge
    doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(9.5);
    doc.text(titleStr, 52, cardTop + 10, { width: 375 });

    doc.roundedRect(435, cardTop + 9, 110, 18, 3).fill(statusColors.badgeBg).stroke(statusColors.border);
    doc.fillColor(statusColors.badgeText).font('Helvetica-Bold').fontSize(8);
    doc.text(f.status.toUpperCase().replace(/_/g, ' '), 435, cardTop + 13, { align: 'center', width: 110 });

    let currY = cardTop + 10 + Math.max(hTitle, 18) + 6;

    // Meta chips row
    const applicabilityStr = f.legalApplicabilityStatus ? `  |  Status: ${f.legalApplicabilityStatus.toUpperCase()}` : '';
    const penaltyStr = f.penaltyReference?.maxPenaltyText ? `  |  Cap: ${f.penaltyReference.maxPenaltyText}` : '';
    doc.fillColor(neutralMuted).font('Helvetica').fontSize(7.5).text('Severity: ', 52, currY, { continued: true });
    doc.font('Helvetica-Bold').fillColor(f.severity === 'critical' ? dangerColor : f.severity === 'high' ? warningColor : '#475569').text(f.severity.toUpperCase(), { continued: true });
    doc.font('Helvetica').fillColor(neutralMuted).text(`  |  Category: ${f.category}${applicabilityStr}${penaltyStr}`);
    currY += metaHeight;

    // Row 1: Observed Facts
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#334155').text('Observed Facts:', 52, currY, { width: 112 });
    doc.font('Helvetica').fontSize(8).fillColor('#1e293b').text(factsStr, 168, currY, { width: 368, lineGap: 1.5 });
    currY += hFacts + 6;

    // Row 2: AI Interpretation
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#334155').text('AI Interpretation:', 52, currY, { width: 112 });
    doc.font('Helvetica').fontSize(8).fillColor('#1e293b').text(interpStr, 168, currY, { width: 368, lineGap: 1.5 });
    currY += hInterp + 6;

    // Row 3: Recommended Action
    doc.font('Helvetica-Bold').fontSize(8).fillColor(accentCyan).text('Recommended Action:', 52, currY, { width: 112 });
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#0369a1').text(remStr, 168, currY, { width: 368, lineGap: 1.5 });
    currY += hRem + 6;

    // Divider
    doc.rect(52, currY, 490, 0.5).fill('#e2e8f0');
    currY += 5;

    // Audit trail
    const reviewText = `Reviewer Decision: ${f.reviewerDecision || 'pending'}  |  Remediation: ${f.remediationStatus || 'open'}${
      f.assignedTo ? `  |  Assigned: ${f.assignedTo}` : ''
    }${f.dueDate ? `  |  Due: ${new Date(f.dueDate).toLocaleDateString()}` : ''}`;
    doc.font('Helvetica-Oblique').fontSize(7.5).fillColor(neutralMuted).text(reviewText, 52, currY, { width: 490 });

    doc.y = cardTop + totalCardHeight + 10;
  }

  // ==========================================
  // PAGE 4: REMEDIATION ROADMAP
  // ==========================================
  doc.addPage();
  renderPageHeader('3. Remediation Roadmap & Organizational Evidence');

  doc.fontSize(8.5).font('Helvetica').fillColor('#334155').lineGap(2);
  doc.text(
    'The following priority corrective actions are required to align digital processing activities with the DPDP Act 2023. Track implementation progress in the organizational compliance governance dashboard.'
  );
  doc.moveDown(0.6);

  const openRemediations = findings.filter((f) => f.remediationStatus === 'open' || f.status === 'fail');
  if (openRemediations.length === 0) {
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(successColor);
    doc.text('No critical open remediations detected. Maintain continuous monitoring.');
  } else {
    for (const rem of openRemediations.slice(0, 5)) {
      const remH = doc.heightOfString(rem.recommendedRemediation, { width: 480, size: 8 }) + 36;
      if (doc.y + remH > 780) {
        doc.addPage();
        renderPageHeader('3. Remediation Roadmap & Organizational Evidence (Cont.)');
      }

      const itemTop = doc.y;
      doc.roundedRect(40, itemTop, 515, remH, 4).fill('#ffffff').stroke('#e2e8f0');
      doc.rect(40, itemTop, 3, remH).fill(rem.severity === 'critical' ? dangerColor : warningColor);

      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(dangerColor);
      doc.text(`[${rem.severity.toUpperCase()}] ${rem.ruleId}: ${rem.title}`, 50, itemTop + 6, { width: 495 });

      doc.font('Helvetica').fontSize(8).fillColor('#334155');
      doc.text(`Action: ${rem.recommendedRemediation}`, 50, itemTop + 18, { width: 495 });

      const metaStr = `Owner: ${rem.assignedTo || 'Unassigned'}  |  Due Date: ${rem.dueDate ? new Date(rem.dueDate).toLocaleDateString() : 'Unscheduled'}  |  Requirement: ${rem.requirementId}`;
      doc.font('Helvetica-Oblique').fontSize(7.5).fillColor(neutralMuted).text(metaStr, 50, itemTop + remH - 12, { width: 495 });

      doc.y = itemTop + remH + 8;
    }
  }

  doc.moveDown(0.8);

  // 3.1 Offline Organizational Evidence
  doc.fontSize(10.5).font('Helvetica-Bold').fillColor(primaryColor);
  doc.text('3.1 Items Requiring Offline Organizational Evidence');
  doc.moveDown(0.3);

  const offlineBoxY = doc.y;
  doc.roundedRect(40, offlineBoxY, 515, 78, 6).fill('#f8fafc').stroke('#cbd5e1');
  doc.fontSize(8).font('Helvetica').fillColor('#334155').lineGap(2);
  doc.text('1. DPO Designation: Board resolution or formal appointment of Data Protection Officer under Section 10.', 52, offlineBoxY + 8);
  doc.text('2. Periodic Data Audit: External independent audit records and Data Protection Impact Assessment (DPIA).', 52, offlineBoxY + 22);
  doc.text('3. Vendor / Processor Contracts: Data Processing Agreements (DPAs) enforcing DPDP requirements with cloud providers.', 52, offlineBoxY + 36);
  doc.text('4. Data Retention Logs: Automated database purging schedules demonstrating deletion upon purpose completion.', 52, offlineBoxY + 50);

  doc.y = offlineBoxY + 92;

  // 3.2 Technical Limitations
  doc.fontSize(10.5).font('Helvetica-Bold').fillColor(primaryColor);
  doc.text('3.2 Assessment Scope & Technical Limitations');
  doc.moveDown(0.3);

  const limitBoxY = doc.y;
  doc.roundedRect(40, limitBoxY, 515, 68, 6).fill('#f1f5f9').stroke('#e2e8f0');
  doc.fontSize(7.5).font('Helvetica').fillColor(neutralMuted).lineGap(1.5);
  doc.text('• Scope: Automated inspection is confined strictly to publicly rendered HTML/JS interfaces and user-supplied profiles.', 52, limitBoxY + 8);
  doc.text('• Backend Exclusions: Internal databases, encrypted queues, telemetry pipelines, and employee data were not inspected.', 52, limitBoxY + 20);
  doc.text('• Dynamic Content: Workflows requiring two-factor SMS OTP or biometric verification require manual compliance testing.', 52, limitBoxY + 32);
  doc.text('• Non-Endorsement: This automated evaluation does not certify compliance with foreign laws (GDPR, CCPA).', 52, limitBoxY + 44);

  // ==========================================
  // PAGE 5+: RECOMMENDED CONTENT UPDATES & READY-TO-USE CONTENT
  // ==========================================
  const actionableFindings = findings.filter(
    (f) => f.contentSuggestion && f.contentSuggestion.readyToUseContent
  );

  if (actionableFindings.length > 0) {
    doc.addPage();
    renderPageHeader('4. Recommended Content Updates & Ready-to-Use Website Content');

    doc.fontSize(8.5).font('Helvetica').fillColor('#334155').lineGap(2);
    doc.text(
      'For every finding requiring improvement, complete legally mapped, ready-to-use replacement or additional website content has been generated. Website administrators should copy the content below, replace bracketed placeholders with verified corporate facts, and publish to the designated page locations.'
    );
    doc.moveDown(0.8);

    let suggestionIdx = 1;
    for (const f of actionableFindings) {
      const cs = f.contentSuggestion;
      if (!cs || !cs.readyToUseContent) continue;

      const findingTitle = `4.${suggestionIdx++} ${cs.findingTitle || f.title}`;
      let snippetText = cs.readyToUseContent || '';
      if (snippetText.length > 1800) {
        snippetText = snippetText.slice(0, 1800) + '\n\n[... Complete full-length statutory text viewable and copyable in Online Portal & Excel Export ...]';
      }

      const hSnippetText = doc.heightOfString(snippetText, { width: 495, size: 7.5, lineGap: 1.5 });
      const snippetBoxHeight = hSnippetText + 28;

      const checklistItems = cs.customizationRequirements || [];
      const checklistHeight = checklistItems.length > 0 ? (checklistItems.length * 12) + 20 : 0;

      const missingText = cs.missingOrInsufficient || f.explanation || 'Statutory requirement needs remediation.';
      const hMissing = doc.heightOfString(missingText, { width: 505, size: 8 });

      const totalBlockHeight =
        16 + // title
        18 + // meta
        hMissing + 6 +
        16 + // placement
        snippetBoxHeight + 10 +
        checklistHeight + 16;

      if (doc.y > 100 && doc.y + totalBlockHeight > 780) {
        doc.addPage();
        renderPageHeader('4. Recommended Content Updates & Ready-to-Use Website Content (Cont.)');
      }

      // Title
      doc.fontSize(10.5).font('Helvetica-Bold').fillColor(primaryColor);
      doc.text(findingTitle, 40, doc.y, { width: 515 });
      doc.moveDown(0.25);

      // Meta bar
      const targetPageStr = `Target Page: ${cs.pageName || 'Website Policy'} (${cs.pageUrl || ''})`;
      const actionStr = `Action: ${(cs.recommendedAction || 'Add').toUpperCase()}`;
      const priorityStr = `Priority: ${(cs.priority || f.severity || 'Medium').toUpperCase()}`;
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#1e293b');
      doc.text(`${targetPageStr}   |   ${actionStr}   |   ${priorityStr}`);
      doc.moveDown(0.2);

      // Statutory Reference
      const ruleDisplay = cs.legalMapping?.sectionOrRule || f.ruleId;
      const srcDisplay = cs.legalMapping?.sourceDocument || f.officialSource || 'Digital Personal Data Protection Act, 2023';
      doc.font('Helvetica-Bold').fontSize(8).fillColor(accentCyan);
      doc.text(`Statutory Reference: ${ruleDisplay} — ${srcDisplay}`);
      doc.moveDown(0.2);

      // Missing / Insufficient
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#334155').text('Missing / Insufficient: ', 40, doc.y, { continued: true });
      doc.font('Helvetica').fontSize(8).fillColor('#334155').text(missingText);
      doc.moveDown(0.2);

      // Placement
      if (cs.placementInstructions) {
        const placeStr = `${cs.placementInstructions.pageName || cs.pageName} -> ${cs.placementInstructions.sectionName || ''} (${cs.placementInstructions.targetPosition || ''})`;
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#334155').text('Placement: ', 40, doc.y, { continued: true });
        doc.font('Helvetica').fontSize(8).fillColor(accentCyan).text(placeStr);
        doc.moveDown(0.3);
      }

      // Ready-to-use content snippet box
      const contentBoxY = doc.y;
      doc.roundedRect(40, contentBoxY, 515, snippetBoxHeight, 4).fill('#f8fafc').stroke('#cbd5e1');
      doc.rect(40, contentBoxY, 515, 16).fill('#f0fdfa');
      doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#0f766e');
      doc.text('READY-TO-USE SUGGESTED CONTENT (COPY & PUBLISH)', 48, contentBoxY + 4);

      doc.fontSize(7.5).font('Courier').fillColor(primaryColor).lineGap(1.5);
      doc.text(snippetText, 48, contentBoxY + 22, { width: 495 });

      doc.y = contentBoxY + snippetBoxHeight + 8;

      // Customization checklist
      if (checklistItems.length > 0) {
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#b45309');
        doc.text('Customization Checklist before Publishing:');
        doc.font('Helvetica').fontSize(7.5).fillColor('#78350f').lineGap(1.5);
        for (const item of checklistItems) {
          doc.text(`• ${item}`, 45, doc.y, { width: 505 });
        }
      }

      if (suggestionIdx <= actionableFindings.length) {
        doc.moveDown(0.8);
      }
    }
  }

  // ==========================================
  // RUNNING HEADERS & FOOTERS ON ALL PAGES
  // ==========================================
  const totalPages = doc.bufferedPageRange().count;
  for (let p = 0; p < totalPages; p++) {
    doc.switchToPage(p);

    const origBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0; // Prevent auto-addPage when drawing in bottom margin area

    // Running Header on interior pages (p > 0)
    if (p > 0) {
      doc.fontSize(7).font('Helvetica').fillColor('#94a3b8');
      doc.text(
        'DPDP STATUTORY COMPLIANCE ASSESSMENT REPORT  —  OFFICIAL AUDIT AID',
        40,
        22,
        { align: 'left', width: 350 }
      );
      doc.text(
        new Date(assessment.createdAt || Date.now()).toLocaleDateString('en-IN'),
        390,
        22,
        { align: 'right', width: 165 }
      );
      doc.rect(40, 32, 515, 0.5).fill('#e2e8f0');
    }

    // Running Footer on all pages
    doc.rect(40, 804, 515, 0.5).fill('#e2e8f0');
    doc.fontSize(7.5).font('Helvetica').fillColor(neutralMuted);
    doc.text(
      `Page ${p + 1} of ${totalPages}   •   DPDP Act 2023 & DPDP Rules 2025 Audit Aid   •   ${orgName}`,
      40,
      812,
      { align: 'center', width: 515 }
    );

    doc.page.margins.bottom = origBottom;
  }

  return { totalPages };
}

/**
 * Generates an official PDF compliance assessment report.
 * 
 * @param {string} assessmentId
 * @returns {Promise<Buffer>}
 */
export async function generatePdfReport(assessmentId) {
  const data = await loadReportData(assessmentId);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
        size: 'A4',
        bufferPages: true,
      });

      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      buildPdfDocument(doc, data);
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Generates an official multi-tab Excel compliance report.
 * 
 * @param {string} assessmentId
 * @returns {Promise<Buffer>}
 */
export async function generateExcelReport(assessmentId) {
  const data = await loadReportData(assessmentId);
  const { assessment, organization, target, findings, counts, calculatedScore } = data;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'DPDP Automated Assessment Platform';
  workbook.lastModifiedBy = 'DPDP Evidence Engine';
  workbook.created = new Date();

  // ==========================================
  // SHEET 1: EXECUTIVE SUMMARY
  // ==========================================
  const summarySheet = workbook.addWorksheet('Executive Summary', {
    views: [{ showGridLines: true }],
  });

  summarySheet.columns = [
    { header: 'Metric / Parameter', key: 'parameter', width: 32 },
    { header: 'Value', key: 'value', width: 50 },
    { header: 'Notes / Context', key: 'notes', width: 40 },
  ];

  // Header styling
  const headerRow = summarySheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' },
  };

  summarySheet.addRows([
    { parameter: 'Organization Name', value: organization.name, notes: 'Evaluated Data Fiduciary' },
    { parameter: 'Industry', value: organization.industry || 'Technology', notes: 'Sectoral Classification' },
    { parameter: 'Target Website URL', value: target.url, notes: 'Primary In-Scope Web Asset' },
    { parameter: 'Assessment Date', value: new Date(assessment.createdAt).toISOString(), notes: 'Timestamp of Audit Run' },
    { parameter: 'Statutory Compliance Score', value: `${calculatedScore}%`, notes: 'Pass / (Pass + Fail + NeedsReview)' },
    { parameter: 'Total Evaluated Checkpoints', value: findings.length, notes: 'Applicable & Universal Provisions' },
    { parameter: 'Passed Requirements', value: counts.pass, notes: 'Compliant Controls Verified' },
    { parameter: 'Failed Requirements', value: counts.fail, notes: 'Corrective Action Required' },
    { parameter: 'Needs Review Requirements', value: counts.needs_review, notes: 'Human Legal Confirmation Needed' },
    { parameter: 'Not Applicable Requirements', value: counts.not_applicable, notes: 'Triggers Not Active on Site' },
    { parameter: 'Not Tested (External Evidence)', value: counts.not_tested, notes: 'Awaiting Offline Documents' },
    {
      parameter: 'Statutory Disclaimer',
      value: 'Assessment aid only — Not a government certification or guarantee of DPBI compliance.',
      notes: 'Digital Personal Data Protection Act, 2023',
    },
  ]);

  // ==========================================
  // SHEET 2: DETAILED FINDINGS
  // ==========================================
  const findingsSheet = workbook.addWorksheet('Detailed Findings', {
    views: [{ showGridLines: true }],
  });

  findingsSheet.columns = [
    { header: 'Requirement ID', key: 'reqId', width: 28 },
    { header: 'Statutory Ref', key: 'ruleId', width: 16 },
    { header: 'Title', key: 'title', width: 35 },
    { header: 'Category', key: 'category', width: 24 },
    { header: 'Legal Status', key: 'legalStatus', width: 18 },
    { header: 'Statutory Cap', key: 'statutoryCap', width: 20 },
    { header: 'Status', key: 'status', width: 16 },
    { header: 'Severity', key: 'severity', width: 14 },
    { header: 'Observed Facts (Technical)', key: 'facts', width: 45 },
    { header: 'AI Interpretation', key: 'ai', width: 45 },
    { header: 'Recommended Remediation', key: 'remediation', width: 45 },
    { header: 'Reviewer Decision', key: 'reviewDecision', width: 18 },
    { header: 'Reviewer Notes', key: 'reviewNotes', width: 30 },
    { header: 'Remediation Status', key: 'remStatus', width: 18 },
    { header: 'Assigned To', key: 'assignedTo', width: 22 },
    { header: 'Due Date', key: 'dueDate', width: 14 },
  ];

  const fHeaderRow = findingsSheet.getRow(1);
  fHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  fHeaderRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0284C7' },
  };

  findings.forEach((f) => {
    findingsSheet.addRow({
      reqId: f.requirementId,
      ruleId: f.ruleId,
      title: f.title,
      category: f.category,
      legalStatus: (f.legalApplicabilityStatus || 'in_force').toUpperCase(),
      statutoryCap: f.penaltyReference?.maxPenaltyText || 'N/A',
      status: f.status.toUpperCase(),
      severity: f.severity.toUpperCase(),
      facts: (f.observedFacts || []).join('; '),
      ai: f.aiInterpretation || f.explanation,
      remediation: f.recommendedRemediation,
      reviewDecision: f.reviewerDecision || 'pending',
      reviewNotes: f.reviewerNotes || '',
      remStatus: f.remediationStatus || 'open',
      assignedTo: f.assignedTo || 'Unassigned',
      dueDate: f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '',
    });
  });

  // ==========================================
  // SHEET 3: EVIDENCE & SCENARIO LOG
  // ==========================================
  const evidenceSheet = workbook.addWorksheet('Evidence & Scenario Log', {
    views: [{ showGridLines: true }],
  });

  evidenceSheet.columns = [
    { header: 'Scenario ID', key: 'scenarioId', width: 30 },
    { header: 'Title', key: 'title', width: 35 },
    { header: 'Status', key: 'status', width: 16 },
    { header: 'DPDP Reference', key: 'dpdpRef', width: 20 },
    { header: 'Observed Findings', key: 'findings', width: 50 },
    { header: 'Screenshot Reference', key: 'screenshot', width: 40 },
  ];

  const evHeader = evidenceSheet.getRow(1);
  evHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  evHeader.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' },
  };

  data.scenarioResults.forEach((sc) => {
    evidenceSheet.addRow({
      scenarioId: sc.scenarioId,
      title: sc.title,
      status: sc.status.toUpperCase(),
      dpdpRef: sc.dpdpReference || '',
      findings: (sc.observedFindings || []).join('; '),
      screenshot: sc.evidenceIds && sc.evidenceIds[0]?.screenshotPath ? sc.evidenceIds[0].screenshotPath : 'N/A',
    });
  });

  // ==========================================
  // SHEET 4: REMEDIATION ACTION PLAN
  // ==========================================
  const remSheet = workbook.addWorksheet('Remediation Tracker', {
    views: [{ showGridLines: true }],
  });

  remSheet.columns = [
    { header: 'Requirement ID', key: 'reqId', width: 28 },
    { header: 'Section Ref', key: 'ruleId', width: 16 },
    { header: 'Title', key: 'title', width: 35 },
    { header: 'Severity', key: 'severity', width: 14 },
    { header: 'Remediation Status', key: 'remStatus', width: 18 },
    { header: 'Assigned Owner', key: 'assignedTo', width: 24 },
    { header: 'Owner Email', key: 'email', width: 26 },
    { header: 'Due Date', key: 'dueDate', width: 14 },
    { header: 'Corrective Action Notes', key: 'notes', width: 45 },
    { header: 'Retest History Count', key: 'retestCount', width: 18 },
  ];

  const remHeader = remSheet.getRow(1);
  remHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  remHeader.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF16A34A' },
  };

  findings.forEach((f) => {
    remSheet.addRow({
      reqId: f.requirementId,
      ruleId: f.ruleId,
      title: f.title,
      severity: f.severity.toUpperCase(),
      remStatus: f.remediationStatus.toUpperCase(),
      assignedTo: f.assignedTo || 'Unassigned',
      email: f.assignedEmail || '',
      dueDate: f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '',
      notes: f.remediationNotes || f.recommendedRemediation,
      retestCount: (f.retestHistory || []).length,
    });
  });

  // ==========================================
  // SHEET 5: RECOMMENDED CONTENT UPDATES
  // ==========================================
  const contentSheet = workbook.addWorksheet('Content Updates & Ready Content', {
    views: [{ showGridLines: true }],
  });

  contentSheet.columns = [
    { header: 'Target Page', key: 'pageName', width: 28 },
    { header: 'Page URL', key: 'pageUrl', width: 25 },
    { header: 'Finding Title', key: 'title', width: 35 },
    { header: 'Statutory Reference', key: 'ruleId', width: 22 },
    { header: 'Action', key: 'action', width: 14 },
    { header: 'Missing Requirement', key: 'missing', width: 40 },
    { header: 'Placement Instructions', key: 'placement', width: 45 },
    { header: 'Ready-to-Use Suggested Content', key: 'readyContent', width: 65 },
    { header: 'Customization Checklist', key: 'customization', width: 45 },
  ];

  const contentHeader = contentSheet.getRow(1);
  contentHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  contentHeader.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0284C7' },
  };

  findings.forEach((f) => {
    if (f.contentSuggestion && f.contentSuggestion.readyToUseContent) {
      const cs = f.contentSuggestion;
      contentSheet.addRow({
        pageName: cs.pageName || 'Website Policy',
        pageUrl: cs.pageUrl || '',
        title: cs.findingTitle || f.title,
        ruleId: cs.legalMapping?.sectionOrRule || f.ruleId,
        action: cs.recommendedAction || 'Add',
        missing: cs.missingOrInsufficient || f.explanation,
        placement: cs.placementInstructions ? `${cs.placementInstructions.sectionName || ''} - ${cs.placementInstructions.targetPosition || ''}` : '',
        readyContent: cs.readyToUseContent || '',
        customization: (cs.customizationRequirements || []).join('; '),
      });
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
