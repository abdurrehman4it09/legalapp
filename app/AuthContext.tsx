"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  supabase,
  getSupabaseClient,
  getSupabaseConnectionStatus,
  getTableData,
  normalizeRBACRole,
  RBACRole,
  RBAC_ROLES,
  RBACPermissionSet,
  RBAC_ROLE_PERMISSIONS,
  SyncedUserProfileSession,
  getActiveRBACSession,
  syncUserProfileAndSession,
  switchActiveRBACRole,
} from "@/lib/supabase";

export type RestrictedModuleKey =
  | "lawyer_crm"
  | "admin_cms"
  | "super_admin_only"
  | "ai_researcher_pro"
  | "client_workspace";

export interface VerifiedProfileRoleResult {
  verifiedSession: SyncedUserProfileSession | null;
  profileRow: any | null;
  role: RBACRole | "Guest";
  permissions: RBACPermissionSet;
  verifiedAt: string;
  source: "users_profiles";
}

export interface AuthRBACContextValue {
  session: SyncedUserProfileSession | null;
  profileRow: any | null;
  role: RBACRole | "Guest";
  permissions: RBACPermissionSet;
  isVerifying: boolean;
  lastVerifiedAt: string | null;
  verifyProfileRole: (
    sessionOrIdentifier?: SyncedUserProfileSession | string | null
  ) => Promise<VerifiedProfileRoleResult>;
  loginAndVerifyRole: (params: {
    phoneOrEmail: string;
    fullName: string;
    role: string;
    city?: string;
    lang?: "en" | "ur";
    interests?: string[];
    barCouncilId?: string;
    highCourt?: string;
    barLicenseUrl?: string;
    verificationStatus?: "Under Review" | "Verified" | "Rejected";
  }) => Promise<SyncedUserProfileSession>;
  switchRoleAndVerify: (targetRole: RBACRole) => Promise<SyncedUserProfileSession>;
  logout: () => Promise<void>;
  checkModuleAccess: (moduleKey: RestrictedModuleKey) => {
    allowed: boolean;
    verifiedRole: RBACRole | "Guest";
    requiredRoles: RBACRole[];
    reason: string;
  };
}

function mapRBACRoleToShortKey(
  role: RBACRole
): "client" | "advocate" | "editorial_manager" | "admin" {
  switch (role) {
    case "Verified Advocate":
      return "advocate";
    case "Editorial Manager":
      return "editorial_manager";
    case "Admin":
      return "admin";
    case "Client":
    default:
      return "client";
  }
}

const AuthRBACContext = createContext<AuthRBACContextValue | null>(null);

