import React, { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadataFromScreen } from "@/app/seo";
import ClientPage from "./ClientPage";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataFromScreen(2, {"canonicalPath":"/"});
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F5] p-12 text-center font-mono-code text-xs text-[#66645E]">
          Loading QanoonPK Citizen Justice Archive...
        </div>
      }
    >
      <ClientPage />
    </Suspense>
  );
}
