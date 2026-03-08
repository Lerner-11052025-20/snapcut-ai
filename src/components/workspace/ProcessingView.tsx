import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ProcessingViewProps {
    preview: string | null;
    statusMessage: string;
}

export const ProcessingView: React.FC<ProcessingViewProps> = React.memo(({
    preview,
    statusMessage
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-2xl mx-auto"
        >
            <div className="glass rounded-[2rem] p-8 sm:p-12 text-center border-white/[0.04] bg-[#09090b]/80 backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-white/[0.02] overflow-hidden">
                    <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent"
                    />
                </div>

                <div className="relative mb-12 mt-4">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-gradient-to-tr from-[#60a5fa]/20 to-[#c084fc]/20 blur-[60px] rounded-full pointer-events-none" />
                    {preview && (
                        <div className="relative inline-block">
                            <img
                                src={preview}
                                alt="Preview"
                                className="relative z-10 max-h-72 object-contain aspect-auto rounded-2xl shadow-2xl border border-white/[0.05] opacity-25 grayscale saturate-0"
                            />
                            {/* Scanning effect overlay */}
                            <motion.div
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute left-0 right-0 h-1 bg-[#a855f7] shadow-[0_0_20px_#a855f7] z-20 mix-blend-screen"
                            />
                        </div>
                    )}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
                        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
                            <Loader2 size={36} className="text-[#a855f7] animate-spin" strokeWidth={2} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 relative z-20">
                    <h2 className="font-display text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight">
                        {statusMessage}
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fde047] animate-pulse drop-shadow-[0_0_5px_rgba(253,224,71,0.8)]" />
                        <p className="text-[#a1a1aa] font-black uppercase tracking-[0.2em] text-[10px]">
                            V3.0 Intelligence Engine Active
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});
