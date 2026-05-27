import { apiFetch } from "./api";

export type StepView = {
  order: number;
  slug: string;
  title: string;
  description: string;
  status: "pending" | "draft" | "completed";
  isCurrent: boolean;
  isAccessible: boolean;
  hasDraft: boolean;
};

export type OnboardingState = {
  totalSteps: number;
  currentStep: number;
  currentStepSlug: string;
  isComplete: boolean;
  completedCount: number;
  steps: StepView[];
  crmWebUrl: string | null;
};

export async function fetchOnboarding() {
  return apiFetch<OnboardingState>("/onboarding");
}

export async function fetchStepDraft(slug: string) {
  return apiFetch<{ step: StepView; draft: Record<string, unknown> | null }>(`/onboarding/${slug}`);
}

export async function saveDraft(slug: string, data: Record<string, unknown>) {
  return apiFetch(`/onboarding/${slug}/draft`, {
    method: "PUT",
    body: JSON.stringify({ data }),
  });
}

export async function completeStep(slug: string) {
  return apiFetch<OnboardingState>(`/onboarding/${slug}/complete`, { method: "POST" });
}

/** Save draft then mark step complete; returns updated onboarding state. */
export async function saveAndCompleteStep(slug: string, data: Record<string, unknown>) {
  await saveDraft(slug, data);
  return completeStep(slug);
}
