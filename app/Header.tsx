"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Scale,
  Bell,
  Globe,
  Sun,
  LogOut,
  Layers,
  X,
} from "lucide-react";
import {
  GlobalSearchModal,
  SmartAuthModal,
  LegalAIWorkspaceModal,
  Master61ScreenExplorerModal,
  UserSession,
} from "./components/PlatformModals";
import {
  getSiteSettings,
  getTableData,
  getActiveRBACSession,
  switchActiveRBACRole,
  RBAC_ROLES,
  RBAC_ROLE_PERMISSIONS,
  normalizeRBACRole,
} from "./supabase";

export default function Header({
  lang = "en",
  onOpenAI,
  onOpenAuth,
}: {
  lang?: "en" | "ur";
  onOpenAI?: (mode?: "assistant" | "researcher") => void;
  onOpenAuth?: (reason?: string) => void;
}) {
  const isUr = lang === "ur";
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string | undefined>(undefined);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMode, setAiMode] = useState<"assistant" | "researcher">("assistant");
  const [splashOpen, setSplashOpen] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);

  // Screens 57, 58, 59, 60, 61 modals/sheets
  const [notifOpen, setNotifOpen] = useState(false);
  const [langSheetOpen, setLangSheetOpen] = useState(false);
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [rbacModalOpen, setRbacModalOpen] = useState(false);

  const [theme, setTheme] = useState<"paper" | "light" | "dark">("paper");
  const [session, setSession] = useState<UserSession | null>(null);
  const [siteSettings, setSiteSettings] = useState<any>(() => getSiteSettings());
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const syncData = () => {
      setSiteSettings(getSiteSettings());
      setNotifications(getTableData("notifications"));
      const active = getActiveRBACSession();
      setSession(active);
    };
    syncData();

    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("plp_theme") as
        | "paper"
        | "light"
        | "dark"
        | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.remove(
          "theme-paper",
          "theme-light",
          "theme-dark"
        );
        document.documentElement.classList.add(`theme-${savedTheme}`);
      }
      window.addEventListener("plp_data_updated", syncData);
      return () => window.removeEventListener("plp_data_updated", syncData);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const applyTheme = (next: "paper" | "light" | "dark") => {
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("plp_theme", next);
      document.documentElement.classList.remove(
        "theme-paper",
        "theme-light",
        "theme-dark"
      );
      document.documentElement.classList.add(`theme-${next}`);
    }
  };

  const handleTriggerAI = (mode: "assistant" | "researcher" = "assistant") => {
    if (onOpenAI) {
      onOpenAI(mode);
    } else {
      setAiMode(mode);
      setAiOpen(true);
    }
  };

  const handleTriggerAuth = (reason?: string) => {
    if (onOpenAuth) {
      onOpenAuth(reason);
    } else {
      setAuthReason(reason);
      setAuthOpen(true);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("plp_user_session");
      window.dispatchEvent(new Event("plp_data_updated"));
    }
    setSession(null);
    setLogoutModalOpen(false);
  };

  return (
    <div
      dir={isUr ? "rtl" : "ltr"}
      className={`no-print ${isUr ? "font-urdu" : "font-legal"}`}
    >
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-stone-300 bg-[#FBF9F5]">
        {/* Zone 1: Single text element wordmark */}
        <Link
          href={isUr ? "/urdu" : "/"}
          className="text-xl sm:text-2xl font-bold tracking-tight text-stone-950 whitespace-nowrap shrink-0"
        >
          {isUr
            ? siteSettings?.masthead_title_urdu || "دی ڈیلی لیگل بریف"
            : siteSettings?.masthead_title || "The Daily Legal Brief"}
        </Link>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 font-ui text-xs sm:text-sm font-medium text-stone-700">
          <Link
            href={isUr ? "/urdu" : "/"}
            className="hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {isUr ? "جریدہ" : "Editorial"}
          </Link>
          <Link
            href={isUr ? "/urdu/laws" : "/laws"}
            className="hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {isUr ? "قانونی لائبریری" : "Statutes"}
          </Link>
          <Link
            href={isUr ? "/urdu/lawyers" : "/lawyers"}
            className="hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {isUr ? "تصدیق شدہ وکلاء" : "Advocates"}
          </Link>
          <Link
            href={isUr ? "/urdu#templates-qa" : "/#templates-qa"}
            className="hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {isUr ? "مسودات اور سی آر ایم" : "Templates, Q&A & CRM"}
          </Link>
          <Link
            href="/admin"
            className="hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {isUr ? "ایڈمن سی ایم ایس" : "Admin CMS"}
          </Link>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0 font-ui">
          <button
            type="button"
            onClick={() => handleTriggerAI("assistant")}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-emerald-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isUr ? "قانونی AI معاون" : "Consult Legal AI"}
          </button>
        </div>
      </header>

      {/* Operational Utility & 3-Version Workspace Ribbon (Below Header) */}
      <div className="border-b border-stone-200 bg-white px-6 py-2.5 font-ui text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: 3 App Versions Switcher + 61-Screen Blueprint Deck */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <Link
              href="/admin"
              className="px-2.5 py-1 text-[#064E3B] border border-[#064E3B]/40 bg-emerald-950/5 hover:bg-[#064E3B] hover:text-white font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              1. Admin Supply CMS
            </Link>
            <Link
              href="/"
              className={`px-2.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
                !isUr
                  ? "bg-stone-900 text-white font-semibold"
                  : "text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              2. Main App (EN)
            </Link>
            <Link
              href="/urdu"
              className={`px-2.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
                isUr
                  ? "bg-[#064E3B] text-white font-semibold"
                  : "text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              3. اردو ایپ (UR)
            </Link>

            <button
              type="button"
              onClick={() => setExplorerOpen(true)}
              className="px-2.5 py-1 bg-amber-50/80 border border-[#B48327] text-stone-900 hover:bg-[#B48327] hover:text-white font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-[#064E3B]" />
              <span>All 61 Screens & Modals</span>
            </button>

            <button
              type="button"
              onClick={() => setSplashOpen(true)}
              className="px-2.5 py-1 text-stone-600 hover:text-stone-900 border border-stone-200 whitespace-nowrap shrink-0 cursor-pointer"
            >
              01. Splash
            </button>
          </div>

          {/* Right: Search (03), Notifications (57), Language Sheet (59), Theme Sheet (60), Auth (13) / Logout (61) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#064E3B]" />
              <span>{isUr ? "تلاش (03)" : "Search (03 · ⌘K)"}</span>
            </button>

            <button
              type="button"
              onClick={() => setNotifOpen(true)}
              className="px-2.5 py-1 border border-stone-200 hover:bg-stone-100 text-stone-700 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              title="Screen 57 • Notifications Hub"
            >
              <Bell className="w-3.5 h-3.5 text-[#064E3B]" />
              <span>57 ({notifications.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setLangSheetOpen(true)}
              className="px-2.5 py-1 border border-stone-200 hover:bg-stone-100 text-stone-700 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              title="Screen 59 • Language Selector Sheet"
            >
              <Globe className="w-3.5 h-3.5 text-[#064E3B]" />
              <span>59. EN/UR</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeSheetOpen(true)}
              className="px-2.5 py-1 border border-stone-200 hover:bg-stone-100 text-stone-700 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              title="Screen 60 • Appearance Mode Sheet"
            >
              <Sun className="w-3.5 h-3.5 text-[#B48327]" />
              <span>
                60.{" "}
                {theme === "paper"
                  ? "Paper"
                  : theme === "light"
                  ? "Light"
                  : "Dark"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRbacModalOpen(true)}
              className="px-2.5 py-1 border border-[#064E3B]/40 bg-emerald-950/5 hover:bg-[#064E3B] hover:text-white text-[#064E3B] font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              title="4-Role RBAC Profile Sync (public.users_profiles)"
            >
              <span>
                RBAC:{" "}
                {session
                  ? normalizeRBACRole(session.rbacRole || session.role)
                  : "Guest (M1)"}
              </span>
            </button>

            {session ? (
              <div className="flex items-center gap-1.5">
                <span className="text-stone-800 font-semibold whitespace-nowrap shrink-0">
                  {session.name}
                </span>
                <button
                  type="button"
                  onClick={() => setLogoutModalOpen(true)}
                  className="px-2 py-1 border border-red-200 text-red-700 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                  title="Screen 61 • Logout Confirmation Modal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>61</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  handleTriggerAuth(
                    isUr
                      ? "اسکرین 13–20 • اپنے کلائنٹ یا ایڈووکیٹ اکاؤنٹ میں سائن ان کریں"
                      : "Screens 13–20 • Sign in or verify your Client / Advocate credentials"
                  )
                }
                className="px-3 py-1 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isUr ? "سائن ان (13–20)" : "Auth (13–20)"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Screen 01: Splash Screen Modal Preview */}
      {splashOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#064E3B] text-white flex flex-col items-center justify-center p-6 text-center font-ui"
          onClick={() => setSplashOpen(false)}
        >
          <div
            className="max-w-lg space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 mx-auto border-2 border-[#D4AF37] flex items-center justify-center bg-emerald-950/60">
              <Scale className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Screen 01 • Sovereign Legal Architecture
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold font-legal tracking-tight">
              {siteSettings?.masthead_title || "The Daily Legal Brief"}
            </h2>
            <p className="text-lg font-urdu text-emerald-100">
              {siteSettings?.masthead_title_urdu || "دی ڈیلی لیگل بریف"} —{" "}
              {siteSettings?.masthead_kicker_urdu}
            </p>
            <p className="text-xs text-emerald-200/80 max-w-md mx-auto leading-relaxed">
              {siteSettings?.masthead_subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setSplashOpen(false)}
                className="px-6 py-3 bg-[#D4AF37] text-stone-950 text-xs font-bold tracking-wider uppercase cursor-pointer"
              >
                Enter Magazine Home (Screen 02)
              </button>
              <Link
                href="/urdu"
                onClick={() => setSplashOpen(false)}
                className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] text-xs font-bold tracking-wider uppercase"
              >
                اردو ایڈیشن کھولیں
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Screen 57: Notifications Hub Modal */}
      {notifOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 font-ui"
          onClick={() => setNotifOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-lg p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#064E3B] font-semibold block">
                  Screen 57 • Centralized Push Notifications Hub
                </span>
                <h3 className="text-base font-bold text-stone-950">
                  Escrow, Q&A & Court Cause-List Alerts
                </h3>
              </div>
              <button onClick={() => setNotifOpen(false)}>
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>
            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 bg-white border border-stone-200 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-stone-950">
                      {isUr ? n.title_urdu || n.title : n.title}
                    </strong>
                    <span className="font-mono-code text-[11px] text-[#064E3B]">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isUr ? n.message_urdu || n.message : n.message}
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
              <span className="text-stone-500">
                Editable in Admin CMS → Notifications Tab
              </span>
              <Link
                href="/admin"
                onClick={() => setNotifOpen(false)}
                className="font-semibold text-[#064E3B] hover:underline"
              >
                Edit Notifications in Admin →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Screen 59: Language Selector Bottom Sheet */}
      {langSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4 font-ui"
          onClick={() => setLangSheetOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-md p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#B48327] font-semibold block">
                  Screen 59 • Bilingual Language Selector Bottom Sheet
                </span>
                <h3 className="text-base font-bold text-stone-950">
                  Switch Platform Language & Layout Direction
                </h3>
              </div>
              <button onClick={() => setLangSheetOpen(false)}>
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/"
                onClick={() => setLangSheetOpen(false)}
                className={`p-4 border text-center text-xs font-bold ${
                  !isUr
                    ? "bg-[#064E3B] text-white border-[#064E3B]"
                    : "bg-white text-stone-900 border-stone-300"
                }`}
              >
                English Edition (LTR)
                <span className="block text-[10px] font-normal mt-1 opacity-80">
                  Libre Baskerville Legal Serif
                </span>
              </Link>
              <Link
                href="/urdu"
                onClick={() => setLangSheetOpen(false)}
                className={`p-4 border text-center text-sm font-urdu font-bold ${
                  isUr
                    ? "bg-[#064E3B] text-white border-[#064E3B]"
                    : "bg-white text-stone-900 border-stone-300"
                }`}
              >
                اردو ایڈیشن (RTL)
                <span className="block text-[10px] font-ui font-normal mt-1 opacity-80">
                  Noto Nastaliq Urdu
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Screen 60: Theme Selector Bottom Sheet */}
      {themeSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4 font-ui"
          onClick={() => setThemeSheetOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-md p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#B48327] font-semibold block">
                  Screen 60 • Theme Selector Bottom Sheet
                </span>
                <h3 className="text-base font-bold text-stone-950">
                  Select Editorial Reading Polarity
                </h3>
              </div>
              <button onClick={() => setThemeSheetOpen(false)}>
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { id: "paper", label: "Archival Paper", desc: "#FBF9F5 Default" },
                  { id: "light", label: "Stark Daylight", desc: "#FFFFFF High Contrast" },
                  { id: "dark", label: "Obsidian Dark", desc: "#0A0D0C Night" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    applyTheme(t.id);
                    setThemeSheetOpen(false);
                  }}
                  className={`p-3 border text-left text-xs cursor-pointer ${
                    theme === t.id
                      ? "bg-[#064E3B] text-white border-[#064E3B]"
                      : "bg-white text-stone-900 border-stone-300"
                  }`}
                >
                  <strong className="block">{t.label}</strong>
                  <span className="text-[10px] opacity-75">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Screen 61: Logout Confirmation Modal */}
      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 font-ui"
          onClick={() => setLogoutModalOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-sm p-6 shadow-2xl space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[11px] uppercase tracking-widest text-red-700 font-semibold block">
              Screen 61 • Logout Confirmation Modal
            </span>
            <h3 className="text-lg font-bold font-legal text-stone-950">
              End Authenticated Legal Session?
            </h3>
            <p className="text-xs text-stone-600">
              You will be returned to Guest Discovery Mode (Screens 01–12). Your Escrow bookings remain protected.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 py-2.5 border border-stone-300 bg-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 bg-red-700 text-white text-xs font-semibold cursor-pointer"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-Role RBAC & Supabase users_profiles Sync Modal */}
      {rbacModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4 font-ui"
          onClick={() => setRbacModalOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-2xl p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-300 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#064E3B] font-semibold block">
                  Supabase Auth & public.users_profiles • 4-Role RBAC Enforcement Engine
                </span>
                <h3 className="text-lg font-bold font-legal text-stone-950">
                  Active Role & Module Access Matrix (Modules 1–5)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRbacModalOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RBAC_ROLES.map((r) => {
                const perm = RBAC_ROLE_PERMISSIONS[r];
                const isCurrent =
                  session &&
                  normalizeRBACRole(session.rbacRole || session.role) === r;
                return (
                  <div
                    key={r}
                    className={`p-4 border flex flex-col justify-between space-y-3 ${
                      isCurrent
                        ? "border-[#064E3B] bg-emerald-950/5"
                        : "border-stone-300 bg-white"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-950">
                          {perm.label_en}
                        </span>
                        <span className="font-mono-code text-[10px] px-2 py-0.5 bg-stone-900 text-white">
                          Modules {perm.modules.join(", ")}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        {r === "Client" &&
                          "Book Escrow Consultations, Post Anonymous Q&A, Pro-Bono Legal Aid & Basic AI Legal Assistant."}
                        {r === "Verified Advocate" &&
                          "Unlocks Advocate CRM (Screens 35–49), AI Researcher Pro (40), Private Lawyer Network & RAAST IBAN Withdrawals."}
                        {r === "Editorial Manager" &&
                          "Unlocks Bilingual News CMS (Screens 50–52), Categories, Templates & Masthead Supply."}
                        {r === "Admin" &&
                          "Full Super Admin Access across all 23 Supabase tables, Bar License Verification, Escrow Overrides & User RBAC Manager."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const synced = await switchActiveRBACRole(r);
                        setSession(synced);
                        setRbacModalOpen(false);
                      }}
                      className={`w-full py-2 text-xs font-semibold cursor-pointer ${
                        isCurrent
                          ? "bg-[#064E3B] text-white"
                          : "bg-stone-900 hover:bg-[#064E3B] text-white"
                      }`}
                    >
                      {isCurrent
                        ? `Active in users_profiles (${r})`
                        : `Sync Session & Profile as ${r} →`}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-stone-600">
                All role switches upsert directly into <code>public.users_profiles</code> and update module guards in real time.
              </span>
              <Link
                href="/admin"
                onClick={() => setRbacModalOpen(false)}
                className="font-semibold text-[#064E3B] hover:underline"
              >
                Open Admin Users & RBAC Manager →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        lang={lang}
      />

      <SmartAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(s) => setSession(s)}
        triggerReason={authReason}
        lang={lang}
      />

      <LegalAIWorkspaceModal
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        lang={lang}
        initialMode={aiMode}
      />

      <Master61ScreenExplorerModal
        isOpen={explorerOpen}
        onClose={() => setExplorerOpen(false)}
        lang={lang}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={(r) => handleTriggerAuth(r)}
        onOpenAI={(m) => handleTriggerAI(m)}
        onChangeTheme={applyTheme}
        currentTheme={theme}
        onLogout={handleLogout}
      />
    </div>
  );
}