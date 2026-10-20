"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../Header";
import {
  SlidersHorizontal,
  ShieldCheck,
  Search,
  X,
} from "lucide-react";
import {
  BookingEscrowModal,
  SmartAuthModal,
  UserSession,
} from "../components/PlatformModals";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function PublicLawyersDirectory() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Screen 07: Advanced Search Filters state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("All");
  const [maxFee, setMaxFee] = useState(10000);
  const [proBonoOnly, setProBonoOnly] = useState(false);
  const [femaleAdvocateOnly, setFemaleAdvocateOnly] = useState(false);

  // Booking & Auth state
  const [bookingLawyer, setBookingLawyer] = useState<any | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    async function fetchLawyers() {
      const { data, error } = await supabase
        .from("lawyers")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setLawyers(data);
      setLoading(false);
    }
    fetchLawyers();
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
  }, []);

  const cities = [
    "All",
    ...Array.from(
      new Set(lawyers.map((l) => l.location || l.city).filter(Boolean))
    ),
  ];

  const filteredLawyers = lawyers.filter((l) => {
    const q = search.toLowerCase();
    const matchesQuery =
      (l.name?.toLowerCase() || "").includes(q) ||
      (l.specialty?.toLowerCase() || "").includes(q) ||
      (l.location?.toLowerCase() || "").includes(q) ||
      (l.court?.toLowerCase() || "").includes(q);

    const matchesCity =
      selectedCity === "All" ||
      (l.location || l.city || "").toLowerCase() === selectedCity.toLowerCase();

    const matchesFee = (l.fee || 0) <= maxFee;
    const matchesProBono = !proBonoOnly || Boolean(l.pro_bono);
    const matchesFemale = !femaleAdvocateOnly || Boolean(l.is_female);

    return (
      matchesQuery &&
      matchesCity &&
      matchesFee &&
      matchesProBono &&
      matchesFemale
    );
  });

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111] font-legal">
      <Header lang="en" />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="border-b-2 border-stone-900 pb-8 mb-8">
          <div className="font-ui text-xs uppercase tracking-widest text-[#064E3B] font-semibold mb-2">
            Screens 06 & 07 · Verified Bar Council Directory
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight mb-2">
                Verified High Court & Supreme Court Advocates
              </h1>
              <p className="text-base text-stone-600 max-w-2xl">
                Connect with credential-verified legal counsel across Pakistan with Safepay/JazzCash Escrow protection.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="font-ui px-4 py-2.5 bg-stone-900 hover:bg-[#064E3B] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              <span>Advanced Filters (Screen 07)</span>
            </button>
          </div>

          {/* Search & Quick Filter Toggles */}
          <div className="mt-6 flex flex-wrap items-center gap-3 font-ui">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by advocate name, specialty (Tax, Property, Criminal), High Court, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 text-xs focus:outline-none focus:border-[#064E3B]"
              />
            </div>

            <button
              type="button"
              onClick={() => setFemaleAdvocateOnly(!femaleAdvocateOnly)}
              className={`px-3.5 py-2.5 text-xs font-semibold border transition-colors cursor-pointer ${
                femaleAdvocateOnly
                  ? "bg-[#064E3B] text-white border-[#064E3B]"
                  : "bg-white text-stone-700 border-stone-300 hover:border-stone-900"
              }`}
            >
              Female Advocate Only
            </button>

            <button
              type="button"
              onClick={() => setProBonoOnly(!proBonoOnly)}
              className={`px-3.5 py-2.5 text-xs font-semibold border transition-colors cursor-pointer ${
                proBonoOnly
                  ? "bg-[#064E3B] text-white border-[#064E3B]"
                  : "bg-white text-stone-700 border-stone-300 hover:border-stone-900"
              }`}
            >
              Pro-Bono Available
            </button>
          </div>

          {/* Screen 07: Advanced Search Filters Panel / Sheet */}
          {filtersOpen && (
            <div className="mt-4 p-6 bg-white border border-stone-300 font-ui space-y-5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold">
                  Screen 07 · Advanced Advocate Filter Controls
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity("All");
                    setMaxFee(10000);
                    setProBonoOnly(false);
                    setFemaleAdvocateOnly(false);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-900 underline"
                >
                  Reset All Filters
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    City / High Court Seat
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 text-xs bg-white"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Max Consultation Fee:{" "}
                    <span className="font-mono-code text-[#064E3B]">
                      PKR {maxFee.toLocaleString()}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={1500}
                    max={10000}
                    step={500}
                    value={maxFee}
                    onChange={(e) => setMaxFee(Number(e.target.value))}
                    className="w-full accent-[#064E3B]"
                  />
                </div>

                <label className="flex items-center gap-2.5 text-xs font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={femaleAdvocateOnly}
                    onChange={(e) => setFemaleAdvocateOnly(e.target.checked)}
                  />
                  <span>Female Advocate Only</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={proBonoOnly}
                    onChange={(e) => setProBonoOnly(e.target.checked)}
                  />
                  <span>Pro-Bono Legal Aid Roster</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center font-ui text-sm text-stone-500">
            Loading verified Bar Council profiles...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className="bg-white border border-stone-300 p-6 flex flex-col justify-between hover:border-stone-900 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-14 h-14 bg-[#064E3B] text-[#D4AF37] font-legal font-bold text-xl flex items-center justify-center border border-[#B48327] shrink-0">
                      {lawyer.name ? lawyer.name.replace("Adv. ", "").charAt(0) : "A"}
                    </div>
                    <div>
                      <Link
                        href={`/lawyers/${lawyer.id}`}
                        className="text-xl font-bold text-stone-950 hover:text-[#064E3B] block"
                      >
                        {lawyer.name}
                      </Link>
                      <div className="font-ui text-xs text-stone-500">
                        {lawyer.court || "High Court"} · {lawyer.location}
                      </div>
                    </div>
                  </div>

                  <div className="font-ui text-xs font-semibold text-[#064E3B] mb-2">
                    {lawyer.specialty}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {lawyer.bio || lawyer.intro}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200 font-ui space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span className="font-mono-code">
                      {lawyer.bar_council_id || "PBC-Verified"}
                    </span>
                    <span className="font-mono-code font-bold text-stone-950">
                      PKR {(lawyer.fee || 3500).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-500">
                    <span>★ {lawyer.rating || "4.9"}</span>
                    <span className="mx-1.5">·</span>
                    <span>{lawyer.experience_years || 10} Years Standing</span>
                    {lawyer.pro_bono && (
                      <>
                        <span className="mx-1.5">·</span>
                        <span className="text-[#064E3B] font-semibold">
                          Pro-Bono Available
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/lawyers/${lawyer.id}`}
                      className="flex-1 py-2 px-3 border border-stone-300 hover:border-stone-900 text-center text-xs font-semibold text-stone-800"
                    >
                      Chamber Profile (21)
                    </Link>
                    <button
                      type="button"
                      onClick={() => setBookingLawyer(lawyer)}
                      className="flex-1 py-2 px-3 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-semibold cursor-pointer"
                    >
                      Book Escrow (22)
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredLawyers.length === 0 && (
              <div className="col-span-3 py-16 text-center font-ui text-sm text-stone-500 bg-white border border-stone-200">
                No advocates match the active filters. Try resetting the fee range or toggles.
              </div>
            )}
          </div>
        )}
      </main>

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
        triggerReason="Screen 13 • Verify your Client account to book an Escrow Consultation."
        lang="en"
      />
    </div>
  );
}