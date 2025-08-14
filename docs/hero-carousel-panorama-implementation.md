# Hero Carousel Panorama Implementation Documentation

## Overview
The Hero Carousel component successfully displays 360° panorama images for both Mike's Room and White Space. This document details the working implementation that can be used as a reference for fixing or implementing similar functionality elsewhere.

## Component Location
`/components/hero-carousel/hero-carousel.tsx`

## Working Implementation Analysis

### 1. Data Structure
The hero carousel uses a `FeaturedSpace` interface with clear separation of concerns:

```typescript
interface FeaturedSpace {
  id: number
  name: string
  creator: string
  category: string
  description: string
  userCount: number
  image: string              // Path to image/panorama
  tags: string[]
  isRealSpace?: boolean      // Indicates if this is a real/live space
  liveUrl?: string          // External URL for live spaces
}
```

### 2. Featured Spaces Data
The working spaces are defined with:
- **Mike's Room** (id: 1001): `/room1-360.jpg` panorama
- **White Space** (id: 1003): `/white-room.jpg` panorama
- Both have `isRealSpace: true` and `liveUrl` defined

### 3. Key Success Factor: Conditional Rendering
The hero component uses a **specific condition** to determine when to show panorama:

```typescript
{space.isRealSpace && (space.image === "/room1-360.jpg" || space.image === "/white-room.jpg") ? (
  <PanoramaViewer
    id={`hero-panorama-${space.id}`}
    imageUrl={space.image}
    autoRotate={-2}
    showControls={false}
    initialPitch={10}
    initialYaw={180}
    height="100%"
    className="absolute inset-0"
  />
) : (
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: space?.image ? `url(${space.image})` : 'none' }}
  />
)}
```

### 4. Why This Works

#### Explicit Image Path Check
- The component explicitly checks for the exact panorama image paths
- This ensures only actual 360° images are rendered with PanoramaViewer
- Regular images use standard background-image CSS

#### Unique IDs
- Each panorama instance has a unique ID: `hero-panorama-${space.id}`
- This prevents conflicts between multiple PanoramaViewer instances

#### Proper State Management
- Each space is rendered but only the current slide is visible
- Uses `opacity` and `pointer-events` for smooth transitions
- Prevents multiple active panorama viewers at once

### 5. PanoramaViewer Configuration
The working configuration uses:
- `autoRotate={-2}`: Slow automatic rotation (negative = left)
- `showControls={false}`: Clean appearance without controls
- `initialPitch={10}`: Slight downward angle
- `initialYaw={180}`: Starting rotation position
- `height="100%"`: Full container height
- `className="absolute inset-0"`: Full container coverage

### 6. Dynamic Import
The PanoramaViewer is dynamically imported with SSR disabled:
```typescript
const PanoramaViewer = dynamic(() => import("@/components/panorama-viewer"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gray-900 animate-pulse" />
})
```

### 7. Auto-rotation Carousel
- Slides change every 6 seconds
- Auto-play pauses on hover
- Manual navigation via indicator dots
- Smooth opacity transitions between slides

## Critical Implementation Details

### Visibility Management
```typescript
className={`absolute inset-0 transition-opacity duration-1000 ${
  index === currentSlide ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
}`}
```
- Only the current slide has `pointer-events-auto`
- Hidden slides have `pointer-events-none` to prevent interaction
- This prevents multiple panorama viewers from conflicting

### Performance Considerations
1. **Lazy Loading**: PanoramaViewer is dynamically imported
2. **Conditional Rendering**: Only panorama images use PanoramaViewer
3. **Single Active Instance**: Only current slide can receive events
4. **Cleanup**: Component properly cleans up intervals on unmount

## File Dependencies
- `/public/room1-360.jpg` - Mike's Room 360° panorama (344KB)
- `/public/white-room.jpg` - White Space 360° panorama (289KB)
- `/components/panorama-viewer.tsx` - Pannellum wrapper component
- Pannellum library (loaded via CDN)

## How to Apply This Pattern

### For Space Cards
To make space cards work like the hero:
1. Check for specific panorama image paths (not just `isRealSpace`)
2. Use unique IDs for each PanoramaViewer instance
3. Ensure only visible cards can receive pointer events
4. Consider performance impact of multiple panorama instances

### For New Panoramas
To add new 360° spaces:
1. Add the panorama image to `/public/`
2. Add the space to the data with correct image path
3. Update the condition to include the new image path
4. Ensure unique ID generation

## Known Working Configuration
- Next.js 14.2.16
- React 18
- Pannellum 2.5.6 (via CDN)
- Dynamic imports with SSR disabled
- Tailwind CSS for styling

## Troubleshooting

### If panoramas don't display:
1. Check if image paths match exactly in the condition
2. Verify images exist in `/public/` directory
3. Check browser console for Pannellum initialization errors
4. Ensure unique IDs for each instance
5. Verify `isRealSpace` flag is set correctly

### If performance issues occur:
1. Limit number of simultaneous panorama instances
2. Consider lazy loading based on visibility
3. Reduce auto-rotation speed or disable it
4. Use lower resolution panorama images

## Summary
The hero carousel works because it:
- Explicitly checks for known panorama image paths
- Uses unique IDs for each panorama instance
- Manages visibility to prevent conflicts
- Properly initializes Pannellum with correct configuration
- Only renders PanoramaViewer for actual 360° images