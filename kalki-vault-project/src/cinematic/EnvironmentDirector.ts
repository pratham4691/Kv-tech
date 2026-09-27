import * as THREE from 'three';
import type { PerformanceDirector } from '../performance/PerformanceDirector';

/**
 * KALKI VAULT — Environment Director
 * The deep-space cinematic environment around the brain:
 *  - Parallax starfield (3 shells, twinkle shader)
 *  - Drifting aurora nebula ribbons (custom fbm-ish shader, additive)
 *  - Radial core glow billboard behind the brain
 *  - Expanding shock rings on surge impact
 * All density scales with PerformanceDirector tier.
 */
export class EnvironmentDirector {
  public group = new THREE.Group();

  private stars: { points: THREE.Points; mat: THREE.ShaderMaterial; speed: number }[] = [];
  private nebulae: THREE.Mesh[] = [];
  private nebulaMats: THREE.ShaderMaterial[] = [];
  private coreGlow!: THREE.Sprite;
  private shockRings: {
    mesh: THREE.Mesh;
    mat: THREE.MeshBasicMaterial;
    life: number;
    duration: number;
    axis: THREE.Vector3;
  }[] = [];
  private disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  constructor(scene: THREE.Scene, perf: PerformanceDirector) {
    const tier = perf.profile.tier;
    if (tier !== 'LOW') this.createStarfield(tier === 'HIGH' ? 1400 : 700);
    if (tier === 'HIGH') this.createNebulae();
    this.createCoreGlow();
    scene.add(this.group);
  }

  // ─────────────────────────── Starfield ───────────────────────────

