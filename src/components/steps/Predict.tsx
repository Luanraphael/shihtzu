"use client";

import { useEffect, useMemo, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import s from "./Predict.module.css";
import { ActionBar } from "../ui";
import type { Answers } from "@/lib/types";
import { behaviourSummary, chartGoal, g } from "@/lib/personalize";
import { formatPtBR } from "@/lib/dates";

function Point({ color, className }: { color: string; className: string }) {
  return (
    <svg className={`${s.point} ${className}`} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#fff" />
      <circle cx="10" cy="10" r="7.2" fill={color} />
      <circle cx="10" cy="10" r="3.4" fill="#fff" />
    </svg>
  );
}

function VLine({ color, className }: { color: string; className: string }) {
  return (
    <svg className={`${s.vline} ${className}`} viewBox="0 0 2 135" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <path d="M1 1L1.00001 134" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4" />
    </svg>
  );
}

/** Reference `customV2_info_predict`; copy per briefing §N (a goal, not a statistical prediction). */
export function Predict({ a, onBack, onContinue }: { a: Answers; onBack: () => void; onContinue: () => void }) {
  const chartRef = useRef<HTMLDivElement>(null);
  // Date is computed when the step mounts (visit date, local calendar), never hardcoded.
  const goal = useMemo(() => chartGoal(a), [a]);
  const dateLabel = formatPtBR(goal.date);
  const summary = behaviourSummary(a);

  // reference: animation starts when the chart is 50% visible (IntersectionObserver threshold .5).
  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add(s.animate);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <button type="button" className={s.backButton} onClick={onBack} aria-label="Voltar">
          <ArrowLeft size={18} strokeWidth={2} color="#231e19" />
        </button>
        <h3 className={s.title2}>Prevemos que seu Shih Tzu vai aprender novos comandos e melhorar os comportamentos que mais te incomodam!</h3>
        <h2 className={s.title}>
          <span>Mais de 9</span> comandos até {dateLabel}!
        </h2>
      </div>
      <div className={s.chartWrapper}>
        <div className={s.chart} ref={chartRef}>
          <svg className={s.scale} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {[0, 25, 50, 75, 100].map((y) => (
              <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#c6d5ea" strokeWidth="1" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <Point color="#ff8e00" className={s.startPoint} />
          {/* reference-measured path, stroke and gradient */}
          <svg className={s.chartLine} width="293" height="148" viewBox="0 0 293 148" fill="none" aria-hidden="true">
            <path
              className={s.path1}
              d="M3 144.5C22 143.5 54.5 137.5 67 123.5C86.4004 101.772 92.0497 86.7768 113 77C135.5 66.5 159.5 69 183.5 59.5C200.525 52.7611 228.35 29.0678 252 24C280 18 285.333 8.33333 290 3.5"
              stroke="url(#predictGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="predictGradient" x1="292" y1="3" x2="23.5" y2="141.5" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#29A073" />
                <stop offset="0.5" stopColor="#C6D339" />
                <stop offset="1" stopColor="#F0930C" />
              </linearGradient>
            </defs>
          </svg>
          <Point color="#00a36f" className={s.endPoint} />
          <div className={`${s.mark} ${s.mark1}`}>
            <h4>Nível atual</h4>
            <ul>
              <li>{summary ? "Comportamentos para trabalhar" : "Bons hábitos"}</li>
              <li>
                {goal.known} {goal.known === 1 ? "comando" : "comandos"}
              </li>
            </ul>
          </div>
          <div className={`${s.mark} ${s.mark2}`}>
            <svg className={s.confetti} width="66" height="66" viewBox="0 0 66 66" aria-hidden="true">
              {[
                [10, 12, "#f2b72e"],
                [52, 8, "#2e60a6"],
                [6, 40, "#6f9be0"],
                [58, 34, "#f2b72e"],
                [30, 4, "#ff8e00"],
              ].map(([x, y, c]) => (
                <rect key={`${x}-${y}`} x={x as number} y={y as number} width="5" height="9" rx="1.5" fill={c as string} transform={`rotate(25 ${x} ${y})`} />
              ))}
            </svg>
            <span className={s.trophy} aria-hidden="true">
              🏆
            </span>
            <h4>Objetivo</h4>
            <ul>
              <li>{`Shih Tzu mais ${g(a, "educado", "educada")}`}</li>
              <li>9+ comandos</li>
            </ul>
          </div>
          <VLine color="#F1940D" className={s.lineStart} />
          <VLine color="#37A56F" className={s.lineEnd} />
        </div>
        <div className={s.chartDescr}>
          <p>Agora</p>
          <p>{dateLabel}</p>
        </div>
      </div>
      <p className={s.description}>
        Vamos ajudar você a ensinar seu Shih Tzu a obedecer aos comandos e melhorar os comportamentos que mais atrapalham o seu dia a dia.
      </p>
      <ActionBar onClick={onContinue} />
    </div>
  );
}
