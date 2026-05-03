"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-provider";

export function LanguageToggle() {
  const { locale, t, toggleLocale } = useLanguage();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-2"
      aria-label={t("language.aria")}
      onClick={toggleLocale}
    >
      <Languages className="size-4" aria-hidden="true" />
      {t("language.label")}
      <span className="sr-only">Current language: {locale}</span>
    </Button>
  );
}
