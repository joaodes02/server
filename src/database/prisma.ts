import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Habilitar as chaves estrangeiras no SQLite
prisma.$executeRaw`PRAGMA foreign_keys = ON;`;

export { prisma };
