-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dados" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipamento" TEXT,
    "horario" TEXT,
    "item" TEXT,
    "bobina" TEXT,
    "operacaoId" INTEGER
);
INSERT INTO "new_Dados" ("bobina", "equipamento", "horario", "id", "item", "operacaoId") SELECT "bobina", "equipamento", "horario", "id", "item", "operacaoId" FROM "Dados";
DROP TABLE "Dados";
ALTER TABLE "new_Dados" RENAME TO "Dados";
CREATE UNIQUE INDEX "Dados_operacaoId_key" ON "Dados"("operacaoId");
CREATE TABLE "new_Dureza" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "esq" INTEGER,
    "centro" INTEGER,
    "dir" INTEGER,
    "operacaoId" INTEGER
);
INSERT INTO "new_Dureza" ("centro", "dir", "esq", "id", "operacaoId") SELECT "centro", "dir", "esq", "id", "operacaoId" FROM "Dureza";
DROP TABLE "Dureza";
ALTER TABLE "new_Dureza" RENAME TO "Dureza";
CREATE UNIQUE INDEX "Dureza_operacaoId_key" ON "Dureza"("operacaoId");
CREATE TABLE "new_Nominal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "superior" REAL,
    "inferior" REAL,
    "operacaoId" INTEGER
);
INSERT INTO "new_Nominal" ("id", "inferior", "operacaoId", "superior") SELECT "id", "inferior", "operacaoId", "superior" FROM "Nominal";
DROP TABLE "Nominal";
ALTER TABLE "new_Nominal" RENAME TO "Nominal";
CREATE UNIQUE INDEX "Nominal_operacaoId_key" ON "Nominal"("operacaoId");
CREATE TABLE "new_Oil" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "esqSup" REAL,
    "centroSup" REAL,
    "dirSup" REAL,
    "mediaSup" REAL,
    "esqInf" REAL,
    "centroInf" REAL,
    "dirInf" REAL,
    "mediaInf" REAL,
    "operacaoId" INTEGER
);
INSERT INTO "new_Oil" ("centroInf", "centroSup", "dirInf", "dirSup", "esqInf", "esqSup", "id", "mediaInf", "mediaSup", "operacaoId") SELECT "centroInf", "centroSup", "dirInf", "dirSup", "esqInf", "esqSup", "id", "mediaInf", "mediaSup", "operacaoId" FROM "Oil";
DROP TABLE "Oil";
ALTER TABLE "new_Oil" RENAME TO "Oil";
CREATE UNIQUE INDEX "Oil_operacaoId_key" ON "Oil"("operacaoId");
CREATE TABLE "new_Rev" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "esqSup" REAL,
    "centroSup" REAL,
    "dirSup" REAL,
    "esqInf" REAL,
    "centroInf" REAL,
    "dirInf" REAL,
    "ligaSup" REAL,
    "ligaInf" REAL,
    "mediaSup" REAL,
    "mediaInf" REAL,
    "dispSup" REAL,
    "dispInf" REAL,
    "operacaoId" INTEGER
);
INSERT INTO "new_Rev" ("centroInf", "centroSup", "dirInf", "dirSup", "dispInf", "dispSup", "esqInf", "esqSup", "id", "ligaInf", "ligaSup", "mediaInf", "mediaSup", "operacaoId") SELECT "centroInf", "centroSup", "dirInf", "dirSup", "dispInf", "dispSup", "esqInf", "esqSup", "id", "ligaInf", "ligaSup", "mediaInf", "mediaSup", "operacaoId" FROM "Rev";
DROP TABLE "Rev";
ALTER TABLE "new_Rev" RENAME TO "Rev";
CREATE UNIQUE INDEX "Rev_operacaoId_key" ON "Rev"("operacaoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
