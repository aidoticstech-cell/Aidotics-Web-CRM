"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserRound,
  BriefcaseMedical,
  ClipboardCheck,
  IndianRupee,
  Wallet,
  Search,
  Bell,
  CircleUserRound,
  Plus,
  ArrowRight,
  CircleDot,
} from "lucide-react";
import { AidoticsLogo } from "@/components/brand/AidoticsLogo";
import { getMe, logout, type AuthUser } from "@/lib/auth-api";

const KPI_CARDS = [
  { title: "Total Leads", value: "128", hint: "+18% vs yesterday", Icon: Users, tone: "bg-violet-100 text-violet-700" },
  { title: "Active Duties", value: "156", hint: "+12% vs yesterday", Icon: BriefcaseMedical, tone: "bg-sky-100 text-sky-700" },
  { title: "Active Workforce", value: "312", hint: "+8% vs yesterday", Icon: ClipboardCheck, tone: "bg-emerald-100 text-emerald-700" },
  { title: "Revenue Today", value: "₹1,48,750", hint: "+22% vs yesterday", Icon: IndianRupee, tone: "bg-amber-100 text-amber-700" },
  { title: "Revenue This Month", value: "₹24,68,450", hint: "+14% vs last month", Icon: Wallet, tone: "bg-cyan-100 text-cyan-700" },
  { title: "Pending Payments", value: "₹6,72,300", hint: "24 invoices", Icon: Wallet, tone: "bg-rose-100 text-rose-700" },
];

