"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Header from "@/app/Header";
import { createClient } from "@/app/supabase";
import { completeVideoConsultationServerAction } from "@/app/actions/platformActions";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Star,
  CheckCircle2,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function VideoCallConsultationPageInner({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const decodedCaseId = decodeURIComponent(caseId);

  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState(
    "Thorough Supreme Court precedent analysis and clear strategy on interim relief."
  );
  const [submittedLog, setSubmittedLog] = useState<any | null>(null);

  const handleCompleteCall = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await completeVideoConsultationServerAction({
      caseId: decodedCaseId,
      lawyerName: "Barrister Sikandar Hayat",
      clientName: "Citizen Client",
      rating,
      reviewText,
    });
    await supabase.from("video_consultation_logs").insert([res.logRow]);
    setSubmittedLog(res.logRow);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900">
      <Header lang="en" />

      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-grow font-ui space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-stone-900 pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#064E3B] font-semibold block">
              Module 5 • Route: /video-call/{decodedCaseId} • Screens 55 & 56 (WebRTC Video Chamber & Post-Call Review)
            </span>
            <h1 className="text-2xl font-bold font-legal text-stone-950 mt-1 flex items-center gap-2">
              <Video className="w-5 h-5 text-[#064E3B]" />
              <span>Encrypted Video Consultation Chamber: {decodedCaseId}</span>
            </h1>
          </div>
          <Link
            href={`/chat/${encodeURIComponent(decodedCaseId)}`}
            className="px-4 py-2 border border-stone-900 text-xs font-semibold"
          >
            Open Case Chat ({decodedCaseId}) →
          </Link>
        </div>

        {!callEnded ? (
          <div className="bg-stone-950 text-white border border-stone-800 p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-80">
              <div className="border border-stone-700 bg-stone-900 flex flex-col items-center justify-center p-6 relative">
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#064E3B] text-[10px] font-mono-code">
                  ADVOCATE STREAM • HD ENCRYPTED
                </span>
                <div className="w-20 h-20 rounded-full bg-emerald-950 border-2 border-[#D4AF37] flex items-center justify-center text-xl font-bold font-legal text-[#D4AF37]">
                  SH
                </div>
                <h3 className="mt-3 font-bold font-legal text-base">
                  Barrister Sikandar Hayat
                </h3>
                <p className="text-xs text-stone-400">
                  Supreme Court of Pakistan • Escrow Verified
                </p>
              </div>

              <div className="border border-stone-700 bg-stone-900 flex flex-col items-center justify-center p-6 relative">
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-stone-800 text-[10px] font-mono-code">
                  CLIENT STREAM ({cameraOff ? "CAMERA OFF" : "ACTIVE"})
                </span>
                <div className="w-20 h-20 rounded-full bg-stone-800 border border-stone-600 flex items-center justify-center text-xl font-bold">
                  CL
                </div>
                <h3 className="mt-3 font-bold text-base">Citizen Client</h3>
                <p className="text-xs text-stone-400">
                  Room ID: {decodedCaseId}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setMuted(!muted)}
                className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  muted ? "bg-amber-600 text-white" : "bg-stone-800 text-white"
                }`}
              >
                {muted ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
                <span>{muted ? "Unmute Mic" : "Mute Mic"}</span>
              </button>
              <button
                type="button"
                onClick={() => setCameraOff(!cameraOff)}
                className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  cameraOff
                    ? "bg-amber-600 text-white"
                    : "bg-stone-800 text-white"
                }`}
              >
                <VideoOff className="w-4 h-4" />
                <span>{cameraOff ? "Start Camera" : "Stop Camera"}</span>
              </button>
              <button
                type="button"
                onClick={() => setCallEnded(true)}
                className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Consultation & Complete Milestone (Screen 56)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-stone-300 p-8 max-w-xl mx-auto space-y-5">
            <span className="text-[11px] uppercase tracking-widest text-[#064E3B] font-bold block">
              Screen 56 • Post-Consultation Rating & Escrow Completion
            </span>
            <h2 className="text-xl font-bold font-legal text-stone-950">
              Rate Your Video Consultation & Release Milestone
            </h2>

            {submittedLog ? (
              <div className="p-4 bg-emerald-950/10 border border-[#064E3B] space-y-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#064E3B]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Consultation Completed & Logged to{" "}
                    <code>public.video_consultation_logs</code>!
                  </span>
                </div>
                <p>
                  Appointment status updated to <strong>Completed</strong> in{" "}
                  <code>public.appointments_and_cases</code>.
                </p>
                <div className="flex gap-2 pt-2">
                  <Link
                    href="/client/cases"
                    className="px-4 py-2 bg-[#064E3B] text-white font-semibold"
                  >
                    Return to My Cases (/client/cases)
                  </Link>
                  <Link
                    href="/lawyer/wallet"
                    className="px-4 py-2 border border-stone-900 font-semibold"
                  >
                    View Advocate Escrow Wallet →
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCompleteCall} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold block mb-1.5">
                    Star Rating (1–5)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`px-3 py-1.5 border flex items-center gap-1 cursor-pointer ${
                          rating >= num
                            ? "bg-[#D4AF37] text-stone-950 border-[#B48327] font-bold"
                            : "bg-white text-stone-500 border-stone-300"
                        }`}
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>{num}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1.5">
                    Client Feedback for Advocate Profile
                  </label>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#064E3B] text-white font-bold cursor-pointer"
                >
                  Submit Rating & Update appointments_and_cases Status
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function VideoCallConsultationPage({ params }: { params: Promise<any> }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FBF9F5] p-10 text-center text-xs text-stone-500">Loading...</div>}>
      <VideoCallConsultationPageInner params={params} />
    </React.Suspense>
  );
}
