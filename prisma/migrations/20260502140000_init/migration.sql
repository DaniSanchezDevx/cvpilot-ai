CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "AnalysisStatus" AS ENUM ('DRAFT', 'PROCESSING', 'COMPLETED', 'FAILED');

CREATE TABLE "UserProfile" (
  "id" TEXT NOT NULL,
  "clerkId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ResumeAnalysis" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "jobTitle" TEXT,
  "resumeFileName" TEXT,
  "resumeMimeType" TEXT,
  "resumeText" TEXT NOT NULL,
  "jobDescription" TEXT NOT NULL,
  "score" JSONB NOT NULL,
  "keywords" JSONB NOT NULL,
  "profile" JSONB NOT NULL,
  "suggestions" JSONB NOT NULL,
  "insights" JSONB NOT NULL,
  "optimizedResume" JSONB,
  "status" "AnalysisStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ResumeAnalysis_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserProfile_clerkId_key" ON "UserProfile"("clerkId");
CREATE INDEX "ResumeAnalysis_userId_createdAt_idx" ON "ResumeAnalysis"("userId", "createdAt");

ALTER TABLE "ResumeAnalysis"
  ADD CONSTRAINT "ResumeAnalysis_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "UserProfile"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
