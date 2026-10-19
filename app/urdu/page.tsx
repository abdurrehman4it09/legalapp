// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../Header";
import { createClient } from '@/app/supabase';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function UrduHomePage() {
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
      <div dir="rtl" className="min-h-screen bg-white text-[#111111] font-urdu">
        <Header lang="ur" />
        <main className="max-w-5xl mx-auto px-4 py-12 text-center text-emerald-800 animate-pulse">
          ڈیٹا لوڈ ہو رہا ہے...
        </main>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-white text-[#111111] font-urdu">
      <Header lang="ur" />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Urdu Articles List */}
        <section>
          {articles.length === 0 ? (
            <p className="py-12 text-center text-neutral-400 font-ui">
              ابھی تک کوئی مضمون شائع نہیں ہوا۔ ایڈمن پینل کے ذریعے پہلا مضمون شائع کریں۔
            </p>
          ) : (
            articles.map((article, index) => (
              <article
                key={article.id}
                className={`py-8 ${index === 0 ? "border-b-2 border-black" : "border-b border-neutral-200"}`}
              >
                <div className="font-ui text-xs text-emerald-800 font-semibold mb-2">
                  {article.category || "قانونی خبر"} •{" "}
                  <span className="text-neutral-500 font-normal">
                    {new Date(article.created_at).toLocaleDateString("ur-PK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <Link href={`/urdu/article/${article.id}`}>
                  <h2 className="text-2xl sm:text-4xl font-bold leading-relaxed hover:underline mb-3">
                    {article.title_urdu || article.title || "بے عنوان مضمون"}
                  </h2>
                </Link>
                <p className="text-neutral-600 text-lg leading-relaxed mb-4 line-clamp-3">
                  {article.content_urdu
                    ? article.content_urdu.slice(0, 200) + (article.content_urdu.length > 200 ? "…" : "")
                    : article.content
                    ? article.content.slice(0, 200) + (article.content.length > 200 ? "…" : "")
                    : ""}
                </p>
                <div className="flex items-center justify-between font-ui text-xs text-neutral-500">
                  <span>تحریر: ادارہ</span>
                  <Link href={`/urdu/article/${article.id}`} className="text-black font-semibold hover:underline">
                    مکمل مضمون پڑھیں ←
                  </Link>
                </div>
              </article>
            ))
          )}
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
                    {law.category || "قانون"}
                  </span>
                  <h4 className="font-bold mt-1">{law.title_urdu || law.title || "بے عنوان قانون"}</h4>
                </Link>
              ))}
              {laws.length === 0 && (
                <p className="text-neutral-400 font-ui text-sm">ابھی تک کوئی قانون شامل نہیں۔</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">تصدیق شدہ وکلاء</h3>
              <Link href="/urdu/lawyers" className="font-ui text-xs underline">تمام وکلاء ←</Link>
            </div>
            <div className="space-y-3">
              {lawyers.map((lawyer) => (
                // FIX BUG 5: was hardcoded href="/urdu/lawyers" for every card.
                // Since no /urdu/lawyers/[id] route exists, linking to the directory is correct.
                <Link key={lawyer.id} href="/urdu/lawyers" className="block p-4 border rounded hover:border-black">
                  <div className="flex justify-between">
                    <h4 className="font-bold">{lawyer.name_urdu || lawyer.name || "نامعلوم وکیل"}</h4>
                    {lawyer.fee && <span className="font-ui text-xs font-semibold">PKR {lawyer.fee}</span>}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {(lawyer.city_urdu || lawyer.location) && `${lawyer.city_urdu || lawyer.location} • `}
                    {lawyer.specialty_urdu || lawyer.specialty || "عمومی مشق"}
                  </p>
                </Link>
              ))}
              {lawyers.length === 0 && (
                <p className="text-neutral-400 font-ui text-sm">ابھی تک کوئی وکیل شامل نہیں۔</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}