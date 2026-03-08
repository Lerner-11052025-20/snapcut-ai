# Razorpay API Endpoints Reference

## Quick Reference for Backend Implementation

### POST /api/payments/verify
**Purpose:** Verify Razorpay payment signature and confirm payment authenticity

**Called from:** `PaymentSuccess.tsx` after user completes Razorpay payment

**Request Body:**
```json
{
  "razorpay_payment_id": "pay_KYXxvJaAu2WWAA",
  "razorpay_order_id": "order_KYXxvJaAu2WWAA",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

**Response (Failure - 400/500):**
```json
{
  "success": false,
  "error": "Invalid payment signature" | "Payment verification failed"
}
```

**Backend Verification Logic:**
```
1. Extract razorpay_payment_id, razorpay_order_id, razorpay_signature from request
2. Create hash: SHA256("order_id|payment_id") using RAZORPAY_KEY_SECRET
3. Compare generated hash with razorpay_signature
4. If match: Payment is valid ✓
5. If no match: Payment is invalid ✗ (possible tampering)
```

**Node.js Example:**
```javascript
const crypto = require('crypto');

function verifyPayment(payment_id, order_id, signature) {
  const message = `${order_id}|${payment_id}`;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(message)
    .digest('hex');
  
  return generated_signature === signature;
}
```

**Python Example:**
```python
import hmac
import hashlib

def verify_payment(payment_id, order_id, signature):
    message = f"{order_id}|{payment_id}"
    generated_signature = hmac.new(
        process.env.RAZORPAY_KEY_SECRET.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return generated_signature == signature
```

---

### GET /api/payments/:paymentId (Optional)
**Purpose:** Fetch payment details from Razorpay API

**Called from:** `PaymentSuccess.tsx` (optional, for extra verification)

**Response:**
```json
{
  "id": "pay_KYXxvJaAu2WWAA",
  "entity": "payment",
  "amount": 49900,
  "currency": "INR",
  "status": "captured",
  "method": "card",
  "description": "Pro Membership - SnapCut AI",
  "amount_refunded": 0,
  "refund_status": null,
  "captured": true,
  "email": "user@example.com",
  "contact": "+919876543210",
  "created_at": 1741339200
}
```

**Node.js Example:**
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.get('/api/payments/:paymentId', async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);
    res.json({
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      method: payment.method,
      captured: payment.captured
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### POST /api/webhooks/razorpay (Recommended)
**Purpose:** Receive real-time payment notifications from Razorpay

**Set in Razorpay Dashboard:**
- Dashboard → Settings → Webhooks
- URL: `https://yourdomain.com/api/webhooks/razorpay`
- Secret: Copy this and save as `RAZORPAY_WEBHOOK_SECRET`
- Events: Select `payment.authorized`, `payment.captured`, `payment.failed`

**Request Headers:**
```
X-Razorpay-Signature: <webhook_signature>
```

**Request Body (payment.captured):**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_KYXxvJaAu2WWAA",
        "entity": "payment",
        "amount": 49900,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_KYXxvJaAu2WWAA",
        "invoice_id": null,
        "international": false,
        "method": "card",
        "amount_refunded": 0,
        "refund_status": null,
        "captured": true,
        "description": "Pro Membership - SnapCut AI",
        "card_id": "card_KYXxvJaAu2WWAA",
        "bank": null,
        "wallet": null,
        "vpa": null,
        "email": "user@example.com",
        "contact": "+919876543210",
        "notes": {
          "user_id": "uuid-from-auth"
        },
        "fee": 1180,
        "tax": 180,
        "error_code": null,
        "error_description": null,
        "created_at": 1741339200
      }
    }
  }
}
```

**Webhook Verification Logic:**
```javascript
const crypto = require('crypto');

