"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Header from "@/app/Header";
import { createClient } from "@/app/supabase";
import { sendCaseChatMessageServerAction } from "@/app/actions/platformActions";
import {
  MessageSquare,
  Send,
  Paperclip,
  Video,
  ShieldCheck,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function CaseRealtimeChatPageInner({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const decodedCaseId = decodeURIComponent(caseId);

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [senderRole, setSenderRole] = useState<"client" | "advocate">("client");
  const [attachment, setAttachment] = useState("");

  const loadMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  useEffect(() => {
    loadMessages();
    const channel = supabase
      .channel(`case_room_${decodedCaseId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [decodedCaseId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const senderName =
      senderRole === "advocate"
        ? "Barrister Sikandar Hayat (High Court)"
        : "Citizen Client";

    const res = await sendCaseChatMessageServerAction({
      caseId: decodedCaseId,
      senderName,
      senderRole,
      messageText: text,
      attachmentUrl: attachment || undefined,
    });

    await supabase.from("messages").insert([res.row]);
    setText("");
    setAttachment("");
    await loadMessages();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900">
      <Header lang="en" />

      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-grow font-ui space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-stone-900 pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#064E3B] font-semibold block">
              Module 5 • Route: /chat/{decodedCaseId} • Screens 53 & 54 (Supabase Realtime Case Chat)
            </span>
            <h1 className="text-2xl font-bold font-legal text-stone-950 mt-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#064E3B]" />
              <span>Encrypted Client–Advocate Case Room: {decodedCaseId}</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Subscribed via{" "}
              <code>
                supabase.channel(&apos;case_room&apos;).on(&apos;postgres_changes&apos;, table: &apos;messages&apos;)
              </code>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/video-call/${encodeURIComponent(decodedCaseId)}`}
              className="px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Video className="w-4 h-4" />
              <span>Launch Video Consultation (55)</span>
            </Link>
            <Link
              href="/client/cases"
              className="px-3.5 py-2 border border-stone-300 bg-white text-xs font-semibold"
            >
              ← Back to Cases
            </Link>
          </div>
        </div>

        <div className="bg-white border border-stone-300 flex flex-col h-[540px] shadow-sm">
          <div className="p-3.5 bg-stone-900 text-white text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>
                End-to-End Privileged Legal Communication • Table:{" "}
                <code>public.messages</code>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-300">Send as:</span>
              <button
                type="button"
                onClick={() => setSenderRole("client")}
                className={`px-2 py-0.5 text-[11px] font-semibold cursor-pointer ${
                  senderRole === "client"
                    ? "bg-[#D4AF37] text-stone-950"
                    : "bg-stone-800 text-stone-300"
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setSenderRole("advocate")}
                className={`px-2 py-0.5 text-[11px] font-semibold cursor-pointer ${
                  senderRole === "advocate"
                    ? "bg-[#064E3B] text-white"
                    : "bg-stone-800 text-stone-300"
                }`}
              >
                Advocate
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-4 border text-xs max-w-xl ${
                  m.sender_role === "advocate"
                    ? "bg-emerald-950/5 border-[#064E3B]/40 mr-auto"
                    : "bg-stone-900 text-white border-stone-900 ml-auto"
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 mb-1 font-mono-code">
                  <strong>{m.sender_name}</strong>
                  <span>{m.room_id || decodedCaseId}</span>
                </div>
                <p className="leading-relaxed">{m.message_text}</p>
                {m.attachment_url && (
                  <div className="mt-2 pt-2 border-t border-stone-300/40 text-[11px] font-mono-code text-[#B48327]">
                    Attachment: {m.attachment_url}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="p-4 border-t border-stone-200 bg-stone-50 flex flex-wrap gap-2"
          >
            <button
              type="button"
              onClick={() =>
                setAttachment(
                  attachment ? "" : "Signed_Wakalatnama_HighCourt.pdf"
                )
              }
              className={`px-3 py-2 border text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                attachment
                  ? "bg-[#064E3B] text-white border-[#064E3B]"
                  : "bg-white text-stone-700 border-stone-300"
              }`}
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>{attachment ? attachment : "54. Attach Legal Doc"}</span>
            </button>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write message to insert into public.messages..."
              className="flex-1 px-4 py-2 border border-stone-300 bg-white text-xs"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#064E3B] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function CaseRealtimeChatPage({ params }: { params: Promise<any> }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FBF9F5] p-10 text-center text-xs text-stone-500">Loading...</div>}>
      <CaseRealtimeChatPageInner params={params} />
    </React.Suspense>
  );
}
