import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSubscription } from '@/hooks/useUserSubscription';

export const useRazorpayPayment = () => {
  const { user } = useAuth();
  const { subscription } = useUserSubscription();

  const initiatePayment = async (amount: number = 49900, description: string = 'SnapCut AI Pro Membership') => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    if (subscription.tier === 'pro') {
      toast.info('You are already a Pro member!');
      return;
    }

    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          openRazorpayCheckout(amount, description);
        };
      } else {
        openRazorpayCheckout(amount, description);
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
    }
  };

  const openRazorpayCheckout = (amount: number, description: string) => {
    if (!user?.email) {
      toast.error('User email not found');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
      amount: amount, // Amount in paise
      currency: 'INR',
      name: 'SnapCut AI',
      description: description,
      prefill: {
        email: user.email,
        contact: '',
      },
      theme: {
        color: '#6366f1', // Primary color (Indigo)
      },
      handler: async (response: any) => {
        // After successful payment, redirect to success page
        const params = new URLSearchParams({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });

        window.location.href = `/payment-success?${params.toString()}`;
      },
      modal: {
        ondismiss: () => {
          toast.error('Payment cancelled');
        },
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return { initiatePayment };
};

declare global {
  interface Window {
    Razorpay: any;
  }
}
