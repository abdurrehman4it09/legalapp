"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../../../Header";
import { ArrowRight, Bookmark, Printer } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

function UrduLawContent() {
  const params = useParams();
  const [law, setLaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    async function fetchLaw() {
      if (!params?.id) return;
      try {
        const { data, error } = await supabase
          .from("laws")
          .select("*")
          .eq("id", params.id)
          .single();
        if (!error && data) setLaw(data);
      } catch (error) {
        console.error("Error fetching law:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLaw();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-stone-500">
        قانونی متن لوڈ ہو رہا ہے...
      </div>
    );
  }

  if (!law) {
    return (
      <div className="text-center py-20" dir="rtl">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">
          قانون نہیں ملا
        </h2>
        <Link href="/urdu/laws" className="text-[#064E3B] underline">
          واپس قانونی لائبریری جائیں
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-6xl mx-auto px-6 py-10 font-urdu">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-300 font-ui text-xs no-print">
        <Link
          href="/urdu/laws"
          className="text-stone-700 hover:text-[#064E3B] font-semibold flex items-center gap-1.5"
        >
          <ArrowRight className="w-4 h-4" />
          <span>واپس قانونی لائبریری (Screen 11)</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/laws/${law.id}`}
            className="px-3 py-1.5 border border-stone-300 bg-white text-xs"
            dir="ltr"
          >
            English Text
          </Link>
          <button
            type="button"
            onClick={() => setBookmarked(!bookmarked)}
            className={`px-3.5 py-1.5 border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              bookmarked
                ? "bg-[#B48327] text-white border-[#B48327]"
                : "bg-white text-stone-800 border-stone-300"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{bookmarked ? "محفوظ شدہ" : "بک مارک کریں"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-[#064E3B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>پرنٹ / پی ڈی ایف</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-stone-300 p-8 sm:p-12">
        <div className="lg:col-span-8 lg:border-l lg:border-stone-200 lg:pl-8">
          <div className="font-ui text-xs text-stone-500 mb-3">
            <span className="font-semibold text-[#064E3B]">
              اسکرین 12 · قانونی مطالعہ
            </span>
            <span className="mx-2 text-[#B48327]">·</span>
            <span>{law.category}</span>
            <span className="mx-2 text-[#B48327]">·</span>
            <span>{law.section_urdu || law.section_number}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-stone-950 leading-loose pb-6 border-b-2 border-[#B48327]/50 mb-8">
            {law.title_urdu || law.title}
          </h1>

          <div className="text-stone-900 text-xl leading-[2.4] whitespace-pre-wrap">
            {law.content_urdu || law.content}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6 font-ui">
          <div className="p-5 bg-[#FBF9F5] border border-stone-200 space-y-3">
            <div className="text-xs text-[#B48327] font-semibold">
              حاشیہ اور قانونی تشریح (Marginal Notes)
            </div>
            <p className="font-urdu text-base text-stone-800 leading-loose">
              {law.marginal_notes_urdu ||
                law.marginal_notes ||
                "یہ قانونی دفعہ پاکستان کی تمام ہائی کورٹس اور ماتحت عدالتوں میں نافذ العمل ہے۔"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function FullUrduLawPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#FBF9F5] text-[#111111] font-urdu">
      <Header lang="ur" />
      <Suspense
        fallback={
          <div className="py-20 text-center text-stone-500">
            ڈیٹا لوڈ ہو رہا ہے...
          </div>
        }
      >
        <UrduLawContent />
      </Suspense>
    </div>
  );
}