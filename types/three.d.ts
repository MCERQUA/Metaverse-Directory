declare module "three/examples/jsm/controls/OrbitControls" {
  import { Camera, EventDispatcher, Vector3, MOUSE } from "three"
  
  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement)
    
    object: Camera
    domElement: HTMLElement | Document
    
    // API
    enabled: boolean
    target: Vector3
    
    minDistance: number
    maxDistance: number
    
    minZoom: number
    maxZoom: number
    
    minPolarAngle: number
    maxPolarAngle: number
    
    minAzimuthAngle: number
    maxAzimuthAngle: number
    
    enableDamping: boolean
    dampingFactor: number
    
    enableZoom: boolean
    zoomSpeed: number
    
    enableRotate: boolean
    rotateSpeed: number
    
    enablePan: boolean
    panSpeed: number
    screenSpacePanning: boolean
    keyPanSpeed: number
    
    autoRotate: boolean
    autoRotateSpeed: number
    
    enableKeys: boolean
    keys: { LEFT: number; UP: number; RIGHT: number; BOTTOM: number }
    
    mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE }
    
    update(): boolean
    
    saveState(): void
    
    reset(): void
    
    dispose(): void
    
    getPolarAngle(): number
    
    getAzimuthalAngle(): number
    
    addEventListener(type: string, listener: (event: any) => void): void
    
    hasEventListener(type: string, listener: (event: any) => void): boolean
    
    removeEventListener(type: string, listener: (event: any) => void): void
    
    dispatchEvent(event: { type: string; target: any }): void
  }
}

declare module "three/examples/jsm/loaders/GLTFLoader" {
  import { LoadingManager, Group, AnimationClip, Camera, Scene, Mesh, Material, Texture } from "three"
  
  export interface GLTF {
    animations: AnimationClip[]
    scene: Group
    scenes: Group[]
    cameras: Camera[]
    asset: object
    parser: object
    userData: any
  }
  
  export class GLTFLoader {
    constructor(manager?: LoadingManager)
    
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void
    
    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<GLTF>
    
    setDRACOLoader(dracoLoader: any): void
    
    setKTX2Loader(ktx2Loader: any): void
    
    setMeshoptDecoder(meshoptDecoder: any): void
    
    setPath(path: string): GLTFLoader
    
    setResourcePath(resourcePath: string): GLTFLoader
    
    setCrossOrigin(crossOrigin: string): GLTFLoader
    
    setRequestHeader(requestHeader: { [header: string]: string }): GLTFLoader
    
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (event: ErrorEvent) => void
    ): void
  }
}