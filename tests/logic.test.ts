import { test } from "node:test";
import assert from "node:assert/strict";
import { EMPTY_ANSWERS, type Answers } from "../src/lib/types.ts";
import { STEP_ORDER, nextStep, progressFor, DATED_REASONS } from "../src/lib/flow.ts";
import { addDays, formatPtBR, localToday, toISO } from "../src/lib/dates.ts";
import { behaviourSummary, chartGoal, cleanName, couponCode, loadingTopics, REASON_DATE_TITLE } from "../src/lib/personalize.ts";
import { brl, couponActive, discountMatches, perDay } from "../src/lib/pricing.ts";
import { OFFER } from "../src/config/offer.ts";

const A = (p: Partial<Answers> = {}): Answers => ({ ...EMPTY_ANSWERS, ...p });

/** Walks the funnel the way the store does, answering with `a`. */
function walk(a: Answers): string[] {
  const path: string[] = ["start"];
  let cur = "start" as (typeof STEP_ORDER)[number];
  for (let i = 0; i < 60; i++) {
    const n = nextStep(cur, a);
    path.push(n);
    if (n === "offer") break;
    cur = n;
  }
  return path;
}

test("order follows the reference (customV18) and ends at the offer", () => {
  const p = walk(A({ trainingReason: "travel", eventStatus: "past" }));
  assert.deepEqual(p.slice(0, 9), ["start", "gender", "name", "age", "coat", "health", "info_coat", "loading_behavior", "potty"]);
  assert.ok(!p.includes("owner_age" as never) && !p.includes("receive_email" as never));
  assert.equal(p[p.indexOf("st_bond") + 1], "creating");
  assert.equal(p[p.indexOf("email") + 1], "cards");
  assert.equal(p.at(-1), "offer");
  assert.equal(p.at(-2), "cards");
  assert.ok(p.indexOf("st_irritation") === p.indexOf("issues") + 1);
  assert.ok(p.indexOf("info_summary") === p.indexOf("activity") + 1);
});

test("each of the 7 dated reasons goes to its own date question and then to the chart", () => {
  assert.equal(DATED_REASONS.length, 7);
  for (const r of DATED_REASONS) {
    assert.equal(nextStep("reason", A({ trainingReason: r })), "date");
    assert.ok(REASON_DATE_TITLE[r as keyof typeof REASON_DATE_TITLE].length > 10);
    assert.equal(nextStep("date", A({ trainingReason: r, eventStatus: "past" })), "predict");
    assert.equal(nextStep("date", A({ trainingReason: r, eventStatus: "scheduled", eventDate: "2026-12-01" })), "predict");
  }
  const titles = new Set(Object.values(REASON_DATE_TITLE));
  assert.equal(titles.size, 7, "no generic/duplicated date question");
});

test("reason 8 and 'Nenhuma' skip date and chart (reference behaviour)", () => {
  assert.equal(nextStep("reason", A({ trainingReason: "well-behaved" })), "training_time");
  assert.equal(nextStep("reason", A({ trainingReason: null })), "training_time");
  const p = walk(A({ trainingReason: "well-behaved" }));
  assert.ok(!p.includes("date") && !p.includes("predict"));
});

test("'Pular esta pergunta' on the date skips the chart too", () => {
  assert.equal(nextStep("date", A({ trainingReason: "baby", eventStatus: null })), "training_time");
});

test("progress segments", () => {
  assert.deepEqual(progressFor("gender")!.fills, [0.2, 0, 0]);
  assert.deepEqual(progressFor("health")!.fills, [1, 0, 0]);
  assert.equal(progressFor("potty")!.title, "Problemas de comportamento");
  assert.equal(progressFor("cards"), null);
});

