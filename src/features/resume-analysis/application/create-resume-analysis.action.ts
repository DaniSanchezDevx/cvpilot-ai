"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { createResumeAnalysisFromFormData } from "./create-resume-analysis";

export type CreateResumeAnalysisState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createResumeAnalysisAction(
  _previousState: CreateResumeAnalysisState,
  formData: FormData,
): Promise<CreateResumeAnalysisState> {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        status: "error",
        message: "You need to sign in before creating an analysis.",
      };
    }

    const analysis = await createResumeAnalysisFromFormData(user, formData);

    revalidatePath("/dashboard");

    return {
      status: "success",
      message:
        analysis.source === "openai"
          ? "AI analysis completed and saved."
          : "CV parsed with local heuristics. Add OPENAI_API_KEY for full AI analysis.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof ZodError
          ? error.issues.map((issue) => issue.message).join(" ")
          : error instanceof Error
            ? error.message
            : "Could not create the analysis.",
    };
  }
}
