import Image from "next/image";
import { ArrowDownRight } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { SectionShell } from "@/components/sections/section-shell";
import { getFeaturedProjects, siteContent } from "@/data/site";

export function HeroSection() {
  const { hero } = siteContent;
  const stats = [
    {
      label: "Featured projects",
      value: getFeaturedProjects(siteContent.projects).length
        .toString()
        .padStart(2, "0"),
    },
    { label: "Skills in rotation", value: siteContent.skills.length.toString() },
    { label: "Sections on page", value: siteContent.navSections.length.toString() },
  ];

  return (
    <SectionShell id="hero" className="overflow-hidden">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <FadeIn className="space-y-8">
          <div className="space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {hero.eyebrow}
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-text sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <div className="max-w-3xl space-y-4 text-base leading-7 text-muted sm:text-lg">
              <p>{hero.intro}</p>
              <p>{hero.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-text px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
            >
              {hero.primaryCtaLabel}
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-5 py-3 text-sm font-medium text-text transition-colors hover:bg-surface"
            >
              {hero.secondaryCtaLabel}
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.4rem] border border-border bg-background/70 px-4 py-4"
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {stat.label}
                </p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-text">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="mx-auto w-full max-w-sm lg:max-w-none">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface-2 p-3">
            <div className="absolute inset-x-6 top-6 h-24 rounded-full bg-accent-soft/70 blur-3xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-border bg-surface">
              <Image
                src={hero.portrait.src}
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
