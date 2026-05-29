const prisma = require("../db");
const { AppError } = require("../common/errors");
const bureauProfileDoc = require("./bureauProfileDoc.service");
const {
  ONBOARDING_STEPS,
  TOTAL_STEPS,
  getStepBySlug,
  isValidSlug,
} = require("../config/onboardingSteps");

function defaultStepsStatus() {
  const out = {};
  for (const step of ONBOARDING_STEPS) {
    out[step.slug] = { status: "pending", completedAt: null, savedAt: null };
  }
  return out;
}

function mergeStepsStatus(existing) {
  const base = defaultStepsStatus();
  if (!existing || typeof existing !== "object") return base;
  for (const slug of Object.keys(base)) {
    if (existing[slug]) {
      base[slug] = { ...base[slug], ...existing[slug] };
    }
  }
  return base;
}

function normalizeStepOrder(order) {
  const n = Number(order) || 1;
  return Math.min(Math.max(1, n), TOTAL_STEPS);
}

async function getOrCreateProgress(bureauId) {
  let progress = await prisma.setupProgress.findUnique({ where: { bureauId } });
  if (!progress) {
    progress = await prisma.setupProgress.create({
      data: {
        bureauId,
        currentStep: 1,
        stepsStatus: defaultStepsStatus(),
        stepDrafts: {},
        steps: {},
      },
    });
  }
  return progress;
}

function buildStepView(progress, step) {
  const status = mergeStepsStatus(progress.stepsStatus)[step.slug] || { status: "pending" };
  const draft = (progress.stepDrafts && progress.stepDrafts[step.slug]) || null;
  const isCurrent = progress.currentStep === step.order;
  const isAccessible = step.order <= progress.currentStep;
  return {
    ...step,
    status: status.status,
    completedAt: status.completedAt,
    savedAt: status.savedAt,
    isCurrent,
    isAccessible,
    hasDraft: draft != null,
  };
}

async function getOnboardingState(bureauId) {
  const progress = await getOrCreateProgress(bureauId);
  const currentStep = normalizeStepOrder(progress.currentStep);
  const progressView = { ...progress, currentStep };
  const stepsStatus = mergeStepsStatus(progress.stepsStatus);
  const steps = ONBOARDING_STEPS.map((step) => buildStepView(progressView, step));

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const current = getStepBySlug(
    ONBOARDING_STEPS.find((s) => s.order === currentStep)?.slug
  ) || ONBOARDING_STEPS[0];

  return {
    totalSteps: TOTAL_STEPS,
    currentStep,
    currentStepSlug: current.slug,
    isComplete: progress.isComplete,
    completedAt: progress.completedAt,
    completedCount,
    steps,
    stepsStatus,
    crmWebUrl: process.env.CRM_WEB_URL || null,
  };
}

async function saveStepDraft(bureauId, slug, data, actorId) {
  if (!isValidSlug(slug)) throw new AppError("Invalid onboarding step", 400);

  const progress = await getOrCreateProgress(bureauId);
  const step = getStepBySlug(slug);
  const stepDrafts = { ...(progress.stepDrafts || {}) };
  stepDrafts[slug] = data;

  const stepsStatus = mergeStepsStatus(progress.stepsStatus);
  stepsStatus[slug] = {
    ...stepsStatus[slug],
    status: stepsStatus[slug].status === "completed" ? "completed" : "draft",
    savedAt: new Date().toISOString(),
  };

  const updated = await prisma.setupProgress.update({
    where: { bureauId },
    data: {
      stepDrafts,
      stepsStatus,
      steps: stepsStatus,
      updatedBy: actorId,
    },
  });

  let profileStorage = null;
  if (slug === "profile_verification") {
    profileStorage = await bureauProfileDoc.saveProfileDocument(bureauId, data, actorId, {
      source: "onboarding_draft",
    });
  }

  return {
    step: buildStepView(updated, step),
    draft: data,
    storageSlug: profileStorage?.bureau?.storageSlug || null,
    profileDocumentPath: profileStorage?.storage?.path || null,
  };
}

async function getStepDraft(bureauId, slug) {
  if (!isValidSlug(slug)) throw new AppError("Invalid onboarding step", 400);
  const progress = await getOrCreateProgress(bureauId);
  const step = getStepBySlug(slug);
  const draft = (progress.stepDrafts && progress.stepDrafts[slug]) || null;
  return { step: buildStepView(progress, step), draft };
}

