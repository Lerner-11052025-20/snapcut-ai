import { useState, useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/lib/toast-messages";
import {
  getAllHistory,
  addHistoryItem,
  migrateFromLocalStorage,
  deleteHistoryItem,
  clearHistory,
} from "@/lib/historyDB";
import {
  getCloudHistory,
  addCloudHistoryItem,
  deleteCloudHistoryItem,
  renameCloudHistoryItem,
  incrementDownloadCount
} from "@/lib/cloudHistory";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Zap, Sparkles, X, ShieldAlert, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

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
  custom_name?: string;
  processing_time_ms?: number;
  download_count?: number;
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
  const [showCreditModal, setShowCreditModal] = useState(false);

  const location = useLocation();
  const { subscription } = useUserSubscription();
  const { initiatePayment } = useRazorpayPayment();
  const { user, profile, useCredits } = useAuth();
  const navigate = useNavigate();

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

  const downloadImage = useCallback(async (url: string, filename: string, id?: string) => {
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

      let targetId = id;
      if (!targetId) {
        const matched = history.find(h => h.result === url);
        if (matched) targetId = String(matched.id);
      }

      // Increment cloud download count
      if (user && targetId && String(targetId).length !== 13) {
        const newCount = await incrementDownloadCount(targetId);
        if (newCount !== null) {
          setHistory(prev => prev.map(item => item.id === targetId ? { ...item, download_count: newCount } : item));
        }
      }

      toast.success(TOAST_MESSAGES.DOWNLOAD.SUCCESS);
    } catch (e) {
      console.error("Download failed", e);
      toast.error(TOAST_MESSAGES.DOWNLOAD.FAILED);
    }
  }, [user, history]);

  const saveToHistory = useCallback(async (original: string, result: string, duration: number = 0) => {
    const localId = Date.now().toString();
    const newItem: HistoryItem = {
      id: localId,
      original: "",
      result,
      timestamp: new Date().toLocaleString(),
    };

    // Optimistically update UI
    setHistory(prev => [newItem, ...prev]);

    // 1. Local Persistence
    try {
      await addHistoryItem(newItem);
    } catch (err) {
      console.error("[History] Local save failed:", err);
    }

    // 2. Cloud Sync if authenticated
    if (user) {
      try {
        const cloudItem = await addCloudHistoryItem(result, "", duration);
        if (cloudItem) {
          setHistory(prev =>
            prev.map(item => item.id === localId ? {
              ...item,
              id: cloudItem.id,
              timestamp: new Date(cloudItem.timestamp).toLocaleString(),
              custom_name: cloudItem.custom_name,
              processing_time_ms: cloudItem.processing_time_ms,
              download_count: cloudItem.download_count
            } as any : item)
          );
        }
      } catch (err) {
        console.error("[History] Cloud sync failed:", err);
      }
    }
  }, [user]);

  const handleFile = useCallback(async (file: File) => {
    if (!user) {
      toast.error("Please sign in to remove backgrounds");
      navigate("/login");
      return;
    }

    if (profile && profile.credits_remaining <= 0 && !isPro) {
      setShowCreditModal(true);
      return;
    }

    try {
      const startTime = performance.now();
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

      // For display, we create a local blob to bypass browser tracking prevention/CORS
      let displayUrl = resultUrl;
      if (resultUrl.startsWith("http")) {
        try {
          // Convert remote Cloudinary URL to local Blob URL to bypass tracking prevention/CORS
          const proxyResponse = await fetch(resultUrl);
          if (proxyResponse.ok) {
            const proxyBlob = await proxyResponse.blob();
            displayUrl = URL.createObjectURL(proxyBlob);
          }
        } catch (e) {
          console.warn("Image proxy failed, using direct URL", e);
        }
      }

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      console.log("[Pipeline] Received result, updating credits and history...");

      // 🏦 Consume credit (Async/Non-blocking failsafe)
      useCredits(1).then(creditResult => {
        if (!creditResult.success) {
          console.warn("[Pipeline] Credit deduction failed but continuing:", creditResult.error);
        }
      }).catch(err => {
        console.error("[Pipeline] Credit runtime error:", err);
      });

      setResult(displayUrl);

      // ☁️ Save to history (Async/Non-blocking failsafe) - use the permanent URL, not the blob
      saveToHistory(base64, resultUrl, duration);

      setState("done");
      toast.success(TOAST_MESSAGES.PROCESSING.COMPLETE);

    } catch (err) {
      console.error("Pipeline failure:", err);
      toast.error(TOAST_MESSAGES.PROCESSING.FAILED);
      setState("idle");
    }
  }, [user, profile, isPro, fileToBase64, blobToDataURL, saveToHistory, useCredits, navigate]);

  // 3. Effects
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("tab") === "history") setState("history");
  }, [location.search]);

  // Load history from IndexedDB on mount (with one-time localStorage migration)
  useEffect(() => {
    const loadHistory = async () => {
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

      setHistory(Array.from(itemsByResult.values()).filter(i => i.result && !i.result.startsWith("blob:")));
    };
    loadHistory();
  }, [user]);

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
    if (user && String(id).length !== 13) await deleteCloudHistoryItem(id);
    toast.success(TOAST_MESSAGES.HISTORY.DELETE_SUCCESS);
  }, [user]);

  const renameItem = useCallback(async (id: string, newName: string) => {
    // Optimistic UI
    setHistory(prev => prev.map(item => item.id === id ? { ...item, custom_name: newName } : item));

    if (user && String(id).length !== 13) {
      const success = await renameCloudHistoryItem(id, newName);
      if (!success) toast.error(TOAST_MESSAGES.ERROR.SERVER);
    }
  }, [user]);

  const clearAll = useCallback(async () => {
    setHistory([]);
    await clearHistory();
    toast.success(TOAST_MESSAGES.SETTINGS.PREFS_SAVED);
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
              onRename={renameItem}
            />
          )}
        </AnimatePresence>
      </main>

      {/* ── INSOLVENCY/NO-CREDIT MODAL ── */}
      <AnimatePresence>
        {showCreditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 px-4">
            {/* Blurry Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreditModal(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-md glass bg-[#0a0a0f]/90 rounded-[2.5rem] border border-white/[0.08] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent opacity-50" />

              <button
                onClick={() => setShowCreditModal(false)}
                className="absolute top-6 right-6 h-8 w-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="p-10 flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-[2rem] bg-gradient-to-br from-[#7c3aed]/20 to-transparent flex items-center justify-center border border-[#7c3aed]/30 shadow-[0_0_30px_rgba(124,58,237,0.2)] mb-8 relative group">
                  <div className="absolute inset-0 bg-[#7c3aed]/10 blur-xl rounded-full animate-pulse" />
                  <Zap size={32} className="text-[#a855f7] relative z-10 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" fill="currentColor" />
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/10 border border-red-500/20 mb-4">
                  <ShieldAlert size={12} className="text-red-400" />
                  <span className="text-[10px] font-black text-red-400 tracking-[0.2em] uppercase leading-none mt-[0.5px]">Insufficient Balance</span>
                </div>

                <h3 className="text-3xl font-black text-white tracking-tighter mb-4">You've exhausted your <br /> Intelligence Credits</h3>
                <p className="text-[#71717a] font-medium leading-relaxed text-sm mb-10">
                  Your free V3.0 allotment has been fully utilized. Initialize a Pro Membership to unlock 10 premium credits and surgical-grade processing.
                </p>

                <div className="flex flex-col gap-3 w-full">
                  <Button
                    size="xl"
                    className="w-full rounded-2xl bg-gradient-to-r from-[#60a5fa] via-[#7c3aed] to-[#c084fc] font-black tracking-widest text-[11px] uppercase border-none shadow-[0_10px_25px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    onClick={() => {
                      setShowCreditModal(false);
                      initiatePayment(49900, 'SnapCut AI - V3.0 Pro Plan');
                    }}
                  >
                    <Crown size={15} className="mr-2" />
                    Instant Pro Access
                  </Button>

                  <button
                    onClick={() => setShowCreditModal(false)}
                    className="h-12 w-full rounded-2xl bg-white/5 hover:bg-white/10 text-[#71717a] hover:text-white text-[11px] font-black uppercase tracking-widest transition-all"
                  >
                    Return to Workspace
                  </button>
                </div>

                <div className="mt-8 flex items-center gap-2 opacity-30">
                  <Logo size={16} showText={false} />
                  <span className="text-[9px] font-black tracking-widest uppercase">SnapCut Engineering Hub</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadWorkspace;
