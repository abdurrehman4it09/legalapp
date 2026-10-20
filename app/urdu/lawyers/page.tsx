import React, { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadataFromScreen } from "@/app/seo";
import ClientPage from "./ClientPage";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataFromScreen(6, {"canonicalPath":"/urdu/lawyers","title":"پاکستان کے تصدیق شدہ ہائی کورٹ وکلاء ڈائریکٹری | لیگل بریف","description":"لاہور، کراچی اور اسلام آباد کے بار کونسل سے تصدیق شدہ سول، فوجداری اور فیملی وکلاء سے آن لائن مشاورت بک کریں۔"});
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
