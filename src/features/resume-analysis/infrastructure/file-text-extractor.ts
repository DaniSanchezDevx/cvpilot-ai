import { createRequire } from "node:module";
import { normalizeResumeText } from "../application/resume-parser";

const require = createRequire(import.meta.url);
type PdfParse = (buffer: Buffer) => Promise<{ text: string }>;

const supportedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

export async function extractTextFromResumeFile(file: File) {
  if (!supportedMimeTypes.has(file.type)) {
    throw new Error("Unsupported file type. Upload a PDF, DOCX, or TXT file.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File is too large. Maximum size is 5MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (file.type === "application/pdf") {
    return extractTextFromPdf(buffer);
  }

  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return normalizeResumeText(result.value);
  }

  return normalizeResumeText(buffer.toString("utf8"));
}

async function extractTextFromPdf(buffer: Buffer) {
  const pdfParse = require("pdf-parse/lib/pdf-parse.js") as PdfParse;
  const result = await pdfParse(buffer);
  const normalized = normalizeResumeText(result.text);
  if (!normalized) {
    throw new Error("This PDF does not contain selectable text. Try a text-based PDF, DOCX, or paste the CV text.");
  }

  return normalized;
}
