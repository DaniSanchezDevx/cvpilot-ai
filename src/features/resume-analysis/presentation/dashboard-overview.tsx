"use client";

import { ArrowUpRight, Database } from "lucide-react";
import Link from "next/link";
import type { ResumeAnalysis } from "../domain/resume-analysis.types";
import { ResumeAnalysisForm } from "./resume-analysis-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/i18n/language-provider";

type DashboardOverviewProps = {
  analyses: ResumeAnalysis[];
};

export function DashboardOverview({ analyses }: DashboardOverviewProps) {
  const { t } = useLanguage();
  const latestAnalysis = analyses[0];
  const averageScore =
    analyses.length > 0
      ? Math.round(analyses.reduce((total, analysis) => total + analysis.score.overall, 0) / analyses.length)
      : 0;

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6 xl:grid-cols-[1fr_380px]">
      <section className="space-y-6">
        <div>
          <Badge variant="secondary">{t("dashboard.badge")}</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{t("dashboard.title")}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {t("dashboard.description")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            [t("dashboard.savedAnalyses"), analyses.length.toString()],
            [t("dashboard.averageScore"), `${averageScore}/100`],
            [t("dashboard.latestStatus"), latestAnalysis?.status ?? t("dashboard.emptyStatus")],
          ].map(([label, value]) => (
            <Card key={label}>
              <CardHeader className="pb-2">
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-3xl">{value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <ResumeAnalysisForm />
      </section>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.parsedProfile")}</CardTitle>
            <CardDescription>{latestAnalysis?.resumeFileName ?? t("dashboard.noCvParsed")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {latestAnalysis ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">{t("dashboard.candidate")}</p>
                  <p className="font-medium">{latestAnalysis.profile.name ?? t("dashboard.unknown")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("landing.experience")}</p>
                  <p className="font-mono text-2xl font-semibold">
                    {latestAnalysis.profile.yearsOfExperience ?? 0}y
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">{t("dashboard.technologies")}</p>
                  <div className="flex flex-wrap gap-2">
                    {latestAnalysis.profile.technologies.slice(0, 8).map((technology) => (
                      <Badge key={technology} variant="outline">
                        {technology}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.atsScore")}</CardTitle>
            <CardDescription>{t("dashboard.openAiPowered")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestAnalysis ? (
              Object.entries(latestAnalysis.score).map(([label, value]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="capitalize">{label.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-mono text-muted-foreground">{value}%</span>
                  </div>
                  <Progress value={value} />
                </div>
              ))
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>

        <Card id="history">
          <CardHeader>
            <CardTitle>{t("dashboard.analysisHistory")}</CardTitle>
            <CardDescription>{analyses.length > 0 ? t("dashboard.latestDrafts") : t("dashboard.noAnalysesYet")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyses.length > 0 ? (
              analyses.slice(0, 5).map((analysis) => (
                <div key={analysis.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{analysis.jobTitle ?? t("dashboard.untitledRole")}</p>
                      <p className="text-sm text-muted-foreground">
                        {analysis.resumeFileName ?? t("dashboard.pastedCv")} - {analysis.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Button asChild size="icon" variant="ghost" aria-label={t("dashboard.openAnalysis")}>
                      <Link href={`/dashboard/analyses/${analysis.id}`}>
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}

function EmptyState() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 p-6 text-center">
      <Database className="size-7 text-muted-foreground" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium">{t("empty.title")}</p>
      <p className="mt-1 text-xs text-muted-foreground">{t("empty.description")}</p>
    </div>
  );
}
