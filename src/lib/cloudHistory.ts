import { supabase } from "./supabase";

export interface CloudHistoryItem {
    id: string;
    user_id: string;
    original_url: string;
    result_url: string;
    timestamp: string;
    custom_name?: string;
    processing_time_ms?: number;
    download_count?: number;
}

/** Fetch history from Supabase for the current user */
export async function getCloudHistory(): Promise<CloudHistoryItem[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('user_history')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error("[CloudHistory] Fetch failed:", err);
        return [];
    }
}

/** Add a record to Supabase history */
export async function addCloudHistoryItem(resultUrl: string, originalUrl: string = "", processingTimeMs: number = 0) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('user_history')
            .insert([
                {
                    user_id: user.id,
                    result_url: resultUrl,
                    original_url: originalUrl,
                    processing_time_ms: processingTimeMs,
                    custom_name: `Project-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (err) {
        console.error("[CloudHistory] Insert failed:", err);
        return null;
    }
}

/** Rename an item */
export async function renameCloudHistoryItem(id: string, newName: string) {
    try {
        const { error } = await supabase
            .from('user_history')
            .update({ custom_name: newName })
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (err) {
        console.error("[CloudHistory] Rename failed:", err);
        return false;
    }
}

/** Increment download count */
export async function incrementDownloadCount(id: string) {
    try {
        // We use rpc or simple fetch + update. Simplest is current_val + 1
        const { data: current } = await supabase
            .from('user_history')
            .select('download_count')
            .eq('id', id)
            .single();

        const newVal = (current?.download_count || 0) + 1;

        const { error } = await supabase
            .from('user_history')
            .update({ download_count: newVal })
            .eq('id', id);

        if (error) throw error;
        return newVal;
    } catch (err) {
        console.error("[CloudHistory] Download count increment failed:", err);
        return null;
    }
}

/** Delete a record from Supabase */
export async function deleteCloudHistoryItem(id: string) {
    try {
        const { error } = await supabase
            .from('user_history')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (err) {
        console.error("[CloudHistory] Delete failed:", err);
        return false;
    }
}
