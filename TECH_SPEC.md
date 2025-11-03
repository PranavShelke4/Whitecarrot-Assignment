# Technical Specification - Careers Page Builder

**Author**: Pranav Shelke  
**Project**: WhiteCarrot AI Assignment  
**Version**: 1.0  
**Date**: November 2025

## Project Assumptions

### Business Assumptions
1. **Multi-tenant Model**: Each company operates independently with isolated data
2. **Self-service Setup**: Companies can register and set up their careers page without manual intervention
3. **Email Notifications**: Only candidates receive confirmation emails (no company notifications)
4. **Public Access**: Careers pages are publicly accessible without authentication
5. **Simple Branding**: Companies need basic customization (colors, logos) rather than complex themes

### Technical Assumptions
1. **Modern Browser Support**: Targeting ES6+ compatible browsers (Chrome 60+, Firefox 55+, Safari 12+)
2. **Reasonable Scale**: Expecting 100-1000 companies, 10,000+ jobs, 50,000+ applications
3. **Email Delivery**: Using Resend for reliable email delivery (could be swapped for SendGrid/AWS SES)
4. **File Storage**: Resume links are external URLs (not handling file uploads in MVP)
5. **Search Complexity**: Simple text-based search sufficient (no need for Elasticsearch initially)

### Constraints & Limitations
- No real-time features (WebSocket connections)
- No advanced analytics or reporting
- No payment processing or subscription management
- No bulk operations or CSV imports/exports
- No advanced role-based permissions within companies

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Candidates    │    │   Companies     │    │   Dashboard     │
│  (Public Web)   │    │  (Auth Required)│    │  (Auth Required)│
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Next.js App         │
                    │   (Frontend + API)      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      Supabase          │
                    │  (Database + Auth)      │
                    └─────────────────────────┘
```

### Component Architecture

#### Frontend Layer
- **Pages**: Authentication, Dashboard, Public Careers Pages
- **Components**: Reusable UI elements (forms, cards, modals)
- **Hooks**: Custom React hooks for data fetching and state management
- **Utils**: Helper functions for validation, formatting, and API calls

#### API Layer
- **Route Handlers**: RESTful endpoints for CRUD operations
- **Middleware**: Authentication verification and request routing
- **Validation**: Input sanitization and business rule enforcement

#### Data Layer
- **Supabase Client**: Database connection and query execution
- **RLS Policies**: Row-level security for data isolation
- **Migrations**: Version-controlled schema changes

## Database Schema

### Core Tables

#### 1. Companies Table
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  website VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Business Rules**:
- Each user can create multiple companies
- Slug must be unique across all companies (for public URLs)
- Cascade delete when user is removed

#### 2. Company Customization Table
```sql
CREATE TABLE company_customization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
  primary_color VARCHAR(7) DEFAULT '#3b82f6',
  secondary_color VARCHAR(7) DEFAULT '#64748b',
  banner_image_url TEXT,
  logo_url TEXT,
  culture_video_url TEXT,
  about_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Design Decisions**:
- One-to-one relationship with companies
- Default colors ensure pages always have styling
- External URLs for assets (no file storage complexity)

#### 3. Jobs Table
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  location VARCHAR(255),
  job_type VARCHAR(50) CHECK (job_type IN ('Full-time', 'Part-time', 'Contract', 'Internship')),
  employment_type VARCHAR(50) CHECK (employment_type IN ('Permanent', 'Temporary', 'Contract')),
  experience_level VARCHAR(50) CHECK (experience_level IN ('Entry', 'Mid', 'Senior', 'Lead', 'Executive')),
  salary_min INTEGER,
  salary_max INTEGER,
  currency VARCHAR(3) DEFAULT 'USD',
  work_policy VARCHAR(20) CHECK (work_policy IN ('Remote', 'Hybrid', 'Onsite')),
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  responsibilities TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Features**:
- Enumerated values for consistency
- Optional salary range (some companies prefer not to disclose)
- Order index for custom job prioritization
- Rich text fields for detailed descriptions

#### 4. Job Applications Table
```sql
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  resume_link TEXT,
  linkedin_link TEXT,
  github_link TEXT,
  joining_days INTEGER,
  custom_answers JSONB,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Application Design**:
- No user account required for candidates
- JSONB for flexible custom questions
- Duplicate company_id for easier querying
- External resume links (candidates upload to Google Drive, etc.)

### Indexes & Performance

```sql
-- Performance indexes
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_order_index ON jobs(company_id, order_index);
CREATE INDEX idx_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_applications_company_id ON job_applications(company_id);
CREATE INDEX idx_applications_email ON job_applications(email);
```

### Row Level Security (RLS) Policies

#### Companies Table
```sql
-- Users can only access their own companies
CREATE POLICY "Users can view own companies" ON companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own companies" ON companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### Jobs Table
```sql
-- Users can only manage jobs for their companies
CREATE POLICY "Users can view own company jobs" ON jobs
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );
```

