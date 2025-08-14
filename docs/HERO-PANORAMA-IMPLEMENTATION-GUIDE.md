# Hero Carousel 360° Panorama Implementation Guide

## 📋 Overview

This guide provides step-by-step instructions for adding 360° panoramic images to the hero carousel in the Metaverse Directory. The hero carousel uses the optimized panorama system with resource pooling, lazy loading, and performance optimization.

## 🎯 Quick Reference

### Required Fields for Panorama-Enabled Heroes

```typescript
interface FeaturedSpace {
  id: number;                // Unique identifier
  name: string;             // Space name
  creator: string;          // Creator name  
  category: string;         // Category (Social, Art, Gaming, etc.)
  description: string;      // Rich description
  userCount: number;        // Current visitors
  image: string;            // 360° panorama image path
  tags: string[];          // Tags for display
  isRealSpace: boolean;    // Must be true for panoramas
  liveUrl?: string;        // Optional live URL for "Enter Space"
}
```

### Essential Configuration
```typescript
// In hero-carousel.tsx - Panorama detection logic
{space.isRealSpace && (space.image === "/room1-360.jpg" || space.image === "/white-room.jpg") ? (
  <OptimizedPanoramaViewer
    id={`hero-panorama-${space.id}`}
    imageUrl={space.image}
    placeholder={space.image}
    autoRotate={-2}
    showControls={false}
    lazy={false}              // Heroes load immediately, not lazily
    height="100%"
  />
) : (
  // Fallback to static background image
)}
```

## 🚀 Step-by-Step Implementation

### Step 1: Prepare Your 360° Panorama Image

#### **Image Requirements**
- **Format**: JPEG (progressive encoding preferred for iOS compatibility)
- **Aspect Ratio**: 2:1 (equirectangular projection)
- **Resolution**: 
  - **Minimum**: 2048x1024 (mobile compatible)
  - **Recommended**: 4096x2048 (desktop quality)
  - **Maximum**: 8192x4096 (high-end displays)
- **File Size**: Target < 500KB (compress at 80-85% quality)

#### **Image Optimization Checklist**
```bash
# ✅ Required image properties
- [x] Equirectangular projection (spherical mapped to rectangle)
- [x] 360° horizontal coverage (full rotation)
- [x] 180° vertical coverage (floor to ceiling)
- [x] Progressive JPEG encoding (iOS Safari compatibility)
- [x] Proper exposure and contrast
- [x] No visible seams at edges
```

#### **Asset Placement**
```bash
# Place your panorama image in the public directory
/public/
├── your-panorama-name.jpg    # Your new panorama
├── room1-360.jpg            # Existing Mike's Room
└── white-room.jpg           # Existing White Space
```

### Step 2: Add Space to Featured Spaces Array

Open `/components/hero-carousel/hero-carousel.tsx` and add your new space:

```typescript
const featuredSpaces: FeaturedSpace[] = [
  // Existing spaces...
  
  // Your new panorama space
  {
    id: 1004,  // Use unique ID (increment from last)
    name: "Your Space Name",
    creator: "Your Creator Name",
    category: "Social", // or Art, Gaming, Educational, etc.
    description: "Rich description of your virtual space. Mention key features, atmosphere, and what visitors can expect to experience.",
    userCount: 2500, // Simulated visitor count
    image: "/your-panorama-name.jpg", // Path to your panorama
    tags: ["Live", "360°", "Interactive"], // Relevant tags
    isRealSpace: true, // CRITICAL: Must be true for panoramas
    liveUrl: "https://your-space-url.com", // Optional: link to live space
  },
];
```

### Step 3: Update Panorama Detection Logic

Add your new panorama to the detection logic:

```typescript
// Find this section in hero-carousel.tsx
{space.isRealSpace && (
  space.image === "/room1-360.jpg" || 
  space.image === "/white-room.jpg" ||
  space.image === "/your-panorama-name.jpg"  // Add your panorama here
) ? (
  <OptimizedPanoramaViewer
    id={`hero-panorama-${space.id}`}
    imageUrl={space.image}
    placeholder={space.image}
    autoRotate={-2}
    showControls={false}
    lazy={false}
    height="100%"
  />
) : (
  // Static background fallback
)}
```

### Step 4: Configure Panorama Settings (Optional)

Customize panorama behavior for your specific space:

```typescript
<OptimizedPanoramaViewer
  id={`hero-panorama-${space.id}`}
  imageUrl={space.image}
  placeholder={space.image}
  autoRotate={-2}          // Rotation speed (-3 to 3, negative = clockwise)
  showControls={false}     // Keep false for clean hero look
  lazy={false}             // Heroes always load immediately
  height="100%"
  // Optional customizations:
  initialYaw={180}         // Starting horizontal angle (0-360)
  initialPitch={10}        // Starting vertical angle (-90 to 90)
/>
```

## ⚙️ Advanced Configuration Options

### Custom Rotation Speeds by Space Type

```typescript
const getAutoRotateSpeed = (category: string) => {
  const speeds = {
    'Social': -2,      // Moderate speed for social spaces
    'Art': -1,         // Slow speed for art galleries
    'Gaming': -3,      // Faster speed for dynamic gaming spaces
    'Educational': -1.5, // Slow speed for learning environments
    'Business': -2.5   // Professional moderate speed
  };
  return speeds[category] || -2;
};

// Usage in component:
autoRotate={getAutoRotateSpeed(space.category)}
```

### Dynamic Initial View Angles

