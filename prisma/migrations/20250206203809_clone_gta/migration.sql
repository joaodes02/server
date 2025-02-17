-- CreateTable
CREATE TABLE "Usuarios" (
    "Matricula" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Operacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dadosId" INTEGER,
    "nominalId" INTEGER,
    "revId" INTEGER,
    "durezaId" INTEGER,
    "oilId" INTEGER,
    "TOC" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TOM" DATETIME,
    CONSTRAINT "Operacao_dadosId_fkey" FOREIGN KEY ("dadosId") REFERENCES "Dados" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Operacao_nominalId_fkey" FOREIGN KEY ("nominalId") REFERENCES "Nominal" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Operacao_revId_fkey" FOREIGN KEY ("revId") REFERENCES "Rev" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Operacao_durezaId_fkey" FOREIGN KEY ("durezaId") REFERENCES "Dureza" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Operacao_oilId_fkey" FOREIGN KEY ("oilId") REFERENCES "Oil" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dados" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipamento" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "bobina" TEXT NOT NULL,
    "operacaoId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Nominal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "superior" REAL NOT NULL,
    "inferior" REAL NOT NULL,
    "operacaoId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Rev" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "esqSup" REAL NOT NULL,
    "centroSup" REAL NOT NULL,
    "dirSup" REAL NOT NULL,
    "esqInf" REAL NOT NULL,
    "centroInf" REAL NOT NULL,
    "dirInf" REAL NOT NULL,
    "ligaSup" REAL NOT NULL,
    "ligaInf" REAL NOT NULL,
    "mediaSup" REAL NOT NULL,
    "mediaInf" REAL NOT NULL,
    "dispSup" REAL NOT NULL,
    "dispInf" REAL NOT NULL,
    "operacaoId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Dureza" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "esq" INTEGER NOT NULL,
    "centro" INTEGER NOT NULL,
    "dir" INTEGER NOT NULL,
    "operacaoId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Oil" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "esqSup" REAL NOT NULL,
    "centroSup" REAL NOT NULL,
    "dirSup" REAL NOT NULL,
    "mediaSup" REAL NOT NULL,
    "esqInf" REAL NOT NULL,
    "centroInf" REAL NOT NULL,
    "dirInf" REAL NOT NULL,
    "mediaInf" REAL NOT NULL,
    "operacaoId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Operacao_dadosId_key" ON "Operacao"("dadosId");

-- CreateIndex
CREATE UNIQUE INDEX "Operacao_nominalId_key" ON "Operacao"("nominalId");

-- CreateIndex
CREATE UNIQUE INDEX "Operacao_revId_key" ON "Operacao"("revId");

-- CreateIndex
CREATE UNIQUE INDEX "Operacao_durezaId_key" ON "Operacao"("durezaId");

-- CreateIndex
CREATE UNIQUE INDEX "Operacao_oilId_key" ON "Operacao"("oilId");

-- CreateIndex
CREATE UNIQUE INDEX "Dados_operacaoId_key" ON "Dados"("operacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Nominal_operacaoId_key" ON "Nominal"("operacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Rev_operacaoId_key" ON "Rev"("operacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Dureza_operacaoId_key" ON "Dureza"("operacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Oil_operacaoId_key" ON "Oil"("operacaoId");
