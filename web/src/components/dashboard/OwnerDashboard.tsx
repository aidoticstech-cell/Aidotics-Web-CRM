"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowRight,
  Users,
  BriefcaseMedical,
  ClipboardList,
  IndianRupee,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth-api";

const KPI_CARDS = [
  { title: "Total Leads", value: "128", hint: "↑ 18% vs yesterday", Icon: Users, tone: "bg-violet-100 text-violet-600" },
  { title: "Active Duties", value: "156", hint: "↑ 12% vs yesterday", Icon: BriefcaseMedical, tone: "bg-sky-100 text-sky-600" },
  { title: "Active Workforce", value: "312", hint: "↑ 8% vs yesterday", Icon: ClipboardList, tone: "bg-emerald-100 text-emerald-600" },
  { title: "Revenue Today", value: "₹1,48,750", hint: "↑ 22% vs yesterday", Icon: IndianRupee, tone: "bg-amber-100 text-amber-600" },
  { title: "Revenue This Month", value: "₹24,68,450", hint: "↑ 14% vs last month", Icon: IndianRupee, tone: "bg-teal-100 text-teal-600" },
  { title: "Pending Payments", value: "₹6,72,300", hint: "24 Invoices", Icon: IndianRupee, tone: "bg-rose-100 text-rose-600" },
];

const FUNNEL = [
  { label: "New Leads", value: 458, width: 100, conv: "100%" },
  { label: "Qualified", value: 262, width: 72, conv: "57%" },
  { label: "Requirement Discussion", value: 168, width: 52, conv: "37%" },
  { label: "Proposal / Quotation", value: 96, width: 38, conv: "21%" },
  { label: "Converted", value: 68, width: 28, conv: "15%" },
];

const DUTY_SEGMENTS = [
  { label: "Running", color: "#10b981", count: 42 },
  { label: "Upcoming", color: "#0ea5e9", count: 38 },
  { label: "Ending Today", color: "#f59e0b", count: 24 },
  { label: "Replacement Needed", color: "#ef4444", count: 8 },
  { label: "Completed Today", color: "#8b5cf6", count: 36 },
  { label: "Cancelled", color: "#9ca3af", count: 8 },
];

const WORKFORCE_SEGMENTS = [
  { label: "Available", color: "#10b981", count: 142 },
  { label: "On Duty", color: "#0ea5e9", count: 118 },
  { label: "On Leave", color: "#f59e0b", count: 32 },
  { label: "Unavailable", color: "#ef4444", count: 20 },
];

const REVENUE_POINTS = [42, 58, 45, 72, 68, 85, 78];
const REVENUE_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const BRANCH_ROWS = [
  { branch: "Noida (HQ)", revenue: "₹10,24,850", duties: 68, rate: 94 },
  { branch: "Gurgaon", revenue: "₹6,45,300", duties: 42, rate: 92 },
  { branch: "Delhi", revenue: "₹4,32,600", duties: 28, rate: 90 },
  { branch: "Faridabad", revenue: "₹2,78,250", duties: 18, rate: 88 },
];

const COORDINATOR_ROWS = [
  { name: "Neha Patel", duties: 24, rate: 96, response: "8 min" },
  { name: "Rahul Sharma", duties: 18, rate: 94, response: "12 min" },
  { name: "Amit Verma", duties: 15, rate: 91, response: "15 min" },
  { name: "Pooja Singh", duties: 12, rate: 89, response: "18 min" },
];

const QUICK_ACTIONS = [
  "Add New Lead",
  "Create Duty",
  "Add Workforce",
  "Generate Invoice",
  "Broadcast Duty",
  "View Live Duties",
  "Approve Staff",
  "Send Notification",
];

const RECENT_ACTIVITY = [
  { text: "Duty #DUT-2451 completed", time: "2 min ago", tone: "text-emerald-600" },
  { text: "Payment received ₹2,500", time: "15 min ago", tone: "text-sky-600" },
  { text: "New lead added — Priya S.", time: "32 min ago", tone: "text-violet-600" },
  { text: "Staff accepted duty #DUT-2458", time: "1 hr ago", tone: "text-amber-600" },
  { text: "Invoice #INV-1090 generated", time: "2 hr ago", tone: "text-gray-600" },
];

