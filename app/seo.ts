import type { Metadata } from "next";
import { createClient } from "@/lib/supabase";

const SITE_NAME = "The Daily Legal Brief Pakistan";
const BASE_URL =
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://dailylegalbrief.pk";

export interface ScreenSEOEntry {
  screenNumber: number;
  moduleNumber: 1 | 2 | 3 | 4 | 5;
  routePattern: string;
  screenName: string;
  title: string;
  description: string;
  keywords: string[];
  schemaType:
    | "WebSite"
    | "NewsArticle"
    | "LegalService"
    | "Legislation"
    | "FAQPage"
    | "WebPage"
    | "ProfilePage";
}

/**
 * Master 61-Screen SEO Metadata Catalog tailored for Legal Search Intent in Pakistan
 * Titles are optimized to 35–60 characters; Descriptions are 120–160 characters with clear CTAs.
 */
export const SEO_61_SCREENS_CATALOG: Record<number, ScreenSEOEntry> = {
  // ================= MODULE 1: PUBLIC DISCOVERY (SCREENS 01–12) =================
  1: {
    screenNumber: 1,
    moduleNumber: 1,
    routePattern: "/?screen=01-splash",
    screenName: "Splash Screen • Sovereign Legal Architecture",
    title: "Pakistan Legal Portal & High Court Directory | Daily Brief",
    description:
      "Access Pakistan's sovereign digital law library, Supreme Court case digests, and Bar-verified High Court advocates in English and Urdu.",
    keywords: [
      "Pakistan legal portal",
      "Supreme Court of Pakistan judgments",
      "High Court advocates Pakistan",
      "Pakistan law journal",
    ],
    schemaType: "WebSite",
  },
  2: {
    screenNumber: 2,
    moduleNumber: 1,
    routePattern: "/",
    screenName: "Magazine Home Page",
    title: "The Daily Legal Brief – Pakistan Law Journal & Advocates",
    description:
      "Read daily Supreme Court of Pakistan case briefs, explore the Pakistan Penal Code & CrPC, and consult verified High Court advocates online.",
    keywords: [
      "Pakistan legal news",
      "Supreme Court judgments 2026",
      "Lahore High Court updates",
      "hire lawyer in Pakistan",
      "constitutional law Pakistan",
    ],
    schemaType: "WebSite",
  },
  3: {
    screenNumber: 3,
    moduleNumber: 1,
    routePattern: "/?modal=03-global-search",
    screenName: "Global Legal Search Overlay",
    title: "Search Pakistan Statutes, Judgments & Verified Lawyers",
    description:
      "Instantly search across Pakistan Penal Code sections, CrPC bail procedures, constitutional rulings, and Bar-verified legal counsel.",
    keywords: [
      "search Pakistan laws",
      "find PPC section",
      "PLD citation search",
      "advocate search Pakistan",
    ],
    schemaType: "WebPage",
  },
  4: {
    screenNumber: 4,
    moduleNumber: 1,
    routePattern: "/magazine/[id]",
    screenName: "Article & Case Judgment Reader",
    title: "Supreme Court & High Court Legal Analysis | Daily Brief",
    description:
      "In-depth constitutional commentary, appellate case ratios, and statutory analysis authored by senior Advocates of the High Courts of Pakistan.",
    keywords: [
      "Supreme Court analysis Pakistan",
      "constitutional petition Article 199",
      "PLD case commentary",
      "SCMR legal digest",
    ],
    schemaType: "NewsArticle",
  },
  5: {
    screenNumber: 5,
    moduleNumber: 1,
    routePattern: "/magazine/[id]?sheet=05-share-export",
    screenName: "Social Share & Legal Citation Export",
    title: "Export Court Citation & PDF Brief | Daily Legal Brief PK",
    description:
      "Format PLD/SCMR judicial citations, export court-ready PDF headnotes, and share verified legal briefings with colleagues and clients.",
    keywords: [
      "PLD citation format",
      "export legal brief PDF",
      "SCMR case citation",
    ],
    schemaType: "WebPage",
  },
  6: {
    screenNumber: 6,
    moduleNumber: 1,
    routePattern: "/lawyers",
    screenName: "Verified Advocate Directory",
    title: "Find Verified High Court Lawyers in Pakistan | Legal Brief",
    description:
      "Compare Bar-verified civil, criminal, family, corporate, and tax lawyers in Lahore, Karachi, and Islamabad. Book escrow-protected consultations.",
    keywords: [
      "best lawyers in Lahore",
      "family lawyer Karachi",
      "High Court advocate Islamabad",
      "property dispute lawyer Pakistan",
      "criminal defense lawyer Pakistan",
    ],
    schemaType: "LegalService",
  },
  7: {
    screenNumber: 7,
    moduleNumber: 1,
    routePattern: "/lawyers?sheet=07-filters",
    screenName: "Advanced Advocate Search Filters",
    title: "Filter Lawyers by City, Court & Fee in Pakistan",
    description:
      "Filter Pakistan Bar Council verified advocates by High Court jurisdiction, consultation fee in PKR, practice specialty, and client ratings.",
    keywords: [
      "lawyer consultation fee Pakistan",
      "Lahore High Court bar lawyers",
      "Sindh High Court advocates",
    ],
    schemaType: "LegalService",
  },
  8: {
    screenNumber: 8,
    moduleNumber: 1,
    routePattern: "/templates",
    screenName: "Legal Contract & Petition Templates",
    title: "Download Pakistan Legal Agreements & Court Drafts (DOCX)",
    description:
      "Download lawyer-vetted Pakistani legal templates including Tenancy Agreements, Bail Petitions, Khula Plaints, Legal Notices, and NDAs.",
    keywords: [
      "tenancy agreement format Pakistan",
      "legal notice template Pakistan",
      "bail petition draft CrPC 497",
      "khula suit draft family court",
      "affidavit format stamp paper Pakistan",
    ],
    schemaType: "WebPage",
  },
  9: {
    screenNumber: 9,
    moduleNumber: 1,
    routePattern: "/templates?modal=09-preview",
    screenName: "Watermarked Legal Draft Preview",
    title: "Preview Stamp Paper & Court Clauses | Legal Templates PK",
    description:
      "Inspect statutory clauses, Registration Act 1908 compliance notes, and bilingual English/Urdu provisions before downloading your legal draft.",
    keywords: [
      "stamp paper agreement preview",
      "Registration Act 1908 draft",
      "Pakistan contract clauses",
    ],
    schemaType: "WebPage",
  },
  10: {
    screenNumber: 10,
    moduleNumber: 1,
    routePattern: "/forum",
    screenName: "Public Legal Q&A Forum Feed",
    title: "Free Legal Advice & Q&A Forum Pakistan | Ask Advocates",
    description:
      "Read verified answers from High Court advocates on family law, Khula, inheritance, FIR quashment, cybercrime PECA, and property disputes.",
    keywords: [
      "free legal advice Pakistan",
      "ask a lawyer online Pakistan",
      "khula procedure in Pakistan",
      "how to check FIR online Pakistan",
      "inheritance law calculator Pakistan",
    ],
    schemaType: "FAQPage",
  },
  11: {
    screenNumber: 11,
    moduleNumber: 1,
    routePattern: "/laws",
    screenName: "Digital Law Library Index (Pakistan Code)",
    title: "Pakistan Penal Code, CrPC, CPC & Family Laws Library",
    description:
      "Browse the codified laws of Pakistan including the 1973 Constitution, PPC, CrPC, Qanun-e-Shahadat, Family Courts Act, and PECA 2016.",
    keywords: [
      "Pakistan Penal Code sections",
      "CrPC Pakistan full text",
      "Constitution of Pakistan 1973 articles",
      "Muslim Family Laws Ordinance 1961",
      "PECA 2016 cyber crime law",
    ],
    schemaType: "Legislation",
  },
  12: {
    screenNumber: 12,
    moduleNumber: 1,
    routePattern: "/laws/[id]",
    screenName: "Statute & Section Reader with Marginal Notes",
    title: "Pakistan Statute Section Text & Judicial Commentary",
    description:
      "Read full statutory text in English and Urdu with High Court marginal commentary, bail bailability status, and Supreme Court cross-references.",
    keywords: [
      "PPC section commentary",
      "CrPC section bail",
      "Urdu law text Pakistan",
      "statutory interpretation Pakistan",
    ],
    schemaType: "Legislation",
  },

  // ================= MODULE 2: AUTHENTICATION & ONBOARDING (SCREENS 13–20) =================
  13: {
    screenNumber: 13,
    moduleNumber: 2,
    routePattern: "/auth/login?sheet=13-auth-trigger",
    screenName: "Protected Action Authentication Gate",
    title: "Verify Identity for Legal Workspace | Daily Legal Brief",
    description:
      "Authenticate your Client or Verified Advocate credentials to book consultations, post legal inquiries, or access encrypted case rooms.",
    keywords: [
      "client portal login Pakistan",
      "advocate portal sign in",
      "secure legal workspace",
    ],
    schemaType: "WebPage",
  },
  14: {
    screenNumber: 14,
    moduleNumber: 2,
    routePattern: "/auth/login",
    screenName: "Secure OTP Login & Registration",
    title: "Sign In or Register – Client & Advocate Portal Pakistan",
    description:
      "Sign in securely via passwordless OTP to manage legal appointments, escrow retainers, court milestones, and High Court verification.",
    keywords: [
      "lawyer portal login Pakistan",
      "legal client login",
      "Pakistan Bar advocate registration",
    ],
    schemaType: "WebPage",
  },
  15: {
    screenNumber: 15,
    moduleNumber: 2,
    routePattern: "/auth/login?modal=15-otp",
    screenName: "6-Digit OTP Verification Modal",
    title: "Verify 6-Digit Security Code | Daily Legal Brief Auth",
    description:
      "Enter your one-time verification code to establish an encrypted RBAC session synced with your Supabase legal profile.",
    keywords: ["OTP verification legal portal", "two factor authentication law"],
    schemaType: "WebPage",
  },
  16: {
    screenNumber: 16,
    moduleNumber: 2,
    routePattern: "/auth/role",
    screenName: "Account Role Selection (Client vs Advocate)",
    title: "Select Legal Account Role – Citizen Client or Advocate",
    description:
      "Choose your account role on The Daily Legal Brief: register as a Client seeking legal representation or a Bar-enrolled Advocate.",
    keywords: [
      "register as lawyer Pakistan",
      "create client legal account",
      "RBAC legal roles",
    ],
    schemaType: "WebPage",
  },
  17: {
    screenNumber: 17,
    moduleNumber: 2,
    routePattern: "/auth/setup-client",
    screenName: "Client Profile Setup Wizard",
    title: "Complete Citizen Client Profile | Legal Brief Pakistan",
    description:
      "Set your city, preferred court jurisdiction, and language preferences to match with verified advocates in Lahore, Karachi, or Islamabad.",
    keywords: [
      "client onboarding legal Pakistan",
      "find lawyer in my city Pakistan",
    ],
    schemaType: "ProfilePage",
  },
  18: {
    screenNumber: 18,
    moduleNumber: 2,
    routePattern: "/auth/setup-lawyer",
    screenName: "Advocate Bar Council Verification Flow",
    title: "Advocate Enrollment & Bar License Verification Pakistan",
    description:
      "Submit your Pakistan Bar Council or Provincial Bar enrollment number, chamber address, and High Court license to join our verified directory.",
    keywords: [
      "Punjab Bar Council verification",
      "Sindh Bar Council advocate registration",
      "Islamabad Bar Council directory",
    ],
    schemaType: "ProfilePage",
  },
  19: {
    screenNumber: 19,
    moduleNumber: 2,
    routePattern: "/auth/setup-lawyer?sheet=19-license-upload",
    screenName: "Bar License Media Picker & Storage Upload",
    title: "Upload High Court Bar License Card | Advocate Onboarding",
    description:
      "Securely upload your scanned Bar Council ID card or Sanad to the encrypted lawyer_documents bucket for credential verification.",
    keywords: [
      "upload bar council card",
      "advocate sanad verification Pakistan",
    ],
    schemaType: "WebPage",
  },
  20: {
    screenNumber: 20,
    moduleNumber: 2,
    routePattern: "/auth/setup-lawyer?modal=20-under-review",
    screenName: "Advocate Credential Audit Status Modal",
    title: "Bar Verification Under Audit | Advocate Compliance Desk",
    description:
      "Track the verification status of your Provincial or Supreme Court Bar enrollment credentials with our judicial compliance desk.",
    keywords: ["advocate verification status", "bar license compliance audit"],
    schemaType: "WebPage",
  },

  // ================= MODULE 3: CLIENT WORKSPACE (SCREENS 21–34) =================
  21: {
    screenNumber: 21,
    moduleNumber: 3,
    routePattern: "/lawyers/[id]",
    screenName: "Verified Advocate Chamber Profile",
    title: "Advocate Chamber Profile, Court Record & Fee | Pakistan",
    description:
      "Review Bar enrollment credentials, High Court practice areas, client reviews, and consultation fees. Book a secure video or chamber meeting.",
    keywords: [
      "High Court advocate profile",
      "book lawyer consultation Pakistan",
      "verified barrister Pakistan",
    ],
    schemaType: "LegalService",
  },
  22: {
    screenNumber: 22,
    moduleNumber: 3,
    routePattern: "/lawyers/[id]/book",
    screenName: "Consultation Slot & Retainer Booking Calendar",
    title: "Book Legal Consultation Slot – Video or Chamber Meeting",
    description:
      "Select an available consultation date and time slot with a Bar-verified Pakistani advocate, attach case summary notes, and lock your slot.",
    keywords: [
      "schedule lawyer appointment Pakistan",
      "online legal consultation booking",
      "video call lawyer Pakistan",
    ],
    schemaType: "LegalService",
  },
  23: {
    screenNumber: 23,
    moduleNumber: 3,
    routePattern: "/lawyers/[id]/book?modal=23-confirm-slot",
    screenName: "Confirm Appointment Time Slot Modal",
    title: "Confirm Consultation Slot & Escrow Fee Breakdown",
    description:
      "Review your selected advocate, consultation date, time slot, and escrow-protected PKR fee before proceeding to payment.",
    keywords: ["confirm lawyer booking", "legal consultation fee PKR"],
    schemaType: "WebPage",
  },
  24: {
    screenNumber: 24,
    moduleNumber: 3,
    routePattern: "/checkout/[bookingId]",
    screenName: "Escrow Checkout & Payment Gateway",
    title: "Escrow Payment Checkout – JazzCash, EasyPaisa & RAAST",
    description:
      "Deposit your legal consultation fee into protected escrow via RAAST IBAN, JazzCash, EasyPaisa, or Visa/Mastercard until consultation completion.",
    keywords: [
      "legal escrow payment Pakistan",
      "pay lawyer via JazzCash EasyPaisa",
      "RAAST legal retainer payment",
    ],
    schemaType: "WebPage",
  },
  25: {
    screenNumber: 25,
    moduleNumber: 3,
    routePattern: "/checkout/[bookingId]?modal=25-payment-success",
    screenName: "Escrow Deposit Receipt & Video Room Voucher",
    title: "Escrow Deposit Confirmed – Legal Consultation Receipt",
    description:
      "Download your official escrow receipt and encrypted video consultation chamber code. Funds remain protected until your session concludes.",
    keywords: ["escrow payment receipt", "video consultation voucher"],
    schemaType: "WebPage",
  },
  26: {
    screenNumber: 26,
    moduleNumber: 3,
    routePattern: "/client/cases",
    screenName: "Client Case History, Milestones & Escrow Ledger",
    title: "My Legal Cases, Court Hearing Dates & Escrow Ledger",
    description:
      "Track active litigation milestones, upcoming High Court or Civil Court hearing dates, escrow deposits, and direct messages with your counsel.",
    keywords: [
      "track court case Pakistan",
      "client legal case dashboard",
      "court hearing milestones",
    ],
    schemaType: "WebPage",
  },
  27: {
    screenNumber: 27,
    moduleNumber: 3,
    routePattern: "/client/cases?modal=27-reschedule-cancel",
    screenName: "Reschedule or Cancel Consultation Modal",
    title: "Reschedule Legal Appointment or Request Escrow Refund",
    description:
      "Modify your upcoming consultation slot or submit a cancellation request with automatic escrow protection under platform dispute rules.",
    keywords: ["reschedule lawyer appointment", "cancel legal booking refund"],
    schemaType: "WebPage",
  },
  28: {
    screenNumber: 28,
    moduleNumber: 3,
    routePattern: "/client/ai-assistant",
    screenName: "Bilingual AI Legal Assistant (PPC / CrPC / Family Law)",
    title: "AI Legal Assistant Pakistan – Instant Statutory Guidance",
    description:
      "Get instant bilingual English and Urdu statutory guidance grounded in the Pakistan Penal Code, CrPC, Family Courts Act, and Property Laws.",
    keywords: [
      "AI lawyer Pakistan",
      "Pakistan law AI assistant",
      "online legal guidance Urdu English",
      "FIR section analyzer Pakistan",
    ],
    schemaType: "WebPage",
  },
  29: {
    screenNumber: 29,
    moduleNumber: 3,
    routePattern: "/client/ai-assistant?sheet=29-attachments",
    screenName: "Legal Document OCR & PDF Attachment Sheet",
    title: "Attach FIR, Nikahnama or Fard for Statutory Analysis",
    description:
      "Attach a scanned FIR copy, Nikahnama, Tenancy Agreement, or Fard Jamabandi to extract relevant Pakistani statutory sections.",
    keywords: [
      "FIR copy OCR analysis",
      "Nikahnama clause check",
      "Fard property document check",
    ],
    schemaType: "WebPage",
  },
  30: {
    screenNumber: 30,
    moduleNumber: 3,
    routePattern: "/client/ai-assistant?modal=30-voice-recorder",
    screenName: "Urdu & English Voice-to-Text Legal Query",
    title: "Voice Legal Inquiry in Urdu & English | AI Legal Brief",
    description:
      "Record your legal question in Urdu or English to transcribe and match with relevant sections of Pakistani civil, criminal, and family statutes.",
    keywords: ["Urdu voice legal help", "speak to legal assistant Pakistan"],
    schemaType: "WebPage",
  },
  31: {
    screenNumber: 31,
    moduleNumber: 3,
    routePattern: "/forum/ask",
    screenName: "Post a Public or Anonymous Legal Question",
    title: "Ask a Verified Pakistani Lawyer Online – Free Q&A Post",
    description:
      "Submit your legal question on family disputes, bail, inheritance, tax, or property law and receive answers from Bar-verified Pakistani advocates.",
    keywords: [
      "ask lawyer free question Pakistan",
      "anonymous legal advice Pakistan",
      "post family law question",
    ],
    schemaType: "FAQPage",
  },
  32: {
    screenNumber: 32,
    moduleNumber: 3,
    routePattern: "/forum/ask?modal=32-anonymous-privacy",
    screenName: "Keep Identity Anonymous Privacy Safeguard",
    title: "Anonymous Legal Inquiry Privacy & Redaction Notice",
    description:
      "Review how your name, CNIC, and phone number are masked before your legal question is published to the public advocate forum.",
    keywords: ["confidential legal question Pakistan", "anonymous forum post"],
    schemaType: "WebPage",
  },
  33: {
    screenNumber: 33,
    moduleNumber: 3,
    routePattern: "/pro-bono/apply",
    screenName: "Pro-Bono Legal Aid Application Form",
    title: "Apply for Free Pro-Bono Legal Aid in Pakistan",
    description:
      "Submit a pro-bono legal aid application for fundamental rights, unlawful detention, domestic violence, or indigent family court representation.",
    keywords: [
      "free legal aid Pakistan",
      "pro bono lawyer Lahore Karachi",
      "human rights legal aid Pakistan",
      "indigent prisoner legal representation",
    ],
    schemaType: "LegalService",
  },
  34: {
    screenNumber: 34,
    moduleNumber: 3,
    routePattern: "/pro-bono/apply?sheet=34-income-guidelines",
    screenName: "Pro-Bono Income Proof & Affidavit Guidelines",
    title: "Income Certificate & BISP Eligibility for Pro-Bono Aid",
    description:
      "Check document requirements for pro-bono legal aid eligibility including low-income affidavits, BISP records, and basic salary slips.",
    keywords: ["pro bono eligibility Pakistan", "income certificate legal aid"],
    schemaType: "WebPage",
  },

  // ================= MODULE 4: LAWYER CRM & PRO TOOLS (SCREENS 35–49) =================
  35: {
    screenNumber: 35,
    moduleNumber: 4,
    routePattern: "/lawyer/dashboard",
    screenName: "Advocate Chamber CRM Dashboard",
    title: "Advocate CRM Dashboard – Leads, Hearings & Escrow | PK",
    description:
      "Manage client consultation requests, High Court cause list milestones, escrow retainers, and Bar reputation points in one chamber workspace.",
    keywords: [
      "lawyer CRM Pakistan",
      "advocate practice management software",
      "law chamber management Pakistan",
    ],
    schemaType: "WebPage",
  },
  36: {
    screenNumber: 36,
    moduleNumber: 4,
    routePattern: "/lawyer/leads",
    screenName: "Incoming Client Leads & Retainer Queue",
    title: "Client Consultation Leads & Case Intake Queue | CRM",
    description:
      "Review incoming client briefs, escrow-funded consultation requests, and High Court litigation inquiries matched to your practice specialty.",
    keywords: ["legal leads Pakistan", "client intake for advocates"],
    schemaType: "WebPage",
  },
  37: {
    screenNumber: 37,
    moduleNumber: 4,
    routePattern: "/lawyer/leads?modal=37-accept-decline",
    screenName: "Accept or Decline Client Mandate Modal",
    title: "Accept Client Retainer or Conflict-of-Interest Decline",
    description:
      "Confirm conflict-of-interest clearance and accept the client mandate to activate the encrypted case workspace and escrow milestone schedule.",
    keywords: ["accept legal retainer", "conflict check advocate"],
    schemaType: "WebPage",
  },
  38: {
    screenNumber: 38,
    moduleNumber: 4,
    routePattern: "/lawyer/cases/[id]",
    screenName: "Active Litigation Case Workspace",
    title: "Active Case File, Order Sheets & Hearing Milestones",
    description:
      "Update court hearing dates, upload Wakalatnama and interim order sheets, and sync litigation progress directly with your client's portal.",
    keywords: [
      "court case management Pakistan",
      "upload wakalatnama order sheet",
      "litigation milestone tracker",
    ],
    schemaType: "WebPage",
  },
  39: {
    screenNumber: 39,
    moduleNumber: 4,
    routePattern: "/lawyer/cases/[id]?modal=39-add-milestone",
    screenName: "Add Court Hearing Milestone Modal",
    title: "Log Court Hearing Date & Judicial Order Milestone",
    description:
      "Record next hearing dates, interim injunctive relief, written statement filings, or final arguments to keep the client timeline updated.",
    keywords: ["add court hearing milestone", "case diary update Pakistan"],
    schemaType: "WebPage",
  },
  40: {
    screenNumber: 40,
    moduleNumber: 4,
    routePattern: "/lawyer/ai-researcher",
    screenName: "AI Researcher Pro – Appellate & PLD Precedent Engine",
    title: "AI Legal Researcher Pro – PLD, SCMR & CLC Case Law PK",
    description:
      "Conduct appellate legal research across Supreme Court (SCMR), PLD, CLC, and PCrLJ precedents with verified statutory citations for court briefs.",
    keywords: [
      "PLD case law search AI",
      "SCMR precedent researcher Pakistan",
      "High Court writ petition research",
      "PCrLJ bail judgments search",
    ],
    schemaType: "WebPage",
  },
  41: {
    screenNumber: 41,
    moduleNumber: 4,
    routePattern: "/lawyer/ai-researcher?sheet=41-prompts",
    screenName: "Appellate & Constitutional Prompt Library",
    title: "Constitutional Writ & Bail Research Prompts | Advocate AI",
    description:
      "Select curated appellate research prompts for Article 199 writ jurisdiction, Section 497 CrPC bail, Order 39 CPC injunctions, and tax appeals.",
    keywords: [
      "Article 199 writ prompt",
      "Order 39 Rule 1 and 2 injunction research",
    ],
    schemaType: "WebPage",
  },
  42: {
    screenNumber: 42,
    moduleNumber: 4,
    routePattern: "/lawyer/ai-researcher?modal=42-citation-details",
    screenName: "Full Precedent Ratio Decidendi & Citation Modal",
    title: "Verified Supreme Court & High Court Ratio Decidendi",
    description:
      "Inspect full bench composition, statutory cross-references, and binding ratio decidendi for cited Pakistani appellate judgments.",
    keywords: ["ratio decidendi Supreme Court Pakistan", "bench judgment text"],
    schemaType: "WebPage",
  },
  43: {
    screenNumber: 43,
    moduleNumber: 4,
    routePattern: "/lawyer/reputation-desk",
    screenName: "Advocate Reputation Desk – Public Q&A Publishing",
    title: "Advocate Reputation Desk – Answer Legal Q&A & Earn Rank",
    description:
      "Publish authoritative legal opinions on citizen forum questions to earn +10 Bar Reputation Points and boost your chamber's directory ranking.",
    keywords: [
      "build lawyer reputation Pakistan",
      "publish legal opinion online",
    ],
    schemaType: "FAQPage",
  },
  44: {
    screenNumber: 44,
    moduleNumber: 4,
    routePattern: "/lawyer/calendar",
    screenName: "Chamber Roster & Court Appearance Calendar",
    title: "Advocate Roster Calendar – Chamber & Court Schedule",
    description:
      "Configure weekly chamber consultation hours, sync High Court appearance blocks, and manage virtual video consultation availability.",
    keywords: ["advocate court diary calendar", "lawyer availability schedule"],
    schemaType: "WebPage",
  },
  45: {
    screenNumber: 45,
    moduleNumber: 4,
    routePattern: "/lawyer/calendar?modal=45-block-dates",
    screenName: "Block Court Appearance Dates & Edit Chamber Hours",
    title: "Block High Court Appearance Dates | Advocate Calendar",
    description:
      "Block dates reserved for Supreme Court or High Court roster appearances so client consultation bookings automatically avoid conflicts.",
    keywords: ["block court hearing dates", "edit chamber consultation hours"],
    schemaType: "WebPage",
  },
  46: {
    screenNumber: 46,
    moduleNumber: 4,
    routePattern: "/lawyer/wallet",
    screenName: "Advocate Escrow Earnings & IBAN Payout Wallet",
    title: "Advocate Escrow Wallet & RAAST IBAN Payouts | CRM",
    description:
      "Monitor cleared consultation fees, active escrow retainers, platform commission statements, and direct RAAST/IBAN bank transfers in PKR.",
    keywords: [
      "lawyer escrow wallet Pakistan",
      "RAAST IBAN payout for advocates",
    ],
    schemaType: "WebPage",
  },
  47: {
    screenNumber: 47,
    moduleNumber: 4,
    routePattern: "/lawyer/wallet?modal=47-withdraw",
    screenName: "Withdraw Cleared Escrow Funds to IBAN Modal",
    title: "Request RAAST / Bank IBAN Withdrawal | Advocate Wallet",
    description:
      "Transfer cleared PKR legal retainers from your escrow wallet to your verified Pakistani bank IBAN via instant RAAST settlement.",
    keywords: ["withdraw escrow funds IBAN", "HBL Meezan UBL lawyer payout"],
    schemaType: "WebPage",
  },
  48: {
    screenNumber: 48,
    moduleNumber: 4,
    routePattern: "/lawyer/pro-bono-review",
    screenName: "Pro-Bono Docket Review & Mandate Claim",
    title: "Pro-Bono Legal Aid Docket for Verified Advocates | PK",
    description:
      "Review vetted indigent client applications and claim pro-bono litigation mandates to fulfill public interest bar commitments.",
    keywords: [
      "pro bono legal cases for lawyers Pakistan",
      "public interest litigation docket",
    ],
    schemaType: "LegalService",
  },
  49: {
    screenNumber: 49,
    moduleNumber: 4,
    routePattern: "/lawyer/network",
    screenName: "Private Inter-City Advocate Referral Network",
    title: "Private Advocate Network – Outstation Counsel & Referrals",
    description:
      "Collaborate with verified advocates across Lahore, Karachi, Islamabad, Peshawar, and Quetta for outstation filings and co-counsel briefs.",
    keywords: [
      "lawyer referral network Pakistan",
      "co-counsel High Court Pakistan",
    ],
    schemaType: "WebPage",
  },

  // ================= MODULE 5: ADMIN, CMS, REALTIME COMMS & UTILITIES (SCREENS 50–61) =================
  50: {
    screenNumber: 50,
    moduleNumber: 5,
    routePattern: "/admin/cms",
    screenName: "Editorial Dashboard & Media CMS",
    title: "Editorial CMS – Publish Legal Briefings & Case Digests",
    description:
      "Author, edit, and publish bilingual English and Urdu legal articles to magazine_posts with instant Next.js homepage cache revalidation.",
    keywords: [
      "legal journal CMS Pakistan",
      "editorial manager dashboard",
      "publish Supreme Court digest",
    ],
    schemaType: "WebPage",
  },
  51: {
    screenNumber: 51,
    moduleNumber: 5,
    routePattern: "/admin",
    screenName: "Master 23-Table Supabase Studio & RBAC Console",
    title: "Master Admin Console – 23 Supabase Tables & RBAC Roles",
    description:
      "Manage all 23 Supabase legal database tables, enforce Row Level Security (RLS) policies, and assign RBAC roles across the platform.",
    keywords: [
      "legal platform admin console",
      "RBAC user management Supabase",
      "RLS policy manager",
    ],
    schemaType: "WebPage",
  },
  52: {
    screenNumber: 52,
    moduleNumber: 5,
    routePattern: "/admin/lawyers",
    screenName: "Bar Council License Verification Queue",
    title: "Advocate Bar Verification Queue | Admin Compliance Desk",
    description:
      "Audit submitted Bar Council licenses, verify High Court enrollment numbers, and promote verified advocates in the public directory.",
    keywords: [
      "verify advocate bar license",
      "admin lawyer approval queue",
    ],
    schemaType: "WebPage",
  },
  53: {
    screenNumber: 53,
    moduleNumber: 5,
    routePattern: "/admin/laws",
    screenName: "Statutory Law Library & Section CRUD Manager",
    title: "Statutory Laws & Sections Admin – Pakistan Code Editor",
    description:
      "Insert, amend, and publish bilingual English and Urdu statutory acts and sections with instant revalidation on the public Law Library.",
    keywords: [
      "manage Pakistan statutes database",
      "amend PPC CrPC sections CMS",
    ],
    schemaType: "Legislation",
  },
  54: {
    screenNumber: 54,
    moduleNumber: 5,
    routePattern: "/chat/[caseId]",
    screenName: "Realtime Encrypted Case Chat & Pleadings Room",
    title: "Encrypted Case Chat & Annexure Sharing | Legal Workspace",
    description:
      "Communicate in real time with your advocate or client via Supabase Realtime channels and exchange encrypted case pleadings and order sheets.",
    keywords: [
      "encrypted lawyer client chat",
      "realtime legal case messaging",
    ],
    schemaType: "WebPage",
  },
  55: {
    screenNumber: 55,
    moduleNumber: 5,
    routePattern: "/chat/[caseId]?sheet=55-scanner",
    screenName: "Court Document & Stamp Paper Scanner",
    title: "Scan & Upload Court Annexures, FIRs & Stamp Papers",
    description:
      "Digitize physical court orders, stamp paper deeds, and police FIRs with automatic contrast enhancement for your case docket.",
    keywords: ["scan court documents PDF", "upload FIR annexure"],
    schemaType: "WebPage",
  },
  56: {
    screenNumber: 56,
    moduleNumber: 5,
    routePattern: "/video-call/[caseId]",
    screenName: "Encrypted Video Consultation Chamber",
    title: "Encrypted Video Consultation Chamber | Daily Legal Brief",
    description:
      "Conduct end-to-end encrypted video legal consultations with screen sharing for statutory exhibits and automated escrow release upon completion.",
    keywords: [
      "online video consultation lawyer Pakistan",
      "virtual legal chamber",
    ],
    schemaType: "WebPage",
  },
  57: {
    screenNumber: 57,
    moduleNumber: 5,
    routePattern: "/video-call/[caseId]?modal=57-post-call-review",
    screenName: "Post-Consultation Rating & Escrow Release Modal",
    title: "Complete Legal Consultation & Authorize Escrow Release",
    description:
      "Rate your advocate consultation experience, log session minutes, and authorize the release of held escrow funds upon completion.",
    keywords: ["rate lawyer consultation", "release legal escrow funds"],
    schemaType: "WebPage",
  },
  58: {
    screenNumber: 58,
    moduleNumber: 5,
    routePattern: "/notifications",
    screenName: "Judicial & Platform Notification Center",
    title: "Legal Alerts, Hearing Reminders & Escrow Notifications",
    description:
      "Stay updated with real-time court hearing reminders, advocate forum replies, escrow deposit confirmations, and Bar verification alerts.",
    keywords: ["court hearing alerts Pakistan", "legal case notifications"],
    schemaType: "WebPage",
  },
  59: {
    screenNumber: 59,
    moduleNumber: 5,
    routePattern: "/settings",
    screenName: "Account Security, Language & Notification Settings",
    title: "Account Settings, Bilingual Mode & Privacy | Legal Brief",
    description:
      "Configure English/Urdu Nastaliq reading preferences, two-factor authentication, SMS hearing alerts, and RBAC profile details.",
    keywords: ["bilingual Urdu English legal settings", "account privacy law"],
    schemaType: "WebPage",
  },
  60: {
    screenNumber: 60,
    moduleNumber: 5,
    routePattern: "/settings?modal=60-language-switcher",
    screenName: "English / Urdu Nastaliq Bilingual Switcher",
    title: "Switch Between English & Urdu Nastaliq Legal Edition",
    description:
      "Toggle seamlessly between the English Common Law edition and the right-to-left Urdu Nastaliq edition of The Daily Legal Brief.",
    keywords: ["Urdu legal portal Pakistan", "Nastaliq law library"],
    schemaType: "WebPage",
  },
  61: {
    screenNumber: 61,
    moduleNumber: 5,
    routePattern: "/settings?tab=61-support-dispute",
    screenName: "Escrow Dispute Resolution & Help Desk",
    title: "Escrow Dispute Resolution & Client Help Desk | Pakistan",
    description:
      "Submit an escrow refund claim, report a missed consultation, or contact our legal compliance help desk for 24-hour mediation.",
    keywords: [
      "escrow dispute resolution Pakistan",
      "legal portal support desk",
    ],
    schemaType: "WebPage",
  },
};

