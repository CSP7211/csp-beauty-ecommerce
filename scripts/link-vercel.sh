#!/bin/bash
echo "=== Linking CSP Beauty to Vercel ==="
if ! command -v vercel &> /dev/null; then
    npm install -g vercel
fi
vercel login
cd /mnt/agents/output/csp-beauty-ecommerce
vercel link
echo "Add these to GitHub Secrets:"
cat .vercel/project.json
