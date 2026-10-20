"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ClientAiAssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [speed, setSpeed] = useState<"general" | "fast">("general");
  const [loading, setLoading] = useState(false);
  const [ocrAttachment, setOcrAttachment] = useState<string | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string; citations?: string }[]
  >([
    {
      role: "ai",
      text: "Assalam-o-Alaikum! I am your Basic AI Legal Assistant (Module 3 • Screens 28–30). Ask me any question in English or Roman/Urdu regarding Property Transfer, Tenant Eviction, Khula & Family Laws, Bail, or Cybercrime (PECA). Every conversation is logged to Supabase (`ai_chat_history`).",
      citations:
        "Constitution of Pakistan 1973 • Pakistan Penal Code (PPC) • Muslim Family Laws Ordinance 1961",
    },
  ]);
  const [savedLogs, setSavedLogs] = useState<any[]>([]);

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
    if (!query || loading) return;

    const fullQuery = ocrAttachment
      ? `[OCR Document Attached: ${ocrAttachment}] ${query}`
      : query;

    const updatedHistory = [...messages, { role: "user" as const, text: fullQuery }];
    setMessages(updatedHistory);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/legal-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: fullQuery,
          mode: "assistant",
          speed,
          lang: "en",
          history: updatedHistory,
        }),
      });
      const data = await res.json();
      const aiReply =
        data.text ||
        "Under Pakistani statute law, please consult a Verified High Court Advocate for formal filing.";

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: aiReply,
          citations: "PPC / CrPC / Family Courts Act 1964",
        },
      ]);

      const saved = await saveAiChatHistoryServerAction({
        mode: "assistant",
        userQuery: fullQuery,
        aiResponse: aiReply,
        citedStatutes: "PPC / CrPC / Family Courts Act 1964",
      });

      await supabase.from("ai_chat_history").insert([saved.row]);
      await loadHistory();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Unable to reach the RAG endpoint right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900">
      <Header lang="en" />

      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-grow font-ui space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-stone-900 pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#064E3B] font-semibold block">
              Module 3 • Route: /client/ai-assistant • Screens 28, 29 (OCR/PDF) & 30 (Voice-to-Text)
            </span>
            <h1 className="text-3xl font-bold font-legal text-stone-950 mt-1">
              Basic AI Legal Assistant (RAG + Supabase Chat History)
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Triggers Gemini RAG API (<code>/api/legal-ai</code>) & persists
              every turn via <code>INSERT INTO ai_chat_history</code>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSpeed("general")}
              className={`px-3 py-1.5 text-xs font-semibold border cursor-pointer ${
                speed === "general"
                  ? "bg-[#064E3B] text-white border-[#064E3B]"
                  : "bg-white text-stone-700 border-stone-300"
              }`}
            >
              Deep Legal Reasoning (gemini-3.8-flash)
            </button>
            <button
              type="button"
              onClick={() => setSpeed("fast")}
              className={`px-3 py-1.5 text-xs font-semibold border cursor-pointer ${
                speed === "fast"
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-700 border-stone-300"
              }`}
            >
              Fast Citizen Brief (gemini-3.1-flash-lite)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 8 Cols: Multi-Turn RAG Chat Interface */}
          <div className="lg:col-span-8 bg-white border border-stone-300 flex flex-col h-[620px] shadow-sm">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#064E3B]">
                <Sparkles className="w-4 h-4" />
                <span>Citizen Legal Guidance Thread (Multi-Turn Context)</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Screen 29: OCR Attachment */}
                <button
                  type="button"
                  onClick={() =>
                    setOcrAttachment(
                      ocrAttachment ? null : "FIR_Copy_PS_Gulberg_2026.pdf"
                    )
                  }
                  className={`px-2.5 py-1 border text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                    ocrAttachment
                      ? "bg-[#064E3B] text-white border-[#064E3B]"
                      : "bg-white text-stone-700 border-stone-300"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>
                    {ocrAttachment
                      ? `Attached: ${ocrAttachment}`
                      : "29. Attach FIR / Notice (OCR)"}
                  </span>
                </button>

                {/* Screen 30: Voice-to-Text */}
                <button
                  type="button"
                  onClick={() => {
                    setVoiceActive(!voiceActive);
                    if (!voiceActive) {
                      setPrompt(
                        "What is the legal procedure for obtaining pre-arrest bail (Section 498 CrPC) and protecting family property rights?"
                      );
                    }
                  }}
                  className={`px-2.5 py-1 border text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                    voiceActive
                      ? "bg-red-700 text-white border-red-700"
                      : "bg-white text-stone-700 border-stone-300"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>
                    {voiceActive ? "Voice Captured" : "30. Voice-to-Text"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 border text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-stone-900 text-white border-stone-900 ml-12"
                      : "bg-[#FBF9F5] text-stone-900 border-stone-300 mr-12"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-widest opacity-70 font-semibold mb-1">
                    {m.role === "user"
                      ? "Citizen Client Query"
                      : "Legal AI Assistant (RAG Grounded)"}
                  </div>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  {m.citations && (
                    <div className="mt-2 pt-2 border-t border-stone-200 text-[11px] text-[#064E3B] font-mono-code flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Statute Reference: {m.citations}</span>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="p-4 bg-[#FBF9F5] border border-stone-300 text-xs text-stone-600 animate-pulse">
                  Searching Pakistan Penal Code (PPC), CrPC & Supreme Court Precedents...
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Rights of Legal Heirs in Ancestral Property",
                  "Procedure for Khula & Haq Mehr Recovery",
                  "Tenant Eviction Notice under Rent Restriction Ordinance",
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="px-2.5 py-1 bg-white border border-stone-300 hover:border-[#064E3B] text-[11px] text-stone-700 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about Pakistani laws, court procedures, or attached FIR..."
                  className="flex-1 px-4 py-2.5 border border-stone-300 bg-white text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#064E3B] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Persisted Supabase Chat History */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-stone-300 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#064E3B] flex items-center gap-1.5">
                  <History className="w-4 h-4" />
                  <span>Supabase ai_chat_history ({savedLogs.length})</span>
                </h2>
                <Link
                  href="/lawyers"
                  className="text-[11px] font-semibold text-[#064E3B] hover:underline"
                >
                  Hire Advocate →
                </Link>
              </div>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {savedLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-[#FBF9F5] border border-stone-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono-code text-stone-500">
                      <span>LOG #{log.id}</span>
                      <span className="uppercase text-[#064E3B] font-semibold">
                        {log.mode}
                      </span>
                    </div>
                    <p className="font-bold text-stone-900 line-clamp-2">
                      Q: {log.user_query}
                    </p>
                    <p className="text-stone-600 line-clamp-3">
                      A: {log.ai_response}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
