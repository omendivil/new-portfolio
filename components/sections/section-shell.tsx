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
        "scroll-mt-24 rounded-[1.7rem] border border-border/80 bg-surface/92 px-4 py-8 shadow-[0_18px_80px_rgba(17,16,13,0.06)] backdrop-blur sm:scroll-mt-28 sm:rounded-[2rem] sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-10 lg:py-14",
        className,
      )}
    >
      {children}
    </section>
  );
}
