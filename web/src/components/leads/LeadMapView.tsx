"use client";

import { MapPin } from "lucide-react";
import type { Lead } from "@/lib/leads-data";
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge";

const CITY_COORDS: Record<string, { top: string; left: string }> = {
  Delhi: { top: "35%", left: "42%" },
  Gurgaon: { top: "48%", left: "38%" },
  Noida: { top: "40%", left: "52%" },
  Faridabad: { top: "52%", left: "48%" },
};

export function LeadMapView({
  leads,
  selectedId,
  onSelect,
}: {
  leads: Lead[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const byCity = leads.reduce<Record<string, Lead[]>>((acc, l) => {
    const c = l.city.split(",")[0].trim();
    if (!acc[c]) acc[c] = [];
    acc[c].push(l);
    return acc;
  }, {});

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <div className="dash-card relative min-h-[420px] overflow-hidden bg-gradient-to-br from-sky-50 via-emerald-50/30 to-violet-50/40">
        <p className="absolute left-4 top-4 text-xs font-semibold text-gray-600">NCR — Lead locations (preview)</p>
        {Object.entries(byCity).map(([city, cityLeads]) => {
          const pos = CITY_COORDS[city] || { top: "50%", left: "50%" };
          return (
            <button
              key={city}
              type="button"
              onClick={() => onSelect(cityLeads[0].id)}
              style={{ top: pos.top, left: pos.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white px-2 py-1 text-[10px] font-bold shadow-md transition hover:scale-105 ${
                cityLeads.some((l) => l.id === selectedId) ? "border-violet-accent text-violet-accent" : "border-gray-300 text-gray-700"
              }`}
            >
              <MapPin className="mr-0.5 inline h-3 w-3" />
              {city} ({cityLeads.length})
            </button>
          );
        })}
      </div>
      <div className="dash-card max-h-[420px] overflow-y-auto">
        <h3 className="dash-card-title">Leads by City</h3>
        <ul className="mt-3 space-y-2">
          {leads.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => onSelect(l.id)}
                className={`w-full rounded-lg border p-2.5 text-left text-xs ${selectedId === l.id ? "border-violet-accent bg-violet-50" : "border-gray-100 hover:bg-gray-50"}`}
              >
                <p className="font-semibold text-gray-900">{l.name}</p>
                <p className="text-gray-500">{l.city} · {l.requirement}</p>
                <div className="mt-1"><LeadStatusBadge status={l.status} /></div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
