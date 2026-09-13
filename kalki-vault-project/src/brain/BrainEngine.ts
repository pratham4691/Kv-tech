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

  // Authenticated Sovereign Cyber-Biological Lobe Palette (all < 1.0)
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
    this.group.position.set(0, 0.08, 0);
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
   * Dramatic volumetric scene lighting for wet cortical tissue & bioluminescent sulci
   */
  private setupVolumetricLights() {
    // Ambient bioluminescent deep-ocean base
    const amb = new THREE.AmbientLight(0x04111e, 2.8);
    this.group.add(amb);

    // Primary key: cyan top-front fill
    const key = new THREE.PointLight(0x00d4ff, 12.0, 16);
    key.position.set(1.2, 3.2, 4.0);
    this.group.add(key);

    // Hot orange-gold under-rim for anatomical depth
    const under = new THREE.PointLight(0xff7e00, 5.5, 12);
    under.position.set(-0.5, -2.8, 2.5);
    this.group.add(under);

    // Cool violet posterior rim — sculpts brain silhouette
    const rim = new THREE.PointLight(0xa855f7, 7.5, 14);
    rim.position.set(-2.5, -1.2, -3.5);
    this.group.add(rim);

    // Warm golden lateral fill (right hemisphere detail)
    const fill = new THREE.PointLight(0xf59e0b, 4.0, 10);
    fill.position.set(3.5, 0.8, -1.0);
    this.group.add(fill);
  }

  /**
   * Sculpts high-resolution anatomically-correct cerebral cortex hemispheres.
   * Uses a base ovoid (not a sphere) shaped like a real cerebrum,
   * then adds multi-frequency harmonic gyri/sulci displacement.
   */
  private buildCorticalSurfaces() {
    const createHemisphereGeo = (isLeft: boolean) => {
      const uSegs = 72;
      const vSegs = 72;
      const positions: number[] = [];
      const normals: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];

      const side = isLeft ? -1 : 1;

      for (let j = 0; j <= vSegs; j++) {
        const vn = j / vSegs;           // 0 = crown, 1 = inferior
        const theta = vn * Math.PI * 0.95;

        for (let i = 0; i <= uSegs; i++) {
          const un = i / uSegs;          // 0 = medial, 1 = lateral
          const phi = un * Math.PI;      // 0..π half-dome

          const sinT = Math.sin(theta);
          const cosT = Math.cos(theta);
          const sinP = Math.sin(phi);
          const cosP = Math.cos(phi);

          // Base ellipsoid anatomical radii — wider (X) than tall (Y), long A-P (Z)
          const rx = 1.02;   // lateral semi-axis
          const ry = 0.88;   // vertical semi-axis
          const rz = 1.36;   // anterior-posterior semi-axis

          // Build position on ellipsoid hemisphere (lateral half only)
          let bx = side * Math.abs(cosP * sinT) * rx;
          let by = cosT * ry;
          let bz = sinP * sinT * rz;

          // Medial wall gap — sagittal longitudinal fissure
          const medialFade = THREE.MathUtils.smoothstep(Math.abs(bx / rx), 0.04, 0.22);
          bx = side * (Math.abs(bx) * medialFade + 0.08);

          // Anterior/frontal pole — round the forehead
          const zNorm = bz / rz;  // -1 occipital .. +1 frontal
          if (zNorm > 0.55) {
            const taper = 1.0 - (zNorm - 0.55) * 0.35;
            bx *= taper;
            by *= taper * 0.92;
          }

          // Temporal lobe inferior protrusion & Sylvian fissure indentation
          const isTemporal = zNorm > -0.35 && zNorm < 0.55 && by < 0.18 && Math.abs(bx) > 0.40;
          if (isTemporal) {
            by -= 0.12 * sinP;
            bx *= 1.10;
          }

          // Occipital pole taper downward
          if (zNorm < -0.50 && by < 0.16) {
            by += (zNorm + 0.50) * 0.22;
          }

          // ── GYRI & SULCI DISPLACEMENT ──────────────────────────────────────
          // Primary anatomical sulci:
          // Central sulcus (anterior motor | posterior somatosensory divide)
          const centralSulcus = Math.sin((zNorm * 3.2 - vn * 2.4) * Math.PI) * 0.042;
          // Sylvian (lateral) fissure groove
          const sylvianFissure = (isTemporal ? -0.065 : 0.0) * Math.abs(sinP);

          // Secondary/tertiary multi-octave gyral folding
          const g1 = Math.sin(un * 18 + vn * 15 + side * 0.8) * 0.052;
          const g2 = Math.cos(vn * 26 - un * 13 + side * 1.4) * 0.036;
          const g3 = Math.sin(un * 40 + vn * 29) * 0.018;
          const g4 = Math.cos(un * 58 - vn * 44) * 0.010;
          const gyri = g1 + g2 + g3 + g4 + centralSulcus + sylvianFissure;

          // Displace outward along surface normal estimate
          const nx = side * sinP * sinT;
          const ny = cosT;
          const nz = cosP * sinT;
          const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1.0;

          const x = bx + (nx / nLen) * gyri * 0.9;
          const y = by + (ny / nLen) * gyri * 0.85;
          const z = bz + (nz / nLen) * gyri * 0.7;

          positions.push(x, y, z);
          normals.push(0, 1, 0); // recomputed below
          uvs.push(un, vn);
        }
      }

      // Quad face winding
      for (let j = 0; j < vSegs; j++) {
        for (let i = 0; i < uSegs; i++) {
          const a = j * (uSegs + 1) + i;
          const b = a + 1;
          const c = (j + 1) * (uSegs + 1) + i;
          const d = c + 1;
          if (isLeft) {
            indices.push(a, c, b);
            indices.push(b, c, d);
          } else {
            indices.push(a, b, c);
            indices.push(b, d, c);
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

    // ── PBR Wet-Tissue Cortex Material ──────────────────────────────────────
    const makeCorMat = (tintHex: number, emHex: number) => new THREE.MeshPhysicalMaterial({
      color:               new THREE.Color(tintHex),
      emissive:            new THREE.Color(emHex),
      emissiveIntensity:   0.55,
      roughness:           0.28,
      metalness:           0.12,
      clearcoat:           0.90,
      clearcoatRoughness:  0.18,
      transmission:        0.22,
      transparent:         true,
      opacity:             0.93,
      side:                THREE.FrontSide,
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Left Hemisphere
    const leftGeo = createHemisphereGeo(true);
    this.leftHemisphereMesh = new THREE.Mesh(leftGeo, makeCorMat(0x031628, 0x001a36));
    this.leftWireMesh        = new THREE.Mesh(leftGeo, wireMat);
    this.group.add(this.leftHemisphereMesh);
    this.group.add(this.leftWireMesh);

    // Right Hemisphere
    const rightGeo = createHemisphereGeo(false);
    this.rightHemisphereMesh = new THREE.Mesh(rightGeo, makeCorMat(0x031628, 0x001a36));
    this.rightWireMesh       = new THREE.Mesh(rightGeo, wireMat.clone());
    this.group.add(this.rightHemisphereMesh);
    this.group.add(this.rightWireMesh);

    // ── Cerebellum — bilateral lobes with fine horizontal folia ─────────────
    const cerGeo = new THREE.SphereGeometry(0.54, 40, 30);
    cerGeo.scale(1.32, 0.62, 0.82);
    const cerPos = cerGeo.attributes.position;
    for (let i = 0; i < cerPos.count; i++) {
      const py = cerPos.getY(i);
      const px = cerPos.getX(i);
      // Horizontal folia — fine biological ridges
      const folia = Math.sin(py * 42.0) * 0.020 + Math.cos(px * 18.0) * 0.012;
      cerPos.setY(i, py + folia);
    }
    cerGeo.computeVertexNormals();

    this.cerebellumMesh = new THREE.Mesh(cerGeo, new THREE.MeshPhysicalMaterial({
      color:             new THREE.Color(0x140614),
      emissive:          new THREE.Color(0x2a0518),
      emissiveIntensity: 0.70,
      roughness:         0.35,
      metalness:         0.10,
      clearcoat:         0.80,
      clearcoatRoughness:0.22,
      transparent:       true,
      opacity:           0.92,
    }));
    this.cerebellumMesh.position.set(0, -0.52, -0.78);
    this.group.add(this.cerebellumMesh);

    // Crimson cerebellar wireframe
    const cerWire = new THREE.Mesh(cerGeo, new THREE.MeshBasicMaterial({
      color: 0xff0055, wireframe: true, transparent: true,
      opacity: 0.14, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    cerWire.position.copy(this.cerebellumMesh.position);
    this.group.add(cerWire);

    // ── Brainstem — pons bulge + medulla column ───────────────────────────
    const stemGeo = new THREE.CylinderGeometry(0.18, 0.11, 1.20, 22, 22);
    const stemPos = stemGeo.attributes.position;
    for (let i = 0; i < stemPos.count; i++) {
      const sy = stemPos.getY(i);
      const sAngle = Math.atan2(stemPos.getZ(i), stemPos.getX(i));
      const isPons = sy > 0.05 && sy < 0.42;
      const swell = isPons ? Math.sin(((sy - 0.05) / 0.37) * Math.PI) * 0.075 : 0;
      const striation = Math.sin(sAngle * 14.0) * 0.010;
      const rad = Math.hypot(stemPos.getX(i), stemPos.getZ(i)) + swell + striation;
      stemPos.setX(i, Math.cos(sAngle) * rad);
      stemPos.setZ(i, Math.sin(sAngle) * rad);
    }
    stemGeo.computeVertexNormals();

    this.brainstemMesh = new THREE.Mesh(stemGeo, new THREE.MeshPhysicalMaterial({
      color:             new THREE.Color(0x021410),
      emissive:          new THREE.Color(0x022a18),
      emissiveIntensity: 0.78,
      roughness:         0.30,
      metalness:         0.12,
      clearcoat:         0.88,
      clearcoatRoughness:0.18,
      transparent:       true,
      opacity:           0.93,
    }));
    this.brainstemMesh.position.set(0, -0.84, -0.24);
    this.brainstemMesh.rotation.x = 0.16;
    this.group.add(this.brainstemMesh);

    const stemWire = new THREE.Mesh(stemGeo, new THREE.MeshBasicMaterial({
      color: 0x10b981, wireframe: true, transparent: true,
      opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    stemWire.position.copy(this.brainstemMesh.position);
    stemWire.rotation.copy(this.brainstemMesh.rotation);
    this.group.add(stemWire);
  }

  /**
   * DTI Connectome curved axon fascicles — Catmull-Rom splines nested
   * cleanly inside the cortical envelope.
   */
  private buildConnectomeFibers() {
    this.fascicles = [];
    const totalFascicles = 120;

    for (let f = 0; f < totalFascicles; f++) {
      const type = f % 4;
      const waypoints: THREE.Vector3[] = [];
      let lobe: AnatomicalLobe = 'frontal';
      let col = this.LOBE_PALETTES.frontal.clone();

      if (type === 0) {
        // Corpus callosum transcallosal commissural arches
        const zPos = -0.38 + (f / totalFascicles) * 0.80;
        const archH = 0.18 + Math.random() * 0.26;
        const span  = 0.38 + Math.random() * 0.26;
        waypoints.push(
          new THREE.Vector3(-span, 0.04 + Math.random() * 0.12, zPos),
          new THREE.Vector3(-0.18, archH * 0.80, zPos),
          new THREE.Vector3(0,     archH,         zPos),
          new THREE.Vector3( 0.18, archH * 0.80, zPos),
          new THREE.Vector3( span, 0.04 + Math.random() * 0.12, zPos)
        );
        lobe = 'parietal';
        col  = this.LOBE_PALETTES.parietal.clone();
      } else if (type === 1) {
        // Superior longitudinal fasciculi (frontal→parietal→occipital)
        const sx = (f % 2 === 0 ? -1 : 1);
        const xd = (0.24 + Math.random() * 0.30) * sx;
        waypoints.push(
          new THREE.Vector3(xd * 0.78, 0.18 + Math.random() * 0.18, 0.78),
          new THREE.Vector3(xd * 1.00, 0.52 + Math.random() * 0.16, 0.12),
          new THREE.Vector3(xd * 0.92, 0.28 + Math.random() * 0.14,-0.44),
          new THREE.Vector3(xd * 0.60,-0.04 + Math.random() * 0.12,-0.78)
        );
        lobe = f % 3 === 0 ? 'frontal' : f % 3 === 1 ? 'temporal' : 'occipital';
        col  = this.LOBE_PALETTES[lobe].clone();
      } else if (type === 2) {
        // Corticospinal projection tracts (motor cortex → brainstem)
        const sx = (f % 2 === 0 ? -1 : 1);
        const sx2 = (0.18 + Math.random() * 0.32) * sx;
        waypoints.push(
          new THREE.Vector3(sx2,         0.60 + Math.random() * 0.18, -0.04 + Math.random() * 0.28),
          new THREE.Vector3(sx2 * 0.48,  0.18, -0.08),
          new THREE.Vector3(sx2 * 0.16, -0.30, -0.14),
          new THREE.Vector3(0,           -0.98, -0.22)
        );
        lobe = 'brainstem';
        col  = this.LOBE_PALETTES.brainstem.clone();
      } else {
        // Cerebellar peduncles
        const sx = (f % 2 === 0 ? -1 : 1);
        waypoints.push(
          new THREE.Vector3(0,                           -0.30, -0.18),
          new THREE.Vector3(0.18 * sx,                   -0.40, -0.44),
          new THREE.Vector3((0.32 + Math.random() * 0.24) * sx, -0.48, -0.66)
        );
        lobe = 'cerebellum';
        col  = this.LOBE_PALETTES.cerebellum.clone();
      }

      const curve  = new THREE.CatmullRomCurve3(waypoints, false, 'centripetal', 0.5);
      const points = curve.getPoints(28);
      this.fascicles.push({ curve, points, lobe, color: col });
    }

    // ── Connectome LineSegments ───────────────────────────────────────────
    let totalLineVerts = 0;
    this.fascicles.forEach(f => { totalLineVerts += (f.points.length - 1) * 2; });

    const linePos   = new Float32Array(totalLineVerts * 3);
    const lineCol   = new Float32Array(totalLineVerts * 3);
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
          // Keep brightness safely below 1.0
          lineCol[pIdx * 3 + 0] = Math.min(0.75, c.r * 0.72);
          lineCol[pIdx * 3 + 1] = Math.min(0.75, c.g * 0.72);
          lineCol[pIdx * 3 + 2] = Math.min(0.75, c.b * 0.72);
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
        opacity:      0.58,
        blending:     THREE.AdditiveBlending,
        depthWrite:   false,
      })
    );
    this.group.add(this.connectomeLines);

    // ── Action Potential Pulses ───────────────────────────────────────────
    const pulseCount = 70;
    const pulsePosArr = new Float32Array(pulseCount * 3);
    const pulseColArr = new Float32Array(pulseCount * 3);

    for (let p = 0; p < pulseCount; p++) {
      const fIdx = Math.floor(Math.random() * this.fascicles.length);
      this.actionPotentials.push({
        fascicleIdx: fIdx,
        progress:    Math.random(),
        speed:       0.10 + Math.random() * 0.20,
        color:       this.fascicles[fIdx].color.clone(),
        size:        0.028,
      });
    }

    this.pulseGeometry = new THREE.BufferGeometry();
    this.pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePosArr, 3));
    this.pulseGeometry.setAttribute('color',    new THREE.BufferAttribute(pulseColArr, 3));

    this.pulsePoints = new THREE.Points(
      this.pulseGeometry,
      new THREE.PointsMaterial({
        size:         0.028,
        map:          this.pulseTexture,
        vertexColors: true,
        transparent:  true,
        opacity:      0.88,
        blending:     THREE.AdditiveBlending,
        depthWrite:   false,
        sizeAttenuation: true,
      })
    );
    this.group.add(this.pulsePoints);
  }

  /**
   * Instanced glowing neural node clusters — tiny, well-spaced,
   * with hard brightness cap to prevent white blowout.
   */
  private buildInstancedNodes() {
    this.nodes = [];
    const nodeSphere = new THREE.SphereGeometry(0.016, 8, 8);
    const nodeMat    = new THREE.MeshStandardMaterial({
      roughness:         0.4,
      metalness:         0.2,
      emissive:          new THREE.Color(0x00e0ff),
      emissiveIntensity: 0.80,
    });

    // Sample node positions from fascicle midpoints — enforce min spacing 0.20
    const candidates: { pos: THREE.Vector3; lobe: AnatomicalLobe }[] = [];
    this.fascicles.forEach(f => {
      candidates.push({ pos: f.curve.getPoint(0.22), lobe: f.lobe });
      candidates.push({ pos: f.curve.getPoint(0.50), lobe: f.lobe });
      candidates.push({ pos: f.curve.getPoint(0.78), lobe: f.lobe });
    });

    const MIN_DIST = 0.20;
    candidates.forEach(cand => {
      const tooClose = this.nodes.some(n => n.position.distanceTo(cand.pos) < MIN_DIST);
      if (!tooClose && this.nodes.length < 160) {
        this.nodes.push({
          position:      cand.pos.clone(),
          originalPos:   cand.pos.clone(),
          lobe:          cand.lobe,
          isLeft:        cand.pos.x < 0,
          activation:    0.4 + Math.random() * 0.4,
          residualMemory:0.1,
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

    const ringGeo = new THREE.RingGeometry(0.07, 0.12, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff, transparent: true, opacity: 0.80,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this.contactRingMesh = new THREE.Mesh(ringGeo, ringMat);
    this.contactReticleGroup.add(this.contactRingMesh);

    // Inner pulsing ring
    const innerRingGeo = new THREE.RingGeometry(0.03, 0.06, 24);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.50,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this.contactReticleGroup.add(new THREE.Mesh(innerRingGeo, innerRingMat));

    // Electrical micro-arc line segments
    const arcGeo = new THREE.BufferGeometry();
    arcGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(8 * 6), 3));
    this.contactArcLines = new THREE.LineSegments(arcGeo, new THREE.LineBasicMaterial({
      color: 0x00d4ff, transparent: true, opacity: 0.65,
      blending: THREE.AdditiveBlending,
    }));
    this.contactReticleGroup.add(this.contactArcLines);
  }

  /** Disabled halo — prevents hazy cloud artifacts */
  private buildAtmosphericHalo() {
    this.haloMesh = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.ShaderMaterial({ uniforms: { uColor: { value: new THREE.Color() } } })
    );
  }

  /**
   * Hover raycast: updates holographic reticle position, detects lobe, dispatches UI events
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

    // 3D lobe detection from hit coordinates
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
    } else if (hz < -0.52 && hy > -0.14) {
      detectedLobe = 'occipital';
    } else if (Math.abs(hx) > 0.68 && hy <= 0.22) {
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

    // Position reticle on brain surface
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
      if (dist < 0.60 && dist > 0.07) {
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
   * Activate a specific anatomical lobe — updates emissive colors and rotates camera
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
   * Updates cortical material emissive colors for hover/active lobe — brightness strictly clamped.
   */
  private updateLobeVisuals() {
    const targetLobe  = this.hoveredLobe || this.activeLobe;
    const targetColor = this.LOBE_PALETTES[targetLobe] ?? this.LOBE_PALETTES.frontal;

    const leftMat  = this.leftHemisphereMesh.material  as THREE.MeshPhysicalMaterial;
    const rightMat = this.rightHemisphereMesh.material as THREE.MeshPhysicalMaterial;
    const cerMat   = this.cerebellumMesh.material      as THREE.MeshPhysicalMaterial;
    const stemMat  = this.brainstemMesh.material       as THREE.MeshPhysicalMaterial;

    // Hemisphere emissive — never exceed 0.50 intensity to avoid blowout
    const hemEmissive = targetColor.clone().multiplyScalar(0.38);
    clampColor(hemEmissive, 0.50);
    leftMat.emissive.copy(hemEmissive);
    rightMat.emissive.copy(hemEmissive);

    // Cerebellum
    const cerTarget = targetLobe === 'cerebellum'
      ? new THREE.Color(0.90, 0.0, 0.28)
      : new THREE.Color(0.18, 0.02, 0.10);
    cerMat.emissive.copy(cerTarget);

    // Brainstem
    const stemTarget = targetLobe === 'brainstem'
      ? new THREE.Color(0.04, 0.55, 0.36)
      : new THREE.Color(0.02, 0.18, 0.12);
    stemMat.emissive.copy(stemTarget);

    // Wireframe accent
    (this.leftWireMesh.material as THREE.MeshBasicMaterial).color.copy(targetColor);
    (this.rightWireMesh.material as THREE.MeshBasicMaterial).color.copy(targetColor);
  }

  /**
   * 5-Stage Cinematic Synaptic Shockwave Surge (double-tap / double-click)
   */
  public triggerSynapticSurge(targetPoint?: THREE.Vector3, onStageChange?: (stage: string, intensity: number) => void) {
    if (this.isSurging) return;
    this.isSurging    = true;
    this.surgeIntensity = 1.0;
    this.surgeCallback  = onStageChange;

    // Stage 1: ANTICIPATION (0 → 450ms)
    this.audio.playAnticipationRiser(0.45);
    this.surgeCallback?.('ANTICIPATION', 0.5);

    setTimeout(() => {
      // Stage 2: SILENCE (450 → 550ms)
      this.audio.playSilenceMoment(0.1);
      this.surgeCallback?.('SILENCE', 0.0);

      setTimeout(() => {
        // Stage 3: MASSIVE IMPACT (550ms)
        this.audio.triggerShockwaveImpact();
        this.surgeCallback?.('IMPACT', 1.0);

        for (const n of this.nodes) {
          n.residualMemory = Math.min(0.95, n.residualMemory + 0.70);
        }

        setTimeout(() => {
          // Stage 4: REVEAL (950ms)
          this.audio.playRevealChime();
          this.surgeCallback?.('REVEAL', 0.6);

          setTimeout(() => {
            // Stage 5: CALM (1800ms)
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
   * - Anatomical breathing rhythm
   * - Action potential pulse traversal
   * - Node alpha pulses with residual memory decay
   * - Reticle rotation
   */
  public update(delta: number, time: number) {
    // 1. Gentle cerebral breathing
    const breathScale = 1.0 + Math.sin(time * 1.4) * 0.012 + (this.isSurging ? Math.sin(time * 22.0) * 0.030 : 0);
    this.leftHemisphereMesh.scale.set(breathScale, breathScale, breathScale);
    this.rightHemisphereMesh.scale.set(breathScale, breathScale, breathScale);
    this.leftWireMesh.scale.set(breathScale, breathScale, breathScale);
    this.rightWireMesh.scale.set(breathScale, breathScale, breathScale);

    // 2. Action potential traversal — STRICT color clamping [0, 0.90]
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
      const intensity = isActive ? 0.90 : 0.22;  // NEVER exceed 0.90

      pulseColArr[p * 3 + 0] = Math.min(0.90, fascicle.color.r * intensity);
      pulseColArr[p * 3 + 1] = Math.min(0.90, fascicle.color.g * intensity);
      pulseColArr[p * 3 + 2] = Math.min(0.90, fascicle.color.b * intensity);
    }

    this.pulseGeometry.attributes.position.needsUpdate = true;
    this.pulseGeometry.attributes.color.needsUpdate    = true;

    // 3. Instanced nodes — brightness clamped at 0.85 per channel
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
      // Hard clamp — no white blowout ever
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
