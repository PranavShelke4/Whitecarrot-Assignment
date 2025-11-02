# Careers Page Builder

A comprehensive careers page builder application that enables companies to create beautiful, customizable job listing pages. Built as part of the technical assessment for WhiteCarrot AI, this project demonstrates full-stack development capabilities with modern web technologies.

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
