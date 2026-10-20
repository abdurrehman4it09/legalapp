"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/app/Header";
import { createClient } from "@/app/supabase";
import {
  ArrowLeft,
  Share2,
  Scale,
  Users,
  MessageSquare,
  Printer,
  Copy,
  X,
} from "lucide-react";

const supabase = createClient();

function MagazineArticleReaderPageInner() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<any | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("magazine_posts")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setPost(data);
      } else {
        const { data: all } = await supabase.from("magazine_posts").select("*");
        if (all && all[0]) setPost(all[0]);
      }
    }
    load();
    window.addEventListener("plp_data_updated", load);
    return () => window.removeEventListener("plp_data_updated", load);
  }, [id]);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-300 pb-4 text-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-semibold text-[#064E3B] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Magazine Home (/)</span>
            </Link>
            <span className="text-stone-300">·</span>
            <span className="font-mono-code text-stone-500">
              Route: /magazine/{id} · Table: magazine_posts
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="px-3 py-1.5 bg-[#064E3B] text-white font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Screen 05 · Share & Export PDF</span>
          </button>
        </div>

        {post ? (
          <article className="bg-white border border-stone-300 p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 bg-[#064E3B] text-white font-semibold uppercase tracking-wider">
                {post.category || "Constitutional Brief"}
              </span>
              <span className="text-stone-500 font-mono-code">
                {post.read_time || "6 min read"}
              </span>
              <span className="text-stone-400">·</span>
              <span className="font-semibold text-stone-800">
                By {post.author || "Editorial Board"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-legal text-stone-950 leading-tight">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-lg text-stone-600 font-legal italic border-l-4 border-[#B48327] pl-4">
                {post.subtitle}
              </p>
            )}

            <div className="text-base leading-relaxed text-stone-800 whitespace-pre-line font-legal drop-cap">
              {post.content}
            </div>

            {post.title_urdu && (
              <div
                dir="rtl"
                className="pt-6 border-t border-stone-200 space-y-3 font-urdu"
              >
                <div className="text-xs text-[#064E3B] font-sans font-bold">
                  اردو خلاصہ (Urdu Bilingual Edition):
                </div>
                <h2 className="text-2xl font-bold text-stone-950">
                  {post.title_urdu}
                </h2>
                <p className="text-sm leading-loose text-stone-700 whitespace-pre-line">
                  {post.content_urdu}
                </p>
              </div>
            )}
          </article>
        ) : (
          <div className="p-8 bg-white border border-stone-300 text-sm text-stone-600">
            Loading article from Supabase magazine_posts...
          </div>
        )}

        {/* Connected Next-Step Routes Bar */}
        <div className="bg-stone-900 text-white p-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-[#D4AF37] uppercase tracking-widest font-mono-code block">
              Connected Screen Transitions (Screen 04 → Module 1 & 3)
            </span>
            <p className="font-legal text-base mt-1">
              Need legal counsel or statutory texts related to this briefing?
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/lawyers"
              className="px-3.5 py-2 bg-[#064E3B] text-white font-semibold flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Consult High Court Lawyer (/lawyers) →</span>
            </Link>
            <Link
              href="/laws"
              className="px-3.5 py-2 bg-white text-stone-900 font-semibold flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-[#064E3B]" />
              <span>Statute Library (/laws) →</span>
            </Link>
            <Link
              href="/forum/ask"
              className="px-3.5 py-2 border border-stone-600 text-stone-200 font-semibold flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Ask Q&A (/forum/ask) →</span>
            </Link>
          </div>
        </div>
      </main>

      {shareOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4 font-ui"
          onClick={() => setShareOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-md p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#B48327] font-semibold block">
                  Screen 05 • Social Share & Export Bottom Sheet
                </span>
                <h3 className="text-base font-bold text-stone-950">
                  {post?.title || "Legal Briefing"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                className="cursor-pointer"
              >
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard?.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="p-3 bg-white border border-stone-300 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#064E3B]" />
                <span>{copied ? "Copied Link!" : "Copy Citation Link"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShareOpen(false);
                  if (typeof window !== "undefined") window.print();
                }}
                className="p-3 bg-[#064E3B] text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Print / Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MagazineArticleReaderPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FBF9F5] p-10 text-center text-xs text-stone-500">Loading...</div>}>
      <MagazineArticleReaderPageInner />
    </React.Suspense>
  );
}
