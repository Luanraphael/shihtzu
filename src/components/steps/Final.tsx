"use client";

import { Award, BellRing, CalendarDays, Dog, Heart, ListChecks, Sparkle } from "lucide-react";
import s from "./Final.module.css";
import { ActionBar, PawIcon } from "../ui";
import type { AgeRange, Answers, CoatColor } from "@/lib/types";
import { behaviourLabels, knownCount, levelLabel } from "@/lib/personalize";

export const AGE_LABEL: Record<AgeRange, string> = {
  "0-6m": "0 a 6 meses",
  "7-12m": "7 a 12 meses",
  "1-2y": "1 a 2 anos",
  "2-7y": "2 a 7 anos",
  "7y+": "Mais de 7 anos",
};

export const COAT_LABEL: Record<CoatColor, string> = {
  "dourado-branco": "Dourado e branco",
  "preto-branco": "Preto e branco",
  tricolor: "Tricolor",
  "marrom-branco": "Marrom e branco",
  preto: "Preto",
  branco: "Branco",
  outra: "Outra cor",
};

const ICON = { size: 24, strokeWidth: 1.6, color: "#29a073" } as const;

/** Reference `customV2_plan`: profile card with the dog's photo → the chosen coat portrait. */
export function PlanReady({ a, onContinue }: { a: Answers; onContinue: () => void }) {
  const behaviours = behaviourLabels(a);
  const known = knownCount(a.knownCommands);
  const coat = a.coatColor && a.coatColor !== "outra" ? a.coatColor : null;
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <h2 className={s.title}>
          O programa de treino personalizado {a.petName ? (a.gender === "female" ? "da " : "do ") : "do "}
          <b>{a.petName || "seu Shih Tzu"}</b> está pronto
        </h2>
        <div className={s.cardWrapper}>
          <div className={s.card}>
            <span className={s.tileLeft} aria-hidden="true">
              <Sparkle size={40} fill="#fff" color="#fff" />
            </span>
            <span className={s.tileRight} aria-hidden="true">
              <Heart size={44} fill="#fff" color="#fff" />
            </span>
            <p className={s.cardText}>Perfil de treino</p>
            <div className={s.avatarWrap}>
              <div className={s.avatar}>
                {coat ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/img/coat-${coat}.webp`} alt={`Shih Tzu ${COAT_LABEL[coat].toLowerCase()}`} />
                ) : (
                  <span style={{ alignSelf: "center" }}>
                    <PawIcon size={80} />
                  </span>
                )}
              </div>
              <span className={s.avatarBadge} aria-hidden="true">
                <PawIcon size={20} />
              </span>
            </div>
            <ul className={s.dogInfo}>
              <li>
                <Dog {...ICON} />
                Pelagem: <span>{a.coatColor ? COAT_LABEL[a.coatColor] : "Não informada"}</span>
              </li>
              {a.ageRange && (
                <li>
                  <CalendarDays {...ICON} />
                  Idade: <span>{AGE_LABEL[a.ageRange]}</span>
                </li>
              )}
              <li>
                <BellRing {...ICON} />
                Comportamentos para trabalhar:{" "}
                <span>{behaviours.length ? behaviours.join(", ") : "Reforçar bons hábitos"}</span>
              </li>
              <li>
                <ListChecks {...ICON} />
                Comandos que já sabe: <span>{known}</span>
              </li>
              <li>
                <Award {...ICON} />
                Nível atual: <span>{levelLabel(known)}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className={s.description}>
          <h3 className={s.descrTitle}>Um programa montado a partir das suas respostas</h3>
          <p className={s.descrText}>
            As etapas foram organizadas para começar pelo que mais atrapalha o dia a dia de vocês, no ritmo do seu Shih Tzu.
          </p>
          <div className={s.descrImg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/team.webp" alt="" width={900} height={675} loading="lazy" />
          </div>
        </div>
      </div>
      <ActionBar onClick={onContinue} />
    </div>
  );
}
