import { currentUser } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account and usage information.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input readOnly value={dbUser?.name ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input readOnly value={dbUser?.email ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label>Saved analyses</Label>
            <Input readOnly value={analysisCount} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

