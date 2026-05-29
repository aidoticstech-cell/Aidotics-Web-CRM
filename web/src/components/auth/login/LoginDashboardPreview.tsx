"use client";

import { LayoutDashboard, Users, BriefcaseMedical, Wallet } from "lucide-react";

const NAV = [
  { label: "Dashboard", active: true },
  { label: "Leads" },
  { label: "Clients & Patients" },
  { label: "Caregivers" },
  { label: "Duties" },
  { label: "Payments" },
  { label: "Communication" },
  { label: "Reports & Analytics" },
  { label: "Documents" },
  { label: "Settings" },
];

export function LoginDashboardPreview() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-8 z-0 hidden w-[min(920px,95vw)] -translate-x-[42%] rotate-[-8deg] select-none lg:block xl:-translate-x-[38%]"
    >
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_40px_100px_-20px_rgba(76,45,120,0.35)]">
        <div className="flex min-h-[480px]">
          <aside className="w-[200px] shrink-0 bg-[#0c1231] p-3 text-white">
            <p className="text-[10px] font-bold tracking-wider text-white/60">AIDOTICS CRM</p>
            <nav className="mt-4 space-y-0.5">
              {NAV.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-medium ${
                    item.active ? "bg-violet-600 text-white" : "text-white/70"
                  }`}
                >
                  <LayoutDashboard className="h-3 w-3 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </nav>
          </aside>
          <div className="flex-1 bg-[#f3f5fb] p-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total Clients", value: "1,248", delta: "+12%" },
                { label: "Active Duties", value: "832", delta: "+8%" },
                { label: "Caregivers", value: "620", delta: "+5%" },
              ].map((k) => (
                <div key={k.label} className="rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm">
                  <p className="text-[9px] text-gray-500">{k.label}</p>
                  <p className="text-lg font-black text-gray-900">{k.value}</p>
                  <p className="text-[9px] font-semibold text-emerald-600">{k.delta}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              <div className="col-span-3 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm">
                <p className="text-[10px] font-bold text-gray-800">Duties Overview</p>
                <div className="mt-3 flex h-24 items-end gap-1">
                  {[40, 55, 48, 70, 62, 80, 74].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-violet-400/80" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="col-span-2 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm">
                <p className="text-[10px] font-bold text-gray-800">Recent Activities</p>
                <ul className="mt-2 space-y-1.5 text-[8px] text-gray-600">
                  <li className="flex gap-1">
                    <Users className="h-2.5 w-2.5 text-violet-600" /> New lead assigned
                  </li>
                  <li className="flex gap-1">
                    <BriefcaseMedical className="h-2.5 w-2.5 text-sky-600" /> Duty completed
                  </li>
                  <li className="flex gap-1">
                    <Wallet className="h-2.5 w-2.5 text-amber-600" /> Payment received
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <div className="w-[140px] rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
                <p className="text-[9px] font-bold text-gray-800">Top Services</p>
                <div className="mx-auto mt-2 h-14 w-14 rounded-full border-[6px] border-violet-500 border-r-sky-400 border-b-amber-400 border-l-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
