"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, ChevronDown, ShieldCheck, Tag } from "lucide-react";
import s from "./Paywall.module.css";
import { useFunnel } from "@/lib/store";
import { OFFER, type PlanConfig } from "@/config/offer";
import { brlNumber, brl, chargedPrice, couponActive, linePrice, perDay } from "@/lib/pricing";
import { withTracking } from "@/lib/utm";
import { track } from "../MetaPixel";

const BENEFITS = [
  "Plano de treino personalizado para resultados duradouros",
  "Apenas 10 minutos de treino por dia",
  "Biblioteca de videoaulas fáceis de acompanhar",
  "Jogos e truques para ensinar novas habilidades",
  "Orientações sobre higiene, saúde e alimentação",
  "Treinos em casa e ao ar livre, sem equipamentos especiais",
];

const LEARN: [string, string][] = [
  ["Fazer xixi e cocô no lugar certo", "Seja no tapetinho higiênico ou na rua."],
  ["Parar de morder e destruir tudo pela casa", "Chinelos, móveis, objetos e até suas mãos!"],
  ["Latir menos e ficar mais tranquilo", "Mesmo quando chegam visitas ou passa alguém na rua."],
  ["Obedecer quando você chamar", "Aprender comandos como “vem”, “senta”, “fica”, “deita” e “solta”."],
  ["Passear sem ficar puxando a coleira", "Para você aproveitar os passeios sem passar estresse."],
  ["Ficar mais tranquilo quando estiver sozinho", "Aprendendo aos poucos a lidar melhor com a sua ausência."],
  ["Aprender novos comandos e truques", "Com treinos simples, no conforto da sua casa e respeitando o ritmo do seu Shih Tzu."],
];

const TESTIMONIALS = [1, 2, 3, 4].map((i) => `/img/depoimento-${i}.webp`);

const FAQ = [
  {
    q: "Em quanto tempo vou ver os primeiros resultados?",
    a: "Depende do seu Shih Tzu e da constância dos treinos. O plano é dividido em etapas curtas para você praticar todos os dias e acompanhar a evolução de perto.",
  },
  {
    q: "O plano substitui o veterinário?",
    a: "Não. Mudanças repentinas no xixi, no apetite ou no comportamento podem ter causa de saúde e devem ser avaliadas por um veterinário. O plano ajuda você a treinar em casa, no seu ritmo.",
  },
  {
    q: "Os resultados do treino são permanentes?",
    a: "Bons hábitos se mantêm com reforço. Continuando a praticar o que seu Shih Tzu aprendeu, os novos comportamentos tendem a ficar cada vez mais firmes.",
  },
];

const mmss = (ms: number) => {
  const t = Math.max(0, Math.ceil(ms / 1000));
  return [String(Math.floor(t / 60)).padStart(2, "0"), String(t % 60).padStart(2, "0")];
};

