const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const prisma = require("../db");
const { AppError } = require("../common/errors");
const { signAccessToken, signRefreshToken } = require("../middleware/auth");
const { createPartnerBureau, hashRefreshToken } = require("../clients/partnerInternal");
const { seedPermissionsAndRoles, seedPresetRolesForBureau } = require("./rbac.service");

const OTP_TTL_MS = 10 * 60 * 1000;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isOtpInResponse() {
  const v = String(process.env.OTP_IN_RESPONSE || "").trim().toLowerCase();
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return process.env.NODE_ENV !== "production";
}

function generateOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

async function createOtp(email, purpose) {
  const otp = generateOtp();
  await prisma.otpLog.create({
    data: {
      email: normalizeEmail(email),
      purpose,
      otpHash: hashOtp(otp),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });
  const body = { message: "OTP sent", expiresInSeconds: OTP_TTL_MS / 1000 };
  if (isOtpInResponse()) body.otp = otp;
  return body;
}

async function verifyOtp(email, purpose, otp) {
  const row = await prisma.otpLog.findFirst({
    where: {
      email: normalizeEmail(email),
      purpose,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!row || row.otpHash !== hashOtp(otp)) {
    throw new AppError("Invalid or expired OTP", 400);
  }
  await prisma.otpLog.update({ where: { id: row.id }, data: { usedAt: new Date() } });
  return true;
}

async function registerBureauAndAdmin({ bureauCode, bureauName, email, password, fullName, mobile }) {
  await seedPermissionsAndRoles();

  const normalizedEmail = normalizeEmail(email);
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) throw new AppError("Email already registered", 409);

  /** Opaque id stored on Bureau; only replaced by partner id when PARTNER_SYNC_ON_REGISTER=true. */
  let partnerBureauId = crypto.randomUUID();
  if (String(process.env.PARTNER_SYNC_ON_REGISTER || "").trim() === "true") {
    try {
      const result = await createPartnerBureau({ code: bureauCode, name: bureauName });
      const partnerBureau = result?.bureau ?? result;
      if (!partnerBureau?.id || typeof partnerBureau.id !== "string") {
        throw new AppError("Partner API returned an unexpected payload (missing bureau id)", 502);
      }
      partnerBureauId = partnerBureau.id;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(err.message || "Could not create bureau in partner API", err.status || 502);
    }
  }

  const bureau = await prisma.bureau.create({
    data: {
      partnerBureauId,
      code: String(bureauCode).trim().toUpperCase(),
      name: bureauName,
      email: normalizedEmail,
      phone: mobile || null,
      setupProgress: {
        create: {
          currentStep: 1,
          stepsStatus: { profile_verification: { status: "pending" } },
          stepDrafts: {},
          steps: {},
        },
      },
    },
  });

  await seedPresetRolesForBureau(bureau.id);

  const bureauAdminRole = await prisma.role.create({
    data: {
      bureauId: bureau.id,
      name: "Admin",
      slug: "admin",
      isSystem: true,
      rolePermissions: {
        create: (await prisma.permission.findMany()).map((p) => ({ permissionId: p.id })),
      },
    },
  });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      bureauId: bureau.id,
      roleId: bureauAdminRole.id,
      email: normalizedEmail,
      passwordHash,
      fullName,
      mobile: mobile || null,
    },
    include: { role: { include: { rolePermissions: { include: { permission: true } } } }, bureau: true },
  });

  return issueTokensForUser(user);
}

async function login(email, password) {
  const user = await prisma.user.findFirst({
    where: { email: normalizeEmail(email), deletedAt: null, isActive: true },
    include: {
      role: { include: { rolePermissions: { include: { permission: true } } } },
      bureau: true,
    },
  });
  if (!user) throw new AppError("Invalid credentials", 401);
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError("Invalid credentials", 401);

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return issueTokensForUser(user);
}

function permissionsFromUser(user) {
  return (user.role?.rolePermissions || []).map((rp) => rp.permission.slug);
}

async function issueTokensForUser(user) {
  const permissions = permissionsFromUser(user);
  const accessToken = signAccessToken({
    sub: user.id,
    bid: user.bureauId,
    role: user.role.slug,
    permissions,
  });
  const refreshToken = signRefreshToken({ sub: user.id, bid: user.bureauId, sid: crypto.randomUUID() });
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      bureauId: user.bureauId,
      partnerBureauId: user.bureau.partnerBureauId,
      role: user.role.slug,
      permissions,
    },
  };
}

async function refresh(refreshToken) {
  const hash = hashRefreshToken(refreshToken);
  const session = await prisma.session.findFirst({
    where: { refreshTokenHash: hash, revokedAt: null, expiresAt: { gt: new Date() } },
  });
  if (!session) throw new AppError("Invalid refresh token", 401);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      role: { include: { rolePermissions: { include: { permission: true } } } },
      bureau: true,
    },
  });
  if (!user || !user.isActive) throw new AppError("Unauthorized", 401);

  await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
  return issueTokensForUser(user);
}

async function logout(refreshToken) {
  if (!refreshToken) return { ok: true };
  const hash = hashRefreshToken(refreshToken);
  await prisma.session.updateMany({
    where: { refreshTokenHash: hash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return { ok: true };
}

async function verifyEmailWithOtp(email, otp) {
  await verifyOtp(email, "VERIFY_EMAIL", otp);
  await prisma.user.updateMany({
    where: { email: normalizeEmail(email) },
    data: { emailVerifiedAt: new Date() },
  });
  return { verified: true };
}

async function sendVerifyEmailOtp(email) {
  const user = await prisma.user.findFirst({ where: { email: normalizeEmail(email), deletedAt: null } });
  if (!user) throw new AppError("User not found", 404);
  return createOtp(email, "VERIFY_EMAIL");
}

async function forgotPassword(email) {
  const user = await prisma.user.findFirst({ where: { email: normalizeEmail(email), deletedAt: null } });
  if (!user) return { message: "If the email exists, an OTP was sent" };
  await createOtp(email, "FORGOT_PASSWORD");
  return { message: "If the email exists, an OTP was sent" };
}

async function resetPassword(email, otp, newPassword) {
  await verifyOtp(email, "FORGOT_PASSWORD", otp);
  const user = await prisma.user.findFirst({ where: { email: normalizeEmail(email), deletedAt: null } });
  if (!user) throw new AppError("User not found", 404);
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  await prisma.session.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });
  return { ok: true };
}

module.exports = {
  registerBureauAndAdmin,
  login,
  refresh,
  logout,
  verifyEmailWithOtp,
  sendVerifyEmailOtp,
  forgotPassword,
  resetPassword,
  createOtp,
  verifyOtp,
};
