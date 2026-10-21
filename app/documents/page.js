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
  Info,
  ShieldCheck,
  CheckCircle,
  Lock,
  ArrowRight
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';

// Exact Statutory Compliance Stages (7) - DO NOT CHANGE TITLES OR DESCRIPTIONS
const STATUTORY_COMPLIANCE_STAGES = [
  {
    stage: 1,
    title: 'Authorized Domain Verification',
    description: 'Validating SSL, domain authorization, and SSRF boundary.',
    reference: 'Sec 8 & SSRF Boundary',
    penaltyText: 'Boundary Pre-flight',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
  },
  {
    stage: 2,
    title: 'Consent Notice & Cookie Banner',
    description: 'Inspecting landing page for Sec 5 & 6 opt-in/opt-out mechanisms.',
    reference: 'Sec 5(1), 6(1) & Rule 3 (2025)',
    penaltyText: 'Up to ₹250 Cr',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    stage: 3,
    title: 'Privacy Notice Disclosures',
    description: 'Examining /privacy for itemized statutory disclosures under Sec 5.',
    reference: 'Sec 5 & Rule 3, 4 (2025)',
    penaltyText: 'Up to ₹50 Cr',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    stage: 4,
    title: 'Grievance Redressal & DPO',
    description: 'Verifying Data Protection Officer contact details and escalation SLA.',
    reference: 'Sec 8(9) & Rule 8 (2025)',
    penaltyText: 'Up to ₹50 Cr',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    stage: 5,
    title: 'Data Minimization on Forms',
    description: 'Scanning interactive contact forms for purpose consent checkboxes.',
    reference: 'Sec 4, 6(1) & Rule 3 (2025)',
    penaltyText: 'Up to ₹50 Cr',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    stage: 6,
    title: 'Consent Withdrawal & Rights',
    description: 'Verifying granular purpose toggles and unconditional withdrawal portal.',
    reference: 'Sec 6(4) & Rule 5 (2025)',
    penaltyText: 'Up to ₹50 Cr',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    stage: 7,
    title: 'Authentication Safeguards (Sec 8(5))',
    description: 'Evaluating test account authentication safeguards or public-scope boundary.',
    reference: 'Sec 8(5) & Rule 6 (2025)',
    penaltyText: 'Up to ₹250 Cr',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  }
];

