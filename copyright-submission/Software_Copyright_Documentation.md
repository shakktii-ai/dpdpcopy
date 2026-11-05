# SOFTWARE COPYRIGHT REGISTRATION DOCUMENTATION
## Literary Work — Computer Software
### Comprehensive Technical Architecture, Original Expression, & Source Code Specification

---

## DOCUMENT METADATA & COPYRIGHT PARTICULARS

| Metadata Field | Registration Specification |
|---|---|
| **Title of the Software Work** | **DPDP Vault / DPDP Assessment Platform** *(Proposed Title — Subject to confirmation by Applicant)* |
| **Author(s)** | `[APPLICANT AUTHOR NAME PLACEHOLDER — To be filled by Claimant, e.g. Full Legal Name of Individual Developer / Team]` |
| **Copyright Claimant / Owner** | `[COPYRIGHT OWNER / ENTITY NAME PLACEHOLDER — e.g. Company Name / Individual Legal Name]` |
| **Class of Work** | Literary Work — Computer Software (Section 2(o) of Indian Copyright Act, 1957) |
| **Programming Language(s)** | JavaScript (ES2024 / Node.js 20+), JSX (React 19), CSS3, JSON, MongoDB Query Language |
| **Target Runtime Environment** | Node.js 20+, Next.js 15 App Router, Vercel Serverless Functions, Modern Web Browsers |
| **Date of Creation / Completion** | `[CREATION DATE PLACEHOLDER — To be confirmed by Applicant, e.g. October 2026]` |
| **Publication Status** | `[PUBLICATION STATUS PLACEHOLDER — e.g. Unpublished Work OR Published on DD/MM/YYYY at URL]` |
| **Country of Origin** | India |

> [!IMPORTANT]
> **SPECIAL REGULATORY NOTE REGARDING "PDF FOR LITERARY CONTENT":**  
> Under Indian Copyright Practice (Copyright Rules, 2013), computer software is registered under the category of **"Literary Work"**. Registration authorities typically require applicants to deposit either:
> 1. A detailed technical document explaining the software's structure and operation (this document), and/or
> 2. The source code itself (commonly the first 10 and last 10 pages, or first 30 and last 30 pages of the unredacted source code listing, without secrets).  
> **Recommendation**: The applicant must confirm with their copyright attorney or registration agent whether the Copyright Office requires this Technical Specification PDF, a Source Code Excerpt PDF, or both.

---

## TABLE OF CONTENTS

1. **Introduction and Purpose of the Software**
2. **System Architecture and Execution Model**
3. **Core Functional Modules**
   - 3.1 Synchronous Assessment & Browser Inspection Engine (`lib/assessment-runner.js`)
   - 3.2 Canonical Statutory Requirement Registry (`lib/requirement-registry.js`)
   - 3.3 Compliance Evaluation & Scoring Engine (`lib/assessment-engine.js`)
   - 3.4 Autonomous Multimodal AI Analysis (`lib/gemini.js` & `lib/autonomous-agent.js`)
   - 3.5 Universal Dual-Mode Browser Launcher (`lib/browser-launcher.js`)
   - 3.6 Security Safeguards, SSRF Defense & Encryption (`lib/security.js`)
   - 3.7 Evidence Capture & Automated Redaction Engine (`lib/cloudinary.js` & `lib/evidence-redactor.js`)
   - 3.8 Real-Time Event Bus & State Synchronization (`lib/event-bus.js`)
   - 3.9 Automated Document & Statutory Report Generator (`lib/report-generator.js`)
4. **Data Models and Database Schema Specification**
5. **Original Source Code Structure & Organization**
6. **Artificial Intelligence Integration & Safety Governance**
7. **Browser Automation & Execution Safeguards**
8. **Third-Party Open Source Libraries & External Services**
9. **Authorship, Novelty, and Non-Infringement Statement**

---

## 1. INTRODUCTION AND PURPOSE OF THE SOFTWARE

**DPDP Vault / DPDP Assessment Platform** is an original computer software system engineered to automate the verification, auditing, and continuous compliance monitoring of digital websites and consumer applications under India's **Digital Personal Data Protection Act, 2023 (DPDP Act)** and Data Protection Board of India statutory requirements.

In traditional enterprise compliance, evaluating an organization's digital web presence against privacy regulations requires manual legal inspections, subjective questionnaires, and static audits that rapidly become obsolete. DPDP Vault solves this technical problem through an autonomous, empirical software architecture:

