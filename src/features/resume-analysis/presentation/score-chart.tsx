"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { AtsScoreBreakdown } from "../domain/resume-analysis.types";

export function ScoreChart({ score }: { score: AtsScoreBreakdown }) {
  const data = [
    { metric: "Skills", value: score.skillsMatch },
    { metric: "Format", value: score.format },
    { metric: "Keywords", value: score.keywords },
    { metric: "Experience", value: score.experience },
    { metric: "Overall", value: score.overall },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "currentColor", fontSize: 12 }} />
          <Radar dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.24} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

