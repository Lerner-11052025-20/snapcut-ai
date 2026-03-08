import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useSubscriptionStore } from '@/store/subscriptionStore';

export interface UserSubscription {
  tier: 'free' | 'pro' | 'enterprise';
  startedAt: string | null;
  endsAt: string | null;
  isActive: boolean;
}

export const useUserSubscription = () => {
  const { user } = useAuth();
  const plan = useSubscriptionStore((state) => state.plan);
  const isPro = useSubscriptionStore((state) => state.isPro);

  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: plan === 'PRO' ? 'pro' : 'free',
    startedAt: null,
    endsAt: null,
    isActive: isPro,
  });
  const [loading, setLoading] = useState(true);

  // Sync state if global plan changes
  useEffect(() => {
    setSubscription(prev => ({
      ...prev,
      tier: plan === 'PRO' ? 'pro' : 'free',
      isActive: isPro
    }));
  }, [plan, isPro]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_tier, subscription_started_at, subscription_ends_at')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          // If the DB says FREE but Zustand says PRO, trust Zustand (recent payment)
          const dbTier = (data.subscription_tier || 'free') as 'free' | 'pro' | 'enterprise';
          const effectiveTier = isPro ? 'pro' : dbTier;
          const endsAt = data.subscription_ends_at ? new Date(data.subscription_ends_at) : null;
          const isActive = effectiveTier !== 'free' && (!endsAt || endsAt > new Date());

          setSubscription({
            tier: effectiveTier,
            startedAt: data.subscription_started_at,
            endsAt: data.subscription_ends_at,
            isActive,
          });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]); // We intentionally do NOT depend on isPro here, to avoid unnecessary db hits

  return { subscription, loading };
};
