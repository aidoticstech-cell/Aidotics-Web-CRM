"use client";

import { Landmark, Pencil, Trash2, Check, CircleHelp } from "lucide-react";
import { Field, InfoBox } from "@/components/ui/FormBits";
import { AsideCard, StepLayout } from "@/components/onboarding/StepLayout";
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

export function StepBranchBilling({ data, onChange, footer }: StepProps) {
  const branches = (data.branches as Branch[]) || DEFAULT_BRANCHES;
  const prefix = (data.invoicePrefix as string) || "INV";
  const start = (data.invoiceStart as string) || "1001";

  return (
    <StepLayout
      icon={Landmark}
      title="Branches & Billing"
      subtitle="Add branches/offices and configure billing, GST, and payment collection preferences."
      tabs={["Branches / Offices", "Billing & GST", "Payment Collection", "Branch Access"]}
      activeTab={0}
      footer={footer}
      aside={
        <>
          <AsideCard title="Billing Summary">
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between"><dt className="text-gray-500">GST Type</dt><dd>Regular</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Place of Supply</dt><dd>Haryana (06)</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Invoice Prefix</dt><dd>{prefix}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Financial Year</dt><dd>1 Apr 2025 - 31 Mar 2026</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Next Invoice Number</dt><dd>{prefix}{start}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Primary Bank</dt><dd>HDFC Bank</dd></div>
            </dl>
          </AsideCard>
          <AsideCard title="Why is this important?">
            <ul className="space-y-2 text-xs text-gray-600">
              {[
                "Branches help you manage operations across locations.",
                "Billing settings ensure accurate invoicing and GST compliance.",
                "Payment methods allow smooth collection of payments.",
                "User assignment gives the right people access to the right branch.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CircleHelp className="mt-0.5 h-3.5 w-3.5 text-gray-400" />
                  {t}
                </li>
              ))}
            </ul>
          </AsideCard>
          <InfoBox variant="blue" title="Need help setting this up?">
            <p className="text-xs text-gray-700">Our onboarding expert can guide you to complete this step quickly.</p>
            <button type="button" className="btn-outline-purple mt-3 w-full !py-2 text-xs">Schedule a Call</button>
          </InfoBox>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-xs text-emerald-800">
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Use branch-level access in CRM. You can update branch managers and controllers later.</span>
            </div>
          </div>
        </>
      }
    >
      <div className="mt-2">
          <section className="mb-10 rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">A.</span> Branches / Offices</h3>
            <p className="mt-1 text-xs text-gray-500">Add all your operational locations.</p>
            <div className="mb-4 flex justify-end">
              <button type="button" className="btn-outline-purple !gap-2 text-xs">
                + Add Branch
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Branch Name</th>
                    <th className="px-4 py-3">Branch Type</th>
                    <th className="px-4 py-3">City / State</th>
                    <th className="px-4 py-3">Branch Manager</th>
                    <th className="px-4 py-3">Contact</th>
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
                      <td className="px-4 py-3.5 text-gray-700">{b.city}, Haryana</td>
                      <td className="px-4 py-3.5 text-gray-700">Rahul Sharma</td>
                      <td className="px-4 py-3.5 text-gray-700">98765 43210</td>
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
            <p className="mt-3 text-xs text-gray-500">You can add more branches later from settings.</p>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">B.</span> Billing & GST Setup</h3>
              <p className="mt-1 text-xs text-gray-500">Configure GST and invoicing preferences.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field label="GST Number" required>
                  <input className="crm-input" value={(data.gstNumber as string) || ""} onChange={(e) => onChange({ gstNumber: e.target.value })} placeholder="27ABCDE1234F1Z5" />
                </Field>
                <Field label="GST Type" required>
                  <select className="crm-select" value={(data.gstType as string) || "REGULAR"} onChange={(e) => onChange({ gstType: e.target.value })}>
                    <option value="REGULAR">Regular</option>
                    <option value="COMPOSITION">Composition</option>
                  </select>
                </Field>
                <Field label="Financial Year" required>
                  <input className="crm-input" value={(data.financialYear as string) || "1 Apr 2025 - 31 Mar 2026"} onChange={(e) => onChange({ financialYear: e.target.value })} />
                </Field>
                <Field label="Invoice Start Number" required hint={`Next invoice: ${prefix}${start}`}>
                  <input className="crm-input" value={start} onChange={(e) => onChange({ invoiceStart: e.target.value })} />
                </Field>
                <Field label="Invoice Prefix" required>
                  <input className="crm-input" value={prefix} onChange={(e) => onChange({ invoicePrefix: e.target.value })} />
                </Field>
                <Field label="Place of Supply" required>
                  <select className="crm-select" value={(data.placeOfSupply as string) || "06"} onChange={(e) => onChange({ placeOfSupply: e.target.value })}>
                    <option value="06">Haryana (06)</option>
                    <option value="07">Delhi (07)</option>
                    <option value="09">Uttar Pradesh (09)</option>
                  </select>
                </Field>
              </div>
              <p className="mt-3 text-[11px] text-gray-500">These settings will be used while generating invoices.</p>
            </section>

            <section className="rounded-xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">C.</span> Payment Collection Setup</h3>
              <p className="mt-1 text-xs text-gray-500">Add payment methods to collect payments from clients.</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-gray-200 p-3">
                  <p className="text-xs font-semibold text-violet-accent">Bank Account</p>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <Field label="Account Holder Name" required>
                      <input className="crm-input" value={(data.accountHolder as string) || "Healing Hands Healthcare Services Pvt. Ltd."} onChange={(e) => onChange({ accountHolder: e.target.value })} />
                    </Field>
                    <Field label="Bank Name" required>
                      <input className="crm-input" value={(data.bankName as string) || "HDFC Bank"} onChange={(e) => onChange({ bankName: e.target.value })} />
                    </Field>
                    <Field label="Account Number" required>
                      <input className="crm-input" value={(data.accountNumber as string) || ""} onChange={(e) => onChange({ accountNumber: e.target.value })} />
                    </Field>
                    <Field label="IFSC Code" required>
                      <input className="crm-input" value={(data.ifsc as string) || ""} onChange={(e) => onChange({ ifsc: e.target.value })} />
                    </Field>
                  </div>
                </div>
                <div className="rounded-xl border border-dashed border-gray-200 p-3 text-center">
                  <p className="text-xs text-gray-500">Upload Cheque / Passbook</p>
                  <button type="button" className="mt-2 text-xs font-semibold text-violet-accent">Upload File</button>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-gray-500">At least one active payment method is required.</p>
            </section>
          </div>

          <section className="mt-8 rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">D.</span> Branch Access & User Assignment</h3>
            <p className="mt-1 text-xs text-gray-500">Assign branch-level access to key users.</p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Branch</th>
                    <th className="px-4 py-3">Branch Manager</th>
                    <th className="px-4 py-3">Operations Head</th>
                    <th className="px-4 py-3">Finance Controller</th>
                    <th className="px-4 py-3">Coordinators</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {["Head Office", "Noida Branch", "Faridabad Branch"].map((row) => (
                    <tr key={row} className="border-t border-gray-100 bg-white">
                      <td className="px-4 py-3.5 font-semibold text-gray-900">{row}</td>
                      <td className="px-4 py-3.5 text-gray-700">Rahul Sharma</td>
                      <td className="px-4 py-3.5 text-gray-700">Neha Patel</td>
                      <td className="px-4 py-3.5 text-gray-700">Anmol Jain</td>
                      <td className="px-4 py-3.5 text-gray-700">+3</td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-gray-500">Users must have branch access in CRM. You can add users from Team Administration.</p>
          </section>
      </div>
    </StepLayout>
  );
}
