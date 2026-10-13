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

/** Four sequential bars, 7 s in total at a uniform speed, then advances by itself. */
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
    "Montando seu plano de treino personalizado, passo a passo",
  ];

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    let finished = false;
    const per = T.creating.total / 4;
    const step = (t: number) => {
      if (start === null) start = t;
      const el = t - start;
      setBars([0, 1, 2, 3].map((i) => Math.max(0, Math.min(100, ((el - i * per) / per) * 100))));
      if (el < T.creating.total) raf = requestAnimationFrame(step);
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
        <Title>Preparando o plano de treino do seu Shih Tzu... 🐶</Title>
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
