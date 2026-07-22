/**
 * CollisionEngine.js
 * 
 * Pure deterministic rule engine for evaluating chemical collisions.
 * Separated from UI for independent unit testing and logic reuse.
 * 
 * Future Extension Points:
 * - evaluateCollision(energy, orientation, threshold, temperature, catalystPresence)
 * - catalystPresence could artificially lower the threshold.
 * - temperature could scale the input energy.
 */

export const OUTCOMES = {
  LOW_ENERGY: 'LOW_ENERGY',
  WRONG_ORIENTATION: 'WRONG_ORIENTATION',
  SUCCESS: 'SUCCESS'
};

export const ORIENTATIONS = {
  HEAD_ON: 'HEAD_ON',
  GLANCING: 'GLANCING'
};

/**
 * Evaluates the outcome of a molecular collision.
 * 
 * @param {number} energy - The kinetic energy of the collision (e.g., 10-100)
 * @param {string} orientation - 'HEAD_ON' or 'GLANCING'
 * @param {number} threshold - The activation energy required for a successful reaction
 * @returns {string} One of OUTCOMES
 */
export function evaluateCollision(energy, orientation, threshold = 50) {
  if (energy < threshold) {
    return OUTCOMES.LOW_ENERGY;
  }
  
  if (orientation === ORIENTATIONS.GLANCING) {
    return OUTCOMES.WRONG_ORIENTATION;
  }

  return OUTCOMES.SUCCESS;
}
