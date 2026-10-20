import React, { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadataFromScreen } from "@/app/seo";
import ClientPage from "./ClientPage";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataFromScreen(11, {"canonicalPath":"/urdu/laws","title":"پاکستان کوڈ اور قوانین لائبریری – تعزیرات پاکستان و ضابطہ فوجداری","description":"آئین پاکستان 1973، مجموعہ تعزیرات پاکستان (PPC)، ضابطہ فوجداری اور فیملی کورٹس ایکٹ کا مستند اردو اور انگریزی متن پڑھیں۔"});
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
