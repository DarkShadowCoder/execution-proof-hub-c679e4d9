import { useState, type ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  Users,
  Handshake,
  Wallet,
  Smartphone,
  Percent,
  Boxes,
  Globe2,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  LifeBuoy,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { AdminAccount } from "@/hooks/useAdminSession";

const NAV: { group: string; items: { to: string; label: string; icon: typeof Users }[] }[] = [
  {
    group: "Principal",
    items: [
      { to: "/admin", label: "Accueil", icon: LayoutDashboard },
      { to: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
      { to: "/admin/settlements", label: "Règlements", icon: Landmark },
      { to: "/admin/users", label: "Utilisateurs", icon: Users },
    ],
  },
  {
    group: "Opérations",
    items: [
      { to: "/admin/partners", label: "Partenaires", icon: Handshake },
      { to: "/admin/wallets", label: "Wallets", icon: Wallet },
      { to: "/admin/momo", label: "Mobile Money", icon: Smartphone },
      { to: "/admin/tariffs", label: "Tarifs", icon: Percent },
      { to: "/admin/batches", label: "Lots journaliers", icon: Boxes },
    ],
  },
  {
    group: "KmerDiaspora",
    items: [{ to: "/admin/kmerdiaspora", label: "Vue d'ensemble", icon: Globe2 }],
  },
  {
    group: "Système",
    items: [
      { to: "/admin/audit", label: "Audit", icon: ScrollText },
      { to: "/admin/settings", label: "Paramètres", icon: Settings },
    ],
  },
];

export function AdminShell({ admin, children }: { admin: AdminAccount; children: ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/login" });
  };

  const isActive = (to: string) => (to === "/admin" ? pathname === "/admin" : pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-line bg-background/90 px-4 backdrop-blur-md md:px-6">
        <button
          className="grid size-9 place-items-center rounded-lg bg-surface text-muted-foreground ring-1 ring-line transition-colors hover:bg-raised hover:text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>

        <Link to="/admin" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-sm bg-primary font-mono text-[12px] font-bold tracking-tighter text-primary-foreground shadow-[var(--shadow-brand)]">
            Z
          </span>
          <span className="leading-none">
            <span className="block text-[13px] font-bold tracking-tight text-foreground">
              Zender237
            </span>
            <span className="mt-1 block font-mono text-[9px] font-semibold tracking-[0.18em] text-muted-foreground/80 uppercase">
              Console admin
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <span className="mr-1 hidden items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 ring-1 ring-success/20 sm:flex">
            <span className="pulse-dot size-1.5 rounded-full bg-success" aria-hidden />
            <span className="text-[10px] font-bold tracking-wide text-success uppercase">Live</span>
          </span>
          <button
            className="grid size-8 place-items-center rounded-lg bg-surface text-muted-foreground ring-1 ring-line transition-colors hover:bg-raised hover:text-foreground"
            aria-label="Aide"
          >
            <LifeBuoy className="size-4" />
          </button>
          <button
            className="relative grid size-8 place-items-center rounded-lg bg-surface text-muted-foreground ring-1 ring-line transition-colors hover:bg-raised hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary ring-2 ring-background" />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-surface py-1 pr-3 pl-1 ring-1 ring-line">
            <span className="grid size-7 place-items-center rounded-full bg-primary/15 font-mono text-[10px] font-bold text-primary ring-1 ring-primary/25">
              {admin.full_name?.slice(0, 2).toUpperCase()}
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold text-foreground">{admin.full_name}</p>
              <p className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
                {admin.role}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Se déconnecter"
            title="Se déconnecter"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      <div className="flex">
        {open ? (
          <button
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-14 z-20 bg-foreground/40 backdrop-blur-[2px] lg:hidden"
          />
        ) : null}

        <aside
          className={cn(
            "fixed inset-y-14 left-0 z-30 flex w-64 shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar px-3 py-5 transition-transform duration-200 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex-1">
            {NAV.map((section) => (
              <div key={section.group} className="mb-6">
                <p className="px-3 pb-2 font-mono text-[9px] font-semibold tracking-[0.2em] text-sidebar-foreground/40 uppercase">
                  {section.group}
                </p>
                <nav className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-150",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-primary transition-all duration-150",
                            active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
                          )}
                          aria-hidden
                        />
                        <item.icon
                          className={cn(
                            "size-4 shrink-0 transition-colors",
                            active
                              ? "text-sidebar-primary"
                              : "text-sidebar-foreground/45 group-hover:text-sidebar-foreground/80",
                          )}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-sidebar-accent/50 p-3 ring-1 ring-sidebar-border">
            <div className="flex items-center gap-2">
              <span className="pulse-dot size-1.5 rounded-full bg-sidebar-primary" aria-hidden />
              <p className="font-mono text-[9px] font-semibold tracking-[0.18em] text-sidebar-foreground/70 uppercase">
                Système opérationnel
              </p>
            </div>
            <p className="mt-2 font-mono text-[9px] text-sidebar-foreground/35">
              zender237 · back-office v1
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div
            key={pathname}
            className="reveal mx-auto w-full max-w-[1400px] space-y-6 px-4 py-6 md:px-8 md:py-8"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
