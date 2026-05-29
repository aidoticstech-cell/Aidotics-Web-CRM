"use client";

import { ClientStatusBadge } from "@/components/clients/ClientStatusBadge";
import type { Client } from "@/lib/clients-data";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAY_2025 = Array.from({ length: 31 }, (_, i) => i + 1);

export function ClientRenewalCalendarView({
  clients,
  onSelect,
}: {
  clients: Client[];
  onSelect: (id: string) => void;
}) {
  const renewals = clients.filter((c) => c.renewalDate !== "—");

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <div className="dash-card">
        <h3 className="dash-card-title">Renewal Calendar — May 2025</h3>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-gray-500">
          {DAYS.map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[64px]" />
          ))}
          {MAY_2025.map((day) => {
            const events = renewals.filter((c) => {
              const d = parseInt(c.renewalDate.split(" ")[0], 10);
              return d === day || (day === 15 && c.renewalInDays <= 34);
            });
            return (
              <div
                key={day}
                className={`min-h-[64px] rounded-lg border p-1 text-left ${day === 15 ? "border-violet-300 bg-violet-50/50" : "border-gray-100 bg-gray-50/40"}`}
              >
                <span className="text-[10px] font-bold text-gray-600">{day}</span>
                {events.slice(0, 2).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelect(c.id)}
                    className="mt-0.5 block w-full truncate rounded bg-amber-100 px-1 py-0.5 text-[8px] font-semibold text-amber-900"
                  >
                    {c.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <div className="dash-card">
        <h3 className="dash-card-title">Upcoming Renewals</h3>
        <ul className="mt-3 space-y-2">
          {renewals
            .sort((a, b) => a.renewalInDays - b.renewalInDays)
            .slice(0, 8)
            .map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => onSelect(c.id)} className="w-full rounded-lg border border-gray-100 p-2.5 text-left hover:bg-gray-50">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-gray-900">{c.name}</p>
                    <ClientStatusBadge status={c.status} />
                  </div>
                  <p className="mt-0.5 text-[10px] text-gray-500">{c.renewalDate} · in {c.renewalInDays} days</p>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
