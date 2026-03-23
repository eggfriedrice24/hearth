import type { HearthEntity } from "../types.js";

export interface CoverState {
  isOpen: boolean;
  isClosed: boolean;
  position: number | null;
  tiltPosition: number | null;
  deviceClass: string | null;
}

export function interpretCover(entity: HearthEntity): CoverState {
  const attrs = entity.attributes;
  return {
    isOpen: entity.state === "open",
    isClosed: entity.state === "closed",
    position: typeof attrs["current_position"] === "number" ? attrs["current_position"] : null,
    tiltPosition:
      typeof attrs["current_tilt_position"] === "number" ? attrs["current_tilt_position"] : null,
    deviceClass: typeof attrs["device_class"] === "string" ? attrs["device_class"] : null,
  };
}
