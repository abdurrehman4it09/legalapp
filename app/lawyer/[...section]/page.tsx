"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Header from "@/app/Header";
import { createClient } from "@/app/supabase";
import {
  updateLeadOrCaseStatusServerAction,
  upsertCaseMilestoneServerAction,
  submitAdvocateForumAnswerServerAction,
  updateLawyerAvailabilityServerAction,
  requestWalletWithdrawalServerAction,
  saveAiChatHistoryServerAction,
} from "@/app/actions/platformActions";
import { useAuthRBAC } from "@/app/AuthContext";
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Calendar,
  Wallet,
  Award,
  Sparkles,
  Plus,
  Send,
  ShieldCheck,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function LawyerCatchAllCRMPageInner({
  params,
}: {
  params: Promise<{ section: string[] }>;
}) {
  const resolved = use(params);
  const segments = resolved?.section || ["dashboard"];
  const primarySection = segments[0] || "dashboard";
  const subId = segments[1] || "1";

  const { session: user, checkModuleAccess, switchRoleAndVerify } = useAuthRBAC();
  const hasLawyerAccess = checkModuleAccess("lawyer_crm").allowed;

  const [leads, setLeads] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any>(null);
  const [escrowList, setEscrowList] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Forms state
  const [msCaseRef, setMsCaseRef] = useState(`CASE-LHR-2026-0${subId}`);
  const [msTitle, setMsTitle] = useState("");
  const [msStatus, setMsStatus] = useState("In Progress");
  const [msDate, setMsDate] = useState("2026-11-05");
  const [msNotes, setMsNotes] = useState("");

  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});

  const [workDays, setWorkDays] = useState("Monday – Saturday");
  const [workHours, setWorkHours] = useState("09:00 AM – 06:00 PM PKT");
  const [slotsInput, setSlotsInput] = useState(
    "11:00 AM (Video), 02:30 PM (Chamber), 04:30 PM (Video)"
  );
  const [blockedInput, setBlockedInput] = useState("2026-11-09, 2026-12-25");

  const [iban, setIban] = useState("PK36MEZN0001020304050607");
  const [bankName, setBankName] = useState("Meezan Bank (RAAST Instant)");
  const [withdrawAmount, setWithdrawAmount] = useState("45000");

  // AI Researcher Pro state
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const loadCRMData = async () => {
    const [
      leadsRes,
      appRes,
      msRes,
      qRes,
      availRes,
      escRes,
      withRes,
    ] = await Promise.all([
      supabase.from("crm_leads").select("*"),
      supabase
        .from("appointments_and_cases")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("case_milestones").select("*"),
      supabase
        .from("forum_questions")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("lawyer_availability").select("*").limit(1),
      supabase.from("escrow_transactions").select("*"),
      supabase
        .from("withdrawal_requests")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    setLeads(leadsRes.data || []);
    setAppointments(appRes.data || []);
    setMilestones(msRes.data || []);
    setQuestions(qRes.data || []);
    if (availRes.data?.[0]) {
      const av = availRes.data[0];
      setAvailability(av);
      if (av.working_days) setWorkDays(av.working_days);
      if (av.working_hours) setWorkHours(av.working_hours);
    }
    setEscrowList(escRes.data || []);
    setWithdrawals(withRes.data || []);
  };

  useEffect(() => {
    loadCRMData();
    if (typeof window !== "undefined") {
      window.addEventListener("plp_data_updated", loadCRMData);
      return () => window.removeEventListener("plp_data_updated", loadCRMData);
    }
  }, []);

  const notify = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(null), 4000);
  };

  const handleLeadDecision = async (
    id: number,
    table: "crm_leads" | "appointments_and_cases",
    status: string
  ) => {
    await updateLeadOrCaseStatusServerAction({ id, table, status });
    await supabase.from(table).update({ status }).eq("id", id);
    notify(`Updated ${table} #${id} -> ${status}`);
    await loadCRMData();
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msTitle.trim()) return;
    const res = await upsertCaseMilestoneServerAction({
      caseRef: msCaseRef,
      title: msTitle,
      status: msStatus,
      date: msDate,
      privateLawyerNotes: msNotes,
    });
    await supabase.from("case_milestones").upsert([res.row]);
    setMsTitle("");
    setMsNotes("");
    notify(`Milestone "${res.row.title}" saved to public.case_milestones!`);
    await loadCRMData();
  };

  const handlePostForumAnswer = async (questionId: number) => {
    const text = replyTexts[questionId]?.trim();
    if (!text) return;
    const lawyerName = user?.name || "Barrister Sikandar Hayat";
    const res = await submitAdvocateForumAnswerServerAction({
      questionId,
      lawyerId: 1,
      lawyerName,
      court: "Supreme Court of Pakistan",
      replyText: text,
    });
    await supabase
      .from("forum_questions")
      .update({
        answer_count: 1,
        verified_reply: res.verifiedReply,
      })
      .eq("id", questionId);
    setReplyTexts((prev) => ({ ...prev, [questionId]: "" }));
    notify(
      `Published verified legal opinion & awarded +10 Reputation Points in Supabase!`
    );
    await loadCRMData();
  };

  const handleSaveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    const lawyerName = user?.name || "Barrister Sikandar Hayat";
    const res = await updateLawyerAvailabilityServerAction({
      id: availability?.id || 1,
      lawyerName,
      workingDays: workDays,
      workingHours: workHours,
      availableSlots: slotsInput.split(",").map((s) => s.trim()),
      blockedDates: blockedInput.split(",").map((s) => s.trim()),
    });
    await supabase.from("lawyer_availability").upsert([res.row]);
    notify("Updated public.lawyer_availability roster in Supabase!");
    await loadCRMData();
  };

  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const lawyerName = user?.name || "Barrister Sikandar Hayat";
    const res = await requestWalletWithdrawalServerAction({
      lawyerName,
      iban,
      bankName,
      amountPkr: Number(withdrawAmount) || 45000,
    });
    await supabase.from("withdrawal_requests").insert([res.row]);
    notify(
      `Withdrawal Request of PKR ${Number(
        withdrawAmount
      ).toLocaleString()} logged to public.withdrawal_requests!`
    );
    await loadCRMData();
  };

  const handleRunAIResearcher = async () => {
    if (!aiQuery.trim() || aiLoading) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/legal-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiQuery,
          mode: "researcher",
          speed: "general",
          lang: "en",
        }),
      });
      const data = await res.json();
      const text = data.text || "Precedent memo generated.";
      setAiResponse(text);
      await saveAiChatHistoryServerAction({
        mode: "researcher",
        userQuery: aiQuery,
        aiResponse: text,
        citedStatutes: "PLD / SCMR / CLC Precedent Archive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const navItems = [
    { href: "/lawyer/dashboard", key: "dashboard", label: "35. CRM Dashboard" },
    { href: "/lawyer/leads", key: "leads", label: "36–37. Lead Requests" },
    {
      href: "/lawyer/cases/1",
      key: "cases",
      label: "38–39. Case Workspace & Milestones",
    },
    {
      href: "/lawyer/reputation-desk",
      key: "reputation-desk",
      label: "43–44. Reputation Desk (+10 Pts)",
    },
    {
      href: "/lawyer/calendar",
      key: "calendar",
      label: "45. Availability Roster",
    },
    {
      href: "/lawyer/wallet",
      key: "wallet",
      label: "46–47. Escrow Wallet & RAAST",
    },
    {
      href: "/lawyer/ai-researcher",
      key: "ai-researcher",
      label: "40–42. AI Researcher Pro",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900">
      <Header lang="en" />

      {/* Sub-navigation bar for Module 4 Lawyer CRM routes */}
      <div className="bg-stone-950 text-stone-200 border-b border-stone-800 px-6 py-3 font-ui">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#D4AF37] text-stone-950 text-[10px] font-bold uppercase tracking-widest">
              Module 4 • Lawyer CRM
            </span>
            <span className="text-xs font-semibold text-white">
              Route: /lawyer/{segments.join("/")}
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-xs">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`px-3 py-1.5 transition-colors ${
                  primarySection === item.key
                    ? "bg-[#064E3B] text-white font-semibold border border-[#D4AF37]"
                    : "text-stone-300 hover:bg-stone-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-grow font-ui space-y-8">
        {!hasLawyerAccess && (
          <div className="p-5 bg-amber-50 border border-[#B48327] flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#B48327] font-bold block">
                RBAC Guard • Verified Advocate / Admin Required for Module 4 Writes
              </span>
              <p className="text-xs text-stone-700">
                Your active role is currently{" "}
                <strong>{user?.rbacRole || "Client"}</strong>. Switch to{" "}
                <strong>Verified Advocate</strong> to unlock full CRM mutations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => switchRoleAndVerify("Verified Advocate")}
              className="px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
            >
              Activate Verified Advocate Session →
            </button>
          </div>
        )}

        {statusBanner && (
          <div className="p-4 bg-emerald-950 text-[#D4AF37] border border-[#D4AF37] text-xs font-semibold flex items-center justify-between">
            <span>{statusBanner}</span>
            <button
              onClick={() => setStatusBanner(null)}
              className="text-white underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* KPI Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-stone-300 p-4">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 block">
              Appointments & Leads
            </span>
            <strong className="text-2xl font-bold font-mono-code text-stone-950">
              {appointments.length + leads.length}
            </strong>
          </div>
          <div className="bg-white border border-stone-300 p-4">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 block">
              Active Milestones
            </span>
            <strong className="text-2xl font-bold font-mono-code text-[#064E3B]">
              {milestones.length}
            </strong>
          </div>
          <div className="bg-white border border-stone-300 p-4">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 block">
              Escrow Held / Settled
            </span>
            <strong className="text-2xl font-bold font-mono-code text-[#B48327]">
              PKR{" "}
              {escrowList
                .reduce((acc, r) => acc + Number(r.lawyer_share_pkr || 0), 0)
                .toLocaleString()}
            </strong>
          </div>
          <div className="bg-white border border-stone-300 p-4">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 block">
              Reputation Score
            </span>
            <strong className="text-2xl font-bold font-mono-code text-[#064E3B]">
              985 Pts
            </strong>
          </div>
        </div>

        {/* SECTION: LEADS & APPOINTMENTS (/lawyer/dashboard & /lawyer/leads) */}
        {(primarySection === "dashboard" || primarySection === "leads") && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-300 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#064E3B] font-bold block">
                    Screens 35–37 • SELECT & UPDATE appointments_and_cases / crm_leads
                  </span>
                  <h2 className="text-lg font-bold font-legal text-stone-950">
                    Client Consultation Leads & Escrow Bookings
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {appointments.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-[#FBF9F5] border border-stone-200 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono-code font-bold text-[#064E3B]">
                          #{app.id}
                        </span>
                        <strong className="text-stone-950">
                          {app.client_name}
                        </strong>
                        <span className="px-2 py-0.5 bg-stone-900 text-white text-[10px]">
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        Date: {app.date} • Slot: {app.time_slot} • Fee: PKR{" "}
                        {Number(app.fee || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleLeadDecision(
                            app.id,
                            "appointments_and_cases",
                            "Accepted by Advocate"
                          )
                        }
                        className="px-3 py-1.5 bg-[#064E3B] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Case</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleLeadDecision(
                            app.id,
                            "appointments_and_cases",
                            "Declined (Escrow Refunded)"
                          )
                        }
                        className="px-3 py-1.5 border border-red-300 text-red-700 bg-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <Link
                        href={`/lawyer/cases/${app.id}`}
                        className="px-3 py-1.5 border border-stone-900 text-stone-900 text-xs font-semibold"
                      >
                        Open Case Workspace →
                      </Link>
                    </div>
                  </div>
                ))}

                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 bg-white border border-stone-200 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono-code text-[#B48327] font-bold">
                          CRM LEAD #{lead.id}
                        </span>
                        <strong>{lead.client_name}</strong>
                        <span className="px-2 py-0.5 bg-amber-100 text-stone-900 text-[10px] font-semibold">
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        {lead.case_title} • {lead.court} • Offer: PKR{" "}
                        {Number(lead.fee_offered || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleLeadDecision(lead.id, "crm_leads", "Accepted")
                        }
                        className="px-3 py-1.5 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                      >
                        Accept Lead
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleLeadDecision(lead.id, "crm_leads", "Declined")
                        }
                        className="px-3 py-1.5 border border-red-300 text-red-700 text-xs font-semibold cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: ACTIVE CASE WORKSPACE & MILESTONES (/lawyer/cases/[id] or /lawyer/dashboard) */}
        {(primarySection === "cases" || primarySection === "dashboard") && (
          <div className="bg-white border border-stone-300 p-6 space-y-5">
            <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#064E3B] font-bold block">
                  Route: /lawyer/cases/{subId} • Screens 38 & 39 • UPDATE case_milestones
                </span>
                <h2 className="text-lg font-bold font-legal text-stone-950">
                  Active Case Workspace & Milestone Tracker
                </h2>
              </div>
              <Link
                href={`/chat/CASE-LHR-2026-0${subId}`}
                className="px-3.5 py-2 bg-stone-900 text-white text-xs font-semibold"
              >
                Open Real-Time Case Chat →
              </Link>
            </div>

            <form
              onSubmit={handleAddMilestone}
              className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-[#FBF9F5] p-4 border border-stone-200"
            >
              <input
                type="text"
                value={msCaseRef}
                onChange={(e) => setMsCaseRef(e.target.value)}
                placeholder="Case Ref"
                className="px-3 py-2 border border-stone-300 bg-white text-xs"
              />
              <input
                type="text"
                value={msTitle}
                onChange={(e) => setMsTitle(e.target.value)}
                placeholder="Milestone Title (e.g. Written Statement Filed)"
                className="px-3 py-2 border border-stone-300 bg-white text-xs sm:col-span-2"
              />
              <select
                value={msStatus}
                onChange={(e) => setMsStatus(e.target.value)}
                className="px-3 py-2 border border-stone-300 bg-white text-xs"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Upcoming">Upcoming</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-[#064E3B] text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Milestone</span>
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className="p-4 border border-stone-200 bg-[#FBF9F5] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-code font-bold text-[#064E3B]">
                      {m.case_ref}
                    </span>
                    <span className="px-2 py-0.5 bg-stone-900 text-white text-[10px]">
                      {m.status}
                    </span>
                  </div>
                  <strong className="block text-sm text-stone-950">
                    {m.title}
                  </strong>
                  <p className="text-stone-500">
                    Date: {m.date} • File: {m.shared_file}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: REPUTATION DESK (/lawyer/reputation-desk) */}
        {(primarySection === "reputation-desk" ||
          primarySection === "dashboard") && (
          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <div className="border-b border-stone-200 pb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#B48327] font-bold block">
                Route: /lawyer/reputation-desk • Screens 43 & 44 • INSERT INTO forum_answers + +10 Reputation Points
              </span>
              <h2 className="text-lg font-bold font-legal text-stone-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#064E3B]" />
                <span>Advocate Reputation Desk (Public Citizen Q&A)</span>
              </h2>
            </div>

            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 bg-[#FBF9F5] border border-stone-200 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#064E3B]">
                      {q.category} • {q.city}
                    </span>
                    <span className="text-stone-500">{q.author_name}</span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-950">
                    {q.title}
                  </h3>
                  {q.verified_reply ? (
                    <div className="p-3 bg-emerald-950/5 border-l-2 border-[#064E3B] text-xs space-y-1">
                      <strong className="text-[#064E3B] block">
                        Verified Opinion by {q.verified_reply.lawyer_name} (
                        {q.verified_reply.court})
                      </strong>
                      <p className="text-stone-700">{q.verified_reply.reply}</p>
                    </div>
                  ) : null}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyTexts[q.id] || ""}
                      onChange={(e) =>
                        setReplyTexts((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                      placeholder="Write an authoritative legal response to earn +10 Reputation Points..."
                      className="flex-1 px-3 py-2 border border-stone-300 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handlePostForumAnswer(q.id)}
                      className="px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                    >
                      Publish Answer (+10 Pts)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: CALENDAR (/lawyer/calendar) */}
        {(primarySection === "calendar" || primarySection === "dashboard") && (
          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <div className="border-b border-stone-200 pb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#064E3B] font-bold block">
                Route: /lawyer/calendar • Screen 45 • INSERT / UPDATE lawyer_availability
              </span>
              <h2 className="text-lg font-bold font-legal text-stone-950 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#064E3B]" />
                <span>Chamber & Video Consultation Availability Roster</span>
              </h2>
            </div>

            <form
              onSubmit={handleSaveAvailability}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
            >
              <div>
                <label className="font-semibold block mb-1">Working Days</label>
                <input
                  type="text"
                  value={workDays}
                  onChange={(e) => setWorkDays(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">
                  Consultation Hours
                </label>
                <input
                  type="text"
                  value={workHours}
                  onChange={(e) => setWorkHours(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">
                  Available Time Slots (comma-separated)
                </label>
                <input
                  type="text"
                  value={slotsInput}
                  onChange={(e) => setSlotsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">
                  Blocked Court Dates (comma-separated)
                </label>
                <input
                  type="text"
                  value={blockedInput}
                  onChange={(e) => setBlockedInput(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
                >
                  Sync Availability Roster to Supabase
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SECTION: WALLET (/lawyer/wallet) */}
        {(primarySection === "wallet" || primarySection === "dashboard") && (
          <div className="bg-white border border-stone-300 p-6 space-y-5">
            <div className="border-b border-stone-200 pb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#B48327] font-bold block">
                Route: /lawyer/wallet • Screens 46 & 47 • SELECT escrow_transactions + INSERT withdrawal_requests
              </span>
              <h2 className="text-lg font-bold font-legal text-stone-950 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#064E3B]" />
                <span>Escrow Earnings Ledger & RAAST IBAN Withdrawals</span>
              </h2>
            </div>

            <form
              onSubmit={handleRequestWithdrawal}
              className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#FBF9F5] p-4 border border-stone-200 text-xs"
            >
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="PK36MEZN..."
                className="px-3 py-2 border border-stone-300 bg-white font-mono-code"
              />
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank Name"
                className="px-3 py-2 border border-stone-300 bg-white"
              />
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount (PKR)"
                className="px-3 py-2 border border-stone-300 bg-white font-mono-code"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#064E3B] text-white font-bold cursor-pointer"
              >
                Request RAAST Payout
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <h3 className="font-bold uppercase tracking-wider text-stone-700">
                  Escrow Transactions ({escrowList.length})
                </h3>
                {escrowList.map((e) => (
                  <div
                    key={e.id}
                    className="p-3 bg-[#FBF9F5] border border-stone-200 flex justify-between"
                  >
                    <div>
                      <strong className="block">{e.client_name}</strong>
                      <span className="text-stone-500">
                        {e.accounting_state}
                      </span>
                    </div>
                    <strong className="font-mono-code text-[#064E3B]">
                      PKR {Number(e.lawyer_share_pkr || 0).toLocaleString()}
                    </strong>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h3 className="font-bold uppercase tracking-wider text-stone-700">
                  Withdrawal Requests ({withdrawals.length})
                </h3>
                {withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 bg-[#FBF9F5] border border-stone-200 flex justify-between"
                  >
                    <div>
                      <strong className="font-mono-code block">{w.iban}</strong>
                      <span className="text-stone-500">{w.status}</span>
                    </div>
                    <strong className="font-mono-code text-stone-900">
                      PKR {Number(w.amount_pkr || 0).toLocaleString()}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: AI RESEARCHER PRO (/lawyer/ai-researcher) */}
        {(primarySection === "ai-researcher" ||
          primarySection === "dashboard") && (
          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <div className="border-b border-stone-200 pb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#064E3B] font-bold block">
                Route: /lawyer/ai-researcher • Screens 40–42 • Advanced Case Law RAG & Citation Retrieval
              </span>
              <h2 className="text-lg font-bold font-legal text-stone-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#064E3B]" />
                <span>AI Researcher Pro (PLD / SCMR / CLC Precedent Engine)</span>
              </h2>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Draft a Constitutional Writ Petition under Article 199 or retrieve SCMR precedents on Specific Performance..."
                className="flex-1 px-4 py-2.5 border border-stone-300 text-xs"
              />
              <button
                type="button"
                onClick={handleRunAIResearcher}
                disabled={aiLoading}
                className="px-5 py-2.5 bg-stone-900 text-[#D4AF37] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{aiLoading ? "Researching..." : "Run RAG Research"}</span>
              </button>
            </div>

            {aiResponse && (
              <div className="p-4 bg-[#FBF9F5] border border-stone-300 text-xs whitespace-pre-wrap leading-relaxed">
                {aiResponse}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function LawyerCatchAllCRMPage({ params }: { params: Promise<any> }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FBF9F5] p-10 text-center text-xs text-stone-500">Loading...</div>}>
      <LawyerCatchAllCRMPageInner params={params} />
    </React.Suspense>
  );
}
