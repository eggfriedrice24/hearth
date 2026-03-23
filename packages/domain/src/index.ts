export type { EntityId, RoomId, DeviceId, UserId } from "./ids.js";
export { entityId, roomId, deviceId, userId } from "./ids.js";

export type { EntityCategory } from "./categories.js";
export { categoryFromDomain, categoryFromEntityId, domainFromEntityId } from "./categories.js";

export type {
  HearthEntity,
  HearthRoom,
  HearthDeviceGroup,
  HearthScene,
  HearthAutomation,
} from "./types.js";

export type { ServiceTarget, HearthCommand } from "./commands.js";
export {
  turnOnLight,
  turnOffLight,
  toggleSwitch,
  setClimateTemperature,
  setClimateMode,
  openCover,
  closeCover,
  stopCover,
  setCoverPosition,
  lockLock,
  unlockLock,
  activateScene,
} from "./commands.js";

export type { UserRole, UserPermissions } from "./roles.js";
export { getPermissions, canUserControlInRoom } from "./roles.js";

export type { LightState } from "./interpreters/light.js";
export { interpretLight } from "./interpreters/light.js";

export type { ClimateState, HvacMode } from "./interpreters/climate.js";
export { interpretClimate } from "./interpreters/climate.js";

export type { CoverState } from "./interpreters/cover.js";
export { interpretCover } from "./interpreters/cover.js";

export type { LockState } from "./interpreters/lock.js";
export { interpretLock } from "./interpreters/lock.js";

export type { SensorState, BinarySensorState } from "./interpreters/sensor.js";
export { interpretSensor, interpretBinarySensor } from "./interpreters/sensor.js";
