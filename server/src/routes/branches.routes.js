const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { writeAuditLog } = require("../middleware/audit");
const { parsePagination, paginationMeta, parseSort, notDeletedWhere } = require("../common/pagination");

const router = express.Router();
router.use(authRequired);

router.post(
  "/",
  requirePermission("branches:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        name: z.string().min(2).max(120),
        code: z.string().min(2).max(40),
        city: z.string().optional(),
        state: z.string().optional(),
        address: z.string().optional(),
        gstNumber: z.string().optional(),
        phone: z.string().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const branch = await prisma.branch.create({
      data: {
        bureauId: req.auth.bureauId,
        ...parsed.data,
        code: parsed.data.code.toUpperCase(),
        createdBy: req.auth.userId,
      },
    });
    await writeAuditLog({
      bureauId: req.auth.bureauId,
      actorId: req.auth.userId,
      entityType: "Branch",
      entityId: branch.id,
      action: "CREATE",
      after: branch,
    });
    res.status(201).json({ branch });
  })
);

router.get(
  "/",
  requirePermission("branches:read"),
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const where = { bureauId: req.auth.bureauId, ...notDeletedWhere() };
    if (req.query.search) {
      where.OR = [
        { name: { contains: String(req.query.search), mode: "insensitive" } },
        { code: { contains: String(req.query.search), mode: "insensitive" } },
        { city: { contains: String(req.query.search), mode: "insensitive" } },
      ];
    }
    const orderBy = parseSort(req.query, ["createdAt", "name", "code"]);
    const [items, total] = await Promise.all([
      prisma.branch.findMany({ where, skip, take: limit, orderBy }),
      prisma.branch.count({ where }),
    ]);
    res.json({ items, pagination: paginationMeta(page, limit, total) });
  })
);

router.patch(
  "/:id",
  requirePermission("branches:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        name: z.string().min(2).max(120).optional(),
        city: z.string().nullable().optional(),
        state: z.string().nullable().optional(),
        address: z.string().nullable().optional(),
        gstNumber: z.string().nullable().optional(),
        phone: z.string().nullable().optional(),
        isActive: z.boolean().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const before = await prisma.branch.findFirst({
      where: { id: req.params.id, bureauId: req.auth.bureauId, ...notDeletedWhere() },
    });
    if (!before) throw new AppError("Branch not found", 404);

    const branch = await prisma.branch.update({
      where: { id: before.id },
      data: { ...parsed.data, updatedBy: req.auth.userId },
    });
    await writeAuditLog({
      bureauId: req.auth.bureauId,
      actorId: req.auth.userId,
      entityType: "Branch",
      entityId: branch.id,
      action: "UPDATE",
      before,
      after: branch,
    });
    res.json({ branch });
  })
);

router.delete(
  "/:id",
  requirePermission("branches:write"),
  asyncHandler(async (req, res) => {
    const before = await prisma.branch.findFirst({
      where: { id: req.params.id, bureauId: req.auth.bureauId, ...notDeletedWhere() },
    });
    if (!before) throw new AppError("Branch not found", 404);
    const branch = await prisma.branch.update({
      where: { id: before.id },
      data: { deletedAt: new Date(), updatedBy: req.auth.userId },
    });
    await writeAuditLog({
      bureauId: req.auth.bureauId,
      actorId: req.auth.userId,
      entityType: "Branch",
      entityId: branch.id,
      action: "SOFT_DELETE",
      before,
      after: branch,
    });
    res.json({ branch });
  })
);

module.exports = router;
