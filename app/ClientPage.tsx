"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Scale,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Play,
  Pause,
  BookOpen,
  ShieldCheck,
  FileText,
  Sparkles,
  Check,
  Copy,
  Download,
  X,
  Search,
  Clock,
  AlertTriangle,
  Globe,
  EyeOff,
  Lock,
  Send,
  Volume2,
  CheckCircle2,
  Bookmark,
} from "lucide-react";
import { createClient } from "@/app/supabase";
import {
  PRECEDENT_ALERTS,
  TRIAGE_ROADMAPS,
  SPOTLIGHT_BRIEFINGS,
  CLAUSE_DECODER_GROUPS,
  VERIFIED_ADVOCATES,
  PLAIN_LAW_INDEX,
  LEGAL_TEMPLATES,
  type SpotlightBriefing,
  type VerifiedAdvocate,
  type LegalTemplateDraft,
  type ClauseDocumentGroup,
} from "@/app/qanoonData";

const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Peshawar",
  "Rawalpindi",
  "Multan",
  "Quetta",
] as const;

const CITIES_URDU: Record<string, string> = {
  "All Pakistan": "پورا پاکستان",
  Lahore: "لاہور",
  Karachi: "کراچی",
  Islamabad: "اسلام آباد",
  Peshawar: "پشاور",
  Rawalpindi: "راولپنڈی",
  Multan: "ملتان",
  Quetta: "کوئٹہ",
};

const TRIAGE_GOALS = [
  {
    id: "roadmap",
    en: "My 3-Step Legal Roadmap",
    ur: "میرا 3 نکاتی قانونی روڈ میپ",
  },
  {
    id: "protection",
    en: "Immediate Police & Court Protection",
    ur: "فوری پولیس اور عدالتی تحفظ",
  },
  {
    id: "documents",
    en: "Mandatory Documents & Evidence Checklist",
    ur: "لازمی دستاویزات اور شواہد کی فہرست",
  },
];

