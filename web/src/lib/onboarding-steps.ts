export type OnboardingStepDef = {
  order: number;
  slug: string;
  title: string;
  description: string;
};

export const ONBOARDING_STEPS: OnboardingStepDef[] = [
  { order: 1, slug: "profile_verification", title: "Profile & Verification", description: "Bureau identity, services, and verification setup" },
  { order: 2, slug: "branches_billing", title: "Branches & Billing", description: "Branch offices, GST, invoice, and payment settings" },
  { order: 3, slug: "operations_setup", title: "Operations Setup", description: "Operating model, lead allocation, approvals, and payment handling" },
  { order: 4, slug: "workforce_roles", title: "Workforce & Roles", description: "Team members, role templates, permissions, and workforce structure" },
  { order: 5, slug: "duty_engine", title: "Duty Operations Engine", description: "Duty preferences, client approvals, and escalation controls" },
  { order: 6, slug: "workflow_automation", title: "Workflow & Automation", description: "Workflow builder, notifications, partner network, and SLA rules" },
  { order: 7, slug: "public_brand_profile", title: "Public Brand Profile", description: "Branding, services showcase, trust signals, and discoverability" },
  { order: 8, slug: "subscription_go_live", title: "Subscription & Go Live", description: "Plan selection, launch readiness, and CRM activation" },
];

export function getStepBySlug(slug: string) {
  return ONBOARDING_STEPS.find((s) => s.slug === slug);
}

export const TOTAL_STEPS = ONBOARDING_STEPS.length;
