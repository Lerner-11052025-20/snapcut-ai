#!/bin/bash

# SnapCut AI - Payment System Deployment Script
# This script helps deploy the fixed payment verification system

set -e

echo "=================================="
echo "SnapCut AI - Payment System Setup"
echo "=================================="
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Step 1: Get Razorpay Secret
read -p "Enter your Razorpay Secret Key (from Razorpay Dashboard): " RAZORPAY_SECRET

if [ -z "$RAZORPAY_SECRET" ]; then
    echo "❌ Razorpay Secret is required"
    exit 1
fi

echo "✅ Razorpay Secret captured"
echo ""

# Step 2: Determine environment
echo "Which environment are you deploying to?"
echo "1) Local Development"
echo "2) Production"
read -p "Enter 1 or 2: " ENV_CHOICE

if [ "$ENV_CHOICE" = "1" ]; then
    echo ""
    echo "📝 For local development:"
    echo "1. Create .env.local file in project root"
    echo "2. Add: RAZORPAY_KEY_SECRET=$RAZORPAY_SECRET"
    echo "3. Run: supabase functions serve"
    echo ""
    read -p "Press Enter to continue..."
    
elif [ "$ENV_CHOICE" = "2" ]; then
    read -p "Enter your Supabase Project ID: " PROJECT_ID
    
    if [ -z "$PROJECT_ID" ]; then
        echo "❌ Project ID is required"
        exit 1
    fi
    
    echo ""
    echo "🚀 Deploying to production..."
    echo ""
    
    # Deploy Edge Function
    echo "📦 Deploying Edge Function..."
    supabase functions deploy verify-payment --project-id "$PROJECT_ID"
    
    if [ $? -eq 0 ]; then
        echo "✅ Edge Function deployed successfully"
    else
        echo "❌ Failed to deploy Edge Function"
        exit 1
    fi
    
    # Set secrets
    echo ""
    echo "🔐 Setting Razorpay secret..."
    supabase secrets set RAZORPAY_KEY_SECRET="$RAZORPAY_SECRET" --project-id "$PROJECT_ID"
    
    if [ $? -eq 0 ]; then
        echo "✅ Razorpay secret set successfully"
    else
        echo "❌ Failed to set secret"
        exit 1
    fi
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update your Razorpay keys (test/production)"
    echo "2. Test payment with test credentials"
    echo "3. Deploy frontend changes"
    echo "4. Verify database updates in Supabase"
    
else
    echo "❌ Invalid choice"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
