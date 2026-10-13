import type { Answers, Command, HomeIssue, PottyIssue, Reason, WalkingIssue } from "./types.ts";
import { addDays, compare, fromISO, localToday, type LocalDate } from "./dates.ts";

const female = (a: Answers) => a.gender === "female";

/** "ele" / "ela" */
export const pron = (a: Answers) => (female(a) ? "ela" : "ele");
/** "dele" / "dela" */
export const pronOf = (a: Answers) => (female(a) ? "dela" : "dele");
/** gendered adjective: g(a, "sozinho", "sozinha") */
export const g = (a: Answers, m: string, f: string) => (female(a) ? f : m);

/** Pet's name when given, otherwise "seu Shih Tzu". */
export function petRef(a: Answers): string {
  return a.petName ? a.petName : "seu Shih Tzu";
}
/** Capitalised start of sentence: "Mel" / "Seu Shih Tzu". */
export function PetRef(a: Answers): string {
  return a.petName ? a.petName : "Seu Shih Tzu";
}

/** Normalises the typed name: trims, collapses spaces, capitalises each word (keeps accents). */
export function cleanName(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 24)
    .split(" ")
    .map((w) => (w ? w[0].toLocaleUpperCase("pt-BR") + w.slice(1) : w))
    .join(" ");
}

const POTTY_PHRASE: Record<Exclude<PottyIssue, "ok">, (a: Answers) => string> = {
  everywhere: () => "faz xixi ou cocô em vários lugares da casa",
  night: () => "faz xixi fora do lugar durante a noite",
  alone: (a) => `faz xixi ou cocô fora do lugar quando fica ${g(a, "sozinho", "sozinha")}`,
};
const HOME_PHRASE: Record<HomeIssue, (a: Answers) => string> = {
  biting: () => "fica mordendo as mãos e os pés",
  barking: () => "late sem parar",
  chewing: () => "morde e destrói móveis e objetos",
  anxiety: (a) => `fica muito ${g(a, "ansioso", "ansiosa")} quando está ${g(a, "sozinho", "sozinha")}`,
};
const WALK_PHRASE: Record<Exclude<WalkingIssue, "no-walks">, () => string> = {
  pulling: () => "puxa muito a coleira",
  "eating-trash": () => "tenta comer lixo ou sujeira da rua",
  "barks-dogs": () => "late para outros cachorros",
  "barks-people": () => "late para as pessoas",
};

/** Every behaviour the lead actually marked, in the order the quiz asked them. */
export function selectedBehaviours(a: Answers): string[] {
  const out: string[] = [];
  for (const p of a.pottyIssues) if (p !== "ok") out.push(POTTY_PHRASE[p](a));
  for (const h of a.homeIssues) out.push(HOME_PHRASE[h](a));
  for (const w of a.walkingIssues) if (w !== "no-walks") out.push(WALK_PHRASE[w]());
  return out;
}

/** "a", "a e b", "a, b e c" */
export function joinPt(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

/** Up to three real behaviours, as a sentence tail: "late sem parar e puxa muito a coleira". */
export function behaviourSummary(a: Answers, max = 3): string | null {
  const list = selectedBehaviours(a).slice(0, max);
  return list.length ? joinPt(list) : null;
}

const TOPIC: Record<string, string> = {
  potty: "o xixi e o cocô no lugar certo",
  biting: "as mordidas",
  barking: "os latidos",
  chewing: "a mania de destruir objetos",
  anxiety: "a ansiedade quando fica só",
  walking: "os passeios",
};

/** 1–2 short topics for the third loading bar ("Selecionando treinos para melhorar os latidos e os passeios"). */
export function loadingTopics(a: Answers): string | null {
  const t: string[] = [];
  if (a.pottyIssues.some((p) => p !== "ok")) t.push(TOPIC.potty);
  for (const h of a.homeIssues) t.push(TOPIC[h]);
  if (a.walkingIssues.some((w) => w !== "no-walks")) t.push(TOPIC.walking);
  return t.length ? joinPt(t.slice(0, 2)) : null;
}

/** Short labels for the plan card ("Comportamentos para trabalhar"). */
export function behaviourLabels(a: Answers): string[] {
  const out: string[] = [];
  if (a.pottyIssues.some((p) => p !== "ok")) out.push("Xixi e cocô fora do lugar");
  const home: Record<HomeIssue, string> = {
    biting: "Mordidas",
    barking: "Latidos",
    chewing: "Destruir objetos",
    anxiety: "Ansiedade quando fica só",
  };
  for (const h of a.homeIssues) out.push(home[h]);
  const walk: Partial<Record<WalkingIssue, string>> = {
    pulling: "Puxar a coleira",
    "eating-trash": "Comer lixo na rua",
    "barks-dogs": "Latir para cachorros",
    "barks-people": "Latir para pessoas",
  };
  for (const w of a.walkingIssues) if (walk[w]) out.push(walk[w]!);
  return out;
}

export const COMMAND_COUNT = 11;
export const knownCount = (cmds: Command[]) => new Set(cmds).size;

export interface ChartGoal {
  known: number;
  /** goal headline number ("mais de 9") or null when the dog already knows 9+ (improvement goal) */
  target: number | null;
  date: LocalDate;
}

/**
 * Goal shown on the chart. Briefing §N: date = visitor's local today + exactly 7 days; goal
 * "mais de 9 comandos" presented as a goal; if the dog already knows 9 or more commands the
 * chart switches to an improvement goal instead of a regressive/meaningless number.
 */
export function chartGoal(a: Answers, now: Date = new Date()): ChartGoal {
  const known = knownCount(a.knownCommands);
  return { known, target: known >= 9 ? null : 9, date: addDays(localToday(now), 7) };
}

/** Level label for the plan card, from the number of known commands. */
export function levelLabel(known: number): string {
  if (known <= 3) return "Iniciante";
  if (known <= 7) return "Intermediário";
  return "Avançado";
}

/** True if a future event date is still ahead of today (never present it as already happened). */
export function eventIsFuture(a: Answers, now: Date = new Date()): boolean {
  if (a.eventStatus !== "scheduled" || !a.eventDate) return false;
  const d = fromISO(a.eventDate);
  return !!d && compare(d, localToday(now)) >= 0;
}

export const REASON_DATE_TITLE: Record<Exclude<Reason, "well-behaved">, string> = {
  adoption: "🐶 Que legal! Quando seu novo Shih Tzu vai chegar?",
  baby: "💙 Que notícia boa! Quando o bebê vai chegar?",
  moving: "🏠 Casa nova! Quando vai ser sua mudança?",
  marriage: "❤️ Que fase especial! Quando essa novidade vai acontecer?",
  work: "🕒 Entendi! Quando seu horário de trabalho vai mudar?",
  travel: "✈️ Que legal! Quando você vai viajar?",
  guests: "🏡 Legal! Quando você vai receber visitas?",
};

const MONTH_ABBR = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Coupon named after the dog, like the reference ("Mel_oct26" → "Mel_out26"). */
export function couponCode(a: Answers, now: Date = new Date()): string {
  const base = (a.petName || "ShihTzu").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]/g, "") || "ShihTzu";
  return `${base}_${MONTH_ABBR[now.getMonth()]}${String(now.getFullYear()).slice(-2)}`;
}
