/**
 * WorkMate AI — generation layer.
 *
 * Every tool in the app talks to the app through the three async functions at
 * the bottom of this file. They currently run locally (deterministic drafting
 * heuristics, no network) so the whole product workflow works end to end.
 *
 * To connect a real AI provider later, replace ONLY the bodies of
 * `generateEmail`, `summarizeMeeting` and `createPlan` with a call to a server
 * function / API route. The exported types are the contract the UI depends on
 * and should stay stable.
 *
 * Guardrails encoded here (and to be repeated in any future prompt):
 *  - Never invent facts that are not in the user's input.
 *  - Missing owner/deadline is reported as "Not specified", never guessed.
 *  - Tasks are never dropped or deleted, only prioritised and recommended.
 */

export const NOT_SPECIFIED = "Not specified";

export const TONES = [
  "Professional",
  "Formal",
  "Informal",
  "Friendly",
  "Persuasive",
] as const;
export type Tone = (typeof TONES)[number];

export const IMPORTANCE_LEVELS = ["High", "Medium", "Low"] as const;
export type Importance = (typeof IMPORTANCE_LEVELS)[number];

export type PlanHorizon = "Daily Plan" | "Weekly Plan";

/* -------------------------------------------------------------------------- */
/* Email generator                                                            */
/* -------------------------------------------------------------------------- */

export interface EmailRequest {
  audience: string;
  purpose: string;
  context: string;
  tone: Tone;
  topic?: string;
}

export interface EmailDraft {
  subject: string;
  greeting: string;
  body: string[];
  closing: string;
}

/* -------------------------------------------------------------------------- */
/* Meeting summarizer                                                         */
/* -------------------------------------------------------------------------- */

export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
}

export interface MeetingSummary {
  summary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  followUps: string[];
}

/* -------------------------------------------------------------------------- */
/* Task planner                                                               */
/* -------------------------------------------------------------------------- */

export interface PlannerTask {
  id: string;
  description: string;
  deadline: string;
  duration: string;
  importance: Importance;
  notes: string;
}

export interface PlanAllocation {
  slot: string;
  task: string;
}

