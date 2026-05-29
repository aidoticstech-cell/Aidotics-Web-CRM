const { createClient } = require("@supabase/supabase-js");
const { AppError } = require("../common/errors");

const DEFAULT_DOCUMENTS_BUCKET = "crm-documents";

let client;

function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

function requireSupabase() {
  const sb = getSupabase();
  if (!sb) {
    throw new AppError(
      "File storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the API server.",
      503
    );
  }
  return sb;
}

function documentsBucket() {
  return process.env.SUPABASE_DOCUMENTS_BUCKET || DEFAULT_DOCUMENTS_BUCKET;
}

/**
 * @param {{ bucket?: string, path: string, body: Buffer | string, contentType?: string, upsert?: boolean }}
 */
async function uploadObject({ bucket, path, body, contentType, upsert = true }) {
  const sb = requireSupabase();
  const bucketId = bucket || documentsBucket();

  const { data, error } = await sb.storage.from(bucketId).upload(path, body, {
    contentType: contentType || "application/octet-stream",
    upsert,
  });

  if (error) {
    throw new AppError(error.message || "Storage upload failed", 502, { path, bucket: bucketId });
  }

  return { bucket: bucketId, path, storageId: data?.id || null };
}

async function uploadJson(path, payload, bucket) {
  const body = Buffer.from(JSON.stringify(payload, null, 2), "utf8");
  return uploadObject({
    bucket,
    path,
    body,
    contentType: "application/json; charset=utf-8",
    upsert: true,
  });
}

async function removeObject(path, bucket) {
  const sb = requireSupabase();
  const bucketId = bucket || documentsBucket();
  const { error } = await sb.storage.from(bucketId).remove([path]);
  if (error) {
    throw new AppError(error.message || "Storage delete failed", 502, { path });
  }
}

module.exports = {
  isSupabaseConfigured,
  getSupabase,
  requireSupabase,
  documentsBucket,
  uploadObject,
  uploadJson,
  removeObject,
};
