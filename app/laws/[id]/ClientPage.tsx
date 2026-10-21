"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../../Header";
import {
  ArrowLeft,
  Bookmark,
  Printer,
  CheckCircle2,
  X,
  BookOpen,
  FileText,
  Sun,
  Moon,
  Sparkles,
  Scale,
  Users,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

function EnglishLawContent() {
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
      `Formatting "${law?.title || "Statute"}" for clean printing (headers & footers hidden)...`
    );
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 120);
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-ui text-sm text-gray-500">
        Loading statutory text...
      </div>
    );
  }

  if (!law) {
    return (
      <div className="text-center py-20 font-ui">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Statute not found
        </h2>
        <Link
          href="/laws"
          className="min-h-[44px] inline-flex items-center px-4 py-2 text-emerald-800 underline hover:bg-emerald-50 transition-all duration-200 active:scale-[0.98]"
        >
          Return to Digital Law Library
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
    <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 flex-grow print-container">
      {/* Print-Only Official Gazette Statutory Header */}
      <div className="print-only border-b-2 border-black pb-4 mb-6">
        <div className="text-[10pt] uppercase tracking-widest font-mono-code">
          The Daily Legal Brief · Sovereign Codified Statute Extract
        </div>
        <div className="text-xs font-mono-code mt-1">
          Classification: {law.category || "Codified Act"} · Provision:{" "}
          {law.section_number || "Pakistan Code"} · Promulgation:{" "}
          {law.promulgation_year || 1898} · Printed:{" "}
          {new Date().toLocaleDateString("en-PK")}
        </div>
      </div>

      {/* Top Action Toolbar (Hidden when printing via .no-print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200 font-ui text-xs no-print">
        <Link
          href="/laws"
          className="min-h-[44px] px-3 py-2 text-gray-700 hover:text-emerald-800 hover:bg-emerald-50 font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Back to Digital Law Library (Screen 11)</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/urdu/laws/${law.id}`}
            className="min-h-[44px] px-3.5 py-2 border border-gray-200 bg-white hover:border-emerald-800 hover:bg-emerald-50 font-urdu text-xs inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98]"
          >
            اردو متن پڑھیں
          </Link>
          <button
            type="button"
            onClick={() => {
              const next = !bookmarked;
              setBookmarked(next);
              setFeedback(
                next
                  ? "Statute bookmarked to your reading dossier."
                  : "Statute removed from bookmarks."
              );
            }}
            className={`min-h-[44px] px-3.5 py-2 border text-xs font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer ${
              bookmarked
                ? "bg-emerald-800 text-white border-emerald-800"
                : "bg-white text-gray-800 border-gray-200 hover:bg-emerald-50 hover:border-emerald-800"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 shrink-0" />
            <span>{bookmarked ? "Bookmarked" : "Bookmark Statute"}</span>
          </button>
          <button
            type="button"
            onClick={handlePrintStatute}
            disabled={isPrinting}
            aria-label="Print statute or save as PDF"
            className="min-h-[44px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60"
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isPrinting ? "Preparing Print..." : "Print Statute / PDF"}
            </span>
          </button>
        </div>
      </div>

      {/* WCAG Legal Reader Toolbar */}
      <div className="no-print mb-6 p-3.5 bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-3 font-ui text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-700 uppercase tracking-wider text-[11px] mr-1">
            WCAG Reader Toolbar:
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
            <span>Official Bare Act</span>
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
              aria-label="Decrease font size"
              onClick={() => setFontScale((s) => Math.max(85, s - 10))}
              className="min-h-[44px] px-3 py-1.5 font-bold text-gray-800 hover:bg-gray-100 transition-all duration-200 active:scale-[0.98] cursor-pointer border-r border-gray-200"
            >
              A-
            </button>
            <span className="px-2.5 text-[11px] font-mono-code text-gray-600">
              {fontScale}%
            </span>
            <button
              type="button"
              aria-label="Increase font size"
              onClick={() => setFontScale((s) => Math.min(140, s + 10))}
              className="min-h-[44px] px-3 py-1.5 font-bold text-gray-800 hover:bg-gray-100 transition-all duration-200 active:scale-[0.98] cursor-pointer border-l border-gray-200"
            >
              A+
            </button>
          </div>

          <div className="inline-flex items-center border border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => setContrastMode("light")}
              className={`min-h-[44px] px-3 py-1.5 font-semibold inline-flex items-center gap-1 transition-all duration-200 cursor-pointer ${
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
              className={`min-h-[44px] px-3 py-1.5 font-semibold inline-flex items-center gap-1 border-x border-gray-200 transition-all duration-200 cursor-pointer ${
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
              className={`min-h-[44px] px-3 py-1.5 font-semibold inline-flex items-center gap-1 transition-all duration-200 cursor-pointer ${
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

      {/* Screen 12: Asymmetric Reading Canvas with Marginal Notes (70% / 30%) */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 border p-6 sm:p-12 print-document transition-colors duration-200 ${contrastClasses}`}
      >
        <div className="lg:col-span-8 lg:border-r lg:border-gray-200 lg:pr-8">
          <div className="font-ui text-xs opacity-75 mb-3 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-emerald-800">
              SCREEN 12 · STATUTE READER
            </span>
            <span>·</span>
            <span>{law.category || "Codified Act"}</span>
            <span>·</span>
            <span className="font-mono-code">
              {law.section_number || "Pakistan Code"}
            </span>
            {law.promulgation_year && (
              <>
                <span>·</span>
                <span>Act of {law.promulgation_year}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold leading-tight pb-6 border-b border-gray-200 mb-6 break-words">
            {law.title}
          </h1>

          {/* Statutory Procedural Quick Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6 font-ui text-xs">
            <span
              className={`px-2.5 py-1 border font-semibold ${
                law.is_bailable
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              {law.is_bailable ? "Bailable / Civil" : "Non-Bailable / Strict"}
            </span>
            {law.max_punishment && (
              <span className="px-2.5 py-1 bg-gray-50 text-gray-800 border border-gray-200">
                Max Punishment: <strong>{law.max_punishment}</strong>
              </span>
            )}
            {law.trial_court && (
              <span className="px-2.5 py-1 bg-gray-50 text-gray-800 border border-gray-200">
                Trial Court: <strong>{law.trial_court}</strong>
              </span>
            )}
          </div>

          {readerMode === "simple_summary" ? (
            <div
              className="space-y-6 p-5 bg-emerald-50/60 border border-emerald-200 text-gray-900"
              style={{ fontSize: `${fontScale}%` }}
            >
              <div>
                <div className="text-xs font-ui font-bold uppercase tracking-wider text-emerald-800 mb-2">
                  Plain Citizen Summary (English)
                </div>
                <p className="leading-[1.85] whitespace-pre-wrap break-words">
                  {law.plain_summary_en ||
                    law.marginal_notes ||
                    law.content ||
                    law.description}
                </p>
              </div>
              {(law.plain_summary_ur || law.content_urdu) && (
                <div
                  dir="rtl"
                  className="pt-5 border-t border-emerald-200 font-urdu"
                >
                  <div className="text-xs font-ui font-bold text-emerald-800 mb-2">
                    آسان عوامی خلاصہ (Urdu Citizen Summary)
                  </div>
                  <p className="text-xl leading-[2.4] whitespace-pre-wrap break-words">
                    {law.plain_summary_ur || law.content_urdu}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: `${fontScale}%` }}>
              <div className="leading-[1.85] whitespace-pre-wrap break-words">
                {law.content || law.description}
              </div>

              {law.content_urdu && (
                <div className="mt-10 pt-8 border-t border-gray-200" dir="rtl">
                  <div className="font-ui text-xs text-emerald-800 font-semibold mb-3">
                    مستند اردو متن (Codified Urdu Text)
                  </div>
                  <h2 className="font-urdu text-2xl font-bold mb-4 leading-loose break-words">
                    {law.title_urdu}
                  </h2>
                  <div className="font-urdu text-xl leading-[2.4] whitespace-pre-wrap break-words">
                    {law.content_urdu}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 30% Column: Marginal Notes & Judicial Citations */}
        <aside className="lg:col-span-4 space-y-6 font-ui">
          <div className="p-5 bg-gray-50 border border-gray-200 space-y-3 text-gray-900">
            <div className="text-xs uppercase tracking-widest text-emerald-800 font-semibold">
              Plain Summary &amp; Marginal Notes
            </div>
            <p className="text-xs text-gray-700 leading-relaxed break-words">
              {law.plain_summary_en ||
                law.marginal_notes ||
                "Applicable across all High Courts and subordinate civil/criminal courts in Pakistan. Read alongside Article 10A constitutional due process guarantees."}
            </p>
            {(law.plain_summary_ur || law.marginal_notes_urdu) && (
              <p
                className="font-urdu text-sm text-gray-800 leading-loose pt-3 border-t border-gray-200 break-words"
                dir="rtl"
              >
                {law.plain_summary_ur || law.marginal_notes_urdu}
              </p>
            )}
          </div>

          <div className="p-5 bg-gray-50 border border-gray-200 space-y-2 text-xs text-gray-900">
            <div className="uppercase tracking-widest text-gray-500 font-semibold">
              Accession &amp; Citation Metadata
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-500">Trial Court:</span>
              <span className="font-semibold text-gray-900">
                {law.trial_court || "Sessions / High Court"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-500">Classification:</span>
              <span className="font-mono-code text-emerald-800">
                {law.category}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Promulgation:</span>
              <span className="font-semibold text-emerald-800">
                {law.promulgation_year || "In Force"}
              </span>
            </div>
          </div>

          <Link
            href="/lawyers"
            className="no-print w-full min-h-[44px] py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
          >
            <Users className="w-4 h-4" />
            <span>Book a Verified Lawyer for This Issue</span>
          </Link>

          <button
            type="button"
            onClick={handlePrintStatute}
            className="no-print w-full min-h-[44px] py-2.5 bg-white border border-gray-300 hover:border-emerald-800 text-gray-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-800" />
            <span>Print Clean Court Copy</span>
          </button>
        </aside>
      </div>

      {/* Bottom Call-to-Action Banner */}
      <div className="no-print mt-8 p-6 bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-ui">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Verified Legal Representation
          </div>
          <p className="text-sm text-gray-700 mt-1">
            Need formal legal representation or bail assistance under{" "}
            <strong>{law.section_number || law.title}</strong>?
          </p>
        </div>
        <Link
          href="/lawyers"
          className="min-h-[44px] px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all duration-200 active:scale-[0.98] shrink-0"
        >
          <Scale className="w-4 h-4" />
          <span>Book a Verified Lawyer for This Issue →</span>
        </Link>
      </div>

      {/* Print-Only Statutory Attestation Footer */}
      <div className="print-only mt-8 pt-4 border-t border-black text-[9.5pt] font-mono-code">
        Certified Statutory Extract · {law.title} ({law.section_number || "PK"})
        · Printed via The Daily Legal Brief Digital Law Library.
      </div>
    </main>
  );
}

export default function FullLawPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-legal">
      <Header lang="en" />
      <Suspense
        fallback={
          <div className="py-20 text-center font-ui text-sm text-gray-500 flex-grow">
            Loading legal text...
          </div>
        }
      >
        <EnglishLawContent />
      </Suspense>
    </div>
  );
}