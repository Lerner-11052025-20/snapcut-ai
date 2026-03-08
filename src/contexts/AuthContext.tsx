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
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    profile: UserProfile | null;
    isPro: boolean;
    signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
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
                .select('full_name, email, avatar_url, subscription_tier')
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

                setProfile({
                    full_name: data.full_name || currentUser?.user_metadata?.full_name || null,
                    email: data.email || null,
                    avatar_url: data.avatar_url || currentUser?.user_metadata?.avatar_url || null,
                    subscription_tier: effectiveTier as any,
                    subscription_ends_at: null,
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
    const markAsPro = useCallback(() => {
        if (user?.id) {
            // Persist to localStorage so it survives page reloads
            localStorage.setItem(`${PRO_CACHE_KEY}_${user.id}`, 'pro');
        }
        // Update local state immediately — no DB round-trip needed
        setProfile((prev) => {
            if (!prev) {
                return {
                    full_name: null,
                    email: user?.email ?? null,
                    avatar_url: null,
                    subscription_tier: 'pro',
                    subscription_ends_at: null,
                };
            }
            return { ...prev, subscription_tier: 'pro' };
        });

        // 👑 Update global state store (Zustand)
        useSubscriptionStore.getState().markAsPro();
    }, [user]);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                const currentUser = data.session?.user ?? null;
                setSession(data.session);
                setUser(currentUser);

                // Fetch profile in background — DON'T block loading state on it
                if (currentUser) {
                    // 👑 HYDRATE ZUSTAND IMMEDIATELY FROM CACHE
                    const cachedPro = localStorage.getItem(`${PRO_CACHE_KEY}_${currentUser.id}`);
                    if (cachedPro === 'pro') {
                        useSubscriptionStore.getState().markAsPro();
                    }

                    fetchProfile(currentUser.id, currentUser); // intentionally no await
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                // Resolve loading FAST — UI never freezes
                setLoading(false);
            }
        };

        initAuth();

        // Auth state listener — must NOT be async (Supabase restriction)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                setTimeout(() => fetchProfile(currentUser.id, currentUser), 0);
            } else {
                setProfile(null);
                profileFetchRef.current = null;
            }
        });

        return () => {
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

            if (signUpError) return { success: false, error: signUpError.message };

            if (data.user) {
                // We use a try-catch specifically for the profile insert 
                // so that a profile failure doesn't block the account creation success
                try {
                    const { error: profileError } = await supabase.from('profiles').insert([
                        {
                            id: data.user.id,
                            full_name: fullName,
                            email: email,
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
        } catch (error) {
            return { success: false, error: String(error) };
        }
    };

    const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) return { success: false, error: error.message };
            return { success: true };
        } catch (error) {
            return { success: false, error: String(error) };
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
        signOut,
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
