import { useState, useEffect } from "react";
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
    Download,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

interface HistoryItem {
    id: string;
    original: string;
    result: string;
    timestamp: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        const saved = localStorage.getItem("snapcut_history");
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const stats = [
        {
            label: "Images Processed",
            value: history.length,
            icon: <ImageIcon className="text-blue-400" size={20} />,
            trend: "+12%",
            trendColor: "text-green-400"
        },
        {
            label: "Credits Remaining",
            value: "3",
            icon: <Zap className="text-yellow-400" size={20} />,
            trend: "Low",
            trendColor: "text-red-400"
        },
        {
            label: "This Month",
            value: history.filter(item => {
                const date = new Date(item.timestamp);
                return date.getMonth() === new Date().getMonth();
            }).length,
            icon: <TrendingUp className="text-purple-400" size={20} />,
            trend: "+8%",
            trendColor: "text-green-400"
        },
        {
            label: "Avg. Time",
            value: "0.8s",
            icon: <Clock className="text-emerald-400" size={20} />,
            trend: "-0.2s",
            trendColor: "text-green-400"
        }
    ];

    const sidebarLinks = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
        { id: "upload", label: "Upload", icon: <Upload size={20} />, path: "/upload" },
        { id: "history", label: "History", icon: <History size={20} />, path: "/upload?tab=history" },
        { id: "billing", label: "Billing", icon: <CreditCard size={20} />, path: "/#pricing" },
        { id: "api", label: "API Keys", icon: <Key size={20} />, path: "/contact" },
        { id: "settings", label: "Settings", icon: <Settings size={20} />, path: "/dashboard" },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden">
            {/* ─── SIDEBAR ────────────────────────────────────────── */}
            <aside className="w-72 bg-[#05091a] border-r border-white/5 flex flex-col flex-shrink-0 hidden lg:flex">
                <div className="p-8">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Logo size={32} />
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {sidebarLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => {
                                setActiveTab(link.id);
                                if (link.path.startsWith('/')) navigate(link.path);
                            }}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold tracking-tight transition-all duration-300 ${activeTab === link.id
                                    ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]"
                                    : "text-white/40 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <span className={activeTab === link.id ? "text-primary" : "text-white/20 group-hover:text-white"}>
                                {link.icon}
                            </span>
                            {link.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6">
                    <div className="glass rounded-[2rem] p-6 border-white/5 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Sparkles size={40} className="text-primary animate-pulse" />
                        </div>
                        <div className="relative z-10">
                            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                                <Zap size={20} className="text-primary" />
                            </div>
                            <h4 className="font-bold text-sm mb-1 uppercase tracking-widest text-white/50">Free Plan</h4>
                            <p className="text-xs text-muted-foreground mb-4">5 credits left</p>
                            <Button variant="hero" size="sm" className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest" asChild>
                                <Link to="/#pricing">Upgrade to Pro</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ─── MAIN CONTENT ─────────────────────────────────── */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-3xl sticky top-0 z-50">
                    <h1 className="text-xl font-black uppercase tracking-[0.2em] text-white/90">Dashboard</h1>
                    <Button
                        variant="hero"
                        className="rounded-xl px-6 font-black uppercase tracking-widest text-xs h-11"
                        onClick={() => navigate("/upload")}
                    >
                        <Plus size={18} className="mr-2" />
                        New Upload
                    </Button>
                </header>

                <div className="p-8 space-y-10">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-[2rem] p-6 border-white/5 hover:border-white/10 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                        {stat.icon}
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-white/5 border border-white/5 ${stat.trendColor}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black tracking-tighter text-white">{stat.value}</h3>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <section className="space-y-6">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/30">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button
                                onClick={() => navigate("/upload")}
                                className="glass rounded-[2.5rem] p-8 border-white/5 hover:border-primary/20 transition-all text-left flex flex-col gap-4 group"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                                    <Upload size={28} className="text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-white">Upload Image</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Remove background from a new image</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate("/upload?tab=history")}
                                className="glass rounded-[2.5rem] p-8 border-white/5 hover:border-purple/20 transition-all text-left flex flex-col gap-4 group"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                                    <History size={28} className="text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-white">View History</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Access your recent processed images</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate("/contact")}
                                className="glass rounded-[2.5rem] p-8 border-white/5 hover:border-emerald/20 transition-all text-left flex flex-col gap-4 group"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                    <Key size={28} className="text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-white">API Access</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Generate API keys for integration</p>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Recent Activity */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/30">Recent Activity</h2>
                            <button
                                onClick={() => navigate("/upload?tab=history")}
                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors flex items-center gap-1"
                            >
                                View All <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.02]">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Image</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Date</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {history.slice(0, 5).map((item) => (
                                            <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-xl border border-white/5 overflow-hidden bg-[#050505] p-1">
                                                            <img src={item.result} alt="Product" className="h-full w-full object-contain" />
                                                        </div>
                                                        <span className="text-xs font-bold text-white/70">snapshot_{item.id.slice(-4)}.png</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20 w-fit">
                                                        <div className="w-1 h-1 rounded-full bg-green-400" />
                                                        Completed
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button className="h-9 w-9 rounded-xl bg-white/5 hover:bg-primary/20 text-white/40 hover:text-primary transition-all flex items-center justify-center ml-auto">
                                                        <Download size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {history.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                                        <ImageIcon size={48} />
                                                        <p className="text-sm font-bold uppercase tracking-widest">No recent images</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
