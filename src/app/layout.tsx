import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DailyDeals — Cheapest US deals on things you buy every day",
    template: "%s — DailyDeals",
  },
  description:
    "Hand-picked US deals on food, household, clothing, gadgets and daily essentials. Updated all day.",
  keywords: [
    "deals",
    "discounts",
    "coupons",
    "sales",
    "cheap deals",
    "daily deals",
    "amazon deals",
    "best deals",
    "clearance",
    "bargains",
    "shopping deals",
    "food deals",
    "clothing deals",
    "household deals",
    "gadget deals",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dailydeals-platform.vercel.app",
    siteName: "DailyDeals",
    title: "DailyDeals — Cheapest US deals on things you buy every day",
    description:
      "Hand-picked US deals on food, household, clothing, gadgets and daily essentials. Updated all day.",
    images: [
      {
        url: "https://dailydeals-platform.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "DailyDeals - Best daily deals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DailyDeals — Cheapest US deals on things you buy every day",
    description:
      "Hand-picked US deals on food, household, clothing, gadgets and daily essentials. Updated all day.",
    images: ["https://dailydeals-platform.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Replace with actual code after Google Search Console setup
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
