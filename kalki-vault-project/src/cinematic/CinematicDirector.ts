import * as THREE from 'three';
import { CameraDirector } from './CameraDirector';
import { AtmosphereDirector } from './AtmosphereDirector';
import { ParticleDirector } from '../particles/ParticleDirector';
import { BrainEngine } from '../brain/BrainEngine';
import { AudioDirector } from '../audio/AudioDirector';
import { PerformanceDirector } from '../performance/PerformanceDirector';

export class CinematicDirector {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  public cameraDirector!: CameraDirector;
  public atmosphereDirector!: AtmosphereDirector;
  public particleDirector!: ParticleDirector;
  public brainEngine!: BrainEngine;
  public audioDirector!: AudioDirector;
  public perfDirector!: PerformanceDirector;

  private clock = new THREE.Clock();
  private scrollProgress = 0;
  private isRunning = true;
  private lastTapTime = 0;

  // Raycasting for interactive double-tap & hover on brain
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(private container: HTMLElement) {
    this.init();
  }

  private init() {
    this.perfDirector = new PerformanceDirector();
    this.audioDirector = new AudioDirector();

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.cameraDirector = new CameraDirector(width / height);

    // WebGL Renderer with graceful fallback
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: this.perfDirector.profile.tier === 'HIGH',
        alpha: true,
        powerPreference: 'high-performance',
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(this.perfDirector.profile.maxDpr);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.1;
      this.container.appendChild(this.renderer.domElement);
    } catch (err) {
      console.warn('WebGL initialization failed, using high-res fallback canvas:', err);
      const fallback = document.getElementById('neural-brain-3d');
      if (fallback) fallback.classList.remove('hidden');
      return;
    }

    // Subsystems
    this.atmosphereDirector = new AtmosphereDirector(this.scene);
    this.particleDirector = new ParticleDirector(this.scene, this.perfDirector);
    this.brainEngine = new BrainEngine(this.scene, this.audioDirector, this.perfDirector);

    // Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
    this.renderer.domElement.addEventListener('dblclick', this.onDoubleClick.bind(this));
    this.renderer.domElement.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
    window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });

    // Initial scroll setup
    this.onScroll();

    // Start render loop
    this.animate();
  }

  private onResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.cameraDirector.updateAspect(width / height);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.perfDirector.profile.maxDpr);
  }

  private onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = Math.max(0, Math.min(1, scrollTop / Math.max(1, docHeight)));

    // Dynamic scene color grading based on scroll position
    if (this.scrollProgress < 0.25) {
      // Hero / Neural Intelligence: Cyan
      this.atmosphereDirector.setColorGrade('#00f0ff');
      this.particleDirector.setCinematicState('CALM');
    } else if (this.scrollProgress < 0.5) {
      // Threat Radar & Kill Chain: Threat Crimson
      this.atmosphereDirector.setColorGrade('#ff0055');
      this.particleDirector.setCinematicState('TENSION');
    } else if (this.scrollProgress < 0.72) {
      // Quantum Lab / PQC Lattice: Quantum Emerald
      this.atmosphereDirector.setColorGrade('#10b981');
      this.particleDirector.setCinematicState('ACCELERATION');
    } else if (this.scrollProgress < 0.88) {
      // Ecosystem & Academy: Research Gold
      this.atmosphereDirector.setColorGrade('#f59e0b');
      this.particleDirector.setCinematicState('REVEAL');
    } else {
      // Deep Vault: Deep-Space Blue
      this.atmosphereDirector.setColorGrade('#38bdf8');
      this.particleDirector.setCinematicState('CALM');
    }
  }

  private onMouseMove(e: MouseEvent) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  private onClick() {
    this.audioDirector.playHoverTone(720);
  }

  private onDoubleClick() {
    this.executeCinematicSurge();
  }

  private onTouchStart(e: TouchEvent) {
    const now = Date.now();
    if (now - this.lastTapTime < 340) {
      // Double tap detected!
      this.executeCinematicSurge();
    }
    this.lastTapTime = now;
  }

  private executeCinematicSurge() {
    this.raycaster.setFromCamera(this.mouse, this.cameraDirector.camera);
    const intersects = this.raycaster.intersectObjects([this.brainEngine.group], true);
    const hitPoint = intersects.length > 0 ? intersects[0].point : undefined;

    this.brainEngine.triggerSynapticSurge(hitPoint, (stage, intensity) => {
      if (stage === 'ANTICIPATION') {
        this.particleDirector.setCinematicState('TENSION');
      } else if (stage === 'SILENCE') {
        this.particleDirector.setCinematicState('SILENCE');
      } else if (stage === 'IMPACT') {
        this.cameraDirector.triggerMicroShake(0.35);
        this.atmosphereDirector.triggerLightningFlash();
        this.particleDirector.triggerShockwave(hitPoint || new THREE.Vector3(0, 0, 0), '#00f0ff');
        this.particleDirector.setCinematicState('IMPACT');

        // Add temporary chromatic aberration screen shake via CSS class
        document.body.classList.add('cinematic-impact-shake');
        setTimeout(() => document.body.classList.remove('cinematic-impact-shake'), 400);
      } else if (stage === 'REVEAL') {
        this.particleDirector.setCinematicState('REVEAL');
      } else if (stage === 'CALM') {
        this.particleDirector.setCinematicState('CALM');
      }
    });
  }

  private animate = () => {
    if (!this.isRunning) return;
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    this.perfDirector.recordFrame();

    // Update all cinematic subsystems
    this.cameraDirector.update(delta, this.scrollProgress, time);
    this.atmosphereDirector.update(delta, time);
    this.particleDirector.update(delta, time);
    this.brainEngine.update(delta, time);

    // Render 3D Scene
    this.renderer.render(this.scene, this.cameraDirector.camera);
  };

  public toggleSound(): boolean {
    return this.audioDirector.toggleSound();
  }

  public dispose() {
    this.isRunning = false;
    window.removeEventListener('resize', this.onResize.bind(this));
    window.removeEventListener('scroll', this.onScroll.bind(this));
    this.brainEngine.dispose();
    this.renderer.dispose();
  }
}
