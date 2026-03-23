import type { DeviceId, EntityId, RoomId } from "./ids.js";

export type ServiceTarget = { entity_id: EntityId } | { area_id: RoomId } | { device_id: DeviceId };

export interface HearthCommand {
  domain: string;
  service: string;
  target: ServiceTarget;
  data?: Record<string, unknown> | undefined;
}

export function turnOnLight(
  id: EntityId,
  options?: { brightness?: number; color_temp?: number; rgb_color?: [number, number, number] },
): HearthCommand {
  return {
    domain: "light",
    service: "turn_on",
    target: { entity_id: id },
    data: options,
  };
}

export function turnOffLight(id: EntityId): HearthCommand {
  return { domain: "light", service: "turn_off", target: { entity_id: id } };
}

export function toggleSwitch(id: EntityId): HearthCommand {
  return { domain: "switch", service: "toggle", target: { entity_id: id } };
}

export function setClimateTemperature(id: EntityId, temperature: number): HearthCommand {
  return {
    domain: "climate",
    service: "set_temperature",
    target: { entity_id: id },
    data: { temperature },
  };
}

export function setClimateMode(
  id: EntityId,
  hvacMode: "heat" | "cool" | "auto" | "off" | "heat_cool" | "dry" | "fan_only",
): HearthCommand {
  return {
    domain: "climate",
    service: "set_hvac_mode",
    target: { entity_id: id },
    data: { hvac_mode: hvacMode },
  };
}

export function openCover(id: EntityId): HearthCommand {
  return { domain: "cover", service: "open_cover", target: { entity_id: id } };
}

export function closeCover(id: EntityId): HearthCommand {
  return { domain: "cover", service: "close_cover", target: { entity_id: id } };
}

export function stopCover(id: EntityId): HearthCommand {
  return { domain: "cover", service: "stop_cover", target: { entity_id: id } };
}

export function setCoverPosition(id: EntityId, position: number): HearthCommand {
  return {
    domain: "cover",
    service: "set_cover_position",
    target: { entity_id: id },
    data: { position },
  };
}

export function lockLock(id: EntityId): HearthCommand {
  return { domain: "lock", service: "lock", target: { entity_id: id } };
}

export function unlockLock(id: EntityId): HearthCommand {
  return { domain: "lock", service: "unlock", target: { entity_id: id } };
}

export function activateScene(id: EntityId): HearthCommand {
  return { domain: "scene", service: "turn_on", target: { entity_id: id } };
}
