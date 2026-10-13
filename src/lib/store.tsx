"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { EMPTY_ANSWERS, type Answers, type Coupon, type FunnelState, type StepId } from "./types";
import { STEP_ORDER, nextStep } from "./flow";
import { T } from "./timing";
import { captureTrackingParams } from "./utm";

const KEY = "stz-funnel-v1";

const fresh = (): FunnelState => ({
  answers: { ...EMPTY_ANSWERS },
  history: ["start"],
  coupon: null,
  selectedPlan: null,
  startedAt: Date.now(),
});

function load(): FunnelState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as FunnelState;
    if (!Array.isArray(s.history)) return null;
    // steps removed in later versions of the funnel are dropped from saved progress
    s.history = s.history.filter((h) => STEP_ORDER.includes(h));
    if (!s.history.length) return null;
    return { ...fresh(), ...s, answers: { ...EMPTY_ANSWERS, ...s.answers } };
  } catch {
    return null;
  }
}

interface FunnelApi {
  ready: boolean;
  state: FunnelState;
  step: StepId;
  answers: Answers;
  /** Merge answers without navigating. */
  set: (patch: Partial<Answers>) => void;
  /** Save `patch`, wait the reference's 300 ms and go to the next step (double clicks ignored). */
  advance: (patch?: Partial<Answers>, delay?: number) => void;
  back: () => void;
  setCoupon: (c: Coupon | null) => void;
  setPlan: (id: string) => void;
  reset: () => void;
  /** Called when the funnel moves past the last quiz step. */
  onFinish: (fn: () => void) => void;
}

const Ctx = createContext<FunnelApi | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FunnelState>(fresh);
  const [ready, setReady] = useState(false);
  const lock = useRef(false);
  const finish = useRef<() => void>(() => {});
  const stateRef = useRef(state);
  useLayoutEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    captureTrackingParams();
    const saved = load();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
    if (saved) setState(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* private mode: state just isn't persisted */
    }
  }, [state, ready]);

  const set = useCallback((patch: Partial<Answers>) => {
    setState((s) => ({ ...s, answers: { ...s.answers, ...patch } }));
  }, []);

  const advance = useCallback((patch?: Partial<Answers>, delay: number = T.navDelay) => {
    if (lock.current) return;
    lock.current = true;
    if (patch) setState((s) => ({ ...s, answers: { ...s.answers, ...patch } }));
    window.setTimeout(() => {
      const s = stateRef.current;
      const current = s.history[s.history.length - 1];
      const next = nextStep(current, s.answers);
      if (next === "offer") finish.current();
      else setState((st) => ({ ...st, history: [...st.history, next] }));
      window.setTimeout(() => (lock.current = false), T.navLock);
    }, delay);
  }, []);

  const back = useCallback(() => {
    if (lock.current) return;
    setState((s) => (s.history.length > 1 ? { ...s, history: s.history.slice(0, -1) } : s));
  }, []);

  const api = useMemo<FunnelApi>(
    () => ({
      ready,
      state,
      step: state.history[state.history.length - 1],
      answers: state.answers,
      set,
      advance,
      back,
      setCoupon: (c) => setState((s) => ({ ...s, coupon: c })),
      setPlan: (id) => setState((s) => ({ ...s, selectedPlan: id })),
      reset: () => setState(fresh()),
      onFinish: (fn) => (finish.current = fn),
    }),
    [ready, state, set, advance, back],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useFunnel(): FunnelApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFunnel outside FunnelProvider");
  return v;
}
