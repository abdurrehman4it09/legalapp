"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/Header";
import { useAuthRBAC } from "@/app/AuthContext";
import { RBAC_ROLES, RBACRole } from "@/app/supabase";
import {
  Settings,
  Globe,
  Sun,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  X,
} from "lucide-react";

export default function GlobalSettingsRoutePage() {
  const router = useRouter();
  const {
    session,
    role,
    loginAndVerifyRole,
    switchRoleAndVerify,
    logout,
  } = useAuthRBAC();

  const [fullName, setFullName] = useState(session?.name || "Tariq Mahmood");
  const [phoneOrEmail, setPhoneOrEmail] = useState(
    session?.phoneOrEmail || "tariq.mahmood@citizen.pk"
  );
  const [city, setCity] = useState(session?.city || "Islamabad");
  const [selectedRole, setSelectedRole] = useState<RBACRole>(
    session?.rbacRole || "Client"
  );

  // Screens 59, 60, 61 Bottom Sheets / Popups
  const [langSheetOpen, setLangSheetOpen] = useState(false);
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginAndVerifyRole({
      phoneOrEmail,
      fullName,
      role: selectedRole,
      city,
      verificationStatus: "Verified",
    });
    setSavedBanner(
      `Synced profile & RBAC role (${selectedRole}) to public.users_profiles!`
    );
    setTimeout(() => setSavedBanner(null), 4000);
  };

  const applyTheme = (mode: "paper" | "light" | "dark") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("plp_theme", mode);
      document.documentElement.classList.remove(
        "theme-paper",
        "theme-light",
        "theme-dark"
      );
      document.documentElement.classList.add(`theme-${mode}`);
    }
    setThemeSheetOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900">
      <Header lang="en" />

      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-grow font-ui space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-stone-900 pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#064E3B] font-semibold block">
              Module 5 • Route: /settings • Screens 58, 59 (Language Sheet), 60 (Theme Sheet) & 61 (Logout Modal)
            </span>
            <h1 className="text-3xl font-bold font-legal text-stone-950 mt-1 flex items-center gap-2">
              <Settings className="w-6 h-6 text-[#064E3B]" />
              <span>Global Settings, RBAC Role Sync & Profile Preferences</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setLangSheetOpen(true)}
              className="px-3.5 py-2 bg-white border border-stone-300 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#064E3B]" />
              <span>Screen 59 · Language Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeSheetOpen(true)}
              className="px-3.5 py-2 bg-white border border-stone-300 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Sun className="w-4 h-4 text-[#B48327]" />
              <span>Screen 60 · Theme Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setLogoutPopupOpen(true)}
              className="px-3.5 py-2 bg-red-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Screen 61 · Logout Modal</span>
            </button>
          </div>
        </div>

        {savedBanner && (
          <div className="p-4 bg-emerald-950 text-[#D4AF37] border border-[#D4AF37] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedBanner}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Screen 58: Profile & Preferences Editor */}
          <form
            onSubmit={handleSaveProfile}
            className="lg:col-span-7 bg-white border border-stone-300 p-6 space-y-4 text-xs"
          >
            <div className="border-b border-stone-200 pb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#064E3B] font-bold block">
                Screen 58 • Profile & Preferences (public.users_profiles)
              </span>
              <h2 className="text-lg font-bold font-legal text-stone-950">
                Update Personal Profile & Active RBAC Role
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Email or +92 Phone
                </label>
                <input
                  type="text"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 font-mono-code"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300"
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
              <div>
                <label className="block font-semibold mb-1">
                  RBAC Role (users_profiles.role)
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as RBACRole)}
                  className="w-full px-3 py-2 border border-stone-300 font-bold text-[#064E3B]"
                >
                  {RBAC_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#064E3B] text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              Save Profile & Sync Role in Supabase
            </button>
          </form>

          {/* Right: Quick Role Switcher & Route Links */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            <div className="bg-white border border-stone-300 p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#064E3B] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant RBAC Role Switcher (Active: {role})</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {RBAC_ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={async () => {
                      await switchRoleAndVerify(r);
                      setSelectedRole(r);
                    }}
                    className={`p-3 border text-left font-semibold cursor-pointer ${
                      role === r
                        ? "bg-[#064E3B] text-white border-[#064E3B]"
                        : "bg-stone-50 text-stone-800 border-stone-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Screen 59: Language Selector Bottom Sheet */}
      {langSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4 font-ui"
          onClick={() => setLangSheetOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-md p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-sm font-bold text-stone-950">
                Screen 59 • Language Selector Bottom Sheet (EN / UR)
              </h3>
              <button onClick={() => setLangSheetOpen(false)}>
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Link
                href="/"
                className="p-4 bg-[#064E3B] text-white font-bold text-center"
              >
                English Edition (LTR)
              </Link>
              <Link
                href="/urdu"
                className="p-4 bg-white border border-stone-300 font-urdu font-bold text-center"
              >
                اردو ایڈیشن (RTL)
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Screen 60: Theme Selector Bottom Sheet */}
      {themeSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4 font-ui"
          onClick={() => setThemeSheetOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-md p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-sm font-bold text-stone-950">
                Screen 60 • Theme Selector Bottom Sheet
              </h3>
              <button onClick={() => setThemeSheetOpen(false)}>
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyTheme("paper")}
                className="p-3 bg-[#FBF9F5] border border-stone-300 font-bold cursor-pointer"
              >
                Archival Paper
              </button>
              <button
                type="button"
                onClick={() => applyTheme("light")}
                className="p-3 bg-white border border-stone-300 font-bold cursor-pointer"
              >
                Stark Light
              </button>
              <button
                type="button"
                onClick={() => applyTheme("dark")}
                className="p-3 bg-stone-950 text-white border border-stone-800 font-bold cursor-pointer"
              >
                Obsidian Dark
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen 61: Logout Confirmation Modal */}
      {logoutPopupOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 font-ui"
          onClick={() => setLogoutPopupOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-sm p-6 shadow-2xl space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[11px] uppercase tracking-widest text-red-700 font-semibold block">
              Screen 61 • Logout Confirmation Modal
            </span>
            <h3 className="text-lg font-bold font-legal text-stone-950">
              End Authenticated Legal Session?
            </h3>
            <div className="flex gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setLogoutPopupOpen(false)}
                className="flex-1 py-2.5 border border-stone-300 bg-white font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setLogoutPopupOpen(false);
                  router.push("/");
                }}
                className="flex-1 py-2.5 bg-red-700 text-white font-semibold cursor-pointer"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
