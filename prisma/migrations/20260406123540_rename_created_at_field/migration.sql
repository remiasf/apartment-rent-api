/*
  Warnings:

  - You are about to drop the column `agencyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Agency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgencyRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "AgencyRequest" DROP CONSTRAINT "AgencyRequest_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "AgencyRequest" DROP CONSTRAINT "AgencyRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_agencyId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "agencyId",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT;

-- DropTable
DROP TABLE "Agency";

-- DropTable
DROP TABLE "AgencyRequest";

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "userId" INTEGER NOT NULL,
    "apartmentId" INTEGER NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
