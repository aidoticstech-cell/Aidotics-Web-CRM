#!/usr/bin/env node
/**
 * Update Render env vars for Aidotics CRM API.
 *
 * Usage:
 *   RENDER_API_KEY=rnd_xxx node scripts/render-update-crm-env.mjs
 *   RENDER_API_KEY=rnd_xxx RENDER_SERVICE_NAME=aidotics node scripts/render-update-crm-env.mjs
 *   RENDER_API_KEY=rnd_xxx SUPABASE_SERVICE_ROLE_KEY=eyJ... node scripts/render-update-crm-env.mjs
 *
 * Optional: DIRECT_URL password is derived from existing DATABASE_URL on Render.
 */

import crypto from "node:crypto";

const API = "https://api.render.com/v1";
const SUPABASE_PROJECT_REF = "lsveivwgzevtoyqhqvyi";
const CRM_WEB_URL = "https://aidotics-web-crm.vercel.app";
const SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;

const SERVICE_NAME_HINT = (process.env.RENDER_SERVICE_NAME || "crm").toLowerCase();

function authHeaders() {
  const key = process.env.RENDER_API_KEY?.trim();
  if (!key) {
    console.error("Set RENDER_API_KEY (Render Dashboard → Account Settings → API Keys)");
    process.exit(1);
  }
  return {
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`Render API ${res.status} ${path}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function listAllServices() {
  const owners = await api("/owners?limit=50");
  const services = [];
  for (const row of owners || []) {
    const ownerId = row.owner?.id || row.id;
    if (!ownerId) continue;
    const page = await api(`/owners/${ownerId}/services?limit=100`);
    for (const s of page || []) {
      if (s.service) services.push(s.service);
    }
  }
  return services;
}

function pickService(services) {
  const hit = services.find(
    (s) =>
      (s.name || "").toLowerCase().includes(SERVICE_NAME_HINT) ||
      (s.slug || "").toLowerCase().includes(SERVICE_NAME_HINT) ||
      (s.repo?.name || "").toLowerCase().includes("crm")
  );
  return hit || services.find((s) => (s.name || "").toLowerCase().includes("aidotics"));
}

function passwordFromDatabaseUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.password ? decodeURIComponent(u.password) : null;
  } catch {
    return null;
  }
}

function buildDirectUrl(poolerUrl) {
  const password = passwordFromDatabaseUrl(poolerUrl);
  if (!password) {
    console.warn("Could not parse DATABASE_URL password; set DIRECT_URL manually in Render.");
    return null;
  }
  const user = `postgres.${SUPABASE_PROJECT_REF}`;
  const enc = encodeURIComponent(password);
  return `postgresql://${user}:${enc}@db.${SUPABASE_PROJECT_REF}.supabase.co:5432/postgres?schema=crm`;
}

async function getEnvVars(serviceId) {
  const rows = await api(`/services/${serviceId}/env-vars?limit=100`);
  const map = {};
  for (const row of rows || []) {
    const ev = row.envVar || row;
    if (ev?.key) map[ev.key] = ev.value ?? "";
  }
  return map;
}

async function putEnvVar(serviceId, key, value) {
  await api(`/services/${serviceId}/env-vars/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: JSON.stringify({ key, value }),
  });
  console.log(`  ✓ ${key}`);
}

async function main() {
  const services = await listAllServices();
  if (!services.length) throw new Error("No Render services found for this API key");

  const service = pickService(services);
  if (!service) {
    console.error("Services found:", services.map((s) => s.name).join(", "));
    throw new Error(`No service matching "${SERVICE_NAME_HINT}". Set RENDER_SERVICE_NAME.`);
  }

  console.log(`Service: ${service.name} (${service.id})`);

  const existing = await getEnvVars(service.id);
  const databaseUrl = existing.DATABASE_URL;
  const directUrl = buildDirectUrl(databaseUrl);

  const jwtSecret = process.env.JWT_SECRET?.trim() || crypto.randomBytes(48).toString("base64");
  const jwtRefresh =
    process.env.JWT_REFRESH_SECRET?.trim() || crypto.randomBytes(48).toString("base64");
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  const updates = {
    CRM_WEB_URL,
    SUPABASE_URL,
    JWT_SECRET: jwtSecret,
    JWT_REFRESH_SECRET: jwtRefresh,
    NODE_ENV: "production",
    OTP_IN_RESPONSE: "false",
  };

  if (directUrl) updates.DIRECT_URL = directUrl;
  if (supabaseServiceKey) updates.SUPABASE_SERVICE_ROLE_KEY = supabaseServiceKey;
  else {
    console.warn("\n⚠ SUPABASE_SERVICE_ROLE_KEY not set — skip. Add in Supabase → Settings → API → service_role");
  }

  console.log("\nUpdating env vars (merge)...");
  for (const [key, value] of Object.entries(updates)) {
    await putEnvVar(service.id, key, value);
  }

  console.log("\nDone. Trigger a manual deploy on Render to reload the service.");
  if (!supabaseServiceKey) {
    console.log("Then set SUPABASE_SERVICE_ROLE_KEY in Render and redeploy again.");
  }
  console.log("\nGenerated JWT secrets (also written to Render):");
  console.log("  JWT_SECRET=", jwtSecret);
  console.log("  JWT_REFRESH_SECRET=", jwtRefresh);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
