import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { AnalysisDetail } from "@/features/resume-analysis/presentation/analysis-detail";
import { mapPersistedResumeAnalysis } from "@/features/resume-analysis/application/resume-analysis.mapper";
import { getPrisma } from "@/lib/db/prisma";
import { upsertUserProfile } from "@/lib/auth/user-profile";

export const dynamic = "force-dynamic";

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  const { id } = await params;

  if (!user) {
    notFound();
  }

  const dbUser = await upsertUserProfile(user);
  const analysis = await getPrisma().resumeAnalysis.findFirst({
    where: {
      id,
      userId: dbUser.id,
    },
  });

  if (!analysis) {
    notFound();
  }

  return <AnalysisDetail analysis={mapPersistedResumeAnalysis(analysis)} />;
}

