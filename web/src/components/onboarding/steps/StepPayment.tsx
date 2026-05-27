"use client";

import { Banknote, CreditCard, Landmark, QrCode, Smartphone, Check } from "lucide-react";
import { Field, Section, Toggle, InfoBox } from "@/components/ui/FormBits";
import type { StepProps } from "./types";

const METHODS = [
  { id: "upi", label: "UPI", tag: "Recommended", action: "Configure UPI", Icon: Smartphone, disabled: false },
  { id: "qr", label: "QR Code", action: "Configure QR", Icon: QrCode, disabled: false },
  { id: "bank", label: "Bank Transfer", action: "Add Bank Details", Icon: Landmark, disabled: false },
  { id: "card", label: "Card Payments", tag: "Coming Soon", action: "Coming Soon", Icon: CreditCard, disabled: true },
  { id: "cash", label: "Cash", action: "Enable", Icon: Banknote, disabled: false },
];

const UPI_APPS = ["GPay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"];

export function StepPayment({ data, onChange }: StepProps) {
  const enabled = (data.methods as string[]) || ["upi", "qr", "bank"];

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
      <div>
        <div className="flex items-start gap-3">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-soft sm:flex">
            <CreditCard className="h-6 w-6 text-violet-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Collection Setup</h1>
            <p className="mt-1 text-sm text-gray-500">Select payment methods and preferences for how you collect from clients.</p>
          </div>
        </div>

        <div className="mt-8">
          <Section letter="A" title="Payment Methods" subtitle="Select all the payment methods you want to enable for your clients.">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {METHODS.map((m) => {
                const on = enabled.includes(m.id);
                const Icon = m.Icon;
                return (
                  <div
                    key={m.id}
                    className={`relative flex flex-col rounded-2xl border-2 p-4 transition ${
                      m.disabled ? "border-gray-100 bg-gray-50/80 opacity-75" : on ? "border-violet-accent bg-violet-soft/50 shadow-sm" : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${on && !m.disabled ? "bg-violet-accent text-white" : "bg-gray-100 text-gray-500"}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-bold text-gray-900">{m.label}</p>
                          {m.tag && <span className={`text-[11px] font-semibold ${m.tag === "Coming Soon" ? "text-gray-400" : "text-emerald-600"}`}>{m.tag}</span>}
                        </div>
                      </div>
                      {!m.disabled && (
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => {
                            const next = on ? enabled.filter((x) => x !== m.id) : [...enabled, m.id];
                            onChange({ methods: next });
                          }}
                          className="h-4 w-4 accent-violet-accent"
                        />
                      )}
                    </div>
                    {m.action && (
                      <button
                        type="button"
                        disabled={m.disabled}
                        className={`mt-4 w-full rounded-lg py-2 text-xs font-bold ${
                          m.disabled ? "cursor-not-allowed bg-gray-200 text-gray-500" : "btn-outline-purple !py-2"
                        }`}
                      >
                        {m.action}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          <Section letter="B" title="Payment Preferences" subtitle="Configure how payments should be collected and managed.">
            <div className="grid gap-3 md:grid-cols-2">
              <Toggle showInfo label="Auto Receipt Generation" description="Automatically generate receipts after successful payment." checked={data.autoReceipt !== false} onChange={(v) => onChange({ autoReceipt: v })} />
              <Toggle showInfo label="Payment Reminder Automation" description="Send reminders before and after due dates." checked={data.paymentReminders !== false} onChange={(v) => onChange({ paymentReminders: v })} />
              <Toggle showInfo label="Partial Payment Allowed" description="Let clients pay in instalments against an invoice." checked={data.partialPayment !== false} onChange={(v) => onChange({ partialPayment: v })} />
              <Toggle showInfo label="Record Offline Payments" description="Log cash, cheque, or bank transfers manually." checked={data.offlinePayments !== false} onChange={(v) => onChange({ offlinePayments: v })} />
              <Toggle showInfo label="Advance Payment Mandatory" description="Require advance before confirming a booking." checked={!!data.advanceMandatory} onChange={(v) => onChange({ advanceMandatory: v })} />
              <Toggle showInfo label="Late Payment Penalty" description="Apply late fees or interest after grace period." checked={!!data.latePenalty} onChange={(v) => onChange({ latePenalty: v })} />
            </div>
          </Section>

          <Section letter="C" title="Default Advance / Booking Amount" subtitle="Set the default advance amount or percentage to be collected at the time of booking.">
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Collect Advance As">
                  <select className="crm-select" value={(data.advanceType as string) || "PERCENT"} onChange={(e) => onChange({ advanceType: e.target.value })}>
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </Field>
                <Field label="Advance Percentage" required>
                  <div className="relative">
                    <input className="crm-input pr-8" value={(data.advancePercent as string) || "30"} onChange={(e) => onChange({ advancePercent: e.target.value })} />
                    <span className="pointer-events-none absolute right-3 top-2.5 text-sm text-gray-400">%</span>
                  </div>
                </Field>
              </div>
              <InfoBox variant="green">
                <p className="flex gap-2 text-xs leading-relaxed">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  You can change these settings anytime from Settings → Payments.
                </p>
              </InfoBox>
            </div>
          </Section>
        </div>
      </div>

      <aside className="space-y-4">
        <InfoBox variant="green" title="Why Payment Setup Matters">
          <ul className="space-y-2 text-xs text-gray-700">
            {["Collect payments faster with UPI & QR", "Reduce pending dues with reminders", "GST-ready receipts for your clients"].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-emerald-600">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </InfoBox>

        <div className="crm-card">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Supported UPI Apps</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {UPI_APPS.map((a) => (
              <span key={a} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700">
                {a}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-violet-100 bg-violet-soft/50 p-4 text-xs leading-relaxed text-gray-600">
          <span className="font-semibold text-violet-deep">Note: </span>
          Multiple bank accounts and UPI IDs can be added later in Finance Settings.
        </div>
      </aside>
    </div>
  );
}
