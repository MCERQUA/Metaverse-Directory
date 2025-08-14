# 360° Panorama Asset Requirements & Specifications

## 📋 Technical Specifications

### Image Format Requirements

#### **Primary Format: JPEG**
```bash
# ✅ Recommended JPEG Specifications
Format: JPEG (.jpg)
Encoding: Progressive (CRITICAL for iOS Safari)
Color Space: sRGB
Bit Depth: 24-bit (8 bits per channel)
Compression: 75-85% quality
Chroma Subsampling: 4:2:0 (standard)
```

#### **Advanced Format: KTX2** (Future-Ready)
```bash
# 🚀 Next-Generation Format (Optional)
Format: KTX2 with Basis Universal compression
Compression: ETC1S (mobile) or UASTC (desktop)
File Size: 60-80% smaller than JPEG
GPU Memory: Significantly reduced
Browser Support: Chrome 91+, Firefox 90+
```

### Resolution & Aspect Ratio

#### **Aspect Ratio: 2:1 (Equirectangular)**
```bash
# ✅ Standard Resolutions
Mobile Minimum:    2048 x 1024  (2K)
Desktop Standard:  4096 x 2048  (4K) ⭐ RECOMMENDED
High-End Desktop:  8192 x 4096  (8K) 
Ultra High-End:   16384 x 8192  (16K) - Use sparingly
```

#### **Resolution Selection Guide**
```typescript
const getOptimalResolution = (useCase: string, targetDevice: string) => {
  const resolutions = {
    'hero-carousel': {
      mobile: '2048x1024',     // Balance quality and loading speed
      desktop: '4096x2048',    // Full experience
      premium: '8192x4096'     // Showcase experiences only
    },
    'space-cards': {
      mobile: '2048x1024',     // Prioritize loading speed
      desktop: '4096x2048',    // Good quality for hover
      premium: '4096x2048'     // Max for space cards
    },
    'fullscreen-view': {
      mobile: '4096x2048',     // Higher quality when focused
      desktop: '8192x4096',    // Premium fullscreen experience
      premium: '16384x8192'    // Ultimate quality (use sparingly)
    }
  };
  
  return resolutions[useCase][targetDevice];
};
```

### File Size Guidelines

#### **Target File Sizes by Use Case**
```bash
# Space Cards (Hover Activation)
Mobile:     < 200KB (fast loading on data plans)
Desktop:    < 400KB (balance quality and speed)

# Hero Carousel (Immediate Loading)  
Mobile:     < 300KB (quick hero loading)
Desktop:    < 600KB (premium hero experience)

# Fullscreen View (User-Initiated)
Mobile:     < 500KB (acceptable for intentional viewing)
Desktop:    < 1MB (premium quality when requested)

# ⚠️ NEVER exceed 2MB for any panorama
```

#### **Compression Quality Guidelines**
```bash
# JPEG Quality Settings by Use Case
Space Cards:       75-80% (prioritize loading speed)
Hero Carousel:     80-85% (balance quality and speed)
Fullscreen View:   85-90% (maximize quality)
Premium Showcase:  90-95% (ultimate quality)

# Progressive JPEG is MANDATORY for iOS Safari compatibility
```

## 🎨 Content Creation Guidelines

### Photography Requirements

#### **Camera Setup**
```bash
# ✅ Recommended Equipment
360° Camera: Insta360 X3, Ricoh Theta Z1, or equivalent
Tripod Height: 5-6 feet (1.5-1.8m) - human eye level
Shooting Mode: RAW + JPEG for maximum post-processing flexibility
Exposure: HDR bracketing for high-contrast scenes
ISO: Keep below 800 to minimize noise
```

#### **Shooting Checklist**
```bash
# ✅ Pre-Shoot Requirements
- [x] Clean camera lenses thoroughly
- [x] Check for proper equirectangular output format
- [x] Ensure stable tripod placement
- [x] Remove or hide tripod in post-processing
- [x] Check lighting is even (avoid harsh shadows)
- [x] Remove or minimize people/moving objects
- [x] Plan for interesting focal points in all directions

# ✅ Technical Shooting Settings  
- [x] Maximum resolution available on camera
- [x] Manual exposure if lighting is consistent
- [x] Use timer or remote to avoid camera shake
- [x] Shoot in flat/log profile if available
- [x] Capture multiple exposures for HDR if needed
```

### Post-Processing Requirements