1. **Empirical Digital Inspection**: The software programmatically launches a sandboxed browser instance, navigates to approved target domains, explores interactive elements (consent banners, cookie preference centers, privacy policies, grievance officer disclosures, registration forms), and captures cryptographic DOM evidence.
2. **Statutory Reasoning via Multimodal AI**: The platform pairs browser automation with the Google Gemini 3.8 Flash model to parse and interpret visual website presentations against statutory benchmarks (e.g. assessing whether privacy notices are presented in accessible Schedule 8 Indian languages, verifying that notice terms are unconditional, and confirming affirmative consent mechanisms).
3. **Deterministic Mathematical Scoring**: The system calculates a reproducible compliance percentage score based on statutory applicability dates, severity weightings, and evidence verification.
4. **Automated Evidence and Report Delivery**: Generates audit-ready PDF compliance certificates and Excel remediation workbooks complete with visual evidence links and remediation guidance.

---

## 2. SYSTEM ARCHITECTURE AND EXECUTION MODEL

DPDP Vault implements a modern **Direct Synchronous Serverless Architecture** built upon the Next.js 15 App Router. The software eliminates the operational complexity of background daemons, worker instances, and distributed queue systems by encapsulating the entire inspection pipeline within high-memory serverless execution functions.

### Execution Workflow Pipeline

```
[ Client User / Organization Admin ]
                 │
                 ▼  (HTTPS / REST)
[ Next.js 15 App Router API Layer ]
   ├── Authentication & RBAC Session Verification (lib/auth.js)
   ├── SSRF & Domain Allowlist Protection (lib/security.js)
   └── TestRun & Audit Log Initialization (models/TestRun.js)
                 │
                 ▼
[ Synchronous Assessment Engine (lib/assessment-runner.js) ]
   ├── Step 1: Universal Browser Launcher (lib/browser-launcher.js)
   │           • Serverless Chromium (@sparticuz/chromium) on Vercel
   │           • Local Workstation Playwright Chromium during dev
   │           • Optional CDP WebSocket Proxy
   │
   ├── Step 2: Multi-Stage Autonomous Target Navigation
   │           • Stage 1: Landing Page & Privacy Notice Accessibility (Sec 5)
   │           • Stage 2: Consent Banner & Affirmative Consent (Sec 6)
   │           • Stage 3: Grievance Redressal Officer Verification (Sec 8(9))
   │           • Stage 4: Consent Manager Granularity & Withdrawal (Sec 6)
   │           • Stage 5: Child Data Protection & Age Safeguards (Sec 9)
   │           • Stage 6: Authentication & Password Security (Sec 8(5))
   │           • Stage 7: Privacy Policy Document Comprehensive Audit
   │
   ├── Step 3: In-Memory Evidence Capture & Redaction (lib/cloudinary.js)
   │           • Memory buffer streaming to Cloudinary Cloud CDN
   │           • Regex scrubbing of sensitive tokens, passwords, secrets
   │
   ├── Step 4: Multimodal AI Statutory Reasoning (lib/gemini.js)
   │           • Autonomous visual comprehension of consent interfaces
   │           • Language accessibility & transparency assessment
   │
   ├── Step 5: Compliance Scoring & Synthesis (lib/assessment-engine.js)
   │           • Normalized compliance score calculation (0 - 100%)
   │           • Severity weighting (Critical, High, Medium, Low)
   │
   └── Step 6: Atomic MongoDB Persistence & Real-Time Event Broadcast
                 │
                 ▼
[ Synchronous HTTP 200 Response with Complete Assessment Results ]
```

---

## 3. CORE FUNCTIONAL MODULES

### 3.1 Synchronous Assessment & Browser Inspection Engine (`lib/assessment-runner.js`)
The assessment runner is the core execution orchestration engine of the platform (1,667 lines of original JavaScript). It coordinates the end-to-end inspection lifecycle:
- Manages browser contexts, user agent strings, and viewport configurations.
- Sequentially executes 7 statutory inspection stages against the target URL.
- Records fine-grained timing diagnostics (`browserLaunchMs`, `inspectionMs`, `screenshotCloudinaryMs`, `geminiAnalysisMs`, `mongoPersistenceMs`).
- Emits real-time progression events to the client interface via Server-Sent Events (SSE).

### 3.2 Canonical Statutory Requirement Registry (`lib/requirement-registry.js`)
An original, authoritative digital legal knowledge base translating statutory provisions of the DPDP Act, 2023 and Data Protection Board of India rules into machine-evaluable specifications (1,450 lines of original JavaScript). Each requirement record contains:
- Unique requirement identifier (e.g. `DPDP-ACT-SEC-5-1-NOTICE`, `DPDP-ACT-SEC-8-9-GRIEVANCE-OFFICER`, `DPDP-ACT-SEC-9-1-CHILD-CONSENT`).
- Legal reference (Section, Sub-section, Rule).
- Statutory applicability dates (e.g. distinguishing commenced rules from future Phase-2 rules).
- Automated inspection rules, target selectors, and scoring weights.

