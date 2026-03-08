import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LogOut,
    LayoutDashboard,
    User,
    Crown,
    Upload,
    Settings,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionStore } from "@/store/subscriptionStore";

/* ── dropdown animation ──────────────────────────────────────────────── */
const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
    exit: { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.14 } },
};

export const UserDropdown: React.FC<{ variant?: "navbar" | "dashboard" }> = ({
    variant = "navbar",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const navigate = useNavigate();
    const { user, profile, signOut } = useAuth();
    const isPro = useSubscriptionStore((s) => s.isPro);

    /* ── hover helpers — small delay prevents flicker ── */
    const openMenu = () => { if (hoverTimeout.current) clearTimeout(hoverTimeout.current); setIsOpen(true); };
    const closeMenu = () => { hoverTimeout.current = setTimeout(() => setIsOpen(false), 120); };

    /* ── actions ── */
    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await signOut();
            toast.success("Signed out successfully!");
            navigate("/login");
        } catch {
            toast.error("Failed to sign out");
        } finally {
            setIsSigningOut(false);
            setIsOpen(false);
        }
    };

    const go = (path: string) => { navigate(path); setIsOpen(false); };

    /* ── display helpers ── */
    const getInitials = () => {
        if (profile?.full_name) {
            return profile.full_name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        return user?.email?.[0]?.toUpperCase() ?? "U";
    };

    const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "User";
    const displayEmail = profile?.email ?? user?.email ?? "";

    /* ── avatar ── */
    const Avatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
        const dim = size === "sm" ? "h-8 w-8 text-[11px]" : size === "lg" ? "h-14 w-14 text-base" : "h-9 w-9 text-[12px]";
        const radius = size === "sm" ? "rounded-full" : "rounded-full";
        return (
            <div className={`${dim} ${radius} relative flex items-center justify-center font-black text-white shrink-0`}
                style={{
                    background: isPro
                        ? "linear-gradient(135deg,#f59e0b,#d97706)"
                        : "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    boxShadow: isPro
                        ? "0 0 16px rgba(245,158,11,0.3)"
                        : "0 0 16px rgba(124,58,237,0.25)",
                }}
            >
                {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className={`w-full h-full ${radius} object-cover`} />
                ) : (
                    <span>{getInitials()}</span>
                )}
                {isPro && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center border-2 border-[#07070a]">
                        <Crown size={8} className="text-black" strokeWidth={3} />
                    </div>
                )}
            </div>
        );
    };

    /* ── NAVBAR VARIANT ── */
    if (variant === "navbar") {
        return (
            <div
                className="relative"
                onMouseEnter={openMenu}
                onMouseLeave={closeMenu}
            >
                {/* Trigger */}
                <button
                    className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/[0.06] transition-all duration-200 focus:outline-none"
                    aria-label="User menu"
                    onClick={() => setIsOpen((o) => !o)}
                >
                    <Avatar size="md" />
                    {/* small caret (no chevron arrow — just visual dot-indicator) */}
                    <span
                        className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${isOpen ? "bg-violet-400" : "bg-white/25"}`}
                    />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute top-full right-0 mt-3 w-72 z-[200]"
                            onMouseEnter={openMenu}
                            onMouseLeave={closeMenu}
                        >
                            <div
                                className="rounded-[20px] overflow-hidden border border-white/[0.09]"
                                style={{
                                    background: "linear-gradient(145deg,rgba(12,10,22,0.97),rgba(8,8,18,0.99))",
                                    boxShadow: "0 0 0 1px rgba(139,92,246,0.1), 0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
                                    backdropFilter: "blur(24px)",
                                }}
                            >
                                {/* ── User Header ── */}
                                <div className="px-5 py-5 border-b border-white/[0.06]"
                                    style={{
                                        background: isPro
                                            ? "linear-gradient(135deg,rgba(245,158,11,0.08),transparent)"
                                            : "linear-gradient(135deg,rgba(124,58,237,0.08),transparent)",
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar size="lg" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="text-[14px] font-black text-white truncate">{displayName}</p>
                                                {isPro && (
                                                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[9px] font-black uppercase tracking-widest text-black bg-gradient-to-r from-yellow-400 to-amber-500">
                                                        <Crown size={8} strokeWidth={3} /> PRO
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[12px] text-white/40 font-medium truncate">{displayEmail}</p>
                                            {isPro && (
                                                <div className="mt-2 inline-flex items-center gap-1 px-2 py-[2px] rounded-full bg-violet-500/10 border border-violet-500/20">
                                                    <Sparkles size={9} className="text-violet-400" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-violet-300">V3.0 Intelligence Hub</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ── Menu Items ── */}
                                <div className="p-2 space-y-0.5">

                                    <MenuRow
                                        icon={LayoutDashboard}
                                        label="Dashboard"
                                        iconColor="#a78bfa"
                                        onClick={() => go("/dashboard")}
                                    />
                                    <MenuRow
                                        icon={Sparkles}
                                        label="View History"
                                        iconColor="#f59e0b"
                                        onClick={() => go("/upload?tab=history")}
                                    />
                                    <MenuRow
                                        icon={Upload}
                                        label="Remove Background"
                                        iconColor="#60a5fa"
                                        onClick={() => go("/upload")}
                                    />
                                    <MenuRow
                                        icon={User}
                                        label="My Profile"
                                        iconColor="#94a3b8"
                                        onClick={() => go("/profile")}
                                    />
                                    <MenuRow
                                        icon={Settings}
                                        label="Settings"
                                        iconColor="#94a3b8"
                                        onClick={() => go("/dashboard")}
                                    />

                                    {/* Upgrade — only when free */}
                                    {!isPro && (
                                        <>
                                            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent my-1" />
                                            <button
                                                onClick={() => go("/#pricing")}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group"
                                                style={{
                                                    background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(79,70,229,0.08))",
                                                    border: "1px solid rgba(139,92,246,0.2)",
                                                }}
                                            >
                                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-400/20 to-amber-500/15 border border-yellow-500/20 flex items-center justify-center shrink-0">
                                                    <Crown size={14} className="text-yellow-400" strokeWidth={2} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[13px] font-black text-white leading-none mb-0.5">Upgrade to Pro</p>
                                                    <p className="text-[10.5px] text-white/40 font-medium">Unlimited · HD · API access</p>
                                                </div>
                                            </button>
                                        </>
                                    )}

                                </div>

                                {/* ── Divider ── */}
                                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-2" />

                                {/* ── Sign Out ── */}
                                <div className="p-2">
                                    <button
                                        onClick={handleSignOut}
                                        disabled={isSigningOut}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-red-500/8 border border-red-500/15 flex items-center justify-center shrink-0">
                                            <LogOut size={14} className="text-red-400/70" />
                                        </div>
                                        <span>{isSigningOut ? "Signing out…" : "Sign Out"}</span>
                                    </button>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    /* ── DASHBOARD VARIANT ── */
    if (variant === "dashboard") {
        return (
            <div
                className="relative"
                onMouseEnter={openMenu}
                onMouseLeave={closeMenu}
            >
                <button
                    onClick={() => setIsOpen((o) => !o)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-all duration-200"
                >
                    <Avatar size="sm" />
                    <div className="hidden sm:flex flex-col items-start min-w-0">
                        <span className="text-[13px] font-bold text-white truncate max-w-[120px]">{displayName}</span>
                        {isPro && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400/70">Pro</span>
                        )}
                    </div>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute top-full right-0 mt-2 w-64 z-[200]"
                            onMouseEnter={openMenu}
                            onMouseLeave={closeMenu}
                        >
                            <div
                                className="rounded-[18px] overflow-hidden border border-white/[0.09]"
                                style={{
                                    background: "linear-gradient(145deg,rgba(12,10,22,0.97),rgba(8,8,18,0.99))",
                                    boxShadow: "0 0 0 1px rgba(139,92,246,0.1), 0 20px 50px rgba(0,0,0,0.7)",
                                    backdropFilter: "blur(24px)",
                                }}
                            >
                                <div className="p-2 space-y-0.5">
                                    <MenuRow icon={LayoutDashboard} label="Dashboard" iconColor="#a78bfa" onClick={() => go("/dashboard")} />
                                    <MenuRow icon={Upload} label="Remove Background" iconColor="#60a5fa" onClick={() => go("/upload")} />
                                    <MenuRow icon={User} label="My Profile" iconColor="#94a3b8" onClick={() => go("/dashboard")} />
                                </div>
                                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-2" />
                                <div className="p-2">
                                    <button
                                        onClick={handleSignOut}
                                        disabled={isSigningOut}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-red-500/8 border border-red-500/15 flex items-center justify-center shrink-0">
                                            <LogOut size={14} className="text-red-400/70" />
                                        </div>
                                        <span>{isSigningOut ? "Signing out…" : "Sign Out"}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return null;
};

/* ── Reusable menu row ── */
const MenuRow = ({
    icon: Icon,
    label,
    iconColor,
    onClick,
}: {
    icon: React.ElementType;
    label: string;
    iconColor: string;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold text-white/65 hover:text-white hover:bg-white/[0.06] transition-all duration-200 group"
    >
        <div
            className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
            style={{ background: `${iconColor}14`, border: `1px solid ${iconColor}25` }}
        >
            <Icon size={15} style={{ color: iconColor }} strokeWidth={1.8} />
        </div>
        <span>{label}</span>
    </button>
);
