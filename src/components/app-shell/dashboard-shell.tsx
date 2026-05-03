"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { BarChart3, FileText, History, Settings, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { useLanguage, type TranslationKey } from "@/lib/i18n/language-provider";

const navItems: {
  labelKey: TranslationKey;
  href: string;
  icon: LucideIcon;
}[] = [
  { labelKey: "common.analyze", href: "/dashboard", icon: FileText },
  { labelKey: "common.history", href: "/dashboard/history", icon: History },
  { labelKey: "common.profile", href: "/dashboard/profile", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card/40 px-4 py-5 lg:block">
        <Link href="/" className="flex items-center gap-2 px-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BarChart3 className="size-4" aria-hidden="true" />
          </span>
          CVPilot AI
        </Link>
        <Separator className="my-5" />
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" className="w-full justify-start">
              <Link href={item.href}>
                <item.icon className="size-4" aria-hidden="true" />
                {t(item.labelKey)}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/85 px-6 backdrop-blur">
          <div>
            <p className="text-sm font-medium">{t("common.dashboard")}</p>
            <p className="text-xs text-muted-foreground">{t("shell.subtitle")}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <UserButton />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
