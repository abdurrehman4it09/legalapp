"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/Header";
import { createClient } from "@/app/supabase";
import { updateClientAppointmentServerAction } from "@/app/actions/platformActions";
import { useAuthRBAC } from "@/app/AuthContext";
import {
  Briefcase,
  Video,
  MessageSquare,
  Calendar,
  ShieldCheck,
  Clock,
  RefreshCw,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ClientCasesPage() {
  const { session } = useAuthRBAC();
  const [cases, setCases] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [escrowLedger, setEscrowLedger] = useState<any[]>([]);
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState("2026-10-28");
  const [newSlot, setNewSlot] = useState("04:00 PM (Video Call)");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadClientCases = async () => {
    const [casesRes, msRes, escRes] = await Promise.all([
      supabase
        .from("appointments_and_cases")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("case_milestones").select("*"),
      supabase.from("escrow_transactions").select("*"),
    ]);
    setCases(casesRes.data || []);
    setMilestones(msRes.data || []);
    setEscrowLedger(escRes.data || []);
  };

  useEffect(() => {
    loadClientCases();
    if (typeof window !== "undefined") {
      window.addEventListener("plp_data_updated", loadClientCases);
      return () =>
        window.removeEventListener("plp_data_updated", loadClientCases);
    }
  }, []);

  const handleUpdateStatus = async (
    id: number,
    status: string,
    date?: string,
    timeSlot?: string
  ) => {
    await updateClientAppointmentServerAction({
      id,
      status,
      date,
      timeSlot,
    });
    await supabase
      .from("appointments_and_cases")
      .update({
        status,
        ...(date ? { date } : {}),
        ...(timeSlot ? { time_slot: timeSlot } : {}),
      })
      .eq("id", id);

    setRescheduleId(null);
    setStatusMsg(`Case #${id} updated in Supabase -> ${status}`);
    setTimeout(() => setStatusMsg(null), 4000);
    await loadClientCases();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900">
      <Header lang="en" />

      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-grow font-ui space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-stone-900 pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#064E3B] font-semibold block">
              Module 3 • Route: /client/cases • Screens 26 & 27 (Active / Past Case History & Reschedule)
            </span>
            <h1 className="text-3xl font-bold font-legal text-stone-950 mt-1">
              My Appointments, Escrow Bookings & Case Milestones
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Connected via Server Actions &{" "}
              <code>
                SELECT * FROM appointments_and_cases WHERE client_id = auth.uid()
              </code>{" "}
              • Active User:{" "}
              <strong>
                {session ? session.name : "Citizen Client"}
              </strong>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/lawyers"
              className="px-4 py-2.5 bg-[#064E3B] text-white text-xs font-semibold hover:bg-emerald-950 transition-colors"
            >
              + Book New Advocate Consultation
            </Link>
            <Link
              href="/client/ai-assistant"
              className="px-4 py-2.5 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white text-xs font-semibold transition-colors"
            >
              Client AI Legal Assistant →
            </Link>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 bg-emerald-950 text-[#D4AF37] border border-[#D4AF37] text-xs font-semibold flex items-center justify-between">
            <span>{statusMsg}</span>
            <button
              onClick={() => setStatusMsg(null)}
              className="underline text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active & Past Cases List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-800 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#064E3B]" />
              <span>
                Appointments & Active Cases ({cases.length} Records in Supabase)
              </span>
            </h2>

            {cases.map((c) => {
              const roomCode = c.video_room_id || `CASE-${c.id}`;
              return (
                <div
                  key={c.id}
                  className="bg-white border border-stone-300 p-6 space-y-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 pb-3">
                    <div>
                      <span className="text-[11px] font-mono-code text-[#064E3B] font-semibold">
                        BOOKING #{c.id} • {c.court || "High Court"}
                      </span>
                      <h3 className="text-lg font-bold font-legal text-stone-950">
                        {c.lawyer_name}
                      </h3>
                      <p className="text-xs text-stone-600">
                        Client: <strong>{c.client_name}</strong> • Payment:{" "}
                        {c.payment_method || "Escrow"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-950/10 border border-[#064E3B]/30 text-[#064E3B] text-xs font-bold">
                      {c.status}
                    </span>
                  </div>

                  {c.case_summary && (
                    <p className="text-xs text-stone-700 bg-[#FBF9F5] p-3 border border-stone-200">
                      <strong>Case Brief:</strong> {c.case_summary}
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-stone-50 p-3 border border-stone-200">
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase">
                        Hearing / Consult Date
                      </span>
                      <strong className="font-mono-code">{c.date}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase">
                        Time Slot
                      </span>
                      <strong>{c.time_slot}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase">
                        Total Escrow Fee
                      </span>
                      <strong className="font-mono-code text-[#064E3B]">
                        PKR {Number(c.fee || 0).toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase">
                        Room ID
                      </span>
                      <strong className="font-mono-code">{roomCode}</strong>
                    </div>
                  </div>

                  {/* Screen 27: Reschedule / Cancel Inline Modal */}
                  {rescheduleId === c.id && (
                    <div className="p-4 bg-amber-50/70 border border-[#B48327] space-y-3">
                      <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-[#B48327]" />
                        <span>
                          Screen 27 • Reschedule Appointment in Supabase
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="px-3 py-2 border border-stone-300 bg-white text-xs"
                        />
                        <select
                          value={newSlot}
                          onChange={(e) => setNewSlot(e.target.value)}
                          className="px-3 py-2 border border-stone-300 bg-white text-xs"
                        >
                          <option value="11:00 AM (Video Call)">
                            11:00 AM (Video Call)
                          </option>
                          <option value="02:30 PM (Chamber)">
                            02:30 PM (Chamber)
                          </option>
                          <option value="04:00 PM (Video Call)">
                            04:00 PM (Video Call)
                          </option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStatus(
                              c.id,
                              "Rescheduled (Escrow Active)",
                              newDate,
                              newSlot
                            )
                          }
                          className="px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                        >
                          Save New Date & Slot
                        </button>
                        <button
                          type="button"
                          onClick={() => setRescheduleId(null)}
                          className="px-4 py-2 border border-stone-300 bg-white text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/chat/${encodeURIComponent(roomCode)}`}
                        className="px-3.5 py-2 bg-stone-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#064E3B] transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Open Case Chat (Screen 53)</span>
                      </Link>
                      <Link
                        href={`/video-call/${encodeURIComponent(roomCode)}`}
                        className="px-3.5 py-2 bg-[#064E3B] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-950 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Video Chamber (Screen 55)</span>
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRescheduleId(c.id)}
                        className="px-3 py-1.5 border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Reschedule (27)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(
                            c.id,
                            "Cancellation Requested (Escrow Refund Pending)"
                          )
                        }
                        className="px-3 py-1.5 border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Milestones & Escrow Ledger */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-stone-300 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#064E3B] flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Case Milestones (case_milestones)</span>
                </h3>
              </div>
              <div className="space-y-3">
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-[#FBF9F5] border border-stone-200 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-code text-[10px] text-[#064E3B] font-semibold">
                        {m.case_ref}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-stone-900 text-white">
                        {m.status}
                      </span>
                    </div>
                    <strong className="block text-stone-900">{m.title}</strong>
                    <span className="text-[11px] text-stone-500 block">
                      Target Date: {m.date} • File: {m.shared_file}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-300 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#B48327] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
                  <span>Escrow Protection Ledger</span>
                </h3>
              </div>
              <div className="space-y-2.5">
                {escrowLedger.map((e) => (
                  <div
                    key={e.id}
                    className="p-3 bg-[#FBF9F5] border border-stone-200 text-xs space-y-1"
                  >
                    <div className="flex justify-between font-semibold">
                      <span>{e.lawyer_name}</span>
                      <span className="font-mono-code text-[#064E3B]">
                        PKR {Number(e.gross_amount_pkr || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-600">
                      State: <strong>{e.accounting_state}</strong> •{" "}
                      {e.milestone_label}
                    </div>
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
