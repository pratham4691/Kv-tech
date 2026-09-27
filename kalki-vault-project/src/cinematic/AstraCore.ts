import * as THREE from 'three';
import type { PerformanceDirector } from '../performance/PerformanceDirector';

/**
 * KALKI VAULT — The Astra Core & Sovereign Vault Engine
 * 
 * 4-Stage Continuous Scroll Odyssey:
 *  Stage 1 (0.00 - 0.22): The Astra Singularity & Gyroscopic Astrolabe (Hero)
 *  Stage 2 (0.22 - 0.48): Hyper-Lattice Fracture & Threat Deflection Shield (Threat Radar)
 *  Stage 3 (0.48 - 0.75): Bi-Hemispheric Neural Assembly & Quantum Lattice (Brain Architecture)
 *  Stage 4 (0.75 - 1.00): Sovereign Cryptographic Monolith & Infinite Horizon Grid (Deep Vault)
 */
export class AstraCore {
  public group = new THREE.Group();

  // STAGE 1: Singularity Core & Concentric Gyro Rings
  public coreMesh!: THREE.Mesh;
  public coronaMesh!: THREE.Mesh;
  public innerCoreMesh!: THREE.Mesh;
  private ringOuter!: THREE.Mesh;
  private ringMiddle!: THREE.Mesh;
  private ringInner!: THREE.Mesh;
  private ringRunicParticles!: THREE.Points;

  // STAGE 2: Icosahedral Threat Deflection Shield & Threat Shards
  private shieldMesh!: THREE.Mesh;
  private shieldMat!: THREE.ShaderMaterial;
  private threatShards!: THREE.Points;
  private threatGeo!: THREE.BufferGeometry;
  private threatPositions!: Float32Array;
  private threatVelocities!: Float32Array;

  // STAGE 4: Infinite Horizon Grid & Cryptographic Vault Tumblers
  private horizonGrid!: THREE.GridHelper;
  private vaultPortalGroup = new THREE.Group();
  private tumblerRings: THREE.Mesh[] = [];

  // Interactive Gyro & Inertia
  private targetGyro = new THREE.Vector2(0, 0);
  private currentGyro = new THREE.Vector2(0, 0);

