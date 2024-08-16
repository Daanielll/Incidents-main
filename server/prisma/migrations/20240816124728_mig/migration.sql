/*
  Warnings:

  - Added the required column `incidentId` to the `IncidentActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IncidentActivity" ADD COLUMN     "incidentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "IncidentActivity" ADD CONSTRAINT "IncidentActivity_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
