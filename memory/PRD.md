# DawaLink - PRD (Product Requirements Document)

## Original Problem Statement
Build a pharmaceutical marketplace (DawaLink) connecting pharmacies and suppliers in Algeria, with a FastAPI/MongoDB backend and React frontend.

## Core Features (All Implemented)
- **Multi-role Authentication**: Admin, Pharmacy, Supplier roles with JWT auth
- **Product Management**: Full CRUD with product_type and expiry_date fields
- **Pharmacy Inventory**: Private stock tracking for pharmacies
- **Supplier Stock Management**: Dedicated dashboard for suppliers
- **Complete Order/Cart Flow**: Shopping cart, checkout (Payment on Delivery active; BaridiMob/CCP placeholders), order lifecycle (pending -> confirmed -> delivered)
- **Order Management**: Both pharmacies and suppliers have dedicated order pages
- **Supplier Ratings**: Pharmacies can rate suppliers after delivery
- **AI-Powered Excel Import**: Gemini-powered intelligent import for suppliers
- **Admin Dashboard**: User management, statistics, document verification
- **Document Verification System**: Real file uploads during registration, admin review with accept/reject + email notifications

## Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI, Python, Motor (MongoDB async driver)
- **Database**: MongoDB
- **AI**: Gemini via emergentintegrations
- **Deployment**: Docker, Docker Compose, Nginx, Dokploy on VPS (94.23.72.31)
- **Email**: Resend API (optional, configured via RESEND_API_KEY)

## Document Verification Flow (Feb 2026)
### Registration:
1. User fills form (Step 1 - Informations)
2. Uploads required documents (Step 2 - Documents): PDF, JPG, PNG (max 10MB)
   - Pharmacy: Agrément de pharmacie, Registre de Commerce, Inscription à l'ordre des pharmaciens
   - Supplier: Registre de commerce, Autorisation d'exploitation, Certificat fiscal
3. Submits registration → Account status = "pending"

### Admin Review:
- Admin sees pending users with all uploaded documents (view/download)
- Approve → User status = "active" + email notification
- Reject → Modal with reason + select problematic documents → User status = "rejected" + email with details

### Rejected User:
- Login shows structured rejection info (reason + rejected documents)
- "Se réinscrire" button to create new account (overrides rejected one)

## Deployment Configuration (Feb 2026)
- Fixed Dockerfile.frontend: Removed yarn.lock dependency
- Fixed nginx.conf: Added API proxy pass to backend
- Fixed Dockerfile.backend: Added extra-index-url for emergentintegrations
- Added .dockerignore for build optimization
- Changed frontend port to 3001 (Traefik uses 80)

## Backlog
- **P1**: Implement real BaridiMob and CCP payment methods
- **P2**: Live chat between users
- **P3**: PDF invoice generation

## User Language
French (all UI and communications)
