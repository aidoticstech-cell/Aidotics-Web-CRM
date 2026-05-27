const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { writeAuditLog } = require("../middleware/audit");
const { notDeletedWhere } = require("../common/pagination");

const router = express.Router();
router.use(authRequired);

router.get(
  "/setup",
  requirePermission("billing:read"),
  asyncHandler(async (req, res) => {
    const config = await prisma.billingConfig.findFirst({
      where: { bureauId: req.auth.bureauId, ...notDeletedWhere() },
    });
    const bankAccounts = await prisma.bankAccount.findMany({
      where: { bureauId: req.auth.bureauId, ...notDeletedWhere() },
      orderBy: { createdAt: "desc" },
    });
    res.json({ config, bankAccounts });
  })
);

router.post(
  "/setup",
  requirePermission("billing:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        invoicePrefix: z.string().max(20).optional(),
        gstNumber: z.string().nullable().optional(),
        gstEnabled: z.boolean().optional(),
        financialYear: z.string().nullable().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const config = await prisma.billingConfig.upsert({
      where: { bureauId: req.auth.bureauId },
      create: { bureauId: req.auth.bureauId, ...parsed.data, createdBy: req.auth.userId },
      update: { ...parsed.data, updatedBy: req.auth.userId },
    });
    await writeAuditLog({
      bureauId: req.auth.bureauId,
      actorId: req.auth.userId,
      entityType: "BillingConfig",
      entityId: config.id,
      action: "UPSERT",
      after: config,
    });
    res.json({ config });
  })
);

router.patch(
  "/setup",
  requirePermission("billing:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        invoicePrefix: z.string().max(20).optional(),
        gstNumber: z.string().nullable().optional(),
        gstEnabled: z.boolean().optional(),
        financialYear: z.string().nullable().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const existing = await prisma.billingConfig.findFirst({
      where: { bureauId: req.auth.bureauId, ...notDeletedWhere() },
    });
    if (!existing) throw new AppError("Billing config not found", 404);

    const config = await prisma.billingConfig.update({
      where: { id: existing.id },
      data: { ...parsed.data, updatedBy: req.auth.userId },
    });
    res.json({ config });
  })
);

router.post(
  "/bank-accounts",
  requirePermission("billing:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        branchId: z.string().uuid().nullable().optional(),
        accountName: z.string().min(2),
        accountNumber: z.string().min(4),
        ifsc: z.string().min(4),
        bankName: z.string().optional(),
        isPrimary: z.boolean().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    if (parsed.data.isPrimary) {
      await prisma.bankAccount.updateMany({
        where: { bureauId: req.auth.bureauId, deletedAt: null },
        data: { isPrimary: false },
      });
    }

    const account = await prisma.bankAccount.create({
      data: {
        bureauId: req.auth.bureauId,
        ...parsed.data,
        createdBy: req.auth.userId,
      },
    });
    res.status(201).json({ account });
  })
);

module.exports = router;
