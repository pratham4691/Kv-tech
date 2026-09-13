import * as THREE from 'three';
import { PerformanceDirector } from '../performance/PerformanceDirector';

export type CinematicParticleState = 'CALM' | 'TENSION' | 'ACCELERATION' | 'IMPACT' | 'SILENCE' | 'REVEAL';

function createSoftParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.35, 'rgba(0, 240, 255, 0.7)');
  grad.addColorStop(0.7, 'rgba(0, 180, 255, 0.18)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

export class ParticleDirector {
  public group: THREE.Group;

  // System 1: Cosmic Dust & Distant Nebula Stars
  private cosmicPoints!: THREE.Points;
  private cosmicGeo!: THREE.BufferGeometry;

  // System 2: Floating Atmospheric Neural Sparks
  private neuralSparks!: THREE.Points;
  private neuralSparksGeo!: THREE.BufferGeometry;

  // System 3: Directional Velocity Streamers
  private streamerLines!: THREE.LineSegments;
  private streamerGeo!: THREE.BufferGeometry;

  // System 4: Expanding Multi-Layer Shockwave Ring
  private shockwaveMesh!: THREE.Mesh;
  private shockwaveMat!: THREE.ShaderMaterial;
  private shockwaveActive = false;
  private shockwaveRadius = 0;

  // Shared texture
  private particleTexture: THREE.Texture;

  // Dynamic state
  public state: CinematicParticleState = 'CALM';
  private stateSpeedMultiplier = 1.0;

  constructor(
    private scene: THREE.Scene,
    private perf: PerformanceDirector
  ) {
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.particleTexture = createSoftParticleTexture();

    this.createCosmicField();
    this.createNeuralSparks();
    this.createStreamers();
    this.createShockwaveRing();
  }

  private createCosmicField() {
    const count = Math.floor(1400 * this.perf.profile.particleScale);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color('#00f0ff');
    const c2 = new THREE.Color('#a855f7');
    const c3 = new THREE.Color('#38bdf8');

    for (let i = 0; i < count; i++) {
      // Wide cylindrical shell around scene
      const rad = 5 + Math.random() * 20;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 24;

      positions[i * 3 + 0] = Math.cos(angle) * rad;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * rad - 4;

      const pick = Math.random();
      const col = pick < 0.4 ? c1 : (pick < 0.7 ? c2 : c3);
      colors[i * 3 + 0] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    this.cosmicGeo = new THREE.BufferGeometry();
    this.cosmicGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.cosmicGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.07,
      map: this.particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.cosmicPoints = new THREE.Points(this.cosmicGeo, mat);
    this.group.add(this.cosmicPoints);
  }

  private createNeuralSparks() {
    const count = Math.floor(350 * this.perf.profile.particleScale);
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 5.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      // Keep strictly behind and surrounding the brain, never directly into camera lens
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.2 - 0.8;

      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.012;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.012;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.012;
    }

    this.neuralSparksGeo = new THREE.BufferGeometry();
    this.neuralSparksGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.neuralSparksGeo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      map: this.particleTexture,
      size: 0.05,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.neuralSparks = new THREE.Points(this.neuralSparksGeo, mat);
    this.group.add(this.neuralSparks);
  }

  private createStreamers() {
    const count = 50;
    const positions = new Float32Array(count * 6);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 8;
      const z = -2 - Math.random() * 8;

      positions[i * 6 + 0] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z + 0.8;
    }

    this.streamerGeo = new THREE.BufferGeometry();
    this.streamerGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.0, // Only visible during ACCELERATION
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.streamerLines = new THREE.LineSegments(this.streamerGeo, mat);
    this.group.add(this.streamerLines);
  }

  private createShockwaveRing() {
    const ringGeo = new THREE.RingGeometry(0.1, 0.28, 48);
    this.shockwaveMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color('#00f0ff') },
        uOpacity: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          float dist = distance(vUv, vec2(0.5));
          float alpha = smoothstep(0.5, 0.45, dist) * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.shockwaveMesh = new THREE.Mesh(ringGeo, this.shockwaveMat);
    this.shockwaveMesh.visible = false;
    this.group.add(this.shockwaveMesh);
  }

  public setCinematicState(state: CinematicParticleState) {
    this.state = state;
    if (state === 'CALM') this.stateSpeedMultiplier = 1.0;
    else if (state === 'TENSION') this.stateSpeedMultiplier = 2.0;
    else if (state === 'ACCELERATION') this.stateSpeedMultiplier = 5.0;
    else if (state === 'IMPACT') this.stateSpeedMultiplier = 10.0;
    else if (state === 'SILENCE') this.stateSpeedMultiplier = 0.08;
    else if (state === 'REVEAL') this.stateSpeedMultiplier = 0.6;

    // Streamers visibility
    const streamerMat = this.streamerLines.material as THREE.LineBasicMaterial;
    if (state === 'ACCELERATION') {
      streamerMat.opacity = 0.6;
    } else {
      streamerMat.opacity = 0.0;
    }
  }

  public triggerShockwave(center: THREE.Vector3, color = '#00f0ff') {
    this.shockwaveActive = true;
    this.shockwaveRadius = 0.2;
    this.shockwaveMesh.position.copy(center);
    this.shockwaveMesh.visible = true;
    this.shockwaveMat.uniforms.uColor.value.set(color);
    this.shockwaveMat.uniforms.uOpacity.value = 1.0;

    // Trigger radial explosion on nearby neural sparks
    const sparkPositions = this.neuralSparksGeo.attributes.position.array as Float32Array;
    const sparkVelocities = this.neuralSparksGeo.attributes.velocity.array as Float32Array;
    const count = sparkPositions.length / 3;

    for (let i = 0; i < count; i++) {
      const dx = sparkPositions[i * 3 + 0] - center.x;
      const dy = sparkPositions[i * 3 + 1] - center.y;
      const dz = sparkPositions[i * 3 + 2] - center.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;

      if (dist < 3.5) {
        sparkVelocities[i * 3 + 0] += (dx / dist) * 0.16;
        sparkVelocities[i * 3 + 1] += (dy / dist) * 0.16;
        sparkVelocities[i * 3 + 2] += (dz / dist) * 0.16;
      }
    }
  }

  public update(delta: number, time: number) {
    // 1. Slow cosmic rotation
    this.cosmicPoints.rotation.y = time * 0.012 * this.stateSpeedMultiplier;

    // 2. Neural sparks motion with inertia & damping
    const sparkPositions = this.neuralSparksGeo.attributes.position.array as Float32Array;
    const sparkVelocities = this.neuralSparksGeo.attributes.velocity.array as Float32Array;
    const count = sparkPositions.length / 3;

    for (let i = 0; i < count; i++) {
      sparkPositions[i * 3 + 0] += sparkVelocities[i * 3 + 0] * this.stateSpeedMultiplier;
      sparkPositions[i * 3 + 1] += sparkVelocities[i * 3 + 1] * this.stateSpeedMultiplier;
      sparkPositions[i * 3 + 2] += sparkVelocities[i * 3 + 2] * this.stateSpeedMultiplier;

      // Damp velocities back to ambient drift
      sparkVelocities[i * 3 + 0] *= 0.96;
      sparkVelocities[i * 3 + 1] *= 0.96;
      sparkVelocities[i * 3 + 2] *= 0.96;

      // Boundary loop
      if (Math.abs(sparkPositions[i * 3 + 0]) > 3.8) sparkPositions[i * 3 + 0] *= -0.85;
      if (Math.abs(sparkPositions[i * 3 + 1]) > 3.2) sparkPositions[i * 3 + 1] *= -0.85;
      if (sparkPositions[i * 3 + 2] > 1.2) sparkPositions[i * 3 + 2] = -2.8;
      if (sparkPositions[i * 3 + 2] < -3.5) sparkPositions[i * 3 + 2] = 0.5;
    }
    this.neuralSparksGeo.attributes.position.needsUpdate = true;

    // 3. Shockwave expansion
    if (this.shockwaveActive) {
      this.shockwaveRadius += delta * 6.5;
      const scale = this.shockwaveRadius;
      this.shockwaveMesh.scale.set(scale, scale, scale);

      const op = Math.max(0, 1.0 - (this.shockwaveRadius / 5.0));
      this.shockwaveMat.uniforms.uOpacity.value = op;

      if (op <= 0) {
        this.shockwaveActive = false;
        this.shockwaveMesh.visible = false;
      }
    }
  }

  public dispose() {
    this.particleTexture.dispose();
    this.cosmicGeo.dispose();
    (this.cosmicPoints.material as THREE.Material).dispose();
    this.neuralSparksGeo.dispose();
    (this.neuralSparks.material as THREE.Material).dispose();
    this.streamerGeo.dispose();
    (this.streamerLines.material as THREE.Material).dispose();
    this.shockwaveMesh.geometry.dispose();
    this.shockwaveMat.dispose();
  }
}
