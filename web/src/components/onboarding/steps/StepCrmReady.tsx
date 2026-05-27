"use client";

import { useState } from "react";
import {
  PartyPopper,
  CheckCircle2,
  Download,
  Users,
  GitBranch,
  UserPlus,
  BarChart3,
  ArrowRight,
  Printer,
} from "lucide-react";
import { ONBOARDING_STEPS } from "@/lib/onboarding-steps";
import { AsideCard, StepHero } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const WHATS_NEXT = [
  { label: "Invite Your Team", Icon: Users },
  { label: "Set Up First Workflow", Icon: GitBranch },
  { label: "Add Your First Client", Icon: UserPlus },
  { label: "Explore Reports", Icon: BarChart3 },
];

const HEALTH = ["Configuration", "Security", "Compliance", "Integrations", "Workflows"];

export function StepCrmReady({ data, onChange, footer, requestComplete }: StepProps) {
  const acknowledged = !!data.acknowledged;
  const [heroBusy, setHeroBusy] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

  async function handleHeroActivate() {
    setHeroError(null);
    if (!acknowledged) {
      setHeroError("Please tick the confirmation below before activating.");
      return;
    }
    if (!requestComplete) return;
    setHeroBusy(true);
    try {
      await requestComplete();
    } catch (e) {
      setHeroError(e instanceof Error ? e.message : "Could not complete onboarding");
    } finally {
      setHeroBusy(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <div className="onboarding-panel !overflow-hidden !p-0">
        <StepHero
          icon={PartyPopper}
          title="CRM Ready"
          subtitle="Review your setup and complete onboarding to activate your bureau."
        />

        <div className="border-b border-gray-100 bg-gradient-to-b from-emerald-50/80 to-white px-6 py-10 text-center lg:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-200">
            <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="mt-5 text-2xl font-black text-gray-900">Congratulations! Your Bureau is CRM Ready!</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
            You&apos;ve successfully completed all onboarding steps. Your bureau is configured and ready to streamline operations.
          </p>
          {heroError && <p className="mx-auto mt-3 max-w-lg text-sm text-red-600">{heroError}</p>}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="btn-primary !gap-2"
              disabled={heroBusy || !acknowledged}
              onClick={handleHeroActivate}
            >
              {heroBusy ? "Activating…" : "Complete Onboarding & Activate Bureau"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" className="btn-outline-purple !gap-2">
              <Download className="h-4 w-4" />
              Download Setup Summary
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <h3 className="text-base font-bold text-gray-900">Onboarding Summary</h3>
          <p className="text-sm text-gray-500">Review your completed setup.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {ONBOARDING_STEPS.slice(0, -1).map((s) => (
              <div key={s.slug} className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800">{s.title}</p>
                  <p className="truncate text-[11px] text-gray-500">{s.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">Completed</span>
              </div>
            ))}
          </div>

          <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={acknowledged} onChange={(e) => onChange({ acknowledged: e.target.checked })} className="accent-violet-accent" />
            I confirm all information is accurate and ready to go live
          </label>
        </div>

        {footer && <div className="border-t border-gray-100 px-6 pb-6 pt-2 lg:px-8">{footer}</div>}
      </div>

      <aside className="space-y-4">
        <AsideCard title="What's Next?">
          <ul className="space-y-2">
            {WHATS_NEXT.map(({ label, Icon }) => (
              <li key={label}>
                <button type="button" className="flex w-full items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5 text-sm font-medium hover:bg-gray-50">
                  <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-violet-accent" />{label}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              </li>
            ))}
          </ul>
        </AsideCard>

        <AsideCard title="Bureau Health Check">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#d1fae5" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="100 100" />
              </svg>
              <span className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-black text-emerald-600">
                100%
                <span className="font-semibold">Excellent</span>
              </span>
            </div>
            <ul className="space-y-1 text-xs">
              {HEALTH.map((h) => (
                <li key={h} className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> {h}
                </li>
              ))}
            </ul>
          </div>
        </AsideCard>

        <AsideCard>
          <button type="button" className="btn-secondary w-full !gap-2 text-xs">
            <Printer className="h-4 w-4" />
            Print Summary
          </button>
        </AsideCard>
      </aside>
    </div>
  );
}
