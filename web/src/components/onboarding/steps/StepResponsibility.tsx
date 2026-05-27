"use client";

import type { ComponentType } from "react";
import { Bot, ChevronRight, Settings, Zap, Bell, Clock, CreditCard, FileWarning, BarChart3, User } from "lucide-react";
import { Section } from "@/components/ui/FormBits";
import type { StepProps } from "./types";

const PROCESSES = [
  "Lead Capture & Assignment",
  "Patient Registration",
  "Duty Assignment",
  "Duty Broadcast",
  "Staff Acceptance",
  "Client Approval",
  "Replacement Handling",
  "Live Duty Monitoring",
  "Payment Follow-up",
  "Escalation Handling",
  "Feedback & Ratings",
];

const ROLES = ["Telecaller", "Coordinator", "Operations Executive", "Operations Manager", "Accounts Executive", "Owner / Director"];

const FLOW = [
  { step: "Lead Captured", role: "Telecaller", color: "bg-violet-600" },
  { step: "Patient Created", role: "Coordinator", color: "bg-sky-500" },
  { step: "Duty Created", role: "Coordinator", color: "bg-sky-500" },
  { step: "Broadcast Sent", role: "Coordinator", color: "bg-sky-500" },
  { step: "Staff Accepts", role: "Staff Member", color: "bg-pink-500" },
  { step: "Client Approval", role: "Coordinator", color: "bg-sky-500" },
  { step: "Duty Confirmed", role: "System", color: "bg-violet-400 text-violet-950" },
  { step: "Live Monitoring", role: "Coordinator", color: "bg-sky-500" },
  { step: "Completion", role: "Coordinator", color: "bg-sky-500" },
  { step: "Invoice Generated", role: "Accounts", color: "bg-amber-500" },
  { step: "Feedback Collected", role: "Coordinator", color: "bg-sky-500" },
];

const AUTO_RULES: { k: string; title: string; desc: string; Icon: ComponentType<{ className?: string }> }[] = [
  { k: "autoAssignLeads", title: "Auto Assign Leads", desc: "Route new leads to available telecallers by rules.", Icon: Zap },
  { k: "autoReminders", title: "Auto Reminders", desc: "Nudge staff and clients before key deadlines.", Icon: Bell },
  { k: "autoDutyAlerts", title: "Auto Duty Alerts", desc: "Ping coordinators when duties are at risk.", Icon: Clock },
  { k: "slaAlerts", title: "SLA Alerts", desc: "Warn when acceptance or approval SLAs are breached.", Icon: FileWarning },
  { k: "escalationAlerts", title: "Escalation Alerts", desc: "Escalate stuck items per your matrix.", Icon: BarChart3 },
  { k: "autoPaymentReminders", title: "Auto Payment Reminders", desc: "Scheduled reminders for unpaid invoices.", Icon: CreditCard },
  { k: "documentAlerts", title: "Document Alerts", desc: "Flag missing KYC or expiring certifications.", Icon: FileWarning },
  { k: "dailySummary", title: "Daily Summary Reports", desc: "Morning digest to owners and managers.", Icon: BarChart3 },
];

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-emerald-500" : "bg-gray-300"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "right-0.5" : "left-0.5"}`} />
    </button>
  );
}

