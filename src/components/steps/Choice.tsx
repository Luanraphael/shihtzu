"use client";

import type { ReactNode } from "react";
import { ActionBar, Chip, Option, Subtitle, Title, ui } from "../ui";

export interface Opt<V extends string> {
  value: V;
  label: string;
  icon?: ReactNode;
}

interface Head {
  title?: string;
  titleHtml?: string;
  subtitle?: ReactNode;
}

function StepHead({ title, titleHtml, subtitle }: Head) {
  return (
    <>
      {(title || titleHtml) && <Title html={titleHtml}>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </>
  );
}

/** Reference `withOneOption`: tap marks the option and auto-advances after 300 ms. */
export function SingleChoice<V extends string>({
  options,
  value,
  onPick,
  largeIcons,
  ...head
}: Head & { options: Opt<V>[]; value: V | null; onPick: (v: V) => void; largeIcons?: boolean }) {
  return (
    <section className={ui.step}>
      <StepHead {...head} />
      <div className={ui.options} role="radiogroup">
        {options.map((o) => (
          <Option key={o.value} label={o.label} icon={o.icon} largeIcon={largeIcons} selected={value === o.value} onClick={() => onPick(o.value)} />
        ))}
      </div>
    </section>
  );
}

/** Reference `withOneOptionV3` (reason): single choice with check + "Continuar" + skip link. */
export function SingleConfirm<V extends string>({
  options,
  value,
  onSelect,
  onContinue,
  skipLabel,
  onSkip,
  ...head
}: Head & {
  options: Opt<V>[];
  value: V | null;
  onSelect: (v: V) => void;
  onContinue: () => void;
  skipLabel: string;
  onSkip: () => void;
}) {
  return (
    <section className={ui.step}>
      <StepHead {...head} />
      <div className={ui.options} role="radiogroup">
        {options.map((o) => (
          <Option key={o.value} label={o.label} icon={o.icon} selected={value === o.value} onClick={() => onSelect(o.value)} />
        ))}
      </div>
      <ActionBar disabled={!value} onClick={onContinue} skipLabel={skipLabel} onSkip={onSkip} />
    </section>
  );
}

/**
 * Toggle `v` in `list` honouring exclusive options (reference: "Meu cachorro é saudável",
 * "Tudo certo, sem problemas!"): picking an exclusive option clears the others, picking a regular
 * option clears the exclusive ones.
 */
export function toggleWithExclusive<V extends string>(list: V[], v: V, exclusive: V[] = []): V[] {
  if (list.includes(v)) return list.filter((x) => x !== v);
  if (exclusive.includes(v)) return [v];
  return [...list.filter((x) => !exclusive.includes(x)), v];
}

/** Reference `multiOptionsV1`: checkbox options + "Continuar" + "Nenhum dos anteriores". */
export function MultiChoice<V extends string>({
  options,
  values,
  exclusive,
  onChange,
  onContinue,
  skipLabel = "Nenhuma dessas opções",
  onSkip,
  chips,
  ...head
}: Head & {
  options: Opt<V>[];
  values: V[];
  exclusive?: V[];
  onChange: (next: V[]) => void;
  onContinue: () => void;
  skipLabel?: string;
  onSkip: () => void;
  chips?: boolean;
}) {
  const toggle = (v: V) => onChange(toggleWithExclusive(values, v, exclusive));
  return (
    <section className={ui.step}>
      <StepHead {...head} />
      {chips ? (
        <div className={ui.chips}>
          {options.map((o) => (
            <Chip key={o.value} label={o.label} selected={values.includes(o.value)} onClick={() => toggle(o.value)} />
          ))}
        </div>
      ) : (
        <div className={ui.options}>
          {options.map((o) => (
            <Option key={o.value} multi label={o.label} icon={o.icon} selected={values.includes(o.value)} onClick={() => toggle(o.value)} />
          ))}
        </div>
      )}
      <ActionBar disabled={values.length === 0} onClick={onContinue} skipLabel={skipLabel} onSkip={onSkip} />
    </section>
  );
}
