import { type Permission, ROLE_PERMISSIONS, type Role } from "@/types/permissions";
import type { Session } from "../types/auth";
import { logger } from "./logger";

const log = logger.child({ module: "lib/permissions" });

export interface PermissionCheckOptions {
  currentUserId?: string;
}

export function hasPermissions(
  session?: Session,
  requiredPermissions: Permission | Permission[] = [],
  options?: PermissionCheckOptions,
): boolean {
  if (!session) {
    return false;
  }

  const userRole = session.user.role as Role | undefined;
  log.debug({ userRole, requiredPermissions, options }, "Checking permissions for user");

  if (!userRole) {
    log.warn(
      { requiredPermissions, options },
      "User role is not defined, returning false for permission check. User may not be assigned to an organization.",
    );
    return false;
  }

  const userPermissions = ROLE_PERMISSIONS[userRole] || [];

  const hasPermission = Array.isArray(requiredPermissions)
    ? requiredPermissions.every(permission => userPermissions.includes(permission))
    : userPermissions.includes(requiredPermissions);

  if (!hasPermission) {
    return false;
  }

  return true;
}
