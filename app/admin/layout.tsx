"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scale, Lock, Unlock } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      if (typeof window !== "undefined") {
        localStorage.setItem("plp_admin_access", "granted");
      }
      setIsLocked(false);
      setError("");
    } else {
      setError("Invalid passcode. Default master passcode is admin123.");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 font-ui relative">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#064E3B] text-white px-6 py-4 border-b border-[#B48327]/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5 text-[#D4AF37]" />
          <Link
            href="/admin"
            className="font-legal font-bold text-lg tracking-tight"
          >
            Admin Supply CMS
          </Link>
          <span className="text-xs text-emerald-200 hidden sm:inline">
            · Screen 50–52 Bilingual Content Publisher
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-5 text-xs font-semibold">
          <Link
            href="/admin/dashboard"
            className="hover:text-[#D4AF37] transition-colors"
          >
            Overview Metrics
          </Link>
          <Link
            href="/admin"
            className="hover:text-[#D4AF37] transition-colors"
          >
            1. Publish News & Templates (50)
          </Link>
          <Link
            href="/admin/laws"
            className="hover:text-[#D4AF37] transition-colors"
          >
            2. Supply Statutes (Laws)
          </Link>
          <Link
            href="/admin/lawyers"
            className="hover:text-[#D4AF37] transition-colors"
          >
            3. Verify Advocates
          </Link>
        </nav>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsLocked(true)}
            className="px-2.5 py-1.5 border border-emerald-700 hover:border-[#D4AF37] text-emerald-100 flex items-center gap-1 cursor-pointer"
            title="Lock Admin Studio"
          >
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden md:inline">Lock</span>
          </button>
          <Link
            href="/"
            className="px-3 py-1.5 bg-white text-stone-950 font-semibold hover:bg-stone-100"
          >
            View English App →
          </Link>
          <Link
            href="/urdu"
            className="px-3 py-1.5 bg-[#D4AF37] text-stone-950 font-urdu font-bold"
          >
            اردو ایپ دیکھیں →
          </Link>
        </div>
      </header>

      {/* Always render children segment so Next.js 16 instant navigation validation succeeds */}
      <main>{children}</main>

      {/* Optional Passcode Gate Overlay */}
      {isLocked && (
        <div className="fixed inset-0 z-50 bg-[#FBF9F5]/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 font-ui text-stone-900">
          <div className="mb-6 flex items-center gap-4 text-xs font-semibold">
            <Link href="/" className="text-stone-600 hover:text-[#064E3B]">
              ← 2. Main English App
            </Link>
            <span className="text-stone-300">·</span>
            <Link
              href="/urdu"
              className="text-stone-600 hover:text-[#064E3B] font-urdu"
            >
              3. اردو ایپ
            </Link>
          </div>

          <div className="bg-white p-10 border border-stone-300 w-full max-w-md shadow-xl">
            <div className="flex items-center gap-2.5 text-[#064E3B] text-xs font-semibold uppercase tracking-widest mb-3">
              <Scale className="w-4 h-4 text-[#B48327]" />
              <span>1. Admin Content Supply App · Screen 50</span>
            </div>
            <h2 className="text-2xl font-bold font-legal text-stone-950 mb-2">
              Editorial & Statute Command Center
            </h2>
            <p className="text-stone-600 mb-6 text-xs leading-relaxed">
              Supply bilingual English & Urdu articles, statutes, templates, and
              verified advocate profiles to the public platform. (Master
              passcode pre-filled:{" "}
              <code className="font-mono-code font-bold text-[#064E3B]">
                admin123
              </code>
              )
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Enter Passcode..."
                className="w-full p-3.5 bg-stone-50 border border-stone-300 focus:bg-white outline-none focus:border-[#064E3B] text-center font-mono-code text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-[#064E3B] text-white font-semibold text-xs uppercase tracking-wider py-3.5 hover:bg-emerald-950 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4 text-[#D4AF37]" />
                <span>Unlock Admin Supply Studio</span>
              </button>
            </form>
            {error && (
              <p className="mt-4 text-red-700 font-semibold text-xs text-center">
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
