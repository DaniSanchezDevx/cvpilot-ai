import { optimizeResumeAction } from "../application/optimize-resume.action";
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

export function AnalysisDetail({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6 xl:grid-cols-[1fr_380px]">
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <Badge variant={analysis.status === "COMPLETED" ? "default" : "secondary"}>{analysis.status}</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{analysis.jobTitle ?? "Untitled analysis"}</h1>
            <p className="mt-2 text-muted-foreground">{analysis.resumeFileName ?? "Pasted resume"}</p>
          </div>
          <form action={optimizeResumeAction}>
            <input type="hidden" name="analysisId" value={analysis.id} />
            <Button>Generate Optimized CV</Button>
          </form>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI suggestions</CardTitle>
            <CardDescription>Concrete edits to increase relevance and interview strength.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.suggestions.map((suggestion) => (
              <div key={`${suggestion.category}-${suggestion.before}`} className="rounded-lg border p-4">
                <Badge variant="outline">{suggestion.category}</Badge>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Before</p>
                    <p className="mt-2 text-sm">{suggestion.before}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">After</p>
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
            <CardTitle>Optimized CV</CardTitle>
            <CardDescription>Generated version ready to refine and export.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysis.optimizedResume ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Professional summary</p>
                  <p className="mt-2 leading-7">{analysis.optimizedResume.professionalSummary}</p>
                </div>
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">Experience bullets</p>
                  <ul className="space-y-3">
                    {analysis.optimizedResume.experienceBullets.map((bullet) => (
                      <li key={bullet} className="rounded-md border bg-muted/20 p-3 text-sm">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">Skills</p>
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
              <p className="text-sm text-muted-foreground">No optimized CV has been generated yet.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>ATS score</CardTitle>
            <CardDescription>Total {analysis.score.overall}/100</CardDescription>
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
            <CardTitle>Keywords</CardTitle>
            <CardDescription>Found and missing terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <KeywordGroup title="Found" values={analysis.keywords.found} />
            <KeywordGroup title="Missing" values={analysis.keywords.missing} />
            <KeywordGroup title="Important" values={analysis.keywords.important} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview focus</CardTitle>
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
