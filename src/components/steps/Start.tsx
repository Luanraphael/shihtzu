"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Start.module.css";
import { Logo, PawIcon } from "../ui";
import { useFunnel } from "@/lib/store";
import { T } from "@/lib/timing";
import { OFFER } from "@/config/offer";

/** Same five scenes and order as the reference; copy without invented time frames (briefing §A). */
const SLIDES = [
  { img: "/img/hero-1-xixi.webp", alt: "Shih Tzu fazendo xixi fora do lugar", html: "Pare com o <span>xixi fora do lugar</span>" },
  { img: "/img/hero-2-travesseiro.webp", alt: "Shih Tzu agarrado ao travesseiro", html: "Acabe com os <span>comportamentos indesejados</span>" },
  { img: "/img/hero-3-almofada.webp", alt: "Shih Tzu destruindo uma almofada", html: "Chega de <span>móveis e chinelos destruídos</span>" },
  { img: "/img/hero-4-sozinho.webp", alt: "Shih Tzu triste sozinho em casa", html: "Ajude seu Shih Tzu a ficar <span>tranquilo sozinho</span>" },
  { img: "/img/hero-5-guia.webp", alt: "Shih Tzu puxando a guia no passeio", html: "Passeie <span>sem puxões na coleira</span>" },
];

/** reference-measured: sparkle positions and the progress ranges in which each one shows. */
const STARS = [
  { left: "0%", from: 0, to: 15 },
  { left: "5%", from: 15, to: 30 },
  { left: "30%", from: 40, to: 70 },
  { left: "70%", from: 80, to: 90 },
  { left: "80%", from: 90, to: 101 },
];

function Sparkle({ left }: { left: string }) {
  return (
    <svg className={s.star} style={{ left }} viewBox="0 0 21 22" aria-hidden="true">
      <path d="M10.5 0c.9 6.2 3.6 9.6 10.5 11-6.9 1.4-9.6 4.8-10.5 11C9.6 15.8 6.9 12.4 0 11 6.9 9.6 9.6 6.2 10.5 0z" fill="#fff" />
    </svg>
  );
}

export function Start() {
  const { advance } = useFunnel();
  const [active, setActive] = useState(0);
  const [rotating, setRotating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const raf = useRef(0);

  // reference-measured: setInterval(2000) → next slide; first slide is static until the first tick.
  useEffect(() => {
    const id = window.setInterval(() => {
      setRotating(true);
      setActive((i) => (i + 1) % SLIDES.length);
    }, T.hero.slide);
    return () => window.clearInterval(id);
  }, []);

  // reference-measured: 5000 ms linear loader driven by requestAnimationFrame.
  useEffect(() => {
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(((t - start) / T.hero.loader) * 100, 100);
      setProgress(p);
      if (p < 100) raf.current = requestAnimationFrame(tick);
      else setLoaded(true);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const star = STARS.find((st) => progress >= st.from && progress < st.to);

  return (
    <div className={s.startPage}>
      <div className={s.container}>
        <div className={s.header}>
          <Logo />
        </div>
        <div className={s.animateWrapper}>
          {SLIDES.map((sl, i) => {
            const isStatic = !rotating && i === 0;
            const cls = isStatic ? s.slideStatic : i === active ? s.slideActive : "";
            return (
              <div key={sl.img} className={`${s.slide} ${cls}`} aria-hidden={i !== active}>
                <p dangerouslySetInnerHTML={{ __html: sl.html }} />
                <picture className={s.picture}>
                  <img src={sl.img} alt={sl.alt} width={940} height={827} fetchPriority={i === 0 ? "high" : "low"} loading={i === 0 ? undefined : "lazy"} />
                </picture>
              </div>
            );
          })}
        </div>
      </div>
      <div className={s.footer}>
        {!loaded ? (
          <div className={s.loaderWrapper}>
            <p className={s.subtitle}>Por favor, não feche esta página</p>
            <div className={s.loader} role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
              <div className={s.loaderBack} />
              {star && <Sparkle key={star.left} left={star.left} />}
              <div className={s.loaderProgress} style={{ transform: `translateX(${-100 + progress}%)` }}>
                <span className={s.loaderPaw}>
                  <PawIcon size={15} />
                </span>
              </div>
            </div>
            <div className={s.loaderText}>Carregando o quiz...</div>
          </div>
        ) : (
          <div className={s.policyWrapper}>
            <p className={s.text}>
              Ao tocar em “Continuar”, declaro que li e aceito a{" "}
              <a href={OFFER.brand.privacyUrl} target="_blank" rel="noreferrer">
                Política de Privacidade
              </a>{" "}
              e os{" "}
              <a href={OFFER.brand.termsUrl} target="_blank" rel="noreferrer">
                Termos de Uso
              </a>
              , e concordo com o tratamento dos meus dados pessoais.
            </p>
            <button type="button" className={s.nextButton} onClick={() => advance()}>
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
