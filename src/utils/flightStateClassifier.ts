/**
 * Flight state classification based on Mach number and angle of attack.
 * Pure function — no side effects.
 */

export type FlightState = 'subsonic' | 'transonic' | 'supersonic' | 'stall';

export interface FlightStateInfo {
  /** Unique identifier matching table row IDs */
  id: FlightState;
  /** Whether this state is currently active */
  active: boolean;
  /** CSS classes for active row highlighting */
  rowActiveClasses: string[];
  /** CSS classes for active status badge */
  statusActiveClasses: string[];
  /** Status display text */
  statusText: string;
}

/**
 * Classify the current flight regime and return state info for all categories.
 */
export function classifyFlightStates(mach: number, aoa: number): FlightStateInfo[] {
  const absAoa = Math.abs(aoa);

  return [
    {
      id: 'subsonic',
      active: mach < 0.8,
      rowActiveClasses: ['bg-cyan-900/30', 'border-cyan-400'],
      statusActiveClasses: ['opacity-100', 'bg-cyan-500/20', 'text-cyan-300', 'animate-pulse'],
      statusText: '作動',
    },
    {
      id: 'transonic',
      active: mach >= 0.8 && mach <= 1.2,
      rowActiveClasses: ['bg-blue-900/40', 'border-blue-400'],
      statusActiveClasses: ['opacity-100', 'bg-blue-500/30', 'text-blue-300', 'animate-pulse'],
      statusText: '作動',
    },
    {
      id: 'supersonic',
      active: mach > 1.2,
      rowActiveClasses: ['bg-purple-900/40', 'border-purple-400'],
      statusActiveClasses: ['opacity-100', 'bg-purple-500/30', 'text-purple-300', 'animate-pulse'],
      statusText: '作動',
    },
    {
      id: 'stall',
      active: absAoa >= 20,
      rowActiveClasses: ['bg-amber-900/40', 'border-amber-500'],
      statusActiveClasses: ['opacity-100', 'bg-amber-500/30', 'text-amber-400', 'animate-pulse'],
      statusText: '危險',
    },
  ];
}
