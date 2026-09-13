import * as THREE from 'three';

export class AtmosphereDirector {
  public group: THREE.Group;
  
  // Lighting System
  public ambientLight!: THREE.AmbientLight;
  public keyRimLight!: THREE.DirectionalLight;
  public fillLight!: THREE.DirectionalLight;
  public orbitPointLight!: THREE.PointLight;
  public lightningFlashLight!: THREE.PointLight;

  // Volumetric-style Light Cone
  private lightBeamMesh!: THREE.Mesh;

  // State
  private targetFogColor = new THREE.Color('#020409');
  private currentFogColor = new THREE.Color('#020409');
  private lightningTimer = 0;
  private isFlashing = false;

  constructor(private scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.setupLighting();
    this.setupAtmosphericFog();
    this.setupVolumetricBeam();
  }

  private setupLighting() {
    // 1. Ambient soft environmental base
    this.ambientLight = new THREE.AmbientLight(0x040a18, 2.5);
    this.group.add(this.ambientLight);

    // 2. Strong Rim/Backlight (cyan)
    this.keyRimLight = new THREE.DirectionalLight(0x00f0ff, 5.0);
    this.keyRimLight.position.set(2, 4, -4);
    this.group.add(this.keyRimLight);

    // 3. Subtle Fill light (purple/blue)
    this.fillLight = new THREE.DirectionalLight(0xa855f7, 1.4);
    this.fillLight.position.set(-3, -2, 3);
    this.group.add(this.fillLight);

    // 4. Orbiting dynamic point light
    this.orbitPointLight = new THREE.PointLight(0x00f0ff, 2.5, 10);
    this.orbitPointLight.position.set(0, 0, 3);
    this.group.add(this.orbitPointLight);

    // 5. High-voltage lightning flash light
    this.lightningFlashLight = new THREE.PointLight(0xffffff, 0, 40);
    this.lightningFlashLight.position.set(0, 5, 2);
    this.group.add(this.lightningFlashLight);
  }

  private setupAtmosphericFog() {
    this.scene.fog = new THREE.FogExp2(0x020409, 0.015);
  }

  private setupVolumetricBeam() {
    // Volumetric beam disabled to prevent hazy artifacts around the anatomical brain
  }

  public setColorGrade(colorHex: string) {
    const col = new THREE.Color(colorHex);
    this.keyRimLight.color.lerp(col, 0.8);
    this.orbitPointLight.color.lerp(col, 0.9);
    if (this.lightBeamMesh) {
      (this.lightBeamMesh.material as THREE.ShaderMaterial).uniforms.uColor.value.lerp(col, 0.8);
    }
  }

  public triggerLightningFlash() {
    if (this.isFlashing) return;
    this.isFlashing = true;
    this.lightningFlashLight.intensity = 16.0;
    this.keyRimLight.intensity = 8.0;

    // Flash double-pulse like atmospheric lightning
    setTimeout(() => {
      this.lightningFlashLight.intensity = 2.0;
      setTimeout(() => {
        this.lightningFlashLight.intensity = 12.0;
        setTimeout(() => {
          this.lightningFlashLight.intensity = 0.0;
          this.keyRimLight.intensity = 3.2;
          this.isFlashing = false;
        }, 120);
      }, 50);
    }, 80);
  }

  public update(delta: number, time: number) {
    // 1. Moving orbiting light source
    this.orbitPointLight.position.x = Math.sin(time * 0.6) * 3.2;
    this.orbitPointLight.position.y = Math.cos(time * 0.4) * 2.2;
    this.orbitPointLight.position.z = Math.cos(time * 0.6) * 3.2;

    // 2. Slow volumetric light beam drift
    if (this.lightBeamMesh) {
      this.lightBeamMesh.rotation.y = time * 0.04;
    }

    // 3. Periodic controlled lightning flash (every 18-25 seconds)
    this.lightningTimer += delta;
    if (this.lightningTimer > 22.0) {
      this.lightningTimer = 0;
      this.triggerLightningFlash();
    }
  }
}
