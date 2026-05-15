import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/src/providers";
import { siteConfig } from "@/src/config";
import "./globals.css";
import { Navbar } from "@/src/components/layout/navbar";
import { ConditionalFooter } from "@/src/components/layout/conditional-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: ["learning", "courses", "internships", "mentorship", "career", "education"],
  authors: [{ name: "Nexora" }],
  creator: "Nexora",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0d0f1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `try{var t=localStorage.getItem("nexora-theme");if(t==="dark"){document.documentElement.classList.add("dark")}}catch(_){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable}`}
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <Script
          id="nexora-theme-init"
          strategy="beforeInteractive"
        >
          {themeInitScript}
        </Script>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
