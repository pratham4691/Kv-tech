/**
 * KALKI VAULT — Performance Director
 * Monitors GPU tier, device pixel ratio, framerate, and accessibility settings.
 * Automatically modulates LOD, particle densities, and post-processing quality.
 */

export interface PerformanceProfile {
  tier: 'HIGH' | 'MEDIUM' | 'LOW';
  maxDpr: number;
  particleScale: number;
  volumetricEnabled: boolean;
  chromaticAberrationEnabled: boolean;
  brainLOD: 'HIGH' | 'MEDIUM' | 'LOW';
  reducedMotion: boolean;
}

export class PerformanceDirector {
  public profile: PerformanceProfile;
  private frameCount = 0;
  private lastFpsCheck = performance.now();
  private currentFps = 60;
  private listeners: ((profile: PerformanceProfile) => void)[] = [];

  constructor() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cpuCores = navigator.hardwareConcurrency || 4;

    let tier: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
    if (isMobile || cpuCores <= 4) {
      tier = 'MEDIUM';
    }
    if (cpuCores <= 2) {
      tier = 'LOW';
    }

    this.profile = {
      tier,
      maxDpr: tier === 'HIGH' ? Math.min(window.devicePixelRatio, 2) : 1,
      particleScale: tier === 'HIGH' ? 1.0 : (tier === 'MEDIUM' ? 0.6 : 0.35),
      volumetricEnabled: tier === 'HIGH',
      chromaticAberrationEnabled: tier !== 'LOW',
      brainLOD: tier,
      reducedMotion,
    };

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
      this.profile.reducedMotion = e.matches;
      this.notify();
    });
  }

  public recordFrame() {
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsCheck >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsCheck));
      this.frameCount = 0;
      this.lastFpsCheck = now;

      // Auto downgrade if framerate drops significantly
      if (this.currentFps < 30 && this.profile.tier === 'HIGH') {
        this.profile.tier = 'MEDIUM';
        this.profile.particleScale = 0.6;
        this.profile.volumetricEnabled = false;
        this.notify();
      } else if (this.currentFps < 20 && this.profile.tier === 'MEDIUM') {
        this.profile.tier = 'LOW';
        this.profile.particleScale = 0.35;
        this.profile.chromaticAberrationEnabled = false;
        this.notify();
      }
    }
  }

  public subscribe(fn: (profile: PerformanceProfile) => void) {
    this.listeners.push(fn);
    fn(this.profile);
  }

  private notify() {
    for (const fn of this.listeners) fn(this.profile);
  }

  public getFps() {
    return this.currentFps;
  }
}
