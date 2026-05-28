import type { OnboardingState } from "./onboarding-api";
import { ONBOARDING_STEPS, TOTAL_STEPS } from "./onboarding-steps";

export const BUREAU_PROFILE_DEFAULTS: Record<string, unknown> = {
  legalName: "CarePlus Healthcare Services Pvt. Ltd.",
  displayName: "CarePlus Healthcare",
  establishedYear: "2023",
  staffCount: "126",
  monthlyDuties: "250 - 300",
  ownerName: "Priya Sharma",
  ownerMobile: "+91 98765 43210",
  ownerEmail: "priya.sharma@careplus.com",
  website: "www.careplushealthcare.com",
  serviceIds: ["nurse", "semi_nurse", "attendant", "elder_care"],
  services: ["Nurse", "Semi Nurse", "Attendant", "Elder Care"],
  cities: ["Delhi", "Gurgaon", "Noida", "Faridabad"],
};

/** Empty shapes merged with API drafts when `draft` is null (real onboarding). */
const BUREAU_PROFILE_EMPTY: Record<string, unknown> = {
  legalName: "",
  displayName: "",
  establishedYear: "",
  staffCount: "",
  monthlyDuties: "",
  ownerName: "",
  ownerMobile: "",
  ownerEmail: "",
  website: "",
  serviceIds: [] as string[],
  services: [] as string[],
  cities: [] as string[],
};

export function getStepDefaults(slug: string, opts?: { demo?: boolean }): Record<string, unknown> {
  const demo = !!opts?.demo;
  if (slug === "profile_verification") {
    return demo ? { ...BUREAU_PROFILE_DEFAULTS } : { ...BUREAU_PROFILE_EMPTY };
  }
  if (slug === "branches_billing") {
    return {
      gstNumber: demo ? "27ABCDE1234F1Z5" : "",
      invoicePrefix: demo ? "INV" : "",
    };
  }
  if (slug === "operations_setup") {
    return {
      operatingModel: demo ? "owner_driven" : "owner_driven",
      orgStructure: demo ? "centralized" : "centralized",
    };
  }
  if (slug === "workforce_roles") {
    return {
      teamCount: demo ? 32 : 0,
    };
  }
  if (slug === "duty_engine") {
    return {
      dutyTypes: demo ? ["8hr", "12hr", "24hr"] : [],
    };
  }
  if (slug === "workflow_automation") {
    return {
      workflowStages: demo ? 7 : 0,
    };
  }
  if (slug === "public_brand_profile") {
    return {
      tagline: demo ? "Compassionate Care. Trusted Support." : "",
    };
  }
  if (slug === "subscription_go_live") {
    return { plan: demo ? "professional" : "professional" };
  }
  return {};
}

export function buildMockOnboardingState(currentSlug: string): OnboardingState {
  const current = ONBOARDING_STEPS.find((s) => s.slug === currentSlug) ?? ONBOARDING_STEPS[0];
  return {
    totalSteps: TOTAL_STEPS,
    currentStep: current.order,
    currentStepSlug: current.slug,
    isComplete: false,
    completedCount: Math.max(0, current.order - 1),
    crmWebUrl: null,
    steps: ONBOARDING_STEPS.map((s) => ({
      order: s.order,
      slug: s.slug,
      title: s.title,
      description: s.description,
      status: s.order < current.order ? "completed" : s.order === current.order ? "draft" : "pending",
      isCurrent: s.slug === current.slug,
      isAccessible: s.order <= current.order,
      hasDraft: s.slug === current.slug,
    })),
  };
}
