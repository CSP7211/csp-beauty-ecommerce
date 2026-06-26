#!/bin/bash
echo "=== CSP Beauty Environment Setup ==="
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local"
fi
echo "Fill in your keys, then: npm install && npm run dev"
