import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getAllHistory, migrateFromLocalStorage } from "@/lib/historyDB";
import { getCloudHistory } from "@/lib/cloudHistory";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Upload,
    History,
    CreditCard,
    Key,
    Settings,
    Plus,
    Image as ImageIcon,
    Zap,
    Clock,
    TrendingUp,
    ChevronRight,
    Sparkles,
    Crown,
    ArrowRight,
    LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/UserDropdown";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionStore } from "@/store/subscriptionStore";

interface HistoryItem {
    id: string;
    original: string;
    result: string;
    timestamp: string;
    custom_name?: string;
    processing_time_ms?: number;
    download_count?: number;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, profile, signOut } = useAuth();
    const isPro = useSubscriptionStore((state) => state.isPro);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [activeTab, setActiveTab] = useState("dashboard");

    const loadHistory = useCallback(async () => {
        await migrateFromLocalStorage();
        const localItems = await getAllHistory();

        let cloudItems: any[] = [];
        if (user) {
            cloudItems = await getCloudHistory();
        }

        const formattedCloud: HistoryItem[] = cloudItems.map(c => ({
            id: c.id,
            original: c.original_url || "",
            result: c.result_url,
            timestamp: new Date(c.timestamp).toLocaleString(),
            custom_name: c.custom_name,
            processing_time_ms: c.processing_time_ms,
            download_count: c.download_count
        }));

        const combined = [...formattedCloud, ...localItems];
        const itemsByResult = new Map();
        combined.forEach(item => {
            if (!itemsByResult.has(item.result)) {
                itemsByResult.set(item.result, item);
            }
        });

        const activeItems = Array.from(itemsByResult.values())
            .filter(i => i.result && !i.result.startsWith("blob:"));

        setHistory(activeItems);
    }, [user]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory, user]);

    const stats = useMemo((): { label: string; value: string | number; icon: React.ReactNode; trend: string; trendColor: string }[] => [
        {
            label: "Images Processed",
            value: history.length,
            icon: <ImageIcon className="text-blue-400" size={20} />,
            trend: history.length > 0 ? "Active" : "New",
            trendColor: "text-green-400"
        },
        {
            label: "Credits Remaining",
            value: profile?.credits_remaining ?? 0,
            icon: <Zap className="text-yellow-400" size={20} />,
            trend: (profile?.credits_remaining ?? 0) < 5 ? "Low" : "Valid",
            trendColor: (profile?.credits_remaining ?? 0) < 5 ? "text-red-400" : "text-green-400"
        },
        {
            label: "This Month",
            value: history.filter(item => {
                const date = new Date(item.timestamp);
                return date.getMonth() === new Date().getMonth();
            }).length,
            icon: <TrendingUp className="text-purple-400" size={20} />,
            trend: "Growth",
            trendColor: "text-green-400"
        },
        {
            label: "Avg. Time",
            value: (history.length > 0 && (history[0] as any).processing_time_ms)
                ? (history.reduce((acc, curr: any) => acc + (curr.processing_time_ms || 0), 0) / history.length / 1000).toFixed(1) + 's'
                : "0s",
            icon: <Clock className="text-emerald-400" size={20} />,
            trend: "Optimal",
            trendColor: "text-green-400"
        }
    ], [history, profile]);

    const sidebarLinks = useMemo(() => [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
        { id: "upload", label: "Upload", icon: <Upload size={20} />, path: "/upload" },
        { id: "history", label: "History", icon: <History size={20} />, path: "/upload?tab=history" },
        { id: "billing", label: "Billing", icon: <CreditCard size={20} />, path: "/#pricing" },
        { id: "api", label: "API Keys", icon: <Key size={20} />, path: "/contact" },
        { id: "settings", label: "Settings", icon: <Settings size={20} />, path: "/dashboard" },
    ], []);

    /* Framer Motion Variants */
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    } as const;

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
    } as const;

    return (
        <div className="h-screen bg-[#020617] text-white flex overflow-hidden relative">

            {/* ── SAAS BACKGROUND ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid opacity-40 mix-blend-screen" />
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#60a5fa]/10 blur-[150px] will-change-transform" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#c084fc]/10 blur-[120px] will-change-transform" />
            </div>

            {/* ─── SIDEBAR ────────────────────────────────────────── */}
            <aside className="w-[300px] h-screen sticky top-0 bg-[#050508]/80 backdrop-blur-3xl border-r border-white/[0.05] flex flex-col flex-shrink-0 hidden lg:flex z-20 shadow-[10px_0_30px_rgba(0,0,0,0.4)]">
                <div className="p-6">
                    <Link to="/" className="group flex items-center gap-3.5 cursor-pointer hover:bg-white/[0.02] p-2.5 rounded-2xl transition-all duration-300 relative">
                        <div className="relative flex-shrink-0">
                            <Logo size={42} showText={false} />
                            <div className="absolute inset-0 bg-[#a855f7]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <h2 className="text-[24px] font-black tracking-tight text-white leading-none">
                                    SnapCut <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#c084fc]">AI</span>
                                </h2>
                                {/* Pro Crown */}
                                {isPro && (
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-600/20 flex items-center justify-center border border-yellow-500/40 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                                        <Crown size={12} className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.9)]" />
                                    </div>
                                )}
                            </div>

                            {/* V3.0 Hub Badge */}
                            <div className="mt-1.5 flex items-center px-2 py-0.5 rounded-full bg-[#1e293b]/60 border border-white/[0.08] w-fit backdrop-blur-md">
                                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#60a5fa]/90">V3.0 Intelligence Hub</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto overflow-x-hidden custom-scrollbar pb-10">
                    {sidebarLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => {
                                setActiveTab(link.id);
                                if (link.path.startsWith('/')) navigate(link.path);
                            }}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === link.id
                                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white shadow-[inset_0_0_20px_rgba(124,58,237,0.1)] border border-white/[0.05] drop-shadow-sm"
                                : "text-[#71717a] hover:text-white hover:bg-white/[0.04] border border-transparent"
                                }`}
                        >
                            <span className={activeTab === link.id ? "text-blue-400" : "text-white/30 group-hover:text-white/70 transition-colors"}>
                                {link.icon}
                            </span>
                            {link.label}
                        </button>
                    ))}
                </nav>

                {/* ── SIDEBAR FOOTER (Pinned to Bottom) ────────────────── */}
                <div className="flex-shrink-0 border-t border-white/[0.05] p-6 space-y-6 bg-[#050508]/40 backdrop-blur-md">
                    {isPro ? (
                        /* PRO USER CARD */
                        <div className="glass rounded-[2rem] p-6 border-[#6b582b]/50 bg-[#35342a]/80 backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.05)] text-left">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Crown size={64} className="text-[#fcd34d]" />
                            </div>
                            <div className="relative z-10 space-y-1">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 flex items-center justify-center border border-yellow-400/30 mb-3 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                                    <Crown size={20} className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]" />
                                </div>
                                <h4 className="font-black text-sm uppercase tracking-widest text-[#fde047]">Pro Member</h4>
                                <p className="text-[11px] font-medium text-yellow-400/60 leading-tight">Unlimited compute access</p>
                            </div>
                        </div>
                    ) : (
                        /* FREE USER CARD */
                        <div className="glass rounded-[2rem] p-6 border-white/[0.05] bg-[#0a0a0f]/80 backdrop-blur-xl relative overflow-hidden group shadow-[0_0_20px_rgba(0,0,0,0.5)] text-left">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Sparkles size={64} className="text-white" />
                            </div>
                            <div className="relative z-10">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#60a5fa]/20 to-[#c084fc]/20 flex items-center justify-center mb-3 border border-white/[0.04]">
                                    <Zap size={20} className="text-[#a855f7]" />
                                </div>
                                <h4 className="font-black text-[13px] mb-1 uppercase tracking-widest text-white/80">Free Plan</h4>
                                <p className="text-[11px] text-[#71717a] font-medium mb-4">{profile?.credits_remaining ?? 0} credits left</p>
                                <Button variant="hero" size="sm" className="w-full rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-[#60a5fa] via-[#7c3aed] to-[#c084fc] border-none shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:opacity-90" asChild>
                                    <Link to="/#pricing">Upgrade to Pro</Link>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* USER PROFILE SECTION - CLICKABLE */}
                    <div className="flex items-center justify-between group/user pt-2">
                        <div
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate("/profile")}
                        >
                            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm border-2 border-white/10 shadow-lg">
                                {profile?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || user?.email?.[0].toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[13px] font-black text-white truncate max-w-[140px] leading-tight">
                                    {profile?.full_name || "User Account"}
                                </span>
                                <span className="text-[11px] font-medium text-[#71717a] truncate max-w-[140px]">
                                    {user?.email}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                await signOut();
                                navigate("/login");
                            }}
                            className="h-9 w-9 flex items-center justify-center rounded-xl text-[#71717a] hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                            title="Sign Out"
                        >
                            <LogOut size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </aside>
            {/* ─── MAIN CONTENT ─────────────────────────────────── */}
            <main className="flex-1 flex flex-col overflow-y-auto relative z-10 w-full max-w-full">
                {/* Header */}
                <header className="h-[84px] border-b border-white/[0.05] flex items-center justify-between px-6 sm:px-10 bg-[#020617]/60 backdrop-blur-2xl sticky top-0 z-50 shadow-sm">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg sm:text-xl font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">Dashboard</h1>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-blue-500/10 border border-blue-500/20 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-pulse drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
                            <span className="text-[9px] font-black text-[#60a5fa] tracking-[0.2em] uppercase leading-none mt-[1px]">V3.0 Intelligence Hub</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <Button
                            className="rounded-[1rem] px-6 h-11 hidden sm:flex bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] transition-all"
                            onClick={() => navigate("/upload")}
                        >
                            <Plus size={16} className="mr-2 opacity-50" />
                            New Project
                        </Button>
                        <div className="h-5 w-px bg-white/[0.08]" />
                        <UserDropdown variant="dashboard" />
                    </div>
                </header>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="p-6 sm:p-10 space-y-10 w-full max-w-[1400px] mx-auto"
                >
                    {/* Stats Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, _i) => (
                            <div
                                key={stat.label}
                                className="glass bg-[#09090b]/80 backdrop-blur-2xl rounded-[2rem] p-7 border border-white/[0.04] hover:bg-[#0c0c11]/90 hover:border-white/[0.08] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-bl-full pointer-events-none" />
                                <div className="flex items-center justify-between mb-5">
                                    <div className="h-12 w-12 rounded-[1rem] bg-[#020202] flex items-center justify-center border border-white/[0.04] shadow-inner drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                                        {stat.icon}
                                    </div>
                                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] tracking-widest ${stat.trendColor}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a] mb-1">{stat.label}</p>
                                <h3 className="text-4xl font-black font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80">{stat.value}</h3>
                            </div>
                        ))}
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.section variants={itemVariants} className="space-y-6">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#71717a] px-2">Action Modules</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button
                                onClick={() => navigate("/upload")}
                                className="glass bg-[#09090b]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/[0.04] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-[#0a0a0f] transition-all duration-500 text-left flex flex-col gap-6 group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#60a5fa]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="h-16 w-16 rounded-[1.2rem] bg-gradient-to-br from-[#60a5fa]/10 to-transparent flex items-center justify-center border border-[#60a5fa]/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-[0_0_20px_rgba(96,165,250,0.1)] relative z-10">
                                    <Upload size={28} className="text-[#60a5fa]" strokeWidth={2} />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="font-black text-xl text-white tracking-tight mb-2">Upload Subject</h4>
                                    <p className="text-[13px] text-[#a1a1aa] font-medium leading-relaxed">Initialize surgical background removal engine on a new asset.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate("/upload?tab=history")}
                                className="glass bg-[#09090b]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/[0.04] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-[#0a0a0f] transition-all duration-500 text-left flex flex-col gap-6 group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="h-16 w-16 rounded-[1.2rem] bg-gradient-to-br from-[#a855f7]/10 to-transparent flex items-center justify-center border border-[#a855f7]/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-[0_0_20px_rgba(168,85,247,0.1)] relative z-10">
                                    <History size={28} className="text-[#a855f7]" strokeWidth={2} />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="font-black text-xl text-white tracking-tight mb-2">Archive Vault</h4>
                                    <p className="text-[13px] text-[#a1a1aa] font-medium leading-relaxed">Access previously generated cutouts and historical data.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate("/contact")}
                                className="glass bg-[#09090b]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/[0.04] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-[#0a0a0f] transition-all duration-500 text-left flex flex-col gap-6 group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#34d399]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="h-16 w-16 rounded-[1.2rem] bg-gradient-to-br from-[#34d399]/10 to-transparent flex items-center justify-center border border-[#34d399]/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-[0_0_20px_rgba(52,211,153,0.1)] relative z-10">
                                    <Key size={28} className="text-[#34d399]" strokeWidth={2} />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="font-black text-xl text-white tracking-tight mb-2">API Registration</h4>
                                    <p className="text-[13px] text-[#a1a1aa] font-medium leading-relaxed">Generate scalable integration keys for enterprise pipelines.</p>
                                </div>
                            </button>
                        </div>
                    </motion.section>

                    {/* Recent Activity */}
                    <motion.section variants={itemVariants} className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#71717a]">Recent Activity Logs</h2>
                            <button
                                onClick={() => navigate("/upload?tab=history")}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-[#60a5fa] hover:text-[#93c5fd] transition-colors flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded"
                            >
                                View Database <ChevronRight size={12} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="glass bg-[#09090b]/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/[0.04] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/[0.04] bg-[#020202]">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a]">Artifact Instance</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a]">Timestamp</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a]">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a] text-right">Function</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.02] bg-transparent">
                                        {history.slice(0, 5).map((item) => (
                                            <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => navigate("/upload?tab=history")}>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-14 w-14 rounded-2xl border border-white/[0.04] overflow-hidden bg-[#020202] p-1 shadow-inner group-hover:border-[#60a5fa]/30 transition-colors">
                                                            <div className="w-full h-full relative" style={{ backgroundImage: 'linear-gradient(45deg, #18181b 25%, transparent 25%), linear-gradient(-45deg, #18181b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #18181b 75%), linear-gradient(-45deg, transparent 75%, #18181b 75%)', backgroundSize: '8px 8px' }}>
                                                                <img src={item.result} alt="Product" className="h-full w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                                                            </div>
                                                        </div>
                                                        <span className="text-[12px] font-black text-white/80 font-mono tracking-tight group-hover:text-white transition-colors">
                                                            {item.custom_name || `snap_${item.id.slice(-6)}.png`}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="text-[11px] font-bold text-[#71717a] tracking-wider">{item.timestamp}</span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#052e16] text-[#4ade80] text-[9px] font-black uppercase tracking-widest border border-[#166534] w-fit shadow-sm">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                                                        Verified
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        className="h-10 w-10 rounded-xl bg-white/[0.03] hover:bg-[#60a5fa]/20 text-[#a1a1aa] hover:text-[#60a5fa] border border-transparent hover:border-[#60a5fa]/30 drop-shadow-sm transition-all flex items-center justify-center ml-auto hover:scale-105"
                                                        onClick={(e) => { e.stopPropagation(); navigate("/upload?tab=history"); }}
                                                    >
                                                        <ArrowRight size={18} strokeWidth={2.5} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {history.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-32 text-center bg-transparent">
                                                    <div className="flex flex-col items-center gap-6 opacity-40">
                                                        <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                                                            <ImageIcon size={32} />
                                                        </div>
                                                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#71717a]">No Telemetry Data Recovered</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.section>
                </motion.div>
            </main>
        </div >
    );
};

export default Dashboard;
