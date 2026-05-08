const getAwarenessLevel = (percentage) => {
  const value = Math.max(0, Math.min(100, Number(percentage || 0)));
  const tiers = [
    { min: 0, max: 9, level: 1, name: 'Vulnerable' },
    { min: 10, max: 19, level: 2, name: 'Novice Defender' },
    { min: 20, max: 29, level: 3, name: 'Aware Starter' },
    { min: 30, max: 39, level: 4, name: 'Risk Recogniser' },
    { min: 40, max: 49, level: 5, name: 'Security Learner' },
    { min: 50, max: 59, level: 6, name: 'Practical Protector' },
    { min: 60, max: 69, level: 7, name: 'Threat Spotter' },
    { min: 70, max: 79, level: 8, name: 'Security Aware' },
    { min: 80, max: 89, level: 9, name: 'Cyber Smart' },
    { min: 90, max: 100, level: 10, name: 'Cyber Guardian' }
  ];

  const selected = tiers.find((tier) => value >= tier.min && value <= tier.max) || tiers[0];
  return `Level ${selected.level} - ${selected.name} (${selected.min}-${selected.max}%)`;
};

module.exports = { getAwarenessLevel };
