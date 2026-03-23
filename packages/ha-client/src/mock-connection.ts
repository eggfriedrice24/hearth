import type {
  HassConfig,
  HassEntities,
  HassEntity,
  HassServices,
  ConnectionStatus,
  HaConnectionConfig,
  HaArea,
  HaDevice,
  HaEntityRegistryEntry,
  IHaConnection,
  ServiceTarget,
  StatusChangeListener,
} from "./types.js";

import { HaConnectionError } from "./errors.js";

export interface MockHaConnectionOptions {
  states?: HassEntity[];
  areas?: HaArea[];
  devices?: HaDevice[];
  entityRegistry?: HaEntityRegistryEntry[];
  services?: HassServices;
  config?: Partial<HassConfig>;
  shouldFailAuth?: boolean;
  shouldFailConnect?: boolean;
}

export class MockHaConnection implements IHaConnection {
  private _status: ConnectionStatus = "disconnected";
  private listeners = new Set<StatusChangeListener>();
  private entityListeners = new Set<(entities: HassEntities) => void>();
  private options: MockHaConnectionOptions;
  private serviceCallLog: Array<{
    domain: string;
    service: string;
    data: Record<string, unknown> | undefined;
    target: ServiceTarget | undefined;
  }> = [];

  constructor(options: MockHaConnectionOptions = {}) {
    this.options = options;
  }

  get status(): ConnectionStatus {
    return this._status;
  }

  get serviceCalls() {
    return this.serviceCallLog;
  }

  onStatusChange(listener: StatusChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setStatus(status: ConnectionStatus): void {
    this._status = status;
    for (const listener of this.listeners) {
      listener(status);
    }
  }

  async connect(_config: HaConnectionConfig): Promise<void> {
    this.setStatus("connecting");

    if (this.options.shouldFailAuth) {
      this.setStatus("error");
      throw new HaConnectionError("auth_invalid", "Mock: invalid auth");
    }

    if (this.options.shouldFailConnect) {
      this.setStatus("error");
      throw new HaConnectionError("connection_failed", "Mock: connection failed");
    }

    this.setStatus("connected");
  }

  disconnect(): void {
    this.setStatus("disconnected");
  }

  async getStates(): Promise<HassEntity[]> {
    return this.options.states ?? [];
  }

  async subscribeEntities(callback: (entities: HassEntities) => void): Promise<() => void> {
    this.entityListeners.add(callback);

    if (this.options.states) {
      const entities: HassEntities = {};
      for (const state of this.options.states) {
        entities[state.entity_id] = state;
      }
      callback(entities);
    }

    return () => {
      this.entityListeners.delete(callback);
    };
  }

  /** Simulate a state change from HA — triggers all entity subscribers */
  simulateStateChange(entities: HassEntities): void {
    for (const listener of this.entityListeners) {
      listener(entities);
    }
  }

  /** Simulate a disconnect then reconnect */
  simulateReconnect(): void {
    this.setStatus("reconnecting");
    this.setStatus("connected");
  }

  async getAreaRegistry(): Promise<HaArea[]> {
    return this.options.areas ?? [];
  }

  async getDeviceRegistry(): Promise<HaDevice[]> {
    return this.options.devices ?? [];
  }

  async getEntityRegistry(): Promise<HaEntityRegistryEntry[]> {
    return this.options.entityRegistry ?? [];
  }

  async getServices(): Promise<HassServices> {
    return this.options.services ?? {};
  }

  async callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: ServiceTarget,
  ): Promise<void> {
    this.serviceCallLog.push({ domain, service, data, target });
  }

  async getConfig(): Promise<HassConfig> {
    return {
      latitude: 0,
      longitude: 0,
      elevation: 0,
      unit_system: {
        length: "km",
        mass: "kg",
        temperature: "°C",
        volume: "L",
        pressure: "Pa",
        wind_speed: "km/h",
        accumulated_precipitation: "mm",
      },
      location_name: "Mock Home",
      time_zone: "UTC",
      components: [],
      config_dir: "/config",
      allowlist_external_dirs: [],
      allowlist_external_urls: [],
      version: "2024.1.0",
      config_source: "storage",
      recovery_mode: false,
      state: "RUNNING",
      external_url: null,
      internal_url: null,
      currency: "USD",
      country: null,
      language: "en",
      safe_mode: false,
      ...this.options.config,
    } as HassConfig;
  }
}
