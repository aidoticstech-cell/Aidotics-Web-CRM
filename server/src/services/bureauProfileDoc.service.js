const crypto = require("crypto");
const prisma = require("../db");
const { AppError } = require("../common/errors");
const { notDeletedWhere } = require("../common/pagination");
const { makeStorageSlug, profileJsonPath, profileUploadPath } = require("../lib/storageSlug");
const supabaseStorage = require("./supabaseStorage.service");

const PROFILE_DOC = "profile.json";

/**
 * Ensure bureau has a stable storage folder slug (from register name).
 */
async function ensureBureauStorageSlug(bureau) {
  if (bureau.storageSlug) return bureau;

  const storageSlug = makeStorageSlug(bureau.name, bureau.id);
  return prisma.bureau.update({
    where: { id: bureau.id },
    data: { storageSlug },
  });
}

async function getBureauForStorage(bureauId) {
  const bureau = await prisma.bureau.findFirst({
    where: { id: bureauId, ...notDeletedWhere() },
  });
  if (!bureau) throw new AppError("Bureau not found", 404);
  return ensureBureauStorageSlug(bureau);
}

/**
 * Write profile.json under {storageSlug}/profile/ in Supabase Storage.
 */
async function saveProfileDocument(bureauId, profileDraft, actorId, extra = {}) {
  const bureau = await getBureauForStorage(bureauId);
  const registeredName = bureau.name;
  const displayName =
    typeof profileDraft?.displayName === "string" && profileDraft.displayName.trim()
      ? profileDraft.displayName.trim()
      : typeof profileDraft?.legalName === "string" && profileDraft.legalName.trim()
        ? profileDraft.legalName.trim()
        : registeredName;

  const document = {
    schemaVersion: 1,
    kind: "bureau_profile",
    bureauId: bureau.id,
    bureauCode: bureau.code,
    registeredName,
    displayName,
    storageSlug: bureau.storageSlug,
    updatedAt: new Date().toISOString(),
    updatedBy: actorId || null,
    profile: profileDraft || {},
    ...extra,
  };

  if (!supabaseStorage.isSupabaseConfigured()) {
    return { bureau, document, storage: null, skipped: true };
  }

  const path = profileJsonPath(bureau.storageSlug);
  const storage = await supabaseStorage.uploadJson(path, document);

  return {
    bureau,
    document,
    storage: { bucket: storage.bucket, path, fileKey: path },
    skipped: false,
  };
}

const KYC_PURPOSE_MAP = {
  gst_certificate: { type: "GST", purpose: "kyc/gst_certificate" },
  pan_card: { type: "PAN", purpose: "kyc/pan_card" },
  aadhaar_card: { type: "AADHAAR", purpose: "kyc/aadhaar_card" },
  cancelled_cheque: { type: "OTHER", purpose: "kyc/cancelled_cheque" },
};

/**
 * Upload a verification file under the bureau profile folder.
 */
async function uploadProfileFile({
  bureauId,
  actorId,
  docType,
  buffer,
  fileName,
  mimeType,
  branchId,
}) {
  const meta = KYC_PURPOSE_MAP[docType];
  if (!meta) throw new AppError("Invalid document type", 400);

  const bureau = await getBureauForStorage(bureauId);
  const fileId = crypto.randomUUID();
  const path = profileUploadPath(bureau.storageSlug, meta.purpose, fileId, fileName);

  const storage = await supabaseStorage.uploadObject({
    path,
    body: buffer,
    contentType: mimeType,
  });

  let verificationRequest = await prisma.verificationRequest.findFirst({
    where: { bureauId, type: meta.type, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!verificationRequest) {
    verificationRequest = await prisma.verificationRequest.create({
      data: {
        bureauId,
        branchId: branchId || null,
        type: meta.type,
        status: "SUBMITTED",
        createdBy: actorId,
      },
    });
  }

  const verificationDocument = await prisma.verificationDocument.create({
    data: {
      requestId: verificationRequest.id,
      fileKey: path,
      fileName: fileName || null,
      mimeType: mimeType || null,
      createdBy: actorId,
    },
  });

  const storedFile = await prisma.storedFile.create({
    data: {
      id: fileId,
      bureauId,
      branchId: branchId || null,
      purpose: meta.purpose,
      fileKey: path,
      storageBucket: storage.bucket,
      fileName: fileName || null,
      mimeType: mimeType || null,
      sizeBytes: buffer.length,
      createdBy: actorId,
    },
  });

  return {
    bureau,
    storageSlug: bureau.storageSlug,
    bucket: storage.bucket,
    path,
    file: storedFile,
    verificationRequest,
    verificationDocument,
  };
}

module.exports = {
  PROFILE_DOC,
  ensureBureauStorageSlug,
  getBureauForStorage,
  saveProfileDocument,
  uploadProfileFile,
  KYC_PURPOSE_MAP,
};
