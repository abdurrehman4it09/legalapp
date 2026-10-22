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
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#FAF9F5] text-[#141413] font-ui-sans antialiased selection:bg-[#0B5D3B] selection:text-white">
        <AuthRBACProvider>{children}</AuthRBACProvider>
      </body>
    </html>
  );
}
