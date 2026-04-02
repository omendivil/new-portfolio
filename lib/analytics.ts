"use client";

import { track as trackVercel } from "@vercel/analytics/react";

export const analyticsEvents = {
  themeToggle: "theme_toggle",
  openBrowseDrawer: "open_browse_drawer",
  openProject: "open_project",
  closeProject: "close_project",
  playVideo: "play_video",
  chapterClick: "chapter_click",
  outboundLinkClick: "outbound_link_click",
  copyContact: "copy_contact",
} as const;

export type AnalyticsEventName =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "config" | "event" | "js",
      targetId: string | Date,
      config?: AnalyticsProperties,
    ) => void;
  }
}

function getGaMeasurementId() {
  return (
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? process.env.NEXT_PUBLIC_GA_ID
  );
}

export function trackEvent(
  name: AnalyticsEventName,
  properties?: AnalyticsProperties,
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    trackVercel(name, properties);
  } catch {
    // Analytics should never crash the app
  }

  if (window.gtag && getGaMeasurementId()) {
    window.gtag("event", name, properties);
  }
}

export function trackBrowseDrawer(open: boolean, properties?: AnalyticsProperties) {
  trackEvent(analyticsEvents.openBrowseDrawer, {
    open,
    ...properties,
  });
}

export function trackProjectOpen(
  projectId: string,
  properties?: AnalyticsProperties,
) {
  trackEvent(analyticsEvents.openProject, {
    project: projectId,
    ...properties,
  });
}

export function trackProjectClose(
  projectId: string,
  properties?: AnalyticsProperties,
) {
  trackEvent(analyticsEvents.closeProject, {
    project: projectId,
    ...properties,
  });
}

export function trackVideoPlay(
  projectId: string,
  videoId: string,
  properties?: AnalyticsProperties,
) {
  trackEvent(analyticsEvents.playVideo, {
    project: projectId,
    video: videoId,
    ...properties,
  });
}

export function trackChapterClick(
  projectId: string,
  chapterId: string,
  properties?: AnalyticsProperties,
) {
  trackEvent(analyticsEvents.chapterClick, {
    project: projectId,
    chapter: chapterId,
    ...properties,
  });
}

export function trackOutboundLink(
  label: string,
  href: string,
  properties?: AnalyticsProperties,
) {
  trackEvent(analyticsEvents.outboundLinkClick, {
    label,
    href,
    ...properties,
  });
}

export function trackContactCopy(
  channel: "email" | "phone",
  properties?: AnalyticsProperties,
) {
  trackEvent(analyticsEvents.copyContact, {
    channel,
    ...properties,
  });
}
