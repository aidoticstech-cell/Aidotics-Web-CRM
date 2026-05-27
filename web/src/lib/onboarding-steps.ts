export type OnboardingStepDef = {
  order: number;
  slug: string;
  title: string;
  description: string;
};

export const ONBOARDING_STEPS: OnboardingStepDef[] = [
  { order: 1, slug: "bureau_profile", title: "Bureau Profile", description: "Legal name, logo, services, cities, primary contact" },
  { order: 2, slug: "kyc_verification", title: "KYC & Verification", description: "Ownership, address, signatory, business verification" },
  { order: 3, slug: "branch_billing", title: "Branch & Billing Setup", description: "Branches, GST, invoice settings" },
  { order: 4, slug: "payment_collection", title: "Payment Collection Setup", description: "UPI, QR, bank, payment preferences" },
  { order: 5, slug: "operating_style", title: "Operating Style Setup", description: "Business model, coverage, working hours" },
  { order: 6, slug: "duty_operations", title: "Duty Operations Preferences", description: "Duty types, broadcast, approval rules" },
  { order: 7, slug: "responsibility_automation", title: "Responsibility Automation", description: "Process mapping, automation, escalation" },
  { order: 8, slug: "staff_skill_matrix", title: "Staff Skill Matrix", description: "Skills and certifications" },
  { order: 9, slug: "workforce_setup", title: "Workforce Setup", description: "Partner roster and import" },
  { order: 10, slug: "digital_identity", title: "Digital Identity System", description: "Bureau IDs and QR" },
  { order: 11, slug: "team_roles", title: "Team Structure & Roles", description: "Invite staff, assign branches" },
  { order: 12, slug: "permission_matrix", title: "Permission Matrix", description: "Role permissions" },
  { order: 13, slug: "partner_network", title: "Partner Network Integration", description: "Aidotics partner network" },
  { order: 14, slug: "workflow_builder", title: "Workflow Builder", description: "Custom workflows" },
  { order: 15, slug: "public_profile", title: "Public Bureau Profile", description: "Public listing and SEO" },
  { order: 16, slug: "subscription", title: "Subscription Setup", description: "CRM plan and billing" },
  { order: 17, slug: "crm_ready", title: "CRM Ready", description: "Review and go live" },
];

export function getStepBySlug(slug: string) {
  return ONBOARDING_STEPS.find((s) => s.slug === slug);
}

export const TOTAL_STEPS = ONBOARDING_STEPS.length;
