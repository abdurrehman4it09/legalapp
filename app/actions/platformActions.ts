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
    fee: Number(payload.fee) || 15000,
    rating: 4.9,
    reviews_count: 1,
    verified: true,
    pro_bono: true,
    bar_And_license: payload.barCouncilId,
    license_storage_url: storageUri,
    verification_status: "Under Review",
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("lawyer_profiles")
    .insert([lawyerRecord]);

  revalidatePath("/");
  revalidatePath("/lawyers");
  revalidatePath("/admin/lawyers");
  revalidatePath("/lawyer/dashboard");
  return { data, error, storageUri };
}

/* ============================================================================
   MODULE 3: CLIENT WORKSPACE SERVER ACTIONS (INSERT / UPDATE)
   ============================================================================ */

/**
 * Route: /lawyers/[id]/book & /checkout/[bookingId]
 * Supabase Tables: INSERT INTO appointments_and_cases (status: pending) + INSERT INTO escrow_transactions (status: held_in_escrow)
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
    lawyer_id: payload.lawyerId,
    lawyer_name: payload.lawyerName,
    court: payload.court,
    client_name: payload.clientName,
    date: payload.date,
    time_slot: payload.timeSlot,
    fee: payload.fee,
    escrow_amount: lawyerNet,
    platform_commission: commission,
    payment_method: payload.paymentMethod,
    video_room_id: roomCode,
    status: "Escrow Locked (Pending Hearing)",
    case_summary: payload.caseSummary,
    created_at: new Date().toISOString(),
  };

  const escrowRow = {
    id: bookingId + 1,
    appointment_id: bookingId,
    client_name: payload.clientName,
    lawyer_name: payload.lawyerName,
    gross_amount_pkr: payload.fee,
    lawyer_share_pkr: lawyerNet,
    platform_fee_pkr: commission,
    payment_gateway: payload.paymentMethod,
    accounting_state: "Funds Held in Escrow",
    milestone_label: "Initial Consultation & Case Filing",
    created_at: new Date().toISOString(),
  };

  await Promise.all([
    supabase.from("appointments_and_cases").insert([appointmentRow]),
    supabase.from("escrow_transactions").insert([escrowRow]),
  ]);

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
  const patch: Record<string, any> = { status: payload.status };
  if (payload.date) patch.date = payload.date;
  if (payload.timeSlot) patch.time_slot = payload.timeSlot;

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
 * Supabase Action: Trigger RAG API + INSERT INTO ai_chat_history
 */
