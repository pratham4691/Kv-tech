import * as THREE from 'three';
import { AudioDirector } from '../audio/AudioDirector';
import { PerformanceDirector } from '../performance/PerformanceDirector';

export interface BrainNode {
  position: THREE.Vector3;
  originalPos: THREE.Vector3;
  lobe: 'frontal' | 'parietal' | 'temporal' | 'occipital' | 'cerebellum' | 'brainstem' | 'corpus_callosum';
  isLeft: boolean;
  activation: number;
  residualMemory: number;
  pulsePhase: number;
  depth: number;
}

export interface SynapticEdge {
  sourceIdx: number;
  targetIdx: number;
  length: number;
  activePulse: number; // 0 to 1
  pulseSpeed: number;
  lobe: string;
}

export class BrainEngine {
  public group: THREE.Group;
  public nodes: BrainNode[] = [];
  public edges: SynapticEdge[] = [];
  
  // Three.js Render Objects
  private instancedNodes!: THREE.InstancedMesh;
  private lineSegments!: THREE.LineSegments;
  private lineGeometry!: THREE.BufferGeometry;
  private pulsePoints!: THREE.Points;
  private pulseGeometry!: THREE.BufferGeometry;
  private dummy = new THREE.Object3D();
  private colorHelper = new THREE.Color();

  // Internal biological core mesh (for dark wet organic silhouette)
  private organicCoreMesh!: THREE.Mesh;
  
  // Interaction & Surges
  private isSurging = false;
  private surgeProgress = 0;
  private surgeFocusNode: BrainNode | null = null;
  private surgeCallback?: (stage: string, intensity: number) => void;

  // Lobe Color Coding (Sophisticated dark biological palette with vibrant synaptic neon)
  public readonly LOBE_PALETTES = {
    frontal: new THREE.Color('#00f0ff'),
    parietal: new THREE.Color('#38bdf8'),
    temporal: new THREE.Color('#a855f7'),
    occipital: new THREE.Color('#f59e0b'),
    cerebellum: new THREE.Color('#ff0055'),
    brainstem: new THREE.Color('#10b981'),
    corpus_callosum: new THREE.Color('#e2e8f0'),
  };

  constructor(
    private scene: THREE.Scene,
    private audio: AudioDirector,
    private perf: PerformanceDirector
  ) {
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.buildAnatomy();
    this.createOrganicCore();
    this.createInstancedMeshes();
  }

  /**
   * Generates 1,400+ anatomical nodes with Left/Right hemispheres,
   * deep longitudinal fissure, Sylvian fissure, gyri/sulci folding,
   * horizontally striated cerebellar folia, and descending brainstem.
   */
  private buildAnatomy() {
    this.nodes = [];
    this.edges = [];

    // 1. CORTICAL HEMISPHERES (Left & Right)
    const NODES_PER_HEMISPHERE = 520;
    for (let h = 0; h < 2; h++) {
      const isLeft = (h === 0);
      const signX = isLeft ? -1 : 1;

      for (let i = 0; i < NODES_PER_HEMISPHERE; i++) {
        const u = i / NODES_PER_HEMISPHERE;
        // Spherical distribution with anatomical ellipsoid stretching
        const theta = Math.acos(1 - 1.9 * u);
        const phi = Math.PI * (1 + Math.sqrt(5)) * i;

        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);
        const sinP = Math.sin(phi);
        const cosP = Math.cos(phi);

        const rx = 1.35;
        const ry = 1.15;
        const rz = 1.65;

        // Base coordinate
        let y = -cosT * ry;
        let z = sinT * sinP * rz;
        // Keep clear deep longitudinal fissure between left and right hemispheres (0.28 unit gap)
        let x = signX * (0.22 + Math.abs(sinT * cosP) * rx);

        // Classify anatomical lobe
        let lobe: BrainNode['lobe'] = 'parietal';
        if (z > 0.35) {
          lobe = 'frontal';
        } else if (z < -0.65 && y > -0.2) {
          lobe = 'occipital';
        } else if (y >= 0.15 && Math.abs(x) > 0.7) {
          lobe = 'temporal';
        }

        // Procedural gyri and sulci cortical folding
        const gyri = (
          Math.sin(u * 28 + phi * 4) * 0.12 +
          Math.cos(phi * 12) * 0.08 +
          Math.sin(theta * 10) * 0.06
        );

        // Sylvian fissure groove (separating temporal lobe from frontal/parietal)
        let sylvian = 0;
        if (y > 0.05 && y < 0.35 && z > -0.3 && z < 0.5) {
          sylvian = -0.15;
        }

        x += (x > 0 ? 1 : -1) * (Math.abs(gyri) * 0.07 + sylvian);
        y += gyri * 0.08;
        z += gyri * 0.07;

        const pos = new THREE.Vector3(x, y, z);
        this.nodes.push({
          position: pos.clone(),
          originalPos: pos.clone(),
          lobe,
          isLeft,
          activation: 0.15 + Math.random() * 0.3,
          residualMemory: 0.05,
          pulsePhase: Math.random() * Math.PI * 2,
          depth: Math.sqrt(x * x + y * y + z * z),
        });
      }

      // Dedicated tucked Temporal Lobe nodes (under lateral sulcus)
      for (let t = 0; t < 50; t++) {
        const tu = t / 50;
        const tx = signX * (0.85 + Math.sin(tu * Math.PI) * 0.45);
        const ty = 0.35 + tu * 0.4 + Math.sin(t * 1.5) * 0.06;
        const tz = -0.25 + tu * 0.9;
        const pos = new THREE.Vector3(tx, ty, tz);
        this.nodes.push({
          position: pos.clone(),
          originalPos: pos.clone(),
          lobe: 'temporal',
          isLeft,
          activation: 0.2,
          residualMemory: 0.05,
          pulsePhase: Math.random() * Math.PI * 2,
          depth: pos.length(),
        });
      }
    }

