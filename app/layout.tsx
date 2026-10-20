import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { AuthRBACProvider } from "./AuthContext";
import { buildMetadataFromScreen, getLegalPortalJsonLd } from "./seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataFromScreen(2, {
    canonicalPath: "/",
  });
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getLegalPortalJsonLd();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Noto+Nastaliq+Urdu:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased selection:bg-emerald-900 selection:text-white">
        <AuthRBACProvider>{children}</AuthRBACProvider>
      </body>
    </html>
  );
}