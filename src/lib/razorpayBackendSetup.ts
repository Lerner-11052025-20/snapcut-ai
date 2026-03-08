/**
 * Razorpay Payment Webhook Handler
 * This file contains the backend API endpoints documentation and reference implementation
 * that should be created in your backend to verify Razorpay payments
 * 
 * Choose your backend technology and implement these endpoints:
 * - POST /api/payments/verify - Verify payment signature
 * - GET /api/payments/:paymentId - Get payment details
 * - POST /api/webhooks/razorpay - Handle Razorpay webhooks
 */

/**
 * ENDPOINT 1: POST /api/payments/verify
 * 
 * Verifies the Razorpay payment signature to ensure payment authenticity
 * 
 * Request Body:
 * {
 *   "razorpay_payment_id": "pay_xxxxx",
 *   "razorpay_order_id": "order_xxxxx",
 *   "razorpay_signature": "xxxxx"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Payment verified successfully"
 * }
 * 
 * Implementation Example (Node.js/Express):
 * 
 * const crypto = require('crypto');
 * 
 * app.post('/api/payments/verify', async (req, res) => {
 *   try {
 *     const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
 *     
 *     // Create signature hash
 *     const signature = crypto
 *       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
 *       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
 *       .digest('hex');
 *     
 *     // Verify signature
 *     if (signature === razorpay_signature) {
 *       // Signature verified, payment is legitimate
 *       // You can now update your database
 *       
 *       // Get user from JWT or session
 *       const userId = req.user.id;
 *       
 *       // Update user subscription in Supabase
 *       // This could be done here or from frontend after verification
 *       
 *       return res.json({ 
 *         success: true, 
 *         message: "Payment verified successfully" 
 *       });
 *     } else {
 *       return res.status(400).json({ 
 *         success: false, 
 *         error: "Invalid payment signature" 
 *       });
 *     }
 *   } catch (error) {
 *     res.status(500).json({ 
 *       success: false, 
 *       error: error.message 
 *     });
 *   }
 * });
 */

/**
 * ENDPOINT 2: GET /api/payments/:paymentId
 * 
 * Retrieves payment details from Razorpay
 * 
 * Response:
 * {
 *   "id": "pay_xxxxx",
 *   "entity": "payment",
 *   "amount": 49900,
 *   "currency": "INR",
 *   "status": "captured",
 *   "method": "card|netbanking|upi|wallet",
 *   "description": "Upgrade to Pro",
 *   "amount_refunded": 0,
 *   "refund_status": null,
 *   "captured": true,
 *   "created_at": 1741339200
 * }
 * 
 * Implementation Example (Node.js/Express):
 * 
 * const Razorpay = require('razorpay');
 * 
 * const razorpay = new Razorpay({
 *   key_id: process.env.RAZORPAY_KEY_ID,
 *   key_secret: process.env.RAZORPAY_KEY_SECRET
 * });
 * 
 * app.get('/api/payments/:paymentId', async (req, res) => {
 *   try {
 *     const payment = await razorpay.payments.fetch(req.params.paymentId);
 *     res.json(payment);
 *   } catch (error) {
 *     res.status(500).json({ error: error.message });
 *   }
 * });
 */

/**
 * ENDPOINT 3: POST /api/webhooks/razorpay
 * 
 * Handles webhooks from Razorpay for real-time payment updates
 * Configure this URL in Razorpay Dashboard under Settings → Webhooks
 * 
 * Expected Webhook Event:
 * payment.authorized
 * payment.failed
 * payment.captured
 * 
 * Request Body (from Razorpay):
 * {
 *   "event": "payment.captured",
 *   "contains": ["payment"],
 *   "payload": {
 *     "payment": {
 *       "entity": {
 *         "id": "pay_xxxxx",
 *         "amount": 49900,
 *         "currency": "INR",
 *         "status": "captured",
 *         "created_at": 1741339200
 *       }
 *     }
 *   }
 * }
 * 
 * Implementation Example (Node.js/Express):
 * 
 * const crypto = require('crypto');
 * 
 * app.post('/api/webhooks/razorpay', async (req, res) => {
 *   try {
 *     const signature = req.headers['x-razorpay-signature'];
 *     const body = JSON.stringify(req.body);
 *     
 *     // Verify webhook signature
 *     const hashed = crypto
 *       .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
 *       .update(body)
 *       .digest('hex');
 *     
 *     if (hashed !== signature) {
 *       return res.status(400).json({ error: 'Invalid webhook signature' });
 *     }
 *     
 *     const event = req.body.event;
 *     const eventPayload = req.body.payload;
 *     
 *     switch (event) {
 *       case 'payment.captured':
 *         const payment = eventPayload.payment.entity;
 *         console.log('Payment captured:', payment.id);
 *         // Update your database here
 *         break;
 *         
 *       case 'payment.failed':
 *         console.log('Payment failed:', eventPayload.payment.entity.id);
 *         // Handle failed payment
 *         break;
 *     }
 *     
 *     res.json({ received: true });
 *   } catch (error) {
 *     res.status(500).json({ error: error.message });
 *   }
 * });
 */

/**
 * ENVIRONMENT VARIABLES NEEDED:
 * 
 * RAZORPAY_KEY_ID=your_key_id
 * RAZORPAY_KEY_SECRET=your_key_secret
 * RAZORPAY_WEBHOOK_SECRET=your_webhook_secret (optional for webhooks)
 * SUPABASE_URL=your_supabase_url
 * SUPABASE_ANON_KEY=your_supabase_key
 */

/**
 * FRONTEND INTEGRATION FLOW:
 * 
 * 1. User clicks "Upgrade to Pro"
 * 2. Frontend opens Razorpay payment modal
 * 3. Razorpay generates order_id and payment_id
 * 4. After payment, Razorpay redirects to /payment-success with params:
 *    - razorpay_payment_id
 *    - razorpay_order_id
 *    - razorpay_signature
 * 5. Frontend calls /api/payments/verify to verify signature
 * 6. Backend validates and returns success/failure
 * 7. If verified, frontend calls upgradeUserToPro()
 * 8. User sees success page and gets redirected to dashboard
 * 9. User sees Pro badge and all Pro features unlocked
 */

export const RAZORPAY_CONFIG = {
  // These should match your Razorpay API keys
  keyId: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
  
  // Payment configuration
  amount: 49900, // ₹499 in paise
  currency: 'INR',
  description: 'SnapCut AI - Pro Membership',
  
  // Webhook configuration (backend)
  webhookUrl: '/api/webhooks/razorpay',
  
  // Hosted checkout
  prefill: {
    name: '', // Will be filled from user profile
    email: '', // Will be filled from user profile
    contact: '', // Optional
  },
  
  // Theme
  theme: {
    color: '#6366f1', // Primary color
  },
};
