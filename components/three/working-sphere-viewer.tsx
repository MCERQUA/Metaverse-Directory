"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface WorkingSphereViewerProps {
  imageUrl: string
  className?: string
}

export function WorkingSphereViewer({ imageUrl, className = "" }: WorkingSphereViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup - positioned at center of sphere
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    camera.position.set(0, 0, 0.1)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false 
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls setup - this is the key for interaction!
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = -0.5 // Negative to invert controls for inside-sphere view
    controls.target.set(0, 0, 0)
    
    // Touch settings for mobile
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_ROTATE
    }

    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(50, 64, 32)
    // CRITICAL: Scale by -1 on X axis to flip normals inward
    geometry.scale(-1, 1, 1)

    // Load and apply texture
    const loader = new THREE.TextureLoader()
    loader.load(
      imageUrl,
      (texture) => {
        // Configure texture for best quality
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.colorSpace = THREE.SRGBColorSpace
        texture.wrapS = THREE.RepeatWrapping
        texture.repeat.x = 1
        texture.offset.x = 0

        // Create material with the texture
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide // Since we flipped the geometry, use BackSide
        })

        // Create and add the sphere mesh
        const sphere = new THREE.Mesh(geometry, material)
        scene.add(sphere)

        // Start animation loop
        const animate = () => {
          frameRef.current = requestAnimationFrame(animate)
          
          // Update controls
          controls.update()
          
          // Render the scene
          renderer.render(scene, camera)
        }
        animate()
      },
      undefined,
      (error) => {
        console.error('Error loading panorama image:', error)
      }
    )

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return
      
      const newWidth = mountRef.current.clientWidth
      const newHeight = mountRef.current.clientHeight
      
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    
    window.addEventListener('resize', handleResize)

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      
      controls.dispose()
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      
      renderer.dispose()
      geometry.dispose()
      
      // Clean up materials and textures
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.material) {
            if (object.material instanceof THREE.Material) {
              if (object.material.map) object.material.map.dispose()
              object.material.dispose()
            }
          }
        }
      })
    }
  }, [imageUrl])

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full ${className}`}
      style={{ 
        touchAction: 'none',
        cursor: 'grab'
      }}
    />
  )
}