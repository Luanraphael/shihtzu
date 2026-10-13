/**
 * Commercial configuration of the Shih Tzu offer.
 *
 * Everything here belongs to the real operation and must be filled/approved by the person
 * responsible for the offer before publishing. Values flagged `approved: false` are placeholders:
 * the sales page shows a visible "configuração pendente" strip and disables checkout links while
 * any of them is unapproved, so placeholder prices can never be sold by accident.
 *
 * Claims (`claims.*`) stay OFF until there is documentation backing them; every component that
 * would show a claim falls back to a neutral, true sentence.
 */

export type PlanId = "plan7d" | "plan4w" | "plan12w";

export interface PlanConfig {
  id: PlanId;
  /** Title shown on the plan card (reference: "Plano de sete dias" / "4 semanas" / "12 semanas"). */
  title: string;
  /** Length of the first billing period, used for the per-day equivalent. */
  days: number;
  /** Weeks in the period; plans with `periodLabel` show their price per week. */
  weeks: number;
  /** Full price (strikethrough) = discounted price / 0.4, in BRL. */
  fullPrice: number;
  /** Price with the 60% coupon applied, in BRL. */
  discountedPrice: number;
  /** "semanalmente" style subtitle under the price, or null. */
  periodLabel: string | null;
  mostPopular: boolean;
  /** Checkout URL with the coupon applied / without it (after the reservation expires). */
  checkoutUrl: string;
  checkoutUrlNoDiscount: string;
}

export const OFFER = {
  /** Set to true only after brand, prices, coupon, checkout links and guarantee were approved. */
  approved: true,

  brand: {
    name: "Shih Tzu Class",
    supportEmail: "suporte@exemplo.com.br",
    companyLine: "Razão social · CNPJ 00.000.000/0000-00",
    privacyUrl: "#politica-de-privacidade",
    termsUrl: "#termos-de-uso",
  },

  coupon: {
    code: "SHIHTZU60",
    percent: 60,
  },

  /**
   * Discount reservation. When `enforce` is true the countdown is real: after it reaches zero the
   * page switches to full prices and `checkoutUrlNoDiscount`. If the discount does not expire,
   * set `enabled: false` (the countdown bar is then hidden instead of faking urgency).
   */
  countdown: { enabled: true, minutes: 10, enforce: false },

  currency: "BRL",

  plans: [
    {
      id: "plan7d",
      title: "Plano de 7 dias",
      days: 7,
      weeks: 1,
      fullPrice: 92.5,
      discountedPrice: 37,
      periodLabel: null,
      mostPopular: false,
      checkoutUrl: "https://payfast.greenn.com.br/redirect/797602",
      checkoutUrlNoDiscount: "https://payfast.greenn.com.br/redirect/797602",
    },
    {
      id: "plan4w",
      title: "Plano de 4 semanas",
      days: 28,
      weeks: 4,
      fullPrice: 167.5,
      discountedPrice: 67,
      periodLabel: "semanalmente",
      mostPopular: true,
      checkoutUrl: "https://payfast.greenn.com.br/redirect/797603",
      checkoutUrlNoDiscount: "https://payfast.greenn.com.br/redirect/797603",
    },
    {
      id: "plan12w",
      title: "Plano de 12 semanas",
      days: 84,
      weeks: 12,
      fullPrice: 242.5,
      discountedPrice: 97,
      periodLabel: "semanalmente",
      mostPopular: false,
      checkoutUrl: "https://payfast.greenn.com.br/redirect/797604",
      checkoutUrlNoDiscount: "https://payfast.greenn.com.br/redirect/797604",
    },
  ] satisfies PlanConfig[],

  /** Query-string name used to hand the lead e-mail to the checkout (empty = don't send). */
  checkoutEmailParam: "",

  guarantee: {
    /** Default is the legal right of withdrawal for online purchases in Brazil (CDC, art. 49). */
    days: 7,
    title: "Garantia de 7 dias",
    text:
      "Se você não ficar satisfeito, pode pedir o cancelamento em até 7 dias após a compra e receber o valor de volta, como garante o Código de Defesa do Consumidor (art. 49).",
  },

  claims: {
    /** "98% dos usuários notam mudanças em 1 semana" */
    percentPositive: null as null | { value: string; text: string },
    /** "treinadores certificados" */
    certifiedTrainers: false,
    /** "apenas 10 minutos por dia" — true only if the program has sessions of that length. */
    tenMinutesPerDay: false,
    /** Library sizes ("70+ aulas", "80+ jogos"). null = show without numbers. */
    lessonsCount: null as null | number,
    gamesCount: null as null | number,
  },

  /** Legit, authorised testimonials only. Empty = sections are hidden. */
  testimonials: [] as { author: string; title: string; text: string; avatar?: string }[],

  /** Meta Pixel of this offer. */
  tracking: {
    metaPixelId: "3655148451304408",
  },
} as const;

export type OfferConfig = typeof OFFER;

export function isOfferApproved(): boolean {
  return OFFER.approved && OFFER.plans.every((p) => p.checkoutUrl && p.checkoutUrlNoDiscount);
}
