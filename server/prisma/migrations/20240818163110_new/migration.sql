-- DropForeignKey
ALTER TABLE "IncidentActivity" DROP CONSTRAINT "IncidentActivity_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "IncidentActivity" DROP CONSTRAINT "IncidentActivity_userId_fkey";

-- AlterTable
ALTER TABLE "IncidentActivity" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "IncidentActivity" ADD CONSTRAINT "IncidentActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentActivity" ADD CONSTRAINT "IncidentActivity_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
