export type EntityCategory =
  | "light"
  | "switch"
  | "sensor"
  | "binary_sensor"
  | "climate"
  | "cover"
  | "lock"
  | "scene"
  | "automation"
  | "media_player"
  | "camera"
  | "unknown";

const DOMAIN_TO_CATEGORY: Record<string, EntityCategory> = {
  light: "light",
  switch: "switch",
  sensor: "sensor",
  binary_sensor: "binary_sensor",
  climate: "climate",
  cover: "cover",
  lock: "lock",
  scene: "scene",
  automation: "automation",
  media_player: "media_player",
  camera: "camera",
  input_boolean: "switch",
  fan: "switch",
  vacuum: "switch",
};

export function categoryFromDomain(domain: string): EntityCategory {
  return DOMAIN_TO_CATEGORY[domain] ?? "unknown";
}

export function domainFromEntityId(entityId: string): string {
  const dot = entityId.indexOf(".");
  if (dot === -1) return entityId;
  return entityId.slice(0, dot);
}

export function categoryFromEntityId(entityId: string): EntityCategory {
  return categoryFromDomain(domainFromEntityId(entityId));
}
