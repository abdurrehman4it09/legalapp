import React, { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadataFromScreen } from "@/app/seo";
import ClientPage from "./ClientPage";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataFromScreen(50, {"canonicalPath":"/admin/dashboard","title":"Executive Legal Portal Analytics & CMS Overview | Admin","description":"Monitor live Supabase database metrics, verified High Court advocate queues, and bilingual article publishing across Pakistan."});
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F5] p-10 text-center text-xs text-stone-500">
          Loading...
        </div>
      }
    >
      <ClientPage />
    </Suspense>
  );
}
