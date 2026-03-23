import type {
  ConnectionStatus,
  HaConnectionConfig,
  HaArea,
  HaDevice,
  HaEntityRegistryEntry,
  IHaConnection,
  ServiceTarget,
  StatusChangeListener,
} from "./types.js";

import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
  getStates,
  getServices,
  getConfig,
  callService,
  ERR_CANNOT_CONNECT,
  ERR_INVALID_AUTH,
  type Connection,
  type HassEntities,
  type HassEntity,
  type HassServices,
  type HassConfig,
} from "home-assistant-js-websocket";

import { HaConnectionError } from "./errors.js";

export class HaConnection implements IHaConnection {
  private connection: Connection | null = null;
  private _status: ConnectionStatus = "disconnected";
  private listeners = new Set<StatusChangeListener>();

  get status(): ConnectionStatus {
    return this._status;
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

  async connect(config: HaConnectionConfig): Promise<void> {
    this.setStatus("connecting");

    const auth = createLongLivedTokenAuth(config.url, config.token);

    try {
      this.connection = await createConnection({ auth });
    } catch (err) {
      if (err === ERR_INVALID_AUTH) {
        this.setStatus("error");
        throw new HaConnectionError("auth_invalid", "Invalid Home Assistant access token");
      }
      if (err === ERR_CANNOT_CONNECT) {
        this.setStatus("error");
        throw new HaConnectionError(
          "connection_failed",
          `Cannot connect to Home Assistant at ${config.url}`,
        );
      }
      this.setStatus("error");
      throw new HaConnectionError("unknown", "Failed to connect to Home Assistant", {
        cause: err,
      });
    }

    this.connection.addEventListener("ready", () => {
      this.setStatus("connected");
    });

    this.connection.addEventListener("disconnected", () => {
      this.setStatus("reconnecting");
    });

    this.connection.addEventListener("reconnect-error", () => {
      this.setStatus("reconnecting");
    });

    this.setStatus("connected");
  }

  disconnect(): void {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    this.setStatus("disconnected");
  }

  private requireConnection(): Connection {
    if (!this.connection) {
      throw new HaConnectionError("connection_lost", "Not connected to Home Assistant");
    }
    return this.connection;
  }

  async getStates(): Promise<HassEntity[]> {
    return getStates(this.requireConnection());
  }

  async subscribeEntities(callback: (entities: HassEntities) => void): Promise<() => void> {
    const unsub = subscribeEntities(this.requireConnection(), (entities) => {
      callback(entities);
    });
    return unsub;
  }

  async getAreaRegistry(): Promise<HaArea[]> {
    const conn = this.requireConnection();
    return conn.sendMessagePromise<HaArea[]>({ type: "config/area_registry/list" });
  }

  async getDeviceRegistry(): Promise<HaDevice[]> {
    const conn = this.requireConnection();
    return conn.sendMessagePromise<HaDevice[]>({ type: "config/device_registry/list" });
  }

  async getEntityRegistry(): Promise<HaEntityRegistryEntry[]> {
    const conn = this.requireConnection();
    return conn.sendMessagePromise<HaEntityRegistryEntry[]>({
      type: "config/entity_registry/list",
    });
  }

  async getServices(): Promise<HassServices> {
    return getServices(this.requireConnection());
  }

  async callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: ServiceTarget,
  ): Promise<void> {
    await callService(this.requireConnection(), domain, service, data, target);
  }

  async getConfig(): Promise<HassConfig> {
    return getConfig(this.requireConnection());
  }
}
