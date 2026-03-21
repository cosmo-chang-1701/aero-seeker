import * as THREE from 'three';

/**
 * Material parameter constants and predefined color values.
 */

/** F-35 armor material — grey metallic */
export const ARMOR_MAT_PARAMS = {
  color: 0x485058,
  roughness: 0.6,
  metalness: 0.5,
} as const;

/** Dark metal for engine/intake */
export const DARK_METAL_PARAMS = {
  color: 0x222222,
  roughness: 0.8,
  metalness: 0.8,
} as const;

/** Glass material for cockpit */
export const GLASS_MAT_PARAMS = {
  color: 0x111822,
  roughness: 0.05,
  metalness: 0.95,
} as const;

/** Glow material for engine nozzle */
export const GLOW_MAT_PARAMS = {
  color: 0x00bfff,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
} as const;

/** Inner glow material (white core) */
export const INNER_GLOW_MAT_PARAMS = {
  color: 0xffffff,
  transparent: true,
  opacity: 0.0,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
} as const;

// Predefined glow colors (pre-multiplied for HDR)
export const COLOR_GLOW_OUTER_1 = new THREE.Color(0x00bfff).multiplyScalar(1.5);
export const COLOR_GLOW_OUTER_2 = new THREE.Color(0xff4400).multiplyScalar(2.5);
export const COLOR_GLOW_INNER_1 = new THREE.Color(0xffffff).multiplyScalar(3.0);
export const COLOR_GLOW_INNER_2 = new THREE.Color(0xffdd66).multiplyScalar(3.0);
export const COLOR_HEAT_EMISSIVE = new THREE.Color(0xff3300);
