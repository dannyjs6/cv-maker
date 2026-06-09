export type RichTextJson = Record<string, unknown>;

export type ResumeStatus = "draft" | "finalized";

export type Resume = {
  id: string;
  title: string;
  status: ResumeStatus;
  contactInfo?: ContactInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  summary?: RichTextJson;
  template?: ResumeTemplate;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactInfo = {
  id: string;
  resumeId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  photoUrl?: string;
  email: string;
  phoneNumber: string;
  postalCode: string;
  city: string;
  birthdate?: string;
  linkedinOrWebsite?: string;
  drivingLicense?: string;
  nationality?: string;
  workPermit?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type WorkExperience = {
  id: string;
  resumeId: string;
  position: string;
  companyName: string;
  city: string;
  startDate: string;
  endDate?: string;
  description?: RichTextJson;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Education = {
  id: string;
  resumeId: string;
  diplomaName: string;
  schoolName: string;
  schoolLocation: string;
  startDate: string;
  endDate?: string;
  description?: RichTextJson;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Skill = {
  id: string;
  resumeId: string;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ResumeTemplate = {
  id: string;
  name: string;
  description?: string;
  previewImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};