#### **Essential Corrections**
```bash
# ✅ Required Post-Processing Steps
1. Stitch Quality Check:
   - No visible seam lines
   - Proper alignment at zenith/nadir
   - Consistent exposure across entire image

2. Color Correction:
   - Consistent white balance throughout
   - Natural color saturation
   - Proper contrast and brightness
   - sRGB color space conversion

3. Geometric Corrections:
   - Proper equirectangular projection
   - No warping or distortion artifacts
   - Straight horizon line (if applicable)
   - Remove tripod/equipment artifacts

4. Quality Enhancement:
   - Noise reduction for high ISO shots
   - Sharpening for web display
   - Chromatic aberration correction
   - Lens distortion correction
```

#### **Software Recommendations**
```bash
# Professional Tools
Adobe Lightroom + Photoshop: Full workflow control
PTGui: Advanced stitching and projection control
Insta360 Studio: Camera-specific optimization

# Free/Budget Tools  
Hugin: Open-source stitching software
GIMP: Free image editing
RawTherapee: RAW processing
```

### Content Guidelines

#### **Composition Best Practices**
```bash
# ✅ Visual Composition Rules
- Create clear focal points in multiple directions
- Avoid empty or boring ceiling areas
- Include interesting floor details (patterns, textures)
- Ensure 4+ points of interest around 360° view
- Balance visual weight across the sphere
- Consider the user's natural viewing patterns

# ✅ Lighting Guidelines
- Aim for even, soft lighting
- Avoid extreme contrast areas
- Use HDR techniques for high-contrast scenes
- Consider golden hour for outdoor panoramas
- Ensure text/UI overlays will remain readable

# ✅ Content Appropriateness
- Family-friendly content only
- No copyrighted material without permission
- Respect privacy and property rights
- Cultural sensitivity in all content
```

#### **Metadata & Documentation**
```typescript
interface PanoramaMetadata {
  // Technical Information
  captureDate: string;          // "2024-12-15"
  captureLocation: string;      // "New York, NY, USA"
  equipment: string;            // "Insta360 X3"
  originalResolution: string;   // "5760x2880"
  finalResolution: string;      // "4096x2048"
  
  // Content Information
  description: string;          // Detailed description
  tags: string[];              // ["indoor", "modern", "office"]
  category: string;            // "Social", "Art", "Gaming", etc.
  
  // Rights & Usage
  photographer: string;         // Photographer credit
  license: string;             // "CC0", "Proprietary", etc.
  usageRights: string;         // Usage permissions
  
  // Technical Specs
  fileSize: number;            // Size in bytes
  compressionQuality: number;   // JPEG quality (0-100)
  isProgressive: boolean;      // Progressive JPEG flag
  colorSpace: string;          // "sRGB"
}
```

## 🔧 Processing Workflow

### Automated Processing Pipeline

#### **Batch Processing Script Example**
```bash
#!/bin/bash
# panorama-processor.sh - Automated panorama processing

INPUT_DIR="./raw-panoramas"
OUTPUT_DIR="./processed-panoramas"
TEMP_DIR="./temp"

# Create directories
mkdir -p "$OUTPUT_DIR"/{thumbnails,2k,4k,8k}
mkdir -p "$TEMP_DIR"

# Process each panorama
for file in "$INPUT_DIR"/*.jpg; do
    filename=$(basename "$file" .jpg)
    echo "Processing $filename..."
    
    # 1. Create progressive JPEG versions
    # 2048x1024 (Mobile)
    magick "$file" -resize 2048x1024^ -quality 80 -interlace Plane \
        "$OUTPUT_DIR/2k/${filename}-2k.jpg"
    
    # 4096x2048 (Desktop)  
    magick "$file" -resize 4096x2048^ -quality 85 -interlace Plane \
        "$OUTPUT_DIR/4k/${filename}-4k.jpg"
    
    # 8192x4096 (Premium)
    magick "$file" -resize 8192x4096^ -quality 90 -interlace Plane \
        "$OUTPUT_DIR/8k/${filename}-8k.jpg"
    
    # Create thumbnail
    magick "$file" -resize 800x400^ -quality 75 \
        "$OUTPUT_DIR/thumbnails/${filename}-thumb.jpg"
    
    echo "✅ Completed $filename"
done

echo "🎉 Processing complete!"
```

