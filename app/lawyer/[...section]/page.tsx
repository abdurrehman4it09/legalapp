import React, { Suspense } from "react";
import type { Metadata } from "next";
import { generateLawyerSectionMetadata } from "@/app/seo";
import ClientPage from "./ClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string[] }>;
}): Promise<Metadata> {
  const { section } = await params;
  return generateLawyerSectionMetadata(section);
}

export default function Page({
  params,
}: {
  params: Promise<{ section: string[] }>;
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
