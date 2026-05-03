"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResumeAnalysis } from "../domain/resume-analysis.types";
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
import { useLanguage } from "@/lib/i18n/language-provider";

export function AnalysisHistoryTable({ rows }: { rows: ResumeAnalysis[] }) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("history.title")}</CardTitle>
        <CardDescription>{t("history.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("common.role")}</TableHead>
              <TableHead>{t("common.score")}</TableHead>
              <TableHead>{t("common.status")}</TableHead>
              <TableHead>{t("common.created")}</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((analysis) => (
              <TableRow key={analysis.id}>
                <TableCell>
                  <p className="font-medium">{analysis.jobTitle ?? t("dashboard.untitledRole")}</p>
                  <p className="text-sm text-muted-foreground">
                    {analysis.resumeFileName ?? t("detail.pastedResume")}
                  </p>
                </TableCell>
                <TableCell className="font-mono">{analysis.score.overall}/100</TableCell>
                <TableCell>
                  <Badge variant={analysis.status === "COMPLETED" ? "default" : "secondary"}>
                    {analysis.status}
                  </Badge>
                </TableCell>
                <TableCell>{analysis.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button asChild size="icon" variant="ghost" aria-label={t("dashboard.openAnalysis")}>
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
  );
}
