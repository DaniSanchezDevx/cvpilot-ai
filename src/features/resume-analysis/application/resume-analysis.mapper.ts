import type {
  AiSuggestion,
  AtsScoreBreakdown,
  KeywordAnalysis,
  OptimizedResume,
  ResumeAnalysis,
  ResumeProfile,
} from "../domain/resume-analysis.types";

export type PersistedResumeAnalysis = {
  id: string;
  userId: string;
  jobTitle: string | null;
  resumeFileName: string | null;
  resumeMimeType: string | null;
  score: unknown;
  keywords: unknown;
  profile: unknown;
  suggestions: unknown;
  insights: unknown;
  optimizedResume: unknown;
  status: ResumeAnalysis["status"];
  createdAt: Date;
};

export function mapPersistedResumeAnalysis(analysis: PersistedResumeAnalysis): ResumeAnalysis {
  return {
    id: analysis.id,
    userId: analysis.userId,
    jobTitle: analysis.jobTitle,
    resumeFileName: analysis.resumeFileName,
    resumeMimeType: analysis.resumeMimeType,
    score: analysis.score as AtsScoreBreakdown,
    keywords: analysis.keywords as KeywordAnalysis,
    profile: analysis.profile as ResumeProfile,
    suggestions: analysis.suggestions as AiSuggestion[],
    insights: analysis.insights as string[],
    optimizedResume: analysis.optimizedResume as OptimizedResume | null,
    status: analysis.status,
    createdAt: analysis.createdAt,
  };
}

