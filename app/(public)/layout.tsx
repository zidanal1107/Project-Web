import type { ReactNode } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}