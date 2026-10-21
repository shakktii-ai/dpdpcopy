import LegalRequirement from '../models/LegalRequirement.js';
import connectDB from './mongodb.js';

export const REGISTRY_VERSION = '2026.1';
export const REGISTRY_LAST_VERIFIED = '2026-10-22';

/**
 * Authoritative 2026 DPDP Legal Requirements Registry.
 * Incorporates:
 * 1. Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)
 * 2. Digital Personal Data Protection Rules, 2025
 * 3. MeitY Official Commencement Notifications (including S.O. 4930(E) dated 13 November 2025)
 * 4. Data Protection Board of India (DPBI) Establishment & Composition Framework (Sections 18–33)
 */
export const OFFICIAL_LEGAL_REQUIREMENTS = [
  // ==========================================================================
  // GROUP 1: CORE DATA FIDUCIARY WEBSITE STATUTORY OBLIGATIONS (APPLICABLE CHECKS)
  // ==========================================================================
  {
    requirementId: 'DPDP-ACT-SEC-5-NOTICE',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 5(1)',
    title: 'Pre-Consent Itemized Privacy Notice Disclosures',
    version: REGISTRY_VERSION,
    effectiveDate: '2023-08-11',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023, Section 5; Gazette of India Extraordinary Part II Section 1.',
    category: 'data_fiduciary_obligation',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['public_pages', 'contact_forms', 'user_registration_login'],
    expectedControl: 'Notice given to Data Principal at or before requesting consent declaring specified personal data collected, processing purpose, exercise of rights under Sec 11, 12, 13, and Grievance Officer details.',
    assessmentMethod: 'automated_browser',
    requiredEvidence: 'Screenshot of privacy notice and extracted text confirming core disclosures.',
    reviewerGuidance: 'Check that notice is not bundled into lengthy Terms of Service without dedicated itemized notice.',
    defaultSeverity: 'critical',
    penaltyReference: {
      maxPenaltyAmount: '₹50 Crore',
      scheduleEntry: 'Schedule Entry 7',
      description: 'Residual breach of Data Fiduciary obligation to provide itemized notice under Section 5.',
    },
  },
  {
    requirementId: 'DPDP-ACT-SEC-6-CONSENT-ITEMIZED',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 6(1)',
    title: 'Free, Specific, Informed, Unconditional & Unambiguous Consent',
    version: REGISTRY_VERSION,
    effectiveDate: '2023-08-11',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023, Section 6(1); Gazette of India Extraordinary Part II Section 1.',
    category: 'data_fiduciary_obligation',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['contact_forms', 'cookies_analytics', 'user_registration_login', 'newsletter_subscriptions'],
    expectedControl: 'Consent must be indicated through clear affirmative action with itemized purpose options. No pre-ticked checkboxes or deceptive dark patterns.',
    assessmentMethod: 'automated_browser',
    requiredEvidence: 'DOM inspection and screenshot showing unchecked default state and affirmative consent action.',
    reviewerGuidance: 'Pre-ticked consent checkboxes violate Section 6(1). Checkbox must require positive user click.',
    defaultSeverity: 'high',
    penaltyReference: {
      maxPenaltyAmount: '₹50 Crore',
      scheduleEntry: 'Schedule Entry 7',
      description: 'Breach of affirmative consent mandate under Section 6(1).',
    },
  },
  {
    requirementId: 'DPDP-ACT-SEC-6-WITHDRAWAL',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 6(4)',
    title: 'Right & Comparable Ease of Consent Withdrawal',
    version: REGISTRY_VERSION,
    effectiveDate: '2023-08-11',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023, Section 6(4); Gazette of India Extraordinary Part II Section 1.',
    category: 'data_fiduciary_obligation',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['cookies_analytics', 'user_profiles', 'newsletter_subscriptions'],
    expectedControl: 'Data Principal has the unconditional right to withdraw consent with ease comparable to the ease with which consent was given.',
    assessmentMethod: 'hybrid',
    requiredEvidence: 'Cookie banner opt-out toggle, consent preference dashboard, or direct withdrawal interface.',
    reviewerGuidance: 'If consent was given via a 1-click banner, withdrawal must not require mailing physical letters or navigating convoluted menus.',
    defaultSeverity: 'high',
    penaltyReference: {
      maxPenaltyAmount: '₹50 Crore',
      scheduleEntry: 'Schedule Entry 7',
      description: 'Failure to provide comparable ease of consent withdrawal under Section 6(4).',
    },
  },
  {
    requirementId: 'DPDP-ACT-SEC-8-5-SECURITY-SAFEGUARDS',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 8(5)',
    title: 'Reasonable Security Safeguards to Prevent Personal Data Breach',
    version: REGISTRY_VERSION,
    effectiveDate: '2023-08-11',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023, Section 8(5); Schedule Entry 1.',
    category: 'data_fiduciary_obligation',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['user_registration_login', 'payments', 'contact_forms'],
    expectedControl: 'Implementation of reasonable technical and organizational safeguards including HTTPS encryption, masked password fields, CSRF defense, and secure session management.',
    assessmentMethod: 'automated_browser',
    requiredEvidence: 'SSL/TLS cipher validation, password masking in DOM, and secure cookie attributes.',
    reviewerGuidance: 'Verify form submission endpoint uses HTTPS and credentials are not submitted via unencrypted GET queries.',
    defaultSeverity: 'critical',
    penaltyReference: {
      maxPenaltyAmount: '₹250 Crore',
      scheduleEntry: 'Schedule Entry 1',
      description: 'Breach in observing obligation to take reasonable security safeguards to prevent personal data breach under sub-section (5) of section 8 (Maximum statutory penalty of ₹250 crore).',
    },
  },
  {
    requirementId: 'DPDP-ACT-SEC-8-7-RETENTION-ERASURE',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 8(7)',
    title: 'Personal Data Retention Limitations & Erasure Workflows',
    version: REGISTRY_VERSION,
    effectiveDate: '2023-08-11',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023, Section 8(7); Gazette of India Extraordinary Part II Section 1.',
    category: 'data_fiduciary_obligation',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['user_profiles', 'account_deletion_data_requests'],
    expectedControl: 'Personal data must be erased as soon as it is reasonable to assume that the specified purpose is no longer served or consent is withdrawn.',
    assessmentMethod: 'hybrid',
    requiredEvidence: 'Documented statutory retention schedule in Privacy Policy and account deletion workflow.',
    reviewerGuidance: 'Check if privacy policy states an explicit retention period or indefinite storage.',
    defaultSeverity: 'medium',
    penaltyReference: {
      maxPenaltyAmount: '₹50 Crore',
      scheduleEntry: 'Schedule Entry 7',
      description: 'Breach of data minimization and retention limits under Section 8(7).',
    },
  },
  {
    requirementId: 'DPDP-ACT-SEC-8-9-GRIEVANCE-OFFICER',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 8(9)',
    title: 'Statutory Grievance Redressal Mechanism & Officer Publication',
    version: REGISTRY_VERSION,
    effectiveDate: '2023-08-11',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023, Section 8(9); DPDP Rules 2025 Rule 9.',
    category: 'data_fiduciary_obligation',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['public_pages'],
    expectedControl: 'Publication of the name, official email/electronic channel, and office address of the designated Grievance Officer, with response SLA.',
    assessmentMethod: 'automated_browser',
    requiredEvidence: 'Dedicated /grievance page or privacy notice section displaying officer identity and contact channels.',
    reviewerGuidance: 'Generic support emails without designated officer name do not satisfy Section 8(9).',
    defaultSeverity: 'critical',
    penaltyReference: {
      maxPenaltyAmount: '₹50 Crore',
      scheduleEntry: 'Schedule Entry 7',
      description: 'Failure to establish statutory grievance redressal mechanism under Section 8(9).',
    },
  },
  {
    requirementId: 'DPDP-ACT-SEC-9-CHILDREN-DATA',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 9(1)',
    title: 'Verifiable Parental Consent for Processing of Children Personal Data',
    version: REGISTRY_VERSION,
    effectiveDate: '2023-08-11',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023, Section 9; Schedule Entry 3.',
    category: 'data_fiduciary_obligation',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['user_registration_login'],
    expectedControl: 'Obtain verifiable parental consent prior to processing digital personal data of an individual under 18 years of age. Prohibition of targeted behavioral tracking.',
    assessmentMethod: 'manual_verification',
    requiredEvidence: 'Age gate interface and parental verification mechanism in registration workflow.',
    reviewerGuidance: 'If service does not target minors, evaluate whether general registration excludes minors or requires parental consent.',
    defaultSeverity: 'high',
    penaltyReference: {
      maxPenaltyAmount: '₹200 Crore',
      scheduleEntry: 'Schedule Entry 3',
      description: 'Breach in observance of additional obligations in relation to children under section 9 (Up to ₹200 crore).',
    },
  },
  {
    requirementId: 'DPDP-RULES-2025-RULE-3-NOTICE-FORMAT',
    officialSource: 'Digital Personal Data Protection Rules, 2025',
    sectionOrRule: 'Rule 3',
    title: 'Multi-Lingual Notice Accessibility (8th Schedule Languages)',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_official_gazette',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Rules 2025 Rule 3; MeitY Gazette Notification S.O. 4930(E).',
    category: 'data_fiduciary_obligation',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['public_pages'],
    expectedControl: 'Notice must be easily comprehensible, presented in clear language, and offer options in English and Indian languages specified in the 8th Schedule.',
    assessmentMethod: 'automated_browser',
    requiredEvidence: 'Language selector on notice or multi-lingual translated notice availability.',
    reviewerGuidance: 'Check if notice provides accessible language switching options.',
    defaultSeverity: 'medium',
    penaltyReference: {
      maxPenaltyAmount: '₹50 Crore',
      scheduleEntry: 'Schedule Entry 7',
      description: 'Failure to provide comprehensible multi-lingual notice format under Rule 3.',
    },
  },

  // ==========================================================================
  // GROUP 2: DATA PROTECTION BOARD — ESTABLISHMENT & COMPOSITION (STATUTORY REFERENCE)
  // ==========================================================================
  {
    requirementId: 'DPDP-ACT-SEC-2-C-BOARD-DEF',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 2(c)',
    title: 'Statutory Definition of the Board (Data Protection Board of India)',
    version: REGISTRY_VERSION,
    effectiveDate: '2023-08-11',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 2(c); Gazette of India Extraordinary Part II Section 1.',
    category: 'statutory_reference',
    targetRole: 'data_protection_board',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: '"Board" means the Data Protection Board of India established by the Central Government under section 18.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory reference only; no website-level publication mandatory.',
    reviewerGuidance: 'Governance reference. Private websites are not required to publish Board definitions.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-18-BOARD-ESTABLISHMENT',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 18',
    title: 'Establishment, Legal Status & Corporate Seal of the Board',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_official_gazette',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 18; MeitY Gazette Commencement S.O. 4930(E).',
    category: 'statutory_reference',
    targetRole: 'data_protection_board',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'The Central Government establishes the Data Protection Board of India as a body corporate having perpetual succession, common seal, and power to acquire, hold and dispose of property, and to sue or be sued.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory governance reference.',
    reviewerGuidance: 'Applies to Central Government establishment of the Board. Not a Data Fiduciary website obligation.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-19-1-BOARD-COMPOSITION',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 19(1)',
    title: 'Composition of the Board (Chairperson & Members)',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_official_gazette',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 19(1); MeitY Gazette Notification S.O. 4930(E).',
    category: 'statutory_reference',
    targetRole: 'data_protection_board',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'The Board shall consist of a Chairperson and such number of other Members as the Central Government may notify.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory governance reference.',
    reviewerGuidance: 'Governance rule for Board constitution. Excluded from website scoring.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-19-3-MEMBER-QUALIFICATIONS',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 19(3)',
    title: 'Qualifications & Expertise of Chairperson and Board Members',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_official_gazette',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 19(3); MeitY Gazette Notification S.O. 4930(E).',
    category: 'statutory_reference',
    targetRole: 'data_protection_board',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Chairperson and Members must be persons of ability, integrity and standing with special knowledge or practical experience in data governance, law, consumer protection, dispute resolution, ICT, digital economy, regulation or techno-legal affairs.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory governance reference.',
    reviewerGuidance: 'Board appointment criteria. Not applicable to Data Fiduciary web applications.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-19-2-APPOINTMENT-SELECTION',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 19(2), Rule 17',
    title: 'Search-cum-Selection Committee & Appointment Process',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_official_gazette',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 19(2); DPDP Rules 2025 Rule 17; MeitY FAQ Doc Sec 2.',
    category: 'statutory_reference',
    targetRole: 'data_protection_board',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Chairperson and Members are appointed by the Central Government on the recommendation of a Search-cum-Selection Committee chaired by the Cabinet Secretary (for Chairperson) and designated committee under Rule 17 for other Members.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory governance reference.',
    reviewerGuidance: 'Selection committee procedure for Board members. Informational only.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-20-2-TERM-REAPPOINTMENT',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 20(2)',
    title: 'Tenure of Office (Two Years) & Eligibility for Re-appointment',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_official_gazette',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 20(2); MeitY Gazette Notification S.O. 4930(E).',
    category: 'statutory_reference',
    targetRole: 'data_protection_board',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Chairperson and other Members shall hold office for a term of two years and shall be eligible for re-appointment.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory governance reference.',
    reviewerGuidance: 'Tenure terms for Board officers. Excluded from website compliance scoring.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-28-1-DIGITAL-OFFICE',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 28(1), Rule 20',
    title: 'Digital Office & Techno-Legal Proceedings Architecture',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_official_gazette',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 28(1); DPDP Rules 2025 Rule 20; MeitY FAQ Doc Sec 4.',
    category: 'statutory_reference',
    targetRole: 'data_protection_board',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'The Board functions as a digital office, digital by design, conducting online receipt of complaints, hearings via video conferencing, digital signatures, and electronic transmission of orders.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory architecture reference.',
    reviewerGuidance: 'Reference information regarding DPBI electronic proceedings.',
    defaultSeverity: 'informational',
  },

  // ==========================================================================
  // GROUP 3: POWERS & FUNCTIONS OF THE BOARD
  // ==========================================================================
  {
    requirementId: 'DPDP-ACT-SEC-27-1-A-BREACH-REMEDIAL',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 27(1)(a)',
    title: 'Board Power: Urgent Remedial Measures Following Personal Data Breach',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 27(1)(a); Gazette of India Extraordinary Part II Section 1.',
    category: 'incident_response',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Upon receipt of intimation of personal data breach under Sec 8(6), Board has power to direct urgent remedial or mitigation measures to prevent further harm.',
    assessmentMethod: 'document_review',
    requiredEvidence: 'Internal Incident Response Plan documenting mandatory compliance with Board urgent mitigation orders.',
    reviewerGuidance: 'Incident response power invoked upon breach intimation; not a baseline public website check.',
    defaultSeverity: 'high',
  },
  {
    requirementId: 'DPDP-ACT-SEC-27-1-B-COMPLAINT-INQUIRY',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 27(1)(b)',
    title: 'Board Inquiry into Complaints on Data Fiduciary Obligations & Breaches',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 27(1)(b); MeitY FAQ Doc Sec 3.',
    category: 'complaint_and_grievance',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Board may inquire into complaints concerning personal data breach or non-fulfillment of Data Fiduciary obligations on complaint by Data Principal or reference by Government.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory reference; website mentioning the Board does not imply an inquiry exists.',
    reviewerGuidance: 'Do not infer an inquiry is pending unless official DPBI summon/notice evidence exists.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-27-1-C-CONSENT-MANAGER-COMPLAINT',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 27(1)(c)',
    title: 'Board Inquiry into Complaints Concerning Consent Manager Obligations',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 27(1)(c); MeitY FAQ Doc Sec 3.',
    category: 'consent_manager_obligation',
    targetRole: 'consent_manager',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['consent_manager_entity'],
    expectedControl: 'Board inquiries into complaints made by Data Principals concerning obligations or service failures of registered Consent Managers.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Only applicable to registered Consent Managers under Section 6(9).',
    reviewerGuidance: 'An ordinary website using consent banners is NOT a Consent Manager.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-27-1-D-CONSENT-MANAGER-REGISTRATION',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 27(1)(d), Section 6(9), Rule 4(4)',
    title: 'Enforcement of Consent Manager Registration Conditions & Suspension',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 27(1)(d); DPDP Rules 2025 Rule 4(4); MeitY FAQ Doc Sec 3.',
    category: 'consent_manager_obligation',
    targetRole: 'consent_manager',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['consent_manager_entity'],
    expectedControl: 'Board has statutory power to inquire into breach of registration conditions by Consent Managers and modify, suspend, or cancel registration.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Official DPBI Consent Manager registration certificate and audit log.',
    reviewerGuidance: 'Applies strictly to registered Consent Managers, not ordinary Data Fiduciaries.',
    defaultSeverity: 'high',
    penaltyReference: {
      maxPenaltyAmount: '₹50 Crore',
      scheduleEntry: 'Schedule Entry 5',
      description: 'Breach of Consent Manager registration conditions or obligations (Up to ₹50 crore).',
    },
  },
  {
    requirementId: 'DPDP-ACT-SEC-27-1-E-INTERMEDIARY-REFERENCE',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 27(1)(e), Section 37',
    title: 'Government References Concerning Intermediaries & Blocking Orders',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 27(1)(e), Section 37; MeitY FAQ Doc Sec 3.',
    category: 'statutory_reference',
    targetRole: 'general_reference',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Board receives references from Central Government under Section 37 concerning repeat offenses by Data Fiduciaries and may recommend blocking public access to computer resources.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory reference.',
    reviewerGuidance: 'High-level regulatory power between Central Government and Board. Informational.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-27-2-DIRECTIONS-HEARING',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 27(2)',
    title: 'Principles of Natural Justice & Opportunity of Hearing Before Directions',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 27(2); MeitY FAQ Doc Sec 3.',
    category: 'appeal_and_enforcement',
    targetRole: 'data_protection_board',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Board must provide reasonable opportunity to be heard before issuing binding directions, observing principles of natural justice.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory reference.',
    reviewerGuidance: 'Procedural safeguard for respondents in Board inquiries. Informational.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-27-3-MODIFY-DIRECTIONS',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 27(3)',
    title: 'Power to Modify, Suspend, Withdraw, or Cancel Board Directions',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 27(3); MeitY FAQ Doc Sec 3.',
    category: 'appeal_and_enforcement',
    targetRole: 'data_protection_board',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Board may, on representation or on its own motion, modify, suspend, withdraw, or cancel directions upon recording reasons in writing.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory reference.',
    reviewerGuidance: 'Procedural power of the Board. Informational only.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-28-INQUIRY-TIMELINE',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 28, DPDP Rules 2025',
    title: 'Inquiry Procedure, Evidence Standards & Timelines (6 Months Extension Mechanism)',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_official_gazette',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 28; DPDP Rules 2025; MeitY FAQ Doc Sec 3.',
    category: 'statutory_reference',
    targetRole: 'data_protection_board',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Inquiry conducted digitally in accordance with principles of natural justice; standard inquiry timeline is 6 months with recorded reasons for extensions.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory reference.',
    reviewerGuidance: 'Statutory timeline governing DPBI inquiries. Informational.',
    defaultSeverity: 'informational',
  },

  // ==========================================================================
  // GROUP 4: PENALTIES, GRIEVANCES & APPEALS
  // ==========================================================================
  {
    requirementId: 'DPDP-ACT-SEC-33-PENALTY-FACTORS',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 33(1), Section 33(2)',
    title: 'Statutory Factors Governing Quantum of Monetary Penalties',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 33; MeitY FAQ Doc Sec 5.',
    category: 'appeal_and_enforcement',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Board determines penalty quantum having regard to nature, gravity, duration, repetitive nature, mitigation actions, disproportionate gain, and financial impact.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory reference; penalty factors apply in adjudication proceedings.',
    reviewerGuidance: 'Do not automatically assign maximum penalties; penalties are determined by DPBI on statutory factors.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-27-RULE-9-GRIEVANCE-PREREQUISITE',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 27, Rule 9',
    title: 'Exhaustion of Data Fiduciary Grievance Redressal as Prerequisite for Board Complaints',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_official_gazette',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 27; DPDP Rules 2025 Rule 9; MeitY FAQ Doc Sec 3 & 4.',
    category: 'complaint_and_grievance',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: true,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['public_pages'],
    expectedControl: 'Data Principal must first exhaust internal grievance redressal mechanism of Data Fiduciary before filing digital complaint with Board under Rule 9. Data Fiduciary must publish accessible Grievance Officer details to enable this statutory precondition.',
    assessmentMethod: 'automated_browser',
    requiredEvidence: 'Published Grievance Redressal Officer contact and process on website (cross-referenced with Section 8(9)).',
    reviewerGuidance: 'Check that Grievance Officer details are published so users can exhaust internal redressal.',
    defaultSeverity: 'critical',
    penaltyReference: {
      maxPenaltyAmount: '₹50 Crore',
      scheduleEntry: 'Schedule Entry 7',
      description: 'Breach of grievance redressal obligations under Section 8(9) and Rule 9.',
    },
  },
  {
    requirementId: 'DPDP-ACT-SEC-2-A-APPELLATE-TRIBUNAL',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 2(a), Section 29',
    title: 'Designated Appellate Tribunal: TDSAT (Telecom Disputes Settlement and Appellate Tribunal)',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 2(a); MeitY FAQ Doc Sec 5.',
    category: 'appeal_and_enforcement',
    targetRole: 'appellate_tribunal',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Appellate Tribunal defined under Section 2(a) as the Telecom Disputes Settlement and Appellate Tribunal (TDSAT) established under Section 14 of TRAI Act 1997.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory reference only.',
    reviewerGuidance: 'Jurisdictional identification of TDSAT as appellate authority for Board decisions.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-29-APPEALS-TDSAT',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 29(1), Rules 21–22',
    title: 'Appeals to Appellate Tribunal (TDSAT) Against Board Orders',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_official_gazette',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 29; DPDP Rules 2025 Rules 21-22; MeitY FAQ Doc Sec 5.',
    category: 'appeal_and_enforcement',
    targetRole: 'appellate_tribunal',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Any person aggrieved by an order of the Board may prefer an appeal to the Appellate Tribunal (TDSAT) in digital form.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory reference only.',
    reviewerGuidance: 'Legal recourse provision for aggrieved Data Fiduciaries or Data Principals.',
    defaultSeverity: 'informational',
  },
  {
    requirementId: 'DPDP-ACT-SEC-29-1-APPEAL-DEADLINE',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 29(1)',
    title: 'Statutory 60-Day Appeal Filing Deadline Before TDSAT',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 29(1); MeitY FAQ Doc Sec 5.',
    category: 'appeal_and_enforcement',
    targetRole: 'appellate_tribunal',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Appeals must be filed within 60 days from the date of receipt of the order of the Board, with discretionary condonation of delay for sufficient cause.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory reference only.',
    reviewerGuidance: 'Procedural limitation period for appeals.',
    defaultSeverity: 'informational',
  },

  // ==========================================================================
  // GROUP 5: STATUTORY SCHEDULE PENALTY FIGURES (REFERENCE DATA)
  // ==========================================================================
  {
    requirementId: 'DPDP-ACT-SCHED-ENTRY-1-SECURITY-BREACH-PENALTY',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Schedule Entry 1, Section 8(5)',
    title: 'Penalty: Failure to Take Reasonable Security Safeguards (Max ₹250 Crore)',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Schedule Entry 1; MeitY FAQ Doc Sec 5.',
    category: 'appeal_and_enforcement',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Breach in observing obligation to take reasonable security safeguards to prevent personal data breach under sub-section (5) of section 8: Penalty may extend to two hundred and fifty crore rupees (₹250 Crore).',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory penalty entry.',
    reviewerGuidance: 'Reference metadata linked to Section 8(5). Not assessed as an automatic fine.',
    defaultSeverity: 'critical',
    penaltyReference: {
      maxPenaltyAmount: '₹250 Crore',
      maxPenaltyAmountInr: 25000000000,
      maxPenaltyText: '₹250 Crore',
      scheduleEntry: 'Schedule Entry 1',
      description: 'Breach in observing obligation to take reasonable security safeguards to prevent personal data breach under Section 8(5).',
    },
  },
  {
    requirementId: 'DPDP-ACT-SCHED-ENTRY-2-BREACH-NOTIFICATION-PENALTY',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Schedule Entry 2, Section 8(6)',
    title: 'Penalty: Failure to Notify Board & Data Principals of Personal Data Breach (Max ₹200 Crore)',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Schedule Entry 2; MeitY FAQ Doc Sec 5.',
    category: 'appeal_and_enforcement',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Breach in observing obligation to give the Board or affected Data Principal notice of personal data breach under sub-section (6) of section 8: Penalty may extend to two hundred crore rupees (₹200 Crore).',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory penalty entry.',
    reviewerGuidance: 'Reference metadata linked to breach notification obligations.',
    defaultSeverity: 'critical',
    penaltyReference: {
      maxPenaltyAmount: '₹200 Crore',
      scheduleEntry: 'Schedule Entry 2',
      description: 'Failure to notify Board or Data Principals of breach under Section 8(6).',
    },
  },
  {
    requirementId: 'DPDP-ACT-SCHED-ENTRY-3-CHILDREN-DATA-PENALTY',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Schedule Entry 3, Section 9',
    title: 'Penalty: Non-Fulfillment of Obligations in Relation to Children (Max ₹200 Crore)',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Schedule Entry 3; MeitY FAQ Doc Sec 5.',
    category: 'appeal_and_enforcement',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Breach in observance of additional obligations in relation to children under section 9: Penalty may extend to two hundred crore rupees (₹200 Crore).',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory penalty entry.',
    reviewerGuidance: 'Reference metadata linked to Section 9 parental consent and tracking prohibition.',
    defaultSeverity: 'critical',
    penaltyReference: {
      maxPenaltyAmount: '₹200 Crore',
      scheduleEntry: 'Schedule Entry 3',
      description: 'Non-fulfillment of obligations in relation to children under Section 9.',
    },
  },
  {
    requirementId: 'DPDP-ACT-SCHED-ENTRY-4-SDF-OBLIGATIONS-PENALTY',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Schedule Entry 4, Section 10',
    title: 'Penalty: Non-Fulfillment of Significant Data Fiduciary Obligations (Max ₹150 Crore)',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Schedule Entry 4; MeitY FAQ Doc Sec 5.',
    category: 'appeal_and_enforcement',
    targetRole: 'significant_data_fiduciary',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['significant_data_fiduciary_entity'],
    expectedControl: 'Breach in observance of additional obligations of Significant Data Fiduciary under section 10: Penalty may extend to one hundred and fifty crore rupees (₹150 Crore).',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory penalty entry.',
    reviewerGuidance: 'Applies exclusively to notified Significant Data Fiduciaries.',
    defaultSeverity: 'high',
    penaltyReference: {
      maxPenaltyAmount: '₹150 Crore',
      scheduleEntry: 'Schedule Entry 4',
      description: 'Breach of Section 10 obligations by Significant Data Fiduciaries.',
    },
  },
  {
    requirementId: 'DPDP-ACT-SCHED-ENTRY-5-CONSENT-MANAGER-PENALTY',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Schedule Entry 5, Section 6(9), Section 27',
    title: 'Penalty: Breach of Consent Manager Obligations & Registration Conditions (Max ₹50 Crore)',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Schedule Entry 5; MeitY FAQ Doc Sec 5.',
    category: 'consent_manager_obligation',
    targetRole: 'consent_manager',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: ['consent_manager_entity'],
    expectedControl: 'Breach in observing obligations of Consent Manager or conditions of registration under sub-section (9) of section 6 or section 27: Penalty may extend to fifty crore rupees (₹50 Crore).',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory penalty entry.',
    reviewerGuidance: 'Applies strictly to registered Consent Managers under Section 6(9).',
    defaultSeverity: 'high',
    penaltyReference: {
      maxPenaltyAmount: '₹50 Crore',
      scheduleEntry: 'Schedule Entry 5',
      description: 'Breach of Consent Manager obligations or registration conditions under Section 6(9).',
    },
  },
  {
    requirementId: 'DPDP-ACT-SCHED-ENTRY-6-DATA-PRINCIPAL-DUTIES',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Schedule Entry 6, Section 15',
    title: 'Penalty: Non-Compliance with Statutory Duties by Data Principal (Max ₹10,000)',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Schedule Entry 6; MeitY FAQ Doc Sec 5.',
    category: 'statutory_reference',
    targetRole: 'data_principal',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Breach in observance of duties by Data Principal under section 15: Penalty may extend to ten thousand rupees (₹10,000).',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory penalty entry.',
    reviewerGuidance: 'Governs individual Data Principal statutory duties (e.g. false claims, impersonation). Informational.',
    defaultSeverity: 'low',
    penaltyReference: {
      maxPenaltyAmount: '₹10,000',
      scheduleEntry: 'Schedule Entry 6',
      description: 'Non-observance of statutory duties by Data Principal under Section 15.',
    },
  },
  {
    requirementId: 'DPDP-ACT-SCHED-ENTRY-7-RESIDUAL-PENALTY',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Schedule Entry 7',
    title: 'Residual Statutory Penalty for Any Other Provision Breach (Max ₹50 Crore)',
    version: REGISTRY_VERSION,
    effectiveDate: '2025-11-13',
    applicabilityStatus: 'in_force',
    verificationStatus: 'verified_act_schedule',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Schedule Entry 7; MeitY FAQ Doc Sec 5.',
    category: 'appeal_and_enforcement',
    targetRole: 'data_fiduciary',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: true,
    applicabilityConditions: [],
    expectedControl: 'Breach of any other provision of the Act or the rules made thereunder for which no specific penalty is provided: Penalty may extend to fifty crore rupees (₹50 Crore).',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Statutory penalty entry.',
    reviewerGuidance: 'Catch-all statutory penalty provision.',
    defaultSeverity: 'medium',
    penaltyReference: {
      maxPenaltyAmount: '₹50 Crore',
      scheduleEntry: 'Schedule Entry 7',
      description: 'Residual statutory penalty for any other provision breach.',
    },
  },

  // ==========================================================================
  // GROUP 6: STAGGERED / FUTURE-EFFECTIVE & VERIFICATION-REQUIRED PROVISIONS
  // ==========================================================================
  {
    requirementId: 'DPDP-RULES-2025-AUDIT-ALGO-CERT',
    officialSource: 'Digital Personal Data Protection Rules, 2025',
    sectionOrRule: 'Section 10(2)(c), Rule 14',
    title: 'Annual Algorithmic Audit & Periodic DPIA for Significant Data Fiduciaries',
    version: REGISTRY_VERSION,
    effectiveDate: '2027-01-01', // Future effective date for staggered rollout test
    applicabilityStatus: 'not_yet_in_force',
    verificationStatus: 'verified_official_gazette',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Rules 2025 Rule 14; Staggered Phase-2 implementation schedule.',
    category: 'data_fiduciary_obligation',
    targetRole: 'significant_data_fiduciary',
    isWebsiteComplianceCheck: true,
    isCurrentlyEnforceable: false,
    applicabilityConditions: ['significant_data_fiduciary_entity'],
    expectedControl: 'Conduct annual independent data audit and algorithmic transparency certification by certified data auditors.',
    assessmentMethod: 'document_review',
    requiredEvidence: 'Third-party independent data audit report and DPIA certificate.',
    reviewerGuidance: 'Future-effective obligation. Must NOT be treated as a violation during 2026 assessments.',
    defaultSeverity: 'high',
    uncertaintyRationale: 'Scheduled for enforcement in Phase 2 (2027); not currently enforceable.',
  },
  {
    requirementId: 'DPDP-RULES-2025-CROSS-BORDER-WHITELIST',
    officialSource: 'Digital Personal Data Protection Act, 2023',
    sectionOrRule: 'Section 16(1)',
    title: 'Cross-Border Personal Data Transfer Restrictions & Gazette Whitelist',
    version: REGISTRY_VERSION,
    effectiveDate: null, // Unknown / pending gazette notification
    applicabilityStatus: 'verification_required',
    verificationStatus: 'verification_required',
    lastVerifiedDate: REGISTRY_LAST_VERIFIED,
    sourceProvenance: 'DPDP Act 2023 Section 16(1); Gazette list pending publication.',
    category: 'statutory_reference',
    targetRole: 'general_reference',
    isWebsiteComplianceCheck: false,
    isCurrentlyEnforceable: false,
    applicabilityConditions: [],
    expectedControl: 'Central Government notification specifying countries or territories outside India to which transfer of personal data is restricted or conditioned.',
    assessmentMethod: 'statutory_reference',
    requiredEvidence: 'Official Gazette notification specifying restricted destination countries.',
    reviewerGuidance: 'Verification required. The restricted list of foreign territories has not been gazetted as of 2026 baseline.',
    defaultSeverity: 'informational',
    uncertaintyRationale: 'Official MeitY gazette notification specifying negative list of restricted countries is pending publication.',
  },
];

