import type { CreateAnalysisInput } from "./resume-analysis.schema";
import type { ResumeAnalysis } from "../domain/resume-analysis.types";

export interface ResumeAnalysisRepository {
  listByUser(userId: string): Promise<ResumeAnalysis[]>;
  create(userId: string, input: CreateAnalysisInput): Promise<ResumeAnalysis>;
}

export class ResumeAnalysisService {
  constructor(private readonly repository: ResumeAnalysisRepository) {}

  listHistory(userId: string) {
    return this.repository.listByUser(userId);
  }

  createAnalysis(userId: string, input: CreateAnalysisInput) {
    return this.repository.create(userId, input);
  }
}

