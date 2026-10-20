"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/Header";
import { createClient } from "@/app/supabase";
import { Bell, Plus, CheckCircle2, ArrowRight } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NotificationsHubRoutePage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [banner, setBanner] = useState<string | null>(null);

  const loadNotifications = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("id", { ascending: false });
    setNotifications(data || []);
  };

  useEffect(() => {
    loadNotifications();
    if (typeof window !== "undefined") {
      window.addEventListener("plp_data_updated", loadNotifications);
      return () =>
        window.removeEventListener("plp_data_updated", loadNotifications);
    }
  }, []);

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await supabase.from("notifications").insert([
      {
        title: newTitle,
        title_urdu: newTitle,
        message: newMsg || "System alert dispatched.",
        message_urdu: newMsg || "سسٹم الرٹ جاری کر دیا گیا۔",
        time: "Just now",
      },
    ]);
    setNewTitle("");
    setNewMsg("");
    setBanner("Dispatched new push notification to public.notifications!");
    setTimeout(() => setBanner(null), 4000);
    await loadNotifications();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900">
      <Header lang="en" />

      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-grow font-ui space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-stone-900 pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#064E3B] font-semibold block">
              Module 5 • Route: /notifications • Screen 57 (Centralized Notifications Hub)
            </span>
            <h1 className="text-3xl font-bold font-legal text-stone-950 mt-1 flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#064E3B]" />
              <span>Escrow, Court Cause-List & Q&A Notifications Hub</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/settings"
              className="px-4 py-2 bg-stone-900 text-white font-semibold"
            >
              Global Settings (/settings · Screens 58–61) →
            </Link>
            <Link
              href="/client/cases"
              className="px-4 py-2 border border-stone-300 bg-white font-semibold"
            >
              My Cases (/client/cases) →
            </Link>
          </div>
        </div>

        {banner && (
          <div className="p-4 bg-emerald-950 text-[#D4AF37] border border-[#D4AF37] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{banner}</span>
          </div>
        )}

        <form
          onSubmit={handleCreateNotification}
          className="bg-white border border-stone-300 p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
        >
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Notification Title (e.g. Cause List Updated)"
            className="px-3 py-2 border border-stone-300"
          />
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Alert Message..."
            className="px-3 py-2 border border-stone-300 sm:col-span-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#064E3B] text-white font-bold flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Broadcast Alert</span>
          </button>
        </form>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-5 bg-white border border-stone-300 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <strong className="text-stone-950 text-sm">{n.title}</strong>
                  <span className="font-mono-code text-[11px] text-[#064E3B]">
                    {n.time}
                  </span>
                </div>
                <p className="text-xs text-stone-600">{n.message}</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Link
                  href="/client/cases"
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 font-semibold flex items-center gap-1"
                >
                  <span>Inspect Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
