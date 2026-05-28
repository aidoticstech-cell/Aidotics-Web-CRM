"use client";

import { Wallet } from "lucide-react";
import { AsideCard, SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    subtitle: "Perfect for small bureaus getting started.",
    price: "₹1,999",
    billed: "Billed annually (Save ₹4,000)",
    points: ["Up to 25 Staff", "1 Branch", "Basic CRM Features", "WhatsApp & SMS Alerts", "Standard Support"],
  },
  {
    id: "growth",
    name: "Growth",
    subtitle: "For growing bureaus with expanding operations.",
    price: "₹3,999",
    billed: "Billed annually (Save ₹6,500)",
    points: ["Up to 75 Staff", "Up to 5 Branches", "Advanced CRM Features", "Workflow Automation", "Priority Support"],
  },
  {
    id: "professional",
    name: "Professional",
    subtitle: "For established bureaus with high volume.",
    price: "₹7,999",
    billed: "Billed annually (Save ₹19,200)",
    popular: true,
    points: ["Up to 250 Staff", "Up to 15 Branches", "AI Advanced Features", "Custom Workflows", "Dedicated Support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "For large bureaus with complex requirements.",
    price: "Custom",
    billed: "Tailored for your needs.",
    points: ["Unlimited Staff", "Unlimited Branches", "All Features + Customization", "API Access", "Dedicated Account Manager"],
  },
];

export function StepSubscription({ data, onChange, footer }: StepProps) {
  const plan = (data.plan as string) || "professional";

  return (
    <StepLayout
      icon={Wallet}
      title="Subscription & Go Live"
      subtitle="Choose your plan, review final checklist, and launch your CRM."
      tabs={["Choose Plan", "Final Checklist", "Go Live"]}
      activeTab={0}
      footer={footer}
      aside={
        <>
          <AsideCard title="Subscription Summary">
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-center justify-between"><span>Plan</span><span className="font-semibold text-gray-900">Professional (Yearly)</span></li>
              <li className="flex items-center justify-between"><span>Staff Limit</span><span className="font-semibold text-gray-900">Up to 250 Staff</span></li>
              <li className="flex items-center justify-between"><span>Branch Limit</span><span className="font-semibold text-gray-900">Up to 15 Branches</span></li>
              <li className="flex items-center justify-between"><span>Next Billing Date</span><span className="font-semibold text-gray-900">15 May 2025</span></li>
              <li className="flex items-center justify-between border-t pt-2"><span>Amount</span><span className="text-base font-black text-violet-accent">₹95,988 / year</span></li>
            </ul>
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-center text-[11px] font-semibold text-emerald-700">
              You Save ₹19,200 with yearly billing!
            </div>
          </AsideCard>

          <AsideCard title="What's Next?">
            <ul className="space-y-2 text-xs text-gray-700">
              {[
                "Account Activation - Your account will be active immediately after launch.",
                "Team Onboarding - Invite your team members and set their access.",
                "Import Data - Import your existing leads, clients and staff data.",
                "Start Operations - Begin managing leads, duties and staff seamlessly.",
              ].map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          </AsideCard>

          <AsideCard title="Need Help?" className="border-sky-100 bg-sky-50/80">
            <p className="text-xs text-sky-900/80">Our onboarding team is here to help you go live smoothly.</p>
            <button type="button" className="btn-outline-purple mt-3 w-full !py-2 text-xs">Schedule a Call</button>
          </AsideCard>
        </>
      }
    >
      <SectionBlock letter="A" title="Choose Your Plan" subtitle="Select the plan that fits your bureau's needs. You can upgrade or downgrade anytime.">
        <div className="mb-3 flex justify-end">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 text-[11px]">
            <button type="button" className="rounded-md px-3 py-1 text-gray-600">Monthly</button>
            <button type="button" className="rounded-md bg-violet-soft px-3 py-1 font-semibold text-violet-accent">Yearly (Save 20%)</button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange({ plan: p.id })}
              className={`relative rounded-xl border p-3 text-left transition ${plan === p.id ? "border-violet-accent bg-violet-soft/40 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
            >
              {p.popular && <span className="absolute -top-2 right-2 rounded-full bg-violet-accent px-2 py-0.5 text-[9px] font-bold text-white">Most Popular</span>}
              <p className="text-sm font-bold text-gray-900">{p.name}</p>
              <p className="mt-0.5 text-[11px] text-gray-500">{p.subtitle}</p>
              <p className="mt-2 text-2xl font-black text-gray-900">{p.price}<span className="text-xs font-medium text-gray-500">/month</span></p>
              <p className="text-[10px] text-violet-accent">{p.billed}</p>
              <ul className="mt-2 space-y-1 text-[11px] text-gray-600">
                {p.points.map((pt) => (
                  <li key={pt}>● {pt}</li>
                ))}
              </ul>
              <span className={`mt-3 inline-block w-full rounded-md border px-2 py-1.5 text-center text-xs font-semibold ${plan === p.id ? "border-violet-accent bg-violet-accent text-white" : "border-gray-200 text-gray-700"}`}>
                {p.id === "enterprise" ? "Contact Sales" : "Select Plan"}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[11px]">
          <span>All plans include: 99.9% Uptime • Secure Data • Regular Updates • 7-Day Free Trial</span>
          <button type="button" className="font-semibold text-violet-accent">Talk to our expert</button>
        </div>
      </SectionBlock>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionBlock letter="B" title="Final Checklist" subtitle="Review and confirm your setup before launching your CRM." className="lg:col-span-2">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Bureau Profile",
              "Branches & Billing",
              "Operations Setup",
              "Workforce & Roles",
              "Duty Operations Engine",
              "Workflow & Automation",
              "Brand Profile",
              "System Settings",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2 text-xs">
                <span className="font-medium text-gray-700">{item}</span>
                <span className="text-emerald-600">●</span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            Great! Everything looks good. You're all set to launch your CRM.
          </div>
        </SectionBlock>

        <SectionBlock letter="C" title="Go Live" subtitle="You are ready to launch your bureau CRM.">
          <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-4 text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-[radial-gradient(circle,#c4b5fd,#ede9fe)]" />
            <p className="mt-3 text-xs text-gray-600">Once you launch, your team can start using the system immediately.</p>
            <button
              type="button"
              className="btn-primary mt-3 w-full"
              onClick={() => onChange({ launchReady: true })}
            >
              Launch My CRM
            </button>
          </div>
        </SectionBlock>
      </div>

      <div className="hidden">
        {/* Keep persisted shape for backward compatibility with existing payloads */}
        <input value={(data.billingCycle as string) || "yearly"} readOnly />
        <input value={(data.currency as string) || "INR"} readOnly />
        <input value={(data.estimatedTotal as string) || "₹95,988 / year"} readOnly />
        <div>
          {onChange && null}
        </div>
      </div>
    </StepLayout>
  );
}