/**
 * Determines legal applicability status for a requirement based on the assessment date.
 * 
 * @param {object} requirement
 * @param {string|Date} [assessmentDate=new Date()]
 * @returns {{
 *   status: 'enacted' | 'notified' | 'in_force' | 'not_yet_in_force' | 'verification_required',
 *   isEnforceable: boolean,
 *   reason: string
 * }}
 */
/**
 * Retrieves a requirement from the registry by its stable ID.
 */
export function getRequirementById(requirementId) {
  return OFFICIAL_LEGAL_REQUIREMENTS.find((r) => r.requirementId === requirementId) || null;
}

export function determineLegalApplicability(requirement, assessmentDate = new Date()) {
  if (
    requirement.applicabilityStatus === 'verification_required' ||
    requirement.verificationStatus === 'verification_required' ||
    !requirement.effectiveDate
  ) {
    return {
      status: 'verification_required',
      isEnforceable: false,
      isMandatoryInForce: false,
      reason: requirement.uncertaintyRationale || 'Commencement notification date requires official Gazette verification.',
    };
  }

  const refDate = new Date(assessmentDate);
  const effDate = new Date(requirement.effectiveDate);

  // If effective date is in the future relative to the assessment date
  if (effDate > refDate) {
    return {
      status: 'not_yet_in_force',
      isEnforceable: false,
      isMandatoryInForce: false,
      reason: `Provision effective date (${requirement.effectiveDate}) is in the future relative to assessment date (${refDate.toISOString().slice(0, 10)}). Excluded from mandatory scoring.`,
    };
  }

  return {
    status: 'in_force',
    isEnforceable: true,
    isMandatoryInForce: true,
    reason: `Provision in force as of ${requirement.effectiveDate} pursuant to official notification.`,
  };
}

