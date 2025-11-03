# Careers Page Builder

**Assignment Submission for WhiteCarrot AI**

A comprehensive careers page builder application that enables companies to create beautiful, customizable job listing pages. Built as part of the technical assessment for WhiteCarrot AI, this project demonstrates full-stack development capabilities with modern web technologies.

## 🌐 Live Demo

**Production URL**: [whitecarrot-assignment-two.vercel.app](https://whitecarrot-assignment-two.vercel.app)

*Note: The application will be deployed on Vercel for easy access and testing.*

## 🚀 Project Overview

This application serves as a multi-tenant SaaS platform where companies can:
- Create and manage their career pages
- Customize branding with colors, logos, and company information
- Post and manage job listings
- Receive and track job applications
- Share their careers page with candidates

## ✨ Key Features

### Company Dashboard
- **Company Profile Management**: Complete company setup with customizable branding
- **Job Management**: Create, edit, and organize job postings with detailed information
- **Application Tracking**: View and manage candidate applications
- **Live Preview**: Real-time preview of the careers page before publishing
- **Responsive Design**: Works seamlessly across all devices

### Candidate Experience
- **Clean Job Listings**: Professional display of available positions
- **Advanced Search & Filters**: Filter by location, job type, experience level, and department
- **Detailed Job Information**: Comprehensive job descriptions with requirements and benefits
- **Easy Application Process**: Streamlined application submission

## 🛠 Technical Implementation

### Frontend Architecture
- **Framework**: Next.js 16 with App Router for optimal performance
- **UI Components**: Custom-built components using Radix UI primitives
- **Styling**: Tailwind CSS for responsive and maintainable styling
- **State Management**: React hooks with optimistic updates
- **Type Safety**: Full TypeScript implementation

### Backend & Database
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with secure JWT tokens
- **API**: Next.js Route Handlers for server-side operations
- **Security**: Comprehensive RLS policies and input validation

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── careers/           # Public careers pages
│   ├── dashboard/         # Company dashboard
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── careers/          # Careers page components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utility functions and configurations
│   ├── supabase/         # Database client setup
│   └── utils/            # Helper functions
```

## 🌟 Demo Flow

1. **Company Registration**: Sign up and create a company profile
2. **Customization**: Set up branding colors, logo, and company information
3. **Job Creation**: Add job listings with detailed descriptions
4. **Preview & Publish**: Review the careers page and get a shareable link
5. **Application Management**: Track and manage incoming applications

## 🏃‍♂️ How to Run Locally

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database and authentication)
- Resend account (for email functionality)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/PranavShelke4/Whitecarrot-Assignment-.git
   cd careers-page-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Create a company account to get started

## 🛠 What I Built

### Core Features Implemented
- **Multi-tenant Architecture**: Each company gets isolated data and customization
- **Company Dashboard**: Full CRUD operations for jobs and company settings
- **Public Careers Pages**: SEO-optimized pages accessible via company slug
- **Application System**: Candidates can apply with form validation and email confirmations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### Technical Achievements
- **Authentication Flow**: Secure signup/login with email verification
- **Database Design**: Properly normalized schema with relationships and constraints
- **API Development**: RESTful endpoints with proper error handling
- **Email Integration**: Automated confirmation emails using Resend
- **Type Safety**: Full TypeScript implementation throughout
- **Security**: Row Level Security policies ensuring data isolation

## 👥 Step-by-Step User Guide

### For Companies (Recruiters)

#### Getting Started
1. **Sign Up**
   - Go to `/auth/sign-up`
   - Enter your email and create a secure password
   - Verify your email address

2. **Create Company Profile**
   - After login, you'll be prompted to create a company
   - Enter company name and choose a unique slug (this becomes your careers page URL)
   - Add website and description

3. **Customize Your Brand**
   - Navigate to "Company Settings" tab
   - Upload your company logo
   - Set primary and secondary brand colors
   - Add company banner image
   - Write compelling "About Us" content

#### Managing Jobs
4. **Create Your First Job**
   - Go to "Job Management" tab
   - Click "Add New Job"
   - Fill in all job details:
     - Job title and department
     - Location and work policy (remote/hybrid/onsite)
     - Employment type and experience level
     - Salary range (optional)
     - Job description, requirements, and benefits

5. **Organize Jobs**
   - Drag and drop to reorder jobs
   - Edit existing jobs anytime
   - Delete outdated positions

#### Preview & Share
6. **Preview Your Page**
   - Use "Live Preview" tab to see how candidates will see your page
   - Test on different screen sizes
   - Make adjustments as needed

7. **Share with Candidates**
   - Your careers page is available at: `yourdomain.com/careers/your-company-slug`
   - Share this URL on social media, job boards, or your website

#### Managing Applications
8. **Review Applications**
   - Check "Applications" tab regularly
   - View candidate details, resumes, and responses
   - Track application timestamps

### For Candidates (Job Seekers)

#### Finding Jobs
1. **Visit Company Careers Page**
   - Access via company's shared URL
   - Browse available positions

2. **Search & Filter**
   - Use search bar to find specific roles
   - Filter by location, job type, experience level
   - Filter by department or work policy

#### Applying for Jobs
3. **View Job Details**
   - Click on any job to see full description
   - Review requirements, benefits, and company info

4. **Submit Application**
   - Click "Apply Now" button
   - Fill in personal information
   - Add links to resume, LinkedIn, GitHub
   - Answer any custom questions
   - Specify availability/joining timeframe

5. **Confirmation**
   - Receive immediate confirmation on screen
   - Get confirmation email (check spam folder)
   - Company will review and respond within stated timeframe

## 📋 Additional Documentation

For detailed technical information, please refer to:
- **[TECH_SPEC.md](./TECH_SPEC.md)** - Technical architecture, database schema, and assumptions
- **[AGENT_LOG.md](./AGENT_LOG.md)** - AI tool usage log and development insights

---
