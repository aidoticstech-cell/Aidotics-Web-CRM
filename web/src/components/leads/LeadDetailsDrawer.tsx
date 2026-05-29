"use client";

import { useState } from "react";
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  Pencil,
  MoreHorizontal,
  UserPlus,
  Briefcase,
  Megaphone,
  Ban,
} from "lucide-react";
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge";
import { LeadDetailsTabContent, getDefaultLeadExtras, type LeadExtras } from "@/components/leads/LeadDetailsTabContent";
import { LEAD_STATUS_LABELS, type Lead } from "@/lib/leads-data";

export const DRAWER_TABS = ["Overview", "Requirement", "Notes", "Follow-ups", "Communication", "Documents", "History"] as const;

export function LeadDetailsDrawer({
  lead,
  onClose,
  onStatusChange,
}: {
  lead: Lead | null;
  onClose: () => void;
  onStatusChange?: (status: Lead["status"]) => void;
}) {
  const [tab, setTab] = useState<(typeof DRAWER_TABS)[number]>("Overview");
  const [extras, setExtras] = useState<LeadExtras>(getDefaultLeadExtras);
  const [toast, setToast] = useState<string | null>(null);

  if (!lead) return null;

  const initials = lead.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function action(label: string) {
    setToast(label);
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <>
      <button type="button" className="fixed inset-0 z-40 bg-black/30" aria-label="Close panel" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-gray-200 bg-white shadow-2xl">
        {toast && (
          <div className="absolute left-4 right-4 top-4 z-10 rounded-lg bg-gray-900 px-3 py-2 text-center text-xs text-white">{toast}</div>
        )}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-bold text-gray-900">Lead Details</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">{initials}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                <LeadStatusBadge status={lead.status} />
              </div>
              <p className="mt-0.5 text-sm text-gray-600">{lead.phone}</p>
              <p className="text-[11px] text-gray-400">
                {lead.leadId} · Created {lead.createdOn} {lead.createdTime}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { Icon: Phone, label: "Call" },
              { Icon: MessageCircle, label: "WhatsApp" },
              { Icon: Mail, label: "Email" },
              { Icon: Pencil, label: "Edit" },
              { Icon: MoreHorizontal, label: "More" },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => action(label)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-gray-100 px-3">
          {DRAWER_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 border-b-2 px-2.5 py-2.5 text-[11px] font-semibold transition ${
                tab === t ? "border-violet-accent text-violet-accent" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <LeadDetailsTabContent lead={lead} tab={tab} extras={extras} onExtrasChange={setExtras} />
        </div>

        <div className="space-y-2 border-t border-gray-100 p-4">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700" onClick={() => { onStatusChange?.("converted"); action("Converted to client"); }}>
              <UserPlus className="mr-1 inline h-3.5 w-3.5" /> Convert to Client
            </button>
            <button type="button" className="rounded-lg bg-sky-600 py-2.5 text-xs font-bold text-white hover:bg-sky-700" onClick={() => action("Create Duty")}>
              <Briefcase className="mr-1 inline h-3.5 w-3.5" /> Create Duty
            </button>
            <button type="button" className="rounded-lg bg-orange-500 py-2.5 text-xs font-bold text-white hover:bg-orange-600" onClick={() => action("Broadcast sent")}>
              <Megaphone className="mr-1 inline h-3.5 w-3.5" /> Broadcast
            </button>
            <button type="button" className="rounded-lg bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700" onClick={() => { onStatusChange?.("lost"); action("Marked as lost"); }}>
              <Ban className="mr-1 inline h-3.5 w-3.5" /> Mark as Lost
            </button>
          </div>
          <button type="button" className="btn-secondary w-full !py-2 text-xs" onClick={onClose}>
            Close
          </button>
          <label className="block text-[10px] text-gray-500">
            Change status
            <select
              className="crm-select mt-1 !py-2 text-xs"
              value={lead.status}
              onChange={(e) => onStatusChange?.(e.target.value as Lead["status"])}
            >
              {Object.entries(LEAD_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </label>
        </div>
      </aside>
    </>
  );
}
