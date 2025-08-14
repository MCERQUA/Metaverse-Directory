# 360° Panorama Troubleshooting Guide

## 🚨 Quick Diagnostic Checklist

When panoramas aren't working properly, run through this quick checklist:

```bash
# ✅ Immediate Checks
- [x] Image file exists and is accessible (check browser network tab)
- [x] isRealSpace is set to true for the space
- [x] image360 field is populated with correct path
- [x] Browser console shows no WebGL errors
- [x] Developer tools show no 404 errors for panorama images
```

## 🔍 Common Error Patterns & Solutions

### Error 1: "Too many WebGL contexts"

**Error Message:**
```
WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost
Error: Too many WebGL contexts. Unable to create more.
```

**Root Cause**: Browser WebGL context limit exceeded (8-16 contexts max)

**Immediate Fix:**
```javascript
// Emergency context cleanup
function emergencyPanoramaCleanup() {
  // Find all panorama canvases
  const panoramaCanvases = document.querySelectorAll('[data-panorama-viewer]');
  
  panoramaCanvases.forEach(canvas => {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const loseContextExt = gl.getExtension('WEBGL_lose_context');
      if (loseContextExt) {
        loseContextExt.loseContext();
        console.log('Force-released WebGL context for panorama');
      }
    }
  });
  
  // Force garbage collection if available
  if (window.gc) window.gc();
}

// Call in browser console:
emergencyPanoramaCleanup();
```

**Long-term Solution:**
```javascript
// Verify resource pool limits in panorama-viewer-optimized.tsx
const MAX_ACTIVE_VIEWERS = 6; // Should never exceed 6

// Check cleanup is working properly
useEffect(() => {
  return () => {
    // Ensure cleanup on unmount
    if (panoramaInstance) {
      panoramaInstance.dispose();
      panoramaInstance = null;
    }
  };
}, []);
```

### Error 2: Panorama Not Loading/Displaying

**Symptoms**: Blank space, static thumbnail only, or loading spinner forever

**Debug Steps:**
```javascript
// 1. Check image path resolution
console.log('Attempting to load panorama:', imageUrl);
const img = new Image();
img.onload = () => console.log('✅ Image accessible');
img.onerror = () => console.error('❌ Image failed to load');
img.src = imageUrl;

// 2. Verify panorama detection logic
const shouldShowPanorama = space.isRealSpace && space.image360;
console.log('Should show panorama:', shouldShowPanorama, {
  isRealSpace: space.isRealSpace,
  hasImage360: !!space.image360,
  image360Path: space.image360
});

// 3. Check WebGL support
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');
console.log('WebGL supported:', !!gl);
if (gl) {
  console.log('WebGL version:', gl.getParameter(gl.VERSION));
  console.log('WebGL renderer:', gl.getParameter(gl.RENDERER));
}
```

**Common Solutions:**
```typescript
// Fix 1: Correct image path
// ❌ Wrong: image360: "panorama.jpg"
// ✅ Correct: image360: "/panorama.jpg" (note the leading slash)

// Fix 2: Ensure isRealSpace is boolean true
// ❌ Wrong: isRealSpace: "true" (string)
// ✅ Correct: isRealSpace: true (boolean)

// Fix 3: Add fallback handling
<OptimizedPanoramaViewer
  imageUrl={space.image360}
  placeholder={space.image}  // Fallback if panorama fails
  onError={(error) => {
    console.error('Panorama failed to load:', error);
    // Show static image instead
  }}
/>
```

### Error 3: Poor Performance/Stuttering

**Symptoms**: Low FPS, choppy rotation, browser freezing

**Performance Diagnostics:**
```javascript
// Monitor FPS
let frameCount = 0;
let lastTime = performance.now();

function measureFPS() {
  frameCount++;
  const currentTime = performance.now();
  
  if (currentTime - lastTime >= 1000) {
    const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
    console.log('Current FPS:', fps);
    
    if (fps < 25) {
      console.warn('⚠️ Low FPS detected. Consider optimizations.');
    }
    
    frameCount = 0;
    lastTime = currentTime;
  }
  
  requestAnimationFrame(measureFPS);
}
measureFPS();

// Monitor memory usage
if (performance.memory) {
  setInterval(() => {
    const memory = performance.memory;
    console.log('Memory usage:', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
    });
  }, 5000);
}
```

