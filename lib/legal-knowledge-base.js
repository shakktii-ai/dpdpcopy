/**
 * Authoritative Legal Knowledge Base for the DPDP Assessment Engine
 * 
 * Primary Official Government Legal Reference Documents:
 * 1. Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)
 *    Enacted by Parliament of India; Assented to by the President on 11 August 2023
 *    Official Source: public/DPDP Act 2023.pdf
 * 
 * 2. Digital Personal Data Protection Rules, 2025 (G.S.R. 846(E))
 *    Published by Ministry of Electronics and Information Technology (MeitY) on 13 November 2025
 *    Official Source: public/DPDP_Rules_2025_English_only.pdf
 * 
 * Mandatory Commencement Framework:
 * - Act 2023: Sections commence as notified under Section 1(2).
 * - Rules 2025 Rule 1(2): Rules 1, 2, and 17 to 21 came into force on date of publication (13 November 2025).
 * - Rules 2025 Rule 1(3): Rule 4 comes into force 1 year after publication (13 November 2026).
 * - Rules 2025 Rule 1(4): Rules 3, 5 to 16, 22, and 23 come into force 18 months after publication (13 May 2027).
 */

export const OFFICIAL_SOURCES = {
  ACT_2023: {
    name: 'Digital Personal Data Protection Act, 2023',
    shortName: 'DPDP Act 2023',
    actNumber: 'Act No. 22 of 2023',
    enactmentDate: '2023-08-11',
    gazetteRef: 'Gazette of India Extraordinary Part II Section 1',
    filePath: 'public/DPDP Act 2023.pdf',
  },
  RULES_2025: {
    name: 'Digital Personal Data Protection Rules, 2025',
    shortName: 'DPDP Rules 2025',
    notificationNumber: 'G.S.R. 846(E)',
    gazetteDate: '2025-11-13',
    gazetteRef: 'Gazette of India Extraordinary Part II Section 3(i)',
    filePath: 'public/DPDP_Rules_2025_English_only.pdf',
    commencementTimeline: {
      immediate: {
        rules: ['1', '2', '17', '18', '19', '20', '21'],
        effectiveDate: '2025-11-13',
        description: 'Rules 1, 2 and 17 to 21 in force from date of publication (13 November 2025).',
      },
      oneYear: {
        rules: ['4'],
        effectiveDate: '2026-11-13',
        description: 'Rule 4 in force one year after publication (13 November 2026).',
      },
      eighteenMonths: {
        rules: ['3', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '22', '23'],
        effectiveDate: '2027-05-13',
        description: 'Rules 3, 5 to 16, 22 and 23 in force eighteen months after publication (13 May 2027).',
      },
    },
  },
};

/**
 * Statutory Penalties from THE SCHEDULE of DPDP Act 2023 [See Section 33(1)]
 */
export const STATUTORY_PENALTIES = {
  ITEM_1: {
    itemNumber: 1,
    provision: 'Section 8(5)',
    description: 'Breach in observing the obligation to take reasonable security safeguards to prevent personal data breach under sub-section (5) of section 8.',
    maxPenaltyText: 'Up to ₹250 Crore',
    maxPenaltyAmountInr: 2500000000,
  },
  ITEM_2: {
    itemNumber: 2,
    provision: 'Section 8(6)',
    description: 'Breach in observing the obligation to give the Board or affected Data Principal notice of a personal data breach under sub-section (6) of section 8.',
    maxPenaltyText: 'Up to ₹200 Crore',
    maxPenaltyAmountInr: 2000000000,
  },
  ITEM_3: {
    itemNumber: 3,
    provision: 'Section 9',
    description: 'Breach in observance of additional obligations in relation to children under section 9.',
    maxPenaltyText: 'Up to ₹200 Crore',
    maxPenaltyAmountInr: 2000000000,
  },
  ITEM_4: {
    itemNumber: 4,
    provision: 'Section 10',
    description: 'Breach in observance of additional obligations of Significant Data Fiduciary under section 10.',
    maxPenaltyText: 'Up to ₹150 Crore',
    maxPenaltyAmountInr: 1500000000,
  },
  ITEM_5: {
    itemNumber: 5,
    provision: 'Section 15',
    description: 'Breach in observance of the duties under section 15 by Data Principal.',
    maxPenaltyText: 'Up to ₹10,000',
    maxPenaltyAmountInr: 10000,
  },
  ITEM_6: {
    itemNumber: 6,
    provision: 'Section 32',
    description: 'Breach of any term of voluntary undertaking accepted by the Board under section 32.',
    maxPenaltyText: 'Up to the extent applicable for the breach',
    maxPenaltyAmountInr: null,
  },
  ITEM_7: {
    itemNumber: 7,
    provision: 'Residual Catch-All',
    description: 'Breach of any other provision of this Act or the rules made thereunder.',
    maxPenaltyText: 'Up to ₹50 Crore',
    maxPenaltyAmountInr: 500000000,
  },
};

