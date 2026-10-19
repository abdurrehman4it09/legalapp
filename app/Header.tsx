// @ts-nocheck
"use client";

import React from "react";
import Link from "next/link";

export default function Header({ lang = "en" }) {
  const isUr = lang === "ur";

  return (
    <div dir={isUr ? "rtl" : "ltr"} className={isUr ? "font-urdu" : "font-legal"}>
      {/* Top 3-Version Bar */}
      <div dir="ltr" className="border-b border-neutral-200 bg-[#F9F8F6] px-4 py-2 font-ui text-xs">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="text-neutral-500 font-medium">
            The Daily Legal Brief • Pakistan Legal Portal
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`px-3 py-1 rounded ${!isUr ? "bg-black text-white font-semibold" : "border bg-white"}`}
            >
              🇬🇧 English
            </Link>
            <Link
              href="/urdu"
              className={`px-3 py-1 rounded ${isUr ? "bg-black text-white font-semibold" : "border bg-white"}`}
            >
              🇵🇰 اردو
            </Link>
            <Link
              href="/admin"
              className="px-3 py-1 rounded border border-emerald-800 text-emerald-900 font-semibold hover:bg-emerald-50"
            >
              ⚙️ Admin Panel
            </Link>
          </div>
        </div>
      </div>

      {/* New York Times Style Masthead */}
      <header className="max-w-5xl mx-auto px-4 pt-8 pb-4 text-center">
        <p className="font-ui uppercase tracking-[0.2em] text-[11px] text-neutral-500 mb-2">
          {isUr ? "قانون، انصاف اور شہری حقوق کا مستند جریدہ" : "LAW • JUSTICE • STATUTES • VERIFIED COUNSEL"}
        </p>
        <Link href={isUr ? "/urdu" : "/"}>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-3 cursor-pointer">
            {isUr ? "دی ڈیلی لیگل بریف" : "The Daily Legal Brief"}
          </h1>
        </Link>
        <p className="text-sm text-neutral-600 max-w-xl mx-auto">
          {isUr
            ? "پاکستان کے قوانین، عدالتی فیصلوں اور تصدیق شدہ وکلاء کا مستند پلیٹ فارم"
            : "Pakistan’s minimalist legal journal, statute library, and verified advocate directory."}
        </p>

        {/* Folder Navigation Links */}
        <nav className="mt-6 border-t-2 border-t-black border-b border-b-neutral-200 py-3 flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-ui text-xs sm:text-sm font-medium">
          <Link href={isUr ? "/urdu" : "/"} className="hover:underline">
            {isUr ? "مضامین (ہوم)" : "Magazine Home"}
          </Link>
          <Link href={isUr ? "/urdu/laws" : "/laws"} className="hover:underline">
            {isUr ? "قوانین و آئین (Laws)" : "Laws & Constitution"}
          </Link>
          <Link href={isUr ? "/urdu/lawyers" : "/lawyers"} className="hover:underline">
            {isUr ? "تصدیق شدہ وکلاء (Lawyers)" : "Verified Lawyers"}
          </Link>
        </nav>
      </header>
    </div>
  );
}