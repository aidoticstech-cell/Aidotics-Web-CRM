"use client";

import { useMemo, useState } from "react";
import { profileDocTypeFromLabel, uploadProfileVerificationDoc } from "@/lib/files-api";
import { formatProfileUploadError } from "@/lib/upload-errors";
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
} from "lucide-react";
import { Field } from "@/components/ui/FormBits";
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

type UploadState = { status: "idle" | "uploading" | "done" | "error"; message?: string };

export function StepBureauProfile({ data, onChange, footer }: StepProps) {
  const [uploadState, setUploadState] = useState<Record<string, UploadState>>({});

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

  const uploads = (data.uploads as Record<string, { fileName?: string; path?: string }>) ?? {};

  async function handleDocUpload(label: string, file: File | undefined) {
    const docType = profileDocTypeFromLabel(label);
    if (!docType || !file) return;

    setUploadState((s) => ({ ...s, [label]: { status: "uploading" } }));
    try {
      const res = await uploadProfileVerificationDoc(file, docType);
      const prev = (data.uploads as Record<string, unknown>) ?? {};
      onChange({
        uploads: {
          ...prev,
          [docType]: {
            fileId: res.file.id,
            path: res.path,
            fileName: res.file.fileName || file.name,
            storageSlug: res.storageSlug,
            uploadedAt: new Date().toISOString(),
          },
        },
      });
      setUploadState((s) => ({ ...s, [label]: { status: "done" } }));
    } catch (e) {
      setUploadState((s) => ({
        ...s,
        [label]: { status: "error", message: formatProfileUploadError(e) },
      }));
    }
  }

  return (
    <div>
      <div className="onboarding-panel !overflow-hidden !p-0">
        <div className="flex items-start gap-4 border-b border-gray-100 px-6 py-6 sm:px-8 sm:py-7">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-soft">
            <Building2 className="h-5 w-5 text-violet-accent" />
          </span>
          <div className="min-w-0">
            <h1 className="page-title !text-xl sm:!text-2xl">Bureau Profile & Verification</h1>
            <p className="page-subtitle !mt-1.5">
              Provide basic information about your bureau. These details will be used across your CRM.
            </p>
          </div>
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          <section>
            <h3 className="text-sm font-bold text-gray-900">
              <span className="text-violet-accent">A.</span> Basic Bureau Identity
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <Field label="CIN (Optional)" className="sm:col-span-2 lg:col-span-3">
                <input className="crm-input" value={(data.cinNumber as string) ?? ""} onChange={(e) => onChange({ cinNumber: e.target.value })} />
              </Field>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-900">
              <span className="text-violet-accent">B.</span> Services Offered
            </h3>
            <p className="mt-1 text-xs text-gray-500">Select all services your bureau provides</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
              {SERVICE_ITEMS.map(({ id, label, Icon }) => {
                const selected = serviceIds.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleService(id)}
                    className={`relative flex min-h-[108px] flex-col items-center justify-center rounded-xl border-2 px-3 py-4 text-center transition ${
                      selected ? "border-violet-accent bg-violet-soft/50" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded bg-violet-accent text-white">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                    )}
                    <span
                      className={`mb-2.5 flex h-10 w-10 items-center justify-center rounded-lg ${
                        selected ? "bg-violet-accent text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-semibold leading-snug text-gray-800">{label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-900">
              <span className="text-violet-accent">C.</span> Operational Snapshot
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2 lg:col-span-1">
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

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-gray-700">Primary Lead Sources (Select all that apply)</p>
              <div className="flex flex-wrap gap-2">
                {LEAD_SOURCES.map((src) => {
                  const on = leadSources.includes(src);
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => toggleSource(src)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
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

          <section>
            <h3 className="text-sm font-bold text-gray-900">
              <span className="text-violet-accent">D.</span> Verification Documents{" "}
              <span className="ml-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                Required
              </span>
            </h3>
            <p className="mt-1 text-xs text-gray-500">Upload clear, valid documents for verification.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["GST Certificate", "PAN Card", "Aadhaar Card", "Cancelled Cheque"].map((doc) => {
                const docType = profileDocTypeFromLabel(doc);
                const saved = docType ? uploads[docType] : undefined;
                const state = uploadState[doc] ?? { status: "idle" as const };
                return (
                  <div key={doc} className="rounded-xl border border-gray-200 bg-gray-50/40 p-4">
                    <p className="text-xs font-semibold text-gray-800">{doc}</p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      {saved?.fileName ? `Saved: ${saved.fileName}` : "PDF, JPG, or PNG"}
                    </p>
                    <label className="mt-3 inline-block cursor-pointer text-xs font-semibold text-violet-accent hover:underline">
                      {state.status === "uploading" ? "Uploading…" : saved ? "Replace file" : "Upload file"}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="sr-only"
                        disabled={state.status === "uploading"}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          void handleDocUpload(doc, f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {state.status === "error" && (
                      <p className="mt-2 text-[11px] leading-relaxed text-red-600">{state.message}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-gray-500">
              Documents are stored securely in Supabase. If uploads fail, configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Render.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-900">
              <span className="text-violet-accent">E.</span> Contact Details
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
              <Field label="Website (Optional)" className="sm:col-span-2">
                <input className="crm-input" value={(data.website as string) ?? ""} onChange={(e) => onChange({ website: e.target.value })} />
              </Field>
            </div>
          </section>
        </div>
      </div>

      {footer && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="px-0 sm:px-1">{footer}</div>
        </div>
      )}
    </div>
  );
}
