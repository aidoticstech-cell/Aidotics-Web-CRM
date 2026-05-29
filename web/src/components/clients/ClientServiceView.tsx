"use client";

import { ClientStatusBadge } from "@/components/clients/ClientStatusBadge";
import type { Client } from "@/lib/clients-data";

export function ClientServiceView({
  clients,
  selectedId,
  onSelect,
}: {
  clients: Client[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const byService = clients.reduce<Record<string, Client[]>>((acc, c) => {
    const key = c.primaryService === "—" ? "No active service" : c.primaryService.split("(")[0].trim();
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(byService).map(([service, group]) => (
        <div key={service} className="dash-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="dash-card-title">{service}</h3>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600">{group.length} clients</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {group.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c.id)}
                className={`rounded-xl border p-3 text-left transition hover:shadow-sm ${
                  selectedId === c.id ? "border-violet-accent bg-violet-50/50 ring-1 ring-violet-accent/20" : "border-gray-200 bg-white"
                }`}
              >
                <p className="text-[10px] font-semibold text-violet-accent">{c.clientId}</p>
                <p className="mt-0.5 font-bold text-gray-900">{c.name}</p>
                <p className="mt-1 text-[11px] text-gray-500">{c.primaryServiceStart}</p>
                <div className="mt-2 flex items-center justify-between">
                  <ClientStatusBadge status={c.status} />
                  <span className="text-[10px] text-gray-500">{c.coordinator}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
