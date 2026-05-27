class AppError extends Error {
  constructor(message, status = 400, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { AppError, asyncHandler };
