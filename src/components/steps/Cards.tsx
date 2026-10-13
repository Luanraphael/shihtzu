"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Cards.module.css";
import { Logo } from "../ui";
import { T } from "@/lib/timing";
import { OFFER } from "@/config/offer";

type Phase = "faceUp" | "flippingDown" | "shuffling" | "selecting" | "revealing" | "gathering" | "celebrating";

interface CardState {
  id: number;
  slot: number;
  rotY: number;
  gathered: boolean;
  opacity: number;
  zIndex: number;
  revealed: boolean;
}

/** reference-measured slot positions (% of the 335×408 grid) and the centre position. */
const SLOTS = [
  { left: "10.90%", top: "0%" },
  { left: "51.19%", top: "0%" },
  { left: "10.90%", top: "50.98%" },
  { left: "51.19%", top: "50.98%" },
];
const CENTER = { left: "31.04%", top: "25.49%" };
const FRONT = "/img/card-front-60.webp";
/** Faces shown while the cards are dealt (decoration only — the picked card always reveals 60%). */
const DEAL_FACES = ["/img/card-front-10.webp", "/img/card-front-20.webp", "/img/card-front-30.webp", FRONT];
const BACK = "/img/card-back.webp";

const initialCards = (): CardState[] =>
  [0, 1, 2, 3].map((i) => ({ id: i, slot: i, rotY: 0, gathered: false, opacity: 1, zIndex: i, revealed: false }));

/** Cosmetic shuffle of the card positions (every card carries the same, deterministic 60% prize). */
function shuffle(cards: CardState[]): CardState[] {
  const slots = cards.map((c) => c.slot);
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  return cards.map((c, i) => ({ ...c, slot: slots[i] }));
}

const CONFETTI_COLORS = ["#2E60A6", "#FFD93D", "#6BCB77", "#4D96FF", "#F2B72E", "#FF9F1C", "#F72585", "#4CC9F0", "#F8E16C", "#80ED99", "#7FA6DD", "#FF6B35", "#FFFFFF", "#FFB3DE"];
const SHAPES = ["rect", "circle", "ribbon", "rect", "rect"] as const;

/** reference-measured canvas confetti: 180 particles, launch spread, gravity .38, ≤ 4 s. */
function Confetti({ trigger, x, y }: { trigger: number; x: number; y: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!trigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const parts = Array.from({ length: 180 }, () => {
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
      const sp = 10 + 24 * Math.random();
      return {
        x: x + 20 * (Math.random() - 0.5),
        y: y + 20 * (Math.random() - 0.5),
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        w: 10 + 18 * Math.random(),
        h: 10 + 18 * Math.random(),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rot: 360 * Math.random(),
        rotSp: 14 * (Math.random() - 0.5),
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        opacity: 1,
        wob: Math.random() * Math.PI * 2,
        wobSp: 0.06 + 0.1 * Math.random(),
        delay: 180 * Math.random(),
        launched: 0,
      };
    });
    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const el = now - start;
      let alive = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of parts) {
        if (el < p.delay) {
          alive = true;
          continue;
        }
        if (!p.launched) p.launched = now;
        const age = now - p.launched;
        p.vy += 0.38;
        p.wob += p.wobSp;
        p.x += p.vx + 1.5 * Math.sin(p.wob);
        p.y += p.vy;
        p.rot += p.rotSp;
        const fadeAt = 2200 - p.delay;
        if (age > fadeAt) p.opacity = Math.max(0, 1 - (age - fadeAt) / 800);
        if (p.opacity <= 0 || p.y > canvas.height + 60) continue;
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, 2 * Math.PI);
          ctx.fill();
        } else if (p.shape === "ribbon") ctx.fillRect(-p.w, -p.h / 5, 2 * p.w, p.h / 2.5);
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive && el < 4000) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [trigger, x, y]);
  return <canvas ref={ref} className={s.confetti} aria-hidden="true" />;
}

function DotRing({ className, size, radius, count, radii, colors }: { className: string; size: number; radius: number; count: number; radii: number[]; colors: string[] }) {
  const c = size / 2;
  return (
    <svg className={className} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const a = ((i * (360 / count)) * Math.PI) / 180;
        return <circle key={i} cx={c + radius * Math.cos(a)} cy={c + radius * Math.sin(a)} r={radii[i % radii.length]} fill={colors[i % colors.length]} />;
      })}
    </svg>
  );
}

function Rays() {
  return (
    <svg className={s.rays} viewBox="0 0 601 766" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => {
        const a = -70 + i * 17.5;
        return <path key={i} d="M300 420 L285 -40 L315 -40 Z" fill="#dbe6f5" transform={`rotate(${a} 300 420)`} opacity="0.55" />;
      })}
    </svg>
  );
}

interface Props {
  /** true when the coupon was already revealed in this run (back/refresh): no second reveal. */
  alreadyRevealed: boolean;
  /** coupon shown after the reveal (named after the dog) */
  code: string;
  onReveal: () => void;
  onContinue: () => void;
}

