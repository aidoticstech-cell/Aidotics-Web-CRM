"use client";

import { Lock, Plus } from "lucide-react";
import { Toggle } from "@/components/ui/FormBits";
import { AsideCard, SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const MODULES = [
  { module: "Dashboard & Reports", features: "View analytics, export reports", access: "full" },
  { module: "Client Management", features: "Manage clients, bookings", access: "rw" },
  { module: "Payment Collection", features: "Invoices, receipts, dues", access: "rw" },
  { module: "Staff & Roles", features: "Staff roster, assignments", access: "rw" },
  { module: "Workflows", features: "Duty workflows, automation", access: "full" },
  { module: "Automation", features: "Rules, triggers, alerts", access: "read" },
  { module: "Documents", features: "KYC, contracts, files", access: "read" },
  { module: "Settings", features: "System configuration", access: "none" },
  { module: "Audit Logs", features: "Activity and change logs", access: "read" },
  { module: "Integrations", features: "Partner APIs, webhooks", access: "none" },
];

const ACCESS = [
  { key: "full", label: "Full Access", color: "text-emerald-600" },
  { key: "rw", label: "Read / Write", color: "text-sky-600" },
  { key: "read", label: "Read Only", color: "text-amber-600" },
  { key: "none", label: "No Access", color: "text-red-500" },
];

export function StepPermissionMatrix({ data, onChange, footer }: StepProps) {
  const role = (data.role as string) || "Coordinator";

  return (
    <StepLayout
      icon={Lock}
      title="Permission Matrix"
      subtitle="Define role-based access to modules and features."
      footer={footer}
      aside={
        <>
          <AsideCard title="Role Permission Summary">
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#ede9fe" strokeWidth="4" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="25 100" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-25" />
              </svg>
              <span className="absolute text-center text-xs font-black">
                <span className="block text-lg text-violet-accent">26</span>
                Total Features
              </span>
            </div>
            <ul className="mt-4 space-y-1 text-xs">
              <li className="flex justify-between"><span className="text-emerald-600">Full Access</span><span>6</span></li>
              <li className="flex justify-between"><span className="text-sky-600">Read / Write</span><span>5</span></li>
              <li className="flex justify-between"><span className="text-amber-600">Read Only</span><span>4</span></li>
              <li className="flex justify-between"><span className="text-red-500">No Access</span><span>11</span></li>
            </ul>
          </AsideCard>
          <AsideCard title="Quick View by Module">
            <ul className="space-y-2 text-xs">
              {MODULES.slice(0, 6).map((m) => (
                <li key={m.module} className="flex justify-between gap-2">
                  <span className="truncate text-gray-700">{m.module}</span>
                  <span className={`shrink-0 font-semibold ${ACCESS.find((a) => a.key === m.access)?.color}`}>
                    {ACCESS.find((a) => a.key === m.access)?.label.split(" ")[0]}
                  </span>
                </li>
              ))}
            </ul>
          </AsideCard>
          <div className="rounded-xl border border-violet-100 bg-violet-soft/50 p-3 text-[11px]">
            Update permissions anytime from <strong>Settings → Roles & Permissions</strong>.
          </div>
        </>
      }
    >
      <SectionBlock
        letter="A"
        title="Select Role"
        action={
          <button type="button" className="btn-outline-purple !py-1.5 text-xs">
            <Plus className="mr-1 inline h-3 w-3" /> Add Custom Role
          </button>
        }
      >
        <select className="crm-select max-w-xs" value={role} onChange={(e) => onChange({ role: e.target.value })}>
          <option>Coordinator</option>
          <option>Operations Executive</option>
          <option>Accounts Executive</option>
          <option>Telecaller</option>
        </select>
      </SectionBlock>

      <SectionBlock letter="B" title="Module & Feature Permissions">
        <div className="mb-4 flex flex-wrap gap-4 text-[10px] font-semibold">
          {ACCESS.map((a) => (
            <span key={a.key} className={a.color}>● {a.label}</span>
          ))}
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase text-gray-500">
              <tr>
                <th className="px-3 py-3">Module</th>
                <th className="px-3 py-3">Features</th>
                {ACCESS.map((a) => (
                  <th key={a.key} className="px-2 py-3 text-center">{a.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((row) => (
                <tr key={row.module} className="border-t border-gray-100">
                  <td className="px-3 py-2.5 font-semibold">{row.module}</td>
                  <td className="px-3 py-2.5 text-gray-500">{row.features}</td>
                  {ACCESS.map((a) => (
                    <td key={a.key} className="px-2 py-2.5 text-center">
                      <input type="radio" name={`perm-${row.module}`} defaultChecked={row.access === a.key} className="accent-violet-accent" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionBlock>

      <SectionBlock letter="C" title="Advanced Permissions">
        <div className="grid gap-3 md:grid-cols-3">
          <Toggle label="Data Export" description="Allow export of client and report data." checked={data.dataExport !== false} onChange={(v) => onChange({ dataExport: v })} />
          <Toggle label="Bulk Operations" description="Allow bulk actions on records." checked={data.bulkOps !== false} onChange={(v) => onChange({ bulkOps: v })} />
          <Toggle label="Delete Records" description="Allow deletion of records." checked={!!data.deleteRecords} onChange={(v) => onChange({ deleteRecords: v })} />
        </div>
      </SectionBlock>
    </StepLayout>
  );
}
