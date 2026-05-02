import { currentUser } from "@clerk/nextjs/server";
import { DashboardOverview } from "@/features/resume-analysis/presentation/dashboard-overview";
import { getPrisma } from "@/lib/db/prisma";
import { upsertUserProfile } from "@/lib/auth/user-profile";
import { mapPersistedResumeAnalysis } from "@/features/resume-analysis/application/resume-analysis.mapper";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    return <DashboardOverview analyses={[]} />;
  }

  const dbUser = await upsertUserProfile(user);
  const analyses = await getPrisma().resumeAnalysis.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  return <DashboardOverview analyses={analyses.map(mapPersistedResumeAnalysis)} />;
}