#### **Quality Validation Script**
```python
#!/usr/bin/env python3
# validate-panoramas.py - Quality assurance for panoramas

import os
from PIL import Image
import json

def validate_panorama(image_path):
    """Validate panorama meets technical requirements"""
    
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            file_size = os.path.getsize(image_path)
            
            validation_result = {
                'path': image_path,
                'valid': True,
                'warnings': [],
                'errors': [],
                'specs': {
                    'resolution': f"{width}x{height}",
                    'aspect_ratio': round(width / height, 2),
                    'file_size_mb': round(file_size / (1024 * 1024), 2),
                    'format': img.format
                }
            }
            
            # Check aspect ratio (should be 2:1)
            aspect_ratio = width / height
            if abs(aspect_ratio - 2.0) > 0.1:
                validation_result['errors'].append(
                    f"Invalid aspect ratio: {aspect_ratio:.2f} (should be 2.0)"
                )
                validation_result['valid'] = False
            
            # Check minimum resolution
            if width < 2048 or height < 1024:
                validation_result['errors'].append(
                    f"Resolution too low: {width}x{height} (minimum: 2048x1024)"
                )
                validation_result['valid'] = False
            
            # Check file size warnings
            if file_size > 2 * 1024 * 1024:  # 2MB
                validation_result['warnings'].append(
                    f"Large file size: {validation_result['specs']['file_size_mb']}MB"
                )
            
            # Check format
            if img.format != 'JPEG':
                validation_result['warnings'].append(
                    f"Non-JPEG format: {img.format}"
                )
            
            return validation_result
            
    except Exception as e:
        return {
            'path': image_path,
            'valid': False,
            'errors': [f"Failed to process: {str(e)}"],
            'warnings': [],
            'specs': {}
        }

# Validate all panoramas in directory
def main():
    panorama_dir = "./processed-panoramas"
    results = []
    
    for root, dirs, files in os.walk(panorama_dir):
        for file in files:
            if file.lower().endswith('.jpg'):
                file_path = os.path.join(root, file)
                result = validate_panorama(file_path)
                results.append(result)
                
                # Print results
                status = "✅" if result['valid'] else "❌"
                print(f"{status} {file}")
                
                for error in result['errors']:
                    print(f"   🚫 {error}")
                for warning in result['warnings']:
                    print(f"   ⚠️  {warning}")
    
    # Save validation report
    with open('panorama-validation-report.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📊 Validation complete. Processed {len(results)} files.")
    valid_count = sum(1 for r in results if r['valid'])
    print(f"✅ Valid: {valid_count}, ❌ Invalid: {len(results) - valid_count}")

if __name__ == "__main__":
    main()
```

## 📊 Asset Management

### File Naming Convention

#### **Standardized Naming Scheme**
```bash
# Format: [category]-[name]-[resolution]-[version].jpg

# Examples:
social-virtual-lounge-4k-v1.jpg
gaming-neon-racing-arena-2k-v2.jpg  
art-modern-gallery-8k-v1.jpg
educational-science-museum-4k-v3.jpg
business-conference-room-2k-v1.jpg

# Thumbnails:
social-virtual-lounge-thumb.jpg
gaming-neon-racing-arena-thumb.jpg

# Version numbering:
v1: Initial version
v2: Updated/improved version  
v3: Major revision
```

### Directory Structure

#### **Organized Asset Hierarchy**
```bash
/public/
├── panoramas/
│   ├── heroes/                    # Hero carousel panoramas
│   │   ├── 2k/
│   │   ├── 4k/
│   │   └── 8k/
│   ├── spaces/                    # Space card panoramas
│   │   ├── 2k/
│   │   ├── 4k/
│   │   └── gaming/
│   │       ├── neon-city-4k.jpg
│   │       └── battle-arena-2k.jpg
│   ├── thumbnails/                # Static preview images
│   └── archive/                   # Old versions
├── textures/                      # Future KTX2/compressed formats
└── metadata/                      # JSON metadata files
```

### CDN & Delivery Optimization

#### **Content Delivery Strategy**
```typescript
interface CDNConfiguration {
  // Primary CDN endpoints
  primaryCDN: "https://cdn.metaverse-directory.com/panoramas/";
  fallbackCDN: "https://backup-cdn.example.com/panoramas/";
  
  // Resolution-specific paths
  resolutionPaths: {
    "2k": "2k/",
    "4k": "4k/", 
    "8k": "8k/",
    "thumbnail": "thumbnails/"
  };
  
  // Cache settings
  cacheHeaders: {
    maxAge: 31536000,        // 1 year
    immutable: true,         // Files never change (versioned)
    publicCache: true        // CDN can cache publicly
  };
}

// Smart resolution selection
function getPanoramaURL(baseName: string, targetResolution?: string): string {
  const resolution = targetResolution || getOptimalResolution();
  const cdnBase = CDN_CONFIG.primaryCDN;
  const path = CDN_CONFIG.resolutionPaths[resolution];
  
  return `${cdnBase}${path}${baseName}-${resolution}.jpg`;
}
```

#### **Performance Monitoring**
```typescript
// Track asset loading performance
interface AssetMetrics {
  filename: string;
  resolution: string;
  fileSize: number;
  loadTime: number;
  cdn: string;
  userAgent: string;
  connectionType: string;
}

function trackAssetLoad(metrics: AssetMetrics) {
  // Send to analytics
  gtag('event', 'panorama_asset_load', {
    asset_name: metrics.filename,
    resolution: metrics.resolution,
    load_time: metrics.loadTime,
    file_size_kb: Math.round(metrics.fileSize / 1024),
    cdn_used: metrics.cdn
  });
  
  // Performance warnings
  if (metrics.loadTime > 3000) {
    console.warn(`Slow panorama load: ${metrics.filename} took ${metrics.loadTime}ms`);
  }
}
```

