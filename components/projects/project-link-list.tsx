import { ExternalLink } from "lucide-react";

import type { ProjectLink } from "@/data/types";
import { trackOutboundLink } from "@/lib/analytics";

function isTrackable(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
}

export function ProjectLinkList({ links }: { links: ProjectLink[] }) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => {
        const external = link.href.startsWith("http");

        return (
          <a
            key={`${link.label}-${link.href}`}
            href={link.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            onClick={() => {
              if (isTrackable(link.href)) {
                trackOutboundLink(link.label, link.href);
              }
            }}
            className="surface-pill inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-text transition-colors hover:text-accent"
          >
            {link.label}
            <ExternalLink className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
