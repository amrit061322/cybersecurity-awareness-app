const getAwarenessLevel = (percentage) => {
  const value = Math.max(0, Math.min(100, Number(percentage || 0)));

  if (value < 10) return 'Level 1 (0-9%)';
  if (value < 20) return 'Level 2 (10-19%)';
  if (value < 30) return 'Level 3 (20-29%)';
  if (value < 40) return 'Level 4 (30-39%)';
  if (value < 50) return 'Level 5 (40-49%)';
  if (value < 60) return 'Level 6 (50-59%)';
  if (value < 70) return 'Level 7 (60-69%)';
  if (value < 80) return 'Level 8 (70-79%)';
  if (value < 90) return 'Level 9 (80-89%)';
  return 'Level 10 (90-100%)';
};

module.exports = { getAwarenessLevel };
