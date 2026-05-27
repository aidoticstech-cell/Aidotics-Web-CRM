const crypto = require("crypto");

const PARTNER_API_URL = () => String(process.env.PARTNER_API_URL || "http://localhost:4000").replace(/\/+$/, "");
const PARTNER_CRM_SERVICE_SECRET = () => String(process.env.PARTNER_CRM_SERVICE_SECRET || "").trim();

async function partnerFetch(path, { method = "GET", body, actorId, bureauId } = {}) {
  const secret = PARTNER_CRM_SERVICE_SECRET();
  if (!secret) {
    const err = new Error("PARTNER_CRM_SERVICE_SECRET is not configured");
    err.status = 503;
    throw err;
  }
  const headers = {
    "Content-Type": "application/json",
    "x-crm-service-key": secret,
  };
  if (actorId) headers["x-crm-actor-id"] = actorId;
  const res = await fetch(`${PARTNER_API_URL()}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }
  if (!res.ok) {
    const err = new Error(data?.message || `Partner API error ${res.status}`);
    err.status = res.status;
    err.detail = data;
    throw err;
  }
  return data;
}

/** Create bureau in Aidotics partner API (optional; only used when PARTNER_SYNC_ON_REGISTER=true). */
async function createPartnerBureau({ code, name }) {
  return partnerFetch("/internal/crm/bureaus", { method: "POST", body: { code, name } });
}

async function listPartnerJobs(partnerBureauId, query, actorId) {
  const qs = new URLSearchParams(query).toString();
  return partnerFetch(`/internal/crm/bureaus/${partnerBureauId}/jobs?${qs}`, { actorId, bureauId: partnerBureauId });
}

async function approvePartnerJob(partnerBureauId, jobId, assignedRoute, actorId) {
  return partnerFetch(`/internal/crm/bureaus/${partnerBureauId}/jobs/${jobId}/approve`, {
    method: "POST",
    body: { assignedRoute },
    actorId,
    bureauId: partnerBureauId,
  });
}

async function rejectPartnerJobAcceptance(partnerBureauId, jobId, actorId) {
  return partnerFetch(`/internal/crm/bureaus/${partnerBureauId}/jobs/${jobId}/reject-acceptance`, {
    method: "POST",
    actorId,
    bureauId: partnerBureauId,
  });
}

async function resolveWorkersByMobiles(mobiles, actorId) {
  return partnerFetch("/internal/crm/workforce/resolve-mobiles", {
    method: "POST",
    body: { mobiles },
    actorId,
  });
}

async function upsertPartnerMembership(partnerBureauId, payload, actorId) {
  return partnerFetch(`/internal/crm/bureaus/${partnerBureauId}/memberships`, {
    method: "POST",
    body: payload,
    actorId,
    bureauId: partnerBureauId,
  });
}

async function listPartnerMemberships(partnerBureauId, query, actorId) {
  const qs = new URLSearchParams(query).toString();
  return partnerFetch(`/internal/crm/bureaus/${partnerBureauId}/memberships?${qs}`, {
    actorId,
    bureauId: partnerBureauId,
  });
}

function hashRefreshToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
  partnerFetch,
  createPartnerBureau,
  listPartnerJobs,
  approvePartnerJob,
  rejectPartnerJobAcceptance,
  resolveWorkersByMobiles,
  upsertPartnerMembership,
  listPartnerMemberships,
  hashRefreshToken,
};
