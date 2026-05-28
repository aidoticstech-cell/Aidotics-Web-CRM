"use client";

import { Building2, Globe, GitBranch, Users, MapPin, Lightbulb } from "lucide-react";
import { Toggle } from "@/components/ui/FormBits";
import { AsideCard, SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const STRUCTURES = [
  { v: "CENTRAL", title: "Centralized Team", desc: "All teams report to head office", Icon: Building2 },
  { v: "BRANCH", title: "Branch-based Team", desc: "Teams organized by branches", Icon: GitBranch },
  { v: "REGION", title: "Regional Team", desc: "Teams organized by regions", Icon: Globe },
  { v: "CUSTOM", title: "Custom Structure", desc: "Create a custom team structure", Icon: Users },
];

export function StepWorkforceSetup({ data, onChange, footer }: StepProps) {
  const structure = (data.teamStructure as string) || "CENTRAL";

  return (
    <StepLayout
      icon={Users}
      title="Workforce & Roles"
      subtitle="Build your internal team structure, define roles, permissions, and categories."
      tabs={["Workforce", "Role Templates", "Permissions Matrix", "Digital Identity", "Responsibility Mapping"]}
      activeTab={0}
      footer={footer}
      aside={
        <>
          <AsideCard title="Team Structure Preview">
            <ul className="space-y-2 text-xs">
              <li className="font-bold text-violet-accent">Head Office</li>
              {["Operations (6 Staff)", "Sales (7 Staff)", "Accounts (4 Staff)", "Support (3 Staff)", "Field Staff (8 Staff)"].map((d) => (
                <li key={d} className="ml-3 border-l-2 border-violet-100 pl-2 text-gray-700">{d}</li>
              ))}
            </ul>
          </AsideCard>
          <AsideCard title="Workforce Health">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#ede9fe" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="92 100" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-emerald-600">92%</span>
              </div>
              <div className="text-xs text-gray-600">
                <p className="font-bold text-emerald-700">Healthy</p>
                <p>28/30 Active Staff</p>
              </div>
            </div>
          </AsideCard>
          <div className="rounded-xl border border-violet-100 bg-violet-soft/50 p-3 text-[11px] text-gray-600">
            Modify anytime from <strong>Settings → Workforce Management</strong>.
          </div>
        </>
      }
    >
      <SectionBlock letter="A" title="Team Structure">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STRUCTURES.map(({ v, title, desc, Icon }) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange({ teamStructure: v })}
              className={`rounded-xl border-2 p-4 text-left transition ${structure === v ? "border-violet-accent bg-violet-soft/50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <Icon className={`mb-2 h-6 w-6 ${structure === v ? "text-violet-accent" : "text-gray-400"}`} />
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-1 text-xs text-gray-500">{desc}</p>
            </button>
          ))}
        </div>
        <div className="mt-4">
          <Toggle label="Enable Multi-Level Hierarchy" description="Allow departments, branches and sub-teams." checked={data.multiLevel !== false} onChange={(v) => onChange({ multiLevel: v })} />
        </div>
      </SectionBlock>

      <SectionBlock letter="B" title="Role Management">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { n: "12", l: "Active Roles", a: "Manage Roles →" },
            { n: "96", l: "Total Permissions", a: "Manage Permissions →" },
            { n: "28", l: "Staff Members", a: "Manage Staff →" },
          ].map((c) => (
            <div key={c.l} className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
              <p className="text-2xl font-black text-violet-accent">{c.n}</p>
              <p className="text-sm font-semibold text-gray-800">{c.l}</p>
              <button type="button" className="mt-2 text-xs font-semibold text-violet-accent">{c.a}</button>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-xs text-emerald-800">
          Roles and permissions can be fine-tuned in the next step — <strong>Permission Matrix</strong>.
        </div>
      </SectionBlock>

      <SectionBlock letter="C" title="Territories & Locations">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["3 Regions", "8 Branches", "24 Service Areas"].map((t, i) => (
                <div key={t} className="rounded-xl border border-gray-100 p-3 text-center">
                  <p className="text-lg font-black text-gray-900">{t.split(" ")[0]}</p>
                  <p className="text-xs text-gray-500">{t.split(" ").slice(1).join(" ")}</p>
                  <button type="button" className="mt-1 text-[10px] font-semibold text-violet-accent">Manage →</button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Toggle label="Enable Location-based Assignment" checked={data.locationAssign !== false} onChange={(v) => onChange({ locationAssign: v })} />
            </div>
          </div>
          <div className="relative h-40 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-sky-50 to-emerald-50">
            <MapPin className="absolute left-1/4 top-1/3 h-5 w-5 text-violet-accent" />
            <MapPin className="absolute right-1/3 top-1/2 h-5 w-5 text-violet-accent" />
            <div className="absolute left-1/3 top-1/4 h-16 w-16 rounded-full border-2 border-violet-300/40 bg-violet-200/20" />
            <div className="absolute right-1/4 bottom-1/4 h-20 w-20 rounded-full border-2 border-violet-300/40 bg-violet-200/20" />
          </div>
        </div>
      </SectionBlock>

      <SectionBlock letter="D" title="Working Locations">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Office", "Field", "Hybrid", "Remote"].map((loc, i) => (
              <label key={loc} className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-gray-200 p-3 has-[:checked]:border-violet-accent has-[:checked]:bg-violet-soft/40">
                <input type="checkbox" defaultChecked={i < 3} className="accent-violet-accent" />
                <span className="text-xs font-semibold">{loc}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 rounded-xl border border-sky-100 bg-sky-50/80 p-3">
            <Lightbulb className="h-5 w-5 shrink-0 text-sky-600" />
            <p className="text-xs text-sky-900">Staff assigned by availability, skills and location.</p>
          </div>
        </div>
      </SectionBlock>
    </StepLayout>
  );
}
