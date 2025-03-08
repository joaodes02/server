-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tracion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Tempera" TEXT NOT NULL,
    "Item" TEXT NOT NULL,
    "Bobina" TEXT NOT NULL,
    "Espessura" REAL NOT NULL,
    "LE" REAL,
    "LR" REAL,
    "Alogamento" REAL,
    "R" REAL,
    "N" REAL,
    "toc" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tom" DATETIME
);
INSERT INTO "new_Tracion" ("Alogamento", "Bobina", "Espessura", "Item", "LE", "LR", "N", "R", "Tempera", "id") SELECT "Alogamento", "Bobina", "Espessura", "Item", "LE", "LR", "N", "R", "Tempera", "id" FROM "Tracion";
DROP TABLE "Tracion";
ALTER TABLE "new_Tracion" RENAME TO "Tracion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
