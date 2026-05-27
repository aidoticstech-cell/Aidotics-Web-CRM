"use client";

import { Wallet, Check } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import { AsideCard, SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const PLANS = [
  { id: "starter", name: "Starter", price: "₹1,999", staff: "10 staff", tx: "1,000 tx/mo" },
  { id: "growth", name: "Growth", price: "₹4,999", staff: "50 staff", tx: "5,000 tx/mo" },
  { id: "business", name: "Business", price: "₹9,999", staff: "200 staff", tx: "50,000 tx/mo", popular: true },
  { id: "enterprise", name: "Enterprise", price: "Custom", staff: "Unlimited", tx: "Unlimited" },
];

export function StepSubscription({ data, onChange, footer }: StepProps) {
  const plan = (data.plan as string) || "business";

  return (
    <StepLayout
      icon={Wallet}
      title="Subscription Setup"
      subtitle="Choose the plan that best fits your bureau's needs and configure billing."
      footer={footer}
      aside={
        <>
          <AsideCard title="Subscription Summary">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Plan</dt><dd className="font-bold capitalize">{plan}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Billing</dt><dd>Monthly</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Staff Seats</dt><dd>200</dd></div>
              <div className="flex justify-between border-t pt-2"><dt className="font-bold">Total</dt><dd className="text-xl font-black text-violet-accent">₹9,999</dd></div>
            </dl>
            <p className="mt-1 text-[10px] text-gray-400">Taxes calculated at checkout</p>
          </AsideCard>
          <AsideCard title="Plan Benefits">
            <ul className="space-y-2 text-xs">
              {["Workflow automation", "Role-based access", "Advanced reports", "API access"].map((t) => (
                <li key={t} className="flex gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" />{t}</li>
              ))}
            </ul>
          </AsideCard>
          <div className="rounded-xl border border-violet-100 bg-violet-soft/50 p-3 text-[11px]">
            Change plan anytime from <strong>Settings → Subscription</strong>.
          </div>
        </>
      }
    >
      <SectionBlock letter="A" title="Choose Your Plan">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange({ plan: p.id })}
              className={`relative rounded-2xl border-2 p-4 text-left transition ${plan === p.id ? "border-violet-accent bg-violet-soft/40 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
            >
              {p.popular && <span className="absolute -top-2 right-3 rounded-full bg-violet-accent px-2 py-0.5 text-[9px] font-bold text-white">Popular</span>}
              <p className="text-sm font-bold">{p.name}</p>
              <p className="mt-1 text-2xl font-black text-violet-accent">{p.price}<span className="text-xs font-normal text-gray-500">/mo</span></p>
              <ul className="mt-3 space-y-1 text-[11px] text-gray-600">
                <li>{p.staff}</li>
                <li>{p.tx}</li>
              </ul>
              <input type="radio" checked={plan === p.id} readOnly className="absolute bottom-3 right-3 accent-violet-accent" />
            </button>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock letter="B" title="Billing Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Billing Cycle">
            <select className="crm-select" defaultValue="monthly"><option>Monthly</option><option>Annual</option></select>
          </Field>
          <Field label="Currency">
            <select className="crm-select" defaultValue="INR"><option>INR (₹)</option></select>
          </Field>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Visa ending in 4242</p>
            <p className="text-xs text-gray-500">Expires 12/28</p>
          </div>
          <button type="button" className="text-xs font-semibold text-violet-accent">Change</button>
        </div>
        <p className="mt-3 text-xs text-gray-500">Your subscription will start after onboarding is completed.</p>
      </SectionBlock>

      <SectionBlock letter="C" title="Usage Limits & Add-ons">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { l: "Staff Seats", v: "200 included" },
            { l: "Transaction Limit", v: "50,000 / month" },
            { l: "Additional Storage", v: "100 GB included" },
            { l: "SMS Credits (Add-on)", v: "₹0.20 per SMS · 1,000" },
          ].map((row) => (
            <div key={row.l} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-sm">
              <span className="font-medium text-gray-700">{row.l}</span>
              <span className="text-xs text-gray-500">{row.v}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-violet-soft px-4 py-3 text-center">
          <span className="text-sm text-gray-600">Estimated Total: </span>
          <span className="text-lg font-black text-violet-accent">₹9,999 / month</span>
        </div>
      </SectionBlock>
    </StepLayout>
  );
}
