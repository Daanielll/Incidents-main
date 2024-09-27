/*
  Warnings:

  - The values [MANAGER,ANALYST] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `jira_ticket` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the `IncidentActivity` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('COMMANDER', 'HAMAL', 'KAPAT');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'HAMAL';
COMMIT;

-- DropForeignKey
ALTER TABLE "IncidentActivity" DROP CONSTRAINT "IncidentActivity_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "IncidentActivity" DROP CONSTRAINT "IncidentActivity_userId_fkey";

-- AlterTable
ALTER TABLE "App" ADD COLUMN     "bcp_duration" INTEGER,
ADD COLUMN     "bcp_latest" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "jira_ticket",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'HAMAL';

-- DropTable
DROP TABLE "IncidentActivity";
