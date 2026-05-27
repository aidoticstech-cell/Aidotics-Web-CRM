"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api";
import {
  fetchOnboarding,
  fetchStepDraft,
  saveDraft,
  saveAndCompleteStep,
  type OnboardingState,
} from "@/lib/onboarding-api";
import { buildMockOnboardingState, getStepDefaults } from "@/lib/mock-onboarding";
import { getStepBySlug, ONBOARDING_STEPS } from "@/lib/onboarding-steps";
import { OnboardingShell } from "./OnboardingShell";
import { OnboardingFooter } from "./OnboardingFooter";
import { getStepComponent } from "./steps";

export function OnboardingWizard({ stepSlug }: { stepSlug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const demoMode = searchParams.get("demo") === "1";
  const [state, setState] = useState<OnboardingState | null>(null);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const userEdited = useRef(false);

  const stepDef = getStepBySlug(stepSlug);

  const INTERNAL_LAYOUT = new Set([
    "bureau_profile",
    "crm_ready",
    "staff_skill_matrix",
    "workforce_setup",
    "digital_identity",
    "team_roles",
    "permission_matrix",
    "partner_network",
    "workflow_builder",
    "public_profile",
    "subscription",
  ]);
  const usesInternalLayout = INTERNAL_LAYOUT.has(stepSlug);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (demoMode) {
        setIsDemo(true);
        setState(buildMockOnboardingState(stepSlug));
        setData(getStepDefaults(stepSlug, { demo: true }));
        return;
      }

      const onboarding = await fetchOnboarding();
      setIsDemo(false);
      if (onboarding.isComplete) {
        router.replace("/dashboard");
        return;
      }
      const step = onboarding.steps.find((s) => s.slug === stepSlug);
      if (!step?.isAccessible) {
        const current = onboarding.steps.find((s) => s.isCurrent);
        router.replace(current ? `/onboarding/${current.slug}` : "/onboarding");
        return;
      }
      setState(onboarding);
      const draftRes = await fetchStepDraft(stepSlug);
      const draft = draftRes.draft || {};
      setData({ ...getStepDefaults(stepSlug, { demo: false }), ...draft });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setIsDemo(true);
        setState(buildMockOnboardingState(stepSlug));
        setData(getStepDefaults(stepSlug, { demo: true }));
        return;
      }
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [stepSlug, router, demoMode]);

  useEffect(() => {
    userEdited.current = false;
  }, [stepSlug]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (demoMode || isDemo || loading) return;
    if (!userEdited.current) return;
    const t = setTimeout(() => {
      saveDraft(stepSlug, data).catch(() => {});
    }, 1200);
    return () => clearTimeout(t);
  }, [data, stepSlug, demoMode, isDemo, loading]);

  const patch = useCallback((p: Record<string, unknown>) => {
    userEdited.current = true;
    setData((prev) => ({ ...prev, ...p }));
  }, []);

  const handleContinue = useCallback(async () => {
    if (!isDemo && stepSlug === "crm_ready" && !data.acknowledged) {
      throw new Error("Please confirm that all information is accurate before going live.");
    }
    if (isDemo) {
      const step = getStepBySlug(stepSlug);
      const next = step ? ONBOARDING_STEPS.find((s) => s.order === step.order + 1) : null;
      router.push(next ? `/onboarding/${next.slug}?demo=1` : "/onboarding/bureau_profile?demo=1");
      return;
    }
    const nextState = await saveAndCompleteStep(stepSlug, data);
    if (nextState.isComplete) {
      router.push("/dashboard");
      return;
    }
    const next = nextState.steps.find((s) => s.isCurrent);
    router.push(next ? `/onboarding/${next.slug}` : "/onboarding");
  }, [isDemo, stepSlug, data, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading onboarding…
      </div>
    );
  }

  if (error || !state || !stepDef) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error || "Step not found"}</p>
        <button type="button" className="btn-primary" onClick={() => load()}>
          Retry
        </button>
      </div>
    );
  }

  const StepComponent = getStepComponent(stepSlug);

  const footer = (
    <OnboardingFooter slug={stepSlug} getData={() => data} onSaved={load} demoMode={isDemo} onContinue={handleContinue} />
  );

  return (
    <OnboardingShell state={state} stepTitle={stepDef.title} stepDescription={stepDef.description}>
      {isDemo && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          Preview mode — add <code className="font-mono">?demo=1</code> to browse all steps without signing in.
        </div>
      )}
      {usesInternalLayout ? (
        <StepComponent data={data} onChange={patch} slug={stepSlug} footer={footer} requestComplete={handleContinue} />
      ) : (
        <div className="onboarding-panel">
          <StepComponent data={data} onChange={patch} slug={stepSlug} requestComplete={handleContinue} />
          {footer}
        </div>
      )}
    </OnboardingShell>
  );
}
