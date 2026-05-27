const express = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { writeAuditLog } = require("../middleware/audit");
const { parsePagination, paginationMeta, notDeletedWhere } = require("../common/pagination");

const router = express.Router();
router.use(authRequired);

router.post(
  "/invite",
  requirePermission("team:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        email: z.string().email(),
        fullName: z.string().min(2).max(120),
        password: z.string().min(8).max(128),
        roleId: z.string().uuid(),
        mobile: z.string().optional(),
        branchIds: z.array(z.string().uuid()).optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const role = await prisma.role.findFirst({
      where: { id: parsed.data.roleId, bureauId: req.auth.bureauId },
    });
    if (!role) throw new AppError("Role not found", 404);

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (existing) throw new AppError("Email already in use", 409);

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        bureauId: req.auth.bureauId,
        roleId: parsed.data.roleId,
        email: parsed.data.email.toLowerCase(),
        passwordHash,
        fullName: parsed.data.fullName,
        mobile: parsed.data.mobile || null,
        createdBy: req.auth.userId,
        branches: parsed.data.branchIds?.length
          ? { create: parsed.data.branchIds.map((branchId) => ({ branchId })) }
          : undefined,
      },
      include: { role: true, branches: { include: { branch: true } } },
    });

    await writeAuditLog({
      bureauId: req.auth.bureauId,
      actorId: req.auth.userId,
      entityType: "User",
      entityId: user.id,
      action: "INVITE",
      after: { id: user.id, email: user.email, role: user.role.slug },
    });

    res.status(201).json({ user });
  })
);

router.get(
  "/",
  requirePermission("team:read"),
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const where = { bureauId: req.auth.bureauId, ...notDeletedWhere() };
    if (req.query.search) {
      where.OR = [
        { fullName: { contains: String(req.query.search), mode: "insensitive" } },
        { email: { contains: String(req.query.search), mode: "insensitive" } },
      ];
    }
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { role: true, branches: { include: { branch: true } } },
      }),
      prisma.user.count({ where }),
    ]);
    res.json({ items, pagination: paginationMeta(page, limit, total) });
  })
);

router.patch(
  "/:id",
  requirePermission("team:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        fullName: z.string().min(2).optional(),
        mobile: z.string().nullable().optional(),
        roleId: z.string().uuid().optional(),
        isActive: z.boolean().optional(),
        branchIds: z.array(z.string().uuid()).optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const before = await prisma.user.findFirst({
      where: { id: req.params.id, bureauId: req.auth.bureauId, ...notDeletedWhere() },
    });
    if (!before) throw new AppError("User not found", 404);

    const { branchIds, ...data } = parsed.data;
    const user = await prisma.user.update({
      where: { id: before.id },
      data: { ...data, updatedBy: req.auth.userId },
    });

    if (branchIds) {
      await prisma.userBranch.deleteMany({ where: { userId: user.id } });
      if (branchIds.length) {
        await prisma.userBranch.createMany({
          data: branchIds.map((branchId) => ({ userId: user.id, branchId })),
        });
      }
    }

    const updated = await prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true, branches: { include: { branch: true } } },
    });

    await writeAuditLog({
      bureauId: req.auth.bureauId,
      actorId: req.auth.userId,
      entityType: "User",
      entityId: user.id,
      action: "UPDATE",
      before,
      after: updated,
    });
    res.json({ user: updated });
  })
);

router.delete(
  "/:id",
  requirePermission("team:write"),
  asyncHandler(async (req, res) => {
    if (req.params.id === req.auth.userId) throw new AppError("Cannot delete yourself", 400);
    const before = await prisma.user.findFirst({
      where: { id: req.params.id, bureauId: req.auth.bureauId, ...notDeletedWhere() },
    });
    if (!before) throw new AppError("User not found", 404);
    const user = await prisma.user.update({
      where: { id: before.id },
      data: { deletedAt: new Date(), isActive: false, updatedBy: req.auth.userId },
    });
    res.json({ user });
  })
);

module.exports = router;
