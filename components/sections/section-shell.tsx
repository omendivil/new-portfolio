import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionShellProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

export function SectionShell({ id, className, children }: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 rounded-[2rem] border border-border/80 bg-surface/90 px-5 py-10 shadow-[0_18px_80px_rgba(17,16,13,0.06)] backdrop-blur sm:px-8 sm:py-12 lg:px-10 lg:py-14",
        className,
      )}
    >
      {children}
    </section>
  );
}
