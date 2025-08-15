"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function GameRoomPage() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000) // Pure black background
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 5, 10)
    camera.lookAt(0, 0, 0)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false 
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Simple ambient lighting for minimal visibility
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5) // Soft gray ambient light
    scene.add(ambientLight)

    // Add a single point light for some depth perception
    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.set(0, 10, 0)
    scene.add(pointLight)

    // Add a simple grid floor for spatial reference
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
    scene.add(gridHelper)

    // OrbitControls for camera movement
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxPolarAngle = Math.PI * 0.9
    controls.minDistance = 5
    controls.maxDistance = 50
    controls.target.set(0, 0, 0)

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      renderer.dispose()
      controls.dispose()
      
      // Clean up geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose()
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        }
      })
    }
  }, [])

  return (
    <div className="relative w-full h-screen bg-black">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Overlay UI */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 pointer-events-auto inline-block">
            <h1 className="text-white text-2xl font-bold mb-2">Game Room</h1>
            <p className="text-gray-300 text-sm">
              Black space environment • No models loaded
            </p>
          </div>
        </div>
      </div>
      
      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 pointer-events-none">
        <p className="text-gray-400 text-xs">
          Use mouse to orbit camera • Scroll to zoom
        </p>
      </div>
    </div>
  )
}