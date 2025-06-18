# Nilaya - Premium NA Plots Landing Page

## Overview

This is a modern, responsive real estate landing page for "Nilaya" - a premium Non-Agricultural (NA) plot project in Nagaon, Alibaug. The application is built as a full-stack solution with a React frontend and Express backend, designed to generate and manage leads for the real estate project.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Components**: Radix UI primitives for accessible components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Simple token-based admin authentication
- **API**: RESTful endpoints for lead management and admin access

## Key Components

### Database Schema
- **Users Table**: Authentication system (ready for future admin features)
  - Fields: id, username, password
- **Leads Table**: Lead capture and management
  - Fields: id, name, phone, email, plotSize, message, createdAt

### API Endpoints
- `POST /api/leads` - Create new lead with validation
- `GET /api/leads` - Retrieve all leads (admin functionality, requires authentication)
- `POST /api/admin/login` - Admin authentication endpoint

### Frontend Pages
- **Home Page**: Complete landing page with all sections
- **Admin Panel**: Protected dashboard for viewing and managing lead inquiries
- **404 Page**: Not found error page

### UI Components
- Comprehensive shadcn/ui component library
- Custom coastal color palette optimized for real estate
- Responsive design with mobile-first approach
- Form validation with proper error handling

## Data Flow

1. **Lead Generation**: Visitors fill out contact forms on the landing page
2. **Validation**: Client-side validation using Zod schemas
3. **API Submission**: Form data sent to Express backend via TanStack Query
4. **Storage**: Leads stored in PostgreSQL database via Drizzle ORM
5. **Confirmation**: Success/error feedback provided to users

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL serverless)
- **UI Framework**: Radix UI components
- **Styling**: Tailwind CSS with custom configuration
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React icons

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full type safety across the stack
- **Database Migrations**: Drizzle Kit for schema management

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with hot reloading
- **Production**: Autoscale deployment on Replit
- **Database**: Environment variable configuration for DATABASE_URL

### Build Process
1. Frontend build via Vite (outputs to `dist/public`)
2. Backend build via esbuild (outputs to `dist`)
3. Static file serving in production

### Port Configuration
- **Development**: Port 5000 (internal)
- **Production**: Port 80 (external)

## Changelog

- June 18, 2025. Initial setup with premium real estate landing page
- June 18, 2025. Added PostgreSQL database integration and admin panel with authentication

## User Preferences

Preferred communication style: Simple, everyday language.