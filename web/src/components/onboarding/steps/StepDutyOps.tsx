"use client";

import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import { FormModal } from "@/components/onboarding/FormModal";
import { StepToast } from "@/components/onboarding/StepToast";
import { StepLayout } from "@/components/onboarding/StepLayout";
import { newOnboardingId } from "@/lib/onboarding-id";
import type { StepProps } from "./types";

type DutyRole = { id: string; name: string; assignable: boolean };

const DUTY_TYPES = [
  "8 Hours Duty",
  "12 Hours Duty",
  "24 Hours Duty",
  "Night Shift",
  "Day Shift",
  "Live-in / Long Term",
  "One Time Visit",
  "Others",
];

const DEFAULT_DUTY_SELECTION = [
  "8 Hours Duty",
  "12 Hours Duty",
  "24 Hours Duty",
  "Night Shift",
  "Day Shift",
  "Live-in / Long Term",
];

const DEFAULT_ROLES: DutyRole[] = [
  { id: "1", name: "Nurse (RN)", assignable: true },
  { id: "2", name: "ICU Nurse", assignable: true },
  { id: "3", name: "Caregiver / Attendant", assignable: true },
];

const VISIBILITY_FIELDS = [
  "Duty Amount",
  "Client Name",
  "Patient Condition",
  "Location / Address",
  "Shift & Duration",
  "Special Instructions",
  "Contact Number",
  "Advance Payment",
];

