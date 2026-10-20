"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/app/Header";
import { createClient } from "@/app/supabase";
import { Calendar, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";

const supabase = createClient();

function BookLawyerRoutePageInner() {
  const params = useParams();
  const router = useRouter();
  const lawyerId = params?.id as string;

  const [lawyer, setLawyer] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState("2026-10-28");
  const [selectedSlot, setSelectedSlot] = useState("03:30 PM PKT");
  const [caseSummary, setCaseSummary] = useState(
    "Constitutional Petition / Property Mutation Verification under Specific Relief Act 1877"
  );
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("lawyer_profiles")
        .select("*")
        .eq("id", lawyerId)
        .single();
      if (data) {
        setLawyer(data);
      } else {
        const { data: list } = await supabase
          .from("lawyer_profiles")
          .select("*");
        if (list && list[0]) setLawyer(list[0]);
      }
    }
    load();
  }, [lawyerId]);

  function handleProceedToCheckout() {
    const bookingId = Date.now();
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "plp_pending_booking",
        JSON.stringify({
          bookingId,
          lawyerId: lawyer?.id || Number(lawyerId) || 1,
          lawyerName: lawyer?.name || "Adv. Sara Mansoor, ASC",
          court: lawyer?.court || "Supreme Court of Pakistan",
          fee: Number(lawyer?.fee || 15000),
          date: selectedDate,
          timeSlot: selectedSlot,
          caseSummary,
        })
      );
    }
    router.push(`/checkout/${bookingId}`);
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between border-b border-stone-300 pb-4 text-xs">
          <Link
            href="/lawyers"
            className="font-semibold text-[#064E3B] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Lawyer Directory (/lawyers · Screen 06)</span>
          </Link>
          <span className="font-mono-code text-stone-500">
            Screens 21, 22 & 23 · Route: /lawyers/{lawyerId}/book
          </span>
        </div>

        {/* Screen 21: Lawyer Profile Header */}
        <div className="bg-white border border-stone-300 p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#064E3B] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-[#B48327]" />
                <span>
                  Screen 21 · Verified Counsel Profile · {lawyer?.bar_And_license || "PBC-SC-4491"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-legal text-stone-950 mt-1">
                {lawyer?.name || "Adv. Sara Mansoor, ASC"}
              </h1>
              <p className="text-xs text-stone-600 mt-0.5">
                {lawyer?.court || "Supreme Court of Pakistan"} ·{" "}
                {lawyer?.specialization || "Constitutional & Property Law"} ·{" "}
                {lawyer?.city || "Islamabad"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-widest text-stone-500 block">
                Consultation Escrow Fee
              </span>
              <div className="text-2xl font-bold font-mono-code text-[#064E3B]">
                PKR {Number(lawyer?.fee || 15000).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Screen 22: Appointment Booking Calendar */}
        <div className="bg-white border border-stone-300 p-6 sm:p-8 space-y-5 text-xs">
          <div className="flex items-center gap-2 text-[#064E3B] font-bold uppercase tracking-widest">
            <Calendar className="w-4 h-4 text-[#B48327]" />
            <span>Screen 22 · Appointment Booking Calendar & Slot Roster</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Select Hearing / Consultation Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 font-mono-code"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Select Available PKT Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["11:00 AM PKT", "03:30 PM PKT", "06:00 PM PKT"].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 font-mono-code font-semibold border cursor-pointer ${
                      selectedSlot === slot
                        ? "bg-[#064E3B] text-white border-[#064E3B]"
                        : "bg-stone-50 text-stone-800 border-stone-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Brief Case Summary for Counsel
            </label>
            <textarea
              rows={3}
              value={caseSummary}
              onChange={(e) => setCaseSummary(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300"
            />
          </div>

          <button
            type="button"
            onClick={() => setConfirmModalOpen(true)}
            className="w-full py-3.5 bg-[#064E3B] text-white font-semibold uppercase tracking-wider cursor-pointer"
          >
            Review Time Slot (Screen 23) & Proceed to Escrow Checkout →
          </button>
        </div>

        {/* Screen 23: Confirm Time Slot Modal */}
        {confirmModalOpen && (
          <div className="p-6 bg-stone-900 text-white border-l-4 border-[#D4AF37] space-y-4 text-xs">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Screen 23 · Confirm Time Slot Modal</span>
            </div>
            <p className="text-stone-300">
              Confirm booking with <strong>{lawyer?.name || "Adv. Sara Mansoor, ASC"}</strong> on{" "}
              <strong className="text-white">{selectedDate}</strong> at{" "}
              <strong className="text-[#D4AF37]">{selectedSlot}</strong> (Fee: PKR{" "}
              {Number(lawyer?.fee || 15000).toLocaleString()}).
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="px-5 py-2.5 bg-[#D4AF37] text-stone-950 font-bold uppercase tracking-wider cursor-pointer"
              >
                Confirm & Route to /checkout/[bookingId] (Screen 24) →
              </button>
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2.5 border border-stone-600 text-stone-300 cursor-pointer"
              >
                Change Slot
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function BookLawyerRoutePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FBF9F5] p-10 text-center text-xs text-stone-500">Loading...</div>}>
      <BookLawyerRoutePageInner />
    </React.Suspense>
  );
}
