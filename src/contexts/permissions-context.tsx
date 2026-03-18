"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { hasPermissions, type PermissionCheckOptions } from "@/lib/permissions";
import type { Session } from "@/types/auth";
import type { Permission } from "@/types/permissions";

interface PermissionsContextType {
  can: (permission: Permission | Permission[], options?: Omit<PermissionCheckOptions, "currentUserId">) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

interface PermissionsProviderProps {
  children: React.ReactNode;
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}

export function PermissionsProvider({ children }: PermissionsProviderProps) {
  const { data: session } = useSession();

  const can = useCallback<PermissionsContextType["can"]>(
    (permissions, options) => {
      return hasPermissions(session as Session | undefined, permissions, {
        ...options,
        currentUserId: session?.session.userId,
      });
    },
    [session],
  );

  const value = useMemo(() => ({ can }), [can]);

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
}
