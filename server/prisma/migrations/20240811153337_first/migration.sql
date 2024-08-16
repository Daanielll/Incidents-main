-- CreateEnum
CREATE TYPE "TechnicalImpact" AS ENUM ('SHUTDOWN', 'PARTIAL_SHUTDOWN', 'FEATURE_SHUTDOWN', 'BACKUP_NONE', 'SLOW', 'JITTER', 'SLOW_SHUTDOWN', 'DATA_TRANSMISSION', 'NONE');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPENED', 'ONGOING', 'RESOLVED', 'AWAITING_ANSWER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MANAGER', 'ANALYST');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('OPENSHIFT', 'ORACLE', 'MAINFRAME');

-- CreateEnum
CREATE TYPE "Site" AS ENUM ('MAMRAM', 'MARGANIT', 'OTHER');

-- CreateEnum
CREATE TYPE "Env" AS ENUM ('BLACK', 'RED', 'YELLOW');

-- CreateEnum
CREATE TYPE "ReportedBy" AS ENUM ('CLIENT', 'MONITORED', 'KAPAT');

-- CreateEnum
CREATE TYPE "Recovery" AS ENUM ('AVAILABLE', 'DISABLED', 'NONE');

-- CreateTable
CREATE TABLE "Incident" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "technical_impact" "TechnicalImpact" NOT NULL,
    "operational_impact" TEXT NOT NULL,
    "monitored" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "IncidentStatus" NOT NULL,
    "platform" "Platform" NOT NULL,
    "env" "Env" NOT NULL,
    "site" "Site" NOT NULL,
    "reported_by" "ReportedBy" NOT NULL,
    "omer_sent" BOOLEAN NOT NULL DEFAULT false,
    "snow_ticket" INTEGER,
    "opened_by_id" INTEGER,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ANALYST',
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "operational_impact" TEXT,
    "env" "Env",
    "main_site" "Site",
    "recovery" "Recovery",
    "platform" "Platform",

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentApp" (
    "incidentId" INTEGER NOT NULL,
    "appId" INTEGER NOT NULL,

    CONSTRAINT "IncidentApp_pkey" PRIMARY KEY ("appId","incidentId")
);

-- CreateTable
CREATE TABLE "IncidentImpact" (
    "incidentId" INTEGER NOT NULL,
    "appId" INTEGER NOT NULL,

    CONSTRAINT "IncidentImpact_pkey" PRIMARY KEY ("appId","incidentId")
);

-- CreateTable
CREATE TABLE "IncidentActivity" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "message_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "IncidentActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_opened_by_id_fkey" FOREIGN KEY ("opened_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentApp" ADD CONSTRAINT "IncidentApp_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentApp" ADD CONSTRAINT "IncidentApp_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentImpact" ADD CONSTRAINT "IncidentImpact_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentImpact" ADD CONSTRAINT "IncidentImpact_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentActivity" ADD CONSTRAINT "IncidentActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
