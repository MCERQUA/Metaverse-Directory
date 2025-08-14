# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Metaverse Directory is a Netflix-style browsing platform for discovering and exploring virtual 3D worlds and metaverse spaces. Built with Next.js 14, TypeScript, and Tailwind CSS, the project is deployed on Vercel and synced with v0.app.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Architecture

### Core Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v3 with CSS variables
- **UI Components**: Radix UI primitives + shadcn/ui components
- **3D Graphics**: Three.js for WebGL scenes
- **Authentication**: Custom client-side auth with localStorage
- **Deployment**: Vercel (auto-sync with v0.app)

### Project Structure

#### Pages (App Router)
- `/` - Home page with hero carousel and space grid
- `/login` - User authentication page
- `/signup` - New user registration
- `/dashboard` - User dashboard for managing spaces
- `/submit` - Submit new virtual spaces
- `/submit/success` - Submission confirmation

#### Component Architecture
- **Navigation**: Header with search bar and user menu
- **Hero Carousel**: Featured spaces showcase with auto-rotation
- **Space Grid**: Category-based browsing with filtering
- **Auth System**: Context-based authentication with protected routes
- **Three.js Integration**: WebGL scene previews with fallback detection

### Key Patterns

#### Authentication Flow
The app uses a custom `AuthContext` provider with localStorage-based persistence:
- User data stored in `metaverse_auth` key
- All users stored in `metaverse_users` key
- Protected routes use `ProtectedRoute` component wrapper

#### Mock Data Structure
Virtual spaces include:
- Basic info: `name`, `creator`, `category`
- Metrics: `visitors`, `rating`
- Assets: `image`, `featured` flag
- Categories: Gaming, Social, Educational, Art, Business

#### Styling Approach
- Dark theme by default (set in `layout.tsx`)
- CSS variables for theming via Tailwind config
- Radix UI components styled with `className` props
- Responsive design using Tailwind utilities

## Important Configuration

### Build Settings
The project has relaxed build constraints in `next.config.mjs`:
- ESLint errors ignored during builds
- TypeScript errors ignored during builds
- Images unoptimized for faster builds

### Path Aliases
TypeScript paths configured with `@/` prefix:
- `@/components` - UI components
- `@/contexts` - React contexts
- `@/lib` - Utilities and services
- `@/app` - Next.js app directory

### Tailwind Customization
- Custom color scheme using CSS variables
- Extended animations for accordion components
- Dark mode class-based switching
- Content paths include all TypeScript/JavaScript files

## v0.app Integration

This repository automatically syncs with v0.app deployments:
- Changes made in v0.app are pushed to this repo
- Vercel deploys from the main branch
- Project chat: https://v0.app/chat/projects/YX0jNGmDbOa
- Live deployment: https://vercel.com/mike-cerquas-projects/v0-create-a-project

## Development Notes

### WebGL Support
The app includes WebGL detection for Three.js scenes:
- `WebGLDetector` component checks browser capabilities
- Fallback UI shown when WebGL is unavailable
- Scene previews lazily loaded for performance

### Category System
Spaces are organized into categories with dynamic filtering:
- Categories: All, Gaming, Social, Educational, Art, Business
- Multiple showcase rows: Trending, Staff Picks, New Arrivals, Popular
- Loading skeletons during category transitions

### Form Handling
- React Hook Form for form validation
- Zod schemas for runtime validation
- Custom form components in `@/components/forms`

### Component Library
Using shadcn/ui components with Radix UI primitives:
- Pre-configured in `components.json`
- Lucide React for icons
- Components stored in `@/components/ui`
- claude code is running on a virtual server you can test local deployments but the user cannot "view" them as their is no "Localhost" only use local deploy for debuging and not visual testing

## 🌐 360° Panorama System (CRITICAL REFERENCE)

### **MANDATORY DOCUMENTATION REVIEW**
Before working with panoramas, hero carousels, or space cards, **ALWAYS REVIEW** these comprehensive guides:

#### **Implementation Guides**
- **`/docs/HERO-PANORAMA-IMPLEMENTATION-GUIDE.md`** - Complete guide for adding 360° panoramas to hero carousel
- **`/docs/SPACE-CARD-PANORAMA-IMPLEMENTATION-GUIDE.md`** - Step-by-step guide for panorama space cards
- **`/docs/PANORAMA-TROUBLESHOOTING-GUIDE.md`** - Debugging WebGL context issues, performance problems
- **`/docs/PANORAMA-ASSET-REQUIREMENTS.md`** - Technical specifications, file formats, optimization