```typescript
const getOptimalViewAngle = (spaceName: string) => {
  const viewAngles = {
    'Mikes Room': { yaw: 180, pitch: 10 },     // Face the room center
    'White Space': { yaw: 0, pitch: 0 },       // Neutral starting point
    'Art Gallery': { yaw: 90, pitch: -10 },    // Face main artwork
    'Gaming Arena': { yaw: 270, pitch: 15 },   // Face action area
  };
  
  return viewAngles[spaceName] || { yaw: 180, pitch: 0 };
};
```

### Performance Optimization for Multiple Heroes

```typescript
// If you have many hero panoramas, consider rotation intervals
const [activeHeroIndex, setActiveHeroIndex] = useState(0);

// Only enable auto-rotation for currently visible hero
<OptimizedPanoramaViewer
  id={`hero-panorama-${space.id}`}
  imageUrl={space.image}
  placeholder={space.image}
  autoRotate={index === activeHeroIndex ? -2 : 0}  // Only rotate active
  showControls={false}
  lazy={false}
  height="100%"
/>
```

## 🎨 UI/UX Best Practices

### Hero Badge Configuration

Update badges to indicate panorama features:

```typescript
<div className="flex items-center gap-3 mb-4">
  {space.isRealSpace && (
    <span className="px-3 py-1 bg-green-600/30 text-green-400 text-sm rounded-full border border-green-500/50 animate-pulse">
      LIVE 360°
    </span>
  )}
  <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary/30">
    {space.category}
  </span>
  {space.tags.includes('360°') && (
    <span className="px-2 py-1 bg-blue-600/30 text-blue-400 text-xs rounded-full">
      360° VIEW
    </span>
  )}
</div>
```

### Loading States

Ensure smooth loading experience:

```typescript
// The OptimizedPanoramaViewer automatically handles:
// 1. Placeholder image display while loading
// 2. Progressive enhancement from static to interactive
// 3. Smooth fade-in when panorama is ready
// 4. Error handling with fallback to placeholder

// No additional loading state management needed!
```

## 🔧 Testing Your Implementation

### Testing Checklist

```bash
# ✅ Visual Testing
- [x] Panorama loads without errors
- [x] Auto-rotation works smoothly
- [x] No visible seams or distortion
- [x] Proper aspect ratio maintained
- [x] Text overlays remain readable

# ✅ Performance Testing  
- [x] Hero loads within 3 seconds
- [x] No console errors or warnings
- [x] Smooth transitions between slides
- [x] Memory usage remains stable
- [x] Works on mobile devices

# ✅ Interaction Testing
- [x] Mouse/touch dragging works
- [x] Zoom functionality (if enabled)
- [x] Auto-rotation pauses on interaction
- [x] "Enter Space" button functions
- [x] Carousel navigation works properly
```

### Debug Mode

Enable debug logging for troubleshooting:

```typescript
// Add to development environment
if (process.env.NODE_ENV === 'development') {
  window.PANORAMA_DEBUG = true;
  console.log('Hero panorama debug mode enabled');
}
```

## 🐛 Common Issues & Solutions

### Issue 1: Panorama Not Loading

**Symptoms**: Blank space or static fallback image
**Solutions**:
```typescript
// Check image path is correct
console.log('Loading panorama:', space.image);

// Verify image exists in public directory
// Check browser network tab for 404 errors

// Ensure isRealSpace is true
isRealSpace: true, // Required for panorama activation
```

### Issue 2: Poor Performance or Stuttering

**Solutions**:
```typescript
// Reduce image size
// Maximum 4096x2048 for desktop, 2048x1024 for mobile

// Optimize JPEG compression
// Use 80-85% quality, progressive encoding

// Check for multiple panoramas loading simultaneously
// Heroes should have lazy={false}, but space cards use lazy={true}
```

### Issue 3: Mobile Compatibility Issues

**Solutions**:
```typescript
// iOS Safari specific fixes
const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

if (isiOS) {
  // Force progressive JPEG
  // Reduce max texture size to 2048px
  // Disable auto-rotation by default on mobile
}
```

### Issue 4: Seams Visible at Image Edges

**Image Creation Problem - Fix in Source**:
- Ensure proper equirectangular mapping
- Check for pixel-perfect horizontal wrapping
- Verify 360° coverage without gaps

## 📊 Performance Monitoring

### Real-time Performance Tracking

```typescript
// Monitor hero panorama performance
const trackHeroPerformance = (spaceName: string, loadTime: number) => {
  console.log(`Hero panorama "${spaceName}" loaded in ${loadTime}ms`);
  
  // Optional: Send to analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'panorama_load', {
      space_name: spaceName,
      load_time: loadTime,
      location: 'hero_carousel'
    });
  }
};
```

## 🔄 Maintenance & Updates

### Adding New Panorama Spaces

1. **Follow naming convention**: `space-name-360.jpg`
2. **Increment ID numbers**: Use next available ID
3. **Update detection logic**: Add to conditional check
4. **Test thoroughly**: Verify all carousel positions work
5. **Document changes**: Update this guide with new spaces

### Removing Panorama Spaces

1. **Remove from featuredSpaces array**
2. **Remove from detection logic conditional**
3. **Keep image files** (may be referenced elsewhere)
4. **Test carousel transitions**

### Performance Optimization Reviews

- **Monthly**: Review loading times and user feedback
- **Quarterly**: Optimize image sizes and compression
- **Semi-annually**: Evaluate new panorama technologies
- **Annually**: Consider upgrading to newer formats (WebP, AVIF, KTX2)

## 📝 Documentation Updates

When adding new hero panoramas, always:

1. **Update this guide** with specific implementation details
2. **Update CLAUDE.md** references to include new spaces
3. **Document any custom configurations** used
4. **Add to test cases** in demo page if needed
5. **Update performance benchmarks** if significantly different

---

**Last Updated**: December 2024  
**Version**: 2.0.0 (Optimized System)  
**Next Review**: March 2025