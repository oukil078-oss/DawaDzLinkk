# Complete Database & Backend Rebuild Prompt

I need you to completely review, rebuild, and make fully functional the database and backend of this DawaLink pharmaceutical marketplace platform. Here are the detailed requirements:

## 1. DATABASE AUDIT & OPTIMIZATION

**Task:** Review the entire database schema and optimize it for the application's needs.

**Requirements:**
- Audit all existing tables (profiles, pharmacies, suppliers, products, agents, orders, documents, reviews)
- Identify missing tables or columns needed for full functionality
- Add any missing fields that are referenced in the frontend but don't exist in the database
- Ensure all relationships (foreign keys) are properly configured
- Add indexes for frequently queried columns (email, registry_number, status fields, etc.)
- Verify all ENUM types match the frontend expectations

**Specific checks:**
- Do we need a cart/basket table for pharmacies?
- Do we need a notifications table?
- Do we need a messages/chat table for pharmacy-supplier communication?
- Do we need a favorites/wishlist table?
- Do we need an order_items table (for multiple products per order)?
- Are there any missing fields in existing tables?

## 2. ROW LEVEL SECURITY (RLS) POLICIES

**Task:** Create comprehensive, secure, and functional RLS policies for ALL tables.

**Requirements:**
- Every table MUST have RLS enabled
- Create proper policies for SELECT, INSERT, UPDATE, DELETE operations
- Policies must check authentication using auth.uid()
- Policies must enforce proper access control:
  - Admins can see/edit everything
  - Pharmacies can only see/edit their own data
  - Suppliers can only see/edit their own data
  - Pharmacies can view all suppliers and products
  - Suppliers can view pharmacies who order from them

**Critical tables needing policies:**
- profiles (users can read/update their own)
- pharmacies (pharmacy users can only access their own)
- suppliers (supplier users can only access their own)
- products (suppliers can CRUD their own, pharmacies can READ all)
- agents (suppliers can CRUD their own, pharmacies can READ all)
- orders (both parties can see their relevant orders)
- documents (users see their own, admins see all)
- reviews (pharmacies can create, both parties can read relevant ones)

## 3. AUTHENTICATION FLOWS

**Task:** Ensure all authentication flows work perfectly.

**Requirements:**
- Login must work for all user types (admin, pharmacy, supplier)
- Registration must work for pharmacies and suppliers
- After registration, users should be in "pending" status
- Email validation is DISABLED, don't implement it
- Password reset should work (or show "under development" popup)
- Session management must persist across page refreshes
- Proper error handling for wrong credentials, existing users, etc.

**Test with these accounts after seeding:**
- Admin: admin@dawalink.dz / admin123
- Pharmacy: pharmacy1@sante.dz / pharmacy123
- Supplier: supplier1@pharmaplus.dz / supplier123

## 4. MAKE ALL BUTTONS FUNCTIONAL

**Task:** Go through EVERY component and make all buttons/actions functional or show "under development" popup.

### Admin Dashboard (AdminDashboard.tsx)
- [ ] View all pending registrations (pharmacies + suppliers)
- [ ] Approve/reject pharmacy registrations
- [ ] Approve/reject supplier registrations
- [ ] View all users list
- [ ] Click on user to see full profile details
- [ ] Suspend/activate user accounts
- [ ] View all documents submitted
- [ ] Approve/reject documents
- [ ] View platform statistics (total users, pending approvals, active orders)
- [ ] Search and filter functionality

### Pharmacy Dashboard (PharmacyDashboard.tsx)
- [ ] View account status (pending/active/suspended)
- [ ] If pending, show message about waiting for approval
- [ ] Search products by name, DCI, reference
- [ ] Filter products by supplier, availability, price range
- [ ] View product details modal
- [ ] Add products to cart/order
- [ ] View cart
- [ ] Place orders
- [ ] View order history
- [ ] Track order status
- [ ] View supplier contact info
- [ ] Rate and review suppliers
- [ ] View own profile
- [ ] Edit profile information
- [ ] Change password (or show "under development")
- [ ] Upload required documents
- [ ] View document approval status

### Supplier Dashboard (SupplierDashboard.tsx)
- [ ] View account status (pending/active/suspended)
- [ ] If pending, show message about waiting for approval
- [ ] Add new products (with all fields: name, reference, DCI, price, UG)
- [ ] Edit existing products
- [ ] Delete products
- [ ] Toggle product availability
- [ ] Import products from Excel (or show "under development")
- [ ] View all agents/representatives
- [ ] Add new agent (with contact info)
- [ ] Edit agent information
- [ ] Delete agents
- [ ] View incoming orders
- [ ] Update order status (confirm/complete/cancel)
- [ ] View order history
- [ ] View analytics/statistics
- [ ] View ratings and reviews from pharmacies
- [ ] View own profile
- [ ] Edit profile information
- [ ] Upload required documents

