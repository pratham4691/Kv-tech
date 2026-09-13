import * as THREE from 'three';
import { CameraDirector } from './CameraDirector';
import { AtmosphereDirector } from './AtmosphereDirector';
import { ParticleDirector } from '../particles/ParticleDirector';
import { BrainEngine, AnatomicalLobe } from '../brain/BrainEngine';
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

  // Smooth Drag & Orbit Physics on Brain
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private rotY = 0.25;
  private rotX = 0.15;
  private velX = 0;
  private velY = 0;
  private targetRotX: number | null = null;
  private targetRotY: number | null = null;
  private zoom = 1.0;

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
      this.renderer.toneMappingExposure = 1.25;
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';
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
    
    // Canvas-specific interaction listeners for precision raycasting and orbit controls
    const canvas = this.renderer.domElement;
    canvas.addEventListener('mousedown', this.onPointerDown.bind(this));
    window.addEventListener('mousemove', this.onPointerMove.bind(this));
    window.addEventListener('mouseup', this.onPointerUp.bind(this));
    
    canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    canvas.addEventListener('dblclick', this.onDoubleClick.bind(this));
    
    canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    window.addEventListener('touchend', this.onTouchEnd.bind(this));

    // Listen to UI lobe selection events to rotate camera towards the selected lobe
    window.addEventListener('kalki-select-lobe', ((e: CustomEvent<{ lobe: AnatomicalLobe }>) => {
      this.focusLobe(e.detail.lobe);
    }) as EventListener);

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

  // Pointer Down for Orbit
  private onPointerDown(e: MouseEvent) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.velX = 0;
    this.velY = 0;
    this.targetRotX = null;
    this.targetRotY = null;
    this.audioDirector.playHoverTone(520);
  }

  // Pointer Move for Raycasting Hover & Drag
  private onPointerMove(e: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const isInsideCanvas = (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom
    );

    if (this.isDragging) {
      const dx = (e.clientX - this.startX) * 0.0075;
      const dy = (e.clientY - this.startY) * 0.0075;
      this.rotY += dx;
      this.rotX += dy;
      this.velY = dx;
      this.velX = dy;
      this.startX = e.clientX;
      this.startY = e.clientY;
    }

    // Precision Raycast on Brain Surface when pointer is over canvas
    if (isInsideCanvas && !this.isDragging) {
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.cameraDirector.camera);

      const targets = [
        this.brainEngine.leftHemisphereMesh,
        this.brainEngine.rightHemisphereMesh,
        this.brainEngine.cerebellumMesh,
        this.brainEngine.brainstemMesh,
      ].filter(Boolean);

      const intersects = this.raycaster.intersectObjects(targets, false);
      if (intersects.length > 0) {
        const hit = intersects[0];
        this.brainEngine.handleHover(hit.point, hit.face?.normal);
      } else {
        this.brainEngine.handleHover(undefined);
      }
    } else if (!isInsideCanvas && !this.isDragging) {
      this.brainEngine.handleHover(undefined);
    }
  }

  private onPointerUp() {
    this.isDragging = false;
  }

  // Zoom via wheel
  private onWheel(e: WheelEvent) {
    e.preventDefault();
    this.zoom -= e.deltaY * 0.0012;
    this.zoom = Math.max(0.65, Math.min(1.65, this.zoom));
  }

  // Double Click for Synaptic Surge
  private onDoubleClick(e: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.executeCinematicSurge();
  }

  // Touch Support
  private onTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const now = Date.now();
      if (now - this.lastTapTime < 340) {
        // Double tap!
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        this.executeCinematicSurge();
      } else {
        this.isDragging = true;
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.velX = 0;
        this.velY = 0;
      }
      this.lastTapTime = now;
    }
  }

  private onTouchMove(e: TouchEvent) {
    if (this.isDragging && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const dx = (touch.clientX - this.startX) * 0.008;
      const dy = (touch.clientY - this.startY) * 0.008;
      this.rotY += dx;
      this.rotX += dy;
      this.velY = dx;
      this.velX = dy;
      this.startX = touch.clientX;
      this.startY = touch.clientY;
    }
  }

  private onTouchEnd() {
    this.isDragging = false;
  }

  /**
   * Smoothly rotates the brain to showcase a selected lobe
   */
  public focusLobe(lobe: AnatomicalLobe) {
    if (lobe === 'frontal') {
      this.targetRotX = 0.15;
      this.targetRotY = 0.0;
    } else if (lobe === 'temporal') {
      this.targetRotX = 0.12;
      this.targetRotY = 1.57;
    } else if (lobe === 'parietal') {
      this.targetRotX = 0.55;
      this.targetRotY = 0.35;
    } else if (lobe === 'occipital') {
      this.targetRotX = 0.20;
      this.targetRotY = 3.14;
    } else if (lobe === 'cerebellum') {
      this.targetRotX = -0.45;
      this.targetRotY = 3.14;
    } else if (lobe === 'brainstem') {
      this.targetRotX = -0.35;
      this.targetRotY = 0.0;
    } else {
      this.targetRotX = 0.22;
      this.targetRotY = 0.45;
    }
    this.brainEngine.activateLobe(lobe);
  }

  public executeCinematicSurge() {
    this.raycaster.setFromCamera(this.mouse, this.cameraDirector.camera);
    const targets = [
      this.brainEngine.leftHemisphereMesh,
      this.brainEngine.rightHemisphereMesh,
      this.brainEngine.cerebellumMesh,
      this.brainEngine.brainstemMesh,
    ].filter(Boolean);

    const intersects = this.raycaster.intersectObjects(targets, false);
    const hitPoint = intersects.length > 0 ? intersects[0].point : new THREE.Vector3(0, 0.2, 0);

    this.brainEngine.triggerSynapticSurge(hitPoint, (stage, intensity) => {
      if (stage === 'ANTICIPATION') {
        this.particleDirector.setCinematicState('TENSION');
      } else if (stage === 'SILENCE') {
        this.particleDirector.setCinematicState('SILENCE');
      } else if (stage === 'IMPACT') {
        this.cameraDirector.triggerMicroShake(0.40);
        this.atmosphereDirector.triggerLightningFlash();
        this.particleDirector.triggerShockwave(hitPoint, '#00f0ff');
        this.particleDirector.setCinematicState('IMPACT');

        // Add temporary chromatic aberration screen shake via CSS class
        document.body.classList.add('cinematic-impact-shake');
        setTimeout(() => document.body.classList.remove('cinematic-impact-shake'), 450);
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

    // Smooth Orbit Inertia or Target Lerping
    if (this.targetRotX !== null && this.targetRotY !== null && !this.isDragging) {
      this.rotX += (this.targetRotX - this.rotX) * 0.08;
      this.rotY += (this.targetRotY - this.rotY) * 0.08;
      if (Math.abs(this.targetRotX - this.rotX) < 0.005 && Math.abs(this.targetRotY - this.rotY) < 0.005) {
        this.targetRotX = null;
        this.targetRotY = null;
      }
    } else if (!this.isDragging) {
      this.rotY += this.velY;
      this.rotX += this.velX;
      this.velX *= 0.93;
      this.velY *= 0.93;
      if (Math.abs(this.velX) < 0.0001) this.velX = 0;
      if (Math.abs(this.velY) < 0.0001) this.velY = 0;
      // Gentle auto-orbit when idle
      if (this.velX === 0 && this.velY === 0) {
        this.rotY += 0.0035;
      }
    }

    // Apply rotation and zoom to brain engine group
    this.brainEngine.group.rotation.x = this.rotX;
    this.brainEngine.group.rotation.y = this.rotY;
    const baseScale = 1.08 * this.zoom;
    this.brainEngine.group.scale.set(baseScale, baseScale, baseScale);

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
