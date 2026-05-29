"use client";

import { LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/leads-data";

const QUICK = [
  { label: "All Leads", value: "all" },
  { label: "New Leads", value: "new" },
  { label: "Follow-ups Due", value: "followup" },
  { label: "Hot Leads", value: "hot" },
  { label: "Proposal Sent", value: "proposal" },
  { label: "Converted", value: "converted" },
  { label: "Lost", value: "lost" },
];

export function LeadsFilterSidebar({
  statusFilter,
  onStatusFilter,
  onApply,
}: {
  statusFilter: string;
  onStatusFilter: (v: string) => void;
  onApply: () => void;
}) {
  const statusChecks = Object.keys(LEAD_STATUS_LABELS) as LeadStatus[];

  return (
    <aside className="w-full shrink-0 space-y-4 lg:w-[260px]">
      <div className="dash-card">
        <h3 className="text-xs font-bold text-gray-900">Quick Filters</h3>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {QUICK.map((q) => (
            <button
              key={q.value}
              type="button"
              onClick={() => onStatusFilter(q.value)}
              className={`rounded-lg border px-2 py-1.5 text-[10px] font-semibold ${statusFilter === q.value ? "border-violet-accent bg-violet-soft text-violet-accent" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
      <div className="dash-card">
        <h3 className="text-xs font-bold text-gray-900">Lead Status</h3>
        <div className="mt-2 space-y-1.5">
          {statusChecks.map((s) => (
            <label key={s} className="flex items-center gap-2 text-xs text-gray-700">
              <input type="checkbox" className="accent-violet-accent" defaultChecked />
              {LEAD_STATUS_LABELS[s]}
            </label>
          ))}
        </div>
      </div>
      <div className="dash-card">
        <h3 className="text-xs font-bold text-gray-900">Follow-up Summary</h3>
        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-16 w-16">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#ede9fe" strokeWidth="4" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="60 100" />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-black text-violet-accent">
              42
              <span className="font-normal text-gray-500">Due</span>
            </span>
          </div>
          <ul className="space-y-1 text-[10px] text-gray-600">
            <li><span className="inline-block h-2 w-2 rounded-full bg-red-500" /> Today: 12</li>
            <li><span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> Tomorrow: 8</li>
            <li><span className="inline-block h-2 w-2 rounded-full bg-sky-500" /> This week: 15</li>
            <li><span className="inline-block h-2 w-2 rounded-full bg-gray-400" /> Later: 7</li>
          </ul>
        </div>
      </div>
      <button type="button" className="btn-primary w-full !py-2.5 text-sm" onClick={onApply}>
        Apply Filters
      </button>
    </aside>
  );
}
