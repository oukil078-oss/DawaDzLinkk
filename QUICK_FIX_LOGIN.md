# 🚨 QUICK FIX: Invalid Login Credentials

## The Problem

You're getting "Invalid login credentials" when trying to log in with `supplier1@pharmaplus.dz / supplier123`

## The Root Cause

**Supabase has email confirmation enabled by default**, which means users must click a confirmation link in their email before they can log in. Since we're creating test accounts, they never receive or confirm these emails, so login fails.

## The Solution (2 minutes)

### Step 1: Disable Email Confirmation in Supabase

1. **Open your Supabase Dashboard**: https://supabase.com/dashboard/project/ezmpuazdomealflvcnvf

2. **Click on "Authentication"** (shield icon) in the left sidebar

3. **Click on "Settings"** in the submenu

4. **Scroll down** to find the section called **"Email Auth"**

5. **Find the toggle** that says **"Enable email confirmations"** or **"Confirm email"**

6. **Turn it OFF** (toggle should be gray/disabled)

7. **Click "Save"** at the bottom of the page

### Step 2: Delete Existing Test Users (if any)

Since you may have already tried to create users with email confirmation enabled, they're stuck in an "unconfirmed" state:

1. In Supabase Dashboard, go to **Authentication** → **Users**

2. Look for any test users:
   - admin@dawalink.dz
   - supplier1@pharmaplus.dz
   - supplier2@medipharm.dz
   - pharmacy1@madina.dz
   - pharmacy2@oran.dz

3. **Delete them ALL** (click the three dots → Delete)

### Step 3: Clean Up Database Tables

1. In Supabase Dashboard, go to **Table Editor**

2. For each table below, **delete all rows**:
   - `products` (delete all)
   - `agents` (delete all)
   - `suppliers` (delete all)
   - `pharmacies` (delete all)
   - `profiles` (delete all)

> **Important:** Delete in this order to avoid foreign key constraint errors!

### Step 4: Re-seed the Database

1. Open your application in the browser

2. Click **"🛠️ Dev Tools"** in the bottom-right corner

3. Click **"🌱 Seed Database"**

4. Wait for success message (check console for details)

### Step 5: Test Login

Now try logging in with:
- **Email:** `supplier1@pharmaplus.dz`
- **Password:** `supplier123`

It should work immediately! ✅

---

## Alternative: Verify Email Confirmation Setting

If you're not sure whether email confirmation is enabled, here's how to check:

### Method 1: Check in Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/ezmpuazdomealflvcnvf/settings/auth
2. Look for "Enable email confirmations" under "Email Auth"
3. It should be **OFF** (gray/disabled)

### Method 2: Check User Status
1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Look at any test user
3. If you see a warning icon or "Email not confirmed" status, that's the problem

---

## Still Not Working?

### Check the Browser Console

1. Open browser console (F12)
2. Try to log in
3. Look for error messages
4. Take a screenshot and check what it says

### Common Error Messages:

**"Email not confirmed"**
→ Email confirmation is still enabled. Go back to Step 1.

**"Invalid login credentials"**
→ Either:
  - Email confirmation is enabled (most likely)
  - User doesn't exist (need to seed database)
  - Password is wrong (should be "supplier123")

**"User not found"**
→ Need to seed the database (Step 4)

### Verify Users Were Created

Run this SQL query in Supabase SQL Editor:

```sql
-- Check if users exist
SELECT email, raw_user_meta_data->>'full_name' as name, email_confirmed_at
FROM auth.users
WHERE email LIKE '%@pharmaplus.dz' OR email LIKE '%@medipharm.dz';

-- Check profiles
SELECT email, full_name, role, status
FROM profiles
WHERE email LIKE '%pharma%';
```

If `email_confirmed_at` is NULL, that means email confirmation is blocking login!

---

## Why This Happens

Supabase's default security settings require email confirmation. This is great for production but problematic for local development. By disabling it, users can log in immediately after account creation.

**For production deployment**, you should:
1. Re-enable email confirmation
2. Set up proper email templates
3. Configure email delivery (SendGrid, Mailgun, etc.)

But for development/testing, it must be disabled.

---

## Summary Checklist

- [ ] Disabled "Enable email confirmations" in Supabase Dashboard
- [ ] Clicked "Save" in Supabase settings
- [ ] Deleted all test users from Authentication → Users
- [ ] Deleted all data from database tables (products, agents, suppliers, pharmacies, profiles)
- [ ] Ran seed script via Dev Tools in the app
- [ ] Saw success message
- [ ] Tested login with supplier1@pharmaplus.dz / supplier123
- [ ] Successfully logged in! ✅

---

**Need more help?** Check the browser console for specific error messages and error codes.
