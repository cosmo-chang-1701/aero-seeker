import * as THREE from 'three';
import {
  COLOR_GLOW_OUTER_1,
  COLOR_GLOW_OUTER_2,
  COLOR_GLOW_INNER_1,
  COLOR_GLOW_INNER_2,
  COLOR_HEAT_EMISSIVE,
} from '@/shared/constants/materials';

/**
 * Compute engine nozzle glow visual parameters.
 */

const _tempColor = new THREE.Color();

export interface GlowParams {
  /** Scale vector for outer glow mesh */
  outerScale: THREE.Vector3;
  /** Color for outer glow material */
  outerColor: THREE.Color;
  /** Opacity for outer glow material */
  outerOpacity: number;
  /** Opacity for inner glow material */
  innerOpacity: number;
  /** Scale vector for inner glow mesh */
  innerScale: THREE.Vector3;
  /** Color for inner glow material */
  innerColor: THREE.Color;
  /** Number of visible Mach rings (diamonds) */
  machRingsCount: number;
  /** Opacity of the Mach rings */
  machRingOpacity: number;
  /** Spacing distance between adjacent Mach rings */
  machRingSpacing: number;
}

export function computeJetGlowParams(mach: number): GlowParams {
  const lerpFactor = Math.max(0, Math.min((mach - 0.8) / 0.7, 1.0));

  const outerColor = new THREE.Color().lerpColors(COLOR_GLOW_OUTER_1, COLOR_GLOW_OUTER_2, lerpFactor);
  const innerColor = new THREE.Color().lerpColors(COLOR_GLOW_INNER_1, COLOR_GLOW_INNER_2, lerpFactor);

  const machRingFactor = Math.max(0, (mach - 0.9) / 1.5);
  const outerScaleX = (0.8 + mach * 1.8) * (1.0 + Math.random() * (0.02 + mach * 0.06));
  const outerScaleY = 0.8 + mach * 0.25;

  return {
    outerScale: new THREE.Vector3(
      outerScaleX,
      outerScaleY,
      outerScaleY,
    ),
    outerColor,
    outerOpacity: 0.4 + (mach / 2.5) * 0.5 + Math.random() * 0.1,
    innerOpacity: lerpFactor * (0.6 + Math.random() * 0.4),
    innerScale: new THREE.Vector3(1.0 + mach * 0.8 + Math.random() * 0.2, 1.0 + mach * 0.1, 1.0 + mach * 0.1),
    innerColor,
    machRingsCount: machRingFactor > 0 ? Math.floor(Math.min(12, 1 + machRingFactor * 10)) : 0,
    machRingOpacity: machRingFactor > 0 ? (0.5 + machRingFactor * 0.5 + Math.random() * 0.1) : 0,
    machRingSpacing: 0.15 + (mach * 0.15),
  };
}

/**
 * Compute emissive color for custom model materials based on Mach number.
 */
export function computeCustomModelEmissive(mach: number): { emissiveColor: THREE.Color; emissiveIntensity: number } {
  const heatFactor = Math.max(0, (mach - 1.2) / 1.3);
  const emissiveColor = _tempColor.copy(COLOR_HEAT_EMISSIVE).multiplyScalar(heatFactor * 2.0);
  return { emissiveColor: emissiveColor.clone(), emissiveIntensity: heatFactor };
}
