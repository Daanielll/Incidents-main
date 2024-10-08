/*
  Warnings:

  - You are about to drop the column `userId` on the `Incident` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_userId_fkey";

-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "userId",
ADD COLUMN     "updated_by_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
