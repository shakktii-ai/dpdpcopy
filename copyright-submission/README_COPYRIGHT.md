# DPDP Vault — Automated Privacy Compliance Assessment Platform

**Proposed Title of Software Work**: DPDP Vault / DPDP Assessment Platform  
*(Note: Proposed title pending applicant confirmation with the Copyright Office)*  
**Copyright Submission Edition**: October 2026  
**Language & Runtime**: JavaScript (ES2024 / Node.js 20+), Next.js 15 (App Router), React 19  

---

## 1. Project Overview

**DPDP Vault** is an automated website privacy compliance assessment and governance platform engineered specifically for India's **Digital Personal Data Protection Act, 2023 (DPDP Act)** and Data Protection Board enforcement requirements.

The platform provides end-to-end automation for assessing digital properties (websites, web applications, customer portals) against key statutory provisions:
- **Section 5 & 6**: Notice accessibility, language availability (Schedule 8 Indian languages), purpose specification, and affirmative consent mechanisms.
- **Section 8(9)**: Grievance Redressal Officer statutory disclosure (Name, Designation, Official Email, Physical Address, Redressal Mechanism).
- **Section 6(4) & 6(7)**: Consent withdrawal mechanisms, granularity of choices, and consent manager integration readiness.
- **Section 9**: Child data protection safeguards, age verification barriers, and parental consent validation.
- **Section 8(5)**: Authentication security safeguards and password masking controls.

The platform combines automated sandboxed Chromium browser exploration, Google Gemini 3.8 Flash multimodal reasoning, mathematical compliance scoring, and PDF/Excel audit report generation.

---

## 2. Technology Stack & Architecture

### 2.1 Core Framework & Frontend
- **Framework**: Next.js 15 (App Router with Server Components and dynamic Route Handlers).
- **User Interface**: React 19, JSX, Tailwind CSS v3.4, Lucide React icons.
- **Styling**: Utility-first CSS, custom CSS design tokens, responsive typography.

### 2.2 Backend & Data Persistence
- **Runtime**: Node.js 20+ (ES Modules).
- **Database**: MongoDB Atlas via Mongoose v8.10 ORM.
- **Authentication**: JWT (JSON Web Tokens) with HMAC-SHA256 signing, HTTP-only secure cookies, and bcryptjs password hashing.
- **Role-Based Access Control (RBAC)**: Support for `platform_administrator`, `assessment_reviewer`, `organization_owner`, and `user`.

### 2.3 Browser Automation & Inspection Engine
- **Engine**: Playwright / Playwright-Core with sandboxed Chromium browser automation.
- **Dual Runtime Support**:
  - *Cloud Serverless (Vercel Functions)*: Executes headless via `@sparticuz/chromium` (`maxDuration: 300`, `memory: 2048MB`).
  - *Local Workstation*: Launches local Playwright Chromium (`C:\Users\...\AppData\Local\ms-playwright\...`).
  - *Remote CDP Endpoint*: Optional WebSocket connection via `BROWSER_WS_ENDPOINT`.
- **Security & Sandboxing**: Server-Side Request Forgery (SSRF) defense, loopback/private IP blocking, link-local metadata protection, and target domain allowlisting.

### 2.4 Artificial Intelligence & Vision Analysis
- **SDK**: Official `@google/genai` (Google Gen AI SDK).
- **Model**: Google Gemini 3.8 Flash (with intelligent fallback hierarchy to Gemini 2.5 Flash).
- **Functionality**: Multimodal vision inspection of consent banners, privacy notices, language clarity analysis, and autonomous computer use evaluation with strict safety controllers.

### 2.5 Evidence Management & Reporting
- **Evidence Storage**: In-memory screenshot capture streamed directly to Cloudinary CDN with fallback to local temporary disk buffers.
- **Redaction Engine**: Automated regex masking of tokens, passwords, and sensitive keys from URLs, screenshots, and logs.
- **Document Generation**: PDFKit (formal statutory PDF reports) and ExcelJS (tabular findings workbook).

---

## 3. Directory Structure

