# WorkMate AI

> AI-powered workplace productivity assistant. Work smarter, save time, and stay organised.

WorkMate AI is a modern web application that helps professionals reduce time spent on repetitive workplace tasks. It combines three AI-powered tools into one clean, responsive experience:

- **Smart Email Generator** — craft professional emails tailored to your audience and tone.
- **Meeting Notes Summarizer** — turn lengthy or unstructured meeting notes into clear summaries, decisions, action items, and follow-ups.
- **AI Task Planner** — organise your tasks into prioritised daily or weekly plans with recommended completion order and time allocation.

---

## Table of Contents

- [Features](#features)
  - [Smart Email Generator](#smart-email-generator)
  - [Meeting Notes Summarizer](#meeting-notes-summarizer)
  - [AI Task Planner](#ai-task-planner)
- [Responsible AI](#responsible-ai)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [AI Integration Notes](#ai-integration-notes)
- [License](#license)

---

## Features

### Smart Email Generator

Create professional email drafts in seconds.

- Specify the recipient or audience.
- Define the purpose of the email.
- Add relevant context and details.
- Choose a tone: **Formal**, **Informal**, **Friendly**, **Professional**, or **Persuasive**.
- Optionally override the subject or topic.
- Generate a structured email with subject, greeting, body, and closing.
- Edit, copy, clear, or regenerate the result.

### Meeting Notes Summarizer

Transform raw meeting notes into an organised summary.

- Paste lengthy or unstructured notes.
- Extract:
  - Meeting summary
  - Key discussion points
  - Decisions made
  - Action items (with owner and deadline where mentioned)
  - Important follow-ups
- Missing owners or deadlines are clearly marked as **"Not specified"**.
- Edit, copy, clear, or regenerate the summary.

### AI Task Planner

Plan your day or week with AI assistance.

- Add multiple tasks with description, deadline, estimated duration, importance, and notes.
- Choose between a **Daily Plan** or **Weekly Plan**.
- Get tasks organised by:
  - Urgency
  - Importance
  - Deadline
  - Estimated effort
- Output includes:
  - High, medium, and low priority groups
  - Recommended completion order
  - Suggested time allocation
  - Productivity recommendations
- Tasks are never deleted — the AI only recommends how to prioritise them.

---

## Responsible AI

WorkMate AI is designed to assist, not replace, human judgment.

> **AI-generated content may contain errors. Users should review and verify generated information before using it professionally.**

- The app does not invent facts outside the information you provide.
- Missing details (such as deadlines or owners) are reported as "Not specified" rather than guessed.
- Generated outputs are editable, copyable, and should always be reviewed before sending or sharing.
- The assistant does not collect unnecessary sensitive personal information.

---

## Tech Stack

- **[TanStack Start](https://tanstack.com/start)** — full-stack React framework with SSR/SSG and server functions.
- **[React 19](https://react.dev)** — UI library.
- **[TypeScript](https://www.typescriptlang.org)** — type-safe development.
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first styling with custom design tokens.
- **[Vite 7](https://vitejs.dev)** — fast build tooling.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended)
- [Bun](https://bun.sh) or npm

### Installation

```sh
git clone <this-repository-url>
cd <repository-name>
bun install
# or: npm install
```

### Run the development server

```sh
bun run dev
# or: npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view the app.

---

## Project Structure

```
src/
├── components/
│   └── wm/
│       └── chrome.tsx          # Shared UI components (Panel, ChromeButton, LoadingBar, etc.)
├── lib/
│   ├── utils.ts                # Utility helpers
│   └── workmate-ai.ts          # AI generation layer and shared types
├── routes/
│   ├── __root.tsx              # Root layout with navigation and footer
│   ├── about.tsx               # About page
│   ├── email-generator.tsx     # Smart Email Generator
│   ├── index.tsx               # Homepage
│   ├── meeting-summarizer.tsx  # Meeting Notes Summarizer
│   └── task-planner.tsx        # AI Task Planner
├── styles.css                  # Global styles, design tokens, and utilities
├── router.tsx                  # TanStack Router configuration
└── start.ts                    # TanStack Start entry point
```

---

## Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `bun run dev`   | Start the local development server     |
| `bun run build` | Build the application for production |
| `bun run start` | Start the production server            |

---

## AI Integration Notes

The current implementation uses a local, deterministic AI layer (`src/lib/workmate-ai.ts`) so the entire user workflow can be built and tested end to end without external API keys.

To connect a real AI provider later:

1. Replace the bodies of `generateEmail`, `summarizeMeeting`, and `createPlan` in `src/lib/workmate-ai.ts` with calls to your preferred API or server function.
2. Keep the exported TypeScript interfaces stable — the UI depends on them.
3. Maintain the existing guardrails:
   - Never invent facts not present in user input.
   - Report missing owners or deadlines as `"Not specified"`.
   - Never drop or delete tasks — only prioritise and recommend.

---

## License

This project is built with [Lovable](https://lovable.dev). The code is yours — feel free to push it to your own repository, extend it, and ship it.
