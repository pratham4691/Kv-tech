export type Threat = {
  id: string
  name: string
  severity: 'Elevated' | 'High' | 'Critical'
  summary: string
  mechanism: string
  defense: string
}

export type ThreatDetail = {
  slug: string
  name: string
  category: string
  severity: 'High' | 'Medium' | 'Low'
  summary: string
  whatHappens: string[]
  actions: string[]
  prevention: string[]
  related: string[]
}

export const threatLibrary: ThreatDetail[] = [
  {
    slug: 'phishing',
    name: 'Phishing',
    category: 'Social Engineering',
    severity: 'High',
    summary: 'Attackers trick users into handing over credentials or sensitive data through deceptive messages.',
    whatHappens: ['A convincing message appears urgent and legitimate.', 'The victim clicks a link or reveals data.', 'Credentials or sensitive information are harvested.'],
    actions: ['Stop interacting with the suspicious message.', 'Open the official service directly from a trusted bookmark.', 'Change the affected password and review account activity.'],
    prevention: ['Verify the sender and domain before acting.', 'Do not trust urgent messages alone.', 'Use MFA and a password manager.'],
    related: ['Fake Login Page', 'Smishing', 'Credential Theft'],
  },
  {
    slug: 'fake-login-page',
    name: 'Fake Login Page',
    category: 'Identity',
    severity: 'High',
    summary: 'A fake page looks like a real sign-in flow and steals user credentials in plain sight.',
    whatHappens: ['A message points to a deceptive page.', 'The page mirrors the real brand and requests credentials.', 'The attacker collects the entered login data.'],
    actions: ['Close the page immediately.', 'Open the official website yourself.', 'Change the password and enable multi-factor authentication.'],
    prevention: ['Check the full URL before entering credentials.', 'Avoid clicking from emails or texts.', 'Prefer app-based or bookmarked access.'],
    related: ['Phishing', 'Credential Stuffing', 'Account Takeover'],
  },
  {
    slug: 'credential-stuffing',
    name: 'Credential Stuffing',
    category: 'Identity',
    severity: 'High',
    summary: 'Attackers try leaked usernames and passwords across multiple services to find valid combinations.',
    whatHappens: ['Leaked credentials are reused in automated login attempts.', 'A valid set is found on another service.', 'The attacker gains access to personal accounts.'],
    actions: ['Reset any reused passwords immediately.', 'Check for account alerts and breach notifications.', 'Enable stronger account controls and reviews.'],
    prevention: ['Use unique passwords everywhere.', 'Use a password manager.', 'Enable MFA and monitor sign-in alerts.'],
    related: ['Phishing', 'Account Takeover', 'Session Hijacking'],
  },
  {
    slug: 'smishing',
    name: 'Smishing',
    category: 'Email',
    severity: 'Medium',
    summary: 'Attackers use SMS to lure users into a malicious link or account takeover flow.',
    whatHappens: ['A text message appears to be from a trusted source.', 'The user is pushed to respond or click a link.', 'Sensitive information or access is stolen.'],
    actions: ['Do not click unsolicited SMS links.', 'Confirm requests via a known channel.', 'Report scam messages and block the sender.'],
    prevention: ['Treat urgent text requests as suspicious.', 'Verify before action.', 'Keep personal recovery details private.'],
    related: ['Phishing', 'Fake Login Page', 'Malware'],
  },
  {
    slug: 'malware',
    name: 'Malware',
    category: 'Malware',
    severity: 'High',
    summary: 'Malicious software can steal information, record activities or disrupt systems without the user realizing it.',
    whatHappens: ['A device is tricked into executing a malicious file.', 'The software runs in the background.', 'It steals data or gives an attacker access.'],
    actions: ['Disconnect suspicious devices from the network.', 'Run a trusted security scan.', 'Remove unknown software and update endpoints.'],
    prevention: ['Download only from trusted sources.', 'Keep systems patched and protected.', 'Back up important data regularly.'],
    related: ['Ransomware', 'Spyware', 'Trojan'],
  },
  {
    slug: 'session-hijacking',
    name: 'Session Hijacking',
    category: 'Web',
    severity: 'High',
    summary: 'An attacker steals a valid session token and uses it to access an account without the user’s consent.',
    whatHappens: ['A session or token is intercepted or reused.', 'The attacker keeps the session active.', 'The user remains unaware while the attacker acts.'],
    actions: ['Log out of all active sessions.', 'Review connected devices and revoke suspicious ones.', 'Rotate credentials if anything looks abnormal.'],
    prevention: ['Use secure connections and avoid insecure public networks.', 'Review active session activity.', 'Prefer strong endpoint protections.'],
    related: ['Account Takeover', 'Fake Login Page', 'Malware'],
  },
  {
    slug: 'public-wifi-abuse',
    name: 'Public Wi‑Fi Abuse',
    category: 'Mobile',
    severity: 'Medium',
    summary: 'Public networks can be abused to intercept traffic or redirect users into dangerous environments.',
    whatHappens: ['A malicious hotspot mimics a legitimate connection.', 'Traffic is monitored or redirected.', 'Sensitive actions become exposed or manipulated.'],
    actions: ['Avoid sensitive activity on unknown networks.', 'Use a trusted network or known VPN.', 'Verify the hotspot name and connection details.'],
    prevention: ['Treat public Wi‑Fi as untrusted by default.', 'Use known networks only.', 'Avoid entering passwords on unknown hotspots.'],
    related: ['Man-in-the-Middle', 'Session Hijacking', 'Malware'],
  },
  {
    slug: 'cloud-misconfiguration',
    name: 'Cloud Misconfiguration',
    category: 'Cloud',
    severity: 'High',
    summary: 'Incorrect storage or access settings can unintentionally expose sensitive information to unauthorized users.',
    whatHappens: ['Storage or policies are opened too broadly.', 'Public access or weak permissions allow discovery.', 'Sensitive files become visible or downloadable.'],
    actions: ['Restrict access to the minimum required.', 'Audit storage permissions regularly.', 'Review public exposure before deployment.'],
    prevention: ['Use least privilege access.', 'Disable public access by default.', 'Audit configuration changes often.'],
    related: ['Data Exposure', 'Identity Theft', 'Malware'],
  },
]

