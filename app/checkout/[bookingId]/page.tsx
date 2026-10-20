import React, { Suspense } from "react";
import type { Metadata } from "next";
import { generateCheckoutMetadata } from "@/app/seo";
import ClientPage from "./ClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}): Promise<Metadata> {
  const { bookingId } = await params;
  return generateCheckoutMetadata(bookingId);
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
