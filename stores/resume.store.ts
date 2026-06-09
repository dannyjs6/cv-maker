import { create } from "zustand";
import type {
  Education,
  Resume,
  ResumeTemplate,
  RichTextJson,
  Skill,
  WorkExperience,
} from "@/src/entities/resume/resume.types";

export type ContactInfoDraft = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  photo: File | null;
  email: string;
  phoneNumber: string;
  postalCode: string;
  city: string;
  birthdate: string;
  linkedinOrWebsite: string;
  drivingLicense: string;
  nationality: string;
  workPermit: string;
  website: string;
};

export type WorkExperienceDraftInput = Omit<
  WorkExperience,
  "id" | "resumeId" | "order" | "createdAt" | "updatedAt"
>;

export type EducationDraftInput = Omit<
  Education,
  "id" | "resumeId" | "order" | "createdAt" | "updatedAt"
>;

export type SkillDraftInput = Pick<Skill, "name">;

export type ResumeDraft = Omit<
  Resume,
  "contactInfo" | "template" | "workExperience" | "education" | "skills"
> & {
  contactInfo?: ContactInfoDraft;
  template?: ResumeTemplate;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
};

type ResumeStore = {
  currentResume: ResumeDraft | null;
  setCurrentResume: (resume: ResumeDraft) => void;
  updateContact: (resumeId: string, contactInfo: ContactInfoDraft) => void;
  addWorkExperience: (
    resumeId: string,
    workExperience: WorkExperienceDraftInput,
  ) => void;
  updateWorkExperience: (
    workExperienceId: string,
    updates: Partial<WorkExperienceDraftInput>,
  ) => void;
  removeWorkExperience: (workExperienceId: string) => void;
  reorderWorkExperience: (orderedIds: string[]) => void;
  addEducation: (resumeId: string, education: EducationDraftInput) => void;
  updateEducation: (
    educationId: string,
    updates: Partial<EducationDraftInput>,
  ) => void;
  removeEducation: (educationId: string) => void;
  reorderEducation: (orderedIds: string[]) => void;
  addSkill: (resumeId: string, skill: SkillDraftInput) => void;
  updateSkill: (skillId: string, updates: Partial<SkillDraftInput>) => void;
  removeSkill: (skillId: string) => void;
  reorderSkills: (orderedIds: string[]) => void;
  updateSummary: (resumeId: string, summary: RichTextJson) => void;
  selectTemplate: (template: ResumeTemplate) => void;
};

export const emptyContactInfoDraft: ContactInfoDraft = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  photo: null,
  email: "",
  phoneNumber: "",
  postalCode: "",
  city: "",
  birthdate: "",
  linkedinOrWebsite: "",
  drivingLicense: "",
  nationality: "",
  workPermit: "",
  website: "",
};

const createDraftId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createEmptyResumeDraft = (resumeId: string): ResumeDraft => {
  const now = new Date();

  return {
    id: resumeId,
    title: "Untitled resume",
    status: "draft",
    workExperience: [],
    education: [],
    skills: [],
    createdAt: now,
    updatedAt: now,
  };
};

const ensureCurrentResume = (
  currentResume: ResumeDraft | null,
  resumeId: string,
) => currentResume ?? createEmptyResumeDraft(resumeId);

const withUpdatedOrders = <T extends { id: string; order: number }>(
  items: T[],
  orderedIds: string[],
) => {
  const itemById = new Map(items.map((item) => [item.id, item]));
  const orderedItems = orderedIds
    .map((id) => itemById.get(id))
    .filter((item): item is T => Boolean(item));
  const missingItems = items.filter((item) => !orderedIds.includes(item.id));

  return [...orderedItems, ...missingItems].map((item, index) => ({
    ...item,
    order: index,
  }));
};

