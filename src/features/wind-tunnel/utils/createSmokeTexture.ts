import * as THREE from 'three';

/**
 * Create a procedural smoke texture using Canvas 2D radial gradient.
 */
export function createSmokeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;

  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.15, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.1)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}
