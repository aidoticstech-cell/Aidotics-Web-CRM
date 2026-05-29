"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Phone,
  MessageCircle,
  Mail,
  Pencil,
  UserPlus,
  Briefcase,
  Megaphone,
  Ban,
  ArrowLeft,
} from "lucide-react";
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge";
import { LeadDetailsTabContent, getDefaultLeadExtras, type LeadExtras } from "@/components/leads/LeadDetailsTabContent";
import { DRAWER_TABS } from "@/components/leads/LeadDetailsDrawer";
import { MOCK_LEADS, LEAD_STATUS_LABELS, type Lead, type LeadStatus } from "@/lib/leads-data";

export function LeadDetailsPage() {
  const searchParams = useSearchParams();
  const leadIdParam = searchParams.get("id");
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [tab, setTab] = useState<(typeof DRAWER_TABS)[number]>("Overview");
  const [extras, setExtras] = useState<LeadExtras>(getDefaultLeadExtras);

  const lead = useMemo(() => {
    if (leadIdParam) return leads.find((l) => l.id === leadIdParam || l.leadId === leadIdParam) ?? leads[0];
    return leads[0];
  }, [leads, leadIdParam]);

  if (!lead) {
    return (
      <div className="state-center p-8">
        <p>Lead not found.</p>
        <Link href="/dashboard/leads" className="btn-primary mt-4">Back to Lead List</Link>
      </div>
    );
  }

  const initials = lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  function updateStatus(status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
  }

  return (
    <div className="p-4 lg:p-6">
      <nav className="mb-2 text-xs text-gray-500">
        <Link href="/dashboard/leads" className="hover:text-violet-accent">Leads</Link>
        <span className="mx-1.5">›</span>
        <span className="font-medium text-gray-800">Lead Details</span>
      </nav>

      <Link href="/dashboard/leads" className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-violet-accent hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Lead List
      </Link>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="onboarding-panel overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5">
            <div className="flex flex-wrap items-start gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 text-lg font-bold text-violet-700">{initials}</span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                  <LeadStatusBadge status={lead.status} />
                </div>
                <p className="text-sm text-gray-600">{lead.phone} · {lead.leadId}</p>
                <p className="text-xs text-gray-500">Created {lead.createdOn} {lead.createdTime}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { Icon: Phone, label: "Call" },
                { Icon: MessageCircle, label: "WhatsApp" },
                { Icon: Mail, label: "Email" },
                { Icon: Pencil, label: "Edit" },
              ].map(({ Icon, label }) => (
                <button key={label} type="button" className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto border-b border-gray-100 px-4">
            {DRAWER_TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`shrink-0 border-b-2 px-3 py-3 text-xs font-semibold ${
                  tab === t ? "border-violet-accent text-violet-accent" : "border-transparent text-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-6">
            <LeadDetailsTabContent lead={lead} tab={tab} extras={extras} onExtrasChange={setExtras} />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="dash-card">
            <h3 className="dash-card-title">Quick Actions</h3>
            <div className="mt-3 space-y-2">
              <button type="button" className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white" onClick={() => updateStatus("converted")}>
                <UserPlus className="mr-1 inline h-3.5 w-3.5" /> Convert to Client
              </button>
              <button type="button" className="w-full rounded-lg bg-sky-600 py-2.5 text-xs font-bold text-white">
                <Briefcase className="mr-1 inline h-3.5 w-3.5" /> Create Duty
              </button>
              <button type="button" className="w-full rounded-lg bg-orange-500 py-2.5 text-xs font-bold text-white">
                <Megaphone className="mr-1 inline h-3.5 w-3.5" /> Broadcast Requirement
              </button>
              <button type="button" className="w-full rounded-lg bg-red-600 py-2.5 text-xs font-bold text-white" onClick={() => updateStatus("lost")}>
                <Ban className="mr-1 inline h-3.5 w-3.5" /> Mark as Lost
              </button>
            </div>
          </div>
          <div className="dash-card">
            <label className="text-xs font-bold text-gray-700">Change status</label>
            <select className="crm-select mt-2 w-full text-sm" value={lead.status} onChange={(e) => updateStatus(e.target.value as LeadStatus)}>
              {Object.entries(LEAD_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </aside>
      </div>
    </div>
  );
}
