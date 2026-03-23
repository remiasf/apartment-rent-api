-- CreateTable
CREATE TABLE "Apartment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "rooms" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Apartment_title_key" ON "Apartment"("title");
