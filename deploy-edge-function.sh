#!/bin/bash

# SnapCut AI - Razorpay Payment Verification Setup
# This script helps deploy the Edge Function to Supabase

echo "🚀 SnapCut AI - Razorpay Payment Setup"
echo "========================================"
echo ""

# Step 1: Check if Supabase CLI is installed
echo "Step 1: Checking Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo ""
    echo "Install it with:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi
echo "✅ Supabase CLI is installed"
echo ""

# Step 2: Check environment variables
echo "Step 2: Checking environment variables..."
if [ -f ".env.local" ]; then
    RAZORPAY_SECRET=$(grep "RAZORPAY_KEY_SECRET" .env.local | cut -d '=' -f 2)
    if [ -z "$RAZORPAY_SECRET" ] || [ "$RAZORPAY_SECRET" = "YOUR_RAZORPAY_KEY_SECRET_HERE" ]; then
        echo "❌ RAZORPAY_KEY_SECRET not configured in .env.local"
        echo ""
        echo "Please add your Razorpay Secret Key to .env.local:"
        echo "  RAZORPAY_KEY_SECRET=your_actual_secret_key_here"
        echo ""
        exit 1
    fi
    echo "✅ RAZORPAY_KEY_SECRET is configured"
else
    echo "❌ .env.local file not found"
    exit 1
fi
echo ""

# Step 3: Deploy Edge Function
echo "Step 3: Deploying Edge Function..."
echo "Command: supabase functions deploy verify-payment"
echo ""

supabase functions deploy verify-payment

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Edge Function deployed successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Go to your Supabase dashboard"
    echo "  2. Set the RAZORPAY_KEY_SECRET in Function Secrets"
    echo "  3. Test the payment flow"
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Please check the error messages above"
    exit 1
fi
