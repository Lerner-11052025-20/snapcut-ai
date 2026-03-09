import { useRef, useEffect, useCallback } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/lib/toast-messages";
import { motion } from "framer-motion";

interface UploadZoneProps {
    onFile: (file: File) => void;
    disabled?: boolean;
    /** If true the zone accepts drops only (no click) — used on the landing page preview */
    clickable?: boolean;
}

const UploadZone = ({ onFile, disabled = false, clickable = true }: UploadZoneProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback(
        (file: File) => {
            if (disabled) return;
            if (file.size > 10 * 1024 * 1024) {
                toast.error(TOAST_MESSAGES.PROCESSING.FILE_TOO_LARGE);
                return;
            }
            if (!file.type.startsWith("image/")) {
                toast.error(TOAST_MESSAGES.PROCESSING.INVALID_FILE_TYPE);
                return;
            }
            onFile(file);
        },
        [onFile, disabled]
    );

    // Ctrl+V / Cmd+V paste — global listener
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (disabled) return;
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of Array.from(items)) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) { processFile(file); break; }
                }
            }
        };
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [disabled, processFile]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (disabled) return;
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={clickable ? () => inputRef.current?.click() : undefined}
            className={`
                relative w-full rounded-[2.5rem] border-[1.5px] border-dashed transition-all duration-500 select-none overflow-hidden group
                ${clickable && !disabled
                    ? "cursor-pointer border-blue-500/40 hover:border-blue-500/70 bg-[#050508] hover:bg-[#0a0a0f] shadow-[0_0_50px_rgba(59,130,246,0.03)] hover:shadow-[0_0_80px_rgba(59,130,246,0.08)]"
                    : "border-white/10 bg-[#050505]"}
                ${disabled ? "opacity-50 pointer-events-none" : ""}
            `}
            style={{ padding: "72px 32px" }}
        >
            <div className="flex flex-col items-center justify-center gap-6 text-center">

                {/* Glowing Outer Ring + Icon */}
                <div className="relative mb-2">
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl group-hover:bg-blue-500/40 transition-all duration-500" />
                    <div className="relative h-[68px] w-[68px] rounded-full flex items-center justify-center border border-blue-500/30 bg-black/40 group-hover:border-blue-400 group-hover:bg-blue-500/10 transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                        <Upload size={28} className="text-blue-400 group-hover:text-blue-300 group-hover:-translate-y-1 transition-all duration-500" strokeWidth={2} />
                    </div>
                </div>

                {/* Main Text */}
                <div className="space-y-3">
                    <h3 className="font-display font-black text-[28px] sm:text-[32px] text-white tracking-tight leading-none">
                        {clickable ? "Click or drag to remove background" : "Drop image here"}
                    </h3>

                    <p className="text-[#a1a1aa] text-[15px] font-medium mt-2">
                        {clickable ? (
                            <>
                                Or simply <span className="text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">browse files</span>
                            </>
                        ) : (
                            "Support for JPG, PNG and WebP"
                        )}
                    </p>
                </div>

                {/* Metadata Pill */}
                <div className="mt-4 flex items-center justify-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] text-[11px] font-bold uppercase tracking-[0.2em] text-[#71717a]">
                    <span>HD Quality</span>
                    <span className="h-1 w-1 rounded-full bg-[#3f3f46]" />
                    <span>Max 10MB</span>
                    <span className="h-1 w-1 rounded-full bg-[#3f3f46]" />
                    <span>Instant AI</span>
                </div>

                {/* Keyboard Shortcut */}
                {clickable && (
                    <div className="flex items-center gap-2 mt-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-[10px] text-[#71717a] uppercase tracking-widest font-bold">Press</span>
                        <kbd className="font-mono text-[11px] font-semibold bg-white/[0.08] border border-white/[0.1] rounded-[4px] px-1.5 py-[1px] text-[#d4d4d8] shadow-sm">
                            Ctrl+V
                        </kbd>
                        <span className="text-[10px] text-[#71717a] uppercase tracking-widest font-bold">to paste</span>
                    </div>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processFile(file);
                    e.target.value = "";
                }}
            />
        </motion.div>
    );
};

export default UploadZone;
