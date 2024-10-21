import { Vector3, Euler } from 'three';

export type EnvironmentPreset = "apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse";

export const PHONE_1_PRESET = {
  backgroundColor: 'linear-gradient(45deg, #D5CCFF, #6B75FF)',
  environmentPreset: 'studio' as EnvironmentPreset,
  cameraType: 'orthographic' as const,
  mockupMaterial: 'glass' as const,
  modelPosition: new Vector3(0, 0, 0),
  modelRotation: new Euler(-15 * Math.PI / 180, -30 * Math.PI / 180, -15 * Math.PI / 180),
};
