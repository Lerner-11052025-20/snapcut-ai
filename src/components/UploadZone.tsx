import { useRef, useEffect, useCallback } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

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
                toast.error("File too large. Max 10MB.");
                return;
            }
            if (!file.type.startsWith("image/")) {
                toast.error("Please upload an image file.");
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
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={clickable ? () => inputRef.current?.click() : undefined}
            className={`
        relative rounded-3xl border-2 border-dashed transition-all duration-500 select-none overflow-hidden
        ${clickable && !disabled ? "cursor-pointer hover:border-primary/40 glass-hover group hover:scale-[1.005] shadow-glow/10" : "glass"}
        ${disabled ? "opacity-50 pointer-events-none" : "border-white/5 bg-white/[0.02]"}
      `}
            style={{ padding: "64px 32px" }}
        >
            <div className="flex flex-col items-center gap-6 text-center">
                {/* Circular icon container */}
                <div className="relative group/icon">
                    <div className="absolute h-16 w-16 rounded-full bg-primary/20 blur-xl group-hover/icon:bg-primary/30 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                    <div className="relative h-16 w-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all duration-500 shadow-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Upload size={24} className="text-primary group-hover:scale-110 transition-transform duration-500" strokeWidth={2} />
                    </div>
                </div>

                {/* Heading & Subtext */}
                <div className="space-y-2">
                    <p className="font-display font-bold text-2xl text-white tracking-tight">
                        {clickable ? "Click or drag to remove background" : "Drop image here"}
                    </p>

                    <p className="text-muted-foreground text-sm font-medium">
                        {clickable ? (
                            <>
                                Or simply <span className="text-primary hover:underline underline-offset-4 transition-all decoration-primary/30">browse files</span>
                            </>
                        ) : (
                            "Support for JPG, PNG and WebP"
                        )}
                    </p>
                </div>

                {/* Metadata row */}
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                    <span>HD Quality</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>Max 10MB</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>Instant AI</span>
                </div>

                {/* Paste hint */}
                {clickable && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Press</span>
                        <kbd className="font-mono text-[10px] bg-white/10 border border-white/10 rounded px-1.5 py-0.5 text-white/90 shadow-sm">
                            Ctrl+V
                        </kbd>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">to paste</span>
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
        </div>
    );
};

export default UploadZone;
