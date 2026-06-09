"use client";

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

const createResumeId = () => {
  const randomId = globalThis.crypto?.randomUUID?.();

  if (randomId) {
    return randomId;
  }

  return `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const StartResumeButton = () => {
  const router = useRouter();

  const handleStart = () => {
    const resumeId = createResumeId();

    router.push(`/resume/${resumeId}/section/contact`);
  };

  return (
    <Button type="button" size="md" onClick={handleStart}>
      Create CV from scratch
    </Button>
  );
};
