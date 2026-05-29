"use client";

import { useState } from "react";
import { Landmark, Pencil, Trash2 } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import { FormModal } from "@/components/onboarding/FormModal";
import { StepToast } from "@/components/onboarding/StepToast";
import { StepLayout } from "@/components/onboarding/StepLayout";
import { newOnboardingId } from "@/lib/onboarding-id";
import type { StepProps } from "./types";

export type Branch = {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  pincode: string;
  status: string;
  manager?: string;
  contact?: string;
};

const DEFAULT_BRANCHES: Branch[] = [
  { id: "1", name: "Head Office", type: "Head Office", address: "123, Connaught Place, Block A", city: "New Delhi", pincode: "110001", status: "Active", manager: "Rahul Sharma", contact: "98765 43210" },
  { id: "2", name: "Gurgaon Branch", type: "Branch", address: "Sector 29, MG Road", city: "Gurgaon", pincode: "122001", status: "Active", manager: "Neha Patel", contact: "98765 43211" },
];

const EMPTY_BRANCH: Omit<Branch, "id"> = {
  name: "",
  type: "Branch",
  address: "",
  city: "",
  pincode: "",
  status: "Active",
  manager: "",
  contact: "",
};

function typeBadge(type: string) {
  if (type === "Head Office") return "bg-emerald-100 text-emerald-800";
  if (type === "Partner") return "bg-amber-100 text-amber-800";
  return "bg-sky-100 text-sky-800";
}

