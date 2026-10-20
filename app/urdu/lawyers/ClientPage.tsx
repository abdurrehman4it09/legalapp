"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/app/supabase";
import Link from "next/link";
import Header from "../../Header";
import { SlidersHorizontal } from "lucide-react";
import {
  BookingEscrowModal,
  SmartAuthModal,
  UserSession,
} from "../../components/PlatformModals";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function UrduLawyerDirectory() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("سب");
  const [maxFee, setMaxFee] = useState(10000);
  const [proBonoOnly, setProBonoOnly] = useState(false);
  const [femaleOnly, setFemaleOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [bookingLawyer, setBookingLawyer] = useState<any | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    async function getLawyers() {
      const { data } = await supabase
        .from("lawyers")
        .select("*")
        .order("id", { ascending: false });
      if (data) setLawyers(data);
    }
    getLawyers();
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
    "سب",
    ...Array.from(
      new Set(lawyers.map((l) => l.city_urdu || l.location).filter(Boolean))
    ),
  ];

  const filteredLawyers = lawyers.filter((l) => {
    const q = search.toLowerCase();
    const name = (l.name_urdu || l.name || "").toLowerCase();
    const specialty = (l.specialty_urdu || l.specialty || "").toLowerCase();
    const city = (l.city_urdu || l.location || "").toLowerCase();

    const matchesSearch =
      name.includes(q) || specialty.includes(q) || city.includes(q);
    const currentCity = l.city_urdu || l.location;
    const matchesCity = cityFilter === "سب" || currentCity === cityFilter;
    const matchesFee = (l.fee || 0) <= maxFee;
    const matchesProBono = !proBonoOnly || Boolean(l.pro_bono);
    const matchesFemale = !femaleOnly || Boolean(l.is_female);

    return (
      matchesSearch &&
      matchesCity &&
      matchesFee &&
      matchesProBono &&
      matchesFemale
    );
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#FBF9F5] text-[#111111] font-urdu">
      <Header lang="ur" />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10 border-b-2 border-stone-900 pb-8">
          <div className="font-ui text-xs text-[#064E3B] font-semibold mb-2">
            اسکرین 06 اور 07 · پاکستان بار کونسل تصدیق شدہ ڈائریکٹری
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-stone-950 mb-3 leading-normal">
                تصدیق شدہ ہائی کورٹ اور سپریم کورٹ وکلاء
              </h1>
              <p className="text-stone-600 text-lg leading-loose">
                ایسکرو (Escrow) مالیاتی تحفظ کے ساتھ پاکستان بھر کے ممتاز قانونی ماہرین سے مشاورت بک کریں۔
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="font-ui px-4 py-2.5 bg-stone-900 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              <span>ایڈوانس سرچ فلٹرز (Screen 07)</span>
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 font-ui">
            <input
              type="text"
              placeholder="نام، مہارت یا شہر سے تلاش کریں..."
              className="flex-1 min-w-[240px] px-4 py-2.5 bg-white border border-stone-300 text-xs outline-none focus:border-[#064E3B]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setFemaleOnly(!femaleOnly)}
              className={`px-3.5 py-2.5 text-xs font-semibold border cursor-pointer ${
                femaleOnly
                  ? "bg-[#064E3B] text-white border-[#064E3B]"
                  : "bg-white text-stone-700 border-stone-300"
              }`}
            >
              صرف خاتون ایڈووکیٹ (Female Advocate)
            </button>
            <button
              type="button"
              onClick={() => setProBonoOnly(!proBonoOnly)}
              className={`px-3.5 py-2.5 text-xs font-semibold border cursor-pointer ${
                proBonoOnly
                  ? "bg-[#064E3B] text-white border-[#064E3B]"
                  : "bg-white text-stone-700 border-stone-300"
              }`}
            >
              مفت قانونی امداد (Pro-Bono)
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-5 bg-white border border-stone-300 font-ui grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  شہر منتخب کریں
                </label>
                <div className="flex gap-2 flex-wrap">
                  {cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setCityFilter(city)}
                      className={`px-3 py-1 text-xs font-semibold ${
                        cityFilter === city
                          ? "bg-[#064E3B] text-white"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  زیادہ سے زیادہ فیس:{" "}
                  <span className="font-mono-code text-[#064E3B]" dir="ltr">
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
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLawyers.length === 0 ? (
            <p className="text-stone-500 col-span-3 py-12 text-center">
              منتخب فلٹر کے مطابق کوئی ایڈووکیٹ موجود نہیں ہے۔
            </p>
          ) : (
            filteredLawyers.map((lawyer: any) => (
              <article
                key={lawyer.id}
                className="bg-white border border-stone-300 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 bg-[#064E3B] text-[#D4AF37] font-legal font-bold text-lg flex items-center justify-center border border-[#B48327] shrink-0">
                      {lawyer.name ? lawyer.name.replace("Adv. ", "").charAt(0) : "A"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-950">
                        {lawyer.name_urdu || lawyer.name}
                      </h3>
                      <div className="font-ui text-xs text-stone-500">
                        {lawyer.court_urdu || lawyer.court} ·{" "}
                        {lawyer.city_urdu || lawyer.location}
                      </div>
                    </div>
                  </div>

                  <div className="font-ui text-xs font-semibold text-[#064E3B] mb-2">
                    {lawyer.specialty_urdu || lawyer.specialty}
                  </div>
                  <p className="text-sm text-stone-600 leading-loose mb-4">
                    {lawyer.intro_urdu || lawyer.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200 font-ui space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">ایسکرو مشاورتی فیس:</span>
                    <span className="font-mono-code font-bold text-stone-950" dir="ltr">
                      PKR {(lawyer.fee || 3500).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/lawyers/${lawyer.id}`}
                      className="flex-1 py-2 px-3 border border-stone-300 text-center text-xs font-semibold"
                    >
                      پروفائل (21)
                    </Link>
                    <button
                      type="button"
                      onClick={() => setBookingLawyer(lawyer)}
                      className="flex-1 py-2 px-3 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                    >
                      بکنگ کریں (22)
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      <BookingEscrowModal
        lawyer={bookingLawyer}
        onClose={() => setBookingLawyer(null)}
        userSession={userSession}
        onRequireAuth={() => {
          setBookingLawyer(null);
          setAuthModalOpen(true);
        }}
        lang="ur"
      />

      <SmartAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(s) => setUserSession(s)}
        triggerReason="اسکرین 13 • اپائنٹمنٹ بک کرنے کے لیے اپنے اکاؤنٹ کی تصدیق کریں۔"
        lang="ur"
      />
    </div>
  );
}