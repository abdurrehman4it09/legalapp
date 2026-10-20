"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/app/supabase";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function AdminLaws() {
  const [laws, setLaws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [newLaw, setNewLaw] = useState({
    title: "",
    title_urdu: "",
    category: "Constitution",
    section_number: "",
    section_urdu: "",
    content: "",
    content_urdu: "",
    marginal_notes: "",
    marginal_notes_urdu: "",
  });
  const [saving, setSaving] = useState(false);

  async function fetchLaws() {
    setLoading(true);
    const { data, error } = await supabase
      .from("laws")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setLaws(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchLaws();
  }, []);

  async function handleSaveLaw(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    let error;
    if (editingId) {
      const { error: updateError } = await supabase
        .from("laws")
        .update(newLaw)
        .eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("laws")
        .insert([newLaw]);
      error = insertError;
    }
    setSaving(false);
    if (!error) {
      setStatusMessage(
        editingId
          ? "Statute updated across English & Urdu libraries."
          : "New statute added to Digital Law Library."
      );
      resetForm();
      fetchLaws();
    } else {
      setStatusMessage("Error saving statute.");
    }
  }

  function handleEdit(law: any) {
    setEditingId(law.id);
    setNewLaw({
      title: law.title || "",
      title_urdu: law.title_urdu || "",
      category: law.category || "Constitution",
      section_number: law.section_number || "",
      section_urdu: law.section_urdu || "",
      content: law.content || "",
      content_urdu: law.content_urdu || "",
      marginal_notes: law.marginal_notes || "",
      marginal_notes_urdu: law.marginal_notes_urdu || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setNewLaw({
      title: "",
      title_urdu: "",
      category: "Constitution",
      section_number: "",
      section_urdu: "",
      content: "",
      content_urdu: "",
      marginal_notes: "",
      marginal_notes_urdu: "",
    });
  }

  async function handleDelete(id: number) {
    await supabase.from("laws").delete().eq("id", id);
    fetchLaws();
  }

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4 border-b-2 border-stone-900 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#064E3B] font-semibold block mb-1">
            Screens 11–12 Supply · Sovereign Statute Repository
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-legal text-stone-950">
            Manage Digital Law Library
          </h1>
        </div>
        <button
          type="button"
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-[#064E3B] text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 transition cursor-pointer"
        >
          {showForm ? "Cancel" : "+ Add New Statute / Act"}
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-950/5 border border-[#064E3B] text-xs font-semibold text-[#064E3B]">
          {statusMessage}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSaveLaw}
          className="bg-white p-6 sm:p-8 border border-stone-300 space-y-4"
        >
          <h2 className="text-lg font-bold font-legal text-stone-950">
            {editingId ? "Edit Codified Statute" : "Add Codified Statute (English & Urdu)"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={newLaw.category}
              onChange={(e) => setNewLaw({ ...newLaw, category: e.target.value })}
              className="p-3 bg-stone-50 border border-stone-300 text-xs"
            >
              <option value="Constitution">Constitution</option>
              <option value="Pakistan Penal Code">Pakistan Penal Code</option>
              <option value="Act">Act</option>
              <option value="Judgment">Judgment</option>
            </select>
            <input
              placeholder="Section / Article Ref (e.g., Article 10A)"
              className="p-3 bg-stone-50 border border-stone-300 text-xs font-mono-code"
              value={newLaw.section_number}
              onChange={(e) =>
                setNewLaw({ ...newLaw, section_number: e.target.value })
              }
            />
            <input
              placeholder="اردو دفعہ / آرٹیکل نمبر"
              dir="rtl"
              className="p-3 bg-stone-50 border border-stone-300 text-xs font-urdu"
              value={newLaw.section_urdu}
              onChange={(e) =>
                setNewLaw({ ...newLaw, section_urdu: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              placeholder="English Statute Title"
              className="p-3 bg-stone-50 border border-stone-300 text-xs font-bold"
              value={newLaw.title}
              onChange={(e) => setNewLaw({ ...newLaw, title: e.target.value })}
            />
            <input
              placeholder="قانون کا اردو عنوان"
              className="p-3 bg-stone-50 border border-stone-300 text-sm font-urdu"
              dir="rtl"
              value={newLaw.title_urdu}
              onChange={(e) =>
                setNewLaw({ ...newLaw, title_urdu: e.target.value })
              }
            />
            <textarea
              placeholder="English Statutory Text..."
              className="p-3 bg-stone-50 border border-stone-300 h-36 text-xs leading-relaxed"
              value={newLaw.content}
              onChange={(e) => setNewLaw({ ...newLaw, content: e.target.value })}
            />
            <textarea
              placeholder="اردو قانونی متن..."
              className="p-3 bg-stone-50 border border-stone-300 h-36 text-base font-urdu leading-loose"
              dir="rtl"
              value={newLaw.content_urdu}
              onChange={(e) =>
                setNewLaw({ ...newLaw, content_urdu: e.target.value })
              }
            />
            <input
              placeholder="English Marginal Commentary Note (Screen 12)"
              className="p-3 bg-stone-50 border border-stone-300 text-xs"
              value={newLaw.marginal_notes}
              onChange={(e) =>
                setNewLaw({ ...newLaw, marginal_notes: e.target.value })
              }
            />
            <input
              placeholder="اردو حاشیہ اور تشریحی نوٹ"
              dir="rtl"
              className="p-3 bg-stone-50 border border-stone-300 text-xs font-urdu"
              value={newLaw.marginal_notes_urdu}
              onChange={(e) =>
                setNewLaw({ ...newLaw, marginal_notes_urdu: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#064E3B] text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Update Statute"
              : "Save Statute to Library"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-stone-500 text-xs">Loading legal records...</p>
      ) : (
        <div className="bg-white border border-stone-300 overflow-hidden">
          <table className="min-w-full divide-y divide-stone-200 text-xs">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-stone-500 uppercase tracking-wider">
                  Statute Title (EN / UR)
                </th>
                <th className="px-6 py-3 text-left font-semibold text-stone-500 uppercase tracking-wider">
                  Category & Section
                </th>
                <th className="px-6 py-3 text-right font-semibold text-stone-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {laws.map((law) => (
                <tr key={law.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <div className="font-bold font-legal text-stone-950 text-sm">
                      {law.title}
                    </div>
                    <div
                      className="text-stone-600 font-urdu text-base mt-1"
                      dir="rtl"
                    >
                      {law.title_urdu}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#064E3B]">
                      {law.category}
                    </div>
                    <div className="font-mono-code text-stone-500">
                      {law.section_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleEdit(law)}
                      className="px-3 py-1 border border-stone-300 text-[#064E3B] font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(law.id)}
                      className="px-3 py-1 border border-red-200 text-red-700 font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}