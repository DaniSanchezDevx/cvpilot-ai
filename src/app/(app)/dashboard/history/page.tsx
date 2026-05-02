import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowUpRight } from "lucide-react";
import { mapPersistedResumeAnalysis } from "@/features/resume-analysis/application/resume-analysis.mapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <Card>
        <CardHeader>
          <CardTitle>Analysis history</CardTitle>
          <CardDescription>Every CV and job-description comparison saved to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((analysis) => (
                <TableRow key={analysis.id}>
                  <TableCell>
                    <p className="font-medium">{analysis.jobTitle ?? "Untitled role"}</p>
                    <p className="text-sm text-muted-foreground">{analysis.resumeFileName ?? "Pasted resume"}</p>
                  </TableCell>
                  <TableCell className="font-mono">{analysis.score.overall}/100</TableCell>
                  <TableCell>
                    <Badge variant={analysis.status === "COMPLETED" ? "default" : "secondary"}>{analysis.status}</Badge>
                  </TableCell>
                  <TableCell>{analysis.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button asChild size="icon" variant="ghost" aria-label="Open analysis">
                      <Link href={`/dashboard/analyses/${analysis.id}`}>
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

