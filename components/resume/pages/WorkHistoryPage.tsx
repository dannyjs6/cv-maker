"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link } from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useNavigate, useParams } from "react-router-dom";
import {
  buildResumeStepPath,
  getNextResumeStep,
} from "@/lib/resumeSteps";
import type {
  RichTextJson,
  WorkExperience,
} from "@/src/entities/resume/resume.types";
import {
  type WorkExperienceDraftInput,
  useResumeStore,
} from "@/stores/resume.store";

type WorkHistoryFormValues = WorkExperienceDraftInput;

const emptyDescription: RichTextJson = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const emptyFormValues: WorkHistoryFormValues = {
  position: "",
  companyName: "",
  city: "",
  startDate: "",
  endDate: "",
  description: emptyDescription,
};

const getRichTextPreview = (content?: RichTextJson) => {
  const textParts: string[] = [];

  const visit = (value: unknown) => {
    if (!value || typeof value !== "object") {
      return;
    }

    if ("text" in value && typeof value.text === "string") {
      textParts.push(value.text);
    }

    if ("content" in value && Array.isArray(value.content)) {
      value.content.forEach(visit);
    }
  };

  visit(content);

  return textParts.join(" ").trim();
};

const SortableWorkExperienceCard = ({
  workExperience,
  onEdit,
  onDelete,
}: {
  workExperience: WorkExperience;
  onEdit: (workExperience: WorkExperience) => void;
  onDelete: (workExperienceId: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: workExperience.id });
  const descriptionPreview = getRichTextPreview(workExperience.description);

  return (
    <Card
      ref={setNodeRef}
      withBorder
      radius="md"
      padding="md"
      style={{
        opacity: isDragging ? 0.6 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Group justify="space-between" align="flex-start" gap="md">
        <Group align="flex-start" gap="md">
          <Button
            type="button"
            variant="subtle"
            color="gray"
            size="xs"
            {...attributes}
            {...listeners}
          >
            Drag
          </Button>
          <div>
            <Text fw={600}>{workExperience.position}</Text>
            <Text size="sm" c="dimmed">
              {workExperience.companyName}
              {workExperience.city ? `, ${workExperience.city}` : ""}
            </Text>
            <Text size="sm" c="dimmed">
              {workExperience.startDate}
              {workExperience.endDate ? ` - ${workExperience.endDate}` : ""}
            </Text>
            {descriptionPreview ? (
              <Text size="sm" mt="xs" lineClamp={2}>
                {descriptionPreview}
              </Text>
            ) : null}
          </div>
        </Group>

        <Group gap="xs">
          <Button
            type="button"
            variant="light"
            size="xs"
            onClick={() => onEdit(workExperience)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="light"
            color="red"
            size="xs"
            onClick={() => onDelete(workExperience.id)}
          >
            Delete
          </Button>
        </Group>
      </Group>
    </Card>
  );
};

const JobDescriptionEditor = ({
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
          "min-h-40 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus-within:border-blue-500",
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

export const WorkHistoryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const workExperience = useResumeStore((state) =>
    id && state.currentResume?.id === id
      ? state.currentResume.workExperience
      : [],
  );
  const addWorkExperience = useResumeStore((state) => state.addWorkExperience);
  const updateWorkExperience = useResumeStore(
    (state) => state.updateWorkExperience,
  );
  const removeWorkExperience = useResumeStore(
    (state) => state.removeWorkExperience,
  );
  const reorderWorkExperience = useResumeStore(
    (state) => state.reorderWorkExperience,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const sortedWorkExperience = useMemo(
    () => [...workExperience].sort((a, b) => a.order - b.order),
    [workExperience],
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const form = useForm<WorkHistoryFormValues>({
    mode: "uncontrolled",
    initialValues: emptyFormValues,
    validate: {
      position: (value) => (value.trim() ? null : "Position is required"),
      companyName: (value) =>
        value.trim() ? null : "Company name is required",
      city: (value) => (value.trim() ? null : "City is required"),
      startDate: (value) => (value.trim() ? null : "Start date is required"),
    },
  });

  const openCreateModal = () => {
    setEditingId(null);
    setActiveStep(0);
    form.setValues(emptyFormValues);
    form.resetDirty();
    setIsModalOpen(true);
  };

  const openEditModal = (item: WorkExperience) => {
    setEditingId(item.id);
    setActiveStep(0);
    form.setValues({
      position: item.position,
      companyName: item.companyName,
      city: item.city,
      startDate: item.startDate,
      endDate: item.endDate ?? "",
      description: item.description ?? emptyDescription,
    });
    form.resetDirty();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveStep(0);
    setEditingId(null);
    form.setValues(emptyFormValues);
  };

  const handleOverviewNext = () => {
    const validation = form.validate();

    if (validation.hasErrors) {
      return;
    }

    setActiveStep(1);
  };

  const handleSave = () => {
    const validation = form.validate();

    if (validation.hasErrors || !id) {
      return;
    }

    const values = form.getValues();

    if (editingId) {
      updateWorkExperience(editingId, values);
    } else {
      addWorkExperience(id, values);
    }

    closeModal();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sortedWorkExperience.findIndex(
      (item) => item.id === active.id,
    );
    const newIndex = sortedWorkExperience.findIndex(
      (item) => item.id === over.id,
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    reorderWorkExperience(
      arrayMove(sortedWorkExperience, oldIndex, newIndex).map((item) => item.id),
    );
  };

  const handleNext = () => {
    if (!id) {
      return;
    }

    const nextStep = getNextResumeStep("work-history");

    if (!nextStep) {
      return;
    }

    navigate(buildResumeStepPath(nextStep, id));
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="sm" fw={600} tt="uppercase" lts="0.18em" c="dimmed">
              Resume builder
            </Text>
            <Title order={1} mt="xs">
              Work history
            </Title>
            <Text size="sm" c="dimmed" mt="xs">
              Add previous work experience records.
            </Text>
          </div>
          <Button type="button" onClick={openCreateModal}>
            Add work experience
          </Button>
        </Group>

        {sortedWorkExperience.length ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedWorkExperience.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="md">
                {sortedWorkExperience.map((item) => (
                  <SortableWorkExperienceCard
                    key={item.id}
                    workExperience={item}
                    onEdit={openEditModal}
                    onDelete={removeWorkExperience}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        ) : (
          <Card withBorder radius="md" padding="xl">
            <Stack align="center" gap="xs">
              <Title order={2} size="h4">
                No work experience yet
              </Title>
              <Text size="sm" c="dimmed" ta="center">
                Add your first role to start building the work history section.
              </Text>
              <Button type="button" variant="light" onClick={openCreateModal}>
                Add work experience
              </Button>
            </Stack>
          </Card>
        )}

        <Group justify="flex-end">
          <Button type="button" onClick={handleNext}>
            Next
          </Button>
        </Group>
      </section>

      <Modal
        opened={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Edit work experience" : "Add work experience"}
        size="lg"
      >
        <Stack gap="lg">
          <Group gap="xs">
            <Button
              type="button"
              size="xs"
              variant={activeStep === 0 ? "filled" : "light"}
              onClick={() => setActiveStep(0)}
            >
              1. Job overview
            </Button>
            <Button
              type="button"
              size="xs"
              variant={activeStep === 1 ? "filled" : "light"}
              onClick={handleOverviewNext}
            >
              2. Job description
            </Button>
          </Group>

          {activeStep === 0 ? (
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="Position"
                  key={form.key("position")}
                  {...form.getInputProps("position")}
                />
                <TextInput
                  label="Company name"
                  key={form.key("companyName")}
                  {...form.getInputProps("companyName")}
                />
                <TextInput
                  label="City"
                  key={form.key("city")}
                  {...form.getInputProps("city")}
                />
                <TextInput
                  label="Start date"
                  key={form.key("startDate")}
                  {...form.getInputProps("startDate")}
                />
                <TextInput
                  label="End date"
                  key={form.key("endDate")}
                  {...form.getInputProps("endDate")}
                />
              </SimpleGrid>

              <Group justify="flex-end">
                <Button type="button" onClick={handleOverviewNext}>
                  Next
                </Button>
              </Group>
            </Stack>
          ) : (
            <Stack gap="md">
              <TextInput
                label="Position"
                readOnly
                value={form.getValues().position}
              />
              <div>
                <Text size="sm" fw={500} mb={6}>
                  Job description
                </Text>
                <JobDescriptionEditor
                  value={form.getValues().description ?? emptyDescription}
                  onChange={(value) => form.setFieldValue("description", value)}
                />
              </div>

              <Group justify="space-between">
                <Button
                  type="button"
                  variant="light"
                  onClick={() => setActiveStep(0)}
                >
                  Back
                </Button>
                <Button type="button" onClick={handleSave}>
                  Save work experience
                </Button>
              </Group>
            </Stack>
          )}
        </Stack>
      </Modal>
    </main>
  );
};
