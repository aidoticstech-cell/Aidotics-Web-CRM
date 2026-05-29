"use client";

import { useState } from "react";
import { Users, Pencil, Trash2, Plus } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import { FormModal } from "@/components/onboarding/FormModal";
import { StepToast } from "@/components/onboarding/StepToast";
import { StepLayout } from "@/components/onboarding/StepLayout";
import { newOnboardingId } from "@/lib/onboarding-id";
import type { StepProps } from "./types";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  dept: string;
  manager: string;
  email: string;
  phone: string;
};

type Category = { id: string; label: string; staff: string };

const DEFAULT_TEAM: TeamMember[] = [
  { id: "1", name: "Rahul Sharma", role: "Operations Manager", dept: "Operations", manager: "Owner", email: "rahul.sharma@hh.in", phone: "98765 43210" },
  { id: "2", name: "Neha Patel", role: "Coordinator", dept: "Operations", manager: "Rahul Sharma", email: "neha.patel@hh.in", phone: "98765 43211" },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", label: "Registered Nurse (RN)", staff: "128" },
  { id: "2", label: "General Duty Assistant (GDA)", staff: "210" },
];

export function StepWorkforceSetup({ data, onChange, footer }: StepProps) {
  const team = (data.teamMembers as TeamMember[])?.length ? (data.teamMembers as TeamMember[]) : DEFAULT_TEAM;
  const categories = (data.workforceCategories as Category[])?.length ? (data.workforceCategories as Category[]) : DEFAULT_CATEGORIES;
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [memberModal, setMemberModal] = useState<"add" | "edit" | null>(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [memberForm, setMemberForm] = useState({ name: "", role: "Coordinator", dept: "Operations", manager: "Owner", email: "", phone: "" });
  const [categoryLabel, setCategoryLabel] = useState("");
  const [categoryStaff, setCategoryStaff] = useState("0");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function saveMember() {
    if (!memberForm.name.trim() || !memberForm.email.trim()) {
      showToast("Name and email are required.");
      return;
    }
    if (memberModal === "edit" && editMemberId) {
      onChange({ teamMembers: team.map((m) => (m.id === editMemberId ? { ...m, ...memberForm } : m)) });
      showToast("Team member updated.");
    } else {
      onChange({ teamMembers: [...team, { ...memberForm, id: newOnboardingId() }] });
      showToast("Team member added.");
    }
    setMemberModal(null);
  }

  function saveCategory() {
    if (!categoryLabel.trim()) {
      showToast("Category name is required.");
      return;
    }
    onChange({
      workforceCategories: [...categories, { id: newOnboardingId(), label: categoryLabel, staff: categoryStaff }],
    });
    setCategoryLabel("");
    setCategoryStaff("0");
    setCategoryModal(false);
    showToast("Category added.");
  }

  return (
    <>
      <StepToast message={toast} />
      <FormModal open={memberModal !== null} title={memberModal === "edit" ? "Edit Team Member" : "Add Team Member"} onClose={() => setMemberModal(null)} onSubmit={saveMember} wide>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" required><input className="crm-input" value={memberForm.name} onChange={(e) => setMemberForm((f) => ({ ...f, name: e.target.value }))} /></Field>
          <Field label="Role" required><input className="crm-input" value={memberForm.role} onChange={(e) => setMemberForm((f) => ({ ...f, role: e.target.value }))} /></Field>
          <Field label="Department"><input className="crm-input" value={memberForm.dept} onChange={(e) => setMemberForm((f) => ({ ...f, dept: e.target.value }))} /></Field>
          <Field label="Reporting Manager"><input className="crm-input" value={memberForm.manager} onChange={(e) => setMemberForm((f) => ({ ...f, manager: e.target.value }))} /></Field>
          <Field label="Email" required><input className="crm-input" type="email" value={memberForm.email} onChange={(e) => setMemberForm((f) => ({ ...f, email: e.target.value }))} /></Field>
          <Field label="Phone"><input className="crm-input" value={memberForm.phone} onChange={(e) => setMemberForm((f) => ({ ...f, phone: e.target.value }))} /></Field>
        </div>
      </FormModal>
      <FormModal open={categoryModal} title="Add Workforce Category" onClose={() => setCategoryModal(false)} onSubmit={saveCategory}>
        <Field label="Category Name" required><input className="crm-input" value={categoryLabel} onChange={(e) => setCategoryLabel(e.target.value)} /></Field>
        <Field label="Approx. Staff Count"><input className="crm-input" value={categoryStaff} onChange={(e) => setCategoryStaff(e.target.value)} /></Field>
      </FormModal>

      <StepLayout
        icon={Users}
        title="Workforce & Roles"
        subtitle="Build your internal team structure, define roles, permissions, and categories."
        tabs={["Workforce", "Role Templates", "Permissions Matrix", "Digital Identity", "Responsibility Mapping"]}
        activeTab={tab}
        onTabChange={setTab}
        footer={footer}
      >
        {tab === 0 && (
          <>
            <section>
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Internal Team & Workforce</h3>
                  <p className="mt-1 text-xs text-gray-500">Add your internal team members ({team.length} added).</p>
                </div>
                <button type="button" className="btn-outline-purple !py-1.5 text-xs" onClick={() => { setMemberForm({ name: "", role: "Coordinator", dept: "Operations", manager: "Owner", email: "", phone: "" }); setEditMemberId(null); setMemberModal("add"); }}>
                  + Add Team Member
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Email / Phone</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((row) => (
                      <tr key={row.id} className="border-t border-gray-100 bg-white">
                        <td className="px-4 py-3.5 font-semibold text-gray-900">{row.name}</td>
                        <td className="px-4 py-3.5"><span className="rounded bg-violet-soft px-2 py-0.5 text-[11px] font-semibold text-violet-deep">{row.role}</span></td>
                        <td className="px-4 py-3.5 text-gray-700">{row.dept}</td>
                        <td className="px-4 py-3.5 text-xs text-gray-700">{row.email}<br />{row.phone}</td>
                        <td className="px-4 py-3.5 text-right">
                          <button type="button" className="mr-1 inline-flex rounded-lg p-2 text-violet-accent hover:bg-violet-soft" onClick={() => { setMemberForm(row); setEditMemberId(row.id); setMemberModal("edit"); }}><Pencil className="h-4 w-4" /></button>
                          <button type="button" className="inline-flex rounded-lg p-2 text-violet-accent hover:bg-violet-soft" onClick={() => { onChange({ teamMembers: team.filter((m) => m.id !== row.id) }); showToast("Member removed."); }}><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Workforce Categories</h3>
                <button type="button" className="btn-outline-purple !py-1.5 text-xs" onClick={() => setCategoryModal(true)}><Plus className="mr-1 inline h-3 w-3" />Add Category</button>
              </div>
              <div className="space-y-2">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/70 px-3 py-2 text-sm">
                    <span className="font-medium text-gray-800">{c.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-violet-soft px-2 py-0.5 text-[11px] font-semibold text-violet-deep">{c.staff} Staff</span>
                      <button type="button" className="text-xs text-red-600" onClick={() => { onChange({ workforceCategories: categories.filter((x) => x.id !== c.id) }); showToast("Category removed."); }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-3 text-xs font-semibold text-violet-accent" onClick={() => showToast(`${categories.length} categories configured — saved with your draft.`)}>
                Manage All Categories →
              </button>
            </section>
          </>
        )}
        {tab > 0 && (
          <p className="rounded-xl border border-violet-100 bg-violet-soft/40 px-4 py-6 text-center text-sm text-violet-deep">
            Configure this in the main CRM after go-live, or continue with the Workforce tab for now.
          </p>
        )}
      </StepLayout>
    </>
  );
}
