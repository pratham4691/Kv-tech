'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface PhoenixCanvasProps {
  scrollProgress: number
  onFlightPassComplete?: () => void
}

export function PhoenixCanvas({ scrollProgress, onFlightPassComplete }: PhoenixCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const fireLightRef = useRef<THREE.PointLight | null>(null)
  const scrollProgressRef = useRef(scrollProgress)
  const flightCompleteCalledRef = useRef(false)

  useEffect(() => {
    scrollProgressRef.current = scrollProgress
  }, [scrollProgress])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 10)

    // 2. High-Fidelity WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35
    container.appendChild(renderer.domElement)

    // 3. Lighting: Warm solar gold & ambient crimson
    const ambient = new THREE.AmbientLight(0xff5511, 1.4)
    scene.add(ambient)

    const keySun = new THREE.DirectionalLight(0xffdd66, 3.8)
    keySun.position.set(5, 7, 8)
    scene.add(keySun)

    const rimCrimson = new THREE.DirectionalLight(0xff2200, 3.5)
    rimCrimson.position.set(-6, -3, -5)
    scene.add(rimCrimson)

    const fireLight = new THREE.PointLight(0xff8811, 4.0, 12)
    fireLight.position.set(0, 0, 1)
    scene.add(fireLight)
    fireLightRef.current = fireLight

    // 4. Subtle Trailing Fiery Spark Plume
    const emberCount = 180
    const emberGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(emberCount * 3)
    const colors = new Float32Array(emberCount * 3)
    const velocities = new Float32Array(emberCount * 3)

    for (let i = 0; i < emberCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6

      // Drift gently to the right behind the leftward-flying bird
      velocities[i * 3] = 0.015 + Math.random() * 0.025
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.015
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015

      const isGold = Math.random() > 0.4
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = isGold ? 0.72 + Math.random() * 0.25 : 0.22
      colors[i * 3 + 2] = 0.02
    }

    emberGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    emberGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const emberMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    })
    const embers = new THREE.Points(emberGeo, emberMat)
    scene.add(embers)

    // 5. Load Textures with Crisp Mipmapping
    const texLoader = new THREE.TextureLoader()
    const diff0 = texLoader.load('/phoenix_diffuse_0.png')
    const emiss0 = texLoader.load('/phoenix_emissive_0.png')
    const diff1 = texLoader.load('/phoenix_diffuse_1.png')
    const emiss1 = texLoader.load('/phoenix_emissive_1.png')

    ;[diff0, diff1, emiss0, emiss1].forEach((tex) => {
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = true
    })

    // Compute visible frustum dimensions at z=0 (camera at z=10)
    const computeFrustum = () => {
      const vFovRad = (camera.fov * Math.PI) / 180
      const frustumH = 2 * Math.tan(vFovRad / 2) * camera.position.z
      const frustumW = frustumH * (container.clientWidth / container.clientHeight)
      return { frustumW, frustumH }
    }

    let { frustumW, frustumH } = computeFrustum()

    // 6. Load Phoenix 3D Model
    const loader = new GLTFLoader()
    loader.load(
      '/phoenix_bird.glb',
      (gltf) => {
        const model = gltf.scene
        modelRef.current = model

        // PRECISE PROPORTION: Set to EXACTLY 1/8th of screen size
        const box = new THREE.Box3().setFromObject(model)
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        
        // Desired size is exactly 1/8th of the viewport height (12.5%)
        const targetDim = frustumH * 0.125
        const scaleFactor = targetDim / maxDim
        model.scale.set(scaleFactor, scaleFactor, scaleFactor)

        // Starting point: Screen Right side, off-screen
        const startX = frustumW * 0.65
        model.position.set(startX, 0.4, 0)

        // Orientation: Facing towards screen left (-X direction)
        // Model naturally faces forward; rotate by +PI/2 to point beak leftwards
        model.rotation.set(0.08, Math.PI / 2, 0)

        // Refined, polished materials
        let meshIdx = 0
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            if (mesh.material) {
              const diffTex = meshIdx === 0 ? diff0 : diff1
              const emissTex = meshIdx === 0 ? emiss0 : emiss1

              const polishedMat = new THREE.MeshStandardMaterial({
                map: diffTex,
                emissiveMap: emissTex,
                emissive: new THREE.Color(0xff4400),
                emissiveIntensity: 1.0,
                roughness: 0.38,
                metalness: 0.12,
                transparent: true,
                alphaTest: 0.08,
              })

              mesh.material = polishedMat
              meshIdx++
            }
          }
        })

        scene.add(model)

        // Skeletal wing flapping animation
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model)
          mixerRef.current = mixer
          const action = mixer.clipAction(gltf.animations[0])
          action.play()
        }

        setLoaded(true)
      },
      undefined,
      (err) => console.error('Error loading phoenix model:', err)
    )

    // 7. Animation Loop with 3.8-Second Smooth Passing Flight
    let animationFrameId: number
    const clock = new THREE.Clock()
    const startTime = performance.now()
    const flightDurationMs = 3800 // Exact 3.8 seconds crossing (between 3 to 5s per user requirement)

    const animate = () => {
      const delta = clock.getDelta()
      const time = clock.getElapsedTime()
      const elapsedMs = performance.now() - startTime
      const progress = scrollProgressRef.current

      // Wing flapping speed
      if (mixerRef.current) {
        mixerRef.current.update(delta * 1.35)
      }

      // Gentle pulsing fire light
      if (fireLightRef.current) {
        fireLightRef.current.intensity = 3.6 + Math.sin(time * 6) * 1.2
      }

      if (modelRef.current) {
        // Natural bird pass from screen RIGHT to screen LEFT
        const tLinear = Math.min(elapsedMs / flightDurationMs, 1.0)
        
        // Smooth aerodynamic fly-by easing
        const tFlight = tLinear < 0.5 
          ? 2 * tLinear * tLinear 
          : 1 - Math.pow(-2 * tLinear + 2, 2) / 2

        const startX = frustumW * 0.65
        const endX = -frustumW * 0.65

        // Fly from right (+X) to left (-X)
        const currentX = startX + (endX - startX) * tFlight

        // Natural wing flapping altitude wave & slight aerodynamic dip
        const flapAltitudeWave = Math.sin(time * 5.5) * 0.06
        const flightPathArc = Math.sin(tFlight * Math.PI) * 0.35
        const baseY = 0.4 - flightPathArc + flapAltitudeWave

        // On scroll down: lifts smoothly upward
        const scrollLift = progress * 8.0

        modelRef.current.position.x = currentX
        modelRef.current.position.y = baseY + scrollLift
        modelRef.current.position.z = Math.sin(tFlight * Math.PI) * 0.4

        // Aerodynamic banking & pitch
        modelRef.current.rotation.x = 0.05 + Math.sin(time * 3) * 0.03
        modelRef.current.rotation.y = Math.PI / 2 + Math.sin(time * 2) * 0.05
        modelRef.current.rotation.z = Math.sin(time * 3.5) * 0.06

        // Position follow light with bird
        if (fireLightRef.current) {
          fireLightRef.current.position.set(currentX, baseY, 1.2)
        }

        // Notify parent when initial 3.8s pass completes
        if (tLinear >= 1.0 && !flightCompleteCalledRef.current) {
          flightCompleteCalledRef.current = true
          if (onFlightPassComplete) {
            onFlightPassComplete()
          }
        }
      }

      // Animate trailing embers (floating to the right behind the bird)
      const pos = emberGeo.attributes.position.array as Float32Array
      for (let i = 0; i < emberCount; i++) {
        pos[i * 3] += velocities[i * 3]
        pos[i * 3 + 1] += velocities[i * 3 + 1]
        pos[i * 3 + 2] += velocities[i * 3 + 2]

        if (pos[i * 3] > frustumW * 0.6) {
          pos[i * 3] = -frustumW * 0.6
          pos[i * 3 + 1] = (Math.random() - 0.5) * 6
          pos[i * 3 + 2] = (Math.random() - 0.5) * 4
        }
      }
      emberGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // 8. Responsive Resize & Maintain Exact 1/8th Screen Proportion
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)

      const updated = computeFrustum()
      frustumW = updated.frustumW
      frustumH = updated.frustumH

      // Re-scale model dynamically to maintain exact 1/8th of screen height
      if (modelRef.current) {
        const box = new THREE.Box3().setFromObject(modelRef.current)
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const targetDim = frustumH * 0.125
        const currentScale = modelRef.current.scale.x
        const unscaledDim = maxDim / (currentScale || 1)
        const newScale = targetDim / (unscaledDim || 1)
        modelRef.current.scale.set(newScale, newScale, newScale)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [onFlightPassComplete])

  return (
    <div className="relative h-full w-full pointer-events-none">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-amber-500/80">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            INITIALIZING SECURE TELEMETRY...
          </div>
        </div>
      )}
    </div>
  )
}
