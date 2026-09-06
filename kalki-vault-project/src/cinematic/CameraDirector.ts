import * as THREE from 'three';

export interface ShotKeyframe {
  progress: number;
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  roll: number;
}

export class CameraDirector {
  public camera: THREE.PerspectiveCamera;
  private currentPos = new THREE.Vector3(0, 0, 8.5);
  private currentTarget = new THREE.Vector3(0, 0, 0);
  private currentFov = 45;

  // Pointer parallax influence (damped spring)
  private mouseOffset = new THREE.Vector2(0, 0);
  private targetMouseOffset = new THREE.Vector2(0, 0);

  // Micro-shake on impact
  private shakeIntensity = 0;
  private shakeDecay = 0.92;

  // Cinematic Keyframe Timeline across scroll progression (0.0 to 1.0)
  private keyframes: ShotKeyframe[] = [
    // SHOT 01: Extreme wide shot (Opening)
    { progress: 0.0, position: new THREE.Vector3(0, 0.4, 7.8), target: new THREE.Vector3(0, 0, 0), fov: 45, roll: 0 },
    // SHOT 02: Slow camera drift & push
    { progress: 0.12, position: new THREE.Vector3(0.5, 0.2, 6.2), target: new THREE.Vector3(0, 0, 0), fov: 42, roll: 0.02 },
    // SHOT 03: Orbit around frontal lobe
    { progress: 0.28, position: new THREE.Vector3(1.8, 0.6, 4.4), target: new THREE.Vector3(0.2, 0.1, 0), fov: 38, roll: -0.03 },
    // SHOT 04: Move toward cortical surface (Threat radar section)
    { progress: 0.45, position: new THREE.Vector3(-1.2, 0.4, 3.2), target: new THREE.Vector3(-0.3, 0.1, 0), fov: 35, roll: 0.04 },
    // SHOT 05: Extreme close-up on gyri / sulci (Quantum Lab)
    { progress: 0.62, position: new THREE.Vector3(0.4, -0.2, 2.1), target: new THREE.Vector3(0.1, 0, 0), fov: 32, roll: -0.02 },
    // SHOT 06: Enter microscopic neural environment (Deep dive)
    { progress: 0.78, position: new THREE.Vector3(-0.2, 0.1, 1.4), target: new THREE.Vector3(0, 0, 0), fov: 28, roll: 0.05 },
    // SHOT 07: Massive camera pullback revealing full neural universe
    { progress: 1.0, position: new THREE.Vector3(0, 1.2, 8.5), target: new THREE.Vector3(0, 0, 0), fov: 48, roll: 0 },
  ];

  constructor(aspectRatio: number) {
    this.camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);
    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentTarget);

    window.addEventListener('mousemove', (e) => {
      this.targetMouseOffset.x = (e.clientX / window.innerWidth - 0.5) * 0.45;
      this.targetMouseOffset.y = -(e.clientY / window.innerHeight - 0.5) * 0.35;
    });
  }

  public updateAspect(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  public triggerMicroShake(intensity = 0.25) {
    this.shakeIntensity = intensity;
  }

  public update(delta: number, scrollProgress: number, time: number) {
    // 1. Damped spring pointer offset
    this.mouseOffset.x += (this.targetMouseOffset.x - this.mouseOffset.x) * 0.06;
    this.mouseOffset.y += (this.targetMouseOffset.y - this.mouseOffset.y) * 0.06;

    // 2. Interpolate along cinematic keyframe timeline
    let kA = this.keyframes[0];
    let kB = this.keyframes[this.keyframes.length - 1];

    for (let i = 0; i < this.keyframes.length - 1; i++) {
      if (scrollProgress >= this.keyframes[i].progress && scrollProgress <= this.keyframes[i + 1].progress) {
        kA = this.keyframes[i];
        kB = this.keyframes[i + 1];
        break;
      }
    }

    const span = Math.max(0.0001, kB.progress - kA.progress);
    const alpha = (scrollProgress - kA.progress) / span;
    // Smooth cinematic cubic easing
    const eased = alpha * alpha * (3 - 2 * alpha);

    const targetPos = new THREE.Vector3().lerpVectors(kA.position, kB.position, eased);
    const targetLook = new THREE.Vector3().lerpVectors(kA.target, kB.target, eased);
    const targetFov = THREE.MathUtils.lerp(kA.fov, kB.fov, eased);

    // Add subtle ambient breathing drift even when not scrolling
    const breathX = Math.sin(time * 0.8) * 0.08;
    const breathY = Math.cos(time * 0.6) * 0.06;

    // Add micro-shake
    let shakeX = 0, shakeY = 0;
    if (this.shakeIntensity > 0.005) {
      shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity *= this.shakeDecay;
    }

    // Smooth camera inertia
    this.currentPos.lerp(targetPos, 0.08);
    this.currentTarget.lerp(targetLook, 0.08);
    this.currentFov = THREE.MathUtils.lerp(this.currentFov, targetFov, 0.08);

    this.camera.position.set(
      this.currentPos.x + this.mouseOffset.x + breathX + shakeX,
      this.currentPos.y + this.mouseOffset.y + breathY + shakeY,
      this.currentPos.z
    );

    this.camera.lookAt(
      this.currentTarget.x + shakeX * 0.5,
      this.currentTarget.y + shakeY * 0.5,
      this.currentTarget.z
    );

    if (Math.abs(this.camera.fov - this.currentFov) > 0.1) {
      this.camera.fov = this.currentFov;
      this.camera.updateProjectionMatrix();
    }
  }
}
