import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("wm-panel p-5", className)}>{children}</div>;
}

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-mono text-xs uppercase tracking-wider text-chrome-ink"
    >
      {children}
    </label>
  );
}

export function ChromeButton({
  type = "button",
  onClick,
  disabled,
  className,
  children,
}: {
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "wm-sheen wm-chrome-btn rounded-md px-4 py-2.5 text-sm font-semibold active:translate-y-px disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  onClick,
  disabled,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md bg-white px-2.5 py-1 text-xs text-ink shadow-[0_0_0_1px_var(--color-line)] transition-shadow hover:shadow-[0_0_0_1px_hsl(206_58%_46%/0.6)] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function ValidationMessage({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="font-mono text-xs text-gold">
      {children}
    </p>
  );
}

export function ResponsibleAiNotice() {
  return (
    <p className="text-xs leading-relaxed text-muted">
      AI-generated content may contain errors. Users should review and verify
      generated information before using it professionally. WorkMate AI assists
      your judgment — it does not replace it.
    </p>
  );
}

export function LoadingBar({ label }: { label: string }) {
  return (
    <div aria-live="polite">
      <div className="h-2 rounded-full bg-paper wm-shimmer" />
      <p className="mt-2 font-mono text-[11px] text-muted">{label}</p>
    </div>
  );
}

export function ToolHeading({
  title,
  index,
}: {
  title: string;
  index: string;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-line pb-3">
      <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
      <span className="font-mono text-xs text-muted">{index} / 03 tools</span>
    </div>
  );
}

export function ResultHeader({
  onCopy,
  onClear,
  onRegenerate,
  copied,
  disabled,
  regenerateLabel = "Regenerate",
}: {
  onCopy: () => void;
  onClear: () => void;
  onRegenerate: () => void;
  copied: boolean;
  disabled: boolean;
  regenerateLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="font-mono text-xs uppercase tracking-wider text-chrome-ink">
        Result
      </span>
      <span className="ml-auto flex gap-2 text-xs">
        <GhostButton onClick={onCopy} disabled={disabled}>
          {copied ? "Copied" : "Copy"}
        </GhostButton>
        <GhostButton onClick={onClear} disabled={disabled}>
          Clear
        </GhostButton>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={disabled}
          className="wm-chrome-btn rounded-md px-2.5 py-1 text-xs font-semibold active:translate-y-px disabled:opacity-50"
        >
          {regenerateLabel}
        </button>
      </span>
    </div>
  );
}

export function ResultSection({
  heading,
  delay = 0,
  children,
}: {
  heading: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <section
      className="animate-[wm-rise_0.5s_cubic-bezier(0.32,0.72,0,1)_both]"
      style={{ animationDelay: `${delay}s` }}
    >
      <h2 className="font-mono text-[11px] uppercase tracking-wider text-chrome-ink">
        {heading}
      </h2>
      {children}
    </section>
  );
}

export function EmptyResult({ children }: { children: ReactNode }) {
  return (
    <p className="py-10 text-center text-sm text-muted">{children}</p>
  );
}
