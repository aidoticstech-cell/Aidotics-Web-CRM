"use client";

import { UserCog, Plus, Pencil, Building2 } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import { SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const ROLES = [
  { name: "Operations Executive", desc: "Manages daily operations", staff: 6 },
  { name: "Coordinator", desc: "Coordinates duties and staff", staff: 8 },
  { name: "Staff Member", desc: "Field healthcare staff", staff: 28 },
  { name: "Field Staff", desc: "On-ground service delivery", staff: 12 },
  { name: "Accounts Executive", desc: "Handles billing and payments", staff: 4 },
];

const MATRIX = [
  { role: "Operations Executive", reports: "Coordinator", duties: true, payments: false, reports_access: true },
  { role: "Coordinator", reports: "Operations Manager", duties: true, payments: true, reports_access: true },
  { role: "Staff Member", reports: "Coordinator", duties: false, payments: false, reports_access: false },
  { role: "Accounts Executive", reports: "Owner / Director", duties: false, payments: true, reports_access: true },
];

export function StepTeamRoles({ footer }: StepProps) {
  return (
    <StepLayout
      icon={UserCog}
      title="Team Structure & Roles"
      subtitle="Define organization hierarchy, roles and reporting lines."
      footer={footer}
    >
      <SectionBlock letter="A" title="Organization Hierarchy">
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-6 text-center">
          <div className="mx-auto inline-block rounded-xl border-2 border-violet-accent bg-white px-6 py-3 shadow-sm">
            <Building2 className="mx-auto h-5 w-5 text-violet-accent" />
            <p className="mt-1 text-sm font-bold">Head Office</p>
            <p className="text-xs text-gray-500">1 Location</p>
          </div>
          <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-3">
            {["Operations (6)", "Sales (7)", "Accounts (4)"].map((d) => (
              <div key={d} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold">{d}</div>
            ))}
          </div>
          <div className="mx-auto mt-4 flex flex-wrap justify-center gap-2">
            {["Branch A (24)", "Branch B (18)", "Branch C (15)"].map((b) => (
              <div key={b} className="rounded-lg bg-violet-soft px-3 py-1.5 text-[11px] font-semibold text-violet-deep">{b}</div>
            ))}
          </div>
        </div>
        <button type="button" className="btn-outline-purple mt-4 !py-2 text-xs">
          <Plus className="mr-1 inline h-4 w-4" /> Add Department / Branch
        </button>
      </SectionBlock>

      <SectionBlock letter="B" title="Role Definition" action={<button type="button" className="btn-outline-purple !py-1.5 text-xs"><Plus className="mr-1 inline h-3 w-3" />Add New Role</button>}>
        <div className="space-y-2">
          {ROLES.map((r) => (
            <div key={r.name} className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-soft text-violet-accent">
                <UserCog className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{r.name}</p>
                <p className="text-xs text-gray-500">{r.desc} · {r.staff} staff</p>
              </div>
              <button type="button" className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-violet-accent"><Pencil className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock letter="C" title="Reporting & Approval Matrix">
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase text-gray-500">
              <tr>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Reports To</th>
                <th className="px-3 py-3 text-center">Approve Duties</th>
                <th className="px-3 py-3 text-center">Approve Payments</th>
                <th className="px-3 py-3 text-center">Access Reports</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row.role} className="border-t border-gray-100">
                  <td className="px-3 py-2.5 font-medium">{row.role}</td>
                  <td className="px-3 py-2.5">
                    <select className="crm-select !py-1.5 text-xs" defaultValue={row.reports}>
                      <option>Coordinator</option>
                      <option>Operations Manager</option>
                      <option>Owner / Director</option>
                    </select>
                  </td>
                  {[row.duties, row.payments, row.reports_access].map((ok, i) => (
                    <td key={i} className="px-3 py-2.5 text-center text-lg">{ok ? "✓" : "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionBlock>

      <SectionBlock letter="D" title="Role Permissions Template">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Select Template">
            <select className="crm-select" defaultValue="standard">
              <option value="standard">Standard Bureau Template</option>
              <option value="strict">Strict Access Template</option>
            </select>
          </Field>
          <div className="flex items-end">
            <button type="button" className="btn-outline-purple w-full !py-2.5 text-sm">Preview Template</button>
          </div>
        </div>
        <p className="mt-3 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2 text-xs text-sky-900">
          Template includes recommended permissions for healthcare bureaus.
        </p>
      </SectionBlock>
    </StepLayout>
  );
}
