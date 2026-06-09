import { StartResumeButton } from "@/components/home/StartResumeButton";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-24 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          CV Maker
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Build a professional CV step by step.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Start from scratch, add your contact details, work history,
          education, skills, and summary, then finalize your resume.
        </p>
        <div className="mt-8">
          <StartResumeButton />
        </div>
      </div>
    </main>
  );
}
