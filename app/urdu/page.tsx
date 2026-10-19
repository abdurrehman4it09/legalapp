// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../Header";
import { getArticles, getLaws, getLawyers } from "../data";

export default function UrduHomePage() {
  const [articles, setArticles] = useState([]);
  const [laws, setLaws] = useState([]);
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    setArticles(getArticles());
    setLaws(getLaws());
    setLawyers(getLawyers());
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-white text-[#111111] font-urdu">
      <Header lang="ur" />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Urdu Articles List */}
        <section>
          {articles.map((article, index) => (
            <article
              key={article.id}
              className={`py-8 ${index === 0 ? "border-b-2 border-black" : "border-b border-neutral-200"}`}
            >
              <div className="font-ui text-xs text-emerald-800 font-semibold mb-2">
                {article.categoryUr} • <span className="text-neutral-500 font-normal">{article.dateUr}</span>
              </div>
              <Link href={`/urdu/article/${article.id}`}>
                <h2 className="text-2xl sm:text-4xl font-bold leading-relaxed hover:underline mb-3">
                  {article.titleUr}
                </h2>
              </Link>
              <p className="text-neutral-600 text-lg leading-relaxed mb-4">
                {article.subtitleUr}
              </p>
              <div className="flex items-center justify-between font-ui text-xs text-neutral-500">
                <span> تحریر: {article.authorUr}</span>
                <Link href={`/urdu/article/${article.id}`} className="text-black font-semibold hover:underline">
                  مکمل مضمون پڑھیں ←
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* Bottom Preview: Laws & Lawyers in Urdu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-neutral-200">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">اہم قوانین اور دفعات</h3>
              <Link href="/urdu/laws" className="font-ui text-xs underline">مکمل لائبریری ←</Link>
            </div>
            <div className="space-y-3">
              {laws.map((law) => (
                <Link key={law.id} href={`/urdu/laws/${law.id}`} className="block p-4 border rounded hover:border-black">
                  <span className="font-ui text-xs text-emerald-800 font-semibold">
                    {law.actUr} • {law.sectionUr}
                  </span>
                  <h4 className="font-bold mt-1">{law.titleUr}</h4>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">تصدیق شدہ وکلاء</h3>
              <Link href="/urdu/lawyers" className="font-ui text-xs underline">تمام وکلاء ←</Link>
            </div>
            <div className="space-y-3">
              {lawyers.map((lawyer) => (
                <Link key={lawyer.id} href="/urdu/lawyers" className="block p-4 border rounded hover:border-black">
                  <div className="flex justify-between">
                    <h4 className="font-bold">{lawyer.nameUr}</h4>
                    <span className="font-ui text-xs font-semibold">PKR {lawyer.fee}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {lawyer.courtUr} • {lawyer.specialtyUr}
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