  private disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  constructor(scene: THREE.Scene, private perf: PerformanceDirector) {
    this.createSingularityCore();
    this.createGyroAstrolabe();
    this.createDeflectionShield();
    this.createThreatStream();
    this.createSovereignVaultHorizon();

    scene.add(this.group);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // STAGE 1: THE ASTRA SINGULARITY & GYRO ASTROLABE
  // ══════════════════════════════════════════════════════════════════════════

  private createSingularityCore() {
    const isHigh = this.perf.profile.tier === 'HIGH';

    // 1. Inner dense singularity nucleus (Mint/Cyan)
    const nucleusGeo = new THREE.SphereGeometry(0.72, isHigh ? 36 : 24, isHigh ? 36 : 24);
    const nucleusMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#00f5a0') }, // Mint
        uColorB: { value: new THREE.Color('#00f0ff') }, // Vault Cyan
        uPulse: { value: 1.0 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform float uPulse;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          // Harmonic fractal breathing
          float breath = sin(uTime * 2.2) * 0.08 + cos(uTime * 4.4 + position.y * 3.0) * 0.03;
          vec3 newPos = position * (1.0 + breath * uPulse);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uTime;

        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);
          float wave = 0.5 + 0.5 * sin(vPosition.y * 8.0 + uTime * 3.0);
          vec3 color = mix(uColorA, uColorB, wave);
          float alpha = clamp(0.3 + 0.7 * fresnel, 0.0, 0.95);
          gl_FragColor = vec4(color * (1.2 + fresnel * 0.8), alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.innerCoreMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    this.group.add(this.innerCoreMesh);

    // 2. Outer Corona Shell (Electric Violet)
    const coronaGeo = new THREE.SphereGeometry(1.08, isHigh ? 32 : 20, isHigh ? 32 : 20);
    const coronaMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#9d4edd') }, // Electric Violet
        uColorB: { value: new THREE.Color('#38bdf8') }, // Sky Blue
        uOpacity: { value: 0.65 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        uniform float uTime;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          // Ethereal organic displacement
          float disp = sin(uTime * 1.6 + position.x * 2.0) * 0.07;
          vec3 newPos = position + normal * disp;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vNormal;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uOpacity;
        uniform float uTime;

        void main() {
          float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          vec3 color = mix(uColorA, uColorB, rim);
          gl_FragColor = vec4(color, rim * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    });
    this.coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    this.group.add(this.coronaMesh);

    this.disposables.push(nucleusGeo, nucleusMat, coronaGeo, coronaMat);
  }

  private createGyroAstrolabe() {
    const isHigh = this.perf.profile.tier === 'HIGH';
    const segments = isHigh ? 64 : 36;

    const ringMatParams = {
      color: new THREE.Color('#00f0ff'),
      emissive: new THREE.Color('#00f0ff'),
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
      metalness: 0.9,
    };

    // Outer Ring (Radius ~2.4)
    const geoOuter = new THREE.TorusGeometry(2.35, 0.024, 8, segments);
    const matOuter = new THREE.MeshStandardMaterial({
      ...ringMatParams,
      color: new THREE.Color('#00f0ff'),
      emissive: new THREE.Color('#00f0ff'),
    });
    this.ringOuter = new THREE.Mesh(geoOuter, matOuter);
    this.group.add(this.ringOuter);

    // Middle Ring (Radius ~1.85, tilted)
    const geoMiddle = new THREE.TorusGeometry(1.85, 0.020, 8, segments);
    const matMiddle = new THREE.MeshStandardMaterial({
      ...ringMatParams,
      color: new THREE.Color('#9d4edd'),
      emissive: new THREE.Color('#9d4edd'),
    });
    this.ringMiddle = new THREE.Mesh(geoMiddle, matMiddle);
    this.ringMiddle.rotation.x = Math.PI / 4;
    this.group.add(this.ringMiddle);

    // Inner Ring (Radius ~1.42, tilted)
    const geoInner = new THREE.TorusGeometry(1.42, 0.016, 8, segments);
    const matInner = new THREE.MeshStandardMaterial({
      ...ringMatParams,
      color: new THREE.Color('#00f5a0'),
      emissive: new THREE.Color('#00f5a0'),
    });
    this.ringInner = new THREE.Mesh(geoInner, matInner);
    this.ringInner.rotation.y = -Math.PI / 3;
    this.group.add(this.ringInner);

    // Runic Cryptographic Tick Sparks around Outer Ring
    const runicCount = 48;
    const runicPos = new Float32Array(runicCount * 3);
    for (let i = 0; i < runicCount; i++) {
      const angle = (i / runicCount) * Math.PI * 2;
      const r = 2.35;
      runicPos[i * 3 + 0] = Math.cos(angle) * r;
      runicPos[i * 3 + 1] = Math.sin(angle) * r;
      runicPos[i * 3 + 2] = 0;
    }
    const runicGeo = new THREE.BufferGeometry();
    runicGeo.setAttribute('position', new THREE.BufferAttribute(runicPos, 3));
    const runicMat = new THREE.PointsMaterial({
      color: new THREE.Color('#ffffff'),
      size: 0.06,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    this.ringRunicParticles = new THREE.Points(runicGeo, runicMat);
    this.ringOuter.add(this.ringRunicParticles);

    this.disposables.push(geoOuter, matOuter, geoMiddle, matMiddle, geoInner, matInner, runicGeo, runicMat);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // STAGE 2: DEFLECTION SHIELD & THREAT STREAM
  // ══════════════════════════════════════════════════════════════════════════

  private createDeflectionShield() {
    const shieldGeo = new THREE.IcosahedronGeometry(2.1, 1);
    this.shieldMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uActivation: { value: 0 }, // 0..1 based on scroll
        uColor: { value: new THREE.Color('#00f0ff') },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float uTime;
        uniform float uActivation;
        uniform vec3 uColor;

        void main() {
          if (uActivation <= 0.01) discard;

          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
          float grid = sin(vPos.x * 20.0) * sin(vPos.y * 20.0) * sin(vPos.z * 20.0);
          float hexPulse = step(0.65, abs(grid));
          
          vec3 col = uColor * (1.0 + fresnel * 2.0);
          float alpha = (fresnel * 0.7 + hexPulse * 0.3) * uActivation;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      wireframe: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.shieldMesh = new THREE.Mesh(shieldGeo, this.shieldMat);
    this.shieldMesh.scale.setScalar(0.001); // starts collapsed
    this.group.add(this.shieldMesh);

    this.disposables.push(shieldGeo, this.shieldMat);
  }

  private createThreatStream() {
    const count = 180;
    this.threatGeo = new THREE.BufferGeometry();
    this.threatPositions = new Float32Array(count * 3);
    this.threatVelocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      this.resetThreatShard(i, true);
    }

    this.threatGeo.setAttribute('position', new THREE.BufferAttribute(this.threatPositions, 3));

    const threatMat = new THREE.PointsMaterial({
      color: new THREE.Color('#ff0055'),
      size: 0.12,
      transparent: true,
      opacity: 0.0, // starts invisible until Stage 2
      blending: THREE.AdditiveBlending,
    });

    this.threatShards = new THREE.Points(this.threatGeo, threatMat);
    this.group.add(this.threatShards);

    this.disposables.push(this.threatGeo, threatMat);
  }

  private resetThreatShard(idx: number, randomZ = false) {
    const radius = 2.0 + Math.random() * 4.5;
    const angle = Math.random() * Math.PI * 2;
    this.threatPositions[idx * 3 + 0] = Math.cos(angle) * radius;
    this.threatPositions[idx * 3 + 1] = Math.sin(angle) * radius;
    this.threatPositions[idx * 3 + 2] = randomZ ? (Math.random() * 25 - 10) : 15 + Math.random() * 10;
    this.threatVelocities[idx] = 18.0 + Math.random() * 12.0;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // STAGE 4: SOVEREIGN HORIZON GRID & VAULT TUMBLERS
  // ══════════════════════════════════════════════════════════════════════════

  private createSovereignVaultHorizon() {
    // 1. Infinite Horizon Grid Floor
    this.horizonGrid = new THREE.GridHelper(80, 40, 0x00f0ff, 0x003355);
    this.horizonGrid.position.y = -3.2;
    this.horizonGrid.position.z = -10;
    const gridMat = this.horizonGrid.material as THREE.LineBasicMaterial;
    gridMat.transparent = true;
    gridMat.opacity = 0; // revealed in Stage 4
    this.group.add(this.horizonGrid);

    // 2. Monolithic Cryptographic Vault Tumblers (Colossal Portal)
    const tumblerCount = 3;
    const tumblerRadii = [4.2, 5.4, 6.8];
    const tumblerColors = ['#00f0ff', '#10b981', '#38bdf8'];

    tumblerRadii.forEach((r, idx) => {
      const tGeo = new THREE.TorusGeometry(r, 0.035, 8, 48);
      const tMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(tumblerColors[idx]),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const tMesh = new THREE.Mesh(tGeo, tMat);
      tMesh.position.z = -8 - idx * 2;
      this.tumblerRings.push(tMesh);
      this.vaultPortalGroup.add(tMesh);
      this.disposables.push(tGeo, tMat);
    });

    this.group.add(this.vaultPortalGroup);
    this.disposables.push(this.horizonGrid.geometry, gridMat);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // INTERACTIVE GYRO & POINTER INERTIA
  // ══════════════════════════════════════════════════════════════════════════

  public setPointerOffset(x: number, y: number) {
    this.targetGyro.x = x * 0.65;
    this.targetGyro.y = y * 0.55;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ANIMATION UPDATE & STAGE CHOREOGRAPHY
  // ══════════════════════════════════════════════════════════════════════════

  public update(delta: number, time: number, scrollProgress: number, brainGroup: THREE.Group) {
    // 1. Damped Spring Gyro Tracking
    this.currentGyro.x += (this.targetGyro.x - this.currentGyro.x) * 0.08;
    this.currentGyro.y += (this.targetGyro.y - this.currentGyro.y) * 0.08;

    // 2. Astrolabe Rings Counter-Rotation + Gyro Tilt
    if (this.ringOuter) {
      this.ringOuter.rotation.z = time * 0.25;
      this.ringOuter.rotation.x = this.currentGyro.y * 0.8;
      this.ringOuter.rotation.y = this.currentGyro.x * 0.8;
    }
    if (this.ringMiddle) {
      this.ringMiddle.rotation.y = time * -0.35;
      this.ringMiddle.rotation.z = Math.PI / 4 + this.currentGyro.x * 0.5;
    }
    if (this.ringInner) {
      this.ringInner.rotation.x = time * 0.45;
      this.ringInner.rotation.z = -Math.PI / 3 + this.currentGyro.y * 0.5;
    }

    // 3. Singularity Shaders Time Update
    if (this.innerCoreMesh) {
      const mat = this.innerCoreMesh.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = time;
    }
    if (this.coronaMesh) {
      const mat = this.coronaMesh.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = time;
    }

    // 4. STAGE-SPECIFIC MORPHING CHOREOGRAPHY

    // [ STAGE 1: HERO (0.00 – 0.22) ]
    if (scrollProgress < 0.22) {
      const t = scrollProgress / 0.22; // 0..1 within Stage 1
      
      // Core is prominent and breathing
      const coreScale = 1.0 - t * 0.35;
      this.innerCoreMesh.scale.setScalar(coreScale);
      this.coronaMesh.scale.setScalar(coreScale);
      this.ringOuter.scale.setScalar(1.0 + t * 0.3);
      this.ringMiddle.scale.setScalar(1.0 + t * 0.3);
      this.ringInner.scale.setScalar(1.0 + t * 0.3);

      // Brain is compact/nested inside the core
      const brainScale = 0.25 + t * 0.45;
      brainGroup.scale.setScalar(brainScale);
      brainGroup.position.set(0, 0, 0);

      // Threat stream & shield inactive
      this.shieldMesh.scale.setScalar(0.001);
      this.shieldMat.uniforms.uActivation.value = 0;
      (this.threatShards.material as THREE.PointsMaterial).opacity = 0;

      // Horizon grid invisible
      (this.horizonGrid.material as THREE.LineBasicMaterial).opacity = 0;
      this.tumblerRings.forEach(r => (r.material as THREE.MeshBasicMaterial).opacity = 0);
    }

    // [ STAGE 2: THREAT DEFLECTION & WARP TUNNEL (0.22 – 0.48) ]
    else if (scrollProgress >= 0.22 && scrollProgress < 0.48) {
      const t = (scrollProgress - 0.22) / 0.26; // 0..1 within Stage 2

      // Core expands into defense barrier
      this.innerCoreMesh.scale.setScalar(0.65 - t * 0.25);
      this.coronaMesh.scale.setScalar(0.65 - t * 0.25);

      // Rings expand into defensive field
      const ringExp = 1.3 + t * 1.2;
      this.ringOuter.scale.setScalar(ringExp);
      this.ringMiddle.scale.setScalar(ringExp * 0.9);
      this.ringInner.scale.setScalar(ringExp * 0.8);

      // Activate Icosahedral Shield
      const shieldScale = 1.0 + Math.sin(time * 3.0) * 0.05 + t * 0.3;
      this.shieldMesh.scale.setScalar(shieldScale);
      this.shieldMat.uniforms.uActivation.value = Math.sin(t * Math.PI) * 0.95;
      this.shieldMat.uniforms.uTime.value = time;
      this.shieldMesh.rotation.y = time * 0.4;
      this.shieldMesh.rotation.x = time * 0.2;

      // Threat shards active: fast relativistic stream deflected by shield
      const threatMat = this.threatShards.material as THREE.PointsMaterial;
      threatMat.opacity = Math.sin(t * Math.PI) * 0.9;

      const count = this.threatPositions.length / 3;
      for (let i = 0; i < count; i++) {
        this.threatPositions[i * 3 + 2] -= this.threatVelocities[i] * delta * 2.2;
        // Deflect when passing shield z
        if (Math.abs(this.threatPositions[i * 3 + 2]) < 2.5) {
          this.threatPositions[i * 3 + 0] *= 1.05;
          this.threatPositions[i * 3 + 1] *= 1.05;
        }
        if (this.threatPositions[i * 3 + 2] < -15) {
          this.resetThreatShard(i, false);
        }
      }
      this.threatGeo.attributes.position.needsUpdate = true;

      // Brain scales towards full
      brainGroup.scale.setScalar(0.70 + t * 0.3);
      (this.horizonGrid.material as THREE.LineBasicMaterial).opacity = 0;
      this.tumblerRings.forEach(r => (r.material as THREE.MeshBasicMaterial).opacity = 0);
    }

    // [ STAGE 3: BI-HEMISPHERIC NEURAL MONOLITH (0.48 – 0.75) ]
    else if (scrollProgress >= 0.48 && scrollProgress < 0.75) {
      const t = (scrollProgress - 0.48) / 0.27; // 0..1 within Stage 3

      // Astra core rests as a glowing orbital aura
      this.innerCoreMesh.scale.setScalar(0.4);
      this.coronaMesh.scale.setScalar(0.45);
      this.ringOuter.scale.setScalar(2.2);
      this.ringMiddle.scale.setScalar(1.9);
      this.ringInner.scale.setScalar(1.6);

      // Shield fades out
      this.shieldMesh.scale.setScalar(0.001);
      this.shieldMat.uniforms.uActivation.value = 0;
      (this.threatShards.material as THREE.PointsMaterial).opacity = 0;

      // Brain is at full scale and center focus
      brainGroup.scale.setScalar(1.0);

      // Horizon grid starts emerging softly
      const gridMat = this.horizonGrid.material as THREE.LineBasicMaterial;
      gridMat.opacity = t * 0.35;
      this.tumblerRings.forEach(r => (r.material as THREE.MeshBasicMaterial).opacity = 0);
    }

    // [ STAGE 4: SOVEREIGN VAULT & HORIZON GRID (0.75 – 1.00) ]
    else {
      const t = (scrollProgress - 0.75) / 0.25; // 0..1 within Stage 4

      // Brain elevates slightly
      brainGroup.scale.setScalar(0.95);
      brainGroup.position.y = t * 0.4;

      // Core softly settles behind brain
      this.innerCoreMesh.scale.setScalar(0.35);
      this.coronaMesh.scale.setScalar(0.4);

      // Horizon grid fully illuminates
      const gridMat = this.horizonGrid.material as THREE.LineBasicMaterial;
      gridMat.opacity = 0.35 + t * 0.45;
      this.horizonGrid.position.z = -10 + (time * 1.5) % 2.0; // Infinite forward glide

      // Vault Portal Tumblers rotate in counter-phase
      this.tumblerRings.forEach((r, idx) => {
        const mat = r.material as THREE.MeshBasicMaterial;
        mat.opacity = t * 0.85;
        r.rotation.z = time * (idx % 2 === 0 ? 0.15 : -0.2);
      });
    }
  }

  public triggerShockPulse() {
    // Instant energy burst across Astra rings and singularity
    if (this.innerCoreMesh) {
      const mat = this.innerCoreMesh.material as THREE.ShaderMaterial;
      mat.uniforms.uPulse.value = 2.8;
      const decay = () => {
        if (mat.uniforms.uPulse.value > 1.0) {
          mat.uniforms.uPulse.value -= 0.12;
          requestAnimationFrame(decay);
        } else {
          mat.uniforms.uPulse.value = 1.0;
        }
      };
      decay();
    }
  }

  public dispose() {
    this.disposables.forEach(d => d.dispose());
  }
}
