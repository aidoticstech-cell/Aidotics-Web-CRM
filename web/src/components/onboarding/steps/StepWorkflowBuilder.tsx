"use client";

import { GitBranch, Plus, UserPlus, CreditCard, FileCheck, AlertTriangle, MessageSquare } from "lucide-react";
import { Field, Toggle } from "@/components/ui/FormBits";
import { AsideCard, SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const TEMPLATES = [
  { id: "onboard", label: "Client Onboarding", Icon: UserPlus },
  { id: "payment", label: "Payment Collection", Icon: CreditCard },
  { id: "docs", label: "Document Verification", Icon: FileCheck },
  { id: "compliance", label: "Compliance Checks", Icon: AlertTriangle },
  { id: "case", label: "Case Management", Icon: MessageSquare },
  { id: "custom", label: "Create Custom", Icon: Plus },
];

const STEPS = ["Start — New Client Registration", "Collect Information", "Verify Documents", "Approval", "Complete — Notify & create profile"];

export function StepWorkflowBuilder({ data, onChange, footer }: StepProps) {
  const template = (data.template as string) || "onboard";

  return (
    <StepLayout
      icon={GitBranch}
      title="Workflow & Automation"
      subtitle="Configure your business workflow, approvals, partner network, notifications, and SLA rules."
      tabs={["Workflow Builder", "Approvals & Rules", "Partner Network", "Notifications", "SLA & Escalation"]}
      activeTab={0}
      footer={footer}
      aside={
        <>
          <AsideCard title="Workflow Overview">
            <div className="mx-auto h-24 w-24 rounded-full border-[8px] border-emerald-400 border-r-sky-400 border-b-amber-400 border-l-gray-300" />
            <p className="mt-2 text-center text-sm font-bold">12 Total Workflows</p>
            <ul className="mt-3 space-y-1 text-xs">
              <li className="flex justify-between"><span className="text-emerald-600">Active</span><span>6</span></li>
              <li className="flex justify-between"><span className="text-sky-600">Draft</span><span>3</span></li>
            </ul>
          </AsideCard>
          <AsideCard title="Active Workflows">
            <ul className="space-y-2 text-xs">
              {["Client Onboarding", "Payment Collection", "Document Verification"].map((w) => (
                <li key={w} className="flex justify-between"><span>{w}</span><span className="font-semibold text-emerald-600">Active</span></li>
              ))}
            </ul>
          </AsideCard>
          <AsideCard title="Benefits" className="border-emerald-100 bg-emerald-50/50">
            <ul className="space-y-1 text-xs text-emerald-900">
              {["Increased operational efficiency", "Reduced manual errors", "Better compliance tracking"].map((t) => (
                <li key={t}>✓ {t}</li>
              ))}
            </ul>
          </AsideCard>
        </>
      }
    >
      <SectionBlock letter="A" title="Workflow Templates" subtitle="Choose from pre-built templates or create custom workflows.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ template: id })}
              className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left ${template === id ? "border-violet-accent bg-violet-soft/40" : "border-gray-200"}`}
            >
              <Icon className={`h-6 w-6 ${template === id ? "text-violet-accent" : "text-gray-400"}`} />
              <span className="text-sm font-bold">{label}</span>
            </button>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock letter="B" title="Workflow Designer" subtitle="Configure steps and actions for your selected workflow." action={<button type="button" className="btn-outline-purple !py-1.5 text-xs"><Plus className="mr-1 inline h-3 w-3" />Add Step</button>}>
        <div className="grid gap-4 lg:grid-cols-2">
          <ol className="space-y-2">
            {STEPS.map((s, i) => (
              <li key={s} className="flex gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-accent text-xs font-bold text-white">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="min-h-[220px] rounded-xl border border-dashed border-gray-200 bg-[linear-gradient(rgba(0,0,0,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.03)_1px,transparent_1px)] bg-[size:16px_16px] p-4">
            <div className="flex flex-col items-center gap-2 text-xs">
              {["Start", "Collect Info", "Verify", "Approval?", "Complete"].map((n, i) => (
                <div key={n} className="flex flex-col items-center">
                  <span className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 font-semibold shadow-sm">{n}</span>
                  {i < 4 && <span className="text-gray-300">↓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionBlock>

      <SectionBlock letter="C" title="Workflow Settings">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Workflow Name">
            <input className="crm-input" value={(data.workflowName as string) || "Client Onboarding"} onChange={(e) => onChange({ workflowName: e.target.value })} />
          </Field>
          <div className="flex items-end pb-1">
            <Toggle label="Status: Active" checked={data.workflowActive !== false} onChange={(v) => onChange({ workflowActive: v })} />
          </div>
          <Field label="Execution Mode">
            <select className="crm-select" defaultValue="auto"><option>Automatic</option><option>Manual</option></select>
          </Field>
          <Field label="Error Handling">
            <select className="crm-select" defaultValue="notify"><option value="notify">Notify Admin</option><option value="retry">Retry</option></select>
          </Field>
          <Field label="Run Schedule">
            <select className="crm-select" defaultValue="realtime"><option value="realtime">Real-time</option><option value="daily">Daily</option></select>
          </Field>
        </div>
      </SectionBlock>
    </StepLayout>
  );
}
