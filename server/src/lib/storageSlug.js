/**
 * Storage folder slug from bureau name at registration.
 * Example: "Demo Care Bureau" + id "a1b2c3d4-..." → "demo-care-bureau--a1b2c3d4"
 */
function makeStorageSlug(bureauName, bureauId) {
  const base = String(bureauName || "bureau")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  const shortId = String(bureauId || "")
    .replace(/-/g, "")
    .slice(0, 8)
    .toLowerCase();

  const namePart = base || "bureau";
  return shortId ? `${namePart}--${shortId}` : namePart;
}

function profileRootPath(storageSlug) {
  return `${storageSlug}/profile`;
}

function profileJsonPath(storageSlug) {
  return `${profileRootPath(storageSlug)}/profile.json`;
}

function profileUploadPath(storageSlug, purpose, fileId, fileName) {
  const safeName = String(fileName || "file")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return `${profileRootPath(storageSlug)}/${purpose}/${fileId}-${safeName || "file"}`;
}

module.exports = {
  makeStorageSlug,
  profileRootPath,
  profileJsonPath,
  profileUploadPath,
};
