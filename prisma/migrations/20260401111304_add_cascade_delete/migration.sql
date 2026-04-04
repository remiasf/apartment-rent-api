-- DropForeignKey
ALTER TABLE "Apartment" DROP CONSTRAINT "Apartment_userId_fkey";

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
