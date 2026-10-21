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
      `Prepared ${filteredLaws.length} statutory provision(s) for printing. Opening native print dialog...`
    );
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 120);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#111111] font-legal">
      <Header lang="en" />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 flex-grow print-container">
        {/* Print-Only Official Gazette Masthead */}
        <div className="print-only border-b-2 border-black pb-4 mb-6">
          <div className="text-[10pt] uppercase tracking-widest font-mono-code">
            The Daily Legal Brief · Sovereign Legal Archive of Pakistan
          </div>
          <h1 className="text-2xl font-bold mt-1">
            Codified Statute &amp; Constitutional Index ({selectedCat})
          </h1>
          <p className="text-xs mt-1">
            Printed on {new Date().toLocaleDateString("en-PK")} · Total Indexed
            Statutes: {filteredLaws.length}
          </p>
        </div>

        <div className="border-b-2 border-stone-900 pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="font-ui text-xs uppercase tracking-widest text-[#B48327] font-semibold mb-2">
                Screen 11 · Sovereign Legal Archive
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight mb-3 break-words">
                Digital Law Library &amp; Constitutional Index
              </h1>
              <p className="text-sm sm:text-base text-stone-600 max-w-2xl break-words">
                Searchable repository of the Constitution of Pakistan 1973,
                Pakistan Penal Code (PPC) 1860, Specific Relief Act 1877, and
                Family Laws with marginal commentary.
              </p>
            </div>

            {/* Print Index Button (Hidden in Print Output) */}
            <div className="no-print flex flex-wrap items-center gap-2 font-ui shrink-0">
              <Link
                href="/urdu/laws"
                className="min-h-[44px] px-4 py-2.5 bg-white border border-stone-300 hover:border-[#064E3B] hover:bg-emerald-50 text-stone-800 font-urdu text-xs flex items-center justify-center transition-colors duration-200 active:scale-95"
              >
                اردو قانونی لائبریری
              </Link>
              <button
                type="button"
                onClick={handlePrintIndex}
                disabled={isPrinting || loading}
                aria-label="Print or save statutory law index as PDF"
                className="min-h-[44px] px-4 py-2.5 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 cursor-pointer disabled:opacity-60"
              >
                <Printer className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>
                  {isPrinting ? "Opening Print Dialog..." : "Print Index / PDF"}
                </span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter Controls — Hidden when printing */}
          <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-ui no-print">
            <div className="relative flex-1 min-w-0 max-w-xl">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search statutes by section (Art 10A, Sec 489-F, Sec 42), act title, or keyword..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-white border border-stone-300 text-xs focus:outline-none focus:border-[#064E3B] transition-colors duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold transition-colors duration-200 active:scale-95 cursor-pointer ${
                    selectedCat === cat
                      ? "bg-[#064E3B] text-white"
                      : "bg-white border border-stone-300 text-stone-700 hover:bg-emerald-50 hover:border-[#064E3B]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Immediate Print Visual Feedback Banner (Hidden in Print) */}
        {printFeedback && (
          <div
            role="status"
            className="no-print mb-6 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-ui font-medium flex items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0" />
              <span className="break-words">{printFeedback}</span>
            </div>
            <button
              type="button"
              aria-label="Dismiss print status banner"
              onClick={() => setPrintFeedback(null)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors duration-200 active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center font-ui text-sm text-stone-500">
            Loading codified statutes...
          </div>
        ) : (
          <div className="bg-white border border-stone-300 divide-y divide-stone-200 print-document">
            {filteredLaws.length === 0 ? (
              <div className="p-12 text-center font-ui text-sm text-stone-500">
                No statutes found matching your search.
              </div>
            ) : (
              filteredLaws.map((law) => (
                <Link
                  key={law.id}
                  href={`/laws/${law.id}`}
                  className="block p-6 sm:p-8 hover:bg-emerald-50/60 active:scale-[0.99] transition-colors duration-200 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 max-w-3xl">
                      <div className="font-ui text-xs text-stone-500">
                        <span className="font-semibold text-[#064E3B]">
                          {law.category || "Statute"}
                        </span>
                        <span className="mx-2 text-[#B48327]">·</span>
                        <span className="font-mono-code">
                          {law.section_number || "Codified Provision"}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-stone-950 break-words">
                        {law.title}
                      </h2>

                      {law.title_urdu && (
                        <h3
                          className="text-lg font-urdu text-stone-700 break-words"
                          dir="rtl"
                        >
                          {law.title_urdu}
                        </h3>
                      )}

                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1 break-words">
                        {law.description || law.content}
                      </p>
                    </div>

                    <div className="no-print font-ui text-xs font-semibold text-[#064E3B] flex items-center gap-1.5 shrink-0 min-h-[44px]">
                      <span>Open Statute Reader (Screen 12)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Print-Only Attestation Footer */}
        <div className="print-only mt-8 pt-4 border-t border-black text-[9.5pt] font-mono-code">
          Verified Codified Archive · The Daily Legal Brief (Pakistan Digital
          Legal Ecosystem) · For official judicial filings, cross-verify with
          the Gazette of Pakistan.
        </div>
      </main>

      {/* Screen-Only Footer (Hidden via @media print) */}
      <footer className="no-print border-t border-stone-300 bg-white py-6 px-6 font-ui text-xs text-stone-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            The Daily Legal Brief · Sovereign Legal Archive (Screen 11)
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="min-h-[44px] inline-flex items-center hover:text-[#064E3B] transition-colors duration-200"
            >
              Editorial Home
            </Link>
            <Link
              href="/lawyers"
              className="min-h-[44px] inline-flex items-center hover:text-[#064E3B] transition-colors duration-200"
            >
              Verified Advocates
            </Link>
            <Link
              href="/client/ai-assistant"
              className="min-h-[44px] inline-flex items-center hover:text-[#064E3B] transition-colors duration-200"
            >
              AI Legal Assistant
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}