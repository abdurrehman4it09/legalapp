"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../Header";
import {
  Search,
  Printer,
  ArrowRight,
  CheckCircle2,
  X,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function PublicLawsLibrary() {
  const [laws, setLaws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [isPrinting, setIsPrinting] = useState(false);
  const [printFeedback, setPrintFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLaws() {
      const { data, error } = await supabase
        .from("laws")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setLaws(data);
      setLoading(false);
    }
    fetchLaws();
  }, []);

  const categories = [
    "All",
    "Constitution",
    "Pakistan Penal Code",
    "Act",
    "Judgment",
  ];

  const filteredLaws = laws.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (l.title?.toLowerCase() || "").includes(q) ||
      (l.category?.toLowerCase() || "").includes(q) ||
      (l.content?.toLowerCase() || "").includes(q) ||
      (l.section_number?.toLowerCase() || "").includes(q);
    const matchesCat =
      selectedCat === "All" ||
      (l.category || "").toLowerCase() === selectedCat.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handlePrintIndex = () => {
    if (typeof window === "undefined" || isPrinting) return;
    setIsPrinting(true);
    setPrintFeedback(
      `Prepared ${filteredLaws.length} statutory provision(s) for printing. Opening native print dialog…`
    );
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 120);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#141413] font-ui-sans">
      <Header lang="en" />

      <main className="max-w-4xl mx-auto w-full px-6 py-16 sm:py-24 flex-grow print-container">
        {/* Print-Only Official Gazette Masthead */}
        <div className="print-only border-b-2 border-black pb-4 mb-6">
          <div className="text-[10pt] uppercase tracking-widest font-mono-code">
            The Daily Legal Brief · Sovereign Legal Archive of Pakistan
          </div>
          <h1 className="font-legal-serif text-2xl font-bold mt-1">
            Codified Statute &amp; Constitutional Index ({selectedCat})
          </h1>
          <p className="text-xs mt-1">
            Printed on {new Date().toLocaleDateString("en-PK")} · Total Indexed
            Statutes: {filteredLaws.length}
          </p>
        </div>

        <div className="max-w-2xl mx-auto border-b border-[#E6E4DD] pb-12 mb-14 editorial-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-[0.16em] text-[#57554F]">
                Sovereign Legal Archive
              </div>
              <h1 className="font-legal-serif text-3xl sm:text-5xl font-bold text-[#141413] tracking-tight leading-[1.18]">
                Statute &amp; Constitutional Index
              </h1>
              <p className="text-base text-[#57554F] leading-[1.75]">
                Searchable repository of the Constitution of Pakistan 1973,
                Pakistan Penal Code 1860, Specific Relief Act 1877, and Family
                Laws with bilingual commentary.
              </p>
            </div>

            {/* Print Index Button (Hidden in Print Output) */}
            <div className="no-print flex items-center gap-3 shrink-0">
              <Link
                href="/urdu/laws"
                className="px-4 py-2.5 bg-[#F2EFE9] border border-[#E6E4DD] hover:border-[#141413] text-[#141413] font-urdu text-sm transition-colors duration-500"
              >
                اردو قانونی لائبریری
              </Link>
              <button
                type="button"
                onClick={handlePrintIndex}
                disabled={isPrinting || loading}
                aria-label="Print or save statutory law index as PDF"
                className="px-4 py-2.5 bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs font-medium flex items-center gap-2 transition-colors duration-500 cursor-pointer disabled:opacity-60"
              >
                <Printer className="w-4 h-4 shrink-0" />
                <span>{isPrinting ? "Opening…" : "Print Index"}</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter Controls — Hidden when printing */}
          <div className="mt-10 space-y-6 no-print">
            <div className="relative">
              <Search className="w-4 h-4 text-[#57554F] absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search statutes by section (Art 10A, Sec 489-F, Sec 42), act title, or keyword…"
                className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border border-[#E6E4DD] focus:border-[#0B5D3B] text-sm focus:outline-none transition-colors duration-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-6 border-b border-[#E6E4DD]">
              {categories.map((cat) => {
                const isSelected = selectedCat === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCat(cat)}
                    className={`pb-3 text-sm transition-colors duration-500 cursor-pointer border-b-2 -mb-px ${
                      isSelected
                        ? "border-[#0B5D3B] text-[#141413] font-semibold"
                        : "border-transparent text-[#57554F] hover:text-[#141413]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {printFeedback && (
          <div
            role="status"
            className="no-print max-w-2xl mx-auto mb-8 p-4 bg-[#F2EFE9] border border-[#E6E4DD] text-[#141413] text-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0B5D3B] shrink-0" />
              <span>{printFeedback}</span>
            </div>
            <button
              type="button"
              aria-label="Dismiss print status banner"
              onClick={() => setPrintFeedback(null)}
              className="text-[#57554F] hover:text-[#141413] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="max-w-2xl mx-auto py-16 text-center text-sm text-[#57554F]">
            Loading codified statutes…
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6 print-document">
            {filteredLaws.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#57554F] border border-[#E6E4DD]">
                No statutes found matching your search.
              </div>
            ) : (
              filteredLaws.map((law) => (
                <Link
                  key={law.id}
                  href={`/laws/${law.id}`}
                  className="editorial-card block bg-[#FAF9F5] p-8 space-y-3"
                >
                  <div className="text-xs text-[#57554F]">
                    <span className="font-medium text-[#141413]">
                      {law.category || "Statute"}
                    </span>
                    <span className="mx-2">·</span>
                    <span>{law.section_number || "Codified Provision"}</span>
                  </div>

                  <h2 className="font-legal-serif text-2xl font-bold text-[#141413]">
                    {law.title}
                  </h2>

                  {law.title_urdu && (
                    <h3 className="font-urdu text-xl text-[#383733]" dir="rtl">
                      {law.title_urdu}
                    </h3>
                  )}

                  <p className="text-sm text-[#57554F] leading-[1.75]">
                    {law.description || law.content}
                  </p>

                  <div className="no-print pt-3 flex items-center justify-between text-xs text-[#57554F]">
                    <span>Includes Bilingual Commentary</span>
                    <span className="text-[#141413] font-medium inline-flex items-center gap-1">
                      <span>Read Statute</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Print-Only Attestation Footer */}
        <div className="print-only mt-8 pt-4 border-t border-black text-[9.5pt] font-mono-code">
          Verified Codified Archive · The Daily Legal Brief · For official
          judicial filings, cross-verify with the Gazette of Pakistan.
        </div>
      </main>
    </div>
  );
}