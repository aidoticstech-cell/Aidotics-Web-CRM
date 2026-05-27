"use client";

import { Landmark, Pencil, Trash2 } from "lucide-react";
import { Field, Section, InfoBox } from "@/components/ui/FormBits";
import type { StepProps } from "./types";

type Branch = { id: string; name: string; type: string; address: string; city: string; pincode: string; status: string };

const DEFAULT_BRANCHES: Branch[] = [
  { id: "1", name: "Head Office", type: "Head Office", address: "123, Connaught Place, Block A", city: "New Delhi", pincode: "110001", status: "Active" },
  { id: "2", name: "Gurgaon Branch", type: "Branch", address: "Sector 29, MG Road", city: "Gurgaon", pincode: "122001", status: "Active" },
  { id: "3", name: "Noida Partner Hub", type: "Partner", address: "Sector 62, IT Park", city: "Noida", pincode: "201301", status: "Active" },
  { id: "4", name: "Faridabad Unit", type: "Branch", address: "NIT-5, Main Road", city: "Faridabad", pincode: "121001", status: "Active" },
];

function typeBadge(type: string) {
  if (type === "Head Office") return "bg-emerald-100 text-emerald-800";
  if (type === "Partner") return "bg-amber-100 text-amber-800";
  return "bg-sky-100 text-sky-800";
}

export function StepBranchBilling({ data, onChange }: StepProps) {
  const branches = (data.branches as Branch[]) || DEFAULT_BRANCHES;
  const prefix = (data.invoicePrefix as string) || "AID";
  const start = (data.invoiceStart as string) || "1001";

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
      <div>
        <div className="flex items-start gap-3">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-soft sm:flex">
            <Landmark className="h-6 w-6 text-violet-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Branch & Billing Setup</h1>
            <p className="mt-1 text-sm text-gray-500">Add your branches and configure billing details for invoicing and tax compliance.</p>
          </div>
        </div>

        <div className="mt-8">
          <Section letter="A" title="Branch Management" subtitle="Add all your operating branches. You can add more branches later from settings.">
            <div className="mb-4 flex justify-end">
              <button type="button" className="btn-outline-purple !gap-2 text-sm">
                + Add Branch
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Branch Name</th>
                    <th className="px-4 py-3">Branch Type</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">City</th>
                    <th className="px-4 py-3">Pincode</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((b) => (
                    <tr key={b.id} className="border-t border-gray-100 bg-white hover:bg-gray-50/50">
                      <td className="px-4 py-3.5 font-semibold text-gray-900">{b.name}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeBadge(b.type)}`}>{b.type}</span>
                      </td>
                      <td className="max-w-[200px] px-4 py-3.5 text-gray-600">
                        <span className="line-clamp-2">{b.address}</span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">{b.city}</td>
                      <td className="px-4 py-3.5 font-mono text-gray-700">{b.pincode}</td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{b.status}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button type="button" className="mr-1 inline-flex rounded-lg p-2 text-violet-accent hover:bg-violet-soft" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" className="inline-flex rounded-lg p-2 text-violet-accent hover:bg-violet-soft" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-center text-xs text-gray-500">
              Showing 1 to {branches.length} of {branches.length} branches.
            </p>
          </Section>

          <Section letter="B" title="Billing Information" subtitle="Configure your billing and invoicing preferences.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="GST Number" required>
                <div className="relative">
                  <input className="crm-input pr-24" value={(data.gstNumber as string) || ""} onChange={(e) => onChange({ gstNumber: e.target.value })} placeholder="07AAACC1234C1Z5" />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-emerald-600">Verified</span>
                </div>
              </Field>
              <Field label="Billing Currency" required>
                <select className="crm-select" value={(data.currency as string) || "INR"} onChange={(e) => onChange({ currency: e.target.value })}>
                  <option value="INR">INR - Indian Rupee (₹)</option>
                  <option value="USD">USD - US Dollar</option>
                </select>
              </Field>
              <Field label="GST Type" required>
                <select className="crm-select" value={(data.gstType as string) || "REGULAR"} onChange={(e) => onChange({ gstType: e.target.value })}>
                  <option value="REGULAR">Regular</option>
                  <option value="COMPOSITION">Composition</option>
                </select>
              </Field>
              <Field label="Business PAN" required>
                <div className="relative">
                  <input className="crm-input pr-24" value={(data.panNumber as string) || ""} onChange={(e) => onChange({ panNumber: e.target.value })} placeholder="AAACC1234C" />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-emerald-600">Verified</span>
                </div>
              </Field>
              <Field label="Invoice Start Number" required hint={`Next invoice will be: ${prefix}-${start}`}>
                <input className="crm-input" value={start} onChange={(e) => onChange({ invoiceStart: e.target.value })} />
              </Field>
              <Field label="Tax Calculation">
                <select className="crm-select" value={(data.taxCalculation as string) || "EXCLUSIVE"} onChange={(e) => onChange({ taxCalculation: e.target.value })}>
                  <option value="EXCLUSIVE">Exclusive of Tax</option>
                  <option value="INCLUSIVE">Inclusive of Tax</option>
                </select>
              </Field>
              <Field label="Invoice Prefix" required hint="This prefix will be used in all your invoices. Example: AID-0001">
                <input className="crm-input" value={prefix} onChange={(e) => onChange({ invoicePrefix: e.target.value })} />
              </Field>
              <Field label="Payment Terms" required>
                <select className="crm-select" value={(data.paymentTerms as string) || "7"} onChange={(e) => onChange({ paymentTerms: e.target.value })}>
                  <option value="7">7 Days</option>
                  <option value="15">15 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </Field>
              <Field label="Place of Supply" required>
                <select className="crm-select" value={(data.placeOfSupply as string) || "07"} onChange={(e) => onChange({ placeOfSupply: e.target.value })}>
                  <option value="07">Delhi (07)</option>
                  <option value="06">Haryana (06)</option>
                  <option value="09">Uttar Pradesh (09)</option>
                </select>
              </Field>
            </div>
          </Section>
        </div>
      </div>

      <aside className="space-y-4">
        <InfoBox variant="green" title="Why Billing Setup is Important?">
          <ul className="space-y-2 text-xs">
            {["Generate professional invoices with correct GST", "Ensure tax compliance across branches", "Faster reconciliation with clients", "Clear audit trail for accounts"].map((t) => (
              <li key={t} className="flex gap-2 text-gray-700">
                <span className="text-emerald-600">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </InfoBox>

        <div className="crm-card overflow-hidden">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Billing Preview</p>
          <div className="mt-4 rounded-lg border border-gray-100 bg-gradient-to-b from-white to-gray-50/80 p-4 text-xs shadow-inner">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="font-bold text-violet-accent">aidotics</span>
              <span className="text-gray-400">INV</span>
            </div>
            <p className="mt-2 font-bold text-gray-900">CarePlus Healthcare Services Pvt. Ltd.</p>
            <p className="text-gray-500">Bill To: XYZ Hospitals</p>
            <p className="mt-2 text-gray-400">27 May 2026</p>
            <table className="mt-3 w-full text-left">
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="py-1.5 text-gray-600">Nursing Care Service</td>
                  <td className="py-1.5 text-right font-semibold text-gray-900">11,800.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-violet-100 bg-violet-soft/50 p-4 text-xs leading-relaxed text-gray-600">
          <span className="font-semibold text-violet-deep">Note: </span>
          You can add or update branches and billing information anytime from Settings.
        </div>
      </aside>
    </div>
  );
}
