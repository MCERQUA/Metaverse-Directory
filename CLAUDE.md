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