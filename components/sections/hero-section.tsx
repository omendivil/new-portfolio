import Image from "next/image";
import { ArrowDownRight } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { SectionShell } from "@/components/sections/section-shell";
import { getFeaturedProjects } from "@/data/project-utils";
import { navSections, projects, siteContent } from "@/data/site";

export function HeroSection() {
  const { hero } = siteContent;
  const stats = [
    {
      label: "Featured projects",
      value: getFeaturedProjects(projects).length.toString().padStart(2, "0"),
    },
    { label: "Skills in rotation", value: siteContent.skills.length.toString() },
    { label: "Sections on page", value: navSections.length.toString() },
  ];

  return (
    <SectionShell id="hero" className="overflow-hidden">
      <div className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-end">
        <FadeIn className="space-y-7 sm:space-y-8">
          <div className="space-y-4 sm:space-y-5">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-muted sm:text-xs">
              {hero.eyebrow}
            </p>
            <h1 className="max-w-4xl text-balance text-[clamp(2.75rem,11vw,4.8rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-text">
              {hero.title}
            </h1>
            <div className="max-w-3xl space-y-3 text-[0.98rem] leading-7 text-muted sm:space-y-4 sm:text-lg sm:leading-8">
              <p>{hero.intro}</p>
              <p>{hero.description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#projects"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-text px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              {hero.primaryCtaLabel}
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-surface-2 px-5 py-3 text-sm font-medium text-text transition-colors hover:bg-surface sm:w-auto"
            >
              {hero.secondaryCtaLabel}
            </a>
          </div>

          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(9.5rem,1fr))]">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="min-w-0 rounded-[1.35rem] border border-border bg-background/70 px-4 py-4 sm:rounded-[1.4rem]"
              >
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted sm:text-xs">
                  {stat.label}
                </p>
                <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-text">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="mx-auto w-full max-w-[21rem] lg:max-w-none">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-surface-2/90 p-2.5 sm:rounded-[2rem] sm:p-3">
            <div className="absolute inset-x-5 top-5 h-20 rounded-full bg-accent-soft/70 blur-3xl sm:inset-x-6 sm:top-6 sm:h-24" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem] border border-border bg-surface sm:rounded-[1.6rem]">
              <Image
                src={hero.portrait.url}
                alt={hero.portrait.alt}
                fill
                sizes="(max-width: 1024px) 90vw, 32vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionShell>
  );
}
