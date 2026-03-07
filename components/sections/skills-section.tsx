import Image from "next/image";

import { SectionReveal } from "@/components/motion/section-reveal";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { SectionHeading } from "@/components/sections/section-heading";
import { SectionShell } from "@/components/sections/section-shell";
import { siteContent } from "@/data/site";

export function SkillsSection() {
  return (
    <SectionShell id="skills">
      <div className="space-y-8">
        <SectionReveal>
          <SectionHeading
            eyebrow="Skills"
            title="Tools that support product clarity across mobile and web."
            description="The focus stays on a small set of technologies that help move from concept to polished demo without dragging in unnecessary weight."
          />
        </SectionReveal>

        <StaggerGroup
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          itemClassName="h-full"
          itemDistance={18}
        >
          {siteContent.skills.map((skill) => (
            <article
              key={skill.id}
              className="group relative h-full overflow-hidden rounded-[1.6rem] border border-border bg-background/75 p-5 transition-[transform,border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent/25 hover:bg-surface hover:shadow-[0_22px_52px_-38px_rgba(17,16,13,0.36)] motion-reduce:transition-none motion-safe:hover:-translate-y-1"
            >
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-accent/40 opacity-0 transition-opacity duration-300 motion-reduce:transition-none group-hover:opacity-100" />

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-lg font-semibold tracking-[-0.03em] text-text">
                    {skill.name}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    {skill.category} · {skill.level}
                  </p>
                </div>

                {skill.icon ? (
                  <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-border bg-surface p-2 transition-[transform,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-accent/25 group-hover:bg-accent-soft/55 motion-reduce:transition-none motion-safe:group-hover:-translate-y-0.5">
                    <Image
                      src={skill.icon.src}
                      alt={skill.icon.alt}
                      fill
                      sizes="44px"
                      className="object-contain p-2"
                    />
                  </div>
                ) : null}
              </div>

              <p className="mt-4 text-sm leading-6 text-muted">{skill.summary}</p>
            </article>
          ))}
        </StaggerGroup>
      </div>
    </SectionShell>
  );
}
