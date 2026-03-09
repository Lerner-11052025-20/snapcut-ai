import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    User,
    Mail,
    Crown,
    Shield,
    Calendar,
    Camera,
    Loader2,
    Check,
    AlertCircle,
    Sparkles,
    ArrowRight,
    Home,
    Zap,
    Cpu
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/lib/toast-messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const ProfilePage = () => {
    const { user, profile, refreshProfile, isPro } = useAuth();
    const [fullName, setFullName] = useState(profile?.full_name || "");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccessToken, setShowSuccessToken] = useState(false);

    useEffect(() => {
        if (profile?.full_name) setFullName(profile.full_name);
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsUpdating(true);
        try {
            // Update Auth User Metadata
            await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            // Update Database Profile
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            await refreshProfile();
            setShowSuccessToken(true);
            setTimeout(() => {
                setShowSuccessToken(false);
            }, 3500);
        } catch (error: any) {
            toast.error(error.message || TOAST_MESSAGES.ERROR.UNEXPECTED);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error(TOAST_MESSAGES.PROCESSING.FILE_TOO_LARGE);
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/avatar.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            await refreshProfile();
            toast.success(TOAST_MESSAGES.SETTINGS.PROFILE_UPDATED);
        } catch (error: any) {
            toast.error(error.message || TOAST_MESSAGES.ERROR.UNEXPECTED);
        } finally {
            setIsUploading(false);
        }
    };

    const joinDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
        : "Recently";

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 pb-20 selection:bg-primary/30 relative overflow-hidden flex flex-col items-center">
            {/* SAAS Background Grids & Orbs - Performance Optimized */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-grid opacity-40 mix-blend-screen" />
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] will-change-transform" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] will-change-transform" />
            </div>

            <div className="container relative z-10 mx-auto px-4 max-w-5xl w-full">

                {/* Top Navigation / Badge Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6"
                >
                    {/* Back to Home Badge */}
                    <Link to="/">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 text-sm font-semibold text-white/70 hover:text-white group cursor-pointer glass shadow-glow">
                            <Home size={16} className="group-hover:text-primary transition-colors" />
                            <span>Return to Home</span>
                        </div>
                    </Link>

                    {/* SAAS Functional Logo */}
                    <div className="flex items-center gap-3 select-none group">
                        <div className="h-10 w-10 rounded-xl bg-gradient-primary p-[1px] glow-border">
                            <div className="h-full w-full bg-[#020617] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                                <Zap className="text-white fill-white/20" size={20} />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display font-black text-xl tracking-tight leading-none text-white">SNAPCUT<span className="text-gradient">.AI</span></span>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase leading-none mt-1">Version 3.0 Platform</span>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="w-full"
                >
                    {/* Header Details */}
                    <motion.div variants={itemVariants} className="mb-12">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white">Identity <span className="text-white/40">&</span> Access</h1>
                        <p className="text-white/50 text-lg font-medium max-w-2xl">
                            Configure your presence, manage high-performance processing capabilities, and oversee Version 3.0 Intelligence Hub activity.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-12 gap-8">
                        {/* Left Column: Avatar & Quick Info */}
                        <motion.div variants={itemVariants} className="md:col-span-4 space-y-6">

                            {/* Profile Identity Card */}
                            <div className="p-8 rounded-[2rem] glass glass-hover relative overflow-hidden flex flex-col items-center flex-shrink-0">
                                {/* Subtle internal glow */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent opacity-50 pointer-events-none" />

                                <div className="relative group z-10">
                                    <div className={`h-36 w-36 rounded-full flex items-center justify-center font-display font-black text-4xl transition-all duration-500 ease-out group-hover:scale-105 ${isPro ? 'bg-gradient-to-br from-yellow-400 to-amber-600 shadow-[0_0_40px_rgba(250,204,21,0.3)]' : 'bg-gradient-primary shadow-glow'}`}>
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Profile" className="h-full w-full rounded-full object-cover border-4 border-[#020617]/50" />
                                        ) : (
                                            <span>{fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</span>
                                        )}

                                        {/* Upload Overlay */}
                                        <label className="absolute inset-0 flex items-center justify-center bg-[#020617]/80 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300 backdrop-blur-sm">
                                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                                            {isUploading ? <Loader2 className="animate-spin text-primary" size={28} /> : <Camera className="text-white" size={28} />}
                                        </label>

                                        {/* Pro Badge */}
                                        {isPro && (
                                            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center border-4 border-[#020617] shadow-xl">
                                                <Crown size={18} className="text-black" strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 text-center w-full z-10">
                                    <h2 className="text-2xl font-bold text-white truncate w-full tracking-tight">{fullName || "Unnamed User"}</h2>
                                    <p className="text-white/40 text-sm font-medium mt-1 truncate w-full">{user?.email}</p>
                                </div>

                                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

                                <div className="w-full space-y-5 z-10">
                                    <div className="flex items-center gap-4 text-white/50 group">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <Calendar size={14} className="text-primary" />
                                        </div>
                                        <span className="text-sm font-semibold tracking-tight">Active since {joinDate}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/50 group">
                                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                            <Shield size={14} className="text-emerald-400" />
                                        </div>
                                        <span className="text-sm font-semibold tracking-tight">Enterprise SSL Secured</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pro Promotion (if user is free) */}
                            {!isPro && (
                                <motion.div whileHover={{ scale: 1.02 }} className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 glass shadow-glow-accent cursor-pointer overflow-hidden relative">
                                    <div className="absolute inset-0 shimmer opacity-20" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Crown className="text-yellow-400 animate-pulse" size={20} />
                                            <span className="font-black text-xs uppercase tracking-widest text-white">Upgrade to Elite</span>
                                        </div>
                                        <p className="text-white/60 text-sm leading-relaxed mb-5">Unlock Version 3.0 algorithms, infinite batch processing, and 4K ultra-HD exports.</p>
                                        <Link to="/#pricing">
                                            <Button variant="default" className="w-full rounded-xl bg-gradient-primary hover:opacity-90 h-12 text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all border-none text-white">
                                                Supercharge Account
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Right Column: Settings & Details */}
                        <motion.div variants={itemVariants} className="md:col-span-8 space-y-6">

                            {/* General Settings Form */}
                            <form onSubmit={handleUpdateProfile} className="p-8 sm:p-10 rounded-[2rem] glass glass-hover relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <h3 className="text-2xl font-bold flex items-center gap-3">
                                        <User className="text-primary" size={24} />
                                        Profile Configuration
                                    </h3>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    <div className="space-y-3 group">
                                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 group-focus-within:text-primary transition-colors">Full Legal Name</label>
                                        <Input
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="h-14 bg-white/[0.02] border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-white font-medium text-lg px-4 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-3 opacity-70">
                                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Authentication Email</label>
                                        <div className="relative">
                                            <Input
                                                value={user?.email || ""}
                                                readOnly
                                                className="h-14 bg-black/20 border-white/5 rounded-2xl text-white/50 cursor-not-allowed pl-14 text-lg font-medium"
                                            />
                                            <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                                        </div>
                                        <div className="flex items-center gap-2 mt-3 ml-1">
                                            <AlertCircle size={14} className="text-accent" />
                                            <span className="text-xs font-medium text-white/40">Secured parameter. Email unchangeable via dashboard to prevent hijacking.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-white/5 flex justify-end relative z-10">
                                    <Button
                                        type="submit"
                                        disabled={isUpdating || fullName === profile?.full_name}
                                        className="rounded-xl px-10 bg-white text-[#020617] font-black uppercase tracking-widest text-[12px] h-12 hover:bg-white/90 disabled:opacity-30 border-none hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300"
                                    >
                                        {isUpdating ? <Loader2 className="animate-spin mr-3" size={16} /> : null}
                                        {isUpdating ? "Synchronizing..." : "Update Identity"}
                                    </Button>
                                </div>
                            </form>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {/* Version 3.0 Intelligence Hub Tracking */}
                                <div className="p-8 rounded-[2rem] glass glass-hover relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-accent/20 transition-colors duration-500" />

                                    <h3 className="text-xl font-bold flex items-center gap-3 mb-4 relative z-10">
                                        <Cpu size={22} className="text-accent" />
                                        Version 3.0 Hub
                                    </h3>

                                    <p className="text-white/50 text-sm font-medium mb-8 leading-relaxed relative z-10">
                                        Access the Intelligence Hub to review your computational history and surgical subject removals processing queue.
                                    </p>

                                    <Link to="/upload?tab=history">
                                        <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5 hover:border-white/20 text-white font-bold uppercase tracking-widest text-xs h-12 bg-transparent transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] relative z-10">
                                            Launch Analytics
                                            <ArrowRight size={16} className="ml-2" />
                                        </Button>
                                    </Link>
                                </div>

                                {/* Subscription Status */}
                                <div className="p-8 rounded-[2rem] glass glass-hover relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[70px] pointer-events-none ${isPro ? 'bg-yellow-400/10' : 'bg-primary/5'}`} />

                                    <h3 className="text-xl font-bold flex items-center gap-3 mb-6 relative z-10">
                                        {isPro ? <Crown size={22} className="text-yellow-400" /> : <Sparkles size={22} className="text-primary" />}
                                        License Status
                                    </h3>

                                    <div className={`p-5 rounded-2xl border backdrop-blur-sm relative z-10 transition-colors ${isPro ? 'bg-yellow-400/5 border-yellow-400/20' : 'bg-white/[0.02] border-white/10'}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`font-black tracking-tight ${isPro ? 'text-yellow-400' : 'text-white'}`}>{isPro ? "ELITE EDITION" : "HOBBYIST PLAN"}</span>
                                                </div>
                                                <p className="text-white/40 text-[13px] font-medium">{isPro ? "Maximized Performance" : "Rate limited pipeline"}</p>
                                            </div>
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isPro ? 'bg-yellow-400/20 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'bg-white/5 text-white/40'}`}>
                                                {isPro ? <Check size={24} strokeWidth={3} /> : <Shield size={20} />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col items-start gap-4 relative z-10">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                                            <div className={`h-1.5 w-1.5 rounded-full ${isPro ? 'bg-emerald-400 animate-pulse' : 'bg-primary'}`} />
                                            System V3.0 Status: ACTIVE
                                        </div>

                                        {!isPro && (
                                            <Link to="/#pricing" className="mt-2">
                                                <Button variant="link" className="p-0 h-auto text-[11px] font-black text-primary hover:text-white uppercase tracking-widest">
                                                    View Upgrade Tiers <ArrowRight size={14} className="ml-1" />
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Custom Token Success Message with Blurry Effect */}
            <AnimatePresence>
                {showSuccessToken && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/60"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="p-10 rounded-[2.5rem] glass border border-primary/30 shadow-[0_0_80px_rgba(14,165,255,0.4)] flex flex-col items-center max-w-md text-center relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-grid opacity-30 mix-blend-screen" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150%] bg-gradient-primary opacity-20 pointer-events-none blur-[60px] animate-pulse-glow" />

                            <div className="relative z-10 w-full flex flex-col items-center">
                                <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/30 shadow-glow group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-110">
                                    <Check size={48} className="text-primary drop-shadow-[0_0_15px_rgba(14,165,255,0.8)]" />
                                </div>
                                <h3 className="text-3xl font-black text-white tracking-tight mb-4">Identity Synchronized</h3>
                                <p className="text-white/60 text-base font-medium leading-relaxed">
                                    Your global profile data has been successfully updated across the Version 3.0 Platform servers.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;
