"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import { FormModal } from "@/components/onboarding/FormModal";
import { StepToast } from "@/components/onboarding/StepToast";
import { SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const SERVICE_OPTIONS = [
  "Nursing Care",
  "ICU & Critical Care",
  "Patient Attendant",
  "Elder Care",
  "Baby Care / Nanny",
  "Physiotherapy",
  "Doctor Visit",
  "Medical Equipment",
  "Other Services",
];

export function StepPublicProfile({ data, onChange, footer }: StepProps) {
  const services = Array.isArray(data.services) ? (data.services as string[]) : SERVICE_OPTIONS.slice(0, 6);
  const gallery = Array.isArray(data.gallery) ? (data.gallery as { id: string; name: string }[]) : [];
  const logoPreview = (data.logoPreview as string) || "";
  const publicName = (data.publicName as string) || "";
  const initials = (publicName || "HH").slice(0, 2).toUpperCase();
  const [toast, setToast] = useState<string | null>(null);
  const [serviceModal, setServiceModal] = useState(false);
  const [customService, setCustomService] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleLogo(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ logoPreview: reader.result as string, logoFileName: file.name });
      showToast("Logo updated.");
    };
    reader.readAsDataURL(file);
  }

  function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    const next = [...gallery];
    Array.from(files).forEach((f) => {
      if (next.length < 10) next.push({ id: `${Date.now()}-${f.name}`, name: f.name });
    });
    onChange({ gallery: next });
    showToast(`${files.length} photo(s) added to gallery.`);
  }

  return (
    <>
      <StepToast message={toast} />
      <FormModal open={serviceModal} title="Add Custom Service" onClose={() => setServiceModal(false)} onSubmit={() => {
        if (!customService.trim()) return;
        onChange({ services: [...new Set([...services, customService.trim()])] });
        setCustomService("");
        setServiceModal(false);
        showToast("Service added to showcase.");
      }}>
        <Field label="Service Name" required><input className="crm-input" value={customService} onChange={(e) => setCustomService(e.target.value)} /></Field>
      </FormModal>

      <StepLayout icon={Globe} title="Public Brand Profile" subtitle="Build your public presence and showcase your services to clients." footer={footer}>
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionBlock letter="A" title="Branding Information" className="lg:col-span-2">
            <div className="grid gap-4 lg:grid-cols-[140px_1fr]">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="mx-auto h-20 w-20 rounded-xl object-cover" />
                ) : (
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl bg-violet-soft text-xl font-black text-violet-accent">{initials}</div>
                )}
                <label className="btn-outline-purple mt-3 flex w-full cursor-pointer justify-center !py-1.5 text-[11px]">
                  Change Logo
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleLogo(e.target.files?.[0])} />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Bureau Name (Display Name)">
                  <input className="crm-input" value={publicName} onChange={(e) => onChange({ publicName: e.target.value })} />
                </Field>
                <Field label="Tagline / Slogan">
                  <input className="crm-input" value={(data.tagline as string) || ""} onChange={(e) => onChange({ tagline: e.target.value })} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="About Us">
                    <textarea className="crm-input min-h-[90px]" maxLength={500} value={(data.shortDesc as string) || ""} onChange={(e) => onChange({ shortDesc: e.target.value })} />
                  </Field>
                </div>
              </div>
            </div>
          </SectionBlock>

          <SectionBlock letter="B" title="Services You Offer">
            <div className="grid gap-2 sm:grid-cols-2">
              {SERVICE_OPTIONS.map((service) => (
                <label key={service} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2 text-xs">
                  <span>{service}</span>
                  <input
                    type="checkbox"
                    className="accent-violet-accent"
                    checked={services.includes(service)}
                    onChange={(e) => {
                      const next = e.target.checked ? [...new Set([...services, service])] : services.filter((s) => s !== service);
                      onChange({ services: next });
                    }}
                  />
                </label>
              ))}
            </div>
            <button type="button" className="btn-outline-purple mt-3 w-full !py-2 text-xs" onClick={() => setServiceModal(true)}>+ Add Custom Service</button>
          </SectionBlock>
        </div>

        <SectionBlock letter="D" title="Gallery">
          <div className="grid grid-cols-4 gap-2">
            {gallery.map((g) => (
              <div key={g.id} className="relative aspect-[4/3] rounded-lg border border-gray-200 bg-gradient-to-br from-sky-100 to-emerald-100 p-2 text-[9px] font-medium text-gray-600">
                {g.name}
                <button type="button" className="absolute right-1 top-1 rounded bg-red-500 px-1 text-white" onClick={() => onChange({ gallery: gallery.filter((x) => x.id !== g.id) })}>×</button>
              </div>
            ))}
            {gallery.length < 10 && (
              <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 text-[10px] text-gray-500">
                + Add
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addPhotos(e.target.files)} />
              </label>
            )}
          </div>
          <label className="btn-outline-purple mt-3 flex w-full cursor-pointer justify-center !py-2 text-xs">
            + Add More Photos
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addPhotos(e.target.files)} />
          </label>
        </SectionBlock>
      </StepLayout>
    </>
  );
}
