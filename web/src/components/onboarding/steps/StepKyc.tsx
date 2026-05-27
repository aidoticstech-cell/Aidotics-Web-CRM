"use client";

import { Check, Shield } from "lucide-react";
import { Field, Section, InfoBox } from "@/components/ui/FormBits";
import type { StepProps } from "./types";

const DOCS = ["PAN Card", "GST Certificate", "Incorporation Certificate", "MOA / AOA", "Address Proof", "Director ID Proof", "Cancelled Cheque"];

export function StepKyc({ data, onChange }: StepProps) {
  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
      <div>
        <div className="flex items-start gap-3">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-soft sm:flex">
            <Shield className="h-6 w-6 text-violet-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KYC & Verification</h1>
            <p className="mt-1 text-sm text-gray-500">Provide ownership, registered address, and authorized signatory details for compliance.</p>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <Section title="Ownership Details">
            <Field label="Ownership Type" required>
              <select
                className="crm-select"
                value={(data.ownershipType as string) || "PRIVATE_LIMITED"}
                onChange={(e) => onChange({ ownershipType: e.target.value })}
              >
                <option value="PRIVATE_LIMITED">Private Limited Company</option>
                <option value="LLP">LLP</option>
                <option value="PROPRIETORSHIP">Proprietorship</option>
                <option value="PARTNERSHIP">Partnership</option>
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="PAN Number" required>
                <input className="crm-input" value={(data.pan as string) || ""} onChange={(e) => onChange({ pan: e.target.value })} placeholder="AAACC1234C" />
              </Field>
              <Field label="GST Number" hint="Optional">
                <input className="crm-input" value={(data.gst as string) || ""} onChange={(e) => onChange({ gst: e.target.value })} placeholder="07AAACC1234C1Z5" />
              </Field>
            </div>
          </Section>

          <Section title="Registered Address">
            <Field label="Address Line 1" required>
              <input className="crm-input" value={(data.address1 as string) || ""} onChange={(e) => onChange({ address1: e.target.value })} placeholder="123, Park Street" />
            </Field>
            <Field label="Address Line 2" hint="Optional">
              <input className="crm-input" value={(data.address2 as string) || ""} onChange={(e) => onChange({ address2: e.target.value })} placeholder="Near City Centre Mall" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="City" required>
                <input className="crm-input" value={(data.city as string) || ""} onChange={(e) => onChange({ city: e.target.value })} placeholder="New Delhi" />
              </Field>
              <Field label="State" required>
                <select className="crm-select" value={(data.state as string) || "Delhi"} onChange={(e) => onChange({ state: e.target.value })}>
                  <option>Delhi</option>
                  <option>Haryana</option>
                  <option>Uttar Pradesh</option>
                </select>
              </Field>
              <Field label="PIN Code" required>
                <input className="crm-input" value={(data.pincode as string) || ""} onChange={(e) => onChange({ pincode: e.target.value })} placeholder="110001" />
              </Field>
            </div>
          </Section>

          <Section title="Authorized Signatory / Director Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" required>
                <input className="crm-input" value={(data.signatoryName as string) || ""} onChange={(e) => onChange({ signatoryName: e.target.value })} />
              </Field>
              <Field label="Designation" required>
                <input className="crm-input" value={(data.signatoryRole as string) || ""} onChange={(e) => onChange({ signatoryRole: e.target.value })} placeholder="Director" />
              </Field>
              <Field label="DIN Number" hint="Optional">
                <input className="crm-input" value={(data.signatoryDin as string) || ""} onChange={(e) => onChange({ signatoryDin: e.target.value })} placeholder="09012345" />
              </Field>
              <Field label="Date of Birth" required>
                <input type="date" className="crm-input" value={(data.signatoryDob as string) || ""} onChange={(e) => onChange({ signatoryDob: e.target.value })} />
              </Field>
              <Field label="Mobile Number" required>
                <input className="crm-input" value={(data.signatoryMobile as string) || ""} onChange={(e) => onChange({ signatoryMobile: e.target.value })} placeholder="+91 98765 43210" />
              </Field>
              <Field label="Email Address" required>
                <input className="crm-input" type="email" value={(data.signatoryEmail as string) || ""} onChange={(e) => onChange({ signatoryEmail: e.target.value })} />
              </Field>
            </div>
          </Section>

          <Section title="Business Verification">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Entity Incorporation Date" required>
                <input type="date" className="crm-input" value={(data.incorporationDate as string) || ""} onChange={(e) => onChange({ incorporationDate: e.target.value })} />
              </Field>
              <Field label="Udyam Registration" hint="Optional">
                <input className="crm-input" value={(data.udyam as string) || ""} onChange={(e) => onChange({ udyam: e.target.value })} placeholder="UDYAM-DL-07-0001234" />
              </Field>
              <Field label="Professional Tax Number" hint="Optional">
                <input className="crm-input" value={(data.professionalTax as string) || ""} onChange={(e) => onChange({ professionalTax: e.target.value })} placeholder="PT/2023/1234567" />
              </Field>
            </div>
          </Section>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="crm-card">
          <h3 className="font-bold text-gray-900">KYC Documents Required</h3>
          <ul className="mt-4 space-y-2.5">
            {DOCS.map((d) => (
              <li key={d} className="flex items-center justify-between gap-2 text-sm text-gray-700">
                <span>{d}</span>
                <span className="badge-required">Required</span>
              </li>
            ))}
          </ul>
        </div>

        <InfoBox variant="green" title="Why KYC Verification?">
          <ul className="space-y-2 text-xs leading-relaxed">
            {["Meet regulatory compliance for healthcare staffing", "Protect your bureau from fraud and disputes", "Enable secure payments and invoicing", "Build trust with hospitals and clients"].map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </InfoBox>

        <div className="rounded-xl border border-violet-100 bg-violet-soft/60 p-4">
          <div className="flex gap-2">
            <Shield className="h-5 w-5 shrink-0 text-violet-accent" />
            <div>
              <p className="text-sm font-bold text-violet-deep">Security Notice</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">All information is secure and encrypted. Your data is protected with bank-level security.</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
