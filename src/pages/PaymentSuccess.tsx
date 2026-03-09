import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Crown, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/lib/toast-messages";
import { useAuth } from "@/contexts/AuthContext";
import { verifyRazorpayPayment, extractRazorpayParams } from "@/lib/razorpayVerification";
import Logo from "@/components/Logo";

type PaymentStatus = 'processing' | 'success' | 'error' | 'verifying';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, refreshProfile, markAsPro } = useAuth();
  const [status, setStatus] = React.useState<PaymentStatus>('verifying');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [countdown, setCountdown] = React.useState(3);
  const hasProcessed = useRef(false); // prevent double-processing

  useEffect(() => {
    // Wait until auth is fully loaded before processing
    if (loading) return;

    // If no user after loading is done, ProtectedRoute handles redirect — don't do it here
    if (!user) return;

    // Prevent running twice (React Strict Mode double-fire)
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processPayment = async () => {
      try {
        const razorpayParams = extractRazorpayParams(searchParams);

        if (!razorpayParams) {
          setErrorMessage('Invalid payment parameters. Missing Razorpay payment details.');
          setStatus('error');
          return;
        }

        setStatus('verifying');

        // Verify payment + upgrade subscription (with fallback to direct DB)
        const verificationResult = await verifyRazorpayPayment(razorpayParams, user.id);

        if (!verificationResult.success) {
          setErrorMessage(verificationResult.error || 'Payment verification failed');
          setStatus('error');
          toast.error(TOAST_MESSAGES.BILLING.PAYMENT_FAILED, {
            description: verificationResult.error,
          });
          return;
        }

        // 👑 IMMEDIATELY mark as PRO in local state + localStorage
        // This works even if DB update fails due to RLS
        markAsPro();

        // Also attempt a DB refresh (in background, non-blocking)
        refreshProfile().catch(() => { });

        // Send purchase data to n8n webhook
        try {
          console.log("Initiating webhook request to n8n...");
          const webhookPayload = {
            userId: user.id,
            userEmail: user?.email || 'N/A', // ensure email is present
            paymentId: razorpayParams.razorpay_payment_id,
            orderId: razorpayParams.razorpay_order_id,
            status: 'success',
            plan: 'PRO',
            timestamp: new Date().toISOString()
          };

          const webhookResponse = await fetch('https://deep7204.app.n8n.cloud/webhook/purchase-made', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(webhookPayload)
          });

          if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text();
            console.error(`❌ Webhook HTTP Error: ${webhookResponse.status} - ${errorText}`);
            toast.error("Payment verified, but email notification failed.", {
              duration: 8000,
              description: `Webhook Error (${webhookResponse.status}): The workflow might be inactive or restricted.`,
            });
          } else {
            console.log("✅ Webhook sent successfully!");
          }
        } catch (webhookError: any) {
          console.error("❌ Webhook Network/CORS Error:", webhookError);

          // If it fails due to CORS, JS throws a TypeError: Failed to fetch. Let's try a fallback!
          try {
            console.log("⚠️ Attempting webhook fallback using 'no-cors' mode...");
            await fetch('https://deep7204.app.n8n.cloud/webhook/purchase-made', {
              method: 'POST',
              mode: 'no-cors', // Bypasses CORS preflight, but response cannot be read
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: user.id,
                userEmail: user?.email || 'N/A',
                paymentId: razorpayParams.razorpay_payment_id,
                orderId: razorpayParams.razorpay_order_id,
                status: 'success',
                plan: 'PRO',
                timestamp: new Date().toISOString(),
                _note: 'Sent via no-cors fallback'
              })
            });
            console.log("✅ Webhook fallback dispatched (no-cors).");
          } catch (fallbackError: any) {
            toast.error("Warning: Could not send confirmation email.", {
              duration: 8000,
              description: `Error: ${webhookError?.message || 'Network blocked the request'}. Please contact support.`
            });
          }
        }

        // Show success state
        setStatus('success');
        toast.success(TOAST_MESSAGES.BILLING.PAYMENT_SUCCESS, {
          duration: 5000,
          description: 'Your account has been upgraded to Pro.',
        });

      } catch (error) {
        console.error("Payment processing error:", error);
        setErrorMessage('An unexpected error occurred. Please contact support.');
        setStatus('error');
      }
    };

    processPayment();
  }, [user, loading]); // only depend on user and loading — not navigate/searchParams

  // Live countdown timer — starts when status becomes 'success'
  useEffect(() => {
    if (status !== 'success') return;

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, navigate]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-8"
        >
          <Logo size={48} />
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-[2.5rem] p-8 sm:p-12 border-white/10 shadow-2xl text-center relative overflow-hidden"
        >
          {/* Animated Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${status === 'success' ? 'from-green-500/10' :
            status === 'error' ? 'from-red-500/10' :
              'from-blue-500/10'
            } via-transparent to-transparent`} />

          <div className="relative z-10 space-y-6">

            {/* ── VERIFYING / PROCESSING ICON ── */}
            {(status === 'verifying' || status === 'processing') && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex justify-center"
              >
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {/* ── SUCCESS ICON ── */}
            {status === 'success' && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl" />
                  <CheckCircle
                    size={80}
                    className="text-green-400 relative drop-shadow-lg"
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>
            )}

            {/* ── ERROR ICON ── */}
            {status === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl" />
                  <AlertCircle size={80} className="text-red-400 relative" strokeWidth={1.5} />
                </div>
              </motion.div>
            )}

            {/* ── HEADING ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {(status === 'verifying' || status === 'processing') && (
                <>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400/80 mb-2">
                    Verifying Payment
                  </p>
                  <h1 className="font-display text-3xl font-black tracking-tight text-white mb-2">
                    Please wait...
                  </h1>
                  <p className="text-muted-foreground">Confirming your payment with Razorpay</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-400 mb-2">
                    Payment Successful
                  </p>
                  <h1 className="font-display text-4xl font-black tracking-tight text-white mb-2">
                    Welcome to Pro! 🎉
                  </h1>
                  <p className="text-muted-foreground">
                    Your payment has been verified and account upgraded
                  </p>
                </>
              )}

              {status === 'error' && (
                <>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-400 mb-2">
                    Payment Failed
                  </p>
                  <h1 className="font-display text-3xl font-black tracking-tight text-white mb-2">
                    Something went wrong
                  </h1>
                  <p className="text-red-300 text-sm">
                    {errorMessage || 'Payment could not be processed'}
                  </p>
                </>
              )}
            </motion.div>

            {/* ── PRO BADGE (success only) ── */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/50 mx-auto"
              >
                <Crown size={20} className="text-yellow-400" strokeWidth={2} />
                <span className="font-black text-yellow-300 uppercase tracking-widest">Pro Member</span>
              </motion.div>
            )}

            {/* ── PRO BENEFITS (success only) ── */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2 text-left bg-white/5 rounded-2xl p-4"
              >
                <h3 className="font-bold text-white mb-3">Your Pro Benefits:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {['Unlimited image processing', 'Advanced AI features', 'Priority support', 'Batch processing'].map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* ── PROGRESS BAR (verifying) ── */}
            {(status === 'verifying' || status === 'processing') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Verifying with Razorpay...</p>
              </motion.div>
            )}

            {/* ── CTA BUTTONS ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              {status === 'success' && (
                <>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-sm bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    Go to Dashboard
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                  {/* Live countdown */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((n) => (
                        <motion.div
                          key={n}
                          className={`h-2 w-2 rounded-full transition-all duration-500 ${countdown >= n ? 'bg-primary' : 'bg-white/10'
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Redirecting in <span className="text-primary font-bold">{countdown}</span>s...
                    </p>
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <Button
                    onClick={() => navigate("/upload")}
                    className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-500/90 hover:to-red-600/90"
                  >
                    Back to Upload
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                  <Button
                    onClick={() => navigate("/contact")}
                    variant="ghost"
                    className="w-full h-12 rounded-2xl text-muted-foreground hover:text-white"
                  >
                    Contact Support
                  </Button>
                </>
              )}
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
