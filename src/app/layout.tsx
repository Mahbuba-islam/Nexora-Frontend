import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import QueryProviders from "../providers/QueryProvider";
import LenisProvider from "../providers/LenisProvider";
import ScrollToTop from "@/components/modules/shared/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexora — AI-Powered Tech Commerce",
  description:
    "Nexora is the AI-native marketplace for premium tech — personalized recommendations, intelligent search, and a buying experience designed for the next decade.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LenisProvider>
            <QueryProviders>{children}</QueryProviders>
            <ScrollToTop />
          </LenisProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}