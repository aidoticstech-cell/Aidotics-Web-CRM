"use client";

import { useMemo } from "react";
import type { ComponentType } from "react";
import {
  Building2,
  Briefcase,
  Users,
  UserCircle,
  LayoutGrid,
  MapPin,
  Calendar,
  Activity,
  Check,
  X,
  ChevronDown,
  Heart,
  Baby,
  Home,
  Stethoscope,
  Plus,
} from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import type { StepProps } from "./types";

type ServiceItem = {
  id: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  color: string;
  iconBg: string;
};

const SERVICE_ITEMS: ServiceItem[] = [
  { id: "nurse", label: "Nurse", Icon: Stethoscope, color: "text-violet-700", iconBg: "bg-violet-100" },
  { id: "semi_nurse", label: "Semi Nurse", Icon: Activity, color: "text-emerald-700", iconBg: "bg-emerald-100" },
  { id: "attendant", label: "Attendant", Icon: Users, color: "text-sky-700", iconBg: "bg-sky-100" },
  { id: "elder_care", label: "Elder Care", Icon: Heart, color: "text-pink-700", iconBg: "bg-pink-100" },
  { id: "baby_care", label: "Baby Care", Icon: Baby, color: "text-amber-700", iconBg: "bg-amber-100" },
  { id: "physio", label: "Physiotherapist", Icon: Activity, color: "text-teal-700", iconBg: "bg-teal-100" },
  { id: "icu", label: "ICU Nurse", Icon: Stethoscope, color: "text-red-700", iconBg: "bg-red-100" },
  { id: "gda", label: "GDA", Icon: Users, color: "text-indigo-700", iconBg: "bg-indigo-100" },
  { id: "home_visit", label: "Home Visit", Icon: Home, color: "text-orange-700", iconBg: "bg-orange-100" },
  { id: "custom", label: "Custom Service", Icon: Plus, color: "text-gray-700", iconBg: "bg-gray-100" },
];

const CITIES = ["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad", "Mumbai", "Bangalore"];

function serviceLabelsFromIds(ids: string[]) {
  return SERVICE_ITEMS.filter((s) => ids.includes(s.id)).map((s) => s.label);
}

function idsFromLegacyServices(services: unknown): string[] | null {
  if (!Array.isArray(services) || services.length === 0) return null;
  const labels = new Set(services as string[]);
  const ids = SERVICE_ITEMS.filter((s) => labels.has(s.label)).map((s) => s.id);
  return ids.length ? ids : null;
}

function SectionHeader({ icon: Icon, title }: { icon: ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-soft">
        <Icon className="h-4 w-4 text-violet-accent" />
      </span>
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
    </div>
  );
}

function CarePlusLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-20 w-20" : size === "sm" ? "h-12 w-12" : "h-16 w-16";
  const text = size === "lg" ? "text-[10px]" : "text-[8px]";
  return (
    <div className={`${dim} flex shrink-0 flex-col items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-600 shadow-md`}>
      <Heart className="h-5 w-5 fill-white text-white" />
      <span className={`${text} mt-0.5 font-bold uppercase tracking-wide text-white`}>careplus</span>
    </div>
  );
}

