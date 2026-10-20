"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/Header";
import { createClient } from "@/app/supabase";
import { MessageSquare, ShieldCheck, Plus, ArrowUpRight } from "lucide-react";

const supabase = createClient();

export default function ForumFeedPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState("All");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("forum_questions")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setQuestions(data);
    }
    load();
    window.addEventListener("plp_data_updated", load);
    return () => window.removeEventListener("plp_data_updated", load);
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(questions.map((q) => q.category).filter(Boolean))),
  ];

  const filtered =
    selectedCat === "All"
      ? questions
      : questions.filter((q) => q.category === selectedCat);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-stone-900 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#064E3B] font-semibold uppercase tracking-widest">
              <MessageSquare className="w-4 h-4 text-[#B48327]" />
              <span>
                Screen 10 · Route: /forum · Tables: forum_questions JOIN forum_answers
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-legal text-stone-950 mt-1">
              Public Legal Q&A Forum & Verified Advocate Replies
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Citizens post anonymous legal questions (Screens 31–32); High Court advocates publish verified statutory opinions via the Reputation Desk (Screen 43).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/forum/ask"
              className="px-4 py-2.5 bg-[#064E3B] text-white font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Ask a Question (/forum/ask · Screen 31)</span>
            </Link>
            <Link
              href="/lawyer/reputation-desk"
              className="px-4 py-2.5 bg-stone-900 text-[#D4AF37] font-semibold flex items-center gap-1.5"
            >
              <span>Advocate Reputation Desk (/lawyer/reputation-desk · Screen 43)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 font-semibold border cursor-pointer ${
                selectedCat === cat
                  ? "bg-[#064E3B] text-white border-[#064E3B]"
                  : "bg-white text-stone-700 border-stone-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((q) => (
            <div
              key={q.id}
              className="bg-white border border-stone-300 p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-stone-100 border border-stone-300 font-semibold text-stone-800">
                    {q.category}
                  </span>
                  <span className="font-mono-code text-stone-500">
                    {q.city || "Islamabad"} · Posted by{" "}
                    {q.is_anonymous
                      ? "Anonymous Citizen (Identity Masked)"
                      : q.author_name || "Citizen"}
                  </span>
                </div>
                <span className="font-mono-code font-bold text-[#064E3B]">
                  {q.verified_reply ? "1 Verified Advocate Answer" : "Awaiting Advocate Reply"}
                </span>
              </div>

              <h2 className="text-lg font-bold font-legal text-stone-950">
                {q.title}
              </h2>
              {q.title_urdu && (
                <div
                  dir="rtl"
                  className="text-base font-urdu text-stone-800 font-semibold"
                >
                  {q.title_urdu}
                </div>
              )}

              {q.verified_reply ? (
                <div className="p-4 bg-emerald-950/5 border-l-4 border-[#064E3B] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#064E3B]">
                      <ShieldCheck className="w-4 h-4 text-[#B48327]" />
                      <span>
                        Verified Counsel Reply: {q.verified_reply.lawyer_name}
                      </span>
                      <span className="text-stone-500 font-normal">
                        ({q.verified_reply.court})
                      </span>
                    </div>
                    <Link
                      href="/lawyers"
                      className="text-[#064E3B] font-semibold hover:underline"
                    >
                      Book Consultation →
                    </Link>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                    {q.verified_reply.reply}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-950">
                  <span>No advocate reply yet. Are you a verified advocate?</span>
                  <Link
                    href="/lawyer/reputation-desk"
                    className="font-bold text-[#064E3B] hover:underline"
                  >
                    Answer on Reputation Desk (+10 Rep) →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
