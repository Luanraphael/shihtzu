"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import s from "./ui.module.css";
import { OFFER } from "@/config/offer";
import { useFunnel } from "@/lib/store";
import { headerMode, progressFor } from "@/lib/flow";

export function PawIcon({ size = 18, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <ellipse cx="12" cy="16.2" rx="5.2" ry="4.4" />
      <ellipse cx="5.6" cy="10.4" rx="2.3" ry="2.8" transform="rotate(-18 5.6 10.4)" />
      <ellipse cx="9.4" cy="6" rx="2.3" ry="2.9" transform="rotate(-6 9.4 6)" />
      <ellipse cx="14.6" cy="6" rx="2.3" ry="2.9" transform="rotate(6 14.6 6)" />
      <ellipse cx="18.4" cy="10.4" rx="2.3" ry="2.8" transform="rotate(18 18.4 10.4)" />
    </svg>
  );
}

export function Logo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={s.logoImg} src="/img/logo.webp" alt={OFFER.brand.name} width={600} height={146} />
  );
}

/** Reference `check.png`: gradient disc with a white tick (purple → brand blue). */
export function CheckMark({ className = s.check }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="chk" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#7fa6dd" />
          <stop offset="1" stopColor="var(--brand-primary)" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#chk)" />
      <path d="M7 12.3l3.2 3.2L17 8.8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header() {
  const { step, back } = useFunnel();
  const mode = headerMode(step);
  if (mode === "none") return null;
  const progress = mode === "full" ? progressFor(step) : null;
  return (
    <div className={s.headerWrapper}>
      <div className={s.header}>
        {mode === "full" && (
          <button type="button" className={s.backButton} onClick={back} aria-label="Voltar">
            <ArrowLeft size={18} strokeWidth={2} color="#231e19" />
          </button>
        )}
        <Logo />
      </div>
      {progress && (
        <div className={s.progress}>
          <p className={s.progressTitle}>{progress.title}</p>
          <div className={s.progressBar} role="progressbar" aria-label={progress.title}>
            {progress.fills.map((f, i) => (
              <div key={i} className={s.progressSection}>
                <div className={s.progressFill} style={{ width: `${f * 100}%` }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Title({ children, html }: { children?: ReactNode; html?: string }) {
  if (html) return <h1 className={s.title} dangerouslySetInnerHTML={{ __html: html }} />;
  return <h1 className={s.title}>{children}</h1>;
}

export function Subtitle({ children }: { children: ReactNode }) {
  return <p className={s.subtitle}>{children}</p>;
}

interface OptionProps {
  label: ReactNode;
  icon?: ReactNode;
  selected: boolean;
  multi?: boolean;
  /** 48 px slot for photos (coat portraits) instead of the 20 px line-icon slot. */
  largeIcon?: boolean;
  onClick: () => void;
}

export function Option({ label, icon, selected, multi, largeIcon, onClick }: OptionProps) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      className={`${s.option} ${multi ? s.multi : ""} ${selected ? s.optionSelected : ""}`}
      onClick={onClick}
    >
      {icon && <span className={largeIcon ? s.iconLarge : s.iconWrapper}>{icon}</span>}
      <span>{label}</span>
      {selected && <CheckMark />}
    </button>
  );
}

export function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      className={`${s.chip} ${selected ? s.optionSelected : ""}`}
      onClick={onClick}
    >
      {label}
      {selected && <CheckMark />}
    </button>
  );
}

interface ActionBarProps {
  label?: string;
  disabled?: boolean;
  onClick: () => void;
  skipLabel?: string;
  onSkip?: () => void;
  arrow?: boolean;
}

export function ActionBar({ label = "Continuar", disabled, onClick, skipLabel, onSkip, arrow }: ActionBarProps) {
  return (
    <div className={s.actionBar}>
      <button type="button" className={s.primary} disabled={disabled} onClick={onClick}>
        {label}
        {arrow && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            style={{ position: "absolute", right: 20 }}
            aria-hidden="true"
          >
            <path d="M3 10h13M11 4.5l5.5 5.5-5.5 5.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      {skipLabel && onSkip && (
        <button type="button" className={s.skip} onClick={onSkip}>
          {skipLabel}
        </button>
      )}
    </div>
  );
}

export { s as ui };
