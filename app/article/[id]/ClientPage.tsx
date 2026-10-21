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
  CheckCircle2,
  X,
  BookOpen,
  Sparkles,
  Sun,
  FileText,
  Moon,
  Volume2,
  Video,
  Users,
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
  const [isPrinting, setIsPrinting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // WCAG Legal Reader Toolbar State
  const [readerMode, setReaderMode] = useState<"bare_act" | "simple_summary">(
    "bare_act"
  );
  const [fontScale, setFontScale] = useState<number>(100);
  const [contrastMode, setContrastMode] = useState<"light" | "sepia" | "dark">(
    "light"
  );

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

  // UX Standard 2: Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && shareSheetOpen) {
        setShareSheetOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shareSheetOpen]);

  const handlePrintArticle = () => {
    if (typeof window === "undefined" || isPrinting) return;
    setShareSheetOpen(false);
    setIsPrinting(true);
    setFeedback(
      `Formatting "${article?.title || "Legal Briefing"}" for print (headers & footers hidden)...`
    );
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 120);
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-ui text-sm text-gray-500">
        Loading editorial briefing...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20 font-ui">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Briefing not found
        </h2>
        <Link
          href="/"
          className="min-h-[44px] inline-flex items-center px-4 py-2 text-emerald-800 font-semibold underline hover:bg-emerald-50 transition-all duration-200 active:scale-[0.98]"
        >
          Return to The Daily Legal Brief
        </Link>
      </div>
    );
  }

  const copyShareUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setFeedback("Article citation URL copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const contrastClasses =
    contrastMode === "dark"
      ? "bg-gray-900 text-gray-100 border-gray-700"
      : contrastMode === "sepia"
      ? "bg-[#FDF8EE] text-stone-900 border-amber-200"
      : "bg-white text-gray-900 border-gray-200";

  return (
    <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 flex-grow print-container">
      {/* Print-Only Editorial Masthead */}
      <div className="print-only border-b-2 border-black pb-4 mb-6">
        <div className="text-[10pt] uppercase tracking-widest font-mono-code">
          The Daily Legal Brief · Pakistan Digital Legal Journal
        </div>
        <div className="text-xs font-mono-code mt-1">
          Category: {article.category || "Constitutional Law"} · Author:{" "}
          {article.author_name || article.author || "Adv. Sara Mansoor, ASC"} ·
          Printed: {new Date().toLocaleDateString("en-PK")}
        </div>
      </div>

      {/* Top Action Toolbar (Hidden when printing via .no-print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200 font-ui text-xs no-print">
        <Link
          href="/"
          className="min-h-[44px] px-3 py-2 text-gray-700 hover:text-emerald-800 hover:bg-emerald-50 font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Back to Magazine Home (Screen 02)</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/urdu/article/${article.id}`}
            className="min-h-[44px] px-3.5 py-2 border border-gray-200 bg-white hover:border-emerald-800 hover:bg-emerald-50 font-urdu text-xs inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98]"
          >
            اردو میں پڑھیں (Urdu Edition)
          </Link>
          <button
            type="button"
            onClick={handlePrintArticle}
            disabled={isPrinting}
            aria-label="Print article or save as PDF"
            className="min-h-[44px] px-3.5 py-2 border border-gray-200 bg-white hover:border-emerald-800 hover:bg-emerald-50 text-gray-900 font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span>{isPrinting ? "Preparing Print..." : "Print Article"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShareSheetOpen(true)}
            className="min-h-[44px] px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 shrink-0" />
            <span>Share &amp; Export PDF (Screen 05)</span>
          </button>
        </div>
      </div>

      {/* WCAG Legal Reader Toolbar */}
      <div className="no-print mb-6 p-3.5 bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-3 font-ui text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-700 uppercase tracking-wider text-[11px] mr-1">
            WCAG Reader:
          </span>
          <button
            type="button"
            onClick={() => setReaderMode("bare_act")}
            className={`min-h-[44px] px-3.5 py-2 border font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer ${
              readerMode === "bare_act"
                ? "bg-emerald-800 text-white border-emerald-800"
                : "bg-white text-gray-800 border-gray-200 hover:border-emerald-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official Bare Act / Full Brief</span>
          </button>
          <button
            type="button"
            onClick={() => setReaderMode("simple_summary")}
            className={`min-h-[44px] px-3.5 py-2 border font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer ${
              readerMode === "simple_summary"
                ? "bg-emerald-800 text-white border-emerald-800"
                : "bg-white text-gray-800 border-gray-200 hover:border-emerald-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple Bilingual Summary</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center border border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => setFontScale((s) => Math.max(85, s - 10))}
              className="min-h-[44px] px-3 py-1.5 font-bold text-gray-800 hover:bg-gray-100 cursor-pointer border-r border-gray-200"
            >
              A-
            </button>
            <span className="px-2.5 text-[11px] font-mono-code text-gray-600">
              {fontScale}%
            </span>
            <button
              type="button"
              onClick={() => setFontScale((s) => Math.min(140, s + 10))}
              className="min-h-[44px] px-3 py-1.5 font-bold text-gray-800 hover:bg-gray-100 cursor-pointer border-l border-gray-200"
            >
              A+
            </button>
          </div>

          <div className="inline-flex items-center border border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => setContrastMode("light")}
              className={`min-h-[44px] px-3 py-1.5 font-semibold inline-flex items-center gap-1 cursor-pointer ${
                contrastMode === "light"
                  ? "bg-emerald-800 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setContrastMode("sepia")}
              className={`min-h-[44px] px-3 py-1.5 font-semibold inline-flex items-center gap-1 border-x border-gray-200 cursor-pointer ${
                contrastMode === "sepia"
                  ? "bg-amber-800 text-white"
                  : "text-gray-700 hover:bg-amber-50"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Sepia</span>
            </button>
            <button
              type="button"
              onClick={() => setContrastMode("dark")}
              className={`min-h-[44px] px-3 py-1.5 font-semibold inline-flex items-center gap-1 cursor-pointer ${
                contrastMode === "dark"
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Immediate Visual Feedback Banner (Hidden in Print) */}
      {feedback && (
        <div
          role="status"
          className="no-print mb-6 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-ui font-medium flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
            <span className="break-words">{feedback}</span>
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setFeedback(null)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors duration-200 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <article
        className={`border p-6 sm:p-12 print-document transition-colors duration-200 ${contrastClasses}`}
      >
        <div className="font-ui text-xs text-emerald-800 font-semibold mb-3">
          <span>SCREEN 04 · EDITORIAL READER</span>
          <span className="mx-2 opacity-50">·</span>
          <span>{article.category || "Constitutional Law"}</span>
          <span className="mx-2 opacity-50">·</span>
          <span className="opacity-75 font-normal">
            {article.read_time_minutes
              ? `${article.read_time_minutes} min read`
              : article.read_time || "6 min read"}
          </span>
        </div>

        <h1
          className="text-3xl sm:text-5xl font-bold leading-tight mb-4 break-words"
          style={{ textWrap: "balance" }}
        >
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-base sm:text-lg opacity-80 leading-relaxed mb-6 break-words">
            {article.subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200 mb-6 font-ui text-xs opacity-80">
          <div>
            <span className="font-semibold">
              {article.author_name || article.author || "Adv. Sara Mansoor, ASC"}
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
          <span className="font-mono-code text-emerald-800">
            VERIFIED STATUTORY COMMENTARY
          </span>
        </div>

        {/* Multimedia Video Reel & Audio Brief Bar */}
        {(article.video_reel_url || article.audio_brief_url) && (
          <div className="no-print mb-8 p-4 bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-ui text-xs text-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-800 text-white flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-gray-900">
                  Multimedia Legal Briefing Available
                </div>
                <div className="text-gray-600">
                  Listen to the 90-second audio brief or watch the explainer
                  reel
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {article.audio_brief_url && (
                <button
                  type="button"
                  onClick={() =>
                    setFeedback(
                      `Playing Audio Brief: ${article.audio_brief_url}`
                    )
                  }
                  className="min-h-[44px] px-3.5 py-2 bg-white border border-gray-300 hover:border-emerald-800 font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Play Audio Brief</span>
                </button>
              )}
              {article.video_reel_url && (
                <Link
                  href="/reels"
                  className="min-h-[44px] px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98]"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Watch Legal Reel</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {readerMode === "simple_summary" ? (
          <div
            className="p-6 bg-emerald-50/70 border border-emerald-200 text-gray-900 space-y-6"
            style={{ fontSize: `${fontScale}%` }}
          >
            <div>
              <div className="font-ui text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                Simple Citizen Summary (English)
              </div>
              <p className="leading-[1.85] whitespace-pre-wrap break-words">
                {article.subtitle || article.content}
              </p>
            </div>
            {article.content_urdu && (
              <div
                dir="rtl"
                className="pt-5 border-t border-emerald-200 font-urdu"
              >
                <div className="font-ui text-xs font-bold text-emerald-800 mb-2">
                  اردو خلاصہ (Simple Urdu Summary)
                </div>
                <h2 className="text-2xl font-bold mb-2 leading-loose break-words">
                  {article.title_urdu}
                </h2>
                <p className="text-lg leading-[2.4] whitespace-pre-wrap break-words">
                  {article.content_urdu}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: `${fontScale}%` }}>
            <div className="drop-cap text-base sm:text-lg leading-[1.85] whitespace-pre-wrap max-w-prose break-words">
              {article.content}
            </div>

            {article.content_urdu && (
              <div className="mt-12 pt-8 border-t border-gray-200" dir="rtl">
                <div className="font-ui text-xs text-emerald-800 font-semibold mb-3">
                  اردو خلاصہ (Bilingual Statutory Summary)
                </div>
                <h2 className="font-urdu text-2xl font-bold mb-4 leading-loose break-words">
                  {article.title_urdu}
                </h2>
                <div className="font-urdu text-lg leading-[2.4] whitespace-pre-wrap break-words">
                  {article.content_urdu}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA: Book a Verified Lawyer for This Issue */}
        <div className="no-print mt-10 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-ui">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Direct Legal Consultation
            </div>
            <p className="text-sm opacity-80 mt-1">
              Facing a legal matter related to{" "}
              <strong>{article.category || "this briefing"}</strong>? Consult a
              Bar-verified High Court Advocate.
            </p>
          </div>
          <Link
            href="/lawyers"
            className="min-h-[44px] px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all duration-200 active:scale-[0.98] shrink-0"
          >
            <Users className="w-4 h-4" />
            <span>Book a Verified Lawyer for This Issue →</span>
          </Link>
        </div>
      </article>

      {/* Print-Only Citation Footer */}
      <div className="print-only mt-8 pt-4 border-t border-black text-[9.5pt] font-mono-code">
        Editorial Citation · &ldquo;{article.title}&rdquo; by{" "}
        {article.author_name || article.author || "Adv. Sara Mansoor, ASC"} ·
        Published in The Daily Legal Brief (Pakistan Digital Legal Ecosystem).
      </div>

      {/* Screen 05: Social Share & Export Bottom Sheet / Modal (UX Standard 2 Compliant) */}
      {shareSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Share and Export Legal Briefing"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 font-ui no-print"
          onClick={() => setShareSheetOpen(false)}
        >
          <div
            className="bg-white border border-gray-200 w-full max-w-md p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-gray-200 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-emerald-800 font-semibold block">
                  Screen 05 · Share &amp; Export Brief
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Distribute or Save Legal Briefing
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close share and export modal"
                onClick={() => setShareSheetOpen(false)}
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${article.title} — The Daily Legal Brief`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] p-3 bg-white border border-gray-200 hover:border-emerald-800 hover:bg-emerald-50 text-xs font-semibold flex items-center justify-center text-center text-gray-900 transition-all duration-200 active:scale-[0.98]"
              >
                Share via WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] p-3 bg-white border border-gray-200 hover:border-emerald-800 hover:bg-emerald-50 text-xs font-semibold flex items-center justify-center text-center text-gray-900 transition-all duration-200 active:scale-[0.98]"
              >
                Share on Facebook
              </a>
              <button
                type="button"
                onClick={copyShareUrl}
                className="min-h-[44px] p-3 bg-white border border-gray-200 hover:border-emerald-800 hover:bg-emerald-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-800" />
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
                onClick={handlePrintArticle}
                className="min-h-[44px] p-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Save as PDF / Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function FullArticle() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-legal">
      <Header lang="en" />
      <Suspense
        fallback={
          <div className="py-20 text-center font-ui text-sm text-gray-500 flex-grow">
            Loading article data...
          </div>
        }
      >
        <ArticleContent />
      </Suspense>
    </div>
  );
}