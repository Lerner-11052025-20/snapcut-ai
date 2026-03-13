import React from "react";
import { motion } from "framer-motion";
import { Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultViewProps {
    result: string;
    preview: string | null;
    onDownload: (url: string, filename: string) => void;
    onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = React.memo(({
    result,
    preview,
    onDownload,
    onReset
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-6xl mx-auto"
        >
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">

                {/* ── Left Side: Duo Comparison Display ── */}
                <div className="lg:col-span-8 flex flex-col gap-4">

                    {/* Header Row */}
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-[#9ca3af]">Processing Result</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownload(result, 'snapcut-cutout.png')}
                            className="text-[#60a5fa] hover:text-[#93c5fd] hover:bg-blue-500/10 font-bold tracking-wide h-8 px-3 rounded-lg flex items-center gap-2"
                        >
                            <Download size={14} strokeWidth={2.5} />
                            Quick Export
                        </Button>
                    </div>

                    {/* Main Comparison Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        {/* Original Source Card */}
                        <div className="relative rounded-[2rem] border border-white/[0.04] bg-[#09090b]/40 backdrop-blur-3xl shadow-xl aspect-[4/3] flex items-center justify-center p-6 overflow-hidden group transition-all duration-500 hover:border-white/[0.08]">
                            <div className="absolute top-4 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-lg">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.15em] leading-none">Original</span>
                            </div>

                            <motion.img
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                src={preview || ""}
                                alt="Original Source"
                                className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-2xl rounded-xl"
                            />
                        </div>

                        {/* AI Cutout Card */}
                        <div className="relative rounded-[2rem] border border-blue-500/20 bg-[#09090b]/80 backdrop-blur-3xl shadow-[0_20px_40px_rgba(59,130,246,0.1)] aspect-[4/3] flex items-center justify-center p-6 overflow-hidden group transition-all duration-500 hover:border-blue-500/40">
                            {/* Checkerboard Tech Background */}
                            <div
                                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                                style={{
                                    backgroundImage: `linear-gradient(45deg, #18181b 25%, transparent 25%), linear-gradient(-45deg, #18181b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #18181b 75%), linear-gradient(-45deg, transparent 75%, #18181b 75%)`,
                                    backgroundSize: '32px 32px',
                                    backgroundPosition: '0 0, 0 16px, 16px -16px, -16px 0px'
                                }}
                            />

                            <div className="absolute top-4 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 shadow-lg ring-1 ring-blue-400/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.15em] leading-none">Result</span>
                            </div>

                            <motion.img
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                src={result}
                                crossOrigin="anonymous"
                                alt="Background Removed Result"
                                className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Right Side: Action Console ── */}
                <div className="lg:col-span-4 flex flex-col gap-4 lg:gap-5 mt-4 lg:mt-0">

                    {/* Main Control Panel */}
                    <div className="glass rounded-[2rem] p-6 lg:p-7 bg-[#111116]/80 flex flex-col gap-8 shadow-2xl shadow-black/40 border-white/[0.06]">

                        {/* Action Section */}
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#71717a] ml-1">Action</h3>
                            <Button
                                className="w-full h-14 rounded-[14px] bg-gradient-to-r from-[#60a5fa] via-[#7c3aed] to-[#c084fc] hover:opacity-90 transition-all font-black text-white tracking-wide shadow-[0_0_30px_rgba(124,58,237,0.3)] shadow-glow-accent border-none flex items-center justify-center gap-2.5"
                                onClick={() => onDownload(result, 'snapcut-hd.png')}
                            >
                                <Download size={18} strokeWidth={2.5} />
                                Download HD
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-12 rounded-[14px] border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-white font-bold tracking-wide transition-colors"
                                onClick={onReset}
                            >
                                New Project
                            </Button>
                        </div>

                        <div className="h-px bg-white/[0.06] w-full" />

                        {/* Details Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#71717a]">Details</h3>
                                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#052e16] border border-[#166534] shadow-inner drop-shadow-sm">
                                    <div className="w-[5px] h-[5px] rounded-full bg-[#4ade80] animate-pulse drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
                                    <span className="text-[9px] font-black text-[#4ade80] uppercase tracking-widest leading-none">Done</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Processing Time</span>
                                    <span className="text-[11px] font-black text-white tracking-widest bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.05]">0.8s</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Actions Panel */}
                    <div className="glass rounded-[1.5rem] p-5 lg:p-6 bg-[#111116]/80 flex items-center justify-between border-white/[0.06] shadow-xl group cursor-pointer hover:bg-[#18181f]/80 transition-colors">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[#71717a] uppercase tracking-widest group-hover:text-[#a1a1aa] transition-colors">Share Project</p>
                            <p className="text-[13px] text-white/50 font-medium group-hover:text-white/70 transition-colors">Generate temporary link</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/[0.05]">
                            <ArrowLeft className="rotate-180 text-white/50 group-hover:text-white" size={16} strokeWidth={2} />
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
});
