"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/app/supabase";
import {
  InlineSpinner,
  MutationFeedbackBanner,
} from "@/app/components/SharedUI";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function AdminLawyers() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [newLawyer, setNewLawyer] = useState({
    name: "",
    name_urdu: "",
    court: "Supreme Court / High Court",
    court_urdu: "سپریم کورٹ / ہائی کورٹ",
    specialty: "",
    specialty_urdu: "",
    location: "Islamabad",
    city_urdu: "اسلام آباد",
    fee: 3500,
    bar_council_id: "PBC-HC-2026-9012",
    contact_info: "",
    bio: "",
    intro_urdu: "",
    is_female: false,
    pro_bono: true,
  });
  const [saving, setSaving] = useState(false);

  async function fetchLawyers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("lawyers")
      .select("*")
      .order("created_at", { ascending: false });
      if (!error && data) setLawyers(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchLawyers();
  }, []);

  async function handleSaveLawyer(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...newLawyer,
      city: newLawyer.location,
      fee: Number(newLawyer.fee) || 3500,
      verified: true,
    };
    let error;
    if (editingId) {
      const { error: updateError } = await supabase
        .from("lawyers")
        .update(payload)
        .eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("lawyers")
        .insert([payload]);
      error = insertError;
    }
    setSaving(false);
    if (!error) {
      setStatusMessage(
        editingId
          ? "Advocate profile updated on English & Urdu directories."
          : "Verified Advocate enrolled into directory."
      );
      resetForm();
      fetchLawyers();
    } else {
      setStatusMessage("Failed to save advocate profile.");
    }
  }

  function handleEdit(lawyer: any) {
    setEditingId(lawyer.id);
    setNewLawyer({
      name: lawyer.name || "",
      name_urdu: lawyer.name_urdu || "",
      court: lawyer.court || "High Court",
      court_urdu: lawyer.court_urdu || "ہائی کورٹ",
      specialty: lawyer.specialty || "",
      specialty_urdu: lawyer.specialty_urdu || "",
      location: lawyer.location || "Islamabad",
      city_urdu: lawyer.city_urdu || "اسلام آباد",
      fee: lawyer.fee || 3500,
      bar_council_id: lawyer.bar_council_id || "PBC-HC-Verified",
      contact_info: lawyer.contact_info || "",
      bio: lawyer.bio || "",
      intro_urdu: lawyer.intro_urdu || "",
      is_female: Boolean(lawyer.is_female),
      pro_bono: Boolean(lawyer.pro_bono),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setNewLawyer({
      name: "",
      name_urdu: "",
      court: "Supreme Court / High Court",
      court_urdu: "سپریم کورٹ / ہائی کورٹ",
      specialty: "",
      specialty_urdu: "",
      location: "Islamabad",
      city_urdu: "اسلام آباد",
      fee: 3500,
      bar_council_id: "PBC-HC-2026-9012",
      contact_info: "",
      bio: "",
      intro_urdu: "",
      is_female: false,
      pro_bono: true,
    });
  }

  async function handleDelete(id: number) {
    await supabase.from("lawyers").delete().eq("id", id);
    fetchLawyers();
  }

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4 border-b-2 border-stone-900 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold block mb-1">
            Screens 06, 07 & 18 Supply · Bar Council Verification Roll
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-legal text-stone-950">
            Manage Verified Advocate Directory
          </h1>
        </div>
        <button
          type="button"
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-[#064E3B] text-white px-6 py-2.5 min-h-[44px] text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          {showForm ? "Cancel" : "+ Enroll Verified Advocate"}
        </button>
      </div>

      {statusMessage && (
        <MutationFeedbackBanner
          type={statusMessage.toLowerCase().includes("failed") ? "error" : "success"}
          message={statusMessage}
          onDismiss={() => setStatusMessage("")}
        />
      )}

      {showForm && (
        <form
          onSubmit={handleSaveLawyer}
          className="bg-white p-6 sm:p-8 border border-stone-300 space-y-4"
        >
          <h2 className="text-lg font-bold font-legal text-stone-950">
            {editingId
              ? "Edit Advocate Credentials"
              : "Enroll New Advocate (English & Urdu)"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Full Name (e.g., Adv. Sara Mansoor)"
              className="p-3 bg-stone-50 border border-stone-300 text-xs"
              value={newLawyer.name}
              onChange={(e) =>
                setNewLawyer({ ...newLawyer, name: e.target.value })
              }
            />
            <input
              placeholder="اردو نام (مثلاً ایڈووکیٹ سارہ منصور)"
              dir="rtl"
              className="p-3 bg-stone-50 border border-stone-300 text-sm font-urdu"
              value={newLawyer.name_urdu}
              onChange={(e) =>
                setNewLawyer({ ...newLawyer, name_urdu: e.target.value })
              }
            />
            <input
              placeholder="Specialty (e.g., Property & Constitutional Law)"
              className="p-3 bg-stone-50 border border-stone-300 text-xs"
              value={newLawyer.specialty}
              onChange={(e) =>
                setNewLawyer({ ...newLawyer, specialty: e.target.value })
              }
            />
            <input
              placeholder="اردو مہارت (مثلاً جائیداد اور آئینی قوانین)"
              dir="rtl"
              className="p-3 bg-stone-50 border border-stone-300 text-sm font-urdu"
              value={newLawyer.specialty_urdu}
              onChange={(e) =>
                setNewLawyer({ ...newLawyer, specialty_urdu: e.target.value })
              }
            />
            <input
              placeholder="City (e.g., Islamabad / Lahore)"
              className="p-3 bg-stone-50 border border-stone-300 text-xs"
              value={newLawyer.location}
              onChange={(e) =>
                setNewLawyer({ ...newLawyer, location: e.target.value })
              }
            />
            <input
              placeholder="اردو شہر (مثلاً اسلام آباد)"
              dir="rtl"
              className="p-3 bg-stone-50 border border-stone-300 text-sm font-urdu"
              value={newLawyer.city_urdu}
              onChange={(e) =>
                setNewLawyer({ ...newLawyer, city_urdu: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Escrow Consultation Fee (PKR)"
              className="p-3 bg-stone-50 border border-stone-300 text-xs font-mono-code"
              value={newLawyer.fee}
              onChange={(e) =>
                setNewLawyer({ ...newLawyer, fee: Number(e.target.value) })
              }
            />
            <input
              placeholder="Bar Council License ID"
              className="p-3 bg-stone-50 border border-stone-300 text-xs font-mono-code"
              value={newLawyer.bar_council_id}
              onChange={(e) =>
                setNewLawyer({ ...newLawyer, bar_council_id: e.target.value })
              }
            />
            <textarea
              placeholder="English Chamber Biography..."
              className="p-3 bg-stone-50 border border-stone-300 h-24 text-xs"
              value={newLawyer.bio}
              onChange={(e) =>
                setNewLawyer({ ...newLawyer, bio: e.target.value })
              }
            />
            <textarea
              placeholder="اردو تعارف..."
              dir="rtl"
              className="p-3 bg-stone-50 border border-stone-300 h-24 text-sm font-urdu"
              value={newLawyer.intro_urdu}
              onChange={(e) =>
                setNewLawyer({ ...newLawyer, intro_urdu: e.target.value })
              }
            />
          </div>

          <div className="flex flex-wrap gap-6 py-2 text-xs font-semibold text-stone-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newLawyer.is_female}
                onChange={(e) =>
                  setNewLawyer({ ...newLawyer, is_female: e.target.checked })
                }
              />
              <span>Female Advocate (Screen 07 Filter)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newLawyer.pro_bono}
                onChange={(e) =>
                  setNewLawyer({ ...newLawyer, pro_bono: e.target.checked })
                }
              />
              <span>Available for Pro-Bono Legal Aid (Screen 07 & 33)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#064E3B] hover:bg-emerald-950 active:scale-[0.98] transition-all duration-200 text-white px-6 py-2.5 min-h-[44px] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving && <InlineSpinner className="w-3.5 h-3.5 text-[#D4AF37]" />}
            <span>
              {saving
                ? "Processing..."
                : editingId
                ? "Update Advocate Profile"
                : "Enroll Advocate"}
            </span>
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-stone-500 text-xs">Loading directory profiles...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="bg-white p-6 border border-stone-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#064E3B] text-[#D4AF37] font-legal font-bold text-lg flex items-center justify-center border border-[#B48327]">
                    {lawyer.name ? lawyer.name.replace("Adv. ", "").charAt(0) : "A"}
                  </div>
                  <div>
                    <h3 className="font-bold font-legal text-stone-950 text-base">
                      {lawyer.name}
                    </h3>
                    <p className="font-urdu text-sm text-stone-600" dir="rtl">
                      {lawyer.name_urdu}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#064E3B] font-semibold mb-1">
                  {lawyer.specialty}
                </p>
                <p className="text-xs text-stone-500 font-mono-code mb-4">
                  {lawyer.location} · PKR {(lawyer.fee || 3500).toLocaleString()}
                </p>
              </div>
              <div className="pt-4 border-t border-stone-200 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(lawyer)}
                  className="flex-1 py-2 border border-stone-300 text-xs font-semibold text-stone-800 hover:border-stone-900 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(lawyer.id)}
                  className="flex-1 py-2 border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}