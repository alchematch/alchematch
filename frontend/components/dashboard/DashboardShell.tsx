"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardTab {
  label: string;
  href: string;
}

export function DashboardShell({
  tabs,
  children,
}: {
  tabs: DashboardTab[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-8 px-6 py-10 sm:px-10 lg:flex-row lg:px-16 xl:px-24">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <nav className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm transition-colors",
                  active
                    ? "border-border bg-card font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-card hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile horizontal tab bar */}
      <nav className="-mx-6 flex gap-2 overflow-x-auto border-b border-border px-6 pb-3 lg:hidden">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors",
                active
                  ? "border-brass bg-card font-medium text-foreground"
                  : "border-border text-muted-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Content — fills remaining space, no max-width cap */}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}