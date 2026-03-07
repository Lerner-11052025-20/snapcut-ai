import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Download, ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import logoImage from "@/assets/snapcut-logo.png";

type AppState = "idle" | "uploading" | "processing" | "done";

const UploadWorkspace = () => {
  const [state, setState] = useState<AppState>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Max 10MB.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Unsupported format. Use JPG, PNG, or WEBP.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setState("uploading");

      // Simulate upload + processing
      setTimeout(() => {
        setState("processing");
        setTimeout(() => {
          setResult(e.target?.result as string);
          setState("done");
          toast.success("Background removed successfully!");
        }, 2500);
      }, 1000);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const reset = () => {
    setState("idle");
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="SnapCut AI" className="h-7" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              5 free removals remaining
            </span>
            <Button variant="glow" size="sm" asChild>
              <Link to="/register">Upgrade</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <h1 className="font-display text-3xl font-bold text-center mb-8">
                Remove Background
              </h1>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
                className={`glass rounded-2xl p-12 border-2 border-dashed cursor-pointer transition-all duration-300 ${
                  dragOver
                    ? "border-primary shadow-glow scale-[1.02]"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow animate-float">
                    <Upload size={36} className="text-primary-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg text-foreground">
                      Drag & drop your image here
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse • JPG, PNG, WEBP • Max 10MB
                    </p>
                  </div>
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>
            </motion.div>
          )}

          {(state === "uploading" || state === "processing") && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="glass rounded-2xl p-8">
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg mb-6 opacity-60"
                  />
                )}
                <Loader2 size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="font-display font-semibold text-lg">
                  {state === "uploading" ? "Uploading..." : "Removing background..."}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  This usually takes a few seconds
                </p>
                <div className="mt-6 h-1.5 rounded-full bg-muted overflow-hidden max-w-xs mx-auto">
                  <motion.div
                    className="h-full gradient-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: state === "uploading" ? "40%" : "90%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {state === "done" && result && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="sm" onClick={reset}>
                  <ArrowLeft size={16} />
                  New Image
                </Button>
                <Button variant="hero" size="lg">
                  <Download size={18} />
                  Download PNG
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider">
                    Original
                  </p>
                  <img src={preview!} alt="Original" className="rounded-lg w-full" />
                </div>
                <div className="glass rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider">
                    Background Removed
                  </p>
                  <div
                    className="rounded-lg overflow-hidden"
                    style={{
                      backgroundImage:
                        "repeating-conic-gradient(hsl(var(--muted)) 0% 25%, transparent 0% 50%)",
                      backgroundSize: "16px 16px",
                    }}
                  >
                    <img src={result} alt="Result" className="w-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default UploadWorkspace;
