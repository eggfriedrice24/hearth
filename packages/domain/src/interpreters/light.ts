import type { HearthEntity } from "../types.js";

export interface LightState {
  isOn: boolean;
  brightness: number | null;
  colorTemp: number | null;
  minColorTemp: number | null;
  maxColorTemp: number | null;
  rgbColor: [number, number, number] | null;
  supportedFeatures: number;
}

export function interpretLight(entity: HearthEntity): LightState {
  const attrs = entity.attributes;
  return {
    isOn: entity.state === "on",
    brightness: typeof attrs["brightness"] === "number" ? attrs["brightness"] : null,
    colorTemp: typeof attrs["color_temp"] === "number" ? attrs["color_temp"] : null,
    minColorTemp:
      typeof attrs["min_color_temp_kelvin"] === "number" ? attrs["min_color_temp_kelvin"] : null,
    maxColorTemp:
      typeof attrs["max_color_temp_kelvin"] === "number" ? attrs["max_color_temp_kelvin"] : null,
    rgbColor: Array.isArray(attrs["rgb_color"])
      ? (attrs["rgb_color"] as [number, number, number])
      : null,
    supportedFeatures:
      typeof attrs["supported_features"] === "number" ? attrs["supported_features"] : 0,
  };
}
