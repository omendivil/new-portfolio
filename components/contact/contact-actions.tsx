"use client";

import Image from "next/image";
import { Check, Copy, Mail, Phone } from "lucide-react";
import { useState } from "react";

import type { ContactConfig } from "@/data/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface ContactActionsProps {
  email: string;
  phone?: string;
  config: ContactConfig;
}

export function ContactActions({ email, phone, config }: ContactActionsProps) {
  const [copied, setCopied] = useState(false);
  const canCopy = email.length > 0;

  async function handleCopy() {
    if (!canCopy) {
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      trackEvent("copy_contact", { channel: "email" });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[0.72fr_1fr]">
      <div className="rounded-[24px] border border-border bg-surface p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-2">
            <Image src={config.emailIconUrl} alt="" width={26} height={26} className="object-contain" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Preferred channel</p>
            <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-text">Email</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-muted">
          {email || `Add ${config.emailEnvVar} in .env.local to display the contact address.`}
        </p>
      </div>
      <div className="rounded-[24px] border border-border bg-surface-2/70 p-5">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!canCopy}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              canCopy
                ? "border border-border bg-surface text-text hover:bg-surface-2"
                : "cursor-not-allowed border border-border bg-surface text-muted",
            )}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : config.copyLabel}
          </button>
          <a
            href={canCopy ? `mailto:${email}` : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              canCopy
                ? "border-border bg-surface text-text hover:bg-surface-2"
                : "pointer-events-none border-border bg-surface text-muted",
            )}
          >
            <Mail className="h-4 w-4" />
            Open mail app
          </a>
          {config.showPhone && phone ? (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-2"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
          ) : null}
        </div>
        <p className="mt-5 text-sm leading-7 text-muted">{config.description}</p>
      </div>
    </div>
  );
}
