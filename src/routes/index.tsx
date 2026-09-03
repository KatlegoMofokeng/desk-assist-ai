import { Link, createFileRoute } from "@tanstack/react-router";

import { ResponsibleAiNotice } from "@/components/wm/chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkMate AI — Work Smarter. Save Time. Stay Organised." },
      {
        name: "description",
        content:
          "WorkMate AI is an AI workplace productivity assistant with three tools: a smart email generator, a meeting notes summarizer and an AI task planner.",
      },
      {
        property: "og:title",
        content: "WorkMate AI — Work Smarter. Save Time. Stay Organised.",
      },
      {
        property: "og:description",
        content:
          "Draft professional emails, turn meeting notes into structured summaries, and build prioritised daily or weekly task plans.",
      },
    ],
  }),
  component: Home,
});

const TOOLS = [
  {
    to: "/email-generator",
    icon: "✉",
    iconClass: "from-chrome-2 via-chrome to-chrome-3",
    title: "Smart Email Generator",
    description:
      "Draft professional emails from a short brief — tuned to your audience and tone.",
    delay: "0.05s",
  },
  {
    to: "/meeting-summarizer",
    icon: "≡",
    iconClass: "from-gold via-gold to-chrome-3",
    title: "Meeting Notes Summarizer",
    description:
      "Compress long notes into decisions, action items, owners, and deadlines.",
    delay: "0.14s",
  },
  {
    to: "/task-planner",
    icon: "▦",
    iconClass: "from-chrome-3 via-chrome-2 to-chrome",
    title: "AI Task Planner",
    description:
      "Turn a task list into a prioritized daily or weekly plan with time allocation.",
    delay: "0.23s",
  },
] as const;

function Home() {
  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-b from-chrome-3/15 via-paper to-paper">
        <div className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-gradient-to-br from-white via-chrome-3/50 to-chrome-2/40 opacity-70 blur-2xl" />
        <div className="relative mx-auto max-w-6xl animate-[wm-rise_0.6s_cubic-bezier(0.32,0.72,0,1)_both] px-5 pt-16 pb-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-chrome-ink/70">
            AI Workplace Assistant
          </p>
          <h1 className="mt-4 max-w-[18ch] text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Work Smarter. Save Time. Stay Organised.
          </h1>
          <p className="mt-5 max-w-[52ch] text-pretty text-[15px] leading-relaxed text-muted">
            WorkMate AI uses artificial intelligence to turn repetitive
            workplace work into clean, structured output — drafting emails,
            distilling meeting notes, and sequencing your day. It assists your
            judgment; it never replaces it.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              style={{ animationDelay: tool.delay }}
              className="wm-panel group relative animate-[wm-rise_0.6s_cubic-bezier(0.32,0.72,0,1)_both] p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_-12px_hsl(212_60%_40%_/_0.35)]"
            >
              <span
                aria-hidden="true"
                className={`grid size-11 place-items-center rounded-lg bg-gradient-to-br ${tool.iconClass} font-display text-lg font-bold text-white shadow-sm ring-1 ring-white/50`}
              >
                {tool.icon}
              </span>
              <h2 className="mt-4 font-display text-lg font-bold leading-tight text-ink">
                {tool.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {tool.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-chrome-ink transition-all group-hover:gap-2.5">
                Open tool <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="wm-panel mt-6 p-5">
          <ResponsibleAiNotice />
        </div>
      </section>
    </>
  );
}
