const getAwarenessLevel = (percentage) => {
  const value = Number(percentage || 0);
  if (value < 30) return 'Vulnerable';
  if (value < 60) return 'Basic Awareness';
  if (value < 80) return 'Security Aware';
  return 'Cyber Smart';
};

module.exports = { getAwarenessLevel };
