"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../../Header";
import {
  Share2,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  Scale,
  X,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

function ArticleContent() {
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
      <div className="py-20 text-center font-ui text-sm text-stone-500">
        Loading editorial briefing...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20 font-ui">
        <h2 className="text-2xl font-bold text-stone-900 mb-3">
          Briefing not found
        </h2>
        <Link href="/" className="text-[#064E3B] font-semibold underline">
          Return to The Daily Legal Brief
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
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-300 font-ui text-xs no-print">
        <Link
          href="/"
          className="text-stone-700 hover:text-[#064E3B] font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Magazine Home (Screen 02)</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/urdu/article/${article.id}`}
            className="px-3 py-1.5 border border-stone-300 bg-white hover:border-[#064E3B] font-urdu text-xs"
          >
            اردو میں پڑھیں (Urdu Edition)
          </Link>
          <button
            type="button"
            onClick={() => setShareSheetOpen(true)}
            className="px-3.5 py-1.5 bg-[#064E3B] text-white font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share & Export PDF (Screen 05)</span>
          </button>
        </div>
      </div>

      <article className="bg-white border border-stone-300 p-8 sm:p-12">
        <div className="font-ui text-xs text-[#064E3B] font-semibold mb-3">
          <span>SCREEN 04 · EDITORIAL READER</span>
          <span className="mx-2 text-stone-400">·</span>
          <span>{article.category || "Constitutional Law"}</span>
          <span className="mx-2 text-stone-400">·</span>
          <span className="text-stone-500 font-normal">
            {article.read_time || "6 min read"}
          </span>
        </div>

        <h1
          className="text-3xl sm:text-5xl font-bold text-stone-950 leading-tight mb-4"
          style={{ textWrap: "balance" }}
        >
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-lg text-stone-600 leading-relaxed mb-6">
            {article.subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-stone-200 mb-8 font-ui text-xs text-stone-500">
          <div>
            <span className="font-semibold text-stone-900">
              {article.author || "Adv. Sara Mansoor, ASC"}
            </span>
            <span className="mx-2">·</span>
            <span>
              Published{" "}
              {article.created_at
                ? new Date(article.created_at).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "October 2026"}
            </span>
          </div>
          <span className="font-mono-code text-[#064E3B]">
            VERIFIED STATUTORY COMMENTARY
          </span>
        </div>

        <div className="drop-cap text-stone-900 text-lg leading-[1.85] whitespace-pre-wrap max-w-prose">
          {article.content}
        </div>

        {article.content_urdu && (
          <div className="mt-12 pt-8 border-t border-stone-200" dir="rtl">
            <div className="font-ui text-xs text-[#064E3B] font-semibold mb-3">
              اردو خلاصہ (Bilingual Statutory Summary)
            </div>
            <h2 className="font-urdu text-2xl font-bold text-stone-900 mb-4 leading-loose">
              {article.title_urdu}
            </h2>
            <div className="font-urdu text-lg text-stone-800 leading-loose whitespace-pre-wrap">
              {article.content_urdu}
            </div>
          </div>
        )}
      </article>

      {/* Screen 05: Social Share & Export Bottom Sheet / Modal */}
      {shareSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4 font-ui no-print"
          onClick={() => setShareSheetOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-md p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#064E3B] font-semibold block">
                  Screen 05 · Share & Export Brief
                </span>
                <h3 className="text-base font-bold text-stone-950">
                  Distribute or Save Legal Briefing
                </h3>
              </div>
              <button onClick={() => setShareSheetOpen(false)}>
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${article.title} — The Daily Legal Brief`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white border border-stone-300 hover:border-[#064E3B] text-xs font-semibold text-center text-stone-900"
              >
                Share via WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white border border-stone-300 hover:border-[#064E3B] text-xs font-semibold text-center text-stone-900"
              >
                Share on Facebook
              </a>
              <button
                type="button"
                onClick={copyShareUrl}
                className="p-3 bg-white border border-stone-300 hover:border-[#064E3B] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#064E3B]" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Citation Link</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShareSheetOpen(false);
                  window.print();
                }}
                className="p-3 bg-[#064E3B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Save as PDF / Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FullArticle() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111] font-legal">
      <Header lang="en" />
      <Suspense
        fallback={
          <div className="py-20 text-center font-ui text-sm text-stone-500">
            Loading article data...
          </div>
        }
      >
        <ArticleContent />
      </Suspense>
    </div>
  );
}