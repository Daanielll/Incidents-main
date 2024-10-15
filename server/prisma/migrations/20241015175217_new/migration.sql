/*
  Warnings:

  - You are about to drop the column `bcp_duration` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `bcp_latest` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `main_site` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `operational_impact` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - Added the required column `branch` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operationalImpact` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severity` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `site` to the `App` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `App` required. This step will fail if there are existing NULL values in that column.
  - Made the column `env` on table `App` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recovery` on table `App` required. This step will fail if there are existing NULL values in that column.
  - Made the column `platform` on table `App` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "App" DROP COLUMN "bcp_duration",
DROP COLUMN "bcp_latest",
DROP COLUMN "main_site",
DROP COLUMN "operational_impact",
ADD COLUMN     "alternative" TEXT,
ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "operationalImpact" TEXT NOT NULL,
ADD COLUMN     "section" TEXT NOT NULL,
ADD COLUMN     "severity" INTEGER NOT NULL,
ADD COLUMN     "site" "Site" NOT NULL,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "env" SET NOT NULL,
ALTER COLUMN "recovery" SET NOT NULL,
ALTER COLUMN "platform" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "first_name",
DROP COLUMN "last_name",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AppManagers" (
    "userId" INTEGER NOT NULL,
    "appId" INTEGER NOT NULL,

    CONSTRAINT "AppManagers_pkey" PRIMARY KEY ("appId","userId")
);

-- CreateTable
CREATE TABLE "AppBCP" (
    "appId" INTEGER NOT NULL,
    "bcpDuration" INTEGER NOT NULL,
    "bcpLatest" TIMESTAMP(3) NOT NULL,
    "bcpComplexity" INTEGER NOT NULL,
    "bcpDependence" TEXT,
    "bcpOther" TEXT,

    CONSTRAINT "AppBCP_pkey" PRIMARY KEY ("appId")
);

-- AddForeignKey
ALTER TABLE "AppManagers" ADD CONSTRAINT "AppManagers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppManagers" ADD CONSTRAINT "AppManagers_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppBCP" ADD CONSTRAINT "AppBCP_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;
