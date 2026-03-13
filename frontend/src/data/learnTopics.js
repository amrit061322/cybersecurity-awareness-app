export const learnTopics = [
  {
    slug: 'phishing',
    quizTopic: 'phishing',
    title: 'Phishing Attacks',
    description: 'Phishing uses fake emails, messages, or websites to trick you into revealing credentials or installing malware.',
    tips: [
      'Check sender domains carefully before clicking links.',
      'Hover over links to verify the real destination.',
      'Report suspicious messages to your security team.'
    ],
    resources: [
      { label: 'NCSC Phishing Guidance', url: 'https://www.ncsc.gov.uk/guidance/phishing' },
      { label: 'CISA Phishing Awareness', url: 'https://www.cisa.gov/topics/phishing' }
    ]
  },
  {
    slug: 'password-security',
    quizTopic: 'password-safety',
    title: 'Password Security',
    description: 'Strong, unique passwords and MFA reduce the risk of account compromise.',
    tips: [
      'Use long passphrases (12+ characters).',
      'Enable multi-factor authentication wherever possible.',
      'Use a password manager to avoid reuse.'
    ],
    resources: [
      { label: 'NCSC Password Guidance', url: 'https://www.ncsc.gov.uk/collection/passwords' },
      { label: 'OWASP Password Storage', url: 'https://owasp.org/www-project-cheat-sheets/cheatsheets/Password_Storage_Cheat_Sheet.html' }
    ]
  },
  {
    slug: 'social-engineering',
    title: 'Social Engineering',
    description: 'Attackers manipulate people into sharing sensitive information or granting access.',
    tips: [
      'Verify identities through trusted channels.',
      'Slow down when a request feels urgent or unusual.',
      'Never share OTPs or reset codes.'
    ],
    resources: [
      { label: 'CISA Social Engineering', url: 'https://www.cisa.gov/topics/social-engineering' },
      { label: 'SANS Security Awareness', url: 'https://www.sans.org/security-awareness-training/' }
    ]
  },
  {
    slug: 'malware',
    quizTopic: 'malware-awareness',
    title: 'Malware',
    description: 'Malware includes viruses, worms, and spyware designed to harm devices or steal data.',
    tips: [
      'Keep software and operating systems updated.',
      'Avoid installing untrusted software.',
      'Use reputable antivirus protection.'
    ],
    resources: [
      { label: 'CISA Malware Resources', url: 'https://www.cisa.gov/topics/malware' },
      { label: 'NCSC Malware', url: 'https://www.ncsc.gov.uk/collection/malware-and-ransomware' }
    ]
  },
  {
    slug: 'ransomware',
    title: 'Ransomware',
    description: 'Ransomware encrypts files and demands payment for decryption.',
    tips: [
      'Maintain regular offline backups.',
      'Apply security updates promptly.',
      'Do not pay ransoms without guidance.'
    ],
    resources: [
      { label: 'CISA Ransomware Guide', url: 'https://www.cisa.gov/stopransomware' },
      { label: 'NCSC Ransomware', url: 'https://www.ncsc.gov.uk/guidance/mitigating-malware-and-ransomware-attacks' }
    ]
  },
  {
    slug: 'public-wifi',
    title: 'Public WiFi Risks',
    description: 'Public WiFi networks can be spoofed or monitored, exposing your data.',
    tips: [
      'Avoid sensitive logins on public WiFi.',
      'Use a VPN for encrypted traffic.',
      'Turn off auto-connect on devices.'
    ],
    resources: [
      { label: 'CISA Public WiFi Tips', url: 'https://www.cisa.gov/news-events/news/using-public-wi-fi' },
      { label: 'NCSC WiFi Guidance', url: 'https://www.ncsc.gov.uk/guidance/using-public-wi-fi' }
    ]
  },
  {
    slug: 'data-privacy',
    quizTopic: 'online-privacy',
    title: 'Data Privacy',
    description: 'Protecting personal data reduces identity theft and fraud risks.',
    tips: [
      'Review app permissions regularly.',
      'Limit what you share on social platforms.',
      'Use privacy-enhancing browser settings.'
    ],
    resources: [
      { label: 'NCSC Data Privacy', url: 'https://www.ncsc.gov.uk/collection/personal-data' },
      { label: 'OWASP Privacy', url: 'https://owasp.org/www-project-privacy-guide/' }
    ]
  },
  {
    slug: 'email-scams',
    title: 'Email Scams',
    description: 'Scammers mimic trusted brands to steal money or credentials.',
    tips: [
      'Check sender addresses and reply-to fields.',
      'Avoid clicking unexpected attachments.',
      'Report scams to your email provider.'
    ],
    resources: [
      { label: 'NCSC Email Scams', url: 'https://www.ncsc.gov.uk/guidance/email-scams' },
      { label: 'CISA Scam Alerts', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories' }
    ]
  },
  {
    slug: 'identity-theft',
    title: 'Identity Theft',
    description: 'Stolen personal information can be used to open accounts or commit fraud.',
    tips: [
      'Monitor credit reports and bank statements.',
      'Use MFA on financial accounts.',
      'Freeze credit when suspicious activity occurs.'
    ],
    resources: [
      { label: 'CISA Identity Theft', url: 'https://www.cisa.gov/topics/identity-theft' },
      { label: 'NCSC Identity Protection', url: 'https://www.ncsc.gov.uk/collection/identity' }
    ]
  },
  {
    slug: 'two-factor-authentication',
    title: 'Two Factor Authentication',
    description: '2FA adds an extra verification step beyond a password.',
    tips: [
      'Prefer authenticator apps or hardware keys.',
      'Avoid SMS-only 2FA when possible.',
      'Store backup codes securely.'
    ],
    resources: [
      { label: 'NCSC MFA Guidance', url: 'https://www.ncsc.gov.uk/collection/multi-factor-authentication-mfa' },
      { label: 'CISA MFA', url: 'https://www.cisa.gov/topics/multi-factor-authentication' }
    ]
  }
];
