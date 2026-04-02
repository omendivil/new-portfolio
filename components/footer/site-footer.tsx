"use client";

import { Copy, Github, Linkedin, ExternalLink } from "lucide-react";

import { trackContactCopy, trackOutboundLink } from "@/lib/analytics";
import { useCopyClipboard } from "@/lib/use-copy-clipboard";

export function SiteFooter() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";
  const { copied, copy } = useCopyClipboard();

  async function handleCopyEmail() {
    if (!email) return;
    const success = await copy(email);
    if (success) trackContactCopy("email");
  }

  return (
    <footer id="contact" className="section-anchor px-4 pb-12 pt-20 sm:pb-16 sm:pt-28">
      <div className="mx-auto max-w-xl text-center">
        {/* Availability badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface/50 px-4 py-2 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs font-medium text-muted">
            Open to frontend &amp; iOS roles
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold tracking-[-0.03em] text-text sm:text-4xl">
          Let&apos;s talk.
        </h2>

        {/* Location */}
        <p className="mt-2 text-sm text-muted">
          Arizona · Remote-friendly
        </p>

        {/* Link row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {/* Copy email */}
          <button
            type="button"
            onClick={handleCopyEmail}
            disabled={!email}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-5 py-2.5 text-sm font-medium text-text backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? (
              <span className="text-green-500">✓ Copied</span>
            ) : (
              "Copy email"
            )}
          </button>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/omendivil"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackOutboundLink("linkedin", "https://linkedin.com/in/omendivil")}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-5 py-2.5 text-sm font-medium text-text backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
          >
            <Linkedin className="h-3.5 w-3.5" />
            LinkedIn
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/omendivil"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackOutboundLink("github", "https://github.com/omendivil")}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-5 py-2.5 text-sm font-medium text-text backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>

          {/* Groundwork Studios */}
          <a
            href="https://groundworkstudios.com"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackOutboundLink("groundwork", "https://groundworkstudios.com")}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-5 py-2.5 text-sm font-medium text-text backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Groundwork Studios
          </a>
        </div>

        {/* Built with credit */}
        <p className="mt-12 text-[11px] tracking-[0.05em] text-muted/40">
          Built with Next.js, Tailwind, Framer Motion, and Three.js
        </p>
      </div>

      {/* Screen reader */}
      <p className="sr-only" aria-live="polite">
        {copied ? "Email copied to clipboard" : ""}
      </p>
    </footer>
  );
}