export async function saveAiChatHistoryServerAction(payload: {
  mode: "assistant" | "researcher";
  userQuery: string;
  aiResponse: string;
  citedStatutes?: string;
}) {
  const row = {
    id: Date.now(),
    mode: payload.mode,
    user_query: payload.userQuery,
    ai_response: payload.aiResponse,
    cited_statutes:
      payload.citedStatutes || "PPC / CrPC / Constitution of Pakistan 1973",
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("ai_chat_history").insert([row]);
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
  category: string;
  city: string;
  isAnonymous: boolean;
  authorName: string;
}) {
  const row = {
    id: Date.now(),
    title: payload.title,
    title_urdu: payload.titleUrdu || payload.title,
    category: payload.category,
    category_urdu: "قانونی استفسار",
    city: payload.city,
    is_anonymous: payload.isAnonymous,
    author_name: payload.isAnonymous ? "Anonymous Citizen" : payload.authorName,
    upvotes: 1,
    answer_count: 0,
    verified_reply: null,
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("forum_questions").insert([row]);
  revalidatePath("/");
  revalidatePath("/forum");
  revalidatePath("/lawyer/reputation-desk");
  revalidatePath("/admin");
  return { data, error, row };
}

/**
 * Route: /pro-bono/apply
 * Supabase Tables: INSERT INTO pro_bono_applications + Upload income proof to Storage
 */
export async function submitProBonoApplicationServerAction(payload: {
  applicant: string;
  monthlyIncome: string;
  category: string;
  certificateType: string;
  fileName?: string;
}) {
  const storagePath = `income-proofs/${Date.now()}_${
    payload.fileName || "Income_Certificate.pdf"
  }`;
  await supabase.storage
    .from("income-proofs")
    .upload(storagePath, { name: storagePath });

  const row = {
    id: Date.now(),
    applicant: payload.applicant,
    monthly_income: payload.monthlyIncome,
    category: payload.category,
    certificate_type: payload.certificateType,
    income_proof_url: `storage://${storagePath}`,
    status: "Assigned to High Court Pro-Bono Panel",
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("pro_bono_applications")
    .insert([row]);
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
 * Supabase Action: UPDATE appointments_and_cases / crm_leads SET status = 'accepted/declined'
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
  caseRef: string;
  title: string;
  status: string;
  date: string;
  sharedFile?: string;
  privateLawyerNotes?: string;
}) {
  const row = {
    id: payload.id || Date.now(),
    case_ref: payload.caseRef,
    title: payload.title,
    status: payload.status,
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
 * Supabase Tables: INSERT INTO forum_answers (verified_reply) + UPDATE lawyer_profiles SET reputation_score = reputation_score + 10
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

  await supabase
    .from("forum_questions")
    .update({
      answer_count: 1,
      verified_reply: verifiedReply,
    })
    .eq("id", payload.questionId);

  if (payload.lawyerId) {
    const { data: lawyer } = await supabase
      .from("lawyer_profiles")
      .select("*")
      .eq("id", payload.lawyerId)
      .single();
    if (lawyer) {
      await supabase
        .from("lawyer_profiles")
        .update({
          reputation_score: Number(lawyer.reputation_score || 950) + 10,
        })
        .eq("id", payload.lawyerId);
    }
  }

  revalidatePath("/");
  revalidatePath("/forum");
  revalidatePath("/lawyer/reputation-desk");
  revalidatePath("/lawyers");
  return { verifiedReply };
}

/**
 * Route: /lawyer/calendar
 * Supabase Tables: INSERT / UPDATE lawyer_availability
 */
export async function updateLawyerAvailabilityServerAction(payload: {
  id?: number;
  lawyerName: string;
  workingDays: string;
  workingHours: string;
  availableSlots: string[];
  blockedDates: string[];
}) {
  const row = {
    id: payload.id || 1,
    lawyer_name: payload.lawyerName,
    working_days: payload.workingDays,
    working_hours: payload.workingHours,
    available_slots: payload.availableSlots,
    blocked_dates: payload.blockedDates,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("lawyer_availability")
    .upsert([row]);
  revalidatePath("/lawyer/calendar");
  revalidatePath("/lawyers");
  return { data, error, row };
}

/**
 * Route: /lawyer/wallet
 * Supabase Tables: SELECT from escrow_transactions + INSERT INTO withdrawal_requests
 */
export async function requestWalletWithdrawalServerAction(payload: {
  lawyerName: string;
  iban: string;
  bankName?: string;
  amountPkr: number;
}) {
  const row = {
    id: Date.now(),
    lawyer_name: payload.lawyerName,
    iban: payload.iban,
    bank_name: payload.bankName || "RAAST Instant Settlement",
    amount_pkr: Number(payload.amountPkr),
    status: "Settled via RAAST",
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
 * Supabase Tables: INSERT / UPDATE / DELETE on magazine_posts
 * Data Sync Rule: Revalidate Next.js cache (revalidatePath('/')) on submit so the public homepage updates instantly.
 */
export async function saveMagazinePostServerAction(payload: {
  id?: number | null;
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
}) {
  const row = {
    title: payload.title,
    subtitle: payload.subtitle || "",
    category: payload.category,
    author: payload.author,
    read_time: payload.read_time || "5 min read",
    content: payload.content,
    title_urdu: payload.title_urdu || payload.title,
    subtitle_urdu: payload.subtitle_urdu || payload.subtitle || "",
    category_urdu: payload.category_urdu || "قانونی تجزیہ",
    author_urdu: payload.author_urdu || payload.author,
    read_time_urdu: payload.read_time_urdu || "5 منٹ کا مطالعہ",
    content_urdu: payload.content_urdu || payload.content,
    created_at: new Date().toISOString(),
  };

  if (payload.id) {
    await supabase.from("magazine_posts").update(row).eq("id", payload.id);
    revalidatePath(`/magazine/${payload.id}`);
    revalidatePath(`/article/${payload.id}`);
  } else {
    const newId = Date.now();
    await supabase.from("magazine_posts").insert([{ id: newId, ...row }]);
  }

  revalidatePath("/");
  revalidatePath("/urdu");
  revalidatePath("/admin");
  revalidatePath("/admin/cms");
  return { success: true };
}

export async function deleteMagazinePostServerAction(id: number) {
  await supabase.from("magazine_posts").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/urdu");
  revalidatePath("/admin");
  revalidatePath("/admin/cms");
  return { success: true };
}

/**
 * Route: /admin/laws
 * Supabase Tables: INSERT / UPDATE / DELETE on legal_acts and legal_sections
 */
export async function saveLegalActServerAction(payload: {
  id?: number | null;
  title: string;
  title_urdu?: string;
  category: string;
  year: string;
  section_count: string;
  description: string;
  content: string;
  commentary?: string;
}) {
  const row = {
    title: payload.title,
    title_urdu: payload.title_urdu || payload.title,
    category: payload.category,
    year: payload.year,
    section_count: payload.section_count,
    description: payload.description,
    content: payload.content,
    commentary: payload.commentary || "",
    created_at: new Date().toISOString(),
  };

  if (payload.id) {
    await supabase.from("legal_acts").update(row).eq("id", payload.id);
    revalidatePath(`/laws/${payload.id}`);
  } else {
    await supabase
      .from("legal_acts")
      .insert([{ id: Date.now(), ...row }]);
  }

  revalidatePath("/");
  revalidatePath("/laws");
  revalidatePath("/admin/laws");
  return { success: true };
}

/**
 * Route: /chat/[caseId]
 * Supabase Tables: INSERT INTO messages
 */
export async function sendCaseChatMessageServerAction(payload: {
  caseId: string;
  senderName: string;
  senderRole: "client" | "advocate";
  messageText: string;
  attachmentUrl?: string;
}) {
  const row = {
    id: Date.now(),
    room_id: payload.caseId,
    sender_name: payload.senderName,
    sender_role: payload.senderRole,
    message_text: payload.messageText,
    attachment_url: payload.attachmentUrl || "",
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("messages").insert([row]);
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
    .update({ status: "Completed" })
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
 * Privileged Service-Role CRUD Server Action across all 23 platform tables
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
  revalidatePath("/admin");
  revalidatePath("/admin/cms");
  revalidatePath("/admin/laws");
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

