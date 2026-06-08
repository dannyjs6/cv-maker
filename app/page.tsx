export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-24 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          CV Maker
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Next.js, TypeScript, Tailwind, and Prisma are ready.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Update <code>app/page.tsx</code>, set <code>DATABASE_URL</code> in{" "}
          <code>.env</code>, and run your first migration when you are ready to
          define application data.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm font-medium">Start dev server</p>
            <code className="mt-2 block text-sm text-zinc-600 dark:text-zinc-400">
              npm run dev
            </code>
          </div>
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm font-medium">Create migration</p>
            <code className="mt-2 block text-sm text-zinc-600 dark:text-zinc-400">
              npm run prisma:migrate
            </code>
          </div>
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm font-medium">Open Prisma Studio</p>
            <code className="mt-2 block text-sm text-zinc-600 dark:text-zinc-400">
              npm run prisma:studio
            </code>
          </div>
        </div>
      </div>
    </main>
  );
}
