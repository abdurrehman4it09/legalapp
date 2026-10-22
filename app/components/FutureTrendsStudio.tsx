"use client";

import React, { useState, useRef } from "react";
import {
  Compass,
  Mic,
  MicOff,
  Sparkles,
  RotateCw,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  Contrast,
  Leaf,
  Trophy,
  BookOpen,
  Scale,
  Landmark,
  Briefcase,
  Calculator,
  Stamp,
  Layers,
  Sliders,
  Check,
  Copy,
  FileCheck2,
} from "lucide-react";

export type VisualThemeMode = "paper" | "dark" | "brutalist";

interface FutureTrendsStudioProps {
  themeMode: VisualThemeMode;
  onThemeModeChange: (mode: VisualThemeMode) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onNavigateSection: (sectionId: string) => void;
  onTriggerAgenticAi: (prompt: string) => void;
  selectedCity: string;
  selectedTopic: string;
}

interface RightsChallengeQuestion {
  id: string;
  pillar: string;
  statuteRef: string;
  scenarioEn: string;
  scenarioUr: string;
  options: Array<{
    id: string;
    textEn: string;
    isCorrect: boolean;
    explanationEn: string;
    explanationUr: string;
  }>;
  xpReward: number;
  badgeTitle: string;
}

const CONSTITUTIONAL_CHALLENGES: RightsChallengeQuestion[] = [
  {
    id: "challenge-fir-154",
    pillar: "Police & Criminal Procedure",
    statuteRef: "CrPC Sec. 154 & 22-A",
    scenarioEn:
      "The local Station House Officer (SHO) refuses to register your FIR for a cognizable offense and tells you to leave the police station. What is your immediate statutory remedy?",
    scenarioUr:
      "اگر متعلقہ تھانے کا ایس ایچ او قابلِ دست اندازی جرم کی ایف آئی آر درج کرنے سے انکار کر دے تو آپ کا فوری قانونی حق کیا ہے؟",
    options: [
      {
        id: "opt-1",
        textEn:
          "File a petition before the Justice of Peace (Sessions Judge) under Section 22-A CrPC",
        isCorrect: true,
        explanationEn:
          "Correct! Under Section 154 CrPC, registering a cognizable FIR is mandatory. Upon refusal, dispatching a written application via registered post to the DPO and filing a Section 22-A petition before the Sessions Judge compels registration.",
        explanationUr:
          "درست جواب! دفعہ 154 کے تحت ایف آئی آر کا اندراج لازمی ہے، اور انکار کی صورت میں سیشن جج (جسٹس آف پیس) کے سامنے دفعہ 22-A کی درخواست دائر کی جاتی ہے۔",
      },
      {
        id: "opt-2",
        textEn: "Wait 90 days before approaching any court or magistrate",
        isCorrect: false,
        explanationEn:
          "Incorrect. Delaying action weakens evidentiary trails. You can immediately send a registered postal complaint to the SP/DPO and move the Sessions Court under Section 22-A CrPC.",
        explanationUr:
          "غلط۔ آپ کو انتظار کرنے کی ضرورت نہیں بلکہ فوری طور پر دفعہ 22-A کے تحت سیشن کورٹ سے رجوع کرنے کا حق حاصل ہے۔",
      },
      {
        id: "opt-3",
        textEn: "Only the Supreme Court of Pakistan can order an FIR in cognizable matters",
        isCorrect: false,
        explanationEn:
          "Incorrect. Your local Additional Sessions Judge acts as an Ex-Officio Justice of Peace under Section 22-A CrPC with direct authority to order FIR registration.",
        explanationUr:
          "غلط۔ ضلعی سیشن جج بطور جسٹس آف پیس دفعہ 22-A کے تحت ایف آئی آر درج کرنے کا حکم دے سکتے ہیں۔",
      },
    ],
    xpReward: 150,
    badgeTitle: "CrPC Sec. 22-A Defender",
  },
  {
    id: "challenge-wirasat-2020",
    pillar: "Islamic Inheritance (Wirasat)",
    statuteRef: "Women's Property Rights Act 2020",
    scenarioEn:
      "Following a father's passing, brothers mutate agricultural and urban property solely in their names and pressure their sister to sign a 'Voluntary Relinquishment Deed'. How does Pakistani law view this?",
    scenarioUr:
      "والد کی وفات کے بعد بھائی بہن کا شرعی حصہ خاندانی دباؤ کے تحت معاف کروا کر انتقال اپنے نام کروا لیتے ہیں۔ پاکستانی قانون اس بارے میں کیا کہتا ہے؟",
    options: [
      {
        id: "opt-a",
        textEn:
          "Uncompensated family 'Tanazul' deeds are void; the Ombudsperson can restore possession within 60 days",
        isCorrect: true,
        explanationEn:
          "Spot on! In Ghulam Ali v. Mst. Ghulam Sarwar Naqvi (PLD 1990 SC 1), the Supreme Court held that inheritance vests automatically upon death. Under the 2020 Act, the Ombudsperson can cancel fraudulent mutations in 60 days.",
        explanationUr:
          "بالکل درست! سپریم کورٹ کے فیصلے (PLD 1990 SC 1) کے مطابق وراثت موت کے فوراً بعد منتقل ہو جاتی ہے اور محتسب 60 دن میں قبضہ دلا سکتا ہے۔",
      },
      {
        id: "opt-b",
        textEn: "Daughters only inherit if the deceased father left a written registered Will",
        isCorrect: false,
        explanationEn:
          "Incorrect. Quranic Faraid shares vest automatically by operation of law upon the moment of death—no Will is required for legal heirs.",
        explanationUr:
          "غلط۔ شرعی حصص وصیت کے بغیر ہی وفات کے فوراً بعد قانوناً نافذ ہو جاتے ہیں۔",
      },
      {
        id: "opt-c",
        textEn: "No claim can be filed if 3 years have passed since the mutation",
        isCorrect: false,
        explanationEn:
          "Incorrect. The Supreme Court has repeatedly ruled that limitation does not run against a co-sharer (sister/daughter) deprived of her Islamic inheritance through fraud.",
        explanationUr:
          "غلط۔ سپریم کورٹ کے مطابق وراثت میں دھوکہ دہی یا محرومی پر زائد المیعاد (Limitation) کا قانون لاگو نہیں ہوتا۔",
      },
    ],
    xpReward: 150,
    badgeTitle: "Wirasat Guardian",
  },
  {
    id: "challenge-nikah-18",
    pillar: "Family Law & Nikahnama",
    statuteRef: "MFLO 1961 · Clause 18",
    scenarioEn:
      "During marriage registration, the Nikah Khwan draws a diagonal line across Clause 18 of the standard Nikahnama without asking the bride. What legal right is affected?",
    scenarioUr:
      "نکاح رجسٹریشن کے وقت نکاح خواں دلہن سے پوچھے بغیر کالم نمبر 18 پر لکیر کھینچ دیتا ہے۔ اس سے کون سا قانونی حق متاثر ہوتا ہے؟",
    options: [
      {
        id: "opt-x",
        textEn:
          "Talaq-e-Tafweez (Delegated Right of Divorce), though her statutory right to Khula remains intact",
        isCorrect: true,
        explanationEn:
          "Correct! Clause 18 governs Talaq-e-Tafweez (delegated divorce without court intervention). Unauthorized crossing out is punishable in Punjab, and even if crossed out, her statutory right to judicial Khula remains absolute.",
        explanationUr:
          "درست! کالم 18 طلاقِ تفویض سے متعلق ہے۔ اسے بغیر اجازت کاٹنا جرم ہے، تاہم عورت کا عدالتی خلع کا حق ہر صورت برقرار رہتا ہے۔",
      },
      {
        id: "opt-y",
        textEn: "Crossing Clause 18 cancels the entire marriage contract automatically",
        isCorrect: false,
        explanationEn:
          "Incorrect. The Nikah remains valid, and the bride can apply to rectify the Nikahnama or dissolve the marriage through Family Court Khula.",
        explanationUr:
          "غلط۔ نکاح برقرار رہتا ہے اور فیملی کورٹ سے خلع یا درستگی کا حق حاصل رہتا ہے۔",
      },
      {
        id: "opt-z",
        textEn: "Clause 18 only applies to commercial stamp duty",
        isCorrect: false,
        explanationEn:
          "Incorrect. Clause 18 specifically records whether the husband has delegated the power of divorce (Talaq-e-Tafweez) to the wife.",
        explanationUr:
          "غلط۔ کالم 18 خاص طور پر بیوی کو تفویض کردہ حقِ طلاق سے متعلق ہے۔",
      },
    ],
    xpReward: 150,
    badgeTitle: "Nikahnama Scholar",
  },
];