#### Public Access Policies
```sql
-- Public read access for careers pages
CREATE POLICY "Public can view companies by slug" ON companies
  FOR SELECT USING (true);

CREATE POLICY "Public can view published jobs" ON jobs
  FOR SELECT USING (true);
```

## API Design

### Authentication Endpoints
- `POST /auth/sign-up` - User registration
- `POST /auth/sign-in` - User login
- `POST /auth/sign-out` - User logout

### Company Management
- `GET /api/companies` - List user's companies
- `POST /api/companies` - Create new company
- `PUT /api/companies/[id]` - Update company details

### Job Management
- `GET /api/jobs?company_id=:id` - List company jobs
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/[id]` - Update job details
- `DELETE /api/jobs/[id]` - Remove job

### Public APIs
- `GET /careers/[slug]` - Public careers page
- `GET /api/public/companies/[slug]` - Company data
- `GET /api/public/jobs?company_slug=:slug` - Public job listings
- `POST /api/applications` - Submit job application

### Error Handling Strategy
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error (system errors)

## Test Plan

### Unit Testing Strategy
**Framework**: Jest + React Testing Library

#### Critical Components to Test
1. **Authentication Forms**
   - Valid/invalid email formats
   - Password strength validation
   - Error message display

2. **Job Management**
   - Form validation for required fields
   - Salary range validation
   - Character limits for descriptions

3. **Application Submission**
   - Required field validation
   - Email format verification
   - Phone number formatting

#### Sample Test Cases
```javascript
// Example test structure
describe('Job Application Form', () => {
  test('should reject invalid email formats', () => {
    // Test implementation
  });
  
  test('should require all mandatory fields', () => {
    // Test implementation
  });
  
  test('should submit valid applications', () => {
    // Test implementation
  });
});
```

### Integration Testing
**Tools**: Playwright for E2E testing

#### User Journeys to Test
1. **Company Onboarding**
   - Sign up → Create company → Add first job → Preview page

2. **Job Management**
   - Create job → Edit details → Reorder jobs → Delete job

3. **Application Flow**
   - View careers page → Apply for job → Receive confirmation

#### API Testing
- Test all CRUD operations
- Verify RLS policies work correctly
- Test error scenarios and edge cases

### Manual Testing Checklist

#### Cross-browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile Responsiveness
- [ ] iPhone (iOS Safari)
- [ ] Android (Chrome)
- [ ] Tablet views

#### Accessibility Testing
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast compliance
- [ ] Focus indicators

### Performance Testing

#### Metrics to Monitor
- Page load times < 3 seconds
- Database query performance < 500ms
- Email delivery success rate > 99%

#### Load Testing Scenarios
- 100 concurrent users browsing careers pages
- 50 simultaneous job applications
- Multiple companies updating jobs simultaneously

## Security Considerations

### Data Protection
- All sensitive data encrypted at rest (Supabase default)
- HTTPS enforced for all communications
- Input sanitization on all user inputs
- Rate limiting on public endpoints

### Authentication & Authorization
- JWT tokens with secure refresh mechanism
- RLS policies prevent data leakage between companies
- No sensitive data in client-side code

### Email Security
- Email addresses validated before sending
- Resend API key stored securely in environment variables
- No sensitive data included in email content

## Deployment Strategy

### Environment Configuration
- **Development**: Local Next.js with local Supabase
- **Staging**: Vercel preview deployments
- **Production**: Vercel with production Supabase

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

### CI/CD Pipeline
1. Code push triggers Vercel build
2. Automated tests run on preview deployments
3. Manual approval for production deployment
4. Database migrations applied via Supabase CLI

## Future Considerations

### Scalability Improvements
- Implement caching layer (Redis) for frequently accessed data
- Add database read replicas for improved query performance
- Consider CDN for static assets

### Feature Enhancements
- Advanced search with Elasticsearch
- Real-time notifications with WebSockets
- File upload for resumes
- Integration with popular ATS systems

### Monitoring & Observability
- Application performance monitoring (APM)
- Error tracking and alerting
- User behavior analytics
- Database performance monitoring

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