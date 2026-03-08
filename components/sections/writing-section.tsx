import { ArrowUpRight } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { SectionHeading } from "@/components/sections/section-heading";
import { SectionShell } from "@/components/sections/section-shell";
import { siteContent } from "@/data/site";

export function WritingSection() {
  return (
    <SectionShell id="writing">
      <div className="space-y-8">
        <FadeIn amount={0.12} distance={26} duration={0.54} margin="0px 0px -10% 0px" scale={0.985}>
          <SectionHeading
            eyebrow="Writing & Videos"
            title="Short-form notes and walkthroughs around interaction structure."
            description="This section stays intentionally compact. It points to the themes that show up repeatedly in the product work above."
          />
        </FadeIn>

        <StaggerGroup
          className="grid gap-4 lg:grid-cols-3"
          itemClassName="h-full"
          itemDistance={18}
        >
          {siteContent.writing.map((entry) => {
            const content = (
              <>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    {entry.format} · {entry.outlet}
                  </p>
                  <span className="text-sm text-muted">
                    {entry.duration ?? entry.published}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-text">
                    {entry.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted">{entry.summary}</p>
                </div>
              </>
            );

            return entry.href ? (
              <a
                key={entry.id}
                href={entry.href}
                target="_blank"
                rel="noreferrer"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.6rem] border border-border bg-background/75 p-5 transition-[transform,border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent/25 hover:bg-surface hover:shadow-[0_22px_52px_-38px_rgba(17,16,13,0.36)] focus-visible:border-accent/30 motion-reduce:transition-none motion-safe:hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-accent/40 opacity-0 transition-opacity duration-300 motion-reduce:transition-none group-hover:opacity-100" />

                {content}

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-text">
                  Open
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            ) : (
              <article
                key={entry.id}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.6rem] border border-border bg-background/75 p-5 transition-[border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent/15 hover:bg-surface motion-reduce:transition-none"
              >
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-accent/35 opacity-0 transition-opacity duration-300 motion-reduce:transition-none group-hover:opacity-100" />

                {content}

                <span className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {entry.published}
                </span>
              </article>
            );
          })}
        </StaggerGroup>
      </div>
    </SectionShell>
  );
}
