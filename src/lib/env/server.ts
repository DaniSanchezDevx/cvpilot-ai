import { z } from "zod";

const optionalSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const serverEnvSchema = z.object({
  DATABASE_URL: z.preprocess((value) => (value === "" ? undefined : value), z.string().url().optional()),
  OPENAI_API_KEY: optionalSecret,
  OPENAI_MODEL: z.string().min(1).default("gpt-4.1-mini"),
  CLERK_SECRET_KEY: optionalSecret,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: optionalSecret,
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export const env = serverEnvSchema.parse(process.env);
