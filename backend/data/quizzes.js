const quizBank = [
  {
    topic: 'phishing',
    questions: [
      {
        question: 'Which sign most strongly indicates a phishing email?',
        options: [
          'Generic greeting and urgent call to action',
          'Email from a known contact',
          'Proper spelling and branding',
          'A receipt for a purchase you made'
        ],
        correctAnswer: 'Generic greeting and urgent call to action',
        explanation: 'Phishing often uses urgency and generic greetings to pressure action.'
      },
      {
        question: 'What is the safest action when you receive a suspicious link?',
        options: [
          'Click it to see where it goes',
          'Forward it to friends',
          'Verify via official website or contact',
          'Reply asking for proof'
        ],
        correctAnswer: 'Verify via official website or contact',
        explanation: 'Always verify through trusted channels rather than clicking.'
      },
      {
        question: 'A URL has a misspelled domain (paypaI.com). What is this?',
        options: [
          'A legitimate regional domain',
          'Typosquatting',
          'A secure alias',
          'A DNS shortcut'
        ],
        correctAnswer: 'Typosquatting',
        explanation: 'Attackers use look-alike domains to trick users.'
      },
      {
        question: 'What should you do if you already clicked a phishing link?',
        options: [
          'Do nothing',
          'Change passwords and report it',
          'Only close the tab',
          'Share the link publicly'
        ],
        correctAnswer: 'Change passwords and report it',
        explanation: 'Respond quickly to reduce damage and notify security.'
      },
      {
        question: 'Which attachment type is most risky from unknown senders?',
        options: ['.jpg', '.pdf', '.exe', '.txt'],
        correctAnswer: '.exe',
        explanation: 'Executable files can run malicious code.'
      }
    ]
  },
  {
    topic: 'password-safety',
    questions: [
      {
        question: 'What is the best practice for password length?',
        options: ['At least 4 characters', 'At least 8 characters', 'At least 12 characters', 'Exactly 16 characters'],
        correctAnswer: 'At least 12 characters',
        explanation: 'Longer passwords are harder to crack.'
      },
      {
        question: 'Which is the safest approach for managing passwords?',
        options: ['Reuse the same password', 'Write them on paper', 'Use a password manager', 'Store in email drafts'],
        correctAnswer: 'Use a password manager',
        explanation: 'Managers generate and store strong unique passwords.'
      },
      {
        question: 'What does MFA/2FA add to your account security?',
        options: ['A second username', 'A second layer of verification', 'Faster login', 'Public access'],
        correctAnswer: 'A second layer of verification',
        explanation: 'MFA requires an additional factor beyond password.'
      },
      {
        question: 'Which password is strongest?',
        options: ['Password123', 'Summer2024', 'CorrectHorseBatteryStaple', 'qwerty'],
        correctAnswer: 'CorrectHorseBatteryStaple',
        explanation: 'Long passphrases are stronger and memorable.'
      },
      {
        question: 'How often should you change passwords?',
        options: ['Every week', 'Never', 'When compromised or prompted by policy', 'Every day'],
        correctAnswer: 'When compromised or prompted by policy',
        explanation: 'Frequent changes are not always needed unless risk exists.'
      }
    ]
  },
  {
    topic: 'malware-awareness',
    questions: [
      {
        question: 'What is malware?',
        options: ['Useful software', 'Any malicious software', 'A hardware failure', 'A network protocol'],
        correctAnswer: 'Any malicious software',
        explanation: 'Malware is software designed to harm systems or users.'
      },
      {
        question: 'Which is a common sign of malware infection?',
        options: ['Faster performance', 'Unexpected pop-ups and slowdowns', 'More storage space', 'Battery lasts longer'],
        correctAnswer: 'Unexpected pop-ups and slowdowns',
        explanation: 'Malware often degrades performance and shows pop-ups.'
      },
      {
        question: 'Ransomware typically does what?',
        options: ['Deletes photos for fun', 'Encrypts data and demands payment', 'Upgrades your OS', 'Speeds up the CPU'],
        correctAnswer: 'Encrypts data and demands payment',
        explanation: 'Ransomware locks files until a ransom is paid.'
      },
      {
        question: 'The best defense against malware is:',
        options: ['No backups', 'Outdated software', 'Regular updates and antivirus', 'Opening all attachments'],
        correctAnswer: 'Regular updates and antivirus',
        explanation: 'Updates patch vulnerabilities and AV detects threats.'
      },
      {
        question: 'Which action is risky?',
        options: ['Installing trusted updates', 'Downloading cracked software', 'Using MFA', 'Backing up data'],
        correctAnswer: 'Downloading cracked software',
        explanation: 'Pirated software often contains malware.'
      }
    ]
  },
  {
    topic: 'online-privacy',
    questions: [
      {
        question: 'What is a good practice for online privacy?',
        options: ['Share every detail publicly', 'Review privacy settings', 'Use the same username everywhere', 'Disable updates'],
        correctAnswer: 'Review privacy settings',
        explanation: 'Privacy settings control who sees your data.'
      },
      {
        question: 'Public Wi-Fi is risky because:',
        options: ['It is slower', 'Attackers can intercept traffic', 'It blocks websites', 'It is always encrypted'],
        correctAnswer: 'Attackers can intercept traffic',
        explanation: 'Public networks can be monitored or spoofed.'
      },
      {
        question: 'A VPN helps by:',
        options: ['Making you invisible', 'Encrypting your connection', 'Deleting cookies', 'Blocking emails'],
        correctAnswer: 'Encrypting your connection',
        explanation: 'VPNs secure traffic over untrusted networks.'
      },
      {
        question: 'Which is personal data?',
        options: ['Weather', 'Device IP and location', 'Public news', 'A random quote'],
        correctAnswer: 'Device IP and location',
        explanation: 'IP and location can identify or track you.'
      },
      {
        question: 'Why should you limit app permissions?',
        options: ['It saves battery only', 'It reduces data exposure', 'It slows the app', 'It prevents updates'],
        correctAnswer: 'It reduces data exposure',
        explanation: 'Fewer permissions reduce risk.'
      }
    ]
  }
];

module.exports = { quizBank };
