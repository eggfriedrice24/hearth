export type EntityId = string & { readonly __brand: "EntityId" };
export type RoomId = string & { readonly __brand: "RoomId" };
export type DeviceId = string & { readonly __brand: "DeviceId" };
export type UserId = string & { readonly __brand: "UserId" };

export function entityId(id: string): EntityId {
  return id as EntityId;
}

export function roomId(id: string): RoomId {
  return id as RoomId;
}

export function deviceId(id: string): DeviceId {
  return id as DeviceId;
}

export function userId(id: string): UserId {
  return id as UserId;
}
