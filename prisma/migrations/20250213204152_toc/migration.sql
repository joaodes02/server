/*
  Warnings:

  - You are about to drop the column `TOC` on the `Operacao` table. All the data in the column will be lost.
  - You are about to drop the column `TOM` on the `Operacao` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Operacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dadosId" INTEGER,
    "nominalId" INTEGER,
    "revId" INTEGER,
    "durezaId" INTEGER,
    "oilId" INTEGER,
    "toc" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tom" DATETIME,
    CONSTRAINT "Operacao_dadosId_fkey" FOREIGN KEY ("dadosId") REFERENCES "Dados" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Operacao_nominalId_fkey" FOREIGN KEY ("nominalId") REFERENCES "Nominal" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Operacao_revId_fkey" FOREIGN KEY ("revId") REFERENCES "Rev" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Operacao_durezaId_fkey" FOREIGN KEY ("durezaId") REFERENCES "Dureza" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Operacao_oilId_fkey" FOREIGN KEY ("oilId") REFERENCES "Oil" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Operacao" ("dadosId", "durezaId", "id", "nominalId", "oilId", "revId") SELECT "dadosId", "durezaId", "id", "nominalId", "oilId", "revId" FROM "Operacao";
DROP TABLE "Operacao";
ALTER TABLE "new_Operacao" RENAME TO "Operacao";
CREATE UNIQUE INDEX "Operacao_dadosId_key" ON "Operacao"("dadosId");
CREATE UNIQUE INDEX "Operacao_nominalId_key" ON "Operacao"("nominalId");
CREATE UNIQUE INDEX "Operacao_revId_key" ON "Operacao"("revId");
CREATE UNIQUE INDEX "Operacao_durezaId_key" ON "Operacao"("durezaId");
CREATE UNIQUE INDEX "Operacao_oilId_key" ON "Operacao"("oilId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