function getInitials(name: string): string {
  return name
    .replace(/^Adv\.\s+|^Barrister\s+|^Advocate\s+|^Syed\s+|^Mian\s+/i, "")
    .replace(/,\s*(ASC|AHC).*$/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

export default function ClientPage() {
  // Language & Safety Cloak State
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [safetyCloakActive, setSafetyCloakActive] = useState(false);

  // Scroll Progress Bar (0 to 1)
  const [scrollProgress, setScrollProgress] = useState(0);

  // Section 1: Supreme Court Precedent Ribbon State
  const [ribbonIndex, setRibbonIndex] = useState(0);
  const [ribbonPaused, setRibbonPaused] = useState(false);

  // Section 2: Conversational Mad-Libs Triage State
  const topicKeys = useMemo(() => Object.keys(TRIAGE_ROADMAPS), []);
  const [selectedCity, setSelectedCity] = useState<string>("Lahore");
  const [selectedTopic, setSelectedTopic] = useState<string>(
    topicKeys[0] || "Family & Khula"
  );
  const [selectedGoal, setSelectedGoal] = useState<string>("roadmap");
  const [roadmapExpanded, setRoadmapExpanded] = useState<boolean>(true);
  const [roadmapStatuteMode, setRoadmapStatuteMode] = useState<"plain" | "statute">("plain");
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    "Family & Khula-0": true,
    "Family & Khula-1": true,
  });

  // Section 3: Auto-Rotating Editorial & Precedent Spotlight State
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [spotlightPaused, setSpotlightPaused] = useState(false);
  const [audioPlayingId, setAudioPlayingId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(28);

  // Section 4: Interactive Clause Decoder State
  const [activeDecoderKey, setActiveDecoderKey] = useState<ClauseDocumentGroup["key"]>("nikahnama");
  const [activeClauseId, setActiveClauseId] = useState<string>(
    CLAUSE_DECODER_GROUPS[0]?.clauses[0]?.id || "nikah-18"
  );
  const [hoveredClauseId, setHoveredClauseId] = useState<string | null>(null);

  // Section 5: Touch-Draggable Verified Advocates Carousel State
  const [advocates, setAdvocates] = useState<VerifiedAdvocate[]>(VERIFIED_ADVOCATES);
  const [advocateCityFilter, setAdvocateCityFilter] = useState<string>("All Pakistan");
  const advocateSliderRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  // Section 6: Plain-Law Index & Swipeable Templates State
  const [hoveredLawId, setHoveredLawId] = useState<string | null>(null);
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([
    PLAIN_LAW_INDEX[0]?.id || "briefing-khula-mehr",
  ]);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState<number>(0);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // Slide-Over Drawers & Modals
  const [readerItem, setReaderItem] = useState<SpotlightBriefing | null>(null);
  const [readerMode, setReaderMode] = useState<"plain" | "formal">("plain");
  const [readerTheme, setReaderTheme] = useState<"paper" | "sepia" | "ink">("paper");
  const [readerFontScale, setReaderFontScale] = useState<number>(1);

  const [bookingAdvocate, setBookingAdvocate] = useState<VerifiedAdvocate | null>(null);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [bookingDate, setBookingDate] = useState<string>("Tomorrow");
  const [bookingSlot, setBookingSlot] = useState<string>("04:30 PM PKT");
  const [bookingName, setBookingName] = useState<string>("");
  const [bookingPhone, setBookingPhone] = useState<string>("");
  const [bookingNotes, setBookingNotes] = useState<string>("");
  const [bookingSubmitting, setBookingSubmitting] = useState<boolean>(false);
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  const [dossierAdvocate, setDossierAdvocate] = useState<VerifiedAdvocate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<LegalTemplateDraft | null>(null);
  const [templateLangMode, setTemplateLangMode] = useState<"bilingual" | "en" | "ur">("bilingual");

  // AI Legal Assistant Slide-Over Drawer State
  const [aiDrawerOpen, setAiDrawerOpen] = useState<boolean>(false);
  const [aiSearchGrounding, setAiSearchGrounding] = useState<boolean>(true);
  const [aiQuery, setAiQuery] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiMessages, setAiMessages] = useState<
    Array<{
      role: "user" | "assistant";
      text: string;
      textUrdu?: string;
      citations?: string[];
      grounded?: boolean;
    }>
  >([
    {
      role: "assistant",
      text: "Welcome to the QanoonPK Statutory Research Desk. Ask any question regarding Pakistani family law, inheritance (Wirasat), FIR & bail procedure, property registration, or cyber harassment.",
      textUrdu:
        "قانون پاکستان کے تحقیقی ڈیسک میں خوش آمدید۔ عائلی قوانین، وراثت، ایف آئی آر و ضمانت، جائیداد یا سائبر ہراسانی سے متعلق کوئی بھی قانونی سوال پوچھیں۔",
      citations: ["Constitution of Pakistan 1973", "Pakistan Code & PLD Archive"],
      grounded: true,
    },
  ]);

  // Quick Search Modal (Cmd+K)
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Scroll listener for 2px top emerald reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress(Math.min(1, Math.max(0, scrollTop / docHeight)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global Escape & Cmd+K keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setReaderItem(null);
        setBookingAdvocate(null);
        setDossierAdvocate(null);
        setPreviewTemplate(null);
        setAiDrawerOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-rotate Supreme Court ribbon every 5 seconds
  useEffect(() => {
    if (ribbonPaused) return;
    const timer = setInterval(() => {
      setRibbonIndex((prev) => (prev + 1) % PRECEDENT_ALERTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [ribbonPaused]);

  // Auto-rotate Spotlight Carousel every 7 seconds
  useEffect(() => {
    if (spotlightPaused || audioPlayingId !== null) return;
    const timer = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % SPOTLIGHT_BRIEFINGS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [spotlightPaused, audioPlayingId]);

  // Simulated audio waveform progress tick when audio player is active
  useEffect(() => {
    if (!audioPlayingId) return;
    const interval = setInterval(() => {
      setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 450);
    return () => clearInterval(interval);
  }, [audioPlayingId]);

  // Hydrate verified advocates from Supabase if live rows exist, merging with curated High Court advocates
  useEffect(() => {
    let mounted = true;
    async function fetchLiveLawyers() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("lawyers")
          .select("*")
          .eq("verification_status", "verified")
          .order("rating_avg", { ascending: false })
          .limit(8);

        if (!error && data && data.length > 0 && mounted) {
          const mapped: VerifiedAdvocate[] = data.map(
            (row: Record<string, unknown>, idx: number) => {
              const fallback = VERIFIED_ADVOCATES[idx % VERIFIED_ADVOCATES.length];
              return {
                id: String(row.id || fallback.id),
                name:
                  typeof row.name === "string" && row.name.trim()
                    ? row.name
                    : fallback.name,
                name_urdu:
                  typeof row.name_urdu === "string" && row.name_urdu
                    ? row.name_urdu
                    : fallback.name_urdu,
                court: fallback.court,
                court_urdu: fallback.court_urdu,
                city:
                  typeof row.city === "string" && row.city
                    ? row.city
                    : fallback.city,
                city_urdu:
                  typeof row.city_urdu === "string" && row.city_urdu
                    ? row.city_urdu
                    : fallback.city_urdu,
                specialty:
                  typeof row.specialty === "string" && row.specialty
                    ? row.specialty
                    : fallback.specialty,
                specialty_urdu:
                  typeof row.specialty_urdu === "string" && row.specialty_urdu
                    ? row.specialty_urdu
                    : fallback.specialty_urdu,
                bar_council_id:
                  typeof row.bar_council_id === "string" && row.bar_council_id
                    ? row.bar_council_id
                    : fallback.bar_council_id,
                experience_years:
                  typeof row.experience_years === "number"
                    ? row.experience_years
                    : fallback.experience_years,
                rating:
                  typeof row.rating_avg === "number" || typeof row.rating_avg === "string"
                    ? String(row.rating_avg)
                    : fallback.rating,
                fee:
                  typeof row.hourly_fee_pkr === "number"
                    ? row.hourly_fee_pkr
                    : fallback.fee,
                pro_bono:
                  typeof row.pro_bono_opt_in === "boolean"
                    ? row.pro_bono_opt_in
                    : fallback.pro_bono,
                bio:
                  typeof row.bio === "string" && row.bio ? row.bio : fallback.bio,
                bio_urdu:
                  typeof row.intro_urdu === "string" && row.intro_urdu
                    ? row.intro_urdu
                    : fallback.bio_urdu,
                notable_precedents: fallback.notable_precedents,
              };
            }
          );

          const combined = [...mapped];
          for (const v of VERIFIED_ADVOCATES) {
            if (!combined.some((item) => item.city.toLowerCase() === v.city.toLowerCase())) {
              combined.push(v);
            }
          }
          setAdvocates(combined);
        }
      } catch {
        // Keep curated VERIFIED_ADVOCATES on offline/fallback
      }
    }
    fetchLiveLawyers();
    return () => {
      mounted = false;
    };
  }, []);

  const currentAlert = PRECEDENT_ALERTS[ribbonIndex] || PRECEDENT_ALERTS[0];
  const currentRoadmap =
    TRIAGE_ROADMAPS[selectedTopic] ||
    TRIAGE_ROADMAPS["Family & Khula"] ||
    Object.values(TRIAGE_ROADMAPS)[0];
  const currentSpotlight = SPOTLIGHT_BRIEFINGS[spotlightIndex] || SPOTLIGHT_BRIEFINGS[0];
  const currentDecoderGroup =
    CLAUSE_DECODER_GROUPS.find((g) => g.key === activeDecoderKey) ||
    CLAUSE_DECODER_GROUPS[0];
  const currentClause =
    currentDecoderGroup.clauses.find((c) => c.id === activeClauseId) ||
    currentDecoderGroup.clauses[0];

  const filteredAdvocates = useMemo(() => {
    if (advocateCityFilter === "All Pakistan") return advocates;
    return advocates.filter(
      (adv) => adv.city.toLowerCase() === advocateCityFilter.toLowerCase()
    );
  }, [advocates, advocateCityFilter]);

  const currentTemplate = LEGAL_TEMPLATES[activeTemplateIndex] || LEGAL_TEMPLATES[0];

  // Search filter across briefings, clauses, advocates, and templates
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: Array<{
      id: string;
      category: string;
      title: string;
      titleUrdu: string;
      citation: string;
      action: () => void;
    }> = [];

    PLAIN_LAW_INDEX.forEach((item) => {
      if (
        item.titleEn.toLowerCase().includes(q) ||
        item.citation.toLowerCase().includes(q) ||
        item.categoryEn.toLowerCase().includes(q) ||
        item.titleUr.includes(q)
      ) {
        results.push({
          id: item.id,
          category: "Plain-Law Briefing",
          title: item.titleEn,
          titleUrdu: item.titleUr,
          citation: item.citation,
          action: () => {
            setReaderMode("plain");
            setReaderItem(item);
            setSearchOpen(false);
          },
        });
      }
    });

    CLAUSE_DECODER_GROUPS.forEach((group) => {
      group.clauses.forEach((cl) => {
        if (
          cl.titleEn.toLowerCase().includes(q) ||
          cl.clauseNumber.toLowerCase().includes(q) ||
          cl.meaningEn.toLowerCase().includes(q)
        ) {
          results.push({
            id: cl.id,
            category: `${group.labelEn} Decoder`,
            title: `${cl.clauseNumber}: ${cl.titleEn}`,
            titleUrdu: `${cl.clauseNumber}: ${cl.titleUr}`,
            citation: group.statuteRef,
            action: () => {
              setActiveDecoderKey(group.key);
              setActiveClauseId(cl.id);
              setSearchOpen(false);
              document
                .getElementById("clause-decoder")
                ?.scrollIntoView({ behavior: "smooth" });
            },
          });
        }
      });
    });

    advocates.forEach((adv) => {
      if (
        adv.name.toLowerCase().includes(q) ||
        adv.specialty.toLowerCase().includes(q) ||
        adv.city.toLowerCase().includes(q)
      ) {
        results.push({
          id: adv.id,
          category: `Verified Advocate (${adv.city})`,
          title: `${adv.name} — ${adv.specialty}`,
          titleUrdu: `${adv.name_urdu} — ${adv.specialty_urdu}`,
          citation: adv.bar_council_id,
          action: () => {
            setDossierAdvocate(adv);
            setSearchOpen(false);
          },
        });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery, advocates]);

  // Helper to copy template text
  const handleCopyTemplate = (template: LegalTemplateDraft) => {
    const content = `${template.titleEn} (${template.titleUr})\nCitation: ${template.statuteBadge}\n\n${template.englishDraft}\n\n${template.urduDraft}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(content).catch(() => {});
    }
    setCopiedTemplateId(template.id);
    setTimeout(() => setCopiedTemplateId(null), 2500);
  };

  // Helper to download template as a clean .txt court draft
  const handleDownloadTemplate = (template: LegalTemplateDraft) => {
    const content = `====================================================================
QANOONPK ARCHIVAL STATUTORY TEMPLATE — ${template.titleEn.toUpperCase()}
${template.titleUr}
Statutory Authority: ${template.statuteBadge}
Stamp Paper Requirement: ${template.stampPaperValue}
====================================================================

[ENGLISH STATUTORY DRAFT]
${template.englishDraft}

--------------------------------------------------------------------

[اردو قانونی مسودہ]
${template.urduDraft}

====================================================================
Generated via QanoonPK — Pakistan Legal Aid & Statute Archive
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.id}-qanoonpk-draft.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Advocate Slider Mouse Drag & Button Scroll
  const scrollAdvocateCarousel = (dir: "left" | "right") => {
    if (!advocateSliderRef.current) return;
    const scrollAmount = 380;
    advocateSliderRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!advocateSliderRef.current) return;
    setIsDraggingSlider(true);
    setDragStartX(e.pageX - advocateSliderRef.current.offsetLeft);
    setDragScrollLeft(advocateSliderRef.current.scrollLeft);
  };

  const handleSliderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSlider || !advocateSliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - advocateSliderRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.4;
    advocateSliderRef.current.scrollLeft = dragScrollLeft - walk;
  };

  const handleSliderMouseUp = () => {
    setIsDraggingSlider(false);
  };

  // Submit Consultation Booking to Supabase `appointments_and_cases`
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingAdvocate) return;
    setBookingSubmitting(true);
    const refCode = `QPK-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const supabase = createClient();
      await supabase.from("appointments_and_cases").insert([
        {
          case_title: `${selectedTopic} Consultation — ${bookingName || "Citizen Client"}`,
          case_type: bookingAdvocate.specialty,
          status: "scheduled",
          appointment_date: new Date().toISOString().split("T")[0],
          appointment_time: bookingSlot,
          consultation_mode: "video_escrow",
          fee_pkr: bookingAdvocate.fee,
          escrow_status: "held_in_escrow",
          notes: `City: ${selectedCity} | Phone: ${bookingPhone} | Ref: ${refCode} | Notes: ${bookingNotes}`,
        },
      ]);
    } catch {
      // Proceed gracefully with escrow reference code
    }

    setBookingSubmitting(false);
    setBookingReference(refCode);
    setBookingStep(3);
  };

  // Submit AI Legal Assistant Query (with live Google Search Grounding toggle)
  const handleSendAiQuery = async (customPrompt?: string) => {
    const promptText = (customPrompt ?? aiQuery).trim();
    if (!promptText || aiLoading) return;

    setAiQuery("");
    setAiMessages((prev) => [...prev, { role: "user", text: promptText }]);
    setAiLoading(true);

    try {
      const res = await fetch("/api/legal-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: promptText,
          useSearchGrounding: aiSearchGrounding,
          city: selectedCity,
          topic: selectedTopic,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.text) {
          setAiMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: data.text,
              citations: data.citations || [
                currentRoadmap.statuteBadge,
                "Constitution of Pakistan 1973",
              ],
              grounded: aiSearchGrounding,
            },
          ]);
          setAiLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to curated statutory intelligence below
    }

    const lower = promptText.toLowerCase();
    let r = currentRoadmap;
    if (
      lower.includes("khula") ||
      lower.includes("nikah") ||
      lower.includes("divorce") ||
      lower.includes("maintenance")
    ) {
      r = TRIAGE_ROADMAPS["Family & Khula"] || currentRoadmap;
    } else if (
      lower.includes("fir") ||
      lower.includes("police") ||
      lower.includes("bail") ||
      lower.includes("arrest")
    ) {
      r = TRIAGE_ROADMAPS["Police FIR & Bail"] || currentRoadmap;
    } else if (
      lower.includes("property") ||
      lower.includes("wirasat") ||
      lower.includes("inheritance") ||
      lower.includes("land")
    ) {
      r = TRIAGE_ROADMAPS["Property & Wirasat"] || currentRoadmap;
    } else if (
      lower.includes("cyber") ||
      lower.includes("fia") ||
      lower.includes("blackmail") ||
      lower.includes("harass")
    ) {
      r = TRIAGE_ROADMAPS["FIA Cyber Harassment"] || currentRoadmap;
    }

    const replyEn = `${r.protectionPlainEn}\n\nNext Procedural Step: ${r.nextStepPlainEn}`;
    const replyUr = `${r.protectionUr}\n\nاگلا قانونی قدم: ${r.nextStepUr}`;
    const cites = [r.statuteBadge, "Constitution of Pakistan Art. 4 & 10-A"];

    setAiMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: replyEn,
        textUrdu: replyUr,
        citations: cites,
        grounded: aiSearchGrounding,
      },
    ]);
    setAiLoading(false);
  };

  // Quick Exit Safety Cloak View (for domestic safety / privacy protection inside iframe)
  if (safetyCloakActive) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-[#141413] font-ui-sans flex flex-col justify-between p-8 md:p-16">
        <div className="max-w-3xl mx-auto w-full border-b border-[#E5E2D9] pb-6 flex items-center justify-between">
          <div>
            <p className="font-mono-code text-xs uppercase tracking-widest text-[#66645E]">
              PAKISTAN METEOROLOGICAL & REGIONAL ARCHIVE
            </p>
            <h1 className="font-legal-serif text-2xl mt-1">
              Regional Weather & Agricultural Forecast — Lahore / Islamabad / Karachi
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setSafetyCloakActive(false)}
            className="text-xs font-mono-code text-[#66645E] hover:text-[#141413] border border-[#E5E2D9] rounded-lg px-3.5 py-2 min-h-[44px]"
          >
            Restore Session
          </button>
        </div>

        <div className="max-w-3xl mx-auto w-full my-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9]">
            <p className="font-mono-code text-xs text-[#66645E]">LAHORE PUNJAB</p>
            <p className="font-legal-serif text-3xl mt-2">28°C</p>
            <p className="text-sm text-[#66645E] mt-2">
              Clear skies, light northeast breeze at 11 km/h.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9]">
            <p className="font-mono-code text-xs text-[#66645E]">ISLAMABAD CAPITAL</p>
            <p className="font-legal-serif text-3xl mt-2">24°C</p>
            <p className="text-sm text-[#66645E] mt-2">
              Partly cloudy over Margalla ridge, humidity 42%.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9]">
            <p className="font-mono-code text-xs text-[#66645E]">KARACHI SINDH</p>
            <p className="font-legal-serif text-3xl mt-2">30°C</p>
            <p className="text-sm text-[#66645E] mt-2">
              Coastal sea breeze, evening visibility 10 km.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#66645E] font-mono-code">
          Privacy Cloak Active — Local triage selections hidden from screen view.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] font-ui-sans selection:bg-[#0B5D3B]/15 selection:text-[#0B5D3B] pb-24 md:pb-0">
      {/* 2px Surgical Emerald Reading Progress Bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#0B5D3B] z-50 origin-left transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* =====================================================================
          SECTION 1: SINGLE WHISPER-QUIET HEADER (h-20) & ROTATING SC RIBBON
          ===================================================================== */}
      <header className="sticky top-0 z-40 h-20 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E5E2D9] transition-editorial">
        <div className="max-w-5xl mx-auto h-full px-6 flex items-center justify-between gap-4">
          {/* Left: Brand Emblem + QanoonPK in Libre Baskerville + Nastaliq Urdu */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group focus:outline-none"
            aria-label="QanoonPK Home"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] flex items-center justify-center text-[#141413] group-hover:border-[#0B5D3B] transition-editorial">
              <Scale className="w-4 h-4 text-[#0B5D3B]" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-legal-serif text-xl font-bold tracking-tight text-[#141413]">
                QanoonPK
              </span>
              <span className="hidden sm:inline-block text-[#E5E2D9]" aria-hidden="true">
                |
              </span>
              <span
                dir="rtl"
                className="hidden sm:inline-block font-urdu text-lg text-[#141413] leading-none"
              >
                قانون پاکستان
              </span>
            </div>
          </Link>

          {/* Center: 4 Clean Links with Sliding 1px Ink Underline on Hover */}
          <nav
            className="hidden lg:flex items-center gap-7"
            aria-label="Primary Editorial Navigation"
          >
            <a
              href="#plain-law-library"
              className="editorial-link text-sm font-medium text-[#141413]/85 hover:text-[#141413] transition-editorial"
            >
              {lang === "ur" ? "آسان قانونی لائبریری" : "Plain-Law Library"}
            </a>
            <a
              href="#clause-decoder"
              className="editorial-link text-sm font-medium text-[#141413]/85 hover:text-[#141413] transition-editorial"
            >
              {lang === "ur" ? "نکاح نامہ و ایف آئی آر ڈی کوڈر" : "Clause Decoder"}
            </a>
            <a
              href="#verified-advocates"
              className="editorial-link text-sm font-medium text-[#141413]/85 hover:text-[#141413] transition-editorial"
            >
              {lang === "ur" ? "تصدیق شدہ وکلاء" : "Verified Advocates"}
            </a>
            <a
              href="#legal-templates"
              className="editorial-link text-sm font-medium text-[#141413]/85 hover:text-[#141413] transition-editorial"
            >
              {lang === "ur" ? "قانونی مسودے" : "Legal Templates"}
            </a>
          </nav>

          {/* Right: Search (⌘K), Language Switch (EN | اردو), Quick Exit, and ONE Surgical #0B5D3B CTA */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-lg border border-[#E5E2D9] bg-[#F2EFE9]/60 hover:bg-[#F2EFE9] text-xs text-[#66645E] hover:text-[#141413] transition-editorial"
              title="Search Statutes, Clauses & Advocates (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="font-mono-code text-[11px]">⌘K</span>
            </button>

            {/* Bilingual Switcher: EN | اردو */}
            <div
              role="group"
              aria-label="Language Switcher"
              className="inline-flex items-center rounded-lg border border-[#E5E2D9] bg-[#F2EFE9] p-0.5 min-h-[40px]"
            >
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-editorial ${
                  lang === "en"
                    ? "bg-[#FAF9F5] text-[#141413] shadow-2xs"
                    : "text-[#66645E] hover:text-[#141413]"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("ur")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-editorial ${
                  lang === "ur"
                    ? "bg-[#FAF9F5] text-[#141413] shadow-2xs"
                    : "text-[#66645E] hover:text-[#141413]"
                }`}
              >
                اردو
              </button>
            </div>

            {/* Discreet Quick Exit Safety Button */}
            <button
              type="button"
              onClick={() => setSafetyCloakActive(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-[#E5E2D9] text-xs font-medium text-[#66645E] hover:text-[#141413] hover:bg-[#F2EFE9] transition-editorial"
              title="Instant Privacy Screen Cloak"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Quick Exit</span>
            </button>

            {/* ONE Surgical #0B5D3B Emerald CTA Pill */}
            <button
              type="button"
              onClick={() => setAiDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-lg bg-[#0B5D3B] text-[#FAF9F5] text-xs sm:text-sm font-medium hover:bg-[#09482E] transition-editorial cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === "ur" ? "قانونی معاون" : "Ask Legal AI"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sleek Single-Line Rotating Supreme Court Precedent Ribbon */}
      <div
        className="bg-[#F2EFE9] border-b border-[#E5E2D9]"
        onMouseEnter={() => setRibbonPaused(true)}
        onMouseLeave={() => setRibbonPaused(false)}
      >
        <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Live Emerald Pulse Dot */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0B5D3B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0B5D3B]" />
            </span>

            <span className="font-mono-code text-[11px] font-semibold uppercase tracking-wider text-[#141413] shrink-0">
              {currentAlert.citation}
            </span>

            <span className="text-[#E5E2D9] shrink-0" aria-hidden="true">
              •
            </span>

            <p
              dir={lang === "ur" ? "rtl" : "ltr"}
              className={`truncate text-xs sm:text-sm text-[#141413] transition-editorial ${
                lang === "ur" ? "font-urdu text-base" : "font-ui-sans"
              }`}
            >
              {lang === "ur" ? currentAlert.ur : currentAlert.en}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() =>
                setRibbonIndex(
                  (prev) => (prev - 1 + PRECEDENT_ALERTS.length) % PRECEDENT_ALERTS.length
                )
              }
              aria-label="Previous Supreme Court Precedent"
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#66645E] hover:text-[#141413] hover:bg-[#FAF9F5] transition-editorial"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono-code text-[11px] text-[#66645E] px-1">
              {ribbonIndex + 1}/{PRECEDENT_ALERTS.length}
            </span>
            <button
              type="button"
              onClick={() => setRibbonIndex((prev) => (prev + 1) % PRECEDENT_ALERTS.length)}
              aria-label="Next Supreme Court Precedent"
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#66645E] hover:text-[#141413] hover:bg-[#FAF9F5] transition-editorial"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN EDITORIAL CONTAINER (max-w-5xl mx-auto px-6, 60% Whitespace)
          ===================================================================== */}
      <main className="max-w-5xl mx-auto px-6">
        {/* ===================================================================
            SECTION 2: CALM HERO & CONVERSATIONAL "MAD-LIBS" TRIAGE DESK
            =================================================================== */}
        <section id="triage-desk" className="py-20 md:py-24 border-b border-[#E5E2D9]">
          {/* Editorial Kicker */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2.5">
              <span className="font-mono-code text-xs uppercase tracking-[0.14em] text-[#66645E]">
                PAKISTAN STATUTE ARCHIVE & CITIZEN JUSTICE DESK
              </span>
            </div>
            <span dir="rtl" className="font-urdu text-xl sm:text-2xl text-[#141413]/90">
              انصاف تک باوقار اور آسان رسائی — ہر پاکستانی شہری کا آئینی حق
            </span>
          </div>

          {/* Monumental Bilingual Display Headline */}
          <div className="max-w-4xl">
            <h1
              className="font-legal-serif text-[#141413] tracking-[-0.025em] leading-[1.12] font-normal"
              style={{ fontSize: "clamp(2.35rem, 4.5vw, 3.85rem)" }}
            >
              The Law of Pakistan, written in plain words you can act upon today.
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg text-[#66645E] leading-relaxed">
              Every Supreme Court ruling, Family Court remedy, FIR safeguard, and inheritance share
              distilled into clear English and Nastaliq Urdu—without jargon or intimidation.
            </p>
          </div>

          {/* Conversational "Mad-Libs" Triage Card */}
          <div className="mt-12 rounded-2xl bg-[#F2EFE9] border border-[#E5E2D9] p-7 sm:p-10 transition-editorial">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-[#E5E2D9]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0B5D3B]" />
                <span className="font-mono-code text-xs uppercase tracking-wider text-[#66645E]">
                  INTERACTIVE CITIZEN TRIAGE DESK
                </span>
              </div>
              <span className="font-mono-code text-xs text-[#66645E]">
                {currentRoadmap.statuteBadge}
              </span>
            </div>

            {/* Natural-Language Sentence Builder */}
            <div className="font-legal-serif text-xl sm:text-2xl md:text-[28px] leading-[1.65] text-[#141413]">
              <span>“I am in </span>
              <label className="inline-block relative mx-1 align-baseline">
                <span className="sr-only">Select City</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="appearance-none bg-[#FAF9F5] border-b-2 border-[#0B5D3B] px-3 py-1 pr-8 rounded-md font-ui-sans font-semibold text-base sm:text-xl text-[#0B5D3B] focus:outline-none cursor-pointer"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city} ({CITIES_URDU[city]})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#0B5D3B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </label>

              <span> dealing with </span>

              <label className="inline-block relative mx-1 align-baseline">
                <span className="sr-only">Select Legal Matter</span>
                <select
                  value={selectedTopic}
                  onChange={(e) => {
                    setSelectedTopic(e.target.value);
                    setRoadmapExpanded(true);
                  }}
                  className="appearance-none bg-[#FAF9F5] border-b-2 border-[#0B5D3B] px-3 py-1 pr-8 rounded-md font-ui-sans font-semibold text-base sm:text-xl text-[#0B5D3B] focus:outline-none cursor-pointer"
                >
                  {topicKeys.map((key) => (
                    <option key={key} value={key}>
                      {TRIAGE_ROADMAPS[key].labelEn}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#0B5D3B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </label>

              <span>, and I need </span>

              <label className="inline-block relative mx-1 align-baseline">
                <span className="sr-only">Select Required Outcome</span>
                <select
                  value={selectedGoal}
                  onChange={(e) => {
                    setSelectedGoal(e.target.value);
                    setRoadmapExpanded(true);
                  }}
                  className="appearance-none bg-[#FAF9F5] border-b-2 border-[#0B5D3B] px-3 py-1 pr-8 rounded-md font-ui-sans font-semibold text-base sm:text-xl text-[#0B5D3B] focus:outline-none cursor-pointer"
                >
                  {TRIAGE_GOALS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.en}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#0B5D3B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </label>
              <span>.”</span>
            </div>

            {/* Urdu Mirror Sentence */}
            <p dir="rtl" className="mt-4 font-urdu text-lg sm:text-xl text-[#66645E]">
              میں{" "}
              <span className="text-[#141413] font-semibold">
                {CITIES_URDU[selectedCity]}
              </span>{" "}
              میں{" "}
              <span className="text-[#141413] font-semibold">
                {currentRoadmap.labelUr}
              </span>{" "}
              کے معاملے میں فوری قانونی رہنمائی اور عدالتی طریقہ کار جاننا چاہتا ہوں۔
            </p>

            {/* Action Bar */}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setRoadmapExpanded((prev) => !prev)}
                className="inline-flex items-center gap-2.5 px-6 py-3 min-h-[48px] rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-sm font-medium hover:bg-[#09482E] transition-editorial cursor-pointer"
              >
                <span>
                  {roadmapExpanded
                    ? "Refresh My 3-Step Legal Roadmap"
                    : "Unfold My Legal Roadmap"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex flex-wrap items-center gap-3">
                {/* Plain Words <-> Official Statute Toggle */}
                <div className="inline-flex items-center rounded-lg border border-[#E5E2D9] bg-[#FAF9F5] p-1">
                  <button
                    type="button"
                    onClick={() => setRoadmapStatuteMode("plain")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-editorial ${
                      roadmapStatuteMode === "plain"
                        ? "bg-[#141413] text-[#FAF9F5]"
                        : "text-[#66645E] hover:text-[#141413]"
                    }`}
                  >
                    Plain Everyday Words
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoadmapStatuteMode("statute")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-editorial ${
                      roadmapStatuteMode === "statute"
                        ? "bg-[#141413] text-[#FAF9F5]"
                        : "text-[#66645E] hover:text-[#141413]"
                    }`}
                  >
                    Official Statute
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable 3-Column Architectural Roadmap Brief */}
            {roadmapExpanded && (
              <div className="mt-8 pt-8 border-t border-[#E5E2D9] transition-editorial">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Column 1: Immediate Constitutional / Statutory Protection */}
                  <div className="rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono-code text-xs font-semibold text-[#0B5D3B]">
                          01 / IMMEDIATE PROTECTION
                        </span>
                        <ShieldCheck className="w-4 h-4 text-[#0B5D3B]" />
                      </div>
                      <h3 className="font-legal-serif text-lg text-[#141413] mb-2.5">
                        {currentRoadmap.labelEn} Safeguard
                      </h3>
                      <p className="text-sm text-[#141413]/90 leading-relaxed">
                        {roadmapStatuteMode === "plain"
                          ? currentRoadmap.protectionPlainEn
                          : currentRoadmap.protectionFormalEn}
                      </p>
                    </div>
                    <p
                      dir="rtl"
                      className="mt-4 pt-4 border-t border-[#E5E2D9] font-urdu text-base text-[#66645E]"
                    >
                      {currentRoadmap.protectionUr}
                    </p>
                  </div>

                  {/* Column 2: Interactive Mandatory Documents Checklist */}
                  <div className="rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono-code text-xs font-semibold text-[#141413]">
                          02 / MANDATORY DOSSIER
                        </span>
                        <FileText className="w-4 h-4 text-[#66645E]" />
                      </div>
                      <h3 className="font-legal-serif text-lg text-[#141413] mb-3">
                        Required Evidentiary Documents
                      </h3>
                      <ul className="space-y-2.5">
                        {currentRoadmap.documentsEn.map((docEn: string, idx: number) => {
                          const docKey = `${selectedTopic}-${idx}`;
                          const isChecked = !!checkedDocs[docKey];
                          const docUr = currentRoadmap.documentsUr[idx] || "";
                          return (
                            <li key={docKey}>
                              <button
                                type="button"
                                onClick={() =>
                                  setCheckedDocs((prev) => ({
                                    ...prev,
                                    [docKey]: !prev[docKey],
                                  }))
                                }
                                className="w-full text-left flex items-start gap-2.5 group py-1"
                              >
                                <span
                                  className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-editorial shrink-0 ${
                                    isChecked
                                      ? "bg-[#0B5D3B] border-[#0B5D3B] text-[#FAF9F5]"
                                      : "border-[#66645E] bg-transparent"
                                  }`}
                                >
                                  {isChecked && <Check className="w-3 h-3" />}
                                </span>
                                <div className="text-xs sm:text-sm leading-snug">
                                  <span
                                    className={
                                      isChecked
                                        ? "line-through text-[#66645E]"
                                        : "text-[#141413]"
                                    }
                                  >
                                    {docEn}
                                  </span>
                                  {docUr && (
                                    <span
                                      dir="rtl"
                                      className="block font-urdu text-sm text-[#66645E] mt-0.5"
                                    >
                                      {docUr}
                                    </span>
                                  )}
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <p className="mt-4 pt-3 border-t border-[#E5E2D9] font-mono-code text-[11px] text-[#66645E]">
                      Click items to track your case readiness
                    </p>
                  </div>

                  {/* Column 3: Exact Police / Court Procedure + 1-Click Advocate Match */}
                  <div className="rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono-code text-xs font-semibold text-[#141413]">
                          03 / COURT & FORUM FILING
                        </span>
                        <Clock className="w-4 h-4 text-[#66645E]" />
                      </div>
                      <div className="inline-block px-2.5 py-0.5 rounded bg-[#F2EFE9] border border-[#E5E2D9] font-mono-code text-[11px] text-[#141413] mb-2.5">
                        Specialty: {currentRoadmap.recommendedSpecialty}
                      </div>
                      <p className="text-sm text-[#141413]/90 leading-relaxed">
                        {roadmapStatuteMode === "plain"
                          ? currentRoadmap.nextStepPlainEn
                          : currentRoadmap.nextStepFormalEn}
                      </p>
                      <p dir="rtl" className="mt-3 font-urdu text-base text-[#66645E]">
                        {currentRoadmap.nextStepUr}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#E5E2D9] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const cityMatch =
                            advocates.find(
                              (a) => a.city.toLowerCase() === selectedCity.toLowerCase()
                            ) || advocates[0];
                          setBookingAdvocate(cityMatch);
                          setBookingStep(1);
                          setBookingReference(null);
                        }}
                        className="editorial-link text-xs font-semibold text-[#141413] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Consult {selectedCity} Specialist</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#0B5D3B]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAiDrawerOpen(true);
                          handleSendAiQuery(
                            `Give me a step-by-step legal checklist for ${selectedTopic} in ${selectedCity} under ${currentRoadmap.statuteBadge}.`
                          );
                        }}
                        className="font-mono-code text-[11px] text-[#66645E] hover:text-[#141413] underline underline-offset-4 cursor-pointer"
                      >
                        Ask AI Desk →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================================
            SECTION 3: AUTO-ROTATING EDITORIAL & PRECEDENT SPOTLIGHT (1-CARD SLIDER)
            =================================================================== */}
        <section className="py-20 md:py-24 border-b border-[#E5E2D9]">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-mono-code text-xs uppercase tracking-[0.14em] text-[#66645E]">
                SUPREME COURT & LEGISLATIVE BRIEFINGS
              </span>
              <h2 className="font-legal-serif text-2xl sm:text-3xl text-[#141413] mt-2">
                Landmark Precedents, Distilled for Citizens
              </h2>
            </div>

            {/* Progress-Bar Pills + Prev/Next Circular Buttons */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {SPOTLIGHT_BRIEFINGS.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSpotlightIndex(idx)}
                    aria-label={`View briefing ${idx + 1}: ${item.titleEn}`}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                      idx === spotlightIndex
                        ? "w-8 bg-[#0B5D3B]"
                        : "w-2.5 bg-[#E5E2D9] hover:bg-[#66645E]"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5 ml-2">
                <button
                  type="button"
                  onClick={() =>
                    setSpotlightIndex(
                      (prev) =>
                        (prev - 1 + SPOTLIGHT_BRIEFINGS.length) % SPOTLIGHT_BRIEFINGS.length
                    )
                  }
                  aria-label="Previous Spotlight Briefing"
                  className="w-10 h-10 rounded-full border border-[#E5E2D9] bg-[#FAF9F5] hover:bg-[#F2EFE9] flex items-center justify-center text-[#141413] transition-editorial cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSpotlightIndex((prev) => (prev + 1) % SPOTLIGHT_BRIEFINGS.length)
                  }
                  aria-label="Next Spotlight Briefing"
                  className="w-10 h-10 rounded-full border border-[#E5E2D9] bg-[#FAF9F5] hover:bg-[#F2EFE9] flex items-center justify-center text-[#141413] transition-editorial cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Wide Luxury Horizontal Editorial Card */}
          <article
            onMouseEnter={() => setSpotlightPaused(true)}
            onMouseLeave={() => setSpotlightPaused(false)}
            className="rounded-2xl border border-[#E5E2D9] bg-[#FAF9F5] p-8 sm:p-12 transition-editorial"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-[#E5E2D9]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-[#F2EFE9] font-mono-code text-xs font-medium text-[#141413]">
                  {currentSpotlight.categoryEn}
                </span>
                <span className="font-mono-code text-xs text-[#0B5D3B] font-semibold">
                  {currentSpotlight.citation}
                </span>
                <span className="text-[#E5E2D9]">•</span>
                <span className="font-mono-code text-xs text-[#66645E]">
                  {currentSpotlight.readTime}
                </span>
              </div>

              <span dir="rtl" className="font-urdu text-lg text-[#66645E]">
                {currentSpotlight.categoryUr}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <h3 className="font-legal-serif text-2xl sm:text-3xl text-[#141413] leading-snug">
                  {currentSpotlight.titleEn}
                </h3>
                <p dir="rtl" className="mt-3 font-urdu text-xl sm:text-2xl text-[#141413]/90">
                  {currentSpotlight.titleUr}
                </p>
                <p className="mt-4 text-base text-[#66645E] leading-relaxed">
                  {currentSpotlight.subtitleEn}
                </p>
                <p dir="rtl" className="mt-3 font-urdu text-base sm:text-lg text-[#66645E] line-clamp-2">
                  {currentSpotlight.urduSummary}
                </p>
              </div>

              {/* Right Column: Interactive Audio Brief Waveform Player + Medium Reader Trigger */}
              <div className="lg:col-span-4 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] p-6 flex flex-col justify-between gap-5">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-code text-[#66645E] mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-[#0B5D3B]" />
                      AUDIO BRIEF (EN / اردو)
                    </span>
                    <span>{currentSpotlight.audioDuration}</span>
                  </div>

                  {/* Interactive Audio Play Button + Waveform */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setAudioPlayingId((prev) =>
                          prev === currentSpotlight.id ? null : currentSpotlight.id
                        )
                      }
                      aria-label={
                        audioPlayingId === currentSpotlight.id
                          ? "Pause Audio Brief"
                          : "Listen to Audio Brief"
                      }
                      className="w-11 h-11 rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-[#0B5D3B] flex items-center justify-center shrink-0 transition-editorial cursor-pointer"
                    >
                      {audioPlayingId === currentSpotlight.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>

                    {/* Minimalist Waveform Bars */}
                    <div className="flex-1">
                      <div className="flex items-end gap-1 h-7">
                        {[35, 65, 45, 85, 55, 95, 60, 40, 75, 90, 50, 70, 45, 80, 55, 65].map(
                          (barHeight, i) => {
                            const activeBar =
                              audioPlayingId === currentSpotlight.id &&
                              (i / 16) * 100 <= audioProgress;
                            return (
                              <span
                                key={i}
                                className={`flex-1 rounded-full transition-all duration-300 ${
                                  activeBar ? "bg-[#0B5D3B]" : "bg-[#141413]/25"
                                }`}
                                style={{ height: `${barHeight}%` }}
                              />
                            );
                          }
                        )}
                      </div>
                      <p className="mt-1.5 font-mono-code text-[11px] text-[#66645E]">
                        {audioPlayingId === currentSpotlight.id
                          ? `Playing briefing • ${audioProgress}%`
                          : `Narrated by ${currentSpotlight.author}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E2D9] flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setReaderMode("plain");
                      setReaderItem(currentSpotlight);
                    }}
                    className="w-full py-3 px-4 min-h-[44px] rounded-xl bg-[#FAF9F5] border border-[#141413] text-[#141413] hover:bg-[#141413] hover:text-[#FAF9F5] text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 transition-editorial cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Open in Medium Reader</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* ===================================================================
            SECTION 4: INTERACTIVE NIKAHNAMA, FIR & RENT CLAUSE DECODER
            =================================================================== */}
        <section id="clause-decoder" className="py-20 md:py-24 border-b border-[#E5E2D9]">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="font-mono-code text-xs uppercase tracking-[0.14em] text-[#66645E]">
                BEFORE YOU SIGN OR RECORD A STATEMENT
              </span>
              <h2 className="font-legal-serif text-2xl sm:text-3xl text-[#141413] mt-2">
                Interactive Legal Clause Decoder
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#66645E] max-w-xl">
                Select any critical clause below to inspect its official statutory wording, plain
                citizen meaning, and common legal traps.
              </p>
            </div>

            {/* Clean Segmented Pill Switcher */}
            <div
              role="tablist"
              aria-label="Legal Document Type"
              className="inline-flex flex-wrap items-center rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] p-1 gap-1"
            >
              {CLAUSE_DECODER_GROUPS.map((group) => {
                const isSelected = group.key === activeDecoderKey;
                return (
                  <button
                    key={group.key}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setActiveDecoderKey(group.key);
                      setActiveClauseId(group.clauses[0].id);
                    }}
                    className={`px-4 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-medium transition-editorial cursor-pointer ${
                      isSelected
                        ? "bg-[#FAF9F5] text-[#141413] border border-[#E5E2D9] shadow-2xs"
                        : "text-[#66645E] hover:text-[#141413]"
                    }`}
                  >
                    <span>{group.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4 Wide, Breathable Clause Rows with Sibling Dimming (opacity: 0.45) */}
          <div className="space-y-4">
            {currentDecoderGroup.clauses.map((clause) => {
              const isSelected = clause.id === currentClause.id;
              const isDimmed =
                hoveredClauseId !== null
                  ? hoveredClauseId !== clause.id
                  : !isSelected;

              return (
                <div
                  key={clause.id}
                  onMouseEnter={() => setHoveredClauseId(clause.id)}
                  onMouseLeave={() => setHoveredClauseId(null)}
                  className={`rounded-2xl border transition-editorial ${
                    isSelected
                      ? "border-[#141413] bg-[#FAF9F5] opacity-100"
                      : "border-[#E5E2D9] bg-[#FAF9F5] hover:border-[#66645E]"
                  } ${isDimmed && !isSelected ? "opacity-50" : "opacity-100"}`}
                >
                  {/* Clickable Row Header */}
                  <button
                    type="button"
                    onClick={() => setActiveClauseId(clause.id)}
                    className="w-full text-left px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center gap-4">
                      <span
                        className={`font-mono-code text-xs px-3 py-1 rounded-md border ${
                          isSelected
                            ? "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                            : "bg-[#F2EFE9] text-[#141413] border-[#E5E2D9]"
                        }`}
                      >
                        {clause.clauseNumber}
                      </span>
                      <h3 className="font-legal-serif text-lg sm:text-xl text-[#141413]">
                        {clause.titleEn}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <span dir="rtl" className="font-urdu text-lg sm:text-xl text-[#66645E]">
                        {clause.titleUr}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#66645E] transition-transform duration-500 ${
                          isSelected ? "rotate-180 text-[#0B5D3B]" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Unfolded Side-by-Side 3-Part Breakdown */}
                  {isSelected && (
                    <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-[#E5E2D9] grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* 1. Official Wording */}
                      <div className="p-5 rounded-xl bg-[#F2EFE9]/70 border border-[#E5E2D9]">
                        <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#66645E]">
                          1. OFFICIAL STATUTORY TEXT
                        </span>
                        <p className="mt-3 font-legal-serif text-sm text-[#141413] leading-relaxed">
                          “{clause.officialEn}”
                        </p>
                        <p
                          dir="rtl"
                          className="mt-4 pt-3 border-t border-[#E5E2D9] font-urdu text-base text-[#141413]/90"
                        >
                          {clause.officialUr}
                        </p>
                      </div>

                      {/* 2. What It Actually Means in Simple Words */}
                      <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9]">
                        <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#141413]">
                          2. WHAT IT MEANS IN PLAIN WORDS
                        </span>
                        <p className="mt-3 text-sm text-[#141413] leading-relaxed">
                          {clause.meaningEn}
                        </p>
                        <p
                          dir="rtl"
                          className="mt-4 pt-3 border-t border-[#E5E2D9] font-urdu text-base text-[#66645E]"
                        >
                          {clause.meaningUr}
                        </p>
                      </div>

                      {/* 3. Citizen Protection & Red Flags to Watch Out For */}
                      <div className="p-5 rounded-xl bg-[#F2EFE9]/50 border border-[#E5E2D9] border-l-2 border-l-[#0B5D3B]">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#0B5D3B]" />
                          <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#0B5D3B] font-semibold">
                            3. CITIZEN PROTECTION & RED FLAGS
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-[#141413] leading-relaxed">
                          {clause.redFlagEn}
                        </p>
                        <p
                          dir="rtl"
                          className="mt-4 pt-3 border-t border-[#E5E2D9] font-urdu text-base text-[#141413]"
                        >
                          {clause.redFlagUr}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================================
            SECTION 5: TOUCH-DRAGGABLE VERIFIED ADVOCATES CAROUSEL
            =================================================================== */}
        <section id="verified-advocates" className="py-20 md:py-24 border-b border-[#E5E2D9]">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2">
                <span className="font-mono-code text-xs uppercase tracking-[0.14em] text-[#66645E]">
                  PAKISTAN BAR COUNCIL & HIGH COURT ROLLS
                </span>
              </div>
              <h2 className="font-legal-serif text-2xl sm:text-3xl text-[#141413] mt-2">
                Verified High Court & Supreme Court Advocates
              </h2>
            </div>

            {/* Circular Left/Right Slider Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollAdvocateCarousel("left")}
                aria-label="Scroll Advocates Left"
                className="w-10 h-10 rounded-full border border-[#E5E2D9] bg-[#FAF9F5] hover:bg-[#F2EFE9] flex items-center justify-center text-[#141413] transition-editorial cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollAdvocateCarousel("right")}
                aria-label="Scroll Advocates Right"
                className="w-10 h-10 rounded-full border border-[#E5E2D9] bg-[#FAF9F5] hover:bg-[#F2EFE9] flex items-center justify-center text-[#141413] transition-editorial cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* City Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
            {["All Pakistan", "Lahore", "Karachi", "Islamabad", "Peshawar"].map((city) => {
              const active = advocateCityFilter === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setAdvocateCityFilter(city)}
                  className={`px-4 py-2 min-h-[40px] rounded-lg text-xs font-medium shrink-0 transition-editorial cursor-pointer ${
                    active
                      ? "bg-[#141413] text-[#FAF9F5]"
                      : "bg-[#F2EFE9] text-[#66645E] hover:text-[#141413] border border-[#E5E2D9]"
                  }`}
                >
                  <span>{city}</span>
                  <span className="ml-2 opacity-75 font-urdu">{CITIES_URDU[city]}</span>
                </button>
              );
            })}
          </div>

          {/* Horizontal Touch-Draggable Advocate Track */}
          <div
            ref={advocateSliderRef}
            onMouseDown={handleSliderMouseDown}
            onMouseMove={handleSliderMouseMove}
            onMouseUp={handleSliderMouseUp}
            onMouseLeave={handleSliderMouseUp}
            className={`flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 ${
              isDraggingSlider ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
          >
            {filteredAdvocates.map((adv) => (
              <div
                key={adv.id}
                className="min-w-[320px] sm:min-w-[360px] max-w-[360px] snap-start rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] p-7 flex flex-col justify-between editorial-card shrink-0"
              >
                <div>
                  {/* Top Bar: Monogram + Verified Bar Council Seal */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] flex items-center justify-center font-legal-serif text-base font-bold text-[#141413]">
                      {getInitials(adv.name)}
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2EFE9] border border-[#E5E2D9] font-mono-code text-[11px] text-[#141413]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0B5D3B]" />
                        {adv.bar_council_id}
                      </span>
                      <p className="font-mono-code text-[11px] text-[#66645E] mt-1">
                        {adv.court} • {adv.experience_years} Yrs
                      </p>
                    </div>
                  </div>

                  {/* Bilingual Advocate Name & Specialty */}
                  <div className="mt-5">
                    <h3 className="font-legal-serif text-xl text-[#141413]">{adv.name}</h3>
                    <p dir="rtl" className="font-urdu text-lg text-[#66645E] mt-0.5">
                      {adv.name_urdu}
                    </p>
                    <p className="mt-2 text-xs font-medium text-[#0B5D3B]">{adv.specialty}</p>
                    <p className="mt-2 text-xs text-[#66645E] line-clamp-2 leading-relaxed">
                      {adv.bio}
                    </p>
                  </div>
                </div>

                {/* Metrics & Dual Action Footer */}
                <div className="mt-6 pt-5 border-t border-[#E5E2D9]">
                  <div className="flex items-center justify-between text-xs mb-4">
                    <div>
                      <span className="text-[#66645E] block">Location</span>
                      <span className="font-medium text-[#141413]">
                        {adv.city} ({adv.city_urdu})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#66645E] block">Escrow Consultation</span>
                      <span className="font-mono-code font-semibold text-[#141413]">
                        PKR {adv.fee.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setDossierAdvocate(adv)}
                      className="py-2.5 px-3 min-h-[42px] rounded-xl border border-[#E5E2D9] bg-[#F2EFE9]/60 hover:bg-[#F2EFE9] text-xs font-medium text-[#141413] transition-editorial cursor-pointer"
                    >
                      Inspect Dossier
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBookingAdvocate(adv);
                        setBookingStep(1);
                        setBookingReference(null);
                      }}
                      className="py-2.5 px-3 min-h-[42px] rounded-xl bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs font-medium transition-editorial cursor-pointer"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 6: SPLIT SHOWCASE — "LAW IN PLAIN WORDS" & SWIPEABLE TEMPLATES
            =================================================================== */}
        <section
          id="plain-law-library"
          className="py-20 md:py-24 border-b border-[#E5E2D9] grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
        >
          {/* Left Column (7 Cols): Numbered Medium-Style "Law in Plain Words" Index */}
          <div className="lg:col-span-7">
            <div className="mb-8">
              <span className="font-mono-code text-xs uppercase tracking-[0.14em] text-[#66645E]">
                MEDIUM-STYLE STATUTE ESSAYS
              </span>
              <h2 className="font-legal-serif text-2xl sm:text-3xl text-[#141413] mt-2">
                The Law in Plain Words
              </h2>
              <p className="mt-2 text-sm text-[#66645E]">
                Click any numbered briefing to open the distraction-free bilingual reader with
                one-click statute comparison.
              </p>
            </div>

            <div className="divide-y divide-[#E5E2D9] border-t border-b border-[#E5E2D9]">
              {PLAIN_LAW_INDEX.map((item, idx) => {
                const isDimmed = hoveredLawId !== null && hoveredLawId !== item.id;
                const isSaved = savedArticleIds.includes(item.id);
                const numberStr = String(idx + 1).padStart(2, "0");
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredLawId(item.id)}
                    onMouseLeave={() => setHoveredLawId(null)}
                    className={`py-6 transition-opacity duration-500 ${
                      isDimmed ? "opacity-45" : "opacity-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setReaderMode("plain");
                          setReaderItem(item);
                        }}
                        className="text-left group flex items-start gap-4 flex-1 cursor-pointer"
                      >
                        <span className="font-mono-code text-sm font-semibold text-[#0B5D3B] pt-1">
                          {numberStr}
                        </span>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                            <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#66645E]">
                              {item.categoryEn}
                            </span>
                            <span className="text-[#E5E2D9]">•</span>
                            <span className="font-mono-code text-[11px] text-[#141413]">
                              {item.citation}
                            </span>
                            <span className="text-[#E5E2D9]">•</span>
                            <span className="font-mono-code text-[11px] text-[#66645E]">
                              {item.readTime}
                            </span>
                          </div>

                          <h3 className="font-legal-serif text-lg sm:text-xl text-[#141413] group-hover:text-[#0B5D3B] transition-editorial">
                            {item.titleEn}
                          </h3>

                          <p dir="rtl" className="mt-2 font-urdu text-lg text-[#66645E]">
                            {item.titleUr}
                          </p>

                          <p className="mt-2 text-sm text-[#66645E] leading-relaxed">
                            {item.subtitleEn}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSavedArticleIds((prev) =>
                            prev.includes(item.id)
                              ? prev.filter((id) => id !== item.id)
                              : [...prev, item.id]
                          )
                        }
                        aria-label="Bookmark briefing"
                        className="p-2 rounded-lg text-[#66645E] hover:text-[#141413] hover:bg-[#F2EFE9] transition-editorial shrink-0"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            isSaved ? "fill-[#0B5D3B] text-[#0B5D3B]" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (5 Cols): Swipeable Legal Drafts & Templates Stack */}
          <div id="legal-templates" className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div>
                <span className="font-mono-code text-xs uppercase tracking-[0.14em] text-[#66645E]">
                  COURT-READY INSTRUMENTS
                </span>
                <h2 className="font-legal-serif text-2xl text-[#141413] mt-1">
                  Legal Templates & Drafts
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setActiveTemplateIndex(
                      (prev) => (prev - 1 + LEGAL_TEMPLATES.length) % LEGAL_TEMPLATES.length
                    )
                  }
                  aria-label="Previous Legal Template"
                  className="w-9 h-9 rounded-full border border-[#E5E2D9] bg-[#FAF9F5] hover:bg-[#F2EFE9] flex items-center justify-center text-[#141413] transition-editorial cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono-code text-xs text-[#66645E] px-1">
                  {activeTemplateIndex + 1}/{LEGAL_TEMPLATES.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveTemplateIndex((prev) => (prev + 1) % LEGAL_TEMPLATES.length)
                  }
                  aria-label="Next Legal Template"
                  className="w-9 h-9 rounded-full border border-[#E5E2D9] bg-[#FAF9F5] hover:bg-[#F2EFE9] flex items-center justify-center text-[#141413] transition-editorial cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Template Card */}
            <div className="rounded-2xl bg-[#F2EFE9] border border-[#E5E2D9] p-7 transition-editorial">
              <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E5E2D9]">
                <span className="font-mono-code text-xs font-semibold text-[#0B5D3B]">
                  {currentTemplate.statuteBadge}
                </span>
                <span className="font-mono-code text-[11px] px-2.5 py-0.5 rounded bg-[#FAF9F5] border border-[#E5E2D9] text-[#66645E]">
                  {currentTemplate.code}
                </span>
              </div>

              <h3 className="font-legal-serif text-xl text-[#141413]">
                {currentTemplate.titleEn}
              </h3>
              <p dir="rtl" className="mt-1 font-urdu text-xl text-[#141413]">
                {currentTemplate.titleUr}
              </p>

              <p className="mt-3 text-sm text-[#66645E] leading-relaxed">
                {currentTemplate.summaryEn}
              </p>
              <p dir="rtl" className="mt-2 font-urdu text-base text-[#66645E]">
                {currentTemplate.summaryUr}
              </p>

              {/* Paper Excerpt Box */}
              <div className="mt-5 p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] font-mono-code text-xs text-[#141413]/85 whitespace-pre-line line-clamp-5 leading-relaxed">
                {currentTemplate.englishDraft}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-mono-code text-[#66645E]">
                <span>Stamp Paper: {currentTemplate.stampPaperValue}</span>
                <span>EN + اردو Included</span>
              </div>

              {/* Template Actions */}
              <div className="mt-6 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(currentTemplate)}
                  className="py-2.5 px-3 min-h-[42px] rounded-xl bg-[#FAF9F5] border border-[#141413] text-[#141413] hover:bg-[#141413] hover:text-[#FAF9F5] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-editorial cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadTemplate(currentTemplate)}
                  className="py-2.5 px-3 min-h-[42px] rounded-xl bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-editorial cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>

              {/* Template Selector Dots */}
              <div className="mt-5 pt-4 border-t border-[#E5E2D9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCopyTemplate(currentTemplate)}
                  className="text-xs font-mono-code text-[#66645E] hover:text-[#141413] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedTemplateId === currentTemplate.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0B5D3B]" />
                      <span className="text-[#0B5D3B]">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Bilingual Text</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  {LEGAL_TEMPLATES.map((tpl, i) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setActiveTemplateIndex(i)}
                      aria-label={`Select template ${tpl.titleEn}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        i === activeTemplateIndex
                          ? "w-5 bg-[#0B5D3B]"
                          : "w-1.5 bg-[#66645E]/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          SECTION 7: MINIMALIST COLOPHON FOOTER
          ===================================================================== */}
      <footer className="bg-[#FAF9F5] border-t border-[#E5E2D9] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E5E2D9]">
            <div className="md:col-span-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F2EFE9] border border-[#E5E2D9] flex items-center justify-center">
                  <Scale className="w-4 h-4 text-[#0B5D3B]" />
                </div>
                <span className="font-legal-serif text-lg font-bold text-[#141413]">
                  QanoonPK
                </span>
                <span dir="rtl" className="font-urdu text-lg text-[#66645E]">
                  قانون پاکستان
                </span>
              </div>
              <p className="mt-4 text-sm text-[#66645E] max-w-md leading-relaxed">
                Public-interest statutory archive and citizen justice portal. Designed for
                high-craft bilingual legibility across the Constitution of Pakistan, Supreme Court
                PLD/SCMR precedents, and provincial codes.
              </p>
            </div>

            <div className="md:col-span-3">
              <p className="font-mono-code text-xs uppercase tracking-wider text-[#141413] mb-3">
                Citizen Desks
              </p>
              <ul className="space-y-2 text-sm text-[#66645E]">
                <li>
                  <a href="#triage-desk" className="editorial-link hover:text-[#141413]">
                    3-Step Legal Triage
                  </a>
                </li>
                <li>
                  <a href="#clause-decoder" className="editorial-link hover:text-[#141413]">
                    Nikahnama & FIR Decoder
                  </a>
                </li>
                <li>
                  <a href="#verified-advocates" className="editorial-link hover:text-[#141413]">
                    Verified Bar Council Advocates
                  </a>
                </li>
                <li>
                  <a href="#legal-templates" className="editorial-link hover:text-[#141413]">
                    Bilingual Legal Drafts
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <p className="font-mono-code text-xs uppercase tracking-wider text-[#141413] mb-3">
                Emergency & Statutory Helplines
              </p>
              <ul className="space-y-2 text-xs font-mono-code text-[#66645E]">
                <li>Ministry of Human Rights: 1099</li>
                <li>FIA Cyber Crime Helpdesk: 1991</li>
                <li>Women Protection Authority: 1043</li>
                <li>Constitutional Fair Trial: Art. 10-A</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[#66645E]">
            <p>
              © {new Date().getFullYear()} QanoonPK Citizen Justice Archive. Informational statutory
              guidance; formal court representation is provided exclusively through verified Bar
              Council advocates.
            </p>
            <p dir="rtl" className="font-urdu text-sm text-[#66645E]">
              سپریم کورٹ اور ہائی کورٹس کے مستند قانونی نظائر کی روشنی میں تیار کردہ عوامی پورٹل
            </p>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          MOBILE FLOATING GLASSMORPHIC BOTTOM NAVIGATION BAR (44x44px Targets)
          ===================================================================== */}
      <nav
        aria-label="Mobile Quick Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-t border-[#E5E2D9] px-2 py-1.5 flex items-center justify-around"
      >
        <a
          href="#triage-desk"
          className="min-h-[44px] min-w-[44px] px-2 flex flex-col items-center justify-center text-[11px] font-medium text-[#141413]"
        >
          <Scale className="w-4 h-4 text-[#0B5D3B] mb-0.5" />
          <span>Triage</span>
        </a>
        <a
          href="#clause-decoder"
          className="min-h-[44px] min-w-[44px] px-2 flex flex-col items-center justify-center text-[11px] font-medium text-[#66645E]"
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>Decoder</span>
        </a>
        <a
          href="#verified-advocates"
          className="min-h-[44px] min-w-[44px] px-2 flex flex-col items-center justify-center text-[11px] font-medium text-[#66645E]"
        >
          <ShieldCheck className="w-4 h-4 mb-0.5" />
          <span>Advocates</span>
        </a>
        <button
          type="button"
          onClick={() => setAiDrawerOpen(true)}
          className="min-h-[44px] min-w-[44px] px-2 flex flex-col items-center justify-center text-[11px] font-medium text-[#0B5D3B]"
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Legal AI</span>
        </button>
        <button
          type="button"
          onClick={() => setSafetyCloakActive(true)}
          className="min-h-[44px] min-w-[44px] px-2 flex flex-col items-center justify-center text-[11px] font-medium text-[#66645E]"
        >
          <EyeOff className="w-4 h-4 mb-0.5" />
          <span>Exit</span>
        </button>
      </nav>

      {/* =====================================================================
          DRAWER 1: DISTRACTION-FREE MEDIUM.COM READER DRAWER
          ===================================================================== */}
      {readerItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={readerItem.titleEn}
          className="fixed inset-0 z-50 flex justify-end bg-[#141413]/40 backdrop-blur-xs transition-opacity"
          onClick={() => setReaderItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl h-full overflow-y-auto p-6 sm:p-12 shadow-2xl border-l border-[#E5E2D9] transition-colors duration-300 ${
              readerTheme === "paper"
                ? "bg-[#FAF9F5] text-[#141413]"
                : readerTheme === "sepia"
                ? "bg-[#F4ECD8] text-[#2C241B]"
                : "bg-[#141413] text-[#FAF9F5]"
            }`}
          >
            {/* Top Reader Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-[#E5E2D9]/40">
              <div className="flex items-center gap-2">
                {/* Font Size Controls */}
                <button
                  type="button"
                  onClick={() =>
                    setReaderFontScale((s) => Math.max(0.9, Number((s - 0.1).toFixed(2))))
                  }
                  className="px-2.5 py-1.5 min-h-[40px] rounded-lg border border-[#E5E2D9]/60 text-xs font-mono-code"
                  title="Decrease Font Size"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setReaderFontScale((s) => Math.min(1.25, Number((s + 0.1).toFixed(2))))
                  }
                  className="px-2.5 py-1.5 min-h-[40px] rounded-lg border border-[#E5E2D9]/60 text-xs font-mono-code"
                  title="Increase Font Size"
                >
                  A+
                </button>

                {/* Paper / Sepia / Ink Theme Switcher */}
                <div className="inline-flex rounded-lg border border-[#E5E2D9]/60 p-0.5 text-xs">
                  {(["paper", "sepia", "ink"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setReaderTheme(t)}
                      className={`px-2.5 py-1 rounded-md capitalize ${
                        readerTheme === t ? "bg-[#0B5D3B] text-[#FAF9F5]" : "opacity-75"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReaderItem(null)}
                aria-label="Close Reader"
                className="min-h-[44px] min-w-[44px] rounded-full border border-[#E5E2D9]/60 flex items-center justify-center hover:border-[#0B5D3B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Article Header */}
            <div className="flex flex-wrap items-center gap-2.5 font-mono-code text-xs mb-4">
              <span className="text-[#0B5D3B] font-semibold">{readerItem.citation}</span>
              <span>•</span>
              <span className="opacity-70">{readerItem.categoryEn}</span>
              <span>•</span>
              <span className="opacity-70">{readerItem.readTime}</span>
            </div>

            <h2
              className="font-legal-serif text-2xl sm:text-3xl leading-snug"
              style={{ fontSize: `${1.75 * readerFontScale}rem` }}
            >
              {readerItem.titleEn}
            </h2>

            <p dir="rtl" className="mt-4 font-urdu text-2xl opacity-90">
              {readerItem.titleUr}
            </p>

            {/* Toggle: Simple Everyday Words <-> Formal Legal Statute */}
            <div className="my-8 p-1.5 rounded-xl bg-[#F2EFE9]/20 border border-[#E5E2D9]/50 inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setReaderMode("plain")}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-editorial cursor-pointer ${
                  readerMode === "plain"
                    ? "bg-[#0B5D3B] text-[#FAF9F5]"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                Simple Everyday Words
              </button>
              <button
                type="button"
                onClick={() => setReaderMode("formal")}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-editorial cursor-pointer ${
                  readerMode === "formal"
                    ? "bg-[#0B5D3B] text-[#FAF9F5]"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                Formal Legal Statute Text
              </button>
            </div>

            {/* Body Paragraphs */}
            {readerMode === "plain" ? (
              <div
                className="space-y-5 leading-[1.85] whitespace-pre-line"
                style={{ fontSize: `${1.05 * readerFontScale}rem` }}
              >
                {readerItem.plainSummaryEn}
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-[#E5E2D9]/60 font-legal-serif leading-[1.85] whitespace-pre-line">
                <p className="font-mono-code text-xs uppercase tracking-wider text-[#0B5D3B] mb-3">
                  VERBATIM GAZETTE & PRECEDENT RATIO ({readerItem.citation})
                </p>
                <p style={{ fontSize: `${1.02 * readerFontScale}rem` }}>
                  {readerItem.formalTextEn}
                </p>
              </div>
            )}

            {/* Nastaliq Urdu Summary Block */}
            <div className="mt-10 pt-8 border-t border-[#E5E2D9]/40">
              <p className="font-mono-code text-xs uppercase tracking-wider opacity-70 mb-2">
                اردو خلاصہ (Nastaliq Legal Summary)
              </p>
              <p dir="rtl" className="font-urdu text-xl leading-[2.35] whitespace-pre-line">
                {readerItem.urduSummary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          DRAWER 2: CONFIDENTIAL CONSULTATION & ESCROW SLIDE-OVER DRAWER
          ===================================================================== */}
      {bookingAdvocate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Book consultation with ${bookingAdvocate.name}`}
          className="fixed inset-0 z-50 flex justify-end bg-[#141413]/40 backdrop-blur-xs"
          onClick={() => setBookingAdvocate(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg h-full overflow-y-auto bg-[#FAF9F5] text-[#141413] p-6 sm:p-10 border-l border-[#E5E2D9] shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E5E2D9]">
                <div>
                  <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#0B5D3B] font-semibold">
                    BAR COUNCIL ESCROW DESK • STEP {bookingStep} OF 3
                  </span>
                  <h2 className="font-legal-serif text-xl text-[#141413] mt-1">
                    {bookingAdvocate.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingAdvocate(null)}
                  aria-label="Close Consultation Drawer"
                  className="min-h-[44px] min-w-[44px] rounded-full border border-[#E5E2D9] flex items-center justify-center hover:bg-[#F2EFE9] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Advocate Summary Pill */}
              <div className="p-4 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-mono-code text-[#66645E]">
                    {bookingAdvocate.bar_council_id} • {bookingAdvocate.city}
                  </p>
                  <p className="text-sm font-medium text-[#141413] mt-0.5">
                    {bookingAdvocate.specialty}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono-code text-[#66645E] block">
                    Escrow Protected
                  </span>
                  <span className="font-mono-code text-sm font-semibold text-[#0B5D3B]">
                    PKR {bookingAdvocate.fee.toLocaleString()}
                  </span>
                </div>
              </div>

              {bookingStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-mono-code text-xs uppercase text-[#66645E] mb-2">
                      1. Select Consultation Day
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {["Today", "Tomorrow", "Saturday"].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setBookingDate(day)}
                          className={`py-3 px-3 rounded-xl text-xs font-medium border transition-editorial cursor-pointer ${
                            bookingDate === day
                              ? "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                              : "bg-[#FAF9F5] text-[#141413] border-[#E5E2D9] hover:bg-[#F2EFE9]"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono-code text-xs uppercase text-[#66645E] mb-2">
                      2. Select PKT Time Slot
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        "02:00 PM PKT",
                        "04:30 PM PKT",
                        "06:00 PM PKT",
                        "08:00 PM PKT",
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingSlot(slot)}
                          className={`py-3 px-3 rounded-xl text-xs font-mono-code border transition-editorial cursor-pointer ${
                            bookingSlot === slot
                              ? "bg-[#0B5D3B] text-[#FAF9F5] border-[#0B5D3B]"
                              : "bg-[#FAF9F5] text-[#141413] border-[#E5E2D9] hover:bg-[#F2EFE9]"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="w-full py-3.5 px-6 min-h-[48px] rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-sm font-medium hover:bg-[#09482E] transition-editorial cursor-pointer"
                  >
                    Continue to Confidential Case Details →
                  </button>
                </div>
              )}

              {bookingStep === 2 && (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#141413] mb-1">
                      Full Name (or Initials for Privacy)
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="e.g., Ayesha K."
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-sm focus:outline-none focus:border-[#0B5D3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#141413] mb-1">
                      WhatsApp / Mobile Number (for Encrypted Chamber Link)
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-sm focus:outline-none focus:border-[#0B5D3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#141413] mb-1">
                      Brief Case Summary (Protected by Attorney-Client Privilege, Qanun-e-Shahadat
                      Art. 9)
                    </label>
                    <textarea
                      rows={3}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Briefly describe your legal issue or document question..."
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-sm focus:outline-none focus:border-[#0B5D3B]"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] text-xs text-[#66645E] flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-[#0B5D3B] shrink-0 mt-0.5" />
                    <span>
                      Your consultation fee is held in QanoonPK Bar Escrow and is only released
                      after your scheduled session with {bookingAdvocate.name} is completed.
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setBookingStep(1)}
                      className="px-4 py-3 min-h-[48px] rounded-xl border border-[#E5E2D9] text-xs font-medium text-[#66645E] hover:text-[#141413]"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={bookingSubmitting}
                      className="flex-1 py-3.5 px-5 min-h-[48px] rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-sm font-medium hover:bg-[#09482E] transition-editorial cursor-pointer disabled:opacity-50"
                    >
                      {bookingSubmitting
                        ? "Securing Escrow Slot..."
                        : `Confirm Slot (${bookingDate}, ${bookingSlot})`}
                    </button>
                  </div>
                </form>
              )}

              {bookingStep === 3 && (
                <div className="p-6 rounded-2xl bg-[#F2EFE9] border border-[#E5E2D9] space-y-4">
                  <div className="w-11 h-11 rounded-full bg-[#0B5D3B] text-[#FAF9F5] flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="font-legal-serif text-2xl text-[#141413]">
                    Consultation Reserved in Escrow
                  </h3>
                  <p className="text-sm text-[#66645E] leading-relaxed">
                    Your confidential consultation with <strong>{bookingAdvocate.name}</strong> is
                    scheduled for <strong>{bookingDate}</strong> at <strong>{bookingSlot}</strong>.
                  </p>
                  <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] font-mono-code text-xs space-y-1">
                    <div>ESCROW REF: {bookingReference}</div>
                    <div>BAR VERIFICATION: {bookingAdvocate.bar_council_id}</div>
                    <div>PRIVILEGE: QANUN-E-SHAHADAT ART. 9</div>
                  </div>
                  <p dir="rtl" className="font-urdu text-lg text-[#141413]">
                    آپ کی قانونی مشاورت محفوظ کر لی گئی ہے۔ چیمبر لنک آپ کے نمبر پر بھیج دیا جائے
                    گا۔
                  </p>
                  <button
                    type="button"
                    onClick={() => setBookingAdvocate(null)}
                    className="w-full py-3 px-4 min-h-[44px] rounded-xl bg-[#141413] text-[#FAF9F5] text-xs font-medium cursor-pointer"
                  >
                    Done & Return to Desk
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] font-mono-code text-[#66645E] pt-6 border-t border-[#E5E2D9]">
              Zero-Leakage Confidentiality • End-to-End Encrypted Chamber Dossier
            </p>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: ADVOCATE CREDENTIAL DOSSIER MODAL
          ===================================================================== */}
      {dossierAdvocate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${dossierAdvocate.name} Credential Dossier`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/40 backdrop-blur-xs"
          onClick={() => setDossierAdvocate(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] p-7 sm:p-9 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 pb-5 mb-5 border-b border-[#E5E2D9]">
              <div>
                <span className="font-mono-code text-xs text-[#0B5D3B] font-semibold">
                  VERIFIED BAR COUNCIL DOSSIER • {dossierAdvocate.bar_council_id}
                </span>
                <h3 className="font-legal-serif text-2xl text-[#141413] mt-1">
                  {dossierAdvocate.name}
                </h3>
                <p dir="rtl" className="font-urdu text-xl text-[#66645E]">
                  {dossierAdvocate.name_urdu}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDossierAdvocate(null)}
                aria-label="Close Advocate Dossier"
                className="min-h-[44px] min-w-[44px] rounded-full border border-[#E5E2D9] flex items-center justify-center hover:bg-[#F2EFE9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#141413] leading-relaxed">{dossierAdvocate.bio}</p>
            <p dir="rtl" className="mt-3 font-urdu text-lg text-[#66645E]">
              {dossierAdvocate.bio_urdu}
            </p>

            <div className="mt-6">
              <p className="font-mono-code text-xs uppercase text-[#66645E] mb-2.5">
                Notable Reported Judgments & Standing
              </p>
              <ul className="space-y-2">
                {dossierAdvocate.notable_precedents.map((prec: string, i: number) => (
                  <li
                    key={i}
                    className="px-3.5 py-2 rounded-lg bg-[#F2EFE9] border border-[#E5E2D9] font-mono-code text-xs text-[#141413]"
                  >
                    {prec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 pt-5 border-t border-[#E5E2D9] flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#66645E] block">Court Standing</span>
                <span className="font-mono-code text-xs font-semibold text-[#141413]">
                  {dossierAdvocate.court} ({dossierAdvocate.experience_years} Yrs)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const adv = dossierAdvocate;
                  setDossierAdvocate(null);
                  setBookingAdvocate(adv);
                  setBookingStep(1);
                  setBookingReference(null);
                }}
                className="px-5 py-3 min-h-[44px] rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-xs sm:text-sm font-medium hover:bg-[#09482E] transition-editorial cursor-pointer"
              >
                Book Escrow Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: WATERMARKED BILINGUAL CONTRACT TEMPLATE PREVIEW MODAL
          ===================================================================== */}
      {previewTemplate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={previewTemplate.titleEn}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/40 backdrop-blur-xs"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] p-7 sm:p-10 shadow-2xl"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 mb-6 border-b border-[#E5E2D9]">
              <div>
                <span className="font-mono-code text-xs text-[#0B5D3B] font-semibold">
                  {previewTemplate.statuteBadge} • STAMP PAPER: {previewTemplate.stampPaperValue}
                </span>
                <h3 className="font-legal-serif text-2xl text-[#141413] mt-1">
                  {previewTemplate.titleEn}
                </h3>
                <p dir="rtl" className="font-urdu text-xl text-[#66645E]">
                  {previewTemplate.titleUr}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg border border-[#E5E2D9] bg-[#F2EFE9] p-0.5 text-xs">
                  {(["bilingual", "en", "ur"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTemplateLangMode(mode)}
                      className={`px-2.5 py-1 rounded-md uppercase font-mono-code text-[11px] ${
                        templateLangMode === mode
                          ? "bg-[#FAF9F5] text-[#141413]"
                          : "text-[#66645E]"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  aria-label="Close Template Preview"
                  className="min-h-[44px] min-w-[44px] rounded-full border border-[#E5E2D9] flex items-center justify-center hover:bg-[#F2EFE9] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {(templateLangMode === "bilingual" || templateLangMode === "en") && (
                <div className="p-6 rounded-xl bg-[#F2EFE9]/60 border border-[#E5E2D9]">
                  <p className="font-mono-code text-[11px] uppercase tracking-wider text-[#66645E] mb-3">
                    ENGLISH COURT INSTRUMENT DRAFT
                  </p>
                  <pre className="font-mono-code text-xs sm:text-sm text-[#141413] whitespace-pre-wrap leading-relaxed">
                    {previewTemplate.englishDraft}
                  </pre>
                </div>
              )}

              {(templateLangMode === "bilingual" || templateLangMode === "ur") && (
                <div className="p-6 rounded-xl bg-[#F2EFE9]/60 border border-[#E5E2D9]">
                  <p className="font-mono-code text-[11px] uppercase tracking-wider text-[#66645E] mb-3">
                    اردو قانونی مسودہ (NASTALIQ COURT FORMAT)
                  </p>
                  <p
                    dir="rtl"
                    className="font-urdu text-lg sm:text-xl text-[#141413] whitespace-pre-line"
                  >
                    {previewTemplate.urduDraft}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-7 pt-5 border-t border-[#E5E2D9] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleCopyTemplate(previewTemplate)}
                className="px-4 py-2.5 min-h-[44px] rounded-xl border border-[#E5E2D9] bg-[#F2EFE9] text-xs font-medium text-[#141413] inline-flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>
                  {copiedTemplateId === previewTemplate.id
                    ? "Copied Bilingual Text"
                    : "Copy Text to Clipboard"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadTemplate(previewTemplate)}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-xs font-medium inline-flex items-center gap-2 hover:bg-[#09482E] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Court Draft (.TXT)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          DRAWER 5: SLIDE-OVER "ASK QANOONPK AI ASSISTANT" (WITH SEARCH GROUNDING)
          ===================================================================== */}
      {aiDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ask QanoonPK Legal AI Assistant"
          className="fixed inset-0 z-50 flex justify-end bg-[#141413]/40 backdrop-blur-xs"
          onClick={() => setAiDrawerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl h-full bg-[#FAF9F5] text-[#141413] border-l border-[#E5E2D9] shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E5E2D9] flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0B5D3B]" />
                  <span className="font-mono-code text-xs uppercase tracking-wider text-[#0B5D3B] font-semibold">
                    QANOONPK STATUTORY RESEARCH DESK
                  </span>
                </div>
                <h2 className="font-legal-serif text-xl text-[#141413] mt-1">
                  Bilingual Legal AI Assistant
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setAiDrawerOpen(false)}
                aria-label="Close AI Assistant"
                className="min-h-[44px] min-w-[44px] rounded-full border border-[#E5E2D9] flex items-center justify-center hover:bg-[#F2EFE9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Real-Time Google Search Grounding Toggle Bar */}
            <div className="px-6 py-3 bg-[#F2EFE9] border-b border-[#E5E2D9] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0B5D3B]" />
                <div>
                  <span className="text-xs font-medium text-[#141413] block">
                    Live Pakistani Gazette & SC Search Grounding
                  </span>
                  <span className="font-mono-code text-[10px] text-[#66645E]">
                    Verifies answers against current Supreme Court & legislative records
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={aiSearchGrounding}
                onClick={() => setAiSearchGrounding((prev) => !prev)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  aiSearchGrounding ? "bg-[#0B5D3B]" : "bg-[#66645E]/40"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-[#FAF9F5] transition-transform ${
                    aiSearchGrounding ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-5 border ${
                    msg.role === "user"
                      ? "bg-[#F2EFE9] border-[#E5E2D9] ml-8"
                      : "bg-[#FAF9F5] border-[#E5E2D9] mr-4"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono-code text-[#66645E] mb-2">
                    <span>{msg.role === "user" ? "CITIZEN INQUIRY" : "QANOONPK STATUTE DESK"}</span>
                    {msg.grounded && (
                      <span className="text-[#0B5D3B]">● Search Grounded</span>
                    )}
                  </div>
                  <p className="text-sm text-[#141413] whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </p>
                  {msg.textUrdu && (
                    <p
                      dir="rtl"
                      className="mt-3 pt-3 border-t border-[#E5E2D9] font-urdu text-base text-[#141413]/90"
                    >
                      {msg.textUrdu}
                    </p>
                  )}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E5E2D9] flex flex-wrap gap-1.5">
                      {msg.citations.map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-[#F2EFE9] font-mono-code text-[10px] text-[#141413]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {aiLoading && (
                <div className="p-5 rounded-2xl border border-[#E5E2D9] bg-[#FAF9F5] font-mono-code text-xs text-[#66645E]">
                  Consulting Pakistan Code & Supreme Court PLD Precedents...
                </div>
              )}
            </div>

            {/* Prompt Suggestions + Input Box */}
            <div className="p-5 border-t border-[#E5E2D9] bg-[#FAF9F5]">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
                {[
                  "How does Clause 18 right to divorce work?",
                  "Police refused my FIR—how to file Sec 22-A?",
                  "Sister denied agricultural land inheritance",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendAiQuery(prompt)}
                    className="px-3 py-1.5 rounded-lg bg-[#F2EFE9] border border-[#E5E2D9] text-xs text-[#141413] hover:border-[#0B5D3B] shrink-0 cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiQuery();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask in English, Roman Urdu, or اردو..."
                  className="flex-1 px-4 py-3 min-h-[46px] rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] text-sm text-[#141413] focus:outline-none focus:border-[#0B5D3B]"
                />
                <button
                  type="submit"
                  disabled={aiLoading}
                  aria-label="Send Legal Question"
                  className="px-4 py-3 min-h-[46px] rounded-xl bg-[#0B5D3B] text-[#FAF9F5] hover:bg-[#09482E] transition-editorial cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 6: QUICK STATUTE & ADVOCATE SEARCH MODAL (⌘K)
          ===================================================================== */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick Search Statutes, Clauses, and Advocates"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-[#141413]/40 backdrop-blur-xs"
          onClick={() => setSearchOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-[#E5E2D9]">
              <Search className="w-4 h-4 text-[#0B5D3B]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PLD 2025 SC 112, Nikahnama Clause 18, Khula, 489-F, Lahore Advocates..."
                className="flex-1 bg-transparent text-sm text-[#141413] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="px-2.5 py-1 rounded border border-[#E5E2D9] font-mono-code text-[11px] text-[#66645E]"
              >
                ESC
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto divide-y divide-[#E5E2D9]">
              {searchQuery.trim() === "" ? (
                <div className="py-6 text-center text-xs text-[#66645E]">
                  Type any statute section, document clause, or city to jump directly.
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#66645E]">
                  No direct archive match—click below to ask the QanoonPK AI Research Desk.
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        const q = searchQuery;
                        setSearchOpen(false);
                        setAiDrawerOpen(true);
                        handleSendAiQuery(q);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#0B5D3B] text-[#FAF9F5] text-xs font-medium"
                    >
                      Research “{searchQuery}” with Legal AI →
                    </button>
                  </div>
                </div>
              ) : (
                searchResults.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={res.action}
                    className="w-full text-left py-3.5 px-2 hover:bg-[#F2EFE9] rounded-lg transition-editorial flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <span className="font-mono-code text-[10px] uppercase text-[#0B5D3B] block">
                        {res.category} • {res.citation}
                      </span>
                      <span className="font-legal-serif text-sm text-[#141413] block mt-0.5">
                        {res.title}
                      </span>
                    </div>
                    <span dir="rtl" className="font-urdu text-base text-[#66645E] shrink-0">
                      {res.titleUrdu}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}