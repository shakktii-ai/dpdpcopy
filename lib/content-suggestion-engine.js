import { getGeminiClient } from './gemini.js';
import { STATUTORY_REQUIREMENTS, STATUTORY_PENALTIES, OFFICIAL_SOURCES, evaluateCommencement } from './legal-knowledge-base.js';

/**
 * Standard legal disclaimer appended to ready-to-use content suggestions.
 */
export const STATUTORY_DISCLAIMER_TEXT =
  'Statutory Notice: This draft text is generated based on the Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025 as a remediation aid. It does not constitute legal advice, government certification, or an absolute guarantee of regulatory compliance. Before publishing, replace all bracketed placeholders with verified corporate information and have your legal or data protection counsel review the text.';

/**
 * Templates for deterministic, authoritative fallback generation.
 * Strictly adheres to DPDP Act 2023 and DPDP Rules 2025.
 * Uses visible bracketed placeholders for organization-specific data.
 */
const CANONICAL_TEMPLATES = {
  // 1. Privacy Policy: Pre-Consent Itemized Notice (Section 5(1), Rule 3)
  'DPDP-ACT-SEC-5-NOTICE': {
    pageName: 'Privacy Policy Page',
    defaultPageUrl: '/privacy',
    sectionName: 'Collection & Purpose Specification of Personal Data',
    recommendedAction: 'Add',
    placementInstructions: {
      pageName: 'Privacy Policy Page (/privacy)',
      sectionName: 'Section 2: Categories of Personal Data Collected & Purposes of Processing',
      targetPosition: 'Place directly after Section 1 (Introduction & Scope) and before Section 3 (Third-Party Disclosures).',
      isNewSection: true,
      details: 'Create a dedicated, itemized section with a clear table or bulleted list mapping each data category to its specific processing purpose.',
    },
    findingTitle: 'Missing Pre-Consent Itemized Data Collection & Purpose Disclosures',
    missingOrInsufficient: 'The current privacy notice lacks an itemized breakdown of personal data categories collected and fails to explicitly connect each category to a specific, legitimate processing purpose under Section 5(1) and Rule 3(b).',
    generateReadyToUseContent: (orgName) => `## 2. Personal Data We Collect and Specified Purposes of Processing

Pursuant to Section 5(1) of the Digital Personal Data Protection Act, 2023 and Rule 3 of the DPDP Rules, 2025, **${orgName}** collects and processes personal data strictly for specified, explicit, and lawful purposes:

### 2.1 Itemized Categories of Personal Data
We collect the following personal data only when voluntarily provided by you or necessary to deliver our services:
- **Identity & Contact Details:** [Full Name, Official Email Address, Mobile Phone Number, Postal Billing Address].
- **Account & Credential Data:** [User Account Credentials, Encrypted Passwords, Login Timestamps, Role Permissions].
- **Transaction & Commercial Data:** [Transaction Identifiers, Payment Reference Numbers, Invoicing Details, Order History] *(Note: Sensitive financial card details are processed via RBI-licensed payment aggregators and are not retained on our servers)*.
- **Technical & Usage Information:** [IP Address, Browser Type, Operating System, Device Identifiers, Necessary Session Identifiers].

### 2.2 Specified Purposes of Processing
Each category of personal data is collected exclusively for the following specified purposes:
1. **Service Provision & Contract Execution:** To register your user account, verify identity, deliver requested goods or digital services, and process transactions.
2. **Customer Support & Communications:** To respond to your customer service inquiries, transactional updates, security alerts, and system notices.
3. **Statutory & Regulatory Compliance:** To comply with obligations under Indian law, including taxation, billing records, and audit mandates.
4. **Consent-Based Communications:** With your explicit, separate affirmative opt-in consent, to send product updates, newsletters, or marketing communications.

We do not process personal data for any purpose incompatible with the specified purposes outlined above.`,
    customizationRequirements: [
      'Verify the complete list of personal data fields collected by your application/forms.',
      'Confirm the exact goods, digital services, or user account features enabled by each data category.',
      'Confirm with engineering whether any third-party analytics or telemetry SDKs collect additional device data.',
      'Ensure marketing communications remain strictly gated behind a separate affirmative opt-in checkbox.',
    ],
    priority: 'Critical',
    priorityReason: 'Non-itemized notice breaches Section 5(1) and attracts residual penalties up to ₹50 Crore under Schedule Entry 7.',
    legalMapping: {
      sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
      sectionOrRule: 'Section 5(1) & Rule 3',
      schedule: 'Schedule Entry 7',
      explanation: 'Section 5(1) requires a pre-consent notice detailing specified personal data and purposes. Rule 3 mandates clear, plain language and itemised descriptions.',
      commencementStatus: 'in_force',
      effectiveDate: '2023-08-11',
    },
  },

  // 2. Consent & Cookie Banner: Affirmative, Unbundled (Section 6(1))
  'DPDP-ACT-SEC-6-CONSENT-ITEMIZED': {
    pageName: 'Consent & Cookie Banner',
    defaultPageUrl: '/',
    sectionName: 'Initial Consent Modal / Cookie Notice Banner',
    recommendedAction: 'Add',
    placementInstructions: {
      pageName: 'Global Site Banner (Rendered across all landing pages)',
      sectionName: 'Global Cookie & Consent Banner Dialog',
      targetPosition: 'Render as an overlay dialog or bottom banner immediately upon first user visit before any non-essential cookies/scripts are loaded.',
      isNewSection: true,
      details: 'Must provide equal visual prominence to "Accept All" and "Reject Non-Essential", with a secondary "Manage Preferences" button. Checkboxes for non-essential cookies must be unchecked by default.',
    },
    findingTitle: 'Missing Affirmative, Unbundled Consent Mechanism & Cookie Banner',
    missingOrInsufficient: 'The website activates tracking, analytics, or functional cookies prior to obtaining affirmative consent, or lacks an unbundled consent dialog with equally prominent Accept and Reject options under Section 6(1).',
    generateReadyToUseContent: (orgName) => `<!-- Ready-to-Use DPDP Section 6(1) Cookie & Consent Banner Text -->

[Banner Header]
**Your Privacy Preferences at ${orgName}**

[Banner Body]
In accordance with the Digital Personal Data Protection Act, 2023, we seek your explicit consent to process your personal data and deploy cookies. We use essential cookies to operate our core services. Non-essential cookies (such as analytics, performance, and marketing tags) help us improve user experience and deliver tailored content, but are only activated with your affirmative permission.

You have the freedom to accept, reject, or customize non-essential cookies. You can modify or withdraw your consent at any time via the "Cookie Settings" link in our website footer.

[Buttons / Actions]
- **Button 1 (Primary / Green):** [ Accept All ]
- **Button 2 (Equal Prominence / Outline):** [ Reject Non-Essential ]
- **Button 3 (Text Link / Secondary):** [ Customize Preferences / Cookie Settings ]

[Granular Categories inside Customize Preferences Modal]
- [X] **Strictly Essential Cookies** (Always Active - Required for site security, session maintenance, and load balancing)
- [ ] **Analytics & Performance Cookies** (Default: Unchecked - Helps us understand site traffic and usage metrics)
- [ ] **Marketing & Advertising Cookies** (Default: Unchecked - Used to deliver relevant promotions and measure campaign effectiveness)

[Affirmative Action Label for Interactive Forms]
"I have read and understood the [Privacy Policy Link] and provide my free, specific, and affirmative consent for ${orgName} to process my submitted personal data for the purpose of [Specify Purpose: e.g. responding to my inquiry / creating my account]."`,
    customizationRequirements: [
      'Ensure the "Reject Non-Essential" button is visually equal in size, weight, and prominence to the "Accept All" button (no dark patterns).',
      'Verify that analytics scripts (e.g. Google Analytics, Meta Pixel) are technically gated and do not fire until the user clicks "Accept".',
      'Ensure cookie preference checkboxes default to unchecked (opt-in only).',
      'Verify that continuing to scroll or clicking elsewhere on the page does NOT trigger implied consent.',
    ],
    priority: 'Critical',
    priorityReason: 'Processing personal data without valid affirmative consent violates Section 6(1) and attracts penalties up to ₹50 Crore under Schedule Entry 7.',
    legalMapping: {
      sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
      sectionOrRule: 'Section 6(1), Section 6(2)',
      schedule: 'Schedule Entry 7',
      explanation: 'Section 6(1) mandates that consent must be free, specific, informed, unconditional, and unambiguous with clear affirmative action. Implied or pre-ticked consent is void under Section 6(2).',
      commencementStatus: 'in_force',
      effectiveDate: '2023-08-11',
    },
  },

  // 3. Consent Withdrawal: Comparable Ease (Section 6(4), Rule 3(c)(i))
  'DPDP-ACT-SEC-6-WITHDRAWAL': {
    pageName: 'Consent Management & Withdrawal Portal',
    defaultPageUrl: '/cookie-settings',
    sectionName: 'Persistent Cookie Settings & Consent Revocation Center',
    recommendedAction: 'Add',
    placementInstructions: {
      pageName: 'Global Website Footer (All Pages) & Dedicated Preferences Page (/preferences or /cookie-settings)',
      sectionName: 'Footer Links / Privacy Preference Center',
      targetPosition: 'Add a persistent link labeled "Manage Cookie Preferences / Withdraw Consent" in the global website footer alongside "Privacy Policy" and "Terms of Service".',
      isNewSection: true,
      details: 'Clicking the link must open an instant self-service modal where users can revoke consent with 1 click without needing to submit email tickets.',
    },
    findingTitle: 'Missing Self-Service Consent Withdrawal Mechanism with Comparable Ease',
    missingOrInsufficient: 'The website does not provide an easily accessible, self-service mechanism for Data Principals to withdraw consent with ease comparable to how consent was granted, violating Section 6(4).',
    generateReadyToUseContent: (orgName) => `## Manage Your Consent & Cookie Preferences

Under Section 6(4) of the Digital Personal Data Protection Act, 2023, you have the unconditional right to withdraw your consent at any time, with ease comparable to the ease with which consent was granted.

### How to Withdraw Your Consent
1. **Self-Service Preference Center:** Click the **"Cookie & Consent Preferences"** button below at any time to toggle off non-essential cookies, analytics, or marketing tracking. Changes take effect immediately.
2. **Marketing & Promotional Emails:** Click the "Unsubscribe" link present at the bottom of any commercial email sent by ${orgName}.
3. **User Account Preferences:** If you have registered a user account, navigate to **Account Settings > Privacy & Data Controls** to manage your communication and data sharing preferences.
4. **Direct Request:** You may also submit a consent withdrawal request directly to our Grievance Officer at [grievance-email@company.com].

### Legal Effect of Withdrawal
Withdrawing your consent does not affect the lawfulness of any data processing undertaken prior to the receipt of your withdrawal request. Upon withdrawal, ${orgName} will cease processing your personal data for the revoked purpose, unless retention is required to fulfill statutory legal obligations under applicable Indian laws.

[Interactive UI Button]
[ Open Consent Preference Center ]`,
    customizationRequirements: [
      'Add a permanent, visible "Cookie Settings" or "Manage Consent" link in the website footer across all pages.',
      'Configure the backend/client-side preference manager to delete non-essential tracking cookies immediately upon withdrawal.',
      'Provide [grievance-email@company.com] as a fallback direct contact for offline processing consent withdrawal.',
      'Ensure no subscription penalties or service denial occur for withdrawing non-essential consent.',
    ],
    priority: 'High',
    priorityReason: 'Failure to provide comparable ease of consent withdrawal violates Section 6(4) and is subject to DPBI enforcement under Schedule Entry 7.',
    legalMapping: {
      sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
      sectionOrRule: 'Section 6(4) & Rule 3(c)(i)',
      schedule: 'Schedule Entry 7',
      explanation: 'Section 6(4) establishes the statutory right to withdraw consent with comparable ease. Rule 3(c)(i) requires direct communication links for withdrawal.',
      commencementStatus: 'in_force',
      effectiveDate: '2023-08-11',
    },
  },

  // 4. Grievance Officer & Redressal: Section 8(9), Section 13, Rule 9, Rule 14(3)
  'DPDP-ACT-SEC-8-9-GRIEVANCE-OFFICER': {
    pageName: 'Privacy Policy / Grievance Redressal Page',
    defaultPageUrl: '/privacy',
    sectionName: 'Grievance Redressal Officer & Escalation Mechanism',
    recommendedAction: 'Add',
    placementInstructions: {
      pageName: 'Privacy Policy Page (/privacy) and Contact Page (/contact)',
      sectionName: 'Section 9: Grievance Redressal Mechanism & Officer Contact Details',
      targetPosition: 'Add near the end of the Privacy Policy before "Jurisdiction & Governing Law", and duplicate contact details on the /contact page.',
      isNewSection: true,
      details: 'Must clearly state the Grievance Officer full name or title, dedicated monitored email, physical office address in India, and the 30-day resolution turnaround SLA.',
    },
    findingTitle: 'Missing Designated Grievance Officer Details & Statutory Escalation SLA',
    missingOrInsufficient: 'The website fails to publish the designated Grievance Officer name, dedicated electronic communication channel, physical address, and statutory response timeline under Section 8(9) and Rule 9.',
    generateReadyToUseContent: (orgName) => `## 9. Grievance Redressal Mechanism & Contact Information

In compliance with Section 8(9) and Section 13 of the Digital Personal Data Protection Act, 2023 and Rule 9 of the DPDP Rules, 2025, **${orgName}** has designated a Grievance Officer to address questions, concerns, or grievances regarding the processing of your personal data.

### 9.1 Designated Grievance Officer Details
- **Designated Officer:** [Full Name of Grievance Officer, e.g. Mr./Ms. Data Protection Officer]
- **Official Designation:** Grievance Redressal Officer & Privacy Lead
- **Dedicated Email Address:** [grievance@company.com or dpo@company.com]
- **Direct Telephone:** [Official Business Contact Number, e.g. +91-XX-XXXX-XXXX]
- **Registered Physical Postal Address:**
  ${orgName}
  [Office Building / Suite Number]
  [Street Address, Landmark]
  [City, State - PIN Code], India

### 9.2 Grievance Submission & Resolution Timeline
- **Acknowledgment:** We will acknowledge receipt of your written grievance within **[24 to 48 hours]** of receipt and provide a unique tracking reference number.
- **Resolution Turnaround (SLA):** In accordance with Rule 14(3) of the DPDP Rules 2025, we are committed to investigating and resolving all personal data grievances within **[30 calendar days]** (and in no event exceeding the ninety-day statutory maximum).

### 9.3 Statutory Escalation to the Data Protection Board of India (DPBI)
If your grievance is not resolved by our Grievance Officer within thirty (30) days, or if you are dissatisfied with our response, you have the statutory right under Section 13(2) and Section 27(1)(b) of the Act to lodge a formal complaint with the **Data Protection Board of India (DPBI)** through its official digital portal at [https://www.dpbi.gov.in]. Exhausting our internal grievance redressal mechanism is a statutory prerequisite before approaching the Board.`,
    customizationRequirements: [
      'Appoint a designated individual or role as Grievance Officer and fill in their actual name and title.',
      'Configure a dedicated, monitored electronic contact address (e.g. grievance@company.com or privacy@company.com).',
      'Provide the verified Indian postal office address for physical notices.',
      'Confirm your organization internal dispute resolution process complies with the 30-day turnaround commitment.',
    ],
    priority: 'Critical',
    priorityReason: 'Failure to publish Grievance Officer details directly impedes statutory complaint pathways under Section 8(9), Section 13, and Rule 9, subject to penalties up to ₹50 Crore under Schedule Entry 7.',
    legalMapping: {
      sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
      sectionOrRule: 'Section 8(9), Section 13, Rule 9, Rule 14(3)',
      schedule: 'Schedule Entry 7',
      explanation: 'Section 8(9) mandates publishing contact details of an authorized person to answer processing questions. Rule 9 requires prominent publication on website/app. Rule 14(3) sets response turnaround standards.',
      commencementStatus: 'in_force',
      effectiveDate: '2023-08-11',
    },
  },

  // 5. Data Retention & Erasure: Section 8(7), Rule 8 & Third Schedule
  'DPDP-ACT-SEC-8-7-RETENTION-ERASURE': {
    pageName: 'Privacy Policy Page',
    defaultPageUrl: '/privacy',
    sectionName: 'Data Retention Limitations & Automatic Erasure Policy',
    recommendedAction: 'Update',
    placementInstructions: {
      pageName: 'Privacy Policy Page (/privacy)',
      sectionName: 'Section 5: Data Retention & Automated Deletion Procedures',
      targetPosition: 'Insert after Section 4 (Data Sharing & Sub-processors) and before Section 6 (Data Security Safeguards).',
      isNewSection: false,
      details: 'Replace vague or indefinite retention statements (e.g. "we retain data as long as necessary") with specific purpose-bound retention periods and inactivity erasure triggers.',
    },
    findingTitle: 'Inadequate Data Retention Disclosures & Missing Inactivity Erasure Schedule',
    missingOrInsufficient: 'The privacy policy contains vague or indefinite data retention statements and omits specific purpose-bound retention periods and statutory inactivity erasure timelines required under Section 8(7) and Rule 8.',
    generateReadyToUseContent: (orgName) => `## 5. Data Retention Periods & Automated Erasure

Under Section 8(7) of the Digital Personal Data Protection Act, 2023 and Rule 8 of the DPDP Rules, 2025, **${orgName}** retains personal data only for as long as necessary to satisfy the specified purpose for which it was collected, or as mandated by applicable Indian laws.

### 5.1 Purpose-Bound Retention Schedules
- **User Account Data:** Retained for the active duration of your user account, plus **[180 days]** following an account closure request to enable audit logging and dispute settlement.
- **Transaction & Financial Records:** Retained for **[8 years]** to comply with mandatory statutory accounting and tax requirements under the Income Tax Act, 1961 and Companies Act, 2013.
- **Customer Support Tickets & Communications:** Retained for **[12 months]** following ticket resolution to track quality assurance and customer satisfaction.
- **Analytics & Diagnostic Logs:** Retained for a maximum period of **[12 months]** in accordance with Rule 6(1)(e) of the DPDP Rules 2025.

### 5.2 Purpose Completion & Account Inactivity Erasure
In accordance with Rule 8 and the Third Schedule of the DPDP Rules, 2025, personal data will be deemed as no longer serving its specified purpose if:
1. You withdraw your consent for processing and no overriding statutory retention obligation applies; or
2. Your user account remains inactive with no logins, transactions, or communications for a continuous period of **[3 continuous years / 36 months]**.

### 5.3 48-Hour Pre-Erasure Notification
Pursuant to Rule 8(2) of the DPDP Rules 2025, at least **forty-eight (48) hours prior** to completing the erasure of your personal data due to account inactivity, ${orgName} will send an advance intimation to your registered email address or mobile number giving you the opportunity to log into your user account and retain your profile.`,
    customizationRequirements: [
      'Audit your corporate data retention schedules with database and product engineering teams.',
      'Replace [180 days], [8 years], and [36 months] with your organization verified retention windows.',
      'Ensure backend automated jobs are configured to dispatch the statutory 48-hour prior intimation email before purging inactive accounts.',
    ],
    priority: 'Medium',
    priorityReason: 'Indefinite retention of personal data violates Section 8(7) purpose-limitation mandates under Schedule Entry 7.',
    legalMapping: {
      sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
      sectionOrRule: 'Section 8(7), Section 8(8), Rule 8 & Third Schedule',
      schedule: 'Schedule Entry 7',
      explanation: 'Section 8(7) requires erasure when purpose is no longer served or consent is withdrawn. Rule 8 and the Third Schedule set specific timeframes and mandatory 48-hour pre-erasure notice.',
      commencementStatus: 'in_force',
      effectiveDate: '2023-08-11',
    },
  },

  // 6. Data Principal Rights: Sections 11, 12, 13, 14, Rule 14
  'DPDP-ACT-SEC-11-14-RIGHTS': {
    pageName: 'Privacy Policy Page',
    defaultPageUrl: '/privacy',
    sectionName: 'Your Statutory Data Principal Rights',
    recommendedAction: 'Add',
    placementInstructions: {
      pageName: 'Privacy Policy Page (/privacy)',
      sectionName: 'Section 7: Your Statutory Rights as a Data Principal',
      targetPosition: 'Insert after Section 6 (Security Safeguards) and before Section 8 (Children Privacy Disclosures).',
      isNewSection: true,
      details: 'Detail all four statutory rights under Chapter III (Access, Correction/Erasure, Grievance, Nomination) with a direct link or email to submit requests.',
    },
    findingTitle: 'Missing Comprehensive Data Principal Rights Section & Nomination Facility',
    missingOrInsufficient: 'The privacy policy does not adequately explain the statutory Data Principal rights guaranteed under Sections 11, 12, 13, and 14 of the DPDP Act 2023, specifically omitting the right of nomination.',
    generateReadyToUseContent: (orgName) => `## 7. Your Statutory Rights as a Data Principal

Chapter III (Sections 11–14) of the Digital Personal Data Protection Act, 2023 and Rule 14 of the DPDP Rules, 2025 guarantee you the following statutory rights in respect of your personal data processed by **${orgName}**:

### 7.1 Right to Access Information (Section 11)
You have the right to obtain from us:
- A clear summary of the personal data being processed about you and the processing activities undertaken.
- The identities of all other Data Fiduciaries and Data Processors with whom your personal data has been shared by us, alongside a description of the data shared.
- Any other information related to your personal data as prescribed under the Act.

### 7.2 Right to Correction, Completion, Updating & Erasure (Section 12)
You have the right to request:
- **Correction:** Rectification of any inaccurate or misleading personal data.
- **Completion:** Updating of incomplete personal data.
- **Erasure:** Deletion of personal data that is no longer necessary for the specified purpose, unless retention is mandated by law.

### 7.3 Right of Grievance Redressal (Section 13)
You have the right to have readily available means of grievance redressal provided by ${orgName} regarding any act or omission concerning our compliance with your data protection rights. Contact our Grievance Officer at [grievance@company.com].

### 7.4 Right to Nominate (Section 14)
You have the right to nominate, in the prescribed manner, any individual who shall, in the event of your death or incapacity, exercise your Data Principal rights under the Act. You may update your nominated representative through your **Account Profile > Nominee Settings** or by emailing [nomination@company.com].

### 7.5 How to Exercise Your Rights
To exercise any of the rights described above, submit a written request to our Grievance Team via our **[Online Privacy Request Portal Link]** or email [privacy@company.com] quoting your registered user identifier [Registered Email / Mobile Number]. We will verify your identity and process your request within **[30 calendar days]** without charge.`,
    customizationRequirements: [
      'Create or designate a self-service or email-based workflow to receive rights requests.',
      'Establish an internal procedure to handle nominee designations under Section 14.',
      'Ensure verification procedures confirm requester identity without requesting excessive new personal data.',
    ],
    priority: 'High',
    priorityReason: 'Failure to facilitate Data Principal statutory rights breaches Sections 11-14 and Rule 14, enforceable under Schedule Entry 7.',
    legalMapping: {
      sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
      sectionOrRule: 'Sections 11, 12, 13, 14 & Rule 14',
      schedule: 'Schedule Entry 7',
      explanation: 'Chapter III grants explicit rights of access, correction, erasure, grievance, and nomination. Rule 14 mandates publishing clear means for exercising these rights.',
      commencementStatus: 'in_force',
      effectiveDate: '2023-08-11',
    },
  },

  // 7. Interactive Form Notice & Consent: Section 4, 5, 6(1)
  'DPDP-ACT-SEC-4-FORM-NOTICE': {
    pageName: 'Contact & Registration Forms',
    defaultPageUrl: '/contact',
    sectionName: 'Pre-Submission Privacy Notice & Consent Checkbox',
    recommendedAction: 'Add',
    placementInstructions: {
      pageName: 'Interactive Contact Page (/contact) and Lead Generation Forms',
      sectionName: 'Form Pre-Submission Notice Strip',
      targetPosition: 'Insert directly above the "Submit Message" / "Send Inquiry" button.',
      isNewSection: true,
      details: 'Place a concise, 2-line notice declaring the purpose of data collection, linking to the Privacy Policy, and providing an unchecked opt-in checkbox for optional communications.',
    },
    findingTitle: 'Missing Pre-Submission Purpose Notice & Checkbox on Interactive Forms',
    missingOrInsufficient: 'Interactive web forms collect personal data (name, email, phone) without displaying an adjacent purpose notice or affirmative consent opt-in prior to submission under Section 5(1) and Section 6(1).',
    generateReadyToUseContent: (orgName) => `<!-- Ready-to-Use Contact Form Notice & Consent Snippet -->

<div class="dpdp-form-notice" style="margin-top: 16px; margin-bottom: 16px; font-size: 13px; color: #4b5563; line-height: 1.5;">
  <p style="margin-bottom: 8px;">
    <strong>Privacy Notice:</strong> By submitting this form, you acknowledge that <strong>${orgName}</strong> will collect and process your [Name, Email Address, Phone Number, and Inquiry Details] strictly for the specified purpose of [Responding to your inquiry / providing requested product assistance]. For details on your statutory rights and our Grievance Officer contacts, read our <a href="[Privacy Policy URL: /privacy]" target="_blank" style="color: #0284c7; text-decoration: underline;">Privacy Policy</a> or contact [Grievance Officer Email: grievance@company.com].
  </p>

  <label style="display: flex; align-items: flex-start; gap: 8px; cursor: pointer; margin-top: 8px;">
    <input type="checkbox" name="marketing_consent" id="marketing_consent" style="margin-top: 3px;" />
    <span>
      (Optional) I agree to receive product news, updates, and commercial communications from ${orgName}. I understand I can withdraw my consent at any time at [grievance@company.com] or by clicking "Unsubscribe".
    </span>
  </label>
</div>

<!-- Submit Button -->
<button type="submit" id="contact-submit-btn">
  [Submit Button Label e.g. Send Message]
</button>`,
    customizationRequirements: [
      'Embed the HTML snippet directly above form submission buttons on /contact and /inquiry pages.',
      'Ensure the marketing checkbox is NOT pre-ticked (unchecked by default).',
      'Verify the hyperlink correctly resolves to your published /privacy page.',
    ],
    priority: 'High',
    priorityReason: 'Forms collecting personal data without prior notice violate Section 5(1) and Section 6(1).',
    legalMapping: {
      sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
      sectionOrRule: 'Section 4, Section 5(1), Section 6(1)',
      schedule: 'Schedule Entry 7',
      explanation: 'Section 5(1) mandates prior notice before consent. Collecting contact data without form-level notice breaches statutory disclosure requirements.',
      commencementStatus: 'in_force',
      effectiveDate: '2023-08-11',
    },
  },

  // 8. Children Personal Data: Section 9, Rule 10
  'DPDP-ACT-SEC-9-CHILDREN-DATA': {
    pageName: 'Registration & Onboarding Page',
    defaultPageUrl: '/register',
    sectionName: 'Age Verification Gate & Parental Consent Disclosure',
    recommendedAction: 'Add',
    placementInstructions: {
      pageName: 'User Registration Page (/register or /signup) and Privacy Policy',
      sectionName: 'Age Gate & Parental Consent Notice',
      targetPosition: 'Add during account creation before password entry, and add as Section 8 in the Privacy Policy.',
      isNewSection: true,
      details: 'Require users to declare they are at least 18 years of age, or initiate a verifiable parental consent mechanism before collecting child data.',
    },
    findingTitle: 'Missing Age Declaration Gate & Verifiable Parental Consent Safeguards',
    missingOrInsufficient: 'The registration workflow does not feature an age verification gate or parental consent mechanism, exposing the organization to significant liabilities under Section 9 if minors register.',
    generateReadyToUseContent: (orgName) => `## 8. Protection of Children Personal Data

In compliance with Section 9 of the Digital Personal Data Protection Act, 2023 and Rule 10 of the DPDP Rules, 2025, **${orgName}** enforces strict safeguards regarding the personal data of individuals under eighteen (18) years of age ("Children"):

### 8.1 Age Requirement & Verifiable Parental Consent
- Our services are intended for individuals who have completed **eighteen (18) years of age**.
- We do not knowingly collect or process personal data of any child under 18 years of age without obtaining **verifiable consent** from the child's parent or lawful guardian.
- If we become aware that personal data of a child has been collected without verified parental consent, we will immediately take steps to purge and delete such data from our production systems.

### 8.2 Strict Prohibition on Child Profiling & Targeted Advertising
Pursuant to Section 9(2) and Section 9(3) of the DPDP Act 2023:
1. ${orgName} shall not undertake any processing of personal data that is likely to cause any **detrimental effect** on the well-being of a child.
2. We strictly prohibit and do not undertake **tracking, behavioral monitoring, or targeted advertising** directed at children.

### 8.3 Parental Rights
Parents or lawful guardians who believe their child has provided personal data to us may contact our Grievance Officer at [parental-consent@company.com] to review, rectify, or request immediate erasure of the child's personal data.

[Registration Form Age Gate Checkbox]
<label style="display: flex; align-items: center; gap: 8px;">
  <input type="checkbox" id="age_declaration" name="age_declaration" required />
  <span>I declare that I am 18 years of age or older, or I have verifiable parental consent.</span>
</label>`,
    customizationRequirements: [
      'If your services are accessible to minors, implement verifiable age verification (e.g. DigiLocker, tokenized ID, or guardian declaration) pursuant to Rule 10.',
      'Ensure behavioral tracking, analytics cookies, and marketing ad pixels are disabled for minor accounts.',
      'Provide a dedicated email for parental inquiries (e.g. parental-privacy@company.com).',
    ],
    priority: 'Critical',
    priorityReason: 'Violating children data obligations carries severe penalties under Schedule Item 3 extending up to ₹200 Crore.',
    legalMapping: {
      sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
      sectionOrRule: 'Section 9(1), 9(2), 9(3) & Rule 10',
      schedule: 'Schedule Entry 3',
      explanation: 'Section 9 prohibits processing children data without verifiable parental consent and strictly forbids behavioral tracking/targeted ads. Penalties up to ₹200 Crore.',
      commencementStatus: 'in_force',
      effectiveDate: '2023-08-11',
    },
  },

  // 9. Multi-Lingual Notice (Upcoming Readiness Gap): Section 5(3), Rule 3
  'DPDP-RULES-2025-RULE-3-NOTICE-FORMAT': {
    pageName: 'Privacy Policy & Consent Notice',
    defaultPageUrl: '/privacy',
    sectionName: 'Multi-Lingual Language Switcher & Accessibility Banner',
    recommendedAction: 'Add',
    placementInstructions: {
      pageName: 'Privacy Policy Page (/privacy) and Global Cookie Banner',
      sectionName: 'Header Language Switcher Toolbar',
      targetPosition: 'Place at the very top of the Privacy Policy page as a localized language dropdown toolbar.',
      isNewSection: true,
      details: 'Add an interactive language dropdown supporting English and Eighth Schedule Indian languages (Hindi, Marathi, Bengali, Tamil, Telugu, etc.).',
    },
    findingTitle: 'Multi-Lingual Notice Accessibility in Eighth Schedule Indian Languages',
    missingOrInsufficient: 'The privacy notice is published solely in English without a language switcher enabling Data Principals to access disclosures in Indian languages specified under the Eighth Schedule to the Constitution.',
    generateReadyToUseContent: (orgName) => `<!-- Multi-Lingual Accessibility Toolbar for Privacy Policy -->

<div class="dpdp-language-toolbar" style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 16px; border-radius: 8px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
  <div style="font-size: 13px; color: #334155;">
    <strong>Language / भाषा / ভাষা / மொழி:</strong>
    <span>Access this privacy notice in English or any 8th Schedule Indian language pursuant to Section 5(3) of DPDP Act 2023 and Rule 3 of DPDP Rules 2025.</span>
  </div>
  
  <select id="dpdp-lang-select" style="padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; background: white;">
    <option value="en" selected>English</option>
    <option value="hi">हिंदी (Hindi)</option>
    <option value="mr">मराठी (Marathi)</option>
    <option value="bn">বাংলা (Bengali)</option>
    <option value="ta">தமிழ் (Tamil)</option>
    <option value="te">తెలుగు (Telugu)</option>
    <option value="gu">ગુજરાતી (Gujarati)</option>
    <option value="kn">ಕನ್ನಡ (Kannada)</option>
    <option value="ml">മലയാളം (Malayalam)</option>
    <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
  </select>
</div>

[Readiness Guidance Note]
Note: Rule 3 of DPDP Rules 2025 comes into force on 13 May 2027 (18 months from gazette publication). This item represents an Upcoming Compliance / Readiness Gap. Implementing localized translations now ensures seamless compliance ahead of the statutory effective date.`,
    customizationRequirements: [
      'Translate your core privacy notice and consent banner into key languages matching your Indian user demographics.',
      'Deploy the language selector widget in your website header or top of /privacy page.',
      'Ensure translations are legally vetted to match official terms under the Act.',
    ],
    priority: 'Low',
    priorityReason: 'Upcoming Compliance Gap: Rule 3 effective date is 13 May 2027. Excluded from mandatory violation penalties during 2026.',
    legalMapping: {
      sourceDocument: OFFICIAL_SOURCES.RULES_2025.name,
      sectionOrRule: 'Section 5(3) & Rule 3',
      schedule: 'Schedule Entry 7',
      explanation: 'Section 5(3) grants Data Principals the option to access notices in English or any 8th Schedule language. Rule 3 details notice structure (effective 13 May 2027).',
      commencementStatus: 'upcoming_compliance',
      effectiveDate: '2027-05-13',
    },
  },
};

