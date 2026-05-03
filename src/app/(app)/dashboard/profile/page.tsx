import { currentUser } from "@clerk/nextjs/server";
import { ProfileCard } from "@/components/profile/profile-card";
import { getPrisma } from "@/lib/db/prisma";
import { upsertUserProfile } from "@/lib/auth/user-profile";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await currentUser();
  const dbUser = user ? await upsertUserProfile(user) : null;
  const analysisCount = dbUser
    ? await getPrisma().resumeAnalysis.count({ where: { userId: dbUser.id } })
    : 0;

  return (
    <main className="mx-auto grid w-full max-w-4xl gap-6 p-6">
      <ProfileCard name={dbUser?.name ?? ""} email={dbUser?.email ?? ""} analysisCount={analysisCount} />
    </main>
  );
}
