-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "crm";

-- CreateEnum
CREATE TYPE "crm"."VerificationType" AS ENUM ('PAN', 'GST', 'AADHAAR', 'BUSINESS_CERTIFICATE', 'OTHER');
CREATE TYPE "crm"."VerificationStatus" AS ENUM ('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED');
CREATE TYPE "crm"."WorkforceLinkStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED');
CREATE TYPE "crm"."ImportJobStatus" AS ENUM ('VALIDATING', 'VALIDATED', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE "crm"."PaymentMethodType" AS ENUM ('BANK', 'UPI', 'QR');
CREATE TYPE "crm"."OtpPurpose" AS ENUM ('REGISTER', 'LOGIN', 'VERIFY_EMAIL', 'FORGOT_PASSWORD');

-- CreateTable Bureau (must exist before User FK)
CREATE TABLE "crm"."Bureau" (
    "id" TEXT NOT NULL,
    "partnerBureauId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoKey" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Bureau_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."Role" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."Permission" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."User" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobile" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."OtpLog" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "purpose" "crm"."OtpPurpose" NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OtpLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."BureauService" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "BureauService_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."BureauLocation" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "pincode" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "BureauLocation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."Branch" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "address" TEXT,
    "gstNumber" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."BillingConfig" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
    "gstNumber" TEXT,
    "gstEnabled" BOOLEAN NOT NULL DEFAULT false,
    "financialYear" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "BillingConfig_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."BankAccount" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "branchId" TEXT,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifsc" TEXT NOT NULL,
    "bankName" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."PaymentMethod" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "branchId" TEXT,
    "type" "crm"."PaymentMethodType" NOT NULL,
    "label" TEXT,
    "upiId" TEXT,
    "qrFileKey" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."WorkflowPreference" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "businessModel" TEXT,
    "leadAssignment" TEXT,
    "dutyAssignment" TEXT,
    "approvalRules" JSONB,
    "paymentHandlingStyle" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "WorkflowPreference_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."UserBranch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    CONSTRAINT "UserBranch_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."VerificationRequest" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "branchId" TEXT,
    "type" "crm"."VerificationType" NOT NULL,
    "status" "crm"."VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."VerificationDocument" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileName" TEXT,
    "mimeType" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VerificationDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."WorkforceLink" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "branchId" TEXT,
    "workerId" TEXT NOT NULL,
    "status" "crm"."WorkforceLinkStatus" NOT NULL DEFAULT 'PENDING',
    "mobile" TEXT,
    "fullName" TEXT,
    "notes" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "WorkforceLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."ImportJob" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "branchId" TEXT,
    "fileName" TEXT NOT NULL,
    "status" "crm"."ImportJobStatus" NOT NULL DEFAULT 'VALIDATING',
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "validRows" INTEGER NOT NULL DEFAULT 0,
    "errorRows" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ImportJob_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."ImportLog" (
    "id" TEXT NOT NULL,
    "importJobId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImportLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."SetupProgress" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "steps" JSONB NOT NULL DEFAULT '{}',
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SetupProgress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."AuditLog" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "branchId" TEXT,
    "actorId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm"."StoredFile" (
    "id" TEXT NOT NULL,
    "bureauId" TEXT NOT NULL,
    "branchId" TEXT,
    "purpose" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileName" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "StoredFile_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "Bureau_partnerBureauId_key" ON "crm"."Bureau"("partnerBureauId");
CREATE UNIQUE INDEX "Bureau_code_key" ON "crm"."Bureau"("code");
CREATE UNIQUE INDEX "User_email_key" ON "crm"."User"("email");
CREATE INDEX "User_bureauId_idx" ON "crm"."User"("bureauId");
CREATE INDEX "Session_userId_idx" ON "crm"."Session"("userId");
CREATE INDEX "OtpLog_email_purpose_idx" ON "crm"."OtpLog"("email", "purpose");
CREATE UNIQUE INDEX "Role_slug_bureauId_key" ON "crm"."Role"("slug", "bureauId");
CREATE UNIQUE INDEX "Permission_slug_key" ON "crm"."Permission"("slug");
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "crm"."RolePermission"("roleId", "permissionId");
CREATE INDEX "BureauService_bureauId_idx" ON "crm"."BureauService"("bureauId");
CREATE INDEX "BureauLocation_bureauId_idx" ON "crm"."BureauLocation"("bureauId");
CREATE UNIQUE INDEX "Branch_bureauId_code_key" ON "crm"."Branch"("bureauId", "code");
CREATE INDEX "Branch_bureauId_idx" ON "crm"."Branch"("bureauId");
CREATE UNIQUE INDEX "BillingConfig_bureauId_key" ON "crm"."BillingConfig"("bureauId");
CREATE INDEX "BankAccount_bureauId_idx" ON "crm"."BankAccount"("bureauId");
CREATE INDEX "PaymentMethod_bureauId_idx" ON "crm"."PaymentMethod"("bureauId");
CREATE UNIQUE INDEX "WorkflowPreference_bureauId_key" ON "crm"."WorkflowPreference"("bureauId");
CREATE UNIQUE INDEX "UserBranch_userId_branchId_key" ON "crm"."UserBranch"("userId", "branchId");
CREATE INDEX "VerificationRequest_bureauId_type_idx" ON "crm"."VerificationRequest"("bureauId", "type");
CREATE INDEX "VerificationDocument_requestId_idx" ON "crm"."VerificationDocument"("requestId");
CREATE UNIQUE INDEX "WorkforceLink_bureauId_workerId_key" ON "crm"."WorkforceLink"("bureauId", "workerId");
CREATE INDEX "WorkforceLink_bureauId_status_idx" ON "crm"."WorkforceLink"("bureauId", "status");
CREATE INDEX "ImportJob_bureauId_idx" ON "crm"."ImportJob"("bureauId");
CREATE INDEX "ImportLog_importJobId_idx" ON "crm"."ImportLog"("importJobId");
CREATE UNIQUE INDEX "SetupProgress_bureauId_key" ON "crm"."SetupProgress"("bureauId");
CREATE INDEX "AuditLog_bureauId_createdAt_idx" ON "crm"."AuditLog"("bureauId", "createdAt");
CREATE INDEX "StoredFile_bureauId_purpose_idx" ON "crm"."StoredFile"("bureauId", "purpose");

-- ForeignKeys
ALTER TABLE "crm"."RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "crm"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "crm"."Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."User" ADD CONSTRAINT "User_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "crm"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "crm"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "crm"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."BureauService" ADD CONSTRAINT "BureauService_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."BureauLocation" ADD CONSTRAINT "BureauLocation_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."Branch" ADD CONSTRAINT "Branch_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."BillingConfig" ADD CONSTRAINT "BillingConfig_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."BankAccount" ADD CONSTRAINT "BankAccount_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."PaymentMethod" ADD CONSTRAINT "PaymentMethod_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."WorkflowPreference" ADD CONSTRAINT "WorkflowPreference_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."UserBranch" ADD CONSTRAINT "UserBranch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "crm"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."UserBranch" ADD CONSTRAINT "UserBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "crm"."Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."VerificationRequest" ADD CONSTRAINT "VerificationRequest_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."VerificationDocument" ADD CONSTRAINT "VerificationDocument_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "crm"."VerificationRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."WorkforceLink" ADD CONSTRAINT "WorkforceLink_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."WorkforceLink" ADD CONSTRAINT "WorkforceLink_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "crm"."Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "crm"."ImportJob" ADD CONSTRAINT "ImportJob_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."ImportLog" ADD CONSTRAINT "ImportLog_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "crm"."ImportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."SetupProgress" ADD CONSTRAINT "SetupProgress_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm"."AuditLog" ADD CONSTRAINT "AuditLog_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "crm"."Bureau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
