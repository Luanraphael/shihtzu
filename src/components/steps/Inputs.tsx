"use client";

import { useMemo, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import s from "./Inputs.module.css";
import { ActionBar, Title } from "../ui";
import { compare, formatShort, fromISO, localToday, toISO } from "@/lib/dates";

export function NameStep({ initial, onDone }: { initial: string | null; onDone: (name: string) => void }) {
  const [name, setName] = useState(initial ?? "");
  const valid = name.trim().length > 0;
  return (
    <section className={s.step}>
      <Title>Qual é o nome do seu Shih Tzu?</Title>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onDone(name);
        }}
      >
        <input
          className={s.nameInput}
          type="text"
          value={name}
          maxLength={24}
          autoComplete="off"
          enterKeyHint="done"
          placeholder="Nome do seu Shih Tzu"
          aria-label="Nome do seu Shih Tzu"
          onChange={(e) => setName(e.target.value)}
        />
      </form>
      <ActionBar disabled={!valid} onClick={() => onDone(name)} skipLabel="Prefiro não dizer" onSkip={() => onDone("")} />
    </section>
  );
}

interface DateProps {
  title: string;
  initial: string | null;
  onDate: (iso: string) => void;
  onPast: () => void;
  onSkip: () => void;
}

/**
 * Reference `customV2_date`: a display field over a transparent native `<input type="date">`
 * (tapping opens the device calendar, minimum = today), "Já aconteceu" right below it,
 * "Continuar" enabled once a date is chosen, and a "skip" link.
 */
export function DateStep({ title, initial, onDate, onPast, onSkip }: DateProps) {
  const today = useMemo(() => toISO(localToday()), []);
  const [iso, setIso] = useState<string | null>(initial);
  const ref = useRef<HTMLInputElement>(null);
  const shown = iso ? fromISO(iso) : null;

  return (
    <section className={s.step}>
      <Title>{title}</Title>
      <div className={s.inputWrapper}>
        <div className={`${s.value} ${shown ? s.withValue : ""}`}>
          <CalendarDays className={s.calendarIcon} size={22} strokeWidth={1.8} aria-hidden="true" />
          {shown ? formatShort(shown) : "Selecione a data"}
        </div>
        <input
          ref={ref}
          className={s.hiddenDateInput}
          type="date"
          min={today}
          value={iso ?? ""}
          aria-label="Selecione a data"
          onClick={() => {
            try {
              ref.current?.showPicker?.();
            } catch {
              /* browsers without showPicker open the picker on tap anyway */
            }
          }}
          onChange={(e) => {
            const picked = fromISO(e.target.value);
            if (!picked) return setIso(null);
            // reference: dates before today are replaced by today (no fabricated past date).
            setIso(compare(picked, localToday()) < 0 ? today : e.target.value);
          }}
        />
      </div>
      <button type="button" className={s.alreadyHappened} onClick={onPast}>
        Já aconteceu
      </button>
      <ActionBar disabled={!iso} onClick={() => iso && onDate(iso)} skipLabel="Pular esta pergunta" onSkip={onSkip} />
    </section>
  );
}