/**
 * Generates ready-to-use content suggestion for a finding, using Gemini AI if available
 * or the authoritative legal knowledge base template fallback.
 * 
 * @param {object} params
 * @param {string} params.requirementId
 * @param {string} params.organizationName
 * @param {string} params.existingContentSnippet
 * @param {string} params.pageUrl
 * @param {string} [params.assessmentDate]
 * @returns {Promise<object>} Complete content suggestion structure
 */
export async function generateContentSuggestion({
  requirementId,
  organizationName = 'Authorized Data Fiduciary',
  existingContentSnippet = '',
  pageUrl = '',
  assessmentDate = new Date(),
}) {
  const template = CANONICAL_TEMPLATES[requirementId] || null;

  // Derive page name and target URL
  let resolvedPageName = 'Website Policy Page';
  let resolvedPageUrl = pageUrl || '/privacy';
  let recommendedAction = 'Add';

  if (template) {
    resolvedPageName = template.pageName;
    resolvedPageUrl = pageUrl || template.defaultPageUrl;
    recommendedAction = existingContentSnippet && existingContentSnippet.trim().length > 30 ? 'Update' : template.recommendedAction;
  }

  // Base structured fallback
  let readyToUseText = template
    ? template.generateReadyToUseContent(organizationName)
    : `## Privacy Notice & DPDP Compliance Disclosure\n\nPursuant to the Digital Personal Data Protection Act, 2023, **${organizationName}** collects and processes personal data strictly for specified, lawful purposes with prior affirmative consent. To exercise your rights or contact our Grievance Officer, email [grievance@company.com].`;

  let placementInstructions = template?.placementInstructions || {
    pageName: resolvedPageName,
    sectionName: 'Privacy Disclosures Section',
    targetPosition: 'Add as a dedicated section on the page.',
    isNewSection: true,
    details: 'Ensure the section is clearly accessible from the website navigation or footer.',
  };

  let customizationRequirements = template?.customizationRequirements || [
    'Verify organizational facts, including contact details and retention durations.',
    'Have legal counsel review before publishing.',
  ];

  let priority = template?.priority || 'Medium';
  let priorityReason = template?.priorityReason || 'Required to maintain statutory compliance under DPDP Act 2023.';
  let legalMapping = template?.legalMapping || {
    sourceDocument: OFFICIAL_SOURCES.ACT_2023.name,
    sectionOrRule: 'Section 5(1)',
    schedule: 'Schedule Entry 7',
    explanation: 'Statutory compliance obligation under DPDP Act 2023.',
    commencementStatus: 'in_force',
    effectiveDate: '2023-08-11',
  };

  let missingOrInsufficient = template?.missingOrInsufficient || 'Statutory disclosure is incomplete or missing from the inspected webpage.';
  let findingTitle = template?.findingTitle || 'Missing Required DPDP Statutory Disclosure';

  // Evaluate commencement status relative to assessment date
  const commencementCheck = evaluateCommencement(legalMapping.effectiveDate, assessmentDate);
  if (!commencementCheck.isInForce && commencementCheck.commencementStatus === 'upcoming_compliance') {
    legalMapping.commencementStatus = 'upcoming_compliance';
    priority = 'Low';
    priorityReason = `Upcoming Compliance Gap: Provision comes into force on ${legalMapping.effectiveDate}. Early readiness recommended.`;
  }

  // Attempt dynamic Gemini enhancement if API key is present
  const geminiClient = getGeminiClient();
  if (geminiClient && template) {
    try {
      const prompt = `You are a certified Data Protection Legal Expert specializing in India's Digital Personal Data Protection Act, 2023 (DPDP Act) and DPDP Rules, 2025.

Generate complete, ready-to-use website content to remediate a missing or incomplete legal disclosure on a client website.

CONTEXT:
- Assessed Organization: "${organizationName}"
- Target Page: "${resolvedPageName}" (${resolvedPageUrl})
- Finding Title: "${findingTitle}"
- Statutory Provision: "${legalMapping.sectionOrRule}" (${legalMapping.sourceDocument})
- Missing Requirement: "${missingOrInsufficient}"
- Existing Content on Website: "${(existingContentSnippet || 'No existing disclosure found on page.').slice(0, 1000)}"

MANDATORY LEGAL CONTENT RULES:
1. Generate the COMPLETE, copyable text or markdown suitable for direct website implementation.
2. DO NOT invent company details, employee names, email IDs, phone numbers, postal addresses, retention periods, or technical safeguards.
3. ALWAYS use visible brackets for placeholders: [Grievance Officer Name], [grievance-email@company.com], [Postal Address], [Retention Period e.g. 36 months].
4. Clearly distinguish legally mandatory disclosures from best practices.
5. Tone must be professional, clear, and user-friendly.
6. Return your response STRICTLY as valid JSON:
{
  "readyToUseContent": "Full formatted markdown text of the suggested website section",
  "missingOrInsufficient": "1-2 sentence description of exact missing content",
  "recommendedAction": "Add" | "Update" | "Replace" | "Remove",
  "placementDetails": "Precise instruction on where to place this content on the page",
  "customizationChecklist": ["item 1 to verify", "item 2 to verify", "item 3 to verify"]
}`;

      const response = await geminiClient.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const responseText = response?.text || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.readyToUseContent && parsed.readyToUseContent.length > 50) {
          readyToUseText = parsed.readyToUseContent;
        }
        if (parsed.missingOrInsufficient) {
          missingOrInsufficient = parsed.missingOrInsufficient;
        }
        if (parsed.recommendedAction) {
          recommendedAction = parsed.recommendedAction;
        }
        if (parsed.placementDetails) {
          placementInstructions = {
            ...placementInstructions,
            details: parsed.placementDetails,
          };
        }
        if (Array.isArray(parsed.customizationChecklist) && parsed.customizationChecklist.length > 0) {
          customizationRequirements = parsed.customizationChecklist;
        }
      }
    } catch (err) {
      // Gracefully fall back to deterministic template
      console.warn(`[Content Suggestion Engine] Gemini enhancement fallback: ${err.message}`);
    }
  }

  return {
    pageUrl: resolvedPageUrl,
    pageName: resolvedPageName,
    findingTitle,
    existingContent: existingContentSnippet && existingContentSnippet.trim().length > 0
      ? existingContentSnippet.trim().slice(0, 1500)
      : 'No disclosure or mechanism found on the page.',
    missingOrInsufficient,
    recommendedAction,
    readyToUseContent: readyToUseText,
    placementInstructions,
    legalMapping,
    customizationRequirements,
    priority,
    priorityReason,
    requiresLegalReview: true,
    generatedAt: new Date(),
    disclaimer: STATUTORY_DISCLAIMER_TEXT,
  };
}

/**
 * Helper to group an array of findings with content suggestions page-wise.
 * 
 * @param {Array<object>} findings
 * @returns {Array<{ pageName: string, pageUrl: string, suggestions: Array<object> }>}
 */
export function groupSuggestionsByPage(findings = []) {
  const pageMap = new Map();

  for (const f of findings) {
    if (!f.contentSuggestion || !f.contentSuggestion.readyToUseContent) continue;
    const cs = f.contentSuggestion;
    const key = cs.pageName || cs.pageUrl || 'General Website Policies';

    if (!pageMap.has(key)) {
      pageMap.set(key, {
        pageName: cs.pageName || 'General Website Policies',
        pageUrl: cs.pageUrl || '',
        suggestions: [],
      });
    }

    pageMap.get(key).suggestions.push({
      findingId: f._id || f.requirementId,
      requirementId: f.requirementId,
      ruleId: f.ruleId,
      status: f.status,
      severity: f.severity,
      ...cs,
    });
  }

  return Array.from(pageMap.values());
}
