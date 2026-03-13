import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { useSubscriptionStore } from '@/store/subscriptionStore';
// localStorage key for caching pro status (survives page reloads even if DB update fails)
const PRO_CACHE_KEY = 'snapcut_pro_status';

interface UserProfile {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
    subscription_tier: 'free' | 'pro' | 'enterprise' | null;
    subscription_ends_at: string | null;
    credits_remaining: number;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    profile: UserProfile | null;
    isPro: boolean;
    signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    useCredits: (count: number) => Promise<{ success: boolean; error?: string }>;
    isAuthenticated: boolean;
    refreshProfile: () => Promise<void>;
    markAsPro: () => void; // Force-set PRO immediately in UI state + localStorage
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const profileFetchRef = useRef<string | null>(null);

    /**
     * Fetch profile from Supabase DB and merge with any cached pro status
     */
    const fetchProfile = useCallback(async (userId: string, currentUser?: User | null) => {
        // Prevent duplicate concurrent fetches for the same user
        if (profileFetchRef.current === userId) return;
        profileFetchRef.current = userId;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, email, avatar_url, subscription_tier, credits_remaining')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return;
            }

            if (data) {
                // Check if we have a cached "pro" status from a recent payment
                // (in case the DB update failed due to RLS but payment was real)
                const userId_local = userId; // avoid shadowing
                const cachedPro = localStorage.getItem(`${PRO_CACHE_KEY}_${userId_local}`);
                const effectiveTier = cachedPro === 'pro' ? 'pro' :
                    (data.subscription_tier ?? 'free');

                // If DB says free but cache says pro, we keep pro (until user signs out)
                if (data.subscription_tier === 'pro') {
                    localStorage.setItem(`${PRO_CACHE_KEY}_${userId_local}`, 'pro');
                }

                // Update global state store (Zustand)
                useSubscriptionStore.getState().setPlan(
                    effectiveTier === 'pro' || effectiveTier === 'enterprise' ? 'PRO' : 'FREE'
                );

                // 🛠️ AUTO-HEAL: If user is Pro but has 0 credits (e.g., from a failed migration or previous tier),
                // we automatically restore them to 100.
                let finalCredits = data.credits_remaining ?? (effectiveTier === 'pro' ? 100 : 2);

                if (effectiveTier === 'pro' && finalCredits <= 0) {
                    finalCredits = 100;
                    // Sync back to DB silently
                    supabase.from('profiles')
                        .update({ credits_remaining: 100 })
                        .eq('id', userId_local)
                        .then(({ error }) => {
                            if (error) console.error("[Auth] Auto-heal sync failed:", error);
                        });
                }

                setProfile({
                    full_name: data.full_name || currentUser?.user_metadata?.full_name || null,
                    email: data.email || null,
                    avatar_url: data.avatar_url || currentUser?.user_metadata?.avatar_url || null,
                    subscription_tier: effectiveTier as any,
                    subscription_ends_at: null,
                    credits_remaining: finalCredits,
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            profileFetchRef.current = null;
        }
    }, []);

    /**
     * Force-refresh profile from DB (bypasses the dedup guard)
     */
    const refreshProfile = useCallback(async () => {
        if (user?.id) {
            profileFetchRef.current = null; // clear guard to force re-fetch
            await fetchProfile(user.id, user);
        }
    }, [user, fetchProfile]);

    /**
     * Immediately mark user as PRO in local state + localStorage.
     * This works even if the DB update fails due to RLS.
     * The DB will be synced when the Edge Function is deployed.
     */
    const markAsPro = useCallback(async () => {
        if (!user?.id) return;

        // 1. Local Cache (Survivability)
        localStorage.setItem(`${PRO_CACHE_KEY}_${user.id}`, 'pro');

        // 2. Persistent Supabase Update (Cloud)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    subscription_tier: 'pro',
                    credits_remaining: 100
                })
                .eq('id', user.id);

            if (error) console.error('Cloud upgrade failed:', error);
        } catch (err) {
            console.error('Runtime error during cloud upgrade:', err);
        }

        // 3. Reactive UI Updates
        setProfile((prev) => {
            if (!prev) {
                return {
                    full_name: null,
                    email: user?.email ?? null,
                    avatar_url: null,
                    subscription_tier: 'pro',
                    subscription_ends_at: null,
                    credits_remaining: 100,
                };
            }
            return {
                ...prev,
                subscription_tier: 'pro',
                credits_remaining: 100
            };
        });