### Registration Flows
- [ ] Pharmacy registration (all steps must save to database)
- [ ] Supplier registration (all steps must save to database)
- [ ] Document upload during registration
- [ ] Validation of required fields
- [ ] Success message and redirect to login

### Landing Pages
- [ ] All navigation links should work or show "under development"
- [ ] Contact forms should work or show "under development"
- [ ] Newsletter signup should work or show "under development"

## 5. UNDER DEVELOPMENT POPUPS

**Task:** For any button/feature that doesn't have backend implementation yet, show a clean popup.

**Implementation:**
- Create a reusable toast/alert component
- Show message: "Cette fonctionnalité est en cours de développement" (This feature is under development)
- Use it consistently across all incomplete features

**Example features that might need this:**
- Live chat between pharmacy and supplier
- Real-time notifications
- File upload to cloud storage
- Email notifications
- PDF invoice generation
- Export to Excel
- Advanced analytics
- Payment integration

## 6. DATA SEEDING

**Task:** Create comprehensive seed data for testing.

**Requirements:**
- At least 3 admin users
- At least 10 pharmacy users (mix of pending and active)
- At least 10 supplier users (mix of pending and active)
- At least 50 products across multiple suppliers
- At least 5 agents per supplier
- At least 20 sample orders (various statuses)
- At least 10 reviews
- Sample documents for some users

## 7. ERROR HANDLING

**Task:** Implement proper error handling everywhere.

**Requirements:**
- All database queries must have try-catch blocks
- Show user-friendly error messages (in French)
- Log errors to console for debugging
- Handle common errors:
  - Network failures
  - Permission denied (RLS)
  - Duplicate entries
  - Invalid data
  - Missing required fields

## 8. FRONTEND-BACKEND INTEGRATION

**Task:** Ensure all frontend components properly connect to Supabase.

**Requirements:**
- All forms must save to database
- All lists must load from database
- Real-time updates where appropriate
- Proper loading states
- Empty states when no data
- Pagination for large lists
- Search and filter functionality works

## 9. TESTING CHECKLIST

After implementation, test EVERY workflow:

### Admin Workflows
- [ ] Login as admin
- [ ] View pending pharmacy registrations
- [ ] Approve a pharmacy
- [ ] Reject a pharmacy
- [ ] View pending supplier registrations
- [ ] Approve a supplier
- [ ] Reject a supplier
- [ ] View all users
- [ ] Suspend a user
- [ ] Activate a user
- [ ] View user profile details

### Pharmacy Workflows
- [ ] Register new pharmacy
- [ ] Login as pharmacy
- [ ] See "pending approval" status
- [ ] (After admin approval) See "active" status
- [ ] Search for products
- [ ] View product details
- [ ] Add product to cart/order
- [ ] Place order
- [ ] View order history
- [ ] View order status
- [ ] Rate a supplier
- [ ] Edit own profile
- [ ] Upload documents

### Supplier Workflows
- [ ] Register new supplier
- [ ] Login as supplier
- [ ] See "pending approval" status
- [ ] (After admin approval) See "active" status
- [ ] Add new product
- [ ] Edit product
- [ ] Delete product
- [ ] Toggle product availability
- [ ] Add new agent
- [ ] Edit agent
- [ ] Delete agent
- [ ] View incoming orders
- [ ] Update order status
- [ ] View analytics
- [ ] View reviews
- [ ] Edit own profile

## 10. SUCCESS CRITERIA

The rebuild is complete when:
- [x] All tables have proper RLS policies
- [x] All three user types can register and login
- [x] Admin can approve/reject registrations
- [x] Pharmacies can search and order products
- [x] Suppliers can manage products and agents
- [x] Orders flow works end-to-end
- [x] Reviews system works
- [x] All buttons either work or show "under development"
- [x] No console errors during normal usage
- [x] Database seed script works
- [x] Build succeeds without errors

## IMPORTANT NOTES

- Use the existing Supabase instance (credentials in .env)
- All migrations must follow the mandatory format with detailed comments
- NEVER use transaction control statements (BEGIN, COMMIT, ROLLBACK)
- ALWAYS use IF EXISTS/IF NOT EXISTS in migrations
- Keep all code in French for user-facing text
- Use TypeScript strictly
- Follow existing code style and conventions
- Test thoroughly after each major change

## EXECUTION PLAN

Suggested order of implementation:

1. Database audit and missing tables/columns
2. Create/update all RLS policies
3. Fix authentication flows
4. Implement admin approval workflow
5. Implement pharmacy product search and ordering
6. Implement supplier product management
7. Implement agents management
8. Implement order status updates
9. Implement reviews system
10. Add "under development" popups to incomplete features
11. Create comprehensive seed data
12. Test all workflows end-to-end
13. Fix any bugs found during testing
14. Final build and validation

---

Please proceed systematically through this plan. After each major section, run the build to ensure nothing is broken. Let me know when you're ready to start, and we'll tackle this step by step!
