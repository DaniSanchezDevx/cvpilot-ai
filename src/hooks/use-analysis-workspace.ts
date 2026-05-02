"use client";

import { create } from "zustand";

type AnalysisWorkspaceState = {
  jobDescription: string;
  selectedResumeName: string | null;
  setJobDescription: (value: string) => void;
  setSelectedResumeName: (value: string | null) => void;
  reset: () => void;
};

export const useAnalysisWorkspace = create<AnalysisWorkspaceState>((set) => ({
  jobDescription: "",
  selectedResumeName: null,
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setSelectedResumeName: (selectedResumeName) => set({ selectedResumeName }),
  reset: () => set({ jobDescription: "", selectedResumeName: null }),
}));