export const threatLookup = Object.fromEntries(
  threatLibrary.map((threat) => [threat.slug, threat]),
) as Record<string, ThreatDetail>

export const threats: Threat[] = [
  {
    id: 'phishing',
    name: 'Phishing',
    severity: 'High',
    summary: 'Deceptive messages engineered to steal credentials or trust.',
    mechanism:
      'An attacker impersonates a trusted entity through email, SMS or chat, luring the target to a convincing fake surface designed to harvest what they type.',
    defense:
      'Verify the sender and the domain, never act on urgency alone, and route logins through bookmarked destinations rather than embedded links.',
  },
  {
    id: 'ransomware',
    name: 'Ransomware',
    severity: 'Critical',
    summary: 'Malicious encryption that holds data and operations hostage.',
    mechanism:
      'After gaining a foothold, the payload encrypts files across reachable systems and demands payment, often threatening to leak stolen data in parallel.',
    defense:
      'Maintain tested offline backups, segment networks, patch aggressively, and rehearse recovery so operations survive without paying.',
  },
  {
    id: 'social-engineering',
    name: 'Social Engineering',
    severity: 'High',
    summary: 'Manipulating people rather than breaking technology.',
    mechanism:
      'The attacker exploits helpfulness, authority or fear to convince a person to grant access, reset a credential or bypass a control.',
    defense:
      'Establish out-of-band verification for sensitive requests and build a culture where slowing down to confirm is rewarded, not penalized.',
  },
  {
    id: 'identity-theft',
    name: 'Identity Theft',
    severity: 'High',
    summary: 'Stolen identity used to impersonate and defraud.',
    mechanism:
      'Fragments of personal data are aggregated from breaches and public sources, then combined to pass verification and open accounts in a victim’s name.',
    defense:
      'Minimize shared personal data, monitor for exposure, and enable strong, phishing-resistant authentication on high-value accounts.',
  },
  {
    id: 'malware',
    name: 'Malware',
    severity: 'High',
    summary: 'Hostile software that subverts a device from within.',
    mechanism:
      'Malicious code arrives through a download, attachment or compromised update and quietly establishes control, surveillance or theft.',
    defense:
      'Install only from trusted sources, keep systems updated, and rely on modern endpoint protection with least-privilege access.',
  },
  {
    id: 'data-breach',
    name: 'Data Breach',
    severity: 'Critical',
    summary: 'Unauthorized exposure of sensitive information at scale.',
    mechanism:
      'A misconfiguration or intrusion exposes stored data, which is then exfiltrated and often surfaces later in secondary attacks.',
    defense:
      'Encrypt sensitive data, enforce least privilege, review configurations continuously, and monitor for anomalous access.',
  },
  {
    id: 'account-takeover',
    name: 'Account Takeover',
    severity: 'High',
    summary: 'An attacker seizes control of a legitimate account.',
    mechanism:
      'Reused or leaked passwords are replayed at scale until one unlocks an account, granting the attacker a trusted identity.',
    defense:
      'Use unique passwords in a manager and enable multi-factor authentication so a single leaked secret is not enough.',
  },
  {
    id: 'ai-powered',
    name: 'AI-Powered Attacks',
    severity: 'Elevated',
    summary: 'Automation and generative models that scale deception.',
    mechanism:
      'Generative tools craft tailored lures, clone voices and adapt in real time, lowering the cost of convincing, targeted attacks.',
    defense:
      'Treat unexpected media with healthy skepticism, verify through known channels, and pair human judgment with detection tooling.',
  },
  {
    id: 'cloud-risk',
    name: 'Cloud Security Risks',
    severity: 'High',
    summary: 'Misconfiguration and over-permission in shared infrastructure.',
    mechanism:
      'Default-open settings, exposed storage and excessive permissions turn convenient cloud services into an accessible attack surface.',
    defense:
      'Adopt least privilege, continuously audit configurations, and treat identity as the primary perimeter of the cloud.',
  },
]

