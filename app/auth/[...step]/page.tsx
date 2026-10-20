import React, { Suspense } from "react";
import type { Metadata } from "next";
import { generateAuthStepMetadata } from "@/app/seo";
import ClientPage from "./ClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ step: string[] }>;
}): Promise<Metadata> {
  const { step } = await params;
  return generateAuthStepMetadata(step);
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
