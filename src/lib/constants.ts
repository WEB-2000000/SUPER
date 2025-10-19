export const XP_PER_TASK = 10;

export const getXPForNextLevel = (level: number): number => {
  if (level <= 0) return 100;
  // This curve makes leveling up progressively harder, making it feel more rewarding.
  return Math.floor(100 * Math.pow(level, 1.6));
};
