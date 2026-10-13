"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Creating.module.css";
import { PawIcon, Title } from "../ui";
import type { Answers } from "@/lib/types";
import { loadingTopics, pron } from "@/lib/personalize";
import { T } from "@/lib/timing";
import { OFFER } from "@/config/offer";


function Reviews() {
  const list = OFFER.testimonials;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (list.length < 2) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % list.length), T.reviewsAutoplay);
    return () => window.clearInterval(id);
  }, [list.length]);
  if (!list.length) return null;
  return (
    <div className={s.reviews}>
      <div className={s.track} style={{ transform: `translateX(calc(${-i} * (100% - 30px)))` }}>
        {list.map((r) => (
          <div key={r.author} className={s.slide}>
            <p className={s.reviewAuthor}>{r.author}</p>
            <p className={s.reviewTitle}>{r.title}</p>
            <p className={s.reviewText}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Four sequential bars with varying pace (~15.6 s in total), then advances by itself. */
export function Creating({ a, onDone }: { a: Answers; onDone: () => void }) {
  const [bars, setBars] = useState([0, 0, 0, 0]);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  const topics = loadingTopics(a);
  const texts = [
    "Identificando os comportamentos que seu Shih Tzu precisa melhorar",
    `Analisando os comandos que ${pron(a)} já sabe fazer`,
    topics ? `Selecionando treinos para melhorar ${topics}` : "Selecionando atividades para reforçar bons hábitos",
    "Montando seu programa de treino personalizado, passo a passo",
  ];

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    let finished = false;
    const curves = T.creating.curves;
    const lengths = curves.map((c) => c[c.length - 1][0]);
    const total = lengths.reduce((x, y) => x + y, 0);
    const at = (curve: [number, number][], ms: number) => {
      if (ms <= 0) return 0;
      for (let k = 1; k < curve.length; k++) {
        const [t1, p1] = curve[k];
        const [t0, p0] = curve[k - 1];
        if (ms <= t1) return p0 + ((p1 - p0) * (ms - t0)) / (t1 - t0);
      }
      return 100;
    };
    const step = (t: number) => {
      if (start === null) start = t;
      const el = t - start;
      let offset = 0;
      setBars(
        curves.map((c, i) => {
          const v = at(c, el - offset);
          offset += lengths[i];
          return v;
        }),
      );
      if (el < total) raf = requestAnimationFrame(step);
      else if (!finished) {
        finished = true;
        window.setTimeout(() => doneRef.current(), T.creating.holdAtEnd);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const activeIdx = [true, bars[0] >= 100, bars[1] >= 100, bars[2] >= 100];

  return (
    <section className={s.step}>
      <div className={s.titleWrapper}>
        <Title>Preparando o programa de treino do seu Shih Tzu... 🐶</Title>
      </div>
      <div className={s.items}>
        {texts.map((t, i) => (
          <div key={i} className={`${s.item} ${activeIdx[i] ? s.active : ""}`}>
            <div className={s.textBlock}>
              <p className={s.textInfo}>{t}</p>
              <p className={s.textPercent}>{Math.ceil(bars[i])}%</p>
            </div>
            <div className={s.loader}>
              <div className={s.loaderBack} />
              <div className={s.loaderProgress} style={{ transform: `translateX(${-100 + bars[i]}%)` }}>
                <span className={s.paw}>
                  <PawIcon size={15} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Reviews />
    </section>
  );
}
