"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { saveDraft } from "@/lib/onboarding-api";
import { getStepBySlug, ONBOARDING_STEPS } from "@/lib/onboarding-steps";

export function OnboardingFooter({
  slug,
  getData,
  onSaved,
  demoMode = false,
  onContinue,
}: {
  slug: string;
  getData: () => Record<string, unknown>;
  onSaved?: () => void;
  demoMode?: boolean;
  onContinue: () => Promise<void>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"draft" | "next" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const step = getStepBySlug(slug);
  const prev = step ? ONBOARDING_STEPS.find((s) => s.order === step.order - 1) : null;

  const canGoLive = true;

  async function handleDraft() {
    if (demoMode) return;
    setLoading("draft");
    setError(null);
    try {
      await saveDraft(slug, getData());
      onSaved?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setLoading(null);
    }
  }

  async function handleContinue() {
    setLoading("next");
    setError(null);
    try {
      if (!canGoLive) {
        setError("Please confirm that all information is accurate before going live.");
        return;
      }
      await onContinue();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to continue");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="border-t border-gray-100 pt-6">
      {error && <p className="alert-error mb-5">{error}</p>}
      <p className="mb-5 text-xs leading-relaxed text-gray-500">
        Fields marked with <span className="font-semibold text-red-500">*</span> are required.
      </p>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          className="btn-secondary order-2 lg:order-1"
          disabled={!prev || !!loading}
          onClick={() => prev && router.push(demoMode ? `/onboarding/${prev.slug}?demo=1` : `/onboarding/${prev.slug}`)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </button>
        <div className="order-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:order-2 lg:flex-1">
          <button type="button" className="btn-secondary !gap-2 sm:mx-auto lg:mx-0" disabled={!!loading || demoMode} onClick={handleDraft}>
            <Save className="h-4 w-4 text-gray-500" />
            {loading === "draft" ? "Saving…" : "Save as Draft"}
          </button>
          <button
            type="button"
            className="btn-primary !w-full !gap-2 !shadow-lg sm:!w-auto sm:!min-w-[240px]"
            disabled={!!loading || !canGoLive}
            onClick={handleContinue}
          >
            {loading === "next" ? "Saving…" : slug === "subscription_go_live" ? "Launch My CRM" : "Continue to Next Step"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