export const useResumeStore = create<ResumeStore>((set) => ({
  currentResume: null,
  setCurrentResume: (resume) => set({ currentResume: resume }),
  updateContact: (resumeId, contactInfo) =>
    set((state) => {
      const currentResume = ensureCurrentResume(state.currentResume, resumeId);

      return {
        currentResume: {
          ...currentResume,
          contactInfo,
          updatedAt: new Date(),
        },
      };
    }),
  addWorkExperience: (resumeId, workExperience) =>
    set((state) => {
      const currentResume = ensureCurrentResume(state.currentResume, resumeId);
      const now = new Date();

      return {
        currentResume: {
          ...currentResume,
          workExperience: [
            ...currentResume.workExperience,
            {
              ...workExperience,
              id: createDraftId(),
              resumeId,
              order: currentResume.workExperience.length,
              createdAt: now,
              updatedAt: now,
            },
          ],
          updatedAt: now,
        },
      };
    }),
  updateWorkExperience: (workExperienceId, updates) =>
    set((state) => {
      if (!state.currentResume) {
        return state;
      }

      const now = new Date();

      return {
        currentResume: {
          ...state.currentResume,
          workExperience: state.currentResume.workExperience.map((item) =>
            item.id === workExperienceId
              ? { ...item, ...updates, updatedAt: now }
              : item,
          ),
          updatedAt: now,
        },
      };
    }),
  removeWorkExperience: (workExperienceId) =>
    set((state) => {
      if (!state.currentResume) {
        return state;
      }

      const now = new Date();
      const workExperience = state.currentResume.workExperience
        .filter((item) => item.id !== workExperienceId)
        .map((item, order) => ({ ...item, order }));

      return {
        currentResume: {
          ...state.currentResume,
          workExperience,
          updatedAt: now,
        },
      };
    }),
  reorderWorkExperience: (orderedIds) =>
    set((state) => {
      if (!state.currentResume) {
        return state;
      }

      return {
        currentResume: {
          ...state.currentResume,
          workExperience: withUpdatedOrders(
            state.currentResume.workExperience,
            orderedIds,
          ),
          updatedAt: new Date(),
        },
      };
    }),
  addEducation: (resumeId, education) =>
    set((state) => {
      const currentResume = ensureCurrentResume(state.currentResume, resumeId);
      const now = new Date();

      return {
        currentResume: {
          ...currentResume,
          education: [
            ...currentResume.education,
            {
              ...education,
              id: createDraftId(),
              resumeId,
              order: currentResume.education.length,
              createdAt: now,
              updatedAt: now,
            },
          ],
          updatedAt: now,
        },
      };
    }),
  updateEducation: (educationId, updates) =>
    set((state) => {
      if (!state.currentResume) {
        return state;
      }

      const now = new Date();

      return {
        currentResume: {
          ...state.currentResume,
          education: state.currentResume.education.map((item) =>
            item.id === educationId ? { ...item, ...updates, updatedAt: now } : item,
          ),
          updatedAt: now,
        },
      };
    }),
  removeEducation: (educationId) =>
    set((state) => {
      if (!state.currentResume) {
        return state;
      }

      const now = new Date();
      const education = state.currentResume.education
        .filter((item) => item.id !== educationId)
        .map((item, order) => ({ ...item, order }));

      return {
        currentResume: {
          ...state.currentResume,
          education,
          updatedAt: now,
        },
      };
    }),
  reorderEducation: (orderedIds) =>
    set((state) => {
      if (!state.currentResume) {
        return state;
      }

      return {
        currentResume: {
          ...state.currentResume,
          education: withUpdatedOrders(state.currentResume.education, orderedIds),
          updatedAt: new Date(),
        },
      };
    }),
  addSkill: (resumeId, skill) =>
    set((state) => {
      const currentResume = ensureCurrentResume(state.currentResume, resumeId);
      const now = new Date();

      return {
        currentResume: {
          ...currentResume,
          skills: [
            ...currentResume.skills,
            {
              ...skill,
              id: createDraftId(),
              resumeId,
              order: currentResume.skills.length,
              createdAt: now,
              updatedAt: now,
            },
          ],
          updatedAt: now,
        },
      };
    }),
  updateSkill: (skillId, updates) =>
    set((state) => {
      if (!state.currentResume) {
        return state;
      }

      const now = new Date();

      return {
        currentResume: {
          ...state.currentResume,
          skills: state.currentResume.skills.map((item) =>
            item.id === skillId ? { ...item, ...updates, updatedAt: now } : item,
          ),
          updatedAt: now,
        },
      };
    }),
  removeSkill: (skillId) =>
    set((state) => {
      if (!state.currentResume) {
        return state;
      }

      const now = new Date();
      const skills = state.currentResume.skills
        .filter((item) => item.id !== skillId)
        .map((item, order) => ({ ...item, order }));

      return {
        currentResume: {
          ...state.currentResume,
          skills,
          updatedAt: now,
        },
      };
    }),
  reorderSkills: (orderedIds) =>
    set((state) => {
      if (!state.currentResume) {
        return state;
      }

      return {
        currentResume: {
          ...state.currentResume,
          skills: withUpdatedOrders(state.currentResume.skills, orderedIds),
          updatedAt: new Date(),
        },
      };
    }),
  updateSummary: (resumeId, summary) =>
    set((state) => {
      const currentResume = ensureCurrentResume(state.currentResume, resumeId);

      return {
        currentResume: {
          ...currentResume,
          summary,
          updatedAt: new Date(),
        },
      };
    }),
  selectTemplate: (template) =>
    set((state) => {
      if (!state.currentResume) {
        return state;
      }

      return {
        currentResume: {
          ...state.currentResume,
          template,
          templateId: template.id,
          updatedAt: new Date(),
        },
      };
    }),
}));
