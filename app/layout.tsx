import "./globals.css";
import React from "react";

export const metadata = {
  title: "The Daily Legal Brief",
  description: "Minimalist Pakistan legal journal, statute library, and verified advocate directory.",
  openGraph: {
    title: "The Daily Legal Brief",
    description: "Minimalist Pakistan legal journal, statute library, and verified advocate directory.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Noto+Nastaliq+Urdu:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased selection:bg-emerald-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}