/**
 * Authoritative Section & Rule Mappings for Website Assessment Checks
 */
export const STATUTORY_REQUIREMENTS = {
  // Notice Obligation: Act Section 5(1), Rules 2025 Rule 3
  NOTICE_ITEMIZED: {
    requirementId: 'DPDP-ACT-SEC-5-NOTICE',
    sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
    actSection: 'Section 5(1)',
    rulesReference: 'Rule 3 (2025)',
    title: 'Pre-Consent Itemized Privacy Notice Disclosures',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    commencementStatus: 'in_force',
    effectiveDate: '2023-08-11',
    ruleEffectiveDate: '2027-05-13', // Rule 3 has 18-month rollout
    penaltySchedule: STATUTORY_PENALTIES.ITEM_7,
    legalMandate: `Section 5(1) of the DPDP Act 2023 mandates that every consent request must be preceded or accompanied by a notice informing the Data Principal of: (i) personal data collected and specified purpose; (ii) manner of exercising withdrawal rights under Sec 6(4) and grievance redressal under Sec 13; and (iii) manner of making complaint to the Board. Rule 3 of DPDP Rules 2025 additionally requires itemised description, clear language, independent presentation, and direct communication links.`,
    pageCategory: 'privacy_policy',
    expectedPageName: 'Privacy Policy Page',
    applicablePages: ['/privacy', '/privacy-policy', '/data-protection'],
    keyDisclosuresRequired: [
      'Itemised categories of personal data collected',
      'Specified, granular purposes of processing',
      'Direct link/instructions for consent withdrawal',
      'Detailed procedure for exercising Data Principal rights (access, correction, erasure)',
      'Grievance Officer contact details and escalation timeline',
      'Procedure to lodge complaints with the Data Protection Board of India (DPBI)',
    ],
  },

  // Consent Mechanism: Act Section 6(1), Section 6(2)
  CONSENT_AFFIRMATIVE: {
    requirementId: 'DPDP-ACT-SEC-6-CONSENT-ITEMIZED',
    sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
    actSection: 'Section 6(1)',
    rulesReference: 'Section 6(2), Section 6(3)',
    title: 'Free, Specific, Informed, Unconditional & Affirmative Consent',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    commencementStatus: 'in_force',
    effectiveDate: '2023-08-11',
    penaltySchedule: STATUTORY_PENALTIES.ITEM_7,
    legalMandate: `Section 6(1) provides that consent must be free, specific, informed, unconditional, and unambiguous with a clear affirmative action. Consent cannot be inferred from silence, inactivity, or pre-ticked checkboxes. Section 6(2) makes any consent invalid to the extent it infringes the Act.`,
    pageCategory: 'consent_banner',
    expectedPageName: 'Consent & Cookie Banner',
    applicablePages: ['/', '/index', 'all_landing_pages'],
    keyDisclosuresRequired: [
      'Unchecked default state (no pre-selected consent boxes)',
      'Equally prominent Accept and Reject/Decline options',
      'Granular consent categories (Analytics, Marketing, Preferences) separate from Essential',
      'Absence of dark patterns or manipulative nudging',
      'Technical gating: non-essential scripts blocked until affirmative consent is given',
    ],
  },

  // Consent Withdrawal: Act Section 6(4), Rules 2025 Rule 3(c)(i)
  CONSENT_WITHDRAWAL: {
    requirementId: 'DPDP-ACT-SEC-6-WITHDRAWAL',
    sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
    actSection: 'Section 6(4)',
    rulesReference: 'Rule 3(c)(i) (2025)',
    title: 'Right & Comparable Ease of Consent Withdrawal',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    commencementStatus: 'in_force',
    effectiveDate: '2023-08-11',
    ruleEffectiveDate: '2027-05-13',
    penaltySchedule: STATUTORY_PENALTIES.ITEM_7,
    legalMandate: `Section 6(4) guarantees the Data Principal the unconditional right to withdraw consent at any time, with the ease of doing so being comparable to the ease with which consent was given. Rule 3(c)(i) requires a direct communication link or mechanism on the website/app for withdrawal.`,
    pageCategory: 'withdrawal_portal',
    expectedPageName: 'Consent Management & Withdrawal Settings',
    applicablePages: ['all_pages_footer', '/cookie-settings', '/preferences'],
    keyDisclosuresRequired: [
      'Persistent "Cookie Preferences" or "Manage Consent" link in the global website footer',
      '1-click or comparable toggle to revoke consent previously given',
      'Clear statement that withdrawal does not affect lawfulness of prior processing',
      'Automated cessation of tracking upon toggle deactivation',
    ],
  },

  // Reasonable Security Safeguards: Act Section 8(5), Rules 2025 Rule 6
  SECURITY_SAFEGUARDS: {
    requirementId: 'DPDP-ACT-SEC-8-5-SECURITY-SAFEGUARDS',
    sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
    actSection: 'Section 8(5)',
    rulesReference: 'Rule 6 (2025)',
    title: 'Reasonable Security Safeguards to Prevent Personal Data Breach',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    commencementStatus: 'in_force',
    effectiveDate: '2023-08-11',
    ruleEffectiveDate: '2027-05-13',
    penaltySchedule: STATUTORY_PENALTIES.ITEM_1, // Max ₹250 Crore!
    legalMandate: `Section 8(5) requires Data Fiduciaries to protect personal data by taking reasonable security safeguards to prevent personal data breaches. Breach of Section 8(5) carries the highest penalty under Schedule Item 1 (up to ₹250 Crore). Rule 6 specifies encryption, obfuscation, masking, access controls, and retaining logs for 1 year.`,
    pageCategory: 'security_forms',
    expectedPageName: 'Authentication & Form Endpoints',
    applicablePages: ['/login', '/register', '/contact', '/checkout'],
    keyDisclosuresRequired: [
      'HTTPS/TLS encryption enforced across all transmission pathways',
      'Masked password inputs (type="password") preventing shoulder surfing',
      'Secure session cookies (Secure, HttpOnly, SameSite attributes)',
      'Form submission endpoints must not leak credentials into GET parameters or logs',
    ],
  },

  // Retention & Purpose Completion: Act Section 8(7), Rules 2025 Rule 8 & Third Schedule
  DATA_RETENTION: {
    requirementId: 'DPDP-ACT-SEC-8-7-RETENTION-ERASURE',
    sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
    actSection: 'Section 8(7)',
    rulesReference: 'Rule 8 & Third Schedule (2025)',
    title: 'Personal Data Retention Limitations & Erasure Workflows',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    commencementStatus: 'in_force',
    effectiveDate: '2023-08-11',
    ruleEffectiveDate: '2027-05-13',
    penaltySchedule: STATUTORY_PENALTIES.ITEM_7,
    legalMandate: `Section 8(7) requires erasure of personal data upon consent withdrawal or as soon as the specified purpose is no longer served. Rule 8 and the Third Schedule prescribe specific time periods for purpose completion (e.g. 3 years of user inactivity for large e-commerce entities) and 48-hour prior intimation before erasure.`,
    pageCategory: 'privacy_policy',
    expectedPageName: 'Privacy Policy Page (Data Retention Section)',
    applicablePages: ['/privacy', '/privacy-policy'],
    keyDisclosuresRequired: [
      'Explicit purpose-bound retention periods instead of indefinite claims',
      'Criteria used to determine retention durations',
      'Policy on automatic deletion/anonymization upon purpose fulfillment or consent withdrawal',
      'Statutory 48-hour prior intimation notice before account erasure for inactivity',
    ],
  },

  // Grievance Redressal Mechanism: Act Section 8(9), Section 13, Rules 2025 Rule 9 & Rule 14(3)
  GRIEVANCE_OFFICER: {
    requirementId: 'DPDP-ACT-SEC-8-9-GRIEVANCE-OFFICER',
    sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
    actSection: 'Section 8(9), Section 13',
    rulesReference: 'Rule 9, Rule 14(3) (2025)',
    title: 'Statutory Grievance Redressal Mechanism & Officer Publication',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    commencementStatus: 'in_force',
    effectiveDate: '2023-08-11',
    ruleEffectiveDate: '2027-05-13',
    penaltySchedule: STATUTORY_PENALTIES.ITEM_7,
    legalMandate: `Section 8(9) requires Data Fiduciaries to establish an effective grievance redressal mechanism and publish contact details of a Data Protection Officer or authorized person. Section 13 grants Data Principals the right of grievance redressal, and exhausting internal redressal is a statutory prerequisite under Section 27 before filing DPBI complaints. Rule 9 requires prominent publication of business contact details. Rule 14(3) mandates publishing the grievance system with response turnaround not exceeding 90 days.`,
    pageCategory: 'grievance_section',
    expectedPageName: 'Privacy Policy / Contact Us Page',
    applicablePages: ['/privacy', '/contact', '/grievance'],
    keyDisclosuresRequired: [
      'Designated Grievance Officer / DPO full name or official designation',
      'Dedicated electronic communication channel (official email address or portal link)',
      'Physical postal communication address in India',
      'Turnaround resolution timeline (statutory maximum 90 days, standard SLA 30 days)',
      'Escalation pathway to the Data Protection Board of India (DPBI)',
    ],
  },

  // Children Personal Data: Act Section 9, Rules 2025 Rule 10, Rule 11, Rule 12 & Fourth Schedule
  CHILDREN_DATA: {
    requirementId: 'DPDP-ACT-SEC-9-CHILDREN-DATA',
    sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
    actSection: 'Section 9(1), 9(2), 9(3)',
    rulesReference: 'Rule 10, 11, 12 & Fourth Schedule (2025)',
    title: 'Verifiable Parental Consent & Child Protection Safeguards',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    commencementStatus: 'in_force',
    effectiveDate: '2023-08-11',
    ruleEffectiveDate: '2027-05-13',
    penaltySchedule: STATUTORY_PENALTIES.ITEM_3, // Max ₹200 Crore!
    legalMandate: `Section 9 prohibits processing personal data of children (under 18) without verifiable parental consent, prohibits processing causing detrimental effect to child well-being (Sec 9(2)), and prohibits tracking, behavioral monitoring, or targeted advertising directed at children (Sec 9(3)). Schedule Item 3 imposes penalties up to ₹200 Crore. Rule 10 defines verifiable consent through reliable identity/age verification or government authorized entities/DigiLocker.`,
    pageCategory: 'registration_page',
    expectedPageName: 'Registration & Onboarding Page',
    applicablePages: ['/register', '/signup', '/privacy'],
    keyDisclosuresRequired: [
      'Age verification gate or declaration upon registration',
      'Verifiable parental consent workflow for users under 18',
      'Explicit commitment not to conduct behavioral profiling, tracking, or targeted ads on minors',
      'Parental rights to access, review, or delete child data',
    ],
  },

  // Data Principal Rights: Act Sections 11, 12, 13, 14, Rules 2025 Rule 14
  DATA_PRINCIPAL_RIGHTS: {
    requirementId: 'DPDP-ACT-SEC-11-14-RIGHTS',
    sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
    actSection: 'Sections 11, 12, 13, 14',
    rulesReference: 'Rule 14 (2025)',
    title: 'Facilitation of Data Principal Rights (Access, Correction, Erasure, Nomination)',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    commencementStatus: 'in_force',
    effectiveDate: '2023-08-11',
    ruleEffectiveDate: '2027-05-13',
    penaltySchedule: STATUTORY_PENALTIES.ITEM_7,
    legalMandate: `Act Sections 11-14 grant rights of access (summary of data and third-party fiduciaries shared with), correction/completion/erasure, grievance redressal, and nomination in the event of death/incapacity. Rule 14(1) mandates prominent publication of the means to make requests and required identifiers.`,
    pageCategory: 'privacy_policy',
    expectedPageName: 'Privacy Policy Page (Your Rights Section)',
    applicablePages: ['/privacy', '/user-rights', '/account/privacy'],
    keyDisclosuresRequired: [
      'Right to Access: Summary of personal data and third-party identities shared with',
      'Right to Correction & Erasure: Easy procedure to rectify inaccuracies or request deletion',
      'Right of Grievance Redressal: Escalation procedure',
      'Right to Nominate: Facility to appoint a nominee in case of death or incapacity',
      'Clear means (form, portal, email) to submit rights requests without unreasonable barriers',
    ],
  },

  // Contact / Form Level Privacy Notice: Act Section 4, 5, 6(1)
  FORM_LEVEL_NOTICE: {
    requirementId: 'DPDP-ACT-SEC-4-FORM-NOTICE',
    sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
    actSection: 'Section 4, Section 5(1), Section 6(1)',
    rulesReference: 'Rule 3 (2025)',
    title: 'Interactive Form-Level Privacy Notice & Affirmative Opt-In',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    commencementStatus: 'in_force',
    effectiveDate: '2023-08-11',
    penaltySchedule: STATUTORY_PENALTIES.ITEM_7,
    legalMandate: `Collection of personal data through web forms (contact, inquiries, newsletter, lead generation) requires a clear pre-submission notice informing the user of the exact purpose of collection, a link to the full Privacy Policy, and an unbundled affirmative consent checkbox.`,
    pageCategory: 'contact_form',
    expectedPageName: 'Contact Us / Interactive Forms Page',
    applicablePages: ['/contact', '/contact-us', '/newsletter', '/inquiry'],
    keyDisclosuresRequired: [
      'Purpose notice adjacent to the form submit button',
      'Direct hyperlink to the full Privacy Policy',
      'Separate affirmative checkbox for marketing/promotional communications',
      'No pre-checked checkboxes for consent',
    ],
  },

  // Multi-Lingual Notice: Act Section 5(3), Rules 2025 Rule 3
  MULTI_LINGUAL_NOTICE: {
    requirementId: 'DPDP-RULES-2025-RULE-3-NOTICE-FORMAT',
    sourceDocument: OFFICIAL_SOURCES.RULES_2025.name,
    actSection: 'Section 5(3)',
    rulesReference: 'Rule 3 (2025)',
    title: 'Multi-Lingual Notice Accessibility (8th Schedule Indian Languages)',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    commencementStatus: 'upcoming_compliance',
    effectiveDate: '2027-05-13', // 18 months from 13 Nov 2025
    penaltySchedule: STATUTORY_PENALTIES.ITEM_7,
    legalMandate: `Section 5(3) provides that Data Principals shall have the option to access notice in English or any language specified in the Eighth Schedule to the Constitution of India. Rule 3 comes into force 18 months after gazette publication (13 May 2027). Treated as an Upcoming Compliance / Readiness Gap.`,
    pageCategory: 'privacy_policy',
    expectedPageName: 'Privacy Policy & Notice Banner',
    applicablePages: ['/privacy', '/'],
    keyDisclosuresRequired: [
      'Option to view notice in English or 8th Schedule Indian languages (e.g. Hindi, Bengali, Marathi, Tamil, Telugu)',
      'Language switcher interface prominently placed near notice',
      'Plain, easily understandable translation maintaining legal precision',
    ],
  },
};

