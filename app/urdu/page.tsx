import React, { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadataFromScreen } from "@/app/seo";
import ClientPage from "./ClientPage";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataFromScreen(2, {"canonicalPath":"/urdu","title":"دی ڈیلی لیگل بریف پاکستان – سپریم کورٹ فیصلے، قوانین اور وکلاء","description":"پاکستان کے مستند قانونی جریدے میں سپریم کورٹ کے تازہ فیصلے، مجموعہ تعزیرات پاکستان اور ہائی کورٹ کے تصدیق شدہ وکلاء سے مشاورت کریں۔"});
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
