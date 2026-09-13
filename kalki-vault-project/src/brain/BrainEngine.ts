import * as THREE from 'three';
import { AudioDirector } from '../audio/AudioDirector';
import { PerformanceDirector } from '../performance/PerformanceDirector';

export type AnatomicalLobe = 'all' | 'frontal' | 'parietal' | 'temporal' | 'occipital' | 'cerebellum' | 'brainstem';

export interface BrainNode {
  position: THREE.Vector3;
  originalPos: THREE.Vector3;
  lobe: AnatomicalLobe;
  isLeft: boolean;
  activation: number;
  residualMemory: number;
  pulsePhase: number;
  depth: number;
}

export interface ConnectomeFascicle {
  curve: THREE.CatmullRomCurve3;
  points: THREE.Vector3[];
  lobe: AnatomicalLobe;
  color: THREE.Color;
}

export interface ActionPotential {
  fascicleIdx: number;
  progress: number;
  speed: number;
  color: THREE.Color;
  size: number;
}

/** Soft radial gradient sprite — no white blowout */
function createSoftPulseTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0,   'rgba(200, 240, 255, 0.95)');
  grad.addColorStop(0.3, 'rgba(0, 200, 255, 0.60)');
  grad.addColorStop(0.65,'rgba(0, 120, 220, 0.15)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

/** Clamp an RGB value to [0, max] — prevents white blowout */
function clampColor(c: THREE.Color, max = 0.95): THREE.Color {
  c.r = Math.min(max, Math.max(0, c.r));
  c.g = Math.min(max, Math.max(0, c.g));
  c.b = Math.min(max, Math.max(0, c.b));
  return c;
}

export class BrainEngine {
  public group: THREE.Group;
  public nodes: BrainNode[] = [];

  // Three.js Render Objects
  public leftHemisphereMesh!: THREE.Mesh;
  public rightHemisphereMesh!: THREE.Mesh;
  public cerebellumMesh!: THREE.Mesh;
  public brainstemMesh!: THREE.Mesh;

  private leftWireMesh!: THREE.Mesh;
  private rightWireMesh!: THREE.Mesh;
  private cerebellumWireMesh!: THREE.Mesh;
  private brainstemWireMesh!: THREE.Mesh;

  private haloMesh!: THREE.Mesh;
  private contactReticleGroup!: THREE.Group;
  private contactRingMesh!: THREE.Mesh;
  private contactArcLines!: THREE.LineSegments;

  private instancedNodes!: THREE.InstancedMesh;
  private connectomeLines!: THREE.LineSegments;
  private connectomeGeometry!: THREE.BufferGeometry;

  private pulsePoints!: THREE.Points;
  private pulseGeometry!: THREE.BufferGeometry;
  private fascicles: ConnectomeFascicle[] = [];
  private actionPotentials: ActionPotential[] = [];

  private dummy = new THREE.Object3D();
  private colorHelper = new THREE.Color();
  private pulseTexture!: THREE.Texture;

  // Active / Hovered Lobe tracking
  public activeLobe: AnatomicalLobe = 'all';
  public hoveredLobe: AnatomicalLobe | null = null;

  // Interaction & Synaptic Surges
  private isSurging = false;
  private surgeIntensity = 0;
  private surgeCallback?: (stage: string, intensity: number) => void;

  // Sovereign Cyber-Biological Lobe Palette
  public readonly LOBE_PALETTES: Record<AnatomicalLobe, THREE.Color> = {
    all:         new THREE.Color(0.0, 0.88, 0.97),   // Cyan
    frontal:     new THREE.Color(0.0, 0.88, 0.97),   // Cyan  — AI Core
    parietal:    new THREE.Color(0.22, 0.73, 0.95),  // Sky Blue — Telemetry
    temporal:    new THREE.Color(0.65, 0.33, 0.95),  // Violet — Threat Vault
    occipital:   new THREE.Color(0.95, 0.62, 0.04),  // Amber — SOC Radar
    cerebellum:  new THREE.Color(0.97, 0.0,  0.33),  // Crimson — Kill Switch
    brainstem:   new THREE.Color(0.06, 0.69, 0.50),  // Emerald — Root of Trust
  };

  constructor(
    private scene: THREE.Scene,
    private audio: AudioDirector,
    private perf: PerformanceDirector
  ) {
    this.group = new THREE.Group();
    this.group.position.set(0, 0.06, 0);
    this.scene.add(this.group);
    this.pulseTexture = createSoftPulseTexture();

    this.buildCorticalSurfaces();
    this.buildConnectomeFibers();
    this.buildInstancedNodes();
    this.buildContactReticle();
    this.buildAtmosphericHalo();
    this.setupVolumetricLights();
  }

  /**
   * Dramatic volumetric scene lighting tailored to highlight biological gyri,
   * sulcal valleys, and translucent cybernetic neural tissue.
   */
  private setupVolumetricLights() {
    // Ambient bioluminescent deep-ocean base
    const amb = new THREE.AmbientLight(0x041022, 3.0);
    this.group.add(amb);

    // Primary key: brilliant cyan top-front directional light
    const key = new THREE.DirectionalLight(0x00d4ff, 4.2);
    key.position.set(2.5, 4.0, 3.5);
    this.group.add(key);

    // Lateral fill: warm amber accent sculpting right hemisphere gyri
    const fill = new THREE.DirectionalLight(0xf59e0b, 2.0);
    fill.position.set(3.5, -0.5, 1.5);
    this.group.add(fill);

    // Posterior rim: violet edge light defining occipital & parietal silhouette
    const rim = new THREE.DirectionalLight(0xa855f7, 3.6);
    rim.position.set(-2.8, 1.5, -3.8);
    this.group.add(rim);

    // Under-light: emerald glow from brainstem base
    const under = new THREE.PointLight(0x10b981, 4.5, 6.0);
    under.position.set(0, -1.2, -0.2);
    this.group.add(under);
  }

  /**
   * Sculpts complete, watertight, volumetric 3D cerebral hemispheres with authentic
   * multi-frequency gyri and sulci convolutions.
   */
  private buildCorticalSurfaces() {
    const createAnatomicalHemisphereGeo = (isLeft: boolean) => {
      const uSegs = 84;
      const vSegs = 84;
      const positions: number[] = [];
      const normals: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];

      const side = isLeft ? -1 : 1;

      // Base anatomical semi-axes (proportions of real human cerebrum)
      const rx = 0.94;  // lateral semi-axis
      const ry = 0.86;  // vertical semi-axis
      const rz = 1.30;  // anterior-posterior semi-axis

      for (let j = 0; j <= vSegs; j++) {
        const vn = j / vSegs;
        const theta = vn * Math.PI; // 0 (top crown) to π (inferior base)
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);

        for (let i = 0; i <= uSegs; i++) {
          const un = i / uSegs;
          const phi = un * Math.PI * 2.0; // 0 to 2π full circle around Y
          const sinP = Math.sin(phi);
          const cosP = Math.cos(phi);

          // Unit sphere coordinate
          const px = sinT * cosP;
          const py = cosT;
          const pz = sinT * sinP;

          // ── HEMISPHERE LATERAL/MEDIAL ASYMMETRY ────────────────────────────
          // When px <= 0: lateral rounded dome.
          // When px > 0: flat medial face bordering the sagittal longitudinal fissure.
          const xLat = side * (0.048 + Math.abs(px) * rx);
          const xMed = side * (0.048 + px * 0.075);
          
          // Smooth, seamless blend between medial wall and lateral cortex
          const blend = 0.5 + 0.5 * Math.tanh(px * 7.5);
          let bx = xLat * (1.0 - blend) + xMed * blend;
          let by = py * ry;
          let bz = pz * rz;

          const zNorm = bz / rz; // -1 (occipital) to +1 (frontal)

          // ── FRONTAL LOBE SCULPTING (zNorm > 0.35) ──────────────────────────
          if (zNorm > 0.35) {
            const fSpan = (zNorm - 0.35) / 0.65;
            const fTaper = 1.0 - fSpan * 0.24;
            bx *= fTaper;
            // Orbital surface curves upward to make space for facial cavity
            if (by < 0.10) {
              by *= (1.0 - fSpan * 0.36);
            }
            if (zNorm > 0.70) {
              bx *= (1.0 - (zNorm - 0.70) * 0.16);
            }
          }

          // ── OCCIPITAL LOBE SCULPTING (zNorm < -0.30) ───────────────────────
          if (zNorm < -0.30) {
            const oSpan = (-zNorm - 0.30) / 0.70;
            const oTaper = 1.0 - oSpan * 0.20;
            bx *= oTaper;
            // Occipital pole slopes upward, forming the cerebellar notch
            if (by < 0.18) {
              by += oSpan * 0.22 * (1.0 - Math.abs(px) * 0.35);
            }
          }

          // ── TEMPORAL LOBE INFERIOR LATERAL BULGE ──────────────────────────
          // Characteristic downward and lateral flare below the lateral fissure
          const isTemporal = px < -0.18 && by < 0.14 && zNorm > -0.42 && zNorm < 0.44;
          if (isTemporal) {
            const tFactor = Math.sin((zNorm + 0.42) / 0.86 * Math.PI) * Math.abs(px);
            by -= tFactor * 0.15;
            bx += side * tFactor * 0.14;
          }

          // ── SYLVIAN / LATERAL FISSURE INDENTATION ─────────────────────────
          if (px < -0.22 && zNorm > -0.36 && zNorm < 0.50) {
            const sylvY = -0.04 + zNorm * 0.16;
            const distSylv = Math.abs(by - sylvY);
            if (distSylv < 0.13) {
              const depth = (1.0 - distSylv / 0.13) * 0.082 * Math.abs(px);
              bx -= side * depth;
              by += (by > sylvY ? 0.015 : -0.015) * depth;
            }
          }

          // ── CENTRAL SULCUS GROOVE ─────────────────────────────────────────
          if (px < -0.16 && by > 0.04) {
            const csZ = 0.08 - (by / ry) * 0.22;
            const distCS = Math.abs(bz - csZ);
            if (distCS < 0.11) {
              const depthCS = (1.0 - distCS / 0.11) * 0.062;
              bx -= side * depthCS * 0.65;
              by -= depthCS * 0.35;
            }
          }

          // ── CONTINUOUS 3D SERPENTINE GYRI & SULCI CONVOLUTIONS ────────────
          // Keep medial wall clean, displace lateral/superior cortical surface
          const latWeight = THREE.MathUtils.smoothstep(Math.abs(bx), 0.08, 0.40);

          const kx = bx * 3.4;
          const ky = by * 3.8;
          const kz = bz * 3.2;

          // Domain warping produces undulating, serpentine biological ribbon turns
          const qx = kx + 0.38 * Math.sin(ky * 1.6 + kz * 1.2 + (isLeft ? 0.6 : -0.6));
          const qy = ky + 0.38 * Math.sin(kz * 1.5 + kx * 1.3);
          const qz = kz + 0.38 * Math.cos(kx * 1.5 + ky * 1.4);

          const g1 = Math.sin(qx * 2.3 + qy * 1.9);
          const g2 = Math.cos(qy * 2.5 - qz * 2.2);
          const g3 = Math.sin(qz * 2.9 + qx * 2.0);
          const g4 = Math.cos(qx * 4.4 + qy * 3.8 + qz * 3.6) * 0.32;
          const g5 = Math.sin(qx * 7.2 - qy * 6.6 + qz * 5.0) * 0.14;

          const rawGyri = (g1 + g2 + g3 + g4 + g5) / 2.3;

          // Ridge transform: wide rounded gyral crowns separated by deep narrow sulcal crevices
          const gyriDisp = (1.0 - Math.pow(Math.abs(rawGyri), 1.30)) * 0.075 - 0.022;

          // Outward displacement direction from hemisphere center
          const cX = side * 0.52;
          const cY = 0.06;
          const cZ = 0.0;
          let nx = bx - cX;
          let ny = by - cY;
          let nz = bz - cZ;
          const nlen = Math.hypot(nx, ny, nz) || 1.0;
          nx /= nlen; ny /= nlen; nz /= nlen;

          const finalDisp = gyriDisp * latWeight;
          const x = bx + nx * finalDisp;
          const y = by + ny * finalDisp;
          const z = bz + nz * finalDisp;

          positions.push(x, y, z);
          normals.push(nx, ny, nz);
          uvs.push(un, vn);
        }
      }

      // Standard sphere quad winding indices
      for (let j = 0; j < vSegs; j++) {
        for (let i = 0; i < uSegs; i++) {
          const a = j * (uSegs + 1) + i;
          const b = a + 1;
          const c = (j + 1) * (uSegs + 1) + i;
          const d = c + 1;
          if (isLeft) {
            indices.push(a, b, c);
            indices.push(b, d, c);
          } else {
            indices.push(a, c, b);
            indices.push(b, c, d);
          }
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('normal',   new THREE.Float32BufferAttribute(normals, 3));
      geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return geo;
    };

    // ── Ultra-Premium PBR Cybernetic Cortical Tissue Material ───────────────
    const makeCorticalMat = (baseHex: number, emHex: number) => new THREE.MeshPhysicalMaterial({
      color:               new THREE.Color(baseHex),
      emissive:            new THREE.Color(emHex),
      emissiveIntensity:   0.65,
      roughness:           0.22,
      metalness:           0.16,
      clearcoat:           1.0,
      clearcoatRoughness:  0.10,
      transmission:        0.24,
      transparent:         true,
      opacity:             0.95,
      side:                THREE.DoubleSide,
    });

    const makeWireMat = (colorHex: number, opacity = 0.14) => new THREE.MeshBasicMaterial({
      color: colorHex,
      wireframe: true,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Left Hemisphere (Volumetric Watertight 3D Solid)
    const leftGeo = createAnatomicalHemisphereGeo(true);
    this.leftHemisphereMesh = new THREE.Mesh(leftGeo, makeCorticalMat(0x021124, 0x00264d));
    this.leftWireMesh        = new THREE.Mesh(leftGeo, makeWireMat(0x00d4ff, 0.15));
    this.group.add(this.leftHemisphereMesh);
    this.group.add(this.leftWireMesh);

    // Right Hemisphere (Volumetric Watertight 3D Solid)
    const rightGeo = createAnatomicalHemisphereGeo(false);
    this.rightHemisphereMesh = new THREE.Mesh(rightGeo, makeCorticalMat(0x021124, 0x00264d));
    this.rightWireMesh       = new THREE.Mesh(rightGeo, makeWireMat(0x00d4ff, 0.15));
    this.group.add(this.rightHemisphereMesh);
    this.group.add(this.rightWireMesh);

    // ── Cerebellum — Bilateral lobes with dense horizontal folia ridges ─────
    const cerGeo = new THREE.SphereGeometry(0.58, 48, 36);
    cerGeo.scale(1.24, 0.58, 0.76);
    const cerPos = cerGeo.attributes.position;
    for (let i = 0; i < cerPos.count; i++) {
      const px = cerPos.getX(i);
      const py = cerPos.getY(i);
      const pz = cerPos.getZ(i);
      // Twin cerebellar hemisphere indentation at vermis (px = 0)
      const vermisDepression = (1.0 - Math.exp(-Math.pow(px * 4.5, 2))) * 1.0;
      // Dense horizontal folia (anatomical parallel cerebellar cortex ridges)
      const folia = Math.sin(py * 52.0) * 0.018 + Math.cos(px * 24.0) * 0.008;
      cerPos.setY(i, py + folia);
      cerPos.setX(i, px * (0.85 + vermisDepression * 0.15));
    }
    cerGeo.computeVertexNormals();

    this.cerebellumMesh = new THREE.Mesh(cerGeo, new THREE.MeshPhysicalMaterial({
      color:             new THREE.Color(0x1a0414),
      emissive:          new THREE.Color(0x400624),
      emissiveIntensity: 0.70,
      roughness:         0.28,
      metalness:         0.14,
      clearcoat:         0.90,
      clearcoatRoughness:0.15,
      transparent:       true,
      opacity:           0.94,
      side:              THREE.DoubleSide,
    }));
    this.cerebellumMesh.position.set(0, -0.48, -0.74);
    this.group.add(this.cerebellumMesh);

    this.cerebellumWireMesh = new THREE.Mesh(cerGeo, makeWireMat(0xff0055, 0.20));
    this.cerebellumWireMesh.position.copy(this.cerebellumMesh.position);
    this.group.add(this.cerebellumWireMesh);

    // ── Brainstem & Pons — Ascending stalk with prominent pons bulge ────────
    const stemGeo = new THREE.CylinderGeometry(0.18, 0.12, 1.15, 28, 28);
    const stemPos = stemGeo.attributes.position;
    for (let i = 0; i < stemPos.count; i++) {
      const sy = stemPos.getY(i);
      const sx = stemPos.getX(i);
      const sz = stemPos.getZ(i);
      const sAngle = Math.atan2(sz, sx);

      // Anterior Pons swelling between y = 0.05 and 0.45
      const isPons = sy > 0.02 && sy < 0.44;
      const ponsSwell = isPons ? Math.sin(((sy - 0.02) / 0.42) * Math.PI) * 0.085 : 0;
      // Anterior bias (pons protrudes forward in front of brainstem)
      const forwardBias = isPons ? Math.max(0, Math.sin(sAngle)) * 0.06 : 0;
      // Vertical corticospinal tract fiber striations
      const striation = Math.sin(sAngle * 16.0) * 0.008;

      const rad = Math.hypot(sx, sz) + ponsSwell + striation;
      stemPos.setX(i, Math.cos(sAngle) * rad);
      stemPos.setZ(i, Math.sin(sAngle) * rad + forwardBias);
    }
    stemGeo.computeVertexNormals();

    this.brainstemMesh = new THREE.Mesh(stemGeo, new THREE.MeshPhysicalMaterial({
      color:             new THREE.Color(0x021812),
      emissive:          new THREE.Color(0x033822),
      emissiveIntensity: 0.75,
      roughness:         0.26,
      metalness:         0.14,
      clearcoat:         0.92,
      clearcoatRoughness:0.14,
      transparent:       true,
      opacity:           0.94,
      side:              THREE.DoubleSide,
    }));
    this.brainstemMesh.position.set(0, -0.78, -0.22);
    this.brainstemMesh.rotation.x = 0.14;
    this.group.add(this.brainstemMesh);

    this.brainstemWireMesh = new THREE.Mesh(stemGeo, makeWireMat(0x10b981, 0.22));
    this.brainstemWireMesh.position.copy(this.brainstemMesh.position);
    this.brainstemWireMesh.rotation.copy(this.brainstemMesh.rotation);
    this.group.add(this.brainstemWireMesh);
  }

  /**
   * Anatomical DTI Connectome Fascicles — Catmull-Rom splines nested
   * inside the volumetric cerebral cortex and connecting brain regions.
   */
  private buildConnectomeFibers() {
    this.fascicles = [];
    const totalFascicles = 140;

    for (let f = 0; f < totalFascicles; f++) {
      const type = f % 5;
      const waypoints: THREE.Vector3[] = [];
      let lobe: AnatomicalLobe = 'frontal';
      let col = this.LOBE_PALETTES.frontal.clone();

      if (type === 0) {
        // Corpus Callosum commissural arches spanning left <-> right across fissure
        const zPos = -0.45 + (f / totalFascicles) * 0.90;
        const archH = 0.20 + Math.random() * 0.24;
        const span  = 0.35 + Math.random() * 0.28;
        waypoints.push(
          new THREE.Vector3(-span, 0.05 + Math.random() * 0.12, zPos),
          new THREE.Vector3(-0.18, archH * 0.85, zPos),
          new THREE.Vector3(0,     archH,         zPos),
          new THREE.Vector3( 0.18, archH * 0.85, zPos),
          new THREE.Vector3( span, 0.05 + Math.random() * 0.12, zPos)
        );
        lobe = 'parietal';
        col  = this.LOBE_PALETTES.parietal.clone();
      } else if (type === 1) {
        // Superior Longitudinal Fasciculus (Frontal -> Parietal -> Occipital)
        const sx = (f % 2 === 0 ? -1 : 1);
        const xd = (0.28 + Math.random() * 0.32) * sx;
        waypoints.push(
          new THREE.Vector3(xd * 0.75,  0.15 + Math.random() * 0.15,  0.82),
          new THREE.Vector3(xd * 1.05,  0.50 + Math.random() * 0.18,  0.18),
          new THREE.Vector3(xd * 0.95,  0.30 + Math.random() * 0.15, -0.42),
          new THREE.Vector3(xd * 0.65, -0.02 + Math.random() * 0.12, -0.80)
        );
        lobe = f % 3 === 0 ? 'frontal' : f % 3 === 1 ? 'parietal' : 'occipital';
        col  = this.LOBE_PALETTES[lobe].clone();
      } else if (type === 2) {
        // Inferior Fronto-Occipital & Arcuate Fasciculus (Temporal arch)
        const sx = (f % 2 === 0 ? -1 : 1);
        const xd = (0.42 + Math.random() * 0.30) * sx;
        waypoints.push(
          new THREE.Vector3(xd * 0.65,  0.08 + Math.random() * 0.10,  0.65),
          new THREE.Vector3(xd * 1.10, -0.15 + Math.random() * 0.10,  0.10),
          new THREE.Vector3(xd * 0.90, -0.12 + Math.random() * 0.10, -0.55),
          new THREE.Vector3(xd * 0.45,  0.05 + Math.random() * 0.10, -0.75)
        );
        lobe = 'temporal';
        col  = this.LOBE_PALETTES.temporal.clone();
      } else if (type === 3) {
        // Corticospinal Projection Tracts (Motor Cortex -> Internal Capsule -> Brainstem)
        const sx = (f % 2 === 0 ? -1 : 1);
        const sx2 = (0.20 + Math.random() * 0.32) * sx;
        waypoints.push(
          new THREE.Vector3(sx2,         0.65 + Math.random() * 0.15,  0.05 + Math.random() * 0.20),
          new THREE.Vector3(sx2 * 0.50,  0.22,                        -0.06),
          new THREE.Vector3(sx2 * 0.18, -0.25,                        -0.14),
          new THREE.Vector3(0,          -0.90,                        -0.20)
        );
        lobe = 'brainstem';
        col  = this.LOBE_PALETTES.brainstem.clone();
      } else {
        // Cerebellar Peduncles (Brainstem <-> Cerebellum)
        const sx = (f % 2 === 0 ? -1 : 1);
        waypoints.push(
          new THREE.Vector3(0,                           -0.25, -0.15),
          new THREE.Vector3(0.18 * sx,                   -0.38, -0.42),
          new THREE.Vector3((0.35 + Math.random() * 0.22) * sx, -0.46, -0.68)
        );
        lobe = 'cerebellum';
        col  = this.LOBE_PALETTES.cerebellum.clone();
      }

      const curve  = new THREE.CatmullRomCurve3(waypoints, false, 'centripetal', 0.5);
      const points = curve.getPoints(28);
      this.fascicles.push({ curve, points, lobe, color: col });
    }

    // Connectome LineSegments
    let totalLineVerts = 0;
    this.fascicles.forEach(f => { totalLineVerts += (f.points.length - 1) * 2; });

    const linePos = new Float32Array(totalLineVerts * 3);
    const lineCol = new Float32Array(totalLineVerts * 3);
    let pIdx = 0;

    this.fascicles.forEach(f => {
      const c = f.color;
      for (let i = 0; i < f.points.length - 1; i++) {
        const A = f.points[i];
        const B = f.points[i + 1];
        for (const pt of [A, B]) {
          linePos[pIdx * 3 + 0] = pt.x;
          linePos[pIdx * 3 + 1] = pt.y;
          linePos[pIdx * 3 + 2] = pt.z;
          // Kept safely clamped below 0.80
          lineCol[pIdx * 3 + 0] = Math.min(0.80, c.r * 0.75);
          lineCol[pIdx * 3 + 1] = Math.min(0.80, c.g * 0.75);
          lineCol[pIdx * 3 + 2] = Math.min(0.80, c.b * 0.75);
          pIdx++;
        }
      }
    });

    this.connectomeGeometry = new THREE.BufferGeometry();
    this.connectomeGeometry.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    this.connectomeGeometry.setAttribute('color',    new THREE.BufferAttribute(lineCol, 3));

    this.connectomeLines = new THREE.LineSegments(
      this.connectomeGeometry,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent:  true,
        opacity:      0.65,
        blending:     THREE.AdditiveBlending,
        depthWrite:   false,
      })
    );
    this.group.add(this.connectomeLines);

    // Action Potential Pulses (traveling sparks)
    const pulseCount = 85;
    const pulsePosArr = new Float32Array(pulseCount * 3);
    const pulseColArr = new Float32Array(pulseCount * 3);

    for (let p = 0; p < pulseCount; p++) {
      const fIdx = Math.floor(Math.random() * this.fascicles.length);
      this.actionPotentials.push({
        fascicleIdx: fIdx,
        progress:    Math.random(),
        speed:       0.12 + Math.random() * 0.22,
        color:       this.fascicles[fIdx].color.clone(),
        size:        0.030,
      });
    }

    this.pulseGeometry = new THREE.BufferGeometry();
    this.pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePosArr, 3));
    this.pulseGeometry.setAttribute('color',    new THREE.BufferAttribute(pulseColArr, 3));

    this.pulsePoints = new THREE.Points(
      this.pulseGeometry,
      new THREE.PointsMaterial({
        size:            0.032,
        map:             this.pulseTexture,
        vertexColors:    true,
        transparent:     true,
        opacity:         0.90,
        blending:        THREE.AdditiveBlending,
        depthWrite:      false,
        sizeAttenuation: true,
      })
    );
    this.group.add(this.pulsePoints);
  }

  /**
   * Instanced glowing neural soma nodes distributed naturally along the connectome
   */
  private buildInstancedNodes() {
    this.nodes = [];
    const nodeSphere = new THREE.SphereGeometry(0.018, 8, 8);
    const nodeMat    = new THREE.MeshStandardMaterial({
      roughness:         0.35,
      metalness:         0.20,
      emissive:          new THREE.Color(0x00e0ff),
      emissiveIntensity: 0.85,
    });

    const candidates: { pos: THREE.Vector3; lobe: AnatomicalLobe }[] = [];
    this.fascicles.forEach(f => {
      candidates.push({ pos: f.curve.getPoint(0.20), lobe: f.lobe });
      candidates.push({ pos: f.curve.getPoint(0.50), lobe: f.lobe });
      candidates.push({ pos: f.curve.getPoint(0.80), lobe: f.lobe });
    });

    const MIN_DIST = 0.18;
    candidates.forEach(cand => {
      const tooClose = this.nodes.some(n => n.position.distanceTo(cand.pos) < MIN_DIST);
      if (!tooClose && this.nodes.length < 175) {
        this.nodes.push({
          position:      cand.pos.clone(),
          originalPos:   cand.pos.clone(),
          lobe:          cand.lobe,
          isLeft:        cand.pos.x < 0,
          activation:    0.45 + Math.random() * 0.40,
          residualMemory:0.10,
          pulsePhase:    Math.random() * Math.PI * 2,
          depth:         cand.pos.length(),
        });
      }
    });

    this.instancedNodes = new THREE.InstancedMesh(nodeSphere, nodeMat, this.nodes.length);
    this.instancedNodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      this.dummy.position.copy(n.position);
      this.dummy.scale.setScalar(1.0);
      this.dummy.updateMatrix();
      this.instancedNodes.setMatrixAt(i, this.dummy.matrix);

      const col = this.LOBE_PALETTES[n.lobe].clone();
      clampColor(col, 0.88);
      this.instancedNodes.setColorAt(i, col);
    }

    this.instancedNodes.instanceMatrix.needsUpdate = true;
    if (this.instancedNodes.instanceColor) this.instancedNodes.instanceColor.needsUpdate = true;
    this.group.add(this.instancedNodes);
  }

  /**
   * 3D Holographic contact reticle + electrical micro-arcs
   */
  private buildContactReticle() {
    this.contactReticleGroup = new THREE.Group();
    this.contactReticleGroup.visible = false;
    this.group.add(this.contactReticleGroup);

    const ringGeo = new THREE.RingGeometry(0.08, 0.13, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff, transparent: true, opacity: 0.85,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this.contactRingMesh = new THREE.Mesh(ringGeo, ringMat);
    this.contactReticleGroup.add(this.contactRingMesh);

    const innerRingGeo = new THREE.RingGeometry(0.035, 0.065, 24);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.55,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this.contactReticleGroup.add(new THREE.Mesh(innerRingGeo, innerRingMat));

    const arcGeo = new THREE.BufferGeometry();
    arcGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(8 * 6), 3));
    this.contactArcLines = new THREE.LineSegments(arcGeo, new THREE.LineBasicMaterial({
      color: 0x00d4ff, transparent: true, opacity: 0.70,
      blending: THREE.AdditiveBlending,
    }));
    this.contactReticleGroup.add(this.contactArcLines);
  }

  private buildAtmosphericHalo() {
    this.haloMesh = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.ShaderMaterial({ uniforms: { uColor: { value: new THREE.Color() } } })
    );
  }

  /**
   * Hover raycast: detects anatomical lobe, updates visuals, dispatches UI events
   */
  public handleHover(hitPoint?: THREE.Vector3, normal?: THREE.Vector3) {
    if (!hitPoint) {
      if (this.hoveredLobe !== null) {
        this.hoveredLobe = null;
        this.contactReticleGroup.visible = false;
        this.updateLobeVisuals();
      }
      return;
    }

    let detectedLobe: AnatomicalLobe = 'frontal';
    const hy = hitPoint.y;
    const hx = hitPoint.x;
    const hz = hitPoint.z;

    if (hy < -0.38 && Math.abs(hx) < 0.32 && hz > -0.48) {
      detectedLobe = 'brainstem';
    } else if (hy < -0.32 && hz <= -0.46) {
      detectedLobe = 'cerebellum';
    } else if (hz > 0.42 && hy > -0.18) {
      detectedLobe = 'frontal';
    } else if (hz < -0.50 && hy > -0.16) {
      detectedLobe = 'occipital';
    } else if (Math.abs(hx) > 0.65 && hy <= 0.22) {
      detectedLobe = 'temporal';
    } else {
      detectedLobe = 'parietal';
    }

    if (this.hoveredLobe !== detectedLobe) {
      this.hoveredLobe = detectedLobe;
      this.audio.playHoverTone(
        detectedLobe === 'frontal'     ? 780 :
        detectedLobe === 'temporal'    ? 620 :
        detectedLobe === 'parietal'    ? 700 :
        detectedLobe === 'occipital'   ? 840 :
        detectedLobe === 'cerebellum'  ? 520 : 440
      );
      this.updateLobeVisuals();
      window.dispatchEvent(new CustomEvent('kalki-lobe-hover', { detail: { lobe: detectedLobe } }));
    }

    this.contactReticleGroup.visible = true;
    this.contactReticleGroup.position.copy(hitPoint);
    if (normal) {
      this.contactReticleGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    }

    const reticleCol = this.LOBE_PALETTES[detectedLobe];
    (this.contactRingMesh.material as THREE.MeshBasicMaterial).color.copy(reticleCol);

    // Electrical micro-arcs to nearby nodes
    const arcPos = this.contactArcLines.geometry.attributes.position.array as Float32Array;
    let arcIdx = 0;
    for (let i = 0; i < this.nodes.length && arcIdx < 8; i++) {
      const dist = hitPoint.distanceTo(this.nodes[i].position);
      if (dist < 0.65 && dist > 0.08) {
        arcPos[arcIdx * 6 + 0] = 0;
        arcPos[arcIdx * 6 + 1] = 0;
        arcPos[arcIdx * 6 + 2] = 0;
        const local = this.nodes[i].position.clone().sub(hitPoint);
        arcPos[arcIdx * 6 + 3] = local.x;
        arcPos[arcIdx * 6 + 4] = local.y;
        arcPos[arcIdx * 6 + 5] = local.z;
        arcIdx++;
      }
    }
    this.contactArcLines.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * Activate a specific anatomical lobe
   */
  public activateLobe(lobeKey: AnatomicalLobe) {
    this.activeLobe = lobeKey;
    this.updateLobeVisuals();
    this.audio.playSynapticSpark(
      lobeKey === 'frontal'    ? 1200 :
      lobeKey === 'temporal'   ? 880  :
      lobeKey === 'cerebellum' ? 720  :
      lobeKey === 'brainstem'  ? 600  : 980
    );
    for (const n of this.nodes) {
      if (n.lobe === lobeKey || lobeKey === 'all') {
        n.residualMemory = Math.min(0.95, n.residualMemory + 0.40);
      }
    }
  }

  /**
   * Updates cortical material emissive colors for hover/active lobe
   */
  private updateLobeVisuals() {
    const targetLobe  = this.hoveredLobe || this.activeLobe;
    const targetColor = this.LOBE_PALETTES[targetLobe] ?? this.LOBE_PALETTES.frontal;

    const leftMat  = this.leftHemisphereMesh.material  as THREE.MeshPhysicalMaterial;
    const rightMat = this.rightHemisphereMesh.material as THREE.MeshPhysicalMaterial;
    const cerMat   = this.cerebellumMesh.material      as THREE.MeshPhysicalMaterial;
    const stemMat  = this.brainstemMesh.material       as THREE.MeshPhysicalMaterial;

    const hemEmissive = targetColor.clone().multiplyScalar(0.42);
    clampColor(hemEmissive, 0.52);
    leftMat.emissive.copy(hemEmissive);
    rightMat.emissive.copy(hemEmissive);

    const cerTarget = targetLobe === 'cerebellum'
      ? new THREE.Color(0.92, 0.0, 0.30)
      : new THREE.Color(0.24, 0.03, 0.14);
    cerMat.emissive.copy(cerTarget);

    const stemTarget = targetLobe === 'brainstem'
      ? new THREE.Color(0.06, 0.65, 0.42)
      : new THREE.Color(0.03, 0.22, 0.14);
    stemMat.emissive.copy(stemTarget);

    (this.leftWireMesh.material as THREE.MeshBasicMaterial).color.copy(targetColor);
    (this.rightWireMesh.material as THREE.MeshBasicMaterial).color.copy(targetColor);
  }

  /**
   * 5-Stage Cinematic Synaptic Shockwave Surge
   */
  public triggerSynapticSurge(targetPoint?: THREE.Vector3, onStageChange?: (stage: string, intensity: number) => void) {
    if (this.isSurging) return;
    this.isSurging    = true;
    this.surgeIntensity = 1.0;
    this.surgeCallback  = onStageChange;

    // Stage 1: ANTICIPATION
    this.audio.playAnticipationRiser(0.45);
    this.surgeCallback?.('ANTICIPATION', 0.5);

    setTimeout(() => {
      // Stage 2: SILENCE
      this.audio.playSilenceMoment(0.1);
      this.surgeCallback?.('SILENCE', 0.0);

      setTimeout(() => {
        // Stage 3: MASSIVE IMPACT
        this.audio.triggerShockwaveImpact();
        this.surgeCallback?.('IMPACT', 1.0);

        for (const n of this.nodes) {
          n.residualMemory = Math.min(0.95, n.residualMemory + 0.70);
        }

        setTimeout(() => {
          // Stage 4: REVEAL
          this.audio.playRevealChime();
          this.surgeCallback?.('REVEAL', 0.6);

          setTimeout(() => {
            // Stage 5: CALM
            this.isSurging      = false;
            this.surgeIntensity = 0;
            this.surgeCallback?.('CALM', 0.0);
          }, 850);
        }, 400);
      }, 100);
    }, 450);
  }

  /**
   * Per-frame render update:
   * - Gentle breathing rhythm
   * - Action potential traversal
   * - Neural node pulses & residual decay
   */
  public update(delta: number, time: number) {
    // 1. Gentle cerebral breathing rhythm
    const breathScale = 1.0 + Math.sin(time * 1.4) * 0.012 + (this.isSurging ? Math.sin(time * 22.0) * 0.028 : 0);
    this.leftHemisphereMesh.scale.set(breathScale, breathScale, breathScale);
    this.rightHemisphereMesh.scale.set(breathScale, breathScale, breathScale);
    this.leftWireMesh.scale.set(breathScale, breathScale, breathScale);
    this.rightWireMesh.scale.set(breathScale, breathScale, breathScale);

    // 2. Action potential traversal
    const pulsePosArr = this.pulseGeometry.attributes.position.array as Float32Array;
    const pulseColArr = this.pulseGeometry.attributes.color.array    as Float32Array;
    const speedMult   = this.isSurging ? 3.0 : 1.0;

    for (let p = 0; p < this.actionPotentials.length; p++) {
      const ap       = this.actionPotentials[p];
      const fascicle = this.fascicles[ap.fascicleIdx];
      if (!fascicle) continue;

      ap.progress += ap.speed * delta * speedMult;
      if (ap.progress > 1.0) {
        ap.progress = 0;
        if (Math.random() < 0.3) {
          ap.fascicleIdx = Math.floor(Math.random() * this.fascicles.length);
        }
      }

      const pt = fascicle.curve.getPoint(ap.progress);
      pulsePosArr[p * 3 + 0] = pt.x;
      pulsePosArr[p * 3 + 1] = pt.y;
      pulsePosArr[p * 3 + 2] = pt.z;

      const isActive  = this.activeLobe === 'all' || this.activeLobe === fascicle.lobe || this.hoveredLobe === fascicle.lobe;
      const intensity = isActive ? 0.90 : 0.22;

      pulseColArr[p * 3 + 0] = Math.min(0.90, fascicle.color.r * intensity);
      pulseColArr[p * 3 + 1] = Math.min(0.90, fascicle.color.g * intensity);
      pulseColArr[p * 3 + 2] = Math.min(0.90, fascicle.color.b * intensity);
    }

    this.pulseGeometry.attributes.position.needsUpdate = true;
    this.pulseGeometry.attributes.color.needsUpdate    = true;

    // 3. Instanced nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      n.pulsePhase    += delta * 2.2;
      const alphaWave  = Math.sin(n.pulsePhase) * 0.25 + 0.75;

      n.residualMemory = Math.max(0.04, n.residualMemory - delta * 0.007);

      const isActive  = this.activeLobe === 'all' || this.activeLobe === n.lobe || this.hoveredLobe === n.lobe;
      const scale     = (0.70 + alphaWave * 0.30 + n.residualMemory * 0.60)
                      * (isActive ? 1.10 : 0.68)
                      * (this.isSurging ? 1.35 : 1.0);

      this.dummy.position.copy(n.position);
      this.dummy.scale.setScalar(scale);
      this.dummy.updateMatrix();
      this.instancedNodes.setMatrixAt(i, this.dummy.matrix);

      const lobeCol = this.LOBE_PALETTES[n.lobe].clone();
      const brightness = (0.75 + n.residualMemory * 1.0 + alphaWave * 0.25) * (isActive ? 1.0 : 0.30);
      this.colorHelper.copy(lobeCol).multiplyScalar(brightness);
      clampColor(this.colorHelper, 0.85);
      this.instancedNodes.setColorAt(i, this.colorHelper);
    }

    this.instancedNodes.instanceMatrix.needsUpdate = true;
    if (this.instancedNodes.instanceColor) this.instancedNodes.instanceColor.needsUpdate = true;

    // 4. Reticle ring rotation
    if (this.contactReticleGroup.visible) {
      this.contactRingMesh.rotation.z += delta * 2.8;
    }
  }

  public dispose() {
    this.leftHemisphereMesh.geometry.dispose();
    (this.leftHemisphereMesh.material as THREE.Material).dispose();
    this.rightHemisphereMesh.geometry.dispose();
    (this.rightHemisphereMesh.material as THREE.Material).dispose();
    this.cerebellumMesh.geometry.dispose();
    (this.cerebellumMesh.material as THREE.Material).dispose();
    this.brainstemMesh.geometry.dispose();
    (this.brainstemMesh.material as THREE.Material).dispose();
    this.leftWireMesh.geometry.dispose();
    (this.leftWireMesh.material as THREE.Material).dispose();
    this.rightWireMesh.geometry.dispose();
    (this.rightWireMesh.material as THREE.Material).dispose();
    this.cerebellumWireMesh.geometry.dispose();
    (this.cerebellumWireMesh.material as THREE.Material).dispose();
    this.brainstemWireMesh.geometry.dispose();
    (this.brainstemWireMesh.material as THREE.Material).dispose();
    this.connectomeGeometry.dispose();
    (this.connectomeLines.material as THREE.Material).dispose();
    this.pulseGeometry.dispose();
    (this.pulsePoints.material as THREE.Material).dispose();
    this.instancedNodes.geometry.dispose();
    (this.instancedNodes.material as THREE.Material).dispose();
    this.pulseTexture.dispose();
    this.haloMesh.geometry.dispose();
    (this.haloMesh.material as THREE.Material).dispose();
    this.scene.remove(this.group);
  }
}
