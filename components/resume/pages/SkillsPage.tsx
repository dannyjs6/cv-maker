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
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import {
  buildResumeStepPath,
  getNextResumeStep,
} from "@/lib/resumeSteps";
import type { Skill } from "@/src/entities/resume/resume.types";
import { useResumeStore } from "@/stores/resume.store";

const suggestedSkills = [
  "Sales strategy",
  "Customer service",
  "Team leadership",
  "CRM",
  "Communication",
  "Problem solving",
  "Account management",
  "Project coordination",
];

const SortableSkillItem = ({
  skill,
  isEditing,
  editValue,
  onEditValueChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: {
  skill: Skill;
  isEditing: boolean;
  editValue: string;
  onEditValueChange: (value: string) => void;
  onStartEdit: (skill: Skill) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (skillId: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  return (
    <Card
      ref={setNodeRef}
      withBorder
      radius="md"
      padding="sm"
      style={{
        opacity: isDragging ? 0.6 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {isEditing ? (
        <Group align="flex-end" gap="sm">
          <TextInput
            label="Skill name"
            value={editValue}
            onChange={(event) => onEditValueChange(event.currentTarget.value)}
            className="flex-1"
          />
          <Button type="button" onClick={onSaveEdit}>
            Save
          </Button>
          <Button type="button" variant="light" onClick={onCancelEdit}>
            Cancel
          </Button>
        </Group>
      ) : (
        <Group justify="space-between" gap="md">
          <Group gap="sm">
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
            <Text fw={500}>{skill.name}</Text>
          </Group>

          <Group gap="xs">
            <Button
              type="button"
              variant="light"
              size="xs"
              onClick={() => onStartEdit(skill)}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="light"
              color="red"
              size="xs"
              onClick={() => onDelete(skill.id)}
            >
              Delete
            </Button>
          </Group>
        </Group>
      )}
    </Card>
  );
};

export const SkillsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const skills = useResumeStore((state) =>
    id && state.currentResume?.id === id ? state.currentResume.skills : [],
  );
  const addSkill = useResumeStore((state) => state.addSkill);
  const updateSkill = useResumeStore((state) => state.updateSkill);
  const removeSkill = useResumeStore((state) => state.removeSkill);
  const reorderSkills = useResumeStore((state) => state.reorderSkills);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingSkillName, setEditingSkillName] = useState("");
  const sortedSkills = useMemo(
    () => [...skills].sort((a, b) => a.order - b.order),
    [skills],
  );
  const existingSkillNames = useMemo(
    () => new Set(skills.map((skill) => skill.name.trim().toLowerCase())),
    [skills],
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleAddSkill = (skillName: string) => {
    const name = skillName.trim();

    if (!id || !name || existingSkillNames.has(name.toLowerCase())) {
      return;
    }

    addSkill(id, { name });
    setNewSkillName("");
    setIsAddingSkill(false);
  };

  const handleCancelAdd = () => {
    setNewSkillName("");
    setIsAddingSkill(false);
  };

  const handleStartEdit = (skill: Skill) => {
    setEditingSkillId(skill.id);
    setEditingSkillName(skill.name);
  };

  const handleSaveEdit = () => {
    const name = editingSkillName.trim();

    if (!editingSkillId || !name) {
      return;
    }

    updateSkill(editingSkillId, { name });
    setEditingSkillId(null);
    setEditingSkillName("");
  };

  const handleCancelEdit = () => {
    setEditingSkillId(null);
    setEditingSkillName("");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sortedSkills.findIndex((skill) => skill.id === active.id);
    const newIndex = sortedSkills.findIndex((skill) => skill.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    reorderSkills(arrayMove(sortedSkills, oldIndex, newIndex).map((skill) => skill.id));
  };

  const handleNext = () => {
    if (!id) {
      return;
    }

    const nextStep = getNextResumeStep("skills");

    if (!nextStep) {
      return;
    }

    navigate(buildResumeStepPath(nextStep, id));
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div>
          <Text size="sm" fw={600} tt="uppercase" lts="0.18em" c="dimmed">
            Resume builder
          </Text>
          <Title order={1} mt="xs">
            Skills
          </Title>
          <Text size="sm" c="dimmed" mt="xs">
            Add skills manually or choose from the suggestions.
          </Text>
        </div>

        <Card withBorder radius="md" padding="lg">
          <Stack gap="md">
            <Title order={2} size="h4">
              Suggested skills
            </Title>
            <Group gap="xs">
              {suggestedSkills.map((skill) => {
                const isAdded = existingSkillNames.has(skill.toLowerCase());

                return (
                  <Button
                    key={skill}
                    type="button"
                    variant={isAdded ? "filled" : "light"}
                    size="xs"
                    disabled={isAdded}
                    onClick={() => handleAddSkill(skill)}
                  >
                    {skill}
                  </Button>
                );
              })}
            </Group>
          </Stack>
        </Card>

        <Card withBorder radius="md" padding="lg">
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={2} size="h4">
                Your skills
              </Title>
              {!isAddingSkill ? (
                <Button type="button" onClick={() => setIsAddingSkill(true)}>
                  Add skill
                </Button>
              ) : null}
            </Group>

            {isAddingSkill ? (
              <Group align="flex-end" gap="sm">
                <TextInput
                  label="Skill name"
                  value={newSkillName}
                  onChange={(event) => setNewSkillName(event.currentTarget.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={() => handleAddSkill(newSkillName)}>
                  Add
                </Button>
                <Button type="button" variant="light" onClick={handleCancelAdd}>
                  Cancel
                </Button>
              </Group>
            ) : null}

            {sortedSkills.length ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedSkills.map((skill) => skill.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Stack gap="sm">
                    {sortedSkills.map((skill) => (
                      <SortableSkillItem
                        key={skill.id}
                        skill={skill}
                        isEditing={editingSkillId === skill.id}
                        editValue={editingSkillName}
                        onEditValueChange={setEditingSkillName}
                        onStartEdit={handleStartEdit}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        onDelete={removeSkill}
                      />
                    ))}
                  </Stack>
                </SortableContext>
              </DndContext>
            ) : (
              <Text size="sm" c="dimmed">
                No skills added yet.
              </Text>
            )}
          </Stack>
        </Card>

        <Group justify="flex-end">
          <Button type="button" onClick={handleNext}>
            Next
          </Button>
        </Group>
      </section>
    </main>
  );
};
