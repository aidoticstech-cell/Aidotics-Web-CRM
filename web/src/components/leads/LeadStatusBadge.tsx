import { LEAD_STATUS_LABELS, LEAD_STATUS_STYLES, type LeadStatus } from "@/lib/leads-data";

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${LEAD_STATUS_STYLES[status]}`}>
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}
