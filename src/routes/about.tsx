import { createFileRoute } from "@tanstack/react-router";

import { Panel, ResponsibleAiNotice } from "@/components/wm/chrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About WorkMate AI — The Problem and the Solution" },
      {
        name: "description",
        content:
          "Why WorkMate AI exists: professionals lose hours to emails, task organisation and meeting notes. Three AI tools in one application help them save that time.",
      },
      { property: "og:title", content: "About WorkMate AI" },
      {
        property: "og:description",
        content:
          "Three AI-powered productivity tools in one application, built to save professionals time and keep them organised.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-12 pb-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-chrome-ink/70">
        About
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
        One assistant for the work around the work.
      </h1>

      <div className="mt-8 space-y-5">
        <Panel>
          <h2 className="font-display text-lg font-bold text-ink">The problem</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Professionals spend significant amounts of time writing emails,
            organising tasks, and converting lengthy meeting notes into useful
            information. That work is necessary, repetitive, and rarely the work
            people were actually hired to do.
          </p>
        </Panel>

        <Panel>
          <h2 className="font-display text-lg font-bold text-ink">The solution</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            WorkMate AI combines three AI-powered productivity tools into one
            application — a Smart Email Generator, a Meeting Notes Summarizer,
            and an AI Task Planner — to help professionals save time, organise
            information, and improve workplace efficiency.
          </p>
        </Panel>

        <Panel>
          <h2 className="font-display text-lg font-bold text-ink">
            How we use AI responsibly
          </h2>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
            <li>
              Output is presented as a draft to review, never as guaranteed
              fact.
            </li>
            <li>
              Nothing is invented when your input is incomplete — missing
              details are reported as “Not specified”.
            </li>
            <li>
              Tasks are prioritised and recommended, never deleted or ignored on
              your behalf.
            </li>
            <li>
              We ask only for what a tool needs, and avoid collecting
              unnecessary sensitive personal information.
            </li>
          </ul>
          <div className="mt-4">
            <ResponsibleAiNotice />
          </div>
        </Panel>
      </div>
    </main>
  );
}
