import { ArrowUpRight } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { SectionShell } from "@/components/sections/section-shell";
import { siteContent } from "@/data/site";

export function WritingSection() {
  return (
    <SectionShell id="writing">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Writing & Videos"
          title="Short-form notes and walkthroughs around interaction structure."
          description="This section stays intentionally compact. It points to the themes that show up repeatedly in the product work above."
        />
        <div className="grid gap-4 lg:grid-cols-3">
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
                className="flex h-full flex-col justify-between rounded-[1.6rem] border border-border bg-background/75 p-5 transition-colors hover:bg-surface-2"
              >
                {content}
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-text">
                  Open
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            ) : (
              <article
                key={entry.id}
                className="flex h-full flex-col justify-between rounded-[1.6rem] border border-border bg-background/75 p-5"
              >
                {content}
                <span className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {entry.published}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
