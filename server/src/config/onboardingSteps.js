/**
 * Bureau onboarding wizard — fixed order (matches UI screens).
 * Your marketing site can link to CRM_WEB_URL/onboarding (or similar).
 */
const ONBOARDING_STEPS = [
  {
    order: 1,
    slug: "profile_verification",
    title: "Profile & Verification",
    description: "Basic bureau identity, services, and verification details",
    apiModules: ["bureau", "verification"],
  },
  {
    order: 2,
    slug: "branches_billing",
    title: "Branches & Billing",
    description: "Branch setup, GST/billing preferences, and payment collection",
    apiModules: ["branches", "billing", "payments"],
  },
  {
    order: 3,
    slug: "operations_setup",
    title: "Operations Setup",
    description: "Operating model, lead allocation, approvals, and payment handling",
    apiModules: ["onboarding_draft"],
  },
  {
    order: 4,
    slug: "workforce_roles",
    title: "Workforce & Roles",
    description: "Internal team structure, roles, permissions, and workforce categories",
    apiModules: ["team", "roles", "workforce", "onboarding_draft"],
  },
  {
    order: 5,
    slug: "duty_engine",
    title: "Duty Operations Engine",
    description: "Duty preferences, broadcast settings, approval flow, and escalation rules",
    apiModules: ["workflow", "onboarding_draft"],
  },
  {
    order: 6,
    slug: "workflow_automation",
    title: "Workflow & Automation",
    description: "Workflow builder, approval rules, partner network, notifications, and SLAs",
    apiModules: ["workflow", "onboarding_draft"],
  },
  {
    order: 7,
    slug: "public_brand_profile",
    title: "Public Brand Profile",
    description: "Public-facing bureau profile, trust signals, gallery, SEO, and sharing",
    apiModules: ["onboarding_draft", "files"],
  },
  {
    order: 8,
    slug: "subscription_go_live",
    title: "Subscription & Go Live",
    description: "Plan selection, final checklist, and CRM launch",
    apiModules: ["setup", "onboarding_draft"],
  },
];

const SLUG_TO_STEP = Object.fromEntries(ONBOARDING_STEPS.map((s) => [s.slug, s]));
const TOTAL_STEPS = ONBOARDING_STEPS.length;

function getStepBySlug(slug) {
  return SLUG_TO_STEP[String(slug || "").trim()] || null;
}

function getStepByOrder(order) {
  return ONBOARDING_STEPS.find((s) => s.order === Number(order)) || null;
}

function isValidSlug(slug) {
  return Boolean(getStepBySlug(slug));
}

module.exports = {
  ONBOARDING_STEPS,
  TOTAL_STEPS,
  getStepBySlug,
  getStepByOrder,
  isValidSlug,
};
