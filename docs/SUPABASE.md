# Supabase schema for Aidotics Bureau CRM

Supabase is **PostgreSQL + Storage**. The CRM API on **Render** keeps using **Prisma**; point `DATABASE_URL` at your Supabase project. File bytes go to **Storage**; metadata stays in the `crm` schema.

## Linked project (do not use other Supabase projects)

| Field | Value |
|--------|--------|
| **Name** | Aidotics-Web-CRM |
| **Project ref** | `lsveivwgzevtoyqhqvyi` |
| **API URL** | `https://lsveivwgzevtoyqhqvyi.supabase.co` |
| **Region** | ap-southeast-1 |

Other projects in the org (`aidoticstech@gmail.com's Project`, `Aidotics CRM App`, etc.) are **not** this CRM database. Always connect Render/local `.env` to **Aidotics-Web-CRM** only.

## Architecture

```mermaid
flowchart TB
  Web[Vercel_Next.js]
  API[Render_Express_Prisma]
  DB[(Supabase_Postgres_crm_schema)]
  Storage[(Supabase_Storage)]
  Web -->|/api/v1 JWT| API
  API --> DB
  API -->|service_role upload| Storage
```

| Layer | Responsibility |
|--------|----------------|
| **`crm` tables** | Bureau, users, branches, billing, onboarding drafts, workforce links, file registry |
| **Storage buckets** | Binary files (KYC PDFs, logos, QR images, CSV imports) |
| **`fileKey` + `storageBucket`** | Link a DB row to an object path in Storage |

---

## 1. Create schema in Supabase

