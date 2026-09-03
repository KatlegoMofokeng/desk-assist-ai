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
import { NOT_SPECIFIED, summarizeMeeting, type MeetingSummary } from "@/lib/workmate-ai";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkMate AI" },
      {
        name: "description",
        content:
          "Paste unstructured meeting notes and get a summary, key discussion points, decisions, action items with owners and deadlines, and follow-ups.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkMate AI" },
      {
        property: "og:description",
        content:
          "Turn long meeting notes into decisions, action items, owners and deadlines — nothing invented.",
      },
    ],
  }),
  component: MeetingSummarizerPage;
});

function summaryToText(s: MeetingSummary): string {
  const list = (items: string[]) =>
    items.length ? items.map((i) => `- ${i}`).join("\n") : `- ${NOT_SPECIFIED}`;

  return [
    "MEETING SUMMARY",
    s.summary,
    "",
    "KEY DISCUSSION POINTS",
    list(s.keyPoints),
    "",
    "DECISIONS MADE",
    list(s.decisions),
    "",
    "ACTION ITEMS",
    s.actionItems.length
      ? s.actionItems
          .map(
            (a) =>
              `- ${a.task}\n  Person responsible: ${a.owner}\n  Deadline: ${a.deadline}`,
          )
          .join("\n")
      : `- ${NOT_SPECIFIED}`,
    "",
    "IMPORTANT FOLLOW-UPS",
    list(s.followUps),
  ].join("\n");
}

function MeetingSummarizerPage() {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function run() {
    if (notes.trim().length < 20) {
      setError("Please paste your meeting notes (at least a couple of sentences).");
      return;
    }
    setError(null);
    setCopied(false);
    setLoading(true);
    try {
      setResult(summaryToText(await summarizeMeeting(notes)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 pt-8 pb-20">
      <ToolHeading title="Meeting Notes Summarizer" index="(b)" />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <form
          className="wm-panel space-y-4 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            void run();
          }}
        >
          <div>
            <FieldLabel htmlFor="notes">Meeting notes</FieldLabel>
            <textarea
              id="notes"
              rows={16}
              className="wm-field mt-1.5 resize-y leading-relaxed"
              placeholder="Paste your raw notes here — bullet points, half sentences and rough jottings are fine."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error ? <ValidationMessage>{error}</ValidationMessage> : null}

          <div className="flex gap-2">
            <ChromeButton type="submit" disabled={loading} className="flex-1">
              {loading ? "Summarizing…" : "Summarize Meeting"}
            </ChromeButton>
            <button
              type="button"
              onClick={() => {
                setNotes("");
                setError(null);
              }}
              className="rounded-md bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-[0_0_0_1px_var(--color-line)]"
            >
              Clear notes
            </button>
          </div>
          <p className="font-mono text-[11px] text-muted">
            Only what you write is used. Where a deadline or responsible person
            is not mentioned, the summary says “{NOT_SPECIFIED}”.
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
              <LoadingBar label="Structuring your notes…" />
            ) : result ? (
              <ResultSection heading="Editable summary">
                <textarea
                  aria-label="Generated meeting summary"
                  className="mt-2 min-h-[26rem] w-full resize-y rounded-md bg-white font-mono text-[13px] leading-relaxed text-ink focus:outline-none"
                  value={result}
                  onChange={(e) => {
                    setResult(e.target.value);
                    setCopied(false);
                  }}
                />
              </ResultSection>
            ) : (
              <EmptyResult>
                Paste your notes and select <strong>Summarize Meeting</strong> to
                get a summary, decisions, action items and follow-ups.
              </EmptyResult>
            )}
          </div>
        </Panel>
      </div>
    </main>
  );
}