#### **Research & Architecture**
- **`/docs/COMPREHENSIVE-360-PANORAMA-RESEARCH-2024.md`** - 22,000+ word research on panorama implementation
- **`/docs/360-PANORAMA-HERO-SYSTEM.md`** - System architecture and performance documentation

### **Panorama Implementation Rules**

#### **Adding New Hero Panoramas**
**CRITICAL**: Always follow `/docs/HERO-PANORAMA-IMPLEMENTATION-GUIDE.md`

1. **Before Adding Any Hero Panorama:**
   - Review panorama asset requirements in `/docs/PANORAMA-ASSET-REQUIREMENTS.md`
   - Ensure progressive JPEG encoding (iOS Safari requirement)
   - Target < 600KB file size, 4096x2048 resolution
   - Verify 2:1 aspect ratio (equirectangular projection)

2. **Required Hero Space Structure:**
```typescript
{
  id: number,                    // Unique ID
  name: string,                 // Display name
  creator: string,              // Creator attribution
  category: string,             // Category (Social, Art, Gaming, etc.)
  description: string,          // Rich description
  userCount: number,           // Visitor count
  image: "/panorama-file.jpg", // Path to 360° image
  tags: ["Live", "360°", "..."], // Must include "360°"
  isRealSpace: true,           // CRITICAL: Must be true
  liveUrl?: string             // Optional live space URL
}
```

3. **Update Detection Logic:** Add new panorama to conditional in `hero-carousel.tsx`:
```typescript
{space.isRealSpace && (
  space.image === "/room1-360.jpg" || 
  space.image === "/white-room.jpg" ||
  space.image === "/your-new-panorama.jpg"  // ADD HERE
) ? (
  <OptimizedPanoramaViewer ... />
```

#### **Adding New Space Card Panoramas**
**CRITICAL**: Always follow `/docs/SPACE-CARD-PANORAMA-IMPLEMENTATION-GUIDE.md`

1. **Required Space Card Structure:**
```typescript
{
  id: number,
  name: string,
  creator: string,
  category: string,
  visitors: number,
  rating: number,
  image: "/thumbnails/static-thumb.jpg",    // Static thumbnail
  image360: "/panoramas/360-view.jpg",      // 360° panorama
  isRealSpace: true,                        // CRITICAL: Enables panorama
  liveUrl?: string
}
```

2. **Use Optimized Component:**
```typescript
<InteractiveSpaceCardOptimized
  id={space.id}
  name={space.name}
  // ... other props
  image360={space.image360}      // 360° panorama URL
  thumbnail={space.image}        // Static preview
  isRealSpace={space.isRealSpace} // Must be true
/>
```

#### **Performance & WebGL Context Management**
**CRITICAL**: WebGL context limits MUST be respected to prevent crashes

1. **Context Limits:**
   - **Desktop**: Maximum 6 concurrent panorama viewers
   - **Mobile**: Maximum 4 concurrent panorama viewers  
   - **iOS Safari**: Maximum 3 concurrent (most restrictive)

2. **Resource Cleanup:** Always ensure proper cleanup in components
3. **Lazy Loading:** Space cards use lazy loading, heroes load immediately
4. **Error Handling:** Implement fallback to static images for failed panoramas

#### **Troubleshooting Checklist**
When panoramas don't work, check `/docs/PANORAMA-TROUBLESHOOTING-GUIDE.md`:

1. **"Too many WebGL contexts" error** - Most common issue
2. **Panorama not loading** - Check image paths and `isRealSpace: true`
3. **Poor performance** - Verify image compression and concurrent viewer limits
4. **Mobile issues** - iOS Safari requires progressive JPEG encoding

#### **Asset Requirements Summary**
From `/docs/PANORAMA-ASSET-REQUIREMENTS.md`:
- **Format**: Progressive JPEG (MANDATORY for iOS)
- **Resolution**: 4096x2048 (desktop), 2048x1024 (mobile)
- **File Size**: Heroes < 600KB, Space Cards < 400KB
- **Aspect Ratio**: Exactly 2:1 (equirectangular)
- **Color Space**: sRGB

### **Integration Points**
- **Hero Carousel**: `/components/hero-carousel/hero-carousel.tsx`
- **Space Grid**: `/components/space-grid/enhanced-category-row.tsx`
- **Demo Page**: `/app/demo-optimized-panorama/page.tsx`
- **Optimized Viewer**: `/components/panorama-viewer-optimized.tsx`

### **Testing Requirements**
1. **Build Test**: `npm run build` must succeed
2. **Performance**: No "too many WebGL contexts" errors
3. **Mobile**: Test on iOS Safari (most restrictive)
4. **Demo Page**: Verify `/demo-optimized-panorama` works properly