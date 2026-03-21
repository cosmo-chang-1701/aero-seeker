/**
 * Simulation constants used across the wind tunnel system.
 */

/** Total length of the virtual wind tunnel */
export const TUNNEL_LENGTH = 50.0;

/** GPU texture width/height for GPGPU computation */
export const TEXTURE_WIDTH = 1024;

/** Number of streamlines in Y direction */
export const LINES_Y = 32;

/** Number of streamlines in Z direction */
export const LINES_Z = 32;

/** Number of points per streamline */
export const POINTS_PER_LINE = 1024;

/** Initial camera position */
export const INITIAL_CAMERA_POSITION = { x: -15, y: 10, z: 28 } as const;

/** Grid helper configuration */
export const GRID_CONFIG = {
  size: TUNNEL_LENGTH,
  divisions: 20,
  centerColor: 0x444444,
  gridColor: 0x222222,
  yOffset: -6,
} as const;
