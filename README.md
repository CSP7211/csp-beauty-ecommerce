# CSP Beauty Hyper-Local E-commerce Platform

## Deploy to Vercel

### 1. Setup Supabase
```bash
# Create new Supabase project at https://supabase.com
# Go to SQL Editor → New Query → Paste schema.sql
# Run seed_products.sql to populate initial data
# Enable Edge Functions in Dashboard → Functions
```

### 2. Environment Variables (Vercel Dashboard)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

CLICKUP_API_KEY=pk_...
CLICKUP_LIST_ID=86caep12q

NEXT_PUBLIC_APP_URL=https://csp-beauty.vercel.app
```

### 3. Deploy Edge Functions
```bash
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy clickup-sync
supabase functions deploy stripe-webhook
supabase functions deploy price-sync
```

### 4. Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

Or connect GitHub repo in Vercel dashboard for auto-deploy.

## Features
- **1,100+ products** across 9 categories with real-time Supabase sync
- **30 global beauty brands** with GS1 compliance
- **25% wholesale margin** (Cost / 0.75) enforced via database triggers
- **Real-time filters** (Category, Brand, Price, Stock) with server-side pagination
- **Product detail** modal with GS1 barcode tracking
- **Basket system** with quantity control and live totals
- **Checkout flow** with Stripe payment fields + Supabase order creation
- **ClickUp Task ID** auto-generation on every order via Edge Function
- **Stripe Ledger** audit trail for all payments
- **Price Sync Edge Function** — update from email/PDF → calculate margin → sync ClickUp
- **Row Level Security** — customers only see their own data
- **Audit trail** — every INSERT/UPDATE/DELETE logged automatically
- **Inventory movements** — track stock changes in real-time
- **Mobile-first** responsive design with Tailwind CSS

## Architecture
```
Frontend (Next.js 15 + React 19)
  ├── App Router (app/)
  ├── API Routes (app/api/)
  ├── Components (components/)
  └── Supabase Client (lib/supabase.ts)

Backend (Supabase)
  ├── PostgreSQL Database
  ├── Realtime Subscriptions
  ├── Edge Functions (Deno)
  │   ├── clickup-sync (ClickUp API integration)
  │   ├── stripe-webhook (Stripe payment processing)
  │   └── price-sync (Price update from email/PDF)
  └── Row Level Security (RLS)

External APIs
  ├── Stripe (payments)
  └── ClickUp (task management)
```

## Database Schema
- **products** — Master catalog with GS1 barcodes, stock status, margin tracking
- **customers** — B2B wholesale accounts with KYC status
- **orders** — Order header with Stripe + ClickUp references
- **order_items** — Line items with margin calculation per unit
- **stripe_ledger** — Payment audit trail (PCI-DSS compliant)
- **clickup_sync_log** — Sync status tracking with retry logic
- **inventory_movements** — Stock tracking for every SKU
- **audit_log** — Compliance audit trail (auto-generated via triggers)

## API Endpoints
- `GET /api/products` — Filtered product list with pagination
- `POST /api/orders` — Create order + customer + ClickUp sync

## Edge Functions
- `POST /functions/v1/clickup-sync` — Sync orders to ClickUp tasks
- `POST /functions/v1/stripe-webhook` — Handle Stripe webhooks
- `POST /functions/v1/price-sync` — Update prices from supplier emails/PDFs

## Stack
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS + Lucide React
- Supabase (PostgreSQL + Realtime + Edge Functions)
- Stripe (payments + webhooks)
- ClickUp (task management)
