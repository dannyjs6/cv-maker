"use client";

import { useNavigate, useParams } from "react-router-dom";
import {
  buildResumeStepPath,
  getNextResumeStep,
  type ResumeStepId,
} from "@/lib/resumeSteps";

type ResumeStepPageProps = {
  stepId: ResumeStepId;
  title: string;
};

export const ResumeStepPage = ({ stepId, title }: ResumeStepPageProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const nextStep = getNextResumeStep(stepId);

  const handleNext = () => {
    if (!id || !nextStep) {
      return;
    }

    navigate(buildResumeStepPath(nextStep, id));
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Resume builder
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          {id ? (
            <p className="mt-2 text-sm text-zinc-600">Resume ID: {id}</p>
          ) : null}
        </div>

        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-sm text-zinc-500">
          Form content will be added later.
        </div>

        {nextStep ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="rounded-md bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
};
