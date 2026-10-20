"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../../Header";
import { ArrowLeft, Bookmark, Printer } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

function EnglishLawContent() {
  const params = useParams();
  const [law, setLaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

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

  if (loading) {
    return (
      <div className="py-20 text-center font-ui text-sm text-stone-500">
        Loading statutory text...
      </div>
    );
  }

  if (!law) {
    return (
      <div className="text-center py-20 font-ui">
        <h2 className="text-2xl font-bold text-stone-900 mb-3">
          Statute not found
        </h2>
        <Link href="/laws" className="text-[#064E3B] underline">
          Return to Digital Law Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-300 font-ui text-xs no-print">
        <Link
          href="/laws"
          className="text-stone-700 hover:text-[#064E3B] font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Digital Law Library (Screen 11)</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/urdu/laws/${law.id}`}
            className="px-3 py-1.5 border border-stone-300 bg-white hover:border-[#064E3B] font-urdu text-xs"
          >
            اردو متن پڑھیں
          </Link>
          <button
            type="button"
            onClick={() => setBookmarked(!bookmarked)}
            className={`px-3.5 py-1.5 border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              bookmarked
                ? "bg-[#B48327] text-white border-[#B48327]"
                : "bg-white text-stone-800 border-stone-300"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{bookmarked ? "Bookmarked" : "Bookmark Statute"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-[#064E3B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Screen 12: Asymmetric Reading Canvas with Marginal Notes (70% / 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-stone-300 p-8 sm:p-12">
        <div className="lg:col-span-8 lg:border-r lg:border-stone-200 lg:pr-8">
          <div className="font-ui text-xs text-stone-500 mb-3">
            <span className="font-semibold text-[#064E3B]">
              SCREEN 12 · STATUTE READER
            </span>
            <span className="mx-2 text-[#B48327]">·</span>
            <span>{law.category || "Codified Act"}</span>
            <span className="mx-2 text-[#B48327]">·</span>
            <span className="font-mono-code">
              {law.section_number || "Pakistan Code"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-stone-950 leading-tight pb-6 border-b-2 border-[#B48327]/50 mb-8">
            {law.title}
          </h1>

          <div className="text-stone-900 text-lg leading-[1.85] whitespace-pre-wrap">
            {law.content || law.description}
          </div>

          {law.content_urdu && (
            <div className="mt-10 pt-8 border-t border-stone-200" dir="rtl">
              <div className="font-ui text-xs text-[#064E3B] font-semibold mb-3">
                مستند اردو متن (Codified Urdu Text)
              </div>
              <h2 className="font-urdu text-2xl font-bold text-stone-900 mb-4 leading-loose">
                {law.title_urdu}
              </h2>
              <div className="font-urdu text-xl text-stone-800 leading-[2.4] whitespace-pre-wrap">
                {law.content_urdu}
              </div>
            </div>
          )}
        </div>

        {/* Right 30% Column: Marginal Notes & Judicial Citations */}
        <aside className="lg:col-span-4 space-y-6 font-ui">
          <div className="p-5 bg-[#FBF9F5] border border-stone-200 space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#B48327] font-semibold">
              Marginal Notes & Commentary
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {law.marginal_notes ||
                "Applicable across all High Courts and subordinate civil/criminal courts in Pakistan. Read alongside Article 10A constitutional due process guarantees."}
            </p>
            {law.marginal_notes_urdu && (
              <p
                className="font-urdu text-sm text-stone-700 leading-loose pt-3 border-t border-stone-200"
                dir="rtl"
              >
                {law.marginal_notes_urdu}
              </p>
            )}
          </div>

          <div className="p-5 bg-[#FBF9F5] border border-stone-200 space-y-2 text-xs">
            <div className="uppercase tracking-widest text-stone-500 font-semibold">
              Accession & Citation Metadata
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-500">Jurisdiction:</span>
              <span className="font-semibold text-stone-900">
                Supreme & High Courts (PK)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-500">Classification:</span>
              <span className="font-mono-code text-[#064E3B]">
                {law.category}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500">Status:</span>
              <span className="font-semibold text-[#064E3B]">
                In Force (2026)
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function FullLawPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111] font-legal">
      <Header lang="en" />
      <Suspense
        fallback={
          <div className="py-20 text-center font-ui text-sm text-stone-500">
            Loading legal text...
          </div>
        }
      >
        <EnglishLawContent />
      </Suspense>
    </div>
  );
}