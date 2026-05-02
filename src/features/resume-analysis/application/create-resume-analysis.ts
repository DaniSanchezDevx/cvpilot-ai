import type { User } from "@clerk/nextjs/server";
import { Prisma } from "@/generated/prisma/client";
import { generateResumeAnalysis } from "./ai-resume-analysis";
import { createAnalysisInputSchema } from "./resume-analysis.schema";
import { extractTextFromResumeFile } from "../infrastructure/file-text-extractor";
import { getPrisma } from "@/lib/db/prisma";
import { upsertUserProfile } from "@/lib/auth/user-profile";

export async function createResumeAnalysisFromFormData(user: User, formData: FormData) {
  console.info("[CVPilot] create analysis: parsing form data");
  const resumeFile = formData.get("resumeFile");
  const pastedResumeText = String(formData.get("resumeText") ?? "");
  const jobDescription = String(formData.get("jobDescription") ?? "");
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();

  const hasPastedResumeText = pastedResumeText.trim().length > 0;
  const hasFile = resumeFile instanceof File && resumeFile.size > 0;
  const resumeText =
    hasPastedResumeText || !hasFile
      ? pastedResumeText
      : await extractTextFromResumeFile(resumeFile);

  const input = createAnalysisInputSchema.parse({
    resumeText,
    jobDescription,
    jobTitle: jobTitle || undefined,
    resumeFileName: hasFile ? resumeFile.name : "pasted-resume.txt",
    resumeMimeType: hasFile ? resumeFile.type : "text/plain",
  });

  console.info("[CVPilot] create analysis: upserting user");
  const dbUser = await upsertUserProfile(user);

  console.info("[CVPilot] create analysis: generating AI analysis");
  const analysis = await generateResumeAnalysis({
    resumeText: input.resumeText,
    jobDescription: input.jobDescription,
    jobTitle: input.jobTitle,
  });

  console.info("[CVPilot] create analysis: saving to database");
  const created = await getPrisma().resumeAnalysis.create({
    data: {
      userId: dbUser.id,
      jobTitle: input.jobTitle,
      resumeFileName: input.resumeFileName,
      resumeMimeType: input.resumeMimeType,
      resumeText: input.resumeText,
      jobDescription: input.jobDescription,
      score: toJson(analysis.score),
      keywords: toJson(analysis.keywords),
      profile: toJson(analysis.profile),
      suggestions: toJson(analysis.suggestions),
      insights: toJson(analysis.insights),
      optimizedResume: toJson(analysis.optimizedResume),
      status: analysis.source === "openai" ? "COMPLETED" : "DRAFT",
    },
  });

  return {
    id: created.id,
    source: analysis.source,
  };
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
