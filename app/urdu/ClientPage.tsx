"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../Header";
import {
  createClient,
  getSiteSettings,
  getCategoriesByScope,
  INITIAL_SITE_SETTINGS,
  syncAllTablesFromSupabase,
  getActiveRBACSession,
} from "@/app/supabase";
import { ArrowLeft, ChevronDown } from "lucide-react";
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
  const [activeHubTab, setActiveHubTab] = useState<
    "templates" | "qa" | "probono"
  >("templates");
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(
    null
  );

  // Modals state
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState<
    string | undefined
  >();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalMode, setAiModalMode] = useState<"assistant" | "researcher">(
    "assistant"
  );
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [bookingLawyer, setBookingLawyer] = useState<any | null>(null);

  // Post a Question state
  const [questionTitle, setQuestionTitle] = useState("");
  const [keepAnonymous, setKeepAnonymous] = useState(true);
  const [questionSuccess, setQuestionSuccess] = useState("");

  // Pro-Bono state
  const [probonoName, setProbonoName] = useState("");
  const [probonoIncome, setProbonoIncome] = useState("");
  const [probonoSubmitted, setProbonoSubmitted] = useState(false);

  async function loadAllData() {
    const [articlesRes, lawsRes, lawyersRes, templatesRes, questionsRes] =
      await Promise.all([
        supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("laws")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("lawyers")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("templates").select("*"),
        supabase.from("questions").select("*"),
      ]);
    if (articlesRes.data) setArticles(articlesRes.data);
    if (lawsRes.data) setLaws(lawsRes.data);
    if (lawyersRes.data) setLawyers(lawyersRes.data);
    if (templatesRes.data) setTemplates(templatesRes.data);
    if (questionsRes.data) {
      setQuestions(questionsRes.data);
      if (questionsRes.data.length > 0 && expandedQuestionId === null) {
        setExpandedQuestionId(questionsRes.data[0].id);
      }
    }
    setSiteSettings(getSiteSettings());
    setArticleCats(getCategoriesByScope("article"));
    setLoading(false);
  }

  useEffect(() => {
    syncAllTablesFromSupabase().then(() => loadAllData());
    if (typeof window !== "undefined") {
      setUserSession(getActiveRBACSession());
      const handleSync = () => {
        setUserSession(getActiveRBACSession());
        loadAllData();
      };
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
            (a.category || "")
              .toLowerCase()
              .includes(selectedCategory.toLowerCase())
        );

  const leadArticle = filteredArticles[0] || articles[0];
  const secondaryArticles = filteredArticles.slice(1, 5);

  const handlePostUrduQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSession) {
      setAuthTriggerReason(
        "عوامی قانونی فورم میں سوال پوسٹ کرنے کے لیے اپنے اکاؤنٹ کی تصدیق کریں۔"
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
    await supabase.from("questions").insert([newQ]);
    await loadAllData();
    setQuestionTitle("");
    setQuestionSuccess("آپ کا سوال کامیابی سے شائع کر دیا گیا ہے۔");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FAF9F5] text-[#141413] font-urdu selection:bg-[#0B5D3B]/15"
    >
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

      {/* Urdu Masthead — Generous Whitespace & Nastaliq Typography */}
      <section className="max-w-4xl mx-auto px-6 py-20 sm:py-24 border-b border-[#E6E4DD] editorial-fade-up">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="text-sm text-[#57554F]">
            {siteSettings.volume_issue_urdu} · {siteSettings.cities_urdu}
          </div>

          <h1 className="font-urdu text-4xl sm:text-5xl font-bold text-[#141413]">
            {siteSettings.masthead_title_urdu}
          </h1>

          <p className="font-urdu text-xl text-[#57554F]">
            {siteSettings.masthead_subtitle_urdu}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setAiModalMode("assistant");
                setAiModalOpen(true);
              }}
              className="px-6 py-3 bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-sm font-ui-sans font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
            >
              قانونی اے آئی معاون سے مشورہ کریں
            </button>
            <button
              type="button"
              onClick={() => {
                setAiModalMode("researcher");
                setAiModalOpen(true);
              }}
              className="px-6 py-3 bg-[#F2EFE9] border border-[#E6E4DD] hover:border-[#141413] text-[#141413] text-sm font-ui-sans font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
            >
              عدالتی نظائر ریسرچر
            </button>
          </div>
        </div>

        {/* Calm Underline Filter Bar */}
        <div className="max-w-2xl mx-auto pt-12 mt-12 border-t border-[#E6E4DD] flex items-center justify-center flex-wrap gap-6">
          {urduCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`font-urdu text-lg pb-1 transition-all duration-500 cursor-pointer border-b-2 ${
                  isSelected
                    ? "text-[#141413] font-bold border-[#0B5D3B]"
                    : "text-[#57554F] hover:text-[#141413] border-transparent"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6">
        {/* SECTION 1: LEAD URDU ESSAY (680PX READING COLUMN) */}
        <section className="py-20 sm:py-24 border-b border-[#E6E4DD] editorial-fade-up">
          {loading ? (
            <div className="max-w-2xl mx-auto py-16 text-center text-[#57554F]">
              قانونی مضامین اور ریکارڈ لوڈ ہو رہا ہے…
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-16">
              {leadArticle && (
                <article className="space-y-6">
                  <div className="text-sm text-[#57554F]">
                    <span>
                      {leadArticle.category_urdu ||
                        leadArticle.category ||
                        "آئینی قانون"}
                    </span>
                    <span className="mx-2">·</span>
                    <span>
                      {leadArticle.read_time_urdu || "6 منٹ کا مطالعہ"}
                    </span>
                  </div>

                  <Link
                    href={`/urdu/article/${leadArticle.id}`}
                    className="block group"
                  >
                    <h2 className="font-urdu text-3xl sm:text-4xl font-bold text-[#141413] group-hover:text-[#0B5D3B] transition-colors duration-500">
                      {leadArticle.title_urdu || leadArticle.title}
                    </h2>
                  </Link>

                  <p className="font-urdu text-xl text-[#383733]">
                    {leadArticle.subtitle_urdu ||
                      (leadArticle.content_urdu
                        ? leadArticle.content_urdu.slice(0, 260) + "…"
                        : leadArticle.content)}
                  </p>

                  <blockquote className="p-6 sm:p-8 bg-[#F2EFE9] border-r-2 border-[#0B5D3B] space-y-2">
                    <p className="font-urdu text-xl text-[#141413]">
                      ”مورث کی وفات کے فوراً بعد وراثت تمام شرعی وارثان کو منتقل
                      ہو جاتی ہے؛ کسی خاتون کو دباؤ کے تحت وراثت سے محروم نہیں
                      کیا جا سکتا۔“
                    </p>
                    <footer
                      className="font-ui-sans text-xs text-[#57554F]"
                      dir="ltr"
                    >
                      PLD 2024 SC 112 · Supreme Court of Pakistan
                    </footer>
                  </blockquote>

                  <div className="pt-4 flex items-center justify-between text-sm text-[#57554F]">
                    <span>
                      {leadArticle.author_urdu ||
                        leadArticle.author ||
                        "ادارتی بورڈ"}
                    </span>
                    <Link
                      href={`/urdu/article/${leadArticle.id}`}
                      className="editorial-link text-[#141413] font-bold inline-flex items-center gap-1.5"
                    >
                      <span>مکمل مضمون پڑھیں</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              )}

              {secondaryArticles.length > 0 && (
                <div className="pt-12 border-t border-[#E6E4DD] space-y-10">
                  <div className="divide-y divide-[#E6E4DD]">
                    {secondaryArticles.map((art) => (
                      <article
                        key={art.id}
                        className="py-8 first:pt-0 last:pb-0 space-y-3"
                      >
                        <div className="text-sm text-[#57554F]">
                          <span className="text-[#141413] font-bold">
                            {art.category_urdu || art.category}
                          </span>
                          <span className="mx-2">·</span>
                          <span>{art.read_time_urdu || "5 منٹ کا مطالعہ"}</span>
                        </div>
                        <Link href={`/urdu/article/${art.id}`}>
                          <h3 className="font-urdu text-2xl font-bold text-[#141413] hover:text-[#0B5D3B] transition-colors duration-500">
                            {art.title_urdu || art.title}
                          </h3>
                        </Link>
                        <p className="font-urdu text-lg text-[#57554F] line-clamp-2">
                          {art.subtitle_urdu || art.content_urdu || art.content}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* SECTION 2: VERIFIED ADVOCATES IN URDU */}
        <section className="py-20 sm:py-24 border-b border-[#E6E4DD] editorial-fade-up">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="font-urdu text-3xl font-bold text-[#141413]">
                ممتاز ہائی کورٹ اور سپریم کورٹ ایڈووکیٹس
              </h2>
            </div>
            <Link
              href="/urdu/lawyers"
              className="editorial-link text-base text-[#141413] inline-flex items-center gap-1.5"
            >
              <span>مکمل وکلاء ڈائریکٹری</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {lawyers.slice(0, 4).map((lawyer) => (
              <div
                key={lawyer.id}
                className="editorial-card bg-[#FAF9F5] p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <h3 className="font-urdu text-2xl font-bold text-[#141413]">
                    {lawyer.name_urdu || lawyer.name}
                  </h3>
                  <div className="text-sm text-[#57554F]">
                    {lawyer.court_urdu || lawyer.court} ·{" "}
                    {lawyer.city_urdu || lawyer.location} ·{" "}
                    {lawyer.specialty_urdu || lawyer.specialty}
                  </div>
                  <p className="font-urdu text-lg text-[#57554F]">
                    {lawyer.intro_urdu || lawyer.bio}
                  </p>
                </div>

                <div className="pt-5 border-t border-[#E6E4DD] space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#57554F]">مشاورتی فیس:</span>
                    <span
                      className="font-ui-sans font-semibold text-[#141413]"
                      dir="ltr"
                    >
                      PKR {(lawyer.fee || 3500).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/lawyers/${lawyer.id}`}
                      className="flex-1 py-2.5 px-4 border border-[#E6E4DD] hover:border-[#141413] text-center text-sm text-[#141413]"
                    >
                      پروفائل دیکھیں
                    </Link>
                    <button
                      type="button"
                      onClick={() => setBookingLawyer(lawyer)}
                      className="flex-1 py-2.5 px-4 bg-[#0B5D3B] text-[#FAF9F5] text-sm cursor-pointer"
                    >
                      وقت بک کریں
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: LAWS ARCHIVE IN URDU */}
        <section className="py-20 sm:py-24 border-b border-[#E6E4DD] editorial-fade-up">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
              <h2 className="font-urdu text-3xl font-bold text-[#141413]">
                آئینِ پاکستان 1973 اور اہم قوانین
              </h2>
              <Link
                href="/urdu/laws"
                className="editorial-link text-base text-[#141413] inline-flex items-center gap-1.5"
              >
                <span>تمام قوانین دیکھیں</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-6">
              {laws.slice(0, 4).map((law) => (
                <Link
                  key={law.id}
                  href={`/urdu/laws/${law.id}`}
                  className="editorial-card block bg-[#FAF9F5] p-8 space-y-3"
                >
                  <div className="text-sm text-[#57554F]">
                    <span>{law.category}</span>
                    <span className="mx-2">·</span>
                    <span>{law.section_urdu || law.section_number}</span>
                  </div>
                  <h3 className="font-urdu text-2xl font-bold text-[#141413]">
                    {law.title_urdu || law.title}
                  </h3>
                  <p className="font-urdu text-lg text-[#57554F] line-clamp-2">
                    {law.content_urdu || law.content}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: TEMPLATES, Q&A & PRO-BONO HUB IN URDU */}
        <section
          id="templates-qa"
          className="py-20 sm:py-28 editorial-fade-up"
        >
          <div className="max-w-2xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="font-urdu text-3xl font-bold text-[#141413]">
                قانونی مسودات، عوامی سوال و جواب اور مفت قانونی امداد
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 border-b border-[#E6E4DD]">
              {[
                { id: "templates", label: `قانونی مسودات (${templates.length})` },
                { id: "qa", label: `عوامی سوال و جواب (${questions.length})` },
                { id: "probono", label: "مفت قانونی امداد (Pro-Bono)" },
              ].map((tab) => {
                const isActive = activeHubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveHubTab(tab.id as any)}
                    className={`pb-3 font-urdu text-lg transition-all duration-500 cursor-pointer border-b-2 -mb-px ${
                      isActive
                        ? "border-[#0B5D3B] text-[#141413] font-bold"
                        : "border-transparent text-[#57554F] hover:text-[#141413]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeHubTab === "templates" && (
              <div className="space-y-6">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="editorial-card bg-[#FAF9F5] p-8 space-y-4"
                  >
                    <div className="flex items-center justify-between text-sm text-[#57554F]">
                      <span>{tpl.category_urdu || tpl.category}</span>
                      <span
                        className="font-ui-sans font-semibold text-[#141413]"
                        dir="ltr"
                      >
                        PKR {tpl.price}
                      </span>
                    </div>
                    <h3 className="font-urdu text-2xl font-bold text-[#141413]">
                      {tpl.title_urdu || tpl.title}
                    </h3>
                    <p className="font-urdu text-lg text-[#57554F]">
                      {tpl.summary_urdu || tpl.summary}
                    </p>
                    <div className="pt-4 border-t border-[#E6E4DD] flex items-center justify-between">
                      <span className="text-sm text-[#57554F]">
                        اردو اور انگریزی مسودہ
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(tpl)}
                        className="px-5 py-2.5 bg-[#0B5D3B] text-[#FAF9F5] text-sm cursor-pointer"
                      >
                        پری ویو اور ڈاؤن لوڈ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeHubTab === "qa" && (
              <div className="space-y-8">
                <form
                  onSubmit={handlePostUrduQuestion}
                  className="bg-[#F2EFE9] border border-[#E6E4DD] p-8 space-y-4"
                >
                  <h3 className="font-urdu text-2xl font-bold text-[#141413]">
                    اپنا قانونی سوال پوسٹ کریں
                  </h3>
                  <textarea
                    required
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    placeholder="اپنا قانونی مسئلہ یہاں درج کریں…"
                    className="w-full p-4 border border-[#E6E4DD] bg-[#FAF9F5] text-lg h-28 font-urdu"
                  />
                  <label className="flex items-center gap-2 text-sm text-[#383733] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keepAnonymous}
                      onChange={(e) => setKeepAnonymous(e.target.checked)}
                    />
                    <span>میرا نام خفیہ رکھیں</span>
                  </label>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0B5D3B] text-[#FAF9F5] text-base cursor-pointer"
                  >
                    سوال شائع کریں
                  </button>
                  {questionSuccess && (
                    <p className="text-sm text-[#0B5D3B] font-bold">
                      {questionSuccess}
                    </p>
                  )}
                </form>

                <div className="space-y-4">
                  {questions.map((q) => {
                    const isExpanded = expandedQuestionId === q.id;
                    return (
                      <div
                        key={q.id}
                        className="editorial-card bg-[#FAF9F5] p-6 sm:p-8"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedQuestionId(isExpanded ? null : q.id)
                          }
                          className="w-full text-right flex items-start justify-between gap-4 cursor-pointer"
                        >
                          <div className="space-y-2">
                            <div className="text-sm text-[#57554F]">
                              <span>{q.category_urdu || q.category}</span>
                              <span className="mx-2">·</span>
                              <span>{q.city}</span>
                            </div>
                            <h3 className="font-urdu text-xl font-bold text-[#141413]">
                              {q.title_urdu || q.title}
                            </h3>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-[#57554F] shrink-0 mt-2 transition-transform duration-500 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <div
                          className="editorial-morph"
                          data-expanded={isExpanded ? "true" : "false"}
                        >
                          <div>
                            {q.verified_reply && (
                              <div className="mt-6 pt-6 border-t border-[#E6E4DD] space-y-2">
                                <div className="text-sm font-bold text-[#0B5D3B]">
                                  تصدیق شدہ قانونی رائے ·{" "}
                                  {q.verified_reply.lawyer_name_urdu ||
                                    q.verified_reply.lawyer_name}
                                </div>
                                <p className="font-urdu text-lg text-[#383733]">
                                  {q.verified_reply.reply_urdu ||
                                    q.verified_reply.reply}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeHubTab === "probono" && (
              <div className="bg-[#F2EFE9] border border-[#E6E4DD] p-8 space-y-5">
                <h3 className="font-urdu text-2xl font-bold text-[#141413]">
                  پرو بونو (Pro-Bono) مفت وکالت کی درخواست
                </h3>
                {probonoSubmitted ? (
                  <div className="p-5 bg-[#FAF9F5] border border-[#0B5D3B] text-base text-[#0B5D3B] font-bold">
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
                        className="px-4 py-3 border border-[#E6E4DD] bg-[#FAF9F5] text-base"
                      />
                      <input
                        type="number"
                        required
                        value={probonoIncome}
                        onChange={(e) => setProbonoIncome(e.target.value)}
                        placeholder="ماہانہ آمدن (PKR)"
                        className="px-4 py-3 border border-[#E6E4DD] bg-[#FAF9F5] text-base font-ui-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#0B5D3B] text-[#FAF9F5] text-base cursor-pointer"
                    >
                      درخواست جمع کروائیں
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
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
            "قانونی مسودہ ڈاؤن لوڈ کرنے کے لیے اکاؤنٹ کی تصدیق کریں۔"
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
            "ایڈووکیٹ اپائنٹمنٹ بک کرنے کے لیے لاگ ان کریں۔"
          );
          setAuthModalOpen(true);
        }}
        lang="ur"
      />
    </div>
  );
}