**Performance Solutions:**
```typescript
// Solution 1: Reduce texture quality
const getOptimalTextureSize = () => {
  const isMobile = window.innerWidth < 768;
  const isLowEndDevice = navigator.hardwareConcurrency <= 2;
  const hasLimitedMemory = navigator.deviceMemory <= 2;
  
  if (isMobile || isLowEndDevice || hasLimitedMemory) {
    return 2048; // Lower resolution for limited devices
  }
  
  return 4096; // Standard resolution
};

// Solution 2: Limit concurrent panoramas
const MAX_CONCURRENT = navigator.userAgent.includes('Safari') ? 4 : 6;

// Solution 3: Disable auto-rotation on low-end devices
const shouldAutoRotate = () => {
  const isLowEnd = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;
  return !isLowEnd;
};
```

### Error 4: Mobile-Specific Issues

**iOS Safari Problems:**
```javascript
// Problem: Panoramas don't load on iOS Safari
// Solution: Ensure progressive JPEG encoding

// Check if image is progressive JPEG
function checkProgressiveJPEG(imageUrl) {
  fetch(imageUrl)
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const bytes = new Uint8Array(buffer);
      const isProgressive = checkJPEGProgressive(bytes);
      console.log('Image is progressive JPEG:', isProgressive);
      
      if (!isProgressive) {
        console.warn('⚠️ Non-progressive JPEG may not work on iOS Safari');
      }
    });
}

// iOS-specific optimizations
const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

if (isiOS && isSafari) {
  // Apply iOS Safari fixes
  maxTextureSize = 2048;        // Reduce max texture size
  autoRotateSpeed = 0;          // Disable auto-rotation
  aggressiveCleanup = true;     // Enable more frequent cleanup
}
```

**Android Chrome Problems:**
```javascript
// Problem: "This panorama is too big for your device"
// Solution: Dynamic image resizing

async function resizePanoramaForDevice(imageUrl, maxSize = 4096) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  return new Promise((resolve) => {
    img.onload = () => {
      if (img.width <= maxSize && img.height <= maxSize) {
        resolve(imageUrl); // Use original
        return;
      }
      
      // Resize image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const scale = maxSize / Math.max(img.width, img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const resizedUrl = URL.createObjectURL(blob);
        resolve(resizedUrl);
      }, 'image/jpeg', 0.85);
    };
    
    img.src = imageUrl;
  });
}
```

### Error 5: Hero vs Space Card Conflicts

**Problem**: Hero panoramas work but space card panoramas don't (or vice versa)

**Diagnostic Check:**
```typescript
// Compare configurations
const heroConfig = {
  lazy: false,           // Heroes load immediately
  autoRotate: -2,
  showControls: false,
  height: "100%"
};

const spaceCardConfig = {
  lazy: true,            // Space cards lazy load
  autoRotate: -2,
  showControls: false,
  height: "250px"        // Fixed height
};

console.log('Hero config:', heroConfig);
console.log('Space card config:', spaceCardConfig);
```

**Solution:**
```typescript
// Ensure different IDs for different contexts
// ❌ Wrong: Both use same ID pattern
id={`panorama-${space.id}`}

// ✅ Correct: Context-specific IDs
// Hero: id={`hero-panorama-${space.id}`}
// Space card: id={`card-panorama-${space.id}`}
```

### Error 6: Memory Leaks Over Time

**Symptoms**: Browser becomes slower, memory usage increases, eventual crash

