"use client";

import { Check, SlidersHorizontal, CircleHelp } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import type { StepProps } from "./types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MODELS = [
  { v: "OWNER", title: "Owner Driven", desc: "Owner takes major decisions and oversees all operations.", emoji: "👤", ring: "from-violet-500 to-violet-700" },
  { v: "COORDINATOR", title: "Coordinator Driven", desc: "Coordinators manage operations under defined guidelines.", emoji: "🧑‍💼", ring: "from-amber-400 to-orange-500" },
  { v: "DEPARTMENT", title: "Department Driven", desc: "Different departments handle specific functions independently.", emoji: "🏢", ring: "from-emerald-400 to-teal-600" },
  { v: "HYBRID", title: "Hybrid Model", desc: "Combination of multiple models to suit your business.", emoji: "🔀", ring: "from-sky-400 to-blue-600" },
];

const STRUCTURES = [
  { v: "CENTRALIZED", title: "Centralized", desc: "All operations managed from one central location.", emoji: "🏛️", ring: "from-violet-500 to-violet-700" },
  { v: "BRANCH", title: "Branch-wise", desc: "Operations managed independently by branches.", emoji: "🌿", ring: "from-amber-400 to-orange-500" },
  { v: "ROLE", title: "Role-based", desc: "Operations structured based on roles and responsibilities.", emoji: "🎯", ring: "from-emerald-400 to-teal-600" },
];