/**
 * Seeds or updates the authoritative Legal Requirements registry in MongoDB.
 */
export async function seedLegalRequirements() {
  await connectDB();
  for (const req of OFFICIAL_LEGAL_REQUIREMENTS) {
    await LegalRequirement.findOneAndUpdate(
      { requirementId: req.requirementId },
      { $set: req },
      { upsert: true, new: true }
    );
  }
}

/**
 * Evaluates which legal requirements apply based on organization profile,
 * website features, and legal reference date.
 * 
 * @param {object} organization - Organization document
 * @param {object} assessmentProfile - AssessmentProfile document or capabilities
 * @param {string|Date} [assessmentDate=new Date()] - Legal reference date
 * @returns {Array<{
 *   requirement: object,
 *   isApplicable: boolean,
 *   legalStatus: object,
 *   reason: string,
 *   confidence: string,
 *   limitations: string
 * }>}
 */
export function evaluateApplicability(organization = {}, assessmentProfile = null, assessmentDate = new Date()) {
  let profileFeatures = assessmentProfile?.websiteCapabilities || {};

  if (Array.isArray(assessmentProfile?.websiteFeatures)) {
    const map = { ...profileFeatures };
    for (const f of assessmentProfile.websiteFeatures) {
      if (f.enabled) {
        map[f.key] = true;
      }
    }
    profileFeatures = map;
  }

  const normalizedFeatures = { ...profileFeatures };
  if (profileFeatures.registration_login || profileFeatures.user_account_creation_login) {
    normalizedFeatures.user_registration_login = true;
    normalizedFeatures.registration_login = true;
  }
  if (profileFeatures.newsletter_marketing) {
    normalizedFeatures.newsletter_subscriptions = true;
  }
  if (profileFeatures.account_deletion_data_request) {
    normalizedFeatures.account_deletion_data_requests = true;
  }

  // Determine organizational classifications
  const isConsentManager = Boolean(
    assessmentProfile?.isConsentManager ||
    organization?.isConsentManager ||
    assessmentProfile?.role === 'consent_manager'
  );

  const isSignificantDataFiduciary = Boolean(
    assessmentProfile?.isSignificantDataFiduciary ||
    organization?.isSignificantDataFiduciary ||
    assessmentProfile?.isSDF
  );

  return OFFICIAL_LEGAL_REQUIREMENTS.map((req) => {
    // 1. Evaluate legal temporal applicability against assessment date
    const legalStatus = determineLegalApplicability(req, assessmentDate);

    // 2. Future-effective provisions are not applicable for current compliance scoring
    if (legalStatus.status === 'not_yet_in_force') {
      return {
        requirement: req,
        isApplicable: false,
        legalStatus,
        reason: legalStatus.reason,
        confidence: 'high',
        limitations: 'Excluded from current scoring as provision has not yet commenced.',
      };
    }

    // 3. Verification required provisions are excluded from current mandatory violations
    if (legalStatus.status === 'verification_required') {
      return {
        requirement: req,
        isApplicable: false,
        legalStatus,
        reason: legalStatus.reason,
        confidence: 'uncertain',
        limitations: 'Commencement status pending official MeitY gazette confirmation.',
      };
    }

    // 4. Consent Manager role check
    if (req.targetRole === 'consent_manager' || req.category === 'consent_manager_obligation') {
      if (!isConsentManager) {
        return {
          requirement: req,
          isApplicable: false,
          legalStatus,
          reason: 'Organization is an ordinary Data Fiduciary, not a registered Consent Manager under Section 6(9). Consent Manager obligations do not apply.',
          confidence: 'high',
          limitations: 'No Consent Manager registration declared or verified.',
        };
      }
      return {
        requirement: req,
        isApplicable: true,
        legalStatus,
        reason: 'Statutory Consent Manager obligation under Section 6(9) applicable to registered entity.',
        confidence: 'high',
        limitations: 'Applies to registered Consent Manager interoperability and registration conditions.',
      };
    }

    // 5. Significant Data Fiduciary role check
    if (req.targetRole === 'significant_data_fiduciary') {
      if (!isSignificantDataFiduciary) {
        return {
          requirement: req,
          isApplicable: false,
          legalStatus,
          reason: 'Organization is not classified as a Significant Data Fiduciary under Section 10.',
          confidence: 'high',
          limitations: 'Standard Data Fiduciary threshold applies.',
        };
      }
    }

    // 6. Non-website compliance checks (Board composition, governance, powers, appeals)
    // These are statutory references that must never be treated as website failures
    if (!req.isWebsiteComplianceCheck) {
      return {
        requirement: req,
        isApplicable: false,
        legalStatus,
        reason: `Statutory reference entry: ${req.title}. Governs regulatory procedures or DPBI authorities; not an assessed website obligation.`,
        confidence: 'high',
        limitations: 'Informational governance reference only.',
      };
    }

    // 7. Universal Data Fiduciary website requirements (public_pages)
    if (!req.applicabilityConditions || req.applicabilityConditions.length === 0 || req.applicabilityConditions.includes('public_pages')) {
      return {
        requirement: req,
        isApplicable: true,
        legalStatus,
        reason: 'Mandatory Data Fiduciary public web disclosure under DPDP Act 2023.',
        confidence: 'high',
        limitations: 'Client-side automated browser inspection.',
      };
    }

    // 8. Specific feature-triggered requirements
    const activeMatches = req.applicabilityConditions.filter((cond) => {
      if (cond === 'public_pages') return true;
      return Boolean(normalizedFeatures[cond]);
    });

    if (activeMatches.length > 0) {
      return {
        requirement: req,
        isApplicable: true,
        legalStatus,
        reason: `Triggered by active website features: ${activeMatches.join(', ')}`,
        confidence: 'high',
        limitations: 'Client-side automated browser inspection.',
      };
    }

    return {
      requirement: req,
      isApplicable: false,
      legalStatus,
      reason: `Website does not feature triggers: ${req.applicabilityConditions.join(', ')}`,
      confidence: 'high',
      limitations: 'Feature not detected or declared in scope.',
    };
  });
}

export const DPDP_REQUIREMENT_REGISTRY = OFFICIAL_LEGAL_REQUIREMENTS;
export const LEGAL_REGISTRY_METADATA = {
  version: REGISTRY_VERSION,
  lastVerifiedDate: REGISTRY_LAST_VERIFIED,
  primaryAct: 'Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)',
  primaryRules: 'Digital Personal Data Protection Rules, 2025',
  commencementNotification: 'Ministry of Electronics and Information Technology S.O. 4930(E) dated 13 November 2025',
};