const ORBITAL_NODES = [
  {
    id: "triage-desk",
    code: "01",
    labelEn: "Adaptive Triage",
    labelUr: "قانونی تشخیص",
    statute: "Art. 4 & 10-A",
    icon: Compass,
  },
  {
    id: "sovereign-codex",
    code: "02",
    labelEn: "Constitution & PPC",
    labelUr: "آئین اور تعزیرات",
    statute: "280 Articles · 511 Sec",
    icon: BookOpen,
  },
  {
    id: "court-judgments",
    code: "03",
    labelEn: "All Court Judgments",
    labelUr: "عدالتی فیصلے",
    statute: "SCMR · PLD · CLC",
    icon: Landmark,
  },
  {
    id: "verified-advocates",
    code: "04",
    labelEn: "Advocates & Careers",
    labelUr: "وکلاء اور ملازمتیں",
    statute: "PBC Roll & Chambers",
    icon: Briefcase,
  },
  {
    id: "wirasat-calculator",
    code: "05",
    labelEn: "Wirasat & Decoder",
    labelUr: "وراثت اور ڈی کوڈر",
    statute: "Surah An-Nisa · MFLO",
    icon: Calculator,
  },
  {
    id: "legal-aid-news",
    code: "06",
    labelEn: "Legal Aid & Forum",
    labelUr: "مفت قانونی امداد",
    statute: "Act 2020 · Pro-Bono",
    icon: Scale,
  },
];

const ROTUNDA_FACES = [
  {
    face: "front",
    code: "CONSTITUTION 1973",
    titleEn: "Fundamental Rights & Writ Jurisdiction",
    titleUr: "بنیادی آئینی حقوق اور رٹ دائرہ اختیار",
    articles: "Articles 8 to 28 · Article 199 & 184(3)",
    targetSection: "sovereign-codex",
    summary:
      "Supreme law of the land guaranteeing fair trial (Art. 10-A), dignity (Art. 14), property rights (Art. 24), and High Court constitutional writs.",
  },
  {
    face: "right",
    code: "PAKISTAN PENAL CODE",
    titleEn: "Criminal Offenses, FIR & Bail Remedies",
    titleUr: "تعزیراتِ پاکستان، ایف آئی آر اور ضمانت",
    articles: "Act XLV of 1860 · CrPC Sec. 154, 22-A, 497 & 498",
    targetSection: "sovereign-codex",
    summary:
      "Substantive criminal code and procedural safeguards protecting citizens against unlawful arrest, FIR refusal, and financial fraud.",
  },
  {
    face: "back",
    code: "SUPERIOR JUDICIARY",
    titleEn: "Supreme Court, High Courts & Federal Shariat",
    titleUr: "سپریم کورٹ، ہائی کورٹس اور وفاقی شرعی عدالت",
    articles: "Binding Precedents under Articles 189 & 201",
    targetSection: "court-judgments",
    summary:
      "Authoritative rulings from SC, LHC, SHC, IHC, PHC, BHC, and FSC establishing binding ratio decidendi across all lower courts.",
  },
  {
    face: "left",
    code: "CITIZEN PROTECTION",
    titleEn: "Wirasat Calculator, Pro-Bono Aid & Bar Counsel",
    titleUr: "شرعی وراثت، مفت قانونی امداد اور تصدیق شدہ وکلاء",
    articles: "Legal Aid Act 2020 · Family Courts Act 1964",
    targetSection: "wirasat-calculator",
    summary:
      "Direct tools to compute Quranic inheritance shares, decode Nikahnama clauses, verify Bar advocates, and claim state-funded representation.",
  },
];

// Clearstreet.io + Ellipsus + ISI Global "Pathed" Scrollytelling Deck Stages
const SCROLLYTELLING_STAGES = [
  {
    step: "01",
    kicker: "STAGE 01 · INCIDENT & EVIDENTIARY CAPTURE",
    titleEn: "Transform a Raw Dispute into a Verifiable Statutory Timeline",
    titleUr: "واقعات اور شواہد کو مستند قانونی ٹائم لائن میں تبدیل کریں",
    statuteTag: "Qanun-e-Shahadat Order 1984 · Art. 70 & 164",
    descriptionEn:
      "Just as Clearstreet.io turns complex financial data into fluid visual screens, QanoonPK structures your WhatsApp records, banking slips, Fard-e-Malkiyat, or Nikahnama into an admissible evidentiary chronology.",
    marginNoteAuthor: "Adv. Sikandar Hayat, ASC",
    marginNoteText:
      "Under Article 164 of Qanun-e-Shahadat, modern electronic records (bank transfers, call logs, Nadra FRC) carry primary evidentiary weight when preserved with timestamps.",
    metricLabel: "Admissibility Readiness",
    metricValue: "96.4%",
    targetSection: "triage-desk",
  },
  {
    step: "02",
    kicker: "STAGE 02 · ELLIPSUS-STYLE COLLABORATIVE MARGIN ANNOTATIONS",
    titleEn: "Compare Verbatim Gazette Text with Plain-Language Citizen Rights",
    titleUr: "سرکاری قانونی متن اور عام فہم اردو تشریح کا آمنے سامنے موازنہ",
    statuteTag: "Constitution Art. 10-A · Fair Trial & Due Process",
    descriptionEn:
      "Inspired by Ellipsus's side-by-side editorial margin notes, every dense colonial-era section of the Pakistan Penal Code or Civil Procedure Code is paired with plain human language and red-flag warnings.",
    marginNoteAuthor: "QanoonPK Editorial Desk",
    marginNoteText:
      "Never sign a blank stamp paper or an unverified compromise deed (Razi-Nama) at a police station without checking the Clause Decoder first.",
    metricLabel: "Statutes Decoded",
    metricValue: "790+ Sections",
    targetSection: "clause-decoder",
  },
  {
    step: "03",
    kicker: "STAGE 03 · INGAMANA & PAFFI 3D PRECEDENT MATCHING",
    titleEn: "Bind Lower Courts Using Supreme Court Ratio Decidendi",
    titleUr: "سپریم کورٹ اور ہائی کورٹس کے پابند کن نظائر کا حوالہ دیں",
    statuteTag: "Constitution Art. 189 & 201 · Binding Precedent",
    descriptionEn:
      "Under Articles 189 and 201 of the Constitution, every Civil Judge, Magistrate, and SHO is legally bound by Supreme Court and High Court judgments. We surface the exact PLD/SCMR citation for your pleading.",
    marginNoteAuthor: "SCMR Archival Wing",
    marginNoteText:
      "Citing Sughran Bibi (PLD 2018 SC 595) or Ghulam Ali (PLD 1990 SC 1) at the very first hearing prevents frivolous adjournments.",
    metricLabel: "Courts Covered",
    metricValue: "All 7 Superior Courts",
    targetSection: "court-judgments",
  },
  {
    step: "04",
    kicker: "STAGE 04 · STAMPED INSTRUMENT & BAR ESCROW EXECUTION",
    titleEn: "Generate Court-Ready Drafts & Retain Verified Bar Counsel",
    titleUr: "عدالتی مسودہ تیار کریں اور تصدیق شدہ وکیل کی خدمات حاصل کریں",
    statuteTag: "Legal Practitioners & Bar Councils Act 1973",
    descriptionEn:
      "Complete the path from citizen confusion to courtroom execution: generate a bilingual petition on the Stamp Workbench below or book a PBC-verified advocate with milestone escrow protection.",
    marginNoteAuthor: "PBC Verification Desk",
    marginNoteText:
      "All consultation fees remain protected in Bar Escrow until your formal Wakalat-Nama and initial petition are filed.",
    metricLabel: "Verified Advocates",
    metricValue: "PBC Roll Checked",
    targetSection: "verified-advocates",
  },
];

// Ingamana & Paffi 3D Perspective Funnel Case Studies
const INGAMANA_FUNNEL_CASES = [
  {
    id: "funnel-1",
    citation: "PLD 2025 SC 112",
    court: "Supreme Court of Pakistan",
    titleEn: "Mandatory FIR Registration & Section 22-A Citizen Remedy",
    titleUr: "ایف آئی آر کا لازمی اندراج اور دفعہ 22-A کا حق",
    impactMetric: "24-Hour Relief",
    summaryEn:
      "Police cannot refuse a cognizable complaint; citizens may directly petition the Sessions Judge as Justice of Peace.",
    sectionTarget: "court-judgments",
  },
  {
    id: "funnel-2",
    citation: "PLD 1990 SC 1",
    court: "Supreme Court Appellate Bench",
    titleEn: "Automatic Vesting of Daughters' & Sisters' Islamic Wirasat",
    titleUr: "بیٹیوں اور بہنوں کے شرعی وراثتی حصے کا خودکار نفاذ",
    impactMetric: "Zero Limitation Bar",
    summaryEn:
      "Fraudulent family relinquishment deeds are void ab initio; ownership transfers at the exact moment of the ancestor's death.",
    sectionTarget: "wirasat-calculator",
  },
  {
    id: "funnel-3",
    citation: "2024 SCMR 912",
    court: "Supreme Court Criminal Bench",
    titleEn: "Section 489-F Cheque Dishonor vs. Civil Business Security",
    titleUr: "دفعہ 489-F چیک ڈس آنر اور ضمانت کا معیار",
    impactMetric: "Pre-Arrest Bail Rule",
    summaryEn:
      "Where a cheque was issued purely as a security instrument rather than repayment of an existing obligation, bail cannot be withheld as punishment.",
    sectionTarget: "sovereign-codex",
  },
  {
    id: "funnel-4",
    citation: "PLD 2023 LHC 410",
    court: "Lahore High Court Family Bench",
    titleEn: "Khula Within 6 Months & Protection of Non-Relinquished Mehr",
    titleUr: "چھ ماہ میں خلع کا فیصلہ اور حق مہر کا تحفظ",
    impactMetric: "Sec. 12-A Mandate",
    summaryEn:
      "Family Courts must conclude dissolution suits within six months; coercive retention of dowry articles (Jahez) is unlawful.",
    sectionTarget: "clause-decoder",
  },
];

