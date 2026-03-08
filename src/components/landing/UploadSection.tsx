import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import UploadZone from "@/components/UploadZone";

const UploadSection = () => {
    const navigate = useNavigate();

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                sessionStorage.setItem("pendingImage", e.target?.result as string);
                sessionStorage.setItem("pendingFileName", file.name);
                sessionStorage.setItem("pendingFileType", file.type);
            } catch {
                // Handle gracefully
            }
            toast.success("Intelligence Hub warming up...");
            navigate("/upload");
        };
        reader.readAsDataURL(file);
    };

    return (
        <section className="relative py-24 bg-[#050505] overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
            </div>

            <div className="container relative z-10 mx-auto px-4">

                {/* Upload Zone Wrapper */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-5xl mx-auto relative px-4 mt-8"
                >
                    {/* Small Blurry Floating Messages */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-2 md:-left-4 top-8 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl text-[10px] font-bold text-white/90 uppercase tracking-widest hidden md:block z-20"
                    >
                        Processing Subject...
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-2 md:-right-4 top-1/2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/20 backdrop-blur-xl shadow-2xl text-[10px] font-bold text-blue-200 uppercase tracking-widest hidden md:block z-20"
                    >
                        Edge Detection Active
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4.5, delay: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-10 md:left-24 bottom-6 md:bottom-3 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/20 backdrop-blur-xl shadow-2xl text-[10px] font-bold text-purple-200 uppercase tracking-widest hidden md:block z-20"
                    >
                        AI Masking...
                    </motion.div>

                    {/* Outer glow container */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 rounded-[2.5rem] blur-2xl -z-10 opacity-70" />

                    {/* Glass Pane for Upload */}
                    <div className="relative rounded-[2.5rem] border border-white/10 bg-black/40 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
                        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                        <UploadZone onFile={handleFile} />
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                        <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                            V3.0 Architecture
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                            Lightning Fast
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                            Secure Hub
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default UploadSection;
