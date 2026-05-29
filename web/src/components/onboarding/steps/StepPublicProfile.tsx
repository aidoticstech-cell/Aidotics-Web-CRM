"use client";

import { Globe } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import { SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

export function StepPublicProfile({ data, onChange, footer }: StepProps) {
  return (
    <StepLayout
      icon={Globe}
      title="Public Brand Profile"
      subtitle="Build your public presence and showcase your services to clients."
      tabs={["Branding", "Services Showcase", "Trust & Reviews", "SEO & Discoverability", "Sharing & QR"]}
      activeTab={0}
      footer={footer}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionBlock letter="A" title="Branding Information" subtitle="This information will be visible on your public profile." className="lg:col-span-2">
          <div className="grid gap-4 lg:grid-cols-[140px_1fr]">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl bg-violet-soft text-xl font-black text-violet-accent">HH</div>
              <p className="mt-2 text-xs font-semibold text-gray-700">Healing Hands</p>
              <button type="button" className="btn-outline-purple mt-3 w-full !py-1.5 text-[11px]">Change Logo</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Bureau Name (Display Name)">
                <input className="crm-input" value={(data.publicName as string) || "Healing Hands Healthcare Services"} onChange={(e) => onChange({ publicName: e.target.value })} />
              </Field>
              <Field label="Tagline / Slogan">
                <input className="crm-input" value={(data.tagline as string) || "Compassionate Care. Trusted Support."} onChange={(e) => onChange({ tagline: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="About Us">
                  <textarea
                    className="crm-input min-h-[90px]"
                    maxLength={500}
                    value={(data.shortDesc as string) || "Healing Hands Healthcare Services is a trusted healthcare staffing bureau providing trained and verified nurses, caregivers, and attendants for families and home care across multiple cities."}
                    onChange={(e) => onChange({ shortDesc: e.target.value })}
                  />
                  <p className="mt-1 text-right text-[10px] text-gray-400">{String((data.shortDesc as string) || "").length || 197} / 500</p>
                </Field>
              </div>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock letter="B" title="Services You Offer" subtitle="Select and highlight the services to showcase.">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              "Nursing Care",
              "ICU & Critical Care",
              "Patient Attendant",
              "Elder Care",
              "Baby Care / Nanny",
              "Physiotherapy",
              "Doctor Visit",
              "Medical Equipment",
              "Other Services",
            ].map((service, idx) => (
              <label key={service} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2 text-xs">
                <span>{service}</span>
                <input
                  type="checkbox"
                  className="accent-violet-accent"
                  checked={Array.isArray(data.services) ? (data.services as string[]).includes(service) : idx < 6}
                  onChange={(e) => {
                    const current = Array.isArray(data.services) ? (data.services as string[]) : [];
                    const next = e.target.checked ? [...new Set([...current, service])] : current.filter((s) => s !== service);
                    onChange({ services: next });
                  }}
                />
              </label>
            ))}
          </div>
          <button type="button" className="btn-outline-purple mt-3 w-full !py-2 text-xs">+ Add Custom Service</button>
        </SectionBlock>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionBlock letter="C" title="Trust & Credibility" subtitle="Build trust with your clients by adding credibility elements.">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Years of Experience">
              <select className="crm-select" value={(data.yearsExp as string) || "8"} onChange={(e) => onChange({ yearsExp: e.target.value })}>
                <option value="3">3+ Years</option>
                <option value="5">5+ Years</option>
                <option value="8">8+ Years</option>
                <option value="10">10+ Years</option>
              </select>
            </Field>
            <Field label="Active Staff">
              <input className="crm-input" value={(data.activeStaff as string) || "245"} onChange={(e) => onChange({ activeStaff: e.target.value })} />
            </Field>
            <Field label="Monthly Duties">
              <input className="crm-input" value={(data.monthlyDuties as string) || "1200+"} onChange={(e) => onChange({ monthlyDuties: e.target.value })} />
            </Field>
          </div>
          <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50/60 p-3 text-xs">
            <p className="font-semibold text-gray-800">Certificates & Accreditations</p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>Trade License 2024.pdf</li>
              <li>ISO 9001:2015.pdf</li>
              <li>GST Certificate.pdf</li>
            </ul>
          </div>
        </SectionBlock>

        <SectionBlock letter="D" title="Gallery" subtitle="Add photos that represent your bureau.">
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[4/3] rounded-lg border border-gray-200 bg-gradient-to-br from-sky-100 to-emerald-100" />
            ))}
          </div>
          <button type="button" className="btn-outline-purple mt-3 w-full !py-2 text-xs">+ Add More Photos</button>
          <p className="mt-1 text-center text-[10px] text-gray-500">You can upload up to 10 images.</p>
        </SectionBlock>

        <SectionBlock letter="E" title="Contact Information (Public)" subtitle="This contact info will be visible on your public profile.">
          <div className="space-y-2">
            <Field label="Phone / WhatsApp">
              <input className="crm-input" value={(data.phone as string) || "+91 98766 43210"} onChange={(e) => onChange({ phone: e.target.value })} />
            </Field>
            <Field label="Email">
              <input className="crm-input" type="email" value={(data.email as string) || "info@healinghands.com"} onChange={(e) => onChange({ email: e.target.value })} />
            </Field>
            <Field label="Website">
              <input className="crm-input" value={(data.website as string) || "www.healinghands.com"} onChange={(e) => onChange({ website: e.target.value })} />
            </Field>
            <Field label="Address">
              <input className="crm-input" value={(data.address as string) || "Gurgaon, Haryana, India"} onChange={(e) => onChange({ address: e.target.value })} />
            </Field>
          </div>
        </SectionBlock>
      </div>
    </StepLayout>
  );
}