export type AttackStage = {
  id: string
  index: number
  name: string
  description: string
  defenderMove: string
}

export const attackLifecycle: AttackStage[] = [
  {
    id: 'recon',
    index: 1,
    name: 'Reconnaissance',
    description:
      'The attacker studies the target — its people, systems and exposed surface — searching for the path of least resistance.',
    defenderMove:
      'Reduce your public footprint and monitor for scanning and unusual interest.',
  },
  {
    id: 'access',
    index: 2,
    name: 'Initial Access',
    description:
      'A first foothold is established, often through a person or an unpatched exposed service.',
    defenderMove:
      'Harden entry points, enforce MFA, and patch external-facing systems quickly.',
  },
  {
    id: 'execution',
    index: 3,
    name: 'Execution',
    description:
      'Code or commands run inside the environment, activating the attacker’s tooling.',
    defenderMove:
      'Restrict what can run and watch for unexpected process behavior.',
  },
  {
    id: 'persistence',
    index: 4,
    name: 'Persistence',
    description:
      'The attacker plants ways to return, surviving reboots and credential resets.',
    defenderMove:
      'Inventory access, rotate secrets, and hunt for unauthorized footholds.',
  },
  {
    id: 'escalation',
    index: 5,
    name: 'Privilege Escalation',
    description:
      'Higher privileges are obtained to reach more sensitive systems and data.',
    defenderMove:
      'Apply least privilege and alert on unexpected privilege changes.',
  },
  {
    id: 'data-access',
    index: 6,
    name: 'Data Access',
    description:
      'The attacker locates and collects the information they came for.',
    defenderMove:
      'Encrypt and segment sensitive data and monitor for abnormal access.',
  },
  {
    id: 'impact',
    index: 7,
    name: 'Impact',
    description:
      'The objective is realized — theft, disruption or extortion — completing the chain.',
    defenderMove:
      'Rehearse response and recovery so the chain can be broken before this stage.',
  },
]
