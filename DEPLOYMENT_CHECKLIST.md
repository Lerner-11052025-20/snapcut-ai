# ✅ PRE-DEPLOYMENT CHECKLIST

## CURRENT STATUS

```
┌─────────────────────────────────────────────────────┐
│  RAZORPAY PAYMENT SYSTEM DEPLOYMENT READINESS      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✅ Frontend Code ........................... READY │
│  ✅ Edge Function Code ..................... READY │
│  ✅ Database Schema ........................ READY │
│  ✅ TypeScript Configuration .............. READY │
│                                                     │
│  ⚠️  Edge Function .................. NOT DEPLOYED  │
│  ⚠️  Environment Setup ............... INCOMPLETE  │
│                                                     │
│  🚀 READY FOR DEPLOYMENT ✅                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## STEP 1: Get Razorpay Secret Key

**DO THIS FIRST:**

1. Open: https://dashboard.razorpay.com/#/app/keys
2. Look for section: **Keys**
3. Find: **Secret Key** (it's a long alphanumeric string)
4. Click **Copy** next to Secret Key
5. Keep it safe! You'll need it in next steps

**Expected format:** Long string like `xxxxxxxxxxxxxxxxxxxxxxxx`

**Timing:** 1 minute

---

## STEP 2: Update .env.local File

**MUST DO THIS:**

Open: `snapcut-ai/.env.local`

Find this line:
```
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET_HERE
```

Replace with your actual secret:
```
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Important:** Keep the entire secret on ONE line!

**Timing:** 1 minute

---

## STEP 3: Install Supabase CLI

**MUST DO THIS:**

Open PowerShell and run:

```powershell
npm install -g supabase
```

Verify it installed:
```powershell
supabase --version
```

Should show something like: `Supabase CLI 1.x.x`

**Timing:** 2-3 minutes

---

## STEP 4: Login to Supabase

**MUST DO THIS:**

In PowerShell, run:
```powershell
supabase login
```

A browser window will open. Sign in with your Supabase account.

**Timing:** 1 minute

---

## STEP 5: Deploy Edge Function

**THIS IS THE KEY STEP:**

In PowerShell, in your project directory:

```powershell
supabase functions deploy verify-payment
```

**Wait for success message:**
```
Deploying function 'verify-payment'...
✓ Function deployed successfully
✓ Endpoint: https://glntihbvumnkmbicgjzb.supabase.co/functions/v1/verify-payment
```

**Timing:** 1-2 minutes

---

## STEP 6: Set Secret in Supabase Dashboard

**CRITICAL STEP:**

The Edge Function needs your secret key to work. Set it:

1. Go to: https://supabase.com/dashboard/projects
2. Select your project
3. Click **Settings** (left sidebar)
4. Scroll to **Secrets and Vault**
5. Click **New Secret**
6. **Name:** `RAZORPAY_KEY_SECRET` (EXACTLY this)
7. **Value:** Your Razorpay Secret Key from Step 1
8. Click **Add Secret**

**Timing:** 1 minute

---

## STEP 7: Verify Deployment

**Check that everything is deployed:**

In PowerShell, run:
```powershell
supabase functions list
```

You should see:
```
verify-payment    (deployed)
```

**Timing:** 30 seconds

---

## STEP 8: Test the Setup

**Quick functionality test:**

In PowerShell, run:

```powershell
Invoke-WebRequest -Uri "https://glntihbvumnkmbicgjzb.supabase.co/functions/v1/verify-payment" `
  -Method OPTIONS
```

Should get status: `204` (this is OK!)

**Timing:** 30 seconds

---

## STEP 9: Test Complete Payment Flow

**Full end-to-end test:**

1. Open your app: `http://localhost:5173`
2. Navigate to: `/upload` page
3. Click: **"Upgrade to Pro"** button
4. Complete Razorpay payment:
   - Card: `4111 1111 1111 1111`
   - Date: `12/25`
   - CVV: `123`
   - OTP: `123456` (if asked)
5. Watch for:
   - ✅ Loading animation
   - ✅ "Payment Verified!" message
   - ✅ Success animation
   - ✅ Auto-redirect to dashboard
   - ✅ 👑 Pro badge appears

**Timing:** 2-3 minutes

---

## ⏱️ TOTAL TIME REQUIRED

- **With no issues:** 10-15 minutes
- **With one retry:** 20 minutes
- **With troubleshooting:** 30 minutes

---

## 🆘 TROUBLESHOOTING QUICK FIXES

| Error | Quick Fix |
|-------|-----------|
| `supabase` not found | `npm install -g supabase` |
| Unauthorized | `supabase logout` then `supabase login` |
| Deployment failed | Run command again, check internet |
| Payment still fails | Check browser F12 console for errors |
| Can't find secret | Go to Settings → Secrets, click New |
| Function not showing | Wait 30 seconds, refresh, try `supabase functions list` |

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before you start, verify:

- [ ] **Razorpay account**: Able to login and see keys
- [ ] **Actual secret key**: Know what it is (not placeholder)
- [ ] **Node.js installed**: Can run `npm` commands
- [ ] **Internet connection**: Stable connection for deployment
- [ ] **.env.local file**: Can edit it
- [ ] **PowerShell access**: Can run commands
- [ ] **Supabase project**: Know your project ID or URL

---

## 🎯 EXACT COMMANDS TO RUN (Copy & Paste)

**Copy these commands into PowerShell one by one:**

```powershell
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Deploy Edge Function
supabase functions deploy verify-payment

# 4. Check if deployed
supabase functions list
```

That's it! Supabase will handle the rest automatically.

---

## ✨ WHAT HAPPENS AFTER DEPLOYMENT

Once deployed, your SaaS will:

1. **Accept payments**: Razorpay modal opens
2. **Verify payments**: Edge Function checks signature
3. **Upgrade users**: Pro tier added to database
4. **Update UI**: Pro badge (👑) appears everywhere
5. **Notify users**: Beautiful success animation
6. **Auto-redirect**: Back to dashboard

**All automatically!** ✨

---

## 🎉 EXPECTED OUTCOME

After all steps:

- Frontend: ✅ Updated and working
- Edge Function: ✅ Deployed to Supabase
- Secret: ✅ Stored securely
- Payment: ✅ Verifies automatically
- User Experience: ✅ Seamless and beautiful

**You're done!** 🚀

---

## 📞 IF STUCK

1. **Read error message carefully**
2. **Check browser console** (F12 → Console)
3. **Check Supabase logs** → Functions → verify-payment
4. **Verify all steps** were completed
5. **Try deployment again** - usually works on retry

---

## 🚀 READY TO DEPLOY?

**Start with STEP 1 above and follow through STEP 9.**

**Expected time: 15 minutes**

**Let's go! 💪**
