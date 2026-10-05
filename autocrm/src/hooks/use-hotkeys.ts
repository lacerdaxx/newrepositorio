"use client";
import { useEffect, useRef } from "react";

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

type Handlers = {
  /** tecla única (ignorada quando o foco está em campo de texto) */
  keys?: Record<string, (e: KeyboardEvent) => void>;
  /** combinações com Ctrl/Cmd, ex.: "k" para Ctrl+K */
  mod?: Record<string, (e: KeyboardEvent) => void>;
  /** sequências "g" + tecla */
  chords?: Record<string, () => void>;
};

export function useHotkeys(handlers: Handlers) {
  const ref = useRef(handlers);
  useEffect(() => {
    ref.current = handlers;
  });

  useEffect(() => {
    let chordPending = false;
    let chordTimer: ReturnType<typeof setTimeout> | undefined;

    const onKey = (e: KeyboardEvent) => {
      const { keys, mod, chords } = ref.current;
      const key = e.key.toLowerCase();

      if ((e.metaKey || e.ctrlKey) && !e.altKey && mod?.[key]) {
        e.preventDefault();
        mod[key]?.(e);
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;

      if (chordPending) {
        chordPending = false;
        clearTimeout(chordTimer);
        const fn = chords?.[key];
        if (fn) {
          e.preventDefault();
          fn();
        }
        return;
      }
      if (key === "g" && chords && !e.shiftKey) {
        chordPending = true;
        chordTimer = setTimeout(() => (chordPending = false), 900);
        return;
      }
      const combo = e.shiftKey ? `shift+${key}` : key;
      const fn = keys?.[combo];
      if (fn) {
        e.preventDefault();
        fn(e);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(chordTimer);
    };
  }, []);
}
