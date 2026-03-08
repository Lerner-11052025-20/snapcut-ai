import { useState, useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  getAllHistory,
  addHistoryItem,
  migrateFromLocalStorage,
  deleteHistoryItem,
  clearHistory,
} from "@/lib/historyDB";

// Components
import UploadZone from "@/components/UploadZone";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { ProcessingView } from "@/components/workspace/ProcessingView";
import { ResultView } from "@/components/workspace/ResultView";
import { HistoryView } from "@/components/workspace/HistoryView";

// Hooks
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { useRazorpayPayment } from "@/hooks/useRazorpayPayment";

type AppState = "idle" | "uploading" | "processing" | "done" | "history";

interface HistoryItem {
  id: string;
  original: string;
  result: string;
  timestamp: string;
}

const PROCESSING_MESSAGES = [
  "Analyzing pixels...",
  "Detecting edges...",
  "Removing background...",
  "Refining details...",
  "Almost there...",
  "Perfecting result..."
];

const UploadWorkspace = () => {
  const [state, setState] = useState<AppState>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [statusMessage, setStatusMessage] = useState("Analyzing pixels...");

  const location = useLocation();
  const { subscription } = useUserSubscription();
  const { initiatePayment } = useRazorpayPayment();

  const isPro = useMemo(() => subscription.tier === 'pro', [subscription.tier]);

  // 1. Memoized Helpers
  const blobToDataURL = useCallback((blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }, []);

  const downloadImage = useCallback(async (url: string, filename: string) => {
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
      toast.error("Failed to download image.");
    }
  }, []);

  const saveToHistory = useCallback(async (original: string, result: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      // Don't store original — it doubles space usage and isn't shown in history
      original: "",
      result,
      timestamp: new Date().toLocaleString(),
    };

    // Optimistically update UI state immediately
    setHistory(prev => [newItem, ...prev]);

    // Persistently save to IndexedDB (no size limit issues)
    try {
      await addHistoryItem(newItem);
    } catch (err) {
      console.error("[History] Failed to persist to IndexedDB:", err);
    }
  }, []);

  // 2. Core Logic Logic
  const handleFile = useCallback(async (file: File) => {
    try {
      setState("uploading");
      const base64 = await fileToBase64(file);
      setPreview(base64);
      setState("processing");

      const formData = new FormData();
      formData.append("image", file);
      formData.append("file", file);

      const response = await fetch("/webhook/remove-background", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      const contentType = response.headers.get("content-type") || "";
      let resultUrl = "";

      if (contentType.includes("application/json")) {
        const data = await response.json();
        resultUrl = data.url || data.secure_url || "";
      } else {
        const blob = await response.blob();
        resultUrl = await blobToDataURL(blob);
      }

      if (!resultUrl) throw new Error("No image data received");

      setResult(resultUrl);
      saveToHistory(base64, resultUrl);
      setState("done");
      toast.success("Background removed successfully!");

    } catch (err) {
      console.error("Pipeline failure:", err);
      toast.error("Failed to remove background.");
      setState("idle");
    }
  }, [fileToBase64, blobToDataURL, saveToHistory]);

  // 3. Effects
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("tab") === "history") setState("history");
  }, [location.search]);

  // Load history from IndexedDB on mount (with one-time localStorage migration)
  useEffect(() => {
    const loadHistory = async () => {
      // Migrate any old localStorage data to IndexedDB first
      await migrateFromLocalStorage();
      // Load all history from IndexedDB
      const items = await getAllHistory();
      // Filter out any stale blob: URLs that are no longer valid
      const cleaned = items.filter(
        item => item.result && !item.result.startsWith("blob:")
      );
      setHistory(cleaned);
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (state !== "processing") return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % PROCESSING_MESSAGES.length;
      setStatusMessage(PROCESSING_MESSAGES[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [state]);

  // Handle incoming files from landing page
  useEffect(() => {
    const processIncoming = async () => {
      if (location.state?.file) {
        const f = location.state.file;
        window.history.replaceState({}, document.title);
        handleFile(f);
        return;
      }

      const pending = sessionStorage.getItem("pendingImage");
      if (pending) {
        const type = sessionStorage.getItem("pendingFileType") || "image/png";
        const name = sessionStorage.getItem("pendingFileName") || "image.png";
        sessionStorage.clear(); // only clear relevant items in production, but here safe
        try {
          const res = await fetch(pending);
          const blob = await res.blob();
          handleFile(new File([blob], name, { type }));
        } catch (e) { console.error(e); }
      }
    };
    processIncoming();
  }, [location.state, handleFile]);

  const reset = useCallback(() => {
    setState("idle");
    setPreview(null);
    setResult(null);
  }, []);

  const restoreHistory = useCallback((item: HistoryItem) => {
    setResult(item.result);
    setPreview(item.original || null);
    setState("done");
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    await deleteHistoryItem(id);
    toast.success("Item removed from archive.");
  }, []);

  const clearAll = useCallback(async () => {
    setHistory([]);
    await clearHistory();
    toast.success("Archive cleared successfully.");
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 antialiased relative overflow-hidden flex flex-col items-center">
      {/* SAAS Background Grids & Orbs - Performance Optimized */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-grid opacity-40 mix-blend-screen" />
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] will-change-transform" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] will-change-transform" />
      </div>

      <div className="w-full relative z-20">
        <WorkspaceHeader
          isPro={isPro}
          activeState={state}
          onToggleHistory={() => setState(s => s === "history" ? "idle" : "history")}
          onUpgrade={() => initiatePayment(49900, 'SnapCut AI - Pro Membership')}
        />
      </div>

      <main className="container relative z-10 mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center -mt-8">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl text-center flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8 glass shadow-glow-accent relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer opacity-20 pointer-events-none" />
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[10px] font-black tracking-[0.2em] text-white/80 uppercase relative z-10">Version 3.0 Intelligence Hub</span>
              </motion.div>

              <h1 className="font-display text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 drop-shadow-sm">
                Surgical Image <br className="hidden sm:block" /> Workspace
              </h1>

              <p className="text-white/50 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                Drop an image below to initialize the high-performance subject removal engine.
              </p>

              <div className="w-full max-w-3xl glass glass-hover rounded-[3rem] p-2 relative group shadow-[0_0_50px_rgba(14,165,255,0.05)] transition-shadow duration-500">
                <div className="absolute inset-0 bg-gradient-primary opacity-5 blur-[80px] group-hover:opacity-10 transition-opacity duration-500 rounded-full pointer-events-none" />
                <UploadZone onFile={handleFile} />
              </div>
            </motion.div>
          )}

          {(state === "uploading" || state === "processing") && (
            <ProcessingView key="processing" preview={preview} statusMessage={statusMessage} />
          )}

          {state === "done" && result && (
            <ResultView key="done" result={result} preview={preview} onDownload={downloadImage} onReset={reset} />
          )}

          {state === "history" && (
            <HistoryView
              key="history"
              history={history}
              onDownload={downloadImage}
              onRestore={restoreHistory}
              onReturn={() => setState("idle")}
              onDelete={deleteItem}
              onClearAll={clearAll}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default UploadWorkspace;
