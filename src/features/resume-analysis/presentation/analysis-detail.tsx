import { optimizeResumeAction } from "../application/optimize-resume.action";
import type { ResumeAnalysis } from "../domain/resume-analysis.types";
import { AnalysisDetailClient } from "./analysis-detail-client";

export function AnalysisDetail({ analysis }: { analysis: ResumeAnalysis }) {
  return <AnalysisDetailClient analysis={analysis} optimizeAction={optimizeResumeAction} />;
}
