"use client";

import { Copy, Mail, Phone } from "lucide-react";
import { useState } from "react";

import { trackContactCopy, trackOutboundLink } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ContactActionButtonsProps = {
  channel: "email" | "phone";
  copiedLabel: string;
  copyLabel: string;
  href: string | undefined;
  hrefLabel: string;
  primaryVariant?: "pill" | "solid";
  value: string;
};

export function ContactActionButtons({
  channel,
  copiedLabel,
  copyLabel,
  href,
  hrefLabel,
  primaryVariant = "pill",
  value,
}: ContactActionButtonsProps) {
  const [copied, setCopied] = useState(false);
  const isDisabled = value.length === 0;
  const LinkIcon = channel === "email" ? Mail : Phone;
  const trackingLabel = channel === "email" ? "contact_email" : "contact_phone";

  async function handleCopy() {
    if (isDisabled) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      trackContactCopy(channel);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={handleCopy}
          disabled={isDisabled}
          className={cn(
            "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-medium sm:w-auto",
            primaryVariant === "solid"
              ? "bg-text text-background transition-transform hover:-translate-y-0.5"
              : "surface-pill text-text transition-colors hover:text-accent",
            isDisabled && "cursor-not-allowed opacity-60 hover:translate-y-0 hover:text-inherit",
          )}
        >
          <Copy className="h-4 w-4" />
          {copied ? copiedLabel : copyLabel}
        </button>

        {href ? (
          <a
            href={href}
            onClick={() => trackOutboundLink(trackingLabel, href)}
            className="surface-pill inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-medium text-text transition-colors hover:text-accent sm:w-auto"
          >
            <LinkIcon className="h-4 w-4" />
            {hrefLabel}
          </a>
        ) : (
          <span className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-muted sm:w-auto">
            <LinkIcon className="h-4 w-4" />
            {hrefLabel}
          </span>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ""}
      </p>
    </>
  );
}
