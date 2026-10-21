"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../Header";
import { Search, Bookmark, ArrowRight } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function PublicLawsLibrary() {
  const [laws, setLaws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

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

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111] font-legal">
      <Header lang="en" />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="border-b-2 border-stone-900 pb-8 mb-8">
          <div className="font-ui text-xs uppercase tracking-widest text-[#B48327] font-semibold mb-2">
            Screen 11 · Sovereign Legal Archive
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight mb-3">
            Digital Law Library & Constitutional Index
          </h1>
          <p className="text-base text-stone-600 max-w-2xl">
            Searchable repository of the Constitution of Pakistan 1973, Pakistan Penal Code (PPC) 1860, Specific Relief Act 1877, and Family Laws with marginal commentary.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-ui">
            <div className="relative flex-1 min-w-[260px] max-w-xl">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search statutes by section (Art 10A, Sec 489-F, Sec 42), act title, or keyword..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-white border border-stone-300 text-xs focus:outline-none focus:border-[#064E3B] transition-all duration-200"
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
                  className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                    selectedCat === cat
                      ? "bg-[#064E3B] text-white"
                      : "bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center font-ui text-sm text-stone-500">
            Loading codified statutes...
          </div>
        ) : (
          <div className="bg-white border border-stone-300 divide-y divide-stone-200">
            {filteredLaws.length === 0 ? (
              <div className="p-12 text-center font-ui text-sm text-stone-500">
                No statutes found matching your search.
              </div>
            ) : (
              filteredLaws.map((law) => (
                <Link
                  key={law.id}
                  href={`/laws/${law.id}`}
                  className="block p-6 sm:p-8 hover:bg-stone-50 active:scale-[0.99] transition-all duration-200 overflow-hidden"
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

                    <div className="font-ui text-xs font-semibold text-[#064E3B] flex items-center gap-1.5 shrink-0 min-h-[44px]">
                      <span>Open Statute Reader (Screen 12)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}