**Memory Leak Detection:**
```javascript
// Monitor for memory leaks
class PanoramaMemoryMonitor {
  constructor() {
    this.initialMemory = performance.memory?.usedJSHeapSize || 0;
    this.activeViewers = new Set();
    this.memoryChecks = [];
  }
  
  addViewer(id) {
    this.activeViewers.add(id);
    this.checkMemory();
  }
  
  removeViewer(id) {
    this.activeViewers.delete(id);
    setTimeout(() => this.checkMemory(), 1000); // Check after cleanup
  }
  
  checkMemory() {
    if (!performance.memory) return;
    
    const currentMemory = performance.memory.usedJSHeapSize;
    const memoryIncrease = currentMemory - this.initialMemory;
    const activeCount = this.activeViewers.size;
    
    this.memoryChecks.push({
      timestamp: Date.now(),
      memory: currentMemory,
      increase: memoryIncrease,
      activeViewers: activeCount
    });
    
    // Detect memory leak pattern
    if (this.memoryChecks.length > 10) {
      const recent = this.memoryChecks.slice(-10);
      const trend = recent[9].memory - recent[0].memory;
      
      if (trend > 50 * 1024 * 1024) { // 50MB increase
        console.warn('🚨 Potential memory leak detected!', {
          memoryIncrease: Math.round(trend / 1024 / 1024) + 'MB',
          activeViewers: activeCount
        });
      }
    }
  }
}

const memoryMonitor = new PanoramaMemoryMonitor();
```

**Memory Leak Solutions:**
```typescript
// Solution 1: Ensure proper cleanup
useEffect(() => {
  const viewer = new OptimizedPanoramaViewer(config);
  memoryMonitor.addViewer(viewer.id);
  
  return () => {
    // CRITICAL: Always cleanup
    viewer.dispose();
    memoryMonitor.removeViewer(viewer.id);
  };
}, []);

// Solution 2: Force garbage collection periodically
useEffect(() => {
  const cleanupInterval = setInterval(() => {
    if (window.gc && Math.random() < 0.1) { // 10% chance
      window.gc();
    }
  }, 30000); // Every 30 seconds
  
  return () => clearInterval(cleanupInterval);
}, []);

// Solution 3: Implement aggressive resource management
const resourceManager = {
  maxMemoryUsage: 200 * 1024 * 1024, // 200MB limit
  
  checkAndCleanup() {
    if (performance.memory?.usedJSHeapSize > this.maxMemoryUsage) {
      // Force cleanup of least recently used panoramas
      panoramaPool.cleanupLRU();
      
      if (window.gc) window.gc();
    }
  }
};
```

## 🛠️ Debug Tools & Utilities

### Panorama Debug Console

```javascript
// Add to browser console for debugging
window.panoramaDebug = {
  // List all active panorama viewers
  listActive() {
    const canvases = document.querySelectorAll('[data-panorama-viewer]');
    console.log('Active panorama viewers:', canvases.length);
    canvases.forEach((canvas, index) => {
      console.log(`${index + 1}:`, {
        id: canvas.dataset.panoramaId,
        size: `${canvas.width}x${canvas.height}`,
        visible: canvas.offsetParent !== null
      });
    });
  },
  
  // Force cleanup all viewers
  cleanupAll() {
    const canvases = document.querySelectorAll('[data-panorama-viewer]');
    canvases.forEach(canvas => {
      const gl = canvas.getContext('webgl');
      if (gl) {
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      }
    });
    console.log('✅ All panorama contexts cleaned up');
  },
  
  // Test panorama loading
  async testLoad(imageUrl) {
    console.log('Testing panorama load:', imageUrl);
    
    const startTime = performance.now();
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = () => {
        const loadTime = performance.now() - startTime;
        console.log('✅ Panorama loaded successfully', {
          size: `${img.width}x${img.height}`,
          loadTime: Math.round(loadTime) + 'ms',
          aspectRatio: (img.width / img.height).toFixed(2)
        });
        resolve(true);
      };
      
      img.onerror = (error) => {
        console.error('❌ Panorama failed to load:', error);
        resolve(false);
      };
      
      img.src = imageUrl;
    });
  },
  
  // Monitor performance
  startPerformanceMonitor() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitor = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
        const memory = performance.memory ? 
          Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB' : 
          'N/A';
        
        console.log('📊 Performance:', { fps, memory });
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitor);
    };
    
    monitor();
    console.log('📊 Performance monitoring started');
  }
};

// Auto-run basic diagnostics
console.log('🔍 Panorama Debug Tools Loaded');
console.log('Commands: panoramaDebug.listActive(), panoramaDebug.cleanupAll(), panoramaDebug.testLoad(url)');
```

### Automated Health Check

