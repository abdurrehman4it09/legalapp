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
      `Formatting "${article?.title || "Legal Briefing"}" for print (headers & footers hidden)…`
    );
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 120);
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-ui-sans text-sm text-[#57554F]">
        Loading editorial briefing…
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-24 font-ui-sans">
        <h2 className="font-legal-serif text-2xl font-bold text-[#141413] mb-3">
          Briefing not found
        </h2>
        <Link href="/" className="editorial-link text-sm text-[#141413]">
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
      ? "bg-[#141413] text-[#FAF9F5] border-[#2C2B29]"
      : contrastMode === "sepia"
      ? "bg-[#F2EFE9] text-[#141413] border-[#E6E4DD]"
      : "bg-[#FAF9F5] text-[#141413] border-[#E6E4DD]";

  return (
    <main className="max-w-4xl mx-auto w-full px-6 py-16 sm:py-24 flex-grow print-container">
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

      <div className="max-w-2xl mx-auto">
        {/* Top Action Toolbar (Hidden when printing via .no-print) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E6E4DD] text-xs no-print">
          <Link
            href="/"
            className="editorial-link text-[#141413] font-medium inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Back to Journal</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/urdu/article/${article.id}`}
              className="px-3.5 py-2 border border-[#E6E4DD] bg-[#F2EFE9] hover:border-[#141413] font-urdu text-xs inline-flex items-center justify-center transition-colors duration-500"
            >
              اردو میں پڑھیں
            </Link>
            <button
              type="button"
              onClick={handlePrintArticle}
              disabled={isPrinting}
              aria-label="Print article or save as PDF"
              className="px-3.5 py-2 border border-[#E6E4DD] bg-[#FAF9F5] hover:border-[#141413] text-[#141413] font-medium inline-flex items-center gap-1.5 transition-colors duration-500 cursor-pointer disabled:opacity-60"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>{isPrinting ? "Preparing…" : "Print"}</span>
            </button>
            <button
              type="button"
              onClick={() => setShareSheetOpen(true)}
              className="px-4 py-2 bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] font-medium inline-flex items-center gap-1.5 transition-colors duration-500 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 shrink-0" />
              <span>Share &amp; Export</span>
            </button>
          </div>
        </div>

        {/* Calm Reader Toolbar */}
        <div className="no-print mb-10 p-4 bg-[#F2EFE9] border border-[#E6E4DD] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setReaderMode("bare_act")}
              className={`px-3.5 py-2 border font-medium inline-flex items-center gap-1.5 transition-colors duration-500 cursor-pointer ${
                readerMode === "bare_act"
                  ? "bg-[#0B5D3B] text-[#FAF9F5] border-[#0B5D3B]"
                  : "bg-[#FAF9F5] text-[#141413] border-[#E6E4DD]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Essay</span>
            </button>
            <button
              type="button"
              onClick={() => setReaderMode("simple_summary")}
              className={`px-3.5 py-2 border font-medium inline-flex items-center gap-1.5 transition-colors duration-500 cursor-pointer ${
                readerMode === "simple_summary"
                  ? "bg-[#0B5D3B] text-[#FAF9F5] border-[#0B5D3B]"
                  : "bg-[#FAF9F5] text-[#141413] border-[#E6E4DD]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bilingual Summary</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center border border-[#E6E4DD] bg-[#FAF9F5]">
              <button
                type="button"
                onClick={() => setFontScale((s) => Math.max(85, s - 10))}
                className="px-2.5 py-1.5 font-medium text-[#141413] cursor-pointer border-r border-[#E6E4DD]"
              >
                A-
              </button>
              <span className="px-2 text-[11px] text-[#57554F]">
                {fontScale}%
              </span>
              <button
                type="button"
                onClick={() => setFontScale((s) => Math.min(140, s + 10))}
                className="px-2.5 py-1.5 font-medium text-[#141413] cursor-pointer border-l border-[#E6E4DD]"
              >
                A+
              </button>
            </div>

            <div className="inline-flex items-center border border-[#E6E4DD] bg-[#FAF9F5]">
              <button
                type="button"
                onClick={() => setContrastMode("light")}
                className={`px-2.5 py-1.5 cursor-pointer ${
                  contrastMode === "light"
                    ? "bg-[#141413] text-[#FAF9F5]"
                    : "text-[#57554F]"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setContrastMode("sepia")}
                className={`px-2.5 py-1.5 border-x border-[#E6E4DD] cursor-pointer ${
                  contrastMode === "sepia"
                    ? "bg-[#141413] text-[#FAF9F5]"
                    : "text-[#57554F]"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setContrastMode("dark")}
                className={`px-2.5 py-1.5 cursor-pointer ${
                  contrastMode === "dark"
                    ? "bg-[#141413] text-[#FAF9F5]"
                    : "text-[#57554F]"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {feedback && (
          <div
            role="status"
            className="no-print mb-8 p-4 bg-[#F2EFE9] border border-[#E6E4DD] text-[#141413] text-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0B5D3B] shrink-0" />
              <span>{feedback}</span>
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setFeedback(null)}
              className="text-[#57554F] hover:text-[#141413] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <article
          className={`border p-8 sm:p-12 print-document transition-colors duration-500 ${contrastClasses}`}
        >
          <div className="text-xs uppercase tracking-[0.14em] opacity-70 mb-4">
            <span>{article.category || "Constitutional Law"}</span>
            <span className="mx-2">·</span>
            <span>
              {article.read_time_minutes
                ? `${article.read_time_minutes} min read`
                : article.read_time || "6 min read"}
            </span>
          </div>

          <h1
            className="font-legal-serif text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-[1.2] mb-6"
            style={{ textWrap: "balance" }}
          >
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-lg opacity-80 leading-[1.75] mb-8">
              {article.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#E6E4DD] mb-8 text-xs opacity-80">
            <div>
              <span className="font-semibold">
                {article.author_name ||
                  article.author ||
                  "Adv. Sara Mansoor, ASC"}
              </span>
              <span className="mx-2">·</span>
              <span>
                {article.created_at
                  ? new Date(article.created_at).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "October 2026"}
              </span>
            </div>
            <span className="uppercase tracking-wider">
              Verified Legal Essay
            </span>
          </div>

          {(article.video_reel_url || article.audio_brief_url) && (
            <div className="no-print mb-10 p-5 bg-[#F2EFE9] border border-[#E6E4DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#141413]">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-[#0B5D3B] shrink-0" />
                <div>
                  <div className="font-semibold">Audio &amp; Video Briefing</div>
                  <div className="text-[#57554F]">
                    Listen to the 90-second audio brief or watch the explainer
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
                    className="px-3.5 py-2 bg-[#FAF9F5] border border-[#E6E4DD] hover:border-[#141413] font-medium inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#0B5D3B]" />
                    <span>Play Audio</span>
                  </button>
                )}
                {article.video_reel_url && (
                  <Link
                    href="/reels"
                    className="px-3.5 py-2 bg-[#0B5D3B] text-[#FAF9F5] font-medium inline-flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch Reel</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {readerMode === "simple_summary" ? (
            <div
              className="p-6 bg-[#F2EFE9] border border-[#E6E4DD] text-[#141413] space-y-6"
              style={{ fontSize: `${fontScale}%` }}
            >
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-[#57554F] mb-2">
                  Simple Citizen Summary (English)
                </div>
                <p className="leading-[1.85] whitespace-pre-wrap">
                  {article.subtitle || article.content}
                </p>
              </div>
              {article.content_urdu && (
                <div
                  dir="rtl"
                  className="pt-6 border-t border-[#E6E4DD] font-urdu"
                >
                  <h2 className="text-2xl font-bold mb-2">
                    {article.title_urdu}
                  </h2>
                  <p className="text-xl whitespace-pre-wrap">
                    {article.content_urdu}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: `${fontScale}%` }}>
              <div className="drop-cap text-base sm:text-lg leading-[1.85] whitespace-pre-wrap">
                {article.content}
              </div>

              {article.content_urdu && (
                <div
                  className="mt-14 pt-10 border-t border-[#E6E4DD]"
                  dir="rtl"
                >
                  <div className="text-sm text-[#57554F] mb-3 font-urdu">
                    اردو خلاصہ
                  </div>
                  <h2 className="font-urdu text-2xl font-bold mb-4">
                    {article.title_urdu}
                  </h2>
                  <div className="font-urdu text-xl whitespace-pre-wrap">
                    {article.content_urdu}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="no-print mt-14 pt-8 border-t border-[#E6E4DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-legal-serif text-base font-bold">
                Direct Legal Consultation
              </div>
              <p className="text-xs opacity-75 mt-1">
                Consult a Bar-verified High Court Advocate regarding{" "}
                {article.category || "this legal briefing"}.
              </p>
            </div>
            <Link
              href="/lawyers"
              className="px-5 py-3 bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs font-medium inline-flex items-center gap-2 transition-colors duration-500 shrink-0"
            >
              <Users className="w-4 h-4" />
              <span>Book a Verified Lawyer →</span>
            </Link>
          </div>
        </article>

        {/* Print-Only Citation Footer */}
        <div className="print-only mt-8 pt-4 border-t border-black text-[9.5pt] font-mono-code">
          Editorial Citation · &ldquo;{article.title}&rdquo; by{" "}
          {article.author_name || article.author || "Adv. Sara Mansoor, ASC"} ·
          Published in The Daily Legal Brief.
        </div>
      </div>

      {/* Share & Export Modal */}
      {shareSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Share and Export Legal Briefing"
          className="fixed inset-0 z-50 bg-[#141413]/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 no-print"
          onClick={() => setShareSheetOpen(false)}
        >
          <div
            className="bg-[#FAF9F5] border border-[#E6E4DD] w-full max-w-md p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#E6E4DD] pb-4">
              <div>
                <h3 className="font-legal-serif text-lg font-bold text-[#141413]">
                  Share or Save Briefing
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close share and export modal"
                onClick={() => setShareSheetOpen(false)}
                className="text-[#57554F] hover:text-[#141413] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${article.title} — The Daily Legal Brief`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#F2EFE9] border border-[#E6E4DD] hover:border-[#141413] font-medium flex items-center justify-center text-center text-[#141413]"
              >
                Share via WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#F2EFE9] border border-[#E6E4DD] hover:border-[#141413] font-medium flex items-center justify-center text-center text-[#141413]"
              >
                Share on Facebook
              </a>
              <button
                type="button"
                onClick={copyShareUrl}
                className="p-3 bg-[#F2EFE9] border border-[#E6E4DD] hover:border-[#141413] font-medium flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0B5D3B]" />
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
                className="p-3 bg-[#0B5D3B] text-[#FAF9F5] font-medium flex items-center justify-center gap-1.5 cursor-pointer"
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
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#141413] font-ui-sans">
      <Header lang="en" />
      <Suspense
        fallback={
          <div className="py-24 text-center text-sm text-[#57554F] flex-grow">
            Loading article data…
          </div>
        }
      >
        <ArticleContent />
      </Suspense>
    </div>
  );
}