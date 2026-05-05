import express, { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { requireAuth, type AuthenticatedRequest } from '../middleware/authenticate.js';
import { sql } from '../db/index.js';
import type { 
  CreateOrderResponse, 
  VerifyPaymentRequest,
  ApiError 
} from '@titleiq/shared';

const router = Router();

let _razorpay: Razorpay | null = null;
function getRazorpay() {
  if (!_razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('RAZORPAY environment variables are missing');
    }
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
}

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('⚠️ RAZORPAY keys are missing in environment variables.');
}

/**
 * POST /api/billing/create-order
 * Creates a Razorpay order for the Pro subscription.
 */
router.post('/create-order', express.json(), requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const amount = 9900; // 99 INR in paise
    const currency = 'INR';

    const options = {
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await getRazorpay().orders.create(options);
    console.log('Razorpay order created:', order.id);

    const response: CreateOrderResponse = {
      success: true,
      order_id: order.id,
      amount: order.amount as number,
      currency: order.currency,
    };
    
    res.status(200).json(response);
  } catch (err: any) {
    console.error('Razorpay create order error detail:', err);
    const errorMessage = typeof err === 'string' ? err : (err.message || err.description || 'Failed to create order.');
    const error: ApiError = { success: false, error: errorMessage };
    res.status(500).json(error);
  }
});

/**
 * POST /api/billing/verify-payment
 * Verifies the Razorpay payment signature and upgrades user to Pro.
 */
router.post('/verify-payment', express.json(), requireAuth, async (req: AuthenticatedRequest, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as VerifyPaymentRequest;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Missing payment verification fields.' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!secret) {
    return res.status(500).json({ success: false, error: 'Server misconfiguration.' });
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Payment verification failed: Invalid signature.' });
  }

  try {
    await sql`
      UPDATE users
      SET tier = 'pro'
      WHERE id = ${req.user!.id}
    `;
    console.log(`✅ User ${req.user!.id} upgraded to Pro via Razorpay.`);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update user tier:', err);
    res.status(500).json({ success: false, error: 'Failed to update user tier after payment.' });
  }
});

export default router;
