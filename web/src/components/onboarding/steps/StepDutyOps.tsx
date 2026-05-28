"use client";

import { CalendarClock, Check, Lightbulb, Plus } from "lucide-react";
import { Field, Section, RadioCard, Toggle } from "@/components/ui/FormBits";
import type { StepProps } from "./types";

const DUTY_TYPES = [
  "8 Hours (Shift Duty)",
  "12 Hours (Long Shift)",
  "24 Hours (Full Day)",
  "Visit Based (Per Visit)",
  "Night Duty (8 PM - 8 AM)",
  "Live-in Duty (Residential)",
  "Emergency On-Call (On demand)",
];

const WORKFLOW = ["Duty Created", "Broadcast to Staff", "Staff Accepts", "Client Approval", "Duty Confirmed", "Live Duty Monitoring", "Completion & Feedback"];

const DEFAULT_DUTY_SELECTION = [
  "8 Hours (Shift Duty)",
  "12 Hours (Long Shift)",
  "24 Hours (Full Day)",
  "Visit Based (Per Visit)",
  "Night Duty (8 PM - 8 AM)",
  "Live-in Duty (Residential)",
];

export function StepDutyOps({ data, onChange }: StepProps) {
  const dutyTypes = (data.dutyTypes as string[]) || DEFAULT_DUTY_SELECTION;
  const selectedCount = dutyTypes.length;

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
      <div>
        <div className="flex items-start gap-3">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-soft sm:flex">
            <CalendarClock className="h-6 w-6 text-violet-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Duty Operations Engine</h1>
            <p className="mt-1 text-sm text-gray-500">Configure duty creation, broadcast, approval flow, and escalation preferences.</p>
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
          <Section letter="A" title="Duty Types" subtitle="Select the duty formats your bureau runs. Add custom types from settings later.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {DUTY_TYPES.map((t) => {
                const on = dutyTypes.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      const next = on ? dutyTypes.filter((x) => x !== t) : [...dutyTypes, t];
                      onChange({ dutyTypes: next });
                    }}
                    className={`flex min-h-[72px] items-center justify-between gap-2 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${
                      on ? "border-violet-accent bg-violet-soft/70 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="leading-snug text-gray-800">{t}</span>
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${on ? "border-violet-accent bg-violet-accent text-white" : "border-gray-300"}`}>
                      {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
              <button type="button" className="flex min-h-[72px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-200 bg-violet-soft/30 text-sm font-semibold text-violet-accent transition hover:bg-violet-soft">
                <Plus className="mb-1 h-5 w-5" />
                Custom Duty Type
              </button>
            </div>
          </Section>

          <Section letter="B" title="Duty Approval Rules">
            <div className="grid gap-3">
              {[
                { v: "CLIENT", t: "Mandatory Client Approval", d: "Client must approve staff before duty confirmation." },
                { v: "AUTO", t: "Auto Confirmation After Acceptance", d: "Duty confirms automatically when a staff member accepts." },
                { v: "COORDINATOR", t: "Coordinator Approval Required", d: "Coordinator must approve before notifying the client." },
                { v: "HYBRID", t: "Hybrid (Client + Coordinator Approval)", d: "Both coordinator and client sign-off required." },
              ].map((o) => (
                <RadioCard key={o.v} name="approval" value={o.v} title={o.t} description={o.d} selected={(data.approvalRule as string || "CLIENT") === o.v} onChange={(v) => onChange({ approvalRule: v })} />
              ))}
            </div>
          </Section>

          <Section letter="C" title="Broadcast Preferences" subtitle="Control how duties are broadcast to your workforce.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Acceptance Timer">
                <div className="relative">
                  <input className="crm-input pr-16" value={(data.acceptanceTimer as string) || "30"} onChange={(e) => onChange({ acceptanceTimer: e.target.value })} />
                  <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-gray-400">Minutes</span>
                </div>
              </Field>
              <Field label="Search Radius">
                <div className="relative">
                  <input className="crm-input pr-10" value={(data.searchRadius as string) || "15"} onChange={(e) => onChange({ searchRadius: e.target.value })} />
                  <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-gray-400">KM</span>
                </div>
              </Field>
              <Field label="Max Staff to Notify">
                <div className="relative">
                  <input className="crm-input pr-14" value={(data.maxStaffNotify as string) || "50"} onChange={(e) => onChange({ maxStaffNotify: e.target.value })} />
                  <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-gray-400">Staff</span>
                </div>
              </Field>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Toggle label="Smart Matching" description="Match staff by skills, distance, and availability." checked={data.smartMatching !== false} onChange={(v) => onChange({ smartMatching: v })} />
              <Toggle label="Availability Filter" description="Only notify staff who are marked available." checked={data.availabilityFilter !== false} onChange={(v) => onChange({ availabilityFilter: v })} />
              <Toggle label="Priority Staff First" description="Offer duty to preferred / rated staff first." checked={data.priorityStaff !== false} onChange={(v) => onChange({ priorityStaff: v })} />
              <Toggle label="Limit Acceptances per Staff" description="Prevent overbooking of the same caregiver." checked={data.limitAcceptances !== false} onChange={(v) => onChange({ limitAcceptances: v })} />
            </div>
          </Section>

          <Section letter="D" title="Cancellation & Expiry">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Auto Expiry if not accepted in">
                <select className="crm-select" value={(data.autoExpiry as string) || "30"} onChange={(e) => onChange({ autoExpiry: e.target.value })}>
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="45">45 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </Field>
              <Field label="Auto Cancel if client doesn't respond in">
                <select className="crm-select" value={(data.autoCancel as string) || "60"} onChange={(e) => onChange({ autoCancel: e.target.value })}>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                  <option value="120">120 Minutes</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section letter="E" title="Duty Timing Rules">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Default Start Time">
                <input type="time" className="crm-input" value={(data.defaultStart as string) || "08:00"} onChange={(e) => onChange({ defaultStart: e.target.value })} />
              </Field>
              <Field label="Default End Time">
                <input type="time" className="crm-input" value={(data.defaultEnd as string) || "20:00"} onChange={(e) => onChange({ defaultEnd: e.target.value })} />
              </Field>
              <div className="flex items-end pb-1">
                <Toggle label="Allow Night Duty" description="Allow duties between 8 PM – 8 AM." checked={data.allowNightDuty !== false} onChange={(v) => onChange({ allowNightDuty: v })} />
              </div>
            </div>
          </Section>

          <Section letter="F" title="Special Preferences">
            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
                <input type="checkbox" className="mt-1 accent-violet-accent" defaultChecked />
                <span className="text-sm text-gray-800">Allow Replacement Before Start Time</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
                <input type="checkbox" className="mt-1 accent-violet-accent" defaultChecked />
                <span className="text-sm text-gray-800">Allow Replacement During Duty (Emergency)</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
                <input type="checkbox" className="mt-1 accent-violet-accent" />
                <span className="text-sm text-gray-800">Require Check-in for every Shift Duty</span>
              </label>
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                  <input type="checkbox" className="accent-violet-accent" />
                  Set Buffer Time Between Duties
                </label>
                <select className="crm-select !mb-0 max-w-[140px] py-2 text-xs">
                  <option>30 Minutes</option>
                  <option>60 Minutes</option>
                </select>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="crm-card text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Duty Types Summary</p>
          <div className="relative mx-auto mt-4 h-36 w-36">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#ede9fe" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="#5c2fc0"
                strokeWidth="3"
                strokeDasharray={`${Math.min(selectedCount * 14, 100)} 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-violet-accent">{selectedCount}</span>
              <span className="text-[10px] font-semibold uppercase text-gray-500">Selected</span>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-left text-xs text-gray-600">
            {dutyTypes.slice(0, 8).map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={3} />
                <span className="line-clamp-1">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="crm-card">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Your Workflow Snapshot</p>
          <div className="mt-4 space-y-0">
            {WORKFLOW.map((step, i) => (
              <div key={step} className="flex gap-2">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-soft text-[10px] font-bold text-violet-accent">{i + 1}</span>
                  {i < WORKFLOW.length - 1 && <span className="my-0.5 w-px flex-1 min-h-[12px] bg-violet-200" />}
                </div>
                <p className="pb-3 text-sm font-medium leading-tight text-gray-800">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-sky-100 bg-sky-50/80 p-4">
          <div className="flex gap-2">
            <Lightbulb className="h-5 w-5 shrink-0 text-sky-600" />
            <div>
              <p className="text-sm font-bold text-sky-900">Tips</p>
              <p className="mt-1 text-xs leading-relaxed text-sky-900/80">
                Tighter acceptance timers speed up placements but may reduce fill rates in low-density areas.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