export function StepResponsibility({ data, onChange }: StepProps) {
  const mapping = (data.processMapping as Record<string, string>) || {};
  const backup = (data.processBackup as Record<string, string>) || {};
  const procAuto = (data.processAutomation as Record<string, boolean>) || {};

  function setProcAuto(p: string, v: boolean) {
    onChange({ processAutomation: { ...procAuto, [p]: v } });
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
      <div>
        <div className="flex items-start gap-3">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-soft sm:flex">
            <Bot className="h-6 w-6 text-violet-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Responsibility Automation</h1>
            <p className="mt-1 text-sm text-gray-500">Define who owns each process and which automations keep work moving.</p>
          </div>
        </div>

        <div className="mt-8">
          <Section letter="A" title="Process Responsibility Mapping" subtitle="Map each business process to a primary and optional backup role.">
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Business Process</th>
                    <th className="px-4 py-3">Responsible Role</th>
                    <th className="px-4 py-3">Backup Role (Optional)</th>
                    <th className="px-4 py-3 text-center">Automation</th>
                  </tr>
                </thead>
                <tbody>
                  {PROCESSES.map((p) => (
                    <tr key={p} className="border-t border-gray-100 bg-white hover:bg-gray-50/40">
                      <td className="px-4 py-3 font-medium text-gray-800">{p}</td>
                      <td className="px-4 py-2">
                        <div className="relative max-w-[200px]">
                          <User className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                          <select
                            className="crm-select !py-2 pl-8 text-xs"
                            value={mapping[p] || "Coordinator"}
                            onChange={(e) => onChange({ processMapping: { ...mapping, [p]: e.target.value } })}
                          >
                            {ROLES.map((r) => (
                              <option key={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          className="crm-select !py-2 text-xs"
                          value={backup[p] || ""}
                          onChange={(e) => onChange({ processBackup: { ...backup, [p]: e.target.value } })}
                        >
                          <option value="">— None —</option>
                          {ROLES.map((r) => (
                            <option key={r}>{r}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-center">
                          <Switch checked={procAuto[p] !== false} onChange={(v) => setProcAuto(p, v)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <div className="grid gap-8 xl:grid-cols-[1fr_260px]">
            <div>
              <Section letter="B" title="Automation Rules" subtitle="Turn on automations that match how tightly you want the CRM to supervise work.">
                <div className="space-y-3">
                  {AUTO_RULES.map((r) => {
                    const Icon = r.Icon;
                    const on = data[r.k] !== false;
                    return (
                      <div key={r.k} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                          <Icon className="h-5 w-5 text-violet-accent" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{r.desc}</p>
                        </div>
                        <Switch checked={on} onChange={(v) => onChange({ [r.k]: v })} />
                        <button type="button" className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-white hover:text-violet-accent" aria-label="Settings">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Section>
            </div>

            <div>
              <Section letter="C" title="Responsibility Flow Preview">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="space-y-0">
                    {FLOW.map((f) => (
                      <div key={f.step} className="flex gap-2">
                        <div className="flex w-6 shrink-0 flex-col items-center pt-0.5">
                          <span className="text-violet-300">↓</span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2 border-b border-gray-50 py-2 last:border-0">
                          <span className="text-xs font-semibold text-gray-800">{f.step}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${f.color}`}>{f.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            </div>
          </div>

          <Section letter="D" title="Escalation Matrix">
            <div className="mb-4 flex justify-end">
              <button type="button" className="btn-outline-purple !py-2 text-xs">
                + Add Escalation Rule
              </button>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              {[
                { level: 1, mins: 30, role: "Coordinator" },
                { level: 2, mins: 60, role: "Operations Manager" },
                { level: 3, mins: 120, role: "Owner / Director" },
              ].map((e, idx, arr) => (
                <div key={e.level} className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-full max-w-[200px] rounded-xl border-2 border-emerald-100 bg-gradient-to-b from-emerald-50/80 to-white p-4 text-center shadow-sm sm:w-[160px]">
                    <p className="text-[10px] font-bold uppercase text-emerald-700">Level {e.level}</p>
                    <p className="mt-2 text-lg font-black text-gray-900">{e.mins} min</p>
                    <p className="mt-1 text-xs text-gray-500">Escalate to</p>
                    <p className="mt-0.5 text-sm font-bold text-violet-accent">{e.role}</p>
                  </div>
                  {idx < arr.length - 1 && <ChevronRight className="hidden h-8 w-8 shrink-0 text-emerald-500 sm:block" strokeWidth={2.5} />}
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      <aside>
        <div className="crm-card sticky top-6 border-emerald-100 bg-gradient-to-b from-emerald-50/90 to-white">
          <h3 className="font-bold text-emerald-900">Benefits of Automation</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-emerald-900/85">
            {[
              "Fewer dropped duties and missed follow-ups",
              "Clear ownership at every stage of the lifecycle",
              "Faster escalations when SLAs are at risk",
              "Less manual coordination for your core team",
              "Better visibility for owners and managers",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-emerald-600">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
