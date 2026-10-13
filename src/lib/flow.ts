import type { Answers, Reason, StepId } from "./types.ts";

/** Step order of the reference (`customV18`, the array `config=customV2` resolves to). */
export const STEP_ORDER: StepId[] = [
  "start",
  "gender",
  "name",
  "age",
  "coat",
  "health",
  "info_coat",
  "loading_behavior",
  "potty",
  "potty_goal",
  "issues",
  "st_irritation",
  "walking",
  "activity",
  "info_summary",
  "commands",
  "st_ignore",
  "reason",
  "date",
  "predict",
  "training_time",
  "training",
  "st_bond",
  "creating",
  "plan",
  "email",
  "cards",
];

export interface Section {
  title: string;
  steps: StepId[];
}

/** The three segments of the reference progress bar (`progressTitle` text1/text2/text3). */
export const SECTIONS: Section[] = [
  { title: "Sobre o seu Shih Tzu", steps: ["gender", "name", "age", "coat", "health"] },
  {
    title: "Problemas de comportamento",
    steps: ["potty", "potty_goal", "issues", "st_irritation", "walking", "activity"],
  },
  {
    title: "Visão geral do treino",
    steps: ["commands", "st_ignore", "reason", "date", "predict", "training_time", "training", "st_bond"],
  },
];

export type HeaderMode = "full" | "logo" | "none";

/** `hideHeader` / `hideProgress` flags of the reference config. */
export function headerMode(step: StepId): HeaderMode {
  if (["start", "info_coat", "loading_behavior", "info_summary", "predict", "cards"].includes(step)) return "none";
  if (["creating", "plan", "email"].includes(step)) return "logo";
  return "full";
}

/** Fill (0..1) of each of the three progress segments for a step. */
export function progressFor(step: StepId): { title: string; fills: number[] } | null {
  const idx = SECTIONS.findIndex((s) => s.steps.includes(step));
  if (idx === -1) return null;
  const pos = SECTIONS[idx].steps.indexOf(step);
  const fills = SECTIONS.map((s, i) => (i < idx ? 1 : i > idx ? 0 : (pos + 1) / s.steps.length));
  return { title: SECTIONS[idx].title, fills };
}

/** Reasons 1–7 have a date question; reason 8 and "Nenhuma" skip it. */
export const DATED_REASONS: Reason[] = ["adoption", "baby", "moving", "marriage", "work", "travel", "guests"];

export function hasDateQuestion(reason: Reason | null): boolean {
  return reason !== null && DATED_REASONS.includes(reason);
}

/**
 * Next step after `current`, applying the branches observed in the reference:
 * - reason 8 / "Nenhuma" → skip date AND chart (reference jumps straight to training time);
 * - date skipped ("Pular esta pergunta") → skip the chart too (`numberOfSteps: 2`);
 * - date answered or "Já aconteceu" → chart.
 */
export function nextStep(current: StepId, a: Answers): StepId | "offer" {
  if (current === "reason") return hasDateQuestion(a.trainingReason) ? "date" : "training_time";
  if (current === "date") return a.eventStatus ? "predict" : "training_time";
  const i = STEP_ORDER.indexOf(current);
  return i === STEP_ORDER.length - 1 ? "offer" : STEP_ORDER[i + 1];
}
