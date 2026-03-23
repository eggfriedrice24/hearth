import type { HearthEntity } from "../types.js";

import { describe, expect, it } from "vitest";

import { entityId } from "../ids.js";
import { interpretLight } from "./light.js";

function makeEntity(state: string, attributes: Record<string, unknown> = {}): HearthEntity {
  return {
    id: entityId("light.test"),
    name: "Test Light",
    category: "light",
    roomId: null,
    deviceId: null,
    state,
    attributes,
    lastChanged: "",
    lastUpdated: "",
    available: true,
  };
}

describe("interpretLight", () => {
  it("interprets on state with brightness", () => {
    const result = interpretLight(makeEntity("on", { brightness: 200, supported_features: 1 }));
    expect(result.isOn).toBe(true);
    expect(result.brightness).toBe(200);
    expect(result.supportedFeatures).toBe(1);
  });

  it("interprets off state", () => {
    const result = interpretLight(makeEntity("off"));
    expect(result.isOn).toBe(false);
    expect(result.brightness).toBeNull();
    expect(result.colorTemp).toBeNull();
    expect(result.rgbColor).toBeNull();
  });

  it("interprets color temp", () => {
    const result = interpretLight(makeEntity("on", { color_temp: 350 }));
    expect(result.colorTemp).toBe(350);
  });

  it("interprets rgb color", () => {
    const result = interpretLight(makeEntity("on", { rgb_color: [255, 128, 0] }));
    expect(result.rgbColor).toEqual([255, 128, 0]);
  });
});