## 🎯 Quality Assurance

### Pre-Deployment Checklist

#### **Technical Validation**
```bash
# ✅ Technical Quality Assurance
- [x] Aspect ratio is exactly 2:1
- [x] Resolution meets minimum requirements (2048x1024+)
- [x] File size within guidelines for use case
- [x] Progressive JPEG encoding enabled
- [x] No visible seam lines or stitching errors
- [x] Proper equirectangular projection
- [x] sRGB color space
- [x] Tripod/equipment removed from image
- [x] Clean zenith (top) and nadir (bottom) areas

# ✅ Visual Quality Check
- [x] Sharp focus throughout the image
- [x] Even exposure and color balance
- [x] No visible noise or artifacts
- [x] Interesting content in all directions
- [x] Appropriate brightness for web viewing
- [x] Text overlays will remain readable
- [x] Cultural sensitivity and appropriateness
```

#### **Browser Compatibility Testing**
```typescript
// Test matrix for panorama compatibility
const testMatrix = [
  { browser: 'Chrome', version: '90+', expected: 'Full support' },
  { browser: 'Firefox', version: '88+', expected: 'Full support' },
  { browser: 'Safari', version: '14+', expected: 'Progressive JPEG required' },
  { browser: 'Edge', version: '90+', expected: 'Full support' },
  { browser: 'iOS Safari', version: '14+', expected: 'Progressive JPEG + reduced resolution' },
  { browser: 'Android Chrome', version: '90+', expected: 'Size limits apply' }
];

// Automated compatibility testing
async function testPanoramaCompatibility(imageUrl: string) {
  const results = [];
  
  for (const test of testMatrix) {
    try {
      const loadResult = await testPanoramaLoad(imageUrl, test.browser);
      results.push({
        ...test,
        result: loadResult.success ? 'PASS' : 'FAIL',
        loadTime: loadResult.loadTime,
        errors: loadResult.errors
      });
    } catch (error) {
      results.push({
        ...test,
        result: 'ERROR',
        error: error.message
      });
    }
  }
  
  return results;
}
```

### Performance Benchmarking

#### **Loading Time Standards**
```typescript
interface PerformanceBenchmarks {
  // Target loading times by use case and connection
  loadTimeTargets: {
    'hero-carousel': {
      '4G': 2000,      // 2 seconds on 4G
      '3G': 4000,      // 4 seconds on 3G  
      'wifi': 1500     // 1.5 seconds on WiFi
    },
    'space-cards': {
      '4G': 1500,      // 1.5 seconds on 4G
      '3G': 3000,      // 3 seconds on 3G
      'wifi': 1000     // 1 second on WiFi  
    }
  };
  
  // File size limits by connection type
  fileSizeLimits: {
    '4G': 500 * 1024,    // 500KB on 4G
    '3G': 300 * 1024,    // 300KB on 3G
    'slow-2g': 150 * 1024 // 150KB on slow connections
  };
}
```

## 🔄 Maintenance & Updates

### Asset Lifecycle Management

#### **Version Control Strategy**
```bash
# Asset versioning workflow
1. Create new panorama → v1
2. Quality improvements → v2  
3. Major content changes → v3
4. Archive old versions after 6 months
5. Keep production + 1 previous version active

# Example version progression:
social-lounge-4k-v1.jpg  (Initial)
social-lounge-4k-v2.jpg  (Improved lighting)
social-lounge-4k-v3.jpg  (Updated furniture)
```

#### **Automated Asset Optimization**
```typescript
// Scheduled optimization tasks
const assetMaintenance = {
  daily: [
    'Monitor CDN cache hit rates',
    'Check for 404 errors on panorama assets',
    'Validate new uploads meet requirements'
  ],
  
  weekly: [
    'Review loading performance metrics',
    'Identify slow-loading assets for optimization',
    'Test panoramas on latest browser versions'
  ],
  
  monthly: [
    'Analyze asset usage patterns',
    'Archive unused panorama versions',
    'Update compression settings for better performance',
    'Generate asset performance report'
  ],
  
  quarterly: [
    'Evaluate new image formats (WebP, AVIF, KTX2)',
    'Review and update quality standards',
    'Benchmark against industry best practices',
    'Plan asset library reorganization'
  ]
};
```

---

**Last Updated**: December 2024  
**Version**: 2.0.0  
**Next Review**: March 2025 (Format Evolution Assessment)