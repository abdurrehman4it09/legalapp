"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../../../Header";
import { Share2, Printer, Copy, Check, ArrowRight, X } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

function UrduArticleContent() {
  const params = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      if (!params?.id) return;
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", params.id)
          .single();
        if (!error && data) setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-stone-500">
        مضمون لوڈ ہو رہا ہے...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20" dir="rtl">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">
          مضمون نہیں ملا
        </h2>
        <Link href="/urdu" className="text-[#064E3B] underline">
          واپس ہوم پیج پر جائیں
        </Link>
      </div>
    );
  }

  const copyShareUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div dir="rtl" className="max-w-4xl mx-auto px-6 py-10 font-urdu">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-300 font-ui text-xs no-print">
        <Link
          href="/urdu"
          className="text-stone-700 hover:text-[#064E3B] font-semibold flex items-center gap-1.5"
        >
          <ArrowRight className="w-4 h-4" />
          <span>واپس جریدہ ہوم (Screen 02)</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/article/${article.id}`}
            className="px-3 py-1.5 border border-stone-300 bg-white hover:border-[#064E3B] text-xs"
            dir="ltr"
          >
            Read in English
          </Link>
          <button
            type="button"
            onClick={() => setShareSheetOpen(true)}
            className="px-3.5 py-1.5 bg-[#064E3B] text-white font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>شیئر اور پی ڈی ایف (Screen 05)</span>
          </button>
        </div>
      </div>

      <article className="bg-white border border-stone-300 p-8 sm:p-12">
        <div className="font-ui text-xs text-[#064E3B] font-semibold mb-4">
          <span>اسکرین 04 · ادارتی مطالعہ</span>
          <span className="mx-2 text-stone-400">·</span>
          <span>{article.category_urdu || article.category || "قانونی تجزیہ"}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-stone-950 leading-loose mb-4">
          {article.title_urdu || article.title}
        </h1>

        {article.subtitle_urdu && (
          <p className="text-xl text-stone-600 leading-loose mb-6">
            {article.subtitle_urdu}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-stone-200 mb-8 font-ui text-xs text-stone-500">
          <span>{article.author_urdu || article.author || "ادارتی بورڈ"}</span>
          <span>
            شائع شدہ:{" "}
            {article.created_at
              ? new Date(article.created_at).toLocaleDateString("ur-PK")
              : "2026"}
          </span>
        </div>

        <div className="text-stone-900 text-xl leading-[2.4] whitespace-pre-wrap">
          {article.content_urdu || article.content}
        </div>
      </article>

      {shareSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 font-ui no-print"
          onClick={() => setShareSheetOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-md p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-sm font-bold text-stone-950">
                اسکرین 05 · مضمون شیئر یا پی ڈی ایف محفوظ کریں
              </h3>
              <button onClick={() => setShareSheetOpen(false)}>
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${article.title_urdu || article.title} — دی ڈیلی لیگل بریف`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white border border-stone-300 text-xs font-semibold text-center"
              >
                واٹس ایپ پر شیئر کریں
              </a>
              <button
                type="button"
                onClick={copyShareUrl}
                className="p-3 bg-white border border-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "لنک کاپی ہو گیا" : "لنک کاپی کریں"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShareSheetOpen(false);
                  window.print();
                }}
                className="col-span-2 p-3 bg-[#064E3B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>پی ڈی ایف محفوظ کریں (Save as PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FullUrduArticle() {
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
        <UrduArticleContent />
      </Suspense>
    </div>
  );
}