  private createStarfield(count: number) {
    const shellDefs = [
      { radius: 26, size: 0.16, speed: 0.006, opacity: 0.95 },
      { radius: 34, size: 0.12, speed: 0.003, opacity: 0.7 },
      { radius: 44, size: 0.09, speed: 0.0015, opacity: 0.5 },
    ];

    const palette = [
      new THREE.Color('#bfefff'),
      new THREE.Color('#9fd8ff'),
      new THREE.Color('#e8f6ff'),
      new THREE.Color('#ffe9c4'),
      new THREE.Color('#d6b3ff'),
    ];

    for (const def of shellDefs) {
      const positions = new Float32Array(count * 3);
      const seeds = new Float32Array(count);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        // Even distribution on sphere surface with slight radial jitter
        const u = Math.random() * 2 - 1;
        const theta = Math.random() * Math.PI * 2;
        const r = def.radius * (0.85 + Math.random() * 0.3);
        const s = Math.sqrt(1 - u * u);
        positions[i * 3 + 0] = r * s * Math.cos(theta);
        positions[i * 3 + 1] = r * u;
        positions[i * 3 + 2] = r * s * Math.sin(theta);
        seeds[i] = Math.random() * 100;

        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3 + 0] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
      geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: def.size },
          uOpacity: { value: def.opacity },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        },
        vertexShader: /* glsl */ `
          attribute float aSeed;
          attribute vec3 aColor;
          uniform float uTime;
          uniform float uSize;
          uniform float uPixelRatio;
          varying float vTwinkle;
          varying vec3 vColor;
          void main() {
            vColor = aColor;
            vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + fract(aSeed) * 1.7) + aSeed * 7.0);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = uSize * uPixelRatio * (120.0 / -mv.z) * (0.8 + 0.4 * vTwinkle);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vTwinkle;
          varying vec3 vColor;
          uniform float uOpacity;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            float core = smoothstep(0.5, 0.0, d);
            float glow = smoothstep(0.5, 0.12, d);
            float alpha = (core * 0.9 + glow * 0.35) * vTwinkle * uOpacity;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      this.group.add(points);
      this.stars.push({ points, mat, speed: def.speed });
      this.disposables.push(geo, mat);
    }
  }

  // ─────────────────────────── Nebulae ───────────────────────────

  private createNebulae() {
    const defs = [
      { colorA: '#00f0ff', colorB: '#7c3aed', pos: [-18, 6, -26] as const, scale: 34, drift: 0.010 },
      { colorA: '#ff0055', colorB: '#2b1b8f', pos: [20, -8, -30] as const, scale: 40, drift: -0.007 },
      { colorA: '#10b981', colorB: '#06251f', pos: [2, 16, -36] as const, scale: 46, drift: 0.005 },
    ];

    for (const def of defs) {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color(def.colorA) },
          uColorB: { value: new THREE.Color(def.colorB) },
          uDrift: { value: def.drift },
          uOpacity: { value: 0.0 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uDrift;
          uniform float uOpacity;
          varying vec2 vUv;

          vec2 hash2(vec2 p) {
            p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
            return fract(sin(p) * 43758.5453);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                  dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
              mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                  dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
              u.y);
          }

          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.55;
            for (int i = 0; i < 4; i++) {
              v += a * noise(p);
              p = p * 2.1 + vec2(17.0, 9.0);
              a *= 0.5;
            }
            return v;
          }

          void main() {
            vec2 p = vUv * 3.0;
            p.x += uTime * uDrift;
            p.y += uTime * uDrift * 0.6;
            float n = fbm(p);
            float wisps = fbm(p * 1.8 + n * 1.5 + uTime * uDrift * 2.0);
            float density = smoothstep(0.35, 0.95, n * 0.7 + wisps * 0.6);
            // Soft round falloff so the quad edges never show
            float falloff = smoothstep(0.5, 0.08, distance(vUv, vec2(0.5)));
            vec3 col = mix(uColorB, uColorA, density);
            gl_FragColor = vec4(col, density * falloff * uOpacity);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const geo = new THREE.PlaneGeometry(def.scale, def.scale);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(def.pos[0], def.pos[1], def.pos[2]);
      mesh.lookAt(0, 0, 0);
      mesh.frustumCulled = false;
      this.group.add(mesh);
      this.nebulae.push(mesh);
      this.nebulaMats.push(mat);
      this.disposables.push(geo, mat);
    }
  }

  // ─────────────────────────── Core Glow ───────────────────────────

  private createCoreGlow() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0.0, 'rgba(70, 190, 255, 0.55)');
    grad.addColorStop(0.22, 'rgba(0, 140, 255, 0.28)');
    grad.addColorStop(0.5, 'rgba(60, 50, 200, 0.10)');
    grad.addColorStop(1.0, 'rgba(0, 0, 40, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.coreGlow = new THREE.Sprite(mat);
    this.coreGlow.scale.set(7.5, 7.5, 1);
    this.coreGlow.position.set(0, 0.1, -1.6);
    this.coreGlow.renderOrder = -1;
    this.group.add(this.coreGlow);
    this.disposables.push(tex, mat);
  }

  // ─────────────────────────── Shock Rings ───────────────────────────

  /** Launch an expanding, fading shock ring from a world position. */
  public spawnShockRing(origin: THREE.Vector3, colorHex = '#00f0ff') {
    const geo = new THREE.RingGeometry(0.42, 0.5, 64);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(origin);
    mesh.lookAt(this.cameraPos);
    mesh.frustumCulled = false;
    this.group.add(mesh);
    this.shockRings.push({ mesh, mat, life: 0, duration: 1.5, axis: new THREE.Vector3() });
    this.disposables.push(geo, mat);
  }

  private cameraPos = new THREE.Vector3(0, 0, 6);

  public setCameraPosition(pos: THREE.Vector3) {
    this.cameraPos.copy(pos);
  }

  // ─────────────────────────── Update ───────────────────────────

  public setNebulaIntensity(v: number) {
    for (const m of this.nebulaMats) m.uniforms.uOpacity.value = v;
  }

  public update(delta: number, time: number, camera: THREE.PerspectiveCamera) {
    // Stars: slow differential rotation + twinkle
    for (const s of this.stars) {
      s.points.rotation.y += s.speed * delta * 12;
      s.mat.uniforms.uTime.value = time;
    }

    // Nebula drift + gentle breathing opacity
    for (let i = 0; i < this.nebulae.length; i++) {
      this.nebulaMats[i].uniforms.uTime.value = time;
      const base = 0.5 + Math.sin(time * 0.25 + i * 2.1) * 0.12;
      this.nebulaMats[i].uniforms.uOpacity.value = base;
    }

    // Core glow breathing
    if (this.coreGlow) {
      const pulse = 1.0 + Math.sin(time * 1.1) * 0.06 + Math.sin(time * 0.37) * 0.04;
      this.coreGlow.scale.set(7.5 * pulse, 7.5 * pulse, 1);
      (this.coreGlow.material as THREE.SpriteMaterial).opacity = 0.5 + Math.sin(time * 1.6) * 0.08;
    }

    // Shock rings: expand + fade + billboard toward camera
    this.cameraPos.copy(camera.position);
    for (let i = this.shockRings.length - 1; i >= 0; i--) {
      const r = this.shockRings[i];
      r.life += delta;
      const t = r.life / r.duration;
      if (t >= 1) {
        this.group.remove(r.mesh);
        (r.mesh.geometry as THREE.BufferGeometry).dispose();
        r.mat.dispose();
        this.shockRings.splice(i, 1);
        continue;
      }
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const scale = 1 + eased * 14;
      r.mesh.scale.set(scale, scale, scale);
      r.mat.opacity = 0.9 * (1 - eased);
      r.mesh.lookAt(camera.position);
    }
  }

  public dispose() {
    for (const d of this.disposables) d.dispose();
    this.disposables = [];
    if (this.group.parent) this.group.parent.remove(this.group);
  }
}
