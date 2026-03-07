import { SectionHeading } from "@/components/sections/section-heading";
import { SectionShell } from "@/components/sections/section-shell";
import { siteContent } from "@/data/site";

export function ExperienceSection() {
  return (
    <SectionShell id="experience">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Experience"
          title="Recent work has centered on product concepts that earn their detail."
          description="The emphasis is less about volume and more about turning rough ideas into interfaces that communicate immediately."
        />
        <div className="space-y-4">
          {siteContent.experience.map((entry) => (
            <article
              key={entry.id}
              className="rounded-[1.6rem] border border-border bg-background/75 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-text">
                    {entry.role}
                  </h3>
                  <p className="text-sm text-muted">
                    {entry.organization} · {entry.location}
                  </p>
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {entry.period}
                </p>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
                {entry.summary}
              </p>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-text sm:grid-cols-3">
                {entry.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="rounded-[1.2rem] border border-border bg-surface px-4 py-3"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
