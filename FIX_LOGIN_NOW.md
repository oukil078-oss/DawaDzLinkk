# 🚨 FIX LOGIN NOW - 3 Simple Steps

## You're getting: "Invalid login credentials"

### Why?
Email confirmation is enabled in Supabase (it's on by default).

### The Fix (takes 2 minutes):

---

## STEP 1: Turn Off Email Confirmation

Go to this URL (replace with your project):
```
https://supabase.com/dashboard/project/ezmpuazdomealflvcnvf/settings/auth
```

Or manually:
1. Open https://supabase.com/dashboard
2. Select project: `ezmpuazdomealflvcnvf`
3. Click **"Authentication"** in left sidebar
4. Click **"Settings"** (under Authentication)
5. Look for **"Enable email confirmations"**
6. **Turn it OFF** ← This is the critical step!
7. Click **"Save"**

---

## STEP 2: Delete Old Users

Old users are stuck in "unconfirmed" state. Delete them:

1. In Supabase Dashboard → **Authentication** → **Users**
2. Delete ALL test users (click ⋯ → Delete for each):
   - supplier1@pharmaplus.dz
   - supplier2@medipharm.dz
   - pharmacy1@madina.dz
   - pharmacy2@oran.dz
   - admin@dawalink.dz

3. In Supabase Dashboard → **Table Editor**, delete all rows from:
   - `products` table
   - `agents` table
   - `suppliers` table
   - `pharmacies` table
   - `profiles` table

---

## STEP 3: Re-Create Users

1. **Open your app** in browser
2. Click **"🛠️ Dev Tools"** (bottom-right corner)
3. Click **"🌱 Seed Database"**
4. Wait for success message
5. Click **"🔍 Check if Users Exist"** to verify

---

## STEP 4: Test Login

**Email:** supplier1@pharmaplus.dz
**Password:** supplier123

It should work now! ✅

---

## Still Not Working? Debug It:

### Option 1: Check in Dev Tools
1. Open the app
2. Click "🛠️ Dev Tools" (bottom-right)
3. Click "🔍 Check if Users Exist"
4. Read the message - it will tell you what's wrong

### Option 2: Check Console
1. Try to log in
2. Open browser console (F12)
3. Look at the error message
4. If it says "Email not confirmed" → go back to Step 1

### Option 3: Verify Setting in Supabase
Go to: https://supabase.com/dashboard/project/ezmpuazdomealflvcnvf/settings/auth

Look for: **"Enable email confirmations"**

It MUST be OFF (disabled/gray).

---

## Quick Reference

**Supabase URL:** https://supabase.com/dashboard/project/ezmpuazdomealflvcnvf

**Test Credentials:**
- Admin: admin@dawalink.dz / admin123456
- Supplier 1: supplier1@pharmaplus.dz / supplier123
- Supplier 2: supplier2@medipharm.dz / supplier123
- Pharmacy: pharmacy2@oran.dz / pharmacy123

**Direct Settings URL:**
https://supabase.com/dashboard/project/ezmpuazdomealflvcnvf/settings/auth

---

## What Changed?

✅ Added better error messages in login
✅ Added "Check if Users Exist" button in Dev Tools
✅ Added detailed logging for debugging
✅ Created this quick-fix guide

The code is working fine - it's just a Supabase configuration issue!
