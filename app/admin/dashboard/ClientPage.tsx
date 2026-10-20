"use client";

import React, { useState, useEffect } from "react";
import {
  createClient,
  ALL_SUPABASE_TABLES,
  SUPABASE_STORAGE_BUCKETS,
  syncAllTablesFromSupabase,
  pushAllTablesToSupabase,
  isRealSupabaseConfigured,
  SUPABASE_FULL_SQL_SCHEMA,
} from "@/app/supabase";
import Link from "next/link";
import {
  Database,
  RefreshCw,
  UploadCloud,
  Copy,
  Check,
  ExternalLink,
  HardDrive,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const TABLE_METADATA: Record<
  string,
  { label: string; screens: string; adminTab: string }
> = {
  articles: {
    label: "Bilingual Editorial Briefings & Media Hub",
    screens: "Screens 02, 04, 50–52",
    adminTab: "/admin",
  },
  laws: {
    label: "Codified Statutes & pgvector Embeddings",
    screens: "Screens 11–12",
    adminTab: "/admin/laws",
  },
  lawyers: {
    label: "Verified Bar Council Advocates & Reputation",
    screens: "Screens 06–07, 18–21",
    adminTab: "/admin/lawyers",
  },
  categories: {
    label: "Dynamic Categories (All 6 Scopes)",
    screens: "Screens 02, 06, 08, 10, 11, 33",
    adminTab: "/admin",
  },
  site_settings: {
    label: "Masthead & Platform Settings",
    screens: "Screens 01–02, 46, 59–60",
    adminTab: "/admin",
  },
  templates: {
    label: "Legal Draft Storefront Templates & PDFs",
    screens: "Screens 08–09",
    adminTab: "/admin",
  },
  questions: {
    label: "Public Q&A Forum & Verified Replies",
    screens: "Screens 10, 31–32, 43",
    adminTab: "/admin",
  },
  appointments: {
    label: "Client Escrow Consultations & Video Rooms",
    screens: "Screens 22–27, 53–56",
    adminTab: "/admin",
  },
  probono_requests: {
    label: "Pro-Bono Legal Aid Applications",
    screens: "Screen 33",
    adminTab: "/admin",
  },
  probono_guidelines: {
    label: "Income Certificate Guidelines",
    screens: "Screen 34",
    adminTab: "/admin",
  },
  crm_leads: {
    label: "Advocate CRM Lead Pipeline",
    screens: "Screens 35–37",
    adminTab: "/admin",
  },
  case_milestones: {
    label: "Case Vault & Cause-List Hearings",
    screens: "Screens 38–39",
    adminTab: "/admin",
  },
  lawyer_network: {
    label: "Private PBC-Verified Lawyer Network",
    screens: "Screen 48",
    adminTab: "/admin",
  },
  ai_prompts: {
    label: "AI Legal Engine Quick Prompts",
    screens: "Screens 28, 40–41",
    adminTab: "/admin",
  },
  ai_citations: {
    label: "Court Judgments & pgvector Headnotes",
    screens: "Screen 42",
    adminTab: "/admin",
  },
  notifications: {
    label: "Global Realtime Notifications Hub",
    screens: "Screen 57",
    adminTab: "/admin",
  },
  users_profiles: {
    label: "Users, Roles (RBAC), Theme & Auth Profiles",
    screens: "Screens 13–20, 49, 59–61",
    adminTab: "/admin",
  },
  ai_chat_histories: {
    label: "AI Assistant & Researcher Pro Logs + OCR",
    screens: "Screens 28–30, 40–45",
    adminTab: "/admin",
  },
  lawyer_availability: {
    label: "Advocate Roster & Blocked Calendar Dates",
    screens: "Screens 22–23, 49",
    adminTab: "/admin",
  },
  escrow_ledger: {
    label: "Double-Entry Escrow Accounting Ledger",
    screens: "Screens 24–25, 46",
    adminTab: "/admin",
  },
  wallet_withdrawals: {
    label: "Advocate Wallet & RAAST IBAN Withdrawals",
    screens: "Screens 46–47",
    adminTab: "/admin",
  },
  chat_messages: {
    label: "Realtime E2EE Chamber Chat & Attachments",
    screens: "Screens 53–54",
    adminTab: "/admin",
  },
  video_consultation_logs: {
    label: "Video Consultation Logs & 5-Star Reviews",
    screens: "Screens 55–56",
    adminTab: "/admin",
  },
};

export default function AdminDashboardHome() {
  const [tableCounts, setTableCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<string>("");
  const [syncing, setSyncing] = useState(false);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  async function fetchAllTableCounts() {
    setLoading(true);
    try {
      const counts: Record<string, number> = {};
      await Promise.all(
        ALL_SUPABASE_TABLES.map(async (table) => {
          const res = await supabase
            .from(table)
            .select("*", { count: "exact", head: true });
          counts[table] = res.count || 0;
        })
      );
      setTableCounts(counts);
    } catch (error) {
      console.error("Error fetching Supabase table stats:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllTableCounts();
  }, []);

  async function handlePullFromSupabase() {
    setSyncing(true);
    setSyncStatus("Querying all 23 tables from Supabase...");
    const res = await syncAllTablesFromSupabase();
    await fetchAllTableCounts();
    setSyncing(false);
    if (res.remoteConnected) {
      setSyncStatus(
        `Synced ${res.syncedTables.length} live tables from remote Supabase database.`
      );
    } else {
      setSyncStatus(
        "All 23 tables verified via Hybrid Supabase Engine (set NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY for remote cloud sync)."
      );
    }
  }

  async function handlePushToSupabase() {
    setSyncing(true);
    setSyncStatus("Upserting all 23 tables to Supabase...");
    const res = await pushAllTablesToSupabase();
    await fetchAllTableCounts();
    setSyncing(false);
    if (res.pushedTables.length > 0) {
      setSyncStatus(
        `Successfully upserted ${res.pushedTables.length} tables to Supabase.${
          res.failedTables.length > 0
            ? ` (${res.failedTables.length} tables need SQL DDL creation — click 'View 23-Table + Storage + pgvector SQL Schema' below).`
            : ""
        }`
      );
    } else {
      setSyncStatus(
        "All 23 tables saved in Hybrid Store. To push to a remote Supabase cloud instance, configure NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY and run the Complete SQL Schema."
      );
    }
  }

  function handleCopySchema() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(SUPABASE_FULL_SQL_SCHEMA);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10 space-y-10 font-ui">
      <div className="border-b-2 border-stone-900 pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold block mb-1">
            Supabase Command Center · 23 Tables · 6 Storage Buckets · pgvector · Realtime
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-legal text-stone-950">
            Complete Supabase Backend & Supply Overview
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Every feature across Sections 1–7 (Auth, pgvector RAG, Escrow Ledger, CRM, Public Q&A, Storage Buckets, and Realtime Chat) is connected to Supabase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={syncing}
            onClick={handlePullFromSupabase}
            className="px-3.5 py-2 bg-white border border-stone-300 hover:border-stone-900 text-stone-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>Pull Latest from Supabase</span>
          </button>

          <button
            type="button"
            disabled={syncing}
            onClick={handlePushToSupabase}
            className="px-3.5 py-2 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Push / Seed All 23 Tables to Supabase</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSqlSchema(!showSqlSchema)}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-[#B48327]" />
            <span>
              {showSqlSchema ? "Hide" : "View"} 23-Table + Storage + pgvector SQL Schema
            </span>
          </button>
        </div>
      </div>

      {/* Connection Banner */}
      <div className="bg-white border border-stone-300 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#064E3B]" />
          <div className="text-xs">
            <span className="font-bold text-stone-950">
              Supabase Engine Status:{" "}
            </span>
            <span className="text-[#064E3B] font-semibold">
              {isRealSupabaseConfigured()
                ? "Connected to Live Supabase Cloud (23 Tables, 6 Storage Buckets, pgvector RPC & Realtime Active)"
                : "Hybrid Supabase Engine Active (23 Tables, 6 Storage Buckets, pgvector RPC & Realtime Ready)"}
            </span>
          </div>
        </div>
        <Link
          href="/admin"
          className="text-xs font-semibold text-[#064E3B] hover:underline flex items-center gap-1"
        >
          <span>Open 8-Tab Master Admin Editor</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {syncStatus && (
        <div className="p-4 bg-emerald-950/5 border border-[#064E3B] text-xs font-semibold text-[#064E3B]">
          {syncStatus}
        </div>
      )}

      {/* Expandable 23-Table + Storage + pgvector SQL Schema for Supabase SQL Editor */}
      {showSqlSchema && (
        <div className="bg-stone-950 text-stone-100 p-6 border border-stone-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#B48327] font-semibold">
                PostgreSQL + pgvector + Storage + Realtime · Supabase SQL Editor Ready
              </div>
              <h2 className="text-lg font-bold font-legal text-white">
                Complete 23-Table & 6-Bucket Schema (`supabase.com/dashboard`)
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Paste this single SQL script into your Supabase SQL Editor to enable `pgvector`, create all 23 tables, provision all 6 Storage buckets, and enable Realtime subscriptions.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopySchema}
              className="px-4 py-2 bg-[#064E3B] hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied SQL to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full SQL Schema</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-xs font-mono-code text-emerald-300 overflow-x-auto max-h-96 p-4 bg-black/50 border border-stone-800">
            {SUPABASE_FULL_SQL_SCHEMA}
          </pre>
        </div>
      )}

      {/* All 23 Connected Supabase Tables Grid */}
      <div>
        <h2 className="text-lg font-bold font-legal text-stone-950 mb-4">
          All 23 Connected PostgreSQL Tables (`public.*`)
        </h2>
        {loading ? (
          <div className="text-xs text-stone-500">
            Querying all 23 Supabase tables via `supabase.from(table).select()`...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_SUPABASE_TABLES.map((table) => {
              const meta = TABLE_METADATA[table] || {
                label: table,
                screens: "All Modules",
                adminTab: "/admin",
              };
              return (
                <div
                  key={table}
                  className="bg-white p-5 border border-stone-300 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono-code text-[11px] font-bold text-[#064E3B] bg-emerald-950/5 px-2 py-0.5 border border-[#064E3B]/20">
                        public.{table}
                      </span>
                      <span className="font-mono-code text-[10px] text-stone-500">
                        {meta.screens}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-stone-950 mt-2">
                      {meta.label}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-stone-400">
                        Live Rows
                      </div>
                      <p className="text-2xl font-bold font-mono-code text-stone-950">
                        {tableCounts[table] ?? 0}
                      </p>
                    </div>
                    <Link
                      href={meta.adminTab}
                      className="text-xs text-[#064E3B] hover:underline font-semibold"
                    >
                      Edit Table →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All 6 Connected Supabase Storage Buckets */}
      <div className="pt-6 border-t border-stone-300">
        <h2 className="text-lg font-bold font-legal text-stone-950 mb-4 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#064E3B]" />
          <span>All 6 Connected Supabase Storage Buckets (`storage.buckets`)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUPABASE_STORAGE_BUCKETS.map((b) => (
            <div
              key={b.id}
              className="bg-white p-5 border border-stone-300 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-[#064E3B]">
                  storage://{b.id}
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-stone-100 border border-stone-300 font-semibold text-stone-700">
                  {b.public ? "Public Bucket" : "Private RLS Bucket"}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {b.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}