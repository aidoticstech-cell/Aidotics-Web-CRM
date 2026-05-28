"use client";

import { Users, Pencil, Trash2, Plus } from "lucide-react";
import { AsideCard, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const TEAM_ROWS = [
  { name: "Rahul Sharma", role: "Operations Manager", dept: "Operations", manager: "Owner", email: "rahul.sharma@hh.in", phone: "98765 43210" },
  { name: "Neha Patel", role: "Coordinator", dept: "Operations", manager: "Rahul Sharma", email: "neha.patel@hh.in", phone: "98765 43211" },
  { name: "Amit Verma", role: "HR Executive", dept: "HR", manager: "Owner", email: "amit.verma@hh.in", phone: "98765 43212" },
  { name: "Pooja Singh", role: "Accountant", dept: "Finance", manager: "Owner", email: "pooja.singh@hh.in", phone: "98765 43213" },
  { name: "Vikram Yadav", role: "Telecaller", dept: "Sales", manager: "Neha Patel", email: "vikram.yadav@hh.in", phone: "98765 43214" },
];

const CATEGORIES = [
  { label: "Registered Nurse (RN)", staff: "128" },
  { label: "ICU Nurse", staff: "64" },
  { label: "General Duty Assistant (GDA)", staff: "210" },
  { label: "Caregiver / Attendant", staff: "185" },
  { label: "Baby Care / Nanny", staff: "72" },
  { label: "Physiotherapist", staff: "36" },
  { label: "Elder Care", staff: "54" },
];

export function StepWorkforceSetup({ data, onChange, footer }: StepProps) {
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
            <ul className="space-y-2 text-xs text-gray-700">
              {[
                "Organized Team Structure",
                "Role Based Access",
                "Digital Identity",
                "Clear Responsibilities",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 text-violet-accent">◎</span>
                  {item}
                </li>
              ))}
            </ul>
          </AsideCard>
          <AsideCard title="Quick Tips">
            <ul className="space-y-2 text-xs text-gray-700">
              {[
                "Add internal team members who will use CRM",
                "Create custom roles if defaults don’t fit",
                "Use permissions matrix to control module access",
                "You can update and invite more users later",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 text-emerald-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </AsideCard>
          <AsideCard title="Need help setting this up?">
            <p className="text-xs text-gray-600">Our onboarding expert can help you configure this step quickly.</p>
            <button type="button" className="btn-outline-purple mt-3 w-full !py-2 text-xs">Schedule a Call</button>
          </AsideCard>
        </>
      }
    >
      <section className="rounded-xl border border-gray-100 p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Internal Team & Workforce</h3>
            <p className="mt-1 text-xs text-gray-500">Add your internal team members and operational staff.</p>
          </div>
          <button type="button" className="btn-outline-purple !py-1.5 text-xs">+ Add Team Member</button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role / Position</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Reporting Manager</th>
                <th className="px-4 py-3">Email / Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {TEAM_ROWS.map((row) => (
                <tr key={row.email} className="border-t border-gray-100 bg-white">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-900">{row.name}</p>
                    <p className="text-[11px] text-gray-500">ID: EMP{row.phone.slice(-4)}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded bg-violet-soft px-2 py-0.5 text-[11px] font-semibold text-violet-deep">{row.role}</span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-700">{row.dept}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">{row.manager}</span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-700">
                    <p className="text-xs">{row.email}</p>
                    <p className="text-xs">{row.phone}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Active</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button type="button" className="mr-1 inline-flex rounded-lg p-2 text-violet-accent hover:bg-violet-soft" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" className="inline-flex rounded-lg p-2 text-violet-accent hover:bg-violet-soft" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">Showing 1 to 5 of 12 team members</p>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-100 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Workforce Categories</h3>
              <p className="mt-1 text-xs text-gray-500">Define the types of field workforce you manage.</p>
            </div>
            <button type="button" className="btn-outline-purple !py-1.5 text-xs"><Plus className="mr-1 h-3 w-3" />Add Category</button>
          </div>
          <div className="space-y-2">
            {CATEGORIES.map((c) => (
              <div key={c.label} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/70 px-3 py-2 text-sm">
                <span className="font-medium text-gray-800">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-violet-soft px-2 py-0.5 text-[11px] font-semibold text-violet-deep">{c.staff} Staff</span>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Active</span>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="mt-3 text-xs font-semibold text-violet-accent">Manage All Categories →</button>
        </section>

        <section className="rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-900">Team Summary</h3>
          <p className="mt-1 text-xs text-gray-500">Overview of your internal team.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { n: "32", l: "Total Team Members" },
              { n: "7", l: "Departments" },
              { n: "5", l: "Reporting Levels" },
            ].map((item) => (
              <div key={item.l} className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                <p className="text-lg font-black text-violet-accent">{item.n}</p>
                <p className="text-[11px] text-gray-500">{item.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-gray-100 bg-white p-3">
            <p className="text-xs font-semibold text-gray-700">Team Distribution by Department</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="h-24 w-24 rounded-full border-[10px] border-violet-500 border-r-sky-400 border-b-amber-400 border-l-emerald-400" />
              <ul className="space-y-1 text-xs text-gray-600">
                <li>Operations: 14 (43%)</li>
                <li>HR: 6 (19%)</li>
                <li>Finance: 4 (12%)</li>
                <li>Sales: 6 (19%)</li>
                <li>Others: 2 (7%)</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </StepLayout>
  );
}
