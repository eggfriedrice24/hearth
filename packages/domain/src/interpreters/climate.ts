import type { HearthEntity } from "../types.js";

export type HvacMode = "off" | "heat" | "cool" | "heat_cool" | "auto" | "dry" | "fan_only";

export interface ClimateState {
  currentTemperature: number | null;
  targetTemperature: number | null;
  hvacMode: HvacMode;
  hvacModes: HvacMode[];
  humidity: number | null;
  hvacAction: string | null;
  minTemp: number | null;
  maxTemp: number | null;
}

export function interpretClimate(entity: HearthEntity): ClimateState {
  const attrs = entity.attributes;
  return {
    currentTemperature:
      typeof attrs["current_temperature"] === "number" ? attrs["current_temperature"] : null,
    targetTemperature: typeof attrs["temperature"] === "number" ? attrs["temperature"] : null,
    hvacMode: (entity.state as HvacMode) || "off",
    hvacModes: Array.isArray(attrs["hvac_modes"]) ? (attrs["hvac_modes"] as HvacMode[]) : [],
    humidity: typeof attrs["current_humidity"] === "number" ? attrs["current_humidity"] : null,
    hvacAction: typeof attrs["hvac_action"] === "string" ? attrs["hvac_action"] : null,
    minTemp: typeof attrs["min_temp"] === "number" ? attrs["min_temp"] : null,
    maxTemp: typeof attrs["max_temp"] === "number" ? attrs["max_temp"] : null,
  };
}
