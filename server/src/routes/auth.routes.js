const express = require("express");
const { z } = require("zod");
const { asyncHandler, AppError } = require("../common/errors");
const { authRequired } = require("../middleware/auth");
const authService = require("../services/auth.service");
const prisma = require("../db");

const router = express.Router();

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        bureauCode: z.string().min(3).max(40),
        bureauName: z.string().min(2).max(200),
        email: z.string().email(),
        password: z.string().min(8).max(128),
        fullName: z.string().min(2).max(120),
        mobile: z.string().max(20).optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400, parsed.error.flatten());
    const result = await authService.registerBureauAndAdmin(parsed.data);
    res.status(201).json(result);
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({ email: z.string().email(), password: z.string().min(1) })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);
    res.json(await authService.login(parsed.data.email, parsed.data.password));
  })
);

router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const parsed = z.object({ refreshToken: z.string().min(10) }).safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);
    res.json(await authService.refresh(parsed.data.refreshToken));
  })
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const parsed = z.object({ refreshToken: z.string().optional() }).safeParse(req.body || {});
    res.json(await authService.logout(parsed.data?.refreshToken));
  })
);

router.post(
  "/verify-otp",
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        email: z.string().email(),
        otp: z.string().regex(/^\d{4,6}$/),
        purpose: z.enum(["VERIFY_EMAIL", "FORGOT_PASSWORD"]).default("VERIFY_EMAIL"),
        newPassword: z.string().min(8).max(128).optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);
    if (parsed.data.purpose === "FORGOT_PASSWORD") {
      if (!parsed.data.newPassword) throw new AppError("newPassword required", 400);
      res.json(
        await authService.resetPassword(parsed.data.email, parsed.data.otp, parsed.data.newPassword)
      );
      return;
    }
    res.json(await authService.verifyEmailWithOtp(parsed.data.email, parsed.data.otp));
  })
);

router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
    if (!parsed.success) throw new AppError("Validation failed", 400);
    res.json(await authService.forgotPassword(parsed.data.email));
  })
);

router.post(
  "/send-verify-otp",
  authRequired,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.auth.userId } });
    if (!user) throw new AppError("User not found", 404);
    res.json(await authService.sendVerifyEmailOtp(user.email));
  })
);

router.get(
  "/me",
  authRequired,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.auth.userId },
      include: {
        role: { include: { rolePermissions: { include: { permission: true } } } },
        bureau: true,
        branches: { include: { branch: true } },
      },
    });
    if (!user) throw new AppError("User not found", 404);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        mobile: user.mobile,
        bureauId: user.bureauId,
        partnerBureauId: user.bureau.partnerBureauId,
        bureauName: user.bureau.name,
        storageSlug: user.bureau.storageSlug,
        role: user.role.slug,
        permissions: user.role.rolePermissions.map((rp) => rp.permission.slug),
        branches: user.branches.map((ub) => ub.branch),
      },
    });
  })
);

module.exports = router;
