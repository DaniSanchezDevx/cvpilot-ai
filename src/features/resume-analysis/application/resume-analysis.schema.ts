import { z } from "zod";

export const createAnalysisInputSchema = z.object({
  resumeText: z.string().min(120, "Resume text is too short to analyze."),
  jobDescription: z.string().min(80, "Job description is too short."),
  jobTitle: z.string().max(120).optional(),
  resumeFileName: z.string().max(255).optional(),
  resumeMimeType: z.string().max(120).optional(),
});

export type CreateAnalysisInput = z.infer<typeof createAnalysisInputSchema>;
