"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../../../Header";
import {
  ArrowRight,
  Bookmark,
  Printer,
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

function UrduLawContent() {
  const params = useParams();
  const [law, setLaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
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

  const handlePrintStatute = () => {
    if (typeof window === "undefined" || isPrinting) return;
    setIsPrinting(true);
    setFeedback(
      "قانونی متن کو پرنٹ کے لیے تیار کیا جا رہا ہے (ہیڈر اور فوٹر پوشیدہ کر دیے گئے ہیں)..."
    );
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 120);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        قانونی متن لوڈ ہو رہا ہے...
      </div>
    );
  }

  if (!law) {
    return (
      <div className="text-center py-20" dir="rtl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          قانون نہیں ملا
        </h2>
        <Link
          href="/urdu/laws"
          className="min-h-[44px] inline-flex items-center px-4 py-2 text-emerald-800 underline hover:bg-emerald-50 transition-all duration-200 active:scale-[0.98]"
        >
          واپس قانونی لائبریری جائیں
        </Link>
      </div>
    );
  }

  const contrastClasses =
    contrastMode === "dark"
      ? "bg-gray-900 text-gray-100 border-gray-700"
      : contrastMode === "sepia"
      ? "bg-[#FDF8EE] text-stone-900 border-amber-200"
      : "bg-white text-gray-900 border-gray-200";

  return (
    <main
      dir="rtl"
      className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 font-urdu flex-grow print-container"
    >
      {/* Print-Only Urdu Statutory Masthead */}
      <div className="print-only border-b-2 border-black pb-4 mb-6">
        <div className="text-sm font-bold">
          دی ڈیلی لیگل بریف · مصدقہ قانونی دفعہ (Sovereign Statute Extract)
        </div>
        <div className="text-xs font-ui mt-1">
          زمرہ: {law.category} · دفعہ: {law.section_urdu || law.section_number}{" "}
          · تاریخِ پرنٹ: {new Date().toLocaleDateString("ur-PK")}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200 font-ui text-xs no-print">
        <Link
          href="/urdu/laws"
          className="min-h-[44px] px-3 py-2 text-gray-700 hover:text-emerald-800 hover:bg-emerald-50 font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98]"
        >
          <ArrowRight className="w-4 h-4 shrink-0" />
          <span>واپس قانونی لائبریری (Screen 11)</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/laws/${law.id}`}
            className="min-h-[44px] px-3.5 py-2 border border-gray-200 bg-white hover:border-emerald-800 hover:bg-emerald-50 text-xs inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98]"
            dir="ltr"
          >
            English Text
          </Link>
          <button
            type="button"
            onClick={() => {
              const next = !bookmarked;
              setBookmarked(next);
              setFeedback(
                next
                  ? "قانونی دفعہ بک مارک میں محفوظ کر لی گئی ہے۔"
                  : "بک مارک ختم کر دیا گیا ہے۔"
              );
            }}
            className={`min-h-[44px] px-3.5 py-2 border text-xs font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer ${
              bookmarked
                ? "bg-emerald-800 text-white border-emerald-800"
                : "bg-white text-gray-800 border-gray-200 hover:bg-emerald-50 hover:border-emerald-800"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 shrink-0" />
            <span>{bookmarked ? "محفوظ شدہ" : "بک مارک کریں"}</span>
          </button>
          <button
            type="button"
            onClick={handlePrintStatute}
            disabled={isPrinting}
            aria-label="قانون پرنٹ کریں یا پی ڈی ایف محفوظ کریں"
            className="min-h-[44px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60"
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            <span>{isPrinting ? "تیار ہو رہا ہے..." : "پرنٹ / پی ڈی ایف"}</span>
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
            <span>مکمل قانونی متن (Official Bare Act)</span>
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

      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 border p-6 sm:p-12 print-document transition-colors duration-200 ${contrastClasses}`}
      >
        <div className="lg:col-span-8 lg:border-l lg:border-gray-200 lg:pl-8">
          <div className="font-ui text-xs opacity-75 mb-3">
            <span className="font-semibold text-emerald-800">
              اسکرین 12 · قانونی مطالعہ
            </span>
            <span className="mx-2">·</span>
            <span>{law.category}</span>
            <span className="mx-2">·</span>
            <span>{law.section_urdu || law.section_number}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold leading-loose pb-6 border-b border-gray-200 mb-6 break-words">
            {law.title_urdu || law.title}
          </h1>

          {/* Statutory Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6 font-ui text-xs">
            <span
              className={`px-2.5 py-1 border font-semibold ${
                law.is_bailable
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              {law.is_bailable ? "قابلِ ضمانت / دیوانی" : "ناقابلِ ضمانت دفعہ"}
            </span>
            {law.max_punishment && (
              <span className="px-2.5 py-1 bg-gray-50 text-gray-800 border border-gray-200">
                زیادہ سے زیادہ سزا: <strong>{law.max_punishment}</strong>
              </span>
            )}
            {law.trial_court && (
              <span className="px-2.5 py-1 bg-gray-50 text-gray-800 border border-gray-200">
                مجاز عدالت: <strong>{law.trial_court}</strong>
              </span>
            )}
          </div>

          {readerMode === "simple_summary" ? (
            <div
              className="p-5 bg-emerald-50/70 border border-emerald-200 text-gray-900 space-y-4"
              style={{ fontSize: `${fontScale}%` }}
            >
              <div className="font-ui text-xs font-bold text-emerald-800">
                آسان فہم عوامی خلاصہ (Simple Bilingual Summary)
              </div>
              <p className="text-xl leading-[2.4] whitespace-pre-wrap break-words">
                {law.plain_summary_ur ||
                  law.marginal_notes_urdu ||
                  law.content_urdu ||
                  law.content}
              </p>
              {law.plain_summary_en && (
                <div
                  dir="ltr"
                  className="pt-4 border-t border-emerald-200 font-ui text-sm text-gray-800"
                >
                  <strong>English Citizen Summary:</strong>{" "}
                  {law.plain_summary_en}
                </div>
              )}
            </div>
          ) : (
            <div
              className="text-xl leading-[2.4] whitespace-pre-wrap break-words"
              style={{ fontSize: `${fontScale}%` }}
            >
              {law.content_urdu || law.content}
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 space-y-6 font-ui">
          <div className="p-5 bg-gray-50 border border-gray-200 space-y-3 text-gray-900">
            <div className="text-xs text-emerald-800 font-semibold">
              حاشیہ اور قانونی تشریح (Marginal Notes)
            </div>
            <p className="font-urdu text-base text-gray-800 leading-loose break-words">
              {law.plain_summary_ur ||
                law.marginal_notes_urdu ||
                law.marginal_notes ||
                "یہ قانونی دفعہ پاکستان کی تمام ہائی کورٹس اور ماتحت عدالتوں میں نافذ العمل ہے۔"}
            </p>
          </div>

          <Link
            href="/urdu/lawyers"
            className="no-print w-full min-h-[44px] py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
          >
            <Users className="w-4 h-4" />
            <span>اس مسئلے کے لیے تصدیق شدہ وکیل بک کریں</span>
          </Link>

          <button
            type="button"
            onClick={handlePrintStatute}
            className="no-print w-full min-h-[44px] py-2.5 bg-white border border-gray-300 hover:border-emerald-800 text-gray-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-800" />
            <span>عدالتی کاپی پرنٹ کریں</span>
          </button>
        </aside>
      </div>

      <div className="print-only mt-8 pt-4 border-t border-black text-xs font-ui">
        مصدقہ قانونی نقل · {law.title_urdu || law.title} · دی ڈیلی لیگل بریف
        قانونی لائبریری
      </div>
    </main>
  );
}

export default function FullUrduLawPage() {
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
        <UrduLawContent />
      </Suspense>
    </div>
  );
}