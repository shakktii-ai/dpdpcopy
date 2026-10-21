'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Globe,
  Upload,
  FileCode,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Eye,
  ShieldAlert,
  Scale,
  Sparkles,
  HelpCircle,
  Search,
  BookOpen,
  Building,
  Gavel,
  ChevronDown,
  ChevronUp,
  Shield,
  Layers,
  Calendar,
  AlertCircle,
  Info
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';

export default function DocumentsAndLegalFrameworkPage() {
  const [activeMainTab, setActiveMainTab] = useState('legal_framework'); // 'legal_framework' | 'documents'
  const [legalSubTab, setLegalSubTab] = useState('faq'); // 'faq' | 'registry'
  
  // Documents state
  const [documents, setDocuments] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    organizationId: '',
    documentType: 'privacy_policy',
    title: '',
    sourceType: 'url',
    url: '',
    fileContentText: '',
    fileName: ''
  });

  // Legal Framework state
  const [registryMetadata, setRegistryMetadata] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [dpbFaq, setDpbFaq] = useState([]);
  const [loadingLegal, setLoadingLegal] = useState(true);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [registryCategoryFilter, setRegistryCategoryFilter] = useState('all');
  const [registrySearchQuery, setRegistrySearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState('faq-1');

  // Load customer uploaded documents
  const loadDocuments = async () => {
    try {
      setLoadingDocs(true);
      const [docRes, orgRes] = await Promise.all([
        fetch('/api/documents'),
        fetch('/api/organizations')
      ]);
      const docJson = await docRes.json();
      const orgJson = await orgRes.json();

      if (docJson.success) setDocuments(docJson.data || []);
      if (orgJson.success) {
        setOrganizations(orgJson.data || []);
        if (orgJson.data?.length > 0 && !formData.organizationId) {
          setFormData((p) => ({ ...p, organizationId: orgJson.data[0]._id }));
        }
      }
    } catch (e) {
      console.error('Failed to load documents:', e);
    } finally {
      setLoadingDocs(false);
    }
  };

  // Load 2026 Legal Requirements and DPB FAQ
  const loadLegalFramework = async () => {
    try {
      setLoadingLegal(true);
      const res = await fetch('/api/requirements');
      const data = await res.json();
      if (data.success) {
        setRegistryMetadata(data.metadata);
        setRequirements(data.requirements || []);
        setDpbFaq(data.dpbFaq || []);
      }
    } catch (e) {
      console.error('Failed to load legal framework registry:', e);
    } finally {
      setLoadingLegal(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    loadLegalFramework();
  }, []);

  const handleSubmitDocument = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.organizationId) {
      setError('Please select an organization.');
      return;
    }
    if (!formData.title.trim()) {
      setError('Document title is required.');
      return;
    }
    if (formData.sourceType === 'url' && !formData.url.trim()) {
      setError('Document URL is required.');
      return;
    }
    if (formData.sourceType === 'upload' && !formData.fileContentText.trim()) {
      setError('Document text or content is required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fileSize: formData.fileContentText ? formData.fileContentText.length : 0
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add document');
      }

      setSuccess(`Document "${data.data.title}" added successfully.`);
      setShowModal(false);
      setFormData((p) => ({
        ...p,
        title: '',
        url: '',
        fileContentText: '',
        fileName: ''
      }));
      loadDocuments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFaqs = dpbFaq.filter((faq) => {
    if (!faqSearchQuery) return true;
    const q = faqSearchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.legalReference.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q)
    );
  });

  const filteredRequirements = requirements.filter((req) => {
    if (registryCategoryFilter !== 'all') {
      if (registryCategoryFilter === 'website_checks' && !req.isWebsiteComplianceCheck) return false;
      if (registryCategoryFilter === 'board_governance' && req.category !== 'statutory_reference') return false;
      if (registryCategoryFilter === 'fiduciary_obligations' && req.category !== 'data_fiduciary_obligation') return false;
      if (registryCategoryFilter === 'consent_manager' && req.category !== 'consent_manager_obligation') return false;
      if (registryCategoryFilter === 'penalties_appeals' && req.category !== 'appeal_and_enforcement') return false;
    }
    if (registrySearchQuery) {
      const q = registrySearchQuery.toLowerCase();
      return (
        req.requirementId.toLowerCase().includes(q) ||
        req.title.toLowerCase().includes(q) ||
        req.sectionOrRule.toLowerCase().includes(q) ||
        (req.expectedControl && req.expectedControl.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf2ed] border border-[#d0e2d5] text-[#2d523e] text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>DPDP 2026 Statutory Framework & Evidence Repository</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Legal Framework, DPB FAQ & Privacy Documents
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Official statutory references from the DPDP Act 2023, DPDP Rules 2025, and Data Protection Board of India (DPBI) guidelines &mdash; alongside your organization&apos;s verified privacy policies.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              loadDocuments();
              loadLegalFramework();
            }}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
            title="Refresh All Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {activeMainTab === 'documents' && (
            <button
              onClick={() => {
                setError('');
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#2d523e] hover:bg-[#234232] text-white shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Privacy Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveMainTab('legal_framework')}
          id="tab-legal-framework"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'legal_framework'
              ? 'bg-[#2d523e] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>2026 Statutory Framework & DPB FAQ</span>
        </button>

        <button
          onClick={() => setActiveMainTab('documents')}
          id="tab-privacy-documents"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'documents'
              ? 'bg-[#2d523e] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Organization Privacy Documents ({documents.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 2026 LEGAL FRAMEWORK & DATA PROTECTION BOARD FAQ */}
      {/* ========================================================================= */}
      {activeMainTab === 'legal_framework' && (
        <div className="space-y-6">
          {/* Statutory Reference Metadata Banner */}
          <div className="p-5 rounded-2xl bg-[#f7faf8] border border-[#d0e2d5] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white text-[#2d523e] border border-[#d0e2d5]">
                  Registry v{registryMetadata?.version || '2026.1'}
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {registryMetadata?.primaryAct || 'Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Incorporates <strong>Digital Personal Data Protection Rules, 2025</strong> and MeitY Commencement Notification <strong>S.O. 4930(E) dated 13 November 2025</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono flex-shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#2d523e]" />
              <span>Last Verified: {registryMetadata?.lastVerifiedDate || '2026-10-22'}</span>
            </div>
          </div>

          {/* Sub Navigation: DPB FAQ vs Statutory Registry */}
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLegalSubTab('faq')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  legalSubTab === 'faq'
                    ? 'bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Data Protection Board of India (DPB) FAQ ({dpbFaq.length})
              </button>
              <button
                onClick={() => setLegalSubTab('registry')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  legalSubTab === 'registry'
                    ? 'bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Statutory Requirements Registry ({requirements.length})
              </button>
            </div>

            {legalSubTab === 'faq' ? (
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search DPB FAQ..."
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2d523e]"
                />
              </div>
            ) : (
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 29 statutory rules..."
                  value={registrySearchQuery}
                  onChange={(e) => setRegistrySearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2d523e]"
                />
              </div>
            )}
          </div>

          {/* SUB-VIEW A: DPB FAQ ACCORDION */}
          {legalSubTab === 'faq' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
                <Info className="w-4 h-4 text-[#2d523e] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-semibold block">Regulatory Architecture Notice:</strong>
                  The Data Protection Board of India (DPBI) functions under Sections 18&ndash;33 of the DPDP Act. DPDP Vault explicitly separates <strong>Board governance rules</strong> (internal selection, civil court procedures, appellate pathways) from <strong>Data Fiduciary website compliance obligations</strong> (consent notices, cookie opt-ins, DPO disclosures) so that non-website provisions do not distort your site&apos;s compliance score.
                </div>
              </div>

              {loadingLegal ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filteredFaqs.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-6 text-center">No FAQ matches your search query.</p>
              ) : (
                <div className="space-y-3">
                  {filteredFaqs.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono font-bold text-[#2d523e] bg-[#eaf2ed] px-2 py-0.5 rounded border border-[#d0e2d5]">
                                {faq.category}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                {faq.legalReference}
                              </span>
                              <StatusBadge status={faq.status} size="xs" />
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {faq.isWebsiteCheck ? 'Website Obligation' : 'Board Governance Reference'}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 leading-snug">
                              {faq.question}
                            </h3>
                          </div>

                          <div className="text-slate-400 mt-1 flex-shrink-0">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs leading-relaxed text-slate-700">
                            <p>{faq.answer}</p>
                            <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-mono">
                              <span>Statutory Reference: {faq.legalReference}</span>
                              <span>Target Role: {faq.targetRole.replace(/_/g, ' ')}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW B: 29 STATUTORY REQUIREMENTS REGISTRY EXPLORER */}
          {legalSubTab === 'registry' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap p-1.5 bg-white border border-slate-200 rounded-xl shadow-xs text-xs">
                {[
                  { key: 'all', label: `All Provisions (${requirements.length})` },
                  { key: 'website_checks', label: `Website Obligations (${requirements.filter(r => r.isWebsiteComplianceCheck).length})` },
                  { key: 'board_governance', label: `Board Governance (${requirements.filter(r => r.category === 'statutory_reference').length})` },
                  { key: 'fiduciary_obligations', label: `Data Fiduciary Core (${requirements.filter(r => r.category === 'data_fiduciary_obligation').length})` },
                  { key: 'consent_manager', label: `Consent Manager (${requirements.filter(r => r.category === 'consent_manager_obligation').length})` },
                  { key: 'penalties_appeals', label: `Penalties & Appeals (${requirements.filter(r => r.category === 'appeal_and_enforcement').length})` },
                ].map((pill) => (
                  <button
                    key={pill.key}
                    onClick={() => setRegistryCategoryFilter(pill.key)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      registryCategoryFilter === pill.key
                        ? 'bg-[#eaf2ed] text-[#2d523e] font-bold border border-[#d0e2d5]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Requirements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRequirements.map((req) => (
                  <div
                    key={req.requirementId}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-[#2d523e] bg-[#eaf2ed] px-2 py-0.5 rounded border border-[#d0e2d5]">
                            {req.sectionOrRule}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {req.requirementId}
                          </span>
                        </div>
                        <StatusBadge status={req.applicabilityStatus} size="xs" />
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {req.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {req.expectedControl || req.reviewerGuidance}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px]">
                      {/* Classification & Scope */}
                      <div className="flex items-center justify-between gap-2 text-slate-500">
                        <span>Classification:</span>
                        <span className={`font-semibold px-2 py-0.5 rounded ${
                          req.isWebsiteComplianceCheck
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {req.isWebsiteComplianceCheck ? 'Website Audited Check' : 'Board Governance Reference'}
                        </span>
                      </div>

                      {/* Penalty Reference if present */}
                      {req.penaltyReference?.maxPenaltyAmount && (
                        <div className="flex items-center justify-between gap-2 text-slate-600">
                          <span>Statutory Penalty Cap:</span>
                          <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Up to {req.penaltyReference.maxPenaltyAmount} ({req.penaltyReference.scheduleEntry})
                          </span>
                        </div>
                      )}

                      {/* Effective Date & Source Provenance */}
                      <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 font-mono pt-1">
                        <span>Effective: {req.effectiveDate || '2023-08-11'}</span>
                        <span className="truncate max-w-[180px]" title={req.sourceProvenance}>
                          {req.officialSource || 'DPDP Act 2023'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: UPLOADED PRIVACY DOCUMENTS & POLICIES */}
      {/* ========================================================================= */}
      {activeMainTab === 'documents' && (
        <div className="space-y-6">
          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {loadingDocs ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-white border border-slate-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Privacy Documents Recorded"
              description="Provide privacy policy URLs or upload policy schedules to enable automated DPDP Section 5 notice and Section 6 consent alignment cross-checks."
              primaryActionText="Add Document"
              primaryActionHref="#"
              secondaryActionText="Run Onboarding Wizard"
              secondaryActionHref="/onboarding"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-3 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5]">
                        {doc.documentType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {doc.sourceType}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {doc.title}
                    </h3>

                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#2d523e] hover:underline break-all"
                      >
                        <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{doc.url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    ) : (
                      <p className="text-xs text-slate-500 font-mono">
                        {doc.fileName || 'Uploaded text snippet'}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {doc.sizeBytes ? `${Math.round(doc.sizeBytes / 1024)} KB` : 'Text only'}
                    </span>
                    {doc.extractedText && (
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="inline-flex items-center gap-1 text-[#2d523e] hover:text-[#234131] font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Text</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Document */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Regulatory Privacy Document</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitDocument} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Organization *</label>
                <select
                  value={formData.organizationId}
                  onChange={(e) => setFormData((p) => ({ ...p, organizationId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#2d523e] focus:outline-none"
                >
                  {organizations.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Document Category *</label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData((p) => ({ ...p, documentType: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#2d523e] focus:outline-none"
                >
                  <option value="privacy_policy">Privacy Notice / Policy (Section 5)</option>
                  <option value="terms_of_service">Terms of Service / Terms of Use</option>
                  <option value="consent_form">Consent Notice / Cookie Disclosure (Section 6)</option>
                  <option value="data_retention_policy">Data Retention & Erasure Schedule (Section 8)</option>
                  <option value="security_policy">Security Safeguards Architecture (Section 8(5))</option>
                  <option value="other">Other Statutory Policy</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Production Privacy Notice 2026"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#2d523e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Source Format *</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sourceType"
                      checked={formData.sourceType === 'url'}
                      onChange={() => setFormData((p) => ({ ...p, sourceType: 'url' }))}
                      className="text-[#2d523e] focus:ring-[#2d523e]"
                    />
                    <span>Live Public URL</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sourceType"
                      checked={formData.sourceType === 'upload'}
                      onChange={() => setFormData((p) => ({ ...p, sourceType: 'upload' }))}
                      className="text-[#2d523e] focus:ring-[#2d523e]"
                    />
                    <span>Direct Text Snippet</span>
                  </label>
                </div>
              </div>

              {formData.sourceType === 'url' ? (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Live Document URL *</label>
                  <input
                    type="url"
                    placeholder="https://example.com/privacy"
                    value={formData.url}
                    onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:border-[#2d523e] focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Policy Text Excerpt *</label>
                  <textarea
                    rows={4}
                    placeholder="Paste full text or relevant excerpt of privacy terms..."
                    value={formData.fileContentText}
                    onChange={(e) => setFormData((p) => ({ ...p, fileContentText: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:border-[#2d523e] focus:outline-none"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#2d523e] hover:bg-[#234131] text-white shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Preview Document */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{previewDoc.title}</h3>
                <span className="text-[10px] text-slate-500 uppercase">
                  {previewDoc.documentType.replace(/_/g, ' ')}
                </span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
              {previewDoc.extractedText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
