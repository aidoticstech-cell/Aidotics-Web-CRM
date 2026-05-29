-- Aidotics Bureau CRM — PostgreSQL schema `crm`
-- Run in Supabase: SQL Editor → New query → paste → Run
-- Compatible with Prisma migrations in server/prisma/migrations/

CREATE SCHEMA IF NOT EXISTS crm;

-- Enums
DO $$ BEGIN
  CREATE TYPE crm."VerificationType" AS ENUM ('PAN', 'GST', 'AADHAAR', 'BUSINESS_CERTIFICATE', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE crm."VerificationStatus" AS ENUM ('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE crm."WorkforceLinkStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE crm."ImportJobStatus" AS ENUM ('VALIDATING', 'VALIDATED', 'PROCESSING', 'COMPLETED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE crm."PaymentMethodType" AS ENUM ('BANK', 'UPI', 'QR');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE crm."OtpPurpose" AS ENUM ('REGISTER', 'LOGIN', 'VERIFY_EMAIL', 'FORGOT_PASSWORD');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Bureau (tenant root)
CREATE TABLE IF NOT EXISTS crm."Bureau" (
  id TEXT PRIMARY KEY,
  "partnerBureauId" TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  "storageSlug" TEXT,
  "logoKey" TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS "Bureau_partnerBureauId_key" ON crm."Bureau" ("partnerBureauId");
CREATE UNIQUE INDEX IF NOT EXISTS "Bureau_code_key" ON crm."Bureau" (code);
CREATE UNIQUE INDEX IF NOT EXISTS "Bureau_storageSlug_key" ON crm."Bureau" ("storageSlug");

-- RBAC
CREATE TABLE IF NOT EXISTS crm."Role" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  "isSystem" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crm."Permission" (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  description TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crm."RolePermission" (
  id TEXT PRIMARY KEY,
  "roleId" TEXT NOT NULL REFERENCES crm."Role" (id) ON DELETE CASCADE,
  "permissionId" TEXT NOT NULL REFERENCES crm."Permission" (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Role_slug_bureauId_key" ON crm."Role" (slug, "bureauId");
CREATE UNIQUE INDEX IF NOT EXISTS "Permission_slug_key" ON crm."Permission" (slug);
CREATE UNIQUE INDEX IF NOT EXISTS "RolePermission_roleId_permissionId_key"
  ON crm."RolePermission" ("roleId", "permissionId");

-- Staff auth (CRM uses Express JWT; not Supabase Auth by default)
CREATE TABLE IF NOT EXISTS crm."User" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  "roleId" TEXT NOT NULL REFERENCES crm."Role" (id) ON DELETE RESTRICT,
  email TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  mobile TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "emailVerifiedAt" TIMESTAMPTZ,
  "lastLoginAt" TIMESTAMPTZ,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON crm."User" (email);
CREATE INDEX IF NOT EXISTS "User_bureauId_idx" ON crm."User" ("bureauId");

CREATE TABLE IF NOT EXISTS crm."Session" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES crm."User" (id) ON DELETE CASCADE,
  "refreshTokenHash" TEXT NOT NULL,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "revokedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON crm."Session" ("userId");

CREATE TABLE IF NOT EXISTS crm."OtpLog" (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  purpose crm."OtpPurpose" NOT NULL,
  "otpHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "usedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "OtpLog_email_purpose_idx" ON crm."OtpLog" (email, purpose);

-- Bureau profile
CREATE TABLE IF NOT EXISTS crm."BureauService" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  "sortOrder" INT NOT NULL DEFAULT 0,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "BureauService_bureauId_idx" ON crm."BureauService" ("bureauId");

CREATE TABLE IF NOT EXISTS crm."BureauLocation" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  state TEXT,
  pincode TEXT,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "BureauLocation_bureauId_idx" ON crm."BureauLocation" ("bureauId");

CREATE TABLE IF NOT EXISTS crm."Branch" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  city TEXT,
  state TEXT,
  address TEXT,
  "gstNumber" TEXT,
  phone TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS "Branch_bureauId_code_key" ON crm."Branch" ("bureauId", code);
CREATE INDEX IF NOT EXISTS "Branch_bureauId_idx" ON crm."Branch" ("bureauId");

-- Billing & payments
CREATE TABLE IF NOT EXISTS crm."BillingConfig" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL UNIQUE REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
  "gstNumber" TEXT,
  "gstEnabled" BOOLEAN NOT NULL DEFAULT false,
  "financialYear" TEXT,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS crm."BankAccount" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  "branchId" TEXT,
  "accountName" TEXT NOT NULL,
  "accountNumber" TEXT NOT NULL,
  ifsc TEXT NOT NULL,
  "bankName" TEXT,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "BankAccount_bureauId_idx" ON crm."BankAccount" ("bureauId");

CREATE TABLE IF NOT EXISTS crm."PaymentMethod" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  "branchId" TEXT,
  type crm."PaymentMethodType" NOT NULL,
  label TEXT,
  "upiId" TEXT,
  "qrFileKey" TEXT,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "PaymentMethod_bureauId_idx" ON crm."PaymentMethod" ("bureauId");

CREATE TABLE IF NOT EXISTS crm."WorkflowPreference" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL UNIQUE REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  "businessModel" TEXT,
  "leadAssignment" TEXT,
  "dutyAssignment" TEXT,
  "approvalRules" JSONB,
  "paymentHandlingStyle" TEXT,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS crm."UserBranch" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES crm."User" (id) ON DELETE CASCADE,
  "branchId" TEXT NOT NULL REFERENCES crm."Branch" (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserBranch_userId_branchId_key"
  ON crm."UserBranch" ("userId", "branchId");

-- KYC / verification (documents point at Storage via fileKey)
CREATE TABLE IF NOT EXISTS crm."VerificationRequest" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  "branchId" TEXT,
  type crm."VerificationType" NOT NULL,
  status crm."VerificationStatus" NOT NULL DEFAULT 'PENDING',
  payload JSONB,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "VerificationRequest_bureauId_type_idx"
  ON crm."VerificationRequest" ("bureauId", type);

CREATE TABLE IF NOT EXISTS crm."VerificationDocument" (
  id TEXT PRIMARY KEY,
  "requestId" TEXT NOT NULL REFERENCES crm."VerificationRequest" (id) ON DELETE CASCADE,
  "fileKey" TEXT NOT NULL,
  "fileName" TEXT,
  "mimeType" TEXT,
  "createdBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "VerificationDocument_requestId_idx"
  ON crm."VerificationDocument" ("requestId");

-- Workforce (workerId references Partner app public.Worker — no FK across schemas)
CREATE TABLE IF NOT EXISTS crm."WorkforceLink" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  "branchId" TEXT REFERENCES crm."Branch" (id) ON DELETE SET NULL,
  "workerId" TEXT NOT NULL,
  status crm."WorkforceLinkStatus" NOT NULL DEFAULT 'PENDING',
  mobile TEXT,
  "fullName" TEXT,
  notes TEXT,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS "WorkforceLink_bureauId_workerId_key"
  ON crm."WorkforceLink" ("bureauId", "workerId");
CREATE INDEX IF NOT EXISTS "WorkforceLink_bureauId_status_idx"
  ON crm."WorkforceLink" ("bureauId", status);

CREATE TABLE IF NOT EXISTS crm."ImportJob" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  "branchId" TEXT,
  "fileName" TEXT NOT NULL,
  status crm."ImportJobStatus" NOT NULL DEFAULT 'VALIDATING',
  "totalRows" INT NOT NULL DEFAULT 0,
  "validRows" INT NOT NULL DEFAULT 0,
  "errorRows" INT NOT NULL DEFAULT 0,
  "createdBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "ImportJob_bureauId_idx" ON crm."ImportJob" ("bureauId");

CREATE TABLE IF NOT EXISTS crm."ImportLog" (
  id TEXT PRIMARY KEY,
  "importJobId" TEXT NOT NULL REFERENCES crm."ImportJob" (id) ON DELETE CASCADE,
  "rowNumber" INT NOT NULL,
  level TEXT NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  payload JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "ImportLog_importJobId_idx" ON crm."ImportLog" ("importJobId");

-- Onboarding wizard (8 steps — JSON drafts + normalized tables above)
CREATE TABLE IF NOT EXISTS crm."SetupProgress" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL UNIQUE REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  "currentStep" INT NOT NULL DEFAULT 1,
  "stepsStatus" JSONB NOT NULL DEFAULT '{}',
  "stepDrafts" JSONB NOT NULL DEFAULT '{}',
  steps JSONB NOT NULL DEFAULT '{}',
  "isComplete" BOOLEAN NOT NULL DEFAULT false,
  "completedAt" TIMESTAMPTZ,
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Generic file registry (metadata; bytes live in Supabase Storage)
CREATE TABLE IF NOT EXISTS crm."StoredFile" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL,
  "branchId" TEXT,
  purpose TEXT NOT NULL,
  "fileKey" TEXT NOT NULL,
  "fileName" TEXT,
  "mimeType" TEXT,
  "sizeBytes" INT,
  "storageBucket" TEXT,
  "createdBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "StoredFile_bureauId_purpose_idx"
  ON crm."StoredFile" ("bureauId", purpose);

-- Audit trail
CREATE TABLE IF NOT EXISTS crm."AuditLog" (
  id TEXT PRIMARY KEY,
  "bureauId" TEXT NOT NULL REFERENCES crm."Bureau" (id) ON DELETE CASCADE,
  "branchId" TEXT,
  "actorId" TEXT,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  action TEXT NOT NULL,
  "before" JSONB,
  "after" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "AuditLog_bureauId_createdAt_idx"
  ON crm."AuditLog" ("bureauId", "createdAt");

-- Optional: link CRM user to Supabase Auth later (run when migrating auth)
ALTER TABLE crm."User"
  ADD COLUMN IF NOT EXISTS "supabaseAuthId" UUID UNIQUE;

COMMENT ON SCHEMA crm IS 'Aidotics Bureau CRM — tenant data isolated by bureauId';
COMMENT ON TABLE crm."SetupProgress" IS 'Onboarding: stepDrafts JSON per slug; syncs to Bureau/Branch/etc on complete';
COMMENT ON COLUMN crm."StoredFile"."fileKey" IS 'Object path inside storageBucket, e.g. {bureauId}/kyc/{fileId}/pan.pdf';
COMMENT ON COLUMN crm."StoredFile"."storageBucket" IS 'Supabase bucket id, e.g. crm-documents';
