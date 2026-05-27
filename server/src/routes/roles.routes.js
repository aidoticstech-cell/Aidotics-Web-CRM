const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");

const router = express.Router();
router.use(authRequired);

router.get(
  "/",
  requirePermission("roles:read"),
  asyncHandler(async (req, res) => {
    const roles = await prisma.role.findMany({
      where: { bureauId: req.auth.bureauId },
      include: { rolePermissions: { include: { permission: true } } },
      orderBy: { name: "asc" },
    });
    res.json({ items: roles });
  })
);

router.get(
  "/permissions",
  requirePermission("roles:read"),
  asyncHandler(async (_req, res) => {
    const permissions = await prisma.permission.findMany({ orderBy: { slug: "asc" } });
    res.json({ items: permissions });
  })
);

router.post(
  "/",
  requirePermission("roles:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        name: z.string().min(2),
        slug: z.string().min(2).max(40),
        permissionSlugs: z.array(z.string()).min(1),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const perms = await prisma.permission.findMany({
      where: { slug: { in: parsed.data.permissionSlugs } },
    });
    const role = await prisma.role.create({
      data: {
        bureauId: req.auth.bureauId,
        name: parsed.data.name,
        slug: parsed.data.slug,
        rolePermissions: { create: perms.map((p) => ({ permissionId: p.id })) },
      },
      include: { rolePermissions: { include: { permission: true } } },
    });
    res.status(201).json({ role });
  })
);

router.patch(
  "/:id",
  requirePermission("roles:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        name: z.string().min(2).optional(),
        permissionSlugs: z.array(z.string()).optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const role = await prisma.role.findFirst({
      where: { id: req.params.id, bureauId: req.auth.bureauId },
    });
    if (!role) throw new AppError("Role not found", 404);
    if (role.isSystem && role.slug === "admin") throw new AppError("Cannot modify admin role", 400);

    if (parsed.data.permissionSlugs) {
      const perms = await prisma.permission.findMany({
        where: { slug: { in: parsed.data.permissionSlugs } },
      });
      await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
      await prisma.rolePermission.createMany({
        data: perms.map((p) => ({ roleId: role.id, permissionId: p.id })),
      });
    }

    const updated = await prisma.role.update({
      where: { id: role.id },
      data: { name: parsed.data.name || undefined },
      include: { rolePermissions: { include: { permission: true } } },
    });
    res.json({ role: updated });
  })
);

module.exports = router;
