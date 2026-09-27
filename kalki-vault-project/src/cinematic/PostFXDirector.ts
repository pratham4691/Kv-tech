import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { PerformanceDirector } from '../performance/PerformanceDirector';

/**
 * KALKI VAULT — PostFX Director
 * Film-grade post-processing: UnrealBloom, color grading, vignette,
 * scanlines, chromatic aberration and film grain in one composite pass.
 * LOW tier gracefully degrades to a plain tone-mapped render.
 */
export class PostFXDirector {
  public composer!: EffectComposer;
  private bloomPass: UnrealBloomPass | null = null;
  private gradePass: ShaderPass | null = null;
  private targetBloom = 0.85;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    perf: PerformanceDirector,
  ) {
    this.composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    if (perf.profile.tier === 'LOW') {
      this.composer.addPass(new OutputPass());
      return;
    }

    // Bloom — the cinematic glow engine for emissive nodes, pulses and particles.
    // Threshold tuned HIGH so only the brightest emissive neural nodes halo;
    // the cortex surface itself must stay crisp (no white-blob regression).
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      perf.profile.tier === 'HIGH' ? 0.55 : 0.4,  // strength
      0.7,                                        // radius
      0.72,                                       // threshold — cortex (~0.3 luminance) stays clean
    );
    this.composer.addPass(this.bloomPass);

    // One composite grade shader: vignette + scanlines + chromatic aberration + grain + grade
    this.gradePass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uVignette: { value: 1.0 },
        uScan: { value: 0.045 },
        uCA: { value: 0.0016 },
        uGrain: { value: 0.05 },
        uImpact: { value: 0.0 }, // 0..1 spike on synaptic surge impact
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform float uVignette;
        uniform float uScan;
        uniform float uCA;
        uniform float uGrain;
        uniform float uImpact;
        varying vec2 vUv;

        float hash(vec2 p) {
          p = fract(p * vec2(443.897, 441.423));
          p += dot(p, p.yx);
          return fract(p.x * p.y);
        }

        void main() {
          vec2 uv = vUv;
          vec2 dir = uv - 0.5;
          float dist2 = dot(dir, dir);

          // Impact pulse: radial punch + strong chromatic split
          vec2 impactZoom = dir * (uImpact * 0.035);
          vec2 caOffset = dir * (uCA + uImpact * 0.012) * (0.5 + 2.0 * dist2);

          vec3 col;
          col.r = texture2D(tDiffuse, uv + caOffset - impactZoom).r;
          col.g = texture2D(tDiffuse, uv).g;
          col.b = texture2D(tDiffuse, uv - caOffset + impactZoom).b;

          // Subtle cinematic teal/orange film grade
          col = pow(col, vec3(0.96, 1.0, 1.04));
          col *= vec3(1.03, 1.0, 1.02);
          col += vec3(0.0, 0.010, 0.020) * max(0.0, 1.0 - dist2 * 2.2);

          // Rolling scanlines
          float scan = sin((uv.y + uTime * 0.02) * 900.0) * uScan;
          col -= scan;

          // Animated film grain
          float g = hash(uv * vec2(1620.0, 1080.0) + fract(uTime) * 43.7) - 0.5;
          col += g * uGrain;

          // Cinematic vignette
          float vig = smoothstep(0.95, 0.25, length(dir) * (1.35 - uImpact * 0.25));
          col *= mix(1.0, vig, uVignette);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    this.composer.addPass(this.gradePass);
    this.composer.addPass(new OutputPass());

    this.targetBloom = perf.profile.tier === 'HIGH' ? 0.55 : 0.4;
  }

  public update(delta: number, time: number) {
    if (this.gradePass) {
      const u = this.gradePass.uniforms;
      u.uTime.value = time;
      // Decay the impact spike
      if (u.uImpact.value > 0) {
        u.uImpact.value = Math.max(0, u.uImpact.value - delta * 2.6);
      }
    }
    if (this.bloomPass) {
      // Ease bloom strength toward target for smooth state transitions
      this.bloomPass.strength += (this.targetBloom - this.bloomPass.strength) * Math.min(1, delta * 4);
    }
  }

  /** Momentary impact kick: zoom punch, chromatic split, vignette squeeze */
  public triggerImpactKick() {
    if (this.gradePass) this.gradePass.uniforms.uImpact.value = 1.0;
  }

  /** Cinematic state hook — bloom breathing with the scene mood */
  public setMood(mood: 'CALM' | 'TENSION' | 'ACCELERATION' | 'IMPACT' | 'REVEAL' | 'SILENCE') {
    switch (mood) {
      case 'IMPACT':       this.targetBloom = 1.15; break;
      case 'TENSION':      this.targetBloom = 0.7;  break;
      case 'ACCELERATION': this.targetBloom = 0.8;  break;
      case 'REVEAL':       this.targetBloom = 0.85; break;
      case 'SILENCE':      this.targetBloom = 0.3;  break;
      default:             this.targetBloom = 0.55; break;
    }
  }

  public setSize(width: number, height: number) {
    this.composer.setSize(width, height);
    this.bloomPass?.setSize(width, height);
  }

  public dispose() {
    this.bloomPass?.dispose();
    this.gradePass?.dispose?.();
    this.composer.dispose();
  }
}
