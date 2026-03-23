import type { EntityCategory } from "./categories.js";
import type { DeviceId, EntityId, RoomId } from "./ids.js";

export interface HearthEntity {
  id: EntityId;
  name: string;
  category: EntityCategory;
  roomId: RoomId | null;
  deviceId: DeviceId | null;
  state: string;
  attributes: Record<string, unknown>;
  lastChanged: string;
  lastUpdated: string;
  available: boolean;
}

export interface HearthRoom {
  id: RoomId;
  name: string;
  icon: string | null;
  entities: EntityId[];
}

export interface HearthDeviceGroup {
  id: DeviceId;
  name: string;
  manufacturer: string | null;
  model: string | null;
  roomId: RoomId | null;
  entities: EntityId[];
}

export interface HearthScene {
  id: EntityId;
  name: string;
}

export interface HearthAutomation {
  id: EntityId;
  name: string;
  state: "on" | "off";
  lastTriggered: string | null;
}
