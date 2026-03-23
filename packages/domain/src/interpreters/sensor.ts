import type { HearthEntity } from "../types.js";

export interface SensorState {
  value: string;
  numericValue: number | null;
  unit: string | null;
  deviceClass: string | null;
}

export function interpretSensor(entity: HearthEntity): SensorState {
  const attrs = entity.attributes;
  const num = Number(entity.state);
  return {
    value: entity.state,
    numericValue: Number.isFinite(num) ? num : null,
    unit: typeof attrs["unit_of_measurement"] === "string" ? attrs["unit_of_measurement"] : null,
    deviceClass: typeof attrs["device_class"] === "string" ? attrs["device_class"] : null,
  };
}

export interface BinarySensorState {
  isOn: boolean;
  deviceClass: string | null;
}

export function interpretBinarySensor(entity: HearthEntity): BinarySensorState {
  const attrs = entity.attributes;
  return {
    isOn: entity.state === "on",
    deviceClass: typeof attrs["device_class"] === "string" ? attrs["device_class"] : null,
  };
}
