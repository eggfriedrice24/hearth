import type { HaArea, HaDevice, HaEntityRegistryEntry } from "./types.js";
import type { HassEntity } from "home-assistant-js-websocket";

import {
  type HearthEntity,
  type HearthRoom,
  type HearthDeviceGroup,
  type EntityId,
  entityId,
  roomId,
  deviceId,
  categoryFromEntityId,
} from "@hearth/domain";

export function mapEntity(
  hassEntity: HassEntity,
  registryEntry?: HaEntityRegistryEntry,
): HearthEntity {
  const id = entityId(hassEntity.entity_id);
  return {
    id,
    name: hassEntity.attributes.friendly_name ?? registryEntry?.name ?? hassEntity.entity_id,
    category: categoryFromEntityId(hassEntity.entity_id),
    roomId: registryEntry?.area_id ? roomId(registryEntry.area_id) : null,
    deviceId: registryEntry?.device_id ? deviceId(registryEntry.device_id) : null,
    state: hassEntity.state,
    attributes: hassEntity.attributes as Record<string, unknown>,
    lastChanged: hassEntity.last_changed,
    lastUpdated: hassEntity.last_updated,
    available: hassEntity.state !== "unavailable",
  };
}

export function mapArea(haArea: HaArea, entityIds: EntityId[]): HearthRoom {
  return {
    id: roomId(haArea.area_id),
    name: haArea.name,
    icon: haArea.icon,
    entities: entityIds,
  };
}

export function mapDevice(haDevice: HaDevice, entityIds: EntityId[]): HearthDeviceGroup {
  return {
    id: deviceId(haDevice.id),
    name: haDevice.name ?? "Unknown Device",
    manufacturer: haDevice.manufacturer,
    model: haDevice.model,
    roomId: haDevice.area_id ? roomId(haDevice.area_id) : null,
    entities: entityIds,
  };
}

export function buildRooms(
  areas: HaArea[],
  entityRegistry: HaEntityRegistryEntry[],
  deviceRegistry: HaDevice[],
): HearthRoom[] {
  const deviceAreaMap = new Map<string, string>();
  for (const device of deviceRegistry) {
    if (device.area_id) {
      deviceAreaMap.set(device.id, device.area_id);
    }
  }

  const areaEntityMap = new Map<string, EntityId[]>();
  for (const entry of entityRegistry) {
    if (entry.disabled_by || entry.hidden_by) continue;

    const areaId =
      entry.area_id ?? (entry.device_id ? deviceAreaMap.get(entry.device_id) : undefined) ?? null;

    if (areaId) {
      const list = areaEntityMap.get(areaId);
      const eid = entityId(entry.entity_id);
      if (list) {
        list.push(eid);
      } else {
        areaEntityMap.set(areaId, [eid]);
      }
    }
  }

  return areas.map((area) => mapArea(area, areaEntityMap.get(area.area_id) ?? []));
}
