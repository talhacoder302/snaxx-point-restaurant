import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Snaxx Point Restaurant | Every Bite, Pure Delight!",
    template: "%s | Snaxx Point Restaurant",
  },
  description:
    "Snaxx Point Restaurant is now open — fresh food, made with care. Every bite, pure delight. Order today!",
  keywords: [
    "Snaxx Point",
    "Restaurant",
    "Now Open",
    "Every Bite Pure Delight",
    "Order Online",
    "WhatsApp Order",
  ],
  icons: {
    icon: "/snaxxpoint-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}