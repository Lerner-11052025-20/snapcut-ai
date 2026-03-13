import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ArrowLeft, Trash2, Trash, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export interface HistoryItem {
    id: string;
    original: string;
    result: string;
    timestamp: string;
    custom_name?: string;
    processing_time_ms?: number;
    download_count?: number;
}

interface HistoryViewProps {
    history: HistoryItem[];
    onDownload: (url: string, filename: string, id: string) => void;
    onRestore: (item: HistoryItem) => void;
    onReturn: () => void;
    onDelete?: (id: string) => void;
    onClearAll?: () => void;
    onRename?: (id: string, name: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = React.memo(({
    history,
    onDownload,
    onRestore,
    onReturn,
    onDelete,
    onClearAll,
    onRename,
}) => {
    const [confirmClear, setConfirmClear] = React.useState(false);
    const [deletingId, setDeletingId] = React.useState<string | null>(null);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [editName, setEditName] = React.useState("");
    const navigate = useNavigate();

    const handleDelete = (id: string) => {
        setDeletingId(id);
        setTimeout(() => {
            onDelete?.(id);
            setDeletingId(null);
        }, 300);
    };

    const handleClearAll = () => {
        if (!confirmClear) {
            setConfirmClear(true);
            setTimeout(() => setConfirmClear(false), 3000);
            return;
        }
        onClearAll?.();
        setConfirmClear(false);
    };

    const startEditing = (item: HistoryItem) => {
        setEditingId(item.id);
        setEditName(item.custom_name || item.id);
    };

    const saveRename = () => {
        if (editingId && editName.trim()) {
            onRename?.(editingId, editName.trim());
            setEditingId(null);
        }
    };

    const avgTime = React.useMemo(() => {
        const times = history.map(h => h.processing_time_ms).filter(Boolean) as number[];
        if (times.length === 0) return 0;
        return times.reduce((a, b) => a + b, 0) / times.length;
    }, [history]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="w-full max-w-6xl mx-auto z-10 relative"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
                            <span className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase leading-none mt-[1px]">Archive Database</span>
                        </div>
                        {avgTime > 0 && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
                                <span className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase leading-none mt-[1px]">Avg Sync: {(avgTime / 1000).toFixed(2)}s</span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tighter drop-shadow-sm">Your Archives</h1>
                    <p className="text-[#a1a1aa] font-medium mt-2 text-sm sm:text-base">
                        {history.length > 0 ? (
                            <span>{history.length} image{history.length !== 1 ? "s" : ""} stored · Manage and download your previously generated cutouts.</span>
                        ) : (
                            "Manage and download your previously generated cutouts."
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Clear All Button */}
                    {history.length > 0 && onClearAll && (
                        <Button
                            variant="outline"
                            className={`rounded-[1rem] h-12 px-5 border-red-500/20 font-bold transition-all ${confirmClear
                                ? "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30"
                                : "bg-white/[0.02] hover:bg-red-500/10 text-[#a1a1aa] hover:text-red-400 hover:border-red-500/20"
                                }`}
                            onClick={handleClearAll}
                        >
                            <Trash size={15} className="mr-2" />
                            {confirmClear ? "Confirm Clear?" : "Clear All"}
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="rounded-[1rem] h-12 px-5 border-[#a855f7]/20 bg-[#a855f7]/5 hover:bg-[#a855f7]/15 font-bold text-[#c084fc] transition-all group shadow-[0_0_20px_rgba(168,85,247,0.05)]"
                        onClick={() => navigate("/dashboard")}
                    >
                        <LayoutDashboard size={16} className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                        Dashboard
                    </Button>
                    <Button
                        variant="outline"
                        className="rounded-[1rem] h-12 px-6 border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] font-bold text-white transition-colors"
                        onClick={onReturn}
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Return
                    </Button>
                </div>
            </div>

            {/* Empty State */}
            {history.length === 0 ? (
                <div className="text-center py-32 glass bg-[#0a0a0d]/80 rounded-[3rem] border border-dashed border-white/[0.08] relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#60a5fa]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="h-24 w-24 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Logo size={48} className="grayscale opacity-30" showText={false} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">No history found</h3>
                    <p className="text-[#a1a1aa] font-medium max-w-sm mx-auto mb-8 text-sm">Start by processing your first image to build your collection.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            size="xl"
                            className="rounded-2xl px-10 bg-gradient-to-r from-[#60a5fa] via-[#7c3aed] to-[#c084fc] font-black tracking-wide text-white border-none shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:opacity-90 transition-all"
                            onClick={onReturn}
                        >
                            Initialize Workspace
                        </Button>
                        <Button
                            variant="outline"
                            size="xl"
                            className="rounded-2xl px-10 border-[#a855f7]/20 bg-[#a855f7]/5 hover:bg-[#a855f7]/15 font-black tracking-wide text-[#c084fc] transition-all group"
                            onClick={() => navigate("/dashboard")}
                        >
                            <LayoutDashboard size={20} className="mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {history.map((item, i) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: deletingId === item.id ? 0 : 1, scale: deletingId === item.id ? 0.9 : 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                                transition={{ delay: deletingId ? 0 : i * 0.04, type: "spring", stiffness: 200, damping: 20 }}
                                className="group glass bg-[#09090b]/80 rounded-[2rem] border border-white/[0.04] overflow-hidden hover:border-[#60a5fa]/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500"
                                style={{ willChange: "transform, opacity" }}
                            >
                                {/* Image Area */}
                                <div className="relative aspect-square p-2 bg-transparent">
                                    <div className="absolute inset-0 m-2 rounded-[1.5rem] bg-[#020202] border border-white/[0.02] overflow-hidden">
                                        {/* Checkerboard background */}
                                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                                            style={{
                                                backgroundImage: `linear-gradient(45deg, #18181b 25%, transparent 25%), linear-gradient(-45deg, #18181b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #18181b 75%), linear-gradient(-45deg, transparent 75%, #18181b 75%)`,
                                                backgroundSize: '16px 16px',
                                                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center p-4">
                                            <img
                                                src={item.result}
                                                crossOrigin="anonymous"
                                                alt={item.custom_name || `History item ${i + 1}`}
                                                className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-700 group-hover:scale-[1.05]"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Hover Overlay with Actions */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3 z-20">
                                            {/* Download */}
                                            <button
                                                title="Download"
                                                className="h-11 w-11 rounded-full border-none bg-gradient-to-r from-[#60a5fa] to-[#c084fc] shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform duration-300"
                                                onClick={(e) => { e.stopPropagation(); onDownload(item.result, `${item.custom_name || 'snapcut'}.png`, item.id); }}
                                            >
                                                <Download size={18} strokeWidth={2.5} />
                                            </button>

                                            {/* Restore */}
                                            <button
                                                title="Restore"
                                                className="h-11 w-11 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300"
                                                onClick={(e) => { e.stopPropagation(); onRestore(item); }}
                                            >
                                                <ArrowLeft className="rotate-180" size={18} strokeWidth={2.5} />
                                            </button>

                                            {/* Delete */}
                                            {onDelete && (
                                                <button
                                                    title="Delete"
                                                    className="h-11 w-11 rounded-full bg-red-500/10 border border-red-500/30 backdrop-blur-md flex items-center justify-center text-red-400 hover:bg-red-500/30 hover:text-red-300 hover:scale-110 active:scale-95 transition-all duration-300"
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                                >
                                                    <Trash2 size={18} strokeWidth={2.5} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="p-5 pt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-[10px] font-black text-[#71717a] uppercase tracking-widest truncate pr-2">{item.timestamp}</p>
                                        <div className="flex items-center gap-2">
                                            {item.processing_time_ms && (
                                                <span className="text-[10px] font-bold text-blue-400/60">{(item.processing_time_ms / 1000).toFixed(1)}s</span>
                                            )}
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] flex-shrink-0" />
                                        </div>
                                    </div>

                                    {editingId === item.id ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <input
                                                autoFocus
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onBlur={saveRename}
                                                onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                                                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[11px] text-white outline-none w-full"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center justify-between group/name cursor-pointer mt-1"
                                            onClick={() => startEditing(item)}
                                        >
                                            <p className="text-[12px] font-bold text-white/80 group-hover/name:text-[#60a5fa] transition-colors truncate">
                                                {item.custom_name || `Snapshot ${item.id.slice(-4)}`}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-medium text-white/20">↓{item.download_count || 0}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
});
