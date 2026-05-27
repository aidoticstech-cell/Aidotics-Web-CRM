const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { writeAuditLog } = require("../middleware/audit");
const { parsePagination, paginationMeta, parseSort, notDeletedWhere } = require("../common/pagination");
const {
  upsertPartnerMembership,
  listPartnerMemberships,
  resolveWorkersByMobiles,
} = require("../clients/partnerInternal");

const router = express.Router();
router.use(authRequired);

async function getPartnerBureauId(req) {
  const bureau = await prisma.bureau.findFirst({ where: { id: req.auth.bureauId, ...notDeletedWhere() } });
  if (!bureau) throw new AppError("Bureau not found", 404);
  return bureau.partnerBureauId;
}

function maskMobile(mobile, canSeePii) {
  if (!mobile) return null;
  if (canSeePii) return mobile;
  const d = String(mobile).replace(/\D/g, "");
  if (d.length < 4) return "****";
  return `******${d.slice(-4)}`;
}

router.get(
  "/",
  requirePermission("workforce:read"),
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const where = { bureauId: req.auth.bureauId, ...notDeletedWhere() };
    if (req.query.status) where.status = String(req.query.status);
    if (req.query.search) {
      where.OR = [
        { fullName: { contains: String(req.query.search), mode: "insensitive" } },
        { mobile: { contains: String(req.query.search) } },
      ];
    }
    const orderBy = parseSort(req.query, ["createdAt", "updatedAt", "fullName", "status"]);
    const canSeePii = req.auth.permissions.includes("workforce:read_pii") || req.auth.roleSlug === "admin";

    const [items, total] = await Promise.all([
      prisma.workforceLink.findMany({ where, skip, take: limit, orderBy, include: { branch: true } }),
      prisma.workforceLink.count({ where }),
    ]);

    res.json({
      items: items.map((row) => ({
        ...row,
        mobile: maskMobile(row.mobile, canSeePii),
      })),
      pagination: paginationMeta(page, limit, total),
    });
  })
);

router.post(
  "/",
  requirePermission("workforce:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        workerId: z.string().uuid(),
        branchId: z.string().uuid().nullable().optional(),
        status: z.enum(["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"]).optional(),
        notes: z.string().nullable().optional(),
        fullName: z.string().optional(),
        mobile: z.string().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const partnerBureauId = await getPartnerBureauId(req);
    const status = parsed.data.status || "PENDING";

    await upsertPartnerMembership(
      partnerBureauId,
      {
        workerId: parsed.data.workerId,
        status,
        branchId: parsed.data.branchId || null,
        notes: parsed.data.notes || null,
      },
      req.auth.userId
    );

    const link = await prisma.workforceLink.upsert({
      where: {
        bureauId_workerId: { bureauId: req.auth.bureauId, workerId: parsed.data.workerId },
      },
      create: {
        bureauId: req.auth.bureauId,
        workerId: parsed.data.workerId,
        branchId: parsed.data.branchId || null,
        status,
        notes: parsed.data.notes || null,
        fullName: parsed.data.fullName || null,
        mobile: parsed.data.mobile || null,
        createdBy: req.auth.userId,
      },
      update: {
        branchId: parsed.data.branchId !== undefined ? parsed.data.branchId : undefined,
        status,
        notes: parsed.data.notes !== undefined ? parsed.data.notes : undefined,
        fullName: parsed.data.fullName || undefined,
        mobile: parsed.data.mobile || undefined,
        updatedBy: req.auth.userId,
      },
    });

    await writeAuditLog({
      bureauId: req.auth.bureauId,
      actorId: req.auth.userId,
      entityType: "WorkforceLink",
      entityId: link.id,
      action: "UPSERT",
      after: link,
    });

    res.status(201).json({ link });
  })
);

router.patch(
  "/:id",
  requirePermission("workforce:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        status: z.enum(["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"]).optional(),
        branchId: z.string().uuid().nullable().optional(),
        notes: z.string().nullable().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const before = await prisma.workforceLink.findFirst({
      where: { id: req.params.id, bureauId: req.auth.bureauId, ...notDeletedWhere() },
    });
    if (!before) throw new AppError("Workforce link not found", 404);

    const partnerBureauId = await getPartnerBureauId(req);
    if (parsed.data.status) {
      await upsertPartnerMembership(
        partnerBureauId,
        {
          workerId: before.workerId,
          status: parsed.data.status,
          branchId: parsed.data.branchId ?? before.branchId,
          notes: parsed.data.notes ?? before.notes,
        },
        req.auth.userId
      );
    }

    const link = await prisma.workforceLink.update({
      where: { id: before.id },
      data: { ...parsed.data, updatedBy: req.auth.userId },
    });

    await writeAuditLog({
      bureauId: req.auth.bureauId,
      actorId: req.auth.userId,
      entityType: "WorkforceLink",
      entityId: link.id,
      action: "UPDATE",
      before,
      after: link,
    });
    res.json({ link });
  })
);

router.post(
  "/resolve-mobiles",
  requirePermission("workforce:write"),
  asyncHandler(async (req, res) => {
    const parsed = z.object({ mobiles: z.array(z.string()).min(1).max(500) }).safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);
    const result = await resolveWorkersByMobiles(parsed.data.mobiles, req.auth.userId);
    res.json(result);
  })
);

router.get(
  "/partner-memberships",
  requirePermission("workforce:read"),
  asyncHandler(async (req, res) => {
    const partnerBureauId = await getPartnerBureauId(req);
    const result = await listPartnerMemberships(partnerBureauId, req.query, req.auth.userId);
    res.json(result);
  })
);

module.exports = router;
