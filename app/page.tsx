// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "./Header";
import { createClient } from '@/app/supabase';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function EnglishHomePage() {
  const [articles, setArticles] = useState([]);
  const [laws, setLaws] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const [articlesRes, lawsRes, lawyersRes] = await Promise.all([
        supabase.from("articles").select("*").order("created_at", { ascending: false }),
        supabase.from("laws").select("*").order("created_at", { ascending: false }).limit(4),
        supabase.from("lawyers").select("*").order("created_at", { ascending: false }).limit(4),
      ]);
      if (articlesRes.data) setArticles(articlesRes.data);
      if (lawsRes.data) setLaws(lawsRes.data);
      if (lawyersRes.data) setLawyers(lawyersRes.data);
      setLoading(false);
    }
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#111111] font-legal">
        <Header lang="en" />
        <main className="max-w-5xl mx-auto px-4 py-12 text-center text-emerald-800 animate-pulse">
          Loading The Daily Legal Brief...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] font-legal">
      <Header lang="en" />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Articles List */}
        <section>
          {articles.length === 0 ? (
            <p className="py-12 text-center text-neutral-400 font-ui">
              No articles published yet. Use the Admin Panel to publish your first article.
            </p>
          ) : (
            articles.map((article, index) => (
              <article
                key={article.id}
                className={`py-8 ${index === 0 ? "border-b-2 border-black" : "border-b border-neutral-200"}`}
              >
                <div className="font-ui text-xs uppercase tracking-wider text-emerald-800 font-semibold mb-2">
                  {article.category || "Legal News"} •{" "}
                  <span className="text-neutral-500 font-normal">
                    {new Date(article.created_at).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <Link href={`/article/${article.id}`}>
                  <h2 className="text-2xl sm:text-4xl font-bold leading-snug hover:underline mb-3">
                    {article.title || "Untitled Article"}
                  </h2>
                </Link>
                <p className="text-neutral-600 text-lg leading-relaxed mb-4 line-clamp-3">
                  {article.content
                    ? article.content.slice(0, 200) + (article.content.length > 200 ? "…" : "")
                    : ""}
                </p>
                <div className="flex items-center justify-between font-ui text-xs text-neutral-500">
                  <span>Legal News</span>
                  <Link href={`/article/${article.id}`} className="text-black font-semibold hover:underline">
                    Read Full Article →
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>

        {/* Bottom Preview: Laws & Lawyers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-neutral-200">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Featured Laws</h3>
              <Link href="/laws" className="font-ui text-xs underline">View All Laws →</Link>
            </div>
            <div className="space-y-3">
              {laws.map((law) => (
                <Link key={law.id} href={`/laws/${law.id}`} className="block p-4 border rounded hover:border-black">
                  <span className="font-ui text-xs text-emerald-800 font-semibold">
                    {law.category || "Statute"}
                  </span>
                  <h4 className="font-bold mt-1">{law.title || "Untitled Law"}</h4>
                </Link>
              ))}
              {laws.length === 0 && (
                <p className="text-neutral-400 font-ui text-sm">No laws published yet.</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Verified Advocates</h3>
              <Link href="/lawyers" className="font-ui text-xs underline">All Advocates →</Link>
            </div>
            <div className="space-y-3">
              {lawyers.map((lawyer) => (
                <Link key={lawyer.id} href={`/lawyers/${lawyer.id}`} className="block p-4 border rounded hover:border-black">
                  <div className="flex justify-between">
                    <h4 className="font-bold">{lawyer.name || "Unknown Advocate"}</h4>
                    {lawyer.fee && <span className="font-ui text-xs font-semibold">PKR {lawyer.fee}</span>}
                  </div>
                  <p className="font-ui text-xs text-neutral-500 mt-1">
                    {lawyer.location && `${lawyer.location} • `}{lawyer.specialty || "General Practice"}
                  </p>
                </Link>
              ))}
              {lawyers.length === 0 && (
                <p className="text-neutral-400 font-ui text-sm">No advocates listed yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}