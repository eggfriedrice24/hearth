import type {
  HassConfig,
  HassEntities,
  HassEntity,
  HassServices,
  HassServiceTarget,
} from "home-assistant-js-websocket";

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";

export interface HaConnectionConfig {
  url: string;
  token: string;
}

export type StatusChangeListener = (status: ConnectionStatus) => void;

export interface HaArea {
  area_id: string;
  name: string;
  icon: string | null;
  picture: string | null;
  aliases: string[];
}

export interface HaDevice {
  id: string;
  name: string | null;
  manufacturer: string | null;
  model: string | null;
  area_id: string | null;
}

export interface HaEntityRegistryEntry {
  entity_id: string;
  name: string | null;
  platform: string;
  device_id: string | null;
  area_id: string | null;
  disabled_by: string | null;
  hidden_by: string | null;
}

export type ServiceTarget = HassServiceTarget;

export interface IHaConnection {
  connect(config: HaConnectionConfig): Promise<void>;
  disconnect(): void;

  readonly status: ConnectionStatus;
  onStatusChange(listener: StatusChangeListener): () => void;

  getStates(): Promise<HassEntity[]>;
  subscribeEntities(callback: (entities: HassEntities) => void): Promise<() => void>;

  getAreaRegistry(): Promise<HaArea[]>;
  getDeviceRegistry(): Promise<HaDevice[]>;
  getEntityRegistry(): Promise<HaEntityRegistryEntry[]>;

  getServices(): Promise<HassServices>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: ServiceTarget,
  ): Promise<void>;

  getConfig(): Promise<HassConfig>;
}

export type { HassConfig, HassEntities, HassEntity, HassServices };
