"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/app/supabase";
import {
  saveMagazinePostServerAction,
  deleteMagazinePostServerAction,
} from "@/app/actions/platformActions";
import {
  InlineSpinner,
  MutationFeedbackBanner,
  useEscapeToClose,
} from "@/app/components/SharedUI";
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Image as ImageIcon,
  Calendar,
  X,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminEditorialCmsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Constitutional Law");
  const [author, setAuthor] = useState("Justice (R) Tariq Mehmood");
  const [content, setContent] = useState("");
  const [titleUrdu, setTitleUrdu] = useState("");
  const [contentUrdu, setContentUrdu] = useState("");
  const [banner, setBanner] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Popup 51 (Media Library / Embed Modal) & Popup 52 (Schedule Publishing Modal)
  const [mediaPopup51Open, setMediaPopup51Open] = useState(false);
  const [schedulePopup52Open, setSchedulePopup52Open] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("2026-11-01T09:00");

  useEscapeToClose(mediaPopup51Open, () => setMediaPopup51Open(false));
  useEscapeToClose(schedulePopup52Open, () => setSchedulePopup52Open(false));

  const loadPosts = async () => {
    const { data } = await supabase
      .from("magazine_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;
    setErrorMsg(null);
    setBanner(null);

    startTransition(async () => {
      try {
        await saveMagazinePostServerAction({
          id: editingId,
          title,
          subtitle,
          category,
          author,
          content,
          title_urdu: titleUrdu || title,
          content_urdu: contentUrdu || content,
        });

        const row = {
          title,
          subtitle,
          category,
          author,
          read_time: "6 min read",
          content,
          title_urdu: titleUrdu || title,
          subtitle_urdu: subtitle,
          category_urdu: "آئینی تجزیہ",
          author_urdu: author,
          read_time_urdu: "6 منٹ کا مطالعہ",
          content_urdu: contentUrdu || content,
          created_at: new Date().toISOString(),
        };

        if (editingId) {
          await supabase.from("magazine_posts").update(row).eq("id", editingId);
        } else {
          await supabase
            .from("magazine_posts")
            .insert([{ id: Date.now(), ...row }]);
        }

        setEditingId(null);
        setTitle("");
        setSubtitle("");
        setContent("");
        setTitleUrdu("");
        setContentUrdu("");
        setSchedulePopup52Open(false);
        setBanner(
          "Saved to public.magazine_posts & executed revalidatePath('/') — Public Homepage & Article Reader updated!"
        );
        await loadPosts();
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to publish article.");
      }
    });
  };

  const handleDelete = (id: number) => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await deleteMagazinePostServerAction(id);
        await supabase.from("magazine_posts").delete().eq("id", id);
        setBanner(`Deleted article #${id} & revalidated public routes.`);
        await loadPosts();
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to delete article.");
      }
    });
  };

  return (
    <div className="space-y-8 font-ui">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-stone-900 pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#064E3B] font-semibold block">
            Module 5 • Route: /admin/cms • Screens 50, 51 (Media Library) & 52 (Schedule Publishing)
          </span>
          <h1 className="text-2xl font-bold font-legal text-stone-950 mt-1">
            Bilingual Magazine Posts CMS (Instant Public Revalidation)
          </h1>
          <p className="text-xs text-stone-600">
            Connected to <code>public.magazine_posts</code> via{" "}
            <code>saveMagazinePostServerAction</code> &{" "}
            <code>revalidatePath(&apos;/&apos;)</code>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMediaPopup51Open(true)}
            className="px-3.5 py-2 bg-white border border-stone-300 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Popup 51 · Media Library / Embed</span>
          </button>
          <button
            type="button"
            onClick={() => setSchedulePopup52Open(true)}
            className="px-3.5 py-2 bg-white border border-stone-300 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#B48327]" />
            <span>Popup 52 · Schedule Publish</span>
          </button>
          <Link
            href="/"
            className="px-3.5 py-2 bg-stone-900 text-white font-semibold flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Public Homepage (/)</span>
          </Link>
        </div>
      </div>

      <MutationFeedbackBanner
        status={errorMsg ? "error" : banner ? "success" : "idle"}
        message={errorMsg || banner}
        onDismiss={() => {
          setBanner(null);
          setErrorMsg(null);
        }}
      />

      <form
        onSubmit={handleSave}
        className="bg-white border border-stone-300 p-6 space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-sm font-bold text-stone-950 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#064E3B]" />
            <span>
              {editingId
                ? `Editing Article #${editingId}`
                : "Screen 50 · Publish New Bilingual Article to magazine_posts"}
            </span>
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setSubtitle("");
                setContent("");
              }}
              className="text-xs text-stone-500 underline cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="English Headline (Title) *"
            required
            className="px-3 py-2 border border-stone-300 sm:col-span-2"
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g. Supreme Court Watch)"
            className="px-3 py-2 border border-stone-300"
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Editorial Subtitle / Deck"
            className="px-3 py-2 border border-stone-300 sm:col-span-2"
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author Name"
            className="px-3 py-2 border border-stone-300"
          />
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Full English Editorial Content..."
            className="px-3 py-2 border border-stone-300 sm:col-span-3"
          />
          <input
            type="text"
            dir="rtl"
            value={titleUrdu}
            onChange={(e) => setTitleUrdu(e.target.value)}
            placeholder="اردو سرخی (اختیاری)"
            className="px-3 py-2 border border-stone-300 font-urdu sm:col-span-3"
          />
          <textarea
            rows={3}
            dir="rtl"
            value={contentUrdu}
            onChange={(e) => setContentUrdu(e.target.value)}
            placeholder="اردو مضمون کا متن..."
            className="px-3 py-2 border border-stone-300 font-urdu sm:col-span-3"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="min-h-[44px] px-6 py-2.5 bg-[#064E3B] hover:bg-emerald-950 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (
            <>
              <InlineSpinner className="w-4 h-4" />
              <span>Processing...</span>
            </>
          ) : editingId ? (
            "Update Article & Revalidate Public Routes"
          ) : (
            "Publish Article & Revalidate '/'"
          )}
        </button>
      </form>

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-700 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[#064E3B]" />
          <span>Live Articles in public.magazine_posts ({posts.length})</span>
        </h3>
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-white border border-stone-300 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono-code font-bold text-[#064E3B]">
                  #{post.id}
                </span>
                <span className="px-2 py-0.5 bg-stone-100 border border-stone-300 text-[10px] font-semibold">
                  {post.category}
                </span>
                <span className="text-stone-500">By {post.author}</span>
              </div>
              <h4 className="text-sm font-bold font-legal text-stone-950">
                {post.title}
              </h4>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Link
                href={`/magazine/${post.id}`}
                className="px-3 py-1.5 border border-stone-300 hover:bg-stone-100 font-semibold"
              >
                Read (/magazine/{post.id})
              </Link>
              <button
                type="button"
                onClick={() => {
                  setEditingId(post.id);
                  setTitle(post.title || "");
                  setSubtitle(post.subtitle || "");
                  setCategory(post.category || "");
                  setAuthor(post.author || "");
                  setContent(post.content || "");
                  setTitleUrdu(post.title_urdu || "");
                  setContentUrdu(post.content_urdu || "");
                }}
                className="px-3 py-1.5 bg-stone-900 text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(post.id)}
                className="px-3 py-1.5 border border-red-200 text-red-700 hover:bg-red-50 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup 51: Media Library / Embed Modal */}
      {mediaPopup51Open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Supabase Storage Media Library"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setMediaPopup51Open(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-md p-6 shadow-2xl space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <strong className="text-sm text-stone-950">
                Popup 51 • Supabase Storage Media Library (cms-media)
              </strong>
              <button
                type="button"
                aria-label="Close media library modal"
                onClick={() => setMediaPopup51Open(false)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-stone-100 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {[
              "Supreme_Court_Full_Court_2026.jpg",
              "Parliament_Constitutional_Bench_Diagram.pdf",
              "Property_Transfer_Stamp_Duty_Chart.png",
            ].map((asset) => (
              <button
                key={asset}
                type="button"
                onClick={() => {
                  setContent((prev) => `${prev}\n[Embedded Media: ${asset}]`);
                  setMediaPopup51Open(false);
                }}
                className="w-full min-h-[44px] text-left p-3 bg-white border border-stone-300 hover:border-[#064E3B] hover:bg-stone-50 font-mono-code transition-all duration-200 active:scale-[0.98] cursor-pointer break-all"
              >
                + Insert {asset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popup 52: Schedule Publishing Modal */}
      {schedulePopup52Open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Schedule Editorial Publication"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSchedulePopup52Open(false)}
        >
          <div
            className="bg-[#FBF9F5] border border-stone-300 w-full max-w-md p-6 shadow-2xl space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <strong className="text-sm text-stone-950">
                Popup 52 • Schedule Editorial Publication
              </strong>
              <button
                type="button"
                aria-label="Close schedule publication modal"
                onClick={() => setSchedulePopup52Open(false)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-stone-100 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 border border-stone-300 bg-white font-mono-code"
            />
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleSave()}
              className="w-full min-h-[44px] py-2.5 bg-[#064E3B] hover:bg-emerald-950 text-white font-bold inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <InlineSpinner className="w-4 h-4" />
                  <span>Processing...</span>
                </>
              ) : (
                "Confirm Schedule & Save to magazine_posts"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
