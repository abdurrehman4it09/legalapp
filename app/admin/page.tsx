"use client";

import React, { useState, useEffect } from "react";
import {
  createClient,
  getTableData,
  saveTableData,
  getSiteSettings,
  saveSiteSettings,
  getCategoriesByScope,
  resetAllPlatformData,
} from "@/app/supabase";
import Link from "next/link";
import {
  Calendar,
  Video,
  X,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Layers,
  Tag,
  FileText,
  MessageSquare,
  Briefcase,
  Sparkles,
  Bell,
  Sliders,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type AdminSection =
  | "articles"
  | "categories"
  | "templates"
  | "qa"
  | "crm_escrow"
  | "probono"
  | "ai_notifications"
  | "masthead";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminSection>("articles");
  const [statusBanner, setStatusBanner] = useState("");

  // 1. Editorial Briefings / Posts state (Screens 02, 04, 50, 51, 52)
  const [articles, setArticles] = useState<any[]>([]);
  const [editingArtId, setEditingArtId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Property & Inheritance");
  const [author, setAuthor] = useState("Adv. Sara Mansoor, ASC");
  const [readTime, setReadTime] = useState("6 min read");
  const [content, setContent] = useState("");
  const [titleUrdu, setTitleUrdu] = useState("");
  const [subtitleUrdu, setSubtitleUrdu] = useState("");
  const [categoryUrdu, setCategoryUrdu] = useState("جائیداد اور وراثت");
  const [authorUrdu, setAuthorUrdu] = useState("ایڈووکیٹ سارہ منصور (سپریم کورٹ)");
  const [readTimeUrdu, setReadTimeUrdu] = useState("6 منٹ کا مطالعہ");
  const [contentUrdu, setContentUrdu] = useState("");

  // Screen 51 & 52 Modals
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(
    "https://www.youtube.com/watch?v=supreme-court-pk-brief"
  );
  const [mediaCaption, setMediaCaption] = useState(
    "Supreme Court Constitutional Bench Audio/Video Proceeding"
  );
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("2026-10-25T09:00");

  // 2. Categories & Taxonomies state (Article, Law, Template, Lawyer Cities)
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [catScope, setCatScope] = useState<
    "article" | "law" | "template" | "lawyer_city"
  >("article");
  const [catNameEn, setCatNameEn] = useState("");
  const [catNameUr, setCatNameUr] = useState("");

  // 3. Templates Storefront state (Screens 08 & 09)
  const [templates, setTemplates] = useState<any[]>([]);
  const [editingTplId, setEditingTplId] = useState<number | null>(null);
  const [tplTitle, setTplTitle] = useState("");
  const [tplTitleUr, setTplTitleUr] = useState("");
  const [tplCat, setTplCat] = useState("Property & Rent");
  const [tplCatUr, setTplCatUr] = useState("جائیداد اور کرایہ داری");
  const [tplPrice, setTplPrice] = useState("2000");
  const [tplPages, setTplPages] = useState("6");
  const [tplSummary, setTplSummary] = useState("");
  const [tplSummaryUr, setTplSummaryUr] = useState("");
  const [tplPreview, setTplPreview] = useState("");

  // 4. Public Q&A & Advocate Reputation Desk state (Screens 10, 31, 32, 43)
  const [questions, setQuestions] = useState<any[]>([]);
  const [editingQId, setEditingQId] = useState<number | null>(null);
  const [qTitle, setQTitle] = useState("");
  const [qTitleUr, setQTitleUr] = useState("");
  const [qCat, setQCat] = useState("Property & Inheritance");
  const [qCatUr, setQCatUr] = useState("جائیداد اور وراثت");
  const [qCity, setQCity] = useState("Islamabad");
  const [qAuthor, setQAuthor] = useState("Anonymous Citizen");
  const [qLawyerName, setQLawyerName] = useState("Adv. Sara Mansoor, ASC");
  const [qLawyerNameUr, setQLawyerNameUr] = useState(
    "ایڈووکیٹ سارہ منصور (سپریم کورٹ)"
  );
  const [qCourt, setQCourt] = useState("Supreme Court of Pakistan");
  const [qReply, setQReply] = useState("");
  const [qReplyUr, setQReplyUr] = useState("");

  // 5. Client Appointments, Advocate CRM Leads, Milestones & Lawyer Network (Screens 26, 27, 35–39, 44–49)
  const [appointments, setAppointments] = useState<any[]>([]);
  const [crmLeads, setCrmLeads] = useState<any[]>([]);
  const [leadTitle, setLeadTitle] = useState("");
  const [leadTitleUr, setLeadTitleUr] = useState("");
  const [leadClient, setLeadClient] = useState("");
  const [leadJurisdiction, setLeadJurisdiction] = useState("Islamabad High Court");
  const [leadFee, setLeadFee] = useState("45000");
  const [leadSummary, setLeadSummary] = useState("");

  const [milestones, setMilestones] = useState<any[]>([]);
  const [msCaseRef, setMsCaseRef] = useState(
    "W.P. No. 3812/2026 — Mst. Amina vs. Revenue Officer"
  );
  const [msTitle, setMsTitle] = useState("");
  const [msDate, setMsDate] = useState("2026-10-28");
  const [msStatus, setMsStatus] = useState("Scheduled");
  const [msFile, setMsFile] = useState("Court_Order_Verified.pdf");

  const [networkPosts, setNetworkPosts] = useState<any[]>([]);
  const [netAuthor, setNetAuthor] = useState("Adv. Sara Mansoor, ASC");
  const [netTopic, setNetTopic] = useState("");
  const [netTopicUr, setNetTopicUr] = useState("");
  const [netCity, setNetCity] = useState("Islamabad → Lahore Referral");
  const [netContent, setNetContent] = useState("");

  // 6. Pro-Bono Applications & Income Guidelines (Screens 33, 34, 48)
  const [probonoRequests, setProbonoRequests] = useState<any[]>([]);
  const [probonoGuidelines, setProbonoGuidelines] = useState<any[]>([]);
  const [guideTitle, setGuideTitle] = useState("");
  const [guideTitleUr, setGuideTitleUr] = useState("");
  const [guideDesc, setGuideDesc] = useState("");
  const [guideDescUr, setGuideDescUr] = useState("");

  // 7. AI Prompts, Citations & Notifications (Screens 28, 40–42, 57)
  const [aiPrompts, setAiPrompts] = useState<any[]>([]);
  const [newPromptEn, setNewPromptEn] = useState("");
  const [newPromptUr, setNewPromptUr] = useState("");
  const [aiCitations, setAiCitations] = useState<any[]>([]);
  const [citCode, setCitCode] = useState("");
  const [citTitle, setCitTitle] = useState("");
  const [citCourt, setCitCourt] = useState("Supreme Court of Pakistan");
  const [citSummary, setCitSummary] = useState("");

  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifTitleUr, setNotifTitleUr] = useState("");
  const [notifMsg, setNotifMsg] = useState("");
  const [notifMsgUr, setNotifMsgUr] = useState("");

  // 8. Site Masthead, Hero Engraving Plate & Escrow Wallet Settings (Screens 01, 02, 46)
  const [siteSettings, setSiteSettings] = useState<any>(() => getSiteSettings());

  async function refreshAll() {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setArticles(data);
    setAllCategories(getTableData("categories"));
    setTemplates(getTableData("templates"));
    setQuestions(getTableData("questions"));
    setAppointments(getTableData("appointments"));
    setCrmLeads(getTableData("crm_leads"));
    setMilestones(getTableData("case_milestones"));
    setNetworkPosts(getTableData("lawyer_network"));
    setProbonoRequests(getTableData("probono_requests"));
    setProbonoGuidelines(getTableData("probono_guidelines"));
    setAiPrompts(getTableData("ai_prompts"));
    setAiCitations(getTableData("ai_citations"));
    setNotifications(getTableData("notifications"));
    setSiteSettings(getSiteSettings());
  }

  useEffect(() => {
    refreshAll();
  }, []);

  const flashBanner = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(""), 4000);
  };

  /* ---- 1. ARTICLES HANDLERS ---- */
  async function handleSaveArticle(customSchedule?: string) {
    if (!title.trim() && !titleUrdu.trim()) {
      flashBanner("Please enter an English or Urdu headline.");
      return;
    }
    const payload = {
      title,
      subtitle,
      category,
      author,
      read_time: readTime || "5 min read",
      content,
      title_urdu: titleUrdu,
      subtitle_urdu: subtitleUrdu,
      category_urdu: categoryUrdu,
      author_urdu: authorUrdu,
      read_time_urdu: readTimeUrdu || "5 منٹ کا مطالعہ",
      content_urdu: contentUrdu,
      created_at: customSchedule
        ? new Date(customSchedule).toISOString()
        : new Date().toISOString(),
    };

    if (editingArtId) {
      await supabase.from("articles").update(payload).eq("id", editingArtId);
      flashBanner("Updated briefing across English & Urdu apps!");
    } else {
      await supabase.from("articles").insert([payload]);
      flashBanner("Published new briefing live to English & Urdu apps!");
    }
    resetArticleForm();
    refreshAll();
  }

  function handleEditArticle(art: any) {
    setEditingArtId(art.id);
    setTitle(art.title || "");
    setSubtitle(art.subtitle || "");
    setCategory(art.category || "Property & Inheritance");
    setAuthor(art.author || "Adv. Sara Mansoor, ASC");
    setReadTime(art.read_time || "6 min read");
    setContent(art.content || "");
    setTitleUrdu(art.title_urdu || "");
    setSubtitleUrdu(art.subtitle_urdu || "");
    setCategoryUrdu(art.category_urdu || "جائیداد اور وراثت");
    setAuthorUrdu(art.author_urdu || "ایڈووکیٹ سارہ منصور");
    setReadTimeUrdu(art.read_time_urdu || "6 منٹ کا مطالعہ");
    setContentUrdu(art.content_urdu || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetArticleForm() {
    setEditingArtId(null);
    setTitle("");
    setSubtitle("");
    setContent("");
    setTitleUrdu("");
    setSubtitleUrdu("");
    setContentUrdu("");
  }

  async function deleteArticle(id: number) {
    await supabase.from("articles").delete().eq("id", id);
    refreshAll();
    flashBanner("Briefing deleted.");
  }

  /* ---- 2. CATEGORIES HANDLERS ---- */
  function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!catNameEn.trim()) return;
    const current = getTableData("categories");
    if (editingCatId) {
      const updated = current.map((c) =>
        c.id === editingCatId
          ? {
              ...c,
              scope: catScope,
              name: catNameEn,
              name_urdu: catNameUr || catNameEn,
            }
          : c
      );
      saveTableData("categories", updated);
      flashBanner("Category updated across platform filters!");
    } else {
      const newCat = {
        id: Date.now(),
        scope: catScope,
        name: catNameEn,
        name_urdu: catNameUr || catNameEn,
      };
      saveTableData("categories", [...current, newCat]);
      flashBanner("New category added to English & Urdu filter bars!");
    }
    setEditingCatId(null);
    setCatNameEn("");
    setCatNameUr("");
    refreshAll();
  }

  function handleEditCategory(cat: any) {
    setEditingCatId(cat.id);
    setCatScope(cat.scope);
    setCatNameEn(cat.name);
    setCatNameUr(cat.name_urdu || "");
  }

  function handleDeleteCategory(id: number) {
    const updated = allCategories.filter((c) => c.id !== id);
    saveTableData("categories", updated);
    refreshAll();
    flashBanner("Category removed.");
  }

  /* ---- 3. TEMPLATES HANDLERS ---- */
  function handleSaveTemplate(e: React.FormEvent) {
    e.preventDefault();
    if (!tplTitle.trim()) return;
    const payload = {
      title: tplTitle,
      title_urdu: tplTitleUr || tplTitle,
      category: tplCat,
      category_urdu: tplCatUr || tplCat,
      price: Number(tplPrice) || 2000,
      pages: Number(tplPages) || 5,
      bilingual: true,
      summary:
        tplSummary ||
        "Verified bilingual legal instrument supplied via Admin CMS.",
      summary_urdu:
        tplSummaryUr || "ایڈمن سی ایم ایس سے جاری کردہ مستند قانونی مسودہ۔",
      preview_text:
        tplPreview ||
        "STATUTORY LEGAL INSTRUMENT\n\nExecuted under the laws of Pakistan...",
    };

    if (editingTplId) {
      const updated = templates.map((t) =>
        t.id === editingTplId ? { ...t, ...payload } : t
      );
      saveTableData("templates", updated);
      flashBanner("Template updated in Storefront (Screens 08 & 09)!");
    } else {
      saveTableData("templates", [{ id: Date.now(), ...payload }, ...templates]);
      flashBanner("New template added to Storefront (Screens 08 & 09)!");
    }
    setEditingTplId(null);
    setTplTitle("");
    setTplTitleUr("");
    setTplSummary("");
    setTplSummaryUr("");
    setTplPreview("");
    refreshAll();
  }

  function handleEditTemplate(tpl: any) {
    setEditingTplId(tpl.id);
    setTplTitle(tpl.title || "");
    setTplTitleUr(tpl.title_urdu || "");
    setTplCat(tpl.category || "Property & Rent");
    setTplCatUr(tpl.category_urdu || "جائیداد اور کرایہ داری");
    setTplPrice(String(tpl.price || 2000));
    setTplPages(String(tpl.pages || 6));
    setTplSummary(tpl.summary || "");
    setTplSummaryUr(tpl.summary_urdu || "");
    setTplPreview(tpl.preview_text || "");
  }

  function handleDeleteTemplate(id: number) {
    saveTableData(
      "templates",
      templates.filter((t) => t.id !== id)
    );
    refreshAll();
    flashBanner("Template deleted.");
  }

  /* ---- 4. Q&A FORUM & REPUTATION DESK HANDLERS ---- */
  function handleSaveQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!qTitle.trim()) return;
    const payload = {
      title: qTitle,
      title_urdu: qTitleUr || qTitle,
      category: qCat,
      category_urdu: qCatUr || qCat,
      city: qCity,
      is_anonymous: qAuthor.toLowerCase().includes("anonymous"),
      author_name: qAuthor || "Anonymous Citizen",
      answer_count: 1,
      verified_reply: {
        lawyer_name: qLawyerName,
        lawyer_name_urdu: qLawyerNameUr || qLawyerName,
        court: qCourt,
        reply: qReply,
        reply_urdu: qReplyUr || qReply,
      },
    };

    if (editingQId) {
      const updated = questions.map((q) =>
        q.id === editingQId ? { ...q, ...payload } : q
      );
      saveTableData("questions", updated);
      flashBanner("Q&A Thread & Advocate Reply updated (Screens 10 & 43)!");
    } else {
      saveTableData("questions", [
        {
          id: Date.now(),
          created_at: new Date().toISOString(),
          ...payload,
        },
        ...questions,
      ]);
      flashBanner("New Q&A Thread & Verified Reply published!");
    }
    setEditingQId(null);
    setQTitle("");
    setQTitleUr("");
    setQReply("");
    setQReplyUr("");
    refreshAll();
  }

  function handleEditQuestion(q: any) {
    setEditingQId(q.id);
    setQTitle(q.title || "");
    setQTitleUr(q.title_urdu || "");
    setQCat(q.category || "Property & Inheritance");
    setQCatUr(q.category_urdu || "جائیداد اور وراثت");
    setQCity(q.city || "Islamabad");
    setQAuthor(q.author_name || "Anonymous Citizen");
    setQLawyerName(q.verified_reply?.lawyer_name || "Adv. Sara Mansoor, ASC");
    setQLawyerNameUr(
      q.verified_reply?.lawyer_name_urdu || "ایڈووکیٹ سارہ منصور"
    );
    setQCourt(q.verified_reply?.court || "Supreme Court of Pakistan");
    setQReply(q.verified_reply?.reply || "");
    setQReplyUr(q.verified_reply?.reply_urdu || "");
  }

  const articleCategories = getCategoriesByScope("article");
  const templateCategories = getCategoriesByScope("template");

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8">
      {/* Header & Global Reset */}
      <header className="border-b-2 border-stone-900 pb-6 flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold block mb-1">
            1. Master Admin Supply CMS · Edit Everything Across All 61 Screens
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-legal text-stone-950">
            Platform Content, Taxonomies & CRM Command Center
          </h1>
          <p className="text-stone-600 mt-1 text-xs sm:text-sm">
            Every post, category, statute, advocate, template, Q&A thread, CRM lead, AI prompt, and masthead setting edited here updates the English & Urdu editions immediately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/laws"
            className="px-3.5 py-2 bg-white border border-stone-300 hover:border-[#064E3B] text-xs font-semibold text-stone-900"
          >
            Manage Statutes Library (11–12) →
          </Link>
          <Link
            href="/admin/lawyers"
            className="px-3.5 py-2 bg-white border border-stone-300 hover:border-[#064E3B] text-xs font-semibold text-stone-900"
          >
            Manage Advocates Directory (06–07) →
          </Link>
          <button
            type="button"
            onClick={() => {
              resetAllPlatformData();
              refreshAll();
              flashBanner("All platform tables restored to factory defaults.");
            }}
            className="px-3 py-2 border border-stone-300 hover:border-red-600 text-xs font-semibold text-stone-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </header>

      {statusBanner && (
        <div className="p-4 bg-emerald-950/10 border-l-4 border-[#064E3B] text-xs font-bold text-[#064E3B] flex items-center justify-between">
          <span>{statusBanner}</span>
          <button onClick={() => setStatusBanner("")}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 8-Tab Master Admin Control Bar */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-stone-200/80 border border-stone-300 text-xs font-semibold">
        {(
          [
            { id: "articles", label: `1. Posts & Media (50–52) [${articles.length}]` },
            { id: "categories", label: `2. Categories & Cities [${allCategories.length}]` },
            { id: "templates", label: `3. Templates (08–09) [${templates.length}]` },
            { id: "qa", label: `4. Q&A & Replies (10, 31, 43) [${questions.length}]` },
            { id: "crm_escrow", label: `5. Escrow, Leads & CRM (22–49)` },
            { id: "probono", label: `6. Pro-Bono & Guidelines (33–34, 48)` },
            { id: "ai_notifications", label: `7. AI Prompts, Citations & Alerts (40–42, 57)` },
            { id: "masthead", label: `8. Masthead, Splash & Hero Plate (01–02)` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2.5 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#064E3B] text-white"
                : "bg-white text-stone-700 hover:bg-stone-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ======================================================================
          TAB 1: EDITORIAL POSTS & MEDIA CMS (SCREENS 02, 04, 50, 51, 52)
          ====================================================================== */}
      {activeTab === "articles" && (
        <div className="space-y-8">
          <div className="bg-white border border-stone-300 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold block">
                  Screens 50–52 · Bilingual Editorial Post Editor
                </span>
                <h2 className="text-xl font-bold font-legal text-stone-950">
                  {editingArtId
                    ? `Editing Briefing #${editingArtId}`
                    : "Create New Bilingual Post / Legal Briefing"}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMediaModalOpen(true)}
                  className="px-3 py-1.5 bg-stone-50 border border-stone-300 hover:border-stone-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-[#064E3B]" />
                  <span>Screen 51: Embed Media / YouTube</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(true)}
                  className="px-3 py-1.5 bg-stone-50 border border-stone-300 hover:border-stone-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#B48327]" />
                  <span>Screen 52: Schedule Release</span>
                </button>
                {editingArtId && (
                  <button
                    type="button"
                    onClick={resetArticleForm}
                    className="px-3 py-1.5 border border-red-300 text-red-700 text-xs font-semibold cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* English LTR */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-widest text-[#064E3B] border-b border-stone-200 pb-2">
                  English Edition (LTR)
                </h4>
                <div className="grid grid-cols-3 gap-2.5">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      const matched = articleCategories.find(
                        (c) => c.name === e.target.value
                      );
                      if (matched) setCategoryUrdu(matched.name_urdu);
                    }}
                    className="p-2.5 bg-stone-50 border border-stone-300 text-xs"
                  >
                    {articleCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Author Name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="p-2.5 bg-stone-50 border border-stone-300 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Read Time (e.g. 6 min read)"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="p-2.5 bg-stone-50 border border-stone-300 text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="English Headline..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 text-sm font-legal font-bold"
                />
                <input
                  type="text"
                  placeholder="English Subtitle / Deck..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 text-xs"
                />
                <textarea
                  placeholder="Full English article body..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3.5 bg-stone-50 border border-stone-300 h-48 text-xs leading-relaxed"
                />
              </div>

              {/* Urdu RTL */}
              <div dir="rtl" className="space-y-4 font-urdu">
                <h4 className="font-ui font-bold text-xs uppercase tracking-widest text-[#064E3B] border-b border-stone-200 pb-2">
                  اردو ایڈیشن (RTL)
                </h4>
                <div className="grid grid-cols-3 gap-2.5 font-ui">
                  <input
                    type="text"
                    placeholder="اردو زمرہ"
                    value={categoryUrdu}
                    onChange={(e) => setCategoryUrdu(e.target.value)}
                    className="p-2.5 bg-stone-50 border border-stone-300 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="مصنف کا نام"
                    value={authorUrdu}
                    onChange={(e) => setAuthorUrdu(e.target.value)}
                    className="p-2.5 bg-stone-50 border border-stone-300 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="مطالعہ کا وقت"
                    value={readTimeUrdu}
                    onChange={(e) => setReadTimeUrdu(e.target.value)}
                    className="p-2.5 bg-stone-50 border border-stone-300 text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="اردو عنوان..."
                  value={titleUrdu}
                  onChange={(e) => setTitleUrdu(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 text-base font-bold"
                />
                <input
                  type="text"
                  placeholder="اردو ذیلی عنوان..."
                  value={subtitleUrdu}
                  onChange={(e) => setSubtitleUrdu(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 text-sm"
                />
                <textarea
                  placeholder="اردو مضمون کا مکمل متن..."
                  value={contentUrdu}
                  onChange={(e) => setContentUrdu(e.target.value)}
                  className="w-full p-3.5 bg-stone-50 border border-stone-300 h-48 text-base leading-loose"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSaveArticle()}
              className="bg-[#064E3B] text-white px-8 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 transition cursor-pointer"
            >
              {editingArtId
                ? "Save Changes to Briefing"
                : "Publish Post Live to English & Urdu Apps"}
            </button>
          </div>

          <div className="bg-white border border-stone-300 p-6 sm:p-8">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">
              All Published Editorial Briefings ({articles.length})
            </h3>
            <div className="divide-y divide-stone-200">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="py-4 flex flex-col md:flex-row justify-between md:items-center gap-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <span className="text-[11px] text-[#064E3B] font-semibold block">
                        {art.category} · {art.author}
                      </span>
                      <h4 className="font-bold font-legal text-stone-950 text-sm">
                        {art.title}
                      </h4>
                    </div>
                    <div dir="rtl" className="font-urdu">
                      <span className="font-ui text-[11px] text-stone-500 block">
                        {art.category_urdu}
                      </span>
                      <h4 className="font-bold text-stone-900 text-base">
                        {art.title_urdu}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditArticle(art)}
                      className="px-3 py-1.5 border border-stone-300 hover:border-[#064E3B] text-xs font-semibold text-[#064E3B] cursor-pointer"
                    >
                      Edit Post
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteArticle(art.id)}
                      className="px-3 py-1.5 border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 2: CATEGORIES & TAXONOMY MANAGER (POSTS, LAWS, TEMPLATES, CITIES)
          ====================================================================== */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleSaveCategory}
            className="lg:col-span-5 bg-white border border-stone-300 p-6 space-y-4 h-fit"
          >
            <div className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold">
              Dynamic Bilingual Taxonomy Engine
            </div>
            <h2 className="text-xl font-bold font-legal text-stone-950">
              {editingCatId ? "Edit Category / City" : "Add New Category / City"}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Categories added or edited here automatically populate the filter chips on the English Home Page, Urdu Home Page, Digital Law Library, Template Storefront, and Lawyer Directory.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category Scope / Module
              </label>
              <select
                value={catScope}
                onChange={(e) => setCatScope(e.target.value as any)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 text-xs"
              >
                <option value="article">Editorial Post / News Category (Screen 02)</option>
                <option value="law">Digital Law Library Category (Screen 11)</option>
                <option value="template">Legal Template Category (Screen 08)</option>
                <option value="lawyer_city">Advocate City / High Court Seat (Screen 07)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                English Name (LTR)
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Cybercrime & FIA Law"
                value={catNameEn}
                onChange={(e) => setCatNameEn(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Urdu Name (RTL)
              </label>
              <input
                type="text"
                dir="rtl"
                placeholder="مثلاً سائبر کرائم اور ایف آئی اے قوانین"
                value={catNameUr}
                onChange={(e) => setCatNameUr(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 text-sm font-urdu"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#064E3B] text-white text-xs font-semibold uppercase cursor-pointer"
              >
                {editingCatId ? "Update Category" : "+ Add Category"}
              </button>
              {editingCatId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCatId(null);
                    setCatNameEn("");
                    setCatNameUr("");
                  }}
                  className="px-4 py-2.5 border border-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-7 bg-white border border-stone-300 p-6 space-y-6">
            {(
              [
                { scope: "article", title: "Editorial Post Categories (Screen 02)" },
                { scope: "law", title: "Digital Law Library Categories (Screen 11)" },
                { scope: "template", title: "Legal Template Categories (Screen 08)" },
                { scope: "lawyer_city", title: "Advocate Directory Cities (Screen 07)" },
              ] as const
            ).map((group) => {
              const items = allCategories.filter((c) => c.scope === group.scope);
              return (
                <div key={group.scope} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#064E3B] border-b border-stone-200 pb-1.5">
                    {group.title} ({items.length})
                  </h3>
                  <div className="divide-y divide-stone-200 border border-stone-200">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-2.5 flex items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <strong className="text-stone-900">{item.name}</strong>
                          <span className="mx-2 text-stone-400">·</span>
                          <span className="font-urdu text-sm text-stone-700" dir="rtl">
                            {item.name_urdu}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditCategory(item)}
                            className="px-2.5 py-1 border border-stone-300 text-[#064E3B] font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(item.id)}
                            className="px-2.5 py-1 border border-red-200 text-red-700 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 3: LEGAL TEMPLATES STOREFRONT MANAGER (SCREENS 08 & 09)
          ====================================================================== */}
      {activeTab === "templates" && (
        <div className="space-y-8">
          <form
            onSubmit={handleSaveTemplate}
            className="bg-white border border-stone-300 p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B48327] font-semibold block">
                  Screens 08 & 09 · Legal Draft Storefront & Watermarked Preview Editor
                </span>
                <h2 className="text-xl font-bold font-legal text-stone-950">
                  {editingTplId
                    ? `Edit Legal Template #${editingTplId}`
                    : "Add New Legal Draft / Agreement Template"}
                </h2>
              </div>
              {editingTplId && (
                <button
                  type="button"
                  onClick={() => setEditingTplId(null)}
                  className="px-3 py-1.5 border border-red-300 text-red-700 text-xs font-semibold"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={tplCat}
                onChange={(e) => {
                  setTplCat(e.target.value);
                  const found = templateCategories.find(
                    (c) => c.name === e.target.value
                  );
                  if (found) setTplCatUr(found.name_urdu);
                }}
                className="p-2.5 bg-stone-50 border border-stone-300 text-xs"
              >
                {templateCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                dir="rtl"
                placeholder="اردو زمرہ"
                value={tplCatUr}
                onChange={(e) => setTplCatUr(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300 text-xs font-urdu"
              />
              <input
                type="number"
                placeholder="Price (PKR)"
                value={tplPrice}
                onChange={(e) => setTplPrice(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300 text-xs font-mono-code"
              />
              <input
                type="number"
                placeholder="Page Count"
                value={tplPages}
                onChange={(e) => setTplPages(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300 text-xs font-mono-code"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="English Template Title"
                value={tplTitle}
                onChange={(e) => setTplTitle(e.target.value)}
                className="p-3 bg-stone-50 border border-stone-300 text-xs font-bold"
              />
              <input
                type="text"
                dir="rtl"
                placeholder="مسودے کا اردو عنوان"
                value={tplTitleUr}
                onChange={(e) => setTplTitleUr(e.target.value)}
                className="p-3 bg-stone-50 border border-stone-300 text-sm font-urdu"
              />
              <input
                type="text"
                placeholder="English Summary Description"
                value={tplSummary}
                onChange={(e) => setTplSummary(e.target.value)}
                className="p-3 bg-stone-50 border border-stone-300 text-xs"
              />
              <input
                type="text"
                dir="rtl"
                placeholder="اردو مختصر تفصیل"
                value={tplSummaryUr}
                onChange={(e) => setTplSummaryUr(e.target.value)}
                className="p-3 bg-stone-50 border border-stone-300 text-sm font-urdu"
              />
            </div>

            <textarea
              placeholder="Screen 09 Watermarked Clause Preview Text..."
              value={tplPreview}
              onChange={(e) => setTplPreview(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 text-xs h-32 font-legal"
            />

            <button
              type="submit"
              className="bg-[#064E3B] text-white px-6 py-2.5 text-xs font-semibold uppercase cursor-pointer"
            >
              {editingTplId ? "Update Legal Template" : "+ Save Template to Storefront"}
            </button>
          </form>

          <div className="bg-white border border-stone-300 p-6 divide-y divide-stone-200">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="py-4 flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <span className="text-xs text-[#064E3B] font-semibold">
                    {tpl.category} · PKR {tpl.price} · {tpl.pages} Pages
                  </span>
                  <h4 className="font-bold font-legal text-stone-950 text-sm">
                    {tpl.title}
                  </h4>
                  <p className="font-urdu text-sm text-stone-600" dir="rtl">
                    {tpl.title_urdu}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditTemplate(tpl)}
                    className="px-3 py-1.5 border border-stone-300 text-xs font-semibold text-[#064E3B] cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTemplate(tpl.id)}
                    className="px-3 py-1.5 border border-red-200 text-xs font-semibold text-red-700 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 4: PUBLIC Q&A FORUM & ADVOCATE REPUTATION DESK (SCREENS 10, 31, 43)
          ====================================================================== */}
      {activeTab === "qa" && (
        <div className="space-y-8">
          <form
            onSubmit={handleSaveQuestion}
            className="bg-white border border-stone-300 p-6 sm:p-8 space-y-4"
          >
            <span className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold block">
              Screens 10, 31, 32 & 43 · Public Q&A Thread & Verified Counsel Reply Editor
            </span>
            <h2 className="text-xl font-bold font-legal text-stone-950">
              {editingQId
                ? `Edit Q&A Thread #${editingQId}`
                : "Create Q&A Inquiry & Verified Advocate Opinion"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Category (e.g. Property & Inheritance)"
                value={qCat}
                onChange={(e) => setQCat(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300 text-xs"
              />
              <input
                type="text"
                placeholder="City (e.g. Lahore)"
                value={qCity}
                onChange={(e) => setQCity(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300 text-xs"
              />
              <input
                type="text"
                placeholder="Citizen Display Name (or Anonymous Citizen)"
                value={qAuthor}
                onChange={(e) => setQAuthor(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                required
                placeholder="English Citizen Question (Screen 10 & 31)..."
                value={qTitle}
                onChange={(e) => setQTitle(e.target.value)}
                className="p-3 bg-stone-50 border border-stone-300 text-xs h-24"
              />
              <textarea
                dir="rtl"
                placeholder="اردو سوال..."
                value={qTitleUr}
                onChange={(e) => setQTitleUr(e.target.value)}
                className="p-3 bg-stone-50 border border-stone-300 text-sm font-urdu h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-stone-200">
              <input
                type="text"
                placeholder="Replying Advocate (Screen 43)"
                value={qLawyerName}
                onChange={(e) => setQLawyerName(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300 text-xs"
              />
              <input
                type="text"
                dir="rtl"
                placeholder="ایڈووکیٹ کا اردو نام"
                value={qLawyerNameUr}
                onChange={(e) => setQLawyerNameUr(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300 text-xs font-urdu"
              />
              <input
                type="text"
                placeholder="Court (e.g. Supreme Court of Pakistan)"
                value={qCourt}
                onChange={(e) => setQCourt(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                placeholder="Verified Advocate Legal Opinion (English)..."
                value={qReply}
                onChange={(e) => setQReply(e.target.value)}
                className="p-3 bg-stone-50 border border-stone-300 text-xs h-24"
              />
              <textarea
                dir="rtl"
                placeholder="تصدیق شدہ وکیل کی قانونی رائے (اردو)..."
                value={qReplyUr}
                onChange={(e) => setQReplyUr(e.target.value)}
                className="p-3 bg-stone-50 border border-stone-300 text-sm font-urdu h-24"
              />
            </div>

            <button
              type="submit"
              className="bg-[#064E3B] text-white px-6 py-2.5 text-xs font-semibold uppercase cursor-pointer"
            >
              {editingQId ? "Update Q&A & Advocate Reply" : "+ Publish Q&A & Verified Reply"}
            </button>
          </form>

          <div className="bg-white border border-stone-300 p-6 divide-y divide-stone-200">
            {questions.map((q) => (
              <div
                key={q.id}
                className="py-4 flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="space-y-1 max-w-3xl">
                  <span className="text-xs text-[#064E3B] font-semibold">
                    {q.category} · {q.city} · {q.author_name}
                  </span>
                  <h4 className="font-bold text-stone-950 text-xs">{q.title}</h4>
                  {q.verified_reply && (
                    <p className="text-xs text-stone-600">
                      <strong>{q.verified_reply.lawyer_name}:</strong>{" "}
                      {q.verified_reply.reply}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditQuestion(q)}
                    className="px-3 py-1.5 border border-stone-300 text-xs font-semibold text-[#064E3B] cursor-pointer"
                  >
                    Edit Thread / Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      saveTableData(
                        "questions",
                        questions.filter((item) => item.id !== q.id)
                      );
                      refreshAll();
                    }}
                    className="px-3 py-1.5 border border-red-200 text-xs font-semibold text-red-700 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 5: ESCROW APPOINTMENTS, LAWYER CRM LEADS, MILESTONES & NETWORK (SCREENS 22–49)
          ====================================================================== */}
      {activeTab === "crm_escrow" && (
        <div className="space-y-8">
          {/* Client Appointments & Escrow Status (Screens 22-27) */}
          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <h3 className="text-sm font-bold font-legal text-stone-950 border-b border-stone-200 pb-2">
              Screens 22–27 · Client Escrow Appointments & Status Manager
            </h3>
            <div className="divide-y divide-stone-200">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="py-3 flex flex-wrap items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <strong className="text-stone-950">
                      {appt.client_name} → {appt.lawyer_name} ({appt.escrow_id})
                    </strong>
                    <div className="text-stone-500">
                      {appt.date} · {appt.time_slot} · PKR {appt.fee} ·{" "}
                      {appt.case_summary}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={appt.status}
                      onChange={(e) => {
                        const updated = appointments.map((a) =>
                          a.id === appt.id ? { ...a, status: e.target.value } : a
                        );
                        saveTableData("appointments", updated);
                        refreshAll();
                        flashBanner("Appointment status updated!");
                      }}
                      className="px-2.5 py-1 border border-stone-300 bg-stone-50 font-semibold"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Past">Completed / Past</option>
                      <option value="Rescheduled">Rescheduled (Screen 27)</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        saveTableData(
                          "appointments",
                          appointments.filter((a) => a.id !== appt.id)
                        );
                        refreshAll();
                      }}
                      className="px-2.5 py-1 border border-red-200 text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advocate CRM Leads (Screens 36 & 37) */}
          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <h3 className="text-sm font-bold font-legal text-stone-950 border-b border-stone-200 pb-2">
              Screens 36 & 37 · Lawyer Lead Management & Retainer Proposals
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!leadTitle.trim()) return;
                const next = [
                  {
                    id: Date.now(),
                    title: leadTitle,
                    title_urdu: leadTitleUr || leadTitle,
                    client_name: leadClient || "Verified Client",
                    jurisdiction: leadJurisdiction,
                    proposed_fee: Number(leadFee) || 45000,
                    status: "Pending Review",
                    summary: leadSummary,
                  },
                  ...crmLeads,
                ];
                saveTableData("crm_leads", next);
                setLeadTitle("");
                setLeadTitleUr("");
                setLeadSummary("");
                refreshAll();
                flashBanner("New Advocate Lead added (Screen 36)!");
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"
            >
              <input
                type="text"
                required
                placeholder="Lead Title (English)"
                value={leadTitle}
                onChange={(e) => setLeadTitle(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300"
              />
              <input
                type="text"
                dir="rtl"
                placeholder="لیڈ کا اردو عنوان"
                value={leadTitleUr}
                onChange={(e) => setLeadTitleUr(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300 font-urdu"
              />
              <input
                type="number"
                placeholder="Proposed Retainer Fee (PKR)"
                value={leadFee}
                onChange={(e) => setLeadFee(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300 font-mono-code"
              />
              <input
                type="text"
                placeholder="Client Name"
                value={leadClient}
                onChange={(e) => setLeadClient(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300"
              />
              <input
                type="text"
                placeholder="Brief Summary"
                value={leadSummary}
                onChange={(e) => setLeadSummary(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300"
              />
              <button
                type="submit"
                className="bg-[#064E3B] text-white font-semibold py-2.5 px-4 cursor-pointer"
              >
                + Add CRM Lead (Screen 36)
              </button>
            </form>

            <div className="divide-y divide-stone-200 text-xs">
              {crmLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="py-3 flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <strong className="text-stone-950">{lead.title}</strong>
                    <div className="text-stone-500">
                      {lead.client_name} · {lead.jurisdiction} · PKR{" "}
                      {lead.proposed_fee?.toLocaleString()} · {lead.status}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      saveTableData(
                        "crm_leads",
                        crmLeads.filter((l) => l.id !== lead.id)
                      );
                      refreshAll();
                    }}
                    className="px-2.5 py-1 border border-red-200 text-red-700 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Case Milestones (Screens 38 & 39) & Lawyer Network (Screen 49) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-300 p-6 space-y-4">
              <h3 className="text-sm font-bold font-legal text-stone-950 border-b border-stone-200 pb-2">
                Screens 38 & 39 · Active Case Workspace Milestones
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!msTitle.trim()) return;
                  saveTableData("case_milestones", [
                    {
                      id: Date.now(),
                      case_ref: msCaseRef,
                      title: msTitle,
                      status: msStatus,
                      date: msDate,
                      shared_file: msFile,
                    },
                    ...milestones,
                  ]);
                  setMsTitle("");
                  refreshAll();
                  flashBanner("Milestone added to Case Workspace (Screen 38–39)!");
                }}
                className="space-y-2.5 text-xs"
              >
                <input
                  type="text"
                  value={msCaseRef}
                  onChange={(e) => setMsCaseRef(e.target.value)}
                  placeholder="Case Reference"
                  className="w-full p-2 bg-stone-50 border border-stone-300"
                />
                <input
                  type="text"
                  required
                  value={msTitle}
                  onChange={(e) => setMsTitle(e.target.value)}
                  placeholder="Milestone Title (e.g. Writ Notice Issued)"
                  className="w-full p-2 bg-stone-50 border border-stone-300"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={msDate}
                    onChange={(e) => setMsDate(e.target.value)}
                    className="p-2 bg-stone-50 border border-stone-300 font-mono-code"
                  />
                  <button
                    type="submit"
                    className="bg-[#064E3B] text-white font-semibold py-2 cursor-pointer"
                  >
                    + Add Milestone
                  </button>
                </div>
              </form>
              <div className="divide-y divide-stone-200 text-xs">
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    className="py-2.5 flex items-center justify-between gap-2"
                  >
                    <div>
                      <strong className="block text-stone-900">{m.title}</strong>
                      <span className="text-stone-500">
                        {m.case_ref} · {m.date}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        saveTableData(
                          "case_milestones",
                          milestones.filter((x) => x.id !== m.id)
                        );
                        refreshAll();
                      }}
                      className="text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-300 p-6 space-y-4">
              <h3 className="text-sm font-bold font-legal text-stone-950 border-b border-stone-200 pb-2">
                Screen 49 · Private Lawyer-to-Lawyer Network Discussions
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!netTopic.trim()) return;
                  saveTableData("lawyer_network", [
                    {
                      id: Date.now(),
                      author: netAuthor,
                      topic: netTopic,
                      topic_urdu: netTopicUr || netTopic,
                      chamber_city: netCity,
                      replies_count: 1,
                      content: netContent,
                    },
                    ...networkPosts,
                  ]);
                  setNetTopic("");
                  setNetTopicUr("");
                  setNetContent("");
                  refreshAll();
                  flashBanner("Added thread to Private Lawyer Network (Screen 49)!");
                }}
                className="space-y-2.5 text-xs"
              >
                <input
                  type="text"
                  required
                  value={netTopic}
                  onChange={(e) => setNetTopic(e.target.value)}
                  placeholder="Discussion Topic / Co-Counsel Referral"
                  className="w-full p-2 bg-stone-50 border border-stone-300"
                />
                <textarea
                  value={netContent}
                  onChange={(e) => setNetContent(e.target.value)}
                  placeholder="Chamber referral details..."
                  className="w-full p-2 bg-stone-50 border border-stone-300 h-16"
                />
                <button
                  type="submit"
                  className="w-full bg-[#064E3B] text-white font-semibold py-2 cursor-pointer"
                >
                  + Post to Private Lawyer Network
                </button>
              </form>
              <div className="divide-y divide-stone-200 text-xs">
                {networkPosts.map((np) => (
                  <div
                    key={np.id}
                    className="py-2.5 flex items-center justify-between gap-2"
                  >
                    <div>
                      <strong className="block text-stone-900">{np.topic}</strong>
                      <span className="text-stone-500">
                        {np.author} · {np.chamber_city}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        saveTableData(
                          "lawyer_network",
                          networkPosts.filter((x) => x.id !== np.id)
                        );
                        refreshAll();
                      }}
                      className="text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 6: PRO-BONO APPLICATIONS & INCOME GUIDELINES (SCREENS 33, 34, 48)
          ====================================================================== */}
      {activeTab === "probono" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <h3 className="text-base font-bold font-legal text-stone-950 border-b border-stone-200 pb-2">
              Screens 33 & 48 · Submitted Pro-Bono Legal Aid Requests
            </h3>
            <div className="divide-y divide-stone-200 text-xs">
              {probonoRequests.map((req) => (
                <div
                  key={req.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <strong className="block text-stone-950">
                      {req.applicant} (Income: PKR {req.monthly_income})
                    </strong>
                    <span className="text-stone-500">
                      {req.category} · {req.certificate_type} · {req.status}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      saveTableData(
                        "probono_requests",
                        probonoRequests.filter((r) => r.id !== req.id)
                      );
                      refreshAll();
                    }}
                    className="px-2.5 py-1 border border-red-200 text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <h3 className="text-base font-bold font-legal text-stone-950 border-b border-stone-200 pb-2">
              Screen 34 · Editable Income Certificate Upload Guidelines
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!guideTitle.trim()) return;
                saveTableData("probono_guidelines", [
                  ...probonoGuidelines,
                  {
                    id: Date.now(),
                    title: guideTitle,
                    title_urdu: guideTitleUr || guideTitle,
                    description: guideDesc,
                    description_urdu: guideDescUr || guideDesc,
                  },
                ]);
                setGuideTitle("");
                setGuideTitleUr("");
                setGuideDesc("");
                setGuideDescUr("");
                refreshAll();
                flashBanner("Added Screen 34 Income Proof Guideline!");
              }}
              className="space-y-3 text-xs"
            >
              <input
                type="text"
                required
                placeholder="Guideline Heading (English)"
                value={guideTitle}
                onChange={(e) => setGuideTitle(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300"
              />
              <input
                type="text"
                dir="rtl"
                placeholder="اردو عنوان"
                value={guideTitleUr}
                onChange={(e) => setGuideTitleUr(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 font-urdu"
              />
              <textarea
                required
                placeholder="Guideline Explanation (English)"
                value={guideDesc}
                onChange={(e) => setGuideDesc(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 h-16"
              />
              <button
                type="submit"
                className="bg-[#064E3B] text-white px-4 py-2 font-semibold cursor-pointer"
              >
                + Add Screen 34 Guideline
              </button>
            </form>

            <div className="divide-y divide-stone-200 text-xs">
              {probonoGuidelines.map((g) => (
                <div
                  key={g.id}
                  className="py-2.5 flex items-center justify-between gap-2"
                >
                  <div>
                    <strong className="block text-stone-900">{g.title}</strong>
                    <span className="text-stone-500">{g.description}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      saveTableData(
                        "probono_guidelines",
                        probonoGuidelines.filter((x) => x.id !== g.id)
                      );
                      refreshAll();
                    }}
                    className="text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 7: AI PROMPTS (41), CITATIONS (42) & NOTIFICATIONS (57)
          ====================================================================== */}
      {activeTab === "ai_notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Screen 41: AI Prompt Suggestions */}
          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <h3 className="text-sm font-bold font-legal text-stone-950 border-b border-stone-200 pb-2">
              Screen 41 · AI Prompt Suggestions
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPromptEn.trim()) return;
                saveTableData("ai_prompts", [
                  ...aiPrompts,
                  {
                    id: Date.now(),
                    prompt_en: newPromptEn,
                    prompt_ur: newPromptUr || newPromptEn,
                    category: "Legal AI",
                  },
                ]);
                setNewPromptEn("");
                setNewPromptUr("");
                refreshAll();
                flashBanner("AI Prompt Suggestion added!");
              }}
              className="space-y-2.5 text-xs"
            >
              <input
                type="text"
                required
                placeholder="English Prompt Suggestion..."
                value={newPromptEn}
                onChange={(e) => setNewPromptEn(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300"
              />
              <input
                type="text"
                dir="rtl"
                placeholder="اردو پرامپٹ تجویز..."
                value={newPromptUr}
                onChange={(e) => setNewPromptUr(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 font-urdu"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#064E3B] text-white font-semibold cursor-pointer"
              >
                + Add AI Prompt (Screen 41)
              </button>
            </form>
            <div className="divide-y divide-stone-200 text-xs">
              {aiPrompts.map((p) => (
                <div
                  key={p.id}
                  className="py-2 flex items-center justify-between gap-2"
                >
                  <span>{p.prompt_en}</span>
                  <button
                    type="button"
                    onClick={() => {
                      saveTableData(
                        "ai_prompts",
                        aiPrompts.filter((x) => x.id !== p.id)
                      );
                      refreshAll();
                    }}
                    className="text-red-700 font-semibold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Screen 42: Citations */}
          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <h3 className="text-sm font-bold font-legal text-stone-950 border-b border-stone-200 pb-2">
              Screen 42 · Verified PLD / SCMR Citations
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!citCode.trim()) return;
                saveTableData("ai_citations", [
                  ...aiCitations,
                  {
                    id: Date.now(),
                    code: citCode,
                    title: citTitle,
                    court: citCourt,
                    summary: citSummary,
                  },
                ]);
                setCitCode("");
                setCitTitle("");
                setCitSummary("");
                refreshAll();
                flashBanner("Verified Citation added!");
              }}
              className="space-y-2.5 text-xs"
            >
              <input
                type="text"
                required
                placeholder="Citation Code (e.g. PLD 2025 SC 44)"
                value={citCode}
                onChange={(e) => setCitCode(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 font-mono-code"
              />
              <input
                type="text"
                required
                placeholder="Case Title"
                value={citTitle}
                onChange={(e) => setCitTitle(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300"
              />
              <textarea
                required
                placeholder="Ratio Decidendi / Holding Summary..."
                value={citSummary}
                onChange={(e) => setCitSummary(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 h-16"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#064E3B] text-white font-semibold cursor-pointer"
              >
                + Add Citation (Screen 42)
              </button>
            </form>
            <div className="divide-y divide-stone-200 text-xs">
              {aiCitations.map((c) => (
                <div
                  key={c.id}
                  className="py-2 flex items-center justify-between gap-2"
                >
                  <div>
                    <strong className="font-mono-code text-[#064E3B]">
                      {c.code}
                    </strong>{" "}
                    — {c.title}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      saveTableData(
                        "ai_citations",
                        aiCitations.filter((x) => x.id !== c.id)
                      );
                      refreshAll();
                    }}
                    className="text-red-700 font-semibold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Screen 57: Notifications Hub */}
          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <h3 className="text-sm font-bold font-legal text-stone-950 border-b border-stone-200 pb-2">
              Screen 57 · Push Notifications Hub
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!notifTitle.trim()) return;
                saveTableData("notifications", [
                  {
                    id: Date.now(),
                    title: notifTitle,
                    title_urdu: notifTitleUr || notifTitle,
                    message: notifMsg,
                    message_urdu: notifMsgUr || notifMsg,
                    time: "Just now",
                    type: "alert",
                  },
                  ...notifications,
                ]);
                setNotifTitle("");
                setNotifTitleUr("");
                setNotifMsg("");
                setNotifMsgUr("");
                refreshAll();
                flashBanner("Push Notification broadcast to Header Hub (Screen 57)!");
              }}
              className="space-y-2.5 text-xs"
            >
              <input
                type="text"
                required
                placeholder="Alert Title (English)"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300"
              />
              <input
                type="text"
                dir="rtl"
                placeholder="الرٹ کا اردو عنوان"
                value={notifTitleUr}
                onChange={(e) => setNotifTitleUr(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 font-urdu"
              />
              <textarea
                required
                placeholder="Alert Message..."
                value={notifMsg}
                onChange={(e) => setNotifMsg(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 h-16"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#064E3B] text-white font-semibold cursor-pointer"
              >
                + Broadcast Notification (Screen 57)
              </button>
            </form>
            <div className="divide-y divide-stone-200 text-xs">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="py-2 flex items-center justify-between gap-2"
                >
                  <span>{n.title}</span>
                  <button
                    type="button"
                    onClick={() => {
                      saveTableData(
                        "notifications",
                        notifications.filter((x) => x.id !== n.id)
                      );
                      refreshAll();
                    }}
                    className="text-red-700 font-semibold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 8: MASTHEAD, SPLASH & HERO PRECEDENT PLATE EDITOR (SCREENS 01 & 02)
          ====================================================================== */}
      {activeTab === "masthead" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSiteSettings(siteSettings);
            refreshAll();
            flashBanner(
              "Masthead, Splash Screen (01), and Hero Plate (02) updated across English & Urdu apps!"
            );
          }}
          className="bg-white border border-stone-300 p-6 sm:p-8 space-y-6"
        >
          <div>
            <span className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold block">
              Screens 01 & 02 · Global Brand, Masthead & Precedent Plate Configuration
            </span>
            <h2 className="text-xl font-bold font-legal text-stone-950">
              Edit Journal Masthead, Issue Metadata & Featured Precedent Plate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                English Masthead Title
              </label>
              <input
                type="text"
                value={siteSettings.masthead_title || ""}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    masthead_title: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300 font-legal font-bold"
              />
            </div>
            <div dir="rtl">
              <label className="block font-semibold text-stone-700 mb-1">
                اردو ماسٹ ہیڈ عنوان
              </label>
              <input
                type="text"
                value={siteSettings.masthead_title_urdu || ""}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    masthead_title_urdu: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300 font-urdu font-bold text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Volume & Issue Ribbon (English)
              </label>
              <input
                type="text"
                value={siteSettings.volume_issue || ""}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    volume_issue: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300"
              />
            </div>
            <div dir="rtl">
              <label className="block font-semibold text-stone-700 mb-1">
                جلد اور شمارہ (اردو)
              </label>
              <input
                type="text"
                value={siteSettings.volume_issue_urdu || ""}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    volume_issue_urdu: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300 font-urdu text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                English Editorial Subtitle
              </label>
              <textarea
                value={siteSettings.masthead_subtitle || ""}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    masthead_subtitle: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300 h-20"
              />
            </div>
            <div dir="rtl">
              <label className="block font-semibold text-stone-700 mb-1">
                اردو ذیلی عنوان
              </label>
              <textarea
                value={siteSettings.masthead_subtitle_urdu || ""}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    masthead_subtitle_urdu: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300 font-urdu text-sm h-20"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Hero Precedent Plate Citation Code
              </label>
              <input
                type="text"
                value={siteSettings.plate_citation || ""}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    plate_citation: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300 font-mono-code"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Advocate Cleared Escrow Wallet Balance (PKR - Screen 46)
              </label>
              <input
                type="number"
                value={siteSettings.escrow_cleared_pkr || 285000}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    escrow_cleared_pkr: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300 font-mono-code"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Hero Precedent Plate Quote (English)
              </label>
              <textarea
                value={siteSettings.plate_quote || ""}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    plate_quote: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300 h-20"
              />
            </div>
            <div dir="rtl">
              <label className="block font-semibold text-stone-700 mb-1">
                ہیرو پلیٹ اقتباس (اردو)
              </label>
              <textarea
                value={siteSettings.plate_quote_urdu || ""}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    plate_quote_urdu: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300 font-urdu text-sm h-20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#064E3B] text-white px-8 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Save Masthead & Global Platform Settings
          </button>
        </form>
      )}

      {/* Screen 51: Insert Media / YouTube Link Modal */}
      {mediaModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setMediaModalOpen(false)}
        >
          <div
            className="bg-white border border-stone-300 max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#064E3B]">
                Screen 51 · Insert Media / YouTube Link
              </span>
              <button onClick={() => setMediaModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="YouTube or Court Audio Embed URL..."
              className="w-full p-3 border border-stone-300 text-xs font-mono-code"
            />
            <input
              type="text"
              value={mediaCaption}
              onChange={(e) => setMediaCaption(e.target.value)}
              placeholder="Media Caption..."
              className="w-full p-3 border border-stone-300 text-xs"
            />
            <button
              type="button"
              onClick={() => {
                setContent(
                  (prev) =>
                    `${prev}\n\n[Embedded Legal Media: ${mediaCaption} — ${mediaUrl}]`
                );
                setMediaModalOpen(false);
              }}
              className="w-full py-2.5 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
            >
              Embed into Article Body
            </button>
          </div>
        </div>
      )}

      {/* Screen 52: Schedule Publishing Modal */}
      {scheduleModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setScheduleModalOpen(false)}
        >
          <div
            className="bg-white border border-stone-300 max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B48327]">
                Screen 52 · Schedule Editorial Release
              </span>
              <button onClick={() => setScheduleModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full p-3 border border-stone-300 text-xs font-mono-code"
            />
            <button
              type="button"
              onClick={() => {
                setScheduleModalOpen(false);
                handleSaveArticle(scheduledDate);
              }}
              className="w-full py-2.5 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
            >
              Confirm Scheduled Publication
            </button>
          </div>
        </div>
      )}
    </div>
  );
}