import type { HearthEntity } from "../types.js";

export interface LockState {
  isLocked: boolean;
  isUnlocked: boolean;
  isJammed: boolean;
}

export function interpretLock(entity: HearthEntity): LockState {
  return {
    isLocked: entity.state === "locked",
    isUnlocked: entity.state === "unlocked",
    isJammed: entity.state === "jammed",
  };
}
