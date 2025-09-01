# Overview

Paramkirpa is a full-stack spiritual devotional app built with React and Express/Node.js. The application provides day-wise categorized devotional content (Mantras, Chalisas, Aartis, Stotrams) and allows users to post anonymous prayers with emoji reactions. The app features language toggle between English and Hindi and is designed with a calming spiritual interface inspired by meditation apps.

# User Preferences

Preferred communication style: Simple, everyday language.
Background theme: Krishna peacock feather theme with static gradient from deep blue to teal - no animation, minimal floating element movement.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Extensive use of Radix UI primitives with shadcn/ui components for consistent design system
- **Styling**: Tailwind CSS with custom spiritual color palette and glass-morphism effects
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth animations and transitions
- **Language Support**: Custom language context provider supporting English and Hindi

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development Server**: Vite integration for development with HMR support
- **API Design**: RESTful API with structured route handling
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Validation**: Zod schemas for request/response validation

## Database Schema Design
The application uses Zod schemas defining:
- **Content**: Day-based devotional content with multilingual support (English/Hindi)
- **Prayer**: Anonymous prayer posts with emoji reaction counts
- **Categories**: Mantras, Chalisas, Aartis, Stotrams organized by days of the week

## API Structure
- `GET /api/v1/content` - Fetch devotional content by day and category with language support
- `GET /api/v1/content/featured` - Get featured content for a specific day
- `POST /api/v1/prayers` - Submit anonymous prayers
- `GET /api/v1/prayers` - Fetch prayers with pagination
- `POST /api/v1/prayers/:id/react` - Add emoji reactions to prayers

## Component Architecture
- **Modular Components**: Reusable UI components with consistent props interface
- **Layout Components**: Header, floating background, and responsive grid layouts
- **Feature Components**: Content categories, day tabs, prayer feed, and input forms
- **Custom Hooks**: Language management, mobile detection, and toast notifications

# External Dependencies

## UI Framework Dependencies
- **Radix UI**: Complete set of unstyled, accessible UI primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS integration
- **Framer Motion**: Animation library for React components
- **Lucide React**: Icon library for consistent iconography

## Development and Build Tools
- **Vite**: Fast build tool and development server with React plugin
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **Wouter**: Minimalist routing library for React

## Data and State Management
- **TanStack Query**: Server state management with caching and synchronization
- **Zod**: Schema validation for API requests and responses
- **React Hook Form**: Form state management with validation

## Backend Runtime Dependencies
- **Express.js**: Web application framework for Node.js
- **Date-fns**: Date utility library for timestamp formatting

## Database Integration (Prepared)
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect configured
- **Neon Database**: Serverless PostgreSQL database connection ready
- Database migration system configured with Drizzle Kit

## Styling and Design System
- **Class Variance Authority**: Utility for creating variant-based component APIs
- **CLSX & Tailwind Merge**: Conditional class name utilities
- **Custom CSS Variables**: Spiritual-themed color palette with dark mode support