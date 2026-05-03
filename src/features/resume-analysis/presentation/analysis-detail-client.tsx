"use client";

import type { ResumeAnalysis } from "../domain/resume-analysis.types";
import { ScoreChart } from "./score-chart";
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

export function AnalysisDetailClient({
  analysis,
  optimizeAction,
}: {
  analysis: ResumeAnalysis;
  optimizeAction: (formData: FormData) => Promise<void>;
}) {
  const { locale, t } = useLanguage();

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6 xl:grid-cols-[1fr_380px]">
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <Badge variant={analysis.status === "COMPLETED" ? "default" : "secondary"}>{analysis.status}</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{analysis.jobTitle ?? t("detail.untitled")}</h1>
            <p className="mt-2 text-muted-foreground">{analysis.resumeFileName ?? t("detail.pastedResume")}</p>
          </div>
          <form action={optimizeAction}>
            <input type="hidden" name="analysisId" value={analysis.id} />
            <input type="hidden" name="locale" value={locale} />
            <Button>{t("detail.generate")}</Button>
          </form>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("detail.suggestions")}</CardTitle>
            <CardDescription>{t("detail.suggestionsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.suggestions.map((suggestion) => (
              <div key={`${suggestion.category}-${suggestion.before}`} className="rounded-lg border p-4">
                <Badge variant="outline">{suggestion.category}</Badge>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">{t("common.before")}</p>
                    <p className="mt-2 text-sm">{suggestion.before}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">{t("common.after")}</p>
                    <p className="mt-2 text-sm font-medium">{suggestion.after}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("detail.optimizedCv")}</CardTitle>
            <CardDescription>{t("detail.optimizedDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysis.optimizedResume ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">{t("detail.summary")}</p>
                  <p className="mt-2 leading-7">{analysis.optimizedResume.professionalSummary}</p>
                </div>
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">{t("detail.bullets")}</p>
                  <ul className="space-y-3">
                    {analysis.optimizedResume.experienceBullets.map((bullet) => (
                      <li key={bullet} className="rounded-md border bg-muted/20 p-3 text-sm">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">{t("common.skills")}</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.optimizedResume.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{t("detail.noOptimized")}</p>
            )}
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.atsScore")}</CardTitle>
            <CardDescription>{t("common.total")} {analysis.score.overall}/100</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreChart score={analysis.score} />
            {Object.entries(analysis.score).map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="capitalize">{label.replace(/([A-Z])/g, " $1")}</span>
                  <span className="font-mono text-muted-foreground">{value}%</span>
                </div>
                <Progress value={value} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("landing.keywords")}</CardTitle>
            <CardDescription>{t("detail.keywordsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <KeywordGroup title={t("detail.found")} values={analysis.keywords.found} />
            <KeywordGroup title={t("detail.missing")} values={analysis.keywords.missing} />
            <KeywordGroup title={t("detail.important")} values={analysis.keywords.important} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("detail.interviewFocus")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(analysis.optimizedResume?.interviewFocus ?? analysis.insights).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}

function KeywordGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">
        {values.slice(0, 12).map((value) => (
          <Badge key={value} variant="outline">
            {value}
          </Badge>
        ))}
      </div>
    </div>
  );
}
