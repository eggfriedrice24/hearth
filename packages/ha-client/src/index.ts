export type {
  ConnectionStatus,
  HaConnectionConfig,
  HaArea,
  HaDevice,
  HaEntityRegistryEntry,
  IHaConnection,
  ServiceTarget,
  StatusChangeListener,
  HassConfig,
  HassEntities,
  HassEntity,
  HassServices,
} from "./types.js";

export { HaConnection } from "./connection.js";
export { MockHaConnection, type MockHaConnectionOptions } from "./mock-connection.js";
export { HaConnectionError, type HaConnectionErrorCode } from "./errors.js";
export { mapEntity, mapArea, mapDevice, buildRooms } from "./mappers.js";
