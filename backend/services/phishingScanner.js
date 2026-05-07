const { URL } = require('url');

const keywordSignals = [
  'password',
  'verify',
  'account',
  'login',
  'bank',
  'invoice',
  'payment',
  'urgent',
  'security alert',
  'reset',
  'confirm',
  'suspended',
  'locked',
  'wire',
  'refund',
  'gift card',
  'otp',
  'one time',
  'two-factor',
  'unusual activity'
];

const urgencySignals = [
  'urgent',
  'immediately',
  'asap',
  'act now',
  'last chance',
  'expires',
  'within 24 hours',
  'final notice',
  'suspended',
  'limited time'
];

const suspiciousTlds = ['.ru', '.cn', '.xyz', '.top', '.click', '.work', '.info', '.site', '.tk'];

const extractLinks = (text) => {
  const matches = text.match(/https?:\/\/[^\s]+/gi);
  return matches || [];
};

const getDomain = (input) => {
  try {
    const target = input.startsWith('http') ? new URL(input) : new URL(`https://${input}`);
    return target.hostname.toLowerCase();
  } catch (error) {
    return '';
  }
};

const isSuspiciousDomain = (domain) => {
  if (!domain) return false;
  if (domain.includes('xn--')) return true;
  if (/\d{2,}/.test(domain)) return true;
  if ((domain.match(/-/g) || []).length >= 2) return true;
  return suspiciousTlds.some((tld) => domain.endsWith(tld));
};

const analyzeLinks = (links) => {
  let score = 0;
  const reasons = [];

  links.forEach((link) => {
    if (link.includes('@')) {
      score += 8;
      reasons.push('Link contains @ symbol');
    }
    if (/https?:\/\/\d{1,3}(?:\.\d{1,3}){3}/.test(link)) {
      score += 10;
      reasons.push('Link points to raw IP address');
    }
    if (link.length > 90) {
      score += 6;
      reasons.push('Unusually long URL detected');
    }
    const domain = getDomain(link);
    if (domain && domain.split('.').length >= 4) {
      score += 6;
      reasons.push('Deep subdomain structure detected');
    }
    if (isSuspiciousDomain(domain)) {
      score += 12;
      reasons.push('Suspicious domain pattern detected');
    }
  });

  return { score, reasons };
};

const scanPhishing = ({ inputType, content, url, fileName }) => {
  let score = 15;
  const riskFactors = [];
  const explanations = [];

  if (inputType === 'image') {
    score += 20;
    riskFactors.push('image-scan');
    explanations.push('Screenshot analysis simulated');
    if (fileName && /login|bank|verify|secure/i.test(fileName)) {
      score += 10;
      explanations.push('Filename hints at sensitive login content');
    }
  }

  const textBody = `${content || ''}`.trim();
  const combined = `${textBody} ${url || ''}`.toLowerCase();

  if (combined) {
    const keywordHits = keywordSignals.filter((keyword) => combined.includes(keyword));
    if (keywordHits.length > 0) {
      const keywordScore = Math.min(30, keywordHits.length * 5);
      score += keywordScore;
      riskFactors.push('keyword-analysis');
      explanations.push(`High-risk keywords detected: ${keywordHits.slice(0, 4).join(', ')}`);
    }

    const urgencyHits = urgencySignals.filter((keyword) => combined.includes(keyword));
    if (urgencyHits.length > 0) {
      const urgencyScore = Math.min(20, urgencyHits.length * 5);
      score += urgencyScore;
      riskFactors.push('urgency-language');
      explanations.push('Urgent language detected');
    }

    const links = extractLinks(combined);
    if (links.length > 0) {
      const { score: linkScore, reasons } = analyzeLinks(links);
      score += Math.min(25, linkScore);
      if (reasons.length > 0) {
        riskFactors.push('link-structure');
        explanations.push(...reasons.slice(0, 3));
      }
    }
  }

  if (url) {
    const domain = getDomain(url);
    if (!domain) {
      score += 8;
      riskFactors.push('domain-analysis');
      explanations.push('URL format looks invalid');
    } else if (isSuspiciousDomain(domain)) {
      score += 15;
      riskFactors.push('domain-analysis');
      explanations.push('Suspicious domain pattern detected');
    }
  }

  const confidenceScore = Math.max(0, Math.min(100, Math.round(score)));
  let resultStatus = 'safe';
  if (confidenceScore >= 70) resultStatus = 'phishing';
  else if (confidenceScore >= 45) resultStatus = 'suspicious';

  if (explanations.length === 0) {
    explanations.push('No significant red flags detected');
  }

  return { confidenceScore, resultStatus, riskFactors, explanations };
};

module.exports = { scanPhishing };

