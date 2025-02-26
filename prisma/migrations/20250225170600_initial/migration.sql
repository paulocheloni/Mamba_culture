-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('active', 'paused', 'expired');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('seasonal', 'regular', 'special');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'regular',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "CampaignStatus" NOT NULL DEFAULT 'active',
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);
