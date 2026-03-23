import { describe, expect, it } from "vitest";

import { categoryFromDomain, categoryFromEntityId, domainFromEntityId } from "./categories.js";

describe("domainFromEntityId", () => {
  it("extracts domain from entity id", () => {
    expect(domainFromEntityId("light.living_room")).toBe("light");
    expect(domainFromEntityId("climate.bedroom")).toBe("climate");
    expect(domainFromEntityId("binary_sensor.front_door")).toBe("binary_sensor");
  });

  it("returns full string if no dot", () => {
    expect(domainFromEntityId("invalid")).toBe("invalid");
  });
});

describe("categoryFromDomain", () => {
  it("maps known domains", () => {
    expect(categoryFromDomain("light")).toBe("light");
    expect(categoryFromDomain("switch")).toBe("switch");
    expect(categoryFromDomain("sensor")).toBe("sensor");
    expect(categoryFromDomain("binary_sensor")).toBe("binary_sensor");
    expect(categoryFromDomain("climate")).toBe("climate");
    expect(categoryFromDomain("cover")).toBe("cover");
    expect(categoryFromDomain("lock")).toBe("lock");
    expect(categoryFromDomain("scene")).toBe("scene");
    expect(categoryFromDomain("automation")).toBe("automation");
    expect(categoryFromDomain("media_player")).toBe("media_player");
    expect(categoryFromDomain("camera")).toBe("camera");
  });

  it("maps aliased domains", () => {
    expect(categoryFromDomain("input_boolean")).toBe("switch");
    expect(categoryFromDomain("fan")).toBe("switch");
    expect(categoryFromDomain("vacuum")).toBe("switch");
  });

  it("returns unknown for unrecognized domains", () => {
    expect(categoryFromDomain("weather")).toBe("unknown");
    expect(categoryFromDomain("tts")).toBe("unknown");
  });
});

describe("categoryFromEntityId", () => {
  it("derives category from entity id", () => {
    expect(categoryFromEntityId("light.kitchen")).toBe("light");
    expect(categoryFromEntityId("sensor.temperature")).toBe("sensor");
    expect(categoryFromEntityId("input_boolean.guest_mode")).toBe("switch");
    expect(categoryFromEntityId("unknown_domain.test")).toBe("unknown");
  });
});
