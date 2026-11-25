import type { ReactNode } from "react";
import { PublicLayoutShell } from "@/components/common/PublicLayoutShell";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicLayoutShell>{children}</PublicLayoutShell>;
}