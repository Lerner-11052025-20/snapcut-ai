# ⚡ Quick Fix: Supabase Edge Function Setup

## What Changed?

Instead of requiring a separate backend server, **I've created a Supabase Edge Function** that handles payment verification. This is built into your Supabase project and requires zero additional infrastructure!

## 🚀 3 Simple Steps to Fix Payment Verification

### Step 1: Get Your Razorpay Secret Key

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/#/app/keys)
2. In the **Keys** section, copy your **Secret Key** (NOT API Key)
3. It looks like: `xxxxxxxxxxxxxxxx`

### Step 2: Add Secret Key to .env.local

Edit `.env.local` and replace the placeholder:

```env
# Replace this:
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET_HERE

# With your actual key from Razorpay:
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
```

### Step 3: Deploy Edge Function to Supabase

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Initialize Supabase in your project (if not already done)
supabase init

# Deploy the Edge Function
supabase functions deploy verify-payment --project-id glntihbvumnkmbicgjzb
```

#### Option B: Using Supabase Dashboard (Manual)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Select your project
3. Go to **Edge Functions** section
4. Click **Create a new function**
5. Name it: `verify-payment`
6. Copy the code from `supabase/functions/verify-payment/index.ts`
7. Paste it into the editor
8. Click **Deploy**

#### Option C: Direct Upload

```bash
# If you have Supabase CLI installed:
supabase functions deploy verify-payment
```

---

## ✅ What Happens Now

When a user makes a successful payment:

1. **Razorpay** → Redirects to `/payment-success?razorpay_payment_id=...&razorpay_signature=...`
2. **PaymentSuccess page** → Calls Supabase Edge Function to verify signature
3. **Edge Function** → Checks the signature using your Razorpay secret
4. **If valid** → User is upgraded to Pro in database
5. **Success page** → Shows beautiful animation and auto-redirects to dashboard
6. **User sees** → Pro badge everywhere! 👑

---

## 🔍 How It Works

The Edge Function:
- ✅ Receives payment details from the frontend
- ✅ Verifies the Razorpay signature using your secret key
- ✅ Returns success/error response
- ✅ No database access needed (frontend handles upgrade)
- ✅ Secure: Your secret key is never exposed to frontend

---

## 🆘 Verify It's Working

After deploying, test the payment flow:

1. Go to your app `/upload` page
2. Click **"Upgrade to Pro"** button
3. Complete Razorpay payment (use test card: `4111 1111 1111 1111`)
4. Should see **success page** and auto-redirect to dashboard
5. Check if **Pro badge** (👑) appears in header

## 🐛 Troubleshooting

### "Payment verification failed"
- ❌ Secret key in `.env.local` is wrong
- ❌ Edge Function not deployed
- ✅ Copy your secret key again from Razorpay dashboard
- ✅ Deploy Edge Function with correct project ID

### Edge Function still not working?
- ❌ Supabase CLI not installed
- ✅ Install: `npm install -g supabase`
- ✅ Deploy: `supabase functions deploy verify-payment`

### "Internal server error" in console
- ❌ `RAZORPAY_KEY_SECRET` environment variable not set in Supabase
- ✅ When deploying, ensure the secret is configured

---

## 📝 Environment Variables

Your `.env.local` now has:

```env
# Frontend (visible in browser)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_RAZORPAY_KEY_ID=rzp_test_...

# Backend (only in Edge Function)
RAZORPAY_KEY_SECRET=... (kept secure!)
```

---

## 🎯 Testing Credentials

Still use these for testing:

```
Card Number:    4111 1111 1111 1111
Expiry:         Any future date (12/25)
CVV:            Any 3 digits (123)
OTP:            123456 (if prompted)
```

---

## 📚 Files Created/Modified

- ✅ `supabase/functions/verify-payment/index.ts` - Edge Function (NEW)
- ✅ `src/lib/razorpayVerification.ts` - Updated to call Edge Function
- ✅ `.env.local` - Added RAZORPAY_KEY_SECRET
- ✅ `.env.example` - Updated template

---

## 🚀 One Command Fix

If you're ready, just run:

```bash
supabase functions deploy verify-payment
```

That's it! Your payment system will now work seamlessly. 🎉

---

**Need Help?**
- Supabase docs: https://supabase.com/docs/guides/functions
- Razorpay docs: https://razorpay.com/docs/
- Check console for detailed error messages
