"use client";

import { useState } from "react";
import {
  PartyPopper,
  CheckCircle2,
  Download,
  ArrowRight,
} from "lucide-react";
import { ONBOARDING_STEPS } from "@/lib/onboarding-steps";
import { StepHero } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

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
    <div>
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
    </div>
  );
}
