const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { parsePagination, paginationMeta } = require("../common/pagination");
const { resolveWorkersByMobiles, upsertPartnerMembership } = require("../clients/partnerInternal");

const router = express.Router();
router.use(authRequired);

function parseCsv(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line, idx) => {
    const cols = line.split(",").map((c) => c.trim());
    const row = { rowNumber: idx + 2 };
    headers.forEach((h, i) => {
      row[h] = cols[i] || "";
    });
    return row;
  });
}

async function getPartnerBureauId(req) {
  const bureau = await prisma.bureau.findUnique({ where: { id: req.auth.bureauId } });
  if (!bureau) throw new AppError("Bureau not found", 404);
  return bureau.partnerBureauId;
}

router.post(
  "/validate",
  requirePermission("workforce:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        fileName: z.string().min(1),
        csv: z.string().min(1),
        branchId: z.string().uuid().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const rows = parseCsv(parsed.data.csv);
    const mobiles = rows.map((r) => r.mobile || r.phone || "").filter(Boolean);
    const resolved = mobiles.length
      ? (await resolveWorkersByMobiles(mobiles, req.auth.userId)).workers || []
      : [];
    const byMobile = Object.fromEntries(resolved.map((w) => [w.mobile10, w]));

    const importJob = await prisma.importJob.create({
      data: {
        bureauId: req.auth.bureauId,
        branchId: parsed.data.branchId || null,
        fileName: parsed.data.fileName,
        status: "VALIDATING",
        totalRows: rows.length,
        createdBy: req.auth.userId,
      },
    });

    let validRows = 0;
    let errorRows = 0;
    const logs = [];

    for (const row of rows) {
      const mobileRaw = row.mobile || row.phone || "";
      const mobile10 = String(mobileRaw).replace(/\D/g, "").slice(-10);
      const worker = byMobile[mobile10];
      if (!mobile10 || mobile10.length !== 10) {
        errorRows += 1;
        logs.push({
          importJobId: importJob.id,
          rowNumber: row.rowNumber,
          level: "error",
          message: "Invalid mobile number",
          payload: row,
        });
        continue;
      }
      if (!worker) {
        errorRows += 1;
        logs.push({
          importJobId: importJob.id,
          rowNumber: row.rowNumber,
          level: "error",
          message: "Partner not found on Aidotics network",
          payload: row,
        });
        continue;
      }
      validRows += 1;
      logs.push({
        importJobId: importJob.id,
        rowNumber: row.rowNumber,
        level: "info",
        message: "Ready to import",
        payload: { ...row, workerId: worker.id, fullName: worker.fullName },
      });
    }

    if (logs.length) await prisma.importLog.createMany({ data: logs });

    const updated = await prisma.importJob.update({
      where: { id: importJob.id },
      data: {
        status: errorRows === rows.length ? "FAILED" : "VALIDATED",
        validRows,
        errorRows,
      },
    });

    res.json({ importJob: updated, preview: logs.slice(0, 50) });
  })
);

router.post(
  "/process",
  requirePermission("workforce:write"),
  asyncHandler(async (req, res) => {
    const parsed = z.object({ importJobId: z.string().uuid() }).safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const job = await prisma.importJob.findFirst({
      where: { id: parsed.data.importJobId, bureauId: req.auth.bureauId },
      include: { logs: true },
    });
    if (!job) throw new AppError("Import job not found", 404);
    if (job.status !== "VALIDATED") throw new AppError("Import must be validated first", 400);

    await prisma.importJob.update({ where: { id: job.id }, data: { status: "PROCESSING" } });
    const partnerBureauId = await getPartnerBureauId(req);

    let processed = 0;
    for (const log of job.logs) {
      if (log.level !== "info" || !log.payload?.workerId) continue;
      const workerId = log.payload.workerId;
      await upsertPartnerMembership(
        partnerBureauId,
        { workerId, status: "PENDING", branchId: job.branchId },
        req.auth.userId
      );
      await prisma.workforceLink.upsert({
        where: { bureauId_workerId: { bureauId: req.auth.bureauId, workerId } },
        create: {
          bureauId: req.auth.bureauId,
          workerId,
          branchId: job.branchId,
          status: "PENDING",
          fullName: log.payload.fullName || null,
          mobile: log.payload.mobile || log.payload.phone || null,
          createdBy: req.auth.userId,
        },
        update: {
          branchId: job.branchId || undefined,
          fullName: log.payload.fullName || undefined,
          mobile: log.payload.mobile || log.payload.phone || undefined,
          updatedBy: req.auth.userId,
        },
      });
      processed += 1;
    }

    const updated = await prisma.importJob.update({
      where: { id: job.id },
      data: { status: "COMPLETED" },
    });
    res.json({ importJob: updated, processed });
  })
);

router.get(
  "/history",
  requirePermission("workforce:read"),
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const where = { bureauId: req.auth.bureauId };
    const [items, total] = await Promise.all([
      prisma.importJob.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.importJob.count({ where }),
    ]);
    res.json({ items, pagination: paginationMeta(page, limit, total) });
  })
);

module.exports = router;