    // 2. CEREBELLUM with horizontal folia striations (220 nodes)
    for (let c = 0; c < 220; c++) {
      const isLeft = (c < 110);
      const signX = isLeft ? -1 : 1;
      const cu = (c % 110) / 110;
      const ctheta = cu * Math.PI * 0.9;
      const cphi = c * 2.8;

      // Tight striated lobes tucked beneath occipital
      const cx = signX * (0.25 + Math.abs(Math.sin(ctheta) * Math.cos(cphi)) * 0.75);
      // Horizontal folia ripples: Math.sin(cu * 36)
      const cy = 0.95 + Math.sin(ctheta) * Math.sin(cphi) * 0.45 + Math.sin(cu * 36) * 0.05;
      const cz = -1.05 + Math.cos(ctheta) * 0.52;

      const pos = new THREE.Vector3(cx, cy, cz);
      this.nodes.push({
        position: pos.clone(),
        originalPos: pos.clone(),
        lobe: 'cerebellum',
        isLeft,
        activation: 0.25,
        residualMemory: 0.05,
        pulsePhase: Math.random() * Math.PI * 2,
        depth: pos.length(),
      });
    }

    // 3. BRAINSTEM (Pons & Medulla Oblongata) - 90 nodes
    for (let b = 0; b < 90; b++) {
      const bu = b / 90;
      const angle = b * 1.6;
      // Pons bulbous swelling near top (bu < 0.4), narrowing down to medulla
      const radius = bu < 0.35 ? 0.25 : 0.16;
      const bx = Math.cos(angle) * radius * (0.6 + Math.random() * 0.4);
      const by = 0.85 + bu * 1.35;
      const bz = -0.3 + Math.sin(angle) * (radius * 0.7);

      const pos = new THREE.Vector3(bx, by, bz);
      this.nodes.push({
        position: pos.clone(),
        originalPos: pos.clone(),
        lobe: 'brainstem',
        isLeft: bx < 0,
        activation: 0.3,
        residualMemory: 0.05,
        pulsePhase: Math.random() * Math.PI * 2,
        depth: pos.length(),
      });
    }

