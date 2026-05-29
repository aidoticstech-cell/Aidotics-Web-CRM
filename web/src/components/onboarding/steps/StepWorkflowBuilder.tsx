"use client";

import { useState } from "react";
import { GitBranch } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import { FormModal } from "@/components/onboarding/FormModal";
import { StepToast } from "@/components/onboarding/StepToast";
import { SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import { newOnboardingId } from "@/lib/onboarding-id";
import type { StepProps } from "./types";

type Stage = { id: string; title: string; caption: string };
type ApprovalRule = { id: string; action: string; who: string; after: string; required: boolean };

const DEFAULT_STAGES: Stage[] = [
  { id: "1", title: "Lead", caption: "New lead captured" },
  { id: "2", title: "Discussion", caption: "Discuss and qualify lead" },
  { id: "3", title: "Assignment", caption: "Assign staff for duty" },
  { id: "4", title: "Duty Execution", caption: "Duty is in progress" },
  { id: "5", title: "Invoice", caption: "Generate and send invoice" },
  { id: "6", title: "Payment", caption: "Payment received" },
  { id: "7", title: "Closure", caption: "Duty closed and feedback" },
];

const DEFAULT_RULES: ApprovalRule[] = [
  { id: "1", action: "Staff Replacement", who: "Operations Manager", after: "2 Hours", required: true },
  { id: "2", action: "Refund Request", who: "Finance Head", after: "24 Hours", required: true },
  { id: "3", action: "Discount / Concession", who: "Owner / Admin", after: "2 Hours", required: true },
];

export function StepWorkflowBuilder({ data, onChange, footer }: StepProps) {
  const stages = (data.workflowStages as Stage[])?.length ? (data.workflowStages as Stage[]) : DEFAULT_STAGES;
  const rules = (data.approvalRules as ApprovalRule[])?.length ? (data.approvalRules as ApprovalRule[]) : DEFAULT_RULES;
  const [toast, setToast] = useState<string | null>(null);
  const [stageModal, setStageModal] = useState(false);
  const [ruleModal, setRuleModal] = useState(false);
  const [stageForm, setStageForm] = useState({ title: "", caption: "" });
  const [ruleForm, setRuleForm] = useState({ action: "", who: "Operations Manager", after: "2 Hours" });

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <>
      <StepToast message={toast} />
      <FormModal open={stageModal} title="Add Custom Stage" onClose={() => setStageModal(false)} onSubmit={() => {
        if (!stageForm.title.trim()) return;
        onChange({ workflowStages: [...stages, { ...stageForm, id: newOnboardingId() }] });
        setStageForm({ title: "", caption: "" });
        setStageModal(false);
        showToast("Workflow stage added.");
      }}>
        <Field label="Stage Name" required><input className="crm-input" value={stageForm.title} onChange={(e) => setStageForm((f) => ({ ...f, title: e.target.value }))} /></Field>
        <Field label="Description"><input className="crm-input" value={stageForm.caption} onChange={(e) => setStageForm((f) => ({ ...f, caption: e.target.value }))} /></Field>
      </FormModal>
      <FormModal open={ruleModal} title="Add Approval Rule" onClose={() => setRuleModal(false)} onSubmit={() => {
        if (!ruleForm.action.trim()) return;
        onChange({ approvalRules: [...rules, { ...ruleForm, id: newOnboardingId(), required: true }] });
        setRuleForm({ action: "", who: "Operations Manager", after: "2 Hours" });
        setRuleModal(false);
        showToast("Approval rule added.");
      }} wide>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Action / Request" required><input className="crm-input" value={ruleForm.action} onChange={(e) => setRuleForm((f) => ({ ...f, action: e.target.value }))} /></Field>
          <Field label="Who Can Approve"><input className="crm-input" value={ruleForm.who} onChange={(e) => setRuleForm((f) => ({ ...f, who: e.target.value }))} /></Field>
          <Field label="Auto Approve After"><input className="crm-input" value={ruleForm.after} onChange={(e) => setRuleForm((f) => ({ ...f, after: e.target.value }))} /></Field>
        </div>
      </FormModal>

      <StepLayout icon={GitBranch} title="Workflow & Automation" subtitle="Configure your business workflow, approvals, partner network, notifications, and SLA rules." footer={footer}>
        <SectionBlock
          letter="A"
          title="Workflow Builder"
          subtitle="Define the stages your leads and duties will go through."
          action={<button type="button" className="btn-outline-purple !py-1.5 text-xs" onClick={() => showToast("Drag-to-reorder will be available after go-live. Stages are saved in order shown.")}>Edit Workflow</button>}
        >
          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-[860px] items-center gap-2">
              {stages.map((stage, idx) => (
                <div key={stage.id} className="flex items-center gap-2">
                  <div className="group relative min-h-[72px] min-w-[112px] rounded-lg border border-gray-200 bg-gray-50 px-2 py-2">
                    <p className="text-[11px] font-bold text-gray-800">{idx + 1}. {stage.title}</p>
                    <p className="mt-1 text-[10px] leading-snug text-gray-500">{stage.caption}</p>
                    <button type="button" className="absolute -right-1 -top-1 hidden rounded-full bg-red-500 px-1.5 text-[10px] text-white group-hover:block" onClick={() => { onChange({ workflowStages: stages.filter((s) => s.id !== stage.id) }); showToast("Stage removed."); }}>×</button>
                  </div>
                  {idx < stages.length - 1 && <span className="text-gray-400">→</span>}
                </div>
              ))}
            </div>
          </div>
          <button type="button" className="btn-outline-purple mt-3 !py-1.5 text-xs" onClick={() => setStageModal(true)}>+ Add Custom Stage</button>
        </SectionBlock>

        <SectionBlock letter="B" title="Approvals & Rules" action={<button type="button" className="btn-outline-purple !py-1.5 text-xs" onClick={() => setRuleModal(true)}>+ Add Rule</button>}>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2.5">Action</th>
                  <th className="px-3 py-2.5">Required</th>
                  <th className="px-3 py-2.5">Approver</th>
                  <th className="px-3 py-2.5">Auto After</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((row) => (
                  <tr key={row.id} className="border-t border-gray-100 bg-white">
                    <td className="px-3 py-2.5 text-xs font-semibold text-gray-800">{row.action}</td>
                    <td className="px-3 py-2.5">
                      <input type="checkbox" className="accent-violet-accent" checked={row.required} onChange={() => onChange({ approvalRules: rules.map((r) => (r.id === row.id ? { ...r, required: !r.required } : r)) })} />
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-600">{row.who}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-600">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBlock>

        <SectionBlock letter="C" title="Partner Network">
          <div className="space-y-2 text-xs">
            {[
              { k: "enablepartnernetwork", label: "Enable Partner Network" },
              { k: "shareworkforce", label: "Share Workforce" },
              { k: "requestworkforce", label: "Request Workforce" },
              { k: "revenuesharing", label: "Revenue Sharing" },
            ].map((item) => (
              <label key={item.k} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2">
                <span>{item.label}</span>
                <input type="checkbox" className="accent-violet-accent" checked={(data[item.k] as boolean | undefined) !== false} onChange={(e) => onChange({ [item.k]: e.target.checked })} />
              </label>
            ))}
            <button type="button" className="btn-outline-purple mt-2 w-full !py-2 text-xs" onClick={() => showToast("Partner bureau list opens after onboarding — settings saved.")}>Manage Partner Bureaus</button>
          </div>
        </SectionBlock>

        <SectionBlock letter="D" title="Notifications" action={<button type="button" className="btn-outline-purple !py-1.5 text-xs" onClick={() => showToast("Notification templates are editable from Settings after go-live.")}>Manage Templates</button>}>
          <p className="text-xs text-gray-500">Channel toggles are saved with your draft when you continue.</p>
        </SectionBlock>

        <SectionBlock letter="E" title="SLA & Escalation">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Lead Response Time (SLA)">
              <select className="crm-select" value={(data.leadSla as string) || "15m"} onChange={(e) => onChange({ leadSla: e.target.value })}>
                <option value="15m">15 Minutes</option>
                <option value="30m">30 Minutes</option>
              </select>
            </Field>
            <Field label="Max Escalation Level">
              <select className="crm-select" value={(data.maxEscalation as string) || "3"} onChange={(e) => onChange({ maxEscalation: e.target.value })}>
                <option value="3">3 Levels</option>
              </select>
            </Field>
          </div>
        </SectionBlock>
      </StepLayout>
    </>
  );
}
