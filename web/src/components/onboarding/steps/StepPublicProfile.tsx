"use client";

import { Globe, Upload, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { Field, Toggle } from "@/components/ui/FormBits";
import { AsideCard, SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
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
      aside={
        <>
          <AsideCard title="Public Profile Preview">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-soft text-lg font-bold text-violet-accent">CP</div>
              <p className="mt-2 font-bold">CarePlus Healthcare</p>
              <p className="text-xs text-gray-500">Your Trusted Bureau Partner</p>
              <p className="mt-2 text-[11px] text-gray-600">+91 98765 43210 · Delhi NCR</p>
            </div>
            <button type="button" className="mt-3 w-full text-center text-xs font-semibold text-violet-accent hover:underline">
              View Full Profile Preview →
            </button>
          </AsideCard>
          <AsideCard title="Benefits" className="border-emerald-100 bg-emerald-50/50">
            <ul className="space-y-1 text-xs text-emerald-900">
              {["Builds trust with clients", "Improves discoverability", "Showcases your services"].map((t) => (
                <li key={t}>✓ {t}</li>
              ))}
            </ul>
          </AsideCard>
          <div className="rounded-xl border border-violet-100 bg-violet-soft/50 p-3 text-[11px]">
            Update your public profile anytime from <strong>Settings → Public Profile</strong>.
          </div>
        </>
      }
    >
      <SectionBlock letter="A" title="Bureau Information (Public View)">
        <div className="grid gap-4 lg:grid-cols-[120px_1fr]">
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
            <Upload className="h-6 w-6 text-gray-400" />
            <p className="mt-2 text-center text-[10px] text-gray-500">Upload Logo<br />PNG, JPG · 2MB</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Bureau Name" required>
              <input className="crm-input" value={(data.publicName as string) || "CarePlus Healthcare"} onChange={(e) => onChange({ publicName: e.target.value })} />
            </Field>
            <Field label="Tagline">
              <input className="crm-input" value={(data.tagline as string) || "Your Trusted Bureau Partner"} onChange={(e) => onChange({ tagline: e.target.value })} />
            </Field>
            <Field label="Established Year">
              <select className="crm-select" defaultValue="2020"><option>2020</option><option>2023</option></select>
            </Field>
            <Field label="Primary Category">
              <select className="crm-select" defaultValue="healthcare"><option value="healthcare">Healthcare Services</option></select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Short Description">
                <textarea className="crm-input min-h-[80px]" maxLength={200} value={(data.shortDesc as string) || "Professional home healthcare and nursing bureau serving Delhi NCR with 24×7 support."} onChange={(e) => onChange({ shortDesc: e.target.value })} />
                <p className="mt-1 text-right text-[10px] text-gray-400">120 / 200</p>
              </Field>
            </div>
            <Field label="Website">
              <input className="crm-input" value={(data.website as string) || "www.careplushealthcare.com"} onChange={(e) => onChange({ website: e.target.value })} />
            </Field>
          </div>
        </div>
      </SectionBlock>

      <SectionBlock letter="B" title="Contact Information (Public View)">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary Phone"><input className="crm-input" defaultValue="+91 98765 43210" /></Field>
          <Field label="Email Address"><input className="crm-input" type="email" defaultValue="info@careplus.com" /></Field>
          <Field label="Primary Address"><input className="crm-input" defaultValue="123, Connaught Place, New Delhi" /></Field>
          <Field label="Working Hours"><select className="crm-select" defaultValue="24x7"><option>24 × 7</option><option>9 AM – 7 PM</option></select></Field>
        </div>
        <div className="mt-4 flex h-32 items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-sky-50 to-emerald-50">
          <MapPin className="mr-2 h-5 w-5 text-violet-accent" />
          <button type="button" className="text-sm font-semibold text-violet-accent">Update Location</button>
        </div>
      </SectionBlock>

      <SectionBlock letter="C" title="Visibility Settings">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle label="Show Bureau Profile" checked={data.showProfile !== false} onChange={(v) => onChange({ showProfile: v })} />
          <Toggle label="Show Services" checked={data.showServices !== false} onChange={(v) => onChange({ showServices: v })} />
          <Toggle label="Show Branches" checked={data.showBranches !== false} onChange={(v) => onChange({ showBranches: v })} />
          <Toggle label="Show Team Members" checked={!!data.showTeam} onChange={(v) => onChange({ showTeam: v })} />
        </div>
      </SectionBlock>

      <SectionBlock letter="D" title="Social & Digital Presence">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { Icon: Facebook, ph: "facebook.com/careplus" },
            { Icon: Twitter, ph: "twitter.com/careplus" },
            { Icon: Linkedin, ph: "linkedin.com/company/careplus" },
            { Icon: Youtube, ph: "youtube.com/careplus" },
          ].map(({ Icon, ph }) => (
            <Field key={ph} label={Icon.name}>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input className="crm-input pl-10" placeholder={ph} />
              </div>
            </Field>
          ))}
        </div>
      </SectionBlock>
    </StepLayout>
  );
}
