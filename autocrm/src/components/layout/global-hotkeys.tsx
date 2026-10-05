"use client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { allNavItems } from "@/config/nav";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { useShell } from "./shell-state";

export function GlobalHotkeys() {
  const router = useRouter();
  const { setPaletteOpen, toggleCollapsed } = useShell();
  const { resolvedTheme, setTheme } = useTheme();

  const chords = Object.fromEntries(
    allNavItems.filter((i) => i.chord).map((i) => [i.chord as string, () => router.push(i.href)]),
  );

  useHotkeys({
    mod: { k: () => setPaletteOpen((o) => !o) },
    keys: {
      "/": () => setPaletteOpen(true),
      "[": toggleCollapsed,
      n: () => window.dispatchEvent(new CustomEvent("autocrm:new-lead")),
      "shift+t": () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    },
    chords,
  });
  return null;
}
