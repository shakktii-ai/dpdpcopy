import { NextResponse } from 'next/server';
import {
  OFFICIAL_LEGAL_REQUIREMENTS,
  LEGAL_REGISTRY_METADATA,
} from '@/lib/requirement-registry.js';

export const dynamic = 'force-dynamic';

/**
 * Curated, authoritative FAQ on the Data Protection Board of India (DPBI)
 * derived from:
 * "Frequently Asked Questions: Digital Personal Data Protection Framework — DPDP Act, 2023 and DPDP Rules, 2025"
 */
export const DPBI_FAQ_ITEMS = [
  {
    id: 'faq-1',
    category: 'Board Establishment & Character',
    question: 'What is the Data Protection Board of India (DPBI) and its core statutory mandate?',
    legalReference: 'DPDP Act, 2023 Section 2(c), Section 18',
    status: 'enacted',
    effectiveDate: '2023-08-11',
    answer: 'The Data Protection Board of India (DPBI) is an independent body corporate established by the Central Government under Section 18 of the DPDP Act, 2023. It has perpetual succession, a common seal, and the power to acquire, hold, and dispose of property and sue or be sued. Its statutory mandate is to function as a digital enforcement authority that inquires into personal data breaches, adjudicates complaints, directs remediation, and imposes monetary penalties.',
    targetRole: 'board_governance',
    isWebsiteCheck: false
  },
  {
    id: 'faq-2',
    category: 'Composition & Qualifications',
    question: 'What is the composition of the Board and what qualifications must Members hold?',
    legalReference: 'DPDP Act, 2023 Section 19(1), Section 19(3)',
    status: 'enacted',
    effectiveDate: '2023-08-11',
    answer: 'Under Section 19(1), the Board consists of a Chairperson and such other Members as notified by the Central Government. Under Section 19(3), Members must be persons of ability, integrity, and standing who possess special knowledge or practical experience in data governance, administration, law, consumer protection, dispute resolution, information and communications technology, digital economy, or related fields.',
    targetRole: 'board_governance',
    isWebsiteCheck: false
  },
  {
    id: 'faq-3',
    category: 'Selection & Appointment',
    question: 'How are the Chairperson and Members of the Board selected and appointed?',
    legalReference: 'DPDP Act, 2023 Section 19(2); DPDP Rules, 2025 Rule 17',
    status: 'notified',
    effectiveDate: '2025-11-13',
    answer: 'Under Section 19(2) and Rule 17, the Chairperson and Members are appointed by the Central Government on the recommendation of a high-level Search-cum-Selection Committee chaired by the Cabinet Secretary of India, ensuring transparent, merit-based selection without arbitrary executive preference.',
    targetRole: 'board_governance',
    isWebsiteCheck: false
  },
  {
    id: 'faq-4',
    category: 'Term & Reappointment',
    question: 'What is the term of office for Board Members and are they eligible for reappointment?',
    legalReference: 'DPDP Act, 2023 Section 20(2)',
    status: 'enacted',
    effectiveDate: '2023-08-11',
    answer: 'Under Section 20(2), the Chairperson and Members hold office for a statutory term of two (2) years from the date of assumption of office and are eligible for reappointment, subject to prescribed age ceilings and performance review by the Central Government.',
    targetRole: 'board_governance',
    isWebsiteCheck: false
  },
  {
    id: 'faq-5',
    category: 'Digital Office Mandate',
    question: 'How does the DPBI function as a "Digital Office"?',
    legalReference: 'DPDP Act, 2023 Section 28(1); DPDP Rules, 2025 Rule 20',
    status: 'notified',
    effectiveDate: '2025-11-13',
    answer: 'Under Section 28(1), the Board is mandated by statute to operate as a "digital by default" office. All filings, complaints, issuance of notices, submission of pleadings, examination of witnesses, oral hearings, and publication of reasoned orders are conducted through digital-by-design techno-legal mechanisms and secure online portals.',
    targetRole: 'board_governance',
    isWebsiteCheck: false
  },
  {
    id: 'faq-6',
    category: 'Inquiries & Complaints',
    question: 'Under what circumstances can the Board initiate an inquiry?',
    legalReference: 'DPDP Act, 2023 Section 27(1)(a)-(e)',
    status: 'in_force',
    effectiveDate: '2023-08-11',
    answer: 'Under Section 27(1), the Board can initiate an inquiry upon: (a) receipt of intimation of a personal data breach from a Data Fiduciary; (b) complaint made by a Data Principal; (c) complaint made by a registered Consent Manager; (d) reference received from Central or State Government; or (e) directions issued by a Court of law.',
    targetRole: 'board_governance',
    isWebsiteCheck: false
  },
  {
    id: 'faq-7',
    category: 'Grievance Prerequisite',
    question: 'Must a citizen exhaust the Data Fiduciary’s grievance redressal before complaining to the Board?',
    legalReference: 'DPDP Act, 2023 Section 27; DPDP Rules, 2025 Rule 9',
    status: 'notified',
    effectiveDate: '2025-11-13',
    answer: 'Yes. Under Rule 9 read with Section 27, a Data Principal is expected to first lodge a grievance with the Data Fiduciary’s designated Grievance Officer. If the Fiduciary fails to respond within the statutory SLA (period prescribed under Rules) or issues an unsatisfactory resolution, the Data Principal is entitled to escalate the dispute directly to the DPBI.',
    targetRole: 'complaint_and_grievance',
    isWebsiteCheck: true
  },
  {
    id: 'faq-8',
    category: 'Powers & Proceedings',
    question: 'What judicial powers does the Board have during inquiries?',
    legalReference: 'DPDP Act, 2023 Section 28(2)-(8)',
    status: 'in_force',
    effectiveDate: '2023-08-11',
    answer: 'Under Section 28, the Board possesses all powers vested in a Civil Court under the Code of Civil Procedure, 1908 (CPC), including: summoning and enforcing attendance of persons; requiring discovery and production of books and digital records; receiving evidence on affidavit; requisitioning public records; and issuing commissions for examination of witnesses or documents.',
    targetRole: 'board_governance',
    isWebsiteCheck: false
  },
  {
    id: 'faq-9',
    category: 'Timelines & Resolution',
    question: 'What is the statutory timeline for the Board to complete an inquiry?',
    legalReference: 'DPDP Act, 2023 Section 28; DPDP Rules, 2025',
    status: 'notified',
    effectiveDate: '2025-11-13',
    answer: 'Section 28 read with the 2025 Rules directs the Board to endeavor to conclude inquiry proceedings and issue a final reasoned determination within six (6) months from the date of admission of the complaint or reference, promoting expedited dispute resolution.',
    targetRole: 'board_governance',
    isWebsiteCheck: false
  },
  {
    id: 'faq-10',
    category: 'Schedule Penalties',
    question: 'What monetary penalties can the Board impose under the Schedule?',
    legalReference: 'DPDP Act, 2023 Section 33, The Schedule (Items 1–7)',
    status: 'in_force',
    effectiveDate: '2023-08-11',
    answer: 'The Board may impose significant statutory monetary penalties based on factors in Section 33(2): (1) Breach in observing obligation for security safeguards to prevent personal data breach: up to ₹250 Crore; (2) Failure to notify Board and affected principals of personal data breach: up to ₹200 Crore; (3) Breach of obligations in respect of children: up to ₹200 Crore; (4) Breach of additional obligations by Significant Data Fiduciaries: up to ₹150 Crore; (5) Breach of Consent Manager conditions: up to ₹50 Crore; (6) Breach of duties by Data Principal: up to ₹10,000; (7) Residual breaches of other provisions or Rules: up to ₹50 Crore.',
    targetRole: 'appeal_and_enforcement',
    isWebsiteCheck: false
  },
  {
    id: 'faq-11',
    category: 'Appeals to TDSAT',
    question: 'Where can decisions or penalty orders of the Board be appealed?',
    legalReference: 'DPDP Act, 2023 Section 2(a), Section 29',
    status: 'in_force',
    effectiveDate: '2023-08-11',
    answer: 'Under Section 29, any person or Data Fiduciary aggrieved by an order or direction of the Board may file an appeal before the Telecom Disputes Settlement and Appellate Tribunal (TDSAT) within a period of sixty (60) days. Further statutory appeals against TDSAT judgments lie before the Supreme Court of India.',
    targetRole: 'appeal_and_enforcement',
    isWebsiteCheck: false
  },
  {
    id: 'faq-12',
    category: 'Governance vs Website Scope',
    question: 'How does DPDP Vault distinguish between Board governance references and website compliance checks?',
    legalReference: 'DPDP Framework Regulatory Architecture',
    status: 'in_force',
    effectiveDate: '2023-08-11',
    answer: 'DPDP Vault explicitly segregates Board governance rules (composition, Selection Committee, civil court procedures, TDSAT jurisdiction) from client-side website compliance checks (consent notices, cookie banners, withdrawal mechanisms, DPO contacts). Board governance provisions are maintained as authoritative statutory reference cards and are never marked as website audit failures or used to distort compliance scores.',
    targetRole: 'board_governance',
    isWebsiteCheck: false
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const websiteOnly = searchParams.get('websiteOnly') === 'true';

    let filtered = OFFICIAL_LEGAL_REQUIREMENTS;

    if (category && category !== 'all') {
      filtered = filtered.filter((r) => r.category === category);
    }
    if (role && role !== 'all') {
      filtered = filtered.filter((r) => r.targetRole === role);
    }
    if (status && status !== 'all') {
      filtered = filtered.filter((r) => r.applicabilityStatus === status);
    }
    if (websiteOnly) {
      filtered = filtered.filter((r) => r.isWebsiteComplianceCheck === true);
    }

    return NextResponse.json({
      success: true,
      metadata: LEGAL_REGISTRY_METADATA,
      count: filtered.length,
      requirements: filtered,
      dpbFaq: DPBI_FAQ_ITEMS,
    });
  } catch (error) {
    console.error('Error in /api/requirements:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
