"use client";

import { Lock, Plus } from "lucide-react";
import { Toggle } from "@/components/ui/FormBits";
import { SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
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
