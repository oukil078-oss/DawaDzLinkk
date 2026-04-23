# Backend Setup Guide

## Overview
The application is now fully integrated with Supabase as the backend. All data is stored in a PostgreSQL database with proper authentication and Row Level Security (RLS) policies.

## Database Schema
The database includes the following tables:
- **profiles** - User profiles (extends auth.users)
- **pharmacies** - Pharmacy details
- **suppliers** - Supplier details
- **products** - Product catalog
- **agents** - Commercial agents
- **orders** - Order history
- **documents** - KYC documents
- **reviews** - Pharmacy reviews of suppliers

## Getting Started

### 1. Seed the Database
To populate the database with sample data:

1. Click the "🛠️ Dev Tools" button in the bottom-right corner of the page
2. Click "🌱 Seed Database"
3. Wait for the success message

This will create:
- 1 Admin account
- 2 Active supplier accounts with products and agents
- 2 Pharmacy accounts (1 pending, 1 active)

### 2. Test Accounts
After seeding, you can log in with these accounts:

**Admin:**
- Email: `admin@dawalink.dz`
- Password: `admin123456`

**Supplier 1:**
- Email: `supplier1@pharmaplus.dz`
- Password: `supplier123`
- Company: Pharma Plus Distribution

**Supplier 2:**
- Email: `supplier2@medipharm.dz`
- Password: `supplier123`
- Company: MediPharm Solutions

**Pharmacy (Pending):**
- Email: `pharmacy1@madina.dz`
- Password: `pharmacy123`
- Status: Waiting for admin approval

**Pharmacy (Active):**
- Email: `pharmacy2@oran.dz`
- Password: `pharmacy123`
- Status: Active and can place orders

## Features Implemented

### Authentication
- Email/password authentication using Supabase Auth
- Role-based access control (Admin, Pharmacy, Supplier)
- Session management with automatic token refresh
- Protected routes based on user role and status

### Supplier Dashboard
- ✅ Product Management (CRUD operations)
- ✅ Commercial Agent Management (CRUD operations)
- ✅ Real-time product availability toggle
- ✅ Product search and filtering
- All data synced with Supabase database

### Pharmacy Dashboard
- ✅ Product catalog browsing
- ✅ Search and filter products
- ✅ View supplier details and ratings
- ✅ Order placement
- ✅ Review and rate suppliers

### Admin Dashboard
- ✅ User management (view all users)
- ✅ Approve/reject new registrations
- ✅ View pending users with document verification
- ✅ Platform statistics and analytics
- ✅ Order management and monitoring

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admins have full access
- Secure authentication with JWT tokens
- Input validation and error handling

## API Services

### Authentication Service (`src/lib/auth.ts`)
- `signUp()` - Register new users
- `login()` - Authenticate users
- `logout()` - Sign out
- `getProfile()` - Fetch user profile
- `getCurrentUserWithDetails()` - Get full user data

### Database Service (`src/lib/database.ts`)
- `products.*` - Product CRUD operations
- `agents.*` - Agent CRUD operations
- `orders.*` - Order management
- `reviews.*` - Review system
- `admin.*` - Admin operations

## Development

### Running Locally
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

### Environment Variables
The following environment variables are configured in `.env`:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Database Migrations
All database migrations are stored in the Supabase project. The initial schema includes:
- Table definitions
- RLS policies
- Indexes for performance
- Triggers for automatic timestamp updates

## Next Steps
1. Use the Dev Tools to seed the database
2. Log in with test accounts to explore the platform
3. Test all features (CRUD operations, search, filtering)
4. Verify RLS policies are working correctly
5. Test different user roles and permissions

## Notes
- Email confirmation is disabled by default in Supabase Auth
- All passwords in test accounts are for development only
- The DevTools component should be removed in production
- RLS policies ensure data isolation between users
- All timestamps are stored in UTC