1. [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**.
2. Run in order:
   - [`supabase/migrations/00001_crm_schema.sql`](../supabase/migrations/00001_crm_schema.sql)
   - [`supabase/migrations/00002_crm_storage.sql`](../supabase/migrations/00002_crm_storage.sql)
3. **Table Editor** → schema **`crm`** — you should see ~20 tables.

Alternatively from your machine (with Supabase DB URL):

```bash
cd server
export DATABASE_URL="postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?schema=crm"
export DIRECT_URL="postgresql://postgres.[ref]:[PASSWORD]@db.[ref].supabase.co:5432/postgres?schema=crm"
npx prisma migrate deploy
npm run db:seed
```

Use the **transaction pooler** (port **6543**) for Render; **direct** (port **5432**) for migrations.

---

## 2. Render environment variables

```bash
DATABASE_URL=postgresql://...pooler...?schema=crm
DIRECT_URL=postgresql://...direct...?schema=crm
JWT_SECRET=...
CRM_WEB_URL=https://your-app.vercel.app

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # server only — never expose to Vercel/browser
```

---

## 3. Data model (by domain)

### Tenant & auth

| Table | Purpose |
|--------|---------|
| `Bureau` | One healthcare bureau (tenant) |
| `User` | Staff login (`passwordHash`); optional `supabaseAuthId` for future Auth |
| `Session` | Refresh tokens |
| `Role`, `Permission`, `RolePermission` | RBAC per bureau |
| `OtpLog` | Email OTP |

### Profile & org

| Table | Purpose |
|--------|---------|
| `BureauService`, `BureauLocation` | Services & cities |
| `Branch` | Branch offices |
| `BillingConfig`, `BankAccount`, `PaymentMethod` | GST, bank, UPI/QR |
| `WorkflowPreference` | Ops model JSON (`approvalRules`, etc.) |
| `UserBranch` | Staff ↔ branch assignment |

### Compliance & files

| Table | Purpose |
|--------|---------|
| `VerificationRequest` | PAN / GST / Aadhaar / cert requests |
| `VerificationDocument` | `fileKey` → Storage object |
| `StoredFile` | Generic uploads (logo, gallery, etc.) |

### Workforce & onboarding

| Table | Purpose |
|--------|---------|
| `WorkforceLink` | Bureau ↔ Partner `workerId` |
| `ImportJob`, `ImportLog` | CSV import audit |
| `SetupProgress` | **8-step** wizard: `stepDrafts`, `stepsStatus`, `currentStep` |

### Audit

| Table | Purpose |
|--------|---------|
| `AuditLog` | Who changed what |

---

## 4. Onboarding: where data is saved

| Step slug | Primary storage |
|-----------|-----------------|
| `profile_verification` | `SetupProgress.stepDrafts` → on complete, syncs to `Bureau`, `BureauService`, `BureauLocation` |
| `branches_billing` | Draft JSON + `Branch`, `BillingConfig`, `PaymentMethod`, `BankAccount` |
| `operations_setup` | `stepDrafts` + `WorkflowPreference` |
| `workforce_roles` | `stepDrafts` + `User`, `Role`, `WorkforceLink` |
| `duty_engine` | `stepDrafts` + `WorkflowPreference.approvalRules` |
| `workflow_automation` | `stepDrafts` |
| `public_brand_profile` | `stepDrafts` + `StoredFile` |
| `subscription_go_live` | `stepDrafts`; `SetupProgress.isComplete = true` |

Until each step is normalized, the API stores the full form in **`SetupProgress.stepDrafts[slug]`** (JSONB).

---

## 5. File uploads (Storage)

### Buckets

| Bucket | Use |
|--------|-----|
| `crm-documents` | Logos, KYC, QR codes, gallery (max 10 MB) |
| `crm-imports` | Workforce CSV (max 5 MB) |

### Path convention (bureau register name)

Each bureau gets a **stable folder** from the name they register with:

```
{storageSlug}/profile/profile.json
{storageSlug}/profile/kyc/gst_certificate/{fileId}-gst.pdf
{storageSlug}/profile/kyc/pan_card/{fileId}-pan.jpg
```

Example: bureau registers as **"Demo Care Bureau"** → folder `demo-care-bureau--a1b2c3d4`

| Path | Contents |
|------|----------|
| `.../profile/profile.json` | Full profile form (legal name, GST, services, cities, uploads map) |
| `.../profile/kyc/*` | KYC PDFs/images from onboarding step 1 |

`storageSlug` is on `crm."Bureau"."storageSlug"` and set at registration.

`storageBucket` = `crm-documents`

### API flow (recommended)

1. Client → `POST /v1/files/upload` with metadata **after** upload, **or**
2. Client → `POST /v1/files/presign` (to add) → upload to signed URL → confirm with `fileKey`

Today the API only records metadata if the client sends `fileKey` (`server/src/routes/files.routes.js`). Next step: add Supabase upload in the API using `SUPABASE_SERVICE_ROLE_KEY`.

### DB columns after upload

```sql
INSERT INTO crm."StoredFile" (
  id, "bureauId", purpose, "fileKey", "storageBucket", "fileName", "mimeType", "sizeBytes", "createdBy"
) VALUES (
  gen_random_uuid()::text,
  :bureauId,
  'kyc_pan',
  :bureauId || '/kyc_pan/' || :fileId || '/pan.pdf',
  'crm-documents',
  'pan.pdf',
  'application/pdf',
  102400,
  :userId
);
```

`VerificationDocument.fileKey` uses the same path pattern.

---

## 6. Partner app on the same database

If the **Partner** API also uses this Supabase project:

- Partner data stays in schema **`public`** (`Worker`, `Job`, `Bureau`, …).
- CRM data stays in schema **`crm`**.
- Do **not** add FK from `crm.WorkforceLink.workerId` to `public.Worker` unless both schemas are in one DB and you manage migrations together.

---

## 7. Row Level Security (RLS)

**Default:** CRM access goes through **Render + JWT**, not Supabase client SDK. Keep RLS **off** on `crm` tables for now (Prisma uses DB credentials with full access).

Enable RLS later if the web app talks to Supabase directly:

```sql
ALTER TABLE crm."Bureau" ENABLE ROW LEVEL SECURITY;
-- policy: bureauId = (auth.jwt() ->> 'bureau_id')
```

Storage policies in `00002_crm_storage.sql` already allow **service_role** full access for the API.

---

## 8. Checklist

- [x] `crm` schema on **Aidotics-Web-CRM** (`lsveivwgzevtoyqhqvyi`)
- [x] Storage buckets `crm-documents`, `crm-imports` + service_role policies
- [x] Prisma migrations through `20260529120000_bureau_storage_slug` (incl. `Bureau.storageSlug`)
- [x] Backfilled `storageSlug` for existing bureaus
- [ ] Set Render `DATABASE_URL` / `DIRECT_URL` with `?schema=crm` (pooler **6543**, direct **5432**)
- [ ] Run `npm run db:seed` on Render if you need default permissions/roles on a fresh DB
- [ ] Set `SUPABASE_URL=https://lsveivwgzevtoyqhqvyi.supabase.co` + `SUPABASE_SERVICE_ROLE_KEY` on Render
- [ ] Set `CRM_WEB_URL` to your Vercel URL

## 9. API behaviour (implemented)

| Action | Endpoint | Storage path |
|--------|----------|----------------|
| Register bureau | `POST /v1/auth/register` | Creates `{storageSlug}/profile/profile.json` |
| Save profile draft | `PUT /v1/onboarding/profile_verification/draft` | Updates `profile.json` |
| Complete profile step | `POST /v1/onboarding/profile_verification/complete` | Updates `profile.json` + syncs `Bureau` tables |
| Upload KYC file | `POST /v1/onboarding/profile_verification/upload` | `{storageSlug}/profile/kyc/{type}/...` |
| Generic file | `POST /v1/files/upload` (multipart) | `{storageSlug}/profile/{purpose}/...` |

In Supabase **Storage → crm-documents**, browse folders by bureau register name (`storageSlug`).
