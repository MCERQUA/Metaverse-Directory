"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"

interface Simple360ViewerProps {
  imageUrl: string
  className?: string
}

export function Simple360Viewer({ imageUrl, className = "" }: Simple360ViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    sphere: THREE.Mesh | null
    isUserInteracting: boolean
    onPointerDownMouseX: number
    onPointerDownMouseY: number
    lon: number
    onPointerDownLon: number
    lat: number
    onPointerDownLat: number
    phi: number
    theta: number
  } | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Initialize variables
    let isUserInteracting = false
    let onPointerDownMouseX = 0
    let onPointerDownMouseY = 0
    let lon = 0
    let onPointerDownLon = 0
    let lat = 0
    let onPointerDownLat = 0
    let phi = 0
    let theta = 0

    // Create scene
    const scene = new THREE.Scene()

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100)
    camera.target = new THREE.Vector3(0, 0, 0)

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // Create sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    // Invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1)

    // Load texture
    const texture = new THREE.TextureLoader().load(imageUrl)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.format = THREE.RGBFormat

    const material = new THREE.MeshBasicMaterial({ map: texture })
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      sphere,
      isUserInteracting,
      onPointerDownMouseX,
      onPointerDownMouseY,
      lon,
      onPointerDownLon,
      lat,
      onPointerDownLat,
      phi,
      theta
    }

    // Event handlers
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!sceneRef.current) return
      
      event.preventDefault()
      sceneRef.current.isUserInteracting = true

      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

      sceneRef.current.onPointerDownMouseX = clientX
      sceneRef.current.onPointerDownMouseY = clientY

      sceneRef.current.onPointerDownLon = sceneRef.current.lon
      sceneRef.current.onPointerDownLat = sceneRef.current.lat
    }

    function onPointerMove(event: MouseEvent | TouchEvent) {
      if (!sceneRef.current || !sceneRef.current.isUserInteracting) return

      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

      sceneRef.current.lon = (sceneRef.current.onPointerDownMouseX - clientX) * 0.1 + sceneRef.current.onPointerDownLon
      sceneRef.current.lat = (clientY - sceneRef.current.onPointerDownMouseY) * 0.1 + sceneRef.current.onPointerDownLat
    }

    function onPointerUp() {
      if (!sceneRef.current) return
      sceneRef.current.isUserInteracting = false
    }

    // Add event listeners
    renderer.domElement.addEventListener('mousedown', onPointerDown)
    renderer.domElement.addEventListener('mousemove', onPointerMove)
    renderer.domElement.addEventListener('mouseup', onPointerUp)
    renderer.domElement.addEventListener('mouseleave', onPointerUp)
    
    renderer.domElement.addEventListener('touchstart', onPointerDown)
    renderer.domElement.addEventListener('touchmove', onPointerMove)
    renderer.domElement.addEventListener('touchend', onPointerUp)

    // Prevent context menu on right click
    renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault())

    // Handle window resize
    function onWindowResize() {
      if (!mountRef.current || !sceneRef.current) return
      
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      
      sceneRef.current.camera.aspect = width / height
      sceneRef.current.camera.updateProjectionMatrix()
      sceneRef.current.renderer.setSize(width, height)
    }
    window.addEventListener('resize', onWindowResize)

    // Animation loop
    function animate() {
      if (!sceneRef.current) return
      
      requestAnimationFrame(animate)
      update()
    }

    function update() {
      if (!sceneRef.current) return
      
      const { camera, renderer, scene, lat, lon } = sceneRef.current
      
      // Limit latitude to prevent flipping
      sceneRef.current.lat = Math.max(-85, Math.min(85, lat))
      
      // Calculate camera position
      sceneRef.current.phi = THREE.MathUtils.degToRad(90 - sceneRef.current.lat)
      sceneRef.current.theta = THREE.MathUtils.degToRad(lon)

      const x = 500 * Math.sin(sceneRef.current.phi) * Math.cos(sceneRef.current.theta)
      const y = 500 * Math.cos(sceneRef.current.phi)
      const z = 500 * Math.sin(sceneRef.current.phi) * Math.sin(sceneRef.current.theta)

      camera.target.x = x
      camera.target.y = y
      camera.target.z = z

      camera.lookAt(camera.target)
      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize)
      
      renderer.domElement.removeEventListener('mousedown', onPointerDown)
      renderer.domElement.removeEventListener('mousemove', onPointerMove)
      renderer.domElement.removeEventListener('mouseup', onPointerUp)
      renderer.domElement.removeEventListener('mouseleave', onPointerUp)
      
      renderer.domElement.removeEventListener('touchstart', onPointerDown)
      renderer.domElement.removeEventListener('touchmove', onPointerMove)
      renderer.domElement.removeEventListener('touchend', onPointerUp)
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      texture.dispose()
    }
  }, [imageUrl])

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full ${className}`}
      style={{ cursor: 'grab' }}
    />
  )
}