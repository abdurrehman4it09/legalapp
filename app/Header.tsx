"use client";

import React, { useState, useEffect, useTransition } from "react";
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
} from "@/lib/supabase";
import { useAuthRBAC } from "./AuthContext";
import { SEO_61_SCREENS_CATALOG } from "./seo";
import {
  InlineSpinner,
  MutationFeedbackBanner,
} from "./components/SharedUI";

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
  const [workspaceDrawerOpen, setWorkspaceDrawerOpen] = useState(false);

  // Screens 57, 58, 59, 60, 61 modals/sheets
  const [notifOpen, setNotifOpen] = useState(false);
  const [langSheetOpen, setLangSheetOpen] = useState(false);
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [rbacModalOpen, setRbacModalOpen] = useState(false);
  const [seoModalOpen, setSeoModalOpen] = useState(false);
  const [seoModuleFilter, setSeoModuleFilter] = useState<number | "ALL">("ALL");
  const [isPendingRole, startRoleTransition] = useTransition();
  const [switchingTargetRole, setSwitchingTargetRole] = useState<string | null>(null);
  const [rbacFeedback, setRbacFeedback] = useState<string | null>(null);

  const {
    session: rbacSession,
    role: verifiedRole,
    isVerifying,
    verifyProfileRole,
    switchRoleAndVerify,
    logout: rbacLogout,
    lastVerifiedAt,
  } = useAuthRBAC();
  const [theme, setTheme] = useState<"paper" | "light" | "dark">("paper");
  const [session, setSession] = useState<UserSession | null>(null);
  const [siteSettings, setSiteSettings] = useState<any>(() => getSiteSettings());
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setSession(rbacSession || getActiveRBACSession());
  }, [rbacSession]);

  useEffect(() => {
    const syncData = () => {
      setSiteSettings(getSiteSettings());
      setNotifications(getTableData("notifications"));
      const active = getActiveRBACSession();
      setSession(active);
    };
    syncData();

    if (typeof window !== "undefined") {
      try {
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
      } catch {
        // ignore
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
      if (e.key === "Escape") {
        setWorkspaceDrawerOpen(false);
        setSplashOpen(false);
        setNotifOpen(false);
        setLangSheetOpen(false);
        setThemeSheetOpen(false);
        setLogoutModalOpen(false);
        setRbacModalOpen(false);
        setSeoModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const applyTheme = (next: "paper" | "light" | "dark") => {
    setTheme(next);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("plp_theme", next);
      } catch {
        // ignore
      }
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

  const handleLogout = async () => {
    await rbacLogout();
    setSession(null);
    setLogoutModalOpen(false);
  };

  return (
    <div
      dir={isUr ? "rtl" : "ltr"}
      className={`no-print ${isUr ? "font-urdu" : "font-ui-sans"}`}
    >
      {/* NEW YORK TIMES CENTERED EDITORIAL MASTHEAD */}
      <header className="border-b border-[#E5E2D9] bg-[#FAF9F5]">
        <div className="w-[96%] max-w-[1840px] mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-5">
          {/* Top Utility Whisper Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E5E2D9] font-ui-sans text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search statutes, judgments, and advocates"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#E5E2D9] bg-[#F2EFE9]/70 text-[#141413] hover:border-[#141413] cursor-pointer"
                title="Search (⌘K)"
              >
                <Search className="w-3.5 h-3.5 text-[#0B5D3B]" />
                <span>{isUr ? "تلاش" : "Search"}</span>
              </button>
              <Link
                href="/"
                className="editorial-link text-[#66645E] hover:text-[#141413]"
              >
                {isUr ? "مرکزی صفحہ" : "← Home Edition"}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setWorkspaceDrawerOpen(!workspaceDrawerOpen)}
                className="editorial-link text-xs font-medium text-[#66645E] hover:text-[#141413] cursor-pointer"
              >
                {session ? session.name.split(" ")[0] : isUr ? "پورٹل" : "Portals"}
              </button>

              <Link
                href={isUr ? "/" : "/urdu"}
                className="px-2.5 py-1 rounded border border-[#E5E2D9] bg-[#F2EFE9]/70 text-[#141413] text-[11px] font-medium"
              >
                {isUr ? "EN" : "اردو"}
              </Link>

              <button
                type="button"
                onClick={() => handleTriggerAI("assistant")}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#FAF9F5] bg-[#0B5D3B] hover:bg-[#09482E] whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isUr ? "قانونی معاون" : "Ask Legal AI"}
              </button>
            </div>
          </div>

          {/* Centered Monumental NYT Masthead */}
          <div className="pt-6 pb-4 flex flex-col items-center text-center">
            <div className="flex flex-col items-center text-center font-mono-code text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#66645E] leading-relaxed">
              <span>EST. UNDER ARTICLE 10-A &amp; 199</span>
              <span className="text-[#0B5D3B] text-xs my-0.5 leading-none" aria-hidden="true">
                ✦
              </span>
              <span>SOVEREIGN CITIZEN JUSTICE RECORD</span>
            </div>

            <Link
              href={isUr ? "/urdu" : "/"}
              className="group mt-2 flex flex-col items-center text-center"
            >
              <span className="font-legal-serif text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-[#141413] group-hover:text-[#0B5D3B] transition-editorial">
                QanoonPK
              </span>
              <span dir="rtl" className="font-urdu text-2xl sm:text-3xl text-[#0B5D3B] mt-1">
                قانون پاکستان
              </span>
            </Link>

            <p className="mt-3 max-w-2xl mx-auto font-legal-serif italic text-xs sm:text-sm text-[#66645E] leading-relaxed">
              “Plain-Language Pakistani Statutes, Constitutional Remedies &amp; Verified Bar Counsel — Without the Jargon.”
            </p>
          </div>
        </div>

        {/* Double-Rule Menu Bar */}
        <div className="border-t-2 border-t-[#141413]">
          <div className="border-t border-[#E5E2D9] mt-[2px] w-[96%] max-w-[1840px] mx-auto px-3 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-start md:justify-center gap-6 py-2.5 overflow-x-auto no-scrollbar font-ui-sans text-xs sm:text-[13px] font-medium text-[#141413]">
              <Link href="/" className="editorial-link whitespace-nowrap shrink-0">
                {isUr ? "مرکزی صفحہ" : "Home Desk"}
              </Link>
              <span className="text-[#E5E2D9]" aria-hidden="true">·</span>
              <Link
                href={isUr ? "/urdu/laws" : "/laws"}
                className="editorial-link whitespace-nowrap shrink-0"
              >
                {isUr ? "آئین و قوانین" : "Constitution & Laws"}
              </Link>
              <span className="text-[#E5E2D9]" aria-hidden="true">·</span>
              <Link
                href={isUr ? "/urdu/lawyers" : "/lawyers"}
                className="editorial-link whitespace-nowrap shrink-0"
              >
                {isUr ? "تصدیق شدہ وکلاء" : "Verified Advocates"}
              </Link>
              <span className="text-[#E5E2D9]" aria-hidden="true">·</span>
              <Link href="/templates" className="editorial-link whitespace-nowrap shrink-0">
                {isUr ? "قانونی مسودات" : "Legal Templates"}
              </Link>
              <span className="text-[#E5E2D9]" aria-hidden="true">·</span>
              <Link href="/forum" className="editorial-link whitespace-nowrap shrink-0">
                {isUr ? "قانونی فورم" : "Citizen Forum"}
              </Link>
              <span className="text-[#E5E2D9]" aria-hidden="true">·</span>
              <Link href="/pro-bono/apply" className="editorial-link whitespace-nowrap shrink-0">
                {isUr ? "مفت قانونی امداد" : "Free Legal Aid"}
              </Link>
              <span className="text-[#E5E2D9]" aria-hidden="true">·</span>
              <Link href="/lawyer/dashboard" className="editorial-link whitespace-nowrap shrink-0">
                {isUr ? "وکیل چیمبر" : "Advocate CRM"}
              </Link>
            </nav>
          </div>
        </div>

        {/* Collapsible Quiet Workspace & Portals Drawer (Only visible when explicitly toggled) */}
        {workspaceDrawerOpen && (
          <div className="border-t border-[#E6E4DD] bg-[#F2EFE9] px-6 py-6 editorial-fade-up font-ui-sans text-xs">
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-5 text-[#141413]">
                  <Link
                    href={isUr ? "/" : "/urdu"}
                    onClick={() => setWorkspaceDrawerOpen(false)}
                    className="editorial-link font-medium"
                  >
                    {isUr ? "Switch to English Edition" : "اردو ایڈیشن کھولیں"}
                  </Link>
                  <Link
                    href="/client/ai-assistant"
                    onClick={() => setWorkspaceDrawerOpen(false)}
                    className="editorial-link text-[#575652] hover:text-[#141413]"
                  >
                    AI Assistant Studio
                  </Link>
                  <Link
                    href="/client/cases"
                    onClick={() => setWorkspaceDrawerOpen(false)}
                    className="editorial-link text-[#575652] hover:text-[#141413]"
                  >
                    Client Cases
                  </Link>
                  <Link
                    href="/lawyer/dashboard"
                    onClick={() => setWorkspaceDrawerOpen(false)}
                    className="editorial-link text-[#575652] hover:text-[#141413]"
                  >
                    Advocate Chamber
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setWorkspaceDrawerOpen(false)}
                    className="editorial-link text-[#575652] hover:text-[#141413]"
                  >
                    Editorial CMS
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setWorkspaceDrawerOpen(false);
                      setExplorerOpen(true);
                    }}
                    className="editorial-link text-[#575652] hover:text-[#141413] cursor-pointer"
                  >
                    All 61 Screens
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkspaceDrawerOpen(false);
                      setNotifOpen(true);
                    }}
                    className="editorial-link text-[#575652] hover:text-[#141413] cursor-pointer"
                  >
                    Alerts ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkspaceDrawerOpen(false);
                      setThemeSheetOpen(true);
                    }}
                    className="editorial-link text-[#575652] hover:text-[#141413] cursor-pointer"
                  >
                    Reading Theme ({theme})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkspaceDrawerOpen(false);
                      setRbacModalOpen(true);
                    }}
                    className="editorial-link text-[#575652] hover:text-[#141413] cursor-pointer"
                  >
                    Role: {session ? normalizeRBACRole(session.rbacRole || session.role) : "Guest"}
                  </button>
                  {session ? (
                    <button
                      type="button"
                      onClick={() => {
                        setWorkspaceDrawerOpen(false);
                        setLogoutModalOpen(true);
                      }}
                      className="editorial-link text-red-800 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setWorkspaceDrawerOpen(false);
                        handleTriggerAuth("Sign in to your Client or Advocate account");
                      }}
                      className="editorial-link font-medium text-[#0B5D3B] cursor-pointer"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Screen 01: Splash Screen Modal Preview */}
      {splashOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sovereign Legal Architecture Splash Screen"
          className="fixed inset-0 z-50 bg-[#064E3B] text-white flex flex-col items-center justify-center p-6 text-center font-ui animate-in fade-in duration-200"
          onClick={() => setSplashOpen(false)}
        >
          <div
            className="relative max-w-lg w-full space-y-6 p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSplashOpen(false)}
              aria-label="Close splash screen modal"
              className="absolute top-0 right-0 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-emerald-200 hover:text-white hover:bg-emerald-900/60 transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-20 h-20 mx-auto border-2 border-[#D4AF37] flex items-center justify-center bg-emerald-950/60">
              <Scale className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Screen 01 • Sovereign Legal Architecture
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-legal tracking-tight break-words">
              {siteSettings?.masthead_title || "The Daily Legal Brief"}
            </h2>
            <p className="text-lg font-urdu text-emerald-100 break-words">
              {siteSettings?.masthead_title_urdu || "دی ڈیلی لیگل بریف"} —{" "}
              {siteSettings?.masthead_kicker_urdu}
            </p>
            <p className="text-xs text-emerald-200/80 max-w-md mx-auto leading-relaxed break-words">
              {siteSettings?.masthead_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setSplashOpen(false)}
                className="min-h-[44px] px-6 py-3 bg-[#D4AF37] hover:bg-amber-400 text-stone-950 text-xs font-bold tracking-wider uppercase transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                Enter Magazine Home (Screen 02)
              </button>
              <Link
                href="/urdu"
                onClick={() => setSplashOpen(false)}
                className="min-h-[44px] inline-flex items-center justify-center px-6 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-emerald-900/50 text-xs font-bold tracking-wider uppercase transition-all duration-200 active:scale-[0.98]"
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
          role="dialog"
          aria-modal="true"
          aria-label="Centralized Push Notifications Hub"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 font-ui animate-in fade-in duration-200"
          onClick={() => setNotifOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
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
              <button
                type="button"
                aria-label="Close notifications modal"
                onClick={() => setNotifOpen(false)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-stone-100 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 bg-white border border-stone-200 space-y-1 hover:bg-stone-50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between text-xs gap-2">
                    <strong className="text-stone-950 break-words">
                      {isUr ? n.title_urdu || n.title : n.title}
                    </strong>
                    <span className="font-mono-code text-[11px] text-[#064E3B] shrink-0">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed break-words">
                    {isUr ? n.message_urdu || n.message : n.message}
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-stone-200 flex flex-wrap justify-between items-center gap-2 text-xs">
              <span className="text-stone-500">
                Editable in Admin CMS → Notifications Tab
              </span>
              <Link
                href="/admin"
                onClick={() => setNotifOpen(false)}
                className="min-h-[44px] inline-flex items-center font-semibold text-[#064E3B] hover:underline transition-all duration-200 active:scale-[0.98]"
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
          role="dialog"
          aria-modal="true"
          aria-label="Bilingual Language Selector"
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4 font-ui animate-in fade-in duration-200"
          onClick={() => setLangSheetOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
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
              <button
                type="button"
                aria-label="Close language selector modal"
                onClick={() => setLangSheetOpen(false)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-stone-100 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/"
                onClick={() => setLangSheetOpen(false)}
                className={`min-h-[44px] p-4 border text-center text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                  !isUr
                    ? "bg-[#064E3B] text-white border-[#064E3B]"
                    : "bg-white text-stone-900 border-stone-300 hover:bg-stone-50"
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
                className={`min-h-[44px] p-4 border text-center text-sm font-urdu font-bold transition-all duration-200 active:scale-[0.98] ${
                  isUr
                    ? "bg-[#064E3B] text-white border-[#064E3B]"
                    : "bg-white text-stone-900 border-stone-300 hover:bg-stone-50"
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
          role="dialog"
          aria-modal="true"
          aria-label="Theme Selector"
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4 font-ui animate-in fade-in duration-200"
          onClick={() => setThemeSheetOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
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
              <button
                type="button"
                aria-label="Close theme selector modal"
                onClick={() => setThemeSheetOpen(false)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-stone-100 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                  className={`min-h-[44px] p-3 border text-left text-xs transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                    theme === t.id
                      ? "bg-[#064E3B] text-white border-[#064E3B]"
                      : "bg-white text-stone-900 border-stone-300 hover:bg-stone-50"
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
          role="dialog"
          aria-modal="true"
          aria-label="Logout Confirmation"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 font-ui animate-in fade-in duration-200"
          onClick={() => setLogoutModalOpen(false)}
        >
          <div
            className="relative bg-[#FBF9F5] border border-stone-300 w-full max-w-sm p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close logout modal"
              onClick={() => setLogoutModalOpen(false)}
              className="absolute top-2 right-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-stone-100 transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-[11px] uppercase tracking-widest text-red-700 font-semibold block pt-2">
              Screen 61 • Logout Confirmation Modal
            </span>
            <h3 className="text-lg font-bold font-legal text-stone-950">
              End Authenticated Legal Session?
            </h3>
            <p className="text-xs text-stone-600">
              You will be returned to Guest Discovery Mode (Screens 01–12). Your Escrow bookings remain protected.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 min-h-[44px] py-2.5 border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 min-h-[44px] py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer"
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
          role="dialog"
          aria-modal="true"
          aria-label="Active Role and Module Access Matrix"
          className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4 font-ui animate-in fade-in duration-200"
          onClick={() => setRbacModalOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
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
                aria-label="Close RBAC role switcher modal"
                onClick={() => setRbacModalOpen(false)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-stone-100 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rbacFeedback && (
              <MutationFeedbackBanner
                status="success"
                message={rbacFeedback}
                onDismiss={() => setRbacFeedback(null)}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RBAC_ROLES.map((r) => {
                const perm = RBAC_ROLE_PERMISSIONS[r];
                const isCurrent =
                  session &&
                  normalizeRBACRole(session.rbacRole || session.role) === r;
                const isThisRoleLoading =
                  isPendingRole && switchingTargetRole === r;
                return (
                  <div
                    key={r}
                    className={`p-4 border flex flex-col justify-between space-y-3 transition-all duration-200 ${
                      isCurrent
                        ? "border-[#064E3B] bg-emerald-950/5"
                        : "border-stone-300 bg-white hover:bg-stone-50"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-stone-950">
                          {perm.label_en}
                        </span>
                        <span className="font-mono-code text-[10px] px-2 py-0.5 bg-stone-900 text-white shrink-0">
                          Modules {perm.modules.join(", ")}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed break-words">
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
                      disabled={isPendingRole}
                      onClick={() => {
                        setSwitchingTargetRole(r);
                        setRbacFeedback(null);
                        startRoleTransition(async () => {
                          const synced = await switchRoleAndVerify(r);
                          setSession(synced);
                          setRbacFeedback(
                            `Role synced to "${r}" in public.users_profiles.`
                          );
                          setSwitchingTargetRole(null);
                        });
                      }}
                      className={`w-full min-h-[44px] py-2 px-3 text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer ${
                        isCurrent
                          ? "bg-[#064E3B] text-white"
                          : "bg-stone-900 hover:bg-[#064E3B] text-white"
                      }`}
                    >
                      {isThisRoleLoading ? (
                        <>
                          <InlineSpinner className="w-4 h-4" />
                          <span>Processing...</span>
                        </>
                      ) : isCurrent ? (
                        `Active in users_profiles (${r})`
                      ) : (
                        `Sync Session & Profile as ${r} →`
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-stone-600">
                <span>
                  Verified role: <strong>{verifiedRole}</strong>
                  {lastVerifiedAt && (
                    <span className="ml-1 font-mono-code text-[10px] text-stone-500">
                      ({new Date(lastVerifiedAt).toLocaleTimeString()})
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  disabled={isVerifying || isPendingRole}
                  onClick={() => {
                    startRoleTransition(async () => {
                      await verifyProfileRole();
                      setRbacFeedback(
                        `Verified users_profiles.role = "${verifiedRole}" from Supabase.`
                      );
                    });
                  }}
                  className="min-h-[36px] px-3 py-1 border border-stone-300 bg-white hover:bg-stone-50 text-[11px] font-semibold text-[#064E3B] hover:border-[#064E3B] inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <InlineSpinner className="w-3.5 h-3.5" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    "Re-Verify users_profiles"
                  )}
                </button>
              </div>
              <Link
                href="/admin"
                onClick={() => setRbacModalOpen(false)}
                className="min-h-[44px] inline-flex items-center font-semibold text-[#064E3B] hover:underline transition-all duration-200 active:scale-[0.98]"
              >
                Open Admin Users & RBAC Manager →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 61-Route Dynamic SEO & generateMetadata Inspector Modal */}
      {seoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pakistan Legal Search Intent SEO Registry"
          className="fixed inset-0 z-50 bg-stone-950/75 flex items-center justify-center p-4 font-ui animate-in fade-in duration-200"
          onClick={() => setSeoModalOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border-2 border-stone-900 max-w-6xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#064E3B] text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
              <div>
                <div className="text-[11px] font-mono-code uppercase tracking-widest text-[#D4AF37]">
                  Next.js App Router • Server-Side generateMetadata() • 61 Legal Routes
                </div>
                <h3 className="text-lg font-bold font-legal mt-0.5">
                  Pakistan Legal Search Intent SEO Registry (Screens 01–61)
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close SEO metadata inspector modal"
                onClick={() => setSeoModalOpen(false)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-stone-200 hover:text-white hover:bg-emerald-900/60 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {(["ALL", 1, 2, 3, 4, 5] as const).map((m) => (
                  <button
                    key={String(m)}
                    type="button"
                    onClick={() => setSeoModuleFilter(m)}
                    className={`px-3 py-1 border font-semibold cursor-pointer ${
                      seoModuleFilter === m
                        ? "bg-[#064E3B] text-white border-[#064E3B]"
                        : "bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-500"
                    }`}
                  >
                    {m === "ALL" ? "All 61 Routes" : `Module ${m}`}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-stone-600 font-mono-code">
                OpenGraph + Twitter Summary Card + Schema.org JSON-LD Enabled
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-3">
              {Object.values(SEO_61_SCREENS_CATALOG)
                .filter(
                  (item) =>
                    seoModuleFilter === "ALL" ||
                    item.moduleNumber === seoModuleFilter
                )
                .map((item) => {
                  const navHref = item.routePattern
                    .replace("[id]", "1")
                    .replace("[bookingId]", "BK-9012")
                    .replace("[caseId]", "CASE-LHR-2026-09");
                  return (
                    <div
                      key={item.screenNumber}
                      className="bg-white border border-stone-300 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 max-w-4xl">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-code">
                          <span className="px-2 py-0.5 bg-[#064E3B] text-white font-bold">
                            Screen {String(item.screenNumber).padStart(2, "0")}
                          </span>
                          <span className="px-2 py-0.5 bg-amber-50 text-[#B48327] border border-[#B48327]/40 font-semibold">
                            Module {item.moduleNumber}
                          </span>
                          <span className="text-stone-900 font-bold">
                            {item.routePattern}
                          </span>
                          <span className="text-stone-500">
                            • Schema: {item.schemaType}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-[#1a0dab] font-legal">
                          {item.title}{" "}
                          <span className="text-[11px] font-mono-code font-normal text-stone-500">
                            ({item.title.length} chars)
                          </span>
                        </div>
                        <p className="text-xs text-stone-700 leading-relaxed">
                          {item.description}{" "}
                          <span className="text-[11px] font-mono-code text-stone-400">
                            ({item.description.length} chars)
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.keywords.map((kw) => (
                            <span
                              key={kw}
                              className="px-2 py-0.5 bg-stone-100 border border-stone-200 text-[10px] text-stone-700"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Link
                          href={navHref}
                          onClick={() => setSeoModalOpen(false)}
                          className="inline-block px-3.5 py-2 bg-[#064E3B] text-white text-xs font-semibold hover:bg-emerald-950"
                        >
                          Open Route →
                        </Link>
                      </div>
                    </div>
                  );
                })}
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