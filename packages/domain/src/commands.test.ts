import { describe, expect, it } from "vitest";

import {
  turnOnLight,
  turnOffLight,
  setClimateTemperature,
  lockLock,
  unlockLock,
  activateScene,
  openCover,
  closeCover,
  setCoverPosition,
} from "./commands.js";
import { entityId } from "./ids.js";

const id = entityId("light.living_room");

describe("command factories", () => {
  it("turnOnLight without options", () => {
    const cmd = turnOnLight(id);
    expect(cmd.domain).toBe("light");
    expect(cmd.service).toBe("turn_on");
    expect(cmd.target).toEqual({ entity_id: id });
    expect(cmd.data).toBeUndefined();
  });

  it("turnOnLight with brightness", () => {
    const cmd = turnOnLight(id, { brightness: 128 });
    expect(cmd.data).toEqual({ brightness: 128 });
  });

  it("turnOffLight", () => {
    const cmd = turnOffLight(id);
    expect(cmd.domain).toBe("light");
    expect(cmd.service).toBe("turn_off");
  });

  it("setClimateTemperature", () => {
    const cmd = setClimateTemperature(entityId("climate.bedroom"), 22);
    expect(cmd.domain).toBe("climate");
    expect(cmd.service).toBe("set_temperature");
    expect(cmd.data).toEqual({ temperature: 22 });
  });

  it("lockLock and unlockLock", () => {
    const lock = lockLock(entityId("lock.front"));
    expect(lock.domain).toBe("lock");
    expect(lock.service).toBe("lock");

    const unlock = unlockLock(entityId("lock.front"));
    expect(unlock.service).toBe("unlock");
  });

  it("cover commands", () => {
    const coverId = entityId("cover.blinds");
    expect(openCover(coverId).service).toBe("open_cover");
    expect(closeCover(coverId).service).toBe("close_cover");
    expect(setCoverPosition(coverId, 50).data).toEqual({ position: 50 });
  });

  it("activateScene", () => {
    const cmd = activateScene(entityId("scene.movie"));
    expect(cmd.domain).toBe("scene");
    expect(cmd.service).toBe("turn_on");
  });
});
