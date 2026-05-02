export type AtsScoreBreakdown = {
  overall: number;
  skillsMatch: number;
  format: number;
  keywords: number;
  experience: number;
};

export type KeywordAnalysis = {
  found: string[];
  missing: string[];
  important: string[];
};

export type ResumeProfile = {
  name: string | null;
  skills: string[];
  experience: string[];
  education: string[];
  technologies: string[];
  yearsOfExperience: number | null;
};

export type AiSuggestion = {
  category: "summary" | "experience" | "skills" | "format" | "keywords";
  before: string;
  after: string;
  reason: string;
};

export type OptimizedResume = {
  professionalSummary: string;
  experienceBullets: string[];
  skills: string[];
  interviewFocus: string[];
};

export type ResumeAnalysis = {
  id: string;
  userId: string;
  jobTitle: string | null;
  resumeFileName: string | null;
  resumeMimeType: string | null;
  score: AtsScoreBreakdown;
  keywords: KeywordAnalysis;
  profile: ResumeProfile;
  suggestions: AiSuggestion[];
  insights: string[];
  optimizedResume: OptimizedResume | null;
  status: "DRAFT" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: Date;
};
