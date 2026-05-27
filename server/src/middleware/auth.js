const jwt = require("jsonwebtoken");
const { AppError } = require("../common/errors");

function getAccessSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || !String(secret).trim()) throw new Error("JWT_SECRET is not set");
  return secret;
}

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || getAccessSecret();
}

function signAccessToken(payload) {
  return jwt.sign({ ...payload, typ: "crm" }, getAccessSecret(), {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
}

function signRefreshToken(payload) {
  return jwt.sign({ ...payload, typ: "crm_refresh" }, getRefreshSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
}

function authRequired(req, _res, next) {
  try {
    const raw = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
    if (!raw) throw new AppError("Unauthorized", 401);
    const payload = jwt.verify(raw, getAccessSecret());
    if (payload.typ !== "crm" || !payload.sub || !payload.bid) {
      throw new AppError("Unauthorized", 401);
    }
    req.auth = {
      userId: payload.sub,
      bureauId: payload.bid,
      roleSlug: payload.role || null,
      permissions: payload.permissions || [],
    };
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError("Unauthorized", 401));
  }
}

function requirePermission(...slugs) {
  return (req, _res, next) => {
    const perms = req.auth?.permissions || [];
    if (req.auth?.roleSlug === "admin") return next();
    const ok = slugs.some((s) => perms.includes(s));
    if (!ok) return next(new AppError("Forbidden", 403));
    next();
  };
}

module.exports = {
  authRequired,
  requirePermission,
  signAccessToken,
  signRefreshToken,
  getRefreshSecret,
};
