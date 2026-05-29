"use client";

import { Fingerprint, CreditCard, Car, FileText, Vote } from "lucide-react";
import { Field, Toggle } from "@/components/ui/FormBits";
import { SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const METHODS = [
  { id: "aadhaar", label: "Aadhaar eKYC", tag: "Recommended", Icon: Fingerprint },
  { id: "pan", label: "PAN Verification", tag: "Recommended", Icon: CreditCard },
  { id: "dl", label: "Driving License", Icon: Car },
  { id: "passport", label: "Passport", Icon: FileText },
  { id: "voter", label: "Voter ID", Icon: Vote },
];

export function StepDigitalIdentity({ data, onChange, footer }: StepProps) {
  const enabled = (data.methods as string[]) || ["aadhaar", "pan"];

  return (
    <StepLayout
      icon={Fingerprint}
      title="Digital Identity System"
      subtitle="Configure identity verification methods and security settings."
      footer={footer}
    >
      <SectionBlock letter="A" title="Identity Verification Methods" subtitle="Choose methods to enable for clients and staff.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {METHODS.map((m) => {
            const on = enabled.includes(m.id);
            const Icon = m.Icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChange({ methods: on ? enabled.filter((x) => x !== m.id) : [...enabled, m.id] })}
                className={`relative rounded-xl border-2 p-4 text-left ${on ? "border-violet-accent bg-violet-soft/40" : "border-gray-200"}`}
              >
                {m.tag && <span className="absolute right-2 top-2 rounded bg-emerald-100 px-1.5 text-[9px] font-bold text-emerald-700">{m.tag}</span>}
                <Icon className={`mb-2 h-6 w-6 ${on ? "text-violet-accent" : "text-gray-400"}`} />
                <p className="text-sm font-bold">{m.label}</p>
                <input type="checkbox" checked={on} readOnly className="absolute bottom-3 right-3 accent-violet-accent" />
              </button>
            );
          })}
        </div>
        <div className="mt-4">
          <Toggle label="Offline Verification" description="Allow manual document verification when eKYC is unavailable." checked={!!data.offlineVerify} onChange={(v) => onChange({ offlineVerify: v })} />
        </div>
      </SectionBlock>

      <SectionBlock letter="B" title="Security & Authentication Settings">
        <div className="grid gap-3 md:grid-cols-2">
          <Toggle label="Two-Factor Authentication (2FA)" checked={data.twoFa !== false} onChange={(v) => onChange({ twoFa: v })} />
          <Toggle label="IP Restrictions" checked={!!data.ipRestrict} onChange={(v) => onChange({ ipRestrict: v })} />
          <Field label="Session Timeout">
            <select className="crm-select" value={(data.sessionTimeout as string) || "30"} onChange={(e) => onChange({ sessionTimeout: e.target.value })}>
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="60">60 Minutes</option>
            </select>
          </Field>
          <Toggle label="Device Management" checked={data.deviceMgmt !== false} onChange={(v) => onChange({ deviceMgmt: v })} />
          <Field label="Login Attempt Limit">
            <select className="crm-select" value={(data.loginLimit as string) || "5"} onChange={(e) => onChange({ loginLimit: e.target.value })}>
              <option value="3">3 Attempts</option>
              <option value="5">5 Attempts</option>
            </select>
          </Field>
          <Toggle label="Audit Log" checked={data.auditLog !== false} onChange={(v) => onChange({ auditLog: v })} />
        </div>
      </SectionBlock>

      <SectionBlock letter="C" title="Document Security">
        <div className="grid gap-3 md:grid-cols-3">
          <Toggle label="Document Encryption" checked={data.docEncrypt !== false} onChange={(v) => onChange({ docEncrypt: v })} />
          <Field label="Document Retention">
            <select className="crm-select" value={(data.retention as string) || "7"} onChange={(e) => onChange({ retention: e.target.value })}>
              <option value="5">5 Years</option>
              <option value="7">7 Years</option>
              <option value="10">10 Years</option>
            </select>
          </Field>
          <Toggle label="Auto Mask Sensitive Data" checked={data.autoMask !== false} onChange={(v) => onChange({ autoMask: v })} />
        </div>
      </SectionBlock>
    </StepLayout>
  );
}
