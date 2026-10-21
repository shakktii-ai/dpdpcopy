'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  Globe,
  Clock,
  ArrowRight,
  PlusCircle,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Scale,
  RotateCcw,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import ReassessmentModal from '@/components/ReassessmentModal';

const STATUTORY_STAGES = [
  {
    id: 1,
    title: 'Authorized Domain Verification',
    desc: 'Validating SSL, domain authorization, and SSRF boundary.',
    section: 'Sec 8 & SSRF Guard',
    tag: 'Pre-flight',
  },
  {
    id: 2,
    title: 'Consent Notice & Cookie Banner',
    desc: 'Inspecting landing page for Sec 5 & 6 opt-in/opt-out mechanisms.',
    section: 'Sec 5(1), 6(1)',
    tag: 'Opt-in/Opt-out',
  },
  {
    id: 3,
    title: 'Privacy Notice Disclosures',
    desc: 'Examining /privacy for itemized statutory disclosures under Sec 5.',
    section: 'Sec 5, Rule 3',
    tag: 'Itemized Notice',
  },
  {
    id: 4,
    title: 'Grievance Redressal & DPO',
    desc: 'Verifying Data Protection Officer contact details and escalation SLA.',
    section: 'Sec 8(9), Rule 8',
    tag: 'Escalation SLA',
  },
  {
    id: 5,
    title: 'Data Minimization on Forms',
    desc: 'Scanning interactive contact forms for purpose consent checkboxes.',
    section: 'Sec 4, 6(1)',
    tag: 'Forms & Purpose',
  },
  {
    id: 6,
    title: 'Consent Withdrawal & Rights',
    desc: 'Verifying granular purpose toggles and unconditional withdrawal portal.',
    section: 'Sec 6(4), Rule 5',
    tag: '1-Click Revocation',
  },
  {
    id: 7,
    title: 'Authentication Safeguards (Sec 8(5))',
    desc: 'Evaluating test account authentication safeguards or public-scope boundary.',
    section: 'Sec 8(5), Rule 6',
    tag: 'Security Safeguards',
  },
];

