"use client";

import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import {
  buildResumeStepPath,
  resumeSteps,
  type ResumeStepId,
} from "@/lib/resumeSteps";
import type {
  ResumeTemplate,
  RichTextJson,
} from "@/src/entities/resume/resume.types";
import { useResumeStore } from "@/stores/resume.store";

const templates: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean, traditional resume layout.",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold headings with a compact structure.",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple typography and generous spacing.",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];

const editableSectionIds: ResumeStepId[] = [
  "contact",
  "work-history",
  "education",
  "skills",
  "summary",
];

const getRichTextText = (content?: RichTextJson) => {
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

export const FinalizePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const resume = useResumeStore((state) =>
    id && state.currentResume?.id === id ? state.currentResume : null,
  );
  const selectTemplate = useResumeStore((state) => state.selectTemplate);
  const selectedTemplateId = resume?.templateId ?? templates[0].id;
  const contact = resume?.contactInfo;
  const workExperience = [...(resume?.workExperience ?? [])].sort(
    (a, b) => a.order - b.order,
  );
  const education = [...(resume?.education ?? [])].sort(
    (a, b) => a.order - b.order,
  );
  const skills = [...(resume?.skills ?? [])].sort((a, b) => a.order - b.order);
  const summaryText = getRichTextText(resume?.summary);

  const navigateToSection = (stepId: ResumeStepId) => {
    if (!id) {
      return;
    }

    const step = resumeSteps.find((item) => item.id === stepId);

    if (step) {
      navigate(buildResumeStepPath(step, id));
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div>
          <Text size="sm" fw={600} tt="uppercase" lts="0.18em" c="dimmed">
            Resume builder
          </Text>
          <Title order={1} mt="xs">
            Finalize CV
          </Title>
        </div>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
          <Card withBorder radius="md" padding="lg">
            <Stack gap="md">
              <Title order={2} size="h4">
                Templates
              </Title>
              {templates.map((template) => (
                <Card
                  key={template.id}
                  withBorder
                  radius="md"
                  padding="md"
                  bg={selectedTemplateId === template.id ? "blue.0" : "white"}
                >
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fw={600}>{template.name}</Text>
                      {selectedTemplateId === template.id ? (
                        <Badge>Selected</Badge>
                      ) : null}
                    </Group>
                    <Text size="sm" c="dimmed">
                      {template.description}
                    </Text>
                    <Button
                      type="button"
                      variant={
                        selectedTemplateId === template.id ? "filled" : "light"
                      }
                      onClick={() => selectTemplate(template)}
                    >
                      Select template
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Card>

          <Card withBorder radius="md" padding="xl" bg="white">
            <Stack gap="lg">
              <div>
                <Title order={2}>
                  {[contact?.firstName, contact?.lastName]
                    .filter(Boolean)
                    .join(" ") || "Your name"}
                </Title>
                <Text c="dimmed">{contact?.jobTitle || "Job title"}</Text>
                <Text size="sm" mt="sm">
                  {[contact?.email, contact?.phoneNumber, contact?.city]
                    .filter(Boolean)
                    .join(" | ") || "Contact details"}
                </Text>
              </div>

              {summaryText ? (
                <>
                  <Divider />
                  <div>
                    <Title order={3} size="h5">
                      Professional Summary
                    </Title>
                    <Text size="sm" mt="xs">
                      {summaryText}
                    </Text>
                  </div>
                </>
              ) : null}

              <Divider />
              <div>
                <Title order={3} size="h5">
                  Work History
                </Title>
                <Stack gap="sm" mt="xs">
                  {workExperience.length ? (
                    workExperience.map((item) => (
                      <div key={item.id}>
                        <Text fw={600}>{item.position}</Text>
                        <Text size="sm" c="dimmed">
                          {item.companyName}
                          {item.city ? `, ${item.city}` : ""}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {item.startDate}
                          {item.endDate ? ` - ${item.endDate}` : ""}
                        </Text>
                        {getRichTextText(item.description) ? (
                          <Text size="sm" mt={4}>
                            {getRichTextText(item.description)}
                          </Text>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <Text size="sm" c="dimmed">
                      No work history added yet.
                    </Text>
                  )}
                </Stack>
              </div>

              <Divider />
              <div>
                <Title order={3} size="h5">
                  Education
                </Title>
                <Stack gap="sm" mt="xs">
                  {education.length ? (
                    education.map((item) => (
                      <div key={item.id}>
                        <Text fw={600}>{item.diplomaName}</Text>
                        <Text size="sm" c="dimmed">
                          {item.schoolName}
                          {item.schoolLocation
                            ? `, ${item.schoolLocation}`
                            : ""}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {item.startDate}
                          {item.endDate ? ` - ${item.endDate}` : ""}
                        </Text>
                      </div>
                    ))
                  ) : (
                    <Text size="sm" c="dimmed">
                      No education added yet.
                    </Text>
                  )}
                </Stack>
              </div>

              <Divider />
              <div>
                <Title order={3} size="h5">
                  Skills
                </Title>
                {skills.length ? (
                  <Group gap="xs" mt="xs">
                    {skills.map((skill) => (
                      <Badge key={skill.id} variant="light">
                        {skill.name}
                      </Badge>
                    ))}
                  </Group>
                ) : (
                  <Text size="sm" c="dimmed" mt="xs">
                    No skills added yet.
                  </Text>
                )}
              </div>
            </Stack>
          </Card>

          <Card withBorder radius="md" padding="lg">
            <Stack gap="md">
              <Title order={2} size="h4">
                Sections
              </Title>
              {editableSectionIds.map((stepId) => {
                const step = resumeSteps.find((item) => item.id === stepId);

                if (!step) {
                  return null;
                }

                return (
                  <Button
                    key={step.id}
                    type="button"
                    variant="light"
                    justify="space-between"
                    onClick={() => navigateToSection(step.id)}
                  >
                    {step.title}
                  </Button>
                );
              })}
              <Divider />
              <Button type="button" onClick={() => globalThis.print()}>
                Download
              </Button>
            </Stack>
          </Card>
        </SimpleGrid>
      </section>
    </main>
  );
};
