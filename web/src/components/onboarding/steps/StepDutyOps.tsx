"use client";

import { CalendarClock, CircleHelp } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import type { StepProps } from "./types";

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

export function StepDutyOps({ data, onChange, footer }: StepProps) {
  const dutyTypes = (data.dutyTypes as string[]) || DEFAULT_DUTY_SELECTION;

  return (
    <div>
      <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
        <div>
          <div className="flex items-start gap-3">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-soft sm:flex">
            <CalendarClock className="h-6 w-6 text-violet-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Duty Operations Engine</h1>
            <p className="mt-1 text-sm text-gray-500">Configure how duties are created, assigned, broadcasted and executed in your bureau.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {["Duty & Role Preferences", "Broadcast Engine", "Client Approval Flow", "Escalation Rules", "Communication Settings"].map((tab, idx) => (
            <span
              key={tab}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-semibold ${
                idx === 0 ? "border-violet-accent bg-violet-soft text-violet-deep" : "border-gray-200 bg-white text-gray-500"
              }`}
            >
              <span className="text-[10px]">{idx + 1}</span>
              {tab}
            </span>
          ))}
        </div>

        <div className="mt-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-xl border border-gray-100 p-4 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">A.</span> Workforce Roles for Duty</h3>
                  <p className="mt-1 text-xs text-gray-500">Select the roles that can be assigned for duties and set basic preferences.</p>
                </div>
                <button type="button" className="btn-outline-purple !py-1.5 text-xs">+ Add Custom Role</button>
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
                    {[
                      "Nurse (RN)",
                      "ICU Nurse",
                      "General Duty Assistant (GDA)",
                      "Caregiver / Attendant",
                      "Baby Care / Nanny",
                      "Physiotherapist",
                      "Elder Care",
                    ].map((role, idx) => (
                      <tr key={role} className="border-t border-gray-100 bg-white">
                        <td className="px-3 py-2.5 text-xs font-semibold text-gray-800">{role}</td>
                        <td className="px-3 py-2.5"><input type="checkbox" className="accent-violet-accent" defaultChecked={idx !== 5} /></td>
                        <td className="px-3 py-2.5 text-xs text-gray-600">8 Hours, 12 Hours, 24 Hours</td>
                        <td className="px-3 py-2.5 text-xs text-gray-600">{idx % 2 === 0 ? "1 Year" : "6 Months"}</td>
                        <td className="px-3 py-2.5 text-xs text-gray-600">{idx % 2 === 0 ? "3.5" : "3.0"} ★</td>
                        <td className="px-3 py-2.5 text-right">
                          <button type="button" className="inline-flex rounded p-1 text-violet-accent hover:bg-violet-soft">+</button>
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
                {["Duty Amount", "Client Name", "Patient Condition", "Location / Address", "Shift & Duration", "Special Instructions", "Contact Number", "Advance Payment"].map((item) => (
                  <label key={item} className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2 text-xs">
                    <span className="text-gray-700">{item}</span>
                    <input type="checkbox" className="accent-violet-accent" defaultChecked />
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

        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-bold text-gray-900">Duty Engine Summary</h3>
          <ul className="mt-3 space-y-2 text-xs text-gray-600">
            <li className="flex items-center justify-between"><span>Total Active Roles</span><span className="font-semibold text-gray-900">7</span></li>
            <li className="flex items-center justify-between"><span>Duty Types Enabled</span><span className="font-semibold text-gray-900">{dutyTypes.length}/8</span></li>
            <li className="flex items-center justify-between"><span>Default Margin</span><span className="font-semibold text-gray-900">{(data.defaultMargin as string) || "15"}%</span></li>
            <li className="flex items-center justify-between"><span>Broadcast Mode</span><span className="font-semibold text-gray-900">Auto + Manual</span></li>
            <li className="flex items-center justify-between"><span>Client Approval</span><span className="font-semibold text-gray-900">{((data.clientApproval as string) || "mandatory").replace(/^./, (s) => s.toUpperCase())}</span></li>
            <li className="flex items-center justify-between"><span>Escalation</span><span className="font-semibold text-gray-900">{((data.escalation as string) || "enabled").replace(/^./, (s) => s.toUpperCase())}</span></li>
          </ul>
          </div>

          <div className="rounded-xl border border-violet-100 bg-violet-soft/40 p-4">
            <div className="flex items-start gap-2">
              <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-violet-accent" />
              <div>
                <h3 className="text-sm font-bold text-violet-deep">Why is this important?</h3>
                <ul className="mt-2 space-y-1.5 text-xs text-violet-deep/90">
                  <li>Accurate role mapping ensures the right staff is matched.</li>
                  <li>Clear information helps staff make informed decisions quickly.</li>
                  <li>Better operations speed up assignment and reduce rejections.</li>
                  <li>Happy clients come from right details and right staff.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-sky-100 bg-sky-50/80 p-4">
            <h3 className="text-sm font-bold text-sky-900">Need help setting this up?</h3>
            <p className="mt-1 text-xs leading-relaxed text-sky-900/80">Our operations expert can guide your duty settings for best results.</p>
            <button type="button" className="btn-outline-purple mt-3 w-full !py-2 text-xs">Schedule a Call</button>
          </div>
        </aside>
      </div>
      {footer && <div className="mt-8 border-t border-gray-100 pt-6">{footer}</div>}
    </div>
  );
}
