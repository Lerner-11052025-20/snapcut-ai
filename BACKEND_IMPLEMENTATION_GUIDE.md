# Backend Implementation Step-by-Step Guide

## Quick Start (Express.js)

If you're using Node.js/Express, follow these steps:

### Step 1: Install Dependencies

```bash
npm install express razorpay crypto dotenv cors
# or
yarn add express razorpay crypto dotenv cors
```

### Step 2: Create Payment Verification Endpoint

Create a new file: `routes/payments.js`

```javascript
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// POST /api/payments/verify
// Verify Razorpay payment signature
router.post('/verify', (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Validate request
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment parameters'
      });
    }

    // Create signature
    const message = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(message)
      .digest('hex');

    // Verify signature
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }

    // Signature is valid
    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment_id: razorpay_payment_id
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/payments/:paymentId
// Fetch payment details from Razorpay
router.get('/:paymentId', async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);
    
    res.json({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      captured: payment.captured,
      email: payment.email,
      contact: payment.contact,
      created_at: payment.created_at
    });

  } catch (error) {
    console.error('Payment fetch error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
```

### Step 3: Create Webhook Endpoint

Create a new file: `routes/webhooks.js`

```javascript
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// POST /api/webhooks/razorpay
// Handle Razorpay webhook events
router.post('/razorpay', express.json(), (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    if (!signature) {
      return res.status(400).json({ error: 'Missing webhook signature' });
    }

    // Verify webhook signature
    const body = JSON.stringify(req.body);
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (generated_signature !== signature) {
      console.warn('Webhook signature mismatch');
      return res.status(400).json({ error: 'Webhook verification failed' });
    }

    const { event, payload } = req.body;

    console.log(`Webhook received: ${event}`);

    // Handle different events
    if (event === 'payment.captured') {
      handlePaymentCaptured(payload);
    } else if (event === 'payment.failed') {
      handlePaymentFailed(payload);
    } else if (event === 'payment.authorized') {
      handlePaymentAuthorized(payload);
    }

    // Acknowledge receipt
    res.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle payment.captured event
function handlePaymentCaptured(payload) {
  try {
    const payment = payload.payment.entity;
    
    console.log('Payment captured:');
    console.log(`  Payment ID: ${payment.id}`);
    console.log(`  Amount: ${payment.amount} ${payment.currency}`);
    console.log(`  Email: ${payment.email}`);
    console.log(`  Status: ${payment.status}`);

    // TODO: Update your database here
    // Example:
    // db.transactions.create({
    //   razorpay_payment_id: payment.id,
    //   amount: payment.amount / 100, // Convert paise to rupees
    //   currency: payment.currency,
    //   email: payment.email,
    //   status: 'captured',
    //   user_notes: payment.notes
    // });

  } catch (error) {
    console.error('Error handling payment.captured:', error);
  }
}

// Handle payment.failed event
function handlePaymentFailed(payload) {
  try {
    const payment = payload.payment.entity;
    
    console.log('Payment failed:');
    console.log(`  Payment ID: ${payment.id}`);
    console.log(`  Error Code: ${payment.error_code}`);
    console.log(`  Error Description: ${payment.error_description}`);

    // TODO: Log failed payment to database or monitoring service
    
  } catch (error) {
    console.error('Error handling payment.failed:', error);
  }
}

// Handle payment.authorized event
function handlePaymentAuthorized(payload) {
  try {
    const payment = payload.payment.entity;
    
    console.log('Payment authorized:');
    console.log(`  Payment ID: ${payment.id}`);
    console.log(`  Amount: ${payment.amount} ${payment.currency}`);

    // TODO: Handle authorization if needed

  } catch (error) {
    console.error('Error handling payment.authorized:', error);
  }
}

module.exports = router;
```

### Step 4: Update Main Server File

Update your `server.js` or `index.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const paymentsRouter = require('./routes/payments');
const webhooksRouter = require('./routes/webhooks');

app.use('/api/payments', paymentsRouter);
app.use('/api/webhooks', webhooksRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 5: Setup Environment Variables

Create `.env` file in your backend root:

```env
# Razorpay Keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Server
PORT=5000
NODE_ENV=development

# Supabase (optional, if updating user in database)
SUPABASE_URL=https://glntihbvumnkmbicgjzb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 6: Test Endpoints

#### Test Verification Endpoint

```bash
curl -X POST http://localhost:5000/api/payments/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_payment_id": "pay_test123",
    "razorpay_order_id": "order_test123",
    "razorpay_signature": "test_signature"
  }'
```

#### Test Webhook Endpoint

