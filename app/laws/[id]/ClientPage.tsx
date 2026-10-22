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
      `Formatting "${law?.title || "Statute"}" for clean printing (headers & footers hidden)…`
    );
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 120);
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-ui-sans text-sm text-[#57554F]">
        Loading statutory text…
      </div>
    );
  }

  if (!law) {
    return (
      <div className="text-center py-24 font-ui-sans">
        <h2 className="font-legal-serif text-2xl font-bold text-[#141413] mb-3">
          Statute not found
        </h2>
        <Link href="/laws" className="editorial-link text-sm text-[#141413]">
          Return to Digital Law Library
        </Link>
      </div>
    );
  }

  const contrastClasses =
    contrastMode === "dark"
      ? "bg-[#141413] text-[#FAF9F5] border-[#2C2B29]"
      : contrastMode === "sepia"
      ? "bg-[#F2EFE9] text-[#141413] border-[#E6E4DD]"
      : "bg-[#FAF9F5] text-[#141413] border-[#E6E4DD]";

  return (
    <main className="max-w-4xl mx-auto w-full px-6 py-16 sm:py-24 flex-grow print-container">
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

      <div className="max-w-2xl mx-auto">
        {/* Top Action Toolbar (Hidden when printing via .no-print) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E6E4DD] text-xs no-print">
          <Link
            href="/laws"
            className="editorial-link text-[#141413] font-medium inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>All Statutes</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/urdu/laws/${law.id}`}
              className="px-3.5 py-2 border border-[#E6E4DD] bg-[#F2EFE9] hover:border-[#141413] font-urdu text-xs inline-flex items-center justify-center transition-colors duration-500"
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
              className={`px-3.5 py-2 border text-xs font-medium inline-flex items-center gap-1.5 transition-colors duration-500 cursor-pointer ${
                bookmarked
                  ? "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                  : "bg-[#FAF9F5] text-[#141413] border-[#E6E4DD] hover:border-[#141413]"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 shrink-0" />
              <span>{bookmarked ? "Saved" : "Save"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrintStatute}
              disabled={isPrinting}
              aria-label="Print statute or save as PDF"
              className="px-4 py-2 bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs font-medium inline-flex items-center gap-1.5 transition-colors duration-500 cursor-pointer disabled:opacity-60"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>{isPrinting ? "Preparing…" : "Print / PDF"}</span>
            </button>
          </div>
        </div>

        {/* Calm Reader Controls */}
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
              <span>Official Bare Act</span>
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
              <span>Simple Bilingual Summary</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center border border-[#E6E4DD] bg-[#FAF9F5]">
              <button
                type="button"
                aria-label="Decrease font size"
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
                aria-label="Increase font size"
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

        {/* Single Centered 680px Reading Column */}
        <article
          className={`border p-8 sm:p-12 print-document transition-colors duration-500 ${contrastClasses}`}
        >
          <div className="text-xs uppercase tracking-[0.14em] opacity-70 mb-4">
            {law.category || "Codified Act"} ·{" "}
            {law.section_number || "Pakistan Code"}
            {law.promulgation_year ? ` · Act of ${law.promulgation_year}` : ""}
          </div>

          <h1 className="font-legal-serif text-3xl sm:text-4xl font-bold leading-[1.22] pb-6 border-b border-[#E6E4DD] mb-8">
            {law.title}
          </h1>

          {/* Calm Procedural Metadata Line */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-xs opacity-80">
            <span>
              Status:{" "}
              <strong>
                {law.is_bailable ? "Bailable / Civil" : "Non-Bailable / Strict"}
              </strong>
            </span>
            {law.max_punishment && (
              <span>
                · Max Punishment: <strong>{law.max_punishment}</strong>
              </span>
            )}
            {law.trial_court && (
              <span>
                · Forum: <strong>{law.trial_court}</strong>
              </span>
            )}
          </div>

          {readerMode === "simple_summary" ? (
            <div
              className="space-y-8 p-6 bg-[#F2EFE9] border border-[#E6E4DD] text-[#141413]"
              style={{ fontSize: `${fontScale}%` }}
            >
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-[#57554F] mb-2">
                  Plain Citizen Summary (English)
                </div>
                <p className="leading-[1.85] whitespace-pre-wrap">
                  {law.plain_summary_en ||
                    law.marginal_notes ||
                    law.content ||
                    law.description}
                </p>
              </div>
              {(law.plain_summary_ur || law.content_urdu) && (
                <div
                  dir="rtl"
                  className="pt-6 border-t border-[#E6E4DD] font-urdu"
                >
                  <div className="text-sm text-[#57554F] mb-2">
                    آسان عوامی خلاصہ
                  </div>
                  <p className="text-xl whitespace-pre-wrap">
                    {law.plain_summary_ur || law.content_urdu}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: `${fontScale}%` }}>
              <div className="text-base sm:text-lg leading-[1.85] whitespace-pre-wrap">
                {law.content || law.description}
              </div>

              {law.content_urdu && (
                <div
                  className="mt-12 pt-10 border-t border-[#E6E4DD]"
                  dir="rtl"
                >
                  <div className="text-sm text-[#57554F] mb-3 font-urdu">
                    مستند اردو متن
                  </div>
                  <h2 className="font-urdu text-2xl font-bold mb-4">
                    {law.title_urdu}
                  </h2>
                  <div className="font-urdu text-xl whitespace-pre-wrap">
                    {law.content_urdu}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Marginal Commentary Footnote inside the single column */}
          <div className="mt-12 pt-8 border-t border-[#E6E4DD] space-y-3 text-sm opacity-85">
            <div className="text-xs uppercase tracking-[0.14em] font-semibold">
              Editorial Commentary &amp; Application
            </div>
            <p className="leading-[1.75]">
              {law.plain_summary_en ||
                law.marginal_notes ||
                "Applicable across all High Courts and subordinate civil/criminal courts in Pakistan. Read alongside Article 10A constitutional due process guarantees."}
            </p>
          </div>
        </article>

        {/* Bottom Call-to-Action Banner */}
        <div className="no-print mt-12 p-8 bg-[#F2EFE9] border border-[#E6E4DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-legal-serif text-lg font-bold text-[#141413]">
              Need Legal Representation on This Statute?
            </div>
            <p className="text-xs text-[#57554F] mt-1">
              Consult a verified High Court or Supreme Court advocate regarding{" "}
              {law.section_number || law.title}.
            </p>
          </div>
          <Link
            href="/lawyers"
            className="px-5 py-3 bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs font-medium inline-flex items-center gap-2 transition-colors duration-500 shrink-0"
          >
            <Scale className="w-4 h-4" />
            <span>Consult Verified Advocate →</span>
          </Link>
        </div>

        {/* Print-Only Statutory Attestation Footer */}
        <div className="print-only mt-8 pt-4 border-t border-black text-[9.5pt] font-mono-code">
          Certified Statutory Extract · {law.title} (
          {law.section_number || "PK"}) · Printed via The Daily Legal Brief.
        </div>
      </div>
    </main>
  );
}

export default function FullLawPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#141413] font-ui-sans">
      <Header lang="en" />
      <Suspense
        fallback={
          <div className="py-24 text-center text-sm text-[#57554F] flex-grow">
            Loading legal text…
          </div>
        }
      >
        <EnglishLawContent />
      </Suspense>
    </div>
  );
}