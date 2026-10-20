"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/app/Header";
import { askForumQuestionServerAction } from "@/app/actions/platformActions";
import { createClient } from "@/app/supabase";
import { useAuthRBAC } from "@/app/AuthContext";
import { ShieldAlert, ArrowLeft, Send } from "lucide-react";

const supabase = createClient();

export default function ForumAskQuestionPage() {
  const router = useRouter();
  const { session } = useAuthRBAC();
  const [title, setTitle] = useState("");
  const [titleUrdu, setTitleUrdu] = useState("");
  const [category, setCategory] = useState("Property & Inheritance");
  const [city, setCity] = useState(session?.city || "Islamabad");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [showAnonPopup, setShowAnonPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);

    const row = {
      id: Date.now(),
      title: title.trim(),
      title_urdu: titleUrdu.trim() || title.trim(),
      category,
      category_urdu: "قانونی استفسار",
      city,
      is_anonymous: isAnonymous,
      author_name: isAnonymous
        ? "Anonymous Citizen"
        : session?.name || "Verified Client",
      upvotes: 1,
      answer_count: 0,
      verified_reply: null,
      created_at: new Date().toISOString(),
    };

    await supabase.from("forum_questions").insert([row]);
    await askForumQuestionServerAction({
      title: row.title,
      titleUrdu: row.title_urdu,
      category: row.category,
      city: row.city,
      isAnonymous: row.is_anonymous,
      authorName: row.author_name,
    });

    setSubmitting(false);
    router.push("/forum");
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-300 pb-4 text-xs">
          <Link
            href="/forum"
            className="font-semibold text-[#064E3B] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Q&A Feed (/forum · Screen 10)</span>
          </Link>
          <span className="font-mono-code text-stone-500">
            Screens 31 & 32 · Route: /forum/ask · Table: forum_questions
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-stone-300 p-6 sm:p-8 space-y-5 text-xs"
        >
          <div>
            <span className="text-[#064E3B] font-bold uppercase tracking-widest block">
              Screen 31 · Post a Question to Verified High Court Advocates
            </span>
            <h1 className="text-2xl font-bold font-legal text-stone-950 mt-1">
              Submit Public Legal Inquiry (INSERT INTO forum_questions)
            </h1>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Your Legal Question (English) *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your legal issue (e.g., NADRA Letters of Administration, Section 489-F cheque dishonour, or property mutation)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 text-sm"
            />
          </div>

          <div dir="rtl">
            <label className="block font-semibold text-stone-700 mb-1 font-urdu">
              اپنا قانونی سوال درج کریں (اردو - اختیاری)
            </label>
            <textarea
              rows={3}
              placeholder="اپنا قانونی مسئلہ یہاں لکھیں..."
              value={titleUrdu}
              onChange={(e) => setTitleUrdu(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 font-urdu text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Legal Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 font-semibold"
              >
                <option value="Property & Inheritance">
                  Property & Inheritance
                </option>
                <option value="Family & Guardianship">
                  Family & Guardianship
                </option>
                <option value="Criminal & Bail (CrPC)">
                  Criminal & Bail (CrPC)
                </option>
                <option value="Tax, Corporate & PSEB">
                  Tax, Corporate & PSEB
                </option>
                <option value="Constitutional Petitions">
                  Constitutional Petitions
                </option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                City / Court Jurisdiction
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 font-semibold"
              >
                {[
                  "Islamabad",
                  "Lahore",
                  "Karachi",
                  "Peshawar",
                  "Quetta",
                  "Rawalpindi",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Screen 32: Keep Anonymous Warning Toggle */}
          <div className="p-4 bg-amber-50 border border-amber-300 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-[#B48327] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-900">
                  Screen 32 · &ldquo;Keep Anonymous&rdquo; Privacy Shield
                </div>
                <p className="text-stone-600 mt-0.5">
                  When enabled, your name, phone number, and CNIC are masked on the public Q&A feed (/forum). Avoid writing personal names inside the question body.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 font-bold text-[#064E3B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => {
                    setIsAnonymous(e.target.checked);
                    if (!e.target.checked) setShowAnonPopup(true);
                  }}
                  className="accent-[#064E3B]"
                />
                <span>Post Anonymously</span>
              </label>
            </div>
          </div>

          {showAnonPopup && (
            <div className="p-4 bg-stone-900 text-white space-y-2">
              <div className="text-[#D4AF37] font-bold uppercase tracking-wider">
                Screen 32 Popup · Public Identity Warning
              </div>
              <p className="text-stone-300">
                You have unchecked &ldquo;Keep Anonymous&rdquo;. Your profile name ({session?.name || "Client"}) will be visible alongside this question on /forum.
              </p>
              <button
                type="button"
                onClick={() => setShowAnonPopup(false)}
                className="px-3 py-1 bg-[#D4AF37] text-stone-950 font-bold cursor-pointer"
              >
                Acknowledge
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#064E3B] text-white font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#D4AF37]" />
            <span>
              {submitting
                ? "Publishing to Supabase forum_questions..."
                : "Publish Question to Public Forum (/forum)"}
            </span>
          </button>
        </form>
      </main>
    </div>
  );
}
