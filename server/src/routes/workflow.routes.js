const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { notDeletedWhere } = require("../common/pagination");

const router = express.Router();
router.use(authRequired);

router.post(
  "/preferences",
  requirePermission("bureau:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        businessModel: z.string().nullable().optional(),
        leadAssignment: z.string().nullable().optional(),
        dutyAssignment: z.string().nullable().optional(),
        approvalRules: z.record(z.string(), z.unknown()).nullable().optional(),
        paymentHandlingStyle: z.string().nullable().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const pref = await prisma.workflowPreference.upsert({
      where: { bureauId: req.auth.bureauId },
      create: { bureauId: req.auth.bureauId, ...parsed.data, createdBy: req.auth.userId },
      update: { ...parsed.data, updatedBy: req.auth.userId },
    });
    res.json({ preferences: pref });
  })
);

router.get(
  "/preferences",
  requirePermission("bureau:read"),
  asyncHandler(async (req, res) => {
    const pref = await prisma.workflowPreference.findFirst({
      where: { bureauId: req.auth.bureauId, ...notDeletedWhere() },
    });
    res.json({ preferences: pref });
  })
);

module.exports = router;
