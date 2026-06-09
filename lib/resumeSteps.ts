export type ResumeStepId =
  | "contact"
  | "work-history"
  | "education"
  | "skills"
  | "summary"
  | "finalize";

export type ResumeStep = {
  id: ResumeStepId;
  title: string;
  path: string;
};

export const resumeSteps: ResumeStep[] = [
  {
    id: "contact",
    title: "Contact information",
    path: "/resume/:id/section/contact",
  },
  {
    id: "work-history",
    title: "Work history",
    path: "/resume/:id/transition/work-history",
  },
  {
    id: "education",
    title: "Education",
    path: "/resume/:id/section/education",
  },
  {
    id: "skills",
    title: "Skills",
    path: "/resume/:id/section/skills",
  },
  {
    id: "summary",
    title: "Professional summary",
    path: "/resume/:id/section/summary",
  },
  {
    id: "finalize",
    title: "Finalize CV",
    path: "/resume/:id/section/finalize",
  },
];

export const buildResumeStepPath = (step: ResumeStep, resumeId: string) =>
  step.path.replace(":id", resumeId);

export const getNextResumeStep = (stepId: ResumeStepId) => {
  const currentIndex = resumeSteps.findIndex((step) => step.id === stepId);

  if (currentIndex === -1) {
    return undefined;
  }

  return resumeSteps[currentIndex + 1];
};
