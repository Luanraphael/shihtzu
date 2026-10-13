import type { PlanConfig } from "../config/offer.ts";

/** "R$ 19,96" */
export function brl(v: number): string {
  return `R$ ${v.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** Number part only: "19,96" */
export function brlNumber(v: number): string {
  return v.toFixed(2).replace(".", ",");
}

/** Price actually charged now for a plan (discounted only while the coupon is valid). */
export function chargedPrice(plan: PlanConfig, discountActive: boolean): number {
  return discountActive ? plan.discountedPrice : plan.fullPrice;
}

/** Per-day equivalent of the first period, rounded to cents. */
export function perDay(plan: PlanConfig, discountActive: boolean): number {
  return Math.round((chargedPrice(plan, discountActive) / plan.days) * 100) / 100;
}

/** Sanity check used by tests: discounted price must equal full price minus `percent`. */
export function discountMatches(plan: PlanConfig, percent: number): boolean {
  return Math.abs(plan.fullPrice * (1 - percent / 100) - plan.discountedPrice) < 0.011;
}

export function couponActive(coupon: { expiresAt: number | null } | null, now: number, enforce: boolean): boolean {
  if (!coupon) return false;
  if (!enforce || coupon.expiresAt === null) return true;
  return now < coupon.expiresAt;
}

/** Price shown on the plan line: per week for weekly plans, total otherwise. */
export function linePrice(plan: PlanConfig, discountActive: boolean): { full: number; now: number } {
  const div = plan.periodLabel ? plan.weeks : 1;
  const r = (v: number) => Math.round((v / div) * 100) / 100;
  return { full: r(plan.fullPrice), now: r(chargedPrice(plan, discountActive)) };
}
