/**
 * Camera shake intensity calculator.
 */
export function computeShakeIntensity(mach: number, aoa: number, windSpeed: number): number {
  const transShake = mach > 0.85 && mach < 1.15
    ? 1.0 - Math.abs(mach - 1.0) / 0.15
    : 0;

  const aoaShake = Math.max(0, (Math.abs(aoa) - 15) / 10.0);
  const totalShake = Math.max(transShake, aoaShake) * Math.min(1.0, windSpeed / 5.0);

  return totalShake;
}

/**
 * Apply shake offset to a camera position.
 */
export function applyShakeOffset(
  x: number,
  y: number,
  z: number,
  intensity: number,
): { x: number; y: number; z: number } {
  if (intensity <= 0.01) return { x, y, z };
  return {
    x: x + (Math.random() - 0.5) * 0.4 * intensity,
    y: y + (Math.random() - 0.5) * 0.4 * intensity,
    z: z + (Math.random() - 0.5) * 0.4 * intensity,
  };
}
