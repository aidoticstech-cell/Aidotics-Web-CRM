/**
 * Bureau onboarding wizard — fixed order (matches UI screens).
 * Your marketing site can link to CRM_WEB_URL/onboarding (or similar).
 */
const ONBOARDING_STEPS = [
  {
    order: 1,
    slug: "bureau_profile",
    title: "Bureau Profile",
    description: "Legal name, logo, services, cities, primary contact",
    apiModules: ["bureau"],
  },
  {
    order: 2,
    slug: "kyc_verification",
    title: "KYC & Verification",
    description: "Ownership, registered address, signatory, business verification",
    apiModules: ["verification"],
  },
  {
    order: 3,
    slug: "branch_billing",
    title: "Branch & Billing Setup",
    description: "Branches table, GST/PAN, invoice prefix, tax settings",
    apiModules: ["branches", "billing"],
  },
  {
    order: 4,
    slug: "payment_collection",
    title: "Payment Collection Setup",
    description: "UPI, QR, bank transfer, payment preferences, advance rules",
    apiModules: ["payments"],
  },
  {
    order: 5,
    slug: "operating_style",
    title: "Operating Style Setup",
    description: "Business model, structure, coverage, working days/hours",
    apiModules: ["onboarding_draft"],
  },
  {
    order: 6,
    slug: "duty_operations",
    title: "Duty Operations Preferences",
    description: "Duty types, approval rules, broadcast, cancellation, timing",
    apiModules: ["onboarding_draft", "workflow"],
  },
  {
    order: 7,
    slug: "responsibility_automation",
    title: "Responsibility Automation",
    description: "Process-role mapping, automation rules, escalation matrix",
    apiModules: ["onboarding_draft"],
  },
  {
    order: 8,
    slug: "staff_skill_matrix",
    title: "Staff Skill Matrix",
    description: "Skills, certifications, role capabilities",
    apiModules: ["onboarding_draft"],
  },
  {
    order: 9,
    slug: "workforce_setup",
    title: "Workforce Setup",
    description: "Link partners, import CSV, roster",
    apiModules: ["workforce"],
  },
  {
    order: 10,
    slug: "digital_identity",
    title: "Digital Identity System",
    description: "Bureau IDs, QR codes, verification badges",
    apiModules: ["onboarding_draft", "files"],
  },
  {
    order: 11,
    slug: "team_roles",
    title: "Team Structure & Roles",
    description: "Invite staff, assign branches",
    apiModules: ["team", "roles"],
  },
  {
    order: 12,
    slug: "permission_matrix",
    title: "Permission Matrix",
    description: "Fine-grained access per role",
    apiModules: ["roles"],
  },
  {
    order: 13,
    slug: "partner_network",
    title: "Partner Network Integration",
    description: "Aidotics partner network, sharing, requests",
    apiModules: ["workforce"],
  },
  {
    order: 14,
    slug: "workflow_builder",
    title: "Workflow Builder",
    description: "Custom workflows, SLAs, publish rules",
    apiModules: ["workflow", "onboarding_draft"],
  },
  {
    order: 15,
    slug: "public_profile",
    title: "Public Bureau Profile",
    description: "Public listing, SEO, WhatsApp share",
    apiModules: ["onboarding_draft"],
  },
  {
    order: 16,
    slug: "subscription",
    title: "Subscription Setup",
    description: "Aidotics CRM plan, billing cycle",
    apiModules: ["onboarding_draft"],
  },
  {
    order: 17,
    slug: "crm_ready",
    title: "CRM Ready",
    description: "Review checklist and go live",
    apiModules: ["setup"],
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
