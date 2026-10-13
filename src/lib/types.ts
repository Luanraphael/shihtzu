export type Gender = "female" | "male";
export type AgeRange = "0-6m" | "7-12m" | "1-2y" | "2-7y" | "7y+";
export type CoatColor =
  | "dourado-branco"
  | "preto-branco"
  | "tricolor"
  | "marrom-branco"
  | "preto"
  | "branco"
  | "outra";
export type Health = "healthy" | "vision" | "hearing" | "joints" | "teeth";
export type PottyIssue = "everywhere" | "night" | "alone" | "ok";
export type PottyGoal = "street" | "pad-then-street" | "pad" | "both" | "already";
export type HomeIssue = "biting" | "barking" | "chewing" | "anxiety";
export type WalkingIssue = "no-walks" | "pulling" | "eating-trash" | "barks-dogs" | "barks-people";
export type ActivityLevel = "high" | "medium" | "low";
export type Command =
  | "name"
  | "come"
  | "no"
  | "food-lure"
  | "paw"
  | "touch"
  | "look"
  | "stand"
  | "place"
  | "down"
  | "drop-it";
export type Reason =
  | "adoption"
  | "baby"
  | "moving"
  | "marriage"
  | "work"
  | "travel"
  | "guests"
  | "well-behaved";
export type EventStatus = "scheduled" | "past";
export type DailyTime = "10-15" | "15-20" | "20-30" | "30+";
export type PreviousTraining = "trainer" | "self" | "not-yet";
export type OwnerAge = "18-24" | "25-34" | "35-44" | "45-54" | "55+";
export type EnjoyTime = "love" | "sometimes" | "not-enough" | "challenge";

export interface Answers {
  gender: Gender | null;
  /** null = not asked yet, "" = "Prefiro não dizer". */
  petName: string | null;
  ageRange: AgeRange | null;
  coatColor: CoatColor | null;
  health: Health[];
  pottyIssues: PottyIssue[];
  pottyGoal: PottyGoal | null;
  homeIssues: HomeIssue[];
  irritationScore: number | null;
  walkingIssues: WalkingIssue[];
  activityLevel: ActivityLevel | null;
  knownCommands: Command[];
  obedienceScore: number | null;
  /** Single choice in the reference (selecting another option replaces it). */
  trainingReason: Reason | null;
  eventType: Reason | null;
  eventStatus: EventStatus | null;
  /** Local calendar date, ISO `YYYY-MM-DD` (never a UTC timestamp). */
  eventDate: string | null;
  dailyTime: DailyTime | null;
  previousTraining: PreviousTraining | null;
  ownerAge: OwnerAge | null;
  bondScore: number | null;
  enjoyTime: EnjoyTime | null;
  email: string | null;
  marketingOptIn: boolean | null;
}

export interface Coupon {
  code: string;
  percent: number;
  /** epoch ms when the card was revealed */
  revealedAt: number;
  /** epoch ms when the reserved discount stops being valid (null = no expiry) */
  expiresAt: number | null;
}

export interface FunnelState {
  answers: Answers;
  history: StepId[];
  coupon: Coupon | null;
  selectedPlan: string | null;
  startedAt: number;
}

export type StepId =
  | "start"
  | "gender"
  | "name"
  | "age"
  | "coat"
  | "health"
  | "info_coat"
  | "loading_behavior"
  | "potty"
  | "potty_goal"
  | "issues"
  | "st_irritation"
  | "walking"
  | "activity"
  | "info_summary"
  | "commands"
  | "st_ignore"
  | "reason"
  | "date"
  | "predict"
  | "training_time"
  | "training"
  | "st_bond"
  | "creating"
  | "plan"
  | "cards";

export const EMPTY_ANSWERS: Answers = {
  gender: null,
  petName: null,
  ageRange: null,
  coatColor: null,
  health: [],
  pottyIssues: [],
  pottyGoal: null,
  homeIssues: [],
  irritationScore: null,
  walkingIssues: [],
  activityLevel: null,
  knownCommands: [],
  obedienceScore: null,
  trainingReason: null,
  eventType: null,
  eventStatus: null,
  eventDate: null,
  dailyTime: null,
  previousTraining: null,
  ownerAge: null,
  bondScore: null,
  enjoyTime: null,
  email: null,
  marketingOptIn: null,
};
