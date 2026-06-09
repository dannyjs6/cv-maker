"use client";

import {
  Button,
  Card,
  Collapse,
  FileInput,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useNavigate, useParams } from "react-router-dom";
import {
  buildResumeStepPath,
  getNextResumeStep,
} from "@/lib/resumeSteps";
import {
  emptyContactInfoDraft,
  type ContactInfoDraft,
  useResumeStore,
} from "@/stores/resume.store";

export const ContactPage = () => {
  const [isMoreDetailsOpen, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const savedContactInfo = useResumeStore(
    (state) =>
      id && state.currentResume?.id === id
        ? state.currentResume.contactInfo
        : undefined,
  );
  const updateContact = useResumeStore((state) => state.updateContact);

  const form = useForm<ContactInfoDraft>({
    mode: "uncontrolled",
    initialValues: savedContactInfo ?? emptyContactInfoDraft,
    // validate: {
    //   firstName: (value) => (value.trim() ? null : "First name is required"),
    //   lastName: (value) => (value.trim() ? null : "Last name is required"),
    //   jobTitle: (value) => (value.trim() ? null : "Job title is required"),
    //   email: (value) => {
    //     if (!value.trim()) {
    //       return "Email is required";
    //     }

    //     return /^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email";
    //   },
    //   phoneNumber: (value) =>
    //     value.trim() ? null : "Phone number is required",
    //   postalCode: (value) => (value.trim() ? null : "Postal code is required"),
    //   city: (value) => (value.trim() ? null : "City is required"),
    // },
  });

  const handleSubmit = (values: ContactInfoDraft) => {
    if (!id) {
      return;
    }

    const nextStep = getNextResumeStep("contact");

    if (!nextStep) {
      return;
    }

    updateContact(id, values);
    navigate(buildResumeStepPath(nextStep, id));
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <Card
        component="form"
        onSubmit={form.onSubmit(handleSubmit)}
        withBorder
        radius="md"
        padding="xl"
        className="mx-auto w-full max-w-4xl"
      >
        <Stack gap="lg">
          <div>
            <Text
              size="sm"
              fw={600}
              tt="uppercase"
              lts="0.18em"
              c="dimmed"
            >
              Resume builder
            </Text>
            <Title order={1} mt="xs">
              Contact information
            </Title>
            {id ? (
              <Text size="sm" c="dimmed" mt="xs">
                Resume ID: {id}
              </Text>
            ) : null}
          </div>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="First name"
              placeholder="Elsa"
              key={form.key("firstName")}
              {...form.getInputProps("firstName")}
            />
            <TextInput
              label="Last name"
              placeholder="Manet"
              key={form.key("lastName")}
              {...form.getInputProps("lastName")}
            />
            <TextInput
              label="Job title"
              placeholder="Experienced Sales Advisor"
              key={form.key("jobTitle")}
              {...form.getInputProps("jobTitle")}
            />
            <FileInput
              label="Photo"
              placeholder="Upload a photo"
              accept="image/*"
              clearable
              key={form.key("photo")}
              {...form.getInputProps("photo")}
            />
            <TextInput
              label="Email"
              placeholder="elsa.manet@gmail.com"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <TextInput
              label="Phone number"
              placeholder="(020) 1234 5678"
              key={form.key("phoneNumber")}
              {...form.getInputProps("phoneNumber")}
            />
            <TextInput
              label="Postal code"
              placeholder="SW1A 1AA"
              key={form.key("postalCode")}
              {...form.getInputProps("postalCode")}
            />
            <TextInput
              label="City"
              placeholder="London"
              key={form.key("city")}
              {...form.getInputProps("city")}
            />
          </SimpleGrid>

          <Stack gap="md">
            <Group justify="flex-start">
              <Button variant="subtle" type="button" onClick={toggle}>
                {isMoreDetailsOpen
                  ? "Hide more details"
                  : "Show more details"}
              </Button>
            </Group>

            <Collapse expanded={isMoreDetailsOpen}>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="Birthdate"
                  placeholder="27/07/1991"
                  key={form.key("birthdate")}
                  {...form.getInputProps("birthdate")}
                />
                <TextInput
                  label="LinkedIn / Website"
                  placeholder="linkedin.com/in/elsa-manet"
                  key={form.key("linkedinOrWebsite")}
                  {...form.getInputProps("linkedinOrWebsite")}
                />
                <TextInput
                  label="Driving license"
                  key={form.key("drivingLicense")}
                  {...form.getInputProps("drivingLicense")}
                />
                <TextInput
                  label="Nationality"
                  placeholder="English"
                  key={form.key("nationality")}
                  {...form.getInputProps("nationality")}
                />
                <TextInput
                  label="Work permit"
                  key={form.key("workPermit")}
                  {...form.getInputProps("workPermit")}
                />
                <TextInput
                  label="Website"
                  key={form.key("website")}
                  {...form.getInputProps("website")}
                />
              </SimpleGrid>
            </Collapse>
          </Stack>

          <Group justify="flex-end">
            <Button type="submit">Next</Button>
          </Group>
        </Stack>
      </Card>
    </main>
  );
};
