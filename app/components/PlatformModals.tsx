"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Scale,
  ShieldCheck,
  FileText,
  Send,
  Mic,
  Paperclip,
  CheckCircle2,
  Lock,
  UserCheck,
  Calendar,
  Video,
  PhoneOff,
  Star,
  Download,
  Upload,
  Bell,
  Settings,
  Globe,
  Sun,
  LogOut,
  Briefcase,
  FolderOpen,
  Plus,
  Users,
  Wallet,
  MessageSquare,
} from "lucide-react";
import { getTableData, saveTableData } from "@/app/supabase";

export interface UserSession {
  phoneOrEmail: string;
  role: "client" | "advocate";
  name: string;
  city: string;
  barCouncilId?: string;
  highCourt?: string;
  verifiedStatus?: "verified" | "under_review";
}

/* ============================================================================
   SCREEN 03: GLOBAL SEARCH OVERLAY POPUP
   ============================================================================ */
export function GlobalSearchModal({
  isOpen,
  onClose,
  lang = "en",
}: {
  isOpen: boolean;
  onClose: () => void;
  lang?: "en" | "ur";
}) {
  const [query, setQuery] = useState("");
  const isUr = lang === "ur";

  if (!isOpen) return null;

  const articles = getTableData("articles");
  const laws = getTableData("laws");
  const lawyers = getTableData("lawyers");
  const templates = getTableData("templates");

  const q = query.trim().toLowerCase();

  const matchedArticles = q
    ? articles.filter(
        (a) =>
          (a.title || "").toLowerCase().includes(q) ||
          (a.title_urdu || "").includes(q) ||
          (a.category || "").toLowerCase().includes(q)
      )
    : articles.slice(0, 2);

  const matchedLaws = q
    ? laws.filter(
        (l) =>
          (l.title || "").toLowerCase().includes(q) ||
          (l.title_urdu || "").includes(q) ||
          (l.category || "").toLowerCase().includes(q)
      )
    : laws.slice(0, 2);

  const matchedLawyers = q
    ? lawyers.filter(
        (lw) =>
          (lw.name || "").toLowerCase().includes(q) ||
          (lw.name_urdu || "").includes(q) ||
          (lw.specialty || "").toLowerCase().includes(q) ||
          (lw.location || "").toLowerCase().includes(q)
      )
    : lawyers.slice(0, 2);

  const matchedTemplates = q
    ? templates.filter(
        (t) =>
          (t.title || "").toLowerCase().includes(q) ||
          (t.title_urdu || "").includes(q)
      )
    : templates.slice(0, 2);

  return (
    <div
      dir={isUr ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4 pb-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-[#FBF9F5] text-[#111111] border border-stone-300 w-full max-w-3xl shadow-2xl overflow-hidden ${
          isUr ? "font-urdu" : "font-legal"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-300 bg-white">
          <Search className="w-5 h-5 text-[#064E3B] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isUr
                ? "اسکرین 03 • مضامین، قوانین (PPC/آئین)، وکلاء یا قانونی مسودات تلاش کریں..."
                : "Screen 03 Global Search • Statutes (Art 10A, Sec 489-F), articles, advocates, or templates..."
            }
            className="w-full bg-transparent text-base font-ui focus:outline-none text-stone-900 placeholder:text-stone-400"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 font-ui text-xs flex items-center gap-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto font-ui">
          <div>
            <div className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-3">
              {isUr ? "قوانین اور آئینی دفعات (Statutes)" : "Statutes & Constitutional Articles"}
            </div>
            <div className="divide-y divide-stone-200 border border-stone-200 bg-white">
              {matchedLaws.map((law) => (
                <Link
                  key={law.id}
                  href={isUr ? `/urdu/laws/${law.id}` : `/laws/${law.id}`}
                  onClick={onClose}
                  className="block px-4 py-3 hover:bg-stone-50 transition-colors"
                >
                  <div className="text-xs text-[#064E3B] font-medium">
                    {law.category} · {law.section_number || "Statute"}
                  </div>
                  <div className="text-sm font-semibold text-stone-900 mt-0.5">
                    {isUr ? law.title_urdu || law.title : law.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-3">
              {isUr ? "ادارتی مضامین (The Daily Brief)" : "Editorial Briefings"}
            </div>
            <div className="divide-y divide-stone-200 border border-stone-200 bg-white">
              {matchedArticles.map((art) => (
                <Link
                  key={art.id}
                  href={isUr ? `/urdu/article/${art.id}` : `/article/${art.id}`}
                  onClick={onClose}
                  className="block px-4 py-3 hover:bg-stone-50 transition-colors"
                >
                  <div className="text-xs text-stone-500">
                    {isUr ? art.category_urdu || art.category : art.category} ·{" "}
                    {isUr ? art.author_urdu || art.author : art.author}
                  </div>
                  <div className="text-sm font-semibold text-stone-900 mt-0.5">
                    {isUr ? art.title_urdu || art.title : art.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-3">
              {isUr ? "تصدیق شدہ وکلاء (Verified Counsel)" : "Verified High Court & Supreme Court Advocates"}
            </div>
            <div className="divide-y divide-stone-200 border border-stone-200 bg-white">
              {matchedLawyers.map((lw) => (
                <Link
                  key={lw.id}
                  href={isUr ? `/urdu/lawyers` : `/lawyers/${lw.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-stone-900">
                      {isUr ? lw.name_urdu || lw.name : lw.name}
                    </div>
                    <div className="text-xs text-stone-500">
                      {isUr ? lw.court_urdu || lw.court : lw.court} ·{" "}
                      {isUr ? lw.specialty_urdu || lw.specialty : lw.specialty}
                    </div>
                  </div>
                  <span className="font-mono-code text-xs font-semibold text-[#064E3B]">
                    PKR {lw.fee?.toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-3">
              {isUr ? "قانونی مسودات (Legal Drafts)" : "Verified Legal Drafts & Agreements"}
            </div>
            <div className="divide-y divide-stone-200 border border-stone-200 bg-white">
              {matchedTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-semibold text-stone-900">
                      {isUr ? tpl.title_urdu || tpl.title : tpl.title}
                    </div>
                    <div className="text-xs text-stone-500">
                      {tpl.pages} Pages · Bilingual EN/UR
                    </div>
                  </div>
                  <span className="font-mono-code text-xs font-semibold text-stone-900">
                    PKR {tpl.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SCREENS 13–20: SMART AUTHENTICATION GATEWAY & ROLE SETUP WIZARD
   ============================================================================ */
export function SmartAuthModal({
  isOpen,
  onClose,
  onSuccess,
  triggerReason,
  lang = "en",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: UserSession) => void;
  triggerReason?: string;
  lang?: "en" | "ur";
}) {
  const isUr = lang === "ur";
  const [step, setStep] = useState<
    "13_sheet" | "14_login" | "15_otp" | "16_role" | "17_client" | "18_lawyer" | "19_media" | "20_review"
  >("13_sheet");
  const [phoneOrEmail, setPhoneOrEmail] = useState("+92 300 5550199");
  const [otp, setOtp] = useState(["4", "8", "2", "9"]);
  const [role, setRole] = useState<"client" | "advocate">("client");
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("Islamabad");
  const [interests, setInterests] = useState<string[]>(["Property & Inheritance"]);
  const [barCouncilId, setBarCouncilId] = useState("PBC-HC-2019-7412");
  const [practiceYears, setPracticeYears] = useState("7");
  const [highCourt, setHighCourt] = useState("Islamabad High Court");
  const [licenseFile, setLicenseFile] = useState("Bar_Council_License_Card_Verified.pdf");

  if (!isOpen) return null;

  const completeClientSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const session: UserSession = {
      phoneOrEmail,
      role: "client",
      name: fullName || (isUr ? "طارق محمود" : "Tariq Mehmood"),
      city,
      verifiedStatus: "verified",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("plp_user_session", JSON.stringify(session));
    }
    onSuccess(session);
    onClose();
  };

  const finalizeLawyerSession = () => {
    const session: UserSession = {
      phoneOrEmail,
      role: "advocate",
      name: fullName || (isUr ? "ایڈووکیٹ حمزہ گیلانی" : "Adv. Hamza Gilani"),
      city,
      barCouncilId,
      highCourt,
      verifiedStatus: "verified",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("plp_user_session", JSON.stringify(session));
    }
    onSuccess(session);
    onClose();
  };

  return (
    <div
      dir={isUr ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF9F5] text-[#111111] border border-stone-300 w-full max-w-lg shadow-2xl overflow-hidden font-ui"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#064E3B] text-white px-6 py-5 flex items-center justify-between border-b border-[#B48327]/40">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] block font-medium">
                {isUr ? "ماڈیول 2 • اسمارٹ تصدیقی گیٹ وے (Screens 13–20)" : "Module 2 • Smart Auth Gateway (Screens 13–20)"}
              </span>
              <h3 className="text-base font-bold tracking-tight">
                {isUr ? "دی ڈیلی لیگل بریف — اکاؤنٹ تصدیق" : "The Daily Legal Brief — Zero-Trust Auth"}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Pills for Testing Screens 13-20 */}
        <div className="px-6 py-2 bg-stone-100 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {(
            [
              { id: "13_sheet", label: "13. Trigger" },
              { id: "14_login", label: "14. +92 Login" },
              { id: "15_otp", label: "15. OTP" },
              { id: "16_role", label: "16. Role" },
              { id: "17_client", label: "17. Client" },
              { id: "18_lawyer", label: "18. Lawyer" },
              { id: "19_media", label: "19. Media" },
              { id: "20_review", label: "20. Review" },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={`px-2 py-1 font-semibold whitespace-nowrap cursor-pointer ${
                step === s.id
                  ? "bg-[#064E3B] text-white"
                  : "text-stone-600 hover:bg-stone-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {step === "13_sheet" && (
            <div className="space-y-5">
              <div className="p-4 bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#B48327] shrink-0 mt-0.5" />
                <div>
                  <strong className="block mb-0.5">
                    {isUr ? "اسکرین 13 • تصدیق درکار ہے" : "Screen 13 • Protected Action Triggered"}
                  </strong>
                  <span>
                    {triggerReason ||
                      (isUr
                        ? "قانونی مسودہ ڈاؤن لوڈ کرنے، سوال پوسٹ کرنے یا وکیل بک کرنے کے لیے لاگ ان کریں۔"
                        : "Guest discovery is free. To unlock legal templates, book an advocate via Escrow, or post to the Q&A forum, verify your +92 phone or email.")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep("14_login")}
                className="w-full py-3.5 px-4 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                {isUr ? "اسکرین 14 پر جائیں (+92 لاگ ان)" : "Proceed to +92 Phone / Email Login (Screen 14) →"}
              </button>
            </div>
          )}

          {step === "14_login" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("15_otp");
              }}
              className="space-y-5"
            >
              <div>
                <div className="text-xs text-stone-500 mb-1">
                  {isUr ? "اسکرین 14 • محفوظ لاگ ان / سائن اپ" : "Screen 14 • Secure Login / Signup"}
                </div>
                <h4 className="text-xl font-bold font-legal text-stone-900">
                  {isUr ? "اپنا موبائل نمبر (+92) یا ای میل درج کریں" : "Enter +92 Mobile Number or Email"}
                </h4>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  {isUr ? "فون نمبر یا ای میل" : "Pakistan Mobile (+92) or Email"}
                </label>
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#064E3B] font-mono-code"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#064E3B] hover:bg-emerald-950 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {isUr ? "تصدیقی کوڈ حاصل کریں (Screen 15)" : "Send 4-Digit OTP Code (Screen 15)"}
              </button>
            </form>
          )}

          {step === "15_otp" && (
            <div className="space-y-6">
              <div>
                <div className="text-xs text-stone-500 mb-1">
                  {isUr ? "اسکرین 15 • او ٹی پی تصدیق" : "Screen 15 • OTP Verification Modal"}
                </div>
                <h4 className="text-xl font-bold font-legal text-stone-900">
                  {isUr ? "4 ہندسوں کا کوڈ درج کریں" : "Verify 4-Digit Security Code"}
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  Sent to {phoneOrEmail} · Timer: <span className="font-mono-code font-bold text-[#064E3B]">01:48</span>
                </p>
              </div>

              <div className="flex justify-center gap-3" dir="ltr">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const next = [...otp];
                      next[idx] = e.target.value;
                      setOtp(next);
                    }}
                    className="w-14 h-14 text-center text-xl font-bold font-mono-code bg-white border-2 border-stone-300 focus:border-[#064E3B] focus:outline-none"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep("16_role")}
                className="w-full py-3 px-4 bg-[#064E3B] hover:bg-emerald-950 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {isUr ? "کوڈ کی تصدیق کریں (Screen 16)" : "Verify OTP & Select Role (Screen 16)"}
              </button>
            </div>
          )}

          {step === "16_role" && (
            <div className="space-y-5">
              <div>
                <div className="text-xs text-stone-500 mb-1">
                  {isUr ? "اسکرین 16 • کردار کا انتخاب" : "Screen 16 • Role Selection Screen"}
                </div>
                <h4 className="text-xl font-bold font-legal text-stone-900">
                  {isUr ? "آپ کون ہیں؟" : "Select Your Workspace Role"}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setRole("client");
                    setStep("17_client");
                  }}
                  className="p-5 text-left border border-stone-300 bg-white hover:border-[#064E3B] cursor-pointer"
                >
                  <UserCheck className="w-6 h-6 text-[#064E3B] mb-3" />
                  <div className="font-bold text-sm text-stone-900">
                    {isUr ? "میں ایک کلائنٹ ہوں" : "I am a Client"}
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Opens Screen 17 Client Profile Setup Wizard
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("advocate");
                    setStep("18_lawyer");
                  }}
                  className="p-5 text-left border border-stone-300 bg-white hover:border-[#064E3B] cursor-pointer"
                >
                  <Scale className="w-6 h-6 text-[#B48327] mb-3" />
                  <div className="font-bold text-sm text-stone-900">
                    {isUr ? "میں ایک ایڈووکیٹ ہوں" : "I am an Advocate"}
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Opens Screen 18 Bar Council Verification Flow
                  </p>
                </button>
              </div>
            </div>
          )}

          {step === "17_client" && (
            <form onSubmit={completeClientSetup} className="space-y-4">
              <div>
                <div className="text-xs text-stone-500 mb-1">
                  Screen 17 • Client Profile Setup Wizard
                </div>
                <h4 className="text-xl font-bold font-legal text-stone-900">
                  Full Name, City & Legal Interests
                </h4>
              </div>

              <input
                type="text"
                required
                placeholder="Full Name (e.g., Tariq Mehmood)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-sm"
              />

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-sm"
              >
                <option value="Islamabad">Islamabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Peshawar">Peshawar</option>
              </select>

              <div className="flex flex-wrap gap-2">
                {["Family Law", "Property & Inheritance", "Tax & Corporate", "Criminal Bail"].map(
                  (chip) => {
                    const active = interests.includes(chip);
                    return (
                      <button
                        type="button"
                        key={chip}
                        onClick={() =>
                          setInterests(
                            active
                              ? interests.filter((i) => i !== chip)
                              : [...interests, chip]
                          )
                        }
                        className={`px-3 py-1.5 text-xs font-medium border cursor-pointer ${
                          active
                            ? "bg-[#064E3B] text-white border-[#064E3B]"
                            : "bg-white text-stone-700 border-stone-300"
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#064E3B] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Complete Client Setup & Unlock Platform
              </button>
            </form>
          )}

          {step === "18_lawyer" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("20_review");
              }}
              className="space-y-4"
            >
              <div>
                <div className="text-xs text-stone-500 mb-1">
                  Screen 18 • Lawyer Verification Flow
                </div>
                <h4 className="text-xl font-bold font-legal text-stone-900">
                  Bar Council License, Year of Practice & High Court
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Advocate Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="px-3 py-2 bg-white border border-stone-300 text-xs"
                />
                <input
                  type="text"
                  required
                  value={barCouncilId}
                  onChange={(e) => setBarCouncilId(e.target.value)}
                  className="px-3 py-2 bg-white border border-stone-300 text-xs font-mono-code"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={highCourt}
                  onChange={(e) => setHighCourt(e.target.value)}
                  className="px-3 py-2 bg-white border border-stone-300 text-xs"
                >
                  <option>Supreme Court of Pakistan</option>
                  <option>Islamabad High Court</option>
                  <option>Lahore High Court</option>
                  <option>Sindh High Court</option>
                  <option>Peshawar High Court</option>
                </select>
                <input
                  type="number"
                  value={practiceYears}
                  onChange={(e) => setPracticeYears(e.target.value)}
                  placeholder="Years of Practice"
                  className="px-3 py-2 bg-white border border-stone-300 text-xs font-mono-code"
                />
              </div>

              <div className="p-4 border border-dashed border-stone-400 bg-white flex items-center justify-between">
                <div className="text-xs">
                  <strong className="block text-stone-900">Bar License Document:</strong>
                  <span className="font-mono-code text-stone-500">{licenseFile}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("19_media")}
                  className="px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold cursor-pointer"
                >
                  Open Media Picker (Screen 19)
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#064E3B] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Submit for Admin Review (Screen 20)
              </button>
            </form>
          )}

          {step === "19_media" && (
            <div className="space-y-4">
              <div className="text-xs text-stone-500">
                Screen 19 • Media Picker Bottom Sheet (Camera / Gallery / PDF)
              </div>
              <h4 className="text-lg font-bold font-legal text-stone-900">
                Select Bar Council License Source
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Camera Capture", file: "Camera_BarCard_Scan_2026.jpg" },
                  { label: "Photo Gallery", file: "Gallery_HighCourt_ID.png" },
                  { label: "PDF Document", file: "PBC_Verified_Roll_2026.pdf" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      setLicenseFile(opt.file);
                      setStep("18_lawyer");
                    }}
                    className="p-4 bg-white border border-stone-300 hover:border-[#064E3B] text-xs font-semibold text-center cursor-pointer"
                  >
                    <Upload className="w-5 h-5 mx-auto mb-2 text-[#064E3B]" />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "20_review" && (
            <div className="text-center space-y-4 py-2">
              <ShieldCheck className="w-10 h-10 text-[#B48327] mx-auto" />
              <div className="text-xs uppercase tracking-widest text-[#B48327] font-semibold">
                Screen 20 • Profile Under Review Modal
              </div>
              <h4 className="text-xl font-bold font-legal text-stone-900">
                Bar Council Credentials Queued for Admin Verification
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Your Bar Council License ({barCouncilId} · {highCourt}) has been uploaded via ClamAV & EXIF-scrubbed pipeline. Click below to activate your Advocate CRM session.
              </p>
              <button
                type="button"
                onClick={finalizeLawyerSession}
                className="w-full py-3 bg-[#064E3B] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Approve & Enter Advocate CRM (Screens 35–49)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SCREENS 28–30 & 40–42: AI LEGAL ASSISTANT & AI RESEARCHER PRO (RAG + EDITOR)
   ============================================================================ */
export function LegalAIWorkspaceModal({
  isOpen,
  onClose,
  lang = "en",
  initialMode = "assistant",
}: {
  isOpen: boolean;
  onClose: () => void;
  lang?: "en" | "ur";
  initialMode?: "assistant" | "researcher";
}) {
  const isUr = lang === "ur";
  const [mode, setMode] = useState<"assistant" | "researcher">(initialMode);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showPromptSheet, setShowPromptSheet] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<any | null>(null);
  const [petitionDraft, setPetitionDraft] = useState(
    `IN THE HIGH COURT OF [ISLAMABAD / LAHORE / SINDH]\nWRIT PETITION NO. ______ OF 2026\n\n[Petitioner Name] ... PETITIONER\nVERSUS\nFederation of Pakistan & Others ... RESPONDENTS\n\nWRIT PETITION UNDER ARTICLE 199 OF THE CONSTITUTION OF THE ISLAMIC REPUBLIC OF PAKISTAN, 1973\n\nRespectfully Sheweth:\n1. That the Petitioner is a law-abiding citizen of Pakistan entitled to fundamental protections guaranteed under Articles 9, 10A, 23, and 25 of the Constitution.\n2. That the impugned action of the Respondents is coram non judice and void ab initio under PLD 2024 SC 112.\n\nPRAYER:\nIt is most respectfully prayed that this Honourable Court may graciously issue a writ of mandamus directing the Respondents to proceed strictly in accordance with law.`
  );
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "ai"; text: string; citations?: any[] }>
  >([
    {
      role: "ai",
      text: isUr
        ? "السلام علیکم! میں دی ڈیلی لیگل بریف کا AI قانونی معاون (اسکرین 28 اور 40) ہوں۔ آپ مجھ سے آئینِ پاکستان 1973، تعزیراتِ پاکستان (PPC)، وراثتی حقوق، ایف بی آر ٹیکس یا ضمانت کے قوانین کے بارے میں پوچھ سکتے ہیں۔"
        : "Welcome to The Daily Legal Brief Statutory AI Engine (Screens 28–30 & 40–42). Ask any question regarding the Constitution of Pakistan 1973, PPC, CrPC, NADRA Succession, or PSEB Tax exemptions, or use the right pane to draft High Court petitions.",
      citations: getTableData("ai_citations"),
    },
  ]);

  if (!isOpen) return null;

  async function handleAsk(customPrompt?: string) {
    const queryText = (customPrompt ?? prompt).trim();
    if (!queryText) return;
    setPrompt("");
    setShowPromptSheet(false);
    setMessages((prev) => [...prev, { role: "user", text: queryText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/legal-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryText, lang, mode }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.text || "Unable to retrieve statutory analysis.",
          citations: data.citations || getTableData("ai_citations"),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Error communicating with Legal AI route.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const storedPrompts = getTableData("ai_prompts");
  const promptSuggestions =
    storedPrompts.length > 0
      ? storedPrompts.map((p: any) => (isUr ? p.prompt_ur || p.prompt_en : p.prompt_en))
      : isUr
      ? [
          "دفعہ 497 ضابطہ فوجداری کے تحت ضمانت بعد از گرفتاری کی درخواست تیار کریں",
          "خواتین کے وراثتی حقوق ایکٹ 2020 کے تحت محتسب کو درخواست کا طریقہ",
        ]
      : [
          "Draft a post-arrest bail petition under Section 497 CrPC",
          "Find property inheritance case laws under PLD 2024 SC 112",
        ];

  return (
    <div
      dir={isUr ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF9F5] text-[#111111] border border-stone-300 w-full max-w-6xl h-[86vh] flex flex-col shadow-2xl overflow-hidden font-ui"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#064E3B] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#B48327]/40 shrink-0">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-sm sm:text-base font-bold tracking-tight">
              {mode === "researcher"
                ? "Screen 40 • AI Researcher Pro (Split-Pane Legal RAG & Petition Editor)"
                : "Screen 28 • Basic AI Legal Assistant Chat"}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode("assistant")}
              className={`px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                mode === "assistant"
                  ? "bg-white text-[#064E3B]"
                  : "bg-emerald-900/60 text-white"
              }`}
            >
              Screen 28 Assistant
            </button>
            <button
              type="button"
              onClick={() => setMode("researcher")}
              className={`px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                mode === "researcher"
                  ? "bg-[#D4AF37] text-stone-950"
                  : "bg-emerald-900/60 text-white"
              }`}
            >
              Screen 40 Researcher Pro
            </button>
            <button
              type="button"
              onClick={() => setShowPromptSheet(!showPromptSheet)}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-950 text-[#D4AF37] border border-[#D4AF37]/40 cursor-pointer"
            >
              Screen 41 Prompts
            </button>
            <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          <div
            className={`${
              mode === "researcher" ? "lg:col-span-7 border-r border-stone-300" : "lg:col-span-12"
            } flex flex-col h-full overflow-hidden bg-[#FBF9F5]`}
          >
            {showPromptSheet && (
              <div className="p-4 bg-white border-b border-stone-300 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#064E3B]">
                  <span>Screen 41 • AI Prompt Suggestions Bottom Sheet</span>
                  <button onClick={() => setShowPromptSheet(false)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {promptSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAsk(sug)}
                      className="p-2.5 text-left text-xs bg-stone-50 hover:bg-[#064E3B] hover:text-white border border-stone-200 transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    m.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div className="text-[11px] text-stone-500 mb-1">
                    {m.role === "user" ? "Your Query" : "Pakistan Legal RAG Engine"}
                  </div>
                  <div
                    className={`max-w-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-stone-900 text-white"
                        : "bg-white border border-stone-300 text-stone-900"
                    }`}
                  >
                    {m.text}

                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-stone-200">
                        <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-2">
                          Screen 42 • Verified PLD / SCMR Citations (Click to inspect):
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {m.citations.map((cit, cIdx) => (
                            <button
                              key={cIdx}
                              type="button"
                              onClick={() => setSelectedCitation(cit)}
                              className="px-2.5 py-1 text-xs font-mono-code bg-emerald-950/5 border border-[#064E3B]/30 text-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-colors cursor-pointer"
                            >
                              {cit.code} — {cit.court}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="p-4 bg-white border border-stone-200 text-xs text-[#064E3B] font-medium">
                  Querying Pakistan Code, Constitution 1973 & Supreme Court PLD/SCMR precedents...
                </div>
              )}
            </div>

            {/* Screen 29: Attachment Options Bottom Sheet */}
            {showAttachMenu && (
              <div className="px-6 py-4 bg-stone-100 border-t border-stone-300 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-stone-800">
                  Screen 29 • Attachment Options Bottom Sheet:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(false);
                      setPrompt("Scan Document OCR: Attached Urdu FIR No. 412/2026 under Sec 489-F PPC.");
                    }}
                    className="px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-900 cursor-pointer"
                  >
                    1. Scan Document OCR
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(false);
                      setPrompt("Upload PDF/Image: Attached Property Fard / Mutation (Intiqal) deed.");
                    }}
                    className="px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-900 cursor-pointer"
                  >
                    2. Upload PDF / Image
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(false);
                      setPrompt("Share Location: Jurisdiction Islamabad High Court / F-8 Civil Courts.");
                    }}
                    className="px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-900 cursor-pointer"
                  >
                    3. Share Court Location
                  </button>
                </div>
              </div>
            )}

            {/* Screen 30: Voice-to-Text Recording Overlay */}
            {showVoiceOverlay && (
              <div className="px-6 py-4 bg-[#064E3B] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <div className="text-xs font-bold">
                      Screen 30 • Voice-to-Text Recording Overlay (Emerald Soundwave Active)
                    </div>
                    <div className="text-[11px] text-emerald-200">
                      Dictating bilingual English / Urdu statutory query...
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowVoiceOverlay(false);
                    setPrompt(
                      isUr
                        ? "وراثتی جائیداد میں بہنوں کا حصہ نہ دینے پر قانونی کارروائی کا طریقہ کار کیا ہے؟"
                        : "What is the procedure to obtain a NADRA Succession Certificate within 15 days?"
                    );
                  }}
                  className="px-3 py-1.5 bg-[#D4AF37] text-stone-950 text-xs font-bold cursor-pointer"
                >
                  Insert Voice Transcription
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="p-4 bg-white border-t border-stone-300 flex items-center gap-2 shrink-0"
            >
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                title="Screen 29 • Attachment Options"
                className="p-2.5 border border-stone-300 text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowVoiceOverlay(!showVoiceOverlay)}
                title="Screen 30 • Voice-to-Text Overlay"
                className="p-2.5 border border-stone-300 text-stone-600 hover:text-[#064E3B] cursor-pointer"
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask about Pakistani statutes, bail, property mutation, tax, or case citations..."
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 text-sm focus:outline-none focus:border-[#064E3B]"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Consult AI</span>
              </button>
            </form>
          </div>

          {mode === "researcher" && (
            <div className="lg:col-span-5 flex flex-col h-full bg-white overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                    Screen 40 Right Pane · Rich-Text Petition Editor
                  </span>
                  <h4 className="text-xs font-bold text-stone-900">
                    High Court Writ / Bail Petition Draft
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(petitionDraft)}
                  className="px-3 py-1 text-xs border border-stone-300 bg-white hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Copy Petition
                </button>
              </div>
              <textarea
                value={petitionDraft}
                onChange={(e) => setPetitionDraft(e.target.value)}
                className="flex-1 w-full p-5 font-legal text-xs leading-relaxed text-stone-900 focus:outline-none resize-none"
              />
            </div>
          )}
        </div>

        {/* Screen 42: Citation Details Modal */}
        {selectedCitation && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedCitation(null)}
          >
            <div
              className="bg-white border border-stone-300 max-w-md w-full p-6 shadow-xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="font-mono-code text-xs font-bold text-[#064E3B]">
                  Screen 42 • Citation Details Modal ({selectedCitation.code})
                </span>
                <button onClick={() => setSelectedCitation(null)}>
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>
              <h4 className="text-base font-bold font-legal text-stone-900">
                {selectedCitation.title}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {selectedCitation.summary}
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <Link
                  href="/laws/1"
                  onClick={() => {
                    setSelectedCitation(null);
                    onClose();
                  }}
                  className="px-4 py-2 border border-stone-300 text-xs font-semibold text-stone-800"
                >
                  Read Full Text (Screen 12)
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setPetitionDraft(
                      (prev) =>
                        `${prev}\n\n[Cited Precedent: ${selectedCitation.code} — ${selectedCitation.summary}]`
                    );
                    setSelectedCitation(null);
                    setMode("researcher");
                  }}
                  className="px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                >
                  Insert into Petition
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   SCREEN 09: WATERMARKED TEMPLATE PREVIEW MODAL
   ============================================================================ */
export function TemplatePreviewModal({
  template,
  onClose,
  onUnlock,
  userSession,
  lang = "en",
}: {
  template: any | null;
  onClose: () => void;
  onUnlock: (tpl: any) => void;
  userSession: UserSession | null;
  lang?: "en" | "ur";
}) {
  const [unlocked, setUnlocked] = useState(false);
  const isUr = lang === "ur";

  if (!template) return null;

  const handleDownloadAction = () => {
    if (!userSession) {
      onUnlock(template);
      return;
    }
    setUnlocked(true);
  };

  return (
    <div
      dir={isUr ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF9F5] text-[#111111] border border-stone-300 w-full max-w-2xl shadow-2xl overflow-hidden font-ui"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] block">
              Screen 09 • Watermarked Template Preview Modal
            </span>
            <h3 className="text-base font-bold">
              {isUr ? template.title_urdu || template.title : template.title}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600 border-b border-stone-200 pb-3">
            <span>
              {isUr ? template.category_urdu || template.category : template.category} ·{" "}
              {template.pages} Pages · Bilingual (EN/UR)
            </span>
            <span className="font-mono-code font-bold text-[#064E3B] text-sm">
              PKR {template.price?.toLocaleString()}
            </span>
          </div>

          <div className="bg-white border border-stone-300 p-6 font-legal text-xs leading-relaxed text-stone-800 whitespace-pre-wrap max-h-72 overflow-y-auto shadow-inner">
            <div className="text-[10px] font-ui uppercase tracking-widest text-[#B48327] font-semibold mb-3 border-b border-stone-200 pb-2">
              {unlocked
                ? "UNLOCKED FULL LEGAL INSTRUMENT — READY FOR E-STAMP EXECUTION"
                : "WATERMARKED PREVIEW EXCERPT — CLICK UNLOCK & DOWNLOAD BELOW"}
            </div>
            {template.preview_text}
          </div>

          {unlocked ? (
            <div className="p-4 bg-emerald-950/5 border border-[#064E3B] flex items-center justify-between">
              <div className="text-xs text-[#064E3B] font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Full editable Word/PDF legal draft unlocked.</span>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="text-xs text-stone-500">
                {userSession
                  ? `Signed in as ${userSession.name}`
                  : "Clicking Unlock triggers Screen 13 Smart Auth for guests"}
              </div>
              <button
                type="button"
                onClick={handleDownloadAction}
                className="px-5 py-2.5 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Unlock & Download (PKR {template.price})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SCREENS 22–25 & 55–56: APPOINTMENT BOOKING, ESCROW CHECKOUT & VIDEO ROOM
   ============================================================================ */
export function BookingEscrowModal({
  lawyer,
  onClose,
  userSession,
  onRequireAuth,
  lang = "en",
}: {
  lawyer: any | null;
  onClose: () => void;
  userSession: UserSession | null;
  onRequireAuth: () => void;
  lang?: "en" | "ur";
}) {
  const isUr = lang === "ur";
  const [step, setStep] = useState<
    "22_calendar" | "23_confirm" | "24_escrow" | "25_success" | "55_video" | "56_rating"
  >("22_calendar");
  const [selectedDate, setSelectedDate] = useState("2026-10-24");
  const [selectedSlot, setSelectedSlot] = useState("04:00 PM (PKT)");
  const [paymentMethod, setPaymentMethod] = useState<
    "Safepay Card" | "JazzCash" | "EasyPaisa"
  >("Safepay Card");
  const [caseBrief, setCaseBrief] = useState("");
  const [rating, setRating] = useState(5);

  if (!lawyer) return null;

  const confirmBooking = () => {
    if (!userSession) {
      onRequireAuth();
      return;
    }
    const existing = getTableData("appointments");
    const newAppt = {
      id: Date.now(),
      lawyer_id: lawyer.id,
      lawyer_name: lawyer.name,
      lawyer_name_urdu: lawyer.name_urdu || lawyer.name,
      court: lawyer.court || "High Court",
      client_name: userSession.name,
      date: selectedDate,
      time_slot: selectedSlot,
      fee: lawyer.fee || 3500,
      payment_method: `${paymentMethod} Escrow`,
      status: "Active",
      case_summary: caseBrief || "Legal consultation & document review.",
      escrow_id: `ESC-PK-${Math.floor(10000 + Math.random() * 90000)}`,
    };
    saveTableData("appointments", [newAppt, ...existing]);
    setStep("25_success");
  };

  return (
    <div
      dir={isUr ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF9F5] text-[#111111] border border-stone-300 w-full max-w-xl shadow-2xl overflow-hidden font-ui"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#064E3B] text-white px-6 py-4 flex items-center justify-between border-b border-[#B48327]/40">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] block">
              Screens 22–25 & 55–56 • Escrow Booking & Video Chamber
            </span>
            <h3 className="text-base font-bold">
              {isUr ? lawyer.name_urdu || lawyer.name : lawyer.name}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Bar for Testing Screens 22-25 & 55-56 */}
        <div className="px-6 py-2 bg-stone-100 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {(
            [
              { id: "22_calendar", label: "22. Calendar" },
              { id: "23_confirm", label: "23. Confirm Slot" },
              { id: "24_escrow", label: "24. Escrow Pay" },
              { id: "25_success", label: "25. Success" },
              { id: "55_video", label: "55. Video Room" },
              { id: "56_rating", label: "56. 5-Star Rating" },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={`px-2 py-1 font-semibold whitespace-nowrap cursor-pointer ${
                step === s.id
                  ? "bg-[#064E3B] text-white"
                  : "text-stone-600 hover:bg-stone-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-5">
          {step === "22_calendar" && (
            <div className="space-y-4">
              <div className="text-xs text-stone-500">
                Screen 22 • Appointment Booking Calendar
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Select Consultation Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-sm font-mono-code"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Available Chamber Time Slots (PKT)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "11:00 AM (PKT)",
                    "02:30 PM (PKT)",
                    "04:00 PM (PKT)",
                    "05:30 PM (PKT)",
                    "07:00 PM (PKT)",
                    "08:30 PM (PKT)",
                  ].map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 text-xs font-mono-code border transition-colors cursor-pointer ${
                        selectedSlot === slot
                          ? "bg-[#064E3B] text-white border-[#064E3B]"
                          : "bg-white text-stone-800 border-stone-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={caseBrief}
                onChange={(e) => setCaseBrief(e.target.value)}
                placeholder="Brief summary of your legal issue..."
                className="w-full p-3 bg-white border border-stone-300 text-xs h-20"
              />

              <button
                type="button"
                onClick={() => setStep("23_confirm")}
                className="w-full py-3 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
              >
                Review Time Slot Confirmation (Screen 23) →
              </button>
            </div>
          )}

          {step === "23_confirm" && (
            <div className="space-y-4">
              <div className="text-xs text-stone-500">
                Screen 23 • Confirm Time Slot Modal
              </div>
              <div className="bg-white border border-stone-300 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Advocate:</span>
                  <span className="font-bold text-stone-900">{lawyer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Scheduled Slot:</span>
                  <span className="font-mono-code font-semibold">
                    {selectedDate} · {selectedSlot}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2">
                  <span className="text-stone-500">Escrow Retainer Fee:</span>
                  <span className="font-mono-code font-bold text-[#064E3B]">
                    PKR {(lawyer.fee || 3500).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("22_calendar")}
                  className="px-4 py-2.5 border border-stone-300 text-xs font-semibold"
                >
                  Change Slot
                </button>
                <button
                  type="button"
                  onClick={() => setStep("24_escrow")}
                  className="flex-1 py-2.5 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                >
                  Proceed to Escrow Checkout (Screen 24) →
                </button>
              </div>
            </div>
          )}

          {step === "24_escrow" && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-950/5 border border-[#064E3B]/30 flex items-center gap-2.5 text-xs text-[#064E3B]">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#B48327]" />
                <span>
                  Screen 24 • Escrow Checkout & Payment Gateway: Funds are held in Safepay/SBP Escrow and released only after consultation completion.
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(["Safepay Card", "JazzCash", "EasyPaisa"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 border text-xs font-semibold text-center cursor-pointer ${
                      paymentMethod === method
                        ? "border-[#064E3B] bg-[#064E3B] text-white"
                        : "border-stone-300 bg-white text-stone-800"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <div className="bg-white border border-stone-300 p-4 space-y-2">
                <div className="text-xs font-semibold text-stone-700">
                  {paymentMethod === "Safepay Card"
                    ? "Debit / Credit Card"
                    : `${paymentMethod} Mobile Wallet (+92)`}
                </div>
                <input
                  type="text"
                  defaultValue={
                    paymentMethod === "Safepay Card"
                      ? "4242 •••• •••• 8819"
                      : "+92 300 5550199"
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs font-mono-code"
                />
              </div>

              <button
                type="button"
                onClick={confirmBooking}
                className="w-full py-3 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
              >
                Authorize Escrow Deposit — PKR {(lawyer.fee || 3500).toLocaleString()}
              </button>
            </div>
          )}

          {step === "25_success" && (
            <div className="text-center space-y-4 py-2">
              <CheckCircle2 className="w-10 h-10 text-[#064E3B] mx-auto" />
              <div className="text-xs uppercase tracking-widest text-[#B48327] font-semibold">
                Screen 25 • Payment Success Modal
              </div>
              <h4 className="text-xl font-bold font-legal text-stone-900">
                Escrow Deposit Verified & Slot Confirmed
              </h4>
              <p className="text-xs text-stone-600">
                {selectedDate} at {selectedSlot} with {lawyer.name}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("55_video")}
                  className="flex-1 py-2.5 px-4 bg-[#064E3B] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Join In-App Video Room (Screen 55)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 border border-stone-300 text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {step === "55_video" && (
            <div className="space-y-4">
              <div className="bg-stone-950 text-white p-6 relative min-h-64 flex flex-col justify-between border border-stone-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#D4AF37] font-mono-code">
                    Screen 55 • In-App Video Consultation Room • 00:18:40
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-900 text-emerald-100 text-[11px]">
                    PiP Active · E2EE
                  </span>
                </div>

                {/* PiP Self View Box */}
                <div className="my-6 flex items-center justify-between gap-4">
                  <div className="flex-1 text-center">
                    <div className="w-16 h-16 mx-auto border-2 border-[#D4AF37] bg-emerald-950 flex items-center justify-center text-xl font-legal font-bold">
                      {lawyer.name?.charAt(0) || "A"}
                    </div>
                    <div className="text-sm font-bold mt-2">{lawyer.name}</div>
                    <div className="text-xs text-stone-400">{lawyer.court}</div>
                  </div>
                  <div className="w-28 h-20 bg-stone-900 border border-stone-700 flex flex-col items-center justify-center text-[10px] text-stone-400">
                    <span>Client PiP View</span>
                    <span className="font-mono-code text-emerald-400">HD 1080p</span>
                  </div>
                </div>

                {/* Frosted-Glass Controls */}
                <div className="flex items-center justify-center gap-3 pt-3 border-t border-white/15 bg-white/5 backdrop-blur-xs p-2">
                  <button
                    type="button"
                    onClick={() => setStep("56_rating")}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    <span>End Call & Rate 5-Stars (Screen 56)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "56_rating" && (
            <div className="text-center space-y-4 py-2">
              <div className="text-xs uppercase tracking-widest text-stone-500">
                Screen 56 • End Call / 5-Star Rating Modal
              </div>
              <h4 className="text-lg font-bold font-legal text-stone-900">
                Rate Your Consultation with {lawyer.name}
              </h4>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-2 border cursor-pointer ${
                      star <= rating
                        ? "border-[#B48327] bg-amber-50 text-[#B48327]"
                        : "border-stone-200 text-stone-300"
                    }`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
              >
                Release Escrow & Submit Rating
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   COMPLETE 61-SCREEN & 5-MODULE ARCHITECTURE COMMAND DRAWER / MODAL
   Allows instant inspection & interaction with ALL 61 Screens, Modals & Sheets
   including Screens 27, 35–49 (Lawyer CRM), and 53–61 (Global Utilities)
   ============================================================================ */
export function Master61ScreenExplorerModal({
  isOpen,
  onClose,
  lang = "en",
  onOpenSearch,
  onOpenAuth,
  onOpenAI,
  onChangeTheme,
  currentTheme = "paper",
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  lang?: "en" | "ur";
  onOpenSearch: () => void;
  onOpenAuth: (reason?: string) => void;
  onOpenAI: (mode: "assistant" | "researcher") => void;
  onChangeTheme?: (t: "paper" | "light" | "dark") => void;
  currentTheme?: "paper" | "light" | "dark";
  onLogout?: () => void;
}) {
  const router = useRouter();
  const isUr = lang === "ur";
  const [activeScreenView, setActiveScreenView] = useState<string>("overview");

  // States for interactive sub-modals inside the explorer (Screens 27, 36-39, 43-49, 53-54, 57-61)
  const [proposedFee, setProposedFee] = useState("45000");
  const [leadDecision, setLeadDecision] = useState<string>("");
  const [milestones, setMilestones] = useState([
    { title: "Filing of Constitutional Writ under Art. 199", status: "Completed", date: "Oct 14, 2026" },
    { title: "Notice Issued to Revenue Officer & NADRA", status: "Active", date: "Oct 20, 2026" },
  ]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [blockedDates, setBlockedDates] = useState(["2026-10-28 (Supreme Court Full Court Reference)"]);
  const [newBlockDate, setNewBlockDate] = useState("2026-11-04");
  const [ibanNumber, setIbanNumber] = useState("PK36 SCBL 0000 0011 2345 6702");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [rescheduleStatus, setRescheduleStatus] = useState("");
  const [profileNameEdit, setProfileNameEdit] = useState("Tariq Mehmood");
  const [profileSaved, setProfileSaved] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      dir={isUr ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF9F5] text-[#111111] border border-stone-300 w-full max-w-6xl h-[88vh] flex flex-col shadow-2xl overflow-hidden font-ui"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-950 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#B48327]/50 shrink-0">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-[#10B981]" />
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#10B981] block font-semibold">
                Complete 61-Screen & 5-Module Information Architecture
              </span>
              <h3 className="text-sm sm:text-base font-bold">
                Interactive Screen, Bottom Sheet & Modal Command Deck (Screens 01–61)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeScreenView !== "overview" && (
              <button
                type="button"
                onClick={() => setActiveScreenView("overview")}
                className="px-3 py-1.5 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
              >
                ← Back to All 61 Screens Index
              </button>
            )}
            <button onClick={onClose} className="p-1 text-white/70 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {activeScreenView === "overview" ? (
            <>
              {/* Module 1: Screens 01–12 */}
              <div className="bg-white border border-stone-300 p-5 space-y-4">
                <div className="border-b border-stone-200 pb-2 flex items-center justify-between">
                  <h4 className="font-legal font-bold text-base text-stone-950">
                    Module 1: Guest Discovery & Magazine Interface (Screens 01–12 — Zero Login Required)
                  </h4>
                  <span className="text-xs font-mono-code text-[#064E3B] font-semibold">
                    Screens 01–12
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveScreenView("01_splash")}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">01. Splash Screen</strong>
                    <span className="text-stone-500">Emerald & Gold Scales</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(isUr ? "/urdu" : "/");
                    }}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">02. Magazine Home</strong>
                    <span className="text-stone-500">The Daily Brief (EN/UR)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSearch();
                    }}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">03. Global Search Popup</strong>
                    <span className="text-stone-500">Instant Statute/Lawyer Search</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(isUr ? "/urdu/article/1" : "/article/1");
                    }}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">04 & 05. Article Reader + Share</strong>
                    <span className="text-stone-500">Drop-Cap & PDF Export Sheet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(isUr ? "/urdu/lawyers" : "/lawyers");
                    }}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">06 & 07. Lawyer Directory + Filters</strong>
                    <span className="text-stone-500">Female & Pro-Bono Toggles</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(isUr ? "/urdu#templates-qa" : "/#templates-qa");
                    }}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">08 & 09. Template Store + Preview</strong>
                    <span className="text-stone-500">Watermarked Legal Drafts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(isUr ? "/urdu#templates-qa" : "/#templates-qa");
                    }}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">10. Public Q&A Forum Feed</strong>
                    <span className="text-stone-500">Verified Advocate Replies</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(isUr ? "/urdu/laws/1" : "/laws/1");
                    }}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">11 & 12. Law Library & Reader</strong>
                    <span className="text-stone-500">Constitution & PPC Reader</span>
                  </button>
                </div>
              </div>

              {/* Module 2: Screens 13–20 */}
              <div className="bg-white border border-stone-300 p-5 space-y-4">
                <div className="border-b border-stone-200 pb-2 flex items-center justify-between">
                  <h4 className="font-legal font-bold text-base text-stone-950">
                    Module 2: Smart Authentication Gateway (Screens 13–20)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuth("Inspecting Module 2 Smart Authentication Flow (Screens 13–20)");
                    }}
                    className="px-3 py-1 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                  >
                    Launch Interactive Auth Wizard (13–20) →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-stone-600">
                  <div className="p-2.5 border border-stone-200 bg-[#FBF9F5]">13. Auth Trigger Sheet</div>
                  <div className="p-2.5 border border-stone-200 bg-[#FBF9F5]">14. +92 Phone / Email Login</div>
                  <div className="p-2.5 border border-stone-200 bg-[#FBF9F5]">15. 4-Box OTP Modal</div>
                  <div className="p-2.5 border border-stone-200 bg-[#FBF9F5]">16. Client vs Advocate Role</div>
                  <div className="p-2.5 border border-stone-200 bg-[#FBF9F5]">17. Client Setup Wizard</div>
                  <div className="p-2.5 border border-stone-200 bg-[#FBF9F5]">18. Lawyer License Upload</div>
                  <div className="p-2.5 border border-stone-200 bg-[#FBF9F5]">19. Media Picker Sheet</div>
                  <div className="p-2.5 border border-stone-200 bg-[#FBF9F5]">20. Under Review Modal</div>
                </div>
              </div>

              {/* Module 3: Screens 21–34 */}
              <div className="bg-white border border-stone-300 p-5 space-y-4">
                <div className="border-b border-stone-200 pb-2 flex items-center justify-between">
                  <h4 className="font-legal font-bold text-base text-stone-950">
                    Module 3: Client Workspace & Services (Screens 21–34)
                  </h4>
                  <span className="text-xs font-mono-code text-[#064E3B] font-semibold">
                    Screens 21–34
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push("/lawyers/1");
                    }}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">21–25. Profile & Escrow Checkout</strong>
                    <span className="text-stone-500">Calendar, Slot, Safepay/JazzCash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScreenView("26_27_appointments")}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">26 & 27. Appointments + Reschedule</strong>
                    <span className="text-stone-500">Active/Pending/Past & Cancel Modal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAI("assistant");
                    }}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">28–30. AI Assistant + OCR + Voice</strong>
                    <span className="text-stone-500">Chat, Attachment Sheet, Soundwave</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push("/#templates-qa");
                    }}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">31–34. Post Q&A + Pro-Bono Form</strong>
                    <span className="text-stone-500">Anonymous Warning & Income Guide</span>
                  </button>
                </div>
              </div>

              {/* Module 4: Screens 35–49 (Lawyer CRM, Pro Tools & AI Engine) */}
              <div className="bg-white border border-stone-300 p-5 space-y-4">
                <div className="border-b border-stone-200 pb-2 flex items-center justify-between">
                  <h4 className="font-legal font-bold text-base text-stone-950">
                    Module 4: Lawyer CRM, Pro Tools & AI Engine (Screens 35–49)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveScreenView("35_49_lawyer_crm")}
                    className="px-3 py-1 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                  >
                    Open Full Advocate CRM Suite (Screens 35–49) →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveScreenView("35_49_lawyer_crm")}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">35–39. Leads & Case Workspace</strong>
                    <span className="text-stone-500">Accept/Decline Modal (37) & Milestones (39)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAI("researcher");
                    }}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">40–42. AI Researcher Pro (RAG)</strong>
                    <span className="text-stone-500">Split-Pane Editor, Prompts & Citations</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScreenView("35_49_lawyer_crm")}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">43–49. Reputation, Roster & Wallet</strong>
                    <span className="text-stone-500">Block Dates (45), IBAN (47), Network (49)</span>
                  </button>
                </div>
              </div>

              {/* Module 5: Screens 50–61 (CMS, Communication & Global Utilities) */}
              <div className="bg-white border border-stone-300 p-5 space-y-4">
                <div className="border-b border-stone-200 pb-2 flex items-center justify-between">
                  <h4 className="font-legal font-bold text-base text-stone-950">
                    Module 5: CMS, Communication & Global Utilities (Screens 50–61)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveScreenView("53_61_utilities")}
                    className="px-3 py-1 bg-stone-900 text-white text-xs font-semibold cursor-pointer"
                  >
                    Open Global Utilities & Settings (Screens 53–61) →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push("/admin");
                    }}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">50–52. Editorial Media CMS</strong>
                    <span className="text-stone-500">YouTube Embed (51) & Schedule (52)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScreenView("53_61_utilities")}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">53–56. E2EE Chat & Video Room</strong>
                    <span className="text-stone-500">File Share Picker (54) & Rating (56)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScreenView("53_61_utilities")}
                    className="p-3 text-left border border-stone-200 hover:border-[#064E3B] bg-[#FBF9F5] cursor-pointer"
                  >
                    <strong className="block text-[#064E3B]">57–61. Notifications & Settings</strong>
                    <span className="text-stone-500">Language (59), Theme (60), Logout (61)</span>
                  </button>
                </div>
              </div>
            </>
          ) : activeScreenView === "01_splash" ? (
            /* SCREEN 01: SPLASH SCREEN */
            <div className="bg-[#064E3B] text-white p-12 text-center space-y-6 border-2 border-[#B48327]">
              <div className="w-20 h-20 mx-auto border-2 border-[#D4AF37] flex items-center justify-center bg-emerald-950">
                <Scale className="w-10 h-10 text-[#D4AF37]" />
              </div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                Screen 01 • Deep Emerald & Antique Gold Splash Screen
              </div>
              <h2 className="text-4xl font-bold font-legal">The Daily Legal Brief</h2>
              <p className="font-urdu text-xl text-emerald-100">
                دی ڈیلی لیگل بریف — پاکستان لیگل جرنل اور وکلاء نیٹ ورک
              </p>
              <div className="flex justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-[#D4AF37] text-stone-950 text-xs font-bold uppercase cursor-pointer"
                >
                  Auto-Route to Magazine Home (Screen 02)
                </button>
              </div>
            </div>
          ) : activeScreenView === "26_27_appointments" ? (
            /* SCREENS 26 & 27: MY APPOINTMENTS + CANCEL / RESCHEDULE MODAL */
            <div className="bg-white border border-stone-300 p-6 space-y-6">
              <div className="border-b border-stone-200 pb-3">
                <span className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold block">
                  Screens 26 & 27 • Client Appointments & Reschedule Request Modal
                </span>
                <h3 className="text-xl font-bold font-legal text-stone-950">
                  My Appointments & Case History (Active, Pending, Past)
                </h3>
              </div>

              <div className="p-4 border border-stone-200 bg-[#FBF9F5] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-stone-950">
                    Adv. Sara Mansoor (Supreme Court of Pakistan)
                  </div>
                  <div className="text-xs text-stone-600 font-mono-code">
                    2026-10-24 · 04:00 PM (PKT) · Safepay Escrow #ESC-PK-89241
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setRescheduleStatus(
                        "Screen 27 Confirmed: Reschedule request sent to Adv. Sara Mansoor's chamber clerk."
                      )
                    }
                    className="px-3.5 py-2 border border-stone-300 bg-white text-xs font-semibold cursor-pointer"
                  >
                    Screen 27: Cancel / Reschedule Request
                  </button>
                </div>
              </div>

              {rescheduleStatus && (
                <div className="p-4 bg-emerald-950/5 border border-[#064E3B] text-xs font-semibold text-[#064E3B]">
                  {rescheduleStatus}
                </div>
              )}
            </div>
          ) : activeScreenView === "35_49_lawyer_crm" ? (
            /* MODULE 4: SCREENS 35–49 LAWYER CRM, PRO TOOLS & AI ENGINE */
            <div className="space-y-6">
              {/* Screen 35: Lawyer Home Dashboard */}
              <div className="bg-white border border-stone-300 p-6 space-y-4">
                <div className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold">
                  Screen 35 • Lawyer Home Dashboard
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FBF9F5] border border-stone-200">
                    <div className="text-xs text-stone-500">Cleared Escrow Earnings</div>
                    <div className="text-2xl font-bold font-mono-code text-[#064E3B] mt-1">
                      PKR 285,000
                    </div>
                  </div>
                  <div className="p-4 bg-[#FBF9F5] border border-stone-200">
                    <div className="text-xs text-stone-500">Pending Client Leads</div>
                    <div className="text-2xl font-bold font-mono-code text-stone-950 mt-1">
                      4 New Leads
                    </div>
                  </div>
                  <div className="p-4 bg-[#FBF9F5] border border-stone-200">
                    <div className="text-xs text-stone-500">Upcoming High Court Hearings</div>
                    <div className="text-2xl font-bold font-mono-code text-[#B48327] mt-1">
                      3 Today
                    </div>
                  </div>
                </div>
              </div>

              {/* Screens 36 & 37: Lead Management + Accept / Decline Case Modal */}
              <div className="bg-white border border-stone-300 p-6 space-y-4">
                <div className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold">
                  Screens 36 & 37 • Lead Management & Accept/Decline Case Modal (Proposed Fee PKR)
                </div>
                <div className="p-4 bg-[#FBF9F5] border border-stone-200 space-y-3">
                  <div className="flex flex-wrap justify-between gap-2">
                    <strong className="text-sm text-stone-950">
                      Lead #409: Inheritance Mutation Challenge under Women Property Rights Act 2020
                    </strong>
                    <span className="text-xs font-mono-code text-[#064E3B]">
                      Jurisdiction: Islamabad
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <label className="text-xs font-semibold text-stone-700">
                      Proposed Counsel Retainer Fee (PKR):
                    </label>
                    <input
                      type="number"
                      value={proposedFee}
                      onChange={(e) => setProposedFee(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-stone-300 text-xs font-mono-code w-36"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setLeadDecision(
                          `Case Accepted with Proposed Escrow Retainer of PKR ${Number(
                            proposedFee
                          ).toLocaleString()}.`
                        )
                      }
                      className="px-4 py-1.5 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                    >
                      Accept Case (Screen 37)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeadDecision("Lead Declined and routed back to pool.")}
                      className="px-4 py-1.5 border border-red-300 text-red-700 text-xs font-semibold cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                  {leadDecision && (
                    <div className="text-xs font-semibold text-[#064E3B] pt-1">
                      {leadDecision}
                    </div>
                  )}
                </div>
              </div>

              {/* Screens 38 & 39: Active Case Workspace + Add Milestone Modal */}
              <div className="bg-white border border-stone-300 p-6 space-y-4">
                <div className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold">
                  Screens 38 & 39 • Active Case Workspace (Notes, Shared Files, Timeline) & Add Milestone
                </div>
                <div className="space-y-2">
                  {milestones.map((m, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#FBF9F5] border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-stone-900">{m.title}</span>
                      <span className="font-mono-code text-[#064E3B]">
                        {m.status} · {m.date}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    placeholder="Screen 39: Add new court hearing or filing milestone..."
                    className="flex-1 px-3 py-2 border border-stone-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newMilestoneTitle.trim()) return;
                      setMilestones([
                        ...milestones,
                        {
                          title: newMilestoneTitle,
                          status: "Scheduled",
                          date: "Oct 29, 2026",
                        },
                      ]);
                      setNewMilestoneTitle("");
                    }}
                    className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold cursor-pointer"
                  >
                    + Add Milestone (Screen 39)
                  </button>
                </div>
              </div>

              {/* Screens 43, 44, 45, 46, 47, 48, 49 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Screens 44 & 45: Availability Calendar & Block Dates Modal */}
                <div className="bg-white border border-stone-300 p-5 space-y-3">
                  <div className="text-xs uppercase tracking-widest text-[#B48327] font-semibold">
                    Screens 44 & 45 • Roster Calendar & Block Dates Modal
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {blockedDates.map((d, idx) => (
                      <div key={idx} className="p-2 bg-stone-50 border border-stone-200 font-mono-code">
                        Blocked: {d}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={newBlockDate}
                      onChange={(e) => setNewBlockDate(e.target.value)}
                      className="px-3 py-1.5 border border-stone-300 text-xs font-mono-code"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setBlockedDates([...blockedDates, `${newBlockDate} (High Court Appearance)`])
                      }
                      className="px-3 py-1.5 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                    >
                      Block Date (Screen 45)
                    </button>
                  </div>
                </div>

                {/* Screens 46 & 47: Escrow Wallet & IBAN Withdrawal */}
                <div className="bg-white border border-stone-300 p-5 space-y-3">
                  <div className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold">
                    Screens 46 & 47 • Escrow Wallet & Withdraw via IBAN Modal
                  </div>
                  <input
                    type="text"
                    value={ibanNumber}
                    onChange={(e) => setIbanNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 text-xs font-mono-code"
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawSuccess(true)}
                    className="w-full py-2 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                  >
                    Withdraw PKR 285,000 via IBAN (Screen 47)
                  </button>
                  {withdrawSuccess && (
                    <p className="text-xs text-[#064E3B] font-semibold">
                      Instant RAAST IBAN payout initiated to {ibanNumber}.
                    </p>
                  )}
                </div>

                {/* Screens 43, 48 & 49: Reputation Desk, Pro-Bono Review & Lawyer Network */}
                <div className="md:col-span-2 bg-white border border-stone-300 p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-[#FBF9F5] border border-stone-200">
                    <strong className="block text-[#064E3B] mb-1">
                      Screen 43 • Reputation Desk
                    </strong>
                    <p className="text-stone-600">
                      Verified counsel replies published on Public Q&A (Screen 10) earn High Court citation authority badges.
                    </p>
                  </div>
                  <div className="p-3 bg-[#FBF9F5] border border-stone-200">
                    <strong className="block text-[#064E3B] mb-1">
                      Screen 48 • Pro-Bono Case Review
                    </strong>
                    <p className="text-stone-600">
                      Review Union Council income-verified applications submitted from Screen 33 for free legal representation.
                    </p>
                  </div>
                  <div className="p-3 bg-[#FBF9F5] border border-stone-200">
                    <strong className="block text-[#064E3B] mb-1">
                      Screen 49 • Private Lawyer Network
                    </strong>
                    <p className="text-stone-600">
                      Inter-provincial counsel referrals between Lahore, Sindh, Islamabad, and Peshawar High Court chambers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* MODULE 5: SCREENS 53–61 GLOBAL UTILITIES, NOTIFICATIONS, SETTINGS, LANGUAGE, THEME, LOGOUT */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Screen 57: Notifications Hub */}
              <div className="bg-white border border-stone-300 p-5 space-y-3">
                <div className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold">
                  Screen 57 • Notifications Hub
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-[#FBF9F5] border border-stone-200">
                    <strong className="block text-stone-900">Escrow Deposit Verified</strong>
                    <span className="text-stone-500">
                      Consultation #ESC-PK-89241 with Adv. Sara Mansoor confirmed.
                    </span>
                  </div>
                  <div className="p-3 bg-[#FBF9F5] border border-stone-200">
                    <strong className="block text-stone-900">Advocate Replied to Your Q&A</strong>
                    <span className="text-stone-500">
                      Adv. Kamran Tariq posted a verified statutory citation on Section 154A.
                    </span>
                  </div>
                </div>
              </div>

              {/* Screen 58: Global Settings & Profile Edit */}
              <div className="bg-white border border-stone-300 p-5 space-y-3">
                <div className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold">
                  Screen 58 • Global Settings & Profile Edit
                </div>
                <input
                  type="text"
                  value={profileNameEdit}
                  onChange={(e) => setProfileNameEdit(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setProfileSaved(true)}
                  className="px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold cursor-pointer"
                >
                  Save Profile Changes
                </button>
                {profileSaved && (
                  <p className="text-xs text-[#064E3B] font-semibold">Profile updated.</p>
                )}
              </div>

              {/* Screen 59: Language Selector Bottom Sheet */}
              <div className="bg-white border border-stone-300 p-5 space-y-3">
                <div className="text-xs uppercase tracking-widest text-[#B48327] font-semibold">
                  Screen 59 • Bilingual Language Selector Bottom Sheet
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/"
                    onClick={onClose}
                    className="p-3 border border-stone-300 text-center text-xs font-bold hover:border-[#064E3B]"
                  >
                    English Edition (LTR)
                  </Link>
                  <Link
                    href="/urdu"
                    onClick={onClose}
                    className="p-3 border border-stone-300 text-center text-sm font-urdu font-bold hover:border-[#064E3B]"
                  >
                    اردو ایڈیشن (RTL)
                  </Link>
                </div>
              </div>

              {/* Screen 60 & 61: Theme Selector Bottom Sheet & Logout Modal */}
              <div className="bg-white border border-stone-300 p-5 space-y-4">
                <div className="text-xs uppercase tracking-widest text-[#B48327] font-semibold">
                  Screen 60 • Appearance Mode & Screen 61 • Logout Modal
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "paper", label: "Archival Paper" },
                      { id: "light", label: "Stark Light" },
                      { id: "dark", label: "Dark Mode" },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onChangeTheme && onChangeTheme(t.id)}
                      className={`py-2 px-3 text-xs font-semibold border cursor-pointer ${
                        currentTheme === t.id
                          ? "bg-[#064E3B] text-white border-[#064E3B]"
                          : "bg-stone-50 text-stone-800 border-stone-300"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onLogout) onLogout();
                    onClose();
                  }}
                  className="w-full py-2 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                >
                  Screen 61 • Confirm Session Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