export function StepOperatingStyle({ data, onChange }: StepProps) {
  const workingDays = (data.workingDays as string[]) || [...DAYS];
  const model = (data.operatingModel as string) || "OWNER";
  const structure = (data.structure as string) || "CENTRALIZED";

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
      <div>
        <div className="flex items-start gap-3">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-soft sm:flex">
            <SlidersHorizontal className="h-6 w-6 text-violet-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Operations Setup</h1>
            <p className="mt-1 text-sm text-gray-500">Configure how your bureau operates. These preferences will drive daily processes in the CRM.</p>
          </div>
        </div>
        <div className="mt-8">
          <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">A.</span> Bureau Operating Model</h3>
            <p className="mt-1 text-xs text-gray-500">Choose the model that best describes how your bureau operates.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MODELS.map((m) => {
                const selected = model === m.v;
                return (
                  <button
                    key={m.v}
                    type="button"
                    onClick={() => onChange({ operatingModel: m.v })}
                    className={`relative flex flex-col rounded-xl border-2 p-3 text-left transition ${
                      selected ? "border-violet-accent bg-violet-soft/60 shadow-sm ring-1 ring-violet-accent/25" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-accent text-white shadow">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                    <span className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-lg shadow-inner ${m.ring}`}>{m.emoji}</span>
                    <p className="text-xs font-bold text-gray-900">{m.title}</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-gray-500">{m.desc}</p>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-gray-500">You can change this model later from settings.</p>
          </section>

          <section className="rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">B.</span> Organization Structure</h3>
            <p className="mt-1 text-xs text-gray-500">How is your organization structured?</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {STRUCTURES.map((s) => {
                const selected = structure === s.v;
                return (
                  <button
                    key={s.v}
                    type="button"
                    onClick={() => onChange({ structure: s.v })}
                    className={`relative flex flex-col rounded-xl border-2 p-3 text-left transition ${
                      selected ? "border-violet-accent bg-violet-soft/60 shadow-sm ring-1 ring-violet-accent/25" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-base ${s.ring}`}>{s.emoji}</span>
                      <span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected ? "border-violet-accent bg-violet-accent" : "border-gray-300 bg-white"
                      }`}>
                        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-bold text-gray-900">{s.title}</p>
                    <p className="mt-1 text-[10px] text-gray-500">{s.desc}</p>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-gray-500">This helps us customize reporting, access and approval flows.</p>
          </section>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">C.</span> Lead Allocation Method</h3>
              <p className="mt-1 text-xs text-gray-500">How do you want leads to be assigned?</p>
              <div className="mt-4 space-y-3">
                {[
                  { v: "AUTO", t: "Auto Assignment", d: "Leads will be automatically assigned based on rules." },
                  { v: "MANUAL", t: "Manual Assignment", d: "Leads will be assigned manually by authorized users." },
                  { v: "BRANCH", t: "Branch-wise Assignment", d: "Leads will be assigned to specific branches." },
                ].map((item) => (
                  <label key={item.v} className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5">
                    <input
                      type="radio"
                      name="leadAllocation"
                      className="mt-1 accent-violet-accent"
                      checked={((data.leadAllocation as string) || "AUTO") === item.v}
                      onChange={() => onChange({ leadAllocation: item.v })}
                    />
                    <span>
                      <span className="block text-xs font-semibold text-gray-900">{item.t}</span>
                      <span className="mt-0.5 block text-[11px] text-gray-500">{item.d}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-gray-500">You can configure detailed rules in Workflow & Automation step.</p>
            </section>

            <section className="rounded-xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">D.</span> Client Approval Preference</h3>
              <p className="mt-1 text-xs text-gray-500">Do you want client approval before confirming staff?</p>
              <div className="mt-4 space-y-3">
                {[
                  { v: "MANDATORY", t: "Mandatory Approval", d: "Staff will be confirmed only after client approval." },
                  { v: "OPTIONAL", t: "Optional Approval", d: "Client approval is recommended but not mandatory." },
                  { v: "NONE", t: "No Approval Required", d: "Staff will be confirmed without client approval." },
                ].map((item) => (
                  <label key={item.v} className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5">
                    <input
                      type="radio"
                      name="clientApproval"
                      className="mt-1 accent-violet-accent"
                      checked={((data.clientApproval as string) || "MANDATORY") === item.v}
                      onChange={() => onChange({ clientApproval: item.v })}
                    />
                    <span>
                      <span className="block text-xs font-semibold text-gray-900">{item.t}</span>
                      <span className="mt-0.5 block text-[11px] text-gray-500">{item.d}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-gray-500">Approval flow can be customized later.</p>
            </section>
          </div>

          <section className="mt-6 rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">E.</span> Payment Handling Model</h3>
            <p className="mt-1 text-xs text-gray-500">How will payments be handled for duties?</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_280px]">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { v: "BUREAU", t: "Bureau Collects Payment", d: "Client pays the bureau and bureau pays staff." },
                  { v: "DIRECT", t: "Direct Client Payment", d: "Client pays staff directly; bureau may charge service fee." },
                  { v: "HYBRID", t: "Hybrid Model", d: "Some service via bureau, some direct payment." },
                ].map((item) => (
                  <label key={item.v} className="flex cursor-pointer flex-col rounded-xl border border-gray-200 p-3 has-[:checked]:border-violet-accent has-[:checked]:bg-violet-soft/50">
                    <div className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="paymentModel"
                        className="mt-0.5 accent-violet-accent"
                        checked={((data.paymentModel as string) || "BUREAU") === item.v}
                        onChange={() => onChange({ paymentModel: item.v })}
                      />
                      <span className="text-xs font-semibold text-gray-900">{item.t}</span>
                    </div>
                    <span className="mt-1 text-[11px] text-gray-500">{item.d}</span>
                  </label>
                ))}
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                <p className="text-xs font-bold text-gray-800">Payment Preferences</p>
                <div className="mt-3 space-y-2">
                  <Field label="Advance Payment">
                    <select className="crm-select" value={(data.advancePayment as string) || "at_booking"} onChange={(e) => onChange({ advancePayment: e.target.value })}>
                      <option value="at_booking">At booking</option>
                      <option value="after_assignment">After assignment</option>
                    </select>
                  </Field>
                  <Field label="Auto Invoice Generation">
                    <select className="crm-select" value={(data.autoInvoice as string) || "enabled"} onChange={(e) => onChange({ autoInvoice: e.target.value })}>
                      <option value="enabled">Enabled</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </Field>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-gray-500">These settings can be updated anytime from settings.</p>
          </section>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-bold text-gray-900">Operating Model Preview</h3>
          <ul className="mt-3 space-y-2 text-xs text-gray-700">
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Model: Owner Driven</li>
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Structure: Centralized</li>
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Lead Allocation: Auto Assignment</li>
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Client Approval: Mandatory</li>
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Payment Handling: Bureau Collects</li>
          </ul>
          <button type="button" className="btn-outline-purple mt-4 w-full !py-2 text-xs">Preview Dashboard</button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-bold text-gray-900">Why is this important?</h3>
          <ul className="mt-3 space-y-2 text-xs text-gray-600">
            {[
              "Streamlines daily operations",
              "Better control & visibility",
              "Improved client experience",
              "Scalable and flexible",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <CircleHelp className="mt-0.5 h-3.5 w-3.5 text-gray-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
