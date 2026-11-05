import mongoose from 'mongoose';

const LegalRequirementSchema = new mongoose.Schema(
  {
    requirementId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    officialSource: {
      type: String,
      required: true,
      default: 'Digital Personal Data Protection Act, 2023',
    },
    sectionOrRule: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    version: {
      type: String,
      required: true,
      default: '2026.1',
    },
    effectiveDate: {
      type: String,
      default: '2023-08-11',
    },
    isCurrentlyEnforceable: {
      type: Boolean,
      default: true,
    },
    applicabilityStatus: {
      type: String,
      enum: ['enacted', 'notified', 'in_force', 'not_yet_in_force', 'verification_required'],
      default: 'in_force',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: [
        'verified_official_gazette',
        'verified_act_schedule',
        'faq_reference_pending_official_gazette',
        'verification_required',
      ],
      default: 'verified_act_schedule',
      index: true,
    },
    lastVerifiedDate: {
      type: String,
      default: '2026-10-22',
    },
    sourceProvenance: {
      type: String,
      default: 'India Code Act No. 22 of 2023 / Official Gazette Notification',
    },
    isWebsiteComplianceCheck: {
      type: Boolean,
      default: true,
      index: true,
    },
    targetRole: {
      type: String,
      enum: [
        'data_fiduciary',
        'significant_data_fiduciary',
        'consent_manager',
        'data_processor',
        'data_protection_board',
        'appellate_tribunal',
        'data_principal',
        'general_reference',
      ],
      default: 'data_fiduciary',
      index: true,
    },
    category: {
      type: String,
      enum: [
        // Legacy categories
        'Notice & Consent',
        'Data Principal Rights',
        'Data Fiduciary Obligations',
        'Children Data Protection',
        'Third-Party Tracking & Cookies',
        'Grievance Redressal Mechanism',
        'Security Safeguards',
        // 2026 Legal Framework Taxonomy Categories
        'statutory_reference',
        'data_fiduciary_obligation',
        'consent_manager_obligation',
        'incident_response',
        'complaint_and_grievance',
        'appeal_and_enforcement',
        'informational_only',
      ],
      required: true,
      index: true,
    },
    penaltyReference: {
      maxPenaltyAmount: { type: String, default: null },
      maxPenaltyAmountInr: { type: Number, default: null },
      maxPenaltyText: { type: String, default: null },
      scheduleEntry: { type: String, default: null },
      description: { type: String, default: null },
    },
    uncertaintyRationale: {
      type: String,
      default: null,
    },
    applicabilityConditions: {
      type: [String],
      default: [],
      description: 'Website capability keys triggering applicability',
    },
    expectedControl: {
      type: String,
      required: true,
    },
    assessmentMethod: {
      type: String,
      enum: ['automated_browser', 'document_review', 'hybrid', 'manual_verification', 'statutory_reference'],
      default: 'hybrid',
    },
    requiredEvidence: {
      type: String,
      required: true,
    },
    reviewerGuidance: {
      type: String,
      default: '',
    },
    defaultSeverity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low', 'informational'],
      default: 'high',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.LegalRequirement ||
  mongoose.model('LegalRequirement', LegalRequirementSchema);
