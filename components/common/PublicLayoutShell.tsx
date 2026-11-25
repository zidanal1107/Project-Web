"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

interface PublicLayoutShellProps {
  children: ReactNode;
}

export function PublicLayoutShell({ children }: PublicLayoutShellProps) {
  const pathname = usePathname();
  const isStandaloneScreening = pathname?.startsWith("/screening") ?? false;

  if (isStandaloneScreening) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 bg-ambient-gradient transition-colors">
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 bg-ambient-gradient transition-colors">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}