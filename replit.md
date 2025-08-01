# Overview

This is a professional portfolio website built for Roshan Kafle, a Geospatial Engineer and WebGIS Developer from Nepal. The application is a single-page portfolio showcasing professional experience, skills, projects, and achievements in the geospatial and web development domain. It features a modern, responsive design with smooth scrolling navigation between sections including hero, about, skills, experience, projects, and contact information.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack React Query for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Build System**: ESBuild for server-side bundling and tsx for development
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple

## Design System
- **Component Library**: Custom implementation using shadcn/ui with "new-york" style variant
- **Theme**: Custom earth-tone color palette with CSS custom properties for theming
- **Typography**: Inter font family for clean, professional appearance
- **Icons**: Font Awesome and Lucide React icons for consistent iconography
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

## Development Architecture
- **Monorepo Structure**: Shared schema and utilities between client and server
- **Type Safety**: End-to-end TypeScript with shared types and schemas
- **Development Tools**: Hot module replacement with Vite, runtime error overlay for debugging
- **Code Organization**: Clean separation between UI components, pages, hooks, and utilities

# External Dependencies

## Core Technologies
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library for React

## UI and Styling
- **@radix-ui/***: Comprehensive collection of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Utility for conditional className concatenation

## Development and Build Tools
- **vite**: Build tool and development server
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution environment for development
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

## Form Handling and Validation
- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation

## Database and Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **drizzle-kit**: CLI and utilities for Drizzle ORM migrations and schema management

## Additional Utilities
- **date-fns**: Modern JavaScript date utility library
- **embla-carousel-react**: Carousel component for React
- **cmdk**: Command palette component
- **vaul**: Drawer component library