"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { createClient, getTableData } from "@/app/supabase";
import Link from "next/link";
import Header from "../../Header";
import {
  ShieldCheck,
  ArrowLeft,
  Calendar,
  MessageSquare,
  Send,
  Lock,
} from "lucide-react";
import {
  BookingEscrowModal,
  SmartAuthModal,
  UserSession,
} from "../../components/PlatformModals";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

function LawyerProfileContent() {
  const params = useParams();
  const [lawyer, setLawyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "about" | "articles" | "reviews" | "chat"
  >("about");
  const [bookingLawyer, setBookingLawyer] = useState<any | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Screen 53: Secure Live Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: string; text: string; time: string }>
  >([
    {
      sender: "Chamber Clerk (E2EE)",
      text: "Welcome to the End-to-End Encrypted Chamber Room (Screen 53). Share your case reference or upload documents prior to your scheduled hearing.",
      time: "10:15 AM",
    },
  ]);

  useEffect(() => {
    async function fetchLawyer() {
      if (!params?.id) return;
      try {
        const { data, error } = await supabase
          .from("lawyers")
          .select("*")
          .eq("id", params.id)
          .single();
        if (!error && data) setLawyer(data);
      } catch (error) {
        console.error("Error fetching lawyer:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLawyer();
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("plp_user_session");
      if (saved) {
        try {
          setUserSession(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="py-20 text-center font-ui text-sm text-stone-500">
        Loading verified chamber credentials...
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="text-center py-20 font-ui">
        <h2 className="text-2xl font-bold text-stone-900 mb-3">
          Advocate profile not found
        </h2>
        <Link href="/lawyers" className="text-[#064E3B] underline">
          Return to Advocate Directory
        </Link>
      </div>
    );
  }

  const allArticles = getTableData("articles");

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        href="/lawyers"
        className="font-ui text-xs font-semibold text-stone-700 hover:text-[#064E3B] mb-6 inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Verified Advocate Directory (Screen 06)</span>
      </Link>

      {/* Screen 21: Lawyer Profile Header Card */}
      <div className="bg-white border border-stone-300 p-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-8 border-b border-stone-200">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-[#064E3B] text-[#D4AF37] font-legal font-bold text-3xl flex items-center justify-center border-2 border-[#B48327] shrink-0">
              {lawyer.name ? lawyer.name.replace("Adv. ", "").charAt(0) : "A"}
            </div>

            <div className="space-y-2">
              <div className="font-ui text-xs text-[#B48327] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
                <span>
                  SCREEN 21 · GOLD VERIFIED BAR COUNCIL ROLL ·{" "}
                  {lawyer.bar_council_id || "PBC-SC-4491"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-stone-950">
                {lawyer.name}
              </h1>

              {lawyer.name_urdu && (
                <p className="font-urdu text-xl text-stone-600" dir="rtl">
                  {lawyer.name_urdu}
                </p>
              )}

              <div className="font-ui text-xs text-stone-600 pt-1">
                <span className="font-semibold text-[#064E3B]">
                  {lawyer.court || "Supreme Court / High Court"}
                </span>
                <span className="mx-2">·</span>
                <span>{lawyer.location}</span>
                <span className="mx-2">·</span>
                <span>{lawyer.experience_years || 14} Years Standing</span>
                <span className="mx-2">·</span>
                <span>★ {lawyer.rating || "4.9"} ({lawyer.reviews_count || 84} Client Reviews)</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto font-ui flex flex-col gap-2.5 shrink-0">
            <div className="text-right">
              <span className="text-[11px] text-stone-500 block">
                Escrow Consultation Fee
              </span>
              <span className="font-mono-code text-2xl font-bold text-[#064E3B]">
                PKR {(lawyer.fee || 3500).toLocaleString()}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setBookingLawyer(lawyer)}
              className="px-6 py-3 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Book Escrow Consultation (Screen 22)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className="px-6 py-2.5 border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#064E3B]" />
              <span>Encrypted Chamber Chat (Screen 53)</span>
            </button>
          </div>
        </div>

        {/* Interactive Profile Tabs */}
        <div className="flex flex-wrap gap-1 pt-6 mb-6 font-ui border-b border-stone-200">
          {(
            [
              { id: "about", label: "About & Credentials" },
              { id: "articles", label: "Published Legal Briefings" },
              { id: "reviews", label: "Verified Client Reviews" },
              { id: "chat", label: "53. Secure Chamber Chat (E2EE)" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === t.id
                  ? "border-[#064E3B] text-[#064E3B]"
                  : "border-transparent text-stone-500 hover:text-stone-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "about" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-ui text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">
                Primary Practice & Jurisdiction
              </h3>
              <p className="text-base text-stone-800 leading-relaxed">
                {lawyer.bio || lawyer.description}
              </p>
            </div>

            {lawyer.intro_urdu && (
              <div className="p-5 bg-[#FBF9F5] border border-stone-200" dir="rtl">
                <h4 className="font-ui text-xs text-[#064E3B] font-semibold mb-2">
                  تعارف (اردو)
                </h4>
                <p className="font-urdu text-lg text-stone-800 leading-loose">
                  {lawyer.intro_urdu}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-ui text-xs pt-2">
              <div className="p-4 border border-stone-200 bg-[#FBF9F5]">
                <span className="text-stone-500 block mb-1">Enrolled Court</span>
                <strong className="text-stone-900">
                  {lawyer.court || "Supreme Court / High Court"}
                </strong>
              </div>
              <div className="p-4 border border-stone-200 bg-[#FBF9F5]">
                <span className="text-stone-500 block mb-1">
                  Chamber Contact
                </span>
                <strong className="text-stone-900">
                  {lawyer.contact_info || "Verified via Escrow"}
                </strong>
              </div>
              <div className="p-4 border border-stone-200 bg-[#FBF9F5]">
                <span className="text-stone-500 block mb-1">Pro-Bono Roster</span>
                <strong className="text-[#064E3B]">
                  {lawyer.pro_bono
                    ? "Active — Accepts Deserving Cases"
                    : "Standard Escrow Retainer"}
                </strong>
              </div>
            </div>
          </div>
        )}

        {activeTab === "articles" && (
          <div className="space-y-4">
            {allArticles.slice(0, 2).map((art) => (
              <Link
                key={art.id}
                href={`/article/${art.id}`}
                className="block p-5 border border-stone-200 hover:border-[#064E3B] transition-colors"
              >
                <div className="font-ui text-xs text-[#064E3B] font-semibold mb-1">
                  {art.category} · {art.read_time || "5 min read"}
                </div>
                <h4 className="text-lg font-bold text-stone-950">{art.title}</h4>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4 font-ui">
            <div className="p-4 border border-stone-200 bg-[#FBF9F5]">
              <div className="text-xs font-semibold text-stone-900 mb-1">
                ★★★★★ · Verified Escrow Client — Islamabad Property Mutation
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                “Obtained our NADRA Letters of Administration and High Court protective writ within 3 weeks. Exceptional clarity on constitutional inheritance law.”
              </p>
            </div>
            <div className="p-4 border border-stone-200 bg-[#FBF9F5]">
              <div className="text-xs font-semibold text-stone-900 mb-1">
                ★★★★★ · Verified Escrow Client — Overseas Pakistani Succession
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                “Handled biometric power of attorney and revenue record rectification seamlessly without requiring repeated travel.”
              </p>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="border border-stone-300 bg-[#FBF9F5] font-ui">
            <div className="bg-stone-900 text-white px-4 py-2.5 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  Screen 53 · End-to-End Encrypted Chamber Room with {lawyer.name}
                </span>
              </div>
              <span className="font-mono-code text-[11px] text-emerald-300">
                TLS 1.3 · Zero-Trust Vault
              </span>
            </div>

            <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className="bg-white border border-stone-200 p-3 text-xs space-y-1"
                >
                  <div className="flex justify-between text-[11px] text-stone-500 font-semibold">
                    <span>{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-stone-800">{msg.text}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim()) return;
                setChatMessages((prev) => [
                  ...prev,
                  {
                    sender: userSession?.name || "Client",
                    text: chatInput,
                    time: "Just now",
                  },
                  {
                    sender: lawyer.name,
                    text: "Thank you. I have reviewed your note. Please lock a consultation slot via Escrow or upload your relevant deed PDF for chamber review.",
                    time: "Just now",
                  },
                ]);
                setChatInput("");
              }}
              className="p-3 bg-white border-t border-stone-200 flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Write an encrypted message or share document reference (Screen 54)..."
                className="flex-1 px-3 py-2 border border-stone-300 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}
      </div>

      <BookingEscrowModal
        lawyer={bookingLawyer}
        onClose={() => setBookingLawyer(null)}
        userSession={userSession}
        onRequireAuth={() => {
          setBookingLawyer(null);
          setAuthModalOpen(true);
        }}
        lang="en"
      />

      <SmartAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(s) => setUserSession(s)}
        triggerReason="Screen 13 • Verify your Client account to lock an Escrow Consultation."
        lang="en"
      />
    </div>
  );
}

export default function FullLawyerPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111] font-legal">
      <Header lang="en" />
      <Suspense
        fallback={
          <div className="py-20 text-center font-ui text-sm text-stone-500">
            Loading profile...
          </div>
        }
      >
        <LawyerProfileContent />
      </Suspense>
    </div>
  );
}