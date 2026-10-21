"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../../../Header";
import {
  Share2,
  Printer,
  Copy,
  Check,
  ArrowRight,
  CheckCircle2,
  X,
  BookOpen,
  Sparkles,
  Sun,
  FileText,
  Moon,
  Users,
} from "lucide-react";

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

  // UX Standard 2: Close Share modal on Escape key
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
      "مضمون کو پرنٹ کے لیے تیار کیا جا رہا ہے (ہیڈر اور فوٹر پوشیدہ کر دیے گئے ہیں)..."
    );
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 120);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        مضمون لوڈ ہو رہا ہے...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20" dir="rtl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          مضمون نہیں ملا
        </h2>
        <Link
          href="/urdu"
          className="min-h-[44px] inline-flex items-center px-4 py-2 text-emerald-800 underline hover:bg-emerald-50 transition-all duration-200 active:scale-[0.98]"
        >
          واپس ہوم پیج پر جائیں
        </Link>
      </div>
    );
  }

  const copyShareUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setFeedback("مضمون کا حوالہ لنک کلپ بورڈ میں کاپی ہو گیا ہے۔");
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
    <main
      dir="rtl"
      className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 font-urdu flex-grow print-container"
    >
      {/* Print-Only Urdu Editorial Masthead */}
      <div className="print-only border-b-2 border-black pb-4 mb-6">
        <div className="text-sm font-bold">
          دی ڈیلی لیگل بریف · پاکستان ڈیجیٹل لیگل ایکو سسٹم
        </div>
        <div className="text-xs font-ui mt-1">
          اشاعت: {new Date().toLocaleDateString("ur-PK")} · مصنف:{" "}
          {article.author_urdu || article.author_name || article.author || "ادارتی بورڈ"}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200 font-ui text-xs no-print">
        <Link
          href="/urdu"
          className="min-h-[44px] px-3 py-2 text-gray-700 hover:text-emerald-800 hover:bg-emerald-50 font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98]"
        >
          <ArrowRight className="w-4 h-4 shrink-0" />
          <span>واپس جریدہ ہوم (Screen 02)</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/article/${article.id}`}
            className="min-h-[44px] px-3.5 py-2 border border-gray-200 bg-white hover:border-emerald-800 hover:bg-emerald-50 text-xs inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98]"
            dir="ltr"
          >
            Read in English
          </Link>
          <button
            type="button"
            onClick={handlePrintArticle}
            disabled={isPrinting}
            aria-label="پرنٹ مضمون"
            className="min-h-[44px] px-3.5 py-2 border border-gray-200 bg-white hover:border-emerald-800 hover:bg-emerald-50 text-gray-900 font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span>{isPrinting ? "تیار ہو رہا ہے..." : "پرنٹ مضمون"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShareSheetOpen(true)}
            className="min-h-[44px] px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 shrink-0" />
            <span>شیئر اور پی ڈی ایف (Screen 05)</span>
          </button>
        </div>
      </div>

      {/* WCAG Legal Reader Toolbar */}
      <div className="no-print mb-6 p-3.5 bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-3 font-ui text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-700 text-xs ml-1">
            مطالعہ ٹول بار (WCAG Reader):
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
            <span>مکمل ادارتی تجزیہ (Full Brief)</span>
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
            <span>آسان عوامی خلاصہ (Simple Summary)</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2" dir="ltr">
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
            aria-label="بند کریں"
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
        <div className="font-ui text-xs text-emerald-800 font-semibold mb-4">
          <span>اسکرین 04 · ادارتی مطالعہ</span>
          <span className="mx-2 opacity-50">·</span>
          <span>
            {article.category_urdu || article.category || "قانونی تجزیہ"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold leading-loose mb-4 break-words">
          {article.title_urdu || article.title}
        </h1>

        {article.subtitle_urdu && (
          <p className="text-xl opacity-80 leading-loose mb-6 break-words">
            {article.subtitle_urdu}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200 mb-8 font-ui text-xs opacity-75">
          <span>
            {article.author_urdu || article.author_name || article.author || "ادارتی بورڈ"}
          </span>
          <span>
            شائع شدہ:{" "}
            {article.created_at
              ? new Date(article.created_at).toLocaleDateString("ur-PK")
              : "2026"}
          </span>
        </div>

        <div
          className="text-xl leading-[2.4] whitespace-pre-wrap break-words"
          style={{ fontSize: `${fontScale}%` }}
        >
          {readerMode === "simple_summary"
            ? article.subtitle_urdu || article.content_urdu || article.content
            : article.content_urdu || article.content}
        </div>

        {/* Bottom CTA: Book a Verified Lawyer */}
        <div className="no-print mt-10 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-ui">
          <div>
            <div className="text-xs font-bold text-emerald-800">
              قانونی مشاورت اور وکالت
            </div>
            <p className="font-urdu text-base opacity-80 mt-1">
              کیا آپ کو اس قانونی مسئلے میں ماہر وکیل کی خدمات درکار ہیں؟
            </p>
          </div>
          <Link
            href="/urdu/lawyers"
            className="min-h-[44px] px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all duration-200 active:scale-[0.98] shrink-0"
          >
            <Users className="w-4 h-4" />
            <span>اس مسئلے کے لیے تصدیق شدہ وکیل بک کریں</span>
          </Link>
        </div>
      </article>

      {/* Print-Only Citation Footer */}
      <div className="print-only mt-8 pt-4 border-t border-black text-xs font-ui">
        مصدقہ قانونی مضمون · {article.title_urdu || article.title} · دی ڈیلی
        لیگل بریف
      </div>

      {shareSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="اسکرین 05 مضمون شیئر یا پی ڈی ایف محفوظ کریں"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-ui no-print"
          onClick={() => setShareSheetOpen(false)}
        >
          <div
            className="bg-white border border-gray-200 w-full max-w-md p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-sm font-bold text-gray-900">
                اسکرین 05 · مضمون شیئر یا پی ڈی ایف محفوظ کریں
              </h3>
              <button
                type="button"
                aria-label="بند کریں"
                onClick={() => setShareSheetOpen(false)}
                className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${article.title_urdu || article.title} — دی ڈیلی لیگل بریف`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] p-3 bg-white border border-gray-200 hover:border-emerald-800 hover:bg-emerald-50 text-xs font-semibold flex items-center justify-center text-center transition-all duration-200 active:scale-[0.98]"
              >
                واٹس ایپ پر شیئر کریں
              </a>
              <button
                type="button"
                onClick={copyShareUrl}
                className="min-h-[44px] p-3 bg-white border border-gray-200 hover:border-emerald-800 hover:bg-emerald-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-800" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copied ? "لنک کاپی ہو گیا" : "لنک کاپی کریں"}</span>
              </button>
              <button
                type="button"
                onClick={handlePrintArticle}
                className="sm:col-span-2 min-h-[44px] p-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>پی ڈی ایف محفوظ کریں / پرنٹ (Save as PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function FullUrduArticle() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col bg-white text-gray-900 font-urdu"
    >
      <Header lang="ur" />
      <Suspense
        fallback={
          <div className="py-20 text-center text-gray-500 flex-grow">
            ڈیٹا لوڈ ہو رہا ہے...
          </div>
        }
      >
        <UrduArticleContent />
      </Suspense>
    </div>
  );
}