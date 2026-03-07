import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import UploadZone from "@/components/UploadZone";
import Logo from "@/components/Logo";

type AppState = "idle" | "uploading" | "processing" | "done" | "history";

interface HistoryItem {
  id: string;
  original: string;
  result: string;
  timestamp: string;
}

const UploadWorkspace = () => {
  const [state, setState] = useState<AppState>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [statusMessage, setStatusMessage] = useState("Analyzing pixels...");
  const location = useLocation();

  // Listen for tab=history in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("tab") === "history") {
      setState("history");
    }
  }, [location.search]);

  // Load history from localStorage on mount & Cleanup broken blobs
  useEffect(() => {
    const saved = localStorage.getItem("snapcut_history");
    if (saved) {
      try {
        let items: HistoryItem[] = JSON.parse(saved);
        // Migration: Remove any items using ephemeral blob URLs from older sessions
        const cleaned = items.filter(item =>
          !item.original.startsWith('blob:') &&
          !item.result.startsWith('blob:')
        );
        if (cleaned.length !== items.length) {
          localStorage.setItem("snapcut_history", JSON.stringify(cleaned));
        }
        setHistory(cleaned);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Listen for file passed from landing page
  useEffect(() => {
    if (location.state?.file) {
      handleFile(location.state.file);
      // Clear state so it doesn't re-trigger on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const saveToHistory = (original: string, result: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      original,
      result,
      timestamp: new Date().toLocaleString(),
    };

    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, 50); // Increased to 50 items
      localStorage.setItem("snapcut_history", JSON.stringify(updated));
      return updated;
    });
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download failed", e);
      toast.error("Failed to download image. Try right-clicking and saving.");
    }
  };

  const processingMessages = [
    "Analyzing pixels...",
    "Detecting edges...",
    "Removing background...",
    "Refining details...",
    "Almost there...",
    "Perfecting result..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === "processing") {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % processingMessages.length;
        setStatusMessage(processingMessages[i]);
      }, 2000);
    } else if (state === "uploading") {
      setStatusMessage("Uploading...");
    }
    return () => clearInterval(interval);
  }, [state]);

  const handleFile = useCallback(async (file: File) => {
    try {
      // Show preview and start upload
      setState("uploading");
      const base64 = await fileToBase64(file);
      setPreview(base64);

      setState("processing");

      const formData = new FormData();
      formData.append("image", file);
      formData.append("file", file);

      // We hit the production endpoint directly as it seems to be configured (from user image 1)
      const response = await fetch("/webhook/remove-background", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";
      let resultUrl = "";

      if (contentType.includes("application/json")) {
        const data = await response.json();
        resultUrl = data.url || data.secure_url || "";
      } else {
        // Assume binary blob if it's not JSON - Convert to persistent data URL
        const blob = await response.blob();
        resultUrl = await blobToDataURL(blob);
      }

      if (!resultUrl) {
        throw new Error("No URL or image binary received from the webhook");
      }

      setResult(resultUrl);
      saveToHistory(base64, resultUrl);
      setState("done");
      toast.success("Background removed successfully!");

    } catch (err) {
      console.error("Background removal error:", err);
      toast.error("Failed to remove background. Please try again.");
      setState("idle");
    }
  }, []);

  // Unified effect to handle image passing from Landing Page
  useEffect(() => {
    const processPending = async () => {
      // Priority 1: location state (Router navigation)
      if (location.state?.file) {
        const file = location.state.file;
        window.history.replaceState({}, document.title);
        handleFile(file);
        return;
      }

      // Priority 2: Session Storage fallback
      const pending = sessionStorage.getItem("pendingImage");
      const pendingType = sessionStorage.getItem("pendingFileType") || "image/png";
      const pendingName = sessionStorage.getItem("pendingFileName") || "image.png";

      if (pending) {
        sessionStorage.removeItem("pendingImage");
        sessionStorage.removeItem("pendingFileName");
        sessionStorage.removeItem("pendingFileType");

        try {
          const res = await fetch(pending);
          const blob = await res.blob();
          const file = new File([blob], pendingName, { type: pendingType });
          handleFile(file);
        } catch (e) {
          console.error("Pending image restore failed", e);
        }
      }
    };

    processPending();
  }, [location.state, handleFile]);

  const reset = () => {
    setState("idle");
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30">
      {/* Background Orbs for Workspace */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      {/* Workspace Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 h-16">
        <div className="container mx-auto h-full flex items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo size={32} />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 mr-6 border-r border-white/10 pr-6">
              <button
                onClick={() => setState(state === "history" ? "idle" : "history")}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${state === 'history' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
              >
                History
              </button>
            </nav>
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Credits: 5 Remaining
              </span>
              <Button variant="glow" size="sm" className="rounded-full px-5">
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container relative z-10 mx-auto px-4 py-12 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* ─── IDLE: Upload zone ─────────────────────────────────── */}
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-3xl"
            >
              <div className="text-center mb-10">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-4xl sm:text-5xl font-black mb-4 tracking-tight"
                >
                  Workspace
                </motion.h1>
                <p className="text-muted-foreground/80 font-medium">
                  Upload an image to start the AI background removal process.
                </p>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <UploadZone onFile={handleFile} />
              </div>

              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                {/* Decorative placeholder icons for SaaS feel */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-12 rounded-xl bg-white/5 border border-white/5 shimmer" />
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── PROCESSING ────────────────────────────────────────── */}
          {(state === "uploading" || state === "processing") && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="glass rounded-[2rem] p-8 sm:p-12 text-center border-white/10 shadow-glow/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                  />
                </div>

                <div className="relative mb-10">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="relative z-10 max-h-72 mx-auto rounded-2xl shadow-2xl border border-white/10 opacity-40 grayscale"
                    />
                  )}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <Loader2 size={64} className="text-primary animate-spin" strokeWidth={1.5} />
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="font-display text-3xl font-bold text-white tracking-tight">
                    {statusMessage}
                  </h2>
                  <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">
                    Elite AI Processing Pipeline Active
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── DONE: Result ──────────────────────────────────────── */}
          {state === "done" && result && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-5xl"
            >
              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
                {/* Result Display */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold font-display uppercase tracking-widest text-white/50">Output Artifact</h2>
                    <Button variant="ghost" size="sm" onClick={() => downloadImage(result, 'cutout.png')} className="text-primary">
                      <Download className="mr-2" size={14} />
                      Export
                    </Button>
                  </div>
                  <div className="relative rounded-[2rem] border border-white/5 bg-[#0a0a0b] shadow-2xl shadow-blue-500/5 aspect-video flex items-center justify-center p-8 overflow-hidden group">
                    {/* Background Grid */}
                    <div
                      className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                      style={{
                        backgroundImage: `linear-gradient(45deg, #121214 25%, transparent 25%), linear-gradient(-45deg, #121214 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #121214 75%), linear-gradient(-45deg, transparent 75%, #121214 75%)`,
                        backgroundSize: '32px 32px',
                        backgroundPosition: '0 0, 0 16px, 16px -16px, -16px 0px'
                      }}
                    />
                    <motion.img
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={result}
                      alt="Result"
                      className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="glass rounded-3xl p-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">Action</h3>
                      <Button
                        size="xl"
                        className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-glow-accent transition-all font-black text-white"
                        onClick={() => downloadImage(result, 'snapcut-result.png')}
                      >
                        <Download className="mr-3" size={24} />
                        Download HD
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold"
                        onClick={reset}
                      >
                        New Project
                      </Button>
                    </div>

                    <div className="pt-6 border-t border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">Details</h3>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                          <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                          Done
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="p-1 rounded-[1.2rem] bg-white/5 border border-white/5">
                          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-[#050505]">
                            <img src={preview!} alt="Source" className="w-full h-full object-contain p-2 transition-transform hover:scale-105 duration-500" />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 z-20">
                              <span className="text-[9px] font-black text-white uppercase tracking-widest">Source Image</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center px-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Processing Time</span>
                          <span className="text-[10px] font-black text-white px-2 py-0.5 rounded bg-white/5 tracking-tighter">0.8s</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-3xl p-6 flex items-center justify-between border-blue-500/20">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Share Project</p>
                      <p className="text-xs text-white/60">Generate temporary link</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                      onClick={reset}
                    >
                      <ArrowLeft className="rotate-180" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── HISTORY ───────────────────────────────────────────── */}
          {state === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-6xl mx-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="text-5xl font-black font-display text-white tracking-tighter">Your Archives</h1>
                  <p className="text-muted-foreground font-medium mt-2">Manage your previously generated cutouts.</p>
                </div>
                <Button variant="outline" className="rounded-2xl px-8 border-white/10 bg-white/5" onClick={() => setState("idle")}>
                  <ArrowLeft size={16} className="mr-2" />
                  Return
                </Button>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-32 glass rounded-[3rem] border-dashed border-white/5">
                  <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <Logo size={40} className="grayscale opacity-20" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No history found</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto mb-8">Start by processing your first image to build your collection.</p>
                  <Button variant="hero" onClick={() => setState("idle")}>
                    Back to Workspace
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {history.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group glass rounded-[2rem] border border-white/5 overflow-hidden hover:border-primary/30 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="relative aspect-square bg-[#0a0a0b] p-4 flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `linear-gradient(45deg, #121214 25%, transparent 25%), linear-gradient(-45deg, #121214 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #121214 75%), linear-gradient(-45deg, transparent 75%, #121214 75%)`,
                            backgroundSize: '12px 12px'
                          }}
                        />
                        <img src={item.result} alt="History" className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-2xl" />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500 flex items-center justify-center gap-4 z-20">
                          <Button
                            size="icon"
                            variant="hero"
                            className="h-12 w-12 rounded-full shadow-glow opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 hover:scale-110 transition-all duration-300"
                            onClick={(e) => { e.stopPropagation(); downloadImage(item.result, `snapcut-${item.id}.png`); }}
                          >
                            <Download size={24} />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-12 w-12 rounded-full bg-white/10 border-white/10 shadow-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 hover:scale-110 transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              setResult(item.result);
                              setPreview(item.original);
                              setState("done");
                            }}
                          >
                            <ArrowLeft className="rotate-180" size={24} />
                          </Button>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.timestamp}</p>
                        <p className="text-xs text-white/40 truncate">Snapshot ID: {item.id}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div >
  );
};

export default UploadWorkspace;
