"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Calendar, Filter } from "lucide-react";
import { AnalyticsTabPanel } from "@/components/leads/LeadAnalyticsPanels";

const METRICS = [
  { title: "Total Leads", value: "1,248", trend: "↑ 14.6%", up: true },
  { title: "New Leads", value: "826", trend: "↑ 12.3%", up: true },
  { title: "Converted Leads", value: "312", trend: "↑ 18.7%", up: true },
  { title: "Conversion Rate", value: "25.08%", trend: "↑ 4.2%", up: true },
  { title: "Lost Leads", value: "156", trend: "↓ 8.6%", up: false },
  { title: "Avg. Response Time", value: "18m 32s", trend: "↓ 6m 14s", up: false },
];

export const ANALYTICS_TABS = [
  "Overview",
  "Lead Source",
  "Conversion Funnel",
  "Coordinator Performance",
  "Lead Status",
  "Location",
  "Time Analytics",
  "Campaign Performance",
] as const;

export function LeadAnalyticsPage() {
  const [tab, setTab] = useState<(typeof ANALYTICS_TABS)[number]>("Overview");

  return (
    <div className="p-4 lg:p-6">
      <nav className="mb-2 text-xs text-gray-500">
        <Link href="/dashboard/leads" className="hover:text-violet-accent">Leads</Link>
        <span className="mx-1.5">›</span>
        <span className="font-medium text-gray-800">Lead Analytics</span>
      </nav>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Analytics</h1>
          <p className="mt-0.5 text-sm text-gray-500">Track performance, analyze trends and improve lead conversion.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium">
            <Calendar className="h-3.5 w-3.5" />
            May 1 – May 12, 2025
          </button>
          <button type="button" className="btn-secondary !gap-1.5 !py-2 text-xs"><Filter className="h-3.5 w-3.5" /> Filters</button>
          <button type="button" className="btn-secondary !gap-1.5 !py-2 text-xs"><Download className="h-3.5 w-3.5" /> Export</button>
          <button type="button" className="btn-primary !py-2 text-xs">Schedule Report</button>
        </div>
      </div>

      <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {METRICS.map((m) => (
          <div key={m.title} className="dash-card !p-3.5">
            <p className="text-[11px] font-semibold text-gray-500">{m.title}</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{m.value}</p>
            <p className={`mt-0.5 text-[11px] font-medium ${m.up ? "text-emerald-600" : "text-red-600"}`}>{m.trend}</p>
          </div>
        ))}
      </section>

      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
        {ANALYTICS_TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 border-b-2 px-3 py-2 text-xs font-semibold transition ${
              tab === t ? "border-violet-accent text-violet-accent" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <AnalyticsTabPanel tab={tab} />
    </div>
  );
}
