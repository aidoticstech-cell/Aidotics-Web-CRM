"use client";

import { useMemo } from "react";
import type { ComponentType } from "react";
import {
  Building2,
  Check,
  X,
  Stethoscope,
  Activity,
  Users,
  Heart,
  Baby,
  Plus,
  ShieldCheck,
  CircleHelp,
} from "lucide-react";
import { Field, InfoBox } from "@/components/ui/FormBits";
import type { StepProps } from "./types";

type ServiceItem = {
  id: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

const SERVICE_ITEMS: ServiceItem[] = [
  { id: "nurse", label: "Nursing Care", Icon: Stethoscope },
  { id: "icu", label: "ICU / Critical Care", Icon: Activity },
  { id: "attendant", label: "Patient Attendant", Icon: Users },
  { id: "elder_care", label: "Elderly Care", Icon: Heart },
  { id: "baby_care", label: "Baby Care / Nanny", Icon: Baby },
  { id: "physio", label: "Physiotherapy", Icon: Activity },
  { id: "other", label: "Other Services", Icon: Plus },
];

const CITIES = ["Mumbai", "Thane", "Navi Mumbai", "Pune", "Delhi", "Gurgaon", "Noida"];
const LEAD_SOURCES = ["Website", "Google Ads", "Justdial", "Social Media", "Referrals", "Walk-in", "Other"];

function serviceLabelsFromIds(ids: string[]) {
  return SERVICE_ITEMS.filter((s) => ids.includes(s.id)).map((s) => s.label);
}

function idsFromLegacyServices(services: unknown): string[] | null {
  if (!Array.isArray(services) || services.length === 0) return null;
  const labels = new Set(services as string[]);
  const ids = SERVICE_ITEMS.filter((s) => labels.has(s.label)).map((s) => s.id);
  return ids.length ? ids : null;
}

export function StepBureauProfile({ data, onChange, footer }: StepProps) {
  const serviceIds = useMemo(() => {
    const cur = data.serviceIds as string[] | undefined;
    if (cur?.length) return cur;
    return idsFromLegacyServices(data.services) ?? [];
  }, [data.serviceIds, data.services]);

  const cities = (data.cities as string[]) ?? [];
  const leadSources = (data.leadSources as string[]) ?? [];

  function setServiceIds(next: string[]) {
    onChange({ serviceIds: next, services: serviceLabelsFromIds(next) });
  }

  function toggleService(id: string) {
    const next = serviceIds.includes(id) ? serviceIds.filter((x) => x !== id) : [...serviceIds, id];
    setServiceIds(next);
  }

  function toggleCity(city: string) {
    const next = cities.includes(city) ? cities.filter((x) => x !== city) : [...cities, city];
    onChange({ cities: next });
  }

  function toggleSource(source: string) {
    const next = leadSources.includes(source) ? leadSources.filter((x) => x !== source) : [...leadSources, source];
    onChange({ leadSources: next });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <div className="onboarding-panel !overflow-hidden !p-0">
        <div className="flex items-start gap-3 border-b border-gray-100 px-6 py-5 lg:px-8">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-soft">
            <Building2 className="h-5 w-5 text-violet-accent" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">Bureau Profile & Verification</h1>
            <p className="mt-1 text-sm text-gray-500">Provide basic information about your bureau. These details will be used across your CRM.</p>
          </div>
        </div>

        <div className="space-y-8 p-6 lg:p-8">
          <section>
            <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">A.</span> Basic Bureau Identity</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Field label="Bureau Legal Name" required>
                <input className="crm-input" value={(data.legalName as string) ?? ""} onChange={(e) => onChange({ legalName: e.target.value })} />
              </Field>
              <Field label="Display / Brand Name" required>
                <input className="crm-input" value={(data.displayName as string) ?? ""} onChange={(e) => onChange({ displayName: e.target.value })} />
              </Field>
              <Field label="Established Year" required>
                <input className="crm-input" value={(data.establishedYear as string) ?? ""} onChange={(e) => onChange({ establishedYear: e.target.value })} />
              </Field>
              <Field label="Bureau Type" required>
                <select className="crm-select" value={(data.bureauType as string) ?? "private_limited"} onChange={(e) => onChange({ bureauType: e.target.value })}>
                  <option value="private_limited">Private Limited</option>
                  <option value="partnership">Partnership</option>
                  <option value="proprietorship">Proprietorship</option>
                </select>
              </Field>
              <Field label="GST Number" required>
                <input className="crm-input" value={(data.gstNumber as string) ?? ""} onChange={(e) => onChange({ gstNumber: e.target.value })} />
              </Field>
              <Field label="PAN Number" required>
                <input className="crm-input" value={(data.panNumber as string) ?? ""} onChange={(e) => onChange({ panNumber: e.target.value })} />
              </Field>
              <div className="lg:col-span-2">
                <Field label="CIN (Optional)">
                  <input className="crm-input" value={(data.cinNumber as string) ?? ""} onChange={(e) => onChange({ cinNumber: e.target.value })} />
                </Field>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">B.</span> Services Offered</h3>
            <p className="mt-1 text-xs text-gray-500">Select all services your bureau provides</p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {SERVICE_ITEMS.map(({ id, label, Icon }) => {
                const selected = serviceIds.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleService(id)}
                    className={`relative rounded-xl border-2 px-2 py-3 text-center transition ${
                      selected ? "border-violet-accent bg-violet-soft/50" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded bg-violet-accent text-white">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                    )}
                    <span className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${selected ? "bg-violet-accent text-white" : "bg-gray-100 text-gray-500"}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-semibold leading-tight text-gray-800">{label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">C.</span> Operational Snapshot</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Field label="Cities / Areas Covered" required>
                  <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                    {cities.map((city) => (
                      <span key={city} className="inline-flex items-center gap-1 rounded-md bg-violet-soft px-2.5 py-1 text-xs font-semibold text-violet-deep">
                        {city}
                        <button type="button" onClick={() => toggleCity(city)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {cities.length === 0 && <span className="text-sm text-gray-400">Select cities...</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {CITIES.filter((c) => !cities.includes(c)).map((city) => (
                      <button key={city} type="button" className="text-[11px] font-medium text-violet-accent hover:underline" onClick={() => toggleCity(city)}>
                        + {city}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
              <Field label="Approx. Active Staff" required>
                <input className="crm-input" value={(data.staffCount as string) ?? ""} onChange={(e) => onChange({ staffCount: e.target.value })} />
              </Field>
              <Field label="Approx. Monthly Duties" required>
                <input className="crm-input" value={(data.monthlyDuties as string) ?? ""} onChange={(e) => onChange({ monthlyDuties: e.target.value })} />
              </Field>
            </div>

            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold text-gray-700">Primary Lead Sources (Select all that apply)</p>
              <div className="flex flex-wrap gap-2">
                {LEAD_SOURCES.map((src) => {
                  const on = leadSources.includes(src);
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => toggleSource(src)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                        on ? "border-violet-accent bg-violet-soft text-violet-deep" : "border-gray-200 bg-white text-gray-500"
                      }`}
                    >
                      {src}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">D.</span> Verification Documents <span className="ml-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">Required</span></h3>
              <p className="mt-1 text-xs text-gray-500">Upload clear, valid documents for verification.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  "GST Certificate",
                  "PAN Card",
                  "Aadhaar Card",
                  "Cancelled Cheque",
                ].map((doc) => (
                  <div key={doc} className="rounded-xl border border-gray-200 bg-white p-3">
                    <p className="text-[11px] font-semibold text-gray-700">{doc}</p>
                    <p className="mt-1 text-[10px] text-gray-400">Upload .pdf / .jpg</p>
                    <button type="button" className="mt-2 text-[11px] font-semibold text-violet-accent">Upload</button>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-gray-500">Your documents are secure and encrypted. They will only be used for verification purposes.</p>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">E.</span> Contact Details</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field label="Owner / Contact Person Name" required>
                  <input className="crm-input" value={(data.ownerName as string) ?? ""} onChange={(e) => onChange({ ownerName: e.target.value })} />
                </Field>
                <Field label="Mobile Number" required>
                  <input className="crm-input" value={(data.ownerMobile as string) ?? ""} onChange={(e) => onChange({ ownerMobile: e.target.value })} />
                </Field>
                <Field label="Email Address" required>
                  <input className="crm-input" type="email" value={(data.ownerEmail as string) ?? ""} onChange={(e) => onChange({ ownerEmail: e.target.value })} />
                </Field>
                <Field label="WhatsApp Number">
                  <input className="crm-input" value={(data.whatsappNumber as string) ?? ""} onChange={(e) => onChange({ whatsappNumber: e.target.value })} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Website (Optional)">
                    <input className="crm-input" value={(data.website as string) ?? ""} onChange={(e) => onChange({ website: e.target.value })} />
                  </Field>
                </div>
              </div>
            </section>
          </div>
        </div>

        {footer && <div className="border-t border-gray-100 px-6 pb-6 pt-2 lg:px-8">{footer}</div>}
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-bold text-gray-900">Why is this important?</h3>
          <ul className="mt-3 space-y-3 text-xs text-gray-600">
            <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 text-gray-400" /> Helps us verify your bureau and staff.</li>
            <li className="flex gap-2"><CircleHelp className="mt-0.5 h-4 w-4 text-gray-400" /> Personalizes your CRM per your setup preferences.</li>
            <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 text-gray-400" /> Required for billing and compliance.</li>
          </ul>
        </div>

        <InfoBox variant="green" title="Tips for you">
          <ul className="space-y-2 text-xs">
            <li className="flex gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-emerald-600" /> Please enter correct GST & PAN details.</li>
            <li className="flex gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-emerald-600" /> Upload clear documents for quick verification.</li>
            <li className="flex gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-emerald-600" /> You can update these details anytime from settings.</li>
          </ul>
        </InfoBox>
      </aside>
    </div>
  );
}
