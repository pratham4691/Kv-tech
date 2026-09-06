export interface ThreatVector {
  id: string;
  title: string;
  category: 'Identity & Access' | 'Payload & Malware' | 'Infrastructure & Network' | 'Next-Gen & AI';
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  riskScore: number;
  shortDesc: string;
  technicalSummary: string;
  attackMechanic: {
    entryPoint: string;
    exploitationStep: string;
    consequence: string;
  };
  defenseProtocol: string[];
  keyIndicators: string[];
}

export const THREAT_VECTORS: ThreatVector[] = [
  {
    id: 'phishing',
    title: 'Phishing & Spear Phishing',
    category: 'Identity & Access',
    severity: 'CRITICAL',
    riskScore: 94,
    shortDesc: 'Deceptive psychological vectors crafting fabricated authority to siphon credentials and session tokens.',
    technicalSummary: 'Adversaries deploy high-fidelity clone sites, lookalike domains (typosquatting), and targeted communication vectors to bypass basic heuristics and trick personnel into relinquishing high-entropy authentication factors.',
    attackMechanic: {
      entryPoint: 'Weaponized email, SMS, or direct messaging containing deceptive links.',
      exploitationStep: 'User submits credentials or session cookies on an attacker-controlled proxy (AitM reverse-proxy).',
      consequence: 'Unauthorized account takeover, internal reconnaissance, and lateral privilege escalation.'
    },
    defenseProtocol: [
      'Hardware-bound FIDO2 / WebAuthn passkeys immune to AitM relay',
      'DKIM, SPF, and DMARC enforcement with strict rejection policy',
      'Continuous behavioral URL sandboxing and heuristic inspection'
    ],
    keyIndicators: ['Mismatched return-path headers', 'Unusual login geolocations', 'Domain homograph glyphs']
  },
  {
    id: 'identity-theft',
    title: 'Identity Theft & Credential Stuffing',
    category: 'Identity & Access',
    severity: 'HIGH',
    riskScore: 89,
    shortDesc: 'Automated replay of billions of leaked credentials against diverse authentication endpoints.',
    technicalSummary: 'Attackers utilize distributed botnets to automate high-velocity credential stuffing across multiple consumer and corporate login portals, leveraging human password re-use habits across the web.',
    attackMechanic: {
      entryPoint: 'Exposed dark web breach databases and credential dump feeds.',
      exploitationStep: 'Distributed proxies blast auth APIs with stolen username/password pairs.',
      consequence: 'Silent compromise of accounts across non-breached platforms due to password overlap.'
    },
    defenseProtocol: [
      'Universal Zero Trust Identity architecture with mandatory adaptive MFA',
      'Dark web breach monitoring and automated compromised credential revocation',
      'Strict rate limiting, CAPTCHA step-ups, and biometric challenge verification'
    ],
    keyIndicators: ['High ratio of failed login attempts from rotational IP pools', 'Sudden password change requests']
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering & Pretexting',
    category: 'Identity & Access',
    severity: 'HIGH',
    riskScore: 86,
    shortDesc: 'Human vulnerability exploitation manipulating trust, urgency, or authority to bypass technical controls.',
    technicalSummary: 'Targeted manipulation where attackers impersonate executive leadership, IT helpdesk personnel, or external auditors to coerce employees into approving MFA push notifications, altering wire routing, or granting elevated access.',
    attackMechanic: {
      entryPoint: 'Direct phone, video, or chat interaction utilizing tailored OSINT research.',
      exploitationStep: 'Exploitation of cognitive biases (urgency, deference to authority, fear of disruption).',
      consequence: 'Out-of-band security overrides, unauthorized access grant, or fraudulent financial transfer.'
    },
    defenseProtocol: [
      'Strict multi-person verification procedures for sensitive access or transactions',
      'Number-matching MFA enforcement to defeat MFA push exhaustion fatigue',
      'Psychological resilience training and non-punitive verification culture'
    ],
    keyIndicators: ['Urgent requests bypassing standard ticketing channels', 'Demands to bypass verified protocols']
  },
  {
    id: 'polymorphic-malware',
    title: 'Polymorphic & Fileless Malware',
    category: 'Payload & Malware',
    severity: 'CRITICAL',
    riskScore: 96,
    shortDesc: 'Self-mutating code and in-memory execution designed to evade signature-based antivirus engines.',
    technicalSummary: 'Modern malware dynamically modifies its decryption routines, payload binary footprint, and API hashing signatures with each execution. Advanced strains execute directly in volatile memory (RAM) via PowerShell, WMI, or reflective DLL injection.',
    attackMechanic: {
      entryPoint: 'Drive-by downloads, compromised staging binaries, or malicious macros.',
      exploitationStep: 'Payload decodes in memory without writing persistent files to disk.',
      consequence: 'Unchecked telemetry capture, system beaconing, and backdoor establishment.'
    },
    defenseProtocol: [
      'Endpoint Detection & Response (EDR) utilizing behavioral heuristics and telemetry graphs',
      'PowerShell Constrained Language Mode and Script Block Logging',
      'Attack Surface Reduction (ASR) rules blocking API process injection'
    ],
    keyIndicators: ['Unusual parent-child process relationships (e.g. Word launching PowerShell)', 'Unsigned DLL memory mappings']
  },
  {
    id: 'ransomware',
    title: 'Ransomware & Multi-Extortion',
    category: 'Payload & Malware',
    severity: 'CRITICAL',
    riskScore: 98,
    shortDesc: 'Symmetric/asymmetric cryptographic locking of operational assets paired with confidential data extortion.',
    technicalSummary: 'Advanced Persistent Threat (APT) syndicates deploy ransomware as a final objective after extensive reconnaissance, disabling shadow copies, exfiltrating terabytes of intellectual property, and encrypting critical hypervisors and storage arrays.',
    attackMechanic: {
      entryPoint: 'Compromised VPN endpoints, unpatched RDP, or initial access broker payloads.',
      exploitationStep: 'Domain controller compromise, Volume Shadow Copy deletion, and batch encryption.',
      consequence: 'Catastrophic operational paralysis and multi-million-dollar extortion demands.'
    },
    defenseProtocol: [
      'Immutable air-gapped backups with hardware write-once-read-many (WORM) storage',
      'Micro-segmentation isolating critical production VLANs from general workstations',
      'Automated canary file tripwires with instant network containment isolation'
    ],
    keyIndicators: ['High-frequency I/O disk writes', 'Deletion of Volume Shadow Copies (vssadmin.exe)', 'Mass renaming of file extensions']
  },
  {
    id: 'data-breaches',
    title: 'Data Breaches & Exfiltration',
    category: 'Payload & Malware',
    severity: 'HIGH',
    riskScore: 91,
    shortDesc: 'Covert extraction of sensitive proprietary records, customer PII, and cryptographic material.',
    technicalSummary: 'Post-exploitation extraction utilizing encrypted tunnels, DNS tunneling, or legitimate cloud sync utilities (e.g., rclone) disguised as standard outbound TLS traffic to conceal the unauthorized transfer of data lakes.',
    attackMechanic: {
      entryPoint: 'SQL injection, unauthenticated cloud storage buckets, or compromised admin credentials.',
      exploitationStep: 'Staging, compressing, and chunk-encrypting database schemas and document trees.',
      consequence: 'Regulatory non-compliance (GDPR/HIPAA), loss of trade secrets, and massive brand damage.'
    },
    defenseProtocol: [
      'Data Loss Prevention (DLP) monitoring anomalous outbound bulk data transfers',
      'Field-level database encryption with separate Key Management Systems (KMS)',
      'Egress firewall filtering restricting unknown destination IP ranges and cloud sync tools'
    ],
    keyIndicators: ['Unusual spikes in egress network bandwidth during non-business hours', 'Mass SQL SELECT dump queries']
  },
  {
    id: 'account-takeover',
    title: 'Account Takeover (ATO) & Session Hijacking',
    category: 'Identity & Access',
    severity: 'HIGH',
    riskScore: 88,
    shortDesc: 'Interception and replay of authenticated session tokens and OAuth bearer authorizations.',
    technicalSummary: 'Attackers extract valid authentication cookies via infostealer malware or cross-site scripting (XSS), bypassing username, password, and MFA validation entirely by injecting live session tokens directly into attacker browsers.',
    attackMechanic: {
      entryPoint: 'Infostealer logs, compromised browser cache, or XSS payload reflection.',
      exploitationStep: 'Session token cloned and replayed without triggering password prompts.',
      consequence: 'Immediate impersonation of victim with pre-existing authenticated permissions.'
    },
    defenseProtocol: [
      'Cryptographically bound TLS tokens and continuous device posture verification',
      'Short-lived JWT lifespans with strict refresh token rotation and revocation list',
      'HttpOnly, Secure, and SameSite=Strict cookie attribute enforcement'
    ],
    keyIndicators: ['Simultaneous session requests from divergent IP subnets', 'User-Agent alterations within identical session ID']
  },
  {
    id: 'supply-chain',
    title: 'Supply Chain & Unsafe Dependencies',
    category: 'Infrastructure & Network',
    severity: 'CRITICAL',
    riskScore: 95,
    shortDesc: 'Tampering with upstream third-party code packages, CI/CD pipelines, or vendor build systems.',
    technicalSummary: 'Infiltration of open-source package repositories (npm, PyPI) via typosquatting, account hijacking of maintainers, or malicious commit injections (SolarWinds/XZ Utils style) that distribute backdoors to downstream consumers.',
    attackMechanic: {
      entryPoint: 'Upstream open-source library update or compromised third-party vendor build server.',
      exploitationStep: 'Malicious payload builds inside enterprise software during regular CI/CD execution.',
      consequence: 'Broad compromise of all client instances inheriting the compromised package.'
    },
    defenseProtocol: [
      'Software Bill of Materials (SBOM) generation and automated vulnerability tracking',
      'Pinning cryptographic checksum hashes on all dependencies and using internal mirrors',
      'Least-privilege isolation of CI/CD build environments with strict egress policies'
    ],
    keyIndicators: ['Unexpected outbound network sockets initiated during npm/pip install scripts', 'Sudden change in maintainer keys']
  },
  {
    id: 'network-attacks',
    title: 'Distributed Network & BGP Hijacks',
    category: 'Infrastructure & Network',
    severity: 'ELEVATED',
    riskScore: 84,
    shortDesc: 'Volumetric traffic saturation and routing table poisoning to induce total service blackout.',
    technicalSummary: 'Adversaries weaponize thousands of infected IoT devices to generate multi-terabit amplification floods (NTP/DNS/SSDP) or broadcast rogue BGP routes to reroute and inspect sensitive corporate Internet transit.',
    attackMechanic: {
      entryPoint: 'Exposed edge routing nodes, UDP reflection endpoints, and unprotected public IPs.',
      exploitationStep: 'Massive volumetric packet inundation exhausting bandwidth and stateful firewall tables.',
      consequence: 'Total downtime of mission-critical customer portals and latency disruption.'
    },
    defenseProtocol: [
      'Anycast routing architecture with upstream DDoS scrubbing center mitigation',
      'Resource Public Key Infrastructure (RPKI) deployment to prevent BGP route spoofing',
      'SYN cookies, connection state limits, and rate-limiting at edge ingress points'
    ],
    keyIndicators: ['Sudden packet drops across edge interfaces', 'Anomalous autonomous system path (AS-Path) announcements']
  },
  {
    id: 'cloud-security',
    title: 'Cloud Misconfiguration & IAM Privilege Creep',
    category: 'Infrastructure & Network',
    severity: 'HIGH',
    riskScore: 90,
    shortDesc: 'Excessive cloud permissions, unencrypted object stores, and unmonitored control plane keys.',
    technicalSummary: 'Overly permissive Identity and Access Management (IAM) roles, publicly readable storage buckets, or exposed metadata service endpoints (IMDSv1) allowing lateral movement and privilege escalation in AWS/GCP/Azure.',
    attackMechanic: {
      entryPoint: 'SSRF in web application querying Instance Metadata Service or hardcoded cloud keys in code.',
      exploitationStep: 'Extraction of temporary STS credentials and leveraging wildcard (*) IAM policies.',
      consequence: 'Snapshot theft, infrastructure destruction, or rogue compute cryptomining.'
    },
    defenseProtocol: [
      'Mandatory enforcement of IMDSv2 and automated IAM permission boundary analyzers',
      'Cloud Security Posture Management (CSPM) with automated remediation triggers',
      'Infrastructure as Code (IaC) static security scanning in pull requests'
    ],
    keyIndicators: ['CloudTrail API calls originating from unrecognized IP blocks', 'Creation of unauthorized IAM access keys']
  },
  {
    id: 'mobile-security',
    title: 'Mobile Exploitation & Malicious Profiles',
    category: 'Identity & Access',
    severity: 'ELEVATED',
    riskScore: 82,
    shortDesc: 'Zero-click mobile vulnerabilities, sideloaded spyware, and rogue MDM management profiles.',
    technicalSummary: 'Adversaries target mobile operating system kernel vulnerabilities (WebKit/iMessage zero-days) or utilize malicious mobile configuration profiles to intercept device traffic and access onboard microphones, cameras, and encrypted chats.',
    attackMechanic: {
      entryPoint: 'Zero-click messaging exploit or deceptive installation of malicious enterprise certificate.',
      exploitationStep: 'Jailbreak / root execution bypassing sandbox isolation between applications.',
      consequence: 'Continuous acoustic surveillance, GPS tracking, and extraction of two-factor OTP codes.'
    },
    defenseProtocol: [
      'Mobile Device Management (MDM) with strict zero-trust compliance posture',
      'Continuous OS patch cadence and blocking sideloaded developer profiles',
      'App sandboxing and restricting clipboard access across enterprise apps'
    ],
    keyIndicators: ['Unusual battery drain and background data surges', 'Presence of unverified enterprise management certificates']
  },
  {
    id: 'ai-attacks',
    title: 'AI-Powered Synthetic Attacks & Deepfakes',
    category: 'Next-Gen & AI',
    severity: 'CRITICAL',
    riskScore: 97,
    shortDesc: 'Real-time voice cloning, biometric spoofing, and automated adversarial prompt injection.',
    technicalSummary: 'Threat actors leverage real-time generative models to synthesize executive voice and video for targeted CEO fraud, bypass voice biometric auth systems, and automate adaptive vulnerability discovery at machine speed.',
    attackMechanic: {
      entryPoint: 'Real-time synthesized audio/video in authorized executive communication channels.',
      exploitationStep: 'Direct prompt injection against enterprise LLMs or convincing verification calls.',
      consequence: 'Bypass of conventional social engineering defenses and automated unauthorized actions.'
    },
    defenseProtocol: [
      'Cryptographic challenge-response verification for executive authorization calls',
      'Deepfake artifact detection algorithms inspecting micro-expressions and spectral audio cues',
      'Strict input guardrails and sandboxed privilege boundaries for autonomous enterprise AI agents'
    ],
    keyIndicators: ['Unnatural vocal cadences and frequency artifacts in high-value verbal authorization calls']
  }
];
