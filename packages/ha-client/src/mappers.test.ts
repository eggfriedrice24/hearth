import type { HassEntity } from "./types.js";
import type { HaArea, HaDevice, HaEntityRegistryEntry } from "./types.js";

import { describe, expect, it } from "vitest";

import { mapEntity, buildRooms } from "./mappers.js";

function makeHassEntity(
  entityId: string,
  state: string,
  attrs: Record<string, unknown> = {},
): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes: { friendly_name: `Test ${entityId}`, ...attrs },
    last_changed: "2024-01-01T00:00:00Z",
    last_updated: "2024-01-01T00:00:00Z",
    context: { id: "1", user_id: null, parent_id: null },
  };
}

describe("mapEntity", () => {
  it("maps a basic entity", () => {
    const hass = makeHassEntity("light.kitchen", "on", { brightness: 200 });
    const result = mapEntity(hass);

    expect(result.id).toBe("light.kitchen");
    expect(result.name).toBe("Test light.kitchen");
    expect(result.category).toBe("light");
    expect(result.state).toBe("on");
    expect(result.attributes["brightness"]).toBe(200);
    expect(result.available).toBe(true);
    expect(result.roomId).toBeNull();
    expect(result.deviceId).toBeNull();
  });

  it("maps entity with registry entry for room and device", () => {
    const hass = makeHassEntity("sensor.temp", "22.5");
    const registry: HaEntityRegistryEntry = {
      entity_id: "sensor.temp",
      name: "Temperature",
      platform: "mqtt",
      device_id: "dev_1",
      area_id: "kitchen",
      disabled_by: null,
      hidden_by: null,
    };
    const result = mapEntity(hass, registry);

    expect(result.roomId).toBe("kitchen");
    expect(result.deviceId).toBe("dev_1");
  });

  it("marks unavailable entities", () => {
    const hass = makeHassEntity("light.broken", "unavailable");
    const result = mapEntity(hass);

    expect(result.available).toBe(false);
  });

  it("uses friendly_name from attributes first", () => {
    const hass = makeHassEntity("light.x", "on", { friendly_name: "Kitchen Light" });
    const result = mapEntity(hass);
    expect(result.name).toBe("Kitchen Light");
  });
});

describe("buildRooms", () => {
  const areas: HaArea[] = [
    { area_id: "kitchen", name: "Kitchen", icon: "mdi:silverware", picture: null, aliases: [] },
    { area_id: "bedroom", name: "Bedroom", icon: null, picture: null, aliases: [] },
  ];

  const devices: HaDevice[] = [
    {
      id: "dev_1",
      name: "Hue Bridge",
      manufacturer: "Philips",
      model: "BSB002",
      area_id: "kitchen",
    },
  ];

  it("groups entities into rooms by area_id", () => {
    const entityRegistry: HaEntityRegistryEntry[] = [
      {
        entity_id: "light.kitchen_main",
        name: null,
        platform: "hue",
        device_id: null,
        area_id: "kitchen",
        disabled_by: null,
        hidden_by: null,
      },
      {
        entity_id: "sensor.kitchen_temp",
        name: null,
        platform: "mqtt",
        device_id: null,
        area_id: "kitchen",
        disabled_by: null,
        hidden_by: null,
      },
      {
        entity_id: "light.bedroom_lamp",
        name: null,
        platform: "hue",
        device_id: null,
        area_id: "bedroom",
        disabled_by: null,
        hidden_by: null,
      },
    ];

    const rooms = buildRooms(areas, entityRegistry, devices);

    expect(rooms).toHaveLength(2);
    const kitchen = rooms.find((r) => r.id === "kitchen");
    expect(kitchen?.entities).toHaveLength(2);
    expect(kitchen?.entities).toContain("light.kitchen_main");
    expect(kitchen?.entities).toContain("sensor.kitchen_temp");

    const bedroom = rooms.find((r) => r.id === "bedroom");
    expect(bedroom?.entities).toHaveLength(1);
    expect(bedroom?.entities).toContain("light.bedroom_lamp");
  });

  it("inherits area from device when entity has no area", () => {
    const entityRegistry: HaEntityRegistryEntry[] = [
      {
        entity_id: "light.hue_1",
        name: null,
        platform: "hue",
        device_id: "dev_1",
        area_id: null,
        disabled_by: null,
        hidden_by: null,
      },
    ];

    const rooms = buildRooms(areas, entityRegistry, devices);
    const kitchen = rooms.find((r) => r.id === "kitchen");
    expect(kitchen?.entities).toContain("light.hue_1");
  });

  it("excludes disabled and hidden entities", () => {
    const entityRegistry: HaEntityRegistryEntry[] = [
      {
        entity_id: "light.disabled",
        name: null,
        platform: "hue",
        device_id: null,
        area_id: "kitchen",
        disabled_by: "user",
        hidden_by: null,
      },
      {
        entity_id: "light.hidden",
        name: null,
        platform: "hue",
        device_id: null,
        area_id: "kitchen",
        disabled_by: null,
        hidden_by: "user",
      },
      {
        entity_id: "light.active",
        name: null,
        platform: "hue",
        device_id: null,
        area_id: "kitchen",
        disabled_by: null,
        hidden_by: null,
      },
    ];

    const rooms = buildRooms(areas, entityRegistry, devices);
    const kitchen = rooms.find((r) => r.id === "kitchen");
    expect(kitchen?.entities).toHaveLength(1);
    expect(kitchen?.entities).toContain("light.active");
  });

  it("returns empty entities for rooms with no entities", () => {
    const rooms = buildRooms(areas, [], devices);
    expect(rooms[0]?.entities).toEqual([]);
    expect(rooms[1]?.entities).toEqual([]);
  });
});
