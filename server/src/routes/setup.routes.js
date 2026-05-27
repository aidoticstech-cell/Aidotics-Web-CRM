const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");

const router = express.Router();
router.use(authRequired);

router.get(
  "/progress",
  requirePermission("bureau:read"),
  asyncHandler(async (req, res) => {
    const progress = await prisma.setupProgress.findUnique({ where: { bureauId: req.auth.bureauId } });
    res.json({ progress: progress || { steps: {}, isComplete: false } });
  })
);

router.post(
  "/complete",
  requirePermission("bureau:write"),
  asyncHandler(async (req, res) => {
    const parsed = z.object({ steps: z.record(z.string(), z.boolean()).optional() }).safeParse(req.body || {});
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const progress = await prisma.setupProgress.upsert({
      where: { bureauId: req.auth.bureauId },
      create: {
        bureauId: req.auth.bureauId,
        steps: parsed.data.steps || {},
        isComplete: true,
        completedAt: new Date(),
      },
      update: {
        steps: parsed.data.steps || undefined,
        isComplete: true,
        completedAt: new Date(),
      },
    });
    res.json({ progress });
  })
);

module.exports = router;
