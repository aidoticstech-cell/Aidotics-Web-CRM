"use client";

import { GitBranch } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import { SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const WORKFLOW_STAGES = [
  { title: "Lead", caption: "New lead captured" },
  { title: "Discussion", caption: "Discuss and qualify lead" },
  { title: "Assignment", caption: "Assign staff for duty" },
  { title: "Duty Execution", caption: "Duty is in progress" },
  { title: "Invoice", caption: "Generate and send invoice" },
  { title: "Payment", caption: "Payment received" },
  { title: "Closure", caption: "Duty closed and feedback" },
];

export function StepWorkflowBuilder({ data, onChange, footer }: StepProps) {
  return (
    <StepLayout
      icon={GitBranch}
      title="Workflow & Automation"
      subtitle="Configure your business workflow, approvals, partner network, notifications, and SLA rules."
      tabs={["Workflow Builder", "Approvals & Rules", "Partner Network", "Notifications", "SLA & Escalation"]}
      activeTab={0}
      footer={footer}
    >
      <SectionBlock
        letter="A"
        title="Workflow Builder"
        subtitle="Define the stages your leads and duties will go through."
        action={<button type="button" className="btn-outline-purple !py-1.5 text-xs">Edit Workflow</button>}
      >
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-[860px] items-center gap-2">
            {WORKFLOW_STAGES.map((stage, idx) => (
              <div key={stage.title} className="flex items-center gap-2">
                <div className="min-h-[72px] min-w-[112px] rounded-lg border border-gray-200 bg-gray-50 px-2 py-2">
                  <p className="text-[11px] font-bold text-gray-800">{idx + 1}. {stage.title}</p>
                  <p className="mt-1 text-[10px] leading-snug text-gray-500">{stage.caption}</p>
                </div>
                {idx < WORKFLOW_STAGES.length - 1 && <span className="text-gray-400">→</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <button type="button" className="btn-outline-purple !py-1.5 text-xs">+ Add Custom Stage</button>
        </div>
      </SectionBlock>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionBlock
          letter="B"
          title="Approvals & Rules"
          subtitle="Configure approval requirements for key actions."
          className="lg:col-span-2"
          action={<button type="button" className="btn-outline-purple !py-1.5 text-xs">+ Add Rule</button>}
        >
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2.5">Action / Request</th>
                  <th className="px-3 py-2.5">Approval Required</th>
                  <th className="px-3 py-2.5">Who Can Approve</th>
                  <th className="px-3 py-2.5">Auto Approve After</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { action: "Staff Replacement", who: "Operations Manager", after: "2 Hours" },
                  { action: "Refund Request", who: "Finance Head", after: "24 Hours" },
                  { action: "Staff Leave", who: "Branch Manager", after: "4 Hours" },
                  { action: "Discount / Concession", who: "Owner / Admin", after: "2 Hours" },
                  { action: "Payment Write-off", who: "Owner / Admin", after: "No Auto" },
                ].map((row) => (
                  <tr key={row.action} className="border-t border-gray-100 bg-white">
                    <td className="px-3 py-2.5 text-xs font-semibold text-gray-800">{row.action}</td>
                    <td className="px-3 py-2.5"><input type="checkbox" className="accent-violet-accent" defaultChecked /></td>
                    <td className="px-3 py-2.5 text-xs text-gray-600">{row.who}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-600">{row.after}</td>
                    <td className="px-3 py-2.5 text-right text-xs text-violet-accent">✎</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">You can add role-based approvals for key requirements.</p>
        </SectionBlock>

        <SectionBlock letter="C" title="Partner Network" subtitle="Manage partner bureaus and workforce sharing.">
          <div className="space-y-2 text-xs">
            {[
              "Enable Partner Network",
              "Share Workforce",
              "Request Workforce",
              "Revenue Sharing",
            ].map((item) => (
              <label key={item} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2">
                <span className="text-gray-700">{item}</span>
                <input
                  type="checkbox"
                  className="accent-violet-accent"
                  checked={(data[item.replace(/\s+/g, "").toLowerCase() as keyof typeof data] as boolean | undefined) !== false}
                  onChange={(e) => onChange({ [item.replace(/\s+/g, "").toLowerCase()]: e.target.checked })}
                />
              </label>
            ))}
            <button type="button" className="btn-outline-purple mt-2 w-full !py-2 text-xs">Manage Partner Bureaus</button>
          </div>
        </SectionBlock>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionBlock
          letter="D"
          title="Notifications"
          subtitle="Choose events and channels for alerts."
          action={<button type="button" className="btn-outline-purple !py-1.5 text-xs">Manage Templates</button>}
        >
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[620px] text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/90 font-bold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2">Event</th>
                  <th className="px-3 py-2">WhatsApp</th>
                  <th className="px-3 py-2">SMS</th>
                  <th className="px-3 py-2">In-App</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Recipients</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { e: "New Lead Received", r: "Coordinator, Telecaller" },
                  { e: "Staff Assigned", r: "Staff, Coordinator" },
                  { e: "Duty Started", r: "Client, Staff, Coordinator" },
                  { e: "Client Approval Pending", r: "Client, Coordinator" },
                  { e: "Payment Received", r: "Finance, Owner" },
                ].map((row, idx) => (
                  <tr key={row.e} className="border-t border-gray-100 bg-white">
                    <td className="px-3 py-2 font-medium text-gray-800">{row.e}</td>
                    <td className="px-3 py-2"><input type="checkbox" className="accent-violet-accent" defaultChecked /></td>
                    <td className="px-3 py-2"><input type="checkbox" className="accent-violet-accent" defaultChecked={idx !== 0} /></td>
                    <td className="px-3 py-2"><input type="checkbox" className="accent-violet-accent" defaultChecked /></td>
                    <td className="px-3 py-2"><input type="checkbox" className="accent-violet-accent" defaultChecked={idx % 2 === 0} /></td>
                    <td className="px-3 py-2 text-gray-600">{row.r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">You can customize notification templates from settings anytime.</p>
        </SectionBlock>

        <SectionBlock letter="E" title="SLA & Escalation" subtitle="Set time limits and escalation rules for faster action.">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Lead Response Time (SLA)">
              <select className="crm-select" value={(data.leadSla as string) || "15m"} onChange={(e) => onChange({ leadSla: e.target.value })}>
                <option value="15m">15 Minutes</option>
                <option value="30m">30 Minutes</option>
                <option value="1h">1 Hour</option>
              </select>
            </Field>
            <Field label="Staff Assignment Time (SLA)">
              <select className="crm-select" value={(data.assignmentSla as string) || "30m"} onChange={(e) => onChange({ assignmentSla: e.target.value })}>
                <option value="30m">30 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="2h">2 Hours</option>
              </select>
            </Field>
            <Field label="Client Approval Time (SLA)">
              <select className="crm-select" value={(data.clientSla as string) || "2h"} onChange={(e) => onChange({ clientSla: e.target.value })}>
                <option value="1h">1 Hour</option>
                <option value="2h">2 Hours</option>
                <option value="4h">4 Hours</option>
              </select>
            </Field>
            <Field label="Escalate If No Response">
              <select className="crm-select" value={(data.escalateIf as string) || "yes"} onChange={(e) => onChange({ escalateIf: e.target.value })}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </Field>
            <Field label="Escalate To">
              <select className="crm-select" value={(data.escalateTo as string) || "ops_manager"} onChange={(e) => onChange({ escalateTo: e.target.value })}>
                <option value="ops_manager">Operations Manager</option>
                <option value="branch_manager">Branch Manager</option>
                <option value="owner_admin">Owner / Admin</option>
              </select>
            </Field>
            <Field label="Max Escalation Level">
              <select className="crm-select" value={(data.maxEscalation as string) || "3"} onChange={(e) => onChange({ maxEscalation: e.target.value })}>
                <option value="1">1 Level</option>
                <option value="2">2 Levels</option>
                <option value="3">3 Levels</option>
              </select>
            </Field>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">Escalation list applies when no feedback, no response, or SLA breach.</p>
        </SectionBlock>
      </div>
    </StepLayout>
  );
}