export default function FutureTrendsStudio({
  themeMode,
  onThemeModeChange,
  reducedMotion,
  onToggleReducedMotion,
  onNavigateSection,
  onTriggerAgenticAi,
  selectedCity,
  selectedTopic,
}: FutureTrendsStudioProps) {
  // 0. Immersive Garden Cursor-Reactive Spotlight Coordinates
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // 1. Daylight Computer Inspired "Day-to-Night" Split Curtain Slider (0 to 100%)
  const [daylightSplit, setDaylightSplit] = useState<number>(52);

  // 2. Clearstreet.io + ISI Global + Ellipsus Scrollytelling Active Stage
  const [scrollyStageIdx, setScrollyStageIdx] = useState<number>(0);

  // 3. Ingamana & Paffi 3D Perspective Funnel Hover State
  const [hoveredFunnelIdx, setHoveredFunnelIdx] = useState<number>(0);

  // 4. Bored Cow / B-Egg Farm "Customize & Stamp Your Own Legal Instrument" Workbench State
  const [stampDenomination, setStampDenomination] = useState<"Rs. 100" | "Rs. 500" | "Rs. 1,200">(
    "Rs. 500"
  );
  const [sealStyle, setSealStyle] = useState<
    "Supreme Court Archival Seal" | "High Court Writ Seal" | "Notary Public Attested"
  >("Supreme Court Archival Seal");
  const [instrumentType, setInstrumentType] = useState<
    "Section 22-A FIR Petition" | "Wirasat Ombudsperson Claim" | "Sec 489-F Legal Notice"
  >("Section 22-A FIR Petition");
  const [includeBarCounterSign, setIncludeBarCounterSign] = useState<boolean>(true);
  const [stampCopied, setStampCopied] = useState<boolean>(false);

  // 5. Arcturis Real-World Data Limitation & Court-Fee Calculator State
  const [selectedLimitationCase, setSelectedLimitationCase] = useState<
    "writ_199" | "cheque_489f" | "wirasat_2020" | "khula_family"
  >("writ_199");

  // 6. 360° Interactive 3D Rotunda State (Trend 1)
  const [rotationY, setRotationY] = useState<number>(-22);
  const [rotationX] = useState<number>(8);
  const [activeFaceIndex, setActiveFaceIndex] = useState<number>(0);
  const [explodedLayers, setExplodedLayers] = useState<boolean>(false);
  const isDragging3D = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const startRotY = useRef<number>(-22);

  // 7. Experimental Radial / Nonlinear Compass State (Trend 2)
  const [radialOpen, setRadialOpen] = useState<boolean>(false);
  const [selectedOrbitNode, setSelectedOrbitNode] = useState<string>("triage-desk");

  // 8. Voice-Activated Interface State (AI Trend 2)
  const [voiceListening, setVoiceListening] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>("");
  const [voiceStatusMessage, setVoiceStatusMessage] = useState<string>(
    "Tap Mic or choose a Voice Command to navigate or query Pakistani law hands-free."
  );

  // 9. Gamified Constitutional Rights Quest State (Trend 7)
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>([
    "challenge-fir-154",
  ]);
  const [citizenXp, setCitizenXp] = useState<number>(350);
  const [streakDays] = useState<number>(4);

  // 10. Progressive Lead Nurturing State (AI Trend 3)
  const [nurtureStage, setNurtureStage] = useState<1 | 2 | 3>(1);
  const [urgencyLevel, setUrgencyLevel] = useState<"immediate_24h" | "notice_received" | "planning">(
    "immediate_24h"
  );
  const [evidenceStatus, setEvidenceStatus] = useState<
    "complete_docs" | "partial_docs" | "need_obtain"
  >("partial_docs");

  const activeChallenge = CONSTITUTIONAL_CHALLENGES[currentChallengeIdx];
  const activeRotundaFace = ROTUNDA_FACES[activeFaceIndex];
  const activeScrollyStage = SCROLLYTELLING_STAGES[scrollyStageIdx];

  const LIMITATION_DATA = {
    writ_199: {
      label: "High Court Writ (Art. 199)",
      period: "No Fixed Days (Laches Rule: ~90 Days)",
      courtFee: "PKR 500 Court Fee Stamp",
      forum: "High Court Constitutional Bench",
      statute: "Article 199 Constitution 1973",
    },
    cheque_489f: {
      label: "Dishonored Cheque (Sec. 489-F)",
      period: "6 Months Cheque Validity + Immediate FIR",
      courtFee: "Zero Police Fee · Order XXXVII Summary Suit",
      forum: "Police Station / Sessions Court",
      statute: "PPC Sec. 489-F & CPC Order 37",
    },
    wirasat_2020: {
      label: "Denied Female Wirasat Share",
      period: "Zero Limitation Bar (Perpetual Co-Sharer)",
      courtFee: "PKR 0 (Free Ombudsperson Filing)",
      forum: "Provincial Ombudsperson (60-Day Order)",
      statute: "Women's Property Rights Act 2020",
    },
    khula_family: {
      label: "Dissolution by Khula & Maintenance",
      period: "6-Month Statutory Disposal Mandate",
      courtFee: "PKR 15 Nominal Family Court Stamp",
      forum: "Family Court (Sec. 12-A)",
      statute: "West Pakistan Family Courts Act 1964",
    },
  }[selectedLimitationCase];

  const rotateToFace = (idx: number) => {
    setActiveFaceIndex(idx);
    setRotationY(idx * -90 - 15);
  };

  const handle3DPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging3D.current = true;
    dragStartX.current = e.clientX;
    startRotY.current = rotationY;
  };

  const handle3DPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging3D.current) return;
    const deltaX = e.clientX - dragStartX.current;
    const nextY = startRotY.current + deltaX * 0.65;
    setRotationY(nextY);
    const normalized = (((-Math.round(nextY / 90)) % 4) + 4) % 4;
    setActiveFaceIndex(normalized);
  };

  const handle3DPointerUp = () => {
    isDragging3D.current = false;
  };

  const executeVoiceCommand = (rawCommand: string) => {
    const cmd = rawCommand.toLowerCase();
    setVoiceTranscript(rawCommand);

    if (cmd.includes("dark") || cmd.includes("night")) {
      onThemeModeChange("dark");
      setDaylightSplit(15);
      setVoiceStatusMessage("Executed: Switched workspace to OLED Sovereign Dark Mode.");
    } else if (cmd.includes("paper") || cmd.includes("light")) {
      onThemeModeChange("paper");
      setDaylightSplit(85);
      setVoiceStatusMessage("Executed: Switched workspace to Warm Alabaster Paper Mode.");
    } else if (cmd.includes("wirasat") || cmd.includes("inheritance") || cmd.includes("وراثت")) {
      onNavigateSection("wirasat-calculator");
      setVoiceStatusMessage(
        "Executed: Scrolled to Islamic Inheritance (Wirasat) Share Calculator."
      );
    } else if (cmd.includes("judgment") || cmd.includes("court") || cmd.includes("فیصلے")) {
      onNavigateSection("court-judgments");
      setVoiceStatusMessage(
        "Executed: Scrolled to Superior Courts of Pakistan Judgment Repository."
      );
    } else if (cmd.includes("lawyer") || cmd.includes("advocate") || cmd.includes("وکیل")) {
      onNavigateSection("verified-advocates");
      setVoiceStatusMessage("Executed: Opened Verified Bar Council Advocates Directory.");
    } else {
      onTriggerAgenticAi(rawCommand);
      setVoiceStatusMessage(`Dispatched to Agentic Legal AI: "${rawCommand}"`);
    }
  };

  const toggleMicrophoneListening = () => {
    if (voiceListening) {
      setVoiceListening(false);
      return;
    }

    const SpeechRecognitionAPI =
      typeof window !== "undefined"
        ? (window as unknown as Record<string, unknown>).SpeechRecognition ||
          (window as unknown as Record<string, unknown>).webkitSpeechRecognition
        : null;

    if (SpeechRecognitionAPI && typeof SpeechRecognitionAPI === "function") {
      try {
        const recognition = new (SpeechRecognitionAPI as new () => {
          lang: string;
          interimResults: boolean;
          maxAlternatives: number;
          onresult: (event: {
            results: ArrayLike<ArrayLike<{ transcript: string }>>;
          }) => void;
          onerror: () => void;
          onend: () => void;
          start: () => void;
        })();
        recognition.lang = "en-PK";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        setVoiceListening(true);
        setVoiceStatusMessage("Listening... Speak a legal question or navigation command.");

        recognition.onresult = (event) => {
          const spoken = event.results?.[0]?.[0]?.transcript || "";
          if (spoken) {
            executeVoiceCommand(spoken);
          }
          setVoiceListening(false);
        };
        recognition.onerror = () => {
          setVoiceListening(false);
          setVoiceStatusMessage(
            "Microphone permission unavailable in preview iframe — use any instant Voice Command button below."
          );
        };
        recognition.onend = () => {
          setVoiceListening(false);
        };
        recognition.start();
      } catch {
        setVoiceListening(false);
        setVoiceStatusMessage(
          "Voice recognition initialized via instant command presets below."
        );
      }
    } else {
      setVoiceListening(true);
      setVoiceStatusMessage("Simulating Voice Acoustic Capture (en-PK / ur-PK)...");
      setTimeout(() => {
        setVoiceListening(false);
        executeVoiceCommand(
          `Compute my legal protection roadmap for ${selectedTopic} in ${selectedCity}`
        );
      }, 1400);
    }
  };

  const handleSelectChallengeOption = (optionId: string, isCorrect: boolean) => {
    setSelectedOptionId(optionId);
    if (isCorrect && !completedChallengeIds.includes(activeChallenge.id)) {
      setCompletedChallengeIds((prev) => [...prev, activeChallenge.id]);
      setCitizenXp((prev) => prev + activeChallenge.xpReward);
    }
  };

  const readinessScore =
    (urgencyLevel === "immediate_24h" ? 38 : urgencyLevel === "notice_received" ? 34 : 28) +
    (evidenceStatus === "complete_docs" ? 42 : evidenceStatus === "partial_docs" ? 28 : 16) +
    nurtureStage * 6;

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setCursorPos({ x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) });
      }}
      className="relative space-y-12"
    >
      {/* =====================================================================
          1. PERSONALIZATION, DARK MODE, SUSTAINABLE ECO-SCORE & VOICE BAR
          ===================================================================== */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-[#F2EFE9] p-4 sm:p-5 transition-editorial">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#66645E] mr-1">
              Surface Engine:
            </span>
            <div
              role="group"
              aria-label="Interface Theme Mode"
              className="inline-flex items-center p-1 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] gap-1"
            >
              <button
                type="button"
                onClick={() => {
                  onThemeModeChange("paper");
                  setDaylightSplit(82);
                }}
                className={`kinetic-btn px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-editorial cursor-pointer ${
                  themeMode === "paper"
                    ? "bg-[#141413] text-[#FAF9F5]"
                    : "text-[#66645E] hover:text-[#141413]"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="kinetic-btn-label">Alabaster Paper</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onThemeModeChange("dark");
                  setDaylightSplit(18);
                }}
                className={`kinetic-btn px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-editorial cursor-pointer ${
                  themeMode === "dark"
                    ? "bg-[#0B5D3B] text-[#FAF9F5]"
                    : "text-[#66645E] hover:text-[#141413]"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="kinetic-btn-label">OLED Dark Mode</span>
              </button>
              <button
                type="button"
                onClick={() => onThemeModeChange("brutalist")}
                className={`kinetic-btn px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-editorial cursor-pointer ${
                  themeMode === "brutalist"
                    ? "bg-[#141413] text-[#FAF9F5]"
                    : "text-[#66645E] hover:text-[#141413]"
                }`}
              >
                <Contrast className="w-3.5 h-3.5" />
                <span className="kinetic-btn-label">Neo-Brutalist</span>
              </button>
            </div>
          </div>

          {/* Center: Voice-Activated Legal Navigator */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 justify-center">
            <button
              type="button"
              onClick={toggleMicrophoneListening}
              className={`kinetic-btn px-4 py-2 min-h-[40px] rounded-xl text-xs font-medium inline-flex items-center gap-2 transition-editorial cursor-pointer ${
                voiceListening
                  ? "bg-[#0B5D3B] text-[#FAF9F5] shadow-md"
                  : "bg-[#FAF9F5] text-[#141413] border border-[#141413] hover:bg-[#141413] hover:text-[#FAF9F5]"
              }`}
            >
              {voiceListening ? (
                <MicOff className="w-3.5 h-3.5" />
              ) : (
                <Mic className="w-3.5 h-3.5 text-[#0B5D3B]" />
              )}
              <span className="kinetic-btn-label">
                {voiceListening ? "Listening (en-PK / اردو)..." : "Voice Command"}
              </span>
            </button>

            <div className="hidden xl:flex items-center gap-1.5 text-xs">
              {[
                { label: "“Wirasat Calculator”", cmd: "Open Wirasat Calculator" },
                { label: "“Court Judgments”", cmd: "Show Superior Court Judgments" },
                {
                  label: "“Draft FIR Sec 22-A”",
                  cmd: "Draft a Section 22-A CrPC petition for FIR refusal",
                },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => executeVoiceCommand(preset.cmd)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#E5E2D9] hover:border-[#0B5D3B] text-[11px] font-mono-code text-[#66645E] hover:text-[#141413] transition-editorial cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Sustainable Web & Experimental Radial Compass Trigger */}
          <div className="flex items-center gap-3">
            <div
              title="Sustainable Web Design: Vector SVG 3D, zero heavy video bloat, 0.08g CO2 per view"
              className="hidden sm:inline-flex items-center gap-1.5 font-mono-code text-[11px] text-[#0B5D3B]"
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>0.08g CO₂ · Eco A+</span>
            </div>

            <button
              type="button"
              onClick={onToggleReducedMotion}
              className="px-2.5 py-1.5 rounded-lg border border-[#E5E2D9] bg-[#FAF9F5] text-[11px] font-mono-code text-[#66645E] hover:text-[#141413] cursor-pointer"
            >
              {reducedMotion ? "Motion: Calm" : "Motion: Kinetic"}
            </button>

            <button
              type="button"
              onClick={() => setRadialOpen((prev) => !prev)}
              className="kinetic-btn px-3.5 py-2 min-h-[40px] rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-xs font-medium inline-flex items-center gap-1.5 hover:bg-[#09482E] transition-editorial cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="kinetic-btn-label">
                {radialOpen ? "Close Orbital Map" : "Orbital Compass"}
              </span>
            </button>
          </div>
        </div>

        {voiceTranscript && (
          <div className="mt-3 pt-3 border-t border-[#E5E2D9] flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
            <span className="text-[#141413]">
              Voice Input: <strong className="text-[#0B5D3B]">“{voiceTranscript}”</strong>
            </span>
            <span className="text-[#66645E]">{voiceStatusMessage}</span>
          </div>
        )}

        {/* Experimental Radial / Orbital Constitutional Compass Drawer */}
        {radialOpen && (
          <div className="mt-5 pt-6 border-t border-[#E5E2D9] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="font-mono-code text-xs uppercase tracking-[0.14em] text-[#0B5D3B] font-semibold">
                EXPERIMENTAL NONLINEAR NAVIGATION
              </span>
              <h3 className="font-legal-serif text-2xl text-[#141413] mt-1">
                Sovereign Constitutional Compass &amp; Nonlinear Legal Map
              </h3>
              <p dir="rtl" className="font-urdu text-lg text-[#66645E] mt-1">
                غیر روایتی مداری نقشہ — کسی بھی قانونی ستون تک براہِ راست رسائی
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {ORBITAL_NODES.map((node) => {
                  const IconComp = node.icon;
                  const isSelected = selectedOrbitNode === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => {
                        setSelectedOrbitNode(node.id);
                        onNavigateSection(node.id);
                      }}
                      className={`p-3 rounded-xl border text-left transition-editorial cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                          : "bg-[#FAF9F5] text-[#141413] border-[#E5E2D9] hover:border-[#141413]"
                      }`}
                    >
                      <IconComp
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isSelected ? "text-[#10B981]" : "text-[#0B5D3B]"
                        }`}
                      />
                      <div>
                        <div className="text-xs font-semibold">{node.labelEn}</div>
                        <div
                          className={`text-[10px] font-mono-code ${
                            isSelected ? "text-[#FAF9F5]/75" : "text-[#66645E]"
                          }`}
                        >
                          {node.statute}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7 flex items-center justify-center py-4">
              <div className="relative w-full max-w-[460px] h-[300px] rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] p-6 flex items-center justify-center overflow-hidden">
                <div className="w-56 h-56 rounded-full border border-dashed border-[#141413]/25 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-[#0B5D3B]/30 flex flex-col items-center justify-center text-center p-2 bg-[#F2EFE9]">
                    <span className="font-mono-code text-[10px] text-[#0B5D3B] font-semibold">
                      ART. 10-A
                    </span>
                    <span className="font-legal-serif text-sm font-bold text-[#141413]">
                      QanoonPK Core
                    </span>
                    <span dir="rtl" className="font-urdu text-xs text-[#66645E]">
                      مرکزِ انصاف
                    </span>
                  </div>
                </div>

                {ORBITAL_NODES.map((node, idx) => {
                  const positions = [
                    "top-3 left-1/2 -translate-x-1/2",
                    "top-10 right-4",
                    "bottom-10 right-4",
                    "bottom-3 left-1/2 -translate-x-1/2",
                    "bottom-10 left-4",
                    "top-10 left-4",
                  ];
                  const active = selectedOrbitNode === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => {
                        setSelectedOrbitNode(node.id);
                        onNavigateSection(node.id);
                      }}
                      className={`absolute ${positions[idx]} px-3 py-1.5 rounded-xl border text-xs font-medium transition-editorial cursor-pointer ${
                        active
                          ? "bg-[#0B5D3B] text-[#FAF9F5] border-[#0B5D3B] scale-105 shadow-sm"
                          : "bg-[#FAF9F5] text-[#141413] border-[#E5E2D9] hover:border-[#141413]"
                      }`}
                    >
                      <span className="font-mono-code text-[10px] mr-1 opacity-75">
                        {node.code}.
                      </span>
                      <span>{node.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          2. CLEARSTREET.IO + ISI GLOBAL + ELLIPSUS SCROLLYTELLING & "PATHED"
          LEGAL JOURNEY DECK (With Continuous Organic SVG Path & Margin Notes)
          ===================================================================== */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-[#FAF9F5] p-6 sm:p-10 arcturis-dot-matrix relative overflow-hidden">
        {/* Immersive Garden Subtle Cursor-Reactive Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(520px circle at ${cursorPos.x}% ${cursorPos.y}%, rgba(11, 93, 59, 0.08), transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E5E2D9]">
            <div>
              <span className="font-mono-code text-xs uppercase tracking-[0.14em] text-[#0B5D3B] font-semibold">
                INTERACTIVE SCROLLYTELLING &amp; ISI-PATHED CASE NARRATIVE
              </span>
              <h3 className="font-legal-serif text-2xl sm:text-3xl text-[#141413] mt-1">
                From Citizen Crisis to Supreme Court Enforcement — Step by Step
              </h3>
            </div>
            <span dir="rtl" className="font-urdu text-xl text-[#0B5D3B]">
              شہری شکایت سے عدالتی فیصلے تک کا مکمل سفر
            </span>
          </div>

          {/* ISI Global Inspired Continuous Organic SVG Path Across 4 Stages */}
          <div className="my-6 relative">
            <svg
              viewBox="0 0 1000 54"
              className="w-full h-12 overflow-visible hidden md:block"
              aria-hidden="true"
            >
              <path
                d="M 20 27 C 180 4, 320 50, 500 27 C 680 4, 820 50, 980 27"
                fill="none"
                stroke="#E5E2D9"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
              <path
                d="M 20 27 C 180 4, 320 50, 500 27 C 680 4, 820 50, 980 27"
                fill="none"
                stroke="#0B5D3B"
                strokeWidth="3.5"
                strokeDasharray="1000"
                strokeDashoffset={1000 - ((scrollyStageIdx + 1) / 4) * 1000}
                style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
            </svg>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SCROLLYTELLING_STAGES.map((st, idx) => {
                const isActive = idx === scrollyStageIdx;
                return (
                  <button
                    key={st.step}
                    type="button"
                    onClick={() => setScrollyStageIdx(idx)}
                    className={`p-4 rounded-xl border text-left transition-editorial cursor-pointer ${
                      isActive
                        ? "bg-[#141413] text-[#FAF9F5] border-[#141413] -translate-y-0.5 shadow-md"
                        : "bg-[#F2EFE9]/90 text-[#141413] border-[#E5E2D9] hover:border-[#141413]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono-code text-xs">
                      <span className={isActive ? "text-[#34D399]" : "text-[#0B5D3B]"}>
                        STAGE {st.step}
                      </span>
                      <span>{st.metricValue}</span>
                    </div>
                    <div className="font-legal-serif text-sm font-bold mt-1.5 line-clamp-1">
                      {st.titleEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clearstreet.io Dynamic Screen + Ellipsus Side-by-Side Collaborative Margin Note */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-6">
            <div className="lg:col-span-8 rounded-2xl bg-[#F2EFE9] border border-[#E5E2D9] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-[#0B5D3B] mb-3">
                  <span>{activeScrollyStage.kicker}</span>
                  <span>{activeScrollyStage.statuteTag}</span>
                </div>

                <h4 className="font-legal-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                  {activeScrollyStage.titleEn}
                </h4>
                <p dir="rtl" className="mt-2 font-urdu text-xl text-[#141413]/90">
                  {activeScrollyStage.titleUr}
                </p>
                <p className="mt-3 text-sm sm:text-base text-[#66645E] leading-relaxed">
                  {activeScrollyStage.descriptionEn}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E2D9] flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono-code text-xs text-[#141413]">
                  {activeScrollyStage.metricLabel}:{" "}
                  <strong className="text-[#0B5D3B]">{activeScrollyStage.metricValue}</strong>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onNavigateSection(activeScrollyStage.targetSection)}
                    className="kinetic-btn px-4 py-2 rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-xs font-medium inline-flex items-center gap-1.5 hover:bg-[#09482E] cursor-pointer"
                  >
                    <span className="kinetic-btn-label">Open Live Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setScrollyStageIdx((prev) => (prev + 1) % 4)}
                    className="px-3.5 py-2 rounded-xl border border-[#141413] text-xs font-mono-code text-[#141413] hover:bg-[#141413] hover:text-[#FAF9F5] cursor-pointer"
                  >
                    Next Stage →
                  </button>
                </div>
              </div>
            </div>

            {/* Ellipsus.com Inspired Collaborative Counsel Margin Card */}
            <div className="lg:col-span-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono-code text-[#66645E] pb-3 mb-4 border-b border-[#E5E2D9]">
                  <span>ELLIPSUS MARGIN ANNOTATION</span>
                  <span className="text-[#0B5D3B] font-semibold">VERIFIED COUNSEL NOTE</span>
                </div>
                <p className="font-legal-serif italic text-sm sm:text-base text-[#141413] leading-relaxed">
                  “{activeScrollyStage.marginNoteText}”
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E2D9] flex items-center justify-between text-xs font-mono-code">
                <span className="text-[#141413] font-semibold">
                  {activeScrollyStage.marginNoteAuthor}
                </span>
                <span className="text-[#0B5D3B]">Stage {activeScrollyStage.step}/04</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. CTRL WALLET + DAYLIGHT COMPUTER + BORED COW + INGAMANA + ARCTURIS
          INTERACTIVE BENTO-BOX COMMAND GRID
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* BENTO CELL A (6 Cols): DAYLIGHT COMPUTER "DAY-TO-NIGHT" INTERACTIVE SPLIT CURTAIN */}
        <div className="lg:col-span-6 rounded-2xl border border-[#E5E2D9] bg-[#F2EFE9] p-6 sm:p-7 bento-cell flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E5E2D9]">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#0B5D3B] font-semibold">
                <Sliders className="w-3.5 h-3.5" />
                <span>DAYLIGHT COMPUTER · DAY-TO-NIGHT COURTROOM OPTICS</span>
              </div>
              <span className="font-mono-code text-xs text-[#66645E] tabular-nums">
                {daylightSplit}% Daylight / {100 - daylightSplit}% OLED Night
              </span>
            </div>

            <h4 className="font-legal-serif text-xl text-[#141413]">
              Scrub Across Sunlit Courtroom Paper &amp; Midnight Chamber OLED
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-[#66645E]">
              Drag the optical slider to inspect how QanoonPK renders verbatim Supreme Court
              pleadings under harsh courtroom glare vs. late-night chamber preparation.
            </p>

            {/* Split-Curtain Optical Viewport */}
            <div className="mt-4 relative h-48 rounded-2xl border border-[#141413] overflow-hidden select-none">
              {/* Base Layer: Midnight OLED Chamber (#0B0E0D) */}
              <div className="absolute inset-0 bg-[#0B0E0D] text-[#F4F3EE] p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-mono-code text-[#34D399]">
                  <span>ARTICLE 199 WRIT BRIEF · OLED CHAMBER</span>
                  <span>☾ ZERO EYE STRAIN</span>
                </div>
                <div>
                  <div className="font-legal-serif text-base font-bold text-[#F4F3EE]">
                    “No person shall be deprived of life or liberty save in accordance with law.”
                  </div>
                  <div dir="rtl" className="font-urdu text-base text-[#34D399] mt-1">
                    کسی شخص کو زندگی یا آزادی سے محروم نہیں کیا جائے گا سوائے قانون کے مطابق۔
                  </div>
                </div>
                <div className="text-[11px] font-mono-code text-[#A5A39B]">
                  Constitution of Pakistan 1973 · Fundamental Rights Part II
                </div>
              </div>

              {/* Clipped Top Layer: Sunlit Courtroom Paper (#FAF9F5) */}
              <div
                className="absolute inset-0 bg-[#FAF9F5] text-[#141413] p-5 flex flex-col justify-between border-r-2 border-[#0B5D3B]"
                style={{
                  clipPath: `inset(0 ${100 - daylightSplit}% 0 0)`,
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-mono-code text-[#0B5D3B]">
                  <span>ARTICLE 199 WRIT BRIEF · SUNLIT PAPER</span>
                  <span>☀ ARCHIVAL INK</span>
                </div>
                <div>
                  <div className="font-legal-serif text-base font-bold text-[#141413]">
                    “No person shall be deprived of life or liberty save in accordance with law.”
                  </div>
                  <div dir="rtl" className="font-urdu text-base text-[#0B5D3B] mt-1">
                    کسی شخص کو زندگی یا آزادی سے محروم نہیں کیا جائے گا سوائے قانون کے مطابق۔
                  </div>
                </div>
                <div className="text-[11px] font-mono-code text-[#66645E]">
                  Constitution of Pakistan 1973 · Fundamental Rights Part II
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="font-mono-code text-[11px] text-[#66645E]">☾ OLED</span>
              <input
                type="range"
                min={5}
                max={95}
                value={daylightSplit}
                onChange={(e) => setDaylightSplit(Number(e.target.value))}
                aria-label="Scrub between Daylight Paper and Midnight OLED optics"
                className="w-full accent-[#0B5D3B] cursor-pointer"
              />
              <span className="font-mono-code text-[11px] text-[#141413]">☀ Paper</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E2D9] flex items-center justify-between text-xs">
            <span className="text-[#66645E]">Apply optical mode to entire homepage:</span>
            <button
              type="button"
              onClick={() => onThemeModeChange(daylightSplit < 50 ? "dark" : "paper")}
              className="font-mono-code font-semibold text-[#0B5D3B] hover:underline cursor-pointer"
            >
              Sync Page to {daylightSplit < 50 ? "OLED Night Mode" : "Sunlit Paper Mode"} →
            </button>
          </div>
        </div>

        {/* BENTO CELL B (6 Cols): BORED COW / B-EGG FARM INSPIRED "BUILD & STAMP YOUR OWN LEGAL INSTRUMENT" */}
        <div className="lg:col-span-6 rounded-2xl border border-[#E5E2D9] bg-[#F2EFE9] p-6 sm:p-7 bento-cell flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E5E2D9]">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#0B5D3B] font-semibold">
                <Stamp className="w-3.5 h-3.5" />
                <span>HANDS-ON CUSTOMIZER · STAMP &amp; SEAL YOUR PETITION</span>
              </div>
              <span className="font-mono-code text-xs text-[#141413] font-semibold">
                {stampDenomination} Stamp
              </span>
            </div>

            <h4 className="font-legal-serif text-xl text-[#141413]">
              Interactive Pakistani Non-Judicial Stamp Paper &amp; Seal Customizer
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-[#66645E]">
              Customize your court instrument below—select the statutory stamp denomination, apply
              an official seal, and copy the ready-to-file bilingual pleading.
            </p>

            {/* Interactive Controls Row */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block font-mono-code text-[10px] text-[#66645E] mb-1">
                  1. STAMP DENOMINATION
                </label>
                <div className="flex gap-1">
                  {(["Rs. 100", "Rs. 500", "Rs. 1,200"] as const).map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setStampDenomination(amt)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono-code border cursor-pointer ${
                        stampDenomination === amt
                          ? "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                          : "bg-[#FAF9F5] text-[#141413] border-[#E5E2D9]"
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono-code text-[10px] text-[#66645E] mb-1">
                  2. INSTRUMENT TYPE
                </label>
                <select
                  value={instrumentType}
                  onChange={(e) =>
                    setInstrumentType(e.target.value as typeof instrumentType)
                  }
                  className="w-full py-1.5 px-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E2D9] text-xs text-[#141413] focus:outline-none"
                >
                  <option value="Section 22-A FIR Petition">Sec 22-A FIR Petition</option>
                  <option value="Wirasat Ombudsperson Claim">Wirasat 60-Day Claim</option>
                  <option value="Sec 489-F Legal Notice">Sec 489-F Cheque Notice</option>
                </select>
              </div>

              <div>
                <label className="block font-mono-code text-[10px] text-[#66645E] mb-1">
                  3. ATTESTATION SEAL
                </label>
                <button
                  type="button"
                  onClick={() => setIncludeBarCounterSign((p) => !p)}
                  className={`w-full py-1.5 px-2.5 rounded-lg border text-xs font-medium flex items-center justify-between cursor-pointer ${
                    includeBarCounterSign
                      ? "bg-[#0B5D3B] text-[#FAF9F5] border-[#0B5D3B]"
                      : "bg-[#FAF9F5] text-[#141413] border-[#E5E2D9]"
                  }`}
                >
                  <span>{includeBarCounterSign ? "✓ Bar Seal Applied" : "+ Apply Bar Seal"}</span>
                </button>
              </div>
            </div>

            {/* Live Physical Stamp Paper Preview */}
            <div className="mt-4 rounded-2xl bg-[#FAF9F5] border-2 border-[#141413] p-4 relative overflow-hidden">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-dashed border-[#141413]/30 font-mono-code text-[11px]">
                <span className="text-[#0B5D3B] font-bold">
                  PAKISTAN E-STAMP · {stampDenomination.toUpperCase()}
                </span>
                <span className="text-[#66645E]">JURISDICTION: {selectedCity.toUpperCase()}</span>
              </div>

              <div className="pr-20">
                <div className="font-legal-serif text-sm font-bold text-[#141413]">
                  BEFORE THE COMPETENT FORUM AT {selectedCity.toUpperCase()} — {instrumentType}
                </div>
                <p className="text-xs text-[#66645E] mt-1 leading-relaxed">
                  Respectfully Sheweth: That the petitioner is a law-abiding citizen entitled to
                  immediate statutory protection under Article 4 &amp; 10-A of the Constitution...
                </p>
              </div>

              {/* Interactive Embossed Circular Wax/Ink Seal */}
              {includeBarCounterSign && (
                <div className="absolute right-3 bottom-3 w-16 h-16 rounded-full border-2 border-[#0B5D3B] bg-[#0B5D3B]/10 flex flex-col items-center justify-center text-center p-1 rotate-[-8deg]">
                  <span className="font-mono-code text-[8px] font-bold text-[#0B5D3B] leading-tight">
                    VERIFIED
                  </span>
                  <span className="font-legal-serif text-[9px] font-bold text-[#141413] leading-tight">
                    PBC SEAL
                  </span>
                  <span className="font-mono-code text-[7px] text-[#0B5D3B]">2026</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E2D9] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(
                  `[E-STAMP ${stampDenomination}] BEFORE THE COMPETENT COURT AT ${selectedCity.toUpperCase()} — ${instrumentType} (${sealStyle})`
                );
                setStampCopied(true);
                setTimeout(() => setStampCopied(false), 2500);
              }}
              className="inline-flex items-center gap-1.5 font-mono-code font-semibold text-[#0B5D3B] hover:underline cursor-pointer"
            >
              {stampCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{stampCopied ? "Copied Stamped Header!" : "Copy Stamped Pleading"}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSection("legal-templates")}
              className="font-mono-code text-[#66645E] hover:text-[#141413] cursor-pointer"
            >
              Full Drafts Library →
            </button>
          </div>
        </div>

        {/* BENTO CELL C (7 Cols): INGAMANA & PAFFI 3D PERSPECTIVE FUNNEL CASE STUDIES */}
        <div className="lg:col-span-7 rounded-2xl border border-[#E5E2D9] bg-[#F2EFE9] p-6 sm:p-7 bento-cell">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E5E2D9]">
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#0B5D3B] font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>INGAMANA &amp; PAFFI · 3D PERSPECTIVE CASE-STUDY FUNNEL</span>
            </div>
            <span className="font-mono-code text-xs text-[#66645E]">
              Hover or Select to Expand 3D Depth
            </span>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
            style={{ perspective: "1000px" }}
          >
            {INGAMANA_FUNNEL_CASES.map((item, idx) => {
              const isFocused = hoveredFunnelIdx === idx;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredFunnelIdx(idx)}
                  onClick={() => onNavigateSection(item.sectionTarget)}
                  className={`p-4 rounded-xl border transition-all duration-500 cursor-pointer ${
                    isFocused
                      ? "bg-[#FAF9F5] border-[#141413] shadow-lg"
                      : "bg-[#FAF9F5]/75 border-[#E5E2D9] opacity-80"
                  }`}
                  style={{
                    transform: isFocused
                      ? "translateZ(16px) rotateX(2deg) rotateY(-2deg)"
                      : "translateZ(-6px) scale(0.98)",
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono-code text-[#0B5D3B] font-semibold">
                    <span>{item.citation}</span>
                    <span>{item.impactMetric}</span>
                  </div>
                  <h5 className="font-legal-serif text-base font-bold text-[#141413] mt-1.5 leading-snug">
                    {item.titleEn}
                  </h5>
                  <p dir="rtl" className="font-urdu text-sm text-[#66645E] mt-1">
                    {item.titleUr}
                  </p>
                  <p className="text-xs text-[#66645E] mt-2 leading-relaxed">{item.summaryEn}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* BENTO CELL D (5 Cols): ARCTURIS REAL-WORLD STATUTORY DATA & LIMITATION MATRIX */}
        <div className="lg:col-span-5 rounded-2xl border border-[#E5E2D9] bg-[#F2EFE9] p-6 sm:p-7 bento-cell flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E2D9] text-xs font-mono-code text-[#0B5D3B] font-semibold">
              <span>ARCTURIS DATA PRECISION · LIMITATION &amp; FEE MATRIX</span>
              <FileCheck2 className="w-4 h-4" />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {(
                [
                  { id: "writ_199", label: "Art. 199 Writ" },
                  { id: "cheque_489f", label: "Sec. 489-F Cheque" },
                  { id: "wirasat_2020", label: "Wirasat 2020 Act" },
                  { id: "khula_family", label: "Family / Khula" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedLimitationCase(tab.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono-code border text-left transition-editorial cursor-pointer ${
                    selectedLimitationCase === tab.id
                      ? "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                      : "bg-[#FAF9F5] text-[#66645E] border-[#E5E2D9] hover:text-[#141413]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] p-4 space-y-2.5 font-mono-code text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-[#66645E]">PROCEEDING:</span>
                <span className="text-[#141413] font-semibold text-right">
                  {LIMITATION_DATA.label}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-t border-[#E5E2D9] pt-2">
                <span className="text-[#66645E]">LIMITATION CLOCK:</span>
                <span className="text-[#0B5D3B] font-semibold text-right">
                  {LIMITATION_DATA.period}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-t border-[#E5E2D9] pt-2">
                <span className="text-[#66645E]">STATUTORY FEE:</span>
                <span className="text-[#141413] text-right">{LIMITATION_DATA.courtFee}</span>
              </div>
              <div className="flex justify-between gap-2 border-t border-[#E5E2D9] pt-2">
                <span className="text-[#66645E]">COMPETENT FORUM:</span>
                <span className="text-[#141413] text-right">{LIMITATION_DATA.forum}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E2D9] flex items-center justify-between text-xs font-mono-code">
            <span className="text-[#66645E]">{LIMITATION_DATA.statute}</span>
            <button
              type="button"
              onClick={() =>
                onTriggerAgenticAi(
                  `Compute exact limitation dates and filing checklist for ${LIMITATION_DATA.label} under ${LIMITATION_DATA.statute} in ${selectedCity}.`
                )
              }
              className="text-[#0B5D3B] font-semibold hover:underline cursor-pointer"
            >
              Verify with AI →
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. 360° INTERACTIVE 3D CONSTITUTIONAL MONUMENT & PROGRESSIVE LEAD
          NURTURING STUDIO
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 rounded-2xl border border-[#E5E2D9] bg-[#F2EFE9] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#E5E2D9]">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#0B5D3B] font-semibold">
                <RotateCw className="w-3.5 h-3.5" />
                <span>360° INTERACTIVE 3D CONSTITUTIONAL MONUMENT</span>
              </div>
              <button
                type="button"
                onClick={() => setExplodedLayers((prev) => !prev)}
                className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-[#E5E2D9] text-[11px] font-mono-code text-[#141413] hover:border-[#141413] cursor-pointer"
              >
                {explodedLayers ? "Collapse 3D Layers" : "Explode 3D Layers"}
              </button>
            </div>

            <div
              onPointerDown={handle3DPointerDown}
              onPointerMove={handle3DPointerMove}
              onPointerUp={handle3DPointerUp}
              onPointerLeave={handle3DPointerUp}
              className="relative h-[240px] rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing"
              style={{ perspective: "1100px" }}
            >
              <div
                className="relative w-64 h-44 transition-transform duration-300 ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-2xl border-2 border-[#141413] bg-[#FAF9F5] p-5 flex flex-col justify-between shadow-lg"
                  style={{
                    transform: `translateZ(${explodedLayers ? 44 : 24}px)`,
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-code text-[#0B5D3B] font-semibold">
                    <span>{activeRotundaFace.code}</span>
                    <span>{Math.round(((rotationY % 360) + 360) % 360)}° Y-AXIS</span>
                  </div>
                  <div>
                    <h4 className="font-legal-serif text-base font-bold text-[#141413] leading-snug">
                      {activeRotundaFace.titleEn}
                    </h4>
                    <p dir="rtl" className="font-urdu text-sm text-[#66645E] mt-1">
                      {activeRotundaFace.titleUr}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#E5E2D9] flex items-center justify-between text-[10px] font-mono-code text-[#66645E]">
                    <span>{activeRotundaFace.articles}</span>
                    <span className="text-[#0B5D3B] font-semibold">Drag 360° ↔</span>
                  </div>
                </div>

                <div
                  className="absolute inset-2 rounded-2xl border border-[#0B5D3B]/40 bg-[#F2EFE9]/90 pointer-events-none"
                  style={{
                    transform: `translateZ(${explodedLayers ? 0 : 8}px)`,
                  }}
                />

                <div
                  className="absolute inset-4 rounded-2xl border border-[#141413]/30 bg-[#E5E2D9]/80 pointer-events-none"
                  style={{
                    transform: `translateZ(${explodedLayers ? -40 : -12}px)`,
                  }}
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono-code text-[11px] text-[#66645E] shrink-0">
                  360° Spin:
                </span>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={rotationY}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setRotationY(val);
                    const idx = (((-Math.round(val / 90)) % 4) + 4) % 4;
                    setActiveFaceIndex(idx);
                  }}
                  aria-label="Spin 3D Legal Monument 360 degrees"
                  className="w-full accent-[#0B5D3B] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ROTUNDA_FACES.map((f, i) => (
                  <button
                    key={f.code}
                    type="button"
                    onClick={() => rotateToFace(i)}
                    className={`px-2.5 py-2 rounded-xl border text-[11px] font-mono-code transition-editorial cursor-pointer ${
                      activeFaceIndex === i
                        ? "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                        : "bg-[#FAF9F5] text-[#66645E] border-[#E5E2D9] hover:text-[#141413]"
                    }`}
                  >
                    0{i + 1}. {f.code.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E5E2D9] flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[#66645E] flex-1">{activeRotundaFace.summary}</p>
            <button
              type="button"
              onClick={() => onNavigateSection(activeRotundaFace.targetSection)}
              className="kinetic-btn px-4 py-2 rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-xs font-medium inline-flex items-center gap-1.5 hover:bg-[#09482E] cursor-pointer shrink-0"
            >
              <span className="kinetic-btn-label">Inspect Pillar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progressive Lead Nurturing & Agentic Case Builder */}
        <div className="lg:col-span-6 rounded-2xl border border-[#E5E2D9] bg-[#F2EFE9] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#E5E2D9]">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#0B5D3B] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PROGRESSIVE CASE NURTURING &amp; AGENTIC AI INTAKE</span>
              </div>
              <span className="font-mono-code text-xs text-[#141413] font-semibold tabular-nums">
                Dossier Readiness: {readinessScore}%
              </span>
            </div>

            <h3 className="font-legal-serif text-xl sm:text-2xl text-[#141413]">
              Adaptive 3-Step Statutory Diagnostic for {selectedTopic} ({selectedCity})
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-[#66645E]">
              Instead of static forms, our progressive intake adapts to your answers and prepares a
              tailored court strategy.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { step: 1 as const, label: "01. Urgency & Notice" },
                { step: 2 as const, label: "02. Evidentiary Proof" },
                { step: 3 as const, label: "03. Agentic Action" },
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setNurtureStage(s.step)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono-code border text-left transition-editorial cursor-pointer ${
                    nurtureStage === s.step
                      ? "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                      : "bg-[#FAF9F5] text-[#66645E] border-[#E5E2D9]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="mt-5 p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9]">
              {nurtureStage === 1 && (
                <div className="space-y-3">
                  <div className="text-xs font-mono-code text-[#66645E]">
                    STEP 1: WHAT IS THE CURRENT PROCEDURAL STAGE IN {selectedCity.toUpperCase()}?
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      {
                        id: "immediate_24h" as const,
                        title: "Immediate Crisis (24h)",
                        sub: "Police / Dispossession / Lockout",
                      },
                      {
                        id: "notice_received" as const,
                        title: "Legal Notice / Summons",
                        sub: "Court or Opponent Notice",
                      },
                      {
                        id: "planning" as const,
                        title: "Preventive Filing",
                        sub: "Contract / Wirasat / Khula Prep",
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setUrgencyLevel(item.id);
                          setNurtureStage(2);
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-editorial cursor-pointer ${
                          urgencyLevel === item.id
                            ? "border-[#0B5D3B] bg-[#F2EFE9]"
                            : "border-[#E5E2D9] bg-[#FAF9F5] hover:border-[#141413]"
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#141413]">{item.title}</div>
                        <div className="text-[11px] text-[#66645E] mt-1">{item.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {nurtureStage === 2 && (
                <div className="space-y-3">
                  <div className="text-xs font-mono-code text-[#66645E]">
                    STEP 2: TAILORED FOR {urgencyLevel.replace("_", " ").toUpperCase()} — DOCUMENT
                    AVAILABILITY
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      {
                        id: "complete_docs" as const,
                        title: "Certified Copies Ready",
                        sub: "CNIC, Nikahnama / Fard / Cheques",
                      },
                      {
                        id: "partial_docs" as const,
                        title: "Partial / Unverified",
                        sub: "Need NADRA FRC or Certified Copy",
                      },
                      {
                        id: "need_obtain" as const,
                        title: "Withheld by Opponent",
                        sub: "Need Court Summons for Record",
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setEvidenceStatus(item.id);
                          setNurtureStage(3);
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-editorial cursor-pointer ${
                          evidenceStatus === item.id
                            ? "border-[#0B5D3B] bg-[#F2EFE9]"
                            : "border-[#E5E2D9] bg-[#FAF9F5] hover:border-[#141413]"
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#141413]">{item.title}</div>
                        <div className="text-[11px] text-[#66645E] mt-1">{item.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {nurtureStage === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-code text-[#0B5D3B]">
                    <span>STEP 3: AI-TAILORED LEGAL RECOMMENDATION READY</span>
                    <span>{readinessScore}% MATCH</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#141413] leading-relaxed">
                    Based on your <strong>{urgencyLevel.replace("_", " ")}</strong> status and{" "}
                    <strong>{evidenceStatus.replace("_", " ")}</strong> in{" "}
                    <strong>{selectedCity}</strong>, launch an Agentic Multi-Step workflow below:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onTriggerAgenticAi(
                          `Agentic Workflow: For my ${selectedTopic} case in ${selectedCity} (Urgency: ${urgencyLevel}, Evidence: ${evidenceStatus}), draft a formal Legal Notice and list the exact court filing steps.`
                        )
                      }
                      className="kinetic-btn px-4 py-2 rounded-xl bg-[#0B5D3B] text-[#FAF9F5] text-xs font-medium hover:bg-[#09482E] cursor-pointer"
                    >
                      <span className="kinetic-btn-label">
                        Auto-Draft Legal Notice &amp; Filing Plan →
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateSection("verified-advocates")}
                      className="px-3.5 py-2 rounded-xl border border-[#141413] text-xs font-medium text-[#141413] hover:bg-[#141413] hover:text-[#FAF9F5] cursor-pointer"
                    >
                      Match {selectedCity} Bar Counsel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E5E2D9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#66645E]">
            <span>Zero Dark Patterns · Client-Side Encrypted Triage</span>
            <button
              type="button"
              onClick={() =>
                setNurtureStage((prev) => (prev === 3 ? 1 : ((prev + 1) as 1 | 2 | 3)))
              }
              className="font-mono-code text-[#0B5D3B] font-semibold hover:underline cursor-pointer"
            >
              {nurtureStage < 3 ? "Next Diagnostic Step →" : "Restart Diagnostic ↺"}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          5. GAMIFIED CITIZEN CONSTITUTIONAL MASTERY QUEST
          ===================================================================== */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-[#F2EFE9] p-6 sm:p-8 transition-editorial">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E5E2D9]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#0B5D3B] font-semibold">
              <Trophy className="w-4 h-4" />
              <span>GAMIFIED CITIZEN CONSTITUTIONAL MASTERY &amp; RIGHTS QUEST</span>
            </div>
            <h3 className="font-legal-serif text-2xl text-[#141413] mt-1">
              Test Your Pakistani Legal Reflexes &amp; Earn Verified Mastery Badges
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-[#FAF9F5] border border-[#E5E2D9] rounded-xl px-4 py-2.5">
            <div>
              <div className="text-[10px] font-mono-code text-[#66645E]">JUSTICE XP</div>
              <div className="font-mono-code text-sm font-bold text-[#0B5D3B] tabular-nums">
                {citizenXp} XP
              </div>
            </div>
            <div className="h-6 w-[1px] bg-[#E5E2D9]" />
            <div>
              <div className="text-[10px] font-mono-code text-[#66645E]">STREAK</div>
              <div className="font-mono-code text-sm font-bold text-[#141413] tabular-nums">
                {streakDays} Days
              </div>
            </div>
            <div className="h-6 w-[1px] bg-[#E5E2D9]" />
            <div>
              <div className="text-[10px] font-mono-code text-[#66645E]">BADGES UNLOCKED</div>
              <div className="font-mono-code text-sm font-bold text-[#141413] tabular-nums">
                {completedChallengeIds.length} / {CONSTITUTIONAL_CHALLENGES.length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-3">
            {CONSTITUTIONAL_CHALLENGES.map((ch, idx) => {
              const isCurrent = idx === currentChallengeIdx;
              const isDone = completedChallengeIds.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    setCurrentChallengeIdx(idx);
                    setSelectedOptionId(null);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-editorial cursor-pointer flex items-center justify-between gap-3 ${
                    isCurrent
                      ? "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                      : "bg-[#FAF9F5] text-[#141413] border-[#E5E2D9] hover:border-[#141413]"
                  }`}
                >
                  <div>
                    <div
                      className={`text-[11px] font-mono-code ${
                        isCurrent ? "text-[#10B981]" : "text-[#0B5D3B]"
                      }`}
                    >
                      CHALLENGE 0{idx + 1} · +{ch.xpReward} XP
                    </div>
                    <div className="font-legal-serif text-sm font-bold mt-0.5">{ch.pillar}</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isCurrent ? "text-[#FAF9F5]/75" : "text-[#66645E]"
                      }`}
                    >
                      {ch.statuteRef}
                    </div>
                  </div>
                  {isDone && (
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 ${
                        isCurrent ? "text-[#10B981]" : "text-[#0B5D3B]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-[#66645E] mb-3">
              <span className="text-[#0B5D3B] font-semibold">
                {activeChallenge.pillar} · {activeChallenge.statuteRef}
              </span>
              <span>Badge: {activeChallenge.badgeTitle}</span>
            </div>

            <h4 className="font-legal-serif text-lg sm:text-xl text-[#141413] leading-snug">
              {activeChallenge.scenarioEn}
            </h4>
            <p dir="rtl" className="mt-2 font-urdu text-lg text-[#66645E]">
              {activeChallenge.scenarioUr}
            </p>

            <div className="mt-5 space-y-2.5">
              {activeChallenge.options.map((opt) => {
                const isPicked = selectedOptionId === opt.id;
                return (
                  <div key={opt.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectChallengeOption(opt.id, opt.isCorrect)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-editorial cursor-pointer flex items-center justify-between gap-3 ${
                        isPicked
                          ? opt.isCorrect
                            ? "bg-[#0B5D3B] text-[#FAF9F5] border-[#0B5D3B]"
                            : "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                          : "bg-[#F2EFE9]/70 text-[#141413] border-[#E5E2D9] hover:border-[#141413]"
                      }`}
                    >
                      <span>{opt.textEn}</span>
                      <span className="font-mono-code text-xs shrink-0">
                        {isPicked ? (opt.isCorrect ? "✓ +150 XP" : "× Review") : "Select →"}
                      </span>
                    </button>

                    {isPicked && (
                      <div className="mt-2 p-4 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] text-xs sm:text-sm text-[#141413]">
                        <p className="leading-relaxed">{opt.explanationEn}</p>
                        <p dir="rtl" className="mt-2 font-urdu text-base text-[#66645E]">
                          {opt.explanationUr}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
