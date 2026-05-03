import type {
  AiSuggestion,
  AtsScoreBreakdown,
  KeywordAnalysis,
  OptimizedResume,
  ResumeProfile,
} from "../domain/resume-analysis.types";

const skillDictionary = [
  "accessibility",
  "analytics",
  "api",
  "aws",
  "azure",
  "ci/cd",
  "css",
  "docker",
  "figma",
  "git",
  "graphql",
  "javascript",
  "jest",
  "kubernetes",
  "next.js",
  "node.js",
  "postgresql",
  "prisma",
  "python",
  "react",
  "rest",
  "sql",
  "tailwind",
  "testing",
  "typescript",
  "vercel",
] as const;

const sectionHeadings = [
  "experience",
  "work experience",
  "professional experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "summary",
] as const;

export function normalizeResumeText(text: string) {
  return text.replace(/\r/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function extractResumeProfile(resumeText: string): ResumeProfile {
  const normalized = normalizeResumeText(resumeText);
  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const firstMeaningfulLine = lines.find((line) => {
    const lower = line.toLowerCase();
    return !lower.includes("@") && !lower.includes("http") && line.length <= 80;
  });

  const lowerText = normalized.toLowerCase();
  const skills = skillDictionary.filter((skill) => lowerText.includes(skill));
  const technologies = skills.filter((skill) =>
    ["react", "next.js", "typescript", "javascript", "node.js", "postgresql", "prisma", "docker", "vercel"].includes(skill),
  );

  return {
    name: firstMeaningfulLine ?? null,
    skills: titleCaseList(skills),
    experience: extractSectionLines(lines, ["experience", "work experience", "professional experience"]),
    education: extractSectionLines(lines, ["education"]),
    technologies: titleCaseList(technologies),
    yearsOfExperience: inferYearsOfExperience(normalized),
  };
}

export function analyzeKeywords(resumeText: string, jobDescription: string): KeywordAnalysis {
  const resumeWords = toKeywords(resumeText);
  const jobWords = toKeywords(jobDescription);
  const important = Array.from(jobWords).slice(0, 18);
  const found = important.filter((word) => resumeWords.has(word));
  const missing = important.filter((word) => !resumeWords.has(word));

  return {
    found,
    missing,
    important,
  };
}

export function createDraftScore(profile: ResumeProfile, keywords: KeywordAnalysis): AtsScoreBreakdown {
  const keywordScore = percentage(keywords.found.length, Math.max(keywords.important.length, 1));
  const skillsScore = Math.min(100, profile.skills.length * 10);
  const experienceScore = profile.yearsOfExperience ? Math.min(100, 45 + profile.yearsOfExperience * 8) : 35;
  const formatScore = profile.education.length > 0 && profile.experience.length > 0 ? 72 : 48;
  const overall = Math.round((keywordScore + skillsScore + experienceScore + formatScore) / 4);

  return {
    overall,
    skillsMatch: skillsScore,
    format: formatScore,
    keywords: keywordScore,
    experience: experienceScore,
  };
}

export function createHeuristicSuggestions(
  profile: ResumeProfile,
  keywords: KeywordAnalysis,
  locale: "en" | "es" = "en",
): AiSuggestion[] {
  const primarySkill = profile.skills[0] ?? "core technical skills";
  const missingKeyword = keywords.missing[0] ?? "role-specific keywords";

  if (locale === "es") {
    return [
      {
        category: "experience",
        before: "Trabaje en proyectos y APIs",
        after: `Desarrolle proyectos con ${primarySkill} aportando mayor ownership, resultados medibles y detalles de implementacion listos para produccion.`,
        reason: "Sustituye una responsabilidad vaga por alcance, accion e impacto.",
      },
      {
        category: "keywords",
        before: "Seccion de skills generica",
        after: `Incluye evidencias de ${missingKeyword} mediante un proyecto concreto, una herramienta o un resultado de negocio.`,
        reason: "Las keywords faltantes deben aparecer de forma natural en bullets de experiencia, no solo en una lista de skills.",
      },
      {
        category: "summary",
        before: "Resumen profesional sin alineacion con el rol objetivo",
        after: `Orienta el resumen hacia ${profile.technologies.slice(0, 3).join(", ") || "tecnologias relevantes"} y resultados medibles del rol objetivo.`,
        reason: "Los recruiters revisan primero el resumen para validar encaje, seniority y especializacion.",
      },
    ];
  }

  return [
    {
      category: "experience",
      before: "Worked on projects and APIs",
      after: `Delivered ${primarySkill} projects with clearer ownership, measurable outcomes, and production-ready implementation details.`,
      reason: "Replaces vague responsibility with scope, action, and outcome.",
    },
    {
      category: "keywords",
      before: "Generic skills section",
      after: `Add evidence for ${missingKeyword} using a specific project, tool, or business result.`,
      reason: "Missing role keywords should appear naturally in experience bullets, not only in a skills list.",
    },
    {
      category: "summary",
      before: "Professional summary without target role alignment",
      after: `Position the summary around ${profile.technologies.slice(0, 3).join(", ") || "relevant technologies"} and the target role's measurable outcomes.`,
      reason: "Recruiters scan the summary first for fit, level, and specialization.",
    },
  ];
}

export function createHeuristicOptimizedResume(
  profile: ResumeProfile,
  keywords: KeywordAnalysis,
  locale: "en" | "es" = "en",
): OptimizedResume {
  const skills = Array.from(new Set([...profile.skills, ...keywords.important.slice(0, 8).map(capitalize)]));

  if (locale === "es") {
    return {
      professionalSummary: `${profile.name ?? "Candidato"} es un perfil orientado a resultados con experiencia en ${skills.slice(0, 4).join(", ") || "los requisitos del rol"}. Enfocado en convertir necesidades de negocio en soluciones fiables, medibles y listas para produccion.`,
      experienceBullets: [
        `Mejore la calidad de entrega aplicando ${skills.slice(0, 3).join(", ") || "habilidades tecnicas relevantes"} en flujos de trabajo reales.`,
        "Colabore con equipos multidisciplinares para transformar requisitos ambiguos en hitos claros de implementacion.",
        "Refuerza la alineacion del CV destacando impacto medible, ownership y keywords especificas del puesto.",
      ],
      skills: skills.slice(0, 16),
      interviewFocus: keywords.important.slice(0, 6).map(capitalize),
    };
  }

  return {
    professionalSummary: `${profile.name ?? "Candidate"} is a results-oriented professional with experience across ${skills.slice(0, 4).join(", ") || "target role requirements"}. Focused on translating business needs into reliable, measurable delivery.`,
    experienceBullets: [
      `Improved delivery quality by applying ${skills.slice(0, 3).join(", ") || "relevant technical skills"} to production workflows.`,
      "Collaborated with cross-functional stakeholders to convert ambiguous requirements into clear implementation milestones.",
      "Strengthened resume alignment by emphasizing measurable impact, ownership, and job-specific keywords.",
    ],
    skills: skills.slice(0, 16),
    interviewFocus: keywords.important.slice(0, 6).map(capitalize),
  };
}

function extractSectionLines(lines: string[], headings: readonly string[]) {
  const startIndex = lines.findIndex((line) => headings.includes(line.toLowerCase() as never));
  if (startIndex === -1) {
    return [];
  }

  const content: string[] = [];
  for (const line of lines.slice(startIndex + 1)) {
    const lower = line.toLowerCase();
    if (sectionHeadings.includes(lower as never)) {
      break;
    }

    if (line.length > 8) {
      content.push(line);
    }

    if (content.length === 5) {
      break;
    }
  }

  return content;
}

function inferYearsOfExperience(text: string) {
  const matches = Array.from(text.matchAll(/(\d{1,2})\+?\s+(?:years|yrs|anos|años)/gi));
  const values = matches.map((match) => Number(match[1])).filter(Number.isFinite);
  if (values.length > 0) {
    return Math.max(...values);
  }

  const years = Array.from(text.matchAll(/\b(20\d{2}|19\d{2})\b/g)).map((match) => Number(match[1]));
  if (years.length >= 2) {
    const min = Math.min(...years);
    const max = Math.max(...years, new Date().getFullYear());
    return Math.min(30, Math.max(0, max - min));
  }

  return null;
}

function toKeywords(text: string) {
  const stopWords = new Set([
    "and",
    "con",
    "de",
    "del",
    "el",
    "en",
    "for",
    "la",
    "las",
    "los",
    "the",
    "to",
    "with",
    "y",
  ]);

  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9+#. ]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 3 && !stopWords.has(word)),
  );
}

function percentage(value: number, total: number) {
  return Math.round((value / total) * 100);
}

function titleCaseList(values: readonly string[]) {
  return values.map((value) =>
    value
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
