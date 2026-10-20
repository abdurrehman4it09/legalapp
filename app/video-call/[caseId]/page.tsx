import React, { Suspense } from "react";
import type { Metadata } from "next";
import { generateVideoCallMetadata } from "@/app/seo";
import ClientPage from "./ClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ caseId: string }>;
}): Promise<Metadata> {
  const { caseId } = await params;
  return generateVideoCallMetadata(caseId);
}

export default function Page({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F5] p-10 text-center text-xs text-stone-500">
          Loading...
        </div>
      }
    >
      <ClientPage params={params} />
    </Suspense>
  );
}
