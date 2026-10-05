"use client";
import { useSyncExternalStore } from "react";

// Um único relógio compartilhado (evita um setInterval por card do funil)
let now = Date.now();
const subs = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(cb: () => void) {
  subs.add(cb);
  if (!timer) {
    timer = setInterval(() => {
      now = Date.now();
      subs.forEach((s) => s());
    }, 30_000);
  }
  return () => {
    subs.delete(cb);
    if (subs.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/** Timestamp atual, atualizado a cada 30 s. */
export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => now,
  );
}
