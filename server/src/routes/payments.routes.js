const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { notDeletedWhere } = require("../common/pagination");

const router = express.Router();
router.use(authRequired);

router.get(
  "/setup",
  requirePermission("payments:read"),
  asyncHandler(async (req, res) => {
    const methods = await prisma.paymentMethod.findMany({
      where: { bureauId: req.auth.bureauId, ...notDeletedWhere() },
      orderBy: { createdAt: "desc" },
    });
    res.json({ methods });
  })
);

router.post(
  "/setup",
  requirePermission("payments:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        type: z.enum(["BANK", "UPI", "QR"]),
        branchId: z.string().uuid().nullable().optional(),
        label: z.string().optional(),
        upiId: z.string().nullable().optional(),
        qrFileKey: z.string().nullable().optional(),
        isPrimary: z.boolean().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    if (parsed.data.isPrimary) {
      await prisma.paymentMethod.updateMany({
        where: { bureauId: req.auth.bureauId, deletedAt: null },
        data: { isPrimary: false },
      });
    }

    const method = await prisma.paymentMethod.create({
      data: {
        bureauId: req.auth.bureauId,
        ...parsed.data,
        createdBy: req.auth.userId,
      },
    });
    res.status(201).json({ method });
  })
);

router.patch(
  "/setup/:id",
  requirePermission("payments:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        label: z.string().nullable().optional(),
        upiId: z.string().nullable().optional(),
        qrFileKey: z.string().nullable().optional(),
        isPrimary: z.boolean().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const existing = await prisma.paymentMethod.findFirst({
      where: { id: req.params.id, bureauId: req.auth.bureauId, ...notDeletedWhere() },
    });
    if (!existing) throw new AppError("Payment method not found", 404);

    if (parsed.data.isPrimary) {
      await prisma.paymentMethod.updateMany({
        where: { bureauId: req.auth.bureauId, deletedAt: null },
        data: { isPrimary: false },
      });
    }

    const method = await prisma.paymentMethod.update({
      where: { id: existing.id },
      data: { ...parsed.data, updatedBy: req.auth.userId },
    });
    res.json({ method });
  })
);

module.exports = router;
