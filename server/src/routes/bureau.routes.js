const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { writeAuditLog } = require("../middleware/audit");
const { notDeletedWhere } = require("../common/pagination");

const router = express.Router();
router.use(authRequired);

async function getBureau(req) {
  const bureau = await prisma.bureau.findFirst({
    where: { id: req.auth.bureauId, ...notDeletedWhere() },
    include: { services: { where: notDeletedWhere() }, locations: { where: notDeletedWhere() } },
  });
  if (!bureau) throw new AppError("Bureau not found", 404);
  return bureau;
}

router.get(
  "/",
  requirePermission("bureau:read"),
  asyncHandler(async (req, res) => {
    res.json({ bureau: await getBureau(req) });
  })
);

router.patch(
  "/",
  requirePermission("bureau:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        name: z.string().min(2).max(200).optional(),
        logoKey: z.string().max(500).nullable().optional(),
        phone: z.string().max(30).nullable().optional(),
        email: z.string().email().nullable().optional(),
        address: z.string().max(500).nullable().optional(),
        city: z.string().max(100).nullable().optional(),
        state: z.string().max(100).nullable().optional(),
        services: z.array(z.object({ name: z.string().min(1), sortOrder: z.number().int().optional() })).optional(),
        locations: z
          .array(z.object({ city: z.string().min(1), state: z.string().optional(), pincode: z.string().optional() }))
          .optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const before = await getBureau(req);
    const data = { ...parsed.data, updatedBy: req.auth.userId };
    delete data.services;
    delete data.locations;

    const bureau = await prisma.bureau.update({
      where: { id: req.auth.bureauId },
      data,
    });

    if (parsed.data.services) {
      await prisma.bureauService.updateMany({
        where: { bureauId: req.auth.bureauId, deletedAt: null },
        data: { deletedAt: new Date() },
      });
      await prisma.bureauService.createMany({
        data: parsed.data.services.map((s, i) => ({
          bureauId: req.auth.bureauId,
          name: s.name,
          sortOrder: s.sortOrder ?? i,
          createdBy: req.auth.userId,
        })),
      });
    }

    if (parsed.data.locations) {
      await prisma.bureauLocation.updateMany({
        where: { bureauId: req.auth.bureauId, deletedAt: null },
        data: { deletedAt: new Date() },
      });
      await prisma.bureauLocation.createMany({
        data: parsed.data.locations.map((l) => ({
          bureauId: req.auth.bureauId,
          city: l.city,
          state: l.state || null,
          pincode: l.pincode || null,
          createdBy: req.auth.userId,
        })),
      });
    }

    const updated = await getBureau(req);
    await writeAuditLog({
      bureauId: req.auth.bureauId,
      actorId: req.auth.userId,
      entityType: "Bureau",
      entityId: bureau.id,
      action: "UPDATE",
      before,
      after: updated,
    });
    res.json({ bureau: updated });
  })
);

module.exports = router;
