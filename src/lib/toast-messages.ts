export const TOAST_MESSAGES = {
    // 🔐 Authentication Toasts
    AUTH: {
        SIGNUP_SUCCESS: "Account created successfully. Please check your email to verify your account.",
        EMAIL_VERIFIED: "Email verified successfully. Welcome to SnapCut AI.",
        LOGIN_SUCCESS: "Login successful. Welcome back!",
        LOGOUT: "You have been logged out successfully.",
        INVALID_CREDS: "Invalid email or password. Please try again.",
        PASSWORD_RESET: "Password reset link has been sent to your email.",
        PASSWORD_UPDATED: "Your password has been updated successfully.",
    },

    // 🖼 Image Processing Toasts
    PROCESSING: {
        UPLOAD_STARTED: "Uploading image...",
        UPLOAD_SUCCESS: "Image uploaded successfully.",
        STARTED: "AI processing started.",
        COMPLETE: "Background removed successfully.",
        FAILED: "Processing failed. Please try again.",
        FILE_TOO_LARGE: "File size exceeds the allowed limit.",
        INVALID_FILE_TYPE: "Only JPG, PNG, and WEBP files are allowed.",
    },

    // 📥 Download Toasts
    DOWNLOAD: {
        STARTED: "Preparing your download...",
        SUCCESS: "Image downloaded successfully.",
        FAILED: "Download failed. Please try again.",
    },

    // ⭐ Credits & Usage Toasts
    USAGE: {
        CREDIT_USED: "You used 1 credit for this operation.",
        NO_CREDITS: "You have no credits left. Upgrade to continue.",
        CREDITS_ADDED: "Credits added successfully.",
    },

    // 💳 Billing / Subscription Toasts
    BILLING: {
        UPGRADE_SUCCESS: "Subscription upgraded to Pro successfully.",
        PAYMENT_SUCCESS: "Payment completed successfully.",
        PAYMENT_FAILED: "Payment failed. Please try again.",
        SUBSCRIPTION_ACTIVE: "Your Pro plan is now active.",
        SUBSCRIPTION_CANCELLED: "Your subscription has been cancelled.",
    },

    // 📂 History Section Toasts
    HISTORY: {
        SAVED: "Result saved to your history.",
        RENAME_SUCCESS: "File renamed successfully.",
        DELETE_SUCCESS: "File removed from history.",
    },

    // ⚙️ Settings Toasts
    SETTINGS: {
        PROFILE_UPDATED: "Profile updated successfully.",
        THEME_CHANGED: "Theme updated successfully.",
        PREFS_SAVED: "Settings saved successfully.",
    },

    // 🌐 API / Developer Toasts
    API: {
        KEY_GENERATED: "New API key generated successfully.",
        KEY_COPIED: "API key copied to clipboard.",
        KEY_DELETED: "API key removed successfully.",
    },

    // 🚨 General Error Toasts
    ERROR: {
        NETWORK: "Network error. Please check your connection.",
        SERVER: "Something went wrong. Please try again later.",
        UNEXPECTED: "Unexpected error occurred.",
    },

    // ⭐ Premium UX Toast (Nice Touch)
    PREMIUM: {
        IMAGE_READY: "Your image is ready. Download now.",
    }
};
