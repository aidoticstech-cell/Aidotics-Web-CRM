"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Plus, UploadCloud, Check } from "lucide-react";

const SOURCES = [
  "Excel / CSV Upload",
  "Website Forms",
  "Facebook Leads",
  "Google Sheets",
  "WhatsApp Leads",
  "Hospital Referrals",
  "Bureau Referrals",
  "Manual Entry",
];

const IMPORT_HISTORY = [
  { date: "May 12, 2025 10:30 AM", source: "Excel", records: 128, status: "Completed", by: "Neha Patel" },
  { date: "May 10, 2025 04:15 PM", source: "Facebook", records: 45, status: "Partial", by: "Rahul Sharma" },
  { date: "May 8, 2025 11:00 AM", source: "CSV", records: 12, status: "Failed", by: "Admin" },
];

export function ImportCenterPage() {
  const [activeSource, setActiveSource] = useState(0);
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="p-4 lg:p-6">
      <nav className="mb-2 text-xs text-gray-500">
        <Link href="/dashboard/leads" className="hover:text-violet-accent">Leads</Link>
        <span className="mx-1.5">›</span>
        <span className="font-medium text-gray-800">Import Center</span>
      </nav>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import Center</h1>
          <p className="mt-0.5 text-sm text-gray-500">Import leads from multiple sources and keep your data clean & accurate.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-outline-purple !gap-1.5 text-sm"><Download className="h-4 w-4" /> Download Sample</button>
          <button type="button" className="btn-primary !gap-1.5 text-sm"><Plus className="h-4 w-4" /> New Import</button>
        </div>
      </div>

      <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {[
          ["Total Imported Today", "128", "+18.2%"],
          ["Pending Imports", "02", "-1"],
          ["Failed Imports", "05", "-2"],
          ["Duplicates Found", "37", "+11.3%"],
          ["Auto Merged", "24", "+9.7%"],
          ["Exported Records", "86", "+14.2%"],
        ].map(([title, val, trend]) => (
          <div key={title} className="dash-card !p-3.5">
            <p className="text-[11px] font-semibold text-gray-500">{title}</p>
            <p className="mt-1 text-2xl font-bold">{val}</p>
            <p className="text-[11px] text-gray-500">{trend}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-[200px_1fr_260px]">
        <aside className="dash-card !p-3">
          <p className="mb-2 text-xs font-bold text-gray-500">Import Sources</p>
          <div className="space-y-1">
            {SOURCES.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveSource(i)}
                className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium ${activeSource === i ? "bg-violet-soft text-violet-accent" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
            {["Upload File", "Map Fields", "Validate", "Review & Merge", "Summary"].map((s, i) => (
              <span key={s} className={`rounded-full px-3 py-1 ${i + 1 === step ? "bg-violet-accent text-white" : i + 1 < step ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                {i + 1}. {s}
              </span>
            ))}
          </div>

          <section className="dash-card">
            <h3 className="dash-card-title">Step 1: Upload File</h3>
            <label className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/40 px-6 py-10">
              <UploadCloud className="h-10 w-10 text-violet-accent" />
              <p className="mt-2 text-sm font-semibold text-gray-800">Drag & drop your file here</p>
              <p className="mt-1 text-xs text-gray-500">.xlsx, .xls, .csv (Max 20MB)</p>
              <span className="btn-primary mt-4 !py-2 text-xs">Browse File</span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFileName(f.name);
                    setStep(2);
                  }
                }}
              />
            </label>
            {fileName && <p className="mt-2 text-xs font-semibold text-emerald-700">Selected: {fileName}</p>}
          </section>

          {step >= 2 && (
            <section className="dash-card">
              <h3 className="dash-card-title">Step 2: Map Fields</h3>
              <table className="mt-3 w-full text-left text-xs">
                <thead className="text-gray-500">
                  <tr><th className="py-2">CRM Field</th><th className="py-2">Your Column</th></tr>
                </thead>
                <tbody>
                  {["Full Name", "Mobile Number", "Email", "City", "Service Required"].map((f) => (
                    <tr key={f} className="border-t border-gray-100">
                      <td className="py-2 font-medium">{f}</td>
                      <td className="py-2"><select className="crm-select !py-1.5 text-xs"><option>Auto-detect</option></select></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" className="btn-primary mt-4 !py-2 text-xs" onClick={() => setStep(3)}>Continue to Validate</button>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <section className="dash-card border-emerald-100 bg-emerald-50/50">
            <h3 className="text-sm font-bold text-emerald-900">Tips for successful import</h3>
            <ul className="mt-2 space-y-1.5 text-xs text-emerald-900/90">
              {["Use the sample template", "Include country code on mobile", "Remove duplicate rows"].map((t) => (
                <li key={t} className="flex gap-1.5"><Check className="h-3.5 w-3.5 shrink-0" />{t}</li>
              ))}
            </ul>
          </section>
          <section className="dash-card">
            <h3 className="dash-card-title">Import History</h3>
            <ul className="mt-2 space-y-2 text-[11px]">
              {IMPORT_HISTORY.map((h) => (
                <li key={h.date} className="rounded-lg border border-gray-100 p-2">
                  <p className="font-semibold text-gray-800">{h.records} records · {h.source}</p>
                  <p className="text-gray-500">{h.date}</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${h.status === "Completed" ? "bg-emerald-100 text-emerald-700" : h.status === "Partial" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{h.status}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
