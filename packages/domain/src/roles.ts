import type { RoomId } from "./ids.js";

export type UserRole = "admin" | "user" | "guest" | "wall-panel";

export interface UserPermissions {
  canViewRoom: (roomId: RoomId) => boolean;
  canControlEntity: boolean;
  canActivateScene: boolean;
  canManageUsers: boolean;
  canConfigureHa: boolean;
  canAccessSettings: boolean;
  canAccessAdmin: boolean;
}

export function getPermissions(role: UserRole, allowedRooms: RoomId[] | null): UserPermissions {
  const canViewRoom = (roomId: RoomId) => {
    if (allowedRooms === null) return true;
    return allowedRooms.includes(roomId);
  };

  switch (role) {
    case "admin":
      return {
        canViewRoom: () => true,
        canControlEntity: true,
        canActivateScene: true,
        canManageUsers: true,
        canConfigureHa: true,
        canAccessSettings: true,
        canAccessAdmin: true,
      };
    case "user":
      return {
        canViewRoom: () => true,
        canControlEntity: true,
        canActivateScene: true,
        canManageUsers: false,
        canConfigureHa: false,
        canAccessSettings: true,
        canAccessAdmin: false,
      };
    case "guest":
      return {
        canViewRoom,
        canControlEntity: false,
        canActivateScene: false,
        canManageUsers: false,
        canConfigureHa: false,
        canAccessSettings: false,
        canAccessAdmin: false,
      };
    case "wall-panel":
      return {
        canViewRoom,
        canControlEntity: true,
        canActivateScene: true,
        canManageUsers: false,
        canConfigureHa: false,
        canAccessSettings: false,
        canAccessAdmin: false,
      };
  }
}

export function canUserControlInRoom(
  role: UserRole,
  entityRoomId: RoomId | null,
  allowedRooms: RoomId[] | null,
): boolean {
  if (role === "guest") return false;
  if (role === "admin" || role === "user") return true;
  // wall-panel: can control only in allowed rooms
  if (entityRoomId === null) return false;
  if (allowedRooms === null) return true;
  return allowedRooms.includes(entityRoomId);
}
