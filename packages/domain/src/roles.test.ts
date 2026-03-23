import { describe, expect, it } from "vitest";

import { roomId } from "./ids.js";
import { getPermissions, canUserControlInRoom } from "./roles.js";

describe("getPermissions", () => {
  it("admin has full access to all rooms", () => {
    const perms = getPermissions("admin", null);
    expect(perms.canViewRoom(roomId("any"))).toBe(true);
    expect(perms.canControlEntity).toBe(true);
    expect(perms.canActivateScene).toBe(true);
    expect(perms.canManageUsers).toBe(true);
    expect(perms.canConfigureHa).toBe(true);
    expect(perms.canAccessSettings).toBe(true);
    expect(perms.canAccessAdmin).toBe(true);
  });

  it("user can view and control but not admin", () => {
    const perms = getPermissions("user", null);
    expect(perms.canViewRoom(roomId("any"))).toBe(true);
    expect(perms.canControlEntity).toBe(true);
    expect(perms.canActivateScene).toBe(true);
    expect(perms.canManageUsers).toBe(false);
    expect(perms.canConfigureHa).toBe(false);
    expect(perms.canAccessAdmin).toBe(false);
  });

  it("guest can only view allowed rooms, no control", () => {
    const kitchen = roomId("kitchen");
    const bedroom = roomId("bedroom");
    const perms = getPermissions("guest", [kitchen]);

    expect(perms.canViewRoom(kitchen)).toBe(true);
    expect(perms.canViewRoom(bedroom)).toBe(false);
    expect(perms.canControlEntity).toBe(false);
    expect(perms.canActivateScene).toBe(false);
    expect(perms.canManageUsers).toBe(false);
    expect(perms.canAccessSettings).toBe(false);
  });

  it("guest with null allowedRooms can view all rooms", () => {
    const perms = getPermissions("guest", null);
    expect(perms.canViewRoom(roomId("any"))).toBe(true);
    expect(perms.canControlEntity).toBe(false);
  });

  it("wall-panel can control in allowed rooms only", () => {
    const kitchen = roomId("kitchen");
    const perms = getPermissions("wall-panel", [kitchen]);

    expect(perms.canViewRoom(kitchen)).toBe(true);
    expect(perms.canViewRoom(roomId("bedroom"))).toBe(false);
    expect(perms.canControlEntity).toBe(true);
    expect(perms.canActivateScene).toBe(true);
    expect(perms.canManageUsers).toBe(false);
    expect(perms.canAccessSettings).toBe(false);
  });
});

describe("canUserControlInRoom", () => {
  const kitchen = roomId("kitchen");
  const bedroom = roomId("bedroom");

  it("admin can control anywhere", () => {
    expect(canUserControlInRoom("admin", kitchen, null)).toBe(true);
    expect(canUserControlInRoom("admin", null, null)).toBe(true);
  });

  it("user can control anywhere", () => {
    expect(canUserControlInRoom("user", kitchen, [kitchen])).toBe(true);
    expect(canUserControlInRoom("user", bedroom, [kitchen])).toBe(true);
  });

  it("guest cannot control anywhere", () => {
    expect(canUserControlInRoom("guest", kitchen, [kitchen])).toBe(false);
    expect(canUserControlInRoom("guest", kitchen, null)).toBe(false);
  });

  it("wall-panel can control in allowed rooms", () => {
    expect(canUserControlInRoom("wall-panel", kitchen, [kitchen])).toBe(true);
    expect(canUserControlInRoom("wall-panel", bedroom, [kitchen])).toBe(false);
  });

  it("wall-panel cannot control entities without a room", () => {
    expect(canUserControlInRoom("wall-panel", null, [kitchen])).toBe(false);
  });

  it("wall-panel with null allowedRooms can control anywhere", () => {
    expect(canUserControlInRoom("wall-panel", kitchen, null)).toBe(true);
  });
});
