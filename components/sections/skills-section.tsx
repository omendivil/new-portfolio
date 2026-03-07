import Image from "next/image";

import { StaggerGroup } from "@/components/motion/stagger-group";
import { SectionHeading } from "@/components/sections/section-heading";
import { SectionShell } from "@/components/sections/section-shell";
import { siteContent } from "@/data/site";

export function SkillsSection() {
  return (
    <SectionShell id="skills">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Skills"
          title="Tools that support product clarity across mobile and web."
          description="The focus stays on a small set of technologies that help move from concept to polished demo without dragging in unnecessary weight."
        />
        <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {siteContent.skills.map((skill) => (
            <article
              key={skill.id}
              className="rounded-[1.6rem] border border-border bg-background/75 p-5"
            >
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
                  <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-border bg-surface p-2">
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
