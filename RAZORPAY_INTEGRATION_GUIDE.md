# Razorpay Integration Setup Guide

## ✅ What's Already Implemented

All the frontend payment processing is now ready:

### 1. **Payment Initiation Hook** (`useRazorpayPayment.ts`)
- Loads Razorpay SDK dynamically
- Opens payment modal
- Handles payment response
- Redirects to success page with transaction details

### 2. **Payment Verification** (`razorpayVerification.ts`)
- Extracts Razorpay parameters from URL
- Calls backend verification API
- Handles verification responses

### 3. **Payment Success Page** (`PaymentSuccess.tsx`)
- Shows 4 different states:
  - **Verifying**: Checking with Razorpay
  - **Processing**: Setting up Pro membership
  - **Success**: Everything complete with auto-redirect
  - **Error**: Failed payment handling
- Beautiful animations
- Pro badge and benefits display
- Auto-redirect to dashboard after 3 seconds

### 4. **Upload Workspace Integration**
- "Upgrade to Pro" button now opens Razorpay
- Shows "Pro Member" badge when upgraded
- Fully functional with one click

## 🔧 Backend Setup Required

You need to create these endpoints on your backend:

### **1. Payment Verification Endpoint**

**Endpoint:** `POST /api/payments/verify`

**Request:**
```json
{
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_signature": "xxxxx"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": "Invalid payment signature"
}
```

**Implementation Example (Node.js/Express):**

```javascript
const crypto = require('crypto');
const express = require('express');

app.post('/api/payments/verify', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    // Create signature hash
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    
    // Verify signature
    if (signature === razorpay_signature) {
      return res.json({ 
        success: true, 
        message: "Payment verified successfully" 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid payment signature" 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
```

### **2. Payment Details Endpoint (Optional)**

**Endpoint:** `GET /api/payments/:paymentId`

**Response:**
```json
{
  "id": "pay_xxxxx",
  "entity": "payment",
  "amount": 49900,
  "currency": "INR",
  "status": "captured",
  "created_at": 1741339200
}
```

**Implementation Example:**

```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.get('/api/payments/:paymentId', async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### **3. Webhook Handler (Optional but Recommended)**

**Endpoint:** `POST /api/webhooks/razorpay`

**Setup in Razorpay Dashboard:**
1. Go to Settings → Webhooks
2. Add URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.authorized`, `payment.captured`, `payment.failed`
4. Get the Webhook Secret (RAZORPAY_WEBHOOK_SECRET)

**Implementation Example:**

```javascript
app.post('/api/webhooks/razorpay', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    
    // Verify webhook signature
    const hashed = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    
    if (hashed !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
    
    const event = req.body.event;
    const eventPayload = req.body.payload;
    
    if (event === 'payment.captured') {
      const payment = eventPayload.payment.entity;
      console.log('Payment captured:', payment.id);
      // Update your database
    }
    
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔑 Environment Variables

Add these to your `.env` or `.env.local`:

```env
# Frontend
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id

# Backend
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret (optional)
```

## 🔄 Complete Payment Flow

```
User on /upload page
     ↓
Clicks "Upgrade to Pro" button
     ↓
useRazorpayPayment.initiatePayment() called
     ↓
Razorpay SDK loads dynamically
     ↓
Razorpay payment modal opens
     ↓
User enters payment details
     ↓
Razorpay processes payment
     ↓
After payment success, Razorpay redirects to:
/payment-success?razorpay_payment_id=xxx&razorpay_order_id=xxx&razorpay_signature=xxx
     ↓
PaymentSuccess page loads
     ↓
Calls /api/payments/verify endpoint
     ↓
Backend verifies signature with Razorpay
     ↓
If valid: Frontend calls upgradeUserToPro()
   - Updates Supabase database
   - Sets subscription_tier to 'pro'
   - Sets subscription_started_at and subscription_ends_at
     ↓
Shows beautiful success animation
     ↓
Shows Pro member badge
     ↓
Shows Pro benefits
     ↓
Auto-redirects to /dashboard after 3 seconds
     ↓
User sees Pro badge in navbar and dashboard header
```

## ✨ User Experience Flow

1. **Before Payment:** Free user on `/upload` sees "Upgrade to Pro" button
2. **Payment:** Clicks button → Razorpay modal opens → Completes payment
3. **Success:** See beautiful success page with:
   - ✅ Checkmark animation
   - 👑 Pro member badge
   - Benefits list
   - Loading progress
   - Auto-redirect countdown
4. **After:** Redirects to dashboard with Pro badge visible everywhere:
   - Navbar: 👑 Crown icon
   - Dashboard header: Dropdown shows Pro member
   - Upload page: "Pro Member" badge instead of upgrade button

## 🧪 Testing

### Test Payment Card (Razorpay Test Mode)
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
OTP: 123456 (when prompted)
```

### Test Webhook
```bash
curl -X POST http://localhost:3000/api/webhooks/razorpay \
  -H "Content-Type: application/json" \
  -H "X-Razorpay-Signature: test" \
  -d '{
    "event": "payment.captured",
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_test123",
          "amount": 49900,
          "status": "captured"
        }
      }
    }
  }'
```

## 📋 Checklist

- [ ] Backend `/api/payments/verify` endpoint created
- [ ] Backend `/api/payments/:paymentId` endpoint created (optional)
- [ ] Backend `/api/webhooks/razorpay` endpoint created (recommended)
- [ ] Environment variables set in `.env`
- [ ] Razorpay webhook URL configured in dashboard
- [ ] Test payment flow with test card
- [ ] Verify database updates after payment
- [ ] Verify Pro badges appear correctly
- [ ] Test auto-redirect to dashboard
- [ ] Check toast notifications display

## 🎯 What Happens After Payment

All these happen automatically:

✅ **Database Updated**
- User subscription_tier → 'pro'
- subscription_started_at → current timestamp
- subscription_ends_at → 1 year from now

✅ **UI Updated**
- Pro badge appears on profile avatar
- "Pro Member" label in dropdown
- "👑 Pro Member" badge on upload page
- Pro tier visible in useUserSubscription hook

✅ **User Notifications**
- Toast: "Verifying your payment..."
- Toast: "Processing your upgrade..."
- Toast: "🎉 Payment successful!"
- Success page with animations

✅ **Auto-Redirect**
- After 3 seconds, auto-redirect to dashboard
- User can click "Go to Dashboard" button manually

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Razorpay not loading | Check `REACT_APP_RAZORPAY_KEY_ID` in `.env` |
| Signature verification fails | Ensure `RAZORPAY_KEY_SECRET` is correct |
| Payment shows but doesn't upgrade | Verify `/api/payments/verify` is returning `success: true` |
| User doesn't see Pro badge | Check Supabase database for `subscription_tier` = 'pro' |
| Auto-redirect not working | Check browser console for errors |

## 🚀 You're All Set!

The entire payment flow is now integrated and ready to use! 🎉

Just implement the backend endpoints and test with the payment gateway.
