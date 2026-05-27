const crypto = require("crypto");
const prisma = require("../db");

async function writeAuditLog({
  bureauId,
  branchId = null,
  actorId = null,
  entityType,
  entityId,
  action,
  before = null,
  after = null,
}) {
  return prisma.auditLog.create({
    data: {
      bureauId,
      branchId,
      actorId,
      entityType,
      entityId,
      action,
      before,
      after,
    },
  });
}

function auditMiddleware(entityType, action, getEntityId = (req) => req.params.id) {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.auth) {
        try {
          await writeAuditLog({
            bureauId: req.auth.bureauId,
            branchId: req.body?.branchId || null,
            actorId: req.auth.userId,
            entityType,
            entityId: String(getEntityId(req) || body?.id || "unknown"),
            action,
            after: body,
          });
        } catch {
          /* non-blocking */
        }
      }
      return originalJson(body);
    };
    next();
  };
}

module.exports = { writeAuditLog, auditMiddleware };
