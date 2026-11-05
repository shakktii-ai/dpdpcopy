'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Info,
  Globe,
  Camera,
  Layers,
  Sparkles,
  BookOpen,
  Scale,
  Calendar,
  AlertCircle,
  ArrowLeft,
  RotateCcw,
  X,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Code,
  FileCode,
  CheckSquare,
  Clock
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import ReassessmentModal from '@/components/ReassessmentModal';

export default function CustomerReportPage({ params }) {
  const unwrappedParams = use(params);
  const assessmentId = unwrappedParams.id;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [previewScreenshot, setPreviewScreenshot] = useState(null);
  const [reassessModalOpen, setReassessModalOpen] = useState(false);
  const [showDetailedFindings, setShowDetailedFindings] = useState(false);
  const [expandedSuggestions, setExpandedSuggestions] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [copiedPage, setCopiedPage] = useState(null);

  const toggleExpand = (id) => {
    setExpandedSuggestions((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyPage = (suggestions, pageName) => {
    if (!suggestions || suggestions.length === 0) return;
    const formatted = suggestions
      .map((s, idx) => {
        const cs = s.contentSuggestion || s;
        return `=======================================================
RECOMMENDATION ${idx + 1}: ${cs.findingTitle || s.title}
Target Page: ${cs.pageName || pageName} (${cs.pageUrl || ''})
Action: ${cs.recommendedAction || 'Add'} | Priority: ${cs.priority || s.severity || 'Medium'}
Placement: ${cs.placementInstructions?.sectionName || ''} (${cs.placementInstructions?.targetPosition || ''})
Statutory Reference: ${cs.legalMapping?.sectionOrRule || s.ruleId} - ${cs.legalMapping?.sourceDocument || 'DPDP Act 2023'}

--- READY-TO-USE SUGGESTED CONTENT (COPY & PUBLISH) ---
${cs.readyToUseContent || ''}

--- CUSTOMIZATION CHECKLIST BEFORE PUBLISHING ---
${(cs.customizationRequirements || []).map((c) => `[ ] ${c}`).join('\n')}
`;
      })
      .join('\n\n');

    navigator.clipboard.writeText(formatted);
    setCopiedPage(pageName);
    setTimeout(() => setCopiedPage(null), 2500);
  };

  useEffect(() => {
    fetch(`/api/reports?assessmentId=${assessmentId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.report) {
          setReport(data.report);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [assessmentId]);

  const handleDownload = async (format) => {
    try {
      if (format === 'pdf') setDownloadingPdf(true);
      if (format === 'excel') setDownloadingExcel(true);

      const res = await fetch(`/api/reports?assessmentId=${assessmentId}&format=${format}`);
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DPDP-Compliance-Report-${assessmentId.slice(-6)}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Error downloading report: ${err.message}`);
    } finally {
      setDownloadingPdf(false);
      setDownloadingExcel(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <div className="h-44 bg-white border border-stone-200 rounded-3xl animate-pulse" />
        <div className="h-96 bg-white border border-stone-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-stone-900">Report Not Found</h2>
        <p className="text-xs text-stone-500">
          The requested assessment report could not be loaded or you are not authorized to view it.
        </p>
        <Link
          href="/portal"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700"
        >
          <span>Return to Workspace</span>
        </Link>
      </div>
    );
  }

  const { organization, target, complianceScore, counts, findings } = report;
  const scenarios = report.scenarios || [];
  const scenarioCounts = report.scenarioCounts || {
    total: scenarios.length,
    pass: scenarios.filter((s) => s.status === 'passed' || s.status === 'compliant').length,
    fail: scenarios.filter((s) => s.status === 'failed' || s.status === 'action_needed').length,
    needs_review: scenarios.filter((s) => s.status === 'needs_review').length,
    excluded: scenarios.filter((s) => ['skipped', 'not_applicable', 'not_tested'].includes(s.status)).length,
  };

  const groupedUpdates = (report.pageContentUpdates && report.pageContentUpdates.length > 0)
    ? report.pageContentUpdates
    : (() => {
        const map = new Map();
        for (const f of (findings || [])) {
          if (!f.contentSuggestion?.readyToUseContent) continue;
          const cs = f.contentSuggestion;
          const key = cs.pageName || 'Privacy Policy Page';
          if (!map.has(key)) {
            map.set(key, { pageName: key, pageUrl: cs.pageUrl || '', suggestions: [] });
          }
          map.get(key).suggestions.push({
            findingId: f._id || f.requirementId,
            requirementId: f.requirementId,
            ruleId: f.ruleId,
            title: f.title,
            status: f.status,
            severity: f.severity,
            ...cs,
          });
        }
        return Array.from(map.values());
      })();

  const upcomingGaps = (report.upcomingComplianceGaps && report.upcomingComplianceGaps.length > 0)
    ? report.upcomingComplianceGaps
    : (findings || []).filter(
        (f) => f.legalApplicabilityStatus === 'not_yet_in_force' || (f.effectiveDate && new Date(f.effectiveDate) > new Date())
      );

  const filteredScenarios = scenarios.filter((s) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'fail') return s.status === 'failed' || s.status === 'action_needed';
    if (activeCategory === 'needs_review') return s.status === 'needs_review';
    if (activeCategory === 'pass') return s.status === 'passed' || s.status === 'compliant';
    if (activeCategory === 'excluded') return ['skipped', 'not_applicable', 'not_tested'].includes(s.status);
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspace</span>
        </Link>

        {/* Action Buttons: Download, Compare, Reassess */}
        <div className="flex flex-wrap items-center gap-2">
          {report.previousAssessmentId && (
            <Link
              href={`/portal/reports/${report.previousAssessmentId}`}
              id="report-view-prev-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold shadow-2xs transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-stone-400" />
              <span>Previous Report</span>
            </Link>
          )}

          {report.hasComparableRuns && (
            <Link
              href={`/portal/assessments/${assessmentId}/compare`}
              id="report-compare-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#f7f9f7] border border-[#d0e2d5] text-[#2d523e] text-xs font-semibold shadow-2xs transition-all"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare Reports</span>
            </Link>
          )}

          <button
            onClick={() => setReassessModalOpen(true)}
            id="report-reassess-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#eaf2ed] border border-[#2d523e] text-[#2d523e] text-xs font-bold shadow-2xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Run Reassessment</span>
          </button>

          <button
            onClick={() => handleDownload('excel')}
            disabled={downloadingExcel}
            id="customer-download-excel-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold shadow-2xs transition-all disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>{downloadingExcel ? 'Exporting...' : 'Export Excel'}</span>
          </button>

          <button
            onClick={() => handleDownload('pdf')}
            disabled={downloadingPdf}
            id="customer-download-pdf-btn"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2d523e] hover:bg-[#234232] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Report Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5]">
                Official Assessment
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                Run #{report.sequenceNumber || 1}
              </span>
              {report.isReassessment && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Reassessment
                </span>
              )}
              <span className="text-xs text-stone-400">&bull;</span>
              <span className="text-xs text-stone-500">
                {new Date(report.assessment?.createdAt || Date.now()).toLocaleDateString('en-IN', { dateStyle: 'long' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              DPDP Compliance Assessment Report
            </h1>

            <p className="text-xs text-stone-600 font-medium">
              Prepared for <strong>{organization?.name || 'Authorized Organization'}</strong> &bull; Sector: {organization?.industry || 'Technology'}
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-stone-500 font-mono">
              <Globe className="w-3.5 h-3.5 text-stone-400" />
              <span>{target?.url || 'Evaluated Website Domain'}</span>
            </div>
          </div>

          {/* Compliance Score Hero Badge */}
          <div className="p-5 rounded-2xl bg-[#f7f9f7] border border-[#d0e2d5] text-center min-w-[120px] self-start sm:self-auto">
            <span className="text-4xl font-extrabold text-[#2d523e] leading-none block">
              {complianceScore !== null && complianceScore !== undefined ? `${complianceScore}%` : (report.scoreDisplay || 'Not calculated')}
            </span>
            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider mt-1 block">
              Compliance Index
            </span>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1.5">
          <span className="font-semibold text-stone-900 block">Executive Summary</span>
          <p className="leading-relaxed">
            {complianceScore === null || complianceScore === undefined
              ? 'This assessment is either in progress or could not evaluate sufficient checkpoints to calculate a compliance index.'
              : complianceScore >= 80
              ? 'Your website demonstrates strong alignment with core requirements under the Digital Personal Data Protection Act, 2023. Key disclosures and affirmative consent options were observed. A few minor points require attention below.'
              : complianceScore >= 50
              ? 'Your website partially meets DPDP standards. While some notice elements were observed, critical action items (such as Grievance Officer details or 1-click cookie withdrawal) require remediation to prevent regulatory non-conformity.'
              : 'Your website requires immediate attention to comply with statutory DPDP requirements. Several mandatory disclosures, affirmative consent mechanisms, or security safeguards were missing or incomplete.'}
          </p>
          <div className="mt-2 pt-2 border-t border-stone-200/60 text-[11px] text-stone-500 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <span>
              <strong>Scoring Methodology:</strong> {report.scoreMethodology?.formula || 'Compliant ÷ (Compliant + Action Needed + Needs Review) × 100'}. Not Applicable and Not Tested checkpoints are excluded from denominator. Needs Review is not counted as compliant.
            </span>
          </div>
        </div>

        {/* Status Metrics Breakdown Chips (Scenarios-Based) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white border border-stone-200 text-center">
            <span className="text-base font-bold text-emerald-700 block">{scenarioCounts.pass}</span>
            <span className="text-[10px] uppercase font-semibold text-stone-500">Compliant (Pass)</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-stone-200 text-center">
            <span className="text-base font-bold text-rose-700 block">{scenarioCounts.fail}</span>
            <span className="text-[10px] uppercase font-semibold text-stone-500">Action Needed (Fail)</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-stone-200 text-center">
            <span className="text-base font-bold text-amber-700 block">{scenarioCounts.needs_review}</span>
            <span className="text-[10px] uppercase font-semibold text-stone-500">Needs Review</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-stone-200 text-center">
            <span className="text-base font-bold text-stone-500 block">{scenarioCounts.excluded}</span>
            <span className="text-[10px] uppercase font-semibold text-stone-400">Excluded / Skipped</span>
          </div>
        </div>
      </div>

      {/* Primary Section: Evidence-Based Statutory Scenarios (6) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2d523e]" />
              <span>Evidence-Based Statutory Scenarios ({filteredScenarios.length})</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Evaluations under DPDP Act 2023 & DPDP Rules 2025 supported strictly by empirical observations captured during automated inspection.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-[#eaf2ed] text-[#2d523e] font-semibold border border-[#d0e2d5]">
              2026 Framework S.O. 4930(E)
            </span>
          </div>
        </div>

        {/* Filter Tabs for Scenarios */}
        <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-xl overflow-x-auto text-xs">
          {[
            { key: 'all', label: `All Scenarios (${scenarios.length})` },
            { key: 'fail', label: `Action Needed (${scenarioCounts.fail})` },
            { key: 'needs_review', label: `Needs Review (${scenarioCounts.needs_review})` },
            { key: 'pass', label: `Compliant (${scenarioCounts.pass})` },
            { key: 'excluded', label: `Excluded (${scenarioCounts.excluded})` },
            { key: 'board_governance', label: 'Board References & Governance' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeCategory === tab.key
                  ? 'bg-white text-stone-900 font-bold shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scenarios Cards List */}
        {filteredScenarios.length > 0 ? (
          <div className="space-y-4">
            {filteredScenarios.map((sc, idx) => {
              const isPass = sc.status === 'passed' || sc.status === 'compliant';
              const isFail = sc.status === 'failed' || sc.status === 'action_needed';
              const isReview = sc.status === 'needs_review';

              const statusBadgeConfig = isPass
                ? { label: 'Compliant', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 }
                : isFail
                ? { label: 'Action Needed', color: 'bg-rose-50 text-rose-800 border-rose-200', icon: XCircle }
                : isReview
                ? { label: 'Needs Review', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: AlertTriangle }
                : { label: 'Excluded / Skipped', color: 'bg-stone-100 text-stone-600 border-stone-200', icon: HelpCircle };

              const StatusIcon = statusBadgeConfig.icon;
              const screenshot = sc.screenshotUrl || (sc.evidenceIds && sc.evidenceIds[0]?.screenshotPath);

              return (
                <div
                  key={sc._id || sc.scenarioId || idx}
                  className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-4"
                >
                  {/* Scenario Title & Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-[#2d523e] bg-[#eaf2ed] px-2.5 py-0.5 rounded border border-[#d0e2d5] uppercase">
                          {sc.category ? sc.category.replace(/_/g, ' ') : 'Statutory Check'}
                        </span>
                        <StatusBadge
                          status={sc.legalApplicabilityStatus || 'in_force'}
                          size="xs"
                        />
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 font-mono">
                          {sc.sectionReference || sc.dpdpReference}
                        </span>
                        {sc.rulesReference && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                            {sc.rulesReference}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-stone-900 pt-0.5">
                        {sc.title}
                      </h3>

                      {/* Statutory Metadata Strip */}
                      <div className="flex items-center gap-2.5 flex-wrap text-[11px] text-stone-500 font-mono pt-0.5">
                        <span>Section: {sc.sectionReference || sc.dpdpReference}</span>
                        <span>&bull;</span>
                        <span>Source: {sc.officialSource || 'DPDP Act, 2023 & DPDP Rules, 2025'}</span>
                        <span>&bull;</span>
                        <span>Effective: {sc.effectiveDate || '2023-08-11'}</span>
                        {sc.penaltyText && (
                          <>
                            <span>&bull;</span>
                            <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              {sc.penaltyText}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${statusBadgeConfig.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusBadgeConfig.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  {sc.summary && (
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      {sc.summary}
                    </p>
                  )}

                  {/* Observed Facts vs AI Interpretation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Empirical Observations */}
                    <div className="p-3.5 rounded-xl bg-[#fafaf9] border border-stone-200 space-y-1">
                      <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-stone-500" />
                        <span>Observed Technical Facts</span>
                      </span>
                      {sc.observedFindings && sc.observedFindings.length > 0 ? (
                        <ul className="text-stone-600 space-y-1 list-disc list-inside pt-1">
                          {sc.observedFindings.map((fact, fIdx) => (
                            <li key={fIdx} className="leading-relaxed">{fact}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-stone-400 italic">No empirical observations recorded.</p>
                      )}
                    </div>

                    {/* Statutory AI Interpretation */}
                    <div className="p-3.5 rounded-xl bg-[#fafaf9] border border-stone-200 space-y-1">
                      <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Statutory Scope & Legal Authority</span>
                      </span>
                      <p className="text-stone-600 leading-relaxed pt-1">
                        {sc.dpdpReference
                          ? `Evaluated against ${sc.dpdpReference}. Non-compliance may attract inquiries and financial penalties by the Data Protection Board of India under Schedule statutory caps.`
                          : 'Evaluated under the Digital Personal Data Protection Act, 2023.'}
                      </p>
                    </div>
                  </div>

                  {/* Remediation Action Callout */}
                  {sc.recommendedRemediation && (
                    <div className="p-3.5 rounded-xl bg-[#eaf2ed]/60 border border-[#d0e2d5] text-xs space-y-1">
                      <span className="font-semibold text-[#2d523e] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Recommended Technical Remediation</span>
                      </span>
                      <p className="text-stone-700 leading-relaxed">
                        {sc.recommendedRemediation}
                      </p>
                    </div>
                  )}

                  {/* Screenshot Preview Trigger */}
                  {screenshot && (
                    <div className="pt-1 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-stone-400 font-mono">
                        {sc.pageUrl ? `Inspection Target: ${sc.pageUrl}` : ''}
                      </span>
                      <button
                        onClick={() => setPreviewScreenshot(screenshot)}
                        className="inline-flex items-center gap-1.5 text-xs text-[#2d523e] hover:text-[#234232] font-semibold bg-[#eaf2ed] px-3 py-1 rounded-lg border border-[#d0e2d5] transition-all"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>View Captured Evidence Screenshot</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center space-y-2">
            <p className="text-xs text-stone-500">No scenarios match the selected filter.</p>
          </div>
        )}

        {/* Optional Collapsible View for Itemized Checklist Findings */}
        {findings && findings.length > 0 && (
          <div className="pt-4 border-t border-stone-200">
            <button
              onClick={() => setShowDetailedFindings(!showDetailedFindings)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              <span>{showDetailedFindings ? 'Hide' : 'Show'} Itemized Statutory Checklist Findings ({findings.length})</span>
            </button>

            {showDetailedFindings && (
              <div className="mt-4 space-y-4">
                {findings.map((item) => {
                  const statusConfig = {
                    pass: { label: 'Compliant', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
                    fail: { label: 'Action Needed', color: 'bg-rose-50 text-rose-800 border-rose-200', icon: XCircle },
                    needs_review: { label: 'Needs Review', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: AlertTriangle },
                    not_applicable: { label: 'Not Applicable', color: 'bg-stone-100 text-stone-600 border-stone-200', icon: HelpCircle },
                    not_tested: { label: 'Not Tested', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Info },
                  }[item.status] || { label: item.status, color: 'bg-stone-100', icon: Info };

                  const StatusIcon = statusConfig.icon;

                  return (
                    <div
                      key={item._id}
                      className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-[#2d523e] bg-[#eaf2ed] px-2 py-0.5 rounded border border-[#d0e2d5]">
                              {item.ruleId}
                            </span>
                            <StatusBadge
                              status={item.legalApplicabilityStatus || item.requirement?.applicabilityStatus || 'in_force'}
                              size="xs"
                            />
                            <span className="text-xs text-stone-500 font-medium">
                              {item.category?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusConfig.label}</span>
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">{item.aiInterpretation || item.explanation}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* DEDICATED SECTION: RECOMMENDED CONTENT UPDATES (PAGE-BY-PAGE) */}
      {/* ============================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-[#2d523e]" />
              <span>Recommended Content Updates & Ready-to-Use Website Content</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Complete, legally mapped replacement or additional website content generated directly from the official DPDP Act 2023 and DPDP Rules 2025.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5]">
              {groupedUpdates.reduce((acc, p) => acc + (p.suggestions?.length || 0), 0)} Ready-to-Use Updates
            </span>
          </div>
        </div>

        {groupedUpdates.length > 0 ? (
          <div className="space-y-6">
            {groupedUpdates.map((pageGroup, pIdx) => {
              const pageSuggestions = pageGroup.suggestions || [];
              const isPageCopied = copiedPage === pageGroup.pageName;

              return (
                <div
                  key={pIdx}
                  className="rounded-3xl bg-white border border-stone-200/90 shadow-2xs overflow-hidden"
                >
                  {/* Page Group Header Bar */}
                  <div className="p-5 sm:p-6 bg-stone-50 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-white text-stone-700 border border-stone-200">
                          Target Page #{pIdx + 1}
                        </span>
                        <span className="text-xs font-mono text-stone-500">
                          {pageGroup.pageUrl}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#2d523e]" />
                        <span>{pageGroup.pageName}</span>
                      </h3>
                    </div>

                    <button
                      onClick={() => handleCopyPage(pageSuggestions, pageGroup.pageName)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-all ${
                        isPageCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white hover:bg-stone-100 border border-stone-200 text-stone-800'
                      }`}
                    >
                      {isPageCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied All Suggestions for Page!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-500" />
                          <span>Copy All Suggestions for this Page</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Suggestions List for this Page */}
                  <div className="p-5 sm:p-6 space-y-5">
                    {pageSuggestions.map((s, sIdx) => {
                      const suggId = s.findingId || s.requirementId || `${pIdx}_${sIdx}`;
                      const isExpanded = expandedSuggestions[suggId] !== false; // Default expanded
                      const isCopied = copiedId === suggId;

                      const actionBadgeColors = {
                        Add: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                        Update: 'bg-blue-50 text-blue-800 border-blue-200',
                        Replace: 'bg-amber-50 text-amber-800 border-amber-200',
                        Remove: 'bg-rose-50 text-rose-800 border-rose-200',
                      }[s.recommendedAction] || 'bg-stone-100 text-stone-700 border-stone-200';

                      const priorityBadgeColors = {
                        Critical: 'bg-rose-50 text-rose-700 border-rose-200',
                        High: 'bg-amber-50 text-amber-700 border-amber-200',
                        Medium: 'bg-sky-50 text-sky-700 border-sky-200',
                        Low: 'bg-stone-50 text-stone-600 border-stone-200',
                      }[s.priority] || 'bg-stone-50 text-stone-600 border-stone-200';

                      return (
                        <div
                          key={suggId}
                          className="rounded-2xl border border-stone-200/90 overflow-hidden bg-white shadow-2xs"
                        >
                          {/* Accordion Header */}
                          <div
                            onClick={() => toggleExpand(suggId)}
                            className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer hover:bg-stone-50/70 transition-colors select-none"
                          >
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${actionBadgeColors}`}>
                                  {s.recommendedAction || 'Add'}
                                </span>
                                <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${priorityBadgeColors}`}>
                                  Priority: {s.priority || s.severity || 'Medium'}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-[#2d523e] bg-[#eaf2ed] px-2 py-0.5 rounded border border-[#d0e2d5]">
                                  {s.legalMapping?.sectionOrRule || s.ruleId}
                                </span>
                              </div>
                              <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                                {s.findingTitle || s.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                              >
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          {/* Accordion Body */}
                          {isExpanded && (
                            <div className="p-5 sm:p-6 border-t border-stone-200 space-y-5 bg-[#fbfbfb]">
                              {/* Current vs Recommended Content Comparison */}
                              <div className="space-y-2">
                                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                                  Current vs Recommended Content Comparison
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                  {/* Left: Existing Content on Website */}
                                  <div className="p-4 rounded-xl bg-white border border-stone-200/90 space-y-1.5">
                                    <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                                      <Layers className="w-3.5 h-3.5 text-stone-400" />
                                      <span>Current Website Content (Observed)</span>
                                    </span>
                                    <p className="text-stone-600 italic leading-relaxed whitespace-pre-wrap font-mono text-[11px] bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 max-h-36 overflow-y-auto">
                                      {s.existingContent || 'No disclosure or mechanism found on the page.'}
                                    </p>
                                  </div>

                                  {/* Right: What is Missing / Needs Improvement */}
                                  <div className="p-4 rounded-xl bg-white border border-stone-200/90 space-y-1.5">
                                    <span className="font-semibold text-rose-800 flex items-center gap-1.5">
                                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                      <span>What Needs to be Added / Corrected</span>
                                    </span>
                                    <p className="text-stone-700 leading-relaxed pt-0.5">
                                      {s.missingOrInsufficient || s.explanation}
                                    </p>
                                    {s.priorityReason && (
                                      <p className="text-[11px] text-stone-500 font-medium pt-1">
                                        <strong>Why it matters:</strong> {s.priorityReason}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Placement Instructions Strip */}
                              {s.placementInstructions && (
                                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 space-y-1">
                                  <span className="font-bold flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                                    <span>Placement Instructions</span>
                                  </span>
                                  <p className="text-[11px] leading-relaxed text-blue-800">
                                    <strong>Page:</strong> {s.placementInstructions.pageName || s.pageName} &bull; <strong>Section:</strong> {s.placementInstructions.sectionName}
                                    <br />
                                    <strong>Position:</strong> {s.placementInstructions.targetPosition}
                                    {s.placementInstructions.details && ` (${s.placementInstructions.details})`}
                                  </p>
                                </div>
                              )}

                              {/* Legal Mapping Details */}
                              <div className="p-3.5 rounded-xl bg-stone-100/80 border border-stone-200 text-xs space-y-1">
                                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                                  <Scale className="w-3.5 h-3.5 text-stone-600" />
                                  <span>Legal Mapping & Statutory Authority</span>
                                </span>
                                <p className="text-stone-600 leading-relaxed text-[11px]">
                                  <strong>Source:</strong> {s.legalMapping?.sourceDocument || 'Digital Personal Data Protection Act, 2023'} &bull; <strong>Provision:</strong> {s.legalMapping?.sectionOrRule || s.ruleId}
                                  {s.legalMapping?.schedule && ` &bull; ${s.legalMapping.schedule}`}
                                  <br />
                                  {s.legalMapping?.explanation}
                                </p>
                              </div>

                              {/* Full Ready-to-Use Suggested Content */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Code className="w-3.5 h-3.5 text-[#2d523e]" />
                                    <span>Ready-to-Use Suggested Content (Copy Directly)</span>
                                  </span>
                                  <button
                                    onClick={() => handleCopy(s.readyToUseContent, suggId)}
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold shadow-2xs transition-all ${
                                      isCopied
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-white hover:bg-stone-100 border border-stone-200 text-[#2d523e]'
                                    }`}
                                  >
                                    {isCopied ? (
                                      <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Copied Content!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Content</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <div className="relative rounded-xl border border-stone-300 bg-[#0f172a] p-4 text-stone-100 font-mono text-xs overflow-x-auto max-h-96">
                                  <pre className="whitespace-pre-wrap leading-relaxed">
                                    {s.readyToUseContent}
                                  </pre>
                                </div>
                              </div>

                              {/* Customization Checklist */}
                              {s.customizationRequirements && s.customizationRequirements.length > 0 && (
                                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs space-y-2">
                                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                                    <CheckSquare className="w-4 h-4 text-amber-700" />
                                    <span>Customization Requirements (Verify Before Publishing)</span>
                                  </span>
                                  <ul className="text-amber-900 space-y-1 list-disc list-inside leading-relaxed text-[11px]">
                                    {s.customizationRequirements.map((cr, crIdx) => (
                                      <li key={crIdx}>{cr}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Statutory Disclaimer Strip */}
                              <div className="text-[10px] text-stone-500 italic bg-white p-2.5 rounded-lg border border-stone-200/70">
                                <strong>Legal Note:</strong> This draft content is an automated compliance remediation aid based on the DPDP Act 2023 and DPDP Rules 2025. Does not constitute legal representation or guarantee statutory compliance. Replace placeholders and obtain legal review prior to publishing.
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-stone-900">All Content Disclosures Satisfied</h4>
            <p className="text-xs text-stone-500">No missing or partial content disclosures were detected on inspected pages.</p>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* DEDICATED SECTION: UPCOMING COMPLIANCE / READINESS GAPS */}
      {/* ============================================================== */}
      {upcomingGaps.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#f8fafc] border border-blue-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Upcoming Compliance & Readiness Gaps ({upcomingGaps.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Provisions published in official notifications that take effect in upcoming phases. These are not current violations, but readiness gaps to prepare for early.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200 font-mono">
              Phased Enforcement
            </span>
          </div>

          <div className="space-y-3">
            {upcomingGaps.map((ug, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-blue-100/90 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {ug.ruleId}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Effective Date: {ug.effectiveDate || '2027-05-13'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Readiness Gap (Not Penalized)
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{ug.title}</h4>
                <p className="text-slate-600 leading-relaxed text-[11px]">{ug.aiInterpretation || ug.explanation}</p>
                <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 text-[11px] text-blue-800">
                  <strong>Recommended Readiness Action:</strong> {ug.recommendedRemediation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explicit Limitations Section (Per Requirement) */}
      <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-stone-500" />
          <span>Assessment Scope & Explicit Limitations</span>
        </h3>
        <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside leading-relaxed">
          <li><strong>Client-Side Only:</strong> This inspection evaluated rendered client-side web pages, cookie consent scripts, and published documents. Internal production databases, offline storage, and employee procedures were not inspected.</li>
          <li><strong>Two-Factor Authentication:</strong> Portions of your application requiring SMS OTP or hardware authentication tokens require manual verification.</li>
          <li><strong>Dynamic Code:</strong> Third-party scripts injected dynamically based on geo-location or behavioral conditions outside India were not part of this evaluation.</li>
        </ul>
      </div>

      {/* Mandatory Statutory Disclaimer Card */}
      <div className="p-5 rounded-2xl bg-stone-100 border border-stone-200 text-stone-600 text-xs space-y-2">
        <span className="font-semibold text-stone-900 block">Regulatory Compliance Notice</span>
        <p className="leading-relaxed text-[11px]">
          This document is an automated technical diagnostic report provided as an assessment aid. It <strong>does not constitute a government certification</strong>, legal advice, or a guarantee of compliance from the Data Protection Board of India (DPBI). Organizations should retain qualified legal counsel to perform formal compliance audits.
        </p>
      </div>

      {/* Screenshot Modal Lightbox */}
      {previewScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewScreenshot(null)}
        >
          <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2 border border-stone-200">
            <div className="flex justify-between items-center px-3 py-2 border-b border-stone-100">
              <span className="text-xs font-semibold text-stone-700">Evidence Screenshot</span>
              <button
                onClick={() => setPreviewScreenshot(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2">
              <img src={previewScreenshot} alt="Evidence" className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      )}
      {/* Reassessment Modal */}
      <ReassessmentModal
        isOpen={reassessModalOpen}
        onClose={() => setReassessModalOpen(false)}
        assessment={report.assessment}
        targetUrl={target?.url}
        websiteName={target?.name}
        currentSequence={report.sequenceNumber || 1}
      />
    </div>
  );
}
