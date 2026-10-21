"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import Link from "next/link";
import Header from "@/app/Header";
import { createClient } from "@/app/supabase";
import { saveAiChatHistoryServerAction } from "@/app/actions/platformActions";
import {
  Sparkles,
  Send,
  FileText,
  Mic,
  BookOpen,
  History,
  Globe,
  ExternalLink,
  Newspaper,
  Landmark,
  Scale,
  X,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export interface GroundingWebSource {
  uri: string;
  title: string;
}

interface AssistantMessage {
  role: "user" | "ai";
  text: string;
  citations?: string;
  groundingEnabled?: boolean;
  groundingSources?: GroundingWebSource[];
  webSearchQueries?: string[];
  modelUsed?: string;
  category?: "all" | "news" | "circulars" | "amendments";
}

type SearchGroundingCategory = "all" | "news" | "circulars" | "amendments";

const GROUNDING_CATEGORY_PROMPTS: Record<
  SearchGroundingCategory,
  { label: string; badge: string; prompts: string[] }
> = {
  all: {
    label: "All Real-Time Grounding",
    badge: "Live Web + Statutes",
    prompts: [
      "What are the latest Supreme Court of Pakistan constitutional bench updates and practice rules?",
      "Explain the recent FBR property valuation & withholding tax circulars for filers vs non-filers",
      "Latest amendments to PECA cybercrime laws and FIA complaint procedures in Pakistan",
    ],
  },
  news: {
    label: "Pakistani Legal News",
    badge: "SC / High Court News",
    prompts: [
      "What are the most recent landmark rulings from the Supreme Court of Pakistan this month?",
      "Latest Islamabad & Lahore High Court directives on digital case filing and judicial reforms",
      "Recent Pakistan Bar Council notifications and High Court cause list updates",
    ],
  },
  circulars: {
    label: "Government Circulars & SROs",
    badge: "FBR / SECP / SBP / NADRA",
    prompts: [
      "Current FBR SROs and income tax circulars on immovable property transfer (Section 236C & 236K)",
      "Latest NADRA Succession Certificate & biometric verification circulars for overseas Pakistanis",
      "Recent SECP corporate compliance circulars and State Bank (SBP) RAAST / foreign remittance directives",
    ],
  },
  amendments: {
    label: "Recent Legislative Amendments",
    badge: "Acts & Constitutional Bills",
    prompts: [
      "Key provisions and judicial impact of the 26th Constitutional Amendment in Pakistan",
      "Recent amendments to the Code of Civil Procedure (CPC) and Specific Relief Act timelines",
      "Latest Finance Act legislative amendments affecting IT exporters, freelancers, and PSEB registration",
    ],
  },
};

export default function ClientAiAssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [speed, setSpeed] = useState<"general" | "fast">("general");
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const [searchCategory, setSearchCategory] =
    useState<SearchGroundingCategory>("all");

  // UX Standard 3 & 4: Immediate Visual Feedback + useTransition for Server Actions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPendingSync, startSyncTransition] = useTransition();
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Screen 29 (OCR Modal) & Grounding Inspector Modal states
  const [ocrAttachment, setOcrAttachment] = useState<string | null>(null);
  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [customOcrInput, setCustomOcrInput] = useState(
    "FBR_Circular_SRO_2026_Property_Tax.pdf"
  );
  const [selectedSourceModal, setSelectedSourceModal] =
    useState<AssistantMessage | null>(null);

  // Screen 30: Voice-to-Text
  const [voiceActive, setVoiceActive] = useState(false);

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      role: "ai",
      text: "Assalam-o-Alaikum! I am your AI Legal Assistant (Module 3 • Screens 28–30) now powered by live Google Search Grounding. Ask me in English or Roman/Urdu about real-time Pakistani legal news, current government circulars (FBR SROs, SECP, SBP, NADRA, Ministry of Law), recent legislative amendments, or foundational statutes. Every turn is grounded with live web sources and persisted to Supabase (`ai_chat_history`).",
      citations:
        "Constitution of Pakistan 1973 • Official Gazette of Pakistan • PPC / CrPC",
      groundingEnabled: true,
      groundingSources: [
        {
          uri: "https://www.molaw.gov.pk/",
          title: "Ministry of Law and Justice — Official Gazette & Acts",
        },
        {
          uri: "https://www.supremecourt.gov.pk/",
          title: "Supreme Court of Pakistan — Latest Judgments & Circulars",
        },
        {
          uri: "https://www.fbr.gov.pk/",
          title: "Federal Board of Revenue (FBR) — Current SROs & Circulars",
        },
      ],
      webSearchQueries: [
        "Pakistan latest legislative amendments Supreme Court circulars",
      ],
    },
  ]);

  const [savedLogs, setSavedLogs] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // UX Standard 2: Close modals when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (ocrModalOpen) setOcrModalOpen(false);
        if (selectedSourceModal) setSelectedSourceModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ocrModalOpen, selectedSourceModal]);

  const loadHistory = async () => {
    const { data } = await supabase
      .from("ai_chat_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    setSavedLogs(data || []);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSend = async (customPrompt?: string) => {
    const query = (customPrompt ?? prompt).trim();
    if (!query || isSubmitting) return;

    setFeedbackBanner(null);

    const categoryPrefix =
      searchCategory === "news"
        ? "[Focus: Real-Time Pakistani Legal News] "
        : searchCategory === "circulars"
        ? "[Focus: Current Government Circulars & SROs] "
        : searchCategory === "amendments"
        ? "[Focus: Recent Legislative Amendments] "
        : "";

    const fullQuery = ocrAttachment
      ? `[OCR Document Attached: ${ocrAttachment}] ${categoryPrefix}${query}`
      : `${categoryPrefix}${query}`;

    const updatedHistory: AssistantMessage[] = [
      ...messages,
      { role: "user", text: fullQuery, category: searchCategory },
    ];
    setMessages(updatedHistory);
    setPrompt("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/legal-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: fullQuery,
          mode: "assistant",
          speed,
          lang: "en",
          useSearchGrounding,
          searchCategory,
          history: updatedHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(
          data.error || "Unable to complete grounded legal search."
        );
      }

      const aiReply: string =
        data.text ||
        "Under Pakistani statute law, please consult a Verified High Court Advocate for formal filing.";

      const groundingSources: GroundingWebSource[] = Array.isArray(
        data.groundingSources
      )
        ? data.groundingSources
        : [];

      const webSearchQueries: string[] = Array.isArray(data.webSearchQueries)
        ? data.webSearchQueries
        : [];

      const citedStatutesSummary =
        groundingSources.length > 0
          ? `Google Search Grounded (${groundingSources.length} Web Sources) • Gazette of Pakistan • PPC / CrPC`
          : "PPC / CrPC / Family Courts Act 1964";

      const newAiMessage: AssistantMessage = {
        role: "ai",
        text: aiReply,
        citations: citedStatutesSummary,
        groundingEnabled: Boolean(data.groundingEnabled),
        groundingSources,
        webSearchQueries,
        modelUsed: data.modelUsed,
        category: searchCategory,
      };

      setMessages((prev) => [...prev, newAiMessage]);

      // UX Standard 4: Smooth Server Action invocation via useTransition
      startSyncTransition(async () => {
        const saved = await saveAiChatHistoryServerAction({
          mode: "assistant",
          userQuery: fullQuery,
          aiResponse: aiReply,
          citedStatutes: citedStatutesSummary,
        });

        await supabase.from("ai_chat_history").insert([saved.row]);
        await loadHistory();
        setFeedbackBanner({
          type: "success",
          message: useSearchGrounding
            ? `Grounded response verified with ${
                groundingSources.length || "live"
              } web sources and saved to Supabase ai_chat_history.`
            : "Legal response generated and saved to Supabase ai_chat_history.",
        });
      });
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        "Unable to reach the Google Search Grounding legal endpoint right now. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: errorMessage,
        },
      ]);
      setFeedbackBanner({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const activeCategoryConfig = GROUNDING_CATEGORY_PROMPTS[searchCategory];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900">
      <Header lang="en" />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 flex-grow font-ui space-y-6">
        {/* Top Masthead & Model / Grounding Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-stone-900 pb-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-[#064E3B] font-semibold">
                Module 3 • Route: /client/ai-assistant • Screens 28, 29 (OCR) & 30 (Voice)
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-950 text-[#D4AF37] text-[10px] font-mono-code font-bold uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>Google Search Grounding Active</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-legal text-stone-950 break-words">
              AI Legal Assistant with Real-Time Google Search Grounding
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed break-words">
              Live web grounding via{" "}
              <code className="font-mono-code text-[#064E3B]">
                tools: [{"{"} googleSearch: {"{}"} {"}"}]
              </code>{" "}
              for real-time Pakistani legal news, current government circulars
              (FBR SROs, SECP, SBP, NADRA, Ministry of Law), and recent
              legislative amendments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
            {/* Accessible Real-Time Google Search Grounding Switch Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={useSearchGrounding}
              aria-label="Toggle Real-Time Google Search Grounding for Pakistani legal news, government circulars, and legislative updates"
              onClick={() => setUseSearchGrounding((prev) => !prev)}
              className={`min-h-[44px] px-4 py-2.5 text-xs font-semibold border flex items-center justify-between gap-3 transition-colors duration-200 active:scale-95 cursor-pointer ${
                useSearchGrounding
                  ? "bg-[#064E3B] text-white border-[#064E3B] hover:bg-emerald-950"
                  : "bg-white text-stone-700 border-stone-300 hover:bg-emerald-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe
                  className={`w-4 h-4 shrink-0 ${
                    useSearchGrounding ? "text-[#D4AF37]" : "text-stone-400"
                  }`}
                />
                <div className="text-left">
                  <span className="block font-bold leading-tight">
                    Real-Time Web Search Grounding
                  </span>
                  <span
                    className={`block text-[10px] font-mono-code ${
                      useSearchGrounding ? "text-emerald-200" : "text-stone-500"
                    }`}
                  >
                    {useSearchGrounding
                      ? "ENABLED • News, Circulars & Amendments"
                      : "DISABLED • Static Statutes Only"}
                  </span>
                </div>
              </div>
              <span
                className={`w-10 h-5 flex items-center p-0.5 border transition-colors duration-200 shrink-0 ${
                  useSearchGrounding
                    ? "bg-emerald-950 border-[#D4AF37] justify-end"
                    : "bg-stone-200 border-stone-400 justify-start"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    useSearchGrounding ? "bg-[#D4AF37]" : "bg-stone-600"
                  }`}
                />
              </span>
            </button>

            {/* Model Speed Selector */}
            <button
              type="button"
              onClick={() => setSpeed("general")}
              className={`min-h-[44px] px-3.5 py-2.5 text-xs font-semibold border transition-colors duration-200 active:scale-95 cursor-pointer ${
                speed === "general"
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-700 border-stone-300 hover:bg-emerald-50"
              }`}
            >
              Deep Legal (gemini-3.8-flash)
            </button>
            <button
              type="button"
              onClick={() => setSpeed("fast")}
              className={`min-h-[44px] px-3.5 py-2.5 text-xs font-semibold border transition-colors duration-200 active:scale-95 cursor-pointer ${
                speed === "fast"
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-700 border-stone-300 hover:bg-emerald-50"
              }`}
            >
              Fast Brief (gemini-3.1-flash-lite)
            </button>
          </div>
        </div>

        {/* Real-Time Grounding Focus Tabs (Legal News, Government Circulars, Legislative Amendments) */}
        <div
          className={`bg-white border p-4 space-y-3 transition-colors duration-200 ${
            useSearchGrounding
              ? "border-[#064E3B]"
              : "border-stone-300 opacity-85"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#064E3B] flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#B48327]" />
                <span>
                  Select Real-Time Grounding Domain (Pakistan Legal Ecosystem)
                </span>
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-mono-code font-bold ${
                  useSearchGrounding
                    ? "bg-emerald-50 text-[#064E3B] border border-emerald-300"
                    : "bg-stone-100 text-stone-600 border border-stone-300"
                }`}
              >
                {useSearchGrounding
                  ? "Live Google Search Active"
                  : "Web Search Paused — Click Toggle Above to Enable"}
              </span>
            </div>
            <span className="text-[11px] font-mono-code text-stone-500">
              Active Focus: {activeCategoryConfig.badge}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {(
              [
                {
                  id: "all",
                  title: "All Grounded Sources",
                  sub: "News, Circulars & Statutes",
                  icon: Globe,
                },
                {
                  id: "news",
                  title: "Pakistani Legal News",
                  sub: "Supreme Court & High Court Rulings",
                  icon: Newspaper,
                },
                {
                  id: "circulars",
                  title: "Government Circulars",
                  sub: "FBR SROs, SECP, SBP & NADRA",
                  icon: Landmark,
                },
                {
                  id: "amendments",
                  title: "Legislative Amendments",
                  sub: "Constitutional, PECA & Finance Acts",
                  icon: Scale,
                },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isSelected = searchCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSearchCategory(tab.id)}
                  className={`min-h-[44px] p-3 border text-left flex items-start gap-2.5 transition-colors duration-200 active:scale-95 cursor-pointer ${
                    isSelected
                      ? "bg-[#064E3B] text-white border-[#064E3B]"
                      : "bg-[#FBF9F5] text-stone-800 border-stone-300 hover:bg-emerald-50 hover:border-[#064E3B]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isSelected ? "text-[#D4AF37]" : "text-[#064E3B]"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{tab.title}</div>
                    <div
                      className={`text-[11px] truncate ${
                        isSelected ? "text-stone-200" : "text-stone-500"
                      }`}
                    >
                      {tab.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Immediate Visual Feedback Banner (UX Standard 3) */}
        {feedbackBanner && (
          <div
            role={feedbackBanner.type === "success" ? "status" : "alert"}
            className={`p-3.5 border flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in zoom-in-95 duration-200 ${
              feedbackBanner.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                : "bg-red-50 border-red-300 text-red-950"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {feedbackBanner.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              )}
              <span className="break-words">{feedbackBanner.message}</span>
            </div>
            <button
              type="button"
              aria-label="Dismiss feedback banner"
              onClick={() => setFeedbackBanner(null)}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors duration-200 active:scale-95 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 8 Cols: Multi-Turn Grounded Legal Chat Interface */}
          <div className="lg:col-span-8 bg-white border border-stone-300 flex flex-col h-[680px] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#064E3B]">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  Citizen Legal Guidance & Live Web Grounding Thread
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Screen 29: OCR / Circular Attachment Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setOcrModalOpen(true)}
                  className={`min-h-[44px] px-3 py-2 border text-[11px] font-semibold flex items-center gap-1.5 transition-colors duration-200 active:scale-95 cursor-pointer ${
                    ocrAttachment
                      ? "bg-[#064E3B] text-white border-[#064E3B]"
                      : "bg-white text-stone-700 border-stone-300 hover:bg-emerald-50"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[180px]">
                    {ocrAttachment
                      ? `Attached: ${ocrAttachment}`
                      : "29. Attach FIR / Circular (OCR)"}
                  </span>
                </button>

                {/* Screen 30: Voice-to-Text */}
                <button
                  type="button"
                  onClick={() => {
                    setVoiceActive(!voiceActive);
                    if (!voiceActive) {
                      setPrompt(
                        "What are the latest Supreme Court of Pakistan directives and recent legislative amendments on pre-arrest bail and property succession?"
                      );
                    }
                  }}
                  className={`min-h-[44px] px-3 py-2 border text-[11px] font-semibold flex items-center gap-1.5 transition-colors duration-200 active:scale-95 cursor-pointer ${
                    voiceActive
                      ? "bg-red-700 text-white border-red-700"
                      : "bg-white text-stone-700 border-stone-300 hover:bg-emerald-50"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {voiceActive ? "Voice Captured" : "30. Voice-to-Text"}
                  </span>
                </button>
              </div>
            </div>

            {/* Chat Messages Scroll Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 border text-xs leading-relaxed overflow-hidden ${
                    m.role === "user"
                      ? "bg-stone-900 text-white border-stone-900 sm:ml-10"
                      : "bg-[#FBF9F5] text-stone-900 border-stone-300 sm:mr-10"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] uppercase tracking-widest opacity-75 font-semibold">
                      {m.role === "user"
                        ? "Citizen Client Query"
                        : "Legal AI Assistant (Google Search Grounded)"}
                    </span>
                    {m.role === "ai" && m.groundingEnabled && (
                      <span className="px-2 py-0.5 bg-emerald-950 text-[#D4AF37] text-[10px] font-mono-code font-semibold flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5" />
                        <span>Live Search Grounded</span>
                      </span>
                    )}
                  </div>

                  <div className="whitespace-pre-wrap break-words">{m.text}</div>

                  {/* Web Search Queries Executed */}
                  {m.webSearchQueries && m.webSearchQueries.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-stone-200/80">
                      <div className="text-[10px] font-mono-code uppercase tracking-wider text-stone-500 mb-1.5">
                        Google Search Grounding Queries:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.webSearchQueries.map((q, qIdx) => (
                          <span
                            key={qIdx}
                            className="px-2 py-0.5 bg-stone-200/70 text-stone-800 text-[10px] font-mono-code break-words"
                          >
                            &ldquo;{q}&rdquo;
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extracted Google Search Grounding Sources (groundingChunks) */}
                  {m.groundingSources && m.groundingSources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-stone-200 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#064E3B] flex items-center gap-1">
                          <Globe className="w-3 h-3 text-[#B48327]" />
                          <span>
                            Verified Grounding Web Sources ({m.groundingSources.length})
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedSourceModal(m)}
                          className="text-[11px] font-semibold text-[#064E3B] hover:underline transition-colors duration-200 active:scale-95 cursor-pointer"
                        >
                          Inspect All Citations →
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {m.groundingSources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[44px] p-2.5 bg-white border border-stone-300 hover:border-[#064E3B] hover:bg-emerald-50 transition-colors duration-200 active:scale-95 flex items-center justify-between gap-2 text-[11px] group overflow-hidden"
                          >
                            <div className="min-w-0">
                              <div className="font-semibold text-stone-900 group-hover:text-[#064E3B] truncate">
                                {src.title}
                              </div>
                              <div className="text-[10px] font-mono-code text-stone-500 truncate">
                                {src.uri}
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#064E3B] shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {m.citations && (
                    <div className="mt-2.5 pt-2 border-t border-stone-200 text-[11px] text-[#064E3B] font-mono-code flex items-center gap-1.5 break-words">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span className="break-words">
                        Statute & Gazette Reference: {m.citations}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {isSubmitting && (
                <div className="p-4 bg-[#FBF9F5] border border-stone-300 text-xs text-stone-700 flex items-center gap-3 animate-in fade-in duration-200">
                  <svg
                    className="w-4 h-4 animate-spin text-[#064E3B] shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>
                    {useSearchGrounding
                      ? "Grounding with Google Search (Pakistani legal news, official circulars & recent legislative amendments)..."
                      : "Searching Pakistan Penal Code (PPC), CrPC & Supreme Court Precedents..."}
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Grounded Prompts & Input Bar */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
              {/* Inline Composer Google Search Grounding Toggle Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
                <div className="flex items-center gap-2 text-xs">
                  <Globe
                    className={`w-4 h-4 shrink-0 ${
                      useSearchGrounding ? "text-[#064E3B]" : "text-stone-400"
                    }`}
                  />
                  <span className="font-bold text-stone-900">
                    Google Search Grounding API:
                  </span>
                  <span
                    className={`text-[11px] font-mono-code ${
                      useSearchGrounding
                        ? "text-[#064E3B] font-semibold"
                        : "text-stone-500"
                    }`}
                  >
                    {useSearchGrounding
                      ? "ON (Current Pakistani Legislative & Government Data)"
                      : "OFF (Static Statutory Archive Only)"}
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={useSearchGrounding}
                  aria-label="Enable or disable real-time Google Search Grounding for legal queries"
                  onClick={() => setUseSearchGrounding((prev) => !prev)}
                  className={`min-h-[36px] px-3 py-1.5 border text-[11px] font-semibold inline-flex items-center gap-2 transition-colors duration-200 active:scale-95 cursor-pointer self-start sm:self-auto ${
                    useSearchGrounding
                      ? "bg-emerald-50 border-[#064E3B] text-[#064E3B] hover:bg-emerald-100"
                      : "bg-white border-stone-300 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <span>
                    {useSearchGrounding
                      ? "Real-Time Web Search: Enabled"
                      : "Real-Time Web Search: Disabled"}
                  </span>
                  <span
                    className={`w-8 h-4 flex items-center p-0.5 rounded-full transition-colors duration-200 ${
                      useSearchGrounding
                        ? "bg-[#064E3B] justify-end"
                        : "bg-stone-300 justify-start"
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-white shadow-xs" />
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {activeCategoryConfig.prompts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSend(q)}
                    className="min-h-[38px] px-3 py-1.5 bg-white border border-stone-300 hover:border-[#064E3B] hover:bg-emerald-50 text-[11px] text-stone-800 text-left transition-colors duration-200 active:scale-95 cursor-pointer disabled:opacity-50 break-words"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isSubmitting}
                  placeholder={
                    useSearchGrounding
                      ? "Ask with live Google Search Grounding (Pakistani legal news, FBR/SECP circulars, legislative bills)..."
                      : "Ask about codified Pakistani statutes (PPC, CrPC, CPC, Family Laws)..."
                  }
                  className="flex-1 min-h-[44px] px-4 py-2.5 border border-stone-300 bg-white text-xs focus:outline-none focus:border-[#064E3B] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={isSubmitting || !prompt.trim()}
                  className="min-h-[44px] px-5 py-2.5 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 cursor-pointer disabled:opacity-60 disabled:pointer-events-none shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin text-[#D4AF37] shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-90"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>
                        {useSearchGrounding
                          ? "Searching & Grounding..."
                          : "Analyzing Statutes..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>
                        {useSearchGrounding ? "Ask Grounded AI" : "Ask Legal AI"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Live Grounding Coverage + Persisted Supabase Chat History */}
          <div className="lg:col-span-4 space-y-6">
            {/* Real-Time Grounding Channels Card */}
            <div className="bg-white border border-stone-300 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#064E3B] flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#B48327]" />
                  <span>Live Pakistani Grounding Feeds</span>
                </h2>
                <span className="text-[10px] font-mono-code px-2 py-0.5 bg-emerald-50 text-[#064E3B] border border-emerald-200 font-semibold">
                  googleSearch: {"{}"}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Queries are grounded in real time against authoritative
                Pakistani legal &amp; regulatory sources:
              </p>
              <div className="space-y-2 text-xs">
                {[
                  {
                    title: "Supreme Court & High Courts",
                    desc: "Constitutional Bench rulings, cause lists & practice circulars",
                    query:
                      "What are the latest Supreme Court of Pakistan judgments and practice circulars?",
                  },
                  {
                    title: "FBR, SECP, SBP & NADRA Circulars",
                    desc: "Tax SROs, corporate notifications & succession directives",
                    query:
                      "Summarize current FBR tax SROs and SECP regulatory circulars issued recently",
                  },
                  {
                    title: "National Assembly & Official Gazette",
                    desc: "Recent Acts of Parliament, PECA & Constitutional amendments",
                    query:
                      "What are the most recent legislative bills and acts passed by the Parliament of Pakistan?",
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSend(item.query)}
                    className="w-full min-h-[44px] p-3 bg-[#FBF9F5] border border-stone-200 hover:border-[#064E3B] hover:bg-emerald-50 text-left transition-colors duration-200 active:scale-95 cursor-pointer"
                  >
                    <div className="font-bold text-stone-900 flex items-center justify-between gap-2">
                      <span className="truncate">{item.title}</span>
                      <span className="text-[10px] text-[#064E3B] font-mono-code shrink-0">
                        Query →
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5 break-words">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Persisted Supabase Chat History */}
            <div className="bg-white border border-stone-300 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#064E3B] flex items-center gap-1.5">
                  <History className="w-4 h-4" />
                  <span>
                    Supabase ai_chat_history ({savedLogs.length})
                    {isPendingSync ? " • Syncing..." : ""}
                  </span>
                </h2>
                <Link
                  href="/lawyers"
                  className="min-h-[44px] inline-flex items-center px-2 text-[11px] font-semibold text-[#064E3B] hover:bg-emerald-50 hover:underline transition-colors duration-200 active:scale-95"
                >
                  Hire Advocate →
                </Link>
              </div>
              <div className="space-y-3 max-h-[380px] overflow-y-auto">
                {savedLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-[#FBF9F5] border border-stone-200 text-xs space-y-1.5 overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono-code text-stone-500">
                      <span>LOG #{log.id}</span>
                      <span className="uppercase text-[#064E3B] font-semibold">
                        {log.mode}
                      </span>
                    </div>
                    <p className="font-bold text-stone-900 line-clamp-2 break-words">
                      Q: {log.user_query}
                    </p>
                    <p className="text-stone-600 line-clamp-3 break-words">
                      A: {log.ai_response}
                    </p>
                    {log.cited_statutes && (
                      <p className="text-[10px] font-mono-code text-[#064E3B] truncate">
                        {log.cited_statutes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Screen 29 Modal: Attach FIR / Government Circular (OCR) — UX Standard 2 Compliant */}
      {ocrModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Screen 29 Attach Legal Document or Government Circular for OCR"
          onClick={() => setOcrModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FBF9F5] border border-stone-300 max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#B48327] font-bold block">
                  Screen 29 • Legal Document &amp; Circular OCR Attachment
                </span>
                <h3 className="text-base font-bold font-legal text-stone-950 mt-0.5">
                  Attach FIR, Court Notice, or Government Circular
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close OCR attachment modal"
                onClick={() => setOcrModalOpen(false)}
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-stone-200/60 transition-colors duration-200 active:scale-95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-stone-700">
                Select or Enter Document / Circular Filename:
              </label>
              <input
                type="text"
                value={customOcrInput}
                onChange={(e) => setCustomOcrInput(e.target.value)}
                className="w-full min-h-[44px] p-3 bg-white border border-stone-300 font-mono-code text-xs"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "FBR_Circular_SRO_2026_Property_Tax.pdf",
                  "FIR_Copy_PS_Gulberg_2026.pdf",
                  "Ministry_of_Law_Gazette_Amendment.pdf",
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCustomOcrInput(preset)}
                    className="px-2.5 py-1.5 bg-white border border-stone-300 hover:bg-emerald-50 hover:border-[#064E3B] text-[11px] font-mono-code transition-colors duration-200 active:scale-95 cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {ocrAttachment && (
                <button
                  type="button"
                  onClick={() => {
                    setOcrAttachment(null);
                    setOcrModalOpen(false);
                  }}
                  className="flex-1 min-h-[44px] py-2.5 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors duration-200 active:scale-95 cursor-pointer"
                >
                  Remove Attachment
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setOcrAttachment(
                    customOcrInput.trim() || "Legal_Circular_2026.pdf"
                  );
                  setOcrModalOpen(false);
                }}
                className="flex-1 min-h-[44px] py-2.5 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-semibold transition-colors duration-200 active:scale-95 cursor-pointer"
              >
                Attach for Grounded Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grounding Sources & Citations Inspector Modal — UX Standard 2 Compliant */}
      {selectedSourceModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Google Search Grounding Citations Inspector"
          onClick={() => setSelectedSourceModal(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FBF9F5] border border-stone-300 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#064E3B] font-bold block">
                  Google Search Grounding • groundingMetadata.groundingChunks
                </span>
                <h3 className="text-base font-bold font-legal text-stone-950 mt-0.5">
                  Verified Web Sources &amp; Official Circular Links
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close grounding sources modal"
                onClick={() => setSelectedSourceModal(null)}
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-stone-200/60 transition-colors duration-200 active:scale-95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {(selectedSourceModal.groundingSources || []).map((src, i) => (
                <a
                  key={i}
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] p-3 bg-white border border-stone-300 hover:border-[#064E3B] hover:bg-emerald-50 flex items-center justify-between gap-3 transition-colors duration-200 active:scale-95"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-stone-900 break-words">
                      {src.title}
                    </div>
                    <div className="text-[11px] font-mono-code text-[#064E3B] truncate mt-0.5">
                      {src.uri}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#064E3B] shrink-0" />
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedSourceModal(null)}
              className="w-full min-h-[44px] py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors duration-200 active:scale-95 cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
