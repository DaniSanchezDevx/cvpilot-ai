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

const features = [
  {
    icon: Gauge,
    title: "ATS compatibility",
    description: "Score CVs against a real job description with category-level diagnostics.",
  },
  {
    icon: FileSearch,
    title: "Keyword intelligence",
    description: "Detect matched, missing, and high-value terms before the application is sent.",
  },
  {
    icon: Sparkles,
    title: "AI rewrite assistant",
    description: "Turn vague bullets into outcome-driven achievements with stronger verbs.",
  },
  {
    icon: Layers3,
    title: "Analysis history",
    description: "Keep every optimization run organized by role, score, and next action.",
  },
];

const plans = [
  { name: "Starter", price: "$0", limit: "3 analyses/month" },
  { name: "Pro", price: "$19", limit: "Unlimited analyses" },
  { name: "Team", price: "$49", limit: "Shared hiring workspace" },
];

export function LandingPage() {
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
            Features
          </a>
          <a href="#pricing" className="transition hover:text-foreground">
            Pricing
          </a>
          <Link href="/dashboard" className="transition hover:text-foreground">
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">
              Start free <ArrowRight className="size-4" aria-hidden="true" />
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
            AI resume optimization for serious applications
          </Badge>
          <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            CVPilot AI
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            Upload your CV, paste a job description, and get an ATS score, missing keywords,
            sharper bullets, and an interview-ready optimized version.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Analyze a CV <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#features">View capabilities</Link>
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
              <p className="text-sm font-medium">ATS analysis</p>
              <p className="text-xs text-muted-foreground">Senior Product Engineer</p>
            </div>
            <Badge>82/100</Badge>
          </div>
          <div className="space-y-5 py-5">
            {[
              ["Skills match", 88],
              ["Keywords", 79],
              ["Experience", 86],
              ["Format", 74],
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
                  <span className="text-muted-foreground">Missing</span>
                  <p className="mt-1 font-medium">{keyword}</p>
                </div>
              ),
            )}
          </div>
        </motion.div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <Badge variant="outline">MVP modules</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Built like a SaaS product</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card/70">
              <CardHeader>
                <feature.icon className="size-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
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
                <CardDescription>{plan.limit}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold tracking-tight">{plan.price}</p>
                <Button className="mt-6 w-full" variant={plan.name === "Pro" ? "default" : "outline"}>
                  Choose {plan.name}
                </Button>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {["ATS score", "Keyword analysis", "AI suggestions"].map((item) => (
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

