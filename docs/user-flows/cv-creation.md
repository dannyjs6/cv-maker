# CV Creation User Flow

## Purpose

This flow describes how a user creates a CV from scratch after landing on the website.

## Entry Point

User finds the website through search, ads, referral, or direct link.

User opens the home page.

## Home Page

Route:

```txt
/
```

User sees landing page with information about the product.

User can choose one of the following options:

* Import existing CV file
* Create CV from scratch

Import flow is skipped for now and will be described separately.

## Create CV From Scratch

When user selects "Create from scratch", system creates a new resume draft and redirects user to the first CV section.

Resume routes use dynamic resume id:

```txt
resume/:id/...
```

Each step has a `Next` button.

Clicking `Next` saves current step data and navigates user to the next step.

---

# Step 1: Contact Information

Route:

```txt
resume/:id/section/contact
```

## Goal

User fills basic personal and contact information.

## Fields

Required/basic fields:

* First name

  * Example: Elsa
* Last name

  * Example: Manet
* Job title

  * Example: Experienced Sales Advisor
* Photo

  * Optional
* Email

  * Example: [elsa.manet@gmail.com](mailto:elsa.manet@gmail.com)
* Phone number

  * Example: (020) 1234 5678
* Postal code

  * Example: SW1A 1AA
* City

  * Example: London

## Additional Details

Additional fields are hidden inside a toggle block.

Toggle label:

```txt
Show more details
```

When opened, user sees:

```txt
Hide more details
```

Additional fields:

* Birthdate

  * Example: 27/07/1991
* LinkedIn / Website

  * Example: linkedin.com/in/elsa-manet
* Driving license
* Nationality

  * Example: English
* Work permit
* Website

## Primary Action

User clicks `Next`.

System saves contact information and redirects to work history transition page.

---

# Step 2: Work History

Route:

```txt
resume/:id/transition/work-history
```

## Goal

User adds previous work experience records.

## Page Behavior

Each work experience is displayed as a separate block/card/table.

Existing work experience blocks can be reordered by drag and drop.

User can add a new work experience.

## Add Work Experience Flow

Creating a work experience block has 2 steps.

---

## Step 2.1: Job Overview

User fills general job information.

Fields:

* Position
* Company name
* City
* Start date
* End date

User clicks `Next` inside the creation flow.

---

## Step 2.2: Job Description

User writes description for the selected position.

Fields:

* Position

  * Readonly
  * Value comes from previous step
* Job description

  * Rich text editor
  * Possible editor: TipTap

User saves work experience.

System adds the new work experience block to the work history list.

## Primary Action

User clicks main page `Next`.

System saves work history and redirects to education section.

---

# Step 3: Education

Route:

```txt
resume/:id/section/education
```

## Goal

User adds education records.

## Page Behavior

Education records are displayed as separate blocks/cards/tables.

Existing education blocks can be reordered by drag and drop.

User can add a new education record.

## Add Education Flow

Creation modal has 1 step.

Fields:

* Name of the diploma / study area
* School name
* School location
* Start date
* End date
* Description

  * Rich text editor

User saves education record.

System adds the new education block to the education list.

## Primary Action

User clicks `Next`.

System saves education data and redirects to skills section.

---

# Step 4: Skills

Route:

```txt
resume/:id/section/skills
```

## Goal

User adds skills to the CV.

## Page Behavior

User can add skills in two ways:

1. Manually
2. From suggested skills

## Manual Skill Creation

User clicks `Add skill`.

System opens an input with:

* Skill name input
* Add button
* Cancel button

When user clicks `Add`, skill is added to the skills list.

When user clicks `Cancel`, input is closed and no skill is added.

## Suggested Skills

Above the user skills list, system shows suggested skills.

User can click a suggested skill.

Clicked skill is added to the user's skills list.

## Skills List

Skills added manually or from suggestions are rendered as a list.

Each skill item can be:

* Dragged and reordered
* Edited
* Deleted

## Primary Action

User clicks `Next`.

System saves skills and redirects to summary section.

---

# Step 5: Professional Summary

Route:

```txt
resume/:id/section/summary
```

## Goal

User adds a professional summary.

## Page Content

Title:

```txt
Add your professional summary
```

Description:

```txt
Show how your background matches the job you want.
```

## Fields

* Professional summary

  * Rich text editor or textarea

## Primary Action

User clicks `Next`.

System saves summary and redirects to finalize page.

---

# Step 6: Finalize CV

Route:

```txt
resume/:id/section/finalize
```

Example:

```txt
resume/6d2423df-454f-4888-903b-c51fb496b270/section/finalize
```

## Goal

User reviews final CV, changes template, edits sections, and downloads CV.

## Page Layout

Page has 3 main sections.

---

## Left Section: Templates

User sees available CV templates.

User can select a template.

When user selects a template, CV preview updates.

---

## Middle Section: CV Preview

User sees generated CV output.

CV preview includes data from previous steps:

* Contact information
* Work history
* Education
* Skills
* Professional summary

---

## Right Section: CV Sections and Actions

User sees previously filled CV sections.

Each section is clickable.

Clickable sections:

* Contact information
* Work history
* Education
* Skills
* Summary

When user clicks a section, system navigates back to the related form.

After editing, user can return to finalize page.

Download button is displayed under the right section.

## Download

User clicks `Download`.

System generates and downloads the CV file.

---

# General Navigation Rules

Each form step has a `Next` button.

On `Next` click:

1. Validate current step.
2. Save current step data.
3. Navigate to next route.

User can return to previous sections from finalize page.

Data should persist between steps.

User should not lose already entered data after navigation.

---

# Resume Sections Order

```txt
1. Contact information
2. Work history
3. Education
4. Skills
5. Professional summary
6. Finalize
```

---

# Routes Summary

```txt
/
resume/:id/section/contact
resume/:id/transition/work-history
resume/:id/section/education
resume/:id/section/skills
resume/:id/section/summary
resume/:id/section/finalize
```

---

# Out of Scope For Now

The following flows are not described in this document yet:

* Import CV from file
* Authentication
* Payment
* AI-generated suggestions
* Cover letter creation
* Multiple resume management
* Resume deletion