const SIDEBAR_ITEMS = [
  "Dashboard",
  "Leads",
  "Clients & Patients",
  "Workforce",
  "Duties",
  "Attendance & Leave",
  "Finance",
  "Operations Center",
  "Partner Network",
  "Reports & Analytics",
  "Administration",
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<(AuthUser & { bureauName?: string }) | null>(null);

  useEffect(() => {
    getMe()
      .then((r) => setUser(r.user))
      .catch(() => router.replace("/login"));
  }, [router]);

  if (!user) {
    return <div className="state-center min-h-screen text-sm text-gray-500">Loading dashboard…</div>;
  }

  return (
    <div className="min-h-screen bg-[#f3f5fb]">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[240px_1fr_270px]">
        <aside className="bg-[#0c1231] text-white">
          <div className="border-b border-white/10 px-4 py-4">
            <AidoticsLogo height={36} onDarkSurface />
            <p className="mt-2 text-[11px] font-semibold tracking-wide text-white/70">BUREAU WEB CRM</p>
          </div>
          <div className="space-y-1 p-2.5">
            {SIDEBAR_ITEMS.map((item, idx) => (
              <button
                key={item}
                type="button"
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] font-medium ${
                  idx === 0 ? "bg-violet-600 text-white" : "text-white/80 hover:bg-white/10"
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                {item}
              </button>
            ))}
          </div>
          <div className="mt-6 p-2.5">
            <div className="rounded-xl bg-gradient-to-br from-violet-700 to-indigo-500 p-3.5">
              <p className="text-xs font-semibold">Need Staff Urgently?</p>
              <p className="mt-1 text-[11px] text-white/80">Broadcast your requirement to available staff quickly.</p>
              <button type="button" className="btn-primary mt-4 !w-full !bg-white !py-2 !text-xs !text-violet-700">
                + Create Duty
              </button>
            </div>
          </div>
        </aside>

        <main className="space-y-5 p-4 lg:p-6">
          <header className="dash-card flex flex-wrap items-center justify-between gap-4 !p-5">
            <div className="min-w-0">
              <p className="page-eyebrow">Welcome back, {user.fullName.split(" ")[0]}</p>
              <h1 className="page-title mt-1 !text-3xl">Owner Dashboard</h1>
              <p className="page-subtitle !mt-1">Overview of your bureau operations and business performance</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs">May 12, 2025</button>
              <button type="button" className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs">All Branches</button>
              <button type="button" className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500"><Search className="h-4 w-4" /></button>
              <button type="button" className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500"><Bell className="h-4 w-4" /></button>
              <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700">
                <CircleUserRound className="h-4 w-4" />
                {user.bureauName || user.email}
              </span>
              <button
                type="button"
                className="btn-secondary !py-2 text-xs"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                Sign out
              </button>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {KPI_CARDS.map(({ title, value, hint, Icon, tone }) => (
              <div key={title} className="dash-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="page-eyebrow !text-[10px]">{title}</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{value}</p>
                    <p className="mt-1 text-xs text-gray-500">{hint}</p>
                  </div>
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </section>

          <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <section className="dash-card lg:col-span-1">
                  <h3 className="dash-card-title">Lead Funnel</h3>
                  <p className="dash-card-meta">(This Month)</p>
                  <div className="mt-4 space-y-2.5">
                    {[
                      ["New Leads", "458"],
                      ["Qualified", "262"],
                      ["Requirement Discussion", "168"],
                      ["Proposal / Quotation", "96"],
                      ["Converted", "68"],
                    ].map(([label, val]) => (
                      <div key={label} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-semibold text-gray-900">{val}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="dash-card">
                  <h3 className="dash-card-title">Duty Status (Live)</h3>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-[12px] border-emerald-500 border-r-blue-500 border-b-amber-400 border-l-rose-400 text-4xl font-black text-gray-900">
                      156
                    </div>
                  </div>
                </section>

                <section className="dash-card">
                  <h3 className="dash-card-title">Workforce Availability</h3>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-[12px] border-blue-500 border-r-emerald-500 border-b-amber-400 border-l-rose-400 text-4xl font-black text-gray-900">
                      312
                    </div>
                  </div>
                </section>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="dash-card">
                  <h3 className="dash-card-title">Revenue Overview</h3>
                  <div className="mt-4 h-36 rounded-xl bg-gradient-to-b from-violet-50 to-white p-2">
                    <div className="h-full w-full rounded border border-dashed border-violet-200" />
                  </div>
                </section>
                <section className="dash-card">
                  <h3 className="dash-card-title">Branch Performance</h3>
                  <div className="mt-4 space-y-2.5">
                    {[
                      ["Noida (HQ)", "₹10,24,850", "94%"],
                      ["Gurgaon", "₹6,45,300", "92%"],
                      ["Delhi", "₹4,32,600", "90%"],
                      ["Faridabad", "₹2,78,250", "88%"],
                    ].map(([b, rev, rate]) => (
                      <div key={b} className="flex items-center justify-between rounded-lg bg-gray-50 px-2 py-1.5 text-xs">
                        <span className="font-semibold text-gray-700">{b}</span>
                        <span>{rev}</span>
                        <span className="font-semibold text-emerald-600">{rate}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <section className="dash-card">
                  <h3 className="dash-card-title">Escalations & Alerts</h3>
                  <ul className="mt-4 space-y-2.5 text-xs">
                    {[
                      "Replacement request for duty #DUT-2456",
                      "Client approval pending for duty #DUT-2453",
                      "Payment overdue for invoice #INV-1007",
                      "Staff documents expiring in 7 days",
                    ].map((a) => (
                      <li key={a} className="rounded-lg bg-gray-50 px-2 py-1.5 text-gray-700">{a}</li>
                    ))}
                  </ul>
                </section>
                <section className="dash-card">
                  <h3 className="dash-card-title">Today&apos;s Snapshot</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      ["Leads Added", "28"],
                      ["Duties Created", "24"],
                      ["Staff Assigned", "33"],
                      ["Duties Completed", "41"],
                    ].map(([l, v]) => (
                      <div key={l} className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className="text-lg font-black text-violet-accent">{v}</p>
                        <p className="text-[11px] text-gray-600">{l}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="dash-card">
                  <h3 className="dash-card-title">Top Services</h3>
                  <div className="mt-4 space-y-3">
                    {[
                      ["Nursing (ICU / General)", 65],
                      ["Attendant / Caregiver", 48],
                      ["Baby Care / Mother Care", 16],
                      ["Physiotherapist", 12],
                    ].map(([s, p]) => (
                      <div key={String(s)} className="text-xs">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-gray-700">{s}</span>
                          <span className="font-semibold text-gray-900">{p}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-200">
                          <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${p}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <aside className="space-y-4">
              <section className="dash-card">
                <h3 className="dash-card-title">Quick Actions</h3>
                <div className="mt-4 space-y-2">
                  {[
                    "Add New Lead",
                    "Create Duty",
                    "Add Workforce",
                    "Generate Invoice",
                    "Broadcast Duty",
                    "View Live Duties",
                    "Approve Staff",
                    "Send Notification",
                  ].map((action) => (
                    <button key={action} type="button" className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                      <span className="inline-flex items-center gap-2"><Plus className="h-3.5 w-3.5 text-violet-accent" />{action}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </section>

              <section className="dash-card">
                <h3 className="dash-card-title">Recent Activity</h3>
                <div className="mt-4 space-y-2.5 text-xs">
                  {[
                    "Duty #DUT-2451 completed",
                    "Payment received ₹2,500",
                    "New lead added",
                    "Staff accepted duty",
                    "Invoice #INV-1090 generated",
                  ].map((activity) => (
                    <div key={activity} className="flex items-start gap-2 rounded-lg bg-gray-50 px-2 py-1.5">
                      <CircleDot className="mt-0.5 h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-gray-700">{activity}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section className="dash-card">
                <h3 className="dash-card-title">Need Help?</h3>
                <p className="dash-card-meta">Our onboarding team is here to help you at every step.</p>
                <button type="button" className="btn-outline-purple mt-4 w-full !py-2.5 text-xs">
                  Schedule a Call
                </button>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
