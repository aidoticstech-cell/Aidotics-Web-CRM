const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { ONBOARDING_STEPS } = require("../config/onboardingSteps");
const onboarding = require("../services/onboarding.service");
const bureauProfileDoc = require("../services/bureauProfileDoc.service");
const { uploadSingle } = require("../middleware/upload");

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

/** KYC upload for profile step — stored under {registerName}/profile/kyc/... */
router.post(
  "/profile_verification/upload",
  requirePermission("bureau:write"),
  uploadSingle("file"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        docType: z.enum(["gst_certificate", "pan_card", "aadhaar_card", "cancelled_cheque"]),
        branchId: z.string().uuid().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("docType is required", 400);
    if (!req.file?.buffer?.length) throw new AppError("File is required", 400);

    const result = await bureauProfileDoc.uploadProfileFile({
      bureauId: req.auth.bureauId,
      actorId: req.auth.userId,
      docType: parsed.data.docType,
      buffer: req.file.buffer,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      branchId: parsed.data.branchId,
    });

    const progress = await prisma.setupProgress.findUnique({ where: { bureauId: req.auth.bureauId } });
    const draft = { ...(progress?.stepDrafts?.profile_verification || {}) };
    const uploads = { ...(draft.uploads || {}) };
    uploads[parsed.data.docType] = {
      fileId: result.file.id,
      path: result.path,
      fileName: result.file.fileName,
      uploadedAt: new Date().toISOString(),
    };
    draft.uploads = uploads;

    await onboarding.saveStepDraft(req.auth.bureauId, "profile_verification", draft, req.auth.userId);

    res.status(201).json({
      storageSlug: result.storageSlug,
      bucket: result.bucket,
      path: result.path,
      file: result.file,
      verificationDocument: result.verificationDocument,
    });
  })
);

module.exports = router;
