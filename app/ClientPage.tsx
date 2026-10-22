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
  Briefcase,
  Landmark,
  Newspaper,
  Calculator,
  Compass,
} from "lucide-react";
import { createClient } from "@/app/supabase";
import Architectural3DBanner from "@/app/components/Architectural3DBanner";
import FutureTrendsStudio, { type VisualThemeMode } from "@/app/components/FutureTrendsStudio";
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
import {
  CONSTITUTION_ARTICLES,
  PAKISTAN_LAWS_ARCHIVE,
  PAKISTAN_PENAL_CODE_SECTIONS,
  ALL_COURTS_JUDGMENTS,
  LEGAL_CAREER_OPENINGS,
  LEGAL_AID_NEWS_DISPATCHES,
  PLATFORM_MASTER_DIRECTORY,
  CITIZEN_FORUM_THREADS,
  type CodexSectionItem,
  type CourtJudgmentItem,
  type LegalCareerOpening,
  type LegalAidNewsItem,
  type CitizenForumThread,
} from "@/app/qanoonHomeExtensions";

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
  // Language, Theme Personalization & Safety Cloak State
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [safetyCloakActive, setSafetyCloakActive] = useState(false);
  const [themeMode, setThemeMode] = useState<VisualThemeMode>("paper");
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Scroll Progress Bar (0 to 1)
  const [scrollProgress, setScrollProgress] = useState(0);

  // Supreme Court Precedent Ribbon State
  const [ribbonIndex, setRibbonIndex] = useState(0);
  const [ribbonPaused, setRibbonPaused] = useState(false);

  // Hero Conversational Mad-Libs Triage State
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

  // Pillar 1A: Sovereign Codex Explorer State (Constitution, Laws of Pakistan, PPC & CrPC)
  const [activeCodexTab, setActiveCodexTab] = useState<"constitution" | "laws" | "ppc">(
    "constitution"
  );
  const [codexSearchQuery, setCodexSearchQuery] = useState<string>("");

  // Pillar 1B: All Judgments Issued by All Courts of Pakistan State
  const [selectedCourtFilter, setSelectedCourtFilter] = useState<
    "ALL" | CourtJudgmentItem["courtKey"]
  >("ALL");

  // Auto-Rotating Editorial & Precedent Spotlight State
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [spotlightPaused, setSpotlightPaused] = useState(false);
  const [audioPlayingId, setAudioPlayingId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(28);

  // Interactive Clause Decoder State
  const [activeDecoderKey, setActiveDecoderKey] =
    useState<ClauseDocumentGroup["key"]>("nikahnama");
  const [activeClauseId, setActiveClauseId] = useState<string>(
    CLAUSE_DECODER_GROUPS[0]?.clauses[0]?.id || "nikah-18"
  );
  const [hoveredClauseId, setHoveredClauseId] = useState<string | null>(null);

  // Pillar 2: Finding Lawyers & Getting Hired in Pakistan State
  const [advocates, setAdvocates] = useState<VerifiedAdvocate[]>(VERIFIED_ADVOCATES);
  const [advocateCityFilter, setAdvocateCityFilter] = useState<string>("All Pakistan");
  const advocateSliderRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  // Getting Hired / Legal Careers State
  const [careerFilterCity, setCareerFilterCity] = useState<string>("All Cities");
  const [applyingRole, setApplyingRole] = useState<LegalCareerOpening | null>(null);
  const [applicantName, setApplicantName] = useState<string>("");
  const [applicantBarId, setApplicantBarId] = useState<string>("");
  const [applicantPhone, setApplicantPhone] = useState<string>("");
  const [applicantExperience, setApplicantExperience] = useState<string>("3–5 Years");
  const [applicantStatement, setApplicantStatement] = useState<string>("");
  const [applicationSubmittedRef, setApplicationSubmittedRef] = useState<string | null>(null);

  // Pillar 3: Legal Aid News & Pro-Bono Eligibility State
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string>("All Dispatches");
  const [proBonoIncomeBracket, setProBonoIncomeBracket] = useState<"under_50k" | "50k_to_80k" | "above_80k">("under_50k");
  const [proBonoApplicantCategory, setProBonoApplicantCategory] = useState<string>("Deserving Woman (Family / Khula / Inheritance)");

  // Pillar 4: Islamic Inheritance (Wirasat) Share Calculator State
  const [estateValuePkr, setEstateValuePkr] = useState<number>(24000000);
  const [deceasedGender, setDeceasedGender] = useState<"male" | "female">("male");
  const [hasSpouse, setHasSpouse] = useState<boolean>(true);
  const [sonsCount, setSonsCount] = useState<number>(1);
  const [daughtersCount, setDaughtersCount] = useState<number>(2);
  const [hasFather, setHasFather] = useState<boolean>(false);
  const [hasMother, setHasMother] = useState<boolean>(true);

  // Pillar 5: Citizen Legal Q&A Forum & Chamber Preview State
  const [forumThreads, setForumThreads] = useState<CitizenForumThread[]>(CITIZEN_FORUM_THREADS);
  const [upvotedForumIds, setUpvotedForumIds] = useState<Record<string, boolean>>({});
  const [newForumQuestion, setNewForumQuestion] = useState<string>("");
  const [newForumCategory, setNewForumCategory] =
    useState<CitizenForumThread["category"]>("Family & Khula");
  const [forumPostedSuccess, setForumPostedSuccess] = useState<boolean>(false);
  const [activeChamberTab, setActiveChamberTab] = useState<"milestones" | "chat" | "escrow">("milestones");

  // Plain-Law Index & Swipeable Templates State
  const [hoveredLawId, setHoveredLawId] = useState<string | null>(null);
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([
    PLAIN_LAW_INDEX[0]?.id || "briefing-khula-mehr",
  ]);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState<number>(0);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // Master Directory Tab
  const [directoryTab, setDirectoryTab] = useState<
    "All" | "Citizen Justice" | "Client Workspace" | "Advocate & Bar CRM"
  >("All");

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
      text: "Welcome to the QanoonPK Statutory Research Desk. Ask any question regarding the Constitution of Pakistan, Pakistan Penal Code, family law, inheritance (Wirasat), FIR & bail procedure, or court judgments.",
      textUrdu:
        "قانون پاکستان کے تحقیقی ڈیسک میں خوش آمدید۔ آئینِ پاکستان، تعزیراتِ پاکستان، عائلی قوانین، وراثت، ایف آئی آر و ضمانت یا عدالتی فیصلوں سے متعلق کوئی بھی قانونی سوال پوچھیں۔",
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
        setApplyingRole(null);
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

  // Hydrate verified advocates from Supabase if live rows exist
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

  // Filtered Codex items
  const activeCodexList = useMemo(() => {
    const base =
      activeCodexTab === "constitution"
        ? CONSTITUTION_ARTICLES
        : activeCodexTab === "laws"
        ? PAKISTAN_LAWS_ARCHIVE
        : PAKISTAN_PENAL_CODE_SECTIONS;
    const q = codexSearchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.plainSummaryEn.toLowerCase().includes(q) ||
        item.titleUr.includes(q)
    );
  }, [activeCodexTab, codexSearchQuery]);

  // Filtered Court Judgments
  const filteredJudgments = useMemo(() => {
    if (selectedCourtFilter === "ALL") return ALL_COURTS_JUDGMENTS;
    return ALL_COURTS_JUDGMENTS.filter((j) => j.courtKey === selectedCourtFilter);
  }, [selectedCourtFilter]);

  // Filtered Advocates
  const filteredAdvocates = useMemo(() => {
    if (advocateCityFilter === "All Pakistan") return advocates;
    return advocates.filter(
      (adv) => adv.city.toLowerCase() === advocateCityFilter.toLowerCase()
    );
  }, [advocates, advocateCityFilter]);

  // Filtered Legal Career Openings
  const filteredCareers = useMemo(() => {
    if (careerFilterCity === "All Cities") return LEGAL_CAREER_OPENINGS;
    return LEGAL_CAREER_OPENINGS.filter(
      (job) => job.city.toLowerCase() === careerFilterCity.toLowerCase()
    );
  }, [careerFilterCity]);

  // Filtered Legal Aid News
  const filteredNews = useMemo(() => {
    if (newsCategoryFilter === "All Dispatches") return LEGAL_AID_NEWS_DISPATCHES;
    return LEGAL_AID_NEWS_DISPATCHES.filter((n) => n.category === newsCategoryFilter);
  }, [newsCategoryFilter]);

  // Filtered Master Directory
  const filteredDirectory = useMemo(() => {
    if (directoryTab === "All") return PLATFORM_MASTER_DIRECTORY;
    return PLATFORM_MASTER_DIRECTORY.filter((item) => item.group === directoryTab);
  }, [directoryTab]);

  // Islamic Inheritance (Wirasat) Share Calculation Engine (Hanafi / Muslim Family Laws)
  const wirasatDistribution = useMemo(() => {
    const total = Math.max(0, estateValuePkr);
    const hasChildren = sonsCount > 0 || daughtersCount > 0;
    const shares: Array<{
      heirEn: string;
      heirUr: string;
      fractionLabel: string;
      percentage: number;
      amountPkr: number;
    }> = [];

    let fixedFractionTotal = 0;
    let spouseShare = 0;
    let fatherShare = 0;
    let motherShare = 0;

    if (hasSpouse) {
      if (deceasedGender === "male") {
        // Wife gets 1/8 if children exist, else 1/4
        spouseShare = hasChildren ? 1 / 8 : 1 / 4;
        shares.push({
          heirEn: "Widow (Wife)",
          heirUr: "بیوہ (اہلیہ)",
          fractionLabel: hasChildren ? "1/8 (12.5%)" : "1/4 (25%)",
          percentage: spouseShare * 100,
          amountPkr: Math.round(total * spouseShare),
        });
      } else {
        // Husband gets 1/4 if children exist, else 1/2
        spouseShare = hasChildren ? 1 / 4 : 1 / 2;
        shares.push({
          heirEn: "Surviving Husband",
          heirUr: "شوہر",
          fractionLabel: hasChildren ? "1/4 (25%)" : "1/2 (50%)",
          percentage: spouseShare * 100,
          amountPkr: Math.round(total * spouseShare),
        });
      }
      fixedFractionTotal += spouseShare;
    }

    if (hasMother) {
      motherShare = hasChildren ? 1 / 6 : 1 / 3;
      fixedFractionTotal += motherShare;
      shares.push({
        heirEn: "Mother (Walida)",
        heirUr: "والدہ",
        fractionLabel: hasChildren ? "1/6 (16.67%)" : "1/3 (33.33%)",
        percentage: motherShare * 100,
        amountPkr: Math.round(total * motherShare),
      });
    }

    if (hasFather) {
      fatherShare = 1 / 6;
      fixedFractionTotal += fatherShare;
      shares.push({
        heirEn: "Father (Walid)",
        heirUr: "والد",
        fractionLabel: hasChildren ? "1/6 (16.67%)" : "1/6 + Residuary",
        percentage: fatherShare * 100,
        amountPkr: Math.round(total * fatherShare),
      });
    }

    const residue = Math.max(0, 1 - fixedFractionTotal);
    const totalChildUnits = sonsCount * 2 + daughtersCount * 1;

    if (totalChildUnits > 0) {
      if (sonsCount > 0) {
        const eachSonShare = (residue * 2) / totalChildUnits;
        shares.push({
          heirEn: `Sons (${sonsCount}) — ${sonsCount > 1 ? "Each Son" : "Single Son"}`,
          heirUr: `بیٹے (${sonsCount}) — فی بیٹا حصہ`,
          fractionLabel: `Residuary (2:1 Ratio)`,
          percentage: eachSonShare * 100,
          amountPkr: Math.round(total * eachSonShare),
        });
      }
      if (daughtersCount > 0) {
        const eachDaughterShare =
          sonsCount > 0
            ? (residue * 1) / totalChildUnits
            : Math.min(residue, daughtersCount === 1 ? 0.5 : 2 / 3) / daughtersCount;
        shares.push({
          heirEn: `Daughters (${daughtersCount}) — ${
            daughtersCount > 1 ? "Each Daughter" : "Single Daughter"
          }`,
          heirUr: `بیٹیاں (${daughtersCount}) — فی بیٹی حصہ`,
          fractionLabel: sonsCount > 0 ? "Residuary (2:1 Ratio)" : daughtersCount === 1 ? "1/2 Fixed" : "2/3 Shared",
          percentage: eachDaughterShare * 100,
          amountPkr: Math.round(total * eachDaughterShare),
        });
      }
    }

    return shares;
  }, [estateValuePkr, deceasedGender, hasSpouse, sonsCount, daughtersCount, hasFather, hasMother]);

  const currentTemplate = LEGAL_TEMPLATES[activeTemplateIndex] || LEGAL_TEMPLATES[0];

  // Open any Codex item or Court Judgment or News item in the Distraction-Free Medium Reader Drawer
  const openCodexInReader = (item: CodexSectionItem) => {
    setReaderMode("plain");
    setReaderItem({
      id: item.id,
      citation: item.code,
      categoryEn: item.partOrChapter,
      categoryUr: "مجموعہ قوانینِ پاکستان",
      readTime: "4 min read",
      audioDuration: "01:45",
      titleEn: `${item.code} — ${item.titleEn}`,
      titleUr: item.titleUr,
      subtitleEn: item.practicalRemedyEn,
      plainSummaryEn: `${item.plainSummaryEn}\n\nPRACTICAL CITIZEN REMEDY:\n${item.practicalRemedyEn}`,
      formalTextEn: item.verbatimTextEn,
      urduSummary: `${item.plainSummaryUr}\n\nعملی قانونی چارہ جوئی:\n${item.practicalRemedyUr}`,
      author: "QanoonPK Statutory Archive",
    });
  };

  const openJudgmentInReader = (j: CourtJudgmentItem) => {
    setReaderMode("plain");
    setReaderItem({
      id: j.id,
      citation: j.citation,
      categoryEn: `${j.courtNameEn} · ${j.benchEn}`,
      categoryUr: j.courtNameUr,
      readTime: j.dateDecided,
      audioDuration: "02:10",
      titleEn: j.headlineEn,
      titleUr: j.headlineUr,
      subtitleEn: j.subjectEn,
      plainSummaryEn: `RATIO DECIDENDI (BINDING LEGAL PRINCIPLE):\n\n${j.ratioDecidendiEn}`,
      formalTextEn: j.fullOrderExcerptEn,
      urduSummary: j.ratioDecidendiUr,
      author: j.courtNameEn,
    });
  };

  const openNewsInReader = (n: LegalAidNewsItem) => {
    setReaderMode("plain");
    setReaderItem({
      id: n.id,
      citation: n.sourceAuthority,
      categoryEn: n.category,
      categoryUr: n.categoryUr,
      readTime: n.readTime,
      audioDuration: "01:50",
      titleEn: n.headlineEn,
      titleUr: n.headlineUr,
      subtitleEn: n.deckEn,
      plainSummaryEn: `${n.deckEn}\n\n${n.fullReportEn}`,
      formalTextEn: `OFFICIAL GAZETTE / JUDICIAL CIRCULAR AUTHORITY: ${n.sourceAuthority}\nPublished: ${n.publishedDate}\n\n${n.fullReportEn}`,
      urduSummary: `${n.deckUr}\n\n${n.fullReportUr}`,
      author: n.sourceAuthority,
    });
  };

  // Search filter across all statutes, judgments, clauses, advocates, and news
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

    [...CONSTITUTION_ARTICLES, ...PAKISTAN_LAWS_ARCHIVE, ...PAKISTAN_PENAL_CODE_SECTIONS].forEach(
      (item) => {
        if (
          item.code.toLowerCase().includes(q) ||
          item.titleEn.toLowerCase().includes(q) ||
          item.plainSummaryEn.toLowerCase().includes(q) ||
          item.titleUr.includes(q)
        ) {
          results.push({
            id: item.id,
            category: "Constitution & Laws Codex",
            title: `${item.code}: ${item.titleEn}`,
            titleUrdu: item.titleUr,
            citation: item.partOrChapter,
            action: () => {
              openCodexInReader(item);
              setSearchOpen(false);
            },
          });
        }
      }
    );

    ALL_COURTS_JUDGMENTS.forEach((j) => {
      if (
        j.citation.toLowerCase().includes(q) ||
        j.headlineEn.toLowerCase().includes(q) ||
        j.courtNameEn.toLowerCase().includes(q) ||
        j.subjectEn.toLowerCase().includes(q)
      ) {
        results.push({
          id: j.id,
          category: j.courtNameEn,
          title: j.headlineEn,
          titleUrdu: j.headlineUr,
          citation: j.citation,
          action: () => {
            openJudgmentInReader(j);
            setSearchOpen(false);
          },
        });
      }
    });

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

    return results.slice(0, 10);
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

  // Submit Legal Career / Empanelment Application
  const handleCareerApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `BAR-EMP-${Math.floor(10000 + Math.random() * 90000)}`;
    setApplicationSubmittedRef(ref);
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

  // Quick Exit Safety Cloak View
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
    <div
      data-theme={themeMode}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      className="min-h-screen bg-[#FAF9F5] text-[#141413] font-ui-sans selection:bg-[#0B5D3B]/15 selection:text-[#0B5D3B] pb-24 md:pb-0 transition-editorial"
    >
      {/* 2px Surgical Emerald Reading Progress Bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#0B5D3B] z-50 origin-left transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* =====================================================================
          SECTION 1: NEW YORK TIMES CENTERED EDITORIAL MASTHEAD & DOUBLE-RULE NAV
          ===================================================================== */}
      <header className="bg-[#FAF9F5] transition-editorial">
        <div className="w-[96%] max-w-[1840px] mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-5">
          {/* Top Utility Whisper Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E2D9] text-xs">
            {/* Left Wing: Edition & Search Archive (⌘K) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 min-h-[36px] rounded-md border border-[#E5E2D9] bg-[#F2EFE9]/70 hover:bg-[#F2EFE9] hover:border-[#141413] text-xs text-[#141413] transition-editorial cursor-pointer whitespace-nowrap shrink-0"
                title="Search Statutes, Judgments & Advocates (⌘K)"
              >
                <Search className="w-3.5 h-3.5 text-[#0B5D3B]" />
                <span className="font-medium">
                  {lang === "ur" ? "قانونی تلاش" : "Search Archive"}
                </span>
                <span className="font-mono-code text-[10px] text-[#66645E]">⌘K</span>
              </button>

              <span className="hidden md:inline-block text-[#E5E2D9]" aria-hidden="true">
                |
              </span>

              <span className="hidden md:inline-block font-mono-code text-[11px] text-[#66645E]">
                PAKISTAN CODE · PLD · SCMR · SHARIAT ARCHIVE
              </span>
            </div>

            {/* Right Wing: Language Switcher, Quick Exit Cloak & Ask Legal AI */}
            <div className="flex items-center gap-2.5">
              <div
                role="group"
                aria-label="Language Switcher"
                className="inline-flex items-center rounded-md border border-[#E5E2D9] bg-[#F2EFE9]/70 p-0.5"
              >
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-editorial cursor-pointer ${
                    lang === "en"
                      ? "bg-[#141413] text-[#FAF9F5]"
                      : "text-[#66645E] hover:text-[#141413]"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang("ur")}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-editorial cursor-pointer ${
                    lang === "ur"
                      ? "bg-[#141413] text-[#FAF9F5]"
                      : "text-[#66645E] hover:text-[#141413]"
                  }`}
                >
                  اردو
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  setThemeMode((prev) =>
                    prev === "paper" ? "dark" : prev === "dark" ? "brutalist" : "paper"
                  )
                }
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-md border border-[#E5E2D9] bg-[#F2EFE9]/70 text-[11px] font-mono-code text-[#141413] hover:border-[#141413] transition-editorial cursor-pointer whitespace-nowrap shrink-0"
                title="Cycle Theme: Alabaster Paper / OLED Dark Mode / Neo-Brutalist Contrast"
              >
                <span>
                  {themeMode === "paper"
                    ? "☾ Dark Mode"
                    : themeMode === "dark"
                    ? "◐ Contrast"
                    : "☀ Paper"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSafetyCloakActive(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-md border border-[#E5E2D9] bg-[#FAF9F5] text-[11px] text-[#66645E] hover:text-[#141413] hover:border-[#141413] transition-editorial cursor-pointer whitespace-nowrap shrink-0"
                title="Instant Privacy Screen Cloak"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Quick Exit</span>
              </button>

              <button
                type="button"
                onClick={() => setAiDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 min-h-[36px] rounded-md bg-[#0B5D3B] text-[#FAF9F5] text-xs font-medium hover:bg-[#09482E] transition-editorial cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === "ur" ? "قانونی اے آئی" : "Ask Legal AI"}</span>
              </button>
            </div>
          </div>

          {/* Centerpiece New York Times Masthead Block */}
          <div className="pt-7 pb-5 flex flex-col items-center text-center">
            {/* Above-Logo Epigraph Tagline */}
            <div className="flex flex-col items-center text-center font-mono-code text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#66645E] leading-relaxed">
              <span>EST. UNDER ARTICLE 10-A &amp; 199</span>
              <span
                className="text-[#0B5D3B] text-xs my-1 leading-none select-none"
                aria-hidden="true"
              >
                ✦
              </span>
              <span>SOVEREIGN CITIZEN JUSTICE RECORD</span>
            </div>

            {/* Centered Bilingual Monumental Logo */}
            <Link
              href="/"
              className="group mt-3 flex flex-col items-center text-center focus:outline-none"
            >
              <span
                className="font-legal-serif font-bold tracking-[-0.03em] text-[#141413] group-hover:text-[#0B5D3B] transition-editorial leading-[1.04]"
                style={{ fontSize: "clamp(2.75rem, 6vw, 4.35rem)" }}
              >
                QanoonPK
              </span>
              <span
                dir="rtl"
                className="font-urdu text-2xl sm:text-3xl md:text-[34px] text-[#0B5D3B] mt-1"
              >
                قانون پاکستان
              </span>
            </Link>

            {/* Bottom Logo Tagline */}
            <p className="mt-4 max-w-2xl mx-auto font-legal-serif italic text-xs sm:text-sm md:text-[15px] text-[#66645E] leading-relaxed">
              “Plain-Language Pakistani Statutes, Constitutional Remedies &amp; Verified Bar Counsel — Without the Jargon.”
            </p>
          </div>
        </div>
      </header>

      {/* Sticky New York Times Double-Rule Architectural Menu Bar */}
      <div className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-t-2 border-t-[#141413] border-b border-b-[#E5E2D9] transition-editorial">
        {/* Classic NYT 1px Inner Hairline */}
        <div className="border-t border-[#E5E2D9] mt-[2px]">
          <div className="w-[96%] max-w-[1840px] mx-auto px-3 sm:px-6 lg:px-8">
            <nav
              aria-label="Primary Editorial Navigation"
              className="flex items-center justify-start md:justify-center gap-5 sm:gap-7 py-3 overflow-x-auto no-scrollbar text-xs sm:text-[13px] font-medium text-[#141413]"
            >
              <a
                href="#triage-desk"
                className="editorial-link text-[#141413]/85 hover:text-[#141413] whitespace-nowrap shrink-0"
              >
                {lang === "ur" ? "فوری قانونی رہنمائی" : "Triage Desk"}
              </a>
              <span className="text-[#E5E2D9] select-none" aria-hidden="true">
                ·
              </span>
              <a
                href="#sovereign-codex"
                className="editorial-link text-[#141413]/85 hover:text-[#141413] whitespace-nowrap shrink-0"
              >
                {lang === "ur" ? "آئین و تعزیراتِ پاکستان" : "Constitution & PPC"}
              </a>
              <span className="text-[#E5E2D9] select-none" aria-hidden="true">
                ·
              </span>
              <a
                href="#court-judgments"
                className="editorial-link text-[#141413]/85 hover:text-[#141413] whitespace-nowrap shrink-0"
              >
                {lang === "ur" ? "عدالتی فیصلے" : "All Courts Judgments"}
              </a>
              <span className="text-[#E5E2D9] select-none" aria-hidden="true">
                ·
              </span>
              <a
                href="#verified-advocates"
                className="editorial-link text-[#141413]/85 hover:text-[#141413] whitespace-nowrap shrink-0"
              >
                {lang === "ur" ? "تصدیق شدہ وکلاء" : "Find Lawyers"}
              </a>
              <span className="text-[#E5E2D9] select-none" aria-hidden="true">
                ·
              </span>
              <a
                href="#get-hired"
                className="editorial-link text-[#141413]/85 hover:text-[#141413] whitespace-nowrap shrink-0"
              >
                {lang === "ur" ? "قانونی روزگار" : "Get Hired"}
              </a>
              <span className="text-[#E5E2D9] select-none" aria-hidden="true">
                ·
              </span>
              <a
                href="#legal-aid-news"
                className="editorial-link text-[#141413]/85 hover:text-[#141413] whitespace-nowrap shrink-0"
              >
                {lang === "ur" ? "مفت قانونی امداد" : "Legal Aid & News"}
              </a>
              <span className="text-[#E5E2D9] select-none" aria-hidden="true">
                ·
              </span>
              <a
                href="#wirasat-calculator"
                className="editorial-link text-[#141413]/85 hover:text-[#141413] whitespace-nowrap shrink-0"
              >
                {lang === "ur" ? "وراثت اور نکاح نامہ" : "Wirasat & Decoders"}
              </a>
              <span className="text-[#E5E2D9] select-none" aria-hidden="true">
                ·
              </span>
              <a
                href="#citizen-forum-chamber"
                className="editorial-link text-[#141413]/85 hover:text-[#141413] whitespace-nowrap shrink-0"
              >
                {lang === "ur" ? "عوامی فورم و چیمبر" : "Forum & Chamber"}
              </a>
              <span className="text-[#E5E2D9] select-none" aria-hidden="true">
                ·
              </span>
              <a
                href="#plain-law-library"
                className="editorial-link text-[#141413]/85 hover:text-[#141413] whitespace-nowrap shrink-0"
              >
                {lang === "ur" ? "قانونی مسودے" : "Templates & Briefs"}
              </a>
              <span className="text-[#E5E2D9] select-none" aria-hidden="true">
                ·
              </span>
              <Link
                href="/urdu"
                className="font-urdu text-sm text-[#0B5D3B] hover:underline whitespace-nowrap shrink-0"
              >
                اردو پورٹل
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Sleek Single-Line Rotating Supreme Court Precedent Ribbon */}
      <div
        className="bg-[#F2EFE9] border-b border-[#E5E2D9]"
        onMouseEnter={() => setRibbonPaused(true)}
        onMouseLeave={() => setRibbonPaused(false)}
      >
        <div className="w-[96%] max-w-[1840px] mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="font-mono-code text-[11px] font-semibold uppercase tracking-wider text-[#0B5D3B] shrink-0">
              {currentAlert.citation}
            </span>
            <span className="text-[#66645E]" aria-hidden="true">
              ·
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
              className="w-6 h-6 rounded flex items-center justify-center text-[#66645E] hover:text-[#141413] hover:bg-[#FAF9F5] cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setRibbonIndex((prev) => (prev + 1) % PRECEDENT_ALERTS.length)}
              aria-label="Next Supreme Court Precedent"
              className="w-6 h-6 rounded flex items-center justify-center text-[#66645E] hover:text-[#141413] hover:bg-[#FAF9F5] cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN EDITORIAL CONTAINER (max-w-[1380px] mx-auto)
          ===================================================================== */}
      <main className="w-[96%] max-w-[1840px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* ===================================================================
            SECTION 2: CALM HERO, CONVERSATIONAL "MAD-LIBS" TRIAGE DESK &
            AUTO-ROTATING EDITORIAL AUDIO SPOTLIGHT
            =================================================================== */}
        <section id="triage-desk" className="py-12 md:py-16 border-b border-[#E5E2D9]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#66645E]">
              <span>01. CITIZEN TRIAGE &amp; ROADMAP DESK</span>
              <span aria-hidden="true">·</span>
              <span>قانونی رہنمائی ڈیسک</span>
            </div>
            <span dir="rtl" className="font-urdu text-xl sm:text-2xl text-[#141413]/90">
              انصاف تک باوقار اور آسان رسائی — ہر پاکستانی شہری کا آئینی حق
            </span>
          </div>

          <div className="max-w-none">
            <h1
              className="font-legal-serif text-[#141413] tracking-[-0.025em] leading-[1.12] font-normal"
              style={{ fontSize: "clamp(2.25rem, 4.3vw, 3.6rem)", textWrap: "balance" }}
            >
              The Law of Pakistan, written in plain words you can act upon today.
            </h1>
            <p className="mt-4 max-w-5xl text-base sm:text-lg text-[#66645E] leading-relaxed">
              Every major citizen legal tool—from the 1973 Constitution, Pakistan Penal Code, and
              Superior Court Judgments to Verified Advocates, Legal Careers, Pro-Bono Legal Aid, and
              Wirasat Calculators—curated in one calm, authoritative workspace.
            </p>
          </div>

          {/* Conversational "Mad-Libs" Triage Card */}
          <div className="mt-10 rounded-2xl bg-[#F2EFE9] border border-[#E5E2D9] p-7 sm:p-10 transition-editorial">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-[#E5E2D9] text-xs font-mono-code text-[#66645E]">
              <span>Interactive Citizen Triage Desk</span>
              <span>{currentRoadmap.statuteBadge}</span>
            </div>

            <div className="font-legal-serif text-xl sm:text-2xl md:text-[27px] leading-[1.65] text-[#141413]">
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

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setRoadmapExpanded((prev) => !prev)}
                className="inline-flex items-center gap-2.5 px-6 py-3 min-h-[48px] rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-sm font-medium hover:bg-[#09482E] transition-editorial cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>
                  {roadmapExpanded
                    ? "Hide 3-Step Legal Roadmap"
                    : "Unfold My Legal Roadmap"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center rounded-lg border border-[#E5E2D9] bg-[#FAF9F5] p-1">
                <button
                  type="button"
                  onClick={() => setRoadmapStatuteMode("plain")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0 ${
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
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0 ${
                    roadmapStatuteMode === "statute"
                      ? "bg-[#141413] text-[#FAF9F5]"
                      : "text-[#66645E] hover:text-[#141413]"
                  }`}
                >
                  Official Statute
                </button>
              </div>
            </div>

            {roadmapExpanded && (
              <div className="mt-8 pt-8 border-t border-[#E5E2D9] grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3 text-xs font-mono-code text-[#0B5D3B] font-semibold">
                      <span>01. Immediate Protection</span>
                      <ShieldCheck className="w-4 h-4" />
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

                <div className="rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3 text-xs font-mono-code text-[#141413] font-semibold">
                      <span>02. Mandatory Dossier</span>
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
                              className="w-full text-left flex items-start gap-2.5 group py-1 cursor-pointer"
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
                    Click items to check off your dossier readiness
                  </p>
                </div>

                <div className="rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3 text-xs font-mono-code text-[#141413] font-semibold">
                      <span>03. Court &amp; Forum Filing</span>
                      <Clock className="w-4 h-4 text-[#66645E]" />
                    </div>
                    <p className="text-xs font-mono-code text-[#0B5D3B] mb-2">
                      Forum: {currentRoadmap.recommendedSpecialty}
                    </p>
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
                      <span>Consult {selectedCity} Advocate</span>
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
            )}
          </div>

          {/* Auto-Rotating Editorial & Audio Precedent Spotlight (1-Card-at-a-Time Slider) */}
          <div
            id="editorial-spotlight"
            className="mt-10 rounded-2xl border border-[#E5E2D9] bg-[#FAF9F5] p-7 sm:p-9 transition-editorial"
            onMouseEnter={() => setSpotlightPaused(true)}
            onMouseLeave={() => setSpotlightPaused(false)}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E5E2D9]">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-[#66645E]">
                <span className="text-[#0B5D3B] font-semibold">
                  EDITORIAL &amp; AUDIO PRECEDENT SPOTLIGHT
                </span>
                <span aria-hidden="true">·</span>
                <span>{currentSpotlight.citation}</span>
                <span aria-hidden="true">·</span>
                <span>{currentSpotlight.categoryEn}</span>
                <span aria-hidden="true">·</span>
                <span>{currentSpotlight.readTime}</span>
              </div>

              <div className="flex items-center gap-2">
                {SPOTLIGHT_BRIEFINGS.map((b, idx) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSpotlightIndex(idx)}
                    aria-label={`Select spotlight briefing ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === spotlightIndex ? "w-8 bg-[#0B5D3B]" : "w-2 bg-[#E5E2D9]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <h2 className="font-legal-serif text-xl sm:text-2xl md:text-3xl text-[#141413] leading-snug">
                  {currentSpotlight.titleEn}
                </h2>
                <p dir="rtl" className="mt-2 font-urdu text-xl sm:text-2xl text-[#141413]/90">
                  {currentSpotlight.titleUr}
                </p>
                <p className="mt-3 text-sm sm:text-base text-[#66645E] leading-relaxed">
                  {currentSpotlight.subtitleEn}
                </p>
              </div>

              <div className="lg:col-span-4 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] p-5 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setAudioPlayingId((prev) =>
                        prev === currentSpotlight.id ? null : currentSpotlight.id
                      )
                    }
                    className="inline-flex items-center gap-2.5 text-xs font-medium text-[#141413] cursor-pointer"
                  >
                    <span className="w-9 h-9 rounded-full bg-[#0B5D3B] text-[#FAF9F5] flex items-center justify-center shrink-0">
                      {audioPlayingId === currentSpotlight.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </span>
                    <div className="text-left">
                      <span className="block font-semibold">
                        {audioPlayingId === currentSpotlight.id
                          ? "Playing Audio Brief..."
                          : "Listen to Audio Brief"}
                      </span>
                      <span className="font-mono-code text-[11px] text-[#66645E]">
                        {currentSpotlight.audioDuration} · Bilingual Summary
                      </span>
                    </div>
                  </button>
                  <Volume2 className="w-4 h-4 text-[#0B5D3B] shrink-0" />
                </div>

                {/* Subtle Audio Waveform Bar */}
                <div className="w-full h-1.5 rounded-full bg-[#E5E2D9] overflow-hidden">
                  <div
                    className="h-full bg-[#0B5D3B] transition-all duration-300"
                    style={{
                      width: `${audioPlayingId === currentSpotlight.id ? audioProgress : 28}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setReaderMode("plain");
                      setReaderItem(currentSpotlight);
                    }}
                    className="text-xs font-semibold text-[#0B5D3B] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Medium Reader</span>
                  </button>

                  <Link
                    href="/magazine"
                    className="font-mono-code text-[11px] text-[#66645E] hover:text-[#141413]"
                  >
                    Law Review →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 2026 Interactive Trends Suite: 360° 3D Monument, Experimental Orbital Compass,
              Voice-Activated Legal Navigator, Progressive Lead Nurturing & Gamified Rights Quest */}
          <div className="mt-10">
            <FutureTrendsStudio
              themeMode={themeMode}
              onThemeModeChange={setThemeMode}
              reducedMotion={reducedMotion}
              onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
              onNavigateSection={(secId) => {
                const el = document.getElementById(secId);
                if (el) {
                  el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
                }
              }}
              onTriggerAgenticAi={(promptText) => {
                setAiDrawerOpen(true);
                handleSendAiQuery(promptText);
              }}
              selectedCity={selectedCity}
              selectedTopic={selectedTopic}
            />
          </div>
        </section>

        {/* ===================================================================
            SECTION 3 (PILLAR 1A): CONSTITUTION OF PAKISTAN, LAWS OF PAKISTAN & PPC
            (WITH INTERACTIVE 3D ARCHITECTURAL BANNER)
            =================================================================== */}
        <section id="sovereign-codex" className="py-14 md:py-16 border-b border-[#E5E2D9]">
          <Architectural3DBanner
            variant="codex"
            kickerEn="01. NATIONAL SOVEREIGN CODEX"
            titleEn="Constitution of Pakistan, Laws of Pakistan & Pakistan Penal Code"
            titleUr="آئینِ پاکستان ۱۹۷۳، مجموعہ قوانینِ پاکستان اور تعزیراتِ پاکستان"
            subtitleEn="Switch between Fundamental Constitutional Rights, Civil & Family Statutes, and the Pakistan Penal Code (Act XLV of 1860) with side-by-side plain citizen explanations and verbatim gazette text."
            stats={[
              { value: "280 Articles", label: "Constitution of Pakistan 1973" },
              { value: "511 Sections", label: "Pakistan Penal Code (PPC)" },
              { value: "Bilingual", label: "English & Nastaliq Urdu" },
            ]}
            primaryCtaLabel="Search Any Statute or Section"
            onPrimaryCtaClick={() => setSearchOpen(true)}
            secondaryCtaLabel="Open Full Print-Ready Laws Library →"
            secondaryCtaHref="/laws"
          />

          {/* Interactive 3-Pillar Switcher + Instant Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div
              role="tablist"
              aria-label="Sovereign Codex Categories"
              className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9]"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeCodexTab === "constitution"}
                onClick={() => setActiveCodexTab("constitution")}
                className={`px-4 py-2.5 min-h-[42px] rounded-lg text-xs sm:text-sm font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0 ${
                  activeCodexTab === "constitution"
                    ? "bg-[#FAF9F5] text-[#141413] shadow-2xs"
                    : "text-[#66645E] hover:text-[#141413]"
                }`}
              >
                Constitution of Pakistan (1973)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCodexTab === "laws"}
                onClick={() => setActiveCodexTab("laws")}
                className={`px-4 py-2.5 min-h-[42px] rounded-lg text-xs sm:text-sm font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0 ${
                  activeCodexTab === "laws"
                    ? "bg-[#FAF9F5] text-[#141413] shadow-2xs"
                    : "text-[#66645E] hover:text-[#141413]"
                }`}
              >
                Laws of Pakistan (Civil & Family Acts)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCodexTab === "ppc"}
                onClick={() => setActiveCodexTab("ppc")}
                className={`px-4 py-2.5 min-h-[42px] rounded-lg text-xs sm:text-sm font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0 ${
                  activeCodexTab === "ppc"
                    ? "bg-[#FAF9F5] text-[#141413] shadow-2xs"
                    : "text-[#66645E] hover:text-[#141413]"
                }`}
              >
                Pakistan Penal Code (PPC & CrPC)
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#66645E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={codexSearchQuery}
                onChange={(e) => setCodexSearchQuery(e.target.value)}
                placeholder="Filter by Article or Section..."
                className="w-full pl-9 pr-3 py-2 min-h-[40px] rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] text-xs text-[#141413] focus:outline-none focus:border-[#0B5D3B]"
              />
            </div>
          </div>

          {/* Codex Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeCodexList.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[#E5E2D9] bg-[#FAF9F5] p-7 flex flex-col justify-between editorial-card"
              >
                <div>
                  {/* Unboxed Metadata Line */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-[#66645E] mb-3">
                    <span className="text-[#0B5D3B] font-semibold">{item.code}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.partOrChapter}</span>
                  </div>

                  <h3 className="font-legal-serif text-xl text-[#141413] leading-snug">
                    {item.titleEn}
                  </h3>

                  <p dir="rtl" className="mt-2 font-urdu text-lg text-[#141413]/90">
                    {item.titleUr}
                  </p>

                  <p className="mt-3 text-sm text-[#66645E] leading-relaxed">
                    {item.plainSummaryEn}
                  </p>

                  <p dir="rtl" className="mt-3 font-urdu text-base text-[#66645E]">
                    {item.plainSummaryUr}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E2D9] flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => openCodexInReader(item)}
                    className="text-xs font-semibold text-[#0B5D3B] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Verbatim Text & Citizen Remedy</span>
                  </button>

                  <Link
                    href="/laws"
                    className="font-mono-code text-[11px] text-[#66645E] hover:text-[#141413]"
                  >
                    Full Archive →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 4 (PILLAR 1B): ALL JUDGMENTS ISSUED BY ALL COURTS OF PAKISTAN
            (WITH INTERACTIVE 3D SUPREME COURT COLONNADE BANNER)
            =================================================================== */}
        <section id="court-judgments" className="py-14 md:py-16 border-b border-[#E5E2D9]">
          <Architectural3DBanner
            variant="judgments"
            kickerEn="02. SUPERIOR JUDICIARY PRECEDENT REPOSITORY"
            titleEn="All Judgments Issued by All Courts of Pakistan"
            titleUr="سپریم کورٹ، وفاقی شرعی عدالت اور تمام ہائی کورٹس کے تاریخی فیصلے"
            subtitleEn="Filter binding judicial precedents across the Supreme Court of Pakistan, Federal Shariat Court, and the Lahore, Sindh, Islamabad, Peshawar, and Balochistan High Courts—distilled into clear Ratio Decidendi."
            stats={[
              { value: "7 Superior Courts", label: "SC · FSC · LHC · SHC · IHC · PHC · BHC" },
              { value: "PLD & SCMR", label: "Verified Citation Format" },
              { value: "Ratio Decidendi", label: "Plain English & Nastaliq" },
            ]}
            primaryCtaLabel="Ask AI to Find a Specific Precedent"
            onPrimaryCtaClick={() => {
              setAiDrawerOpen(true);
              handleSendAiQuery(
                "What are the latest Supreme Court and High Court judgments on property, family maintenance, and FIR quashment?"
              );
            }}
            secondaryCtaLabel="Browse Complete Judgments Database →"
            secondaryCtaHref="/laws"
          />

          {/* Superior Courts Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
            {(
              [
                { key: "ALL", label: "All Courts of Pakistan" },
                { key: "SC", label: "Supreme Court (SC)" },
                { key: "FSC", label: "Federal Shariat Court (FSC)" },
                { key: "LHC", label: "Lahore High Court (LHC)" },
                { key: "SHC", label: "Sindh High Court (SHC)" },
                { key: "IHC", label: "Islamabad High Court (IHC)" },
                { key: "PHC", label: "Peshawar High Court (PHC)" },
                { key: "BHC", label: "Balochistan High Court (BHC)" },
              ] as const
            ).map((court) => {
              const active = selectedCourtFilter === court.key;
              return (
                <button
                  key={court.key}
                  type="button"
                  onClick={() => setSelectedCourtFilter(court.key)}
                  className={`px-4 py-2 min-h-[40px] rounded-lg text-xs font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-[#141413] text-[#FAF9F5]"
                      : "bg-[#F2EFE9] text-[#66645E] hover:text-[#141413] border border-[#E5E2D9]"
                  }`}
                >
                  {court.label}
                </button>
              );
            })}
          </div>

          {/* Judgments Catalog List */}
          <div className="space-y-5">
            {filteredJudgments.map((j) => (
              <article
                key={j.id}
                className="rounded-2xl border border-[#E5E2D9] bg-[#FAF9F5] p-7 sm:p-8 transition-editorial hover:border-[#141413]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E5E2D9] text-xs font-mono-code text-[#66645E]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[#0B5D3B] font-semibold">{j.citation}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#141413] font-medium">{j.courtNameEn}</span>
                    <span aria-hidden="true">·</span>
                    <span>{j.benchEn}</span>
                  </div>
                  <span>Decided: {j.dateDecided}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8">
                    <div className="text-xs font-mono-code text-[#66645E] mb-1.5">
                      {j.subjectEn}
                    </div>
                    <h3 className="font-legal-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                      {j.headlineEn}
                    </h3>
                    <p dir="rtl" className="mt-2 font-urdu text-xl text-[#141413]/90">
                      {j.headlineUr}
                    </p>
                    <p className="mt-3 text-sm text-[#66645E] leading-relaxed">
                      <strong className="text-[#141413]">Ratio Decidendi: </strong>
                      {j.ratioDecidendiEn}
                    </p>
                    <p dir="rtl" className="mt-2 font-urdu text-base text-[#66645E]">
                      {j.ratioDecidendiUr}
                    </p>
                  </div>

                  <div className="lg:col-span-4 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] p-5 flex flex-col justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-mono-code text-[#66645E] mb-2">
                        OPERATIVE COURT ORDER EXCERPT
                      </div>
                      <p className="font-legal-serif text-xs text-[#141413] leading-relaxed italic">
                        “{j.fullOrderExcerptEn}”
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openJudgmentInReader(j)}
                      className="w-full py-2.5 px-4 min-h-[42px] rounded-xl bg-[#141413] hover:bg-[#0B5D3B] text-[#FAF9F5] text-xs font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Inspect Full Judgment in Reader →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 5 (PILLAR 2): FINDING VERIFIED LAWYERS OF PAKISTAN &
            GETTING HIRED IN PAKISTAN (WITH 3D BAR COUNCIL & CAREERS BANNER)
            =================================================================== */}
        <section id="verified-advocates" className="py-14 md:py-16 border-b border-[#E5E2D9]">
          <Architectural3DBanner
            variant="lawyers_careers"
            kickerEn="03. PAKISTAN BAR COUNCIL & LEGAL CAREERS ECOSYSTEM"
            titleEn="Find Verified Lawyers of Pakistan & Get Hired in Top Law Chambers"
            titleUr="پاکستان کے تصدیق شدہ وکلاء سے مشاورت اور قانونی روزگار و چیمبر بھرتی"
            subtitleEn="Book escrow-protected consultations with verified High Court & Supreme Court Advocates across Pakistan, or apply directly for litigation associate positions, corporate counsel roles, and QanoonPK Bar Panel empanelment."
            stats={[
              { value: "100% Verified", label: "Bar Council License Roll" },
              { value: "Escrow Protected", label: "Qanun-e-Shahadat Art. 9" },
              { value: "Live Openings", label: "Chambers, Panels & Fellowships" },
            ]}
            primaryCtaLabel="Browse Full Advocates Directory"
            onPrimaryCtaClick={() => {
              document
                .getElementById("advocate-carousel-track")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            secondaryCtaLabel="Open Advocate CRM & Portal →"
            secondaryCtaHref="/lawyer/dashboard"
          />

          {/* Part 5A: Finding Verified Lawyers of Pakistan */}
          <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
            <div>
              <div className="text-xs font-mono-code text-[#66645E]">
                PART A · FOR CITIZENS & OVERSEAS CLIENTS
              </div>
              <h3 className="font-legal-serif text-2xl sm:text-3xl text-[#141413] mt-1">
                Finding Verified Lawyers of Pakistan
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/lawyers"
                className="px-3.5 py-2 min-h-[40px] rounded-lg border border-[#E5E2D9] bg-[#F2EFE9] text-xs font-medium text-[#141413] hover:border-[#0B5D3B] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>All Advocates Page</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#0B5D3B]" />
              </Link>
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
                  className={`px-4 py-2 min-h-[40px] rounded-lg text-xs font-medium shrink-0 transition-editorial cursor-pointer whitespace-nowrap ${
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
            id="advocate-carousel-track"
            ref={advocateSliderRef}
            onMouseDown={handleSliderMouseDown}
            onMouseMove={handleSliderMouseMove}
            onMouseUp={handleSliderMouseUp}
            onMouseLeave={handleSliderMouseUp}
            className={`flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-6 ${
              isDraggingSlider ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
          >
            {filteredAdvocates.map((adv) => (
              <div
                key={adv.id}
                className="min-w-[320px] sm:min-w-[360px] max-w-[360px] snap-start rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] p-7 flex flex-col justify-between editorial-card shrink-0"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] flex items-center justify-center font-legal-serif text-base font-bold text-[#141413]">
                      {getInitials(adv.name)}
                    </div>
                    <div className="text-right font-mono-code text-[11px] text-[#66645E]">
                      <div className="text-[#0B5D3B] font-semibold">
                        Verified · {adv.bar_council_id}
                      </div>
                      <div className="mt-0.5 tabular-nums">
                        {adv.court} · {adv.experience_years} Yrs
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h4 className="font-legal-serif text-xl text-[#141413]">{adv.name}</h4>
                    <p dir="rtl" className="font-urdu text-lg text-[#66645E] mt-0.5">
                      {adv.name_urdu}
                    </p>
                    <p className="mt-2 text-xs font-medium text-[#0B5D3B]">{adv.specialty}</p>
                    <p className="mt-2 text-xs text-[#66645E] line-clamp-2 leading-relaxed">
                      {adv.bio}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#E5E2D9]">
                  <div className="flex items-center justify-between text-xs mb-4">
                    <div>
                      <span className="text-[#66645E] block">Chamber City</span>
                      <span className="font-medium text-[#141413]">
                        {adv.city} ({adv.city_urdu})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#66645E] block">Escrow Consultation</span>
                      <span className="font-mono-code font-semibold text-[#141413] tabular-nums">
                        PKR {adv.fee.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setDossierAdvocate(adv)}
                      className="py-2.5 px-3 min-h-[42px] rounded-xl border border-[#E5E2D9] bg-[#F2EFE9]/60 hover:bg-[#F2EFE9] text-xs font-medium text-[#141413] transition-editorial cursor-pointer whitespace-nowrap shrink-0"
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
                      className="py-2.5 px-3 min-h-[42px] rounded-xl bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Part 5B: Getting Hired in Pakistan (Legal Careers, Chamber Recruitment & Bar Panel Empanelment) */}
          <div id="get-hired" className="mt-16 pt-16 border-t border-[#E5E2D9]">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
              <div>
                <div className="text-xs font-mono-code text-[#0B5D3B] font-semibold">
                  PART B · FOR ADVOCATES, ASSOCIATES, LAW CLERKS & LEGAL GRADUATES
                </div>
                <h3 className="font-legal-serif text-2xl sm:text-3xl text-[#141413] mt-1">
                  Getting Hired in Pakistan — Chambers, Corporate Counsel & Bar Panel
                </h3>
                <p className="mt-2 text-sm text-[#66645E] max-w-2xl">
                  Apply directly to verified High Court litigation chambers, corporate banking
                  retainers, paid legal aid fellowships, or join the QanoonPK Escrow Advocate Panel
                  to receive paid client briefs in your city.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {["All Cities", "Lahore", "Karachi", "Islamabad", "Peshawar"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCareerFilterCity(c)}
                    className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0 ${
                      careerFilterCity === c
                        ? "bg-[#141413] text-[#FAF9F5]"
                        : "bg-[#F2EFE9] text-[#66645E] hover:text-[#141413] border border-[#E5E2D9]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCareers.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-[#E5E2D9] bg-[#FAF9F5] p-7 flex flex-col justify-between editorial-card"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-[#66645E] mb-3">
                      <span className="text-[#0B5D3B] font-semibold">{job.engagementType}</span>
                      <span>
                        {job.city} ({job.cityUr}) · {job.barRequirement}
                      </span>
                    </div>

                    <h4 className="font-legal-serif text-xl text-[#141413] leading-snug">
                      {job.roleTitleEn}
                    </h4>
                    <p dir="rtl" className="mt-1.5 font-urdu text-lg text-[#141413]/90">
                      {job.roleTitleUr}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[#66645E]">
                      {job.organizationEn}
                    </p>

                    <p className="mt-3 text-sm text-[#141413]/90 leading-relaxed">
                      {job.descriptionEn}
                    </p>

                    <ul className="mt-4 space-y-1.5 text-xs text-[#66645E]">
                      {job.responsibilitiesEn.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#0B5D3B] shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E5E2D9] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-mono-code text-[#66645E] block">
                        Compensation / Retainer
                      </span>
                      <span className="font-mono-code text-xs font-semibold text-[#141413] tabular-nums">
                        {job.compensationPkr}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setApplyingRole(job);
                        setApplicationSubmittedRef(null);
                      }}
                      className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Apply / Empanel Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Bar Empanelment Callout Strip */}
            <div className="mt-8 rounded-2xl bg-[#F2EFE9] border border-[#E5E2D9] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="text-xs font-mono-code text-[#0B5D3B] font-semibold">
                  ADVOCATE SELF-EMPANELMENT & CHAMBER CRM
                </div>
                <h4 className="font-legal-serif text-xl text-[#141413] mt-1">
                  Hold a Valid Pakistan or Provincial Bar Council License?
                </h4>
                <p className="text-sm text-[#66645E] mt-1">
                  Access your dedicated Advocate Chamber Dashboard, manage incoming client leads,
                  set consultation hours, and withdraw cleared escrow fees.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/lawyer/dashboard"
                  className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#141413] text-[#FAF9F5] text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>Open Advocate CRM</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/lawyer/leads"
                  className="px-4 py-2.5 min-h-[42px] rounded-xl border border-[#141413] text-[#141413] hover:bg-[#141413] hover:text-[#FAF9F5] text-xs font-medium inline-flex items-center gap-1.5 transition-editorial whitespace-nowrap shrink-0"
                >
                  <span>View Client Leads</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 6 (PILLAR 3): NEWS RELATED TO LEGAL AID & JUDICIAL REFORMS
            (WITH INTERACTIVE 3D LEGAL AID GAZETTE BANNER)
            =================================================================== */}
        <section id="legal-aid-news" className="py-14 md:py-16 border-b border-[#E5E2D9]">
          <Architectural3DBanner
            variant="legal_aid_news"
            kickerEn="04. CITIZEN JUSTICE & LEGAL AID GAZETTE"
            titleEn="News Related to Legal Aid, Pro-Bono Clinics & Judicial Reforms"
            titleUr="قانونی امداد، مفت سرکاری وکیل، محتسب اور عدالتی اصلاحات کی تازہ ترین خبریں"
            subtitleEn="Verified dispatches on free state-funded legal representation, Women's Property Ombudsperson fast-track cells, Supreme Court video-link hearings, and NADRA overseas succession reforms."
            stats={[
              { value: "100% Free Aid", label: "For Eligible Indigent Citizens" },
              { value: "60-Day Mandate", label: "Women's Inheritance Ombudsperson" },
              { value: "15-Day Issuance", label: "NADRA Succession Certificates" },
            ]}
            primaryCtaLabel="Apply for Free Pro-Bono Legal Aid"
            onPrimaryCtaClick={() => {
              window.location.href = "/pro-bono/apply";
            }}
            secondaryCtaLabel="Ask Legal Aid Question on Forum →"
            secondaryCtaHref="/forum"
          />

          {/* Interactive 60-Second Pro-Bono Legal Aid Eligibility & Intake Desk */}
          <div className="rounded-2xl bg-[#F2EFE9] border border-[#E5E2D9] p-7 sm:p-9 mb-12">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E5E2D9]">
              <div>
                <span className="font-mono-code text-xs text-[#0B5D3B] font-semibold">
                  LEGAL AID &amp; JUSTICE AUTHORITY ACT · STATUTORY ELIGIBILITY CHECKER
                </span>
                <h3 className="font-legal-serif text-xl sm:text-2xl text-[#141413] mt-1">
                  Check Your Eligibility for 100% Free Pro-Bono Bar Representation
                </h3>
              </div>
              <span dir="rtl" className="font-urdu text-xl text-[#141413]">
                مفت سرکاری وکیل اور قانونی امداد کی اہلیت چیک کریں
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <label className="block text-xs font-mono-code text-[#66645E] mb-2">
                    1. SELECT HOUSEHOLD MONTHLY INCOME BRACKET (PKR)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        { id: "under_50k", label: "Under PKR 50,000 / mo" },
                        { id: "50k_to_80k", label: "PKR 50,000 – 80,000" },
                        { id: "above_80k", label: "Above PKR 80,000" },
                      ] as const
                    ).map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setProBonoIncomeBracket(b.id)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-editorial cursor-pointer ${
                          proBonoIncomeBracket === b.id
                            ? "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                            : "bg-[#FAF9F5] text-[#141413] border-[#E5E2D9]"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-[#66645E] mb-2">
                    2. SELECT STATUTORY PRIORITY CATEGORY
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Deserving Woman (Family / Khula / Inheritance)",
                      "Unlawful Detention / Bail Matter",
                      "Daily-Wage Worker / Labor Dispute",
                      "Juvenile / Senior Citizen",
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setProBonoApplicantCategory(cat)}
                        className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition-editorial cursor-pointer ${
                          proBonoApplicantCategory === cat
                            ? "bg-[#0B5D3B] text-[#FAF9F5] border-[#0B5D3B]"
                            : "bg-[#FAF9F5] text-[#141413] border-[#E5E2D9]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] p-6 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-code mb-2">
                    <span className="text-[#0B5D3B] font-semibold">
                      {proBonoIncomeBracket === "above_80k"
                        ? "PARTIAL FEE SUBSIDY / WOMEN OMBUDSPERSON"
                        : "100% FULL FEE WAIVER ELIGIBLE"}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-[#0B5D3B]" />
                  </div>
                  <p className="text-sm text-[#141413] leading-relaxed">
                    {proBonoIncomeBracket === "above_80k"
                      ? `For "${proBonoApplicantCategory}", you qualify for zero-fee summary proceedings before the Provincial Ombudsperson or capped Bar Panel consultation.`
                      : `You qualify for 100% state-funded and Bar-subsidized legal representation in ${selectedCity} under the Legal Aid and Justice Authority Act.`}
                  </p>
                  <p dir="rtl" className="mt-2 font-urdu text-base text-[#66645E]">
                    آپ لیگل ایڈ اینڈ جسٹس اتھارٹی ایکٹ کے تحت مفت قانونی نمائندگی اور وکیل کی سہولت کے اہل ہیں۔
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E5E2D9]">
                  <Link
                    href="/pro-bono/apply"
                    className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs font-medium inline-flex items-center gap-1.5 transition-editorial whitespace-nowrap shrink-0"
                  >
                    <span>Submit Free Legal Aid Application</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="font-mono-code text-[11px] text-[#66645E]">
                    Helpline: 1099
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* News Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
            {[
              "All Dispatches",
              "Legal Aid Drive",
              "Women & Overseas Protection",
              "Supreme Court Directive",
              "Legislative Reform",
            ].map((cat) => {
              const active = newsCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setNewsCategoryFilter(cat)}
                  className={`px-4 py-2 min-h-[40px] rounded-lg text-xs font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-[#141413] text-[#FAF9F5]"
                      : "bg-[#F2EFE9] text-[#66645E] hover:text-[#141413] border border-[#E5E2D9]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Editorial News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNews.map((news) => (
              <article
                key={news.id}
                className="rounded-2xl border border-[#E5E2D9] bg-[#FAF9F5] p-7 flex flex-col justify-between editorial-card"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-[#66645E] mb-3">
                    <span className="text-[#0B5D3B] font-semibold">{news.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{news.publishedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{news.readTime}</span>
                  </div>

                  <h3 className="font-legal-serif text-xl text-[#141413] leading-snug">
                    {news.headlineEn}
                  </h3>

                  <p dir="rtl" className="mt-2 font-urdu text-lg text-[#141413]/90">
                    {news.headlineUr}
                  </p>

                  <p className="mt-3 text-sm text-[#66645E] leading-relaxed">{news.deckEn}</p>

                  <p dir="rtl" className="mt-2 font-urdu text-base text-[#66645E]">
                    {news.deckUr}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E2D9] flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => openNewsInReader(news)}
                    className="text-xs font-semibold text-[#141413] hover:text-[#0B5D3B] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#0B5D3B]" />
                    <span>Read Full Gazette Dispatch</span>
                  </button>

                  <a
                    href={news.actionLink}
                    className="text-xs font-mono-code text-[#0B5D3B] font-semibold hover:underline"
                  >
                    {news.actionLabelEn} →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 7 (PILLAR 4): RESEARCH-DRIVEN CITIZEN JUSTICE TOOLS —
            ISLAMIC INHERITANCE (WIRASAT) SHARE CALCULATOR, CLAUSE DECODER,
            SPOTLIGHT BRIEFINGS & BILINGUAL LEGAL TEMPLATES
            =================================================================== */}
        <section id="wirasat-calculator" className="py-14 md:py-16 border-b border-[#E5E2D9]">
          <Architectural3DBanner
            variant="wirasat_tools"
            kickerEn="05. SHARIAH INHERITANCE & CITIZEN PROTECTION TOOLS"
            titleEn="Islamic Inheritance (Wirasat) Calculator & Clause Decoder"
            titleUr="اسلامی وراثت (شرعی حصص) کیلکولیٹر، نکاح نامہ اور ایف آئی آر ڈی کوڈر"
            subtitleEn="Compute exact Quranic and statutory inheritance shares in PKR for surviving family members, decode Nikahnama and FIR clauses before signing, and download court-ready bilingual legal templates."
            stats={[
              { value: "Surah An-Nisa", label: "Exact Quranic Faraid Ratios" },
              { value: "2 : 1 & Fixed", label: "Spouse, Parents & Children" },
              { value: "Court-Ready", label: "Bilingual Legal Drafts" },
            ]}
          />

          {/* Interactive Wirasat / Shariah Inheritance Calculator Card */}
          <div className="rounded-2xl bg-[#F2EFE9] border border-[#E5E2D9] p-7 sm:p-10 mb-16">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E5E2D9]">
              <div>
                <span className="font-mono-code text-xs text-[#0B5D3B] font-semibold">
                  INTERACTIVE SHARIAH INHERITANCE (WIRASAT / FARAID) CALCULATOR
                </span>
                <h3 className="font-legal-serif text-2xl text-[#141413] mt-1">
                  Calculate Lawful Legal Heirs’ Shares in PKR
                </h3>
              </div>
              <span dir="rtl" className="font-urdu text-xl text-[#141413]">
                شرعی تقسیمِ وراثت کیلکولیٹر
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 6 Cols: Inputs */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <label className="block text-xs font-mono-code text-[#66645E] mb-1.5">
                    NET ESTATE VALUE (AFTER FUNERAL, DEBTS & WILL UP TO 1/3) — PKR
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500000}
                    value={estateValuePkr}
                    onChange={(e) => setEstateValuePkr(Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] font-mono-code text-base font-semibold text-[#141413] tabular-nums focus:outline-none focus:border-[#0B5D3B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-code text-[#66645E] mb-1.5">
                      DECEASED WAS
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9]">
                      <button
                        type="button"
                        onClick={() => setDeceasedGender("male")}
                        className={`py-2 rounded-lg text-xs font-medium cursor-pointer ${
                          deceasedGender === "male"
                            ? "bg-[#141413] text-[#FAF9F5]"
                            : "text-[#66645E]"
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeceasedGender("female")}
                        className={`py-2 rounded-lg text-xs font-medium cursor-pointer ${
                          deceasedGender === "female"
                            ? "bg-[#141413] text-[#FAF9F5]"
                            : "text-[#66645E]"
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-[#66645E] mb-1.5">
                      SURVIVING SPOUSE
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9]">
                      <button
                        type="button"
                        onClick={() => setHasSpouse(true)}
                        className={`py-2 rounded-lg text-xs font-medium cursor-pointer ${
                          hasSpouse ? "bg-[#0B5D3B] text-[#FAF9F5]" : "text-[#66645E]"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasSpouse(false)}
                        className={`py-2 rounded-lg text-xs font-medium cursor-pointer ${
                          !hasSpouse ? "bg-[#141413] text-[#FAF9F5]" : "text-[#66645E]"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-code text-[#66645E] mb-1.5">
                      NUMBER OF SONS ({sonsCount})
                    </label>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setSonsCount(n)}
                          className={`flex-1 py-2 rounded-lg border text-xs font-mono-code cursor-pointer ${
                            sonsCount === n
                              ? "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                              : "bg-[#FAF9F5] text-[#141413] border-[#E5E2D9]"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-[#66645E] mb-1.5">
                      NUMBER OF DAUGHTERS ({daughtersCount})
                    </label>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setDaughtersCount(n)}
                          className={`flex-1 py-2 rounded-lg border text-xs font-mono-code cursor-pointer ${
                            daughtersCount === n
                              ? "bg-[#0B5D3B] text-[#FAF9F5] border-[#0B5D3B]"
                              : "bg-[#FAF9F5] text-[#141413] border-[#E5E2D9]"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHasMother((p) => !p)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between cursor-pointer ${
                      hasMother
                        ? "bg-[#FAF9F5] border-[#0B5D3B] text-[#141413]"
                        : "bg-[#FAF9F5]/60 border-[#E5E2D9] text-[#66645E]"
                    }`}
                  >
                    <span>Mother Alive (والدہ)</span>
                    {hasMother && <Check className="w-4 h-4 text-[#0B5D3B]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setHasFather((p) => !p)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between cursor-pointer ${
                      hasFather
                        ? "bg-[#FAF9F5] border-[#0B5D3B] text-[#141413]"
                        : "bg-[#FAF9F5]/60 border-[#E5E2D9] text-[#66645E]"
                    }`}
                  >
                    <span>Father Alive (والد)</span>
                    {hasFather && <Check className="w-4 h-4 text-[#0B5D3B]" />}
                  </button>
                </div>
              </div>

              {/* Right 6 Cols: Computed Shariah Shares Table */}
              <div className="lg:col-span-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] p-6">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E2D9] text-xs font-mono-code text-[#66645E]">
                  <span>QURANIC & STATUTORY HEIR BREAKDOWN</span>
                  <span className="tabular-nums">
                    Total: PKR {estateValuePkr.toLocaleString()}
                  </span>
                </div>

                <div className="divide-y divide-[#E5E2D9]">
                  {wirasatDistribution.map((row, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium text-[#141413]">{row.heirEn}</div>
                        <div className="text-xs text-[#66645E] font-mono-code">
                          {row.fractionLabel} · {row.percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono-code text-sm font-semibold text-[#0B5D3B] tabular-nums">
                          PKR {row.amountPkr.toLocaleString()}
                        </div>
                        <div dir="rtl" className="font-urdu text-sm text-[#66645E]">
                          {row.heirUr}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-[#E5E2D9] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#66645E]">
                    Protected under Enforcement of Women&apos;s Property Rights Act 2020
                  </span>
                  <Link
                    href="/pro-bono/apply"
                    className="font-semibold text-[#0B5D3B] hover:underline"
                  >
                    Claim Denied Share →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Nikahnama, FIR & Rent Clause Decoder */}
          <div id="clause-decoder">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <div>
                <span className="font-mono-code text-xs uppercase tracking-[0.14em] text-[#66645E]">
                  BEFORE YOU SIGN OR RECORD A STATEMENT
                </span>
                <h2 className="font-legal-serif text-2xl sm:text-3xl text-[#141413] mt-2">
                  Interactive Nikahnama, FIR & Rent Clause Decoder
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#66645E] max-w-3xl">
                  Select any critical clause below to inspect its official statutory wording, plain
                  citizen meaning, and common legal traps.
                </p>
              </div>

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
                      className={`px-4 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0 ${
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
                    <button
                      type="button"
                      onClick={() => setActiveClauseId(clause.id)}
                      className="w-full text-left px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-mono-code text-xs font-semibold text-[#0B5D3B]">
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

                    {isSelected && (
                      <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-[#E5E2D9] grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-xl bg-[#F2EFE9]/70 border border-[#E5E2D9]">
                          <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#66645E]">
                            1. Official Statutory Text
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

                        <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9]">
                          <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#141413]">
                            2. What It Means in Plain Words
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

                        <div className="p-5 rounded-xl bg-[#F2EFE9]/70 border border-[#E5E2D9]">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#0B5D3B]" />
                            <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#0B5D3B] font-semibold">
                              3. Citizen Protection & Red Flags
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
          </div>
        </section>

        {/* ===================================================================
            SECTION 7B: PUBLIC CITIZEN LEGAL Q&A FORUM & ENCRYPTED CHAMBER DESK
            (COVERING /forum, /client/cases, /chat, /video-call & /lawyer/wallet)
            =================================================================== */}
        <section
          id="citizen-forum-chamber"
          className="py-14 md:py-16 border-b border-[#E5E2D9] grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          {/* Left 7 Columns: Public Citizen Legal Q&A Forum */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="font-mono-code text-xs uppercase tracking-[0.14em] text-[#0B5D3B] font-semibold">
                  06. PUBLIC CITIZEN LEGAL Q&amp;A FORUM
                </span>
                <h2 className="font-legal-serif text-2xl sm:text-3xl text-[#141413] mt-1">
                  Anonymous Citizen Questions &amp; Verified Bar Answers
                </h2>
                <p className="mt-2 text-sm text-[#66645E]">
                  Every response is authored by a Bar-verified High Court or Supreme Court Advocate
                  with exact statutory citations.
                </p>
              </div>
              <Link
                href="/forum"
                className="text-xs font-mono-code text-[#0B5D3B] font-semibold hover:underline"
              >
                Open Full Forum →
              </Link>
            </div>

            {/* Post Anonymous Question Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newForumQuestion.trim()) return;
                const created: CitizenForumThread = {
                  id: `forum-custom-${Date.now()}`,
                  category: newForumCategory,
                  city: selectedCity,
                  askedBy: "Anonymous Citizen (Just Now)",
                  timeAgo: "Just now",
                  questionEn: newForumQuestion.trim(),
                  questionUr: "شہری کا قانونی سوال — تصدیق شدہ وکیل کا فوری جواب",
                  advocateName: "QanoonPK Bar Duty Desk, AHC",
                  advocateBarId: "PBC-DUTY-2026",
                  answerEn:
                    "Preliminary Statutory Note: Your question has been logged on the Public Citizen Q&A Board. Under Article 4 and Article 10-A of the Constitution of Pakistan, you are entitled to due process and written statutory notice. Click 'Ask Legal AI' or open the full Forum for detailed case-law citations.",
                  answerUr:
                    "آپ کا سوال عوامی قانونی فورم پر درج کر لیا گیا ہے۔ آئین کے آرٹیکل 4 اور 10-A کے تحت ہر شہری کو قانونی تحفظ حاصل ہے۔",
                  statuteCited: "Constitution Art. 4 & 10-A",
                  helpfulCount: 1,
                };
                setForumThreads((prev) => [created, ...prev]);
                setNewForumQuestion("");
                setForumPostedSuccess(true);
                setTimeout(() => setForumPostedSuccess(false), 3500);
              }}
              className="rounded-2xl bg-[#F2EFE9] border border-[#E5E2D9] p-5 mb-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-mono-code text-[#66645E]">
                <span>POST ANONYMOUS LEGAL QUESTION TO BAR PANEL</span>
                <select
                  value={newForumCategory}
                  onChange={(e) =>
                    setNewForumCategory(e.target.value as CitizenForumThread["category"])
                  }
                  className="bg-[#FAF9F5] border border-[#E5E2D9] rounded-md px-2.5 py-1 text-xs text-[#141413] focus:outline-none"
                >
                  <option value="Family & Khula">Family &amp; Khula</option>
                  <option value="Property & Wirasat">Property &amp; Wirasat</option>
                  <option value="Police FIR & Bail">Police FIR &amp; Bail</option>
                  <option value="Cyber & Banking">Cyber &amp; Banking</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={newForumQuestion}
                  onChange={(e) => setNewForumQuestion(e.target.value)}
                  placeholder="Ask your legal question anonymously in English or Urdu..."
                  className="flex-1 px-4 py-2.5 min-h-[42px] rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-sm text-[#141413] focus:outline-none focus:border-[#0B5D3B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0"
                >
                  Post Question
                </button>
              </div>
              {forumPostedSuccess && (
                <p className="mt-2.5 text-xs font-mono-code text-[#0B5D3B]">
                  ✓ Question published to the Citizen Q&amp;A Board with preliminary statutory note.
                </p>
              )}
            </form>

            {/* Forum Threads Stack */}
            <div className="space-y-4">
              {forumThreads.map((t) => {
                const isUpvoted = !!upvotedForumIds[t.id];
                return (
                  <article
                    key={t.id}
                    className="rounded-2xl border border-[#E5E2D9] bg-[#FAF9F5] p-6 transition-editorial"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-[#66645E] mb-2.5">
                      <span>
                        <strong className="text-[#0B5D3B]">{t.category}</strong> · {t.city} ·{" "}
                        {t.askedBy}
                      </span>
                      <span>{t.timeAgo}</span>
                    </div>

                    <h3 className="font-legal-serif text-base sm:text-lg text-[#141413] leading-snug">
                      “{t.questionEn}”
                    </h3>
                    <p dir="rtl" className="mt-1.5 font-urdu text-base text-[#66645E]">
                      {t.questionUr}
                    </p>

                    <div className="mt-4 pt-4 border-t border-[#E5E2D9]">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code mb-2">
                        <span className="text-[#141413] font-semibold">
                          ✓ Answered by {t.advocateName} ({t.advocateBarId})
                        </span>
                        <span className="text-[#0B5D3B]">{t.statuteCited}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#141413]/90 leading-relaxed">
                        {t.answerEn}
                      </p>
                      <p dir="rtl" className="mt-2 font-urdu text-base text-[#66645E]">
                        {t.answerUr}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setUpvotedForumIds((prev) => ({
                              ...prev,
                              [t.id]: !prev[t.id],
                            }))
                          }
                          className={`px-3 py-1 rounded-lg border text-xs font-mono-code transition-editorial cursor-pointer ${
                            isUpvoted
                              ? "bg-[#0B5D3B] text-[#FAF9F5] border-[#0B5D3B]"
                              : "bg-[#F2EFE9] text-[#141413] border-[#E5E2D9]"
                          }`}
                        >
                          Helpful Citation · {t.helpfulCount + (isUpvoted ? 1 : 0)}
                        </button>

                        <Link
                          href="/forum"
                          className="text-xs font-mono-code text-[#66645E] hover:text-[#141413]"
                        >
                          View Discussion →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Right 5 Columns: Client Case Tracker, Privileged Chamber & Escrow Wallet */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="mb-6">
              <span className="font-mono-code text-xs uppercase tracking-[0.14em] text-[#66645E]">
                07. CLIENT &amp; ADVOCATE WORKSPACE
              </span>
              <h2 className="font-legal-serif text-2xl text-[#141413] mt-1">
                Case Milestones, Privileged Chat &amp; Escrow Ledger
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#66645E]">
                Preview how citizens track live court hearings, communicate in encrypted chambers,
                and protect legal fees in Bar Escrow.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F2EFE9] border border-[#E5E2D9] p-6">
              {/* Interactive 3-Tab Workspace Switcher */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] mb-6">
                {(
                  [
                    { id: "milestones", label: "Case Tracker" },
                    { id: "chat", label: "Chamber Chat" },
                    { id: "escrow", label: "Escrow Wallet" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveChamberTab(tab.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-editorial cursor-pointer ${
                      activeChamberTab === tab.id
                        ? "bg-[#141413] text-[#FAF9F5]"
                        : "text-[#66645E] hover:text-[#141413]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeChamberTab === "milestones" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9]">
                    <div className="flex items-center justify-between text-xs font-mono-code text-[#66645E]">
                      <span>CASE #QPK-LHC-8841</span>
                      <span className="text-[#0B5D3B] font-semibold">ACTIVE · STEP 2 OF 3</span>
                    </div>
                    <h3 className="font-legal-serif text-base text-[#141413] mt-1">
                      Wirasat Mutation &amp; Partition Suit — Lahore
                    </h3>
                    <p dir="rtl" className="font-urdu text-base text-[#66645E] mt-0.5">
                      وراثتی انتقال اور تقسیمِ جائیداد کا مقدمہ
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-xs">
                    <li className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] flex items-center justify-between">
                      <span className="text-[#141413] font-medium">
                        01. NADRA FRC &amp; Fard-e-Malkiyat Verified
                      </span>
                      <span className="font-mono-code text-[#0B5D3B] font-semibold">
                        Completed
                      </span>
                    </li>
                    <li className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#141413] flex items-center justify-between">
                      <span className="text-[#141413] font-medium">
                        02. Ombudsperson 60-Day Summary Notice Issued
                      </span>
                      <span className="font-mono-code text-[#0B5D3B] font-semibold">
                        In Hearing
                      </span>
                    </li>
                    <li className="p-3.5 rounded-xl bg-[#FAF9F5]/70 border border-[#E5E2D9] flex items-center justify-between text-[#66645E]">
                      <span>03. Revenue Mutation &amp; Possession Decree</span>
                      <span className="font-mono-code">Escrow Milestone</span>
                    </li>
                  </ul>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <Link
                      href="/client/cases"
                      className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-xs font-medium inline-flex items-center gap-1.5"
                    >
                      <span>Open Client Case Tracker</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/lawyer/dashboard"
                      className="text-xs font-mono-code text-[#66645E] hover:text-[#141413]"
                    >
                      Advocate View →
                    </Link>
                  </div>
                </div>
              )}

              {activeChamberTab === "chat" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-3 text-xs">
                    <div className="flex items-center justify-between font-mono-code text-[11px] text-[#0B5D3B]">
                      <span>PRIVILEGED CHAMBER · QANUN-E-SHAHADAT ART. 9</span>
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-3 rounded-lg bg-[#F2EFE9] text-[#141413]">
                      <strong>Adv. Sikandar Hayat, ASC:</strong> “We have drafted the Section 22-A
                      petition and attached your stamped postal receipt. Please review before tomorrow
                      morning’s filing.”
                    </div>
                    <div dir="rtl" className="p-3 rounded-lg bg-[#F2EFE9] font-urdu text-base text-[#141413]">
                      دفعہ 22-A کی پٹیشن تیار کر لی گئی ہے، کل صبح سیشن کورٹ میں دائر کر دی جائے گی۔
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href="/chat"
                      className="py-2.5 px-3 min-h-[42px] rounded-xl bg-[#141413] text-[#FAF9F5] text-xs font-medium inline-flex items-center justify-center gap-1.5"
                    >
                      <span>Open Encrypted Chat</span>
                    </Link>
                    <Link
                      href="/video-call"
                      className="py-2.5 px-3 min-h-[42px] rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-xs font-medium inline-flex items-center justify-center gap-1.5"
                    >
                      <span>Join Video Chamber</span>
                    </Link>
                  </div>
                </div>
              )}

              {activeChamberTab === "escrow" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-2">
                    <span className="font-mono-code text-[11px] text-[#66645E]">
                      BAR COUNCIL ESCROW PROTECTION LEDGER
                    </span>
                    <div className="font-mono-code text-xl font-bold text-[#141413] tabular-nums">
                      PKR 185,000{" "}
                      <span className="text-xs font-normal text-[#0B5D3B]">
                        (Cleared &amp; Protected)
                      </span>
                    </div>
                    <p className="text-xs text-[#66645E] leading-relaxed">
                      Client consultation and litigation milestone payments are held safely in
                      QanoonPK Escrow until court filing verification.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href="/lawyer/wallet"
                      className="py-2.5 px-3 min-h-[42px] rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-xs font-medium inline-flex items-center justify-center gap-1.5"
                    >
                      <span>Advocate Wallet</span>
                    </Link>
                    <Link
                      href="/checkout"
                      className="py-2.5 px-3 min-h-[42px] rounded-xl border border-[#141413] text-[#141413] text-xs font-medium inline-flex items-center justify-center gap-1.5"
                    >
                      <span>Escrow Checkout</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 8: SPLIT SHOWCASE — "THE LAW IN PLAIN WORDS" & LEGAL TEMPLATES
            =================================================================== */}
        <section
          id="plain-law-library"
          className="py-14 md:py-16 border-b border-[#E5E2D9] grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
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
                        <span className="font-mono-code text-sm font-semibold text-[#0B5D3B] pt-1 tabular-nums">
                          {numberStr}.
                        </span>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono-code text-[11px] text-[#66645E]">
                            <span>{item.categoryEn}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#141413]">{item.citation}</span>
                            <span aria-hidden="true">·</span>
                            <span>{item.readTime}</span>
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
                <span className="font-mono-code text-xs text-[#66645E] px-1 tabular-nums">
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

            <div className="rounded-2xl bg-[#F2EFE9] border border-[#E5E2D9] p-7 transition-editorial">
              <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E5E2D9] text-xs font-mono-code">
                <span className="font-semibold text-[#0B5D3B]">
                  {currentTemplate.statuteBadge}
                </span>
                <span className="text-[#66645E]">{currentTemplate.code}</span>
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

              <div className="mt-5 p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] font-mono-code text-xs text-[#141413]/85 whitespace-pre-line line-clamp-5 leading-relaxed">
                {currentTemplate.englishDraft}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-mono-code text-[#66645E]">
                <span>Stamp Paper: {currentTemplate.stampPaperValue}</span>
                <Link href="/templates" className="text-[#0B5D3B] hover:underline">
                  All Drafts →
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(currentTemplate)}
                  className="py-2.5 px-3 min-h-[42px] rounded-xl bg-[#FAF9F5] border border-[#141413] text-[#141413] hover:bg-[#141413] hover:text-[#FAF9F5] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-editorial cursor-pointer whitespace-nowrap shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadTemplate(currentTemplate)}
                  className="py-2.5 px-3 min-h-[42px] rounded-xl bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-editorial cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>

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

        {/* ===================================================================
            SECTION 9: MASTER PLATFORM COMMAND DIRECTORY (ALL APP WORKSPACES)
            =================================================================== */}
        <section id="platform-directory" className="py-14 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="font-mono-code text-xs uppercase tracking-[0.14em] text-[#66645E]">
                COMPLETE PLATFORM NAVIGATION
              </span>
              <h2 className="font-legal-serif text-2xl sm:text-3xl text-[#141413] mt-2">
                All QanoonPK Workspaces & Citizen Desks
              </h2>
              <p className="mt-2 text-sm text-[#66645E] max-w-3xl">
                Direct one-click access to every dedicated module across the QanoonPK platform—from
                the searchable Laws Library and Urdu Portal to Client Case Tracking and the Advocate
                CRM.
              </p>
            </div>

            <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9]">
              {(
                [
                  "All",
                  "Citizen Justice",
                  "Client Workspace",
                  "Advocate & Bar CRM",
                ] as const
              ).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDirectoryTab(tab)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0 ${
                    directoryTab === tab
                      ? "bg-[#FAF9F5] text-[#141413] shadow-2xs"
                      : "text-[#66645E] hover:text-[#141413]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredDirectory.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-2xl border border-[#E5E2D9] bg-[#FAF9F5] p-6 flex flex-col justify-between editorial-card"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-code text-[#66645E] mb-2.5">
                    <span>{card.group}</span>
                    <span className="text-[#0B5D3B] font-semibold">{card.badge}</span>
                  </div>
                  <h3 className="font-legal-serif text-lg text-[#141413] group-hover:text-[#0B5D3B] transition-editorial">
                    {card.titleEn}
                  </h3>
                  <p dir="rtl" className="mt-1 font-urdu text-base text-[#66645E]">
                    {card.titleUr}
                  </p>
                  <p className="mt-2.5 text-xs text-[#66645E] leading-relaxed">
                    {card.descriptionEn}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5E2D9] flex items-center justify-between text-xs font-medium text-[#141413]">
                  <span>Open Module</span>
                  <ArrowUpRight className="w-4 h-4 text-[#0B5D3B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* =====================================================================
          SECTION 10: MINIMALIST COLOPHON FOOTER
          ===================================================================== */}
      <footer className="bg-[#FAF9F5] border-t border-[#E5E2D9] py-14">
        <div className="w-[96%] max-w-[1840px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E5E2D9]">
            <div className="md:col-span-5">
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
                Public-interest statutory archive, Superior Court judgment repository, verified Bar
                Council advocate network, and citizen legal aid portal of Pakistan.
              </p>
            </div>

            <div className="md:col-span-4">
              <p className="font-mono-code text-xs uppercase tracking-wider text-[#141413] mb-3">
                Primary Platform Portals
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-[#66645E]">
                <Link href="/laws" className="hover:text-[#141413]">
                  Laws & PPC Archive
                </Link>
                <Link href="/lawyers" className="hover:text-[#141413]">
                  Verified Advocates
                </Link>
                <Link href="/templates" className="hover:text-[#141413]">
                  Legal Drafts
                </Link>
                <Link href="/forum" className="hover:text-[#141413]">
                  Legal Q&A Forum
                </Link>
                <Link href="/pro-bono/apply" className="hover:text-[#141413]">
                  Free Legal Aid
                </Link>
                <Link href="/urdu" className="hover:text-[#141413]">
                  اردو پورٹل
                </Link>
                <Link href="/client/ai-assistant" className="hover:text-[#141413]">
                  AI Research Desk
                </Link>
                <Link href="/lawyer/dashboard" className="hover:text-[#141413]">
                  Advocate CRM
                </Link>
              </div>
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
          href="#sovereign-codex"
          className="min-h-[44px] min-w-[44px] px-2 flex flex-col items-center justify-center text-[11px] font-medium text-[#141413]"
        >
          <BookOpen className="w-4 h-4 text-[#0B5D3B] mb-0.5" />
          <span>Codex</span>
        </a>
        <a
          href="#court-judgments"
          className="min-h-[44px] min-w-[44px] px-2 flex flex-col items-center justify-center text-[11px] font-medium text-[#66645E]"
        >
          <Landmark className="w-4 h-4 mb-0.5" />
          <span>Judgments</span>
        </a>
        <a
          href="#verified-advocates"
          className="min-h-[44px] min-w-[44px] px-2 flex flex-col items-center justify-center text-[11px] font-medium text-[#66645E]"
        >
          <ShieldCheck className="w-4 h-4 mb-0.5" />
          <span>Lawyers</span>
        </a>
        <a
          href="#get-hired"
          className="min-h-[44px] min-w-[44px] px-2 flex flex-col items-center justify-center text-[11px] font-medium text-[#66645E]"
        >
          <Briefcase className="w-4 h-4 mb-0.5" />
          <span>Jobs</span>
        </a>
        <button
          type="button"
          onClick={() => setAiDrawerOpen(true)}
          className="min-h-[44px] min-w-[44px] px-2 flex flex-col items-center justify-center text-[11px] font-medium text-[#0B5D3B]"
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Legal AI</span>
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
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-[#E5E2D9]/40">
              <div className="flex items-center gap-2">
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

            <div className="flex flex-wrap items-center gap-2.5 font-mono-code text-xs mb-4">
              <span className="text-[#0B5D3B] font-semibold">{readerItem.citation}</span>
              <span>·</span>
              <span className="opacity-70">{readerItem.categoryEn}</span>
              <span>·</span>
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
                Formal Legal Statute / Order
              </button>
            </div>

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
                    BAR COUNCIL ESCROW DESK · STEP {bookingStep} OF 3
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

              <div className="p-4 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-mono-code text-[#66645E]">
                    {bookingAdvocate.bar_council_id} · {bookingAdvocate.city}
                  </p>
                  <p className="text-sm font-medium text-[#141413] mt-0.5">
                    {bookingAdvocate.specialty}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono-code text-[#66645E] block">
                    Escrow Protected
                  </span>
                  <span className="font-mono-code text-sm font-semibold text-[#0B5D3B] tabular-nums">
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
              Zero-Leakage Confidentiality · End-to-End Encrypted Chamber Dossier
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
                  VERIFIED BAR COUNCIL DOSSIER · {dossierAdvocate.bar_council_id}
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
          MODAL 4: GETTING HIRED / ADVOCATE EMPANELMENT APPLICATION MODAL
          ===================================================================== */}
      {applyingRole && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Apply for ${applyingRole.roleTitleEn}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/40 backdrop-blur-xs"
          onClick={() => setApplyingRole(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] p-7 sm:p-9 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 pb-5 mb-5 border-b border-[#E5E2D9]">
              <div>
                <span className="font-mono-code text-xs text-[#0B5D3B] font-semibold">
                  LEGAL CAREERS & BAR PANEL RECRUITMENT · {applyingRole.city.toUpperCase()}
                </span>
                <h3 className="font-legal-serif text-xl sm:text-2xl text-[#141413] mt-1">
                  {applyingRole.roleTitleEn}
                </h3>
                <p className="text-xs text-[#66645E] mt-1">{applyingRole.organizationEn}</p>
              </div>
              <button
                type="button"
                onClick={() => setApplyingRole(null)}
                aria-label="Close Application Modal"
                className="min-h-[44px] min-w-[44px] rounded-full border border-[#E5E2D9] flex items-center justify-center hover:bg-[#F2EFE9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {applicationSubmittedRef ? (
              <div className="p-6 rounded-2xl bg-[#F2EFE9] border border-[#E5E2D9] space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#0B5D3B] text-[#FAF9F5] flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-legal-serif text-2xl text-[#141413]">
                  Dossier Submitted to Chamber Selection Committee
                </h4>
                <p className="text-sm text-[#66645E]">
                  Your application for <strong>{applyingRole.roleTitleEn}</strong> has been logged
                  under reference <strong>{applicationSubmittedRef}</strong>. Bar Council license
                  verification and interview scheduling will be sent via WhatsApp/Email within 48
                  hours.
                </p>
                <p dir="rtl" className="font-urdu text-lg text-[#141413]">
                  آپ کی درخواست کامیابی سے موصول ہو گئی ہے۔ بار کونسل لائسنس کی تصدیق کے بعد آپ سے
                  رابطہ کیا جائے گا۔
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setApplyingRole(null)}
                    className="px-5 py-2.5 min-h-[42px] rounded-xl bg-[#141413] text-[#FAF9F5] text-xs font-medium cursor-pointer"
                  >
                    Return to Home Page
                  </button>
                  <Link
                    href="/lawyer/dashboard"
                    className="px-4 py-2.5 min-h-[42px] rounded-xl border border-[#141413] text-xs font-medium text-[#141413] inline-flex items-center"
                  >
                    Open Advocate CRM →
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCareerApplicationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#141413] mb-1">
                      Advocate / Applicant Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Adv. Muhammad Ali"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-sm focus:outline-none focus:border-[#0B5D3B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#141413] mb-1">
                      Bar Council Enrollment / License No.
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantBarId}
                      onChange={(e) => setApplicantBarId(e.target.value)}
                      placeholder="e.g., PbBC-LHC-20419"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-sm focus:outline-none focus:border-[#0B5D3B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#141413] mb-1">
                      Mobile / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-sm focus:outline-none focus:border-[#0B5D3B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#141413] mb-1">
                      Standing at the Bar
                    </label>
                    <select
                      value={applicantExperience}
                      onChange={(e) => setApplicantExperience(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-sm focus:outline-none focus:border-[#0B5D3B]"
                    >
                      <option>Fresh Law Graduate / Pupil</option>
                      <option>1–2 Years (District Courts)</option>
                      <option>3–5 Years (High Court AHC)</option>
                      <option>6–10+ Years (Senior / ASC)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#141413] mb-1">
                    Notable Reported Cases, Drafting Experience & Practice Focus
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={applicantStatement}
                    onChange={(e) => setApplicantStatement(e.target.value)}
                    placeholder="Summarize your court appearances, drafting expertise, or appellate standing..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-sm focus:outline-none focus:border-[#0B5D3B]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-mono-code text-[#66645E]">
                    {applyingRole.compensationPkr}
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-3 min-h-[44px] rounded-xl bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs sm:text-sm font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Submit Credentials & Application →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 5: WATERMARKED BILINGUAL CONTRACT TEMPLATE PREVIEW MODAL
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
                  {previewTemplate.statuteBadge} · STAMP PAPER: {previewTemplate.stampPaperValue}
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
          DRAWER 6: SLIDE-OVER "ASK QANOONPK AI ASSISTANT" (WITH SEARCH GROUNDING)
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
            <div className="p-6 border-b border-[#E5E2D9] flex items-center justify-between gap-4">
              <div>
                <span className="font-mono-code text-xs uppercase tracking-wider text-[#0B5D3B] font-semibold">
                  QANOONPK STATUTORY RESEARCH DESK
                </span>
                <h2 className="font-legal-serif text-xl text-[#141413] mt-1">
                  Bilingual Legal AI Assistant
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/client/ai-assistant"
                  className="px-3 py-1.5 rounded-lg border border-[#E5E2D9] text-xs font-mono-code text-[#66645E] hover:text-[#141413]"
                >
                  Full Page →
                </Link>
                <button
                  type="button"
                  onClick={() => setAiDrawerOpen(false)}
                  aria-label="Close AI Assistant"
                  className="min-h-[44px] min-w-[44px] rounded-full border border-[#E5E2D9] flex items-center justify-center hover:bg-[#F2EFE9] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

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
                    {msg.grounded && <span className="text-[#0B5D3B]">Search Grounded</span>}
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
                    <div className="mt-3 pt-3 border-t border-[#E5E2D9] flex flex-wrap gap-2 text-[11px] font-mono-code text-[#66645E]">
                      {msg.citations.map((c, idx) => (
                        <span key={idx}>
                          {idx > 0 ? "· " : ""}
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
          MODAL 7: QUICK STATUTE, JUDGMENT & ADVOCATE SEARCH MODAL (⌘K)
          ===================================================================== */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick Search Statutes, Judgments, Clauses, and Advocates"
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
                placeholder="Search Article 199, Sec 489-F PPC, PLD 2025 SC 112, Nikahnama, Lahore..."
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
                  Type any Constitutional Article, PPC Section, Court Judgment, or Advocate city to
                  jump directly.
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
                        {res.category} · {res.citation}
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