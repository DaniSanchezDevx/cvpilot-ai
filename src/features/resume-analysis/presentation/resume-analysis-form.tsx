"use client";

import { useRef, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FileText, FileUp, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/language-provider";

type AnalysisFormFields = {
  jobTitle: string;
  resumeText: string;
  jobDescription: string;
};

export function ResumeAnalysisForm() {
  const { locale, t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { register, reset } = useForm<AnalysisFormFields>({
    defaultValues: {
      jobTitle: "",
      resumeText: "",
      jobDescription: "",
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/analyses", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const payload = (await response.json()) as { id?: string; message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? t("form.error"));
      }

      toast.success(payload.message ?? t("form.success"));
      reset();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.refresh();
      if (payload.id) {
        router.push(`/dashboard/analyses/${payload.id}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("form.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const [file] = Array.from(files ?? []);
    if (!file) {
      return;
    }

    setSelectedFile(file);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.title")}</CardTitle>
        <CardDescription>{t("form.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="grid gap-5">
          <input type="hidden" name="locale" value={locale} />
          <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
            <div
              className={cn(
                "flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 p-6 text-center transition",
                isDragging && "border-primary bg-primary/10",
              )}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFiles(event.dataTransfer.files);
              }}
            >
              <input
                ref={fileInputRef}
                name="resumeFile"
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                className="sr-only"
                onChange={(event) => handleFiles(event.target.files)}
              />
              {selectedFile ? (
                <div className="w-full">
                  <FileText className="mx-auto size-9 text-primary" aria-hidden="true" />
                  <p className="mt-4 break-words font-medium">{selectedFile.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  <Button
                    type="button"
                    className="mt-5"
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    <X className="size-4" aria-hidden="true" />
                    {t("common.remove")}
                  </Button>
                </div>
              ) : (
                <>
                  <FileUp className="size-9 text-primary" aria-hidden="true" />
                  <p className="mt-4 font-medium">{t("form.drop")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("form.fileHint")}</p>
                  <Button type="button" className="mt-5" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    {t("form.selectFile")}
                  </Button>
                </>
              )}
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="job-title">{t("form.targetRole")}</Label>
                <Input id="job-title" placeholder={t("form.targetRolePlaceholder")} {...register("jobTitle")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job-description">{t("form.jobDescription")}</Label>
                <Textarea
                  id="job-description"
                  className="min-h-44 resize-none"
                  placeholder={t("form.jobDescriptionPlaceholder")}
                  {...register("jobDescription", { required: true })}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="resume-text">{t("form.fallback")}</Label>
            <Textarea
              id="resume-text"
              className="min-h-36 resize-none"
              placeholder={t("form.fallbackPlaceholder")}
              {...register("resumeText")}
            />
          </div>

          <div className="flex justify-end">
            <Button disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="size-4" aria-hidden="true" />
              )}
              {isSubmitting ? t("form.analyzing") : t("form.analyze")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
