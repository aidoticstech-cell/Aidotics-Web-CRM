import { ApiError } from "./api";

/** User-facing message for profile / KYC upload failures (e.g. Supabase not configured on API). */
export function formatProfileUploadError(e: unknown): string {
  if (e instanceof ApiError) {
    if (
      e.status === 503 ||
      /storage|supabase|not configured|service role/i.test(e.message)
    ) {
      return "Document storage is not configured on the server. In Render, set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, run the Supabase storage migration, then redeploy.";
    }
    return e.message;
  }
  if (e instanceof Error) return e.message;
  return "Upload failed";
}
