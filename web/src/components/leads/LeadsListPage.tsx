"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Upload,
  ChevronDown,
  MoreVertical,
  MessageCircle,
  LayoutList,
  Columns3,
  Calendar,
  Map,
  SlidersHorizontal,
  Globe,
  Phone,
  Share2,
} from "lucide-react";
import { LeadDetailsDrawer } from "@/components/leads/LeadDetailsDrawer";
import { LeadKanbanView } from "@/components/leads/LeadKanbanView";
import { LeadCalendarView } from "@/components/leads/LeadCalendarView";
import { LeadMapView } from "@/components/leads/LeadMapView";
import { LeadsFilterSidebar } from "@/components/leads/LeadsFilterSidebar";
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge";
import {
  LEAD_KPI,
  LEAD_STATUS_LABELS,
  MOCK_LEADS,
  type Lead,
  type LeadStatus,
} from "@/lib/leads-data";
import { FormModal } from "@/components/onboarding/FormModal";
import { Field } from "@/components/ui/FormBits";
import { newOnboardingId } from "@/lib/onboarding-id";

const SOURCE_ICONS: Record<string, typeof Globe> = {
  website: Globe,
  referral: Share2,
  justdial: Phone,
  facebook: Share2,
  google: Globe,
  phone: Phone,
  whatsapp: MessageCircle,
};

const PAGE_SIZE = 10;

