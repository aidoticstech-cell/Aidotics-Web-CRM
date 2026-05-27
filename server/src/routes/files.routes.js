const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");

const router = express.Router();
router.use(authRequired);

router.post(
  "/upload",
  requirePermission("files:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        purpose: z.string().min(1).max(80),
        fileKey: z.string().min(1),
        fileName: z.string().optional(),
        mimeType: z.string().optional(),
        sizeBytes: z.number().int().optional(),
        branchId: z.string().uuid().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    const file = await prisma.storedFile.create({
      data: {
        bureauId: req.auth.bureauId,
        branchId: parsed.data.branchId || null,
        purpose: parsed.data.purpose,
        fileKey: parsed.data.fileKey,
        fileName: parsed.data.fileName || null,
        mimeType: parsed.data.mimeType || null,
        sizeBytes: parsed.data.sizeBytes || null,
        createdBy: req.auth.userId,
      },
    });
    res.status(201).json({ file });
  })
);

router.delete(
  "/:id",
  requirePermission("files:write"),
  asyncHandler(async (req, res) => {
    const file = await prisma.storedFile.findFirst({
      where: { id: req.params.id, bureauId: req.auth.bureauId, deletedAt: null },
    });
    if (!file) throw new AppError("File not found", 404);
    const updated = await prisma.storedFile.update({
      where: { id: file.id },
      data: { deletedAt: new Date() },
    });
    res.json({ file: updated });
  })
);

module.exports = router;
