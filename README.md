# DPDP Vault — Direct Vercel Serverless Assessment Architecture

DPDP Vault is an automated website privacy compliance assessment platform built for India's **Digital Personal Data Protection Act, 2023 (DPDP Act)**.

This version is **100% worker-free**. Assessments execute directly and synchronously inside Vercel Serverless Functions (`maxDuration: 300`, `memory: 2048MB`) without requiring local PC background daemons, Railway worker instances, Docker containers, or persistent Redis/Mongo queues.

---

## Architecture Overview

```
User Submits Assessment
  │
  ▼
Next.js App Router (POST /api/runs or /api/assessments/[id]/reassess)
  ├── 1. Request Authentication & RBAC Authorization
  ├── 2. SSRF & Target Scope Domain Allowlist Validation
  ├── 3. MongoDB TestRun & Audit Log Initialization
  │
  ▼
Synchronous Assessment Engine (lib/assessment-runner.js)
  ├── 4. Universal Browser Launcher (Playwright + @sparticuz/chromium)
  │      • Deployed Vercel / AWS Lambda: @sparticuz/chromium (headless)
  │      • Local Workstation: Local Playwright Chromium
  │      • Remote CDP Endpoint (Optional): BROWSER_WS_ENDPOINT
  ├── 5. Autonomous Multi-Scenario Target Inspection
  │      • DPDP Section 5 & 6 (Notice & Affirmative Consent Banners)
  │      • DPDP Section 8(9) (Grievance Officer Statutory Redressal Details)
  │      • DPDP Section 6 (Consent Manager Granularity & Withdrawal Mechanism)
  │      • DPDP Section 9 (Child Data Protection & Safeguards)
  │      • DPDP Section 8(5) (Authentication & Password Masking Safeguards)
  ├── 6. In-Memory Screenshot Evidence Capture & Cloudinary CDN Streaming
  │      • Zero reliance on ephemeral read-only serverless filesystem
  ├── 7. Google Gemini 3.8 Flash Multimodal AI Interpretation
  │      • Autonomous statutory reasoning & transparency evaluation
  ├── 8. Statutory Findings Synthesis & Compliance Scoring (lib/assessment-engine.js)
  ├── 9. MongoDB Report & Finding Document Persistence
  │
  ▼
Immediate Synchronous HTTP 200 Response
  └── Returns completed Assessment, TestRun, Evidence, Findings & Final Report
```

---

## Key Technical Specifications

- **Execution Model**: Direct synchronous serverless execution (Vercel Functions).
- **Execution Budget**: 300 seconds maximum function duration (`vercel.json`).
- **Memory**: 2,048 MB RAM (configured in `vercel.json` for headless Chromium).
- **Architecture**: Single unified codebase. Zero external worker processes.
- **Evidence Storage**: Direct buffer streaming to Cloudinary Cloud CDN (`/tmp` fallback).

---

## Required Environment Variables

Configure these variables in your Vercel Project Settings (**Settings → Environment Variables**):

| Variable Name | Required | Description |
|---|---|---|
| `MONGODB_URI` | **Yes** | MongoDB Atlas connection string (`mongodb+srv://...`) |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API Key for statutory evaluation |
| `GEMINI_MODEL` | Optional | Default AI model (`gemini-3.8-flash`) |
| `JWT_SECRET` | **Yes** | Secret string for session token verification |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary cloud identifier |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API Secret |
| `NEXT_PUBLIC_APP_URL` | Optional | Public app domain (e.g., `https://dpdp-gilt.vercel.app`) |
| `BROWSER_WS_ENDPOINT` | Optional | Optional remote CDP WebSocket endpoint |

---

## Local Development & Testing

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env.local` and add your database and API credentials.

3. **Start Local Development Server**:
   ```bash
   npm run dev
   ```

4. **Execute Full Direct Assessment Test Suite**:
   ```bash
   npm run test:direct
   ```

5. **Lint and Build Production Bundle**:
   ```bash
   npm run lint
   npm run build
   ```

---

## Complete Removal of Worker Infrastructure

The following legacy components have been completely eliminated:
- ❌ `scripts/worker-daemon.mjs` (Local PC background polling daemon)
- ❌ `scripts/worker-check.mjs` (Queue and heartbeat inspector)
- ❌ `scripts/test-local-first-failover.mjs` (Failover lease test)
- ❌ `Dockerfile` & `.dockerignore` (Railway worker container)
- ❌ `LOCAL_WORKER_SETUP.md` (Local worker setup guide)
- ❌ `.env.worker` & `.env.worker.example` (Worker environment files)
- ❌ `lib/worker-queue.js` (Queue claiming and lease locking)
- ❌ `lib/worker-heartbeat.js` & `models/WorkerHeartbeat.js` (Worker heartbeat pings)
- ❌ `app/api/worker/process/route.js` (Worker polling route)