// Evidence-Based Statutory Scenarios (6)
const STATUTORY_SCENARIOS_6 = [
  {
    id: 'notice_and_consent',
    title: 'Consent Notice & Cookie Banner',
    category: 'Notice & Consent',
    sectionReference: 'Section 5(1), 6(1)',
    rulesReference: 'Rule 3 (2025)',
    penaltyCap: 'Up to ₹250 Cr',
    penaltyText: 'Statutory Cap: Up to ₹250 Cr (Schedule Item 2)',
    legalStatus: 'in_force',
    description: 'Inspecting landing page for Sec 5 & 6 opt-in/opt-out mechanisms, verifying affirmative action before cookie issuance, blocking non-essential tracking cookies until consent is obtained, and ensuring multilingual accessibility.',
    remediation: 'Deploy an affirmative, prominent cookie consent notice with clear Accept and Reject options before any tracking or analytics cookies are set.',
    empiricalScope: 'Live DOM banner extraction, cookie store snapshot prior to action, and script blocking verification.'
  },
  {
    id: 'privacy_notice_compliance',
    title: 'Privacy Notice Disclosures',
    category: 'Privacy Notice Compliance',
    sectionReference: 'Section 5',
    rulesReference: 'Rule 3 & 4 (2025)',
    penaltyCap: 'Up to ₹50 Cr',
    penaltyText: 'Statutory Cap: Up to ₹50 Cr (Schedule Item 3)',
    legalStatus: 'in_force',
    description: 'Examining /privacy for itemized statutory disclosures under Sec 5: Data Fiduciary identification, specific itemized data elements, distinct purpose specifications, third-party sharing disclosures, retention periods, grievance officer contact, and DPBI escalation rights.',
    remediation: 'Publish an itemized privacy notice declaring Data Fiduciary identity, itemized data collection categories, specific purpose specifications, retention periods, user rights, and Grievance Officer details.',
    empiricalScope: 'Itemized clause analysis on /privacy, legal identity verification, purpose specification checklist, and retention schedule review.'
  },
  {
    id: 'grievance_mechanism_sec_8_9',
    title: 'Grievance Redressal & DPO',
    category: 'Grievance Redressal',
    sectionReference: 'Section 8(9)',
    rulesReference: 'Rule 8 (2025)',
    penaltyCap: 'Up to ₹50 Cr',
    penaltyText: 'Statutory Cap: Up to ₹50 Cr (Schedule Item 3)',
    legalStatus: 'in_force',
    description: 'Verifying Data Protection Officer contact details and escalation SLA, official email, physical registered address, published turnaround SLA (statutory 30-day escalation timeline), and explicit guidance for filing complaints with the Data Protection Board of India (DPBI).',
    remediation: 'Prominently publish the designated Grievance Officer name, official email, physical address, and statutory turnaround SLA (30-day escalation timeline) with DPBI appeal information.',
    empiricalScope: 'Designated contact discovery, email/postal pattern extraction, 30-day SLA clause detection, and DPBI appellate notice cross-check.'
  },
  {
    id: 'data_minimization_and_notice',
    title: 'Data Minimization on Forms',
    category: 'Data Minimization',
    sectionReference: 'Section 4, 6(1)',
    rulesReference: 'Rule 3 (2025)',
    penaltyCap: 'Up to ₹50 Cr',
    penaltyText: 'Statutory Cap: Up to ₹50 Cr (Schedule Item 3)',
    legalStatus: 'in_force',
    description: 'Scanning interactive contact forms for purpose consent checkboxes, lead generation fields, and registration inputs for purpose-specific consent checkboxes, non-pre-ticked opt-ins, unbundled authorizations, and direct links to the relevant privacy terms.',
    remediation: 'Place purpose-specific consent notices and opt-in checkboxes directly adjacent to interactive form submission buttons.',
    empiricalScope: 'Interactive form input inventory, purpose consent checkbox detection, unbundled consent verification, and privacy policy links.'
  },
  {
    id: 'consent_granularity_and_withdrawal',
    title: 'Consent Withdrawal & Rights',
    category: 'Consent Withdrawal & Rights',
    sectionReference: 'Section 6(4)',
    rulesReference: 'Rule 5 (2025)',
    penaltyCap: 'Up to ₹50 Cr',
    penaltyText: 'Statutory Cap: Up to ₹50 Cr (Schedule Item 3)',
    legalStatus: 'in_force',
    description: 'Verifying granular purpose toggles and unconditional withdrawal portal, ensuring withdrawal of consent is as easy as giving consent, with no fees, punitive measures, or deceptive dark patterns.',
    remediation: 'Provide granular category consent toggles and a persistent, 1-click cookie preference/consent withdrawal center across all pages.',
    empiricalScope: 'Cookie preference modal audit, category toggle autonomy check, withdrawal ease testing, and cookie deletion verification.'
  },
  {
    id: 'authorized_login_safeguards',
    title: 'Authentication Safeguards (Sec 8(5))',
    category: 'Security Safeguards',
    sectionReference: 'Section 8(5)',
    rulesReference: 'Rule 6 (2025)',
    penaltyCap: 'Up to ₹250 Cr',
    penaltyText: 'Statutory Cap: Up to ₹250 Cr (Schedule Item 1)',
    legalStatus: 'in_force',
    description: 'Evaluating test account authentication safeguards or public-scope boundary, validating TLS/HTTPS encryption, masking of sensitive credential inputs, session isolation, and reasonable security safeguards to prevent personal data breaches.',
    remediation: 'Enforce HTTPS encryption, credential masking in password fields, and strict session isolation across authenticated user pathways.',
    empiricalScope: 'TLS 1.2+ protocol check, password input masking verification, credential transport boundary, and authorized scope containment.'
  }
];