function GreenCheck() {
  return (
    <svg className={s.learnCheck} width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
      <rect width="26" height="26" rx="7" fill="#22b14c" />
      <path d="M7 13.4l4 4L19.4 9" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Testimonial showcase: two at a time, sliding one card every 3.5 s in an endless loop. */
function Showcase() {
  const n = TESTIMONIALS.length;
  const [i, setI] = useState(0);
  const [smooth, setSmooth] = useState(true);
  useEffect(() => {
    const id = window.setInterval(() => {
      setSmooth(true);
      setI((v) => v + 1);
    }, 3500);
    return () => window.clearInterval(id);
  }, []);
  // after sliding onto the cloned cards, jump back to the real first card without animation
  const onEnd = () => {
    if (i >= n) {
      setSmooth(false);
      setI(0);
    }
  };
  const loop = [...TESTIMONIALS, ...TESTIMONIALS.slice(0, 2)];
  return (
    <div className={s.showcase}>
      <div
        className={s.showcaseTrack}
        style={{ transform: `translateX(calc(${-i} * (50% + 5px)))`, transition: smooth ? undefined : "none" }}
        onTransitionEnd={onEnd}
      >
        {loop.map((src, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={k} className={s.showcaseItem} src={src} alt="Depoimento de aluno da Shih Tzu Class" width={700} height={1244} />
        ))}
      </div>
    </div>
  );
}

export function Paywall() {
  const f = useFunnel();
  const { answers: a, state } = f;
  const coupon = state.coupon;
  const [now, setNow] = useState(() => Date.now());
  const [faqOpen, setFaqOpen] = useState(0);
  const [ctaError, setCtaError] = useState("");
  const plans = OFFER.plans as readonly PlanConfig[];
  const selectedId = state.selectedPlan ?? plans.find((p) => p.mostPopular)?.id ?? plans[0].id;
  const selected = plans.find((p) => p.id === selectedId) ?? plans[0];

  // The discount reservation starts when the offer is first shown.
  useEffect(() => {
    if (!f.ready || !coupon || coupon.expiresAt !== null || !OFFER.countdown.enabled) return;
    f.setCoupon({ ...coupon, expiresAt: Date.now() + OFFER.countdown.minutes * 60_000 });
  }, [f, coupon]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (f.ready) track("ViewContent", { content_name: "oferta" });
  }, [f.ready]);

  const active = couponActive(coupon, now, OFFER.countdown.enforce);
  const remaining = coupon?.expiresAt ? coupon.expiresAt - now : null;
  const [mm, ss] = mmss(remaining ?? OFFER.countdown.minutes * 60_000);
  const showTimer = OFFER.countdown.enabled && !!coupon;
  const name = a.petName;

  const checkout = () => {
    const url = active ? selected.checkoutUrl : selected.checkoutUrlNoDiscount;
    if (!url) {
      setCtaError("Link de checkout ainda não configurado.");
      return;
    }
    track("InitiateCheckout", { value: chargedPrice(selected, active), currency: OFFER.currency });
    const extra: Record<string, string> = {};
    if (OFFER.checkoutEmailParam && a.email) extra[OFFER.checkoutEmailParam] = a.email;
    window.location.assign(withTracking(url, extra));
  };

  if (!f.ready) return <div className={s.page} />;

  const plansBlock = (key: string) => (
    <section className={s.offer} aria-labelledby={`choose-${key}`}>
      <h2 id={`choose-${key}`} className={s.h2} style={{ marginBottom: 24 }}>
        Escolha seu plano
      </h2>
      {coupon && (
        <div className={s.promo}>
          <span className={`${s.promoRound} ${s.promoRoundLeft}`} />
          <span className={`${s.promoRound} ${s.promoRoundRight}`} />
          <span className={s.promoLine} />
          <div className={s.promoTag}>{coupon.percent}% de desconto</div>
          <div className={s.promoRowFirst}>
            <Tag className={s.promoLabel} size={26} color="#ff8e00" strokeWidth={2} />
            <p className={s.promoTitle}>{active ? "Cupom de desconto aplicado!" : "Cupom expirado"}</p>
          </div>
          <div className={s.promoRowSecond}>
            <div className={s.promoCode}>
              <Check size={16} color={active ? "#00a36f" : "#7b766f"} strokeWidth={3} />
              <p className={`${s.promoCodeText} ${active ? "" : s.promoCodeExpired}`}>{coupon.code}</p>
            </div>
            {showTimer && (
              <div className={s.promoTimer}>
                {mm}
                <span className={s.timerDivider}>:</span>
                {ss}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={s.options} role="radiogroup" aria-label="Planos">
        {plans.map((p) => {
          const isSel = p.id === selected.id;
          const line = linePrice(p, active);
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={isSel}
              className={`${s.option} ${p.mostPopular ? s.optionPopular : ""} ${isSel ? s.optionSelected : ""}`}
              onClick={() => f.setPlan(p.id)}
            >
              {p.mostPopular && <span className={s.bestOffer}>O mais popular</span>}
              <span className={s.radio}>{isSel && <Check size={14} color="#fff" strokeWidth={3.5} />}</span>
              <span className={s.priceWrapper}>
                <span className={s.priceTitle}>{p.title}</span>
                <span className={s.price}>
                  {active && <s>{brl(line.full)}</s>} {brl(line.now)}
                </span>
                {p.periodLabel && <span className={s.period}>{p.periodLabel}</span>}
              </span>
              <span className={s.priceDay}>
                <span className={s.priceDayWrapper}>
                  <span className={s.currency}>R$</span>
                  <span className={s.amount}>{brlNumber(perDay(p, active))}</span>
                </span>
                <span className={s.priceDayText}>por dia</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className={s.note}>
        <span>96% dos nossos usuários</span> notam mudanças positivas no comportamento de seus cães em apenas 1 semana após o início do
        treinamento com nossos especialistas
      </p>
      <div className={s.cta}>
        <button type="button" className={s.ctaButton} onClick={checkout}>
          <span className={s.ctaInner}>
            Quero meu plano
            <ArrowRight className={s.ctaArrow} size={20} strokeWidth={2.4} />
          </span>
        </button>
        {ctaError && <p className={s.ctaError}>{ctaError}</p>}
      </div>
    </section>
  );

  return (
    <main className={s.page}>
      {showTimer && (
        <div className={s.timerTop}>
          <div className={`${s.timer} ${active ? "" : s.timerExpired}`} role="timer" aria-live="off">
            <p className={s.timerText}>{active ? "Seu desconto expira em" : "Seu desconto reservado expirou"}</p>
            {active && (
              <div className={s.timerTime}>
                <span>{mm}</span>
                <span className={s.timerDivider}>:</span>
                <span>{ss}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={s.hero}>
        <div className={s.heroBefore}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/hero-3-almofada.webp" alt="Shih Tzu destruindo uma almofada" />
        </div>
        <div className={s.heroAfter}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/frisbee-selo.webp" alt="Shih Tzu feliz e bem-comportado com frisbee" />
        </div>
        <span className={s.heroDivider} aria-hidden="true" />
      </div>
      <h1 className={s.mainTitle}>
        O plano de treino {name ? (a.gender === "female" ? "da " : "do ") : "do "}
        <span>{name || "seu Shih Tzu"}</span> começa agora!
      </h1>

      <div className={s.section}>
        <div className={s.reviews}>
          <div className={s.usersWrapper}>
            <p className={s.numberUsers}>96%</p>
            <div className={s.avatars} aria-hidden="true">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/img/avatar${i}.webp`} alt="" />
                </span>
              ))}
            </div>
          </div>
          <p className={s.description}>
            dos nossos usuários notam mudanças positivas no comportamento de seus cães apenas 1 semana após o início do treinamento com
            nossos especialistas
          </p>
        </div>

        <div className={s.benefits}>
          <h2 className={s.h2}>O que o plano do seu Shih Tzu inclui</h2>
          <div className={s.items}>
            {BENEFITS.map((b, i) => (
              <div key={b} className={s.item}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={s.itemIcon} src={`/img/beneficio-${i + 1}.webp`} alt="" width={40} height={40} />
                <p>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {plansBlock("1")}

      <section className={s.learn}>
        <h2 className={s.h2}>Veja tudo o que seu Shih Tzu irá aprender com apenas 10 minutos de treino por dia! 🐶💙</h2>
        <ul className={s.learnList}>
          {LEARN.map(([t, d]) => (
            <li key={t}>
              <GreenCheck />
              <div>
                <p className={s.learnTitle}>{t}</p>
                <p className={s.learnText}>{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.testimonials}>
        <h2 className={s.h2}>Depoimentos dos alunos da</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.classLogo} src="/img/logo-class.webp" alt="Shih Tzu Class" width={700} height={148} />
        <Showcase />
      </section>

      {plansBlock("2")}

      <div className={s.money}>
        <p className={s.moneyText1}>
          <ShieldCheck size={16} strokeWidth={2.2} /> {OFFER.guarantee.title}
        </p>
        <div className={s.moneyBlock}>
          <p className={s.moneyText2}>{OFFER.guarantee.title}</p>
          <p className={s.moneyText3}>{OFFER.guarantee.text}</p>
          <p className={s.moneyText4}>
            Veja as condições completas nos nossos{" "}
            <a href={OFFER.brand.termsUrl} target="_blank" rel="noreferrer">
              Termos de Uso
            </a>
            .
          </p>
          <svg className={s.moneyBadge} width="70" height="82" viewBox="0 0 70 82" aria-hidden="true">
            <path d="M18 52 10 80l14-8 9 10 4-22zM52 52l8 28-14-8-9 10-4-22z" fill="#f0930c" />
            <circle cx="35" cy="35" r="30" fill="#f0b70c" />
            <circle cx="35" cy="35" r="23" fill="#00a36f" />
            <path d="M24 35.5l7.5 7.5L46.5 28" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <section className={s.faq}>
        <h2 className={s.h2} style={{ marginBottom: 0 }}>
          Perguntas frequentes
        </h2>
        <div className={s.faqItems}>
          {FAQ.map((item, i) => {
            const open = faqOpen === i;
            return (
              <div key={item.q} className={`${s.faqItem} ${open ? s.faqOpen : ""}`}>
                <button type="button" className={s.faqQuestion} aria-expanded={open} onClick={() => setFaqOpen(open ? -1 : i)}>
                  {item.q}
                  <ChevronDown className={s.faqChevron} size={18} strokeWidth={2.4} />
                </button>
                {open && <p className={s.faqAnswer}>{item.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <div className={s.support}>
        <h3>Tem alguma dúvida?</h3>
        <p>É só escrever para nós em</p>
        <a href={`mailto:${OFFER.brand.supportEmail}`}>{OFFER.brand.supportEmail}</a>
      </div>

      <footer className={s.footer}>
        <p>{OFFER.brand.companyLine}</p>
        <p>
          <a href={OFFER.brand.termsUrl}>Termos de Uso</a> · <a href={OFFER.brand.privacyUrl}>Política de Privacidade</a>
        </p>
      </footer>
    </main>
  );
}
