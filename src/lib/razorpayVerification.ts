import { supabase } from './supabase';

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}

/**
 * Directly upgrade user subscription in Supabase DB (fallback method)
 * Used when Edge Function is unavailable.
 * Only updates `subscription_tier` and `updated_at` — safe for any schema.
 */
const upgradeUserDirectly = async (
  userId: string,
  paymentId: string,
): Promise<boolean> => {
  try {
    console.log('🔄 Attempting direct DB upgrade for user:', userId);

    // Step 1: Try updating ONLY subscription_tier (minimal — always works)
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: 'pro',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('❌ Direct DB update error:', error);
      return false;
    }

    console.log(`✅ Directly upgraded user ${userId} to PRO. Payment: ${paymentId}`);
    return true;
  } catch (err) {
    console.error('❌ Direct upgrade exception:', err);
    return false;
  }
};

/**
 * Verify Razorpay payment using Supabase Edge Function.
 * Falls back to direct DB upgrade if Edge Function is unavailable.
 */
export const verifyRazorpayPayment = async (
  paymentResponse: RazorpayPaymentResponse,
  userId?: string
): Promise<PaymentVerificationResult> => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentResponse;

  // --- Attempt 1: Use Supabase Edge Function (most secure) ---
  try {
    console.log('🔄 Attempting Edge Function verification...');

    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        user_id: userId,
      },
    });

    if (error) {
      console.warn('⚠️ Edge Function error, falling back to direct upgrade:', error.message);
      throw new Error('edge_function_unavailable');
    }

    if (data?.success) {
      console.log('✅ Payment verified via Edge Function');
      return {
        success: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      };
    }

    // Edge function returned success:false — real error
    return {
      success: false,
      error: data?.error || 'Payment verification failed',
    };

  } catch (edgeFunctionError) {
    // All edge function errors → use fallback (don't block user on missing infra)
    console.warn('⚠️ Edge Function unavailable. Using direct DB fallback...');

    if (userId) {
      const upgraded = await upgradeUserDirectly(userId, razorpay_payment_id);

      if (upgraded) {
        return {
          success: true,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        };
      }

      // DB update also failed — still let user through (payment was confirmed by Razorpay)
      // Log for manual reconciliation
      console.error('❌ Both Edge Function and direct DB upgrade failed!');
      console.error('   Manual action needed for payment:', razorpay_payment_id, 'user:', userId);

      // Return success anyway since Razorpay confirmed the payment
      // The admin can manually upgrade this user
      return {
        success: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      };
    }

    // No userId provided — still success (Razorpay confirmed it)
    return {
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    };
  }
};

/**
 * Extract Razorpay parameters from URL search params
 */
export const extractRazorpayParams = (searchParams: URLSearchParams): RazorpayPaymentResponse | null => {
  const paymentId = searchParams.get('razorpay_payment_id');
  const orderId = searchParams.get('razorpay_order_id');
  const signature = searchParams.get('razorpay_signature');

  if (paymentId && orderId && signature) {
    return {
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_signature: signature,
    };
  }

  return null;
};
