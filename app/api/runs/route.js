import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import TestRun from '../../../models/TestRun';
import ApprovedTarget from '../../../models/ApprovedTarget';
import Assessment from '../../../models/Assessment';
import ScenarioResult from '../../../models/ScenarioResult';
import Evidence from '../../../models/Evidence';
import StructuredObservation from '../../../models/StructuredObservation';
import AuditLog from '../../../models/AuditLog';
import { requireAuth, checkOrganizationAccess } from '../../../lib/auth';
import { executeInspectionRun } from '../../../lib/assessment-runner';
import { emitAssessmentEvent } from '../../../lib/event-bus';
import { redactSensitiveData } from '../../../lib/evidence-redactor';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/**
 * GET /api/runs
 * List test runs for an assessment or organization.
 */
export async function GET(request) {
  try {
    const { session, errorResponse } = requireAuth(request);
    if (errorResponse) return errorResponse;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');
    const targetId = searchParams.get('targetId');

    const filter = {};
    if (assessmentId) filter.assessmentId = assessmentId;
    if (targetId) filter.targetId = targetId;

    const runs = await TestRun.find(filter)
      .populate('targetId', 'approvedDomain targetUrl isDemoSite')
      .populate('assessmentId', 'assessmentName targetUrl status')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, count: runs.length, runs });
  } catch (err) {
    console.error('Error fetching test runs:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/runs
 * Executes a direct, synchronous automated Playwright inspection run on an approved target.
 * Runs completely inside the Vercel Function without external workers.
 */
export async function POST(request) {
  try {
    const { session, errorResponse } = requireAuth(request);
    if (errorResponse) return errorResponse;

    await connectDB();
    const body = await request.json();
    const { assessmentId, targetId, options = {} } = body;

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: 'targetId is required to launch inspection.' },
        { status: 400 }
      );
    }

    // Verify ApprovedTarget exists and is approved
    const target = await ApprovedTarget.findById(targetId);
    if (!target) {
      return NextResponse.json(
        { success: false, error: 'Target domain not found.' },
        { status: 404 }
      );
    }

    if (target.targetStatus !== 'approved') {
      return NextResponse.json(
        { success: false, error: `Target status is ${target.targetStatus}. Only approved targets can be assessed.` },
        { status: 403 }
      );
    }

    // Verify target belongs to user's organization (unless admin or reviewer)
    if (!checkOrganizationAccess(session, target.organization)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Target belongs to a different organization.' },
        { status: 403 }
      );
    }

    // Link or create Assessment record if not supplied
    let assessment = null;
    if (assessmentId) {
      assessment = await Assessment.findById(assessmentId);
    } else {
      assessment = await Assessment.create({
        organization: target.organization,
        targetUrl: target.targetUrl,
        assessmentName: `DPDP Inspection - ${target.approvedDomain}`,
        status: 'in_progress',
        complianceScore: 0,
        createdBy: session.userId,
      });
    }

    // Prevent duplicate simultaneous runs on the exact same target
    const duplicateRun = await TestRun.findOne({
      targetId: target._id,
      status: { $in: ['running', 'inspecting_website', 'capturing_evidence'] },
      updatedAt: { $gte: new Date(Date.now() - 60 * 1000) },
    });

    if (duplicateRun) {
      return NextResponse.json(
        {
          success: false,
          error: 'An automated assessment is already actively running for this target. Please wait for it to complete.',
          activeRunId: duplicateRun._id,
          activeAssessmentId: duplicateRun.assessmentId,
          assessmentId: duplicateRun.assessmentId,
          testRunId: duplicateRun._id,
        },
        { status: 409 }
      );
    }

    // Determine whether authenticated testing was requested
    const isAuthRequested = Boolean(
      options.credentials?.enabled &&
      !options.credentials?.skipAuthenticatedTesting &&
      (options.credentials?.username || options.credentials?.authMethod === 'password')
    );

    // Create TestRun in running state for direct execution
    const testRun = await TestRun.create({
      assessmentId: assessment._id,
      targetId: target._id,
      status: 'running',
      progress: 5,
      currentStep: 'Initializing direct browser inspection',
      maxPages: options.maxPages || 15,
      maxActions: options.maxActions || 50,
      timeoutSeconds: options.timeoutSeconds || 120,
      runOptions: options,
      authTestingResult: {
        status: isAuthRequested ? 'pending' : 'not_applicable',
        authMethod: options.credentials?.authMethod || null,
        loginUrl: options.credentials?.loginUrl || null,
        usernameMasked: options.credentials?.username ? redactSensitiveData(options.credentials.username) : null,
        sessionEstablished: false,
        details: isAuthRequested ? 'Queued for authenticated browser inspection' : null,
      },
    });

    await emitAssessmentEvent({
      assessmentId: assessment._id,
      testRunId: testRun._id,
      eventType: 'queued',
      title: 'Assessment Started',
      description: `Test run started for automated Playwright inspection on ${target.approvedDomain}`,
      progress: 5,
      stepName: 'Initializing direct browser inspection',
      url: target.targetUrl,
    });

    // Sanitize options for audit trail (strictly strip password)
    const sanitizedOptionsForAudit = {
      ...options,
      credentials: options.credentials ? {
        enabled: Boolean(options.credentials.enabled),
        authMethod: options.credentials.authMethod,
        loginUrl: options.credentials.loginUrl,
        username: options.credentials.username,
        skipAuthenticatedTesting: Boolean(options.credentials.skipAuthenticatedTesting),
      } : undefined,
      loginTestingConfig: undefined,
    };

    // Record audit log
    await AuditLog.create({
      action: 'test_run_initiated',
      category: 'assessment',
      performedBy: session.userId,
      performedByName: session.name || session.email,
      organization: target.organization,
      targetResource: 'TestRun',
      resourceId: testRun._id,
      details: {
        targetDomain: target.approvedDomain,
        targetUrl: target.targetUrl,
        runId: testRun._id,
        options: sanitizedOptionsForAudit,
      },
      status: 'success',
    });

    // Directly execute and await the complete browser assessment pipeline inside this Vercel Function
    try {
      await executeInspectionRun(testRun._id, options);
    } catch (runErr) {
      console.error(`[Direct Execution Error for ${testRun._id}]:`, runErr);
    }

    // Retrieve final results
    const [finishedRun, finishedAssessment, scenarioResults, evidenceList, observations] = await Promise.all([
      TestRun.findById(testRun._id).populate('targetId').populate('assessmentId').lean(),
      Assessment.findById(assessment._id).lean(),
      ScenarioResult.find({ testRunId: testRun._id }).lean(),
      Evidence.find({ testRunId: testRun._id }).lean(),
      StructuredObservation.find({ testRunId: testRun._id }).lean(),
    ]);

    const isSuccess = finishedRun?.status === 'completed';

    return NextResponse.json(
      {
        success: true,
        assessmentId: String(assessment._id),
        testRunId: String(testRun._id),
        status: finishedRun?.status || testRun.status,
        isCompleted: isSuccess,
        testRun: finishedRun || testRun,
        assessment: finishedAssessment || assessment,
        scenarioResults: scenarioResults || [],
        evidenceList: evidenceList || [],
        observations: observations || [],
        error: isSuccess ? null : (finishedRun?.errorMessage || 'Inspection encountered errors'),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error in assessment execution run:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