export interface TaskPlan {
  horizon: PlanHorizon;
  high: PlannerTask[];
  medium: PlannerTask[];
  low: PlannerTask[];
  order: string[];
  allocation: PlanAllocation[];
  recommendations: string[];
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function sentences(text: string): string[] {
  return text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim().replace(/^[-*•\d.)\s]+/, "").trim())
    .filter((s) => s.length > 1);
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function endWithPeriod(value: string): string {
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

const GREETINGS: Record<Tone, (audience: string) => string> = {
  Professional: (a) => `Dear ${a},`,
  Formal: (a) => `Dear ${a},`,
  Informal: (a) => `Hi ${a},`,
  Friendly: (a) => `Hello ${a},`,
  Persuasive: (a) => `Hello ${a},`,
};

const OPENERS: Record<Tone, string> = {
  Professional: "I hope this message finds you well.",
  Formal: "I trust this correspondence reaches you well.",
  Informal: "Hope you're doing well.",
  Friendly: "Hope your week is going well so far.",
  Persuasive: "I am reaching out with something I believe is worth your time.",
};

const CLOSINGS: Record<Tone, string> = {
  Professional: "Kind regards,",
  Formal: "Yours sincerely,",
  Informal: "Thanks,",
  Friendly: "Best wishes,",
  Persuasive: "Looking forward to your response,",
};

const REQUESTS: Record<Tone, string> = {
  Professional: "Please let me know if you need any further detail from my side.",
  Formal: "I would be grateful for your confirmation at your earliest convenience.",
  Informal: "Let me know what you think when you get a moment.",
  Friendly: "Happy to talk it through whenever suits you.",
  Persuasive: "I would welcome the opportunity to discuss the benefits in more detail.",
};

/* -------------------------------------------------------------------------- */
/* Generation functions — swap these bodies for a real AI call                */
/* -------------------------------------------------------------------------- */

export async function generateEmail(request: EmailRequest): Promise<EmailDraft> {
  await delay(1100);

  const audience = request.audience.trim();
  const purpose = request.purpose.trim();
  const context = request.context.trim();
  const topic = request.topic?.trim();

  const subjectCore = topic || titleCase(purpose.replace(/^(to|about)\s+/i, ""));
  const subject =
    request.tone === "Formal" || request.tone === "Professional"
      ? titleCase(subjectCore).replace(/\.$/, "")
      : `${titleCase(subjectCore).replace(/\.$/, "")}`;

  const body: string[] = [OPENERS[request.tone]];

  body.push(
    request.tone === "Persuasive"
      ? `I am writing to ${purpose.replace(/^i am writing to\s+/i, "")} — and I think it lines up closely with your priorities.`
      : `I am writing to ${purpose.replace(/^i am writing to\s+/i, "")}.`,
  );

  if (context) {
    const detail = sentences(context);
    if (detail.length > 1) {
      body.push(detail.map(endWithPeriod).join(" "));
    } else {
      body.push(endWithPeriod(titleCase(context)));
    }
  }

  body.push(REQUESTS[request.tone]);

  return {
    subject,
    greeting: GREETINGS[request.tone](audience),
    body,
    closing: CLOSINGS[request.tone],
  };
}

const DECISION_HINTS = ["decided", "agreed", "approved", "signed off", "concluded", "resolved"];
const ACTION_HINTS = ["will ", "to do", "action", "follow up", "send", "prepare", "draft", "review", "assign", "schedule", "must ", "needs to", "should "];
const FOLLOWUP_HINTS = ["follow up", "next meeting", "revisit", "check back", "pending", "await", "tbc", "to be confirmed"];

const OWNER_PATTERN = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\b(?=\s+(?:will|to|is|should|must|owns|takes))/;
const DEADLINE_PATTERN =
  /\b(?:by|before|due|on|until)\s+([A-Z]?[a-z0-9]+(?:\s\d{1,2}(?:st|nd|rd|th)?)?(?:\s\d{4})?|\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)/i;

export async function summarizeMeeting(notes: string): Promise<MeetingSummary> {
  await delay(1200);

  const lines = sentences(notes);
  const lower = (s: string) => s.toLowerCase();

  const decisions = lines.filter((l) => DECISION_HINTS.some((h) => lower(l).includes(h)));
  const actionLines = lines.filter(
    (l) => ACTION_HINTS.some((h) => lower(l).includes(h)) && !decisions.includes(l),
  );
  const followUps = lines.filter((l) => FOLLOWUP_HINTS.some((h) => lower(l).includes(h)));
  const keyPoints = lines.filter((l) => !decisions.includes(l) && !actionLines.includes(l));

  const actionItems: ActionItem[] = actionLines.map((line) => {
    const owner = OWNER_PATTERN.exec(line)?.[1];
    const deadline = DEADLINE_PATTERN.exec(line)?.[1];
    return {
      task: endWithPeriod(titleCase(line)),
      owner: owner ?? NOT_SPECIFIED,
      deadline: deadline ? titleCase(deadline.trim()) : NOT_SPECIFIED,
    };
  });

  const summary =
    lines.length === 0
      ? NOT_SPECIFIED
      : `The notes cover ${lines.length} recorded point${lines.length === 1 ? "" : "s"}, including ${decisions.length} decision${decisions.length === 1 ? "" : "s"} and ${actionItems.length} action item${actionItems.length === 1 ? "" : "s"}. ${endWithPeriod(titleCase(lines[0]!))}`;

  return {
    summary,
    keyPoints: (keyPoints.length ? keyPoints : lines).slice(0, 8).map((l) => endWithPeriod(titleCase(l))),
    decisions: decisions.map((l) => endWithPeriod(titleCase(l))),
    actionItems,
    followUps: followUps.map((l) => endWithPeriod(titleCase(l))),
  };
}

function urgencyScore(task: PlannerTask): number {
  let score = task.importance === "High" ? 3 : task.importance === "Medium" ? 2 : 1;
  if (task.deadline) {
    const due = new Date(task.deadline);
    if (!Number.isNaN(due.getTime())) {
      const days = (due.getTime() - Date.now()) / 86_400_000;
      if (days <= 1) score += 3;
      else if (days <= 3) score += 2;
      else if (days <= 7) score += 1;
    }
  }
  return score;
}

export async function createPlan(
  tasks: PlannerTask[],
  horizon: PlanHorizon,
): Promise<TaskPlan> {
  await delay(1200);

  const ranked = [...tasks].sort((a, b) => urgencyScore(b) - urgencyScore(a));

  const high = ranked.filter((t) => urgencyScore(t) >= 5);
  const medium = ranked.filter((t) => urgencyScore(t) === 3 || urgencyScore(t) === 4);
  const low = ranked.filter((t) => urgencyScore(t) <= 2);

  const dailySlots = [
    "08:30 – 10:00 (deep focus)",
    "10:15 – 11:30",
    "11:45 – 13:00",
    "14:00 – 15:30",
    "15:45 – 17:00",
  ];
  const weeklySlots = [
    "Monday — focus block",
    "Tuesday — focus block",
    "Wednesday — focus block",
    "Thursday — focus block",
    "Friday — wrap-up & review",
  ];
  const slots = horizon === "Daily Plan" ? dailySlots : weeklySlots;

  const allocation: PlanAllocation[] = ranked.map((task, index) => ({
    slot: slots[index % slots.length] ?? `Overflow slot ${index + 1}`,
    task: `${task.description}${task.duration ? ` · est. ${task.duration}` : ""}`,
  }));

  const recommendations = [
    high.length > 2
      ? `You have ${high.length} high-priority items. Consider whether any can be delegated or renegotiated — nothing here has been removed for you.`
      : "Start with the highest-priority item while your focus is freshest.",
    horizon === "Daily Plan"
      ? "Protect one uninterrupted 90-minute block for the most demanding task."
      : "Group similar tasks on the same day to reduce context switching across the week.",
    tasks.some((t) => !t.deadline)
      ? "Some tasks have no deadline recorded (Not specified) — adding one improves the ordering."
      : "Review the plan at the end of the period and carry unfinished tasks forward deliberately.",
    "This ordering is a recommendation only. You keep the final decision on what to do and when.",
  ];

  return {
    horizon,
    high,
    medium,
    low,
    order: ranked.map((t) => t.description),
    allocation,
    recommendations,
  };
}
