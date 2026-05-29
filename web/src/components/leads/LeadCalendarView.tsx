"use client";

import type { Lead } from "@/lib/leads-data";
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAY_2025 = Array.from({ length: 31 }, (_, i) => i + 1);

export function LeadCalendarView({
  leads,
  onSelect,
}: {
  leads: Lead[];
  onSelect: (id: string) => void;
}) {
  const withFollowUp = leads.filter((l) => l.followUpDate && !l.followUpNotRequired);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <div className="dash-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="dash-card-title">May 2025</h3>
          <div className="flex gap-1 text-xs">
            <button type="button" className="rounded border px-2 py-1">‹</button>
            <button type="button" className="rounded border px-2 py-1">›</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-gray-500">
          {DAYS.map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[72px]" />
          ))}
          {MAY_2025.map((day) => {
            const events = withFollowUp.filter((l) => l.followUpDate?.includes(`May ${day}`) || (day === 13 && l.followUpOverdue));
            return (
              <div key={day} className={`min-h-[72px] rounded-lg border p-1 text-left ${day === 12 ? "border-violet-300 bg-violet-50/50" : "border-gray-100 bg-gray-50/40"}`}>
                <span className="text-[10px] font-bold text-gray-600">{day}</span>
                <div className="mt-0.5 space-y-0.5">
                  {events.slice(0, 2).map((l) => (
                    <button key={l.id} type="button" onClick={() => onSelect(l.id)} className="block w-full truncate rounded bg-violet-100 px-1 py-0.5 text-[9px] font-medium text-violet-800">
                      {l.name.split(" ")[0]}
                    </button>
                  ))}
                  {events.length > 2 && <span className="text-[9px] text-gray-500">+{events.length - 2}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="dash-card">
        <h3 className="dash-card-title">Upcoming Follow-ups</h3>
        <ul className="mt-3 space-y-2">
          {withFollowUp.map((l) => (
            <li key={l.id}>
              <button type="button" onClick={() => onSelect(l.id)} className="w-full rounded-lg border border-gray-100 p-2.5 text-left hover:bg-gray-50">
                <p className="text-xs font-semibold text-gray-900">{l.name}</p>
                <p className="text-[10px] text-gray-500">{l.followUpDate} · {l.followUpTime}</p>
                <div className="mt-1"><LeadStatusBadge status={l.status} /></div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
