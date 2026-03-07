import { Analytics } from "@vercel/analytics/react";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";

export function SiteAnalytics() {
  return (
    <>
      <Analytics />
      <GoogleAnalytics />
    </>
  );
}
