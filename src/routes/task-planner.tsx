import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  ChromeButton,
  EmptyResult,
  FieldLabel,
  LoadingBar,
  Panel,
  ResponsibleAiNotice,
  ResultHeader,
  ResultSection,
  ToolHeading,
  ValidationMessage,
} from "@/components/wm/chrome";
import {
  IMPORTANCE_LEVELS,
  NOT_SPECIFIED,
  createPlan,
  type Importance,
  type PlanHorizon,
  type PlannerTask,
  type TaskPlan,
} from "@/lib/workmate-ai";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkMate AI" },
      {
        name: "description",
        content:
          "Enter workplace tasks with deadlines, durations and importance, then generate a prioritised daily or weekly plan with a recommended order and time allocation.",
      },
      { property: "og:title", content: "AI Task Planner — WorkMate AI" },
      {
        property: "og:description",
        content:
          "Prioritise tasks by urgency, importance, deadline and effort into a daily or weekly plan.",
      },
    ],
  }),
  component: TaskPlannerPage,
});

let nextId = 1;
const emptyTask = (): PlannerTask => ({
  id: `task-${nextId++}`,
  description: "",
  deadline: "",
  duration: "",
  importance: "Medium",
  notes: "",
});

function planToText(plan: TaskPlan): string {
  const group = (label: string, tasks: PlannerTask[]) =>
    [
      label,
      tasks.length
        ? tasks
            .map(
              (t) =>
                `- ${t.description} | deadline: ${t.deadline || NOT_SPECIFIED} | est: ${t.duration || NOT_SPECIFIED}${t.notes ? ` | notes: ${t.notes}` : ""}`,
            )
            .join("\n")
        : "- None",
    ].join("\n");

  return [
    `${plan.horizon.toUpperCase()}`,
    "",
    group("HIGH PRIORITY TASKS", plan.high),
    "",
    group("MEDIUM PRIORITY TASKS", plan.medium),
    "",
    group("LOW PRIORITY TASKS", plan.low),
    "",
    "RECOMMENDED ORDER OF COMPLETION",
    plan.order.map((d, i) => `${i + 1}. ${d}`).join("\n"),
    "",
    "SUGGESTED TIME ALLOCATION",
    plan.allocation.map((a) => `- ${a.slot}: ${a.task}`).join("\n"),
    "",
    "PRODUCTIVITY RECOMMENDATIONS",
    plan.recommendations.map((r) => `- ${r}`).join("\n"),
  ].join("\n");
}

function TaskPlannerPage() {
  const [tasks, setTasks] = useState<PlannerTask[]>([emptyTask()]);
  const [horizon, setHorizon] = useState<PlanHorizon>("Daily Plan");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function update(id: string, patch: Partial<PlannerTask>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  async function run() {
    const filled = tasks.filter((t) => t.description.trim());
    if (filled.length === 0) {
      setError("Please describe at least one task before creating a plan.");
      return;
    }
    setError(null);
    setCopied(false);
    setLoading(true);
    try {
      setResult(planToText(await createPlan(filled, horizon)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 pt-8 pb-20">
      <ToolHeading title="AI Task Planner" index="(c)" />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <form
          className="wm-panel space-y-4 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            void run();
          }}
        >
          {tasks.map((task, index) => (
            <fieldset
              key={task.id}
              className="space-y-3 rounded-lg bg-white p-4 shadow-[0_0_0_1px_var(--color-line)]"
            >
              <legend className="font-mono text-[11px] uppercase tracking-wider text-chrome-ink">
                Task {index + 1}
              </legend>
              <div>
                <FieldLabel htmlFor={`${task.id}-desc`}>Task description</FieldLabel>
                <input
                  id={`${task.id}-desc`}
                  className="wm-field mt-1.5"
                  placeholder="e.g. Prepare Q3 budget review pack"
                  value={task.description}
                  onChange={(e) => update(task.id, { description: e.target.value })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor={`${task.id}-due`}>Deadline</FieldLabel>
                  <input
                    id={`${task.id}-due`}
                    type="date"
                    className="wm-field mt-1.5"
                    value={task.deadline}
                    onChange={(e) => update(task.id, { deadline: e.target.value })}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor={`${task.id}-dur`}>Estimated duration</FieldLabel>
                  <input
                    id={`${task.id}-dur`}
                    className="wm-field mt-1.5"
                    placeholder="e.g. 2 hours"
                    value={task.duration}
                    onChange={(e) => update(task.id, { duration: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor={`${task.id}-imp`}>Importance</FieldLabel>
                <select
                  id={`${task.id}-imp`}
                  className="wm-field mt-1.5"
                  value={task.importance}
                  onChange={(e) =>
                    update(task.id, { importance: e.target.value as Importance })
                  }
                >
                  {IMPORTANCE_LEVELS.map((level) => (
                    <option key={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor={`${task.id}-notes`}>Additional notes</FieldLabel>
                <textarea
                  id={`${task.id}-notes`}
                  rows={2}
                  className="wm-field mt-1.5 resize-none"
                  placeholder="Optional"
                  value={task.notes}
                  onChange={(e) => update(task.id, { notes: e.target.value })}
                />
              </div>
              {tasks.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                  className="font-mono text-[11px] uppercase tracking-wider text-muted hover:text-ink"
                >
                  Remove task
                </button>
              ) : null}
            </fieldset>
          ))}

          <button
            type="button"
            onClick={() => setTasks((prev) => [...prev, emptyTask()])}
            className="w-full rounded-md bg-white py-2 text-sm font-medium text-chrome-ink shadow-[0_0_0_1px_var(--color-line)]"
          >
            + Add another task
          </button>

          <div>
            <FieldLabel htmlFor="horizon">Plan type</FieldLabel>
            <select
              id="horizon"
              className="wm-field mt-1.5"
              value={horizon}
              onChange={(e) => setHorizon(e.target.value as PlanHorizon)}
            >
              <option>Daily Plan</option>
              <option>Weekly Plan</option>
            </select>
          </div>

          {error ? <ValidationMessage>{error}</ValidationMessage> : null}

          <ChromeButton type="submit" disabled={loading} className="w-full">
            {loading ? "Creating plan…" : "Create Plan"}
          </ChromeButton>
          <p className="font-mono text-[11px] text-muted">
            No task is deleted or ignored. The plan only recommends an order —
            the final decision stays yours.
          </p>
          <ResponsibleAiNotice />
        </form>

        <Panel>
          <ResultHeader
            onCopy={() => {
              if (!result) return;
              void navigator.clipboard?.writeText(result);
              setCopied(true);
            }}
            onClear={() => {
              setResult(null);
              setCopied(false);
            }}
            onRegenerate={() => void run()}
            copied={copied}
            disabled={loading || !result}
          />
          <div className="rounded-lg bg-white p-4 shadow-[0_0_0_1px_var(--color-line)]">
            {loading ? (
              <LoadingBar label="Prioritising your tasks…" />
            ) : result ? (
              <ResultSection heading="Editable plan">
                <textarea
                  aria-label="Generated task plan"
                  className="mt-2 min-h-[30rem] w-full resize-y rounded-md bg-white font-mono text-[13px] leading-relaxed text-ink focus:outline-none"
                  value={result}
                  onChange={(e) => {
                    setResult(e.target.value);
                    setCopied(false);
                  }}
                />
              </ResultSection>
            ) : (
              <EmptyResult>
                Add your tasks, choose a daily or weekly plan, then select{" "}
                <strong>Create Plan</strong>.
              </EmptyResult>
            )}
          </div>
        </Panel>
      </div>
    </main>
  );
}