/**
 * Helper to construct a full Next.js Metadata object from any ScreenSEOEntry + optional overrides
 */
export function buildMetadataFromScreen(
  screenNumber: number,
  overrides?: {
    title?: string;
    description?: string;
    canonicalPath?: string;
    ogType?: "website" | "article" | "profile";
    keywords?: string[];
  }
): Metadata {
  const entry = SEO_61_SCREENS_CATALOG[screenNumber] || SEO_61_SCREENS_CATALOG[2];
  const title = overrides?.title || entry.title;
  const description = overrides?.description || entry.description;
  const canonicalPath = overrides?.canonicalPath || entry.routePattern.split("?")[0];
  const canonicalUrl = `${BASE_URL}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;
  const keywords = overrides?.keywords || entry.keywords;
  const ogType =
    overrides?.ogType ||
    (entry.schemaType === "NewsArticle"
      ? "article"
      : entry.schemaType === "ProfilePage"
        ? "profile"
        : "website");

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-PK": canonicalUrl,
        "ur-PK": `${BASE_URL}/urdu`,
      },
    },
    openGraph: {
      type: ogType,
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_PK",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "x-screen-id": `Screen-${String(entry.screenNumber).padStart(2, "0")}`,
      "x-module-id": `Module-0${entry.moduleNumber}`,
      "geo.region": "PK",
      "geo.placename": "Pakistan",
    },
  };
}

/**
 * Dynamic Metadata Builders for Parameterized Routes (fetches real record titles from Supabase)
 */
export async function generateMagazineArticleMetadata(
  id: string,
  isUrdu = false
): Promise<Metadata> {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("magazine_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (post) {
    const rawTitle = isUrdu && post.title_urdu ? post.title_urdu : post.title;
    const category = post.category || "Supreme Court Analysis";
    const title = `${String(rawTitle).slice(0, 42)} | ${category} PK`;
    const rawSummary =
      (isUrdu && post.summary_urdu ? post.summary_urdu : post.summary) ||
      post.content ||
      "";
    const description =
      String(rawSummary).slice(0, 145) ||
      SEO_61_SCREENS_CATALOG[4].description;

    return buildMetadataFromScreen(4, {
      title,
      description,
      canonicalPath: isUrdu ? `/urdu/article/${id}` : `/magazine/${id}`,
      ogType: "article",
      keywords: [
        category,
        post.author || "High Court Advocate",
        "Pakistan Legal Journal",
        "Supreme Court of Pakistan",
      ],
    });
  }

  return buildMetadataFromScreen(4, {
    canonicalPath: isUrdu ? `/urdu/article/${id}` : `/magazine/${id}`,
    ogType: "article",
  });
}

export async function generateLawDetailMetadata(
  id: string,
  isUrdu = false
): Promise<Metadata> {
  const supabase = createClient();
  const { data: law } = await supabase
    .from("legal_acts")
    .select("*")
    .eq("id", id)
    .single();

  if (law) {
    const rawTitle = isUrdu && law.title_urdu ? law.title_urdu : law.title;
    const sec = law.section_number ? `${law.section_number} – ` : "";
    const title = `${sec}${String(rawTitle).slice(0, 38)} | Pakistan Code`;
    const rawDesc =
      (isUrdu && law.content_urdu ? law.content_urdu : law.content || law.description) ||
      "";
    const description =
      String(rawDesc).slice(0, 150) || SEO_61_SCREENS_CATALOG[12].description;

    return buildMetadataFromScreen(12, {
      title,
      description,
      canonicalPath: isUrdu ? `/urdu/laws/${id}` : `/laws/${id}`,
      keywords: [
        law.section_number || "Pakistan Statute",
        law.category || "Pakistan Penal Code",
        "Pakistan Code full text",
        "High Court commentary",
      ],
    });
  }

  return buildMetadataFromScreen(12, {
    canonicalPath: isUrdu ? `/urdu/laws/${id}` : `/laws/${id}`,
  });
}

export async function generateLawyerProfileMetadata(
  id: string,
  isBooking = false
): Promise<Metadata> {
  const supabase = createClient();
  const { data: lawyer } = await supabase
    .from("lawyer_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (lawyer) {
    const name = lawyer.name || "Verified High Court Advocate";
    const spec = lawyer.specialization || "Legal Counsel";
    const loc = lawyer.location || "Pakistan";
    const fee = lawyer.hourly_rate || "PKR 15,000";

    if (isBooking) {
      return buildMetadataFromScreen(22, {
        title: `Book ${name} (${spec}, ${loc}) | Legal Brief`,
        description: `Schedule an escrow-protected video or chamber consultation with ${name}, Bar-verified ${spec} advocate in ${loc} (${fee}).`,
        canonicalPath: `/lawyers/${id}/book`,
        keywords: [
          `book ${name}`,
          `${spec} lawyer ${loc}`,
          "online legal appointment Pakistan",
        ],
      });
    }

    return buildMetadataFromScreen(21, {
      title: `${name} – ${spec} Advocate in ${loc} | Pakistan`,
      description: `Consult ${name}, Bar-verified ${spec} lawyer in ${loc} (${lawyer.experience || "10+ Years"} experience). View court credentials and book online.`,
      canonicalPath: `/lawyers/${id}`,
      ogType: "profile",
      keywords: [
        name,
        `${spec} lawyer in ${loc}`,
        lawyer.bar_council || "High Court Advocate",
        "verified lawyer Pakistan",
      ],
    });
  }

  return buildMetadataFromScreen(isBooking ? 22 : 21, {
    canonicalPath: isBooking ? `/lawyers/${id}/book` : `/lawyers/${id}`,
  });
}

export async function generateAuthStepMetadata(
  stepSegments?: string[]
): Promise<Metadata> {
  const step = stepSegments?.[0] || "login";
  if (step === "role") {
    return buildMetadataFromScreen(16, { canonicalPath: "/auth/role" });
  }
  if (step === "setup-client") {
    return buildMetadataFromScreen(17, { canonicalPath: "/auth/setup-client" });
  }
  if (step === "setup-lawyer") {
    return buildMetadataFromScreen(18, { canonicalPath: "/auth/setup-lawyer" });
  }
  return buildMetadataFromScreen(14, { canonicalPath: "/auth/login" });
}

export async function generateLawyerSectionMetadata(
  sectionSegments?: string[]
): Promise<Metadata> {
  const section = sectionSegments?.[0] || "dashboard";
  const subId = sectionSegments?.[1] || "1";

  switch (section) {
    case "leads":
      return buildMetadataFromScreen(36, { canonicalPath: "/lawyer/leads" });
    case "cases":
      return buildMetadataFromScreen(38, {
        title: `Active Case File #${subId} – Order Sheets & Hearings | CRM`,
        description: `Manage court hearing milestones, Wakalatnama filings, and client updates for active litigation file #${subId} in Pakistan.`,
        canonicalPath: `/lawyer/cases/${subId}`,
      });
    case "ai-researcher":
      return buildMetadataFromScreen(40, {
        canonicalPath: "/lawyer/ai-researcher",
      });
    case "reputation-desk":
      return buildMetadataFromScreen(43, {
        canonicalPath: "/lawyer/reputation-desk",
      });
    case "calendar":
      return buildMetadataFromScreen(44, {
        canonicalPath: "/lawyer/calendar",
      });
    case "wallet":
      return buildMetadataFromScreen(46, {
        canonicalPath: "/lawyer/wallet",
      });
    case "pro-bono-review":
      return buildMetadataFromScreen(48, {
        canonicalPath: "/lawyer/pro-bono-review",
      });
    case "network":
      return buildMetadataFromScreen(49, {
        canonicalPath: "/lawyer/network",
      });
    default:
      return buildMetadataFromScreen(35, {
        canonicalPath: "/lawyer/dashboard",
      });
  }
}

