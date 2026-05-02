import { Prisma, type PrismaClient } from "@/generated/prisma/client";
import type { CreateAnalysisInput } from "../application/resume-analysis.schema";
import type { ResumeAnalysisRepository } from "../application/resume-analysis.service";
import type {
  AtsScoreBreakdown,
  KeywordAnalysis,
  OptimizedResume,
  ResumeProfile,
  AiSuggestion,
} from "../domain/resume-analysis.types";

export class PrismaResumeAnalysisRepository implements ResumeAnalysisRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listByUser(userId: string) {
    const analyses = await this.prisma.resumeAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return analyses.map((analysis) => ({
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
    }));
  }

  async create(userId: string, input: CreateAnalysisInput) {
    const analysis = await this.prisma.resumeAnalysis.create({
      data: {
        userId,
        jobTitle: input.jobTitle,
        resumeFileName: input.resumeFileName,
        resumeMimeType: input.resumeMimeType,
        resumeText: input.resumeText,
        jobDescription: input.jobDescription,
        score: {
          overall: 0,
          skillsMatch: 0,
          format: 0,
          keywords: 0,
          experience: 0,
        },
        keywords: {
          found: [],
          missing: [],
          important: [],
        },
        profile: {
          name: null,
          skills: [],
          experience: [],
          education: [],
          technologies: [],
          yearsOfExperience: null,
        },
        suggestions: [],
        insights: [],
        optimizedResume: Prisma.JsonNull,
      },
    });

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
}