        // 👑 Update global state store (Zustand)
        useSubscriptionStore.getState().markAsPro();
    }, [user]);

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                // Get session exactly once on mount
                const { data: { session: initialSession }, error } = await supabase.auth.getSession();

                if (!mounted) return;

                if (initialSession) {
                    setSession(initialSession);
                    const currentUser = initialSession.user;
                    setUser(currentUser);

                    // Pre-Hydrate Zustand from LocalCache for instant UI speed
                    const cachedPro = localStorage.getItem(`${PRO_CACHE_KEY}_${currentUser.id}`);
                    if (cachedPro === 'pro') {
                        useSubscriptionStore.getState().markAsPro();
                    }

                    // Fetch full profile data
                    fetchProfile(currentUser.id, currentUser);
                }
            } catch (error) {
                console.error('⚠️ [Auth] Init failed:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!mounted) return;

            console.log(`📍 [Auth] Event: ${event}`);
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                // Use a slight delay to avoid Auth lock contention
                const timer = setTimeout(() => fetchProfile(currentUser.id, currentUser), 100);
                return () => clearTimeout(timer);
            } else {
                setProfile(null);
                profileFetchRef.current = null;
                useSubscriptionStore.getState().setPlan('FREE');
            }
        });

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, [fetchProfile]);

    // Realtime subscription — auto-updates UI when DB subscription_tier changes
    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase
            .channel(`profile-realtime-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`,
                },
                (payload) => {
                    console.log('✅ Profile realtime update:', payload.new);
                    if (payload.new?.subscription_tier === 'pro') {
                        // Also update localStorage cache
                        localStorage.setItem(`${PRO_CACHE_KEY}_${user.id}`, 'pro');
                        useSubscriptionStore.getState().markAsPro();
                    } else if (payload.new?.subscription_tier === 'free') {
                        useSubscriptionStore.getState().setPlan('FREE');
                    }
                    setProfile((prev) => ({ ...prev, ...payload.new } as UserProfile));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    const signUp = async (
        email: string,
        password: string,
        fullName: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName } },
            });

            if (signUpError) {
                console.error('[Auth] SignUp error:', signUpError);
                return { success: false, error: signUpError.message };
            }

            if (data.user) {
                // We use a try-catch specifically for the profile insert 
                // so that a profile failure doesn't block the account creation success
                try {
                    const { error: profileError } = await supabase.from('profiles').insert([
                        {
                            id: data.user.id,
                            full_name: fullName,
                            email: email,
                            credits_remaining: 2, // 2 Free Credits for signup
                            updated_at: new Date().toISOString(),
                        },
                    ]);
                    if (profileError) {
                        console.error('⚠️ [Auth] Profile insertion failed:', profileError.message);
                        // If it's a duplicate key, the trigger already handled it, which is fine.
                    }
                } catch (err) {
                    console.error('❌ [Auth] Runtime error during profile creation:', err);
                }
            }

            return { success: true };
        } catch (error: any) {
            console.error('[Auth] SignUp exception:', error);
            return { success: false, error: error.message || 'An unexpected error occurred during registration.' };
        }
    };

    const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                console.error('[Auth] SignIn error:', error);
                return { success: false, error: error.message };
            }
            return { success: true };
        } catch (error: any) {
            console.error('[Auth] SignIn exception:', error);
            return { success: false, error: error.message || 'An unexpected error occurred during login.' };
        }
    };

    const useCredits = async (count: number): Promise<{ success: boolean; error?: string }> => {
        if (!user || !profile) return { success: false, error: "Authentication required" };

        const newCredits = Math.max(0, profile.credits_remaining - count);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ credits_remaining: newCredits })
                .eq('id', user.id);

            if (error) throw error;

            setProfile(prev => prev ? { ...prev, credits_remaining: newCredits } : null);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                }
            });
            if (error) {
                console.error('[Auth] Google OAuth error:', error);
                throw error;
            }
        } catch (error: any) {
            console.error('[Auth] Google sign-in error:', error);
            throw new Error(error.message || 'Failed to sign in with Google. Please try again.');
        }
    };

    const signOut = async () => {
        try {
            // Clear localStorage pro cache on sign out
            if (user?.id) {
                localStorage.removeItem(`${PRO_CACHE_KEY}_${user.id}`);
            }
            await supabase.auth.signOut();
            setUser(null);
            setSession(null);
            setProfile(null);
            profileFetchRef.current = null;
            useSubscriptionStore.getState().setPlan('FREE');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const isPro = useMemo(() => {
        if (profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'enterprise') return true;
        if (user?.id) {
            const cachedPro = localStorage.getItem(`${PRO_CACHE_KEY}_${user.id}`);
            return cachedPro === 'pro';
        }
        return false;
    }, [profile, user]);

    const value = React.useMemo(() => ({
        user,
        session,
        loading,
        profile,
        isPro,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        useCredits,
        isAuthenticated: !!user,
        refreshProfile,
        markAsPro,
    }), [
        user,
        session,
        loading,
        profile,
        isPro,
        signUp,
        signIn,
        signOut,
        useCredits,
        refreshProfile,
        markAsPro
    ]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
