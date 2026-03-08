# 🪟 Windows Quick Deploy Guide

## ⚡ For Windows Users (PowerShell)

### Step 1: Check if Supabase CLI is installed

Open PowerShell and run:

```powershell
supabase --version
```

If it says "command not found", install it:

```powershell
npm install -g supabase
```

### Step 2: Get Your Razorpay Secret

1. Go to: https://dashboard.razorpay.com/#/app/keys
2. Copy your **Secret Key** (long string)
3. Copy the whole thing (it's VERY long and starts with some characters)

### Step 3: Update .env.local

Open the `.env.local` file in your project root and find this line:

```
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET_HERE
```

Replace `YOUR_RAZORPAY_KEY_SECRET_HERE` with your actual secret key. **Keep it all on one line!**

### Step 4: Login to Supabase

In PowerShell, run:

```powershell
supabase login
```

A browser window will open. Sign in with your Supabase account.

### Step 5: Deploy the Edge Function

Still in PowerShell, in your project directory:

```powershell
supabase functions deploy verify-payment
```

Wait for the success message. You should see:
```
✓ Deployment successful!
```

### Step 6: Set the Secret in Supabase Dashboard

**Easy way (recommended):**

1. Go to: https://supabase.com/dashboard/projects
2. Click your project
3. Click **Settings** in the left sidebar
4. Scroll down to **Secrets and Vault**
5. Click **New Secret**
6. **Name:** `RAZORPAY_KEY_SECRET`
7. **Value:** Your actual Razorpay Secret Key (copy from Step 2)
8. Click **Add Secret**

Done! ✅

---

## 🧪 Test It Works

In PowerShell, run this command to test:

```powershell
$body = @{
    razorpay_payment_id = "test_payment"
    razorpay_order_id = "test_order"
    razorpay_signature = "test_sig"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://glntihbvumnkmbicgjzb.supabase.co/functions/v1/verify-payment" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

You should get a response (might error due to test data, but that's OK - means function is running).

---

## 🎯 Now Test Full Payment

1. Open your app: http://localhost:5173 (or your dev URL)
2. Go to `/upload` page
3. Click **"Upgrade to Pro"** button
4. Complete Razorpay payment with this test card:
   - **Card Number:** 4111 1111 1111 1111
   - **Expiry:** 12/25 (any future date)
   - **CVV:** 123
   - **OTP:** 123456 (if prompted)
5. You should see ✅ **"Payment Verified!"**
6. Should auto-redirect to dashboard
7. Should show 👑 **Pro Member** badge

---

## ❌ If You Get Errors

### "Command not found: supabase"
```powershell
npm install -g supabase
```

### "Unauthorized"
```powershell
supabase logout
supabase login
```

### "RAZORPAY_KEY_SECRET not configured"
- Check Step 6 above - add it to Supabase secrets
- It's different from `.env.local`
- Both are needed!

### "Still failing"
1. Open F12 in browser → Console tab
2. Look for error messages
3. Check if deployment succeeded
4. Verify secret is in Supabase dashboard

---

## ✅ Full Checklist

- [ ] Razorpay Secret Key copied
- [ ] `.env.local` updated
- [ ] Supabase CLI installed
- [ ] Logged in to Supabase
- [ ] Function deployed (`supabase functions deploy verify-payment`)
- [ ] Secret added to Supabase dashboard
- [ ] Test payment successful

---

## 📞 Need Help?

Run this to see deployment logs:

```powershell
supabase functions download verify-payment
```

Or check the Supabase dashboard:
1. Dashboard → Project → Functions
2. Click `verify-payment`
3. Check the Recent Invocations tab

---

## 🎉 Once It Works

Your payment system is **COMPLETE**! 

Every payment will:
- ✅ Auto-verify with Razorpay
- ✅ Upgrade user to Pro
- ✅ Update database
- ✅ Show Pro badge
- ✅ Auto-redirect to dashboard

**You're done!** 🚀
