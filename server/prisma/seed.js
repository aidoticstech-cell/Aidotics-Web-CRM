require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const prisma = require("../src/db");
const { seedPermissionsAndRoles } = require("../src/services/rbac.service");

async function main() {
  await seedPermissionsAndRoles();
  console.log("CRM permissions seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
