const crypto = require("crypto");
const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");
const { uploadSingle } = require("../middleware/upload");
const bureauProfileDoc = require("../services/bureauProfileDoc.service");
const supabaseStorage = require("../services/supabaseStorage.service");
const { profileUploadPath } = require("../lib/storageSlug");

const router = express.Router();
router.use(authRequired);

/** Multipart upload → Supabase Storage under bureau profile folder. */
router.post(
  "/upload",
  requirePermission("files:write"),
  uploadSingle("file"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        purpose: z.string().min(1).max(80),
        branchId: z.string().uuid().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);
    if (!req.file?.buffer?.length) throw new AppError("File is required", 400);

    const bureau = await bureauProfileDoc.getBureauForStorage(req.auth.bureauId);
    const fileId = crypto.randomUUID();
    const path = profileUploadPath(
      bureau.storageSlug,
      parsed.data.purpose,
      fileId,
      req.file.originalname
    );

    const storage = await supabaseStorage.uploadObject({
      path,
      body: req.file.buffer,
      contentType: req.file.mimetype,
    });

    const file = await prisma.storedFile.create({
      data: {
        id: fileId,
        bureauId: req.auth.bureauId,
        branchId: parsed.data.branchId || null,
        purpose: parsed.data.purpose,
        fileKey: path,
        storageBucket: storage.bucket,
        fileName: req.file.originalname || null,
        mimeType: req.file.mimetype || null,
        sizeBytes: req.file.size,
        createdBy: req.auth.userId,
      },
    });

    res.status(201).json({
      file,
      storageSlug: bureau.storageSlug,
      bucket: storage.bucket,
      path,
    });
  })
);

/** Legacy: register an already-uploaded file key (metadata only). */
router.post(
  "/register",
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

    const bureau = await bureauProfileDoc.getBureauForStorage(req.auth.bureauId);

    const file = await prisma.storedFile.create({
      data: {
        bureauId: req.auth.bureauId,
        branchId: parsed.data.branchId || null,
        purpose: parsed.data.purpose,
        fileKey: parsed.data.fileKey,
        storageBucket: supabaseStorage.documentsBucket(),
        fileName: parsed.data.fileName || null,
        mimeType: parsed.data.mimeType || null,
        sizeBytes: parsed.data.sizeBytes || null,
        createdBy: req.auth.userId,
      },
    });
    res.status(201).json({ file, storageSlug: bureau.storageSlug });
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
