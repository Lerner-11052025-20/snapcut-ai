import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TOAST_MESSAGES } from '@/lib/toast-messages';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

/**
 * Simulate payment success and upgrade user to Pro
 * In production, this would be called after payment gateway confirmation
 */
export const upgradeUserToPro = async (userId: string): Promise<PaymentResult> => {
  try {
    const now = new Date();
    const renewingDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: 'pro',
        subscription_started_at: now.toISOString(),
        subscription_ends_at: renewingDate.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error upgrading user:', error);
      return { success: false, error: error.message };
    }

    toast.success(TOAST_MESSAGES.BILLING.PAYMENT_SUCCESS, {
      duration: 5000,
      description: 'Enjoy unlimited image processing and exclusive features.',
    });

    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
    };
  } catch (error) {
    console.error('Unexpected error during upgrade:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during upgrade.',
    };
  }
};

/**
 * Cancel/downgrade user back to Free
 */
export const downgradeToCommunity = async (userId: string): Promise<PaymentResult> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: 'free',
        subscription_started_at: null,
        subscription_ends_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    toast.info('You have been downgraded to the Free plan.');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred during downgrade.',
    };
  }
};
