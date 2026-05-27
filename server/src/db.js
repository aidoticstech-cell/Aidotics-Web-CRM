const { PrismaClient } = require("@prisma/client");

let prisma = new PrismaClient();

function getPrisma() {
  return prisma;
}

async function disconnectPrisma() {
  await prisma.$disconnect();
}

function resetPrismaClient() {
  prisma = new PrismaClient();
  return prisma;
}

module.exports = getPrisma();
module.exports.getPrisma = getPrisma;
module.exports.disconnectPrisma = disconnectPrisma;
module.exports.resetPrismaClient = resetPrismaClient;