function verifyWebhook(body, signature, secret) {
  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');
  
  return generated_signature === signature;
}
```

**Node.js Implementation:**
```javascript
app.post('/api/webhooks/razorpay', express.json(), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify signature
    const generated = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (generated !== signature) {
      return res.status(400).json({ error: 'Webhook verification failed' });
    }
    
    const { event, payload } = req.body;
    
    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      
      // Update your database
      await db.transactions.create({
        razorpay_payment_id: payment.id,
        amount: payment.amount,
        order_id: payment.order_id,
        email: payment.email,
        status: 'completed',
        notes: payment.notes
      });
      
      console.log('Payment captured:', payment.id);
    }
    
    if (event === 'payment.failed') {
      const payment = payload.payment.entity;
      console.log('Payment failed:', payment.id);
      // Log failed payment
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

---

## Frontend Configuration

### Current Implementation Location

**Payment Initiation:** `/src/hooks/useRazorpayPayment.ts`
```typescript
// User clicks "Upgrade to Pro"
initiatePayment() {
  // Opens Razorpay modal
  // On success: redirects to /payment-success?razorpay_*
}
```

**Payment Verification:** `/src/pages/PaymentSuccess.tsx`
```typescript
// Immediately calls POST /api/payments/verify
// If success: upgrades user in database
// Shows success animation
// Auto-redirects to dashboard
```

**Subscription Management:** `/src/lib/subscriptionService.ts`
```typescript
upgradeUserToPro(userId, transactionId)
// Updates Supabase profiles table:
// - subscription_tier = 'pro'
// - subscription_started_at = now
// - subscription_ends_at = now + 1 year
```

---

## Testing Credentials

### Razorpay Test Mode

**Account:** Test Account (sandbox)

**Test Payment Card:**
```
Card Number:    4111 1111 1111 1111
Expiry Date:    Any future date (e.g., 12/25)
CVV:            Any 3 digits (e.g., 123)
OTP:            123456 (when prompted)
```

**Test Amount:** ₹499 (or any amount)

**Expected Result:** Payment shows as "Captured" and user is upgraded to Pro

---

## Environment Variables Checklist

### Frontend (.env.local)
```env
VITE_SUPABASE_URL=https://glntihbvumnkmbicgjzb.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_RAZORPAY_KEY_ID=your_test_key_id
```

### Backend (.env)
```env
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
SUPABASE_URL=https://glntihbvumnkmbicgjzb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Monitoring & Debugging

### Frontend Logs (Browser Console)
```
[Razorpay] SDK loaded
[Razorpay] Opening payment modal
[Razorpay] Payment successful - payment_id: pay_XXX
[Razorpay] Redirecting to /payment-success
```

### Backend Logs
```
POST /api/payments/verify called
Verifying signature for payment: pay_XXX
Signature valid ✓
Payment verified successfully
Webhook received for payment.captured
```

### Database Check (Supabase)
```sql
SELECT id, email, subscription_tier, subscription_started_at 
FROM profiles 
WHERE id = 'user-uuid';
-- Should show: subscription_tier = 'pro', subscription_started_at = today
```

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid payment signature" | Wrong key secret or tampering | Check `RAZORPAY_KEY_SECRET` is correct |
| `razorpay_payment_id` undefined | Missing query params | Check Razorpay redirects with all 3 params |
| Payment verified but no badge | Database not updated | Check subscription_tier actually updated in Supabase |
| Webhook not received | URL not set in dashboard | Add URL in Razorpay Settings → Webhooks |
| Signature mismatch in webhook | Wrong webhook secret | Verify `RAZORPAY_WEBHOOK_SECRET` from dashboard |

---

## Production Checklist

- [ ] Switch from test credentials to live key_id and key_secret
- [ ] Update `REACT_APP_RAZORPAY_KEY_ID` to live key
- [ ] Update backend `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to live
- [ ] Update webhook URL to production domain
- [ ] Test full payment flow with live card
- [ ] Set up error monitoring/logging
- [ ] Set up payment notification email to admin
- [ ] Document payment troubleshooting process
- [ ] Train support team on payment issues
- [ ] Set up database backups
- [ ] Monitor payment processing times

---

**Last Updated:** January 2025
**Version:** 1.0
**Status:** Ready for Implementation ✓
