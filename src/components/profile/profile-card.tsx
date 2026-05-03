"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n/language-provider";

type ProfileCardProps = {
  name: string;
  email: string;
  analysisCount: number;
};

export function ProfileCard({ name, email, analysisCount }: ProfileCardProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("common.profile")}</CardTitle>
        <CardDescription>{t("profile.description")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label>{t("common.name")}</Label>
          <Input readOnly value={name} />
        </div>
        <div className="grid gap-2">
          <Label>{t("common.email")}</Label>
          <Input readOnly value={email} />
        </div>
        <div className="grid gap-2">
          <Label>{t("dashboard.savedAnalyses")}</Label>
          <Input readOnly value={analysisCount} />
        </div>
      </CardContent>
    </Card>
  );
}
