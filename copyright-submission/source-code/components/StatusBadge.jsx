import React from 'react';

const STATUS_CONFIGS = {
  // Assessment statuses
  queued: {
    label: 'Queued',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500'
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-sky-50 text-sky-800 border-sky-200',
    dot: 'bg-sky-500 animate-pulse'
  },
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-600'
  },
  failed: {
    label: 'Failed',
    bg: 'bg-rose-50 text-rose-800 border-rose-200',
    dot: 'bg-rose-600'
  },

  // Finding severities
  critical: {
    label: 'Critical',
    bg: 'bg-rose-50 text-rose-800 border-rose-300 font-semibold',
    dot: 'bg-rose-600 animate-ping'
  },
  high: {
    label: 'High',
    bg: 'bg-orange-50 text-orange-800 border-orange-200 font-semibold',
    dot: 'bg-orange-600'
  },
  medium: {
    label: 'Medium',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-600'
  },
  low: {
    label: 'Low',
    bg: 'bg-sky-50 text-sky-800 border-sky-200',
    dot: 'bg-sky-600'
  },
  informational: {
    label: 'Info',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500'
  },

  // Remediation statuses
  open: {
    label: 'Open Finding',
    bg: 'bg-rose-50 text-rose-800 border-rose-200',
    dot: 'bg-rose-600'
  },
  in_remediation: {
    label: 'In Remediation',
    bg: 'bg-sky-50 text-sky-800 border-sky-200',
    dot: 'bg-sky-600'
  },
  resolved: {
    label: 'Remediated',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-600'
  },
  risk_accepted: {
    label: 'Risk Accepted',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500'
  },

  // Authorization statuses
  authorized: {
    label: 'Authorized',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-600'
  },
  pending_authorization: {
    label: 'Pending Auth',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500'
  },
  active: {
    label: 'Active',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-600'
  },

  // DPDP 2026 Legal Framework & Applicability Statuses
  in_force: {
    label: 'In Force',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
    dot: 'bg-emerald-600'
  },
  not_yet_in_force: {
    label: 'Not Yet in Force',
    bg: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',
    dot: 'bg-amber-600'
  },
  enacted: {
    label: 'Enacted',
    bg: 'bg-sky-50 text-sky-800 border-sky-300 font-semibold',
    dot: 'bg-sky-600'
  },
  notified: {
    label: 'Notified',
    bg: 'bg-indigo-50 text-indigo-800 border-indigo-300 font-semibold',
    dot: 'bg-indigo-600'
  },
  verification_required: {
    label: 'Verification Required',
    bg: 'bg-purple-50 text-purple-800 border-purple-300 font-semibold',
    dot: 'bg-purple-600'
  },

  // DPDP 2026 Taxonomy & Target Classifications
  statutory_reference: {
    label: 'Statutory Reference',
    bg: 'bg-slate-100 text-slate-700 border-slate-300 font-medium',
    dot: 'bg-slate-500'
  },
  data_fiduciary_obligation: {
    label: 'Data Fiduciary Obligation',
    bg: 'bg-emerald-50 text-emerald-900 border-emerald-200 font-medium',
    dot: 'bg-emerald-600'
  },
  consent_manager_obligation: {
    label: 'Consent Manager Framework',
    bg: 'bg-violet-50 text-violet-800 border-violet-200 font-medium',
    dot: 'bg-violet-600'
  },
  appeal_and_enforcement: {
    label: 'Appeals & Enforcement',
    bg: 'bg-rose-50 text-rose-800 border-rose-200 font-medium',
    dot: 'bg-rose-600'
  },
  incident_response: {
    label: 'Breach Response',
    bg: 'bg-orange-50 text-orange-800 border-orange-200 font-medium',
    dot: 'bg-orange-600'
  },
  complaint_and_grievance: {
    label: 'Grievance & Complaints',
    bg: 'bg-teal-50 text-teal-800 border-teal-200 font-medium',
    dot: 'bg-teal-600'
  },
  manual_verification: {
    label: 'Manual Verification',
    bg: 'bg-amber-50 text-amber-800 border-amber-300 font-medium',
    dot: 'bg-amber-600'
  }
};

export default function StatusBadge({ status, customLabel, size = 'sm' }) {
  const normalizedKey = status ? String(status).toLowerCase().replace(/-/g, '_') : 'queued';
  const config = STATUS_CONFIGS[normalizedKey] || {
    label: status || 'Unknown',
    bg: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    dot: 'bg-slate-400'
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${
        sizeClasses[size] || sizeClasses.sm
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{customLabel || config.label}</span>
    </span>
  );
}
