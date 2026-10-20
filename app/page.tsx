"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "./Header";
import {
  createClient,
  getTableData,
  saveTableData,
  getSiteSettings,
  getCategoriesByScope,
  INITIAL_SITE_SETTINGS,
} from "@/app/supabase";
import {
  Scale,
  BookOpen,
  FileText,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Calendar,
  Video,
  CheckCircle2,
  Upload,
  AlertCircle,
  Briefcase,
  Wallet,
} from "lucide-react";
import {
  SmartAuthModal,
  LegalAIWorkspaceModal,
  TemplatePreviewModal,
  BookingEscrowModal,
  UserSession,
} from "./components/PlatformModals";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function EnglishHomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [laws, setLaws] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(INITIAL_SITE_SETTINGS);
  const [articleCats, setArticleCats] = useState<any[]>([]);
  const [qaCats, setQaCats] = useState<any[]>([]);
  const [probonoCats, setProbonoCats] = useState<any[]>([]);
  const [probonoGuidelines, setProbonoGuidelines] = useState<any[]>([]);
  const [crmLeads, setCrmLeads] = useState<any[]>([]);
  const [caseMilestones, setCaseMilestones] = useState<any[]>([]);
  const [lawyerNetwork, setLawyerNetwork] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeHubTab, setActiveHubTab] = useState<
    "templates" | "qa" | "probono" | "workspace"
  >("templates");

  // Modals state
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState<string | undefined>();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalMode, setAiModalMode] = useState<"assistant" | "researcher">("assistant");
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [bookingLawyer, setBookingLawyer] = useState<any | null>(null);

  // Screen 31 & 32: Post a Question state
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionCategory, setQuestionCategory] = useState("Property & Inheritance");
  const [questionCity, setQuestionCity] = useState("Lahore");
  const [keepAnonymous, setKeepAnonymous] = useState(true);
  const [showAnonWarning, setShowAnonWarning] = useState(false);
  const [questionSuccess, setQuestionSuccess] = useState("");

  // Screen 33 & 34: Pro-Bono state
  const [probonoName, setProbonoName] = useState("");
  const [probonoIncome, setProbonoIncome] = useState("");
  const [probonoCategory, setProbonoCategory] = useState("Family & Maintenance");
  const [probonoCertType, setProbonoCertType] = useState("Union Council Income Certificate");
  const [showIncomeGuidelines, setShowIncomeGuidelines] = useState(false);
  const [probonoSubmitted, setProbonoSubmitted] = useState(false);

  // Screen 47: Advocate IBAN Withdraw Modal
  const [ibanModalOpen, setIbanModalOpen] = useState(false);
  const [ibanInput, setIbanInput] = useState("PK36 SCBL 0000 0011 2345 6702");
  const [withdrawDone, setWithdrawDone] = useState(false);

  async function loadAllData() {
    const [articlesRes, lawsRes, lawyersRes] = await Promise.all([
      supabase.from("articles").select("*").order("created_at", { ascending: false }),
      supabase.from("laws").select("*").order("created_at", { ascending: false }),
      supabase.from("lawyers").select("*").order("created_at", { ascending: false }),
    ]);
    if (articlesRes.data) setArticles(articlesRes.data);
    if (lawsRes.data) setLaws(lawsRes.data);
    if (lawyersRes.data) setLawyers(lawyersRes.data);
    setTemplates(getTableData("templates"));
    setQuestions(getTableData("questions"));
    setAppointments(getTableData("appointments"));
    setSiteSettings(getSiteSettings());
    setArticleCats(getCategoriesByScope("article"));
    setQaCats(getCategoriesByScope("qa"));
    setProbonoCats(getCategoriesByScope("probono"));
    setProbonoGuidelines(getTableData("probono_guidelines"));
    setCrmLeads(getTableData("crm_leads"));
    setCaseMilestones(getTableData("case_milestones"));
    setLawyerNetwork(getTableData("lawyer_network"));
    setLoading(false);
  }

  useEffect(() => {
    loadAllData();
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("plp_user_session");
      if (saved) {
        try {
          setUserSession(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
      const handleSync = () => loadAllData();
      window.addEventListener("plp_data_updated", handleSync);
      return () => window.removeEventListener("plp_data_updated", handleSync);
    }
  }, []);

  const categories = ["All", ...articleCats.map((c) => c.name)];

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((a) =>
          (a.category || "").toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const leadArticle = filteredArticles[0] || articles[0];
  const secondaryArticles = filteredArticles.slice(1);

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSession) {
      setAuthTriggerReason(
        "Screen 13 • Please verify your account to post a question to the Public Q&A Forum."
      );
      setAuthModalOpen(true);
      return;
    }
    if (!questionTitle.trim()) return;
    const newQ = {
      id: Date.now(),
      title: questionTitle,
      title_urdu: questionTitle,
      category: questionCategory,
      category_urdu: questionCategory,
      city: questionCity,
      is_anonymous: keepAnonymous,
      author_name: keepAnonymous ? "Anonymous Citizen" : userSession.name,
      created_at: new Date().toISOString(),
      answer_count: 1,
      verified_reply: {
        lawyer_name: "Adv. Sara Mansoor, ASC",
        lawyer_name_urdu: "ایڈووکیٹ سارہ منصور",
        court: "Supreme Court of Pakistan",
        reply:
          "Preliminary Statutory Note: Your question has been logged for High Court counsel review. Preserve all primary documentary records and registered notices under Article 10A due process.",
        reply_urdu:
          "آپ کا سوال ریکارڈ کر لیا گیا ہے۔ تمام اصل کاغذات محفوظ رکھیں۔",
      },
    };
    const updated = [newQ, ...questions];
    saveTableData("questions", updated);
    setQuestions(updated);
    setQuestionTitle("");
    setQuestionSuccess("Your legal question has been published to the Q&A Forum.");
  };

  const handleProBonoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSession) {
      setAuthTriggerReason(
        "Screen 13 • Verify your identity to submit a Pro-Bono Legal Aid application."
      );
      setAuthModalOpen(true);
      return;
    }
    const existing = getTableData("probono_requests");
    saveTableData("probono_requests", [
      {
        id: Date.now(),
        applicant: probonoName || userSession.name,
        monthly_income: probonoIncome,
        category: probonoCategory,
        certificate_type: probonoCertType,
        status: "Assigned to High Court Pro-Bono Panel",
        created_at: new Date().toISOString(),
      },
      ...existing,
    ]);
    setProbonoSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111] font-legal">
      <Header
        lang="en"
        onOpenAI={(mode = "assistant") => {
          setAiModalMode(mode);
          setAiModalOpen(true);
        }}
        onOpenAuth={(reason) => {
          setAuthTriggerReason(reason);
          setAuthModalOpen(true);
        }}
      />

      {/* Editorial Masthead Banner */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6 border-b-2 border-stone-900">
        <div className="flex flex-wrap items-center justify-between gap-4 font-ui text-xs text-stone-500 pb-4 border-b border-stone-200">
          <div>
            <span>{siteSettings.volume_issue}</span>
            <span className="mx-2">·</span>
            <span>{siteSettings.cities}</span>
          </div>
          <div className="font-mono-code">
            <span>{siteSettings.statute_ticker}</span>
          </div>
        </div>

        <div className="py-8 text-center max-w-4xl mx-auto">
          <p className="font-ui text-xs uppercase tracking-[0.22em] text-[#064E3B] font-semibold mb-3">
            PAKISTAN LEGAL JOURNAL, STATUTE ARCHIVE & VERIFIED ADVOCATE NETWORK
          </p>
          <h1
            className="text-4xl sm:text-6xl font-bold tracking-tight text-stone-950 mb-4"
            style={{ textWrap: "balance" }}
          >
            {siteSettings.masthead_title}
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {siteSettings.masthead_subtitle}
          </p>
        </div>

        {/* Interactive Category Filter Bar (Functional Buttons) */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 font-ui">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#064E3B] text-white"
                    : "bg-transparent text-stone-600 hover:text-stone-950 hover:bg-stone-200/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setAiModalMode("researcher");
                setAiModalOpen(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold border border-[#B48327] text-stone-900 bg-amber-50/60 hover:bg-[#B48327] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              AI Researcher Pro (Screen 40)
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-16">
        {/* ====================================================================
            TIER 1 & TIER 2: EDITORIAL MAGAZINE BRIEFINGS (SCREEN 02)
            ==================================================================== */}
        {loading ? (
          <div className="py-16 text-center font-ui text-sm text-stone-500">
            Loading editorial briefings and statutory records...
          </div>
        ) : (
          <section className="space-y-10">
            {leadArticle && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-10 border-b border-stone-300">
                {/* Lead Story Column */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="font-ui text-xs text-[#064E3B] font-semibold">
                      <span>LEAD CONSTITUTIONAL BRIEFING</span>
                      <span className="mx-2 text-stone-400">·</span>
                      <span>{leadArticle.category || "Constitutional Law"}</span>
                      <span className="mx-2 text-stone-400">·</span>
                      <span className="text-stone-500 font-normal">
                        {leadArticle.read_time || "6 min read"}
                      </span>
                    </div>

                    <Link href={`/article/${leadArticle.id}`}>
                      <h2
                        className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-stone-950 leading-[1.18] hover:text-[#064E3B] transition-colors"
                        style={{ textWrap: "balance" }}
                      >
                        {leadArticle.title}
                      </h2>
                    </Link>

                    {leadArticle.title_urdu && (
                      <Link
                        href={`/urdu/article/${leadArticle.id}`}
                        dir="rtl"
                        className="block font-urdu text-xl text-stone-700 hover:text-[#064E3B]"
                      >
                        {leadArticle.title_urdu}
                      </Link>
                    )}

                    <p className="text-stone-700 text-base sm:text-lg leading-relaxed pt-1">
                      {leadArticle.subtitle ||
                        (leadArticle.content
                          ? leadArticle.content.slice(0, 240) + "…"
                          : "")}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 font-ui text-xs text-stone-600">
                    <div>
                      <span className="font-semibold text-stone-900">
                        {leadArticle.author || "Editorial Counsel"}
                      </span>
                      <span className="mx-2">·</span>
                      <span>
                        {new Date(leadArticle.created_at).toLocaleDateString(
                          "en-PK",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/article/${leadArticle.id}`}
                        className="font-semibold text-[#064E3B] hover:underline flex items-center gap-1"
                      >
                        <span>Read Full Briefing (Screen 04)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bespoke Architectural Engraving Plate (Zero Broken Image Fallback) */}
                <div className="lg:col-span-5">
                  <Link
                    href={`/article/${leadArticle.id}`}
                    className="h-full min-h-[280px] bg-[#064E3B] text-white p-8 border border-stone-900 flex flex-col justify-between relative overflow-hidden group"
                  >
                    <div className="flex items-center justify-between text-xs font-ui text-[#D4AF37] border-b border-white/15 pb-3">
                      <span className="font-mono-code">PLD 2024 SC 112 · ART. 23 & 25</span>
                      <span>SUPREME COURT ARCHIVE</span>
                    </div>

                    <div className="my-6 space-y-3">
                      <Scale className="w-10 h-10 text-[#D4AF37]" />
                      <div className="font-legal text-xl sm:text-2xl font-bold leading-snug text-white group-hover:underline">
                        “Inheritance vests immediately upon the demise of the predecessor; no female co-sharer can be divested through coercion.”
                      </div>
                      <p className="font-urdu text-base text-emerald-100" dir="rtl">
                        وراثتی جائیداد میں خواتین کا حقِ ملکیت فوری اور ناقابلِ تنسیخ ہے۔
                      </p>
                    </div>

                    <div className="font-ui text-xs text-emerald-200 flex items-center justify-between pt-3 border-t border-white/15">
                      <span>NADRA 15-Day Succession Protocol</span>
                      <span className="text-[#D4AF37] font-semibold">
                        Inspect Precedent →
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Tier 2 Secondary Editorial Grid */}
            {secondaryArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {secondaryArticles.map((article) => (
                  <article
                    key={article.id}
                    className="flex flex-col justify-between border-b md:border-b-0 md:border-r last:border-r-0 border-stone-200 pb-6 md:pb-0 md:pr-6 last:pr-0"
                  >
                    <div className="space-y-2.5">
                      <div className="font-ui text-xs text-stone-500">
                        <span className="text-[#064E3B] font-semibold">
                          {article.category || "Legal Analysis"}
                        </span>
                        <span className="mx-1.5">·</span>
                        <span>{article.read_time || "5 min read"}</span>
                      </div>
                      <Link href={`/article/${article.id}`}>
                        <h3 className="text-xl font-bold text-stone-950 leading-snug hover:text-[#064E3B] transition-colors">
                          {article.title}
                        </h3>
                      </Link>
                      {article.title_urdu && (
                        <Link
                          href={`/urdu/article/${article.id}`}
                          dir="rtl"
                          className="block font-urdu text-base text-stone-600 hover:text-[#064E3B]"
                        >
                          {article.title_urdu}
                        </Link>
                      )}
                      <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
                        {article.subtitle || article.content}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between font-ui text-xs text-stone-500">
                      <span>{article.author || "Editorial Desk"}</span>
                      <Link
                        href={`/article/${article.id}`}
                        className="font-semibold text-stone-900 hover:text-[#064E3B]"
                      >
                        Read →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ====================================================================
            TOP HIGH COURT & SUPREME COURT ADVOCATES (SCREEN 06 & ESCROW BOOKING)
            ==================================================================== */}
        <section className="pt-8 border-t-2 border-stone-900">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-ui text-xs uppercase tracking-widest text-[#064E3B] font-semibold mb-1">
                Screen 06 · Verified Bar Council Roll
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-950">
                Top High Court & Supreme Court Advocates
              </h2>
            </div>
            <Link
              href="/lawyers"
              className="font-ui text-xs font-semibold text-[#064E3B] hover:underline flex items-center gap-1"
            >
              <span>Open Full Advocate Directory & Advanced Filters (Screen 07)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawyers.slice(0, 3).map((lawyer) => (
              <div
                key={lawyer.id}
                className="bg-white border border-stone-300 p-6 flex flex-col justify-between hover:border-stone-900 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#064E3B] text-[#D4AF37] font-legal font-bold text-lg flex items-center justify-center border border-[#B48327] shrink-0">
                        {lawyer.name ? lawyer.name.replace("Adv. ", "").charAt(0) : "A"}
                      </div>
                      <div>
                        <Link
                          href={`/lawyers/${lawyer.id}`}
                          className="text-lg font-bold text-stone-950 hover:text-[#064E3B] transition-colors block"
                        >
                          {lawyer.name}
                        </Link>
                        <div className="font-ui text-xs text-stone-500">
                          {lawyer.court || "High Court"} · {lawyer.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="font-ui text-xs text-[#064E3B] font-semibold mb-2">
                    {lawyer.specialty}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4 line-clamp-3">
                    {lawyer.intro || lawyer.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200 font-ui space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span>
                      License:{" "}
                      <strong className="font-mono-code text-stone-800">
                        {lawyer.bar_council_id || "PBC-Verified"}
                      </strong>
                    </span>
                    <span className="font-mono-code font-bold text-stone-950">
                      PKR {(lawyer.fee || 3500).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-500">
                    <span>★ {lawyer.rating || "4.9"}</span>
                    <span className="mx-1.5">·</span>
                    <span>{lawyer.experience_years || 12} Yrs Standing</span>
                    {lawyer.pro_bono && (
                      <>
                        <span className="mx-1.5">·</span>
                        <span className="text-[#064E3B] font-semibold">
                          Pro-Bono Available
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/lawyers/${lawyer.id}`}
                      className="flex-1 py-2 px-3 border border-stone-300 hover:border-stone-900 text-center text-xs font-semibold text-stone-800"
                    >
                      Profile (Screen 21)
                    </Link>
                    <button
                      type="button"
                      onClick={() => setBookingLawyer(lawyer)}
                      className="flex-1 py-2 px-3 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-semibold cursor-pointer"
                    >
                      Book Escrow (Screen 22)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================================
            DIGITAL LAW LIBRARY & CONSTITUTIONAL ARCHIVE (SCREENS 11–12)
            ==================================================================== */}
        <section className="pt-8 border-t-2 border-stone-900">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-ui text-xs uppercase tracking-widest text-[#B48327] font-semibold mb-1">
                Screens 11–12 · Sovereign Statute Index
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-950">
                Constitution of Pakistan 1973 & Codified Acts
              </h2>
            </div>
            <Link
              href="/laws"
              className="font-ui text-xs font-semibold text-[#064E3B] hover:underline flex items-center gap-1"
            >
              <span>Browse Full Statute Index ({laws.length} Codified Statutes)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {laws.slice(0, 4).map((law) => (
              <Link
                key={law.id}
                href={`/laws/${law.id}`}
                className="bg-white border border-stone-300 p-6 hover:border-[#064E3B] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="font-ui text-xs text-stone-500 mb-2">
                    <span className="font-semibold text-[#064E3B]">
                      {law.category}
                    </span>
                    <span className="mx-2">·</span>
                    <span className="font-mono-code">
                      {law.section_number || "Codified Statute"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-950 mb-1">
                    {law.title}
                  </h3>
                  {law.title_urdu && (
                    <p className="font-urdu text-base text-stone-600 mb-3" dir="rtl">
                      {law.title_urdu}
                    </p>
                  )}
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {law.description || law.content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between font-ui text-xs">
                  <span className="text-stone-500">
                    Includes Marginal Commentary & Urdu Text
                  </span>
                  <span className="font-semibold text-[#064E3B]">
                    Open Statute Reader →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ====================================================================
            INTERACTIVE LEGAL SERVICES HUB (SCREENS 08–10, 26, 31–39, 46–48)
            ==================================================================== */}
        <section id="templates-qa" className="pt-8 border-t-2 border-stone-900">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="font-ui text-xs uppercase tracking-widest text-[#064E3B] font-semibold mb-1">
                Interactive Legal Ecosystem · Modules 1, 3 & 4
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-950">
                Templates, Public Q&A Forum, Pro-Bono Clinic & CRM Workspace
              </h2>
            </div>

            {/* Interactive Segmented Tab Bar */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/80 font-ui">
              <button
                type="button"
                onClick={() => setActiveHubTab("templates")}
                className={`px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeHubTab === "templates"
                    ? "bg-white text-stone-950 shadow-xs"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                08. Legal Templates ({templates.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveHubTab("qa")}
                className={`px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeHubTab === "qa"
                    ? "bg-white text-stone-950 shadow-xs"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                10. Public Q&A Forum ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveHubTab("probono")}
                className={`px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeHubTab === "probono"
                    ? "bg-white text-stone-950 shadow-xs"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                33. Pro-Bono Legal Aid
              </button>
              <button
                type="button"
                onClick={() => setActiveHubTab("workspace")}
                className={`px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeHubTab === "workspace"
                    ? "bg-white text-stone-950 shadow-xs"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                26 / 35. Client & Advocate CRM
              </button>
            </div>
          </div>

          {/* TAB 1: SCREEN 08 & 09 TEMPLATE STOREFRONT */}
          {activeHubTab === "templates" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-white border border-stone-300 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between font-ui text-xs text-stone-500 mb-2">
                      <span>
                        {tpl.category} · {tpl.pages} Pages · Bilingual EN/UR
                      </span>
                      <span className="font-mono-code font-bold text-[#064E3B] text-sm">
                        PKR {tpl.price.toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-950 mb-1">
                      {tpl.title}
                    </h3>
                    {tpl.title_urdu && (
                      <p className="font-urdu text-base text-stone-600 mb-3" dir="rtl">
                        {tpl.title_urdu}
                      </p>
                    )}
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {tpl.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex items-center justify-between font-ui">
                    <span className="text-xs text-stone-500">
                      e-Stamp Ready Instrument
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tpl)}
                      className="px-4 py-2 bg-stone-900 hover:bg-[#064E3B] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Inspect Draft Preview (Screen 09)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SCREEN 10, 31, 32 PUBLIC Q&A FORUM */}
          {activeHubTab === "qa" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white border border-stone-300 p-6 space-y-4"
                  >
                    <div className="font-ui text-xs text-stone-500">
                      <span className="font-semibold text-[#064E3B]">
                        {q.category}
                      </span>
                      <span className="mx-1.5">·</span>
                      <span>{q.city}</span>
                      <span className="mx-1.5">·</span>
                      <span>Posted by {q.author_name}</span>
                    </div>

                    <h3 className="text-base font-bold text-stone-950 leading-snug">
                      {q.title}
                    </h3>

                    {q.verified_reply && (
                      <div className="bg-[#FBF9F5] border border-stone-200 p-4 space-y-2">
                        <div className="font-ui text-xs font-semibold text-[#064E3B]">
                          Verified Counsel Opinion · {q.verified_reply.lawyer_name} (
                          {q.verified_reply.court})
                        </div>
                        <p className="text-xs text-stone-700 leading-relaxed">
                          {q.verified_reply.reply}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Screen 31 & 32: Post a Question Form */}
              <div className="lg:col-span-5">
                <form
                  onSubmit={handlePostQuestion}
                  className="bg-white border border-stone-300 p-6 space-y-4 font-ui"
                >
                  <div className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold">
                    Screen 31 · Ask a Verified High Court Advocate
                  </div>
                  <h3 className="text-lg font-bold font-legal text-stone-950">
                    Submit a Public Legal Inquiry
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Legal Category
                      </label>
                      <select
                        value={questionCategory}
                        onChange={(e) => setQuestionCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 text-xs bg-white"
                      >
                        {qaCats.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        City / Jurisdiction
                      </label>
                      <input
                        type="text"
                        value={questionCity}
                        onChange={(e) => setQuestionCity(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Legal Question
                    </label>
                    <textarea
                      required
                      value={questionTitle}
                      onChange={(e) => setQuestionTitle(e.target.value)}
                      placeholder="Describe the facts of your legal issue without sharing CNIC numbers or private addresses..."
                      className="w-full p-3 border border-stone-300 text-xs h-28"
                    />
                  </div>

                  {/* Screen 32: Keep Anonymous Warning Toggle */}
                  <div className="p-3 bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-stone-800 flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={keepAnonymous}
                          onChange={(e) => {
                            setKeepAnonymous(e.target.checked);
                            if (!e.target.checked) setShowAnonWarning(true);
                          }}
                        />
                        <span>Keep My Identity Anonymous (Screen 32)</span>
                      </label>
                    </div>
                    {showAnonWarning && !keepAnonymous && (
                      <div className="text-[11px] text-amber-900 bg-amber-50 p-2 border border-amber-200">
                        Screen 32 Privacy Notice: Unchecking anonymity will display your profile name publicly alongside this legal inquiry.
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-semibold cursor-pointer"
                  >
                    Publish Question to Q&A Feed
                  </button>
                  {questionSuccess && (
                    <p className="text-xs text-[#064E3B] font-semibold">
                      {questionSuccess}
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: SCREEN 33 & 34 PRO-BONO APPLICATION FORM */}
          {activeHubTab === "probono" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-ui">
              <div className="lg:col-span-7 bg-white border border-stone-300 p-6 sm:p-8">
                <div className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold mb-1">
                  Screen 33 · Constitutional Access to Justice
                </div>
                <h3 className="text-xl font-bold font-legal text-stone-950 mb-2">
                  Pro-Bono Legal Representation Application
                </h3>
                <p className="text-xs text-stone-600 mb-6">
                  Verified Supreme Court and High Court advocates on our Pro-Bono roster provide free representation for deserving women, widows, and low-income citizens.
                </p>

                {probonoSubmitted ? (
                  <div className="p-6 bg-emerald-950/5 border border-[#064E3B] space-y-2">
                    <div className="text-sm font-bold text-[#064E3B]">
                      Pro-Bono Application Logged & Assigned
                    </div>
                    <p className="text-xs text-stone-600">
                      Your application has been routed to Adv. Sara Mansoor & Adv. Ayesha Siddiqui on the Pro-Bono High Court Panel.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleProBonoSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Applicant Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={probonoName}
                          onChange={(e) => setProbonoName(e.target.value)}
                          placeholder="Full Name as on CNIC"
                          className="w-full px-3 py-2 border border-stone-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Monthly Household Income (PKR)
                        </label>
                        <input
                          type="number"
                          required
                          value={probonoIncome}
                          onChange={(e) => setProbonoIncome(e.target.value)}
                          placeholder="e.g., 35000"
                          className="w-full px-3 py-2 border border-stone-300 text-xs font-mono-code"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Matter Category
                        </label>
                        <select
                          value={probonoCategory}
                          onChange={(e) => setProbonoCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 text-xs bg-white"
                        >
                          {probonoCats.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Supporting Income Proof (Screen 34)
                        </label>
                        <select
                          value={probonoCertType}
                          onChange={(e) => setProbonoCertType(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 text-xs bg-white"
                        >
                          <option>Union Council Income Certificate</option>
                          <option>BISP / Zakat Mustahiq Declaration</option>
                          <option>Employer Salary Slip (&lt; PKR 50,000)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setShowIncomeGuidelines(!showIncomeGuidelines)
                        }
                        className="text-xs font-semibold text-[#064E3B] underline cursor-pointer"
                      >
                        View Screen 34 Income Certificate Guidelines
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                      >
                        Submit Pro-Bono Application
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Screen 34: Income Certificate Upload Guidelines */}
              <div className="lg:col-span-5 bg-white border border-stone-300 p-6 space-y-4">
                <div className="text-xs uppercase tracking-widest text-[#B48327] font-semibold">
                  Screen 34 · Eligibility & Document Guidelines
                </div>
                <h4 className="text-base font-bold font-legal text-stone-950">
                  Acceptable Proof for Free Legal Aid
                </h4>
                <ul className="space-y-3 text-xs text-stone-600 leading-relaxed">
                  {probonoGuidelines.map((g, idx) => (
                    <li
                      key={g.id}
                      className="pb-2 border-b border-stone-200 last:border-b-0"
                    >
                      <strong className="text-stone-900 block">
                        {idx + 1}. {g.title}:
                      </strong>
                      {g.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: SCREENS 26 & 35–48 CLIENT & ADVOCATE CRM WORKSPACE */}
          {activeHubTab === "workspace" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-ui">
              {/* Left: Screen 26 Client Appointments & Escrow History */}
              <div className="lg:col-span-6 bg-white border border-stone-300 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold block">
                      Screen 26 · Client Case & Escrow Ledger
                    </span>
                    <h3 className="text-base font-bold font-legal text-stone-950">
                      My Scheduled Consultations
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-4 border border-stone-200 bg-[#FBF9F5] space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-950">
                          {appt.lawyer_name} ({appt.court})
                        </span>
                        <span className="font-mono-code font-semibold text-[#064E3B]">
                          {appt.status} · PKR {appt.fee?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">{appt.case_summary}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs text-stone-500">
                        <span className="font-mono-code">
                          {appt.date} · {appt.time_slot}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setBookingLawyer(
                              lawyers.find((l) => l.id === appt.lawyer_id) ||
                                lawyers[0]
                            )
                          }
                          className="text-[#064E3B] font-semibold hover:underline cursor-pointer"
                        >
                          Join Video Room (Screen 55) →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Screen 35–47 Advocate CRM & Escrow Wallet */}
              <div className="lg:col-span-6 bg-white border border-stone-300 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#B48327] font-semibold block">
                      Screens 35–47 · Verified Advocate CRM
                    </span>
                    <h3 className="text-base font-bold font-legal text-stone-950">
                      Advocate Chamber Metrics & Escrow Wallet
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAiModalMode("researcher");
                      setAiModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                  >
                    Open AI Researcher Pro (40)
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-[#FBF9F5] border border-stone-200">
                    <div className="text-[11px] text-stone-500">Cleared Escrow</div>
                    <div className="font-mono-code text-base font-bold text-[#064E3B] mt-1">
                      PKR 145,000
                    </div>
                  </div>
                  <div className="p-3 bg-[#FBF9F5] border border-stone-200">
                    <div className="text-[11px] text-stone-500">Active Leads (36)</div>
                    <div className="font-mono-code text-base font-bold text-stone-950 mt-1">
                      6 Cases
                    </div>
                  </div>
                  <div className="p-3 bg-[#FBF9F5] border border-stone-200">
                    <div className="text-[11px] text-stone-500">Q&A Reputation</div>
                    <div className="font-mono-code text-base font-bold text-[#B48327] mt-1">
                      Top 1% ASC
                    </div>
                  </div>
                </div>

                {/* Screen 36, 39 & 48: Dynamic CRM Leads, Milestones & Co-Counsel Network */}
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <div className="text-xs font-bold text-stone-900">
                    Screens 36 & 39 · Active Leads & Cause-List Tracker ({crmLeads.length} Leads · {caseMilestones.length} Hearings)
                  </div>
                  {crmLeads.slice(0, 2).map((lead) => (
                    <div key={lead.id} className="p-2.5 bg-[#FBF9F5] border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-stone-900">{lead.client_name}</span>
                        <span className="text-stone-500"> · {lead.matter}</span>
                      </div>
                      <span className="font-mono-code text-[#064E3B] font-semibold">
                        {lead.status}
                      </span>
                    </div>
                  ))}
                  {caseMilestones.slice(0, 2).map((ms) => (
                    <div key={ms.id} className="p-2.5 bg-white border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono-code font-bold text-[#B48327]">{ms.case_no}</span>
                        <span className="text-stone-600"> · {ms.stage}</span>
                      </div>
                      <span className="font-mono-code text-stone-500">{ms.hearing_date}</span>
                    </div>
                  ))}
                </div>

                {/* Screen 46 & 47: Withdraw Funds via IBAN */}
                <div className="p-4 bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800">
                      Screen 46–47 · Withdraw Cleared Escrow via RAAST / IBAN
                    </span>
                    <button
                      type="button"
                      onClick={() => setIbanModalOpen(!ibanModalOpen)}
                      className="px-3 py-1 bg-stone-900 text-white text-xs font-semibold cursor-pointer"
                    >
                      Withdraw to IBAN
                    </button>
                  </div>

                  {ibanModalOpen && (
                    <div className="pt-2 border-t border-stone-200 space-y-2">
                      <input
                        type="text"
                        value={ibanInput}
                        onChange={(e) => setIbanInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 text-xs font-mono-code"
                      />
                      <button
                        type="button"
                        onClick={() => setWithdrawDone(true)}
                        className="w-full py-2 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                      >
                        Transfer PKR 145,000 via SBP RAAST
                      </button>
                      {withdrawDone && (
                        <p className="text-xs text-[#064E3B] font-semibold">
                          RAAST Settlement Initiated to {ibanInput}.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-stone-300 bg-white mt-16 py-10 px-6 font-ui text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-legal font-bold text-stone-900 text-sm">
              The Daily Legal Brief
            </span>
            <span className="mx-2">·</span>
            <span>Pakistan Legal Journal, Statute Archive & Verified Advocate Network</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-stone-900">
              English Edition
            </Link>
            <Link href="/urdu" className="hover:text-stone-900 font-urdu">
              اردو ایڈیشن
            </Link>
            <Link href="/laws" className="hover:text-stone-900">
              Statutes
            </Link>
            <Link href="/lawyers" className="hover:text-stone-900">
              Advocates
            </Link>
            <Link href="/admin" className="hover:text-stone-900">
              Admin Supply CMS
            </Link>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SmartAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(s) => setUserSession(s)}
        triggerReason={authTriggerReason}
        lang="en"
      />

      <LegalAIWorkspaceModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        lang="en"
        initialMode={aiModalMode}
      />

      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        userSession={userSession}
        onUnlock={() => {
          setPreviewTemplate(null);
          setAuthTriggerReason(
            "Screen 13 • Verify your Client or Advocate account to unlock & download this legal template."
          );
          setAuthModalOpen(true);
        }}
        lang="en"
      />

      <BookingEscrowModal
        lawyer={bookingLawyer}
        onClose={() => setBookingLawyer(null)}
        userSession={userSession}
        onRequireAuth={() => {
          setBookingLawyer(null);
          setAuthTriggerReason(
            "Screen 13 • Please sign in to lock an Escrow Consultation slot."
          );
          setAuthModalOpen(true);
        }}
        lang="en"
      />
    </div>
  );
}