const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired, requirePermission } = require("../middleware/auth");

const router = express.Router();
router.use(authRequired);

router.get(
  "/status",
  requirePermission("verification:read"),
  asyncHandler(async (req, res) => {
    const requests = await prisma.verificationRequest.findMany({
      where: { bureauId: req.auth.bureauId, deletedAt: null },
      include: { documents: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ items: requests });
  })
);

router.post(
  "/pan",
  requirePermission("verification:write"),
  asyncHandler(async (req, res) => {
    const parsed = z.object({ pan: z.string().min(5).max(20), branchId: z.string().uuid().optional() }).safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);
    const request = await prisma.verificationRequest.create({
      data: {
        bureauId: req.auth.bureauId,
        branchId: parsed.data.branchId || null,
        type: "PAN",
        status: "SUBMITTED",
        payload: { pan: parsed.data.pan.toUpperCase() },
        createdBy: req.auth.userId,
      },
    });
    res.status(201).json({ request });
  })
);

router.post(
  "/gst",
  requirePermission("verification:write"),
  asyncHandler(async (req, res) => {
    const parsed = z.object({ gst: z.string().min(5).max(20), branchId: z.string().uuid().optional() }).safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);
    const request = await prisma.verificationRequest.create({
      data: {
        bureauId: req.auth.bureauId,
        branchId: parsed.data.branchId || null,
        type: "GST",
        status: "SUBMITTED",
        payload: { gst: parsed.data.gst.toUpperCase() },
        createdBy: req.auth.userId,
      },
    });
    res.status(201).json({ request });
  })
);

router.post(
  "/aadhaar",
  requirePermission("verification:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({ maskedAadhaar: z.string().min(4).max(20), branchId: z.string().uuid().optional() })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);
    const request = await prisma.verificationRequest.create({
      data: {
        bureauId: req.auth.bureauId,
        branchId: parsed.data.branchId || null,
        type: "AADHAAR",
        status: "SUBMITTED",
        payload: { maskedAadhaar: parsed.data.maskedAadhaar },
        createdBy: req.auth.userId,
      },
    });
    res.status(201).json({ request });
  })
);

router.post(
  "/upload-document",
  requirePermission("verification:write"),
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        requestId: z.string().uuid().optional(),
        type: z.enum(["PAN", "GST", "AADHAAR", "BUSINESS_CERTIFICATE", "OTHER"]).default("OTHER"),
        fileKey: z.string().min(1),
        fileName: z.string().optional(),
        mimeType: z.string().optional(),
        branchId: z.string().uuid().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);

    let request;
    if (parsed.data.requestId) {
      request = await prisma.verificationRequest.findFirst({
        where: { id: parsed.data.requestId, bureauId: req.auth.bureauId, deletedAt: null },
      });
      if (!request) throw new AppError("Verification request not found", 404);
    } else {
      request = await prisma.verificationRequest.create({
        data: {
          bureauId: req.auth.bureauId,
          branchId: parsed.data.branchId || null,
          type: parsed.data.type,
          status: "SUBMITTED",
          createdBy: req.auth.userId,
        },
      });
    }

    const doc = await prisma.verificationDocument.create({
      data: {
        requestId: request.id,
        fileKey: parsed.data.fileKey,
        fileName: parsed.data.fileName || null,
        mimeType: parsed.data.mimeType || null,
        createdBy: req.auth.userId,
      },
    });
    res.status(201).json({ request, document: doc });
  })
);

module.exports = router;
