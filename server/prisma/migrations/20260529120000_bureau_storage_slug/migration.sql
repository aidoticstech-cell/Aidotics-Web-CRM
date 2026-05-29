-- Bureau Storage folder slug + StoredFile bucket
ALTER TABLE "crm"."Bureau" ADD COLUMN IF NOT EXISTS "storageSlug" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Bureau_storageSlug_key" ON "crm"."Bureau"("storageSlug");

ALTER TABLE "crm"."StoredFile" ADD COLUMN IF NOT EXISTS "storageBucket" TEXT;
