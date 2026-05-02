"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateResumeAnalysis } from "./ai-resume-analysis";
import { getPrisma } from "@/lib/db/prisma";
import { upsertUserProfile } from "@/lib/auth/user-profile";

export async function optimizeResumeAction(formData: FormData) {
  const analysisId = String(formData.get("analysisId") ?? "");
  const user = await currentUser();

  if (!user || !analysisId) {
    return;
  }

  const dbUser = await upsertUserProfile(user);
  const existing = await getPrisma().resumeAnalysis.findFirst({
    where: {
      id: analysisId,
      userId: dbUser.id,
    },
  });

  if (!existing) {
    return;
  }

  const refreshed = await generateResumeAnalysis({
    resumeText: existing.resumeText,
    jobDescription: existing.jobDescription,
    jobTitle: existing.jobTitle ?? undefined,
  });

  await getPrisma().resumeAnalysis.update({
    where: { id: existing.id },
    data: {
      score: refreshed.score,
      keywords: refreshed.keywords,
      profile: refreshed.profile,
      suggestions: refreshed.suggestions,
      insights: refreshed.insights,
      optimizedResume: refreshed.optimizedResume,
      status: refreshed.source === "openai" ? "COMPLETED" : "DRAFT",
    },
  });

  revalidatePath(`/dashboard/analyses/${existing.id}`);
  revalidatePath("/dashboard");
}