```javascript
// Automated panorama system health check
function runPanoramaHealthCheck() {
  const results = {
    webglSupport: false,
    activeViewers: 0,
    memoryUsage: 0,
    errors: [],
    warnings: []
  };
  
  // Check WebGL support
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    results.webglSupport = !!gl;
    
    if (gl) {
      const maxTextures = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      if (maxTextures < 2048) {
        results.warnings.push(`Low max texture size: ${maxTextures}`);
      }
    }
  } catch (error) {
    results.errors.push('WebGL check failed: ' + error.message);
  }
  
  // Count active viewers
  const viewers = document.querySelectorAll('[data-panorama-viewer]');
  results.activeViewers = viewers.length;
  
  if (viewers.length > 6) {
    results.warnings.push(`Too many active viewers: ${viewers.length} (max recommended: 6)`);
  }
  
  // Check memory usage
  if (performance.memory) {
    results.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    
    if (results.memoryUsage > 200) {
      results.warnings.push(`High memory usage: ${results.memoryUsage}MB`);
    }
  }
  
  // Check for console errors
  const originalError = console.error;
  const errors = [];
  console.error = (...args) => {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };
  
  // Restore after a short delay
  setTimeout(() => {
    console.error = originalError;
    if (errors.length > 0) {
      results.errors.push(...errors);
    }
  }, 1000);
  
  return results;
}

// Run health check
const healthCheck = runPanoramaHealthCheck();
console.log('🏥 Panorama Health Check Results:', healthCheck);
```

## 📋 Preventive Maintenance

### Weekly Checks

```bash
# ✅ Weekly Maintenance Checklist
- [x] Run panorama health check in production
- [x] Review browser console for WebGL errors
- [x] Check memory usage patterns over time  
- [x] Verify all panorama images are accessible
- [x] Test on latest browser versions
```

### Monthly Optimization

```bash  
# ✅ Monthly Optimization Tasks
- [x] Analyze slowest-loading panoramas
- [x] Compress and re-optimize large images
- [x] Review and update browser compatibility
- [x] Test performance on various devices
- [x] Update documentation with new issues/solutions
```

### Code Review Checklist

```typescript
// When reviewing panorama-related code changes:
const codeReviewChecklist = {
  resourceManagement: [
    '✅ All WebGL contexts properly disposed',
    '✅ useEffect cleanup returns function',
    '✅ No memory leaks in component lifecycle',
    '✅ Proper error handling for failed loads'
  ],
  
  performance: [
    '✅ Lazy loading implemented where appropriate',
    '✅ Max concurrent viewers limit respected',
    '✅ Image sizes optimized for target devices',
    '✅ Auto-rotation disabled on low-end devices'
  ],
  
  accessibility: [
    '✅ Alt text provided for panorama images',
    '✅ Keyboard navigation support',
    '✅ Screen reader announcements',
    '✅ Respect for prefers-reduced-motion'
  ],
  
  errorHandling: [
    '✅ Graceful fallback to static images',
    '✅ User-friendly error messages',
    '✅ Proper logging for debugging',
    '✅ Recovery mechanisms for context loss'
  ]
};
```

## 🆘 Emergency Procedures

### If Panoramas Break in Production

```bash
# 1. Immediate Assessment (2 minutes)
- Open production site in multiple browsers
- Check browser console for errors
- Verify images are accessible via direct URLs
- Confirm basic website functionality

# 2. Quick Fixes (5 minutes)
- Disable auto-rotation if causing issues
- Reduce max concurrent viewers to 3
- Temporarily disable panoramas for mobile if needed

# 3. Emergency Rollback (if needed)
- Revert to static images for affected spaces
- Set isRealSpace: false for problematic spaces
- Deploy hotfix and monitor recovery
```

### Emergency Panorama Disable

```typescript
// Emergency disable all panoramas
const EMERGENCY_DISABLE_PANORAMAS = true; // Set to true in crisis

// Update components to check this flag
const shouldShowPanorama = (space) => {
  if (EMERGENCY_DISABLE_PANORAMAS) return false;
  return space.isRealSpace && space.image360;
};

// Or via environment variable
const shouldShowPanorama = (space) => {
  if (process.env.DISABLE_PANORAMAS === 'true') return false;
  return space.isRealSpace && space.image360;
};
```

---

**Last Updated**: December 2024  
**Version**: 2.0.0  
**For Emergencies**: Use browser debug tools or contact technical team