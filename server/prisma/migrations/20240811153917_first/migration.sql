/*
  Warnings:

  - The values [MAMRAM,MARGANIT] on the enum `Site` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Site_new" AS ENUM ('FIRST', 'SECOND', 'OTHER');
ALTER TABLE "Incident" ALTER COLUMN "site" TYPE "Site_new" USING ("site"::text::"Site_new");
ALTER TABLE "App" ALTER COLUMN "main_site" TYPE "Site_new" USING ("main_site"::text::"Site_new");
ALTER TYPE "Site" RENAME TO "Site_old";
ALTER TYPE "Site_new" RENAME TO "Site";
DROP TYPE "Site_old";
COMMIT;