export function LeadsListPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_LEADS[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "kanban" | "calendar" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [newLead, setNewLead] = useState({ name: "", phone: "", city: "", requirement: "", source: "Website" });

  const selectedLead = leads.find((l) => l.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (activeFilter === "followup") {
        if (l.followUpNotRequired || (!l.followUpOverdue && !l.followUpDate)) return false;
      } else if (activeFilter === "hot") {
        if ((l.leadAgeDays ?? 99) > 3 || l.status === "converted" || l.status === "lost") return false;
      } else if (activeFilter !== "all" && l.status !== activeFilter) {
        return false;
      }
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.leadId.toLowerCase().includes(q)
      );
    });
  }, [leads, search, activeFilter, sourceFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageLeads = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

  function addLead() {
    if (!newLead.name.trim() || !newLead.phone.trim()) {
      showToast("Name and phone are required.");
      return;
    }
    const id = newOnboardingId();
    const lead: Lead = {
      id,
      leadId: `LID-${1200 + leads.length}`,
      name: newLead.name,
      phone: newLead.phone,
      city: newLead.city || "Gurgaon",
      requirement: newLead.requirement || "Nursing Care",
      service: newLead.requirement || "Nursing Care",
      source: newLead.source,
      sourceIcon: "website",
      status: "new",
      assignedTo: "Neha Patel",
      branch: "Gurgaon",
      createdOn: "May 12, 2025",
      createdTime: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      leadAgeDays: 0,
    };
    setLeads((prev) => [lead, ...prev]);
    setSelectedId(id);
    setAddOpen(false);
    setNewLead({ name: "", phone: "", city: "", requirement: "", source: "Website" });
    showToast("Lead added successfully.");
  }

  function updateLeadStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  return (
    <div className="p-4 lg:p-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] max-w-sm rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">{toast}</div>
      )}

      <FormModal open={addOpen} title="Add New Lead" onClose={() => setAddOpen(false)} onSubmit={addLead} submitLabel="Save Lead" wide>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Client Name" required><input className="crm-input" value={newLead.name} onChange={(e) => setNewLead((f) => ({ ...f, name: e.target.value }))} /></Field>
          <Field label="Mobile" required><input className="crm-input" value={newLead.phone} onChange={(e) => setNewLead((f) => ({ ...f, phone: e.target.value }))} /></Field>
          <Field label="City"><input className="crm-input" value={newLead.city} onChange={(e) => setNewLead((f) => ({ ...f, city: e.target.value }))} /></Field>
          <Field label="Requirement"><input className="crm-input" value={newLead.requirement} onChange={(e) => setNewLead((f) => ({ ...f, requirement: e.target.value }))} placeholder="e.g. ICU Nurse (12H)" /></Field>
          <Field label="Source" className="sm:col-span-2">
            <select className="crm-select" value={newLead.source} onChange={(e) => setNewLead((f) => ({ ...f, source: e.target.value }))}>
              {["Website", "Referral", "Justdial", "Facebook", "Google Ads", "Phone Call", "WhatsApp"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
      </FormModal>

      <LeadDetailsDrawer
        lead={selectedLead}
        onClose={() => setSelectedId(null)}
        onStatusChange={(status) => selectedId && updateLeadStatus(selectedId, status)}
      />

      <nav className="mb-2 text-xs text-gray-500">
        <Link href="/dashboard/leads" className="hover:text-violet-accent">Leads</Link>
        <span className="mx-1.5">›</span>
        <span className="font-medium text-gray-800">Lead List</span>
      </nav>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Lead List</h1>
          <p className="mt-0.5 text-sm text-gray-500">Manage and convert enquiries into successful clients.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 sm:min-w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="crm-input !py-2.5 !pl-9"
              placeholder="Search leads by name, phone, or ID…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <button type="button" className="btn-primary !gap-1.5 !py-2.5 text-sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Lead
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>
          <Link href="/dashboard/leads/import" className="btn-outline-purple !gap-1.5 !py-2.5 text-sm">
            <Upload className="h-4 w-4" />
            Import Center
          </Link>
        </div>
      </div>

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {LEAD_KPI.map((k) => (
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
            { id: "kanban" as const, label: "Kanban", Icon: Columns3 },
            { id: "calendar" as const, label: "Calendar", Icon: Calendar },
            { id: "map" as const, label: "Map", Icon: Map },
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
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${showFilters ? "text-violet-accent" : "text-gray-600 hover:text-violet-accent"}`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select className="crm-select !w-auto !py-2 text-xs" value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}>
          <option value="all">All Sources</option>
          {[...new Set(leads.map((l) => l.source))].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select className="crm-select !w-auto !py-2 text-xs" value={activeFilter} onChange={(e) => { setActiveFilter(e.target.value); setPage(1); }}>
          <option value="all">All Status</option>
          {Object.entries(LEAD_STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select className="crm-select !w-auto !py-2 text-xs" defaultValue="all">
          <option value="all">All Users</option>
          <option>Neha Patel</option>
          <option>Rahul Sharma</option>
        </select>
        <select className="crm-select !w-auto !py-2 text-xs" defaultValue="all">
          <option value="all">All Branches</option>
          <option>Gurgaon</option>
          <option>Noida (HQ)</option>
        </select>
        <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700">
          May 1, 2025 – May 12, 2025
        </button>
        <button type="button" className="text-xs font-semibold text-violet-accent" onClick={() => { setActiveFilter("all"); setSourceFilter("all"); setSearch(""); setPage(1); }}>
          Clear filters
        </button>
      </div>

      <div className={`flex gap-4 ${showFilters ? "flex-col xl:flex-row" : ""}`}>
        <div className="min-w-0 flex-1">
      {view === "kanban" && (
        <LeadKanbanView
          leads={filtered}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onStatusChange={updateLeadStatus}
        />
      )}
      {view === "calendar" && (
        <LeadCalendarView leads={filtered} onSelect={setSelectedId} />
      )}
      {view === "map" && (
        <LeadMapView leads={filtered} selectedId={selectedId} onSelect={setSelectedId} />
      )}
      {view === "list" && (
      <div className="dash-card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="w-10 px-3 py-3"><span className="sr-only">Select</span></th>
                <th className="px-3 py-3">Lead ID</th>
                <th className="px-3 py-3">Client / Contact</th>
                <th className="px-3 py-3">Requirement</th>
                <th className="px-3 py-3">Source</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Assigned To</th>
                <th className="px-3 py-3">Follow-up</th>
                <th className="px-3 py-3">Created On</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageLeads.map((lead) => {
                const SourceIcon = SOURCE_ICONS[lead.sourceIcon || "website"] || Globe;
                const isSelected = selectedId === lead.id;
                return (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedId(lead.id)}
                    className={`cursor-pointer border-t border-gray-100 transition ${isSelected ? "bg-violet-50/80" : "bg-white hover:bg-gray-50/60"}`}
                  >
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="accent-violet-accent"
                        checked={checked.has(lead.id)}
                        onChange={() => toggleCheck(lead.id)}
                      />
                    </td>
                    <td className="px-3 py-3.5 font-semibold text-violet-accent">{lead.leadId}</td>
                    <td className="px-3 py-3.5">
                      <p className="font-semibold text-gray-900">{lead.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                        {lead.phone}
                        <MessageCircle className="h-3 w-3 text-emerald-500" />
                      </p>
                    </td>
                    <td className="px-3 py-3.5 text-gray-700">
                      <p className="font-medium">{lead.requirement}</p>
                      <p className="text-[11px] text-gray-500">{lead.city}</p>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-700">
                        <SourceIcon className="h-3.5 w-3.5 text-gray-400" />
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-3 py-3.5"><LeadStatusBadge status={lead.status} /></td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
                          {lead.assignedTo.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{lead.assignedTo}</p>
                          {lead.assignedRole && <p className="text-[10px] text-gray-500">{lead.assignedRole}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-xs">
                      {lead.followUpNotRequired ? (
                        <span className="text-emerald-600">✓ Not Required</span>
                      ) : lead.followUpDate ? (
                        <span className={lead.followUpOverdue ? "font-semibold text-red-600" : "text-gray-700"}>
                          {lead.followUpDate}
                          <br />
                          {lead.followUpTime}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-gray-600">
                      {lead.createdOn}
                      <br />
                      {lead.createdTime}
                    </td>
                    <td className="px-3 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/dashboard/leads/details?id=${lead.id}`}
                        className="mr-1 text-[10px] font-semibold text-violet-accent hover:underline"
                      >
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
            Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} leads
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
            {totalPages > 5 && <span className="px-1">…</span>}
          </div>
          <select className="crm-select !w-auto !py-1.5 text-xs" defaultValue="10">
            <option>10 / page</option>
            <option>25 / page</option>
            <option>50 / page</option>
          </select>
        </div>
      </div>
      )}
        </div>
        {showFilters && (
          <LeadsFilterSidebar
            statusFilter={activeFilter}
            onStatusFilter={(v) => { setActiveFilter(v); setPage(1); }}
            onApply={() => showToast("Filters applied.")}
          />
        )}
      </div>
    </div>
  );
}
