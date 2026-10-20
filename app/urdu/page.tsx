"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../Header";
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
  ArrowLeft,
  ShieldCheck,
  Lock,
  Video,
} from "lucide-react";
import {
  SmartAuthModal,
  LegalAIWorkspaceModal,
  TemplatePreviewModal,
  BookingEscrowModal,
  UserSession,
} from "../components/PlatformModals";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function UrduHomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [laws, setLaws] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(INITIAL_SITE_SETTINGS);
  const [articleCats, setArticleCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("تمام");
  const [activeHubTab, setActiveHubTab] = useState<"templates" | "qa" | "probono">(
    "templates"
  );

  // Modals state
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState<string | undefined>();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalMode, setAiModalMode] = useState<"assistant" | "researcher">("assistant");
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [bookingLawyer, setBookingLawyer] = useState<any | null>(null);

  // Post a Question state (Screen 31-32)
  const [questionTitle, setQuestionTitle] = useState("");
  const [keepAnonymous, setKeepAnonymous] = useState(true);
  const [questionSuccess, setQuestionSuccess] = useState("");

  // Pro-Bono state (Screen 33-34)
  const [probonoName, setProbonoName] = useState("");
  const [probonoIncome, setProbonoIncome] = useState("");
  const [probonoSubmitted, setProbonoSubmitted] = useState(false);

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
    setSiteSettings(getSiteSettings());
    setArticleCats(getCategoriesByScope("article"));
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

  const urduCategories = [
    "تمام",
    ...articleCats.map((c) => c.name_urdu || c.name),
  ];

  const filteredArticles =
    selectedCategory === "تمام"
      ? articles
      : articles.filter(
          (a) =>
            (a.category_urdu || "").includes(selectedCategory) ||
            (a.category || "").toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const leadArticle = filteredArticles[0] || articles[0];
  const secondaryArticles = filteredArticles.slice(1);

  const handlePostUrduQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSession) {
      setAuthTriggerReason(
        "اسکرین 13 • عوامی قانونی فورم میں سوال پوسٹ کرنے کے لیے اپنے اکاؤنٹ کی تصدیق کریں۔"
      );
      setAuthModalOpen(true);
      return;
    }
    if (!questionTitle.trim()) return;
    const newQ = {
      id: Date.now(),
      title: questionTitle,
      title_urdu: questionTitle,
      category: "قانونی استفسار",
      category_urdu: "قانونی استفسار",
      city: "لاہور / اسلام آباد",
      is_anonymous: keepAnonymous,
      author_name: keepAnonymous ? "گمنام شہری" : userSession.name,
      created_at: new Date().toISOString(),
      answer_count: 1,
      verified_reply: {
        lawyer_name: "Adv. Sara Mansoor, ASC",
        lawyer_name_urdu: "ایڈووکیٹ سارہ منصور (سپریم کورٹ)",
        court: "Supreme Court of Pakistan",
        reply: "Your query has been logged for High Court legal review.",
        reply_urdu:
          "آپ کا قانونی سوال ہائی کورٹ پینل کو موصول ہو گیا ہے۔ تمام اصل دستاویزات اور نادرا ریکارڈ محفوظ رکھیں۔",
      },
    };
    const updated = [newQ, ...questions];
    saveTableData("questions", updated);
    setQuestions(updated);
    setQuestionTitle("");
    setQuestionSuccess("آپ کا سوال کامیابی سے شائع کر دیا گیا ہے۔");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#FBF9F5] text-[#111111] font-urdu">
      <Header
        lang="ur"
        onOpenAI={(mode = "assistant") => {
          setAiModalMode(mode);
          setAiModalOpen(true);
        }}
        onOpenAuth={(reason) => {
          setAuthTriggerReason(reason);
          setAuthModalOpen(true);
        }}
      />

      {/* Urdu Masthead */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6 border-b-2 border-stone-900">
        <div className="flex flex-wrap items-center justify-between gap-4 font-ui text-xs text-stone-500 pb-4 border-b border-stone-200">
          <div>
            <span>{siteSettings.volume_issue_urdu}</span>
            <span className="mx-2">·</span>
            <span>{siteSettings.cities_urdu}</span>
          </div>
          <div className="font-mono-code" dir="ltr">
            <span>{siteSettings.statute_ticker}</span>
          </div>
        </div>

        <div className="py-8 text-center max-w-4xl mx-auto">
          <p className="font-ui text-xs text-[#064E3B] font-semibold mb-3">
            پاکستان کا مستند قانونی جریدہ، آئینی لائبریری اور تصدیق شدہ وکلاء کا نیٹ ورک
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold text-stone-950 mb-4 leading-normal">
            {siteSettings.masthead_title_urdu}
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-loose">
            {siteSettings.masthead_subtitle_urdu}
          </p>
        </div>

        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 font-ui">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {urduCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#064E3B] text-white"
                    : "text-stone-700 hover:bg-stone-200/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setAiModalMode("researcher");
              setAiModalOpen(true);
            }}
            className="px-4 py-1.5 text-xs font-semibold border border-[#B48327] bg-amber-50/70 text-stone-900 hover:bg-[#B48327] hover:text-white transition-colors cursor-pointer"
          >
            AI ریسرچر پرو اور پٹیشن اسٹوڈیو (Screen 40)
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-16">
        {/* TIER 1 & TIER 2 URDU EDITORIAL BRIEFINGS */}
        {loading ? (
          <div className="py-16 text-center text-stone-500">
            قانونی مضامین اور ریکارڈ لوڈ ہو رہا ہے...
          </div>
        ) : (
          <section className="space-y-10">
            {leadArticle && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-10 border-b border-stone-300">
                <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="font-ui text-xs text-[#064E3B] font-semibold">
                      <span>مرکزی قانونی رپورٹ</span>
                      <span className="mx-2 text-stone-400">·</span>
                      <span>{leadArticle.category_urdu || leadArticle.category || "آئینی قانون"}</span>
                      <span className="mx-2 text-stone-400">·</span>
                      <span className="text-stone-500">
                        {leadArticle.read_time_urdu || "6 منٹ کا مطالعہ"}
                      </span>
                    </div>

                    <Link href={`/urdu/article/${leadArticle.id}`}>
                      <h2 className="text-3xl sm:text-4xl font-bold text-stone-950 leading-loose hover:text-[#064E3B] transition-colors">
                        {leadArticle.title_urdu || leadArticle.title}
                      </h2>
                    </Link>

                    <p className="text-stone-700 text-lg leading-loose">
                      {leadArticle.subtitle_urdu ||
                        (leadArticle.content_urdu
                          ? leadArticle.content_urdu.slice(0, 220) + "…"
                          : leadArticle.content)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 font-ui text-xs text-stone-600">
                    <div>
                      <span className="font-semibold text-stone-900">
                        {leadArticle.author_urdu || leadArticle.author || "ادارتی بورڈ"}
                      </span>
                    </div>
                    <Link
                      href={`/urdu/article/${leadArticle.id}`}
                      className="font-semibold text-[#064E3B] hover:underline flex items-center gap-1.5"
                    >
                      <span>مکمل مضمون پڑھیں (Screen 04)</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <Link
                    href={`/urdu/article/${leadArticle.id}`}
                    className="h-full min-h-[280px] bg-[#064E3B] text-white p-8 border border-stone-900 flex flex-col justify-between group"
                  >
                    <div
                      className="flex items-center justify-between text-xs font-ui text-[#D4AF37] border-b border-white/15 pb-3"
                      dir="ltr"
                    >
                      <span className="font-mono-code">PLD 2024 SC 112 · ART. 23</span>
                      <span>SUPREME COURT OF PAKISTAN</span>
                    </div>

                    <div className="my-6 space-y-4">
                      <Scale className="w-10 h-10 text-[#D4AF37]" />
                      <div className="text-xl sm:text-2xl font-bold leading-loose text-white group-hover:underline">
                        ”مورث کی وفات کے فوراً بعد وراثت تمام شرعی وارثان کو منتقل ہو جاتی ہے؛ کسی خاتون کو دباؤ کے تحت وراثت سے محروم نہیں کیا جا سکتا۔“
                      </div>
                    </div>

                    <div className="font-ui text-xs text-emerald-200 flex items-center justify-between pt-3 border-t border-white/15">
                      <span>نادرا 15 روزہ جانشینی سرٹیفکیٹ گائیڈ</span>
                      <span className="text-[#D4AF37] font-semibold">
                        تفصیل دیکھیں ←
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {secondaryArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {secondaryArticles.map((art) => (
                  <article
                    key={art.id}
                    className="flex flex-col justify-between border-b md:border-b-0 md:border-l last:border-l-0 border-stone-200 pb-6 md:pb-0 md:pl-6 last:pl-0"
                  >
                    <div className="space-y-3">
                      <div className="font-ui text-xs text-stone-500">
                        <span className="text-[#064E3B] font-semibold">
                          {art.category_urdu || art.category}
                        </span>
                        <span className="mx-1.5">·</span>
                        <span>{art.read_time_urdu || "5 منٹ کا مطالعہ"}</span>
                      </div>
                      <Link href={`/urdu/article/${art.id}`}>
                        <h3 className="text-xl font-bold text-stone-950 leading-loose hover:text-[#064E3B]">
                          {art.title_urdu || art.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-stone-600 leading-loose line-clamp-3">
                        {art.subtitle_urdu || art.content_urdu || art.content}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between font-ui text-xs text-stone-500">
                      <span>{art.author_urdu || art.author}</span>
                      <Link
                        href={`/urdu/article/${art.id}`}
                        className="font-semibold text-[#064E3B]"
                      >
                        مکمل تحریر ←
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TOP ADVOCATES IN URDU (SCREEN 06 & ESCROW BOOKING) */}
        <section className="pt-8 border-t-2 border-stone-900">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-ui text-xs text-[#064E3B] font-semibold mb-1">
                اسکرین 06 · پاکستان بار کونسل تصدیق شدہ وکلاء
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-950 leading-normal">
                ممتاز ہائی کورٹ اور سپریم کورٹ ایڈووکیٹس
              </h2>
            </div>
            <Link
              href="/urdu/lawyers"
              className="font-ui text-xs font-semibold text-[#064E3B] hover:underline flex items-center gap-1"
            >
              <span>مکمل وکلاء ڈائریکٹری اور ایڈوانس فلٹرز (Screen 07)</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lawyers.slice(0, 3).map((lawyer) => (
              <div
                key={lawyer.id}
                className="bg-white border border-stone-300 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#064E3B] text-[#D4AF37] font-legal font-bold text-lg flex items-center justify-center border border-[#B48327] shrink-0">
                      {lawyer.name ? lawyer.name.replace("Adv. ", "").charAt(0) : "A"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-950">
                        {lawyer.name_urdu || lawyer.name}
                      </h3>
                      <div className="font-ui text-xs text-stone-500">
                        {lawyer.court_urdu || lawyer.court} ·{" "}
                        {lawyer.city_urdu || lawyer.location}
                      </div>
                    </div>
                  </div>

                  <div className="font-ui text-xs text-[#064E3B] font-semibold mb-2">
                    {lawyer.specialty_urdu || lawyer.specialty}
                  </div>
                  <p className="text-sm text-stone-600 leading-loose mb-4">
                    {lawyer.intro_urdu || lawyer.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200 font-ui space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">
                      مشاورتی فیس (ایسکرو محفوظ):
                    </span>
                    <span className="font-mono-code font-bold text-[#064E3B]" dir="ltr">
                      PKR {(lawyer.fee || 3500).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/lawyers/${lawyer.id}`}
                      className="flex-1 py-2 px-3 border border-stone-300 text-center text-xs font-semibold text-stone-800"
                    >
                      پروفائل (Screen 21)
                    </Link>
                    <button
                      type="button"
                      onClick={() => setBookingLawyer(lawyer)}
                      className="flex-1 py-2 px-3 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                    >
                      وقت بک کریں (Screen 22)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LAWS LIBRARY IN URDU (SCREENS 11–12) */}
        <section className="pt-8 border-t-2 border-stone-900">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-ui text-xs text-[#B48327] font-semibold mb-1">
                اسکرین 11–12 · ڈیجیٹل قانونی لائبریری
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-950 leading-normal">
                آئینِ پاکستان 1973 اور اہم قوانین
              </h2>
            </div>
            <Link
              href="/urdu/laws"
              className="font-ui text-xs font-semibold text-[#064E3B] hover:underline flex items-center gap-1"
            >
              <span>تمام قوانین اور دفعات دیکھیں</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {laws.slice(0, 4).map((law) => (
              <Link
                key={law.id}
                href={`/urdu/laws/${law.id}`}
                className="bg-white border border-stone-300 p-6 hover:border-[#064E3B] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="font-ui text-xs text-stone-500 mb-2">
                    <span className="text-[#064E3B] font-semibold">
                      {law.category}
                    </span>
                    <span className="mx-2">·</span>
                    <span>{law.section_urdu || law.section_number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-950 mb-2 leading-loose">
                    {law.title_urdu || law.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-loose line-clamp-2">
                    {law.content_urdu || law.content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between font-ui text-xs">
                  <span className="text-stone-500">تشریح اور عدالتی نظائر کے ساتھ</span>
                  <span className="font-semibold text-[#064E3B]">
                    مکمل متن پڑھیں ←
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* INTERACTIVE URDU TEMPLATES, Q&A & PRO-BONO HUB */}
        <section id="templates-qa" className="pt-8 border-t-2 border-stone-900">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-950 leading-normal">
                قانونی مسودات، عوامی سوال و جواب اور مفت قانونی امداد
              </h2>
            </div>

            <div className="flex flex-wrap gap-1 p-1 bg-stone-200/80 font-ui">
              <button
                type="button"
                onClick={() => setActiveHubTab("templates")}
                className={`px-4 py-2 text-xs font-semibold cursor-pointer ${
                  activeHubTab === "templates"
                    ? "bg-white text-stone-950"
                    : "text-stone-600"
                }`}
              >
                08. قانونی مسودات ({templates.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveHubTab("qa")}
                className={`px-4 py-2 text-xs font-semibold cursor-pointer ${
                  activeHubTab === "qa"
                    ? "bg-white text-stone-950"
                    : "text-stone-600"
                }`}
              >
                10. عوامی سوال و جواب ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveHubTab("probono")}
                className={`px-4 py-2 text-xs font-semibold cursor-pointer ${
                  activeHubTab === "probono"
                    ? "bg-white text-stone-950"
                    : "text-stone-600"
                }`}
              >
                33. مفت قانونی امداد (Pro-Bono)
              </button>
            </div>
          </div>

          {activeHubTab === "templates" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-white border border-stone-300 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between font-ui text-xs text-stone-500 mb-2">
                      <span>{tpl.category_urdu || tpl.category}</span>
                      <span className="font-mono-code font-bold text-[#064E3B]" dir="ltr">
                        PKR {tpl.price}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-950 mb-2 leading-loose">
                      {tpl.title_urdu || tpl.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-loose mb-4">
                      {tpl.summary_urdu || tpl.summary}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-stone-200 flex items-center justify-between font-ui">
                    <span className="text-xs text-stone-500">
                      اردو اور انگریزی مسودہ
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tpl)}
                      className="px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                    >
                      پری ویو اور ڈاؤن لوڈ (Screen 09)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeHubTab === "qa" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white border border-stone-300 p-6 space-y-3"
                  >
                    <div className="font-ui text-xs text-stone-500">
                      <span className="text-[#064E3B] font-semibold">
                        {q.category_urdu || q.category}
                      </span>
                      <span className="mx-2">·</span>
                      <span>{q.city}</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-950 leading-loose">
                      {q.title_urdu || q.title}
                    </h3>
                    {q.verified_reply && (
                      <div className="bg-[#FBF9F5] border border-stone-200 p-4 space-y-2">
                        <div className="font-ui text-xs font-semibold text-[#064E3B]">
                          تصدیق شدہ قانونی رائے ·{" "}
                          {q.verified_reply.lawyer_name_urdu ||
                            q.verified_reply.lawyer_name}
                        </div>
                        <p className="text-sm text-stone-700 leading-loose">
                          {q.verified_reply.reply_urdu || q.verified_reply.reply}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5">
                <form
                  onSubmit={handlePostUrduQuestion}
                  className="bg-white border border-stone-300 p-6 space-y-4 font-ui"
                >
                  <div className="text-xs text-[#064E3B] font-semibold">
                    اسکرین 31 · اپنا قانونی سوال پوسٹ کریں
                  </div>
                  <textarea
                    required
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    placeholder="اپنا قانونی مسئلہ یہاں درج کریں..."
                    className="w-full p-3 border border-stone-300 text-sm h-28 font-urdu"
                  />
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keepAnonymous}
                      onChange={(e) => setKeepAnonymous(e.target.checked)}
                    />
                    <span>میرا نام خفیہ رکھیں (Screen 32 Anonymous Mode)</span>
                  </label>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                  >
                    سوال شائع کریں
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

          {activeHubTab === "probono" && (
            <div className="bg-white border border-stone-300 p-6 sm:p-8 max-w-3xl font-ui space-y-4">
              <div className="text-xs text-[#064E3B] font-semibold">
                اسکرین 33–34 · مستحق شہریوں اور خواتین کے لیے مفت قانونی معاونت
              </div>
              <h3 className="text-xl font-bold font-urdu text-stone-950">
                پرو بونو (Pro-Bono) مفت وکالت کی درخواست
              </h3>
              {probonoSubmitted ? (
                <div className="p-4 bg-emerald-950/5 border border-[#064E3B] text-xs text-[#064E3B] font-semibold">
                  آپ کی درخواست ہائی کورٹ پرو بونو پینل کو تفویض کر دی گئی ہے۔
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setProbonoSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={probonoName}
                      onChange={(e) => setProbonoName(e.target.value)}
                      placeholder="درخواست گزار کا مکمل نام"
                      className="px-3 py-2 border border-stone-300 text-xs"
                    />
                    <input
                      type="number"
                      required
                      value={probonoIncome}
                      onChange={(e) => setProbonoIncome(e.target.value)}
                      placeholder="ماہانہ آمدن (PKR)"
                      className="px-3 py-2 border border-stone-300 text-xs font-mono-code"
                    />
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 text-xs text-stone-600">
                    اسکرین 34 رہنمائی: یونین کونسل کا آمدن سرٹیفکیٹ، تنخواہ کی سلپ یا زکوٰۃ فارم منسلک کیا جا سکتا ہے۔
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                  >
                    درخواست جمع کروائیں
                  </button>
                </form>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      <SmartAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(s) => setUserSession(s)}
        triggerReason={authTriggerReason}
        lang="ur"
      />

      <LegalAIWorkspaceModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        lang="ur"
        initialMode={aiModalMode}
      />

      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        userSession={userSession}
        onUnlock={() => {
          setPreviewTemplate(null);
          setAuthTriggerReason(
            "اسکرین 13 • قانونی مسودہ ڈاؤن لوڈ کرنے کے لیے اکاؤنٹ کی تصدیق کریں۔"
          );
          setAuthModalOpen(true);
        }}
        lang="ur"
      />

      <BookingEscrowModal
        lawyer={bookingLawyer}
        onClose={() => setBookingLawyer(null)}
        userSession={userSession}
        onRequireAuth={() => {
          setBookingLawyer(null);
          setAuthTriggerReason(
            "اسکرین 13 • ایڈووکیٹ اپائنٹمنٹ بک کرنے کے لیے لاگ ان کریں۔"
          );
          setAuthModalOpen(true);
        }}
        lang="ur"
      />
    </div>
  );
}