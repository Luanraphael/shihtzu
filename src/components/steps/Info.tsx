"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Info.module.css";
import st from "./Start.module.css";
import { ActionBar, Logo, PawIcon } from "../ui";
import type { Answers } from "@/lib/types";
import { behaviourSummary, g, pron } from "@/lib/personalize";
import { T } from "@/lib/timing";

/** Orbit transition: artwork + "Mais de 150 mil cães da raça Shih Tzu" + Continuar. */
export function InfoCoat({ onContinue }: { onContinue: () => void }) {
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.orbitImage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/orbita.webp" alt="Shih Tzus de várias pelagens" width={800} height={972} />
        </div>
        <div className={s.info}>
          <h1 className={s.titleBig}>
            Mais de 150 mil cães da raça <span>Shih Tzu</span>
          </h1>
          <p className={s.subtitle}>foram treinados com sucesso conosco!</p>
        </div>
      </div>
      <ActionBar onClick={onContinue} />
    </div>
  );
}

/** 8 s loading in the HERO loader style (blue bar with paw), then advances by itself. */
export function LoadingBehavior({ a, onDone }: { a: Answers; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    let finished = false;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(((t - start) / T.behaviorLoader) * 100, 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else if (!finished) {
        finished = true;
        done.current();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const who = a.petName ? `${g(a, "o", "a")} ${a.petName}` : "o seu Shih Tzu";
  return (
    <div className={s.loadingPage}>
      <div className={s.loadingLogo}>
        <Logo />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.loadingImg} src="/img/cachorrinho-vetor.webp" alt="Filhote de Shih Tzu" width={600} height={705} />
      <h1 className={s.loadingTitle}>Agora que já conhecemos um pouco mais sobre {who}... 🐶</h1>
      <p className={s.loadingText}>
        Vamos entender como {pron(a)} se comporta no dia a dia, descobrir o que já faz bem e quais hábitos precisa melhorar! 💙
      </p>
      <div className={s.loadingBar}>
        <div className={st.loaderWrapper}>
          <div className={st.loader} role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
            <div className={st.loaderBack} />
            <div className={st.loaderProgress} style={{ transform: `translateX(${-100 + progress}%)` }}>
              <span className={st.loaderPaw}>
                <PawIcon size={15} />
              </span>
            </div>
          </div>
          <div className={st.loaderText}>{Math.round(progress)}%</div>
        </div>
      </div>
    </div>
  );
}

/** "Agora entendemos melhor o seu Shih Tzu!" with up to three behaviours the lead marked. */
export function InfoSummary({ a, onContinue }: { a: Answers; onContinue: () => void }) {
  const summary = behaviourSummary(a);
  const who = a.petName ? a.petName : "seu Shih Tzu";
  return (
    <div className={s.wrapper}>
      <div className={s.imageWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/team.webp" alt="Equipe com Shih Tzus de diferentes pelagens" width={900} height={675} />
      </div>
      <h1 className={s.teamTitle}>Agora entendemos melhor o seu Shih Tzu! 🐶</h1>
      {summary ? (
        <>
          <p className={s.teamText}>
            Pelas suas respostas, vimos que {who} <b>{summary}</b>.
          </p>
          <p className={s.teamText}>
            <b>A boa notícia?</b> Com os treinos certos e apenas <b>10 minutos ao dia</b>, o nosso método permite reverter esses
            comportamentos e ensinar novos comandos para que seu Shih Tzu{" "}
            <b>
              aprenda a obedecer, responda quando você chamar e se torne um cachorro mais educado e comportado
            </b>
            .
          </p>
        </>
      ) : (
        <>
          <p className={s.teamText}>
            Pelas suas respostas, vimos que {who} <b>já tem bons hábitos no dia a dia</b>.
          </p>
          <p className={s.teamText}>
            <b>A boa notícia?</b> Com os treinos certos e apenas <b>10 minutos ao dia</b>, o nosso método ajuda a manter esses bons
            hábitos e ensinar novos comandos para que seu Shih Tzu <b>aprenda a obedecer e responda sempre que você chamar</b>.
          </p>
        </>
      )}
      <p className={s.teamText}>
        <b>E é exatamente nisso que o nosso time de Treinadores Certificados vai te ajudar! 💙</b>
      </p>
      <ActionBar onClick={onContinue} />
    </div>
  );
}
