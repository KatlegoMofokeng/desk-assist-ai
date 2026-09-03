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
  TONES,
  generateEmail,
  type EmailDraft,
  type Tone,
} from "@/lib/workmate-ai";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkMate AI" },
      {
        name: "description",
        content:
          "Describe your recipient, purpose, context and tone, and WorkMate AI drafts a subject line, greeting, body and closing you can edit and copy.",
      },
      { property: "og:title", content: "Smart Email Generator — WorkMate AI" },
      {
        property: "og:description",
        content:
          "Draft professional workplace emails in a chosen tone, then edit and copy the result.",
      },
    ],
  }),
  component: EmailGeneratorPage,
});

function draftToText(draft: EmailDraft): string {
  return [
    `Subject: ${draft.subject}`,
    "",
    draft.greeting,
    "",
    ...draft.body.flatMap((p) => [p, ""]),
    draft.closing,
  ].join("\n");
}

function EmailGeneratorPage() {
  const [audience, setAudience] = useState("");
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [topic, setTopic] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function run() {
    if (!audience.trim() || !purpose.trim()) {
      setError("Please add a recipient or audience and the purpose of the email.");
      return;
    }
    setError(null);
    setCopied(false);
    setLoading(true);
    try {
      const draft = await generateEmail({ audience, purpose, context, tone, topic });
      setResult(draftToText(draft));
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!result) return;
    void navigator.clipboard?.writeText(result);
    setCopied(true);
  }

  return (
    <main className="mx-auto max-w-6xl px-5 pt-8 pb-20">
      <ToolHeading title="Smart Email Generator" index="(a)" />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <form
          className="wm-panel space-y-4 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            void run();
          }}
        >
          <div>
            <FieldLabel htmlFor="aud">Recipient / audience</FieldLabel>
            <input
              id="aud"
              className="wm-field mt-1.5"
              placeholder="e.g. Regional store managers"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="pur">Purpose of the email</FieldLabel>
            <input
              id="pur"
              className="wm-field mt-1.5"
              placeholder="e.g. request Q3 stock reorder numbers"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="ctx">Context or details</FieldLabel>
            <textarea
              id="ctx"
              rows={3}
              className="wm-field mt-1.5 resize-none"
              placeholder="Anything the email must mention"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="tone">Tone</FieldLabel>
              <select
                id="tone"
                className="wm-field mt-1.5"
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
              >
                {TONES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="topic">Subject / topic (optional)</FieldLabel>
              <input
                id="topic"
                className="wm-field mt-1.5"
                placeholder="Leave blank to generate one"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>

          {error ? <ValidationMessage>{error}</ValidationMessage> : null}

          <ChromeButton type="submit" disabled={loading} className="w-full">
            {loading ? "Generating…" : "Generate Email"}
          </ChromeButton>
          <ResponsibleAiNotice />
        </form>

        <Panel>
          <ResultHeader
            onCopy={copy}
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
              <LoadingBar label="Drafting your email…" />
            ) : result ? (
              <ResultSection heading="Editable draft">
                <textarea
                  aria-label="Generated email"
                  className="mt-2 min-h-[22rem] w-full resize-y rounded-md bg-white text-sm leading-relaxed text-ink focus:outline-none"
                  value={result}
                  onChange={(e) => {
                    setResult(e.target.value);
                    setCopied(false);
                  }}
                />
              </ResultSection>
            ) : (
              <EmptyResult>
                Fill in the brief and select <strong>Generate Email</strong> —
                your draft appears here, ready to edit and copy.
              </EmptyResult>
            )}
          </div>
        </Panel>
      </div>
    </main>
  );
}
