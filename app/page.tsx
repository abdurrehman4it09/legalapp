// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "./Header";
import { getArticles, getLaws, getLawyers } from "./data";

export default function EnglishHomePage() {
  const [articles, setArticles] = useState([]);
  const [laws, setLaws] = useState([]);
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    setArticles(getArticles());
    setLaws(getLaws());
    setLawyers(getLawyers());
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111111] font-legal">
      <Header lang="en" />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Articles List */}
        <section>
          {articles.map((article, index) => (
            <article
              key={article.id}
              className={`py-8 ${index === 0 ? "border-b-2 border-black" : "border-b border-neutral-200"}`}
            >
              <div className="font-ui text-xs uppercase tracking-wider text-emerald-800 font-semibold mb-2">
                {article.categoryEn} • <span className="text-neutral-500 font-normal">{article.dateEn}</span>
              </div>
              <Link href={`/article/${article.id}`}>
                <h2 className="text-2xl sm:text-4xl font-bold leading-snug hover:underline mb-3">
                  {article.titleEn}
                </h2>
              </Link>
              <p className="text-neutral-600 text-lg leading-relaxed mb-4">
                {article.subtitleEn}
              </p>
              <div className="flex items-center justify-between font-ui text-xs text-neutral-500">
                <span>By {article.authorEn}</span>
                <Link href={`/article/${article.id}`} className="text-black font-semibold hover:underline">
                  Read Full Article →
                </Link>
              </div>
            </article>
          ))}
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
                    {law.actEn} • {law.sectionEn}
                  </span>
                  <h4 className="font-bold mt-1">{law.titleEn}</h4>
                </Link>
              ))}
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
                    <h4 className="font-bold">{lawyer.nameEn}</h4>
                    <span className="font-ui text-xs font-semibold">PKR {lawyer.fee}</span>
                  </div>
                  <p className="font-ui text-xs text-neutral-500 mt-1">
                    {lawyer.courtEn} • {lawyer.specialtyEn}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}