"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/app/Header";
import { createClient } from "@/app/supabase";
import {
  ArrowLeft,
  Share2,
  Scale,
  Users,
  MessageSquare,
  Printer,
  Copy,
  CheckCircle2,
  X,
  BookOpen,
  Sparkles,
  Sun,
  FileText,
  Moon,
  Volume2,
  Video,
} from "lucide-react";

const supabase = createClient();

function MagazineArticleReaderPageInner() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<any | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
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
    async function load() {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setPost(data);
      } else {
        const { data: all } = await supabase.from("articles").select("*");
        if (all && all[0]) setPost(all[0]);
      }
    }
    load();
    window.addEventListener("plp_data_updated", load);
    return () => window.removeEventListener("plp_data_updated", load);
  }, [id]);

  // UX Standard 2: Close Share modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && shareOpen) {
        setShareOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shareOpen]);

  const handlePrintArticle = () => {
    if (typeof window === "undefined" || isPrinting) return;
    setShareOpen(false);
    setIsPrinting(true);
    setFeedback(
      `Formatting "${post?.title || "Legal Briefing"}" for print (headers & footers hidden)...`
    );
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 120);
  };

  const contrastClasses =
    contrastMode === "dark"
      ? "bg-gray-900 text-gray-100 border-gray-700"
      : contrastMode === "sepia"
      ? "bg-[#FDF8EE] text-stone-900 border-amber-200"
      : "bg-white text-gray-900 border-gray-200";

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-10 space-y-6 flex-grow print-container">
        {/* Print-Only Editorial Masthead */}
        <div className="print-only border-b-2 border-black pb-4 mb-6">
          <div className="text-[10pt] uppercase tracking-widest font-mono-code">
            The Daily Legal Brief · Pakistan Digital Legal Journal
          </div>
          <div className="text-xs font-mono-code mt-1">
            Category: {post?.category || "Constitutional Brief"} · Author:{" "}
            {post?.author_name || post?.author || "Editorial Board"} · Printed:{" "}
            {new Date().toLocaleDateString("en-PK")}
          </div>
        </div>

        {/* Top Navigation & Print/Share Action Bar (Hidden in Print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 text-xs font-ui no-print">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="min-h-[44px] px-3 py-2 font-semibold text-emerald-800 hover:bg-emerald-50 hover:underline inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98]"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>Back to Magazine Home (/)</span>
            </Link>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <span className="font-mono-code text-gray-500">
              Route: /magazine/{id}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrintArticle}
              disabled={isPrinting}
              aria-label="Print article or save as PDF"
              className="min-h-[44px] px-3.5 py-2 bg-white border border-gray-200 hover:border-emerald-800 hover:bg-emerald-50 text-gray-900 font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span>{isPrinting ? "Preparing Print..." : "Print Article"}</span>
            </button>
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="min-h-[44px] px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 shrink-0" />
              <span>Screen 05 · Share &amp; Export PDF</span>
            </button>
          </div>
        </div>

        {/* WCAG Legal Reader Toolbar */}
        <div className="no-print p-3.5 bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-3 font-ui text-xs">
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
            className="no-print p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-ui font-medium flex items-center justify-between gap-3"
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

        {post ? (
          <article
            className={`border p-6 sm:p-10 space-y-6 print-document transition-colors duration-200 ${contrastClasses}`}
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-ui">
              <span className="px-2.5 py-0.5 bg-emerald-800 text-white font-semibold uppercase tracking-wider">
                {post.category || "Constitutional Brief"}
              </span>
              <span className="opacity-75 font-mono-code">
                {post.read_time_minutes
                  ? `${post.read_time_minutes} min read`
                  : post.read_time || "6 min read"}
              </span>
              <span className="opacity-50">·</span>
              <span className="font-semibold">
                By {post.author_name || post.author || "Editorial Board"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold font-legal leading-tight break-words">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-base sm:text-lg opacity-80 font-legal italic border-l-4 border-emerald-800 pl-4 break-words">
                {post.subtitle}
              </p>
            )}

            {/* Multimedia Video Reel & Audio Brief Bar */}
            {(post.video_reel_url || post.audio_brief_url) && (
              <div className="no-print p-4 bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-ui text-xs text-gray-900">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-800 text-white flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      Audio &amp; Video Legal Briefing
                    </div>
                    <div className="text-gray-600">
                      Listen to the audio brief or watch the vertical reel
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {post.audio_brief_url && (
                    <button
                      type="button"
                      onClick={() =>
                        setFeedback(
                          `Playing Audio Brief: ${post.audio_brief_url}`
                        )
                      }
                      className="min-h-[44px] px-3.5 py-2 bg-white border border-gray-300 hover:border-emerald-800 font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-800" />
                      <span>Play Audio Brief</span>
                    </button>
                  )}
                  {post.video_reel_url && (
                    <Link
                      href="/reels"
                      className="min-h-[44px] px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98]"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Watch Video Reel</span>
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div
              className="text-base leading-relaxed whitespace-pre-line font-legal drop-cap break-words"
              style={{ fontSize: `${fontScale}%` }}
            >
              {readerMode === "simple_summary"
                ? post.subtitle || post.content
                : post.content}
            </div>

            {post.title_urdu && (
              <div
                dir="rtl"
                className="pt-6 border-t border-gray-200 space-y-3 font-urdu"
              >
                <div className="text-xs text-emerald-800 font-ui font-bold">
                  اردو خلاصہ (Urdu Bilingual Edition):
                </div>
                <h2 className="text-2xl font-bold break-words">
                  {post.title_urdu}
                </h2>
                <p className="text-lg leading-[2.4] whitespace-pre-line break-words">
                  {post.content_urdu}
                </p>
              </div>
            )}
          </article>
        ) : (
          <div className="p-8 bg-white border border-gray-200 text-sm text-gray-600">
            Loading article from Supabase articles...
          </div>
        )}

        {/* Print-Only Citation Footer */}
        <div className="print-only mt-8 pt-4 border-t border-black text-[9.5pt] font-mono-code">
          Editorial Citation · &ldquo;{post?.title || "Legal Briefing"}&rdquo;
          by {post?.author_name || post?.author || "Editorial Board"} ·
          Published in The Daily Legal Brief (Pakistan Digital Legal Ecosystem).
        </div>

        {/* Connected Next-Step Routes Bar (Hidden in Print via .no-print) */}
        <div className="no-print bg-gray-50 border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-ui">
          <div>
            <span className="text-emerald-800 uppercase tracking-widest font-mono-code font-bold block">
              Verified Legal Action (Screen 04 → Module 1 &amp; 3)
            </span>
            <p className="font-legal text-base text-gray-900 mt-1">
              Need legal counsel or statutory texts related to this briefing?
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/lawyers"
              className="min-h-[44px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98]"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Book a Verified Lawyer for This Issue →</span>
            </Link>
            <Link
              href="/laws"
              className="min-h-[44px] px-3.5 py-2 bg-white border border-gray-200 hover:border-emerald-800 text-gray-900 font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98]"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-800" />
              <span>Statute Library (/laws) →</span>
            </Link>
            <Link
              href="/forum/ask"
              className="min-h-[44px] px-3.5 py-2 bg-white border border-gray-200 hover:border-emerald-800 text-gray-900 font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-800" />
              <span>Ask Q&amp;A (/forum/ask) →</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Screen 05 Share & Export Modal (Hidden in Print via .no-print) */}
      {shareOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Share and Export Legal Briefing"
          className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 font-ui"
          onClick={() => setShareOpen(false)}
        >
          <div
            className="bg-white border border-gray-200 w-full max-w-md p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-gray-200 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-emerald-800 font-semibold block">
                  Screen 05 • Social Share &amp; Export Bottom Sheet
                </span>
                <h3 className="text-base font-bold text-gray-900 break-words">
                  {post?.title || "Legal Briefing"}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close share modal"
                onClick={() => setShareOpen(false)}
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard?.writeText(window.location.href);
                    setCopied(true);
                    setFeedback("Citation link copied to clipboard.");
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="min-h-[44px] p-3 bg-white border border-gray-200 hover:border-emerald-800 hover:bg-emerald-50 font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-emerald-800" />
                <span>{copied ? "Copied Link!" : "Copy Citation Link"}</span>
              </button>
              <button
                type="button"
                onClick={handlePrintArticle}
                className="min-h-[44px] p-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MagazineArticleReaderPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-white p-10 text-center text-xs text-gray-500">
          Loading...
        </div>
      }
    >
      <MagazineArticleReaderPageInner />
    </React.Suspense>
  );
}
