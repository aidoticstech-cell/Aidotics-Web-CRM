"use client";

import { MessageCircle } from "lucide-react";
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge";
import { LEAD_STATUS_LABELS, type Lead, type LeadStatus } from "@/lib/leads-data";

const KANBAN_COLUMNS: LeadStatus[] = ["new", "discussion", "qualified", "proposal", "converted", "lost"];

export function LeadKanbanView({
  leads,
  selectedId,
  onSelect,
  onStatusChange,
}: {
  leads: Lead[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {KANBAN_COLUMNS.map((status) => {
        const column = leads.filter((l) => l.status === status);
        return (
          <div key={status} className="w-[220px] shrink-0 rounded-xl bg-gray-100/80 p-2">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-700">{LEAD_STATUS_LABELS[status]}</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-600">{column.length}</span>
            </div>
            <div className="space-y-2 max-h-[520px] overflow-y-auto">
              {column.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => onSelect(lead.id)}
                  className={`w-full rounded-lg border bg-white p-3 text-left shadow-sm transition hover:shadow ${selectedId === lead.id ? "border-violet-accent ring-1 ring-violet-accent/30" : "border-gray-200"}`}
                >
                  <p className="text-[10px] font-semibold text-violet-accent">{lead.leadId}</p>
                  <p className="mt-0.5 text-sm font-bold text-gray-900">{lead.name}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">{lead.requirement}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-500">{lead.phone}<MessageCircle className="h-3 w-3 text-emerald-500" /></p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">{lead.assignedTo.split(" ")[0]}</span>
                    <select
                      className="rounded border border-gray-200 px-1 py-0.5 text-[9px]"
                      value={lead.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => { e.stopPropagation(); onStatusChange(lead.id, e.target.value as LeadStatus); }}
                    >
                      {KANBAN_COLUMNS.map((s) => (
                        <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
