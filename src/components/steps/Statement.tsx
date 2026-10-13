"use client";

import { useState } from "react";
import s from "./Statement.module.css";
import { Subtitle, Title } from "../ui";

interface Props {
  statement: string;
  question: string;
  img: string;
  imgAlt: string;
  imgW: number;
  imgH: number;
  /** 100 = "Sim, com certeza!", 0 = "Não, nem um pouco" */
  value: number | null;
  onAnswer: (value: number) => void;
}

/** Statement step: image + two answers; tapping one saves it and advances (no "Continuar"). */
export function Statement({ statement, question, img, imgAlt, imgW, imgH, value, onAnswer }: Props) {
  const [picked, setPicked] = useState<number | null>(value);
  const pick = (v: number) => {
    setPicked(v);
    onAnswer(v);
  };
  return (
    <section className={s.wrapper}>
      <Title>{statement}</Title>
      <Subtitle>{question}</Subtitle>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.img} src={img} alt={imgAlt} width={imgW} height={imgH} />
      <div className={s.answers}>
        <button type="button" className={`${s.yes} ${picked === 100 ? s.picked : ""}`} onClick={() => pick(100)}>
          Sim, com certeza!
        </button>
        <button type="button" className={`${s.no} ${picked === 0 ? s.picked : ""}`} onClick={() => pick(0)}>
          Não, nem um pouco
        </button>
      </div>
    </section>
  );
}
