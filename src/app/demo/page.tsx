import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { demoResumeAnalyses } from "@/features/resume-analysis/domain/resume-analysis.fixtures";
import { DashboardOverview } from "@/features/resume-analysis/presentation/dashboard-overview";

export default function DemoPage() {
  return (
    <DashboardShell>
      <DashboardOverview analyses={demoResumeAnalyses} />
    </DashboardShell>
  );
}

