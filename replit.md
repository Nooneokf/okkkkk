# TempMail - Custom Disposable Email Service

## Overview

TempMail is a modern disposable email service built with Next.js that provides temporary email addresses for users to protect their privacy online. The application offers both free and premium tiers, with features ranging from basic temporary inboxes to custom domain support and permanent storage for Pro users. The service is designed to be fast, ad-free, and privacy-focused, supporting multiple languages and integrating with Discord for user authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS with custom design system using CSS variables
- **UI Components**: Radix UI primitives wrapped in custom components (shadcn/ui pattern)
- **Internationalization**: next-intl for multi-language support (7 languages: en, de, zh, es, hi, fr, ru)
- **Theme System**: next-themes for dark/light mode switching
- **State Management**: React hooks with SWR for data fetching and caching
- **Animations**: Framer Motion for smooth transitions and micro-interactions

### Backend Architecture
- **API Routes**: Next.js API routes for server-side functionality
- **Authentication**: NextAuth.js with Discord OAuth integration
- **Session Management**: JWT tokens for secure session handling
- **Middleware**: Custom middleware for internationalization routing and authentication

### Data Storage Solutions
- **Database**: MongoDB for user data, domains, and email storage
- **Session Storage**: Server-side session management with NextAuth
- **Client Storage**: Local storage for user preferences and temporary data
- **Email Storage**: Tiered storage system (12-hour for guests, 24-hour for free users, permanent for Pro)

### Authentication and Authorization
- **Primary Auth**: Discord OAuth through NextAuth.js
- **Session Management**: JWT-based sessions with automatic refresh
- **Role-Based Access**: Three-tier system (Anonymous, Free Discord users, Pro users)
- **API Security**: Internal API key authentication for service communication

### Key Features by User Tier
- **Anonymous Users**: Basic temp mail with 5 emails, 12-hour storage
- **Free Discord Users**: Enhanced limits (10 emails, 24-hour storage, basic keyboard shortcuts)
- **Pro Users**: Custom domains, unlimited storage, 25MB attachments, advanced features

### Email System
- **Domain Management**: Multiple free domains with custom domain support for Pro users
- **Email Processing**: Real-time email reception with WebSocket connections for live updates
- **Attachment Handling**: File attachment support with size limits based on user tier
- **Spam Protection**: Built-in filtering and user-controlled mute lists

### Deployment and Infrastructure
- **Primary Platform**: Vercel for Next.js deployment
- **Alternative Support**: Cloudflare Workers with OpenNext for edge deployment
- **CDN**: Global edge caching for optimal performance
- **Monitoring**: Built-in analytics with Google Analytics integration

### Content Management
- **Blog System**: Markdown-based blog with static generation and manifest system
- **SEO Optimization**: Automated sitemap generation and structured data
- **Performance**: Optimized for Core Web Vitals with image optimization and code splitting

## External Dependencies

### Core Services
- **Service API**: External API service for email processing and management (requires SERVICE_API_URL and INTERNAL_API_KEY)
- **RapidAPI**: Integration for scalable API access and billing management
- **MongoDB**: Primary database for user data and email storage

### Authentication & Social
- **Discord OAuth**: Primary authentication provider through NextAuth.js
- **NextAuth.js**: Complete authentication solution with session management

### UI & Styling
- **Radix UI**: Accessible component primitives for dialogs, dropdowns, tooltips
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **React Icons**: Additional icons including brand logos (Discord, GitHub, etc.)

### Functionality Libraries
- **next-intl**: Internationalization with routing and translation management
- **Framer Motion**: Animation library for smooth user interactions
- **QRCode.react**: QR code generation for email sharing
- **React Markdown**: Markdown rendering for blog posts and content
- **SWR**: Data fetching with caching and revalidation
- **React Hot Toast/Sonner**: Toast notifications for user feedback

### Development & Build Tools
- **Gray Matter**: Frontmatter parsing for blog posts
- **next-sitemap**: Automated sitemap generation
- **Jose**: JWT handling for secure token management
- **Miniflare**: Local development environment for Cloudflare Workers testing

### Analytics & Monitoring
- **Google Analytics**: User analytics and performance tracking
- **Next.js Analytics**: Built-in performance monitoring

### Email & Communication
- **cookies-next**: Cookie management for user preferences
- **SMTP/Email Services**: Backend email processing through service API
- **WebSocket**: Real-time email notifications and updates