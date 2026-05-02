import OpenAI from "openai";
import { env } from "@/lib/env/server";

let openai: OpenAI | null = null;

export function getOpenAIClient() {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required to call AI services.");
  }

  openai ??= new OpenAI({ apiKey: env.OPENAI_API_KEY });
  return openai;
}