### 3.3 Compliance Evaluation & Scoring Engine (`lib/assessment-engine.js` & `lib/assessment-summary.js`)
Computes an objective, normalized compliance score:
$$\text{Compliance Score} = \left\lfloor \frac{\text{Passed Findings}}{\text{Total Actionable Findings}} \times 100 \right\rfloor$$
- Correctly filters out `not_applicable` and `not_tested` provisions from the scoring denominator to prevent mathematical distortion.
- Classifies findings across 5 standardized severity levels: `critical`, `high`, `medium`, `low`, and `informational`.

### 3.4 Autonomous Multimodal AI Analysis (`lib/gemini.js` & `lib/autonomous-agent.js`)
Integrates the Google Gemini 3.8 Flash multimodal API to analyze captured visual browser evidence:
- Evaluates clarity, font legibility, and prominent placement of privacy notices.
- Inspects affirmative consent mechanisms to detect deceptive design patterns ("dark patterns").
- Validates the presence of mandatory statutory disclosures (Data Protection Officer / Grievance Officer email, physical postal address in India).

### 3.5 Universal Dual-Mode Browser Launcher (`lib/browser-launcher.js`)
An intelligent environment-aware browser bootstrapper:
- Automatically detects whether the process is executing within AWS Lambda / Vercel Serverless or a local developer workstation.
- On Vercel: Loads `@sparticuz/chromium` with single-process sandboxing flags (`--no-sandbox`, `--disable-dev-shm-usage`, `--disable-gpu`).
- On Local Desktop: Launches local Playwright Chromium executable.
- Supports external browser clusters via remote Chrome DevTools Protocol (`BROWSER_WS_ENDPOINT`).

### 3.6 Security Safeguards, SSRF Defense & Encryption (`lib/security.js`)
Implements strict security boundaries:
- **SSRF Prevention**: Blocks loopback IPs (`127.0.0.0/8`), private RFC1918 subnets (`10/8`, `172.16/12`, `192.168/16`), Carrier-Grade NAT (`100.64.0.0/10`), link-local metadata addresses (`169.254.169.254`), and internal cloud metadata domains.
- **Credential Encryption at Rest**: Encrypts sensitive credentials in MongoDB using authenticated **AES-256-GCM** with unique initialization vectors (IV) and authentication tags.
- **Upload File Validation**: Enforces a 10MB limit and restricts file types to safe documents (PDF, TXT, DOCX), strictly blocking executable formats (`.exe`, `.sh`, `.bat`, `.dll`).

### 3.7 Evidence Capture & Automated Redaction Engine (`lib/cloudinary.js` & `lib/evidence-redactor.js`)
- **Direct Buffer Streaming**: Streams screenshot images directly from memory buffers to Cloudinary CDN, bypassing ephemeral serverless filesystems.
- **Automated PII Redaction**: Pattern-matching regex engine scrubs auth tokens, API keys, session cookies, and passwords from URLs, execution logs, and captured evidence before storage.

### 3.8 Real-Time Event Bus (`lib/event-bus.js`)
- Singleton `EventEmitter` managing live status broadcasts for assessment runs.
- Integrates seamlessly with Server-Sent Events (SSE) route handlers (`app/api/assessments/[id]/stream/route.js`) to power live customer monitoring dashboards without polling.

### 3.9 Automated Document & Statutory Report Generator (`lib/report-generator.js`)
- **PDF Generation**: Compiles professional, multi-page statutory audit reports using PDFKit, complete with executive summaries, visual score gauges, finding breakdown tables, and evidence URLs.
- **Excel Generation**: Exports comprehensive tabular workbooks using ExcelJS for enterprise compliance tracking and technical remediation workflows.

---

## 4. DATA MODELS AND DATABASE SCHEMA SPECIFICATION

The application defines 16 original Mongoose schemas in `models/`:

1. **User (`models/User.js`)**: User identity, hashed credentials, roles (`platform_administrator`, `assessment_reviewer`, `organization_owner`, `user`), and organizational affiliation.
2. **Organization (`models/Organization.js`)**: Enterprise data fiduciary profile, industry categorization, and contact details.
3. **ApprovedTarget (`models/ApprovedTarget.js`)**: Authorized domain allowlist, verification tokens, and scope boundaries.
4. **AssessmentProfile (`models/AssessmentProfile.js`)**: Configurable inspection profiles defining depth, statutory scope, and scenarios.
5. **Assessment (`models/Assessment.js`)**: Master assessment record tracking status (`pending`, `in_progress`, `completed`, `failed`), overall compliance score, and timestamps.
6. **TestRun (`models/TestRun.js`)**: Granular execution run record containing stage timings, execution logs, screenshots, and error diagnostics.
7. **Finding (`models/Finding.js`)**: Individual statutory finding containing requirement ID, status (`pass`, `fail`, `needs_review`, `not_applicable`), severity, legal reference, and remediation steps.
8. **LegalRequirement (`models/LegalRequirement.js`)**: Canonical statutory provision specifications.
9. **ScenarioResult (`models/ScenarioResult.js`)**: Results of individual interactive browser test scenarios.
10. **Evidence (`models/Evidence.js`)**: Cryptographic record of captured screenshot evidence, Cloudinary public URLs, and step metadata.
11. **StructuredObservation (`models/StructuredObservation.js`)**: Multimodal AI vision observations extracted from screenshots.
12. **BrowserAction (`models/BrowserAction.js`)**: Granular browser action history (clicks, navigation, keystrokes, durations).
13. **AssessmentEvent (`models/AssessmentEvent.js`)**: Real-time event log for timeline visualization.
14. **AssessmentDocument (`models/AssessmentDocument.js`)**: Metadata of uploaded privacy policy documents.
15. **AuditLog (`models/AuditLog.js`)**: Immutable security audit trail recording administrative modifications.
16. **Report (`models/Report.js`)**: Generated PDF/Excel report records and access tokens.

