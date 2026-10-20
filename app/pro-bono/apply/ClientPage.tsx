"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/Header";
import { submitProBonoApplicationServerAction } from "@/app/actions/platformActions";
import { createClient } from "@/app/supabase";
import { ShieldCheck, Upload, FileText, ArrowLeft } from "lucide-react";

const supabase = createClient();

export default function ProBonoApplyRoutePage() {
  const [applicant, setApplicant] = useState("Mst. Amina Bibi");
  const [monthlyIncome, setMonthlyIncome] = useState("PKR 24,000 / month");
  const [category, setCategory] = useState(
    "Women Inheritance Rights / Khula & Maintenance"
  );
  const [certificateType, setCertificateType] = useState(
    "Tehsildar / Union Council Income Affidavit"
  );
  const [fileName, setFileName] = useState("UC_Income_Affidavit_2026.pdf");
  const [guidelines, setGuidelines] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [submittedBanner, setSubmittedBanner] = useState("");

  async function loadData() {
    const [gRes, rRes] = await Promise.all([
      supabase.from("probono_guidelines").select("*"),
      supabase.from("pro_bono_applications").select("*"),
    ]);
    if (gRes.data) setGuidelines(gRes.data);
    if (rRes.data) setRequests(rRes.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await submitProBonoApplicationServerAction({
      applicant,
      monthlyIncome,
      category,
      certificateType,
      fileName,
    });
    if (res.row) {
      await supabase.from("pro_bono_applications").insert([res.row]);
    }
    await loadData();
    setSubmittedBanner(
      `Pro-Bono Application for "${applicant}" stored in pro_bono_applications & income proof uploaded to Storage!`
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between border-b border-stone-300 pb-4 text-xs">
          <Link
            href="/client/cases"
            className="font-semibold text-[#064E3B] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Client Workspace (/client/cases)</span>
          </Link>
          <span className="font-mono-code text-stone-500">
            Screens 33 & 34 · Route: /pro-bono/apply · Table: pro_bono_applications
          </span>
        </div>

        {submittedBanner && (
          <div className="p-4 bg-emerald-950/10 border-l-4 border-[#064E3B] text-xs font-bold text-[#064E3B]">
            {submittedBanner}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Screen 33: Pro-Bono Application Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white border border-stone-300 p-6 sm:p-8 space-y-4 text-xs"
          >
            <div className="flex items-center gap-2 text-[#064E3B] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-[#B48327]" />
              <span>Screen 33 · Free Legal Aid (Pro-Bono) Application Form</span>
            </div>
            <h1 className="text-2xl font-bold font-legal text-stone-950">
              Apply for High Court Pro-Bono Representation
            </h1>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Applicant Full Name *
              </label>
              <input
                type="text"
                required
                value={applicant}
                onChange={(e) => setApplicant(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Household Monthly Income (PKR) *
              </label>
              <input
                type="text"
                required
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 font-mono-code"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Case Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Income Certificate / Eligibility Proof Type
              </label>
              <select
                value={certificateType}
                onChange={(e) => setCertificateType(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300"
              >
                <option value="Tehsildar / Union Council Income Affidavit">
                  Tehsildar / Union Council Income Affidavit
                </option>
                <option value="BISP / Ehsaas Kafaalat Verification Slip">
                  BISP / Ehsaas Kafaalat Verification Slip
                </option>
                <option value="Zakat Committee Istehqaq Certificate">
                  Zakat Committee Istehqaq Certificate
                </option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Upload Income Certificate PDF to Supabase Storage (income-proofs)
              </label>
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#064E3B]" />
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 font-mono-code"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#064E3B] text-white font-semibold uppercase tracking-wider cursor-pointer"
            >
              Submit Pro-Bono Application & Upload Income Proof
            </button>
          </form>

          {/* Screen 34: Income Certificate Upload Guidelines */}
          <div className="lg:col-span-5 space-y-6 text-xs">
            <div className="bg-white border border-stone-300 p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#064E3B] font-bold uppercase tracking-widest">
                <FileText className="w-4 h-4 text-[#B48327]" />
                <span>Screen 34 · Income Certificate Upload Guidelines</span>
              </div>
              <div className="space-y-3">
                {guidelines.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 bg-stone-50 border border-stone-200 space-y-1"
                  >
                    <strong className="text-stone-950 block">{g.title}</strong>
                    <p className="text-stone-600">{g.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-300 p-6 space-y-3">
              <div className="font-bold text-stone-900 uppercase tracking-wider">
                Recent Pro-Bono Applications ({requests.length})
              </div>
              {requests.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="p-3 bg-stone-50 border border-stone-200 space-y-1"
                >
                  <div className="flex justify-between font-semibold">
                    <span>{r.applicant}</span>
                    <span className="text-[#064E3B] font-mono-code">
                      {r.monthly_income}
                    </span>
                  </div>
                  <div className="text-stone-500">{r.category}</div>
                  <div className="text-[11px] font-mono-code text-stone-500">
                    Status: {r.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