export function AuthRBACProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SyncedUserProfileSession | null>(() =>
    getActiveRBACSession()
  );
  const [profileRow, setProfileRow] = useState<any | null>(null);
  const [role, setRole] = useState<RBACRole | "Guest">(() => {
    const initial = getActiveRBACSession();
    return initial ? initial.rbacRole : "Guest";
  });
  const [permissions, setPermissions] = useState<RBACPermissionSet>(() => {
    const initial = getActiveRBACSession();
    return initial
      ? initial.permissions
      : RBAC_ROLE_PERMISSIONS["Client"];
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [lastVerifiedAt, setLastVerifiedAt] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * `verifyProfileRole`: Queries the `users_profiles` table in Supabase on every session load,
   * resolves the user's authoritative RBAC role (`Client`, `Verified Advocate`, `Editorial Manager`, or `Admin`),
   * and updates global RBAC state (`session`, `profileRow`, `role`, `permissions`, `lastVerifiedAt`).
   */
  const verifyProfileRole = useCallback(
    async (
      sessionOrIdentifier?: SyncedUserProfileSession | string | null
    ): Promise<VerifiedProfileRoleResult> => {
      if (isMountedRef.current) {
        setIsVerifying(true);
      }
      const verifiedAt = new Date().toISOString();

      try {
        // 1. Resolve active session from explicit argument, Supabase Auth session, or persisted session
        let activeSession: SyncedUserProfileSession | null =
          typeof sessionOrIdentifier === "object" && sessionOrIdentifier !== null
            ? sessionOrIdentifier
            : getActiveRBACSession();

        if (!activeSession && supabase.auth?.getSession) {
          try {
            const { data: authSessionData } = await supabase.auth.getSession();
            const sbUser = authSessionData?.session?.user;
            if (sbUser) {
              const inferredRole = normalizeRBACRole(
                sbUser.user_metadata?.role || "Client"
              );
              activeSession = {
                id: sbUser.id,
                phoneOrEmail: sbUser.email || sbUser.phone || "user@legalbrief.pk",
                role: mapRBACRoleToShortKey(inferredRole),
                rbacRole: inferredRole,
                name:
                  sbUser.user_metadata?.full_name ||
                  `Verified ${inferredRole}`,
                city: sbUser.user_metadata?.city || "Islamabad",
                verifiedStatus: "verified",
                permissions: RBAC_ROLE_PERMISSIONS[inferredRole],
              };
            }
          } catch {
            // Continue with local/hybrid session lookup
          }
        }

        const identifier =
          typeof sessionOrIdentifier === "string"
            ? sessionOrIdentifier.trim().toLowerCase()
            : String(activeSession?.phoneOrEmail || "")
                .trim()
                .toLowerCase();

        // 2. Query the authoritative `users_profiles` table in Supabase
        const { data: queriedProfiles } = await supabase
          .from("users_profiles")
          .select("*");

        const rows: any[] = Array.isArray(queriedProfiles)
          ? queriedProfiles
          : getTableData("users_profiles");

        const matchedRow = rows.find(
          (p) =>
            (activeSession?.id &&
              (String(p.id) === String(activeSession.id) ||
                String(p.auth_uid || "") === String(activeSession.id))) ||
            (identifier &&
              ((p.email && String(p.email).toLowerCase() === identifier) ||
                (p.phone && String(p.phone).toLowerCase() === identifier))) ||
            (activeSession?.name &&
              String(p.full_name || "").toLowerCase() ===
                String(activeSession.name).trim().toLowerCase())
        );

        // 3. If no active session and no matched profile row exist, enforce Guest state
        if (!activeSession && !matchedRow) {
          const guestPerms = RBAC_ROLE_PERMISSIONS["Client"];
          if (isMountedRef.current) {
            setSession(null);
            setProfileRow(null);
            setRole("Guest");
            setPermissions(guestPerms);
            setLastVerifiedAt(verifiedAt);
          }
          return {
            verifiedSession: null,
            profileRow: null,
            role: "Guest",
            permissions: guestPerms,
            verifiedAt,
            source: "users_profiles",
          };
        }

        // 4. Normalize authoritative RBAC role ('Client' | 'Verified Advocate' | 'Editorial Manager' | 'Admin')
        const authoritativeRole: RBACRole = normalizeRBACRole(
          matchedRow?.role || activeSession?.rbacRole || activeSession?.role
        );
        const shortRole = mapRBACRoleToShortKey(authoritativeRole);
        const resolvedPermissions = RBAC_ROLE_PERMISSIONS[authoritativeRole];

        const verifiedSession: SyncedUserProfileSession = {
          id: matchedRow?.id || activeSession?.id,
          phoneOrEmail:
            matchedRow?.email ||
            matchedRow?.phone ||
            activeSession?.phoneOrEmail ||
            "user@legalbrief.pk",
          role: shortRole,
          rbacRole: authoritativeRole,
          name:
            matchedRow?.full_name ||
            activeSession?.name ||
            `Verified ${authoritativeRole}`,
          city: matchedRow?.city || activeSession?.city || "Islamabad",
          barCouncilId:
            matchedRow?.bar_council_id ||
            activeSession?.barCouncilId ||
            undefined,
          highCourt:
            matchedRow?.high_court || activeSession?.highCourt || undefined,
          verifiedStatus:
            matchedRow?.verification_status === "Under Review"
              ? "under_review"
              : matchedRow?.verification_status === "Rejected"
              ? "rejected"
              : "verified",
          permissions: resolvedPermissions,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "plp_user_session",
            JSON.stringify(verifiedSession)
          );
        }

        // 5. Update global RBAC state
        if (isMountedRef.current) {
          setSession(verifiedSession);
          setProfileRow(matchedRow || null);
          setRole(authoritativeRole);
          setPermissions(resolvedPermissions);
          setLastVerifiedAt(verifiedAt);
        }

        return {
          verifiedSession,
          profileRow: matchedRow || null,
          role: authoritativeRole,
          permissions: resolvedPermissions,
          verifiedAt,
          source: "users_profiles",
        };
      } finally {
        if (isMountedRef.current) {
          setIsVerifying(false);
        }
      }
    },
    []
  );

  // Query `users_profiles` in Supabase upon every session load, auth change, Realtime update, and navigation/focus event
  useEffect(() => {
    verifyProfileRole();
    if (typeof window === "undefined") return;

    const handleSync = () => {
      verifyProfileRole();
    };

    window.addEventListener("plp_data_updated", handleSync);
    window.addEventListener("popstate", handleSync);
    window.addEventListener("focus", handleSync);
    window.addEventListener("storage", handleSync);

    // Subscribe to Supabase Auth session state changes
    let authSubscription: { unsubscribe?: () => void } | null = null;
    if (supabase.auth?.onAuthStateChange) {
      const { data } = supabase.auth.onAuthStateChange(() => {
        verifyProfileRole();
      });
      authSubscription = data?.subscription || null;
    }

    // Subscribe to Supabase Realtime changes on `public.users_profiles`
    const profileChannel = supabase
      .channel("rbac-users-profiles-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users_profiles" },
        () => {
          verifyProfileRole();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener("plp_data_updated", handleSync);
      window.removeEventListener("popstate", handleSync);
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("storage", handleSync);
      authSubscription?.unsubscribe?.();
      profileChannel?.unsubscribe?.();
    };
  }, [verifyProfileRole]);

  const loginAndVerifyRole = useCallback(
    async (params: {
      phoneOrEmail: string;
      fullName: string;
      role: string;
      city?: string;
      lang?: "en" | "ur";
      interests?: string[];
      barCouncilId?: string;
      highCourt?: string;
      barLicenseUrl?: string;
      verificationStatus?: "Under Review" | "Verified" | "Rejected";
    }) => {
      const synced = await syncUserProfileAndSession(params);
      const verified = await verifyProfileRole(synced);
      return verified.verifiedSession || synced;
    },
    [verifyProfileRole]
  );

  const switchRoleAndVerify = useCallback(
    async (targetRole: RBACRole) => {
      const synced = await switchActiveRBACRole(targetRole);
      const verified = await verifyProfileRole(synced);
      return verified.verifiedSession || synced;
    },
    [verifyProfileRole]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfileRow(null);
    setRole("Guest");
    setPermissions(RBAC_ROLE_PERMISSIONS["Client"]);
    setLastVerifiedAt(new Date().toISOString());
  }, []);

  const checkModuleAccess = useCallback(
    (moduleKey: RestrictedModuleKey) => {
      const verifiedRole = role;
      if (moduleKey === "lawyer_crm") {
        const requiredRoles: RBACRole[] = ["Verified Advocate", "Admin"];
        const allowed =
          verifiedRole !== "Guest" &&
          requiredRoles.includes(verifiedRole) &&
          permissions.canAccessAdvocateCRM;
        return {
          allowed,
          verifiedRole,
          requiredRoles,
          reason: allowed
            ? `Verified users_profiles.role = "${verifiedRole}" grants full access to Lawyer CRM & Escrow Wallet.`
            : `Lawyer CRM (Screens 35–49) requires users_profiles.role IN ('Verified Advocate', 'Admin'). Current verified role: "${verifiedRole}".`,
        };
      }

      if (moduleKey === "admin_cms") {
        const requiredRoles: RBACRole[] = ["Editorial Manager", "Admin"];
        const allowed =
          verifiedRole !== "Guest" &&
          requiredRoles.includes(verifiedRole) &&
          (permissions.canManageEditorialCMS ||
            permissions.canManageFullAdminAndUsers);
        return {
          allowed,
          verifiedRole,
          requiredRoles,
          reason: allowed
            ? `Verified users_profiles.role = "${verifiedRole}" grants access to Admin CMS.`
            : `Admin CMS (Screens 50–52) requires users_profiles.role IN ('Editorial Manager', 'Admin'). Current verified role: "${verifiedRole}".`,
        };
      }

      if (moduleKey === "super_admin_only") {
        const requiredRoles: RBACRole[] = ["Admin"];
        const allowed =
          verifiedRole === "Admin" && permissions.canManageFullAdminAndUsers;
        return {
          allowed,
          verifiedRole,
          requiredRoles,
          reason: allowed
            ? `Verified users_profiles.role = "Admin" grants full Super Admin privileges.`
            : `This section requires users_profiles.role = 'Admin'. Current verified role: "${verifiedRole}".`,
        };
      }

      if (moduleKey === "ai_researcher_pro") {
        const requiredRoles: RBACRole[] = [
          "Verified Advocate",
          "Editorial Manager",
          "Admin",
        ];
        const allowed =
          verifiedRole !== "Guest" &&
          requiredRoles.includes(verifiedRole) &&
          permissions.canAccessAIResearcherPro;
        return {
          allowed,
          verifiedRole,
          requiredRoles,
          reason: allowed
            ? `Verified users_profiles.role = "${verifiedRole}" unlocks AI Researcher Pro (Screen 40).`
            : `AI Researcher Pro (Screen 40) requires users_profiles.role IN ('Verified Advocate', 'Editorial Manager', 'Admin'). Current verified role: "${verifiedRole}".`,
        };
      }

      const requiredRoles: RBACRole[] = [
        "Client",
        "Verified Advocate",
        "Editorial Manager",
        "Admin",
      ];
      const allowed = verifiedRole !== "Guest" && permissions.canBookAndPostQA;
      return {
        allowed,
        verifiedRole,
        requiredRoles,
        reason: allowed
          ? `Verified users_profiles.role = "${verifiedRole}" grants Client Workspace access.`
          : `Client Workspace requires an authenticated users_profiles.role. Current verified role: "${verifiedRole}".`,
      };
    },
    [role, permissions]
  );

  return (
    <AuthRBACContext.Provider
      value={{
        session,
        profileRow,
        role,
        permissions,
        isVerifying,
        lastVerifiedAt,
        verifyProfileRole,
        loginAndVerifyRole,
        switchRoleAndVerify,
        logout,
        checkModuleAccess,
      }}
    >
      {children}
    </AuthRBACContext.Provider>
  );
}