export function StepBranchBilling({ data, onChange, footer }: StepProps) {
  const branches = (data.branches as Branch[])?.length ? (data.branches as Branch[]) : DEFAULT_BRANCHES;
  const prefix = (data.invoicePrefix as string) || "INV";
  const start = (data.invoiceStart as string) || "1001";
  const [tab, setTab] = useState(0);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Branch, "id">>(EMPTY_BRANCH);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function openAdd() {
    setForm(EMPTY_BRANCH);
    setEditingId(null);
    setModal("add");
  }

  function openEdit(b: Branch) {
    setForm({ name: b.name, type: b.type, address: b.address, city: b.city, pincode: b.pincode, status: b.status, manager: b.manager || "", contact: b.contact || "" });
    setEditingId(b.id);
    setModal("edit");
  }

  function saveBranch() {
    if (!form.name.trim() || !form.city.trim()) {
      showToast("Branch name and city are required.");
      return;
    }
    if (modal === "edit" && editingId) {
      onChange({ branches: branches.map((b) => (b.id === editingId ? { ...b, ...form } : b)) });
      showToast("Branch updated.");
    } else {
      onChange({ branches: [...branches, { ...form, id: newOnboardingId() }] });
      showToast("Branch added.");
    }
    setModal(null);
  }

  function deleteBranch(id: string) {
    if (branches.length <= 1) {
      showToast("You need at least one branch.");
      return;
    }
    onChange({ branches: branches.filter((b) => b.id !== id) });
    showToast("Branch removed.");
  }

  function handleChequeUpload(file: File | undefined) {
    if (!file) return;
    onChange({
      chequeUpload: { fileName: file.name, uploadedAt: new Date().toISOString() },
    });
    showToast(`Uploaded ${file.name}`);
  }

  return (
    <>
      <StepToast message={toast} />
      <FormModal
        open={modal !== null}
        title={modal === "edit" ? "Edit Branch" : "Add Branch"}
        onClose={() => setModal(null)}
        onSubmit={saveBranch}
        submitLabel={modal === "edit" ? "Update Branch" : "Add Branch"}
        wide
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Branch Name" required>
            <input className="crm-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="Branch Type" required>
            <select className="crm-select" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option>Head Office</option>
              <option>Branch</option>
              <option>Partner</option>
            </select>
          </Field>
          <Field label="City" required>
            <input className="crm-input" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
          </Field>
          <Field label="Pincode">
            <input className="crm-input" value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address">
              <input className="crm-input" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </Field>
          </div>
          <Field label="Branch Manager">
            <input className="crm-input" value={form.manager} onChange={(e) => setForm((f) => ({ ...f, manager: e.target.value }))} />
          </Field>
          <Field label="Contact">
            <input className="crm-input" value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} />
          </Field>
        </div>
      </FormModal>

      <StepLayout
        icon={Landmark}
        title="Branches & Billing"
        subtitle="Add branches/offices and configure billing, GST, and payment collection preferences."
        tabs={["Branches / Offices", "Billing & GST", "Payment Collection", "Branch Access"]}
        activeTab={tab}
        onTabChange={setTab}
        footer={footer}
      >
        {tab === 0 && (
          <section className="mb-10">
            <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">A.</span> Branches / Offices</h3>
            <p className="mt-1 text-xs text-gray-500">Add all your operational locations.</p>
            <div className="mb-4 flex justify-end">
              <button type="button" className="btn-outline-purple !gap-2 text-xs" onClick={openAdd}>
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
                      <td className="px-4 py-3.5 text-gray-700">{b.city}</td>
                      <td className="px-4 py-3.5 text-gray-700">{b.manager || "—"}</td>
                      <td className="px-4 py-3.5 text-gray-700">{b.contact || "—"}</td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{b.status}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button type="button" className="mr-1 inline-flex rounded-lg p-2 text-violet-accent hover:bg-violet-soft" aria-label="Edit" onClick={() => openEdit(b)}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" className="inline-flex rounded-lg p-2 text-violet-accent hover:bg-violet-soft" aria-label="Delete" onClick={() => deleteBranch(b.id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 1 && (
          <section>
            <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">B.</span> Billing & GST Setup</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="GST Number" required>
                <input className="crm-input" value={(data.gstNumber as string) || ""} onChange={(e) => onChange({ gstNumber: e.target.value })} />
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
          </section>
        )}

        {tab === 2 && (
          <section>
            <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">C.</span> Payment Collection Setup</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Account Holder Name" required>
                <input className="crm-input" value={(data.accountHolder as string) || ""} onChange={(e) => onChange({ accountHolder: e.target.value })} />
              </Field>
              <Field label="Bank Name" required>
                <input className="crm-input" value={(data.bankName as string) || ""} onChange={(e) => onChange({ bankName: e.target.value })} />
              </Field>
              <Field label="Account Number" required>
                <input className="crm-input" value={(data.accountNumber as string) || ""} onChange={(e) => onChange({ accountNumber: e.target.value })} />
              </Field>
              <Field label="IFSC Code" required>
                <input className="crm-input" value={(data.ifsc as string) || ""} onChange={(e) => onChange({ ifsc: e.target.value })} />
              </Field>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500">Upload Cheque / Passbook</p>
              {(data.chequeUpload as { fileName?: string })?.fileName && (
                <p className="mt-1 text-xs font-semibold text-emerald-700">Saved: {(data.chequeUpload as { fileName: string }).fileName}</p>
              )}
              <label className="mt-2 inline-block cursor-pointer text-xs font-semibold text-violet-accent hover:underline">
                Choose file
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => handleChequeUpload(e.target.files?.[0])} />
              </label>
            </div>
          </section>
        )}

        {tab === 3 && (
          <section>
            <h3 className="text-sm font-bold text-gray-900"><span className="text-violet-accent">D.</span> Branch Access & User Assignment</h3>
            <p className="mt-1 text-xs text-gray-500">Derived from branches you added ({branches.length} locations).</p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Branch</th>
                    <th className="px-4 py-3">Branch Manager</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((b) => (
                    <tr key={b.id} className="border-t border-gray-100 bg-white">
                      <td className="px-4 py-3.5 font-semibold text-gray-900">{b.name}</td>
                      <td className="px-4 py-3.5 text-gray-700">{b.manager || "Assign in Team step"}</td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </StepLayout>
    </>
  );
}