```
dpdp-vault/
├── app/                                 # Next.js 15 App Router
│   ├── admin/                           # Administrative management dashboard
│   ├── api/                             # Serverless API route handlers
│   │   ├── assessments/                 # Assessment lifecycle & streaming
│   │   ├── auth/                        # Login, registration, session handlers
│   │   ├── documents/                   # Policy document uploads & validation
│   │   ├── evidence/                    # Evidence retrieval & metadata
│   │   ├── findings/                    # Statutory findings queries
│   │   ├── gemini/                      # AI capability verification endpoint
│   │   ├── health/                      # System health check
│   │   ├── onboarding/                  # Multi-step organization onboarding
│   │   ├── organizations/               # Organization management
│   │   ├── profiles/                    # Assessment profile definitions
│   │   ├── remediation/                 # Corrective action tracking
│   │   ├── reports/                     # Report generation endpoints
│   │   ├── requirements/                # Statutory requirement registry API
│   │   ├── runs/                        # TestRun execution triggers
│   │   ├── stats/                       # Dashboard statistical aggregations
│   │   └── targets/                     # Approved target website registry
│   ├── assessments/                     # Assessments list and wizard UI
│   ├── documents/                       # Statutory policy document repository
│   ├── findings/                        # Detailed findings and severity viewer
│   ├── login/                           # User authentication interface
│   ├── onboarding/                      # Organization onboarding flow
│   ├── organizations/                   # Organization configuration views
│   ├── portal/                          # Client-facing compliance portal
│   ├── register/                        # User registration interface
│   ├── remediation/                     # Remediation tracker UI
│   ├── reports/                         # PDF/Excel report downloads UI
│   ├── settings/                        # Platform configuration & API keys
│   ├── targets/                         # Approved target management UI
│   ├── testing/                         # Live interactive testing studio
│   ├── globals.css                      # Global stylesheets and utility classes
│   └── layout.js                        # Root application layout
├── components/                          # Reusable React UI Components
│   ├── AppShell.jsx                     # Layout shell with navigation
│   ├── CustomerFooter.jsx               # Client portal footer
│   ├── CustomerHeader.jsx               # Client portal header
│   ├── EmptyState.jsx                   # Reusable empty data placeholder
│   ├── Header.jsx                       # Main application header & user menu
│   ├── ReassessmentModal.jsx            # Multi-mode reassessment trigger dialog
│   ├── Sidebar.jsx                      # Navigation sidebar
│   ├── StatCard.jsx                     # Metric card with visual indicators
│   └── StatusBadge.jsx                  # DPDP compliance status badge
├── lib/                                 # Core Business Logic & Engines
│   ├── assessment-engine.js             # Compliance evaluation & scoring logic
│   ├── assessment-runner.js             # Synchronous browser inspection engine
│   ├── assessment-summary.js            # Unified score computation formulas
│   ├── auth.js                          # Session signing & RBAC authorization
│   ├── autonomous-agent.js              # Gemini autonomous inspection loop
│   ├── browser-launcher.js              # Dual-runtime Playwright browser launcher
│   ├── cloudinary.js                    # Evidence screenshot streaming
│   ├── event-bus.js                     # Real-time SSE event bus & emitter
│   ├── evidence-redactor.js             # Sensitive data & credential scrubbing
│   ├── gemini.js                        # Google GenAI client & vision analysis
│   ├── mongodb.js                       # Mongoose connection manager & caching
│   ├── report-generator.js              # PDF & Excel statutory report compiler
│   ├── requirement-registry.js          # Canonical DPDP legal requirement rules
│   ├── safety-controller.js             # AI action safety & prompt injection guards
│   └── security.js                      # SSRF validator, URL sanitizer, encryption
├── models/                              # Mongoose Database Schemas (16 Models)
│   ├── ApprovedTarget.js                # Target domain allowlist & verification
│   ├── Assessment.js                    # Assessment header & lifecycle states
│   ├── AssessmentDocument.js            # Uploaded privacy policy documents
│   ├── AssessmentEvent.js               # Real-time inspection event log
│   ├── AssessmentProfile.js             # Inspection scope & depth profiles
│   ├── AuditLog.js                      # Immutable administrative audit trail
│   ├── BrowserAction.js                 # Granular browser automation actions
│   ├── Evidence.js                      # Screenshot metadata & Cloudinary URLs
│   ├── Finding.js                       # Statutory violation & observation records
│   ├── LegalRequirement.js              # DPDP statutory requirement definitions
│   ├── Organization.js                  # Data Fiduciary organization profile
│   ├── Report.js                        # Generated report metadata
│   ├── ScenarioResult.js                # Individual test scenario pass/fail results
│   ├── StructuredObservation.js         # AI vision extraction observations
│   ├── TestRun.js                       # Execution run records & timing metrics
│   └── User.js                          # Authenticated user accounts & roles
├── public/                              # Static Public Assets
│   └── evidence/                        # Local evidence placeholder (.gitkeep)
├── scripts/                             # Verification & Test Suites
│   ├── test-dpdp-2026-board-requirements.mjs # Statutory legal requirements test
│   └── test-direct-execution.mjs        # Direct inspection runner test harness
├── .env.example                         # Safe environment variable template
├── .eslintrc.json                       # ESLint configuration
├── .gitignore                           # Git ignore rules for clean repo
├── jsconfig.json                        # JavaScript path aliases (@/*)
├── next.config.mjs                      # Next.js configuration & server packages
├── package.json                         # Project dependencies and npm scripts
├── package-lock.json                    # Deterministic dependency lockfile
├── postcss.config.js                    # PostCSS plugins (Tailwind, Autoprefixer)
├── tailwind.config.js                   # Tailwind CSS theme configuration
└── vercel.json                          # Vercel serverless function budget config
```

