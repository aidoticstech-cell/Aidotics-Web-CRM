const express = require("express");
const { z } = require("zod");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { ONBOARDING_STEPS } = require("../config/onboardingSteps");
const onboarding = require("../services/onboarding.service");

const router = express.Router();

/** Public: step list for marketing site / deep links (no auth). */
router.get("/steps", (_req, res) => {
  res.json({
    totalSteps: ONBOARDING_STEPS.length,
    steps: ONBOARDING_STEPS,
    crmWebUrl: process.env.CRM_WEB_URL || null,
  });
});

router.use(authRequired);

router.get(
  "/",
  requirePermission("bureau:read"),
  asyncHandler(async (req, res) => {
    res.json(await onboarding.getOnboardingState(req.auth.bureauId));
  })
);

router.get(
  "/:stepSlug",
  requirePermission("bureau:read"),
  asyncHandler(async (req, res) => {
    res.json(await onboarding.getStepDraft(req.auth.bureauId, req.params.stepSlug));
  })
);

router.put(
  "/:stepSlug/draft",
  requirePermission("bureau:write"),
  asyncHandler(async (req, res) => {
    const parsed = z.object({ data: z.record(z.string(), z.unknown()) }).safeParse(req.body);
    if (!parsed.success) throw new AppError("Body must include { data: { ... } }", 400);
    res.json(
      await onboarding.saveStepDraft(
        req.auth.bureauId,
        req.params.stepSlug,
        parsed.data.data,
        req.auth.userId
      )
    );
  })
);

router.post(
  "/:stepSlug/complete",
  requirePermission("bureau:write"),
  asyncHandler(async (req, res) => {
    res.json(await onboarding.completeStep(req.auth.bureauId, req.params.stepSlug, req.auth.userId));
  })
);

router.post(
  "/:stepSlug/save-draft",
  requirePermission("bureau:write"),
  asyncHandler(async (req, res) => {
    const parsed = z.object({ data: z.record(z.string(), z.unknown()).optional() }).safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);
    const result = await onboarding.saveStepDraft(
      req.auth.bureauId,
      req.params.stepSlug,
      parsed.data.data || {},
      req.auth.userId
    );
    res.json({ message: "Draft saved", ...result });
  })
);

router.post(
  "/go-to/:stepOrder",
  requirePermission("bureau:write"),
  asyncHandler(async (req, res) => {
    res.json(await onboarding.goToStep(req.auth.bureauId, req.params.stepOrder, req.auth.userId));
  })
);

module.exports = router;
