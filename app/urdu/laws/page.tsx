"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../../Header";
import { ArrowLeft } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function UrduLawLibrary() {
  const [laws, setLaws] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("سب");

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

  return (
    <div dir="rtl" className="min-h-screen bg-[#FBF9F5] text-[#111111] font-urdu">
      <Header lang="ur" />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10 border-b-2 border-stone-900 pb-8">
          <div className="font-ui text-xs text-[#B48327] font-semibold mb-2">
            اسکرین 11 · ڈیجیٹل قانونی لائبریری
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-950 mb-3 leading-normal">
            آئینِ پاکستان 1973 اور مجموعہ قوانین
          </h1>
          <p className="text-stone-600 text-lg leading-loose mb-6">
            آئین پاکستان، تعزیراتِ پاکستان (PPC)، مخصوص دادرسی ایکٹ اور عائلی قوانین کا مستند اردو اور انگریزی متن۔
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 font-ui">
            <input
              type="text"
              placeholder="قوانین، دفعات (آرٹیکل 10A، دفعہ 489-F) یا الفاظ سے تلاش کریں..."
              className="flex-1 min-w-[260px] max-w-xl px-4 py-2.5 bg-white border border-stone-300 text-xs outline-none focus:border-[#064E3B]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex gap-1.5 flex-wrap text-xs font-semibold">
              {["سب", "Constitution", "Pakistan Penal Code", "Act", "Judgment"].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCat(cat)}
                    className={`px-3.5 py-2 transition cursor-pointer ${
                      selectedCat === cat
                        ? "bg-[#064E3B] text-white"
                        : "bg-white border border-stone-300 text-stone-700"
                    }`}
                    dir="ltr"
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>
        </header>

        <div className="bg-white border border-stone-300 divide-y divide-stone-200">
          {filteredLaws.length === 0 ? (
            <p className="p-12 text-center text-stone-500">
              کوئی قانون موجود نہیں ہے۔
            </p>
          ) : (
            filteredLaws.map((law: any) => (
              <Link
                key={law.id}
                href={`/urdu/laws/${law.id}`}
                className="block p-6 sm:p-8 hover:bg-stone-50 transition-colors"
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
                    <h2 className="text-2xl font-bold text-stone-950 leading-loose">
                      {law.title_urdu || law.title}
                    </h2>
                    <p className="text-base text-stone-600 leading-loose line-clamp-2">
                      {law.content_urdu || law.content}
                    </p>
                  </div>

                  <div className="font-ui text-xs font-semibold text-[#064E3B] flex items-center gap-1.5 shrink-0">
                    <span>مکمل دستاویز پڑھیں (Screen 12)</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}