function DonutChart({ total, segments, centerLabel }: { total: number; segments: { label: string; color: string; count: number }[]; centerLabel: string }) {
  const sum = segments.reduce((a, s) => a + s.count, 0) || 1;
  let offset = 0;
  const r = 42;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative h-32 w-32 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
          {segments.map((seg) => {
            const len = (seg.count / sum) * c;
            const el = (
              <circle
                key={seg.label}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="10"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-gray-900">{total}</span>
          <span className="text-[10px] font-medium text-gray-500">{centerLabel}</span>
        </div>
      </div>
      <ul className="grid w-full gap-1.5 text-[11px] sm:max-w-[140px]">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
              {seg.label}
            </span>
            <span className="font-semibold text-gray-800">{seg.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RevenueChart() {
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("weekly");
  const max = Math.max(...REVENUE_POINTS);
  const w = 280;
  const h = 120;
  const pts = REVENUE_POINTS.map((v, i) => {
    const x = (i / (REVENUE_POINTS.length - 1)) * w;
    const y = h - (v / max) * (h - 16) - 8;
    return `${x},${y}`;
  }).join(" ");

  return (
    <section className="dash-card lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="dash-card-title">Revenue Overview</h3>
          <p className="dash-card-meta">Track revenue trends across periods</p>
        </div>
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-[11px] font-semibold">
          {(["daily", "weekly", "monthly"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-md px-2.5 py-1 capitalize ${range === r ? "bg-white text-violet-accent shadow-sm" : "text-gray-500"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <svg viewBox={`0 0 ${w} ${h + 20}`} className="h-40 w-full">
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#revFill)" />
          <polyline points={pts} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinejoin="round" />
          {REVENUE_POINTS.map((v, i) => {
            const x = (i / (REVENUE_POINTS.length - 1)) * w;
            const y = h - (v / max) * (h - 16) - 8;
            return <circle key={REVENUE_DAYS[i]} cx={x} cy={y} r="4" fill="#7c3aed" />;
          })}
        </svg>
        <div className="mt-1 flex justify-between text-[10px] text-gray-400">
          {REVENUE_DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OwnerDashboard({ user }: { user: AuthUser & { bureauName?: string } }) {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const displayName = user.fullName?.split(" ")[0] || "Admin";

  function actionClick(label: string) {
    if (label === "Add New Lead") {
      router.push("/dashboard/leads");
      return;
    }
    setToast(`${label} — opens when this module is live.`);
    setTimeout(() => setToast(null), 2800);
  }

  return (
    <div className="p-4 lg:p-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-5">
        <p className="text-sm text-gray-600">
          Welcome back, <span className="font-semibold text-gray-900">{displayName}</span> 👋
        </p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-gray-900">Owner Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your bureau operations and business performance</p>
      </div>

      <div className="space-y-5">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              {KPI_CARDS.map(({ title, value, hint, Icon, tone }) => (
                <div key={title} className="dash-card !p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{title}</p>
                      <p className="mt-1.5 text-xl font-bold text-gray-900">{value}</p>
                      <p className="mt-0.5 text-[11px] font-medium text-emerald-600">{hint}</p>
                    </div>
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              ))}
            </section>

            <div className="grid gap-5 xl:grid-cols-[1fr_272px]">
              <div className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-3">
                  <section className="dash-card lg:col-span-1">
                    <h3 className="dash-card-title">Lead Funnel</h3>
                    <p className="dash-card-meta">(This Month)</p>
                    <div className="mt-4 space-y-2.5">
                      {FUNNEL.map((row) => (
                        <div key={row.label}>
                          <div className="mb-1 flex items-center justify-between text-[11px]">
                            <span className="font-medium text-gray-700">{row.label}</span>
                            <span className="text-gray-500">
                              <span className="font-bold text-gray-900">{row.value}</span>
                              <span className="ml-2 text-violet-accent">{row.conv}</span>
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-300"
                              style={{ width: `${row.width}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="dash-card">
                    <h3 className="dash-card-title">Duty Status (Live)</h3>
                    <DonutChart total={156} segments={DUTY_SEGMENTS} centerLabel="Total Duties" />
                  </section>

                  <section className="dash-card">
                    <h3 className="dash-card-title">Workforce Availability</h3>
                    <DonutChart total={312} segments={WORKFORCE_SEGMENTS} centerLabel="Total Staff" />
                  </section>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  <RevenueChart />
                  <section className="dash-card">
                    <h3 className="dash-card-title">Branch Performance</h3>
                    <p className="dash-card-meta">(This Month)</p>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-500">
                            <th className="pb-2 font-semibold">Branch</th>
                            <th className="pb-2 font-semibold">Revenue</th>
                            <th className="pb-2 font-semibold">Duties</th>
                            <th className="pb-2 font-semibold">Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {BRANCH_ROWS.map((row) => (
                            <tr key={row.branch} className="border-t border-gray-50">
                              <td className="py-2 font-semibold text-gray-800">{row.branch}</td>
                              <td className="py-2 text-gray-600">{row.revenue}</td>
                              <td className="py-2 text-gray-600">{row.duties}</td>
                              <td className="py-2">
                                <div className="flex items-center gap-1.5">
                                  <div className="h-1.5 w-12 overflow-hidden rounded-full bg-gray-200">
                                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${row.rate}%` }} />
                                  </div>
                                  <span className="font-semibold text-emerald-600">{row.rate}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="dash-card">
                    <h3 className="dash-card-title">Coordinator Performance</h3>
                    <p className="dash-card-meta">(This Month)</p>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-500">
                            <th className="pb-2 font-semibold">Name</th>
                            <th className="pb-2 font-semibold">Duties</th>
                            <th className="pb-2 font-semibold">Rate</th>
                            <th className="pb-2 font-semibold">Response</th>
                          </tr>
                        </thead>
                        <tbody>
                          {COORDINATOR_ROWS.map((row) => (
                            <tr key={row.name} className="border-t border-gray-50">
                              <td className="py-2 font-semibold text-gray-800">{row.name}</td>
                              <td className="py-2 text-gray-600">{row.duties}</td>
                              <td className="py-2">
                                <div className="flex items-center gap-1.5">
                                  <div className="h-1.5 w-10 overflow-hidden rounded-full bg-gray-200">
                                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${row.rate}%` }} />
                                  </div>
                                  <span className="font-semibold text-violet-600">{row.rate}%</span>
                                </div>
                              </td>
                              <td className="py-2 text-gray-600">{row.response}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  <section className="dash-card">
                    <div className="flex items-center justify-between">
                      <h3 className="dash-card-title">Escalations & Alerts</h3>
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">12</span>
                    </div>
                    <ul className="mt-3 space-y-2 text-[11px]">
                      {[
                        { t: "Replacement request for duty #DUT-2456", sev: "high" },
                        { t: "Client approval pending for duty #DUT-2453", sev: "medium" },
                        { t: "Payment overdue for invoice #INV-1007", sev: "high" },
                        { t: "Staff documents expiring in 7 days", sev: "medium" },
                      ].map((a) => (
                        <li key={a.t} className="flex gap-2 rounded-lg bg-gray-50 px-2 py-2 text-gray-700">
                          <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${a.sev === "high" ? "bg-red-500" : "bg-amber-500"}`} />
                          {a.t}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="dash-card">
                    <h3 className="dash-card-title">Today&apos;s Snapshot</h3>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        ["Leads Added", "28"],
                        ["Duties Created", "24"],
                        ["Staff Assigned", "33"],
                        ["Duties Completed", "41"],
                        ["Clients Served", "19"],
                        ["New Staff Joined", "4"],
                      ].map(([l, v]) => (
                        <div key={l} className="rounded-lg border border-gray-100 bg-violet-50/50 p-2.5 text-center">
                          <p className="text-lg font-black text-violet-accent">{v}</p>
                          <p className="text-[10px] text-gray-600">{l}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="dash-card">
                    <h3 className="dash-card-title">Top Services (This Month)</h3>
                    <div className="mt-3 space-y-3">
                      {[
                        ["Nursing (ICU / General)", 65],
                        ["Attendant / Caregiver", 48],
                        ["Baby Care / Mother Care", 16],
                        ["Physiotherapist", 12],
                      ].map(([s, p]) => (
                        <div key={String(s)} className="text-[11px]">
                          <div className="mb-1 flex justify-between">
                            <span className="text-gray-700">{s}</span>
                            <span className="font-semibold">{p}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100">
                            <div className="h-2 rounded-full bg-sky-500" style={{ width: `${p}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              <aside className="space-y-5">
                <section className="dash-card">
                  <h3 className="dash-card-title">Quick Actions</h3>
                  <div className="mt-3 space-y-1.5">
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => actionClick(action)}
                        className="flex w-full items-center justify-between rounded-lg border border-gray-100 px-2.5 py-2 text-left text-xs text-gray-700 transition hover:border-violet-200 hover:bg-violet-50/50"
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100 text-violet-accent">
                            <Plus className="h-3.5 w-3.5" />
                          </span>
                          {action}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </section>

                <section className="dash-card">
                  <h3 className="dash-card-title">Recent Activity</h3>
                  <ul className="mt-3 space-y-2.5">
                    {RECENT_ACTIVITY.map((a) => (
                      <li key={a.text} className="border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                        <p className={`text-xs font-medium ${a.tone}`}>{a.text}</p>
                        <p className="text-[10px] text-gray-400">{a.time}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </aside>
            </div>
      </div>
    </div>
  );
}