export default function CustomerAssessmentsHubPage() {
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedAssessmentForRerun, setSelectedAssessmentForRerun] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const [userRes, reportsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/reports'),
      ]);

      const userData = await userRes.json();
      const reportsData = await reportsRes.json();

      if (userData.success && userData.user) {
        setUser(userData.user);
      }

      if (reportsData.success && reportsData.reports) {
        setAssessments(reportsData.reports);
      }
    } catch (err) {
      console.error('Failed to load assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const filteredAssessments = assessments.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return a.status === 'completed';
    if (filter === 'in_progress') return a.status === 'in_progress' || a.status === 'queued';
    if (filter === 'failed') return a.status === 'failed';
    return true;
  });

  return (
    <div className="space-y-8 py-4">
      {/* Header with Title and Start Assessment CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5]">
              DPDP Act 2023 & DPDP Rules 2025
            </span>
            <span className="text-xs text-stone-400 font-mono">2026 Framework S.O. 4930(E)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Website Compliance Assessments
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time automated evaluation runs across India&apos;s 7 Statutory Compliance Stages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAssessments}
            className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 shadow-2xs transition-all"
            title="Refresh Assessments"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#2d523e]' : ''}`} />
          </button>

          <Link
            href="/portal/onboarding"
            id="start-new-assessment-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#2d523e] hover:bg-[#234232] text-white shadow-2xs transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Assessment</span>
          </Link>
        </div>
      </div>

      {/* Statutory Compliance Stages Panel */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#2d523e]" />
              <span>Statutory Compliance Stages</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              The 7 mandatory verification phases executed during every automated website inspection under DPDP Act 2023.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#2d523e] bg-[#eaf2ed] px-2.5 py-1 rounded-md border border-[#d0e2d5] self-start sm:self-auto">
            DPDP Act 2023
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {STATUTORY_STAGES.map((st) => (
            <div
              key={st.id}
              className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between space-y-2 hover:border-[#2d523e]/40 transition-all group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="w-5 h-5 rounded-full bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5] flex items-center justify-center text-[10px] font-bold">
                    {st.id}
                  </span>
                  <span className="text-[9px] font-mono font-semibold uppercase text-stone-400 truncate">
                    {st.tag}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-stone-900 leading-snug group-hover:text-[#2d523e] transition-colors">
                  {st.title}
                </h3>
                <p className="text-[11px] text-stone-500 leading-tight">
                  {st.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200/60 text-[10px] font-mono text-[#2d523e] font-semibold">
                {st.section}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2 text-xs">
          {[
            { key: 'all', label: `All Assessments (${assessments.length})` },
            { key: 'completed', label: `Completed (${assessments.filter((a) => a.status === 'completed').length})` },
            { key: 'in_progress', label: `In Progress (${assessments.filter((a) => a.status === 'in_progress' || a.status === 'queued').length})` },
            { key: 'failed', label: `Failed (${assessments.filter((a) => a.status === 'failed').length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === tab.key
                  ? 'bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5] font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          href="/documents"
          className="text-xs text-[#2d523e] hover:underline font-semibold flex items-center gap-1"
        >
          <span>View DPB FAQ & Legal Framework (2026)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Assessments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-stone-200 animate-pulse" />
          ))}
        </div>
      ) : filteredAssessments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssessments.map((item) => {
            const isCompleted = item.status === 'completed';
            const isRunning = item.status === 'in_progress';
            const isFailed = item.status === 'failed';

            return (
              <div
                key={item._id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        Run #{item.sequenceNumber || 1}
                      </span>
                      {item.isReassessment && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Reassessment
                        </span>
                      )}
                      <span
                        className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : isRunning
                            ? 'bg-sky-50 text-sky-800 border border-sky-200 animate-pulse'
                            : isFailed
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {item.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-stone-400">&bull;</span>
                      <span className="text-xs text-stone-500 font-mono">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-stone-400 shrink-0" />
                      <h3 className="text-base font-bold text-stone-900 truncate">
                        {item.targetUrl}
                      </h3>
                    </div>

                    <p className="text-xs text-stone-500">
                      Organization: <strong>{item.organizationName || 'Authorized Organization'}</strong> &bull; Scenarios Evaluated: {item.totalScenariosEvaluated || 6}
                    </p>
                  </div>

                  {/* Score & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                    {item.complianceScore !== null && item.complianceScore !== undefined && (
                      <div className="p-3 rounded-xl bg-[#f7f9f7] border border-[#d0e2d5] text-center min-w-[90px]">
                        <span className="text-xl font-extrabold text-[#2d523e] leading-tight block">
                          {item.complianceScore}%
                        </span>
                        <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider block">
                          Compliance
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/portal/assessments/${item._id}`}
                        id={`view-live-assessment-${item._id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-all shadow-2xs"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#2d523e]" />
                        <span>Live Assessment</span>
                      </Link>

                      {isCompleted && (
                        <Link
                          href={`/portal/reports/${item._id}`}
                          id={`view-report-${item._id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#2d523e] hover:bg-[#234232] text-white shadow-2xs transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Official Report</span>
                        </Link>
                      )}

                      <button
                        onClick={() => setSelectedAssessmentForRerun(item)}
                        title="Run Reassessment"
                        className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white border border-stone-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5] flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-stone-900">No Assessments Found</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Start your first website assessment to inspect cookie notices, itemized disclosures, and grievance mechanisms under India&apos;s privacy law.
          </p>
          <Link
            href="/portal/onboarding"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#2d523e] hover:bg-[#234232] text-white shadow-2xs transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start Website Assessment</span>
          </Link>
        </div>
      )}

      {/* Reassessment Modal */}
      {selectedAssessmentForRerun && (
        <ReassessmentModal
          isOpen={Boolean(selectedAssessmentForRerun)}
          onClose={() => setSelectedAssessmentForRerun(null)}
          assessment={selectedAssessmentForRerun}
          targetUrl={selectedAssessmentForRerun.targetUrl}
          websiteName={selectedAssessmentForRerun.websiteName}
          currentSequence={selectedAssessmentForRerun.sequenceNumber || 1}
        />
      )}
    </div>
  );
}
