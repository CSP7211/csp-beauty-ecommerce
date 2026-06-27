#!/bin/bash
# CSP Beauty E-commerce Setup Script
# Run this in Termux to complete integration setup

echo "=== CSP Beauty E-commerce Setup ==="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project directory"
    echo "Run: cd csp-beauty-ecommerce-main"
    exit 1
fi

echo "1. Installing dependencies..."
npm install

echo ""
echo "2. Building project..."
npm run build

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Create Supabase project: https://supabase.com"
echo "2. Run schema.sql in Supabase SQL Editor"
echo "3. Add env vars to Vercel:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "4. For Stripe: https://stripe.com"
echo "   - Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo ""
echo "5. For ClickUp: https://clickup.com"
echo "   - Add CLICKUP_API_KEY and CLICKUP_LIST_ID=86caep12q"
echo ""
echo "6. Redeploy:"
echo "   vercel deploy --token=YOUR_TOKEN --prod"
