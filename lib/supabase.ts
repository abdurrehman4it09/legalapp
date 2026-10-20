import {
  createClient as createHybridSupabaseClient,
  isRealSupabaseConfigured,
  resolveTableName,
  getTableData,
  saveTableData,
  resetAllPlatformData,
  getSiteSettings,
  saveSiteSettings,
  RBAC_ROLES,
  RBAC_ROLE_PERMISSIONS,
  normalizeRBACRole,
  getActiveRBACSession,
  syncUserProfileAndSession,
  switchActiveRBACRole,
  verifyUserProfileRole,
  evaluateUsersProfilesRLS,
  USERS_PROFILES_SELF_EDITABLE_COLUMNS,
  USERS_PROFILES_RLS_SQL,
  SUPABASE_FULL_SQL_SCHEMA,
  SUPABASE_STORAGE_BUCKETS,
  isOwnUserProfileRecord,
  type RBACRole,
  type RBACPermissionSet,
  type SyncedUserProfileSession,
  type SupabaseTableName,
} from "@/app/supabase";

/**
 * Environment Variable Configuration for Unified & Server-Side Service Role Supabase Connection
 * - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
 * - `SUPABASE_SERVICE_ROLE_KEY`: Server-only secret key enabling privileged, RLS-bypassing server-side CRUD operations
 *   for Admin CMS, Case Management, Escrow Ledger, Law Library, and User RBAC administration.
 * - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anon key for client-side subscriptions and browser queries.
 */
export const SUPABASE_ENV = {
  url:
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  serviceRoleKey:
    typeof window === "undefined"
      ? process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      : "",
} as const;

/**
 * Server-Side Auth Options for Service Role Client
 * Disables session persistence and token auto-refresh on the server to guarantee stateless,
 * privileged execution across Next.js Server Actions, Route Handlers, and SSR.
 */
export const SERVER_SERVICE_ROLE_OPTIONS = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
} as const;

/**
 * Secure Server-Side Supabase Service Role Client (`supabaseAdmin`)
 * Initialized with `process.env.SUPABASE_SERVICE_ROLE_KEY` (falling back to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 * in local environments) for privileged server-side data operations across all modules:
 * - Module 1: Public Discovery (`magazine_posts`, `lawyer_profiles`, `forum_questions`, `legal_acts`, `legal_templates`)
 * - Module 2: Authentication & RBAC (`users_profiles`, `lawyer_documents`)
 * - Module 3: Client Workspace & Case Management (`appointments_and_cases`, `escrow_transactions`, `pro_bono_applications`)
 * - Module 4: Lawyer CRM & Case Milestones (`case_milestones`, `crm_leads`, `lawyer_availability`, `withdrawal_requests`)
 * - Module 5: Admin CMS, Law Library & Realtime Comms (`magazine_posts`, `legal_acts`, `messages`, `video_consultation_logs`, `notifications`)
 */
export const supabaseAdmin = createHybridSupabaseClient(
  SUPABASE_ENV.url,
  SUPABASE_ENV.serviceRoleKey || SUPABASE_ENV.anonKey,
  SERVER_SERVICE_ROLE_OPTIONS
);

export const supabaseServiceRole = supabaseAdmin;

/**
 * Browser / Isomorphic Supabase Client Instance
 * Uses the Service Role client automatically when invoked on the server (`typeof window === "undefined"`)
 * and the Anon Key client when invoked in the browser.
 */
export const supabase =
  typeof window === "undefined"
    ? supabaseAdmin
    : createHybridSupabaseClient(SUPABASE_ENV.url, SUPABASE_ENV.anonKey);

/**
 * Factory helper returning a configured Supabase client instance.
 * Defaults to the Service Role key on the server and Anon key on the client.
 */
export function createClient(
  supabaseUrl?: string,
  supabaseKey?: string,
  options?: Record<string, any>
) {
  if (!supabaseUrl && !supabaseKey && !options) {
    return typeof window === "undefined" ? supabaseAdmin : supabase;
  }
  const resolvedUrl = supabaseUrl || SUPABASE_ENV.url;
  const resolvedKey =
    supabaseKey ||
    (typeof window === "undefined"
      ? SUPABASE_ENV.serviceRoleKey || SUPABASE_ENV.anonKey
      : SUPABASE_ENV.anonKey);
  const resolvedOptions =
    options ||
    (typeof window === "undefined" ? SERVER_SERVICE_ROLE_OPTIONS : undefined);

  return createHybridSupabaseClient(resolvedUrl, resolvedKey, resolvedOptions);
}

