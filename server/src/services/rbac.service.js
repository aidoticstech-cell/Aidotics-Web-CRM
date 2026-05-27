const prisma = require("../db");

const PERMISSIONS = [
  { slug: "bureau:read", description: "View bureau profile" },
  { slug: "bureau:write", description: "Edit bureau profile" },
  { slug: "branches:read", description: "View branches" },
  { slug: "branches:write", description: "Manage branches" },
  { slug: "billing:read", description: "View billing setup" },
  { slug: "billing:write", description: "Edit billing setup" },
  { slug: "payments:read", description: "View payment methods" },
  { slug: "payments:write", description: "Manage payment methods" },
  { slug: "team:read", description: "View team members" },
  { slug: "team:write", description: "Manage team members" },
  { slug: "roles:read", description: "View roles" },
  { slug: "roles:write", description: "Manage roles" },
  { slug: "workforce:read", description: "View workforce" },
  { slug: "workforce:read_pii", description: "View workforce PII" },
  { slug: "workforce:write", description: "Manage workforce" },
  { slug: "duties:read", description: "View duties" },
  { slug: "duties:write", description: "Approve/reject duties" },
  { slug: "verification:read", description: "View KYC status" },
  { slug: "verification:write", description: "Submit KYC documents" },
  { slug: "files:write", description: "Upload files" },
  { slug: "audit:read", description: "View audit logs" },
];

async function seedPermissionsAndRoles() {
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { slug: p.slug },
      create: p,
      update: { description: p.description },
    });
  }
}

async function getAdminRoleForBureau(bureauId) {
  const perms = await prisma.permission.findMany();
  return prisma.role.upsert({
    where: { slug_bureauId: { slug: "admin", bureauId } },
    create: {
      bureauId,
      name: "Admin",
      slug: "admin",
      isSystem: true,
      rolePermissions: { create: perms.map((p) => ({ permissionId: p.id })) },
    },
    update: {},
    include: { rolePermissions: { include: { permission: true } } },
  });
}

async function seedPresetRolesForBureau(bureauId) {
  const allPerms = await prisma.permission.findMany();
  const bySlug = Object.fromEntries(allPerms.map((p) => [p.slug, p.id]));

  const presets = [
    {
      slug: "coordinator",
      name: "Coordinator",
      permissions: ["bureau:read", "branches:read", "workforce:read", "workforce:read_pii", "duties:read", "duties:write", "audit:read"],
    },
    {
      slug: "recruiter",
      name: "Recruiter",
      permissions: ["bureau:read", "workforce:read", "workforce:write", "workforce:read_pii", "files:write"],
    },
    {
      slug: "finance",
      name: "Finance",
      permissions: ["bureau:read", "billing:read", "billing:write", "payments:read", "payments:write", "audit:read"],
    },
  ];

  for (const preset of presets) {
    const role = await prisma.role.upsert({
      where: { slug_bureauId: { slug: preset.slug, bureauId } },
      create: { bureauId, slug: preset.slug, name: preset.name, isSystem: true },
      update: { name: preset.name },
    });
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermission.createMany({
      data: preset.permissions
        .filter((s) => bySlug[s])
        .map((slug) => ({ roleId: role.id, permissionId: bySlug[slug] })),
    });
  }
}

module.exports = { PERMISSIONS, seedPermissionsAndRoles, getAdminRoleForBureau, seedPresetRolesForBureau };