export default function DocumentsAndLegalFrameworkPage() {
  const [activeMainTab, setActiveMainTab] = useState('legal_framework'); // 'legal_framework' | 'documents'
  const [legalSubTab, setLegalSubTab] = useState('stages'); // 'stages' | 'scenarios' | 'faq' | 'registry'
  
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
  const [scenarioSearchQuery, setScenarioSearchQuery] = useState('');
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

  const filteredScenarios = STATUTORY_SCENARIOS_6.filter((sc) => {
    if (!scenarioSearchQuery) return true;
    const q = scenarioSearchQuery.toLowerCase();
    return (
      sc.title.toLowerCase().includes(q) ||
      sc.description.toLowerCase().includes(q) ||
      sc.sectionReference.toLowerCase().includes(q) ||
      sc.penaltyCap.toLowerCase().includes(q) ||
      sc.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf2ed] border border-[#d0e2d5] text-[#2d523e] text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>DPDP Act 2023 & DPDP Rules 2025 Statutory Reference Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Legal Framework, Statutory Stages & Evidence Scenarios
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
            Statutory Compliance Stages, Evidence-Based Statutory Scenarios (6), Data Protection Board of India (DPB) guidelines, and organization privacy policies.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => {
              loadDocuments();
              loadLegalFramework();
            }}
            className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 shadow-2xs transition-colors"
            title="Refresh All Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            href="/portal/assessments"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 shadow-2xs transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-[#2d523e]" />
            <span>View Assessments</span>
          </Link>

          {activeMainTab === 'documents' && (
            <button
              onClick={() => {
                setError('');
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#2d523e] hover:bg-[#234232] text-white shadow-2xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Privacy Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveMainTab('legal_framework')}
          id="tab-legal-framework"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeMainTab === 'legal_framework'
              ? 'bg-[#2d523e] text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Statutory Framework & Registry</span>
        </button>

        <button
          onClick={() => setActiveMainTab('documents')}
          id="tab-privacy-documents"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeMainTab === 'documents'
              ? 'bg-[#2d523e] text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Organization Privacy Documents ({documents.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 2026 LEGAL FRAMEWORK, STAGES, SCENARIOS & DPB FAQ */}
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
                <span className="text-xs font-bold text-stone-800">
                  {registryMetadata?.primaryAct || 'Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)'}
                </span>
              </div>
              <p className="text-xs text-stone-600">
                Incorporates <strong>Digital Personal Data Protection Rules, 2025</strong> and MeitY Commencement Notification <strong>S.O. 4930(E) dated 13 November 2025</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono flex-shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#2d523e]" />
              <span>Framework In Force: 2026</span>
            </div>
          </div>

          {/* Sub Navigation Bar: Stages vs Scenarios vs DPB FAQ vs Registry */}
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-stone-200 pb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setLegalSubTab('stages')}
                id="subtab-stages"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  legalSubTab === 'stages'
                    ? 'bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Statutory Compliance Stages (7)
              </button>
              <button
                onClick={() => setLegalSubTab('scenarios')}
                id="subtab-scenarios"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  legalSubTab === 'scenarios'
                    ? 'bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Evidence-Based Statutory Scenarios (6)
              </button>
              <button
                onClick={() => setLegalSubTab('faq')}
                id="subtab-faq"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  legalSubTab === 'faq'
                    ? 'bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                DPB FAQ ({dpbFaq.length})
              </button>
              <button
                onClick={() => setLegalSubTab('registry')}
                id="subtab-registry"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  legalSubTab === 'registry'
                    ? 'bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Requirements Registry ({requirements.length})
              </button>
            </div>

            {legalSubTab === 'scenarios' && (
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 6 scenarios..."
                  value={scenarioSearchQuery}
                  onChange={(e) => setScenarioSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#2d523e]"
                />
              </div>
            )}

            {legalSubTab === 'faq' && (
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search DPB FAQ..."
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#2d523e]"
                />
              </div>
            )}

            {legalSubTab === 'registry' && (
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 29 statutory rules..."
                  value={registrySearchQuery}
                  onChange={(e) => setRegistrySearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#2d523e]"
                />
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SUB-VIEW 1: STATUTORY COMPLIANCE STAGES (7) */}
          {/* ========================================================================= */}
          {legalSubTab === 'stages' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#eaf2ed] text-[#2d523e] text-xs font-semibold border border-[#d0e2d5]">
                    <Scale className="w-3.5 h-3.5" />
                    <span>DPDP Act 2023 & DPDP Rules 2025</span>
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">
                    Statutory Compliance Stages
                  </h2>
                  <p className="text-xs text-stone-500">
                    Every automated evaluation executes through the 7 statutory stages under the Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {STATUTORY_COMPLIANCE_STAGES.map((stg) => (
                    <div
                      key={stg.stage}
                      className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-[#2d523e]/50 hover:shadow-xs transition-all space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5]">
                            Stage {stg.stage}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${stg.badgeColor}`}>
                            {stg.penaltyText}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-stone-900 leading-snug">
                          {stg.title}
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {stg.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                        <span>{stg.reference}</span>
                        <span className="text-[#2d523e] font-semibold">Stage {stg.stage} of 7</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-stone-700">
                    <CheckCircle className="w-4 h-4 text-[#2d523e] flex-shrink-0" />
                    <span>All 7 stages are executed synchronously in the direct worker-free architecture with empirical screenshot evidence.</span>
                  </div>
                  <Link
                    href="/portal/onboarding"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d523e] hover:underline flex-shrink-0"
                  >
                    <span>Run Full Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-VIEW 2: EVIDENCE-BASED STATUTORY SCENARIOS (6) */}
          {/* ========================================================================= */}
          {legalSubTab === 'scenarios' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-200 pb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#eaf2ed] text-[#2d523e] text-xs font-semibold border border-[#d0e2d5]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>DPDP Act 2023 & DPDP Rules 2025</span>
                    </div>
                    <h2 className="text-xl font-bold text-stone-900">
                      Evidence-Based Statutory Scenarios (6)
                    </h2>
                    <p className="text-xs text-stone-500">
                      Core compliance scenarios evaluated under statutory provisions with penalty caps up to ₹250 Cr and empirical observation triggers.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-[#eaf2ed] text-[#2d523e] font-semibold border border-[#d0e2d5]">
                      2026 S.O. 4930(E) Ready
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredScenarios.map((sc, idx) => (
                    <div
                      key={sc.id}
                      className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-4 hover:border-stone-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-[#2d523e] bg-[#eaf2ed] px-2.5 py-0.5 rounded border border-[#d0e2d5] uppercase">
                              Scenario {idx + 1} &bull; {sc.category}
                            </span>
                            <StatusBadge status={sc.legalStatus} size="xs" />
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 font-mono">
                              {sc.sectionReference}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                              {sc.rulesReference}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-stone-900 pt-1">
                            {sc.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 font-mono">
                            {sc.penaltyCap}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                        <div className="space-y-1.5 p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
                          <span className="font-bold text-stone-800 flex items-center gap-1.5">
                            <Scale className="w-3.5 h-3.5 text-[#2d523e]" />
                            <span>Technical Statutory Evaluation Scope</span>
                          </span>
                          <p className="text-stone-600 leading-relaxed">
                            {sc.description}
                          </p>
                        </div>

                        <div className="space-y-1.5 p-3.5 rounded-xl bg-[#f7faf8] border border-[#d0e2d5]">
                          <span className="font-bold text-[#2d523e] flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2d523e]" />
                            <span>Mandated Statutory Remediation</span>
                          </span>
                          <p className="text-stone-700 leading-relaxed">
                            {sc.remediation}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-stone-500 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#2d523e]" />
                          <span>Empirical Triggers: {sc.empiricalScope}</span>
                        </span>
                        <span className="text-stone-400">
                          Penalty Cap: {sc.penaltyCap}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-VIEW 3: DPB FAQ ACCORDION */}
          {/* ========================================================================= */}
          {legalSubTab === 'faq' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3 text-xs text-stone-600">
                <Info className="w-4 h-4 text-[#2d523e] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 font-semibold block">Regulatory Architecture Notice:</strong>
                  The Data Protection Board of India (DPBI) functions under Sections 18&ndash;33 of the DPDP Act. DPDP Vault explicitly separates <strong>Board governance rules</strong> (internal selection, civil court procedures, appellate pathways) from <strong>Data Fiduciary website compliance obligations</strong> (consent notices, cookie opt-ins, DPO disclosures) so that non-website provisions do not distort your site&apos;s compliance score.
                </div>
              </div>

              {loadingLegal ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-stone-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filteredFaqs.length === 0 ? (
                <p className="text-xs text-stone-500 italic py-6 text-center">No FAQ matches your search query.</p>
              ) : (
                <div className="space-y-3">
                  {filteredFaqs.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-stone-50/70 transition-colors"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono font-bold text-[#2d523e] bg-[#eaf2ed] px-2 py-0.5 rounded border border-[#d0e2d5]">
                                {faq.category}
                              </span>
                              <span className="text-[10px] font-mono text-stone-500">
                                {faq.legalReference}
                              </span>
                              <StatusBadge status={faq.status} size="xs" />
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                                {faq.isWebsiteCheck ? 'Website Obligation' : 'Board Governance Reference'}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-stone-900 leading-snug">
                              {faq.question}
                            </h3>
                          </div>

                          <div className="text-stone-400 mt-1 flex-shrink-0">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 border-t border-stone-100 bg-stone-50/50 space-y-3 text-xs leading-relaxed text-stone-700">
                            <p>{faq.answer}</p>
                            <div className="flex items-center justify-between gap-4 pt-2 border-t border-stone-200/60 text-[11px] text-stone-500 font-mono">
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

          {/* ========================================================================= */}
          {/* SUB-VIEW 4: 29 STATUTORY REQUIREMENTS REGISTRY EXPLORER */}
          {/* ========================================================================= */}
          {legalSubTab === 'registry' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap p-1.5 bg-white border border-stone-200 rounded-xl shadow-2xs text-xs">
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
                        : 'text-stone-600 hover:text-stone-900'
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
                    className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 transition-all shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-[#2d523e] bg-[#eaf2ed] px-2 py-0.5 rounded border border-[#d0e2d5]">
                            {req.sectionOrRule}
                          </span>
                          <span className="text-[10px] font-mono text-stone-500">
                            {req.requirementId}
                          </span>
                        </div>
                        <StatusBadge status={req.applicabilityStatus} size="xs" />
                      </div>

                      <h3 className="text-sm font-bold text-stone-900 leading-snug">
                        {req.title}
                      </h3>

                      <p className="text-xs text-stone-600 leading-relaxed">
                        {req.expectedControl || req.reviewerGuidance}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 space-y-2 text-[11px]">
                      {/* Classification & Scope */}
                      <div className="flex items-center justify-between gap-2 text-stone-500">
                        <span>Classification:</span>
                        <span className={`font-semibold px-2 py-0.5 rounded ${
                          req.isWebsiteComplianceCheck
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}>
                          {req.isWebsiteComplianceCheck ? 'Website Audited Check' : 'Board Governance Reference'}
                        </span>
                      </div>

                      {/* Penalty Reference if present */}
                      {req.penaltyReference?.maxPenaltyAmount && (
                        <div className="flex items-center justify-between gap-2 text-stone-600">
                          <span>Statutory Penalty Cap:</span>
                          <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Up to {req.penaltyReference.maxPenaltyAmount} ({req.penaltyReference.scheduleEntry})
                          </span>
                        </div>
                      )}

                      {/* Effective Date & Source Provenance */}
                      <div className="flex items-center justify-between gap-2 text-[10px] text-stone-400 font-mono pt-1">
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
                <div key={i} className="h-24 bg-white border border-stone-200 animate-pulse rounded-xl" />
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
                  className="p-5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all space-y-3 shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#eaf2ed] text-[#2d523e] border border-[#d0e2d5]">
                        {doc.documentType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-stone-400 capitalize">
                        {doc.sourceType}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 leading-snug">
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
                      <p className="text-xs text-stone-500 font-mono">
                        {doc.fileName || 'Uploaded text snippet'}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">Add Regulatory Privacy Document</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
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
                <label className="block font-medium text-stone-700 mb-1">Target Organization *</label>
                <select
                  value={formData.organizationId}
                  onChange={(e) => setFormData((p) => ({ ...p, organizationId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 text-stone-900 focus:border-[#2d523e] focus:outline-none"
                >
                  {organizations.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Document Category *</label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData((p) => ({ ...p, documentType: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 text-stone-900 focus:border-[#2d523e] focus:outline-none"
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
                <label className="block font-medium text-stone-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Production Privacy Notice 2026"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 text-stone-900 focus:border-[#2d523e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Source Format *</label>
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
                  <label className="block font-medium text-stone-700 mb-1">Live Document URL *</label>
                  <input
                    type="url"
                    placeholder="https://example.com/privacy"
                    value={formData.url}
                    onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 text-stone-900 font-mono text-xs focus:border-[#2d523e] focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Policy Text Excerpt *</label>
                  <textarea
                    rows={4}
                    placeholder="Paste full text or relevant excerpt of privacy terms..."
                    value={formData.fileContentText}
                    onChange={(e) => setFormData((p) => ({ ...p, fileContentText: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 text-stone-900 text-xs font-mono focus:border-[#2d523e] focus:outline-none"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#2d523e] hover:bg-[#234131] text-white shadow-2xs transition-all disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-stone-200 shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900">{previewDoc.title}</h3>
                <span className="text-[10px] text-stone-500 uppercase">
                  {previewDoc.documentType.replace(/_/g, ' ')}
                </span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-mono whitespace-pre-wrap leading-relaxed">
              {previewDoc.extractedText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
