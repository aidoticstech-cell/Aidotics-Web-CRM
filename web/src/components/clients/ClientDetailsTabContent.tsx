"use client";

import { useState } from "react";
import { MapPin, Plus, FileText, Star, Download } from "lucide-react";
import {
  DEFAULT_CLIENT_ACTIVITIES,
  DEFAULT_CLIENT_SERVICES,
  DEFAULT_CLIENT_STAFF,
  type Client,
} from "@/lib/clients-data";

export const CLIENT_DETAIL_TABS = [
  "Overview",
  "Patients",
  "Service History",
  "Payments",
  "Documents",
  "Communication",
  "Notes",
  "Timeline",
  "Ratings & Feedback",
  "Agreements",
] as const;

function formatInr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

const MOCK_PATIENTS = [
  { name: "Mrs. Sharma", age: 65, relation: "Mother", condition: "Post-surgery ICU care" },
  { name: "Master Arjun", age: 8, relation: "Son", condition: "General monitoring" },
];

export function ClientDetailsTabContent({ client, tab }: { client: Client; tab: string }) {
  const [noteDraft, setNoteDraft] = useState("");
  const collectedPct = client.totalBilling
    ? Math.round(((client.amountCollected ?? 0) / client.totalBilling) * 100)
    : 95;

  if (tab === "Overview") {
    return (
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <section className="dash-card">
          <div className="flex items-center justify-between">
            <h4 className="dash-card-title">Client Information</h4>
            <button type="button" className="text-xs font-semibold text-violet-accent">Edit</button>
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            {[
              ["Client Type", client.clientType],
              ["Coordinator", client.coordinator],
              ["Source", client.source],
              ["Joined Date", client.joinedDate],
              ["Branch", client.branch],
              ["VIP Status", client.vip ? "Yes" : "No"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <dt className="text-gray-500">{k}</dt>
                <dd className="font-medium text-gray-900">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="dash-card">
          <div className="flex items-center justify-between">
            <h4 className="dash-card-title">Current Active Services</h4>
            <button type="button" className="text-xs font-semibold text-violet-accent">View All</button>
          </div>
          <ul className="mt-3 space-y-2">
            {DEFAULT_CLIENT_SERVICES.map((s) => (
              <li key={s.name} className="flex items-center justify-between rounded-lg border border-gray-100 p-2.5 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">{s.name}</p>
                  <p className="text-[11px] text-gray-500">Started {s.start}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{s.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="dash-card lg:col-span-2 xl:col-span-1 xl:row-span-2">
          <div className="flex items-center justify-between">
            <h4 className="dash-card-title">Current Staff Assigned</h4>
            <button type="button" className="text-xs font-semibold text-violet-accent">View Details</button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-bold uppercase text-gray-500">
                <tr>
                  <th className="pb-2">Staff</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Rating</th>
                  <th className="pb-2">Attendance</th>
                  <th className="pb-2">Replacements</th>
                </tr>
              </thead>
              <tbody>
                {DEFAULT_CLIENT_STAFF.map((s) => (
                  <tr key={s.name} className="border-t border-gray-100">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
                          {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                        <span className="font-semibold">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-gray-600">{s.role}</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-0.5 font-semibold text-amber-600">
                        <Star className="h-3 w-3 fill-amber-400" /> {s.rating}
                      </span>
                    </td>
                    <td className="py-2.5 font-semibold text-emerald-600">{s.attendance}%</td>
                    <td className="py-2.5 text-gray-600">{s.replacements}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dash-card">
          <h4 className="dash-card-title">Financial Snapshot</h4>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Total Billing</dt><dd className="font-bold">{formatInr(client.totalBilling ?? 0)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Amount Collected</dt><dd className="font-semibold text-emerald-600">{formatInr(client.amountCollected ?? 0)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Outstanding</dt><dd className="font-bold text-red-600">{formatInr(client.outstanding)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Last Payment</dt><dd className="text-xs">May 11, 2025 · ₹25,000</dd></div>
          </dl>
          <div className="mt-3">
            <div className="flex justify-between text-[10px] font-semibold text-gray-600">
              <span>Payment Status</span>
              <span>{collectedPct}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${collectedPct}%` }} />
            </div>
          </div>
        </section>

        <section className="dash-card">
          <div className="flex items-center justify-between">
            <h4 className="dash-card-title">Recent Activities</h4>
            <button type="button" className="text-xs font-semibold text-violet-accent">View Timeline</button>
          </div>
          <ul className="mt-3 space-y-3">
            {DEFAULT_CLIENT_ACTIVITIES.map((a) => (
              <li key={a.title} className="relative border-l-2 border-violet-200 pl-3">
                <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                <p className="text-xs text-gray-600">{a.detail}</p>
                <p className="text-[10px] text-gray-400">{a.at}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  if (tab === "Patients") {
    return (
      <div className="space-y-3">
        <div className="flex justify-end">
          <button type="button" className="btn-primary !py-2 text-xs"><Plus className="h-3.5 w-3.5" /> Add Patient</button>
        </div>
        {MOCK_PATIENTS.map((p) => (
          <div key={p.name} className="dash-card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-gray-900">{p.name}</p>
              <p className="text-xs text-gray-500">{p.age} yrs · {p.relation}</p>
              <p className="mt-1 text-sm text-gray-700">{p.condition}</p>
            </div>
            <button type="button" className="text-xs font-semibold text-violet-accent">View Profile</button>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "Service History") {
    return (
      <div className="dash-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-[11px] font-bold uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">Service</th>
              <th className="px-3 py-2">Period</th>
              <th className="px-3 py-2">Staff</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ICU Nurse (24H)", "May 2025 – Present", "Priya Singh", "₹54,000/mo", "Active"],
              ["Attendant (24H)", "May 2025 – Present", "Suresh Kumar", "₹28,000/mo", "Active"],
              ["Physiotherapist", "Jan – Apr 2025", "Dr. Meera Joshi", "₹18,000/mo", "Completed"],
            ].map(([svc, period, staff, amt, st]) => (
              <tr key={svc} className="border-t border-gray-100">
                <td className="px-3 py-3 font-semibold">{svc}</td>
                <td className="px-3 py-3 text-gray-600">{period}</td>
                <td className="px-3 py-3">{staff}</td>
                <td className="px-3 py-3">{amt}</td>
                <td className="px-3 py-3"><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{st}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (tab === "Payments") {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Total Billed", formatInr(client.totalBilling ?? 0)],
            ["Collected", formatInr(client.amountCollected ?? 0)],
            ["Outstanding", formatInr(client.outstanding)],
          ].map(([l, v]) => (
            <div key={l} className="dash-card !p-4 text-center">
              <p className="text-[11px] text-gray-500">{l}</p>
              <p className="mt-1 text-xl font-bold">{v}</p>
            </div>
          ))}
        </div>
        <div className="dash-card">
          <h4 className="dash-card-title">Payment History</h4>
          <ul className="mt-3 divide-y divide-gray-100 text-sm">
            {[
              { date: "May 11, 2025", mode: "UPI", amount: 25000 },
              { date: "Apr 28, 2025", mode: "Bank Transfer", amount: 54000 },
              { date: "Mar 30, 2025", mode: "Cheque", amount: 54000 },
            ].map((p) => (
              <li key={p.date} className="flex justify-between py-2.5">
                <span>{p.date} · {p.mode}</span>
                <span className="font-bold text-emerald-600">{formatInr(p.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (tab === "Documents") {
    return (
      <ul className="space-y-2">
        {["Service Agreement_CL-1258.pdf", "KYC_Rahul_Sharma.pdf", "Prescription_May2025.jpg"].map((name) => (
          <li key={name} className="dash-card flex items-center justify-between !py-3">
            <span className="flex items-center gap-2 text-sm"><FileText className="h-4 w-4 text-violet-accent" /> {name}</span>
            <button type="button" className="text-xs font-semibold text-violet-accent"><Download className="inline h-3.5 w-3.5" /> Download</button>
          </li>
        ))}
      </ul>
    );
  }

  if (tab === "Communication") {
    return (
      <ul className="space-y-2">
        {[
          { type: "WhatsApp", text: "Renewal reminder sent", at: "May 12, 09:00 AM" },
          { type: "Call", text: "Discussed staff replacement", at: "May 10, 04:30 PM" },
          { type: "Email", text: "Invoice #INV-4521 sent", at: "May 8, 11:15 AM" },
        ].map((c) => (
          <li key={c.at} className="dash-card !py-3 text-sm">
            <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold">{c.type}</span>
            <p className="mt-1 font-medium">{c.text}</p>
            <p className="text-[11px] text-gray-500">{c.at}</p>
          </li>
        ))}
      </ul>
    );
  }

  if (tab === "Notes") {
    return (
      <div className="space-y-4">
        <textarea className="crm-input min-h-[80px]" placeholder="Add a note…" value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
        <button type="button" className="btn-primary !py-2 text-xs">Save Note</button>
        <ul className="space-y-2">
          {[
            { text: "Client prefers Hindi-speaking staff for night shift.", by: "Neha Patel", at: "May 11" },
            { text: "VIP — handle escalations directly.", by: "Owner", at: "May 3" },
          ].map((n) => (
            <li key={n.at} className="dash-card !py-3 text-sm">
              <p>{n.text}</p>
              <p className="mt-1 text-[11px] text-gray-500">{n.by} · {n.at}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (tab === "Timeline") {
    return (
      <ul className="space-y-3 border-l-2 border-violet-200 pl-4">
        {[...DEFAULT_CLIENT_ACTIVITIES, { title: "Client Onboarded", detail: "Welcome kit sent", at: client.joinedDate }].map((a) => (
          <li key={a.at + a.title}>
            <p className="text-sm font-bold text-gray-900">{a.title}</p>
            <p className="text-xs text-gray-600">{a.detail}</p>
            <p className="text-[10px] text-gray-400">{a.at}</p>
          </li>
        ))}
      </ul>
    );
  }

  if (tab === "Ratings & Feedback") {
    return (
      <div className="space-y-3">
        <div className="dash-card text-center">
          <p className="text-4xl font-black text-violet-accent">{client.satisfaction}</p>
          <p className="text-sm text-gray-500">Overall satisfaction</p>
        </div>
        {[
          { staff: "Priya Singh", rating: 5, comment: "Excellent ICU care, very professional." },
          { staff: "Suresh Kumar", rating: 4, comment: "Good attendant, punctual." },
        ].map((r) => (
          <div key={r.staff} className="dash-card">
            <div className="flex items-center justify-between">
              <p className="font-bold">{r.staff}</p>
              <span className="flex items-center gap-0.5 text-amber-600">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                ))}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{r.comment}</p>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "Agreements") {
    return (
      <div className="dash-card">
        <p className="text-sm font-semibold text-gray-900">Master Service Agreement</p>
        <p className="mt-1 text-xs text-gray-500">Signed {client.joinedDate} · Valid until {client.renewalDate}</p>
        <button type="button" className="btn-secondary mt-3 !py-2 text-xs">View Agreement</button>
      </div>
    );
  }

  return (
    <p className="text-sm text-gray-500">
      <MapPin className="mr-1 inline h-4 w-4" />
      Select a tab to view {client.name}&apos;s {tab.toLowerCase()} information.
    </p>
  );
}
