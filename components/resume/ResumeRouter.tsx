"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Navigate,
  NavigationType,
  Route,
  Router,
  Routes,
  type NavigateOptions,
  type Navigator,
  type To,
  useParams,
} from "react-router-dom";
import { ContactPage } from "@/components/resume/pages/ContactPage";
import { EducationPage } from "@/components/resume/pages/EducationPage";
import { FinalizePage } from "@/components/resume/pages/FinalizePage";
import { SkillsPage } from "@/components/resume/pages/SkillsPage";
import { SummaryPage } from "@/components/resume/pages/SummaryPage";
import { WorkHistoryPage } from "@/components/resume/pages/WorkHistoryPage";

const toPath = (to: To) => {
  if (typeof to === "string") {
    return to;
  }

  return `${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}`;
};

const ResumeIndexRedirect = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <Navigate to={`/resume/${id}/section/contact`} replace />;
};

const ResumeRouteList = () => (
  <Routes>
    <Route path="/resume/:id" element={<ResumeIndexRedirect />} />
    <Route path="/resume/:id/section/contact" element={<ContactPage />} />
    <Route
      path="/resume/:id/transition/work-history"
      element={<WorkHistoryPage />}
    />
    <Route path="/resume/:id/section/education" element={<EducationPage />} />
    <Route path="/resume/:id/section/skills" element={<SkillsPage />} />
    <Route path="/resume/:id/section/summary" element={<SummaryPage />} />
    <Route path="/resume/:id/section/finalize" element={<FinalizePage />} />
  </Routes>
);

export const ResumeRouter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const navigator = useMemo<Navigator>(
    () => ({
      createHref: toPath,
      go: (delta) => globalThis.history.go(delta),
      push: (to: To, _state?: unknown, options?: NavigateOptions) => {
        router.push(toPath(to), { scroll: options?.preventScrollReset !== true });
      },
      replace: (to: To, _state?: unknown, options?: NavigateOptions) => {
        router.replace(toPath(to), {
          scroll: options?.preventScrollReset !== true,
        });
      },
    }),
    [router],
  );

  return (
    <Router
      location={pathname}
      navigationType={NavigationType.Pop}
      navigator={navigator}
    >
      <ResumeRouteList />
    </Router>
  );
};
