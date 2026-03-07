import { SectionReveal } from "@/components/motion/section-reveal";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { SectionHeading } from "@/components/sections/section-heading";
import { SectionShell } from "@/components/sections/section-shell";
import { siteContent } from "@/data/site";

export function ExperienceSection() {
  return (
    <SectionShell id="experience">
      <div className="space-y-8">
        <SectionReveal>
          <SectionHeading
            eyebrow="Experience"
            title="Recent work has centered on product concepts that earn their detail."
            description="The emphasis is less about volume and more about turning rough ideas into interfaces that communicate immediately."
          />
        </SectionReveal>

        <StaggerGroup className="space-y-4" itemDistance={20}>
          {siteContent.experience.map((entry) => (
            <article
              key={entry.id}
              className="group relative overflow-hidden rounded-[1.6rem] border border-border bg-background/75 p-5 transition-[transform,border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent/25 hover:bg-surface hover:shadow-[0_24px_60px_-42px_rgba(17,16,13,0.38)] motion-reduce:transition-none motion-safe:hover:-translate-y-1 sm:p-6"
            >
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-accent/40 opacity-0 transition-opacity duration-300 motion-reduce:transition-none group-hover:opacity-100" />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-text">
                    {entry.role}
                  </h3>
                  <p className="text-sm text-muted">
                    {entry.organization} · {entry.location}
                  </p>
                </div>

                <p className="w-fit rounded-full border border-border/70 bg-surface/80 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-[transform,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-accent/25 group-hover:bg-accent-soft/55 motion-reduce:transition-none motion-safe:group-hover:-translate-y-0.5">
                  {entry.period}
                </p>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{entry.summary}</p>

              <ul className="mt-5 grid gap-3 text-sm leading-6 text-text sm:grid-cols-2 xl:grid-cols-3">
                {entry.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="rounded-[1.2rem] border border-border bg-surface px-4 py-3 transition-[transform,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent/20 hover:bg-surface-2 motion-reduce:transition-none motion-safe:hover:-translate-y-0.5"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </StaggerGroup>
      </div>
    </SectionShell>
  );
}