export async function generateCheckoutMetadata(
  bookingId: string
): Promise<Metadata> {
  return buildMetadataFromScreen(24, {
    title: `Escrow Checkout #${bookingId} – RAAST & JazzCash | PK`,
    description: `Complete your protected legal escrow deposit (#${bookingId}) via RAAST IBAN, JazzCash, EasyPaisa, or card for your consultation.`,
    canonicalPath: `/checkout/${bookingId}`,
  });
}

export async function generateCaseChatMetadata(
  caseId: string
): Promise<Metadata> {
  return buildMetadataFromScreen(54, {
    title: `Encrypted Case Room ${caseId} – Live Counsel Chat`,
    description: `Real-time encrypted legal messaging and court annexure exchange for Case ${caseId} on The Daily Legal Brief Pakistan.`,
    canonicalPath: `/chat/${caseId}`,
  });
}

export async function generateVideoCallMetadata(
  caseId: string
): Promise<Metadata> {
  return buildMetadataFromScreen(56, {
    title: `Video Consultation Chamber ${caseId} | Legal Brief PK`,
    description: `Join encrypted legal video chamber ${caseId} for live advocate consultation, statutory exhibit review, and escrow completion.`,
    canonicalPath: `/video-call/${caseId}`,
  });
}

/**
 * Schema.org JSON-LD Structured Data Generator for LegalService + WebSite
 */
export function getLegalPortalJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: BASE_URL,
        inLanguage: ["en-PK", "ur-PK"],
        description: SEO_61_SCREENS_CATALOG[2].description,
      },
      {
        "@type": "LegalService",
        name: SITE_NAME,
        url: BASE_URL,
        areaServed: {
          "@type": "Country",
          name: "Pakistan",
        },
        availableLanguage: ["English", "Urdu"],
        serviceType: [
          "High Court Legal Consultation",
          "Supreme Court Case Digest",
          "Pakistan Statutory Law Library",
          "Escrow-Protected Advocate Retainers",
          "Pro-Bono Legal Aid Pakistan",
        ],
        priceRange: "PKR 0 - PKR 50,000",
      },
    ],
  };
}
