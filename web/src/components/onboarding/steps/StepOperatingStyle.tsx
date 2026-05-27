"use client";

import { Check, Clock, SlidersHorizontal } from "lucide-react";
import { Field, Section, InfoBox } from "@/components/ui/FormBits";
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
            <h1 className="text-2xl font-bold text-gray-900">Operating Style Setup</h1>
            <p className="mt-1 text-sm text-gray-500">Choose the operating model that best describes how your bureau works.</p>
          </div>
        </div>

        <div className="mt-8">
          <Section letter="A" title="Business Operating Model" subtitle="Select the decision-making style that fits your bureau.">
            <div className="grid gap-4 sm:grid-cols-2">
              {MODELS.map((m) => {
                const selected = model === m.v;
                return (
                  <button
                    key={m.v}
                    type="button"
                    onClick={() => onChange({ operatingModel: m.v })}
                    className={`relative flex flex-col rounded-2xl border-2 p-5 text-left transition ${
                      selected ? "border-violet-accent bg-violet-soft/60 shadow-md ring-2 ring-violet-accent/20" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-violet-accent text-white shadow">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    )}
                    <span className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-inner ${m.ring}`}>{m.emoji}</span>
                    <p className="font-bold text-gray-900">{m.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section letter="B" title="Operational Structure" subtitle="How are day-to-day operations organised across locations?">
            <div className="grid gap-4 md:grid-cols-3">
              {STRUCTURES.map((s) => {
                const selected = structure === s.v;
                return (
                  <button
                    key={s.v}
                    type="button"
                    onClick={() => onChange({ structure: s.v })}
                    className={`relative flex flex-col rounded-2xl border-2 p-4 text-left transition ${
                      selected ? "border-violet-accent bg-violet-soft/60 shadow-sm ring-1 ring-violet-accent/25" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-xl ${s.ring}`}>{s.emoji}</span>
                      <span
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected ? "border-violet-accent bg-violet-accent" : "border-gray-300 bg-white"
                        }`}
                      >
                        {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="mt-3 font-bold text-gray-900">{s.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{s.desc}</p>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section letter="C" title="Service Coverage Style">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Service Coverage Area" required>
                <select className="crm-select" value={(data.coverageArea as string) || "MULTI_CITY"} onChange={(e) => onChange({ coverageArea: e.target.value })}>
                  <option value="SINGLE_CITY">Single City</option>
                  <option value="MULTI_CITY">Multi-City</option>
                  <option value="PAN_INDIA">Pan India</option>
                </select>
              </Field>
              <Field label="Service Availability" required>
                <select className="crm-select" value={(data.availability as string) || "24x7"} onChange={(e) => onChange({ availability: e.target.value })}>
                  <option value="BUSINESS_HOURS">Business Hours</option>
                  <option value="24x7">24 × 7</option>
                </select>
              </Field>
              <Field label="Coverage Radius Preference" required>
                <select className="crm-select" value={(data.radius as string) || "25"} onChange={(e) => onChange({ radius: e.target.value })}>
                  <option value="10">Up to 10 KM</option>
                  <option value="25">Up to 25 KM (Default)</option>
                  <option value="50">Up to 50 KM</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section letter="D" title="Working Days & Hours">
            <Field label="Working Days" required>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                      workingDays.includes(d) ? "border-violet-accent bg-violet-soft text-violet-deep" : "border-gray-200 bg-white text-gray-500"
                    }`}
                    onClick={() => {
                      const next = workingDays.includes(d) ? workingDays.filter((x) => x !== d) : [...workingDays, d];
                      onChange({ workingDays: next });
                    }}
                  >
                    {d}
                    {workingDays.includes(d) && <span className="text-gray-400">×</span>}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Standard Working Hours" required>
              <div className="relative max-w-md">
                <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input className="crm-input pl-10" value={(data.workingHours as string) || "9:00 AM - 7:00 PM"} onChange={(e) => onChange({ workingHours: e.target.value })} />
              </div>
            </Field>
          </Section>
        </div>
      </div>

      <aside className="space-y-4">
        <InfoBox variant="green" title="Why Operating Style is Important?">
          <ul className="space-y-2 text-xs text-gray-700">
            {["Helps customise the CRM to your workflow", "Improves team productivity and clarity", "Better routing of duties and escalations"].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-emerald-600">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </InfoBox>

        <div className="crm-card">
          <h3 className="font-bold text-gray-900">Operating Style Preview</h3>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between border-b border-gray-50 py-1">
              <dt className="text-gray-500">Selected Model</dt>
              <dd className="font-semibold text-gray-900">{MODELS.find((x) => x.v === model)?.title}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-50 py-1">
              <dt className="text-gray-500">Operational Structure</dt>
              <dd className="font-semibold text-gray-900">{STRUCTURES.find((x) => x.v === structure)?.title}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-50 py-1">
              <dt className="text-gray-500">Service Coverage</dt>
              <dd className="font-semibold">{(data.coverageArea as string) === "MULTI_CITY" ? "Multi-City" : (data.coverageArea as string) || "Multi-City"}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-50 py-1">
              <dt className="text-gray-500">Availability</dt>
              <dd className="font-semibold">{(data.availability as string) === "24x7" ? "24 × 7" : "Business Hours"}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-50 py-1">
              <dt className="text-gray-500">Working Days</dt>
              <dd className="font-semibold">{workingDays.length} Days</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-gray-500">Working Hours</dt>
              <dd className="font-semibold">{(data.workingHours as string) || "9:00 AM - 7:00 PM"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-violet-100 bg-violet-soft/50 p-4 text-xs text-gray-600">
          <span className="font-semibold text-violet-deep">Note: </span>
          You can change these settings later from <strong>Settings → Business Preferences</strong>.
        </div>
      </aside>
    </div>
  );
}
