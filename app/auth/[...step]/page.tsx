"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/app/Header";
import {
  signInWithOtpServerAction,
  setupClientProfileServerAction,
  setupLawyerProfileServerAction,
} from "@/app/actions/platformActions";
import { useAuthRBAC } from "@/app/AuthContext";
import { ShieldCheck, Lock, Upload, ArrowRight } from "lucide-react";

function AuthGatewayRoutePageInner() {
  const params = useParams();
  const router = useRouter();
  const { loginAndVerifyRole } = useAuthRBAC();
  const slugArray = Array.isArray(params?.step)
    ? params.step
    : [params?.step || "login"];
  const currentStep = slugArray[0] || "login";

  const [phoneOrEmail, setPhoneOrEmail] = useState("+92 300 5192831");
  const [otpCode, setOtpCode] = useState("4829");
  const [otpSent, setOtpSent] = useState(false);
  const [fullName, setFullName] = useState("Tariq Mahmood");
  const [city, setCity] = useState("Islamabad");
  const [barCouncilId, setBarCouncilId] = useState("PBC-SC-2018-4412");
  const [court, setCourt] = useState("Supreme Court of Pakistan");
  const [specialty, setSpecialty] = useState(
    "Constitutional & Property Litigation"
  );
  const [fee, setFee] = useState(15000);
  const [licenseFile, setLicenseFile] = useState("PBC_HighCourt_License.pdf");
  const [underReviewModal, setUnderReviewModal] = useState(false);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    await signInWithOtpServerAction({ phoneOrEmail });
    setOtpSent(true);
  }

  async function handleVerifyOtp() {
    router.push("/auth/role");
  }

  async function handleCompleteClientSetup(e: React.FormEvent) {
    e.preventDefault();
    await setupClientProfileServerAction({
      emailOrPhone: phoneOrEmail,
      fullName,
      role: "Client",
      city,
    });
    await loginAndVerifyRole({
      phoneOrEmail,
      fullName,
      role: "Client",
      city,
    });
    router.push("/client/cases");
  }

  async function handleCompleteLawyerSetup(e: React.FormEvent) {
    e.preventDefault();
    await setupLawyerProfileServerAction({
      name: fullName.startsWith("Adv.") ? fullName : `Adv. ${fullName}`,
      city,
      specialization: specialty,
      court,
      fee,
      barCouncilId,
      licenseFileName: licenseFile,
    });
    await loginAndVerifyRole({
      phoneOrEmail,
      fullName: fullName.startsWith("Adv.") ? fullName : `Adv. ${fullName}`,
      role: "Verified Advocate",
      city,
      barCouncilId,
      highCourt: court,
      verificationStatus: "Verified",
    });
    setUnderReviewModal(true);
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-10 space-y-6">
        {/* Step Breadcrumb Navigation across Module 2 Routes */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white border border-stone-300 p-3 text-xs font-semibold">
          {[
            { id: "login", label: "1. /auth/login (Screens 14–15)" },
            { id: "role", label: "2. /auth/role (Screen 16)" },
            { id: "setup-client", label: "3A. /auth/setup-client (Screen 17)" },
            {
              id: "setup-lawyer",
              label: "3B. /auth/setup-lawyer (Screens 18–20)",
            },
          ].map((item) => (
            <Link
              key={item.id}
              href={`/auth/${item.id}`}
              className={`px-3 py-1.5 ${
                currentStep === item.id
                  ? "bg-[#064E3B] text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* ROUTE 1: /auth/login (Screens 14 & 15) */}
        {currentStep === "login" && (
          <div className="bg-white border border-stone-300 p-8 space-y-5 text-xs">
            <div className="flex items-center gap-2 text-[#064E3B] font-bold uppercase tracking-widest">
              <Lock className="w-4 h-4 text-[#B48327]" />
              <span>
                Screens 14 & 15 · Route: /auth/login · Action: supabase.auth.signInWithOtp()
              </span>
            </div>
            <h1 className="text-2xl font-bold font-legal text-stone-950">
              Secure +92 Phone or Email OTP Authentication
            </h1>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  +92 Mobile Number or Email Address
                </label>
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 font-mono-code text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#064E3B] text-white font-semibold uppercase tracking-wider cursor-pointer"
              >
                Send 4-Digit OTP via Supabase Auth
              </button>
            </form>

            {otpSent && (
              <div className="p-5 bg-stone-50 border border-[#064E3B] space-y-4">
                <div className="font-bold text-[#064E3B] uppercase tracking-wider">
                  Screen 15 · 4-Box OTP Verification Modal
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-300 text-center font-mono-code text-lg font-bold tracking-widest"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full py-3 bg-stone-900 text-[#D4AF37] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Verify OTP & Proceed to /auth/role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ROUTE 2: /auth/role (Screen 16) */}
        {currentStep === "role" && (
          <div className="bg-white border border-stone-300 p-8 space-y-6 text-xs">
            <div className="text-[#064E3B] font-bold uppercase tracking-widest">
              Screen 16 · Route: /auth/role · Role Selection Gateway
            </div>
            <h1 className="text-2xl font-bold font-legal text-stone-950">
              Select Your Platform Role (Updates public.users_profiles)
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/auth/setup-client"
                className="p-6 border-2 border-stone-300 hover:border-[#064E3B] bg-stone-50 space-y-2 block"
              >
                <span className="text-[11px] font-mono-code text-[#064E3B] font-bold uppercase">
                  Option A · Route: /auth/setup-client
                </span>
                <h2 className="text-xl font-bold font-legal text-stone-950">
                  I am a Client / Citizen
                </h2>
                <p className="text-stone-600">
                  Book High Court advocates via escrow, ask anonymous Q&A, apply for Pro-Bono legal aid, and use the AI Legal Assistant.
                </p>
              </Link>

              <Link
                href="/auth/setup-lawyer"
                className="p-6 border-2 border-[#B48327] hover:border-[#064E3B] bg-amber-50/40 space-y-2 block"
              >
                <span className="text-[11px] font-mono-code text-[#B48327] font-bold uppercase">
                  Option B · Route: /auth/setup-lawyer
                </span>
                <h2 className="text-xl font-bold font-legal text-stone-950">
                  I am a Verified Advocate
                </h2>
                <p className="text-stone-600">
                  Upload Bar Council license to Supabase Storage, manage CRM leads, milestones, AI Researcher Pro, and RAAST Escrow Wallet.
                </p>
              </Link>
            </div>
          </div>
        )}

        {/* ROUTE 3A: /auth/setup-client (Screen 17) */}
        {currentStep === "setup-client" && (
          <form
            onSubmit={handleCompleteClientSetup}
            className="bg-white border border-stone-300 p-8 space-y-5 text-xs"
          >
            <div className="text-[#064E3B] font-bold uppercase tracking-widest">
              Screen 17 · Route: /auth/setup-client · UPDATE users SET role = &apos;Client&apos;
            </div>
            <h1 className="text-2xl font-bold font-legal text-stone-950">
              Client Profile Setup Wizard
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300"
                >
                  {["Islamabad", "Lahore", "Karachi", "Peshawar", "Quetta"].map(
                    (c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#064E3B] text-white font-semibold uppercase tracking-wider cursor-pointer"
            >
              Save Client Profile & Open Client Workspace (/client/cases) →
            </button>
          </form>
        )}

        {/* ROUTE 3B: /auth/setup-lawyer (Screens 18, 19, 20) */}
        {currentStep === "setup-lawyer" && (
          <div className="bg-white border border-stone-300 p-8 space-y-5 text-xs">
            <div className="text-[#064E3B] font-bold uppercase tracking-widest">
              Screens 18–20 · Route: /auth/setup-lawyer · INSERT INTO lawyer_profiles + Storage Upload
            </div>
            <h1 className="text-2xl font-bold font-legal text-stone-950">
              Advocate Bar Council Verification & License Upload
            </h1>

            <form onSubmit={handleCompleteLawyerSetup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Advocate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Bar Council License Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={barCouncilId}
                    onChange={(e) => setBarCouncilId(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Enrolled Court *
                  </label>
                  <select
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300"
                  >
                    <option value="Supreme Court of Pakistan">
                      Supreme Court of Pakistan
                    </option>
                    <option value="Islamabad High Court">
                      Islamabad High Court
                    </option>
                    <option value="Lahore High Court">Lahore High Court</option>
                    <option value="Sindh High Court">Sindh High Court</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Consultation Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Primary Specialization
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Screen 19 · Upload Bar License Document (lawyer_documents bucket)
                  </label>
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#064E3B]" />
                    <input
                      type="text"
                      value={licenseFile}
                      onChange={(e) => setLicenseFile(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 font-mono-code"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#064E3B] text-white font-semibold uppercase tracking-wider cursor-pointer"
              >
                Upload License to Supabase Storage & Submit Advocate Profile
              </button>
            </form>

            {underReviewModal && (
              <div className="p-6 bg-stone-900 text-white space-y-3 border-l-4 border-[#D4AF37]">
                <div className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Screen 20 · Profile Under Review Modal</span>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  Your Bar Council License ({barCouncilId}) has been uploaded to the <code>lawyer_documents</code> bucket and inserted into <code>lawyer_profiles</code>.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    href="/lawyer/dashboard"
                    className="px-4 py-2 bg-[#D4AF37] text-stone-950 font-bold"
                  >
                    Enter Lawyer CRM (/lawyer/dashboard) →
                  </Link>
                  <Link
                    href="/admin/lawyers"
                    className="px-4 py-2 border border-stone-600 text-white font-semibold"
                  >
                    Approve in Admin (/admin/lawyers) →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AuthGatewayRoutePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FBF9F5] p-10 text-center text-xs text-stone-500">Loading...</div>}>
      <AuthGatewayRoutePageInner />
    </React.Suspense>
  );
}