---

## 4. Setup & Installation Instructions

### 4.1 Prerequisites
- **Node.js**: Version 20.x or higher (LTS recommended).
- **npm**: Version 10.x or higher.
- **MongoDB**: Local MongoDB instance (v6.0+) or MongoDB Atlas cluster.
- **Google Gemini API Key**: API Key from Google AI Studio.
- **Cloudinary Account**: Cloud name, API key, and secret (optional for local mock testing).

### 4.2 Installation
```bash
# Clone the repository
git clone <repository-url>
cd dpdp-vault

# Install dependencies using the deterministic lockfile
npm install
```

### 4.3 Environment Configuration
Copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:

| Variable Name | Required | Description | Safe Example / Default |
|---|---|---|---|
| `MONGODB_URI` | **Yes** | MongoDB connection string | `mongodb://127.0.0.1:27017/dpdp_assessment` |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API Key | `AIzaSy...` |
| `GEMINI_MODEL` | Optional | Proposed Gemini model | `gemini-3.8-flash` |
| `JWT_SECRET` | **Yes** | Cryptographic session signing secret | `your-secure-jwt-secret-string-min-32-chars` |
| `NEXT_PUBLIC_APP_NAME` | Optional | Application title display | `"DPDP Automated Assessment Platform"` |
| `NEXT_PUBLIC_APP_URL` | Optional | Base URL of deployed application | `http://localhost:3000` |
| `CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary cloud identifier | `your_cloudinary_cloud_name` |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API Key | `your_cloudinary_api_key` |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API Secret | `your_cloudinary_api_secret` |
| `BROWSER_WS_ENDPOINT` | Optional | Remote CDP browser WebSocket | `wss://chrome.browserless.io?token=...` |

---

## 5. Build, Lint & Test Commands

### 5.1 Static Code Linting
```bash
npm run lint
```
Executes ESLint with Next.js rules to verify syntax, imports, and component lifecycle safety.

### 5.2 Production Compilation
```bash
npm run build
```
Compiles all 27 application routes and 18 API route handlers into an optimized production bundle.

### 5.3 Local Development Server
```bash
npm run dev
```
Starts Next.js hot-reloading development server at `http://localhost:3000`.

### 5.4 Statutory Requirement & Board Test Suite
```bash
npm run test:board
```
Executes the comprehensive statutory legal framework test suite verifying all 25+ DPDP statutory requirements, applicability formulas, and score computation logic.

---

## 6. Execution Model: Direct Serverless Architecture

In previous development iterations, the system supported a local background PC daemon (`scripts/worker-daemon.mjs`). The platform has evolved to a **100% direct synchronous serverless execution model**:
- Every assessment executes synchronously inside a Vercel Serverless Function (`maxDuration: 300` seconds, `2048 MB` RAM).
- Headless Chromium initializes in-process via `@sparticuz/chromium`.
- Captured screenshot buffers stream directly to Cloudinary over HTTPS without writing to the ephemeral serverless disk.
- Results, findings, and compliance scores are computed and committed directly to MongoDB in a single atomic transaction.
- Eliminates external queuing servers, Docker worker containers, and persistent background processes.

---

## 7. Known Limitations & Disclaimers

1. **Informational & Diagnostic Nature**: DPDP Vault provides automated technical assessments and AI heuristics to identify potential privacy non-compliance on digital websites. Output reports do not constitute formal legal certification or statutory immunity from the Data Protection Board of India.
2. **Dynamic Bot Detection**: Websites employing aggressive CAPTCHA challenges or anti-scraping firewalls (e.g. Cloudflare Turnstile, Akamai Bot Manager) may restrict automated Playwright navigation.
3. **AI Vision Non-Determinism**: Google Gemini multimodal analysis evaluates visible content against statutory guidelines. While temperature is minimized for determinism, model updates may introduce minor heuristic variations.
