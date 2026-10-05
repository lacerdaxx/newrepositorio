import type { SwitchableTenant } from "@/features/admin/queries";
import { CommandPalette } from "./command-palette";
import { GlobalHotkeys } from "./global-hotkeys";
import { MobileNav } from "./mobile-nav";
import { PageTransition } from "./page-transition";
import { ShellProvider } from "./shell-state";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({
  defaultCollapsed,
  rootDomain,
  tenants,
  children,
}: {
  defaultCollapsed: boolean;
  rootDomain: string;
  tenants: SwitchableTenant[];
  children: React.ReactNode;
}) {
  return (
    <ShellProvider defaultCollapsed={defaultCollapsed} rootDomain={rootDomain} tenants={tenants}>
      <div className="flex min-h-dvh">
        <Sidebar />
        <MobileNav />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main id="conteudo" className="flex min-h-0 flex-1 flex-col">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
      <CommandPalette />
      <GlobalHotkeys />
    </ShellProvider>
  );
}
