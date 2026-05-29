-- Supabase Storage buckets for CRM uploads
-- Private buckets; Render API uploads with service_role key

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'crm-documents',
    'crm-documents',
    false,
    10485760, -- 10 MB
    ARRAY[
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf',
      'text/csv'
    ]
  ),
  (
    'crm-imports',
    'crm-imports',
    false,
    5242880, -- 5 MB
    ARRAY['text/csv', 'application/vnd.ms-excel', 'text/plain']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Path layout (enforced by API when generating fileKey):
--   crm-documents/{bureau_id}/{purpose}/{stored_file_id}/{filename}
--   crm-imports/{bureau_id}/workforce/{import_job_id}/{filename}
--
-- purpose examples: logo | kyc_pan | kyc_gst | kyc_aadhaar | qr_code | public_gallery

-- Service role (Render backend) has full access — no policy needed.
-- Block direct browser uploads until you add signed-URL flow or map Supabase Auth.

DROP POLICY IF EXISTS "crm_documents_service_role_all" ON storage.objects;
DROP POLICY IF EXISTS "crm_imports_service_role_all" ON storage.objects;

CREATE POLICY "crm_documents_service_role_all"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'crm-documents')
  WITH CHECK (bucket_id = 'crm-documents');

CREATE POLICY "crm_imports_service_role_all"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'crm-imports')
  WITH CHECK (bucket_id = 'crm-imports');

-- Optional: bureau-scoped read via JWT claim bureau_id (enable when using Supabase Auth)
-- CREATE POLICY "crm_documents_bureau_read"
--   ON storage.objects FOR SELECT
--   TO authenticated
--   USING (
--     bucket_id = 'crm-documents'
--     AND (storage.foldername(name))[1] = (auth.jwt() ->> 'bureau_id')
--   );
