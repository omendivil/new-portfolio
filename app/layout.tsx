import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Newsreader } from "next/font/google";

import { AmbientBackground } from "@/components/ambient/ambient-background";
import { SiteAnalytics } from "@/components/analytics/site-analytics";
import { ThemeProvider } from "@/components/theme-provider";
import "../styles/globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Omar Mendivil",
  description: "Portfolio for Omar Mendivil, focused on product-minded iOS and web engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} ${display.variable} antialiased`}>
        <ThemeProvider>
          <AmbientBackground />
          {children}
          <SiteAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
