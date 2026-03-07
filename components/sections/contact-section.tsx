"use client";

import Image from "next/image";
import { Copy, Mail, Phone } from "lucide-react";
import { useState } from "react";

import { SectionHeading } from "@/components/sections/section-heading";
import { siteContent } from "@/data/site";
import type { ContactConfig } from "@/data/types";
import { trackContactCopy, trackOutboundLink } from "@/lib/analytics";

export function ContactSection({ config = siteContent.contact }: { config?: ContactConfig }) {
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(null);
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() ?? "";
  const showPhone = config.showPhone && phone.length > 0;

  async function handleCopy(field: "email" | "phone", value: string) {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      trackContactCopy(field);
      window.setTimeout(() => setCopiedField(null), 1800);
    } catch {
      setCopiedField(null);
    }
  }

  return (
    <section id="contact" className="section-anchor section-grid gap-y-6 py-2 sm:gap-y-8 sm:py-4">
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
                    src={config.icons.email.src}
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

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => handleCopy("email", email)}
                  disabled={!email}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-text px-5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <Copy className="h-4 w-4" />
                  {copiedField === "email"
                    ? "Email copied"
                    : config.primaryActionLabel}
                </button>
                <a
                  href={email ? `mailto:${email}` : undefined}
                  onClick={() => {
                    if (email) {
                      trackOutboundLink("contact_email", `mailto:${email}`);
                    }
                  }}
                  className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-medium sm:w-auto ${
                    email
                      ? "surface-pill text-text transition-colors hover:text-accent"
                      : "pointer-events-none rounded-full border border-border bg-surface text-muted"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  {config.secondaryActionLabel}
                </a>
              </div>
            </div>

            {showPhone ? (
              <div className="rounded-[1.45rem] border border-border/70 bg-surface-2/70 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-border/70 bg-background/80 p-2 sm:h-12 sm:w-12">
                    <Image
                      src={config.icons.phone.src}
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
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleCopy("phone", phone)}
                    className="surface-pill inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-medium text-text transition-colors hover:text-accent sm:w-auto"
                  >
                    <Copy className="h-4 w-4" />
                    {copiedField === "phone" ? "Phone copied" : "Copy phone"}
                  </button>
                  <a
                    href={`tel:${phone}`}
                    onClick={() => trackOutboundLink("contact_phone", `tel:${phone}`)}
                    className="surface-pill inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-medium text-text transition-colors hover:text-accent sm:w-auto"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                </div>
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
            <p className="sr-only" aria-live="polite">
              {copiedField === "email"
                ? "Email copied to clipboard"
                : copiedField === "phone"
                  ? "Phone number copied to clipboard"
                  : ""}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
