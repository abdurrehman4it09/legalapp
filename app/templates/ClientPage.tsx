"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/Header";
import { createClient } from "@/app/supabase";
import { TemplatePreviewModal } from "@/app/components/PlatformModals";
import { FileText, ArrowLeft, Eye, Lock } from "lucide-react";

const supabase = createClient();

export default function TemplatesStorefrontPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("legal_templates")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setTemplates(data);
    }
    load();
    window.addEventListener("plp_data_updated", load);
    return () => window.removeEventListener("plp_data_updated", load);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-stone-900 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#064E3B] font-semibold uppercase tracking-widest">
              <FileText className="w-4 h-4 text-[#B48327]" />
              <span>
                Screens 08 & 09 · Route: /templates · Table: legal_templates
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-legal text-stone-950 mt-1">
              Verified Legal Drafts & Bilingual Contracts Storefront
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              High Court vetted agreements (Rent Deeds, NDAs, Succession Affidavits, Freelance IT Contracts). Preview watermarked clauses or unlock via Auth.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/"
              className="px-3.5 py-2 min-h-[44px] bg-white hover:bg-stone-50 active:scale-[0.98] transition-all duration-200 border border-stone-300 font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Magazine Home (/)</span>
            </Link>
            <Link
              href="/admin?tab=templates"
              className="px-3.5 py-2 min-h-[44px] bg-[#064E3B] hover:bg-emerald-950 active:scale-[0.98] transition-all duration-200 text-white font-semibold flex items-center"
            >
              Supply Templates in Admin →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white border border-stone-300 p-6 flex flex-col justify-between space-y-4 hover:border-[#064E3B] hover:bg-stone-50/40 transition-all duration-200 overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 bg-stone-100 border border-stone-300 font-semibold text-stone-800 truncate">
                    {tpl.category}
                  </span>
                  <span className="font-mono-code font-bold text-[#064E3B] shrink-0">
                    PKR {Number(tpl.price || 1500).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-lg font-bold font-legal text-stone-950 break-words">
                  {tpl.title}
                </h2>
                {tpl.title_urdu && (
                  <div
                    dir="rtl"
                    className="text-sm font-urdu text-[#064E3B] font-bold break-words"
                  >
                    {tpl.title_urdu}
                  </div>
                )}
                <p className="text-xs text-stone-600 leading-relaxed break-words">
                  {tpl.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono-code text-stone-500">
                  {tpl.pages || 5} Pages · Word / PDF
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(tpl)}
                    className="px-3.5 py-2 min-h-[44px] bg-stone-900 hover:bg-stone-800 active:scale-[0.98] transition-all duration-200 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Screen 09 Preview</span>
                  </button>
                  <Link
                    href="/auth/login?next=/templates"
                    className="px-3.5 py-2 min-h-[44px] bg-[#064E3B] hover:bg-emerald-950 active:scale-[0.98] transition-all duration-200 text-white font-semibold flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Unlock</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedTemplate && (
        <TemplatePreviewModal
          template={selectedTemplate}
          userSession={null}
          onClose={() => setSelectedTemplate(null)}
          onUnlock={() => {
            setSelectedTemplate(null);
            router.push("/auth/login?next=/templates");
          }}
        />
      )}
    </div>
  );
}
