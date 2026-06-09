<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

# Project Overview

This project is an online CV / Resume Builder.

Users can create professional resumes from scratch through a step-by-step wizard.

The application stores resume drafts in PostgreSQL and allows users to preview, customize, and download resumes using different templates.

---

# Main User Flow

The primary flow is described in:

* docs/user-flows/cv-creation.md

Before implementing any resume-related functionality, read that document.

---

# Technology Stack

Frontend:

* React
* TypeScript
* Vite

Backend / Database:

* PostgreSQL
* Prisma ORM

UI and Forms

- Mantine

Use Mantine components whenever possible.

Preferred components:

- TextInput
- Textarea
- Select
- MultiSelect
- Modal
- Card
- Button
- Stack
- Group

Avoid custom implementations when equivalent Mantine components exist.

Rich Text Editor:

* TipTap

Allowed formatting for TipTap:

- Paragraphs
- Bullet lists
- Numbered lists
- Bold
- Italic
- Links

Disallowed:

- Tables
- Images
- Videos
- Arbitrary HTML

Drag & Drop:

* dnd-kit

---

# Architecture Rules

## Routing

Resume routes follow this pattern:

```txt
resume/:id/section/*
```

Do not hardcode resume ids.

Always use route params.

---

## State Management Rules

Use Zustand for client-side application state.

Zustand should be used for:

* Current resume draft state
* Wizard progress
* Selected template
* Temporary UI state shared between resume sections
* Local optimistic updates before API persistence

Avoid storing server-only data in Zustand when it can be fetched directly from the API.

Keep Zustand stores small and feature-based.

Recommended store structure:

```txt
src/
└─ stores/
   ├─ resume.store.ts
   ├─ wizard.store.ts
   └─ template.store.ts
```

Do not create one huge global store.

---

## Backend And Database Rules

Use PostgreSQL as the main database.

Use Prisma as the ORM.

All database access must go through Prisma.

Do not write raw SQL unless there is a strong reason.

Prisma schema should be the source of truth for database models.

Recommended structure:

```txt
prisma/
├─ schema.prisma
└─ migrations/
```

---

# Prisma Data Model Direction

Core entities:

```txt
Resume
ContactInfo
WorkExperience
Education
Skill
ResumeTemplate
```

Recommended relation shape:

```txt
Resume
├── ContactInfo?
├── WorkExperience[]
├── Education[]
├── Skill[]
└── ResumeTemplate?
```

Sortable entities must have an `order` field:

* WorkExperience.order
* Education.order
* Skill.order

Use UUID ids for main entities.

Every core entity should have:

* id
* createdAt
* updatedAt

---

# API Rules

All API requests from frontend must go through a dedicated API layer.

Do not call `fetch` directly inside React components.

Example:

```ts
resumeApi.create()
resumeApi.updateContact()
resumeApi.getById()
resumeApi.addWorkExperience()
resumeApi.reorderSkills()
```

Backend API should use Prisma for all persistence operations.

---

# Form Persistence

All form data must survive:

* Page refresh
* Route navigation
* Browser back navigation

Persist important resume data to PostgreSQL through API.

Use Zustand only as temporary client state/cache.

Never rely only on Zustand for important resume data.

---

# Resume Sections Order

1. Contact
2. Work History
3. Education
4. Skills
5. Summary
6. Finalize

Navigation should respect this order.

---

# Validation

Validate only fields belonging to the current step.

Do not block navigation because of incomplete future sections.

---

# Drag And Drop

The following entities are sortable:

* Work History
* Education
* Skills

Persist order changes to PostgreSQL.

Update Zustand optimistically, then sync with API.

---

# Rich Text Fields

The following fields use TipTap:

* Work History Description
* Education Description
* Professional Summary

Store editor content as JSON.

Do not store rendered HTML as the source of truth.

---

# Code Style

Use:

* TypeScript strict mode
* Functional React components
* Named exports

Prefer:

```ts
export const ResumeSkills = () => {}
```

Avoid:

```ts
export default ResumeSkills
```

---

# Out Of Scope

Currently not implemented:

* Resume import
* Authentication
* Payments
* Cover letters
* AI resume generation

Do not introduce these features unless explicitly requested.
