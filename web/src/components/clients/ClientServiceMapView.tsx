"use client";

import { MapPin } from "lucide-react";
import { ClientStatusBadge } from "@/components/clients/ClientStatusBadge";
import type { Client } from "@/lib/clients-data";

const CITY_COORDS: Record<string, { top: string; left: string }> = {
  Delhi: { top: "32%", left: "44%" },
  Gurgaon: { top: "48%", left: "38%" },
  Noida: { top: "38%", left: "54%" },
  Faridabad: { top: "54%", left: "50%" },
};

export function ClientServiceMapView({
  clients,
  selectedId,
  onSelect,
}: {
  clients: Client[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const byCity = clients.reduce<Record<string, Client[]>>((acc, c) => {
    if (!acc[c.city]) acc[c.city] = [];
    acc[c.city].push(c);
    return acc;
  }, {});

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <div className="dash-card relative min-h-[420px] overflow-hidden bg-gradient-to-br from-sky-50 via-violet-50/30 to-emerald-50/40">
        <p className="absolute left-4 top-4 text-xs font-semibold text-gray-600">Service area map — NCR (preview)</p>
        {Object.entries(byCity).map(([city, cityClients]) => {
          const pos = CITY_COORDS[city] || { top: "50%", left: "50%" };
          return (
            <button
              key={city}
              type="button"
              onClick={() => onSelect(cityClients[0].id)}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <span className="flex items-center gap-1 rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
                <MapPin className="h-3 w-3" />
                {city} ({cityClients.length})
              </span>
            </button>
          );
        })}
      </div>
      <div className="dash-card max-h-[420px] overflow-y-auto">
        <h3 className="dash-card-title">Clients by area</h3>
        <ul className="mt-3 space-y-2">
          {clients.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className={`w-full rounded-lg border p-2.5 text-left text-xs transition ${
                  selectedId === c.id ? "border-violet-accent bg-violet-50" : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900">{c.name}</p>
                  <ClientStatusBadge status={c.status} />
                </div>
                <p className="mt-0.5 text-gray-500">{c.city} · {c.primaryService}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