/**
 * Custom Auth Context Hook that verifies `users_profiles.role` on every session load
 * and checks RBAC permissions for restricted routes/modules (Lawyer CRM, Admin CMS, etc.).
 */
export function useAuthRBAC(): AuthRBACContextValue {
  const ctx = useContext(AuthRBACContext);
  if (!ctx) {
    throw new Error("useAuthRBAC must be used within an AuthRBACProvider");
  }
  return ctx;
}

/**
 * Dedicated hook to access and trigger `verifyProfileRole` against the `users_profiles` table
 * in Supabase while subscribing to the global RBAC role (`Client`, `Verified Advocate`, `Editorial Manager`, or `Admin`).
 */
export function useVerifyProfileRole(autoVerifyOnMount = false) {
  const ctx = useAuthRBAC();
  const {
    verifyProfileRole,
    role,
    permissions,
    session,
    profileRow,
    isVerifying,
    lastVerifiedAt,
    checkModuleAccess,
  } = ctx;

  useEffect(() => {
    if (autoVerifyOnMount) {
      verifyProfileRole();
    }
  }, [autoVerifyOnMount, verifyProfileRole]);

  return {
    verifyProfileRole,
    role,
    permissions,
    session,
    profileRow,
    isVerifying,
    lastVerifiedAt,
    checkModuleAccess,
  };
}

/**
 * Custom hook returning the unified Supabase client initialized from environment variables
 * in `lib/supabase.ts` along with live connection status and RBAC session state.
 */
export function useSupabase() {
  const auth = useAuthRBAC();
  return {
    supabase: getSupabaseClient(),
    connectionStatus: getSupabaseConnectionStatus(),
    ...auth,
  };
}

export { RBAC_ROLES, RBAC_ROLE_PERMISSIONS };
