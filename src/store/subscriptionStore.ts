import { create } from 'zustand';

export type PlanType = 'FREE' | 'PRO';

interface SubscriptionState {
    plan: PlanType;
    isPro: boolean;
    setPlan: (plan: PlanType) => void;
    markAsPro: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
    plan: 'FREE',
    isPro: false,
    setPlan: (plan) => set({ plan, isPro: plan === 'PRO' }),
    markAsPro: () => set({ plan: 'PRO', isPro: true }),
}));
