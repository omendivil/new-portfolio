import Image from "next/image";

import { ContactActionButtons } from "@/components/contact/contact-action-buttons";
import { SectionHeading } from "@/components/sections/section-heading";
import { contact } from "@/data/site";
import type { ContactConfig } from "@/data/types";

export function ContactSection({ config = contact }: { config?: ContactConfig }) {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() ?? "";
  const showPhone = config.showPhone && phone.length > 0;

  return (
    <section
      id="contact"
      className="section-anchor section-surface section-grid gap-y-6 px-4 py-4 sm:gap-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
    >
      <SectionHeading
        eyebrow="Contact"
        title={config.heading}
        description={config.blurb}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] lg:items-start">
        <div className="surface-card rounded-[1.7rem] p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 sm:gap-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-muted">
                Preferred lane
              </p>
              <h3 className="text-balance text-2xl font-semibold leading-[1.02] tracking-[-0.04em] text-text sm:text-4xl">
                Email first, with copy as the primary action.
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-muted">
                {email
                  ? config.availability
                  : "Set NEXT_PUBLIC_CONTACT_EMAIL in .env.local to enable the contact actions."}
              </p>
            </div>

            <div className="rounded-[1.45rem] border border-border/70 bg-surface-2/70 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-border/70 bg-background/80 p-2 sm:h-12 sm:w-12">
                  <Image
                    src={config.icons.email.url}
                    alt={config.icons.email.alt}
                    fill
                    sizes="48px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">
                    Email
                  </p>
                  <p className="mt-1 break-words text-[0.95rem] font-medium leading-6 text-text sm:text-base">
                    {email || "Hidden until NEXT_PUBLIC_CONTACT_EMAIL is set."}
                  </p>
                </div>
              </div>

              <ContactActionButtons
                channel="email"
                copiedLabel="Email copied"
                copyLabel={config.primaryActionLabel}
                href={email ? `mailto:${email}` : undefined}
                hrefLabel={config.secondaryActionLabel}
                primaryVariant="solid"
                value={email}
              />
            </div>

            {showPhone ? (
              <div className="rounded-[1.45rem] border border-border/70 bg-surface-2/70 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-border/70 bg-background/80 p-2 sm:h-12 sm:w-12">
                    <Image
                      src={config.icons.phone.url}
                      alt={config.icons.phone.alt}
                      fill
                      sizes="48px"
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted">
                      Phone
                    </p>
                    <p className="mt-1 break-words text-[0.95rem] font-medium leading-6 text-text sm:text-base">
                      {phone}
                    </p>
                  </div>
                </div>
                <ContactActionButtons
                  channel="phone"
                  copiedLabel="Phone copied"
                  copyLabel="Copy phone"
                  href={`tel:${phone}`}
                  hrefLabel="Call"
                  value={phone}
                />
              </div>
            ) : null}
          </div>
        </div>

        <aside className="surface-card rounded-[1.7rem] p-4 sm:p-6 lg:p-7">
          <div className="space-y-4 sm:space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.35rem] border border-border/70 bg-surface-2/70 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-muted">
                  Availability
                </p>
                <p className="mt-3 text-base leading-7 text-text sm:text-lg sm:leading-8">
                  {config.availability}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-border/70 bg-surface-2/70 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-muted">
                  Location
                </p>
                <p className="mt-3 text-base leading-7 text-text">
                  {config.location}
                </p>
              </div>
            </div>
            <div className="rounded-[1.35rem] border border-border/70 bg-surface-2/70 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-muted">
                Privacy
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Contact details stay environment-driven so private info never needs to be committed to the repository.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
