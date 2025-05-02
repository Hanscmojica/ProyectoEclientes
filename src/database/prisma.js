const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Función que devuelve la instancia de Prisma
const getPrisma = () => {
    return prisma;
};

module.exports = { getPrisma };