/** Push profile_verification draft into core Bureau + services + locations when step completes. */
async function syncBureauProfileDraftToCore(bureauId, actorId) {
  const progress = await prisma.setupProgress.findUnique({ where: { bureauId } });
  const draft = progress?.stepDrafts?.profile_verification;
  if (!draft || typeof draft !== "object") return;

  const name =
    typeof draft.displayName === "string" && draft.displayName.trim()
      ? draft.displayName.trim()
      : typeof draft.legalName === "string" && draft.legalName.trim()
        ? draft.legalName.trim()
        : null;

  if (name) {
    await prisma.bureau.update({
      where: { id: bureauId },
      data: {
        name,
        phone: typeof draft.ownerMobile === "string" && draft.ownerMobile.trim() ? draft.ownerMobile.trim() : undefined,
        email:
          typeof draft.ownerEmail === "string" && draft.ownerEmail.trim()
            ? draft.ownerEmail.trim().toLowerCase()
            : undefined,
        updatedBy: actorId,
      },
    });
  }

  const serviceLabels = Array.isArray(draft.services) ? draft.services.filter((s) => typeof s === "string" && s.trim()) : [];
  if (serviceLabels.length) {
    await prisma.bureauService.updateMany({ where: { bureauId, deletedAt: null }, data: { deletedAt: new Date() } });
    await prisma.bureauService.createMany({
      data: serviceLabels.map((s, i) => ({
        bureauId,
        name: String(s),
        sortOrder: i,
        createdBy: actorId,
      })),
    });
  }

  const cities = Array.isArray(draft.cities) ? draft.cities.filter((c) => typeof c === "string" && c.trim()) : [];
  if (cities.length) {
    await prisma.bureauLocation.updateMany({ where: { bureauId, deletedAt: null }, data: { deletedAt: new Date() } });
    await prisma.bureauLocation.createMany({
      data: cities.map((city) => ({
        bureauId,
        city: String(city),
        createdBy: actorId,
      })),
    });
  }
}

async function completeStep(bureauId, slug, actorId) {
  if (!isValidSlug(slug)) throw new AppError("Invalid onboarding step", 400);

  const progress = await getOrCreateProgress(bureauId);
  const currentStep = normalizeStepOrder(progress.currentStep);
  const step = getStepBySlug(slug);

  if (step.order > currentStep) {
    throw new AppError("Complete earlier steps first", 400);
  }

  const stepsStatus = mergeStepsStatus(progress.stepsStatus);
  stepsStatus[slug] = {
    ...stepsStatus[slug],
    status: "completed",
    completedAt: new Date().toISOString(),
    savedAt: stepsStatus[slug].savedAt || new Date().toISOString(),
  };

  let nextStep = currentStep;
  if (step.order === currentStep && currentStep < TOTAL_STEPS) {
    nextStep = currentStep + 1;
  }

  const isComplete = slug === "subscription_go_live" || nextStep > TOTAL_STEPS;

  await prisma.setupProgress.update({
    where: { bureauId },
    data: {
      stepsStatus,
      steps: stepsStatus,
      currentStep: isComplete ? TOTAL_STEPS : nextStep,
      isComplete: isComplete || undefined,
      completedAt: isComplete ? new Date() : undefined,
      updatedBy: actorId,
    },
  });

  if (slug === "profile_verification") {
    await syncBureauProfileDraftToCore(bureauId, actorId);
    const progressAfter = await prisma.setupProgress.findUnique({ where: { bureauId } });
    const draft = progressAfter?.stepDrafts?.profile_verification;
    if (draft && typeof draft === "object") {
      await bureauProfileDoc.saveProfileDocument(bureauId, draft, actorId, {
        source: "onboarding_complete",
      });
    }
  }

  return getOnboardingState(bureauId);
}

async function goToStep(bureauId, order, actorId) {
  const step = ONBOARDING_STEPS.find((s) => s.order === Number(order));
  if (!step) throw new AppError("Invalid step number", 400);

  const progress = await getOrCreateProgress(bureauId);
  const currentStep = normalizeStepOrder(progress.currentStep);
  if (step.order > currentStep + 1) {
    throw new AppError("Cannot skip ahead of onboarding progress", 400);
  }

  await prisma.setupProgress.update({
    where: { bureauId },
    data: { currentStep: step.order, updatedBy: actorId },
  });

  return getOnboardingState(bureauId);
}

module.exports = {
  getOnboardingState,
  saveStepDraft,
  getStepDraft,
  completeStep,
  goToStep,
  ONBOARDING_STEPS,
};
