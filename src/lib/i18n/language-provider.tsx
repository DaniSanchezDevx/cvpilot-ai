"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Locale = "en" | "es";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey) => string;
};

const STORAGE_KEY = "cvpilot-locale";

const translations = {
  en: {
    "common.dashboard": "Dashboard",
    "common.login": "Login",
    "common.startFree": "Start free",
    "common.features": "Features",
    "common.pricing": "Pricing",
    "common.choose": "Choose",
    "common.remove": "Remove",
    "common.profile": "Profile",
    "common.history": "History",
    "common.analyze": "Analyze",
    "common.before": "Before",
    "common.after": "After",
    "common.skills": "Skills",
    "common.status": "Status",
    "common.score": "Score",
    "common.created": "Created",
    "common.role": "Role",
    "common.email": "Email",
    "common.name": "Name",
    "common.total": "Total",
    "language.label": "ES",
    "language.aria": "Translate page to Spanish",
    "landing.nav.dashboard": "Dashboard",
    "landing.badge": "AI resume optimization for serious applications",
    "landing.description":
      "Upload your CV, paste a job description, and get an ATS score, missing keywords, sharper bullets, and an interview-ready optimized version.",
    "landing.primaryCta": "Analyze a CV",
    "landing.secondaryCta": "View capabilities",
    "landing.analysisTitle": "ATS analysis",
    "landing.sampleRole": "Senior Product Engineer",
    "landing.skillsMatch": "Skills match",
    "landing.keywords": "Keywords",
    "landing.experience": "Experience",
    "landing.format": "Format",
    "landing.missing": "Missing",
    "landing.modules": "MVP modules",
    "landing.saasTitle": "Built like a SaaS product",
    "landing.feature.ats.title": "ATS compatibility",
    "landing.feature.ats.description":
      "Score CVs against a real job description with category-level diagnostics.",
    "landing.feature.keywords.title": "Keyword intelligence",
    "landing.feature.keywords.description":
      "Detect matched, missing, and high-value terms before the application is sent.",
    "landing.feature.rewrite.title": "AI rewrite assistant",
    "landing.feature.rewrite.description":
      "Turn vague bullets into outcome-driven achievements with stronger verbs.",
    "landing.feature.history.title": "Analysis history",
    "landing.feature.history.description":
      "Keep every optimization run organized by role, score, and next action.",
    "landing.plan.starterLimit": "3 analyses/month",
    "landing.plan.proLimit": "Unlimited analyses",
    "landing.plan.teamLimit": "Shared hiring workspace",
    "landing.plan.ats": "ATS score",
    "landing.plan.keyword": "Keyword analysis",
    "landing.plan.suggestions": "AI suggestions",
    "shell.subtitle": "Resume intelligence workspace",
    "dashboard.badge": "AI workspace",
    "dashboard.title": "Analyze and optimize your CV",
    "dashboard.description":
      "Upload PDF/DOCX, compare it with a job description, generate ATS insights, and save an optimized version.",
    "dashboard.savedAnalyses": "Saved analyses",
    "dashboard.averageScore": "Average ATS score",
    "dashboard.latestStatus": "Latest status",
    "dashboard.emptyStatus": "EMPTY",
    "dashboard.parsedProfile": "Parsed profile",
    "dashboard.noCvParsed": "No CV parsed yet",
    "dashboard.candidate": "Candidate",
    "dashboard.unknown": "Unknown",
    "dashboard.technologies": "Technologies",
    "dashboard.atsScore": "ATS score",
    "dashboard.openAiPowered": "OpenAI-powered when API key is configured",
    "dashboard.analysisHistory": "Analysis history",
    "dashboard.latestDrafts": "Latest parsed drafts",
    "dashboard.noAnalysesYet": "No analyses yet",
    "dashboard.untitledRole": "Untitled role",
    "dashboard.pastedCv": "Pasted CV",
    "dashboard.openAnalysis": "Open analysis",
    "empty.title": "Waiting for your first draft",
    "empty.description": "Upload a CV or paste resume text to populate this panel.",
    "form.title": "New CV analysis",
    "form.description":
      "Upload PDF/DOCX, paste the job description, and generate ATS insights.",
    "form.drop": "Drop PDF or DOCX",
    "form.fileHint": "5MB max. TXT is also supported for quick tests.",
    "form.selectFile": "Select file",
    "form.targetRole": "Target role",
    "form.targetRolePlaceholder": "Senior Frontend Engineer",
    "form.jobDescription": "Job description",
    "form.jobDescriptionPlaceholder": "Paste the job description here...",
    "form.fallback": "Fallback resume text",
    "form.fallbackPlaceholder": "Paste your CV text here if you want to test without a file.",
    "form.analyze": "Analyze CV",
    "form.analyzing": "Analyzing CV...",
    "form.error": "Could not create the analysis.",
    "form.success": "Analysis completed and saved.",
    "detail.untitled": "Untitled analysis",
    "detail.pastedResume": "Pasted resume",
    "detail.generate": "Generate Optimized CV",
    "detail.suggestions": "AI suggestions",
    "detail.suggestionsDescription": "Concrete edits to increase relevance and interview strength.",
    "detail.optimizedCv": "Optimized CV",
    "detail.optimizedDescription": "Generated version ready to refine and export.",
    "detail.summary": "Professional summary",
    "detail.bullets": "Experience bullets",
    "detail.noOptimized": "No optimized CV has been generated yet.",
    "detail.found": "Found",
    "detail.missing": "Missing",
    "detail.important": "Important",
    "detail.keywordsDescription": "Found and missing terms",
    "detail.interviewFocus": "Interview focus",
    "history.title": "Analysis history",
    "history.description": "Every CV and job-description comparison saved to your account.",
    "profile.description": "Your account and usage information.",
  },
  es: {
    "common.dashboard": "Panel",
    "common.login": "Iniciar sesion",
    "common.startFree": "Empezar gratis",
    "common.features": "Funciones",
    "common.pricing": "Precios",
    "common.choose": "Elegir",
    "common.remove": "Eliminar",
    "common.profile": "Perfil",
    "common.history": "Historial",
    "common.analyze": "Analizar",
    "common.before": "Antes",
    "common.after": "Despues",
    "common.skills": "Skills",
    "common.status": "Estado",
    "common.score": "Puntuacion",
    "common.created": "Creado",
    "common.role": "Rol",
    "common.email": "Email",
    "common.name": "Nombre",
    "common.total": "Total",
    "language.label": "EN",
    "language.aria": "Traducir pagina al ingles",
    "landing.nav.dashboard": "Panel",
    "landing.badge": "Optimizacion de CV con IA para candidaturas serias",
    "landing.description":
      "Sube tu CV, pega una descripcion de empleo y recibe puntuacion ATS, keywords faltantes, bullets mejorados y una version optimizada lista para entrevistas.",
    "landing.primaryCta": "Analizar un CV",
    "landing.secondaryCta": "Ver capacidades",
    "landing.analysisTitle": "Analisis ATS",
    "landing.sampleRole": "Senior Product Engineer",
    "landing.skillsMatch": "Coincidencia de skills",
    "landing.keywords": "Keywords",
    "landing.experience": "Experiencia",
    "landing.format": "Formato",
    "landing.missing": "Falta",
    "landing.modules": "Modulos MVP",
    "landing.saasTitle": "Construido como un producto SaaS",
    "landing.feature.ats.title": "Compatibilidad ATS",
    "landing.feature.ats.description":
      "Evalua CVs frente a una oferta real con diagnosticos por categoria.",
    "landing.feature.keywords.title": "Inteligencia de keywords",
    "landing.feature.keywords.description":
      "Detecta terminos encontrados, faltantes y de alto valor antes de enviar la candidatura.",
    "landing.feature.rewrite.title": "Asistente de reescritura con IA",
    "landing.feature.rewrite.description":
      "Convierte bullets vagos en logros orientados a impacto con verbos mas fuertes.",
    "landing.feature.history.title": "Historial de analisis",
    "landing.feature.history.description":
      "Mantiene cada optimizacion organizada por rol, puntuacion y siguiente accion.",
    "landing.plan.starterLimit": "3 analisis/mes",
    "landing.plan.proLimit": "Analisis ilimitados",
    "landing.plan.teamLimit": "Workspace compartido para equipos",
    "landing.plan.ats": "Puntuacion ATS",
    "landing.plan.keyword": "Analisis de keywords",
    "landing.plan.suggestions": "Sugerencias de IA",
    "shell.subtitle": "Workspace de inteligencia para CVs",
    "dashboard.badge": "Workspace IA",
    "dashboard.title": "Analiza y optimiza tu CV",
    "dashboard.description":
      "Sube PDF/DOCX, comparalo con una descripcion de empleo, genera insights ATS y guarda una version optimizada.",
    "dashboard.savedAnalyses": "Analisis guardados",
    "dashboard.averageScore": "Puntuacion ATS media",
    "dashboard.latestStatus": "Ultimo estado",
    "dashboard.emptyStatus": "VACIO",
    "dashboard.parsedProfile": "Perfil extraido",
    "dashboard.noCvParsed": "Aun no hay CV procesado",
    "dashboard.candidate": "Candidato",
    "dashboard.unknown": "Desconocido",
    "dashboard.technologies": "Tecnologias",
    "dashboard.atsScore": "Puntuacion ATS",
    "dashboard.openAiPowered": "Usa OpenAI cuando la API key esta configurada",
    "dashboard.analysisHistory": "Historial de analisis",
    "dashboard.latestDrafts": "Ultimos borradores procesados",
    "dashboard.noAnalysesYet": "Todavia no hay analisis",
    "dashboard.untitledRole": "Rol sin titulo",
    "dashboard.pastedCv": "CV pegado",
    "dashboard.openAnalysis": "Abrir analisis",
    "empty.title": "Esperando tu primer borrador",
    "empty.description": "Sube un CV o pega texto para completar este panel.",
    "form.title": "Nuevo analisis de CV",
    "form.description":
      "Sube PDF/DOCX, pega la descripcion del empleo y genera insights ATS.",
    "form.drop": "Suelta un PDF o DOCX",
    "form.fileHint": "Maximo 5MB. TXT tambien esta soportado para pruebas rapidas.",
    "form.selectFile": "Seleccionar archivo",
    "form.targetRole": "Rol objetivo",
    "form.targetRolePlaceholder": "Senior Frontend Engineer",
    "form.jobDescription": "Descripcion del empleo",
    "form.jobDescriptionPlaceholder": "Pega aqui la descripcion del empleo...",
    "form.fallback": "Texto del CV alternativo",
    "form.fallbackPlaceholder": "Pega aqui el texto de tu CV si quieres probar sin archivo.",
    "form.analyze": "Analizar CV",
    "form.analyzing": "Analizando CV...",
    "form.error": "No se pudo crear el analisis.",
    "form.success": "Analisis completado y guardado.",
    "detail.untitled": "Analisis sin titulo",
    "detail.pastedResume": "CV pegado",
    "detail.generate": "Generar CV optimizado",
    "detail.suggestions": "Sugerencias de IA",
    "detail.suggestionsDescription": "Cambios concretos para aumentar relevancia y fuerza en entrevista.",
    "detail.optimizedCv": "CV optimizado",
    "detail.optimizedDescription": "Version generada lista para revisar y exportar.",
    "detail.summary": "Resumen profesional",
    "detail.bullets": "Bullets de experiencia",
    "detail.noOptimized": "Todavia no se ha generado un CV optimizado.",
    "detail.found": "Encontradas",
    "detail.missing": "Faltantes",
    "detail.important": "Importantes",
    "detail.keywordsDescription": "Terminos encontrados y faltantes",
    "detail.interviewFocus": "Foco para entrevista",
    "history.title": "Historial de analisis",
    "history.description": "Cada comparacion entre CV y oferta guardada en tu cuenta.",
    "profile.description": "Informacion de tu cuenta y uso.",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(STORAGE_KEY);
    if (storedLocale === "en" || storedLocale === "es") {
      setLocaleState(storedLocale);
      document.documentElement.lang = storedLocale;
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const setLocale = (nextLocale: Locale) => {
      setLocaleState(nextLocale);
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
      document.documentElement.lang = nextLocale;
    };

    return {
      locale,
      setLocale,
      toggleLocale: () => setLocale(locale === "en" ? "es" : "en"),
      t: (key) => translations[locale][key],
    };
  }, [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