test("today + 7 uses the local calendar and rolls months/years", () => {
  assert.equal(formatPtBR(addDays(localToday(new Date(2026, 9, 12, 23, 59)), 7)), "19 de outubro");
  assert.equal(toISO(addDays({ y: 2026, m: 10, d: 28 }, 7)), "2026-11-04");
  assert.equal(toISO(addDays({ y: 2026, m: 12, d: 29 }, 7)), "2027-01-05");
  assert.equal(toISO(addDays({ y: 2028, m: 2, d: 25 }, 7)), "2028-03-03"); // leap year
  // just after midnight local time must not fall back to "yesterday" (UTC bug)
  assert.equal(toISO(localToday(new Date(2026, 9, 13, 0, 5))), "2026-10-13");
});

test("chart goal: 'mais de 9' as a goal, improvement goal at 9+ commands, never regressive", () => {
  const now = new Date(2026, 9, 12, 10);
  assert.equal(chartGoal(A({ knownCommands: [] }), now).target, 9);
  assert.equal(chartGoal(A({ knownCommands: ["name", "come", "no"] }), now).known, 3);
  const nine = A({ knownCommands: ["name", "come", "no", "food-lure", "paw", "touch", "look", "stand", "place"] });
  assert.equal(chartGoal(nine, now).target, null);
  assert.equal(formatPtBR(chartGoal(nine, now).date), "19 de outubro");
});

test("behaviour summary: max 3, only selected, natural Portuguese, zero → null", () => {
  assert.equal(behaviourSummary(A()), null);
  assert.equal(behaviourSummary(A({ pottyIssues: ["ok"], walkingIssues: ["no-walks"] })), null);
  assert.equal(behaviourSummary(A({ homeIssues: ["barking"] })), "late sem parar");
  assert.equal(
    behaviourSummary(A({ homeIssues: ["barking", "biting"], walkingIssues: ["pulling", "barks-dogs"] })),
    "late sem parar, fica mordendo as mãos e os pés e puxa muito a coleira",
  );
  assert.match(behaviourSummary(A({ gender: "female", homeIssues: ["anxiety"] }))!, /ansiosa quando está sozinha/);
  assert.equal(loadingTopics(A()), null);
  assert.equal(loadingTopics(A({ homeIssues: ["barking"], walkingIssues: ["pulling"] })), "os latidos e os passeios");
});

test("name cleanup keeps accents and capitalises", () => {
  assert.equal(cleanName("  joão   pedro "), "João Pedro");
  assert.equal(cleanName("ÉLLA"), "ÉLLA");
});

test("prices: discounted = full − 60%, per-day maths, BRL format", () => {
  for (const p of OFFER.plans) assert.ok(discountMatches(p, OFFER.coupon.percent), p.id);
  assert.equal(brl(1234.5), "R$ 1.234,50");
  const p = OFFER.plans[1];
  assert.equal(perDay(p, true), Math.round((p.discountedPrice / p.days) * 100) / 100);
});

test("coupon validity follows the real reservation window", () => {
  assert.equal(couponActive(null, 0, true), false);
  assert.equal(couponActive({ expiresAt: null }, 0, true), true);
  assert.equal(couponActive({ expiresAt: 1000 }, 999, true), true);
  assert.equal(couponActive({ expiresAt: 1000 }, 1000, true), false);
  assert.equal(couponActive({ expiresAt: 1000 }, 5000, false), true);
});

test("coupon is named after the dog", () => {
  const now = new Date(2026, 9, 12);
  assert.equal(couponCode(A({ petName: "Mel" }), now), "Mel_out26");
  assert.equal(couponCode(A({ petName: "Thor Júnior" }), now), "ThorJunior_out26");
  assert.equal(couponCode(A(), now), "ShihTzu_out26");
});

test("plans: R$ 37,90 / 67,90 / 97,00 and the longer plan has the lower daily price", () => {
  const [a, b, c] = OFFER.plans;
  assert.deepEqual([a.discountedPrice, b.discountedPrice, c.discountedPrice], [37.9, 67.9, 97]);
  assert.ok(perDay(a, true) > perDay(b, true) && perDay(b, true) > perDay(c, true));
});
