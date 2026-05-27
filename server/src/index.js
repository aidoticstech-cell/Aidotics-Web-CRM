require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { AppError } = require("./common/errors");
const { disconnectPrisma } = require("./db");

const authRoutes = require("./routes/auth.routes");
const bureauRoutes = require("./routes/bureau.routes");
const branchesRoutes = require("./routes/branches.routes");
const billingRoutes = require("./routes/billing.routes");
const paymentsRoutes = require("./routes/payments.routes");
const teamRoutes = require("./routes/team.routes");
const rolesRoutes = require("./routes/roles.routes");
const workforceRoutes = require("./routes/workforce.routes");
const workforceImportRoutes = require("./routes/workforceImport.routes");
const verificationRoutes = require("./routes/verification.routes");
const filesRoutes = require("./routes/files.routes");
const dutiesRoutes = require("./routes/duties.routes");
const setupRoutes = require("./routes/setup.routes");
const onboardingRoutes = require("./routes/onboarding.routes");
const auditRoutes = require("./routes/audit.routes");
const workflowRoutes = require("./routes/workflow.routes");

const app = express();
const PORT = Number(process.env.PORT) || 4100;

if (!process.env.JWT_SECRET || !String(process.env.JWT_SECRET).trim()) {
  console.error("FATAL: JWT_SECRET must be set");
  process.exit(1);
}

app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));

app.get("/", (_req, res) => {
  res.json({
    service: "aidotics-bureau-crm-api",
    version: "1.0.0",
    health: "/health",
    apiPrefix: "/v1",
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "aidotics-bureau-crm-api" });
});

app.use("/v1/auth", authRoutes);
app.use("/v1/bureau", bureauRoutes);
app.use("/v1/branches", branchesRoutes);
app.use("/v1/billing", billingRoutes);
app.use("/v1/payments", paymentsRoutes);
app.use("/v1/team", teamRoutes);
app.use("/v1/roles", rolesRoutes);
app.use("/v1/workforce", workforceRoutes);
app.use("/v1/workforce/import", workforceImportRoutes);
app.use("/v1/verification", verificationRoutes);
app.use("/v1/files", filesRoutes);
app.use("/v1/duties", dutiesRoutes);
app.use("/v1/setup", setupRoutes);
app.use("/v1/onboarding", onboardingRoutes);
app.use("/v1/audit", auditRoutes);
app.use("/v1/workflow", workflowRoutes);

function mapErrorToHttp(err) {
  if (err instanceof AppError) {
    return { status: err.status, message: err.message, detail: err.detail };
  }
  const code = err.code;
  if (code === "P2002") {
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : "record";
    return { status: 409, message: `Already exists (${target})`, detail: err.meta };
  }
  if (code === "P2003") {
    return { status: 400, message: err.message || "Invalid reference", detail: err.meta };
  }
  if (typeof code === "string" && code.startsWith("P")) {
    return { status: 400, message: err.message || `Database error (${code})`, detail: err.meta };
  }
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const message = err.message && String(err.message).trim() ? err.message : "Internal server error";
  return { status, message, detail: err.detail };
}

app.use((err, _req, res, _next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("[api]", err);
  }
  const { status, message, detail } = mapErrorToHttp(err);
  res.status(status).json({
    message,
    detail,
    ...(process.env.NODE_ENV !== "production" && err.code ? { code: err.code } : {}),
  });
});

const server = app.listen(PORT, () => {
  console.log(`Aidotics Bureau CRM API listening on http://localhost:${PORT}`);
});

process.on("SIGTERM", async () => {
  server.close(async () => {
    await disconnectPrisma();
    process.exit(0);
  });
});

module.exports = app;
