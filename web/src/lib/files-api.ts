import { apiFetch } from "./api";

export type UploadedProfileDoc = {
  storageSlug: string;
  bucket: string;
  path: string;
  file: { id: string; fileName: string | null; fileKey: string };
};

export type ProfileDocType = "gst_certificate" | "pan_card" | "aadhaar_card" | "cancelled_cheque";

const DOC_TYPE_BY_LABEL: Record<string, ProfileDocType> = {
  "GST Certificate": "gst_certificate",
  "PAN Card": "pan_card",
  "Aadhaar Card": "aadhaar_card",
  "Cancelled Cheque": "cancelled_cheque",
};

export function profileDocTypeFromLabel(label: string): ProfileDocType | null {
  return DOC_TYPE_BY_LABEL[label] ?? null;
}

export async function uploadProfileVerificationDoc(file: File, docType: ProfileDocType) {
  const form = new FormData();
  form.append("file", file);
  form.append("docType", docType);
  return apiFetch<UploadedProfileDoc>("/onboarding/profile_verification/upload", {
    method: "POST",
    body: form,
  });
}
