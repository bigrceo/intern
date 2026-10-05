import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import { BRAND } from "@/lib/brand";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap", weight: ["400", "500", "600", "700"] });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description: BRAND.description,
  metadataBase: new URL(process.env.APP_URL ?? `https://${BRAND.domain}`),
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${BRAND.name} — ${BRAND.tagline}` }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Satoshi (eyebrows) et Nippo (wordmark) du template, absents de Google Fonts. */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500&f[]=nippo@500&display=swap" />
        {/* test-only: emulated injected wallet, never set in production */}
        {process.env.NEXT_PUBLIC_TEST_WALLET === "1" && <Script src="/__wallet_stub.js" strategy="beforeInteractive" />}
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
