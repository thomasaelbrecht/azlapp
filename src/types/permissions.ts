export enum Role {
  ADMIN = "admin",
  TRAINER = "trainer",
  PAYMASTER = "paymaster",
  LIFEGUARD = "lifeguard",
  MEMBERSHIP_MANAGER = "membershipManager",
}

export enum Permission {
  VIEW_MEMBERS = "members:view",
  SYNC_MEMBERS = "members:sync",
  UPDATE_ASSIST_SETTINGS = "assistSettings:update",
  LIST_USERS = "user:list",
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    Permission.VIEW_MEMBERS,
    Permission.SYNC_MEMBERS,
    Permission.UPDATE_ASSIST_SETTINGS,
    Permission.LIST_USERS,
  ],
  [Role.TRAINER]: [Permission.VIEW_MEMBERS, Permission.LIST_USERS],
  [Role.PAYMASTER]: [Permission.LIST_USERS],
  [Role.LIFEGUARD]: [Permission.VIEW_MEMBERS, Permission.LIST_USERS],
  [Role.MEMBERSHIP_MANAGER]: [Permission.VIEW_MEMBERS, Permission.SYNC_MEMBERS, Permission.LIST_USERS],
};