export function StepBureauProfile({ data, onChange, footer }: StepProps) {
  const serviceIds = useMemo(() => {
    const cur = data.serviceIds as string[] | undefined;
    if (cur?.length) return cur;
    return idsFromLegacyServices(data.services) ?? [];
  }, [data.serviceIds, data.services]);

  const cities = (data.cities as string[]) ?? [];

  function setServiceIds(next: string[]) {
    onChange({ serviceIds: next, services: serviceLabelsFromIds(next) });
  }

  function toggleService(id: string) {
    const next = serviceIds.includes(id) ? serviceIds.filter((x) => x !== id) : [...serviceIds, id];
    setServiceIds(next);
  }

  function selectAllServices() {
    const all = SERVICE_ITEMS.map((s) => s.id);
    const allSelected = all.every((id) => serviceIds.includes(id));
    setServiceIds(allSelected ? [] : all);
  }

  function toggleCity(c: string) {
    const next = cities.includes(c) ? cities.filter((x) => x !== c) : [...cities, c];
    onChange({ cities: next });
  }

  const displayName = (data.displayName as string) ?? "";
  const legalName = (data.legalName as string) ?? "";
  const establishedYear = (data.establishedYear as string) ?? "";
  const staffCount = (data.staffCount as string) ?? "";
  const monthlyDuties = (data.monthlyDuties as string) ?? "";
  const ownerName = (data.ownerName as string) ?? "";
  const ownerMobile = (data.ownerMobile as string) ?? "";
  const ownerEmail = (data.ownerEmail as string) ?? "";
  const website = (data.website as string) ?? "";

  const selectedServices = SERVICE_ITEMS.filter((s) => serviceIds.includes(s.id));

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      {/* ── Form card ── */}
      <div className="onboarding-panel !p-0 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-5 lg:px-8">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-soft">
              <Building2 className="h-5 w-5 text-violet-accent" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">Bureau Profile & Verification</h1>
              <p className="mt-1 text-sm text-gray-500">Provide basic bureau identity, services, coverage and verification-ready contact details.</p>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-100 px-6 py-3 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {["Basic Bureau Identity", "Services Offered", "Operational Snapshot", "Verification Documents", "Contact Details"].map((tab, idx) => (
              <span
                key={tab}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-semibold ${
                  idx === 0 ? "border-violet-accent bg-violet-soft text-violet-deep" : "border-gray-200 bg-white text-gray-500"
                }`}
              >
                <span className="text-[10px]">{String.fromCharCode(65 + idx)}</span>
                {tab}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-8 border-b border-gray-100 p-6 lg:border-b-0 lg:border-r lg:p-8">
            <section>
              <SectionHeader icon={Briefcase} title="Basic Details" />
              <div className="space-y-4">
                <Field label="Bureau Legal Name" required>
                  <input className="crm-input" value={legalName} onChange={(e) => onChange({ legalName: e.target.value })} />
                </Field>
                <Field label="Display Name" required>
                  <input className="crm-input" value={displayName} onChange={(e) => onChange({ displayName: e.target.value })} />
                </Field>
                <Field label="Established Year">
                  <input className="crm-input" value={establishedYear} onChange={(e) => onChange({ establishedYear: e.target.value })} />
                </Field>
                <Field label="Logo">
                  <div className="flex items-center gap-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
                    <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
                      <CarePlusLogo />
                    </div>
                    <div>
                      <button type="button" className="rounded-lg border border-violet-accent bg-white px-4 py-2 text-xs font-bold text-violet-accent transition hover:bg-violet-soft">
                        Upload Logo
                      </button>
                      <p className="mt-2 text-[11px] text-gray-400">JPG, PNG (Max 2MB)</p>
                    </div>
                  </div>
                </Field>
              </div>
            </section>

            <section>
              <SectionHeader icon={Users} title="Operational Details" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Total Active Staff Count">
                  <input className="crm-input" value={staffCount} onChange={(e) => onChange({ staffCount: e.target.value })} />
                </Field>
                <Field label="Average Monthly Duties">
                  <input className="crm-input" value={monthlyDuties} onChange={(e) => onChange({ monthlyDuties: e.target.value })} />
                </Field>
              </div>
            </section>

            <section>
              <SectionHeader icon={UserCircle} title="Primary Contact (Owner Details)" />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <Field label="Owner Full Name" required>
                  <input className="crm-input" value={ownerName} onChange={(e) => onChange({ ownerName: e.target.value })} />
                </Field>
                <Field label="Mobile Number" required>
                  <input className="crm-input" value={ownerMobile} onChange={(e) => onChange({ ownerMobile: e.target.value })} />
                </Field>
                <Field label="Email Address" required>
                  <input className="crm-input" type="email" value={ownerEmail} onChange={(e) => onChange({ ownerEmail: e.target.value })} />
                </Field>
                <Field label="Website (Optional)">
                  <input className="crm-input" value={website} onChange={(e) => onChange({ website: e.target.value })} />
                </Field>
              </div>
            </section>
          </div>

          {/* Right column (within form) */}
          <div className="space-y-8 p-6 lg:p-8">
            <section>
              <div className="mb-4 flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-soft">
                    <LayoutGrid className="h-4 w-4 text-violet-accent" />
                  </span>
                  <h3 className="text-sm font-bold text-gray-900">
                    Service Types <span className="font-normal text-gray-500">(Select all that apply)</span>
                    <span className="text-red-500"> *</span>
                  </h3>
                </div>
                <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-semibold text-violet-accent">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-violet-accent"
                    checked={SERVICE_ITEMS.every((s) => serviceIds.includes(s.id))}
                    onChange={selectAllServices}
                  />
                  Select All
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {SERVICE_ITEMS.map(({ id, label, Icon, iconBg, color }) => {
                  const on = serviceIds.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleService(id)}
                      className={`relative flex flex-col items-center gap-2 rounded-xl border-2 px-2 py-3 text-center transition ${
                        on ? "border-violet-accent bg-violet-soft/40 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      {on && (
                        <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded bg-violet-accent text-white">
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </span>
                      )}
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${on ? "bg-violet-accent text-white" : `${iconBg} ${color}`}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[11px] font-semibold leading-tight text-gray-800">{label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <SectionHeader icon={MapPin} title="Service Cities" />
              <div className="relative">
                <div className="flex min-h-[52px] flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 pr-10">
                  {cities.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 rounded-md bg-violet-soft px-2.5 py-1 text-xs font-semibold text-violet-deep">
                      {c}
                      <button type="button" onClick={() => toggleCity(c)} aria-label={`Remove ${c}`}>
                        <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                      </button>
                    </span>
                  ))}
                  {cities.length === 0 && <span className="text-sm text-gray-400">Select cities…</span>}
                </div>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CITIES.filter((c) => !cities.includes(c)).map((c) => (
                  <button key={c} type="button" className="text-[11px] font-medium text-violet-accent hover:underline" onClick={() => toggleCity(c)}>
                    + {c}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        {footer && <div className="border-t border-gray-100 px-6 pb-6 pt-2 lg:px-8">{footer}</div>}
      </div>

      {/* ── Preview panel ── */}
      <aside>
        <div className="crm-card sticky top-4 !p-5 shadow-md">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900">Bureau Profile Preview</h3>
            <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Looks Good!</span>
          </div>

          <div className="mt-5 flex flex-col items-center text-center">
            <CarePlusLogo size="lg" />
            <div className="mt-3 flex items-center gap-2">
              <p className="text-base font-bold text-gray-900">{displayName}</p>
              <button type="button" className="text-xs font-semibold text-violet-accent hover:underline">
                Change
              </button>
            </div>
          </div>

          <ul className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm">
            <PreviewRow icon={Calendar} label="Established Year" value={establishedYear} />
            <PreviewRow icon={Users} label="Active Staff" value={staffCount} />
            <PreviewRow icon={Activity} label="Monthly Duties" value={monthlyDuties} />
            <li className="flex items-start gap-3">
              <PreviewIcon icon={LayoutGrid} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-gray-400">Service Types</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {selectedServices.slice(0, 4).map((s) => (
                    <span key={s.id} className={`flex h-7 w-7 items-center justify-center rounded-lg ${s.iconBg}`}>
                      <s.Icon className={`h-3.5 w-3.5 ${s.color}`} />
                    </span>
                  ))}
                  {selectedServices.length > 4 && (
                    <span className="flex h-7 items-center rounded-lg bg-gray-100 px-2 text-[10px] font-bold text-gray-600">
                      +{selectedServices.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </li>
            <PreviewRow icon={MapPin} label="Cities" value={`${cities.length} Cities`} />
            <li className="flex items-start gap-3 border-t border-gray-100 pt-3">
              <PreviewIcon icon={UserCircle} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-gray-400">Primary Contact</p>
                <p className="mt-0.5 font-semibold text-gray-900">{ownerName}</p>
                <p className="text-xs text-gray-600">{ownerMobile}</p>
                <p className="text-xs text-gray-500">{ownerEmail}</p>
              </div>
            </li>
          </ul>

          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-2.5">
            <p className="text-[11px] leading-relaxed text-emerald-800">
              You can edit all details later from <strong>Settings &gt; Profile</strong>.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function PreviewIcon({ icon: Icon }: { icon: ComponentType<{ className?: string }> }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-soft">
      <Icon className="h-4 w-4 text-violet-accent" />
    </span>
  );
}

function PreviewRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <PreviewIcon icon={Icon} />
      <div>
        <p className="text-[11px] font-medium text-gray-400">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </li>
  );
}
