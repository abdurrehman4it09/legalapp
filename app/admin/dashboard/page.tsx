"use client";

import React, { useState, useEffect } from "react";
import { createClient, getTableData } from "@/app/supabase";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    news: 0,
    laws: 0,
    lawyers: 0,
    templates: 0,
    questions: 0,
    appointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [lawsData, lawyersData, newsData] = await Promise.all([
          supabase.from("laws").select("*", { count: "exact", head: true }),
          supabase.from("lawyers").select("*", { count: "exact", head: true }),
          supabase.from("articles").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          laws: lawsData.count || 0,
          lawyers: lawyersData.count || 0,
          news: newsData.count || 0,
          templates: getTableData("templates").length,
          questions: getTableData("questions").length,
          appointments: getTableData("appointments").length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10 space-y-10">
      <div className="border-b-2 border-stone-900 pb-6">
        <span className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold block mb-1">
          Command Center · 3-Edition Ecosystem Metrics
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-legal text-stone-950">
          Platform Supply Overview
        </h1>
      </div>

      {loading ? (
        <div className="text-xs text-stone-500">Loading statistics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-stone-300">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Editorial Briefings (EN & UR)
            </h2>
            <p className="text-4xl font-bold font-mono-code text-[#064E3B] mt-2">
              {stats.news}
            </p>
            <Link
              href="/admin"
              className="mt-6 inline-block text-xs text-stone-900 hover:text-[#064E3B] font-semibold underline"
            >
              Manage Editorial CMS (Screen 50) →
            </Link>
          </div>

          <div className="bg-white p-6 border border-stone-300">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Codified Statutes & Acts
            </h2>
            <p className="text-4xl font-bold font-mono-code text-[#064E3B] mt-2">
              {stats.laws}
            </p>
            <Link
              href="/admin/laws"
              className="mt-6 inline-block text-xs text-stone-900 hover:text-[#064E3B] font-semibold underline"
            >
              Manage Digital Law Library →
            </Link>
          </div>

          <div className="bg-white p-6 border border-stone-300">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Verified High Court Advocates
            </h2>
            <p className="text-4xl font-bold font-mono-code text-[#064E3B] mt-2">
              {stats.lawyers}
            </p>
            <Link
              href="/admin/lawyers"
              className="mt-6 inline-block text-xs text-stone-900 hover:text-[#064E3B] font-semibold underline"
            >
              Manage Bar Council Roll →
            </Link>
          </div>

          <div className="bg-white p-6 border border-stone-300">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Legal Draft Templates (Screen 08)
            </h2>
            <p className="text-4xl font-bold font-mono-code text-stone-950 mt-2">
              {stats.templates}
            </p>
            <Link
              href="/admin"
              className="mt-6 inline-block text-xs text-stone-900 hover:text-[#064E3B] font-semibold underline"
            >
              Supply New Template →
            </Link>
          </div>

          <div className="bg-white p-6 border border-stone-300">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Public Q&A Forum Threads (Screen 10)
            </h2>
            <p className="text-4xl font-bold font-mono-code text-stone-950 mt-2">
              {stats.questions}
            </p>
            <Link
              href="/#templates-qa"
              className="mt-6 inline-block text-xs text-stone-900 hover:text-[#064E3B] font-semibold underline"
            >
              Inspect Public Q&A →
            </Link>
          </div>

          <div className="bg-white p-6 border border-stone-300">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Active Escrow Consultations
            </h2>
            <p className="text-4xl font-bold font-mono-code text-[#B48327] mt-2">
              {stats.appointments}
            </p>
            <Link
              href="/#templates-qa"
              className="mt-6 inline-block text-xs text-stone-900 hover:text-[#064E3B] font-semibold underline"
            >
              Inspect Escrow Ledger →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}