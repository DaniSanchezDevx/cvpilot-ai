import { z } from "zod";
import type {
  AiSuggestion,
  AtsScoreBreakdown,
  KeywordAnalysis,
  OptimizedResume,
  ResumeProfile,
} from "../domain/resume-analysis.types";
import {
  analyzeKeywords,
  createDraftScore,
  createHeuristicOptimizedResume,
  createHeuristicSuggestions,
  extractResumeProfile,
} from "./resume-parser";
import { getOpenAIClient } from "@/lib/ai/openai";
import { env } from "@/lib/env/server";

const aiSuggestionSchema = z.object({
  category: z.enum(["summary", "experience", "skills", "format", "keywords"]),
  before: z.string(),
  after: z.string(),
  reason: z.string(),
});

const optimizedResumeSchema = z.object({
  professionalSummary: z.string(),
  experienceBullets: z.array(z.string()).min(3).max(8),
  skills: z.array(z.string()).min(4).max(24),
  interviewFocus: z.array(z.string()).min(3).max(10),
});

const aiResumeAnalysisSchema = z.object({
  score: z.object({
    overall: z.number().int().min(0).max(100),
    skillsMatch: z.number().int().min(0).max(100),
    format: z.number().int().min(0).max(100),
    keywords: z.number().int().min(0).max(100),
    experience: z.number().int().min(0).max(100),
  }),
  keywords: z.object({
    found: z.array(z.string()).max(30),
    missing: z.array(z.string()).max(30),
    important: z.array(z.string()).max(30),
  }),
  profile: z.object({
    name: z.string().nullable(),
    skills: z.array(z.string()).max(40),
    experience: z.array(z.string()).max(12),
    education: z.array(z.string()).max(8),
    technologies: z.array(z.string()).max(30),
    yearsOfExperience: z.number().int().min(0).max(50).nullable(),
  }),
  suggestions: z.array(aiSuggestionSchema).min(3).max(8),
  optimizedResume: optimizedResumeSchema,
  insights: z.array(z.string()).min(3).max(8),
});

export type AiResumeAnalysisResult = {
  score: AtsScoreBreakdown;
  keywords: KeywordAnalysis;
  profile: ResumeProfile;
  suggestions: AiSuggestion[];
  optimizedResume: OptimizedResume;
  insights: string[];
  source: "openai" | "heuristic";
};

export async function generateResumeAnalysis(input: {
  resumeText: string;
  jobDescription: string;
  jobTitle?: string;
  locale?: "en" | "es";
}): Promise<AiResumeAnalysisResult> {
  const locale = input.locale ?? "en";
  const fallback = createFallbackAnalysis(input.resumeText, input.jobDescription, locale);

  if (!env.OPENAI_API_KEY) {
    return fallback;
  }

  try {
    const response = await getOpenAIClient().responses.create({
      model: env.OPENAI_MODEL,
      instructions: [
        "You are CVPilot AI, an expert ATS resume analyst and career coach.",
        "Analyze the resume against the job description. Be practical, specific, and honest.",
        "Do not invent credentials, employers, education, certifications, or exact metrics.",
        "When suggesting metrics, phrase them as measurable placeholders only if the resume lacks data.",
        locale === "es"
          ? "Write all user-facing text in Spanish. Keep technical keywords such as React, Next.js, Docker, API, ATS, PostgreSQL, and TypeScript unchanged."
          : "Write all user-facing text in English.",
        "Return only data that fits the JSON schema.",
      ].join(" "),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Target role: ${input.jobTitle || "Not specified"}\n\nResume:\n${truncate(input.resumeText, 18000)}\n\nJob description:\n${truncate(input.jobDescription, 12000)}`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "cvpilot_resume_analysis",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["score", "keywords", "profile", "suggestions", "optimizedResume", "insights"],
            properties: {
              score: {
                type: "object",
                additionalProperties: false,
                required: ["overall", "skillsMatch", "format", "keywords", "experience"],
                properties: scoreProperties(),
              },
              keywords: {
                type: "object",
                additionalProperties: false,
                required: ["found", "missing", "important"],
                properties: {
                  found: stringArraySchema(),
                  missing: stringArraySchema(),
                  important: stringArraySchema(),
                },
              },
              profile: {
                type: "object",
                additionalProperties: false,
                required: ["name", "skills", "experience", "education", "technologies", "yearsOfExperience"],
                properties: {
                  name: { type: ["string", "null"] },
                  skills: stringArraySchema(),
                  experience: stringArraySchema(),
                  education: stringArraySchema(),
                  technologies: stringArraySchema(),
                  yearsOfExperience: { type: ["integer", "null"], minimum: 0, maximum: 50 },
                },
              },
              suggestions: {
                type: "array",
                minItems: 3,
                maxItems: 8,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["category", "before", "after", "reason"],
                  properties: {
                    category: { type: "string", enum: ["summary", "experience", "skills", "format", "keywords"] },
                    before: { type: "string" },
                    after: { type: "string" },
                    reason: { type: "string" },
                  },
                },
              },
              optimizedResume: {
                type: "object",
                additionalProperties: false,
                required: ["professionalSummary", "experienceBullets", "skills", "interviewFocus"],
                properties: {
                  professionalSummary: { type: "string" },
                  experienceBullets: stringArraySchema(),
                  skills: stringArraySchema(),
                  interviewFocus: stringArraySchema(),
                },
              },
              insights: stringArraySchema(),
            },
          },
        },
      },
    });

    const parsed = aiResumeAnalysisSchema.parse(JSON.parse(response.output_text));
    return { ...parsed, source: "openai" };
  } catch (error) {
    console.error("OpenAI analysis failed, falling back to heuristic analysis", error);
    return fallback;
  }
}

function createFallbackAnalysis(
  resumeText: string,
  jobDescription: string,
  locale: "en" | "es",
): AiResumeAnalysisResult {
  const profile = extractResumeProfile(resumeText);
  const keywords = analyzeKeywords(resumeText, jobDescription);
  const score = createDraftScore(profile, keywords);

  return {
    score,
    keywords,
    profile,
    suggestions: createHeuristicSuggestions(profile, keywords, locale),
    optimizedResume: createHeuristicOptimizedResume(profile, keywords, locale),
    insights:
      locale === "es"
        ? [
            "OpenAI no esta configurado, asi que este analisis usa heuristicas locales deterministas.",
            "Incluye las keywords faltantes de forma natural dentro de bullets de logros.",
            "Prioriza resultados medibles por encima de frases centradas solo en responsabilidades.",
          ]
        : [
            "OpenAI is not configured, so this analysis uses deterministic local heuristics.",
            "Add missing keywords naturally inside achievement bullets.",
            "Prioritize measurable outcomes over responsibility-only wording.",
          ],
    source: "heuristic",
  };
}

function scoreProperties() {
  return {
    overall: { type: "integer", minimum: 0, maximum: 100 },
    skillsMatch: { type: "integer", minimum: 0, maximum: 100 },
    format: { type: "integer", minimum: 0, maximum: 100 },
    keywords: { type: "integer", minimum: 0, maximum: 100 },
    experience: { type: "integer", minimum: 0, maximum: 100 },
  };
}

function stringArraySchema() {
  return {
    type: "array",
    items: { type: "string" },
  };
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}\n[truncated]` : value;
}
