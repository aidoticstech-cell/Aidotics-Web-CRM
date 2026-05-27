const express = require("express");
const prisma = require("../db");
const { asyncHandler } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { parsePagination, paginationMeta } = require("../common/pagination");

const router = express.Router();
router.use(authRequired);

router.get(
  "/",
  requirePermission("audit:read"),
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const where = { bureauId: req.auth.bureauId };
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.auditLog.count({ where }),
    ]);
    res.json({ items, pagination: paginationMeta(page, limit, total) });
  })
);

module.exports = router;
