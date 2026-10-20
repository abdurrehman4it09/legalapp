"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  supabase,
  RBACRole,
  RBAC_ROLES,
  RBACPermissionSet,
  RBAC_ROLE_PERMISSIONS,
  SyncedUserProfileSession,
  getActiveRBACSession,
  syncUserProfileAndSession,
  switchActiveRBACRole,
  verifyUserProfileRole,
} from "@/app/supabase";

export type RestrictedModuleKey =
  | "lawyer_crm"
  | "admin_cms"
  | "super_admin_only"
  | "ai_researcher_pro"
  | "client_workspace";

export interface AuthRBACContextValue {
  session: SyncedUserProfileSession | null;
  profileRow: any | null;
  role: RBACRole | "Guest";
  permissions: RBACPermissionSet;
  isVerifying: boolean;
  lastVerifiedAt: string | null;
  verifyProfileRole: (
    sessionOrIdentifier?: SyncedUserProfileSession | string | null
  ) => Promise<{
    verifiedSession: SyncedUserProfileSession | null;
    profileRow: any | null;
    role: RBACRole | "Guest";
    permissions: RBACPermissionSet;
    verifiedAt: string;
  }>;
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

  const verifyProfileRole = useCallback(
    async (sessionOrIdentifier?: SyncedUserProfileSession | string | null) => {
      setIsVerifying(true);
      try {
        const result = await verifyUserProfileRole(sessionOrIdentifier);
        setSession(result.verifiedSession);
        setProfileRow(result.profileRow);
        setRole(result.role);
        setPermissions(result.permissions);
        setLastVerifiedAt(result.verifiedAt);
        return result;
      } finally {
        setIsVerifying(false);
      }
    },
    []
  );

  // Verify `user_profiles.role` against Supabase `user_profiles` table on mount, route/focus, and data updates
  useEffect(() => {
    verifyProfileRole();
    if (typeof window === "undefined") return;
    const handleSync = () => {
      verifyProfileRole();
    };
    window.addEventListener("plp_data_updated", handleSync);
    window.addEventListener("popstate", handleSync);
    window.addEventListener("focus", handleSync);
    return () => {
      window.removeEventListener("plp_data_updated", handleSync);
      window.removeEventListener("popstate", handleSync);
      window.removeEventListener("focus", handleSync);
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
            ? `Verified user_profiles.role = "${verifiedRole}" grants full access to Lawyer CRM & Escrow Wallet.`
            : `Lawyer CRM (Screens 35–49) requires user_profiles.role IN ('Verified Advocate', 'Admin'). Current verified role: "${verifiedRole}".`,
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
            ? `Verified user_profiles.role = "${verifiedRole}" grants access to Admin CMS.`
            : `Admin CMS (Screens 50–52) requires user_profiles.role IN ('Editorial Manager', 'Admin'). Current verified role: "${verifiedRole}".`,
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
            ? `Verified user_profiles.role = "Admin" grants full Super Admin privileges.`
            : `This section requires user_profiles.role = 'Admin'. Current verified role: "${verifiedRole}".`,
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
            ? `Verified user_profiles.role = "${verifiedRole}" unlocks AI Researcher Pro (Screen 40).`
            : `AI Researcher Pro (Screen 40) requires user_profiles.role IN ('Verified Advocate', 'Editorial Manager', 'Admin'). Current verified role: "${verifiedRole}".`,
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
          ? `Verified user_profiles.role = "${verifiedRole}" grants Client Workspace access.`
          : `Client Workspace requires an authenticated user_profiles.role. Current verified role: "${verifiedRole}".`,
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
 * Custom Auth Context Hook that verifies `user_profiles.role` on every login
 * and checks RBAC permissions for restricted routes/modules (Lawyer CRM, Admin CMS, etc.).
 */
export function useAuthRBAC(): AuthRBACContextValue {
  const ctx = useContext(AuthRBACContext);
  if (!ctx) {
    throw new Error("useAuthRBAC must be used within an AuthRBACProvider");
  }
  return ctx;
}

export { RBAC_ROLES, RBAC_ROLE_PERMISSIONS };
