/*
  Warnings:

  - You are about to drop the column `originalPrice` on the `Apartment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Apartment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "discountPrice" INTEGER,
    "price" INTEGER NOT NULL,
    "rooms" INTEGER NOT NULL
);
INSERT INTO "new_Apartment" ("id", "price", "rooms", "title") SELECT "id", "price", "rooms", "title" FROM "Apartment";
DROP TABLE "Apartment";
ALTER TABLE "new_Apartment" RENAME TO "Apartment";
CREATE UNIQUE INDEX "Apartment_title_key" ON "Apartment"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
