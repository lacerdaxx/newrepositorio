"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** true somente no cliente, sem disparar setState em efeito. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
