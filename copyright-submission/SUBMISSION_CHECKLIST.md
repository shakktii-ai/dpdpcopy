# Copyright Submission Inventory & Verification Checklist

**Software Work Title**: DPDP Vault / DPDP Assessment Platform  
**Target Registration Authority**: Copyright Office, Government of India (Literary Works — Computer Software)  
**Package Generation Date**: October 27, 2026  
**Auditor**: Antigravity Autonomous Security & Software Audit Engine  

---

## 1. Submission Package Inventory

The submission package has been generated in a dedicated, isolated folder:  
`c:\Users\omkar\OneDrive\Desktop\DPDP - Copy\copyright-submission\`

### 1.1 Deliverables Manifest & Cryptographic Hashes (SHA-256)

| Deliverable File | Size (Bytes) | SHA-256 Cryptographic Checksum | Purpose & Description |
|---|---|---|---|
| **`dpdp-vault-clean-source.zip`** | 353,119 | `8c2ed83386d00f004c254c0fc0263fe524e589b51652e065e4af6c4195a9ad29` | Self-contained, clean, sanitized source code archive (ready for direct upload/inspection) |
| **`dpdp-vault-complete-copyright-bundle.zip`** | 376,740 | `e3407fa08557af42134ab5f2f632b9f7a200b9df188e6110d9063aa3602d85da` | Complete delivery bundle containing clean source zip and all documentation for copying to a pen drive |
| **`Software_Copyright_Documentation.pdf`** | 12,101 | `4a41afd5653909a89102bd8e80f37b7685acd2260d607f4f04304cba1b1c5e71` | Formal 6-page Software Copyright Documentation PDF with metadata table, architecture, and modules |
| **`Software_Copyright_Documentation.md`** | 18,644 | `79d5feeafcde66dfec2ac43571a23afb84157675527829577bc326449d98cb30` | Complete Markdown source of the Software Copyright Documentation |
| **`SOURCE_CODE_LANGUAGES.md`** | 5,128 | `2c4edd71987b9461c20710400415cbe04a6dcfa895246db455f55269dae50ae2` | Formal declaration distinguishing programming languages from third-party frameworks and cloud APIs |
| **`README_COPYRIGHT.md`** | 15,677 | `258f2b414b34e9590c177772e57acdb7852ea12b5a77afb3c9c9f90a53bd1d26` | Comprehensive technical specification, directory breakdown, architecture guide, and setup instructions |
| **`SUBMISSION_CHECKLIST.md`** | *This Document* | — | Complete submission manifest, excluded categories, verification results, and applicant checklist |

---

## 2. Source Code Package Contents (`source-code/`)

The clean uncompressed source code tree inside `source-code/` contains **107 original software files** organized across standard modular tiers:

```
source-code/
├── app/                                 # 27 Application Pages & 18 API Route Handlers
│   ├── admin/page.js
│   ├── api/
│   │   ├── assessments/route.js
│   │   ├── assessments/[id]/compare/route.js
│   │   ├── assessments/[id]/reassess/route.js
│   │   ├── assessments/[id]/stream/route.js
│   │   ├── auth/login/route.js
│   │   ├── auth/logout/route.js
│   │   ├── auth/me/route.js
│   │   ├── auth/register/route.js
│   │   ├── documents/route.js
│   │   ├── evidence/route.js
│   │   ├── evidence/file/[runId]/[filename]/route.js
│   │   ├── findings/route.js
│   │   ├── gemini/verify/route.js
│   │   ├── health/route.js
│   │   ├── observations/route.js
│   │   ├── onboarding/route.js
│   │   ├── organizations/route.js
│   │   ├── organizations/[id]/route.js
│   │   ├── profiles/route.js
│   │   ├── remediation/route.js
│   │   ├── reports/route.js
│   │   ├── requirements/route.js
│   │   ├── runs/route.js
│   │   ├── runs/[id]/route.js
│   │   ├── scenarios/route.js
│   │   ├── stats/route.js
│   │   └── targets/route.js
│   ├── assessments/page.js & assessments/new/page.js
│   ├── documents/page.js
│   ├── evidence/[runId]/[filename]/page.js
│   ├── findings/page.js
│   ├── globals.css
│   ├── layout.js
│   ├── login/page.js
│   ├── not-found.js
│   ├── onboarding/page.js
│   ├── organizations/page.js & organizations/[id]/page.js
│   ├── page.js
│   ├── portal/ (assessments, onboarding, documents, reports, compare)
│   ├── register/page.js
│   ├── remediation/page.js
│   ├── reports/page.js
│   ├── settings/page.js
│   ├── targets/page.js
│   └── testing/page.js
├── components/                          # 9 Reusable React 19 JSX Components
│   ├── AppShell.jsx
│   ├── CustomerFooter.jsx
│   ├── CustomerHeader.jsx
│   ├── EmptyState.jsx
│   ├── Header.jsx
│   ├── ReassessmentModal.jsx
│   ├── Sidebar.jsx
│   ├── StatCard.jsx
│   └── StatusBadge.jsx
├── lib/                                 # 15 Core Engines & Business Logic Modules
│   ├── assessment-engine.js
│   ├── assessment-runner.js
│   ├── assessment-summary.js
│   ├── auth.js                          # (Sanitized JWT secret fallback)
│   ├── autonomous-agent.js
│   ├── browser-launcher.js
│   ├── cloudinary.js
│   ├── event-bus.js
│   ├── evidence-redactor.js
│   ├── gemini.js
│   ├── mongodb.js
│   ├── report-generator.js
│   ├── requirement-registry.js
│   ├── safety-controller.js
│   └── security.js                      # (Sanitized encryption key fallback)
├── models/                              # 16 Canonical Mongoose Schemas
│   ├── ApprovedTarget.js
│   ├── Assessment.js
│   ├── AssessmentDocument.js
│   ├── AssessmentEvent.js
│   ├── AssessmentProfile.js
│   ├── AuditLog.js
│   ├── BrowserAction.js
│   ├── Evidence.js
│   ├── Finding.js
│   ├── LegalRequirement.js
│   ├── Organization.js
│   ├── Report.js
│   ├── ScenarioResult.js
│   ├── StructuredObservation.js
│   ├── TestRun.js
│   └── User.js
├── public/evidence/                     # Empty evidence placeholder (.gitkeep only)
├── scripts/                             # Essential Statutory Verification Suites
│   ├── test-dpdp-2026-board-requirements.mjs
│   └── test-direct-execution.mjs
├── .env.example                         # Safe configuration template with placeholders
├── .eslintrc.json                       # ESLint configuration
├── .gitignore                           # Git ignore specification
├── jsconfig.json                        # Path aliases
├── next.config.mjs                      # Next.js configuration
├── package.json                         # Dependencies specification
├── package-lock.json                    # Deterministic dependency lockfile
├── postcss.config.js                    # PostCSS plugins
├── tailwind.config.js                   # Tailwind theme definition
└── vercel.json                          # Vercel serverless budget configuration
```

---

## 3. Explicitly Excluded Categories (Security & Cleanliness Audit)

The following categories have been strictly excluded from the submission package:

1. **Active Secret Files**:
   - `c:\Users\omkar\OneDrive\Desktop\DPDP - Copy\.env.local` (Contains live Atlas, Gemini, and Cloudinary keys).
   - Any `.env`, `.env.production`, or local credentials files.
2. **Third-Party Dependency Trees**:
   - `node_modules/` (Excluded; reproducible deterministically via `npm install` using `package-lock.json`).
3. **Build & Compiler Outputs**:
   - `.next/`, `.cache/`, `.turbo/`, `dist/`, `build/`.
4. **Runtime Assessment Evidence & User Data**:
   - `public/evidence/6ad*` (7 historical test run evidence directories).
   - `public/evidence/test-dynamic-file.txt`.
   - `public/test-screenshots/*.png` (9 test run screenshots).
5. **Git Internal History**:
   - `.git/` repository database.
6. **Development Scratch Scripts**:
   - Ad-hoc debugging scripts from iterative development (`inspect-stuck-run.mjs`, `test-phase2.mjs`, etc.).

---

## 4. Verification Check Results

| Verification Check | Target | Status | Notes |
|---|---|---|---|
| **Production Build** | `next build` | **PASSED** | 27 static routes, 18 dynamic API routes compiled cleanly in 24.9s. |
| **Static Code Linter** | `next lint` | **PASSED** | 0 errors. React Hook dependency warnings reviewed. |
| **Browser Engine** | Playwright Chromium | **VERIFIED** | Local Chromium executable confirmed at host path. |
| **PDF Subsystem** | PDFKit Compiler | **VERIFIED** | Successfully compiled 6-page Software Copyright Documentation PDF. |
| **Secret Sanitization** | `lib/auth.js` & `lib/security.js` | **VERIFIED** | Embedded default keys replaced with neutral placeholders. |
| **Live Database Protection** | MongoDB Atlas Cluster | **VERIFIED** | Live database cluster was untouched and unmutated during audit. |
| **Lockfile Determinism** | `package-lock.json` | **VERIFIED** | Preserved intact for exact dependency reproducibility. |

---

## 5. Information Still Required From Applicant

Before final filing with the Copyright Office, the applicant must supply the following non-technical particulars:

1. **Author Name(s)**: Legal name(s) and nationality of the individual software author(s) or development team members.
2. **Copyright Claimant / Owner**: Legal name and registered address of the applicant organization or individual proprietor claiming copyright.
3. **Publication Status**:
   - If **Unpublished**: State that the work is unpublished.
   - If **Published**: Provide the date of first publication and the country of first publication.
4. **Official Software Title**: Confirm whether the proposed title (`DPDP Vault` or `DPDP Assessment Platform`) should be used or if an alternative trade name is preferred.

---

## 6. Questions For Copyright Registration Agent / Legal Counsel

1. **"PDF for Literary Content" Specification**: Does the Copyright Office in your filing require:
   - (A) The **Software Copyright Documentation PDF** (comprehensive architecture, module descriptions, and schema specifications)?
   - (B) A **Source Code Excerpt PDF** (typically the first 10 and last 10 pages, or first 30 and last 30 pages of the unredacted source code)?
   - (C) Both documents combined?
2. **Pen Drive Deposit Format**: Does the registrar require the pen drive to contain the uncompressed `source-code/` folder, the `dpdp-vault-clean-source.zip` archive, or the unified `dpdp-vault-complete-copyright-bundle.zip`?
3. **NOC Requirements**: If the application is filed in the name of an entity (company/LLP) while the code was authored by employees or external contractors, ensure an executed Assignment Agreement or No Objection Certificate (NOC) is prepared.
