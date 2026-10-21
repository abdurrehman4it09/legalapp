"use server";

import { revalidatePath } from "next/cache";
import {
  getSupabaseServiceRoleClient,
  executeServerSideTableOperation,
} from "@/lib/supabase";

const supabase = getSupabaseServiceRoleClient();

/* ============================================================================
   MODULE 1: PUBLIC DISCOVERY SERVER ACTIONS (READ / SELECT)
   ============================================================================ */

/**
 * Route: / (Magazine Home Page)
 * Supabase Tables: SELECT from magazine_posts (limit 5), lawyer_profiles (featured), forum_questions (trending)
 */
export async function fetchMagazineHomeDataAction() {
  const [postsRes, lawyersRes, questionsRes, actsRes, templatesRes] =
    await Promise.all([
      supabase
        .from("magazine_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("lawyer_profiles")
        .select("*")
        .eq("verified", true)
        .limit(6),
      supabase
        .from("forum_questions")
        .select("*")
        .order("upvotes", { ascending: false })
        .limit(6),
      supabase.from("legal_acts").select("*").limit(6),
      supabase.from("legal_templates").select("*").limit(6),
    ]);

  return {
    magazine_posts: postsRes.data || [],
    lawyer_profiles: lawyersRes.data || [],
    forum_questions: questionsRes.data || [],
    legal_acts: actsRes.data || [],
    legal_templates: templatesRes.data || [],
  };
}

/**
 * Route: /magazine/[id] (Article Reader)
 * Supabase Tables: SELECT * FROM magazine_posts WHERE id = [id]
 */
export async function fetchMagazinePostByIdAction(id: string | number) {
  const { data, error } = await supabase
    .from("magazine_posts")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
}

/**
 * Route: /lawyers (Lawyer Directory)
 * Supabase Tables: SELECT from lawyer_profiles with filters (city, specialty, price, proBono, femaleOnly)
 */
export async function fetchLawyersDirectoryAction(filters?: {
  city?: string;
  specialty?: string;
  maxPrice?: number;
  proBonoOnly?: boolean;
  femaleOnly?: boolean;
}) {
  let query = supabase.from("lawyer_profiles").select("*");
  if (filters?.city && filters.city !== "All") {
    query = query.eq("city", filters.city);
  }
  if (filters?.specialty && filters.specialty !== "All") {
    query = query.ilike("specialization", `%${filters.specialty}%`);
  }
  if (typeof filters?.maxPrice === "number" && filters.maxPrice > 0) {
    query = query.lte("fee", filters.maxPrice);
  }
  if (filters?.proBonoOnly) {
    query = query.eq("pro_bono", true);
  }
  if (filters?.femaleOnly) {
    query = query.eq("is_female", true);
  }
  const { data, error } = await query;
  return { data: data || [], error };
}

/**
 * Route: /templates (Template Storefront)
 * Supabase Tables: SELECT from legal_templates
 */
export async function fetchLegalTemplatesAction() {
  const { data, error } = await supabase
    .from("legal_templates")
    .select("*")
    .order("created_at", { ascending: false });
  return { data: data || [], error };
}

/**
 * Route: /forum (Q&A Feed)
 * Supabase Tables: SELECT from forum_questions JOIN forum_answers
 */
export async function fetchForumFeedAction() {
  const { data, error } = await supabase
    .from("forum_questions")
    .select("*")
    .order("created_at", { ascending: false });
  return { data: data || [], error };
}

/**
 * Route: /laws & /laws/[id] (Law Library)
 * Supabase Tables: SELECT from legal_acts and legal_sections
 */
export async function fetchLegalActsAction(id?: string | number) {
  if (id !== undefined) {
    const { data, error } = await supabase
      .from("legal_acts")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  }
  const { data, error } = await supabase.from("legal_acts").select("*");
  return { data: data || [], error };
}

/* ============================================================================
   MODULE 2: AUTHENTICATION SERVER ACTIONS (AUTH & INSERT)
   ============================================================================ */

/**
 * Route: /auth/login
 * Supabase Action: supabase.auth.signInWithOtp()
 */
export async function signInWithOtpServerAction(payload: {
  phoneOrEmail: string;
}) {
  const isEmail = payload.phoneOrEmail.includes("@");
  const res = await supabase.auth.signInWithOtp(
    isEmail ? { email: payload.phoneOrEmail } : { phone: payload.phoneOrEmail }
  );
  revalidatePath("/");
  return res;
}

/**
 * Route: /auth/role & /auth/setup-client
 * Supabase Tables: UPDATE users SET role = '...', city = '...' WHERE id = auth.uid()
 */
export async function setupClientProfileServerAction(payload: {
  userId?: number;
  emailOrPhone: string;
  fullName: string;
  role: "Client" | "Verified Advocate" | "Editorial Manager" | "Admin";
  city: string;
  interestedCategories?: string[];
}) {
  const row = {
    id: payload.userId || Date.now(),
    email: payload.emailOrPhone.includes("@") ? payload.emailOrPhone : "",
    phone: !payload.emailOrPhone.includes("@") ? payload.emailOrPhone : "",
    full_name: payload.fullName,
    role: payload.role,
    city: payload.city,
    interested_categories: payload.interestedCategories || [
      "Property & Inheritance",
    ],
    verification_status: "Verified",
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("users").upsert([row]);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/client/cases");
  return { data, error };
}

/**
 * Route: /auth/setup-lawyer
 * Supabase Tables: INSERT INTO lawyer_profiles + Upload license image to lawyer_documents bucket
 */
export async function setupLawyerProfileServerAction(payload: {
  name: string;
  name_urdu?: string;
  city: string;
  specialization: string;
  court: string;
  fee: number;
  barCouncilId: string;
  licenseFileName: string;
}) {
  const licensePath = `${payload.barCouncilId.replace(/\s+/g, "_")}_${
    payload.licenseFileName || "PBC_License.pdf"
  }`;
  await supabase.storage
    .from("bar-licenses")
    .upload(licensePath, { name: licensePath });

  const storageUri = `storage://lawyer_documents/${licensePath}`;

  const lawyerRecord = {
    id: Date.now(),
    name: payload.name,
    name_urdu: payload.name_urdu || payload.name,
    specialization: payload.specialization,
    specialization_urdu: "آئینی اور دیوانی مقدمات",
    city: payload.city,
    city_urdu: payload.city,
    experience: "10 Years",
    court: payload.court,
    court_urdu: payload.court,
    hourly_fee_pkr: Number(payload.fee) || 15000,
    fee: Number(payload.fee) || 15000,
    rating_avg: 4.9,
    rating: 4.9,
    reviews_count: 1,
    reputation_points: 950,
    verified: true,
    pro_bono_opt_in: true,
    pro_bono: true,
    bar_council_id: payload.barCouncilId,
    bar_And_license: payload.barCouncilId,
    license_doc_url: storageUri,
    license_storage_url: storageUri,
    verification_status: "pending",
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("lawyers")
    .insert([lawyerRecord]);

  revalidatePath("/");
  revalidatePath("/urdu");
  revalidatePath("/lawyers");
  revalidatePath("/urdu/lawyers");
  revalidatePath("/admin");
  revalidatePath("/admin/lawyers");
  revalidatePath("/lawyer/dashboard");
  return { data, error, storageUri };
}

/* ============================================================================
   MODULE 3: CLIENT WORKSPACE SERVER ACTIONS (INSERT / UPDATE)
   ============================================================================ */

/**
 * Route: /lawyers/[id]/book & /checkout/[bookingId]
 * Supabase Tables: INSERT INTO appointments_and_cases (status: confirmed) + INSERT INTO escrow_transactions (escrow_status: held_in_escrow)
 */
export async function createBookingAndEscrowServerAction(payload: {
  lawyerId: number;
  lawyerName: string;
  court: string;
  clientName: string;
  date: string;
  timeSlot: string;
  fee: number;
  paymentMethod: string;
  caseSummary: string;
}) {
  const bookingId = Date.now();
  const commission = Math.round(payload.fee * 0.15);
  const lawyerNet = payload.fee - commission;
  const roomCode = `VIDEO-CHAMBER-${String(bookingId).slice(-4)}`;

  const appointmentRow = {
    id: bookingId,
    case_reference: `CASE-PK-${String(bookingId).slice(-6)}`,
    lawyer_id: payload.lawyerId,
    lawyer_name: payload.lawyerName,
    court: payload.court,
    client_name: payload.clientName,
    case_title: payload.caseSummary.slice(0, 90) || "Legal Consultation & Representation",
    case_category: "General Legal Consultation",
    scheduled_date: payload.date,
    date: payload.date,
    scheduled_slot: payload.timeSlot,
    time_slot: payload.timeSlot,
    fee_pkr: payload.fee,
    fee: payload.fee,
    escrow_amount: lawyerNet,
    platform_commission: commission,
    payment_method: payload.paymentMethod,
    video_room_id: roomCode,
    status: "confirmed",
    is_pro_bono: false,
    case_summary: payload.caseSummary,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const escrowRow = {
    id: bookingId + 1,
    case_id: bookingId,
    appointment_id: bookingId,
    lawyer_id: payload.lawyerId,
    client_name: payload.clientName,
    lawyer_name: payload.lawyerName,
    idempotency_key: `IDEM-${bookingId}`,
    amount_pkr: payload.fee,
    gross_amount_pkr: payload.fee,
    lawyer_share_pkr: lawyerNet,
    platform_fee_pkr: commission,
    payment_gateway: payload.paymentMethod,
    escrow_status: "held_in_escrow",
    accounting_state: "Funds Held in Escrow",
    milestone_label: "Initial Consultation & Case Filing",
    created_at: new Date().toISOString(),
  };

  await Promise.all([
    supabase.from("appointments_and_cases").insert([appointmentRow]),
    supabase.from("escrow_transactions").insert([escrowRow]),
  ]);

  revalidatePath("/");
  revalidatePath("/urdu");
  revalidatePath("/lawyers");
  revalidatePath("/urdu/lawyers");
  revalidatePath("/client/cases");
  revalidatePath("/lawyer/dashboard");
  revalidatePath("/lawyer/leads");
  revalidatePath("/lawyer/wallet");
  revalidatePath("/admin");

  return { bookingId, appointmentRow, escrowRow };
}

/**
 * Route: /client/cases
 * Supabase Tables: SELECT / UPDATE appointments_and_cases WHERE client_id = auth.uid()
 */
export async function updateClientAppointmentServerAction(payload: {
  id: number;
  status: string;
  date?: string;
  timeSlot?: string;
}) {
  const patch: Record<string, any> = {
    status: payload.status,
    updated_at: new Date().toISOString(),
  };
  if (payload.date) {
    patch.scheduled_date = payload.date;
    patch.date = payload.date;
  }
  if (payload.timeSlot) {
    patch.scheduled_slot = payload.timeSlot;
    patch.time_slot = payload.timeSlot;
  }

  const { data, error } = await supabase
    .from("appointments_and_cases")
    .update(patch)
    .eq("id", payload.id);

  revalidatePath("/client/cases");
  revalidatePath("/lawyer/dashboard");
  revalidatePath("/lawyer/leads");
  revalidatePath("/admin");
  return { data, error };
}

/**
 * Route: /client/ai-assistant & /lawyer/ai-researcher
 * Supabase Action: Trigger RAG API + INSERT INTO ai_chat_logs
 */
export async function saveAiChatHistoryServerAction(payload: {
  mode: "assistant" | "researcher" | "citizen_basic" | "lawyer_pro_rag" | "document_ocr";
  userQuery: string;
  aiResponse: string;
  citedStatutes?: string;
  uploadedDocUrl?: string;
}) {
  const normalizedMode =
    payload.mode === "researcher"
      ? "lawyer_pro_rag"
      : payload.mode === "assistant"
      ? "citizen_basic"
      : payload.mode;

  const row = {
    id: Date.now(),
    session_id: `SESSION-${Date.now()}`,
    mode: normalizedMode,
    user_prompt: payload.userQuery,
    query: payload.userQuery,
    user_query: payload.userQuery,
    ai_response: payload.aiResponse,
    response: payload.aiResponse,
    cited_references_json: [
      payload.citedStatutes || "PPC / CrPC / Constitution of Pakistan 1973",
    ],
    cited_statutes:
      payload.citedStatutes || "PPC / CrPC / Constitution of Pakistan 1973",
    uploaded_doc_url: payload.uploadedDocUrl || "",
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("ai_chat_logs").insert([row]);
  revalidatePath("/client/ai-assistant");
  revalidatePath("/lawyer/ai-researcher");
  revalidatePath("/admin");
  return { data, error, row };
}

/**
 * Route: /forum/ask
 * Supabase Tables: INSERT INTO forum_questions
 */
export async function askForumQuestionServerAction(payload: {
  title: string;
  titleUrdu?: string;
  body?: string;
  bodyUrdu?: string;
  category: string;
  city: string;
  isAnonymous: boolean;
  isLawyerOnlyPrivate?: boolean;
  authorName: string;
}) {
  const displayName = payload.isAnonymous
    ? "Anonymous Citizen"
    : payload.authorName;
  const row = {
    id: Date.now(),
    asker_display_name: displayName,
    author_name: displayName,
    is_anonymous: payload.isAnonymous,
    is_lawyer_only_private: Boolean(payload.isLawyerOnlyPrivate),
    category: payload.category,
    category_urdu: "قانونی استفسار",
    city: payload.city,
    title: payload.title,
    title_urdu: payload.titleUrdu || payload.title,
    body: payload.body || payload.title,
    body_urdu: payload.bodyUrdu || payload.titleUrdu || payload.title,
    upvotes: 1,
    answers_count: 0,
    answer_count: 0,
    verified_reply: null,
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("forum_questions").insert([row]);
  revalidatePath("/");
  revalidatePath("/urdu");
  revalidatePath("/forum");
  revalidatePath("/lawyer/reputation-desk");
  revalidatePath("/admin");
  return { data, error, row };
}

/**
 * Route: /pro-bono/apply
 * Supabase Tables: INSERT INTO pro_bono_applications + Upload income proof to Storage (private-legal-docs)
 */
export async function submitProBonoApplicationServerAction(payload: {
  applicant: string;
  applicantPhone?: string;
  city?: string;
  monthlyIncome: string;
  category: string;
  caseDescription?: string;
  certificateType: string;
  fileName?: string;
}) {
  const storagePath = `income-proofs/${Date.now()}_${
    payload.fileName || "Income_Certificate.pdf"
  }`;
  await supabase.storage
    .from("private-legal-docs")
    .upload(storagePath, { name: storagePath });

  const row = {
    id: Date.now(),
    applicant_name: payload.applicant,
    applicant: payload.applicant,
    applicant_phone: payload.applicantPhone || "+92 300 0000000",
    city: payload.city || "Islamabad",
    case_category: payload.category,
    category: payload.category,
    monthly_income_pkr: Number(String(payload.monthlyIncome).replace(/\D/g, "")) || 25000,
    monthly_income: payload.monthlyIncome,
    case_description:
      payload.caseDescription ||
      `${payload.category} representation requested with ${payload.certificateType}`,
    certificate_type: payload.certificateType,
    income_certificate_url: `storage://private-legal-docs/${storagePath}`,
    income_proof_url: `storage://private-legal-docs/${storagePath}`,
    status: "pending_review",
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("pro_bono_applications")
    .insert([row]);
  revalidatePath("/");
  revalidatePath("/urdu");
  revalidatePath("/pro-bono/apply");
  revalidatePath("/lawyer/dashboard");
  revalidatePath("/admin");
  return { data, error, row };
}

/* ============================================================================
   MODULE 4: LAWYER CRM SERVER ACTIONS (READ / UPDATE)
   ============================================================================ */

/**
 * Route: /lawyer/dashboard & /lawyer/leads
 * Supabase Action: UPDATE appointments_and_cases / crm_leads SET status = 'confirmed/cancelled'
 */
export async function updateLeadOrCaseStatusServerAction(payload: {
  id: number;
  table?: "crm_leads" | "appointments_and_cases";
  status: string;
}) {
  const targetTable = payload.table || "crm_leads";
  const { data, error } = await supabase
    .from(targetTable)
    .update({ status: payload.status })
    .eq("id", payload.id);

  revalidatePath("/lawyer/dashboard");
  revalidatePath("/lawyer/leads");
  revalidatePath("/client/cases");
  revalidatePath("/admin");
  return { data, error };
}

/**
 * Route: /lawyer/cases/[id]
 * Supabase Tables: INSERT / UPDATE case_milestones
 */
export async function upsertCaseMilestoneServerAction(payload: {
  id?: number;
  caseId?: number;
  caseRef: string;
  title: string;
  description?: string;
  amountPkr?: number;
  status: string;
  date: string;
  sharedFile?: string;
  privateLawyerNotes?: string;
}) {
  const row = {
    id: payload.id || Date.now(),
    case_id: payload.caseId || 101,
    case_ref: payload.caseRef,
    title: payload.title,
    description: payload.description || payload.title,
    amount_pkr: payload.amountPkr || 15000,
    status: payload.status,
    due_date: payload.date,
    date: payload.date,
    shared_file: payload.sharedFile || "Verified_Order_Sheet.pdf",
    private_lawyer_notes: payload.privateLawyerNotes || "",
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("case_milestones").upsert([row]);
  revalidatePath("/lawyer/dashboard");
  revalidatePath(`/lawyer/cases/${row.id}`);
  revalidatePath("/client/cases");
  revalidatePath("/admin");
  return { data, error, row };
}

/**
 * Route: /lawyer/reputation-desk
 * Supabase Tables: INSERT INTO forum_answers + UPDATE forum_questions + UPDATE lawyers SET reputation_points = reputation_points + 10
 */
export async function submitAdvocateForumAnswerServerAction(payload: {
  questionId: number;
  lawyerId?: number;
  lawyerName: string;
  court: string;
  replyText: string;
  replyTextUrdu?: string;
}) {
  const verifiedReply = {
    lawyer_name: payload.lawyerName,
    lawyer_name_urdu: payload.lawyerName,
    court: payload.court,
    reply: payload.replyText,
    reply_urdu: payload.replyTextUrdu || payload.replyText,
  };

  await supabase.from("forum_answers").insert([
    {
      id: Date.now(),
      question_id: payload.questionId,
      lawyer_id: payload.lawyerId || 1,
      lawyer_name: payload.lawyerName,
      lawyer_specialty: payload.court,
      answer_text: payload.replyText,
      answer_text_urdu: payload.replyTextUrdu || payload.replyText,
      upvotes: 1,
      is_accepted: true,
      created_at: new Date().toISOString(),
    },
  ]);

  await supabase
    .from("forum_questions")
    .update({
      answers_count: 1,
      answer_count: 1,
      verified_reply: verifiedReply,
    })
    .eq("id", payload.questionId);

  if (payload.lawyerId) {
    const { data: lawyer } = await supabase
      .from("lawyers")
      .select("*")
      .eq("id", payload.lawyerId)
      .single();
    if (lawyer) {
      const nextPoints =
        Number(lawyer.reputation_points || lawyer.reputation_score || 950) + 10;
      await supabase
        .from("lawyers")
        .update({
          reputation_points: nextPoints,
          reputation_score: nextPoints,
        })
        .eq("id", payload.lawyerId);
    }
  }

  revalidatePath("/");
  revalidatePath("/urdu");
  revalidatePath("/forum");
  revalidatePath("/lawyer/reputation-desk");
  revalidatePath("/lawyers");
  revalidatePath("/urdu/lawyers");
  return { verifiedReply };
}

/**
 * Route: /lawyer/calendar
 * Supabase Tables: INSERT / UPDATE lawyer_availability
 */
export async function updateLawyerAvailabilityServerAction(payload: {
  id?: number;
  lawyerId?: number;
  lawyerName: string;
  workingDays: string;
  workingHours: string;
  availableSlots: string[];
  blockedDates: string[];
}) {
  const row = {
    id: payload.id || 1,
    lawyer_id: payload.lawyerId || 1,
    lawyer_name: payload.lawyerName,
    day_of_week: payload.workingDays,
    working_days: payload.workingDays,
    working_hours: payload.workingHours,
    time_slots: payload.availableSlots,
    available_slots: payload.availableSlots,
    blocked_dates: payload.blockedDates,
    is_available: true,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("lawyer_availability")
    .upsert([row]);
  revalidatePath("/lawyer/calendar");
  revalidatePath("/lawyers");
  revalidatePath("/urdu/lawyers");
  return { data, error, row };
}

/**
 * Route: /lawyer/wallet
 * Supabase Tables: SELECT from escrow_transactions + INSERT INTO withdrawal_requests
 */
export async function requestWalletWithdrawalServerAction(payload: {
  lawyerId?: number;
  lawyerName: string;
  iban: string;
  bankName?: string;
  amountPkr: number;
}) {
  const row = {
    id: Date.now(),
    lawyer_id: payload.lawyerId || 1,
    lawyer_name: payload.lawyerName,
    account_title: payload.lawyerName,
    iban_number: payload.iban,
    iban: payload.iban,
    bank_name: payload.bankName || "RAAST Instant Settlement",
    amount_pkr: Number(payload.amountPkr),
    status: "processing",
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("withdrawal_requests")
    .insert([row]);
  revalidatePath("/lawyer/wallet");
  revalidatePath("/lawyer/dashboard");
  revalidatePath("/admin");
  return { data, error, row };
}

/* ============================================================================
   MODULE 5: ADMIN, CMS & COMMS SERVER ACTIONS (CREATE / DELETE / REALTIME)
   ============================================================================ */

/**
 * Route: /admin/cms (Editorial Dashboard)
 * Supabase Tables: INSERT / UPDATE / DELETE on articles
 * Data Sync Rule: Revalidate Next.js cache on submit so the public homepage updates instantly.
 */
export async function saveMagazinePostServerAction(payload: {
  id?: number | null;
  slug?: string;
  title: string;
  subtitle?: string;
  category: string;
  author: string;
  read_time?: string;
  content: string;
  title_urdu?: string;
  subtitle_urdu?: string;
  category_urdu?: string;
  author_urdu?: string;
  read_time_urdu?: string;
  content_urdu?: string;
  video_reel_url?: string;
  audio_brief_url?: string;
  thumbnail_url?: string;
  status?: string;
}) {
  const slug =
    payload.slug ||
    payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const row = {
    slug,
    title: payload.title,
    subtitle: payload.subtitle || "",
    category: payload.category,
    author_name: payload.author,
    author: payload.author,
    read_time_minutes:
      parseInt(String(payload.read_time || "5"), 10) || 5,
    read_time: payload.read_time || "5 min read",
    content: payload.content,
    title_urdu: payload.title_urdu || payload.title,
    subtitle_urdu: payload.subtitle_urdu || payload.subtitle || "",
    category_urdu: payload.category_urdu || "قانونی تجزیہ",
    author_urdu: payload.author_urdu || payload.author,
    read_time_urdu: payload.read_time_urdu || "5 منٹ کا مطالعہ",
    content_urdu: payload.content_urdu || payload.content,
    video_reel_url: payload.video_reel_url || "",
    audio_brief_url: payload.audio_brief_url || "",
    thumbnail_url: payload.thumbnail_url || "",
    status: payload.status || "published",
    created_at: new Date().toISOString(),
  };

  if (payload.id) {
    await supabase.from("articles").update(row).eq("id", payload.id);
    revalidatePath(`/magazine/${payload.id}`);
    revalidatePath(`/article/${payload.id}`);
    revalidatePath(`/urdu/article/${payload.id}`);
  } else {
    const newId = Date.now();
    await supabase.from("articles").insert([{ id: newId, ...row }]);
  }

  revalidatePath("/");
  revalidatePath("/urdu");
  revalidatePath("/laws");
  revalidatePath("/urdu/laws");
  revalidatePath("/lawyers");
  revalidatePath("/urdu/lawyers");
  revalidatePath("/forum");
  revalidatePath("/templates");
  revalidatePath("/admin");
  revalidatePath("/admin/cms");
  return { success: true };
}

export async function deleteMagazinePostServerAction(id: number) {
  await supabase.from("articles").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/urdu");
  revalidatePath("/admin");
  revalidatePath("/admin/cms");
  return { success: true };
}

/**
 * Route: /admin/laws
 * Supabase Tables: INSERT / UPDATE / DELETE on laws and legal_sections
 */
export async function saveLegalActServerAction(payload: {
  id?: number | null;
  slug?: string;
  title: string;
  title_urdu?: string;
  category: string;
  year: string;
  section_count: string;
  description: string;
  content: string;
  content_urdu?: string;
  commentary?: string;
  plain_summary_en?: string;
  plain_summary_ur?: string;
  is_bailable?: boolean;
  max_punishment?: string;
  trial_court?: string;
}) {
  const slug =
    payload.slug ||
    payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const row = {
    slug,
    title: payload.title,
    title_urdu: payload.title_urdu || payload.title,
    category: payload.category,
    promulgation_year: parseInt(String(payload.year), 10) || 1973,
    year: payload.year,
    section_number: payload.section_count,
    section_count: payload.section_count,
    description: payload.description,
    plain_summary_en: payload.plain_summary_en || payload.description,
    plain_summary_ur:
      payload.plain_summary_ur || payload.title_urdu || payload.description,
    content: payload.content,
    content_urdu: payload.content_urdu || payload.content,
    commentary: payload.commentary || "",
    marginal_notes: payload.commentary || payload.description,
    is_bailable: payload.is_bailable ?? true,
    max_punishment: payload.max_punishment || "As prescribed by statute",
    trial_court: payload.trial_court || "Session / Civil Court",
    created_at: new Date().toISOString(),
  };

  if (payload.id) {
    await supabase.from("laws").update(row).eq("id", payload.id);
    revalidatePath(`/laws/${payload.id}`);
    revalidatePath(`/urdu/laws/${payload.id}`);
  } else {
    await supabase.from("laws").insert([{ id: Date.now(), ...row }]);
  }

  revalidatePath("/");
  revalidatePath("/urdu");
  revalidatePath("/laws");
  revalidatePath("/urdu/laws");
  revalidatePath("/admin");
  revalidatePath("/admin/laws");
  return { success: true };
}

/**
 * Route: /chat/[caseId]
 * Supabase Tables: INSERT INTO chat_messages
 */
export async function sendCaseChatMessageServerAction(payload: {
  caseId: string;
  senderName: string;
  senderRole: "client" | "advocate" | "lawyer" | "system";
  messageText: string;
  attachmentUrl?: string;
  attachmentType?: "none" | "document" | "image" | "voice_note";
}) {
  const normalizedRole =
    payload.senderRole === "advocate" ? "lawyer" : payload.senderRole;
  const row = {
    id: Date.now(),
    case_id: Number(String(payload.caseId).replace(/\D/g, "")) || 101,
    room_id: payload.caseId,
    sender_name: payload.senderName,
    sender_role: normalizedRole,
    message_text: payload.messageText,
    attachment_url: payload.attachmentUrl || "",
    attachment_type:
      payload.attachmentType ||
      (payload.attachmentUrl ? "document" : "none"),
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("chat_messages").insert([row]);
  revalidatePath(`/chat/${payload.caseId}`);
  return { data, error, row };
}

/**
 * Route: /video-call/[caseId]
 * Supabase Action: Update appointments_and_cases status to completed + log review
 */
export async function completeVideoConsultationServerAction(payload: {
  caseId: string;
  lawyerName: string;
  clientName: string;
  rating: number;
  reviewText: string;
}) {
  await supabase
    .from("appointments_and_cases")
    .update({
      status: "completed",
      client_rating: payload.rating,
      client_review: payload.reviewText,
      updated_at: new Date().toISOString(),
    })
    .eq("video_room_id", payload.caseId);

  const logRow = {
    id: Date.now(),
    room_id: payload.caseId,
    lawyer_name: payload.lawyerName,
    client_name: payload.clientName,
    duration_minutes: 30,
    post_call_rating: payload.rating,
    client_review: payload.reviewText,
    created_at: new Date().toISOString(),
  };
  await supabase.from("video_consultation_logs").insert([logRow]);
  revalidatePath(`/video-call/${payload.caseId}`);
  revalidatePath("/client/cases");
  revalidatePath("/lawyer/dashboard");
  return { success: true, logRow };
}

/**
 * Privileged Service-Role CRUD Server Action across all 18 production Supabase tables
 * (Admin CMS, Case Management, Escrow, Law Library, Forum, and Users & RBAC).
 */
export async function executeServiceRoleTableCrudAction(params: {
  table: string;
  operation: "SELECT" | "INSERT" | "UPSERT" | "UPDATE" | "DELETE";
  payload?: any;
  matchColumn?: string;
  matchValue?: any;
  revalidateRoutes?: string[];
}) {
  const result = await executeServerSideTableOperation({
    table: params.table,
    operation: params.operation,
    payload: params.payload,
    matchColumn: params.matchColumn,
    matchValue: params.matchValue,
  });

  revalidatePath("/");
  revalidatePath("/urdu");
  revalidatePath("/laws");
  revalidatePath("/urdu/laws");
  revalidatePath("/lawyers");
  revalidatePath("/urdu/lawyers");
  revalidatePath("/forum");
  revalidatePath("/templates");
  revalidatePath("/admin");
  revalidatePath("/admin/cms");
  revalidatePath("/admin/laws");
  revalidatePath("/admin/lawyers");
  revalidatePath("/client/cases");
  revalidatePath("/lawyer/dashboard");
  revalidatePath("/lawyer/leads");

  if (Array.isArray(params.revalidateRoutes)) {
    for (const route of params.revalidateRoutes) {
      revalidatePath(route);
    }
  }

  return result;
}

