import type { HassEntity, HassEntities } from "./types.js";

import { describe, expect, it, vi } from "vitest";

import { MockHaConnection } from "./mock-connection.js";

function makeHassEntity(entityId: string, state: string): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes: { friendly_name: entityId.replace(".", " ") },
    last_changed: "2024-01-01T00:00:00Z",
    last_updated: "2024-01-01T00:00:00Z",
    context: { id: "1", user_id: null, parent_id: null },
  };
}

describe("MockHaConnection", () => {
  it("starts disconnected", () => {
    const mock = new MockHaConnection();
    expect(mock.status).toBe("disconnected");
  });

  it("connects successfully", async () => {
    const mock = new MockHaConnection();
    const listener = vi.fn();
    mock.onStatusChange(listener);

    await mock.connect({ url: "http://ha:8123", token: "test" });

    expect(mock.status).toBe("connected");
    expect(listener).toHaveBeenCalledWith("connecting");
    expect(listener).toHaveBeenCalledWith("connected");
  });

  it("fails auth when configured", async () => {
    const mock = new MockHaConnection({ shouldFailAuth: true });

    await expect(mock.connect({ url: "http://ha:8123", token: "bad" })).rejects.toThrow(
      "Mock: invalid auth",
    );
    expect(mock.status).toBe("error");
  });

  it("fails connection when configured", async () => {
    const mock = new MockHaConnection({ shouldFailConnect: true });

    await expect(mock.connect({ url: "http://bad:8123", token: "test" })).rejects.toThrow(
      "Mock: connection failed",
    );
    expect(mock.status).toBe("error");
  });

  it("returns canned states", async () => {
    const entity = makeHassEntity("light.kitchen", "on");
    const mock = new MockHaConnection({ states: [entity] });
    await mock.connect({ url: "http://ha:8123", token: "test" });

    const states = await mock.getStates();
    expect(states).toHaveLength(1);
    expect(states[0]!.entity_id).toBe("light.kitchen");
  });

  it("subscribes to entities and receives initial state", async () => {
    const entity = makeHassEntity("light.kitchen", "on");
    const mock = new MockHaConnection({ states: [entity] });
    await mock.connect({ url: "http://ha:8123", token: "test" });

    const callback = vi.fn();
    const unsub = await mock.subscribeEntities(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ "light.kitchen": entity });

    unsub();
  });

  it("simulates state changes", async () => {
    const mock = new MockHaConnection();
    await mock.connect({ url: "http://ha:8123", token: "test" });

    const callback = vi.fn();
    await mock.subscribeEntities(callback);

    const updated: HassEntities = {
      "light.kitchen": makeHassEntity("light.kitchen", "off"),
    };
    mock.simulateStateChange(updated);

    expect(callback).toHaveBeenCalledWith(updated);
  });

  it("logs service calls", async () => {
    const mock = new MockHaConnection();
    await mock.connect({ url: "http://ha:8123", token: "test" });

    await mock.callService("light", "turn_on", { brightness: 128 }, { entity_id: "light.kitchen" });

    expect(mock.serviceCalls).toHaveLength(1);
    expect(mock.serviceCalls[0]).toEqual({
      domain: "light",
      service: "turn_on",
      data: { brightness: 128 },
      target: { entity_id: "light.kitchen" },
    });
  });

  it("simulates reconnect", async () => {
    const mock = new MockHaConnection();
    await mock.connect({ url: "http://ha:8123", token: "test" });

    const listener = vi.fn();
    mock.onStatusChange(listener);

    mock.simulateReconnect();

    expect(listener).toHaveBeenCalledWith("reconnecting");
    expect(listener).toHaveBeenCalledWith("connected");
  });

  it("unsubscribes status listener", async () => {
    const mock = new MockHaConnection();
    const listener = vi.fn();
    const unsub = mock.onStatusChange(listener);

    await mock.connect({ url: "http://ha:8123", token: "test" });
    expect(listener).toHaveBeenCalled();

    listener.mockClear();
    unsub();
    mock.disconnect();
    expect(listener).not.toHaveBeenCalled();
  });
});
