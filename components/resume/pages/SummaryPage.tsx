"use client";

import { useState } from "react";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { Link } from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useNavigate, useParams } from "react-router-dom";
import {
  buildResumeStepPath,
  getNextResumeStep,
} from "@/lib/resumeSteps";
import type { RichTextJson } from "@/src/entities/resume/resume.types";
import { useResumeStore } from "@/stores/resume.store";

const emptySummary: RichTextJson = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const SummaryEditor = ({
  value,
  onChange,
}: {
  value: RichTextJson;
  onChange: (value: RichTextJson) => void;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        blockquote: false,
        code: false,
        codeBlock: false,
        dropcursor: false,
        gapcursor: false,
        hardBreak: false,
        heading: false,
        horizontalRule: false,
        strike: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-56 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus-within:border-blue-500",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  return (
    <Stack gap="xs">
      <Group gap="xs">
        <Button
          type="button"
          size="xs"
          variant={editor?.isActive("bold") ? "filled" : "light"}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          Bold
        </Button>
        <Button
          type="button"
          size="xs"
          variant={editor?.isActive("italic") ? "filled" : "light"}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          Italic
        </Button>
        <Button
          type="button"
          size="xs"
          variant={editor?.isActive("bulletList") ? "filled" : "light"}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          Bullets
        </Button>
        <Button
          type="button"
          size="xs"
          variant={editor?.isActive("orderedList") ? "filled" : "light"}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          Numbered
        </Button>
      </Group>
      <EditorContent editor={editor} />
    </Stack>
  );
};

export const SummaryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const savedSummary = useResumeStore((state) =>
    id && state.currentResume?.id === id ? state.currentResume.summary : undefined,
  );
  const updateSummary = useResumeStore((state) => state.updateSummary);
  const [summary, setSummary] = useState<RichTextJson>(
    savedSummary ?? emptySummary,
  );

  const handleSubmit = () => {
    if (!id) {
      return;
    }

    updateSummary(id, summary);

    const nextStep = getNextResumeStep("summary");

    if (nextStep) {
      navigate(buildResumeStepPath(nextStep, id));
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <Card
        withBorder
        radius="md"
        padding="xl"
        className="mx-auto w-full max-w-4xl"
      >
        <Stack gap="lg">
          <div>
            <Text size="sm" fw={600} tt="uppercase" lts="0.18em" c="dimmed">
              Resume builder
            </Text>
            <Title order={1} mt="xs">
              Add your professional summary
            </Title>
            <Text size="sm" c="dimmed" mt="xs">
              Show how your background matches the job you want.
            </Text>
          </div>

          <SummaryEditor value={summary} onChange={setSummary} />

          <Group justify="flex-end">
            <Button type="button" onClick={handleSubmit}>
              Next
            </Button>
          </Group>
        </Stack>
      </Card>
    </main>
  );
};