---

## 5. ORIGINAL SOURCE CODE STRUCTURE & ORGANIZATION

The software is organized into clean, modular layers following the Next.js App Router conventions:

- `app/`: Contains 27 user-facing pages, interactive dashboards, and client portals.
- `app/api/`: Contains 18 serverless REST API endpoints and SSE event streams.
- `components/`: Contains 9 reusable React UI components.
- `lib/`: Contains 15 core architectural libraries and computational engines.
- `models/`: Contains 16 Mongoose data models.
- `scripts/`: Contains automated testing suites and verification harnesses.

---

## 6. ARTIFICIAL INTELLIGENCE INTEGRATION & SAFETY GOVERNANCE

The software incorporates Google's Gemini 3.8 Flash model via `@google/genai` under strict deterministic constraints:
- **Heuristic Temperature Minimization**: Prompts are structured with zero-temperature settings to ensure reproducible statutory reasoning.
- **Safety Controller (`lib/safety-controller.js`)**: Prevents the AI model from executing unauthorized browser actions, filtering out attempts to click payment buttons, submit credentials, or trigger destructive account actions.
- **Prompt Injection Defense**: Input sanitization scrubs adversarial instructions before dispatching prompts to the Gemini API.

---

## 7. BROWSER AUTOMATION & EXECUTION SAFEGUARDS

Browser automation is executed through Playwright with extensive sandboxing:
- **Headless Execution**: Browsers run in headless mode without display servers.
- **Resource Constraints**: Strict 30-second navigation timeouts and memory limits prevent resource exhaustion.
- **Network Sandboxing**: SSRF filters prevent the automated browser from accessing local loopback interfaces, intranet subnets, or cloud hypervisor metadata endpoints.

---

## 8. THIRD-PARTY OPEN SOURCE LIBRARIES & EXTERNAL SERVICES

The software was developed utilizing open-source libraries licensed under permissive terms (MIT / Apache 2.0). These libraries provide foundational infrastructure, while all compliance logic, assessment algorithms, and user interfaces represent original proprietary work:

| Library / Service | Version | License | Role in Platform |
|---|---|---|---|
| **Next.js** | 15.1.7 | MIT | Server-side rendering & serverless API framework |
| **React & React-DOM** | 19.0.0 | MIT | Component UI rendering |
| **Mongoose** | 8.10.1 | MIT | MongoDB object modeling |
| **@google/genai** | 2.30.0 | Apache 2.0 | Google Gen AI API client |
| **Playwright / Playwright-Core** | 1.64.1 | Apache 2.0 | Browser automation driver |
| **@sparticuz/chromium** | 153.0.0 | MIT | Serverless Chromium binary for Vercel/Lambda |
| **PDFKit** | 0.20.2 | MIT | Programmatic PDF report layout |
| **ExcelJS** | 4.4.0 | MIT | Programmatic Excel spreadsheet generation |
| **bcryptjs** | 3.0.3 | MIT | Cryptographic password hashing |
| **jsonwebtoken** | 9.0.3 | MIT | JWT session token generation & verification |
| **Tailwind CSS** | 3.4.17 | MIT | Utility-first stylesheet compiler |
| **Cloudinary** | 2.11.0 | MIT | Cloud screenshot evidence storage |

---

## 9. AUTHORSHIP, NOVELTY, AND NON-INFRINGEMENT STATEMENT

The applicant affirms that:
1. The **DPDP Vault / DPDP Assessment Platform** source code is an original literary creation of the author(s).
2. The software design, algorithmic scoring model, statutory legal registry, and browser inspection workflows were independently designed and developed.
3. No proprietary third-party source code, trade secrets, or unauthorized copyrighted materials have been incorporated into this work.
4. The software utilizes third-party open-source components strictly in accordance with their respective open-source licenses.
