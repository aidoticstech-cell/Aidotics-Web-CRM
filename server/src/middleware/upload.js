const multer = require("multer");
const { AppError } = require("../common/errors");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

function uploadSingle(fieldName = "file") {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (!err) return next();
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new AppError("File too large (max 10 MB)", 400));
      }
      return next(new AppError(err.message || "Upload failed", 400));
    });
  };
}

module.exports = { uploadSingle };
