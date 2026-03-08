// Full Deno type declarations for Supabase Edge Functions
// This file silences VS Code TypeScript errors for Deno-specific globals

declare namespace Deno {
    /** Starts an HTTP server */
    function serve(
        handler: (req: Request) => Response | Promise<Response>
    ): void;
    function serve(
        options: { port?: number; hostname?: string },
        handler: (req: Request) => Response | Promise<Response>
    ): void;

    /** Access to environment variables */
    const env: {
        get(key: string): string | undefined;
        set(key: string, value: string): void;
        delete(key: string): void;
        has(key: string): boolean;
        toObject(): Record<string, string>;
    };

    /** Deno version info */
    const version: {
        deno: string;
        v8: string;
        typescript: string;
    };

    /** Read text file */
    function readTextFile(path: string): Promise<string>;

    /** Write text file */
    function writeTextFile(path: string, data: string): Promise<void>;

    /** Exit process */
    function exit(code?: number): never;

    /** OS/platform info */
    const build: {
        target: string;
        arch: string;
        os: string;
        vendor: string;
        env?: string;
    };
}

// Ensure URL imports from esm.sh work without type errors
declare module "https://esm.sh/@supabase/supabase-js@2.33.1" {
    export * from "@supabase/supabase-js";
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
    export * from "@supabase/supabase-js";
}

// Allow any https:// imports in Deno style
declare module "https://*" {
    const module: any;
    export default module;
    export const createClient: any;
}
