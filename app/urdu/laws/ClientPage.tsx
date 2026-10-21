"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../../Header";
import { ArrowLeft, Printer, CheckCircle2, X } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function UrduLawLibrary() {
  const [laws, setLaws] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("سب");
  const [isPrinting, setIsPrinting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function getLaws() {
      const { data } = await supabase
        .from("laws")
        .select("*")
        .order("id", { ascending: false });
      if (data) setLaws(data);
    }
    getLaws();
  }, []);

  const filteredLaws = laws.filter((law) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (law.title_urdu && law.title_urdu.includes(q)) ||
      (law.content_urdu && law.content_urdu.includes(q)) ||
      (law.title && law.title.toLowerCase().includes(q));
    const matchesCat = selectedCat === "سب" || law.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handlePrintIndex = () => {
    if (typeof window === "undefined" || isPrinting) return;
    setIsPrinting(true);
    setFeedback(
      `پرنٹ کے لیے ${filteredLaws.length} قوانین کی فہرست تیار کر دی گئی ہے...`
    );
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 120);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#111111] font-urdu"
    >
      <Header lang="ur" />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 flex-grow print-container">
        {/* Print-Only Urdu Gazette Masthead */}
        <div className="print-only border-b-2 border-black pb-4 mb-6">
          <div className="text-sm font-bold">
            دی ڈیلی لیگل بریف · ڈیجیٹل قانونی لائبریری (مجموعہ قوانینِ پاکستان)
          </div>
          <div className="text-xs font-ui mt-1">
            تاریخِ پرنٹ: {new Date().toLocaleDateString("ur-PK")} · کل قوانین:{" "}
            {filteredLaws.length}
          </div>
        </div>

        <div className="mb-8 border-b-2 border-stone-900 pb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="font-ui text-xs text-[#B48327] font-semibold mb-2">
                اسکرین 11 · ڈیجیٹل قانونی لائبریری
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-stone-950 mb-3 leading-normal break-words">
                آئینِ پاکستان 1973 اور مجموعہ قوانین
              </h1>
              <p className="text-stone-600 text-base sm:text-lg leading-loose mb-4 break-words">
                آئین پاکستان، تعزیراتِ پاکستان (PPC)، مخصوص دادرسی ایکٹ اور
                عائلی قوانین کا مستند اردو اور انگریزی متن۔
              </p>
            </div>

            <div className="no-print flex flex-wrap items-center gap-2 font-ui shrink-0">
              <Link
                href="/laws"
                dir="ltr"
                className="min-h-[44px] px-4 py-2.5 bg-white border border-stone-300 hover:border-[#064E3B] hover:bg-emerald-50 text-stone-800 text-xs font-semibold flex items-center justify-center transition-colors duration-200 active:scale-95"
              >
                English Law Library
              </Link>
              <button
                type="button"
                onClick={handlePrintIndex}
                disabled={isPrinting}
                aria-label="قانونی فہرست پرنٹ کریں"
                className="min-h-[44px] px-4 py-2.5 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 cursor-pointer disabled:opacity-60"
              >
                <Printer className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>
                  {isPrinting ? "تیار ہو رہا ہے..." : "پرنٹ فہرست / PDF"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-ui no-print mt-4">
            <input
              type="text"
              placeholder="قوانین، دفعات (آرٹیکل 10A، دفعہ 489-F) یا الفاظ سے تلاش کریں..."
              className="flex-1 min-w-0 max-w-xl min-h-[44px] px-4 py-2.5 bg-white border border-stone-300 text-xs outline-none focus:border-[#064E3B]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex gap-1.5 flex-wrap text-xs font-semibold">
              {[
                "سب",
                "Constitution",
                "Pakistan Penal Code",
                "Act",
                "Judgment",
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCat(cat)}
                  className={`min-h-[44px] px-3.5 py-2 transition-colors duration-200 active:scale-95 cursor-pointer ${
                    selectedCat === cat
                      ? "bg-[#064E3B] text-white"
                      : "bg-white border border-stone-300 text-stone-700 hover:bg-emerald-50 hover:border-[#064E3B]"
                  }`}
                  dir="ltr"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {feedback && (
          <div
            role="status"
            className="no-print mb-6 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-ui font-medium flex items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0" />
              <span className="break-words">{feedback}</span>
            </div>
            <button
              type="button"
              aria-label="بند کریں"
              onClick={() => setFeedback(null)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors duration-200 active:scale-95 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-white border border-stone-300 divide-y divide-stone-200 print-document">
          {filteredLaws.length === 0 ? (
            <p className="p-12 text-center text-stone-500">
              کوئی قانون موجود نہیں ہے۔
            </p>
          ) : (
            filteredLaws.map((law: any) => (
              <Link
                key={law.id}
                href={`/urdu/laws/${law.id}`}
                className="block p-6 sm:p-8 hover:bg-emerald-50/60 active:scale-[0.99] transition-colors duration-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-3xl">
                    <div className="font-ui text-xs text-stone-500">
                      <span className="text-[#064E3B] font-semibold">
                        {law.category}
                      </span>
                      <span className="mx-2 text-[#B48327]">·</span>
                      <span>{law.section_urdu || law.section_number}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-stone-950 leading-loose break-words">
                      {law.title_urdu || law.title}
                    </h2>
                    <p className="text-base text-stone-600 leading-loose line-clamp-2 break-words">
                      {law.content_urdu || law.content}
                    </p>
                  </div>

                  <div className="no-print font-ui text-xs font-semibold text-[#064E3B] flex items-center gap-1.5 shrink-0 min-h-[44px]">
                    <span>مکمل دستاویز پڑھیں (Screen 12)</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="print-only mt-8 pt-4 border-t border-black text-xs font-ui">
          مصدقہ قانونی ریکارڈ · دی ڈیلی لیگل بریف (پاکستان ڈیجیٹل لیگل ایکو
          سسٹم)
        </div>
      </main>

      <footer className="no-print border-t border-stone-300 bg-white py-6 px-6 font-ui text-xs text-stone-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>دی ڈیلی لیگل بریف · ڈیجیٹل قانونی لائبریری (Screen 11)</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/urdu"
              className="min-h-[44px] inline-flex items-center hover:text-[#064E3B] transition-colors duration-200"
            >
              جریدہ ہوم
            </Link>
            <Link
              href="/urdu/lawyers"
              className="min-h-[44px] inline-flex items-center hover:text-[#064E3B] transition-colors duration-200"
            >
              وکلاء ڈائریکٹری
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}