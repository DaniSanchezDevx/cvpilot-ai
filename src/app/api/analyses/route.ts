import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createResumeAnalysisFromFormData } from "@/features/resume-analysis/application/create-resume-analysis";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { message: "You need to sign in before creating an analysis." },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const analysis = await createResumeAnalysisFromFormData(user, formData);

    return NextResponse.json({
      id: analysis.id,
      message:
        analysis.source === "openai"
          ? "AI analysis completed and saved."
          : "CV parsed with local heuristics. Add OPENAI_API_KEY for full AI analysis.",
    });
  } catch (error) {
    console.error("[CVPilot] POST /api/analyses failed", error);
    return NextResponse.json(
      { message: formatAnalysisError(error) },
      { status: 400 },
    );
  }
}

function formatAnalysisError(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues.map((issue) => issue.message).join(" ");
  }

  return error instanceof Error ? error.message : "Could not create the analysis.";
}
