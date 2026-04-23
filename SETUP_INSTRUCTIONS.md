# Setup Instructions - DawaLink Platform

## Critical First Step: Disable Email Confirmation in Supabase

**⚠️ You MUST do this before seeding the database, otherwise login will not work!**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** (shield icon in left sidebar)
4. Click on **Settings** in the submenu
5. Scroll down to **Email Auth** section
6. Find the setting **"Confirm email"**
7. **Toggle it OFF** (disable it)
8. Click **Save** at the bottom

## Why This is Necessary

By default, Supabase requires users to confirm their email address before they can log in. This is great for production but prevents our test accounts from working immediately. Disabling email confirmation allows the seed script to create users that can log in right away.

## After Disabling Email Confirmation

### Step 1: Seed the Database

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser

3. Click the **"🛠️ Dev Tools"** button in the bottom-right corner

4. Click **"🌱 Seed Database"**

5. Wait for the success message (check browser console for details)

### Step 2: Test Login

Try logging in with these accounts:

**Admin Account:**
- Email: `admin@dawalink.dz`
- Password: `admin123456`
- Access: Full platform management

**Supplier 1 (Pharma Plus):**
- Email: `supplier1@pharmaplus.dz`
- Password: `supplier123`
- Features: Product management, agent management, analytics

**Supplier 2 (MediPharm):**
- Email: `supplier2@medipharm.dz`
- Password: `supplier123`
- Features: Product management, agent management, analytics

**Pharmacy (Active):**
- Email: `pharmacy2@oran.dz`
- Password: `pharmacy123`
- Features: Browse products, place orders, rate suppliers

**Pharmacy (Pending Approval):**
- Email: `pharmacy1@madina.dz`
- Password: `pharmacy123`
- Status: Waiting for admin approval

## Troubleshooting

### Issue: "Invalid login credentials"

**Cause:** Email confirmation is still enabled in Supabase

**Solution:**
1. Double-check that you disabled email confirmation in Supabase
2. If you already ran the seed script before disabling, you need to:
   - Go to Supabase Dashboard → Authentication → Users
   - Delete all test users
   - Disable email confirmation
   - Run the seed script again

### Issue: Products not showing or edit/toggle not working

**Cause:** User might not be properly authenticated or database connection issue

**Solution:**
1. Open browser console (F12)
2. Look for error messages
3. Check that you're logged in with a supplier account
4. Verify the supplier has products in the database
5. Check console logs for "Loading products for supplier:" message

### Issue: Seeding fails with errors

**Possible causes:**
1. Database tables not created
2. RLS policies blocking access
3. Duplicate data

**Solution:**
1. Check the browser console for specific error messages
2. Go to Supabase Dashboard → SQL Editor
3. Verify the tables exist: profiles, suppliers, pharmacies, products, agents
4. If tables are missing, check the migrations were applied

### Issue: "User already exists" during seeding

**This is normal!** The seed script checks for existing users and skips them. If you want to start fresh:

1. Go to Supabase Dashboard → Authentication → Users
2. Delete all users (or specific test users)
3. Go to Table Editor
4. Delete rows from: products, agents, suppliers, pharmacies, profiles (in that order)
5. Run seed script again

## Verifying Everything Works

### Test Supplier Dashboard:
1. Log in as supplier1@pharmaplus.dz
2. Go to **Products** tab
3. Try these actions:
   - Click "Ajouter" to add a new product
   - Click the edit icon on an existing product
   - Toggle product availability (Disponible/Indisponible)
   - Delete a product
4. Go to **Agents** tab
5. Add, edit, and delete agents

### Test Admin Dashboard:
1. Log in as admin@dawalink.dz
2. View pending users (pharmacy1@madina.dz should appear)
3. Approve or reject user registrations
4. View all platform statistics

### Test Pharmacy Dashboard:
1. Log in as pharmacy2@oran.dz
2. Browse products
3. Search for products
4. View supplier details
5. Place orders

## Features with Database Integration

### ✅ Fully Working:
- User authentication (login/logout)
- Role-based access control
- Supplier product management (CRUD)
- Supplier agent management (CRUD)
- Product search and filtering
- Real-time product availability toggle
- User profile management
- Admin user approval workflow

### 📝 Partially Implemented:
- Pharmacy order placement (backend ready, UI needs connection)
- Admin dashboard analytics (backend ready, UI needs connection)
- Supplier ratings and reviews (backend ready, UI needs connection)

## Database Structure

The platform uses these main tables:

- **profiles** - User accounts and roles
- **suppliers** - Supplier company details
- **pharmacies** - Pharmacy details
- **products** - Product catalog
- **agents** - Commercial agents
- **orders** - Order history
- **reviews** - Supplier ratings
- **documents** - KYC documents

All tables have Row Level Security (RLS) enabled to protect data.

## Important Notes

- All test passwords are for development only
- Don't use these accounts in production
- The DevTools component should be removed before production deployment
- All data is stored securely in Supabase with RLS policies
- Console logs are added for debugging - check browser console for detailed information

## Need Help?

If you encounter any issues:

1. Check the browser console for error messages
2. Verify email confirmation is disabled in Supabase
3. Make sure you seeded the database
4. Try logging out and logging in again
5. Check the BACKEND_SETUP.md file for more technical details

## Production Deployment

Before deploying to production:

1. Remove the DevTools component from App.tsx
2. Enable email confirmation in Supabase
3. Set up proper email templates
4. Configure proper RLS policies for your use case
5. Add rate limiting and security measures
6. Use strong passwords for all accounts
7. Set up proper backup procedures
