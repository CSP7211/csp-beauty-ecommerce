# Contributing to CSP Beauty E-commerce

## Quick Start
```bash
git clone https://github.com/CSP7211/csp-beauty-ecommerce.git
cd csp-beauty-ecommerce
npm install
cp .env.example .env.local
# Fill in keys
npm run dev
```

## Branch Naming
- `feature/*` — New features
- `fix/*` — Bug fixes
- `chore/*` — Maintenance

## Commit Convention
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `refactor:` — Code restructuring
- `test:` — Tests
- `chore:` — Build/config

## Architecture
```
app/           → Next.js App Router
├── api/       → API routes (products, orders)
├── layout.tsx → Root layout
└── page.tsx   → Main catalog page

components/    → React components
lib/           → Utilities + Supabase client
supabase/      → Database schema + Edge Functions
```

## Database Migrations
Schema changes in `supabase/schema.sql` auto-deploy via GitHub Actions.

Manual: `supabase link --project-ref your-ref && supabase db push`

## Edge Functions
Deploy: `supabase functions deploy`

## Environment Variables
| Variable | Source | Required |
|----------|--------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard | Yes |
| `STRIPE_SECRET_KEY` | Stripe Dashboard | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI/webhook | Yes |
| `CLICKUP_API_KEY` | ClickUp Settings | Yes |
| `CLICKUP_LIST_ID` | ClickUp URL | Yes |
| `VERCEL_TOKEN` | Vercel Account | CI/CD |
| `SUPABASE_ACCESS_TOKEN` | Supabase Account | CI/CD |
