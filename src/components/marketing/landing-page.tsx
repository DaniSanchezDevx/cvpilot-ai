"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  FileSearch,
  Gauge,
  Layers3,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { useLanguage, type TranslationKey } from "@/lib/i18n/language-provider";

const features: {
  icon: LucideIcon;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}[] = [
  {
    icon: Gauge,
    titleKey: "landing.feature.ats.title",
    descriptionKey: "landing.feature.ats.description",
  },
  {
    icon: FileSearch,
    titleKey: "landing.feature.keywords.title",
    descriptionKey: "landing.feature.keywords.description",
  },
  {
    icon: Sparkles,
    titleKey: "landing.feature.rewrite.title",
    descriptionKey: "landing.feature.rewrite.description",
  },
  {
    icon: Layers3,
    titleKey: "landing.feature.history.title",
    descriptionKey: "landing.feature.history.description",
  },
];

const plans: {
  name: string;
  price: string;
  limitKey: TranslationKey;
}[] = [
  { name: "Starter", price: "$0", limitKey: "landing.plan.starterLimit" },
  { name: "Pro", price: "$19", limitKey: "landing.plan.proLimit" },
  { name: "Team", price: "$49", limitKey: "landing.plan.teamLimit" },
];

export function LandingPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BarChart3 className="size-4" aria-hidden="true" />
          </span>
          CVPilot AI
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition hover:text-foreground">
            {t("common.features")}
          </a>
          <a href="#pricing" className="transition hover:text-foreground">
            {t("common.pricing")}
          </a>
          <Link href="/dashboard" className="transition hover:text-foreground">
            {t("landing.nav.dashboard")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/sign-in">{t("common.login")}</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">
              {t("common.startFree")} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-7xl items-center gap-12 px-6 pb-16 pt-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="absolute inset-x-8 top-8 -z-10 h-72 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.68_0.17_255_/_0.32),transparent_68%)] blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <Badge variant="secondary" className="mb-6">
            {t("landing.badge")}
          </Badge>
          <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            CVPilot AI
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            {t("landing.description")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/dashboard">
                {t("landing.primaryCta")} <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#features">{t("landing.secondaryCta")}</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="rounded-lg border bg-card/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur"
        >
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-sm font-medium">{t("landing.analysisTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("landing.sampleRole")}</p>
            </div>
            <Badge>82/100</Badge>
          </div>
          <div className="space-y-5 py-5">
            {[
              [t("landing.skillsMatch"), 88],
              [t("landing.keywords"), 79],
              [t("landing.experience"), 86],
              [t("landing.format"), 74],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-mono text-muted-foreground">{value}%</span>
                </div>
                <Progress value={Number(value)} />
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Next.js App Router", "Accessibility", "Observability", "Impact metrics"].map(
              (keyword) => (
                <div key={keyword} className="rounded-md border bg-background/60 p-3 text-sm">
                  <span className="text-muted-foreground">{t("landing.missing")}</span>
                  <p className="mt-1 font-medium">{keyword}</p>
                </div>
              ),
            )}
          </div>
        </motion.div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <Badge variant="outline">{t("landing.modules")}</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">{t("landing.saasTitle")}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.titleKey} className="bg-card/70">
              <CardHeader>
                <feature.icon className="size-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-lg">{t(feature.titleKey)}</CardTitle>
                <CardDescription>{t(feature.descriptionKey)}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="bg-card/70">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{t(plan.limitKey)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold tracking-tight">{plan.price}</p>
                <Button className="mt-6 w-full" variant={plan.name === "Pro" ? "default" : "outline"}>
                  {t("common.choose")} {plan.name}
                </Button>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {[t("landing.plan.ats"), t("landing.plan.keyword"), t("landing.plan.suggestions")].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-4 text-primary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