/** Reference `customV2_specialOffer_v2` (4 cards). Every card reveals the same real 60% coupon. */
export function Cards({ alreadyRevealed, code, onReveal, onContinue }: Props) {
  const [phase, setPhase] = useState<Phase>(alreadyRevealed ? "celebrating" : "faceUp");
  const [intro, setIntro] = useState(alreadyRevealed ? 4 : 0);
  const [cards, setCards] = useState<CardState[]>(initialCards);
  const [burst, setBurst] = useState({ n: 0, x: 0, y: 0 });
  const timers = useRef<number[]>([]);
  const pickTimers = useRef<number[]>([]);
  const revealed = useRef(alreadyRevealed);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (fn: () => void, ms: number, bucket = timers) => bucket.current.push(window.setTimeout(fn, reduced ? Math.min(ms, 50) : ms));

  // Reveal timers live outside the per-phase effect so a phase change can't cancel them.
  useEffect(() => () => pickTimers.current.forEach(clearTimeout), []);

  useEffect(() => {
    clear();
    if (phase === "faceUp") {
      T.cards.introSteps.forEach((ms, i) => later(() => setIntro(i + 1), ms));
      later(() => {
        setCards((cs) => cs.map((c) => ({ ...c, rotY: 180 })));
        setPhase("flippingDown");
      }, T.cards.flipDownAt);
    } else if (phase === "flippingDown") {
      later(() => setPhase("shuffling"), T.cards.flipDuration);
    } else if (phase === "shuffling") {
      T.cards.shuffleAt.forEach((ms) => later(() => setCards(shuffle), ms));
      later(() => setPhase("selecting"), T.cards.selectingAt);
    }
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const pick = (id: number) => {
    if (phase !== "selecting" || revealed.current) return;
    revealed.current = true;
    onReveal();
    setPhase("revealing");
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, rotY: 360, zIndex: 10, revealed: true } : c)));
    later(() => {
      setPhase("gathering");
      setCards((cs) => cs.map((c) => ({ ...c, gathered: true, opacity: c.id === id ? 1 : 0, zIndex: c.id === id ? 10 : 1 })));
    }, T.cards.gatherAt, pickTimers);
    later(() => {
      setPhase("celebrating");
      setBurst((b) => ({ n: b.n + 1, x: window.innerWidth / 2, y: 0.42 * window.innerHeight }));
    }, T.cards.celebrateAt, pickTimers);
  };

  const selecting = phase === "selecting";
  const celebrating = phase === "celebrating";
  const notFaceUp = phase !== "faceUp";
  const introDone = !["revealing", "gathering", "celebrating"].includes(phase);
  const posDuration = phase === "shuffling" ? T.cards.shuffleMove : phase === "gathering" ? T.cards.gatherMove : 0;
  const { percent } = OFFER.coupon;

  return (
    <div className={s.step}>
      {!celebrating && (
        <div className={s.stage}>
          <Rays />
          <div className={s.logo}>
            <Logo />
          </div>
          <h2 className={`${s.title} ${notFaceUp || intro >= 1 ? s.titleVisible : ""}`}>Economize no seu plano personalizado</h2>
          <div className={s.grid} style={{ ["--pos-duration" as string]: `${posDuration}ms` }}>
            {cards.map((c) => {
              const pos = c.gathered ? CENTER : SLOTS[c.slot];
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`${s.card} ${selecting ? s.selectable : ""}`}
                  style={{ left: pos.left, top: pos.top, opacity: c.opacity, zIndex: c.zIndex }}
                  onClick={() => pick(c.id)}
                  disabled={!selecting}
                  aria-label="Escolher esta carta"
                >
                  <div className={`${s.cardPop} ${notFaceUp || intro >= 2 ? s.cardPopIn : ""}`} style={{ ["--pop-delay" as string]: `${T.cards.popStagger * c.id}ms` }}>
                    <div className={s.cardInner} style={{ transform: `rotateY(${c.rotY}deg)` }}>
                      <div className={s.cardFace}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.revealed ? FRONT : DEAL_FACES[c.id]} alt="" draggable={false} />
                      </div>
                      <div className={`${s.cardFace} ${s.cardBack}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={BACK} alt="" draggable={false} />
                      </div>
                    </div>
                    {selecting && <span className={s.glow} />}
                  </div>
                </button>
              );
            })}
          </div>
          <p className={`${s.subtitle} ${introDone && (notFaceUp || intro >= 3) ? s.subtitleVisible : ""}`}>
            Toque em uma carta para revelar seu desconto de boas-vindas no plano de treino do seu Shih Tzu
          </p>
        </div>
      )}
      {!celebrating && (
        <div className={`${s.footer} ${s.footerIntro} ${introDone && (notFaceUp || intro >= 4) ? s.footerIntroVisible : ""}`}>
          <button type="button" className={s.button} disabled={!selecting} onClick={() => pick(0)}>
            Revelar meu desconto
          </button>
        </div>
      )}
      {celebrating && (
        <div className={s.celebration}>
          <div className={s.halo} />
          <div className={s.rings}>
            <DotRing className={s.ringOuter} size={600} radius={275} count={18} radii={[9, 13, 7, 11, 8]} colors={["#7FA6DD", "#FFCE8A", "#2E60A6"]} />
            <DotRing className={s.ringInner} size={390} radius={170} count={10} radii={[10, 7, 13, 8]} colors={["#2E60A6", "#FFCE8A", "#F2B72E", "#74D7FF"]} />
          </div>
          <div className={s.logo}>
            <Logo />
          </div>
          <div className={s.winText}>
            <p className={s.winHeadline}>
              Cupom {code} aplicado ao seu plano
            </p>
            <p className={s.winTitle}>Você recebeu {percent}% de desconto!</p>
          </div>
          <div className={s.winCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FRONT} alt={`${percent}% OFF`} />
          </div>
          <div className={`${s.footer} ${s.footerCelebrate}`}>
            <button type="button" className={s.button} onClick={onContinue}>
              Continuar
            </button>
          </div>
        </div>
      )}
      <Confetti trigger={burst.n} x={burst.x} y={burst.y} />
    </div>
  );
}
