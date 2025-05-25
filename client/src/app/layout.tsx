"use client";

import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

import { FlocksProvider } from "@/store/flocks";
import { ClerkProvider } from "@clerk/nextjs";
import { NavigationProvider } from "@/store/navigation";
import { MainHeader } from "@/components/main-header";
import { SideDrawer } from "@/components/side-drawer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <title>Pakhale Poultry</title>
          <link rel="manifest" href="/manifest.json"></link>
        </head>
        <body className={inter.className}>
          <Suspense>
            <NavigationProvider>
              <FlocksProvider>
                <MainHeader />
                <SideDrawer />
                <main className="min-h-[100dvh] pt-16">{children}</main>
              </FlocksProvider>
            </NavigationProvider>
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
