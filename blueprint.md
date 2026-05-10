# WeAreShorex (TourSales) Project Blueprint

## Overview
A high-performance, mobile-first tour sales platform focused on shore excursions around Kuşadası (Ephesus, Pamukkale, Boat Trips). The system is designed to be highly SEO-optimized and supports multiple languages to cater to international tourists.

## Tech Stack
- **Framework**: Next.js 16.2.4 (React 19, App Router)
- **Styling**: Tailwind CSS v4, Framer Motion for animations, canvas-confetti for micro-interactions
- **Database / ORM**: Prisma with SQL Server (`provider = "sqlserver"`)
- **Authentication**: NextAuth (Credentials via bcryptjs)
- **i18n**: next-intl (supports `tr`, `en`, `ru`, `de`, `it`, `ar`, `pl`)
- **Analytics**: PostHog
- **Charts**: Recharts

## Architecture & Directory Structure
- `src/app/[locale]/`: Main App Router structure using localized routes.
  - `(public)`: Public-facing pages like the home page, tour details, and `private-excursions`.
  - `layout.tsx`: Configures NextIntlClientProvider, generates static params for all supported locales, and sets comprehensive, locale-specific OpenGraph and Alternate links for SEO.
- `src/components/`: Reusable UI components (e.g., `tours/TourCard.tsx`).
- `src/i18n/`: Internationalization routing and setup.
- `src/messages/`: JSON translation dictionaries for the supported locales.
- `src/types/`: Shared TypeScript definitions.
- `prisma/`: Prisma schema (`schema.prisma`) and seeding scripts.
- `scripts/`: Utility scripts (e.g., `add-inclusions-en.js`) for managing bulk data updates.

## Database Schema (Prisma)
- **User**: Standard user model with roles (`ADMIN`, `CUSTOMER`) and authentication.
- **Tour**: Core tour entity (`category`, `basePrice`, `mainImage`, `isActive`).
- **TourTranslation**: Localized content for tours (`locale`, `title`, `slug`, `description`, `seoTitle`, `seoDescription`). Critical for the SEO-first strategy.
- **TourDate**: Represents available dates and capacities for bookings.
- **Booking**: Links `User` and `TourDate` with pax, totalPrice, and status.
- **Bus**: Fleet management (capacity, type, plateNumber).

## Core Directives & Rules
These rules are fundamental to the project and must be strictly adhered to:
1. **Mobile-First Design**:
   - 80% mobile user base. Touch targets must be at least 44x44px. No horizontal scroll. Base testing at 375px width. UI must gracefully scale up.
2. **SEO-First Strategy**:
   - Dynamic meta tags and JSON-LD structured data on all pages.
   - Semantic HTML and rigorous LCP/CLS/INP optimization.
   - Keyword-rich, non-stuffed translated descriptions.
3. **Performance (Core Web Vitals)**:
   - Priority loading for hero images.
   - Aggressive CLS mitigation.

## Current State
- The project is actively working on translating and extending tours, adding specialized routes like `private-excursions`, and refining presentation components such as `TourCard.tsx`.
- The root layout is fully configured for i18n metadata generation, supporting 7 languages with proper Canonical and OpenGraph tag mapping.