/**
 * Returns the privileged Server-Side Supabase Service Role client (`SUPABASE_SERVICE_ROLE_KEY`)
 * for Next.js Server Actions (`app/actions/platformActions.ts`), Admin CMS CRUD, Case Management,
 * Escrow settlements, and SSR metadata generation.
 */
export function getSupabaseServiceRoleClient() {
  return supabaseAdmin;
}

/**
 * Alias for `getSupabaseServiceRoleClient()` used across Server Actions and SSR routes.
 */
export function getSupabaseServerClient() {
  return supabaseAdmin;
}

/**
 * Returns the shared Supabase client for Client Components and custom React hooks (`useAuthRBAC`, `useSupabase`).
 */
export function getSupabaseClient() {
  return supabase;
}

/**
 * Executes a privileged server-side data operation against any platform table using `supabaseAdmin`
 * (initialized with `SUPABASE_SERVICE_ROLE_KEY`), supporting Admin CMS and Case Management workflows.
 */
export async function executeServerSideTableOperation(params: {
  table: string;
  operation: "SELECT" | "INSERT" | "UPSERT" | "UPDATE" | "DELETE";
  payload?: any;
  matchColumn?: string;
  matchValue?: any;
}) {
  const client = getSupabaseServiceRoleClient();
  const canonicalTable = resolveTableName(params.table);
  const col = params.matchColumn || "id";

  switch (params.operation) {
    case "SELECT": {
      const query = client.from(canonicalTable).select("*");
      if (params.matchValue !== undefined) {
        return await query.eq(col, params.matchValue);
      }
      return await query;
    }
    case "INSERT": {
      const rows = Array.isArray(params.payload)
        ? params.payload
        : [params.payload];
      return await client.from(canonicalTable).insert(rows).select();
    }
    case "UPSERT": {
      const rows = Array.isArray(params.payload)
        ? params.payload
        : [params.payload];
      return await client.from(canonicalTable).upsert(rows).select();
    }
    case "UPDATE": {
      return await client
        .from(canonicalTable)
        .update(params.payload || {})
        .eq(col, params.matchValue)
        .select();
    }
    case "DELETE": {
      return await client
        .from(canonicalTable)
        .delete()
        .eq(col, params.matchValue);
    }
  }
}

/**
 * Diagnostic helper reporting whether live Supabase credentials and Service Role key are configured.
 */
export function getSupabaseConnectionStatus() {
  const hasUrl = Boolean(
    SUPABASE_ENV.url && SUPABASE_ENV.url.startsWith("http")
  );
  const hasAnonKey = Boolean(SUPABASE_ENV.anonKey);
  const hasServiceRoleKey = Boolean(SUPABASE_ENV.serviceRoleKey);
  const isLiveCloud = isRealSupabaseConfigured();

  return {
    isLiveCloud,
    mode: isLiveCloud ? "supabase-cloud" : "hybrid-persisted",
    authKeyMode:
      typeof window === "undefined" && hasServiceRoleKey
        ? "service_role"
        : "anon_key",
    urlConfigured: hasUrl,
    anonKeyConfigured: hasAnonKey,
    serviceRoleConfigured: hasServiceRoleKey,
    enabledModules: [
      "Module 1: Public Discovery",
      "Module 2: Authentication & RBAC",
      "Module 3: Client Workspace & Case Management",
      "Module 4: Lawyer CRM & Case Milestones",
      "Module 5: Admin CMS, Law Library & Realtime Comms",
    ],
  };
}

export {
  isRealSupabaseConfigured,
  resolveTableName,
  getTableData,
  saveTableData,
  resetAllPlatformData,
  getSiteSettings,
  saveSiteSettings,
  RBAC_ROLES,
  RBAC_ROLE_PERMISSIONS,
  normalizeRBACRole,
  getActiveRBACSession,
  syncUserProfileAndSession,
  switchActiveRBACRole,
  verifyUserProfileRole,
  evaluateUsersProfilesRLS,
  USERS_PROFILES_SELF_EDITABLE_COLUMNS,
  USERS_PROFILES_RLS_SQL,
  SUPABASE_FULL_SQL_SCHEMA,
  SUPABASE_STORAGE_BUCKETS,
  isOwnUserProfileRecord,
  type RBACRole,
  type RBACPermissionSet,
  type SyncedUserProfileSession,
  type SupabaseTableName,
};

export default supabase;