```bash
curl -X POST http://localhost:5000/api/webhooks/razorpay \
  -H "Content-Type: application/json" \
  -H "X-Razorpay-Signature: test_signature" \
  -d '{
    "event": "payment.captured",
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_test123",
          "amount": 49900,
          "currency": "INR",
          "status": "captured",
          "email": "test@example.com",
          "contact": "+919876543210"
        }
      }
    }
  }'
```

---

## For Other Frameworks

### Python (Flask)

```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/api/payments/verify', methods=['POST'])
def verify_payment():
    try:
        data = request.json
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_signature = data.get('razorpay_signature')
        
        if not all([razorpay_payment_id, razorpay_order_id, razorpay_signature]):
            return jsonify({'success': False, 'error': 'Missing parameters'}), 400
        
        # Create signature
        message = f"{razorpay_order_id}|{razorpay_payment_id}"
        generated_signature = hmac.new(
            os.getenv('RAZORPAY_KEY_SECRET').encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Verify
        if generated_signature == razorpay_signature:
            return jsonify({
                'success': True,
                'message': 'Payment verified successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid payment signature'
            }), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/webhooks/razorpay', methods=['POST'])
def webhook_razorpay():
    try:
        signature = request.headers.get('X-Razorpay-Signature')
        
        if not signature:
            return jsonify({'error': 'Missing signature'}), 400
        
        # Verify signature
        body = request.get_data()
        generated_signature = hmac.new(
            os.getenv('RAZORPAY_WEBHOOK_SECRET').encode(),
            body,
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != signature:
            return jsonify({'error': 'Verification failed'}), 400
        
        data = request.json
        event = data.get('event')
        
        if event == 'payment.captured':
            payment = data['payload']['payment']['entity']
            print(f"Payment captured: {payment['id']}")
            # Update your database here
        
        return jsonify({'received': True}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### Django

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/payments/verify/', views.verify_payment, name='verify_payment'),
    path('api/webhooks/razorpay/', views.webhook_razorpay, name='webhook_razorpay'),
]

# views.py
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import hmac
import hashlib
import json
import os

@require_http_methods(["POST"])
def verify_payment(request):
    try:
        data = json.loads(request.body)
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_signature = data.get('razorpay_signature')
        
        message = f"{razorpay_order_id}|{razorpay_payment_id}"
        generated_signature = hmac.new(
            os.getenv('RAZORPAY_KEY_SECRET').encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature == razorpay_signature:
            return JsonResponse({'success': True, 'message': 'Payment verified'})
        else:
            return JsonResponse({'success': False, 'error': 'Invalid signature'}, status=400)
            
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@require_http_methods(["POST"])
def webhook_razorpay(request):
    try:
        signature = request.META.get('HTTP_X_RAZORPAY_SIGNATURE')
        body = request.body
        
        generated_signature = hmac.new(
            os.getenv('RAZORPAY_WEBHOOK_SECRET').encode(),
            body,
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != signature:
            return JsonResponse({'error': 'Verification failed'}, status=400)
        
        return JsonResponse({'received': True})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
```

---

## Integration with Supabase

After verifying payment signature, update the user's subscription:

```javascript
// routes/payments.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post('/verify', async (req, res) => {
  try {
    // ... signature verification ...
    
    if (generated_signature === razorpay_signature) {
      // Payment is verified, now update user
      const { user_id } = req.body; // Send user_id from frontend
      
      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'User ID required'
        });
      }
      
      // Update user subscription in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: 'pro',
          subscription_started_at: new Date().toISOString(),
          subscription_ends_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', user_id);
      
      if (error) {
        console.error('Database update error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to update subscription'
        });
      }
      
      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user_id,
          razorpay_payment_id: razorpay_payment_id,
          amount: 499, // in INR
          status: 'completed',
          created_at: new Date().toISOString()
        });
      
      res.json({
        success: true,
        message: 'Payment verified and user upgraded'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Deployment

### Deploy to Vercel (Recommended for Node.js)

1. Create `api/payments.js`:
```javascript
import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    const message = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(message)
      .digest('hex');
    
    if (generated_signature === razorpay_signature) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  }
}
```

2. Add environment variables in Vercel dashboard
3. Deploy with `vercel deploy`

### Deploy to Heroku (For existing apps)

```bash
# Add environment variables
heroku config:set RAZORPAY_KEY_ID=xxxxx
heroku config:set RAZORPAY_KEY_SECRET=xxxxx

# Deploy
git push heroku main
```

---

## Testing Checklist

- [ ] Endpoint responds with 200 on correct signature
- [ ] Endpoint responds with 400 on invalid signature
- [ ] Webhook is received and logged
- [ ] Database updates after verification
- [ ] Email notifications sent (if configured)
- [ ] User sees Pro badge immediately after
- [ ] Auto-redirect works correctly
- [ ] Toast notifications display

---

**You're all set!** Your backend is now ready to handle Razorpay payments. 🎉
