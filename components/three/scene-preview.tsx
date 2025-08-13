"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Loader2 } from "lucide-react"

interface ScenePreviewProps {
  spaceType?: "gaming" | "art" | "social" | "educational" | "business" | "other"
  className?: string
  autoRotate?: boolean
  interactive?: boolean
}

export function ScenePreview({
  spaceType = "gaming",
  className = "",
  autoRotate = true,
  interactive = false,
}: ScenePreviewProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationRef = useRef<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return

    // Check WebGL support
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      if (!gl) {
        setHasWebGL(false)
        setIsLoading(false)
        return
      }
    } catch (e) {
      setHasWebGL(false)
      setIsLoading(false)
      return
    }

    const mount = mountRef.current
    const width = mount.clientWidth
    const height = mount.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 2, 5)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    rendererRef.current = renderer

    mount.appendChild(renderer.domElement)

    // Create scene based on space type
    createSceneForType(scene, spaceType)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      if (autoRotate) {
        scene.rotation.y += 0.005
      }

      renderer.render(scene, camera)
    }

    // Handle resize
    const handleResize = () => {
      if (!mount) return
      const newWidth = mount.clientWidth
      const newHeight = mount.clientHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    // Start animation
    animate()
    setIsLoading(false)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)

      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement)
      }

      renderer.dispose()

      // Dispose of all geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    }
  }, [spaceType, autoRotate])

  const createSceneForType = (scene: THREE.Scene, type: string) => {
    scene.clear()

    switch (type) {
      case "gaming":
        createGamingScene(scene)
        break
      case "art":
        createArtScene(scene)
        break
      case "social":
        createSocialScene(scene)
        break
      case "educational":
        createEducationalScene(scene)
        break
      case "business":
        createBusinessScene(scene)
        break
      default:
        createDefaultScene(scene)
    }
  }

  const createGamingScene = (scene: THREE.Scene) => {
    // Neon gaming environment
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x001122,
      transparent: true,
      opacity: 0.8,
    })

    for (let i = 0; i < 5; i++) {
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 6)
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      scene.add(cube)
    }

    // Add some particle effects
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff00ff,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)
  }

  const createArtScene = (scene: THREE.Scene) => {
    // Art gallery with floating sculptures
    const geometry = new THREE.SphereGeometry(0.5, 32, 32)
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0xff6b6b }),
      new THREE.MeshPhongMaterial({ color: 0x4ecdc4 }),
      new THREE.MeshPhongMaterial({ color: 0x45b7d1 }),
      new THREE.MeshPhongMaterial({ color: 0xf9ca24 }),
    ]

    for (let i = 0; i < 4; i++) {
      const sphere = new THREE.Mesh(geometry, materials[i])
      sphere.position.set(Math.cos((i * Math.PI) / 2) * 3, Math.sin(i * 0.5) * 2, Math.sin((i * Math.PI) / 2) * 3)
      scene.add(sphere)
    }

    // Add a central pedestal
    const pedestalGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 8)
    const pedestalMaterial = new THREE.MeshPhongMaterial({ color: 0x8e8e8e })
    const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial)
    pedestal.position.y = -1
    scene.add(pedestal)
  }

  const createSocialScene = (scene: THREE.Scene) => {
    // Social space with seating arrangement
    const chairGeometry = new THREE.BoxGeometry(0.5, 1, 0.5)
    const chairMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 })

    for (let i = 0; i < 6; i++) {
      const chair = new THREE.Mesh(chairGeometry, chairMaterial)
      const angle = (i / 6) * Math.PI * 2
      chair.position.set(Math.cos(angle) * 2, 0, Math.sin(angle) * 2)
      chair.rotation.y = angle + Math.PI
      scene.add(chair)
    }

    // Central table
    const tableGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 8)
    const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 })
    const table = new THREE.Mesh(tableGeometry, tableMaterial)
    table.position.y = 0.5
    scene.add(table)
  }

  const createEducationalScene = (scene: THREE.Scene) => {
    // Classroom with floating books and elements
    const bookGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.05)
    const bookMaterials = [
      new THREE.MeshPhongMaterial({ color: 0xff4757 }),
      new THREE.MeshPhongMaterial({ color: 0x3742fa }),
      new THREE.MeshPhongMaterial({ color: 0x2ed573 }),
      new THREE.MeshPhongMaterial({ color: 0xffa502 }),
    ]

    for (let i = 0; i < 8; i++) {
      const book = new THREE.Mesh(bookGeometry, bookMaterials[i % bookMaterials.length])
      book.position.set((Math.random() - 0.5) * 6, Math.random() * 4, (Math.random() - 0.5) * 6)
      book.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      scene.add(book)
    }

    // Add a blackboard
    const boardGeometry = new THREE.PlaneGeometry(3, 2)
    const boardMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 })
    const board = new THREE.Mesh(boardGeometry, boardMaterial)
    board.position.set(0, 1, -3)
    scene.add(board)
  }

  const createBusinessScene = (scene: THREE.Scene) => {
    // Modern office environment
    const deskGeometry = new THREE.BoxGeometry(2, 0.1, 1)
    const deskMaterial = new THREE.MeshPhongMaterial({ color: 0x34495e })

    for (let i = 0; i < 3; i++) {
      const desk = new THREE.Mesh(deskGeometry, deskMaterial)
      desk.position.set(i * 2.5 - 2.5, 0.5, 0)
      scene.add(desk)

      // Add a chair for each desk
      const chairGeometry = new THREE.BoxGeometry(0.5, 1, 0.5)
      const chairMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 })
      const chair = new THREE.Mesh(chairGeometry, chairMaterial)
      chair.position.set(i * 2.5 - 2.5, 0, 1)
      scene.add(chair)
    }

    // Add some floating screens
    const screenGeometry = new THREE.PlaneGeometry(1, 0.6)
    const screenMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      emissive: 0x001100,
      transparent: true,
      opacity: 0.8,
    })

    for (let i = 0; i < 3; i++) {
      const screen = new THREE.Mesh(screenGeometry, screenMaterial)
      screen.position.set(i * 2.5 - 2.5, 1.5, -0.5)
      scene.add(screen)
    }
  }

  const createDefaultScene = (scene: THREE.Scene) => {
    // Generic abstract scene
    const geometry = new THREE.IcosahedronGeometry(1, 1)
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Add some orbiting elements
    for (let i = 0; i < 3; i++) {
      const smallGeometry = new THREE.SphereGeometry(0.2, 16, 16)
      const smallMaterial = new THREE.MeshPhongMaterial({ color: 0xff00ff })
      const smallSphere = new THREE.Mesh(smallGeometry, smallMaterial)

      const angle = (i / 3) * Math.PI * 2
      smallSphere.position.set(Math.cos(angle) * 2, Math.sin(angle) * 0.5, Math.sin(angle) * 2)
      scene.add(smallSphere)
    }
  }

  if (!hasWebGL) {
    return (
      <div className={`bg-slate-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-slate-400 p-4">
          <div className="text-sm">WebGL not supported</div>
          <div className="text-xs mt-1">3D preview unavailable</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800 rounded-lg flex items-center justify-center z-10">
          <div className="text-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <div className="text-sm">Loading 3D Preview</div>
          </div>
        </div>
      )}
      <div
        ref={mountRef}
        className="w-full h-full rounded-lg overflow-hidden bg-slate-900"
        style={{ minHeight: "200px" }}
      />
    </div>
  )
}