    // 4. CORPUS CALLOSUM bridging tract (50 nodes)
    for (let cc = 0; cc < 50; cc++) {
      const ccu = cc / 50;
      const sign = (cc % 2 === 0) ? -1 : 1;
      const ccx = sign * (0.06 + Math.random() * 0.12);
      const ccy = -0.1 + Math.sin(ccu * Math.PI) * 0.3;
      const ccz = -0.6 + ccu * 1.1;

      const pos = new THREE.Vector3(ccx, ccy, ccz);
      this.nodes.push({
        position: pos.clone(),
        originalPos: pos.clone(),
        lobe: 'corpus_callosum',
        isLeft: sign < 0,
        activation: 0.4,
        residualMemory: 0.05,
        pulsePhase: Math.random() * Math.PI * 2,
        depth: pos.length(),
      });
    }

    // 5. SYNAPTIC ADJACENCY TRACTS
    for (let i = 0; i < this.nodes.length; i++) {
      const n1 = this.nodes[i];
      let connections = 0;
      const maxConn = 3;

      for (let j = i + 1; j < this.nodes.length && connections < maxConn; j++) {
        const n2 = this.nodes[j];
        // Connect within same hemisphere or across corpus callosum
        if (n1.isLeft === n2.isLeft || n1.lobe === 'corpus_callosum' || n2.lobe === 'corpus_callosum') {
          const dist = n1.position.distanceTo(n2.position);
          if (dist < 0.36) {
            this.edges.push({
              sourceIdx: i,
              targetIdx: j,
              length: dist,
              activePulse: Math.random(),
              pulseSpeed: 0.008 + Math.random() * 0.016,
              lobe: n1.lobe,
            });
            connections++;
          }
        }
      }
    }
  }

  /**
   * Internal biological core with dark wet organic reflectivity,
   * giving the brain volume, depth, and specular sheen.
   */
  private createOrganicCore() {
    const coreGeo = new THREE.SphereGeometry(1.2, 32, 24);
    // Scale to match anatomical ellipsoid proportions
    coreGeo.scale(1.15, 0.95, 1.35);

    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x020610,
      roughness: 0.28,
      metalness: 0.85,
      emissive: 0x001224,
      emissiveIntensity: 0.2,
      wireframe: false,
    });

    this.organicCoreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.organicCoreMesh.position.set(0, 0.1, -0.1);
    this.group.add(this.organicCoreMesh);
  }

  /**
   * Creates GPU instanced meshes for 1,400+ nodes and synaptic tract lines.
   */
  private createInstancedMeshes() {
    // 1. INSTANCED NODES
    const sphereGeo = new THREE.SphereGeometry(0.024, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });

    this.instancedNodes = new THREE.InstancedMesh(sphereGeo, nodeMat, this.nodes.length);
    this.instancedNodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      this.dummy.position.copy(n.position);
      this.dummy.scale.setScalar(1.0);
      this.dummy.updateMatrix();
      this.instancedNodes.setMatrixAt(i, this.dummy.matrix);

      const lobeColor = this.LOBE_PALETTES[n.lobe] || this.LOBE_PALETTES.frontal;
      this.instancedNodes.setColorAt(i, lobeColor);
    }
    this.instancedNodes.instanceMatrix.needsUpdate = true;
    if (this.instancedNodes.instanceColor) this.instancedNodes.instanceColor.needsUpdate = true;
    this.group.add(this.instancedNodes);

    // 2. SYNAPTIC TRACT LINES
    const positions = new Float32Array(this.edges.length * 6);
    const colors = new Float32Array(this.edges.length * 6);

    for (let e = 0; e < this.edges.length; e++) {
      const edge = this.edges[e];
      const p1 = this.nodes[edge.sourceIdx].position;
      const p2 = this.nodes[edge.targetIdx].position;

      positions[e * 6 + 0] = p1.x;
      positions[e * 6 + 1] = p1.y;
      positions[e * 6 + 2] = p1.z;
      positions[e * 6 + 3] = p2.x;
      positions[e * 6 + 4] = p2.y;
      positions[e * 6 + 5] = p2.z;

      const c = this.LOBE_PALETTES[edge.lobe as keyof typeof this.LOBE_PALETTES] || this.LOBE_PALETTES.frontal;
      colors[e * 6 + 0] = c.r * 0.4;
      colors[e * 6 + 1] = c.g * 0.4;
      colors[e * 6 + 2] = c.b * 0.4;
      colors[e * 6 + 3] = c.r * 0.4;
      colors[e * 6 + 4] = c.g * 0.4;
      colors[e * 6 + 5] = c.b * 0.4;
    }

    this.lineGeometry = new THREE.BufferGeometry();
    this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.lineGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    this.lineSegments = new THREE.LineSegments(this.lineGeometry, lineMat);
    this.group.add(this.lineSegments);

    // 3. TRAVELING SYNAPTIC ACTION POTENTIALS (Pulses)
    const pulseCount = Math.min(this.edges.length, 180);
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseColors = new Float32Array(pulseCount * 3);

    for (let p = 0; p < pulseCount; p++) {
      pulsePositions[p * 3] = 0;
      pulsePositions[p * 3 + 1] = 0;
      pulsePositions[p * 3 + 2] = 0;

      pulseColors[p * 3] = 1.0;
      pulseColors[p * 3 + 1] = 0.95;
      pulseColors[p * 3 + 2] = 0.6;
    }

    this.pulseGeometry = new THREE.BufferGeometry();
    this.pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    this.pulseGeometry.setAttribute('color', new THREE.BufferAttribute(pulseColors, 3));

    const pulseMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    this.pulsePoints = new THREE.Points(this.pulseGeometry, pulseMat);
    this.group.add(this.pulsePoints);
  }

  /**
   * Continuous neural activity tick:
   * subtle rhythmic pulses, traveling action potentials, organic breathing,
   * and progressive accumulation of neural memory.
   */
  public update(delta: number, time: number) {
    // 1. Subtle rhythmic breathing of the anatomical core
    const breath = 1.0 + Math.sin(time * 1.8) * 0.02;
    this.organicCoreMesh.scale.set(1.15 * breath, 0.95 * breath, 1.35 * breath);

    // 2. Continuous traveling synaptic action potentials
    const pulsePositions = this.pulseGeometry.attributes.position.array as Float32Array;
    const pulseColors = this.pulseGeometry.attributes.color.array as Float32Array;
    const pulseCount = pulsePositions.length / 3;

    for (let p = 0; p < pulseCount; p++) {
      const edge = this.edges[p % this.edges.length];
      if (!edge) continue;

      edge.activePulse += edge.pulseSpeed * (this.isSurging ? 3.5 : 1.0);
      if (edge.activePulse > 1) {
        edge.activePulse = 0;
      }

      const p1 = this.nodes[edge.sourceIdx].position;
      const p2 = this.nodes[edge.targetIdx].position;
      const t = edge.activePulse;

      pulsePositions[p * 3 + 0] = p1.x + (p2.x - p1.x) * t;
      pulsePositions[p * 3 + 1] = p1.y + (p2.y - p1.y) * t;
      pulsePositions[p * 3 + 2] = p1.z + (p2.z - p1.z) * t;

      // Color shifts if lobe has residual interaction memory
      const srcNode = this.nodes[edge.sourceIdx];
      const lobeColor = this.LOBE_PALETTES[srcNode.lobe] || this.LOBE_PALETTES.frontal;
      
      const glow = Math.min(1.0, 0.5 + srcNode.residualMemory * 1.5 + (this.isSurging ? 0.8 : 0));
      pulseColors[p * 3 + 0] = THREE.MathUtils.lerp(1.0, lobeColor.r, 0.3) * glow;
      pulseColors[p * 3 + 1] = THREE.MathUtils.lerp(0.95, lobeColor.g, 0.3) * glow;
      pulseColors[p * 3 + 2] = THREE.MathUtils.lerp(0.6, lobeColor.b, 0.3) * glow;
    }
    this.pulseGeometry.attributes.position.needsUpdate = true;
    this.pulseGeometry.attributes.color.needsUpdate = true;

    // 3. Node micro-pulses and memory decay/retention
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      n.pulsePhase += delta * 2.2;
      const wave = Math.sin(n.pulsePhase) * 0.3 + 0.7;

      // Interaction memory decays very slowly so it accumulates across the session
      n.residualMemory = Math.max(0.05, n.residualMemory - delta * 0.005);

      const nodeScale = (0.8 + wave * 0.4 + n.residualMemory * 1.2) * (this.isSurging ? 1.5 : 1.0);
      this.dummy.position.copy(n.position);
      this.dummy.scale.setScalar(nodeScale);
      this.dummy.updateMatrix();
      this.instancedNodes.setMatrixAt(i, this.dummy.matrix);

      const lobeColor = this.LOBE_PALETTES[n.lobe];
      this.colorHelper.copy(lobeColor).multiplyScalar(0.4 + n.residualMemory * 2.0 + wave * 0.3);
      if (this.isSurging) {
        this.colorHelper.addScalar(0.4);
      }
      this.instancedNodes.setColorAt(i, this.colorHelper);
    }
    this.instancedNodes.instanceMatrix.needsUpdate = true;
    if (this.instancedNodes.instanceColor) this.instancedNodes.instanceColor.needsUpdate = true;
  }

  /**
   * Double-Tap / Double-Click Cinematic Synaptic Surge
   * Anticipation -> Pause -> Silence -> Massive golden/cyan discharge -> Shockwave -> Camera Push -> Recovery.
   */
  public triggerSynapticSurge(targetPoint?: THREE.Vector3, onStageChange?: (stage: string, intensity: number) => void) {
    if (this.isSurging) return;
    this.isSurging = true;
    this.surgeCallback = onStageChange;

    // 1. Gather neural activity to closest node
    let closestNode = this.nodes[0];
    let minDist = Infinity;
    if (targetPoint) {
      for (const n of this.nodes) {
        const d = n.position.distanceTo(targetPoint);
        if (d < minDist) {
          minDist = d;
          closestNode = n;
        }
      }
    } else {
      closestNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
    }
    this.surgeFocusNode = closestNode;

    // Retain neural state memory for this lobe
    closestNode.residualMemory = Math.min(1.5, closestNode.residualMemory + 0.8);
    for (const n of this.nodes) {
      if (n.lobe === closestNode.lobe) {
        n.residualMemory = Math.min(1.2, n.residualMemory + 0.4);
      }
    }

    // STAGE 1: ANTICIPATION (0ms - 450ms)
    // Audio riser + particle convergence
    this.audio.playAnticipationRiser(0.45);
    this.surgeCallback?.('ANTICIPATION', 0.5);

    setTimeout(() => {
      // STAGE 2: BRIEF SILENCE PAUSE (450ms - 550ms)
      this.audio.playSilenceMoment(0.1);
      this.surgeCallback?.('SILENCE', 0.0);

      setTimeout(() => {
        // STAGE 3: MASSIVE SYNAPTIC DISCHARGE & IMPACT (550ms)
        this.audio.triggerShockwaveImpact();
        this.surgeCallback?.('IMPACT', 1.0);

        // Disperse energy into connected edges
        for (const edge of this.edges) {
          if (edge.sourceIdx === this.nodes.indexOf(closestNode) || edge.targetIdx === this.nodes.indexOf(closestNode)) {
            edge.activePulse = 0;
            edge.pulseSpeed = 0.06;
          }
        }

        setTimeout(() => {
          // STAGE 4: REVEAL & CALM RECOVERY (1200ms)
          this.audio.playRevealChime();
          this.surgeCallback?.('REVEAL', 0.3);

          setTimeout(() => {
            this.isSurging = false;
            this.surgeCallback?.('CALM', 0.0);
          }, 1200);
        }, 650);
      }, 100);
    }, 450);
  }

  public activateLobe(lobeKey: BrainNode['lobe'] | 'all') {
    for (const n of this.nodes) {
      if (lobeKey === 'all' || n.lobe === lobeKey) {
        n.residualMemory = Math.min(1.5, n.residualMemory + 0.5);
      }
    }
    this.audio.playHoverTone(580);
  }

  public dispose() {
    this.instancedNodes.geometry.dispose();
    (this.instancedNodes.material as THREE.Material).dispose();
    this.lineGeometry.dispose();
    (this.lineSegments.material as THREE.Material).dispose();
    this.pulseGeometry.dispose();
    (this.pulsePoints.material as THREE.Material).dispose();
    this.organicCoreMesh.geometry.dispose();
    (this.organicCoreMesh.material as THREE.Material).dispose();
    this.scene.remove(this.group);
  }
}
