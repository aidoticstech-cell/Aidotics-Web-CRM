const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { writeAuditLog } = require("../middleware/audit");
const {
  listPartnerJobs,
  approvePartnerJob,
  rejectPartnerJobAcceptance,
} = require("../clients/partnerInternal");

const router = express.Router();
router.use(authRequired);

async function getPartnerBureauId(req) {
  const bureau = await prisma.bureau.findUnique({ where: { id: req.auth.bureauId } });
  if (!bureau) throw new AppError("Bureau not found", 404);
  return bureau.partnerBureauId;
}

router.get(
  "/",
  requirePermission("duties:read"),
  asyncHandler(async (req, res) => {
    const partnerBureauId = await getPartnerBureauId(req);
    const result = await listPartnerJobs(partnerBureauId, req.query, req.auth.userId);
    res.json(result);
  })
);

router.post(
  "/:jobId/approve",
  requirePermission("duties:write"),
  asyncHandler(async (req, res) => {
    const parsed = z.object({ assignedRoute: z.enum(["bureau", "client"]).default("client") }).safeParse(req.body || {});
    if (!parsed.success) throw new AppError("Validation failed", 400);
    const partnerBureauId = await getPartnerBureauId(req);
    const result = await approvePartnerJob(
      partnerBureauId,
      req.params.jobId,
      parsed.data.assignedRoute,
      req.auth.userId
    );
    await writeAuditLog({
      bureauId: req.auth.bureauId,
      actorId: req.auth.userId,
      entityType: "Job",
      entityId: req.params.jobId,
      action: "APPROVE",
      after: result,
    });
    res.json(result);
  })
);

router.post(
  "/:jobId/reject-acceptance",
  requirePermission("duties:write"),
  asyncHandler(async (req, res) => {
    const partnerBureauId = await getPartnerBureauId(req);
    const result = await rejectPartnerJobAcceptance(partnerBureauId, req.params.jobId, req.auth.userId);
    await writeAuditLog({
      bureauId: req.auth.bureauId,
      actorId: req.auth.userId,
      entityType: "Job",
      entityId: req.params.jobId,
      action: "REJECT_ACCEPTANCE",
      after: result,
    });
    res.json(result);
  })
);

module.exports = router;
