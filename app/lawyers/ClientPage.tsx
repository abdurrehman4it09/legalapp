"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../Header";
import { SlidersHorizontal, Search } from "lucide-react";
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

  // Advanced Search Filters state
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
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] font-ui-sans">
      <Header lang="en" />

      <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto border-b border-[#E6E4DD] pb-12 mb-14 editorial-fade-up">
          <div className="text-xs uppercase tracking-[0.16em] text-[#57554F] mb-3">
            Verified Bar Council Roll
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <h1 className="font-legal-serif text-3xl sm:text-5xl font-bold text-[#141413] tracking-tight leading-[1.18]">
                High Court &amp; Supreme Court Counsel
              </h1>
              <p className="text-base text-[#57554F] leading-[1.75]">
                Connect with credential-verified legal counsel across Pakistan
                with Escrow consultation protection.
              </p>
            </div>
          </div>

          {/* Search & Quick Filter Toggles */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#57554F] absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search by advocate name, specialty, High Court, or city…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border border-[#E6E4DD] text-sm focus:outline-none focus:border-[#0B5D3B] transition-colors duration-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="px-4 py-3 bg-[#F2EFE9] border border-[#E6E4DD] hover:border-[#141413] text-[#141413] text-xs font-medium flex items-center gap-2 transition-colors duration-500 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          <div
            className="editorial-morph"
            data-expanded={filtersOpen ? "true" : "false"}
          >
            <div>
              <div className="mt-6 p-6 bg-[#F2EFE9] border border-[#E6E4DD] space-y-5">
                <div className="flex items-center justify-between border-b border-[#E6E4DD] pb-3">
                  <span className="text-xs uppercase tracking-[0.14em] text-[#57554F]">
                    Filter Advocates
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity("All");
                      setMaxFee(10000);
                      setProBonoOnly(false);
                      setFemaleAdvocateOnly(false);
                    }}
                    className="text-xs text-[#141413] underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div>
                    <label className="block text-xs font-medium text-[#383733] mb-1.5">
                      City / High Court Seat
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#E6E4DD] text-xs bg-[#FAF9F5]"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#383733] mb-1.5">
                      Max Consultation Fee:{" "}
                      <strong className="text-[#141413]">
                        PKR {maxFee.toLocaleString()}
                      </strong>
                    </label>
                    <input
                      type="range"
                      min={1500}
                      max={10000}
                      step={500}
                      value={maxFee}
                      onChange={(e) => setMaxFee(Number(e.target.value))}
                      className="w-full accent-[#0B5D3B]"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 text-xs font-medium text-[#141413] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={femaleAdvocateOnly}
                      onChange={(e) => setFemaleAdvocateOnly(e.target.checked)}
                    />
                    <span>Female Advocate Only</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs font-medium text-[#141413] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={proBonoOnly}
                      onChange={(e) => setProBonoOnly(e.target.checked)}
                    />
                    <span>Pro-Bono Legal Aid Roster</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-[#57554F]">
            Loading verified Bar Council profiles…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredLawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className="editorial-card bg-[#FAF9F5] p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/lawyers/${lawyer.id}`}
                        className="font-legal-serif text-xl font-bold text-[#141413] hover:text-[#0B5D3B] transition-colors duration-500 block"
                      >
                        {lawyer.name}
                      </Link>
                      {lawyer.name_urdu && (
                        <div
                          dir="rtl"
                          className="font-urdu text-lg text-[#57554F]"
                        >
                          {lawyer.name_urdu}
                        </div>
                      )}
                      <div className="text-xs text-[#57554F] mt-1">
                        {lawyer.court || "High Court"} · {lawyer.location}
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-[#F2EFE9] text-[#141413] font-medium shrink-0">
                      {lawyer.specialty}
                    </span>
                  </div>

                  <p className="text-sm text-[#57554F] leading-[1.75]">
                    {lawyer.bio || lawyer.intro}
                  </p>
                </div>

                <div className="pt-5 border-t border-[#E6E4DD] space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#57554F]">
                    <span>{lawyer.bar_council_id || "PBC-Verified"}</span>
                    <span className="font-semibold text-[#141413]">
                      PKR {(lawyer.fee || 3500).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/lawyers/${lawyer.id}`}
                      className="flex-1 py-2.5 px-4 border border-[#E6E4DD] hover:border-[#141413] text-center text-xs font-medium text-[#141413] transition-colors duration-500"
                    >
                      Chamber Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => setBookingLawyer(lawyer)}
                      className="flex-1 py-2.5 px-4 bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs font-medium transition-colors duration-500 cursor-pointer"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredLawyers.length === 0 && (
              <div className="col-span-2 py-16 text-center text-sm text-[#57554F] border border-[#E6E4DD]">
                No advocates match the active filters. Try resetting the fee
                range or toggles.
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
        triggerReason="Verify your Client account to book an Escrow Consultation."
        lang="en"
      />
    </div>
  );
}