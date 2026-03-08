/// <reference path="../types.d.ts" />
// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

interface VerifyPaymentRequest {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    user_id?: string;
}

interface VerifyPaymentResponse {
    success: boolean;
    message?: string;
    payment_id?: string;
    subscription_tier?: string;
    error?: string;
}

// ✅ Permissive CORS headers — allow all origins (works for local + production)
const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, Authorization, Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
};

function jsonResponse(data: VerifyPaymentResponse, status: number): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
        },
    });
}

async function verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
    secret: string
): Promise<boolean> {
    try {
        const message = `${orderId}|${paymentId}`;
        const enc = new TextEncoder();

        const key = await crypto.subtle.importKey(
            "raw",
            enc.encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );

        const signature_computed = await crypto.subtle.sign(
            "HMAC",
            key,
            enc.encode(message)
        );

        const signatureHex = Array.from(new Uint8Array(signature_computed))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        console.log("✅ Signature verification:");
        console.log("   Message:", message);
        console.log("   Expected:", signature.substring(0, 20) + "...");
        console.log("   Computed:", signatureHex.substring(0, 20) + "...");
        console.log("   Match:", signatureHex === signature);

        return signatureHex === signature;
    } catch (error) {
        console.error("❌ Signature verification error:", error);
        return false;
    }
}

async function updateUserSubscription(
    userId: string,
    supabaseUrl: string,
    supabaseServiceKey: string
): Promise<boolean> {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year

        const { error } = await supabase
            .from("profiles")
            .update({
                subscription_tier: "pro",
                subscription_started_at: now.toISOString(),
                subscription_ends_at: expiresAt.toISOString(),
                updated_at: now.toISOString(),
            })
            .eq("id", userId);

        if (error) {
            console.error("❌ Error updating user subscription:", error);
            return false;
        }

        console.log(`✅ Successfully upgraded user ${userId} to PRO tier`);
        return true;
    } catch (error) {
        console.error("❌ Error in updateUserSubscription:", error);
        return false;
    }
}

Deno.serve(async (req: Request): Promise<Response> => {
    console.log("🚀 verify-payment Edge Function called:", {
        method: req.method,
        url: req.url,
        origin: req.headers.get("origin"),
    });

    // ✅ Handle CORS preflight — MUST return 200 (not 204) for some browsers
    if (req.method === "OPTIONS") {
        console.log("✅ Handling OPTIONS preflight");
        return new Response("ok", {
            status: 200,
            headers: CORS_HEADERS,
        });
    }

    // Only allow POST
    if (req.method !== "POST") {
        return jsonResponse({
            success: false,
            error: "Method not allowed. Use POST.",
        }, 405);
    }

    try {
        let request: VerifyPaymentRequest;

        try {
            request = await req.json();
        } catch (parseError) {
            console.error("❌ JSON parse error:", parseError);
            return jsonResponse({
                success: false,
                error: "Invalid JSON in request body",
            }, 400);
        }

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, user_id } = request;

        console.log("📦 Payment verification request received:", {
            razorpay_payment_id,
            razorpay_order_id,
            signature_preview: razorpay_signature?.substring(0, 20) + "...",
            user_id: user_id ? user_id.substring(0, 8) + "..." : "not provided",
        });

        // Validate required fields
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return jsonResponse({
                success: false,
                error: `Missing required parameters: payment_id=${!!razorpay_payment_id}, order_id=${!!razorpay_order_id}, signature=${!!razorpay_signature}`,
            }, 400);
        }

        // Get Razorpay secret from Supabase secrets
        const razorpaySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

        if (!razorpaySecret) {
            console.error("❌ RAZORPAY_KEY_SECRET not set in Supabase secrets!");
            console.error("   Go to: Supabase Dashboard → Edge Functions → Secrets");
            console.error("   Add: RAZORPAY_KEY_SECRET = your_razorpay_key_secret");
            return jsonResponse({
                success: false,
                error: "Server misconfigured: RAZORPAY_KEY_SECRET not set in Supabase Edge Function secrets",
            }, 500);
        }

        // Verify the payment signature
        const isValid = await verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            razorpaySecret
        );

        if (!isValid) {
            console.warn("⚠️ Signature verification FAILED");
            return jsonResponse({
                success: false,
                error: "Invalid payment signature. Possible fraud attempt.",
            }, 400);
        }

        console.log("✅ Signature verified successfully");

        // Update user subscription in Supabase
        if (user_id) {
            const supabaseUrl = Deno.env.get("SUPABASE_URL");
            const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

            if (!supabaseUrl || !supabaseServiceKey) {
                console.warn("⚠️ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
                // Still return success since signature is valid
                return jsonResponse({
                    success: true,
                    message: "Payment signature verified. Subscription update pending (missing DB config).",
                    payment_id: razorpay_payment_id,
                }, 200);
            }

            const updated = await updateUserSubscription(user_id, supabaseUrl, supabaseServiceKey);

            if (!updated) {
                // Payment is valid but DB update failed — still return success
                // User subscription can be manually updated
                return jsonResponse({
                    success: true,
                    message: "Payment verified but subscription update failed. Contact support.",
                    payment_id: razorpay_payment_id,
                }, 200);
            }
        }

        return jsonResponse({
            success: true,
            message: "Payment verified and subscription activated!",
            payment_id: razorpay_payment_id,
            subscription_tier: "pro",
        }, 200);

    } catch (error) {
        console.error("❌ Unexpected error:", error);
        return jsonResponse({
            success: false,
            error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
        }, 500);
    }
});
