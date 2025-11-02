# Technical Specification - Careers Page Builder

## Overview

The Careers Page Builder is a multi-tenant SaaS application that enables companies to create and manage beautiful careers pages with job listings. The system is built on Next.js 16 with Supabase for data persistence and authentication.

## Architecture

### Frontend Architecture
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19 with shadcn/ui components
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks with SWR for data fetching
- **Type Safety**: TypeScript

### Backend Architecture
- **Runtime**: Next.js Server Components and Route Handlers
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT tokens
- **Security**: Row Level Security (RLS) policies

### Data Flow

```
Client (Browser)
    ↓
Next.js App Router
    ↓
Server Components / Route Handlers
    ↓
Supabase Client (Server-side)
    ↓
PostgreSQL Database
```

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐
│   auth.users    │
│   (Supabase)    │
└────────┬────────┘
         │
         │ 1:N
         ↓
┌─────────────────────────┐
│     companies           │
├─────────────────────────┤
│ id (PK)                 │
│ user_id (FK)            │
│ name                    │
│ slug (UNIQUE)           │
│ website                 │
│ description             │
│ created_at              │
│ updated_at              │
└────────┬────────────────┘
         │
         │ 1:1
         ↓
┌──────────────────────────────┐
│ company_customization        │
├──────────────────────────────┤
│ id (PK)                      │
│ company_id (FK, UNIQUE)      │
│ primary_color                │
│ secondary_color              │
│ banner_image_url             │
│ logo_url                     │
│ culture_video_url            │
│ about_text                   │
│ created_at                   │
│ updated_at                   │
└──────────────────────────────┘

┌─────────────────────────┐
│     companies           │
└────────┬────────────────┘
         │
         │ 1:N
         ↓
┌──────────────────────────────┐
│        jobs                  │
├──────────────────────────────┤
│ id (PK)                      │
│ company_id (FK)              │
│ title                        │
│ department                   │
│ location                     │
│ job_type                     │
│ employment_type              │
│ experience_level             │
│ salary_min                   │
│ salary_max                   │
│ currency                     │
│ description                  │
│ requirements                 │
│ benefits                     │
│ work_policy                  │
│ order_index                  │
│ created_at                   │
│ updated_at                   │
└──────────────────────────────┘
```

## API Endpoints

### Authentication
- `POST /auth/sign-up` - User registration
- `POST /auth/login` - User login
- `POST /auth/sign-out` - User logout

### Companies
- `GET /api/companies` - List user's companies
- `POST /api/companies` - Create company
- `GET /api/companies/:id` - Get company details
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### Jobs
- `GET /api/jobs?company_id=:id` - List jobs for company
- `POST /api/jobs` - Create job
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `PUT /api/jobs/:id/reorder` - Reorder jobs

### Customization
- `GET /api/customization?company_id=:id` - Get customization
- `PUT /api/customization/:id` - Update customization

### Public
- `GET /careers/:slug` - Get public careers page
- `GET /api/public/companies/:slug` - Get company info (public)
- `GET /api/public/jobs?company_slug=:slug` - Get jobs (public)

## Security Considerations

### Row Level Security (RLS)
All tables have RLS policies:
- Users can only view/edit their own companies
- Users can only view/edit jobs for their companies
- Public endpoints allow anyone to view company info and jobs

### Authentication Flow
1. User signs up with email/password
2. Supabase creates auth user and sends confirmation email
3. User confirms email
4. User can now log in
5. JWT token stored in secure HTTP-only cookie
6. Middleware refreshes token on each request