"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  createClient,
  getTableData,
  saveTableData,
  getSiteSettings,
  saveSiteSettings,
  getCategoriesByScope,
  resetAllPlatformData,
  syncAllTablesFromSupabase,
  RBACRole,
  RBAC_ROLES,
  RBAC_ROLE_PERMISSIONS,
  normalizeRBACRole,
  getRolePermissions,
  getActiveRBACSession,
  switchActiveRBACRole,
  syncUserProfileAndSession,
  SyncedUserProfileSession,
  USERS_PROFILES_RLS_SQL,
  isOwnUserProfileRecord,
} from "@/app/supabase";
import {
  saveMagazinePostServerAction,
  deleteMagazinePostServerAction,
} from "@/app/actions/platformActions";
import { useAuthRBAC } from "@/app/AuthContext";
import {
  InlineSpinner,
  useEscapeToClose,
} from "@/app/components/SharedUI";
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
  ShieldCheck,
  Users,
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
  | "masthead"
  | "users_rbac";

export default function AdminDashboard() {
  const { verifyProfileRole } = useAuthRBAC();
  const [activeTab, setActiveTab] = useState<AdminSection>("users_rbac");
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
  const [isMutatingArticle, startArticleTransition] = useTransition();

  useEscapeToClose(mediaModalOpen, () => setMediaModalOpen(false));
  useEscapeToClose(scheduleModalOpen, () => setScheduleModalOpen(false));

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

  // 9. Users Profiles & 4-Role RBAC Manager (public.users_profiles) — Complete CRUD State
  const [usersProfiles, setUsersProfiles] = useState<any[]>([]);
  const [activeSession, setActiveSession] =
    useState<SyncedUserProfileSession | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("+92 300 ");
  const [newUserRole, setNewUserRole] = useState<RBACRole>("Client");
  const [newUserCity, setNewUserCity] = useState("Islamabad");
  const [newUserVerificationStatus, setNewUserVerificationStatus] = useState<
    "Verified" | "Under Review" | "Rejected"
  >("Verified");
  const [newUserBarId, setNewUserBarId] = useState("");
  const [newUserCourt, setNewUserCourt] = useState("Islamabad High Court");
  const [newUserLicenseUrl, setNewUserLicenseUrl] = useState("");
  const [newUserLangPref, setNewUserLangPref] = useState<"en" | "ur">("en");
  const [newUserThemePref, setNewUserThemePref] = useState<
    "light" | "dark" | "system"
  >("light");
  const [newUserCategories, setNewUserCategories] = useState(
    "Property & Inheritance, Constitutional Petitions"
  );
  const [newUserNotifications, setNewUserNotifications] = useState(true);
  const [newUserDeletionReq, setNewUserDeletionReq] = useState(false);
  const [syncAsActiveOnSave, setSyncAsActiveOnSave] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"ALL" | RBACRole>("ALL");
  const [userStatusFilter, setUserStatusFilter] = useState<
    "ALL" | "Verified" | "Under Review" | "Rejected"
  >("ALL");
  const [showRlsSqlModal, setShowRlsSqlModal] = useState(false);

  async function refreshAll() {
    await syncAllTablesFromSupabase();
    const [
      artRes,
      catRes,
      tplRes,
      qRes,
      appRes,
      leadsRes,
      msRes,
      netRes,
      pbReqRes,
      pbGuideRes,
      promptsRes,
      citRes,
      notifRes,
      settingsRes,
      usersRes,
    ] = await Promise.all([
      supabase.from("articles").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*"),
      supabase.from("templates").select("*"),
      supabase.from("questions").select("*"),
      supabase.from("appointments").select("*"),
      supabase.from("crm_leads").select("*"),
      supabase.from("case_milestones").select("*"),
      supabase.from("lawyer_network").select("*"),
      supabase.from("probono_requests").select("*"),
      supabase.from("probono_guidelines").select("*"),
      supabase.from("ai_prompts").select("*"),
      supabase.from("ai_citations").select("*"),
      supabase.from("notifications").select("*"),
      supabase.from("site_settings").select("*"),
      supabase.from("users_profiles").select("*"),
    ]);

    if (artRes.data) setArticles(artRes.data);
    if (catRes.data) setAllCategories(catRes.data);
    if (tplRes.data) setTemplates(tplRes.data);
    if (qRes.data) setQuestions(qRes.data);
    if (appRes.data) setAppointments(appRes.data);
    if (leadsRes.data) setCrmLeads(leadsRes.data);
    if (msRes.data) setMilestones(msRes.data);
    if (netRes.data) setNetworkPosts(netRes.data);
    if (pbReqRes.data) setProbonoRequests(pbReqRes.data);
    if (pbGuideRes.data) setProbonoGuidelines(pbGuideRes.data);
    if (promptsRes.data) setAiPrompts(promptsRes.data);
    if (citRes.data) setAiCitations(citRes.data);
    if (notifRes.data) setNotifications(notifRes.data);
    if (settingsRes.data && settingsRes.data[0]) setSiteSettings(settingsRes.data[0]);
    if (usersRes.data) setUsersProfiles(usersRes.data);
    setActiveSession(getActiveRBACSession());
  }

  useEffect(() => {
    refreshAll();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as AdminSection | null;
      if (
        tabParam &&
        [
          "articles",
          "categories",
          "templates",
          "qa",
          "crm_escrow",
          "probono",
          "ai_notifications",
          "masthead",
          "users_rbac",
        ].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
      const onSync = () => setActiveSession(getActiveRBACSession());
      window.addEventListener("plp_data_updated", onSync);
      return () => window.removeEventListener("plp_data_updated", onSync);
    }
  }, []);

  function resetUserProfileForm() {
    setEditingUserId(null);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPhone("+92 300 ");
    setNewUserRole("Client");
    setNewUserCity("Islamabad");
    setNewUserVerificationStatus("Verified");
    setNewUserBarId("");
    setNewUserCourt("Islamabad High Court");
    setNewUserLicenseUrl("");
    setNewUserLangPref("en");
    setNewUserThemePref("light");
    setNewUserCategories("Property & Inheritance, Constitutional Petitions");
    setNewUserNotifications(true);
    setNewUserDeletionReq(false);
    setSyncAsActiveOnSave(false);
  }

  function handleEditUserProfile(u: any) {
    setEditingUserId(u.id);
    setNewUserName(u.full_name || "");
    setNewUserEmail(u.email || "");
    setNewUserPhone(u.phone || "+92 300 ");
    setNewUserRole(normalizeRBACRole(u.role));
    setNewUserCity(u.city || "Islamabad");
    setNewUserVerificationStatus(u.verification_status || "Verified");
    setNewUserBarId(u.bar_council_id || "");
    setNewUserCourt(u.high_court || "Islamabad High Court");
    setNewUserLicenseUrl(u.bar_license_url || "");
    setNewUserLangPref(u.language_pref === "ur" ? "ur" : "en");
    setNewUserThemePref(
      u.theme_pref === "dark" || u.theme_pref === "system"
        ? u.theme_pref
        : "light"
    );
    setNewUserCategories(
      Array.isArray(u.interested_categories)
        ? u.interested_categories.join(", ")
        : u.interested_categories || "Property & Inheritance"
    );
    setNewUserNotifications(u.notifications_enabled !== false);
    setNewUserDeletionReq(Boolean(u.deletion_requested));
    setSyncAsActiveOnSave(false);
  }

  async function handleSaveUserProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!newUserName.trim()) {
      flashBanner("Please enter the user's Full Legal Name.");
      return;
    }
    const normalized = normalizeRBACRole(newUserRole);
    const categoriesArray = newUserCategories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const payload = {
      email:
        newUserEmail.trim() ||
        `${newUserName.toLowerCase().replace(/[^a-z0-9]/g, ".")}@legalbrief.pk`,
      phone: newUserPhone.trim() || "+92 300 0000000",
      full_name: newUserName.trim(),
      role: normalized,
      city: newUserCity,
      language_pref: newUserLangPref,
      theme_pref: newUserThemePref,
      notifications_enabled: newUserNotifications,
      interested_categories:
        categoriesArray.length > 0
          ? categoriesArray
          : ["Property & Inheritance"],
      bar_council_id:
        normalized === "Verified Advocate"
          ? newUserBarId.trim() || "PBC-HC-2026"
          : newUserBarId.trim(),
      high_court:
        normalized === "Verified Advocate"
          ? newUserCourt || "Islamabad High Court"
          : newUserCourt,
      bar_license_url:
        normalized === "Verified Advocate"
          ? newUserLicenseUrl.trim() ||
            `storage://bar-licenses/${(newUserBarId || "PBC").replace(/\s+/g, "_")}_License.pdf`
          : newUserLicenseUrl.trim(),
      verification_status: newUserVerificationStatus,
      rbac_permissions: RBAC_ROLE_PERMISSIONS[normalized],
      deletion_requested: newUserDeletionReq,
      updated_at: new Date().toISOString(),
    };

    const callerIsAdmin =
      !activeSession || normalizeRBACRole(activeSession.rbacRole) === "Admin";

    let targetId = editingUserId;
    if (editingUserId !== null) {
      const existingRow = usersProfiles.find(
        (u) => String(u.id) === String(editingUserId)
      );
      const updatePayload = callerIsAdmin
        ? payload
        : {
            email: payload.email,
            phone: payload.phone,
            full_name: payload.full_name,
            city: payload.city,
            language_pref: payload.language_pref,
            theme_pref: payload.theme_pref,
            notifications_enabled: payload.notifications_enabled,
            interested_categories: payload.interested_categories,
            bar_council_id: payload.bar_council_id,
            high_court: payload.high_court,
            bar_license_url: payload.bar_license_url,
            deletion_requested: payload.deletion_requested,
            updated_at: payload.updated_at,
          };

      const { error } = await supabase
        .from("users_profiles")
        .update(updatePayload)
        .eq("id", editingUserId);

      if (error) {
        flashBanner(error.message);
        return;
      }

      flashBanner(
        callerIsAdmin
          ? `Updated "${payload.full_name}" (ID #${editingUserId}) in Supabase public.users_profiles with role: ${normalized}!`
          : `RLS Self-Update (users_profiles_update_own_or_admin): Updated your own profile fields for "${
              payload.full_name
            }" (Role "${existingRow?.role || activeSession?.rbacRole}" preserved).`
      );
    } else {
      targetId = Date.now();
      const newRow = {
        id: targetId,
        ...payload,
        created_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("users_profiles").insert([newRow]);
      if (error) {
        flashBanner(error.message);
        return;
      }
      flashBanner(
        `Created "${payload.full_name}" in Supabase public.users_profiles with RBAC role: ${normalized}!`
      );
    }

    const isCurrentActiveUser =
      activeSession &&
      (activeSession.id === targetId ||
        (activeSession.phoneOrEmail &&
          (activeSession.phoneOrEmail.toLowerCase() ===
            payload.email.toLowerCase() ||
            activeSession.phoneOrEmail === payload.phone)));

    if (syncAsActiveOnSave || isCurrentActiveUser) {
      const effectiveRole = callerIsAdmin
        ? normalized
        : activeSession?.rbacRole || normalized;
      const synced = await syncUserProfileAndSession({
        phoneOrEmail: payload.email || payload.phone,
        fullName: payload.full_name,
        city: payload.city,
        role: effectiveRole,
        barCouncilId: payload.bar_council_id,
        highCourt: payload.high_court,
        barLicenseUrl: payload.bar_license_url,
        verificationStatus: callerIsAdmin
          ? payload.verification_status
          : undefined,
        interests: payload.interested_categories,
        lang: payload.language_pref,
      });
      setActiveSession(synced);
      await verifyProfileRole();
    }

    resetUserProfileForm();
    await refreshAll();
  }

  const flashBanner = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(""), 4000);
  };

  /* ---- 1. ARTICLES HANDLERS ---- */
  function handleSaveArticle(customSchedule?: string) {
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

    startArticleTransition(async () => {
      await saveMagazinePostServerAction({
        id: editingArtId,
        ...payload,
      });

      if (editingArtId) {
        await supabase.from("articles").update(payload).eq("id", editingArtId);
        flashBanner(
          "Updated briefing in magazine_posts & revalidated public routes ('/', '/magazine/[id]')!"
        );
      } else {
        await supabase.from("articles").insert([payload]);
        flashBanner(
          "Published new briefing to magazine_posts & revalidated '/' immediately!"
        );
      }
      resetArticleForm();
      await refreshAll();
    });
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

  function deleteArticle(id: number) {
    startArticleTransition(async () => {
      await deleteMagazinePostServerAction(id);
      await supabase.from("articles").delete().eq("id", id);
      await refreshAll();
      flashBanner("Briefing deleted & revalidated public routes.");
    });
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

      {/* Module 5 RBAC Role Enforcement Banner */}
      <div className="p-4 bg-white border border-stone-300 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#064E3B] shrink-0" />
          <div>
            <div className="font-bold text-stone-950">
              Module 5 RBAC Status:{" "}
              <span className="text-[#064E3B]">
                {activeSession
                  ? `${activeSession.name} (${activeSession.rbacRole})`
                  : "Guest / Unauthenticated"}
              </span>
            </div>
            <p className="text-stone-600 mt-0.5">
              <strong>Editorial Manager</strong> unlocks Editorial Supply (Tabs 1, 2, 3, 8).{" "}
              <strong>Admin</strong> unlocks all 9 Tabs including Escrow Overrides, Bar Roll Approvals &{" "}
              <code>public.users_profiles</code> RBAC Manager.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {RBAC_ROLES.map((r) => {
            const isCurrent = activeSession?.rbacRole === r;
            return (
              <button
                key={r}
                type="button"
                onClick={async () => {
                  const synced = await switchActiveRBACRole(r);
                  setActiveSession(synced);
                  refreshAll();
                  flashBanner(
                    `Session & public.users_profiles synced to RBAC Role: ${r}`
                  );
                }}
                className={`px-3 py-1.5 font-semibold border cursor-pointer ${
                  isCurrent
                    ? "bg-[#064E3B] text-white border-[#064E3B]"
                    : "bg-stone-50 text-stone-800 border-stone-300 hover:border-[#064E3B]"
                }`}
              >
                {isCurrent ? `Active: ${r}` : `Switch to ${r}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 9-Tab Master Admin Control Bar */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-stone-200/80 border border-stone-300 text-xs font-semibold">
        {(
          [
            { id: "articles", label: `1. Posts & Media (50–52) [${articles.length}]`, editorialAllowed: true },
            { id: "categories", label: `2. Categories & Cities [${allCategories.length}]`, editorialAllowed: true },
            { id: "templates", label: `3. Templates (08–09) [${templates.length}]`, editorialAllowed: true },
            { id: "qa", label: `4. Q&A & Replies (10, 31, 43) [${questions.length}]`, editorialAllowed: false },
            { id: "crm_escrow", label: `5. Escrow, Leads & CRM (22–49)`, editorialAllowed: false },
            { id: "probono", label: `6. Pro-Bono & Guidelines (33–34, 48)`, editorialAllowed: false },
            { id: "ai_notifications", label: `7. AI Prompts, Citations & Alerts (40–42, 57)`, editorialAllowed: false },
            { id: "masthead", label: `8. Masthead, Splash & Hero Plate (01–02)`, editorialAllowed: true },
            { id: "users_rbac", label: `9. Users & RBAC Roles [${usersProfiles.length}]`, editorialAllowed: false },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              const perms = getRolePermissions(activeSession?.rbacRole || "Admin");
              if (
                activeSession &&
                !perms.canManageFullAdminAndUsers &&
                (!perms.canManageEditorialCMS || !tab.editorialAllowed)
              ) {
                flashBanner(
                  `RBAC Notice: Tab "${tab.label}" requires Admin role (or Editorial Manager for Editorial tabs). Click "Switch to Admin" above to unlock.`
                );
              }
              setActiveTab(tab.id);
            }}
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
              disabled={isMutatingArticle}
              onClick={() => handleSaveArticle()}
              className="bg-[#064E3B] text-white px-8 py-3 min-h-[44px] text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isMutatingArticle && <InlineSpinner className="w-4 h-4 text-[#D4AF37]" />}
              <span>
                {isMutatingArticle
                  ? "Processing..."
                  : editingArtId
                  ? "Save Changes to Briefing"
                  : "Publish Post Live to English & Urdu Apps"}
              </span>
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

      {/* ======================================================================
          TAB 9: USERS PROFILES & 4-ROLE RBAC MANAGER (public.users_profiles)
          ====================================================================== */}
      {activeTab === "users_rbac" && (
        <div className="space-y-8">
          {/* Role Breakdown & Supabase Sync Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              type="button"
              onClick={() => setUserRoleFilter("ALL")}
              className={`p-4 border text-left transition cursor-pointer ${
                userRoleFilter === "ALL"
                  ? "bg-[#064E3B] text-white border-[#064E3B]"
                  : "bg-white text-stone-900 border-stone-300 hover:border-[#064E3B]"
              }`}
            >
              <span className="text-[10px] uppercase tracking-widest font-mono-code block opacity-80">
                public.users_profiles
              </span>
              <div className="text-2xl font-bold font-legal mt-1">
                {usersProfiles.length}
              </div>
              <span className="text-[11px] font-semibold">
                All Synced Users
              </span>
            </button>

            {RBAC_ROLES.map((r) => {
              const count = usersProfiles.filter(
                (u) => normalizeRBACRole(u.role) === r
              ).length;
              const isSelected = userRoleFilter === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() =>
                    setUserRoleFilter(isSelected ? "ALL" : r)
                  }
                  className={`p-4 border text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-[#064E3B] text-white border-[#064E3B]"
                      : "bg-white text-stone-900 border-stone-300 hover:border-[#064E3B]"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-widest font-mono-code block opacity-80">
                    RBAC Role
                  </span>
                  <div className="text-2xl font-bold font-legal mt-1">
                    {count}
                  </div>
                  <span className="text-[11px] font-semibold">{r}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white border border-stone-300 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold block">
                  Supabase Table: public.users_profiles · Row Level Security (RLS) & 4-Role RBAC CRUD
                </span>
                <h2 className="text-xl font-bold font-legal text-stone-950">
                  {editingUserId !== null
                    ? `Edit User Profile #${editingUserId} (${newUserName || "Profile"})`
                    : "Create or Update User Profiles & Sync RBAC Roles"}
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  RLS Enforced: Only <strong>Admin</strong> can perform CRUD on other user records and assign roles (<strong>Client</strong>, <strong>Verified Advocate</strong>, <strong>Editorial Manager</strong>, <strong>Admin</strong>). Non-Admin users can only update their own profile fields.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {activeSession && (
                  <button
                    type="button"
                    onClick={() => {
                      const ownRow = usersProfiles.find((u) =>
                        isOwnUserProfileRecord(u, activeSession)
                      );
                      if (ownRow) {
                        handleEditUserProfile(ownRow);
                        flashBanner(
                          `Loaded your own profile (#${ownRow.id} ${ownRow.full_name}) for RLS self-profile update.`
                        );
                      }
                    }}
                    className="px-3 py-2 bg-emerald-950/10 border border-[#064E3B] text-xs font-semibold text-[#064E3B] hover:bg-[#064E3B] hover:text-white cursor-pointer"
                  >
                    Edit My Own Profile
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowRlsSqlModal(!showRlsSqlModal)}
                  className="px-3 py-2 bg-stone-900 text-[#D4AF37] text-xs font-semibold cursor-pointer"
                >
                  {showRlsSqlModal
                    ? "Hide RLS Policies SQL"
                    : "View / Copy RLS Policies SQL"}
                </button>
                {editingUserId !== null && (
                  <button
                    type="button"
                    onClick={resetUserProfileForm}
                    className="px-3 py-2 border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    await refreshAll();
                    await verifyProfileRole();
                    flashBanner(
                      "Re-synced all records from Supabase public.users_profiles & verified active session role."
                    );
                  }}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-xs font-semibold text-stone-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#064E3B]" />
                  <span>Sync Supabase Table</span>
                </button>
              </div>
            </div>

            {/* Active Supabase RLS Policy Enforcement Matrix */}
            <div className="p-4 bg-stone-50 border border-stone-300 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
                  <span>
                    Supabase Row Level Security (RLS) Active on{" "}
                    <code className="font-mono-code text-[#064E3B]">
                      public.users_profiles
                    </code>
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 font-mono-code font-bold ${
                    !activeSession ||
                    normalizeRBACRole(activeSession.rbacRole) === "Admin"
                      ? "bg-[#064E3B] text-white"
                      : "bg-amber-100 text-amber-900 border border-amber-300"
                  }`}
                >
                  {!activeSession ||
                  normalizeRBACRole(activeSession.rbacRole) === "Admin"
                    ? "public.is_admin_user() = TRUE (Full CRUD on All User Records)"
                    : `public.is_admin_user() = FALSE (Role: ${activeSession.rbacRole} · Self-Profile Update Only)`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px]">
                <div className="p-2.5 bg-white border border-stone-200">
                  <div className="font-mono-code font-bold text-[#064E3B]">
                    1. SELECT Policy
                  </div>
                  <div className="text-stone-600 mt-0.5">
                    <code>auth.uid() = auth_uid OR public.is_admin_user()</code>
                  </div>
                </div>
                <div className="p-2.5 bg-white border border-stone-200">
                  <div className="font-mono-code font-bold text-[#064E3B]">
                    2. INSERT Policy
                  </div>
                  <div className="text-stone-600 mt-0.5">
                    <code>public.is_admin_user()</code> (or own initial signup)
                  </div>
                </div>
                <div className="p-2.5 bg-white border border-stone-200">
                  <div className="font-mono-code font-bold text-[#064E3B]">
                    3. UPDATE Policy + Column Trigger
                  </div>
                  <div className="text-stone-600 mt-0.5">
                    Admin all rows/columns; users own profile fields only (role locked)
                  </div>
                </div>
                <div className="p-2.5 bg-white border border-stone-200">
                  <div className="font-mono-code font-bold text-[#064E3B]">
                    4. DELETE Policy
                  </div>
                  <div className="text-stone-600 mt-0.5">
                    <code>USING (public.is_admin_user())</code> — Admin strictly required
                  </div>
                </div>
              </div>

              {showRlsSqlModal && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-code text-[11px] font-bold text-stone-800">
                      PostgreSQL RLS Policies & Trigger for public.users_profiles:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.clipboard) {
                          navigator.clipboard.writeText(USERS_PROFILES_RLS_SQL);
                          flashBanner(
                            "Copied public.users_profiles RLS policies SQL to clipboard!"
                          );
                        }
                      }}
                      className="px-3 py-1 bg-[#064E3B] text-white font-semibold text-[11px] cursor-pointer"
                    >
                      Copy RLS SQL
                    </button>
                  </div>
                  <pre className="p-3 bg-stone-950 text-emerald-300 font-mono-code text-[11px] overflow-x-auto max-h-72 leading-relaxed">
                    {USERS_PROFILES_RLS_SQL}
                  </pre>
                </div>
              )}
            </div>

            {/* Complete Create / Edit CRUD Form for public.users_profiles */}
            <form
              onSubmit={handleSaveUserProfile}
              className="bg-stone-50 p-5 border border-stone-300 space-y-4 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div className="font-bold text-stone-900 uppercase tracking-wider">
                  {editingUserId !== null
                    ? !activeSession ||
                      normalizeRBACRole(activeSession.rbacRole) === "Admin"
                      ? `Admin CRUD: Updating Record ID #${editingUserId} in public.users_profiles`
                      : `RLS Self-Profile Update: Editing Your Own Profile Fields (#${editingUserId})`
                    : "New Record for public.users_profiles (Admin Only under RLS)"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">Selected Role Permissions:</span>
                  <span
                    className={`px-2.5 py-0.5 font-mono-code font-semibold text-[11px] ${
                      RBAC_ROLE_PERMISSIONS[newUserRole].badgeColor
                    }`}
                  >
                    {newUserRole} · Modules{" "}
                    {RBAC_ROLE_PERMISSIONS[newUserRole].modules.join(", ")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Full Legal Name (full_name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Adv. Tariq Mehmood, ASC"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Email Address (email) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@legalbrief.pk"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 font-mono-code"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    +92 Phone Number (phone) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+92 300 5550199"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 font-mono-code"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    RBAC Role (user_profiles.role) *{" "}
                    {activeSession &&
                      normalizeRBACRole(activeSession.rbacRole) !== "Admin" && (
                        <span className="text-[10px] text-amber-800 font-mono-code">
                          [RLS Admin Only]
                        </span>
                      )}
                  </label>
                  <select
                    value={newUserRole}
                    disabled={
                      Boolean(activeSession) &&
                      normalizeRBACRole(activeSession?.rbacRole) !== "Admin"
                    }
                    onChange={(e) => setNewUserRole(e.target.value as RBACRole)}
                    className="w-full p-2.5 bg-white border border-[#064E3B] font-bold text-[#064E3B] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {RBAC_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    City / Jurisdiction (city)
                  </label>
                  <select
                    value={newUserCity}
                    onChange={(e) => setNewUserCity(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300"
                  >
                    {[
                      "Islamabad",
                      "Lahore",
                      "Karachi",
                      "Peshawar",
                      "Quetta",
                      "Rawalpindi",
                      "Multan",
                      "Faisalabad",
                    ].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Bar Verification Status (verification_status){" "}
                    {activeSession &&
                      normalizeRBACRole(activeSession.rbacRole) !== "Admin" && (
                        <span className="text-[10px] text-amber-800 font-mono-code">
                          [RLS Admin Only]
                        </span>
                      )}
                  </label>
                  <select
                    value={newUserVerificationStatus}
                    disabled={
                      Boolean(activeSession) &&
                      normalizeRBACRole(activeSession?.rbacRole) !== "Admin"
                    }
                    onChange={(e) =>
                      setNewUserVerificationStatus(
                        e.target.value as "Verified" | "Under Review" | "Rejected"
                      )
                    }
                    className="w-full p-2.5 bg-white border border-stone-300 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Under Review">Under Review (Screen 20)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Bar Council Roll ID (bar_council_id)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., PBC-SC-44912"
                    value={newUserBarId}
                    onChange={(e) => setNewUserBarId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 font-mono-code"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Enrolled Court (high_court)
                  </label>
                  <select
                    value={newUserCourt}
                    onChange={(e) => setNewUserCourt(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300"
                  >
                    <option value="">None / Not Applicable</option>
                    <option value="Supreme Court of Pakistan">
                      Supreme Court of Pakistan
                    </option>
                    <option value="Islamabad High Court">
                      Islamabad High Court
                    </option>
                    <option value="Lahore High Court">Lahore High Court</option>
                    <option value="Sindh High Court">Sindh High Court</option>
                    <option value="Peshawar High Court">
                      Peshawar High Court
                    </option>
                    <option value="Balochistan High Court">
                      Balochistan High Court
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Bar License Storage URI (bar_license_url)
                  </label>
                  <input
                    type="text"
                    placeholder="storage://bar-licenses/PBC_License.pdf"
                    value={newUserLicenseUrl}
                    onChange={(e) => setNewUserLicenseUrl(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 font-mono-code"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Language Preference (language_pref)
                  </label>
                  <select
                    value={newUserLangPref}
                    onChange={(e) =>
                      setNewUserLangPref(e.target.value as "en" | "ur")
                    }
                    className="w-full p-2.5 bg-white border border-stone-300"
                  >
                    <option value="en">English (LTR - en)</option>
                    <option value="ur">Urdu (RTL - ur)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Theme Mode (theme_pref - Screen 60)
                  </label>
                  <select
                    value={newUserThemePref}
                    onChange={(e) =>
                      setNewUserThemePref(
                        e.target.value as "light" | "dark" | "system"
                      )
                    }
                    className="w-full p-2.5 bg-white border border-stone-300"
                  >
                    <option value="light">Light (Crisp Paper)</option>
                    <option value="dark">Dark (Charcoal Slate)</option>
                    <option value="system">System Default</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Interested Legal Categories (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Property & Inheritance, Tax..."
                    value={newUserCategories}
                    onChange={(e) => setNewUserCategories(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300"
                  />
                </div>
              </div>

              {/* Checkboxes & Submit Bar */}
              <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUserNotifications}
                      onChange={(e) =>
                        setNewUserNotifications(e.target.checked)
                      }
                      className="accent-[#064E3B]"
                    />
                    <span>Notifications Enabled (Screen 57)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-red-800">
                    <input
                      type="checkbox"
                      checked={newUserDeletionReq}
                      onChange={(e) => setNewUserDeletionReq(e.target.checked)}
                      className="accent-red-700"
                    />
                    <span>Account Deletion Requested (Screen 58)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#064E3B]">
                    <input
                      type="checkbox"
                      checked={syncAsActiveOnSave}
                      onChange={(e) => setSyncAsActiveOnSave(e.target.checked)}
                      className="accent-[#064E3B]"
                    />
                    <span>
                      Also activate & verify this profile as current session on save
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  {editingUserId !== null && (
                    <button
                      type="button"
                      onClick={resetUserProfileForm}
                      className="px-4 py-2.5 bg-white border border-stone-300 text-stone-700 font-semibold cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#064E3B] hover:bg-emerald-950 text-white font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    {editingUserId !== null
                      ? `Update Profile #${editingUserId} in Supabase`
                      : "+ Create Profile in Supabase (users_profiles)"}
                  </button>
                </div>
              </div>
            </form>

            {/* Search & Filter Controls for public.users_profiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <input
                type="text"
                placeholder="Search by Name, Email, +92 Phone, Bar ID, or City..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-300"
              />
              <select
                value={userRoleFilter}
                onChange={(e) =>
                  setUserRoleFilter(e.target.value as "ALL" | RBACRole)
                }
                className="p-2.5 bg-stone-50 border border-stone-300 font-semibold"
              >
                <option value="ALL">Filter by RBAC Role: All 4 Roles</option>
                {RBAC_ROLES.map((r) => (
                  <option key={r} value={r}>
                    Role: {r}
                  </option>
                ))}
              </select>
              <select
                value={userStatusFilter}
                onChange={(e) =>
                  setUserStatusFilter(
                    e.target.value as
                      | "ALL"
                      | "Verified"
                      | "Under Review"
                      | "Rejected"
                  )
                }
                className="p-2.5 bg-stone-50 border border-stone-300 font-semibold"
              >
                <option value="ALL">
                  Filter by Verification Status: All Statuses
                </option>
                <option value="Verified">Status: Verified</option>
                <option value="Under Review">Status: Under Review</option>
                <option value="Rejected">Status: Rejected</option>
              </select>
            </div>

            {/* Complete CRUD List of public.users_profiles */}
            <div className="divide-y divide-stone-200 border border-stone-200">
              {usersProfiles
                .filter((u) => {
                  const roleNorm = normalizeRBACRole(u.role);
                  if (userRoleFilter !== "ALL" && roleNorm !== userRoleFilter) {
                    return false;
                  }
                  const status = u.verification_status || "Verified";
                  if (
                    userStatusFilter !== "ALL" &&
                    status !== userStatusFilter
                  ) {
                    return false;
                  }
                  if (userSearchQuery.trim()) {
                    const q = userSearchQuery.toLowerCase();
                    const hay = `${u.full_name || ""} ${u.email || ""} ${
                      u.phone || ""
                    } ${u.bar_council_id || ""} ${u.city || ""} ${roleNorm}`.toLowerCase();
                    return hay.includes(q);
                  }
                  return true;
                })
                .map((u) => {
                  const currentRole = normalizeRBACRole(u.role);
                  const perm = RBAC_ROLE_PERMISSIONS[currentRole];
                  const isCurrentSession =
                    activeSession &&
                    (activeSession.id === u.id ||
                      (u.email &&
                        activeSession.phoneOrEmail?.toLowerCase() ===
                          u.email.toLowerCase()));

                  return (
                    <div
                      key={u.id}
                      className={`p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition ${
                        editingUserId === u.id
                          ? "bg-amber-50/70 border-l-4 border-[#B48327]"
                          : isCurrentSession
                          ? "bg-emerald-950/5 border-l-4 border-[#064E3B]"
                          : "bg-white"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono-code text-stone-400">
                            #{u.id}
                          </span>
                          <strong className="text-sm font-legal text-stone-950">
                            {u.full_name}
                          </strong>
                          <span
                            className={`text-[10px] px-2 py-0.5 font-mono-code font-semibold ${perm.badgeColor}`}
                          >
                            {currentRole} · Modules {perm.modules.join(", ")}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 font-mono-code font-semibold border ${
                              u.verification_status === "Under Review"
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : u.verification_status === "Rejected"
                                ? "bg-red-50 text-red-800 border-red-300"
                                : "bg-emerald-50 text-[#064E3B] border-emerald-200"
                            }`}
                          >
                            {u.verification_status || "Verified"}
                          </span>
                          {isCurrentSession && (
                            <span className="text-[10px] px-2 py-0.5 bg-[#064E3B] text-[#D4AF37] font-mono-code font-bold uppercase">
                              Active Verified Session (Own Profile)
                            </span>
                          )}
                          {!isCurrentSession &&
                            activeSession &&
                            normalizeRBACRole(activeSession.rbacRole) !==
                              "Admin" && (
                              <span className="text-[10px] px-2 py-0.5 bg-stone-200 text-stone-700 font-mono-code font-semibold">
                                RLS Protected · Admin Only
                              </span>
                            )}
                          {u.deletion_requested && (
                            <span className="text-[10px] px-2 py-0.5 bg-red-700 text-white font-mono-code font-semibold">
                              Deletion Requested
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-stone-600 font-mono-code flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>{u.email || "No email"}</span>
                          <span>·</span>
                          <span>{u.phone || "No phone"}</span>
                          <span>·</span>
                          <span>City: {u.city || "Islamabad"}</span>
                          <span>·</span>
                          <span>
                            Prefs: {String(u.language_pref || "en").toUpperCase()} /{" "}
                            {u.theme_pref || "light"}
                          </span>
                          {u.bar_council_id && (
                            <>
                              <span>·</span>
                              <span className="text-[#064E3B] font-semibold">
                                Bar ID: {u.bar_council_id} ({u.high_court || "High Court"})
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {perm.canBookAndPostQA && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 border border-stone-300 text-stone-700">
                              Client Workspace (21–34)
                            </span>
                          )}
                          {perm.canAccessAdvocateCRM && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 text-[#064E3B]">
                              Lawyer CRM (35–49)
                            </span>
                          )}
                          {perm.canAccessAIResearcherPro && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-900">
                              AI Researcher Pro (40)
                            </span>
                          )}
                          {perm.canManageEditorialCMS && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-stone-200 border border-stone-400 text-stone-900">
                              Editorial Supply CMS
                            </span>
                          )}
                          {perm.canManageFullAdminAndUsers && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-stone-900 text-[#D4AF37] font-semibold">
                              Full Super Admin & RBAC
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {/* Quick Role Assignment Dropdown synced with Supabase & guarded by RLS */}
                        <select
                          aria-label={`Assign RBAC role for ${u.full_name}`}
                          value={currentRole}
                          onChange={async (e) => {
                            const nextRole = normalizeRBACRole(e.target.value);
                            const { error } = await supabase
                              .from("users_profiles")
                              .update({
                                role: nextRole,
                                rbac_permissions:
                                  RBAC_ROLE_PERMISSIONS[nextRole],
                                updated_at: new Date().toISOString(),
                              })
                              .eq("id", u.id);

                            if (error) {
                              flashBanner(error.message);
                              return;
                            }

                            if (isCurrentSession) {
                              const synced = await switchActiveRBACRole(
                                nextRole
                              );
                              setActiveSession(synced);
                              await verifyProfileRole();
                            }
                            await refreshAll();
                            flashBanner(
                              `Synced ${u.full_name}'s role in Supabase public.users_profiles → ${nextRole}`
                            );
                          }}
                          className="px-2.5 py-1.5 border border-stone-300 bg-stone-50 font-semibold cursor-pointer"
                        >
                          {RBAC_ROLES.map((r) => (
                            <option key={r} value={r}>
                              Role: {r}
                            </option>
                          ))}
                        </select>

                        {/* Quick Verification Status Dropdown synced with Supabase & guarded by RLS */}
                        <select
                          aria-label={`Verification status for ${u.full_name}`}
                          value={u.verification_status || "Verified"}
                          onChange={async (e) => {
                            const nextStatus = e.target.value;
                            const { error } = await supabase
                              .from("users_profiles")
                              .update({
                                verification_status: nextStatus,
                                updated_at: new Date().toISOString(),
                              })
                              .eq("id", u.id);
                            if (error) {
                              flashBanner(error.message);
                              return;
                            }
                            await refreshAll();
                            await verifyProfileRole();
                            flashBanner(
                              `Updated verification_status for ${u.full_name} to ${nextStatus} in Supabase`
                            );
                          }}
                          className="px-2.5 py-1.5 border border-stone-300 bg-white cursor-pointer"
                        >
                          <option value="Verified">Verified</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Rejected">Rejected</option>
                        </select>

                        {/* Full Edit / Self-Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const callerIsAdmin =
                              !activeSession ||
                              normalizeRBACRole(activeSession.rbacRole) ===
                                "Admin";
                            if (!callerIsAdmin && !isCurrentSession) {
                              flashBanner(
                                `RLS Policy Violation (users_profiles_update_own_or_admin): Role "${activeSession?.rbacRole}" can only edit their own profile fields. Switch to Admin to edit "${u.full_name}".`
                              );
                              return;
                            }
                            handleEditUserProfile(u);
                          }}
                          className="px-2.5 py-1.5 border border-stone-300 hover:border-[#064E3B] text-stone-800 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>
                            {isCurrentSession &&
                            activeSession &&
                            normalizeRBACRole(activeSession.rbacRole) !==
                              "Admin"
                              ? "Edit Own Fields"
                              : "Edit"}
                          </span>
                        </button>

                        {/* Activate / Impersonate Profile Session */}
                        <button
                          type="button"
                          onClick={async () => {
                            const synced = await syncUserProfileAndSession({
                              phoneOrEmail: u.email || u.phone,
                              fullName: u.full_name,
                              city: u.city,
                              role: currentRole,
                              barCouncilId: u.bar_council_id,
                              highCourt: u.high_court,
                              barLicenseUrl: u.bar_license_url,
                              verificationStatus: u.verification_status,
                              interests: u.interested_categories,
                              lang: u.language_pref,
                            });
                            setActiveSession(synced);
                            await verifyProfileRole();
                            await refreshAll();
                            flashBanner(
                              `Active session synced to ${u.full_name} (${currentRole}) via public.users_profiles`
                            );
                          }}
                          className="px-3 py-1.5 bg-[#064E3B] text-white font-semibold cursor-pointer"
                        >
                          Use Role Session
                        </button>

                        {/* Delete Profile from Supabase (Admin Only under RLS) */}
                        <button
                          type="button"
                          onClick={async () => {
                            const { error } = await supabase
                              .from("users_profiles")
                              .delete()
                              .eq("id", u.id);
                            if (error) {
                              flashBanner(error.message);
                              return;
                            }
                            if (editingUserId === u.id) {
                              resetUserProfileForm();
                            }
                            await refreshAll();
                            flashBanner(
                              `Deleted user profile "${u.full_name}" (#${u.id}) from public.users_profiles.`
                            );
                          }}
                          className="px-2.5 py-1.5 border border-red-200 text-red-700 hover:bg-red-50 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Screen 51: Insert Media / YouTube Link Modal */}
      {mediaModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Screen 51 Insert Media Link Modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setMediaModalOpen(false)}
        >
          <div
            className="bg-white border border-stone-300 max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#064E3B]">
                Screen 51 · Insert Media / YouTube Link
              </span>
              <button
                type="button"
                aria-label="Close Insert Media Modal"
                onClick={() => setMediaModalOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-stone-100 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
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
              className="w-full py-2.5 min-h-[44px] bg-[#064E3B] hover:bg-emerald-950 active:scale-[0.98] transition-all duration-200 text-white text-xs font-semibold cursor-pointer"
            >
              Embed into Article Body
            </button>
          </div>
        </div>
      )}

      {/* Screen 52: Schedule Publishing Modal */}
      {scheduleModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Screen 52 Schedule Editorial Release Modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setScheduleModalOpen(false)}
        >
          <div
            className="bg-white border border-stone-300 max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B48327]">
                Screen 52 · Schedule Editorial Release
              </span>
              <button
                type="button"
                aria-label="Close Schedule Publishing Modal"
                onClick={() => setScheduleModalOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-stone-100 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
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
              className="w-full py-2.5 min-h-[44px] bg-[#064E3B] hover:bg-emerald-950 active:scale-[0.98] transition-all duration-200 text-white text-xs font-semibold cursor-pointer"
            >
              Confirm Scheduled Publication
            </button>
          </div>
        </div>
      )}
    </div>
  );
}