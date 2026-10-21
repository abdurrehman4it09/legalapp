"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/app/Header";
import { createBookingAndEscrowServerAction } from "@/app/actions/platformActions";
import { createClient } from "@/app/supabase";
import { useAuthRBAC } from "@/app/AuthContext";
import {
  InlineSpinner,
  MutationFeedbackBanner,
} from "@/app/components/SharedUI";
import { Lock, CheckCircle2, Video, MessageSquare, Briefcase } from "lucide-react";

const supabase = createClient();

function EscrowCheckoutRoutePageInner() {
  const params = useParams();
  const bookingId = params?.bookingId as string;
  const { session } = useAuthRBAC();

  const [booking, setBooking] = useState<any>({
    bookingId,
    lawyerId: 1,
    lawyerName: "Adv. Sara Mansoor, ASC",
    court: "Supreme Court of Pakistan",
    fee: 15000,
    date: "2026-10-28",
    timeSlot: "03:30 PM PKT",
    caseSummary: "Constitutional Petition & Property Mutation Verification",
  });
  const [paymentMethod, setPaymentMethod] = useState(
    "RAAST Instant IBAN Escrow"
  );
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [roomCode, setRoomCode] = useState(`CHAMBER-${bookingId.slice(-4)}`);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string | null;
  }>({ status: "idle", message: null });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("plp_pending_booking");
      if (saved) {
        try {
          setBooking(JSON.parse(saved));
        } catch {
          // keep default
        }
      }
    }
  }, [bookingId]);

  const grossFee = Number(booking.fee || 15000);
  const commission = Math.round(grossFee * 0.15);
  const lawyerNet = grossFee - commission;

  function handleCompleteEscrowPayment() {
    setFeedback({ status: "loading", message: null });
    startTransition(async () => {
      try {
        const generatedRoom = `VIDEO-CHAMBER-${String(bookingId).slice(-4)}`;
        setRoomCode(generatedRoom);

        const res = await createBookingAndEscrowServerAction({
          lawyerId: booking.lawyerId || 1,
          lawyerName: booking.lawyerName,
          court: booking.court,
          clientName: session?.name || "Tariq Mahmood",
          date: booking.date,
          timeSlot: booking.timeSlot,
          fee: grossFee,
          paymentMethod,
          caseSummary: booking.caseSummary,
        });

        await Promise.all([
          supabase.from("appointments_and_cases").insert([res.appointmentRow]),
          supabase.from("escrow_transactions").insert([res.escrowRow]),
        ]);

        setFeedback({
          status: "success",
          message: `PKR ${grossFee.toLocaleString()} locked in escrow_transactions (held_in_escrow).`,
        });
        setPaidSuccess(true);
      } catch (err: any) {
        setFeedback({
          status: "error",
          message: err?.message || "Failed to process escrow checkout.",
        });
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <div className="bg-white border border-stone-300 p-6 sm:p-8 space-y-6 text-xs">
          <div className="flex items-center gap-2 text-[#064E3B] font-bold uppercase tracking-widest">
            <Lock className="w-4 h-4 text-[#B48327]" />
            <span>
              Screens 24 & 25 · Route: /checkout/{bookingId} · Tables: appointments_and_cases + escrow_transactions
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-legal text-stone-950">
            Double-Entry Milestone Escrow Checkout
          </h1>

          <div className="p-4 bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-600">Counsel:</span>
              <strong>{booking.lawyerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Date & Slot:</span>
              <span className="font-mono-code">
                {booking.date} · {booking.timeSlot}
              </span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2">
              <span className="text-stone-600">Gross Consultation Fee:</span>
              <strong className="font-mono-code">
                PKR {grossFee.toLocaleString()}
              </strong>
            </div>
            <div className="flex justify-between text-[#064E3B]">
              <span>85% Locked in Advocate Escrow Vault:</span>
              <strong className="font-mono-code">
                PKR {lawyerNet.toLocaleString()}
              </strong>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>15% Platform Escrow Protection Fee:</span>
              <span className="font-mono-code">
                PKR {commission.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-2">
              Select Pakistan Escrow Payment Rail
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                "RAAST Instant IBAN Escrow",
                "Safepay Escrow Vault",
                "JazzCash / EasyPaisa Corporate",
              ].map((rail) => (
                <button
                  key={rail}
                  type="button"
                  onClick={() => setPaymentMethod(rail)}
                  className={`p-3 border font-semibold text-left cursor-pointer ${
                    paymentMethod === rail
                      ? "bg-[#064E3B] text-white border-[#064E3B]"
                      : "bg-stone-50 text-stone-800 border-stone-300"
                  }`}
                >
                  {rail}
                </button>
              ))}
            </div>
          </div>

          <MutationFeedbackBanner
            status={feedback.status}
            message={feedback.message}
          />

          {!paidSuccess ? (
            <button
              type="button"
              disabled={isPending}
              onClick={handleCompleteEscrowPayment}
              className="w-full min-h-[44px] py-3.5 bg-[#064E3B] hover:bg-emerald-950 text-white font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <InlineSpinner className="w-4 h-4" />
                  <span>Processing...</span>
                </>
              ) : (
                `Authorize PKR ${grossFee.toLocaleString()} in Escrow & Generate Chamber Room`
              )}
            </button>
          ) : (
            <div className="p-6 bg-stone-900 text-white border-l-4 border-[#D4AF37] space-y-4">
              <div className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  Screen 25 · Payment Success Modal · Escrow Ledger Recorded
                </span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                PKR {grossFee.toLocaleString()} is now locked in{" "}
                <code>escrow_transactions</code> (status: <code>held_in_escrow</code>) and your booking is active in <code>appointments_and_cases</code>.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href="/client/cases"
                  className="px-4 py-2.5 bg-[#D4AF37] text-stone-950 font-bold flex items-center gap-1.5"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>My Cases (/client/cases · Screen 26) →</span>
                </Link>
                <Link
                  href={`/chat/${roomCode}`}
                  className="px-4 py-2.5 bg-[#064E3B] text-white font-semibold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  <span>Chamber Chat (/chat/{roomCode} · Screen 53) →</span>
                </Link>
                <Link
                  href={`/video-call/${roomCode}`}
                  className="px-4 py-2.5 border border-stone-600 text-white font-semibold flex items-center gap-1.5"
                >
                  <Video className="w-4 h-4 text-[#D4AF37]" />
                  <span>Video Chamber (/video-call/{roomCode} · Screen 55) →</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function EscrowCheckoutRoutePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FBF9F5] p-10 text-center text-xs text-stone-500">Loading...</div>}>
      <EscrowCheckoutRoutePageInner />
    </React.Suspense>
  );
}
