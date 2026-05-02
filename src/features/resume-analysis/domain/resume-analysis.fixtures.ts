import type { ResumeAnalysis } from "./resume-analysis.types";

export const demoResumeAnalyses: ResumeAnalysis[] = [
  {
    id: "demo-1",
    userId: "demo-user",
    jobTitle: "Senior Frontend Engineer",
    resumeFileName: "daniel-sanchez-cv.pdf",
    resumeMimeType: "application/pdf",
    score: {
      overall: 82,
      skillsMatch: 88,
      format: 74,
      keywords: 79,
      experience: 86,
    },
    keywords: {
      found: ["React", "TypeScript", "APIs", "A/B testing"],
      missing: ["Next.js App Router", "accessibility", "observability"],
      important: ["performance", "design systems", "experimentation"],
    },
    profile: {
      name: "Daniel Sanchez",
      skills: ["React", "TypeScript", "TailwindCSS", "Node.js"],
      experience: ["Frontend platforms", "Product dashboards", "API integrations"],
      education: ["Computer Science"],
      technologies: ["Next.js", "Prisma", "PostgreSQL", "Vercel"],
      yearsOfExperience: 4,
    },
    suggestions: [
      {
        category: "experience",
        before: "Worked on APIs",
        after: "Developed RESTful APIs improving response time and reliability for customer-facing workflows.",
        reason: "Adds scope, action verb, and business impact.",
      },
      {
        category: "keywords",
        before: "Frontend development",
        after: "Frontend development with Next.js App Router, accessibility, and observability practices.",
        reason: "Aligns the CV with high-value terms from the target role.",
      },
    ],
    insights: [
      "Strong React and TypeScript fit for the target role.",
      "Add explicit accessibility and observability examples.",
      "Quantify performance improvements where possible.",
    ],
    optimizedResume: {
      professionalSummary:
        "Frontend engineer focused on React, TypeScript, product dashboards, and measurable user experience improvements.",
      experienceBullets: [
        "Built typed React interfaces for product dashboards used across internal operations.",
        "Integrated REST APIs and improved frontend reliability through stronger state and error handling.",
      ],
      skills: ["React", "TypeScript", "Next.js", "PostgreSQL", "Prisma", "Vercel"],
      interviewFocus: ["Performance", "Design systems", "API integration", "Accessibility"],
    },
    status: "DRAFT",
    createdAt: new Date("2026-05-01T10:00:00.000Z"),
  },
];