/**
 * Checks whether a legal requirement is currently in force or an upcoming compliance gap.
 * 
 * @param {string|Date} [assessmentDate=new Date()]
 * @param {string} effectiveDateStr - e.g. '2027-05-13'
 * @returns {{
 *   isInForce: boolean,
 *   commencementStatus: 'in_force' | 'upcoming_compliance' | 'verification_required',
 *   daysRemaining: number | null,
 *   note: string
 * }}
 */
export function evaluateCommencement(effectiveDateStr, assessmentDate = new Date()) {
  if (!effectiveDateStr) {
    return {
      isInForce: false,
      commencementStatus: 'verification_required',
      daysRemaining: null,
      note: 'Commencement notification pending official gazette verification.',
    };
  }

  const ref = new Date(assessmentDate);
  const eff = new Date(effectiveDateStr);
  const diffMs = eff.getTime() - ref.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs > 0) {
    return {
      isInForce: false,
      commencementStatus: 'upcoming_compliance',
      daysRemaining: days,
      note: `Upcoming requirement: Effective on ${effectiveDateStr} (${days} days remaining). Must be shown as a Readiness Gap, not a current violation.`,
    };
  }

  return {
    isInForce: true,
    commencementStatus: 'in_force',
    daysRemaining: 0,
    note: `In force since ${effectiveDateStr}. Currently enforceable.`,
  };
}

