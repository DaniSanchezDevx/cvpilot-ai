import { currentUser } from "@clerk/nextjs/server";
import { mapPersistedResumeAnalysis } from "@/features/resume-analysis/application/resume-analysis.mapper";
import { AnalysisHistoryTable } from "@/features/resume-analysis/presentation/analysis-history-table";
import { getPrisma } from "@/lib/db/prisma";
import { upsertUserProfile } from "@/lib/auth/user-profile";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const user = await currentUser();
  const analyses = user
    ? await getPrisma().resumeAnalysis.findMany({
        where: { userId: (await upsertUserProfile(user)).id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const rows = analyses.map(mapPersistedResumeAnalysis);

  return (
    <main className="mx-auto w-full max-w-7xl p-6">
      <AnalysisHistoryTable rows={rows} />
    </main>
  );
}
