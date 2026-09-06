/**
 * KALKI VAULT PLATFORM ARCHITECTURE & FEATURE FLAGS
 * Future services are configured here. Modifying these flags enables
 * corresponding production dashboards without modifying frontend structure.
 */

export interface VaultPlatformConfig {
  STUDENT_VAULT_ENABLED: boolean;
  RESEARCHER_VAULT_ENABLED: boolean;
  COMPANY_VAULT_ENABLED: boolean;
  PUBLIC_AWARENESS_ENGINE: boolean;
  THREAT_TELEMETRY_FEED: boolean;
  KILL_CHAIN_SIMULATOR: boolean;
  RESEARCH_DISCLOSURE_PORTAL: boolean;
}

export const FEATURE_FLAGS: VaultPlatformConfig = {
  // Currently Available Systems
  PUBLIC_AWARENESS_ENGINE: true,
  THREAT_TELEMETRY_FEED: true,
  KILL_CHAIN_SIMULATOR: true,
  RESEARCH_DISCLOSURE_PORTAL: true,

  // Future-Ready Ecosystem Vaults (Locked for next release cycles)
  STUDENT_VAULT_ENABLED: false,
  RESEARCHER_VAULT_ENABLED: false,
  COMPANY_VAULT_ENABLED: false,
};

export const VAULT_ROUTES = {
  HOME: '/',
  AWARENESS: '#awareness',
  THREATS: '#threats',
  KILL_CHAIN: '#kill-chain',
  AUDIENCE: '#audience',
  ECOSYSTEM: '#ecosystem',
  VISION: '#vision',
  ABOUT: '#about',
  
  // Future Path Shells
  STUDENT_PORTAL: '/student/dashboard',
  RESEARCH_PORTAL: '/researcher/dashboard',
  COMPANY_PORTAL: '/company/dashboard',
  LABS: '/labs',
  PRODUCTS: '/products',
};