export function StepDutyOps({ data, onChange, footer }: StepProps) {
  const dutyTypes = (data.dutyTypes as string[]) || DEFAULT_DUTY_SELECTION;
  const roles = (data.dutyRoles as DutyRole[])?.length ? (data.dutyRoles as DutyRole[]) : DEFAULT_ROLES;
  const visibility = (data.dutyVisibility as string[]) || VISIBILITY_FIELDS;
  const [tab, setTab] = useState(0);
  const [roleModal, setRoleModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function addRole() {
    if (!roleName.trim()) return;
    onChange({ dutyRoles: [...roles, { id: newOnboardingId(), name: roleName.trim(), assignable: true }] });
    setRoleName("");
    setRoleModal(false);
    showToast("Custom role added.");
  }

  function toggleVisibility(field: string) {
    const next = visibility.includes(field) ? visibility.filter((f) => f !== field) : [...visibility, field];
    onChange({ dutyVisibility: next });
  }

  return (
    <>
      <StepToast message={toast} />
      <FormModal open={roleModal} title="Add Custom Role" onClose={() => setRoleModal(false)} onSubmit={addRole}>
        <Field label="Role / Category Name" required>
          <input className="crm-input" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
        </Field>
      </FormModal>
      <StepLayout
      icon={CalendarClock}
      title="Duty Operations Engine"
      subtitle="Configure how duties are created, assigned, broadcasted and executed in your bureau."
      tabs={["Duty & Role Preferences", "Broadcast Engine", "Client Approval Flow", "Escalation Rules", "Communication Settings"]}
      activeTab={tab}
      onTabChange={setTab}
      footer={footer}
    >
      <div className="mt-2">
        <div className="mt-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-xl border border-gray-100 p-4 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">A.</span> Workforce Roles for Duty</h3>
                  <p className="mt-1 text-xs text-gray-500">Select the roles that can be assigned for duties and set basic preferences.</p>
                </div>
                <button type="button" className="btn-outline-purple !py-1.5 text-xs" onClick={() => setRoleModal(true)}>+ Add Custom Role</button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-3 py-2.5">Role / Category</th>
                      <th className="px-3 py-2.5">Can be Assigned</th>
                      <th className="px-3 py-2.5">Default Shift Options</th>
                      <th className="px-3 py-2.5">Min Experience</th>
                      <th className="px-3 py-2.5">Min Rating</th>
                      <th className="px-3 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role.id} className="border-t border-gray-100 bg-white">
                        <td className="px-3 py-2.5 text-xs font-semibold text-gray-800">{role.name}</td>
                        <td className="px-3 py-2.5">
                          <input
                            type="checkbox"
                            className="accent-violet-accent"
                            checked={role.assignable}
                            onChange={() => onChange({ dutyRoles: roles.map((r) => (r.id === role.id ? { ...r, assignable: !r.assignable } : r)) })}
                          />
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-600">8 Hours, 12 Hours, 24 Hours</td>
                        <td className="px-3 py-2.5 text-xs text-gray-600">1 Year</td>
                        <td className="px-3 py-2.5 text-xs text-gray-600">3.5 ★</td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            type="button"
                            className="inline-flex rounded p-1 text-red-500 hover:bg-red-50"
                            onClick={() => { onChange({ dutyRoles: roles.filter((r) => r.id !== role.id) }); showToast("Role removed."); }}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11px] text-gray-500">Roles marked as “Can Be Assigned” will be available while creating duties and broadcast.</p>
            </section>

            <section className="rounded-xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">C.</span> Duty Types</h3>
              <p className="mt-1 text-xs text-gray-500">Enable duty types you offer.</p>
              <div className="mt-3 space-y-2">
                {DUTY_TYPES.map((t) => {
                  const on = dutyTypes.includes(t);
                  return (
                    <label key={t} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => {
                          const next = on ? dutyTypes.filter((x) => x !== t) : [...dutyTypes, t];
                          onChange({ dutyTypes: next });
                        }}
                        className="accent-violet-accent"
                      />
                      <span className="text-gray-700">{t}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <section className="rounded-xl border border-gray-100 p-4 lg:col-span-2">
              <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">B.</span> Duty Information Visibility</h3>
              <p className="mt-1 text-xs text-gray-500">Choose what information will be visible to assigned staff during broadcast.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {VISIBILITY_FIELDS.map((item) => (
                  <label key={item} className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2 text-xs">
                    <span className="text-gray-700">{item}</span>
                    <input type="checkbox" className="accent-violet-accent" checked={visibility.includes(item)} onChange={() => toggleVisibility(item)} />
                  </label>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-gray-500">Masked contact number will show only last 4 digits to staff before acceptance.</p>
            </section>

            <section className="rounded-xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">D.</span> Duty Price & Margin Settings</h3>
              <p className="mt-1 text-xs text-gray-500">Set default pricing preference.</p>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  { v: "fixed", t: "Bureau Fixed Price", d: "Set standard price and staff will see the same." },
                  { v: "range", t: "Price Range", d: "Show min - max range to staff." },
                  { v: "hidden", t: "Hide Price", d: "Hide price from staff before approval." },
                ].map((item) => (
                  <label key={item.v} className="flex cursor-pointer items-start gap-2 rounded-lg border border-gray-100 bg-gray-50/70 px-3 py-2">
                    <input
                      type="radio"
                      name="priceModel"
                      className="mt-0.5 accent-violet-accent"
                      checked={((data.priceModel as string) || "fixed") === item.v}
                      onChange={() => onChange({ priceModel: item.v })}
                    />
                    <span>
                      <span className="block font-semibold text-gray-800">{item.t}</span>
                      <span className="mt-0.5 block text-[11px] text-gray-500">{item.d}</span>
                    </span>
                  </label>
                ))}
              </div>
              <Field label="Default Bureau Margin (%)">
                <input className="crm-input" value={(data.defaultMargin as string) || "15"} onChange={(e) => onChange({ defaultMargin: e.target.value })} />
              </Field>
            </section>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Acceptance Timer">
              <input className="crm-input" value={(data.acceptanceTimer as string) || "30"} onChange={(e) => onChange({ acceptanceTimer: e.target.value })} />
            </Field>
            <Field label="Search Radius (KM)">
              <input className="crm-input" value={(data.searchRadius as string) || "15"} onChange={(e) => onChange({ searchRadius: e.target.value })} />
            </Field>
            <Field label="Client Approval">
              <select className="crm-select" value={(data.clientApproval as string) || "mandatory"} onChange={(e) => onChange({ clientApproval: e.target.value })}>
                <option value="mandatory">Mandatory</option>
                <option value="optional">Optional</option>
                <option value="none">Not Required</option>
              </select>
            </Field>
            <Field label="Escalation">
              <select className="crm-select" value={(data.escalation as string) || "enabled"} onChange={(e) => onChange({ escalation: e.target.value })}>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </Field>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "smartMatching", l: "Smart Matching" },
              { k: "availabilityFilter", l: "Availability Filter" },
              { k: "priorityStaff", l: "Priority Staff First" },
              { k: "limitAcceptances", l: "Limit Acceptances" },
            ].map((item) => (
              <label key={item.k} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2 text-xs">
                <span>{item.l}</span>
                <input
                  type="checkbox"
                  className="accent-violet-accent"
                  checked={(data[item.k as keyof typeof data] as boolean | undefined) !== false}
                  onChange={(e) => onChange({ [item.k]: e.target.checked })}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </StepLayout>
    </>
  );
}
