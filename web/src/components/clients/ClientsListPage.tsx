"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Download,
  MoreVertical,
  MessageCircle,
  LayoutList,
  Briefcase,
  Calendar,
  Map,
  ChevronDown,
} from "lucide-react";
import { ClientSnapshotPanel } from "@/components/clients/ClientSnapshotPanel";
import { ClientServiceView } from "@/components/clients/ClientServiceView";
import { ClientRenewalCalendarView } from "@/components/clients/ClientRenewalCalendarView";
import { ClientServiceMapView } from "@/components/clients/ClientServiceMapView";
import { ClientStatusBadge } from "@/components/clients/ClientStatusBadge";
import {
  CLIENT_KPI,
  CLIENT_STATUS_LABELS,
  MOCK_CLIENTS,
  type Client,
} from "@/lib/clients-data";
import { FormModal } from "@/components/onboarding/FormModal";
import { Field } from "@/components/ui/FormBits";
import { newOnboardingId } from "@/lib/onboarding-id";

const PAGE_SIZE = 10;

function formatInr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function ClientsListPage() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_CLIENTS[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "service" | "calendar" | "map">("list");
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [newClient, setNewClient] = useState({ name: "", phone: "", email: "", city: "Gurgaon", type: "Individual" });

  const selectedClient = clients.find((c) => c.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (typeFilter !== "all" && c.clientType !== typeFilter) return false;
      if (branchFilter !== "all" && c.branch !== branchFilter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.clientId.toLowerCase().includes(q)
      );
    });
  }, [clients, search, statusFilter, typeFilter, branchFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageClients = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function toggleCheck(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addClient() {
    if (!newClient.name.trim() || !newClient.phone.trim()) {
      showToast("Name and phone are required.");
      return;
    }
    const id = newOnboardingId();
    const client: Client = {
      id,
      clientId: `CL-${1260 + clients.length}`,
      name: newClient.name,
      phone: newClient.phone,
      email: newClient.email || `${newClient.name.split(" ")[0].toLowerCase()}@email.com`,
      address: `${newClient.city}`,
      city: newClient.city,
      clientType: newClient.type as Client["clientType"],
      tier: "Standard",
      status: "active",
      coordinator: "Neha Patel",
      branch: newClient.city,
      source: "Manual",
      joinedDate: "May 12, 2025",
      vip: false,
      patientCount: 0,
      activeServices: 0,
      activeDuties: 0,
      totalDuties: 0,
      primaryService: "—",
      primaryServiceStart: "—",
      staffName: "—",
      staffRole: "—",
      renewalDate: "—",
      renewalInDays: 0,
      outstanding: 0,
      satisfaction: 4.0,
    };
    setClients((prev) => [client, ...prev]);
    setSelectedId(id);
    setAddOpen(false);
    setNewClient({ name: "", phone: "", email: "", city: "Gurgaon", type: "Individual" });
    showToast("Client added successfully.");
  }

  return (
    <div className="p-4 lg:p-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] max-w-sm rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">{toast}</div>
      )}

      <FormModal open={addOpen} title="Add New Client" onClose={() => setAddOpen(false)} onSubmit={addClient} submitLabel="Save Client" wide>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Client Name" required><input className="crm-input" value={newClient.name} onChange={(e) => setNewClient((f) => ({ ...f, name: e.target.value }))} /></Field>
          <Field label="Mobile" required><input className="crm-input" value={newClient.phone} onChange={(e) => setNewClient((f) => ({ ...f, phone: e.target.value }))} /></Field>
          <Field label="Email"><input className="crm-input" value={newClient.email} onChange={(e) => setNewClient((f) => ({ ...f, email: e.target.value }))} /></Field>
          <Field label="City"><input className="crm-input" value={newClient.city} onChange={(e) => setNewClient((f) => ({ ...f, city: e.target.value }))} /></Field>
          <Field label="Client Type" className="sm:col-span-2">
            <select className="crm-select" value={newClient.type} onChange={(e) => setNewClient((f) => ({ ...f, type: e.target.value }))}>
              <option>Individual</option>
              <option>Corporate</option>
            </select>
          </Field>
        </div>
      </FormModal>

      <nav className="mb-2 text-xs text-gray-500">
        <span className="font-medium text-gray-800">Clients & Patients</span>
        <span className="mx-1.5">›</span>
        <span className="font-medium text-gray-800">Client List</span>
      </nav>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Client List</h1>
          <p className="mt-0.5 text-sm text-gray-500">Manage active clients, services, renewals and outstanding dues.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary !gap-1.5 !py-2.5 text-sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Client
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>
          <button type="button" className="btn-outline-purple !gap-1.5 !py-2.5 text-sm">
            <Download className="h-4 w-4" />
            Export Clients
          </button>
        </div>
      </div>

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {CLIENT_KPI.map((k) => (
          <div key={k.title} className="dash-card !p-3.5">
            <p className="text-[11px] font-semibold text-gray-500">{k.title}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{k.value}</p>
            <p className={`mt-0.5 text-[11px] font-medium ${k.up ? "text-emerald-600" : "text-red-600"}`}>{k.trend} vs last month</p>
          </div>
        ))}
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 text-xs font-semibold">
          {[
            { id: "list" as const, label: "List View", Icon: LayoutList },
            { id: "service" as const, label: "Service View", Icon: Briefcase },
            { id: "calendar" as const, label: "Renewal Calendar", Icon: Calendar },
            { id: "map" as const, label: "Service Area Map", Icon: Map },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 ${view === id ? "bg-violet-soft text-violet-accent" : "text-gray-600"}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" className="text-xs font-semibold text-violet-accent">Saved Filters</button>
          <button
            type="button"
            className="text-xs font-semibold text-gray-500 hover:text-violet-accent"
            onClick={() => { setStatusFilter("all"); setTypeFilter("all"); setBranchFilter("all"); setSearch(""); setPage(1); }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select className="crm-select !w-auto !py-2 text-xs" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
          <option value="all">Client Type</option>
          <option>Individual</option>
          <option>Corporate</option>
        </select>
        <select className="crm-select !w-auto !py-2 text-xs" defaultValue="all">
          <option value="all">Service Type</option>
          <option>ICU Nurse</option>
          <option>Attendant</option>
          <option>Physiotherapist</option>
        </select>
        <select className="crm-select !w-auto !py-2 text-xs" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="all">Status</option>
          {Object.entries(CLIENT_STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select className="crm-select !w-auto !py-2 text-xs" defaultValue="all">
          <option value="all">Coordinator</option>
          <option>Neha Patel</option>
          <option>Rahul Sharma</option>
        </select>
        <select className="crm-select !w-auto !py-2 text-xs" value={branchFilter} onChange={(e) => { setBranchFilter(e.target.value); setPage(1); }}>
          <option value="all">Branch</option>
          {[...new Set(clients.map((c) => c.branch))].map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select className="crm-select !w-auto !py-2 text-xs" defaultValue="all">
          <option value="all">City</option>
          {[...new Set(clients.map((c) => c.city))].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button type="button" className="crm-select !w-auto cursor-pointer !py-2 text-xs">More Filters</button>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="min-w-0 flex-1">
          {view === "service" && (
            <ClientServiceView clients={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          )}
          {view === "calendar" && (
            <ClientRenewalCalendarView clients={filtered} onSelect={setSelectedId} />
          )}
          {view === "map" && (
            <ClientServiceMapView clients={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          )}
          {view === "list" && (
            <div className="dash-card overflow-hidden !p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="w-10 px-3 py-3"><span className="sr-only">Select</span></th>
                      <th className="px-3 py-3">Client ID</th>
                      <th className="px-3 py-3">Client Name</th>
                      <th className="px-3 py-3">Contact</th>
                      <th className="px-3 py-3">Patients</th>
                      <th className="px-3 py-3">Active Services</th>
                      <th className="px-3 py-3">Current Staff</th>
                      <th className="px-3 py-3">Coordinator</th>
                      <th className="px-3 py-3">Renewal Due</th>
                      <th className="px-3 py-3">Outstanding</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageClients.map((client) => {
                      const isSelected = selectedId === client.id;
                      return (
                        <tr
                          key={client.id}
                          onClick={() => setSelectedId(client.id)}
                          className={`cursor-pointer border-t border-gray-100 transition ${isSelected ? "bg-violet-50/80" : "bg-white hover:bg-gray-50/60"}`}
                        >
                          <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="accent-violet-accent" checked={checked.has(client.id)} onChange={() => toggleCheck(client.id)} />
                          </td>
                          <td className="px-3 py-3.5 font-semibold text-violet-accent">{client.clientId}</td>
                          <td className="px-3 py-3.5 font-semibold text-gray-900">{client.name}</td>
                          <td className="px-3 py-3.5">
                            <span className="flex items-center gap-1 text-xs text-gray-600">
                              {client.phone}
                              <MessageCircle className="h-3 w-3 text-emerald-500" />
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-xs text-gray-700">{client.patientCount} Patient{client.patientCount !== 1 ? "s" : ""}</td>
                          <td className="px-3 py-3.5">
                            <p className="font-medium text-gray-800">{client.primaryService}</p>
                            <p className="text-[11px] text-gray-500">{client.primaryServiceStart}</p>
                          </td>
                          <td className="px-3 py-3.5">
                            {client.staffName !== "—" ? (
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
                                {client.staffName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-3 py-3.5 text-xs font-medium text-gray-800">{client.coordinator}</td>
                          <td className="px-3 py-3.5 text-xs">
                            {client.renewalDate !== "—" ? (
                              <>
                                {client.renewalDate}
                                <br />
                                <span className="text-gray-500">in {client.renewalInDays} days</span>
                              </>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-3 py-3.5 text-xs font-semibold">{client.outstanding > 0 ? formatInr(client.outstanding) : "—"}</td>
                          <td className="px-3 py-3.5"><ClientStatusBadge status={client.status} /></td>
                          <td className="px-3 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <Link href={`/dashboard/clients/details?id=${client.id}`} className="mr-1 text-[10px] font-semibold text-violet-accent hover:underline">
                              Open
                            </Link>
                            <button type="button" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Actions">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-xs text-gray-600">
                <p>
                  Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} clients
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`min-w-[28px] rounded-md px-2 py-1 font-semibold ${page === p ? "bg-violet-accent text-white" : "hover:bg-gray-100"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <select className="crm-select !w-auto !py-1.5 text-xs" defaultValue="10">
                  <option>10 / page</option>
                  <option>25 / page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {selectedClient && view === "list" && <ClientSnapshotPanel client={selectedClient} />}
      </div>
    </div>
  );
}
