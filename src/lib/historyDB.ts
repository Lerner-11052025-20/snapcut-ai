/**
 * historyDB.ts
 * IndexedDB wrapper for SnapCut AI history storage.
 * Replaces localStorage for image history to avoid 5MB quota limits.
 * Supports storing large base64 / blob URL result images reliably.
 */

const DB_NAME = "snapcut_ai_db";
const DB_VERSION = 1;
const STORE_NAME = "history";
const MAX_HISTORY = 100;

export interface HistoryItem {
    id: string;
    original: string; // base64 or empty string (not stored to save space)
    result: string;   // base64 of the processed result image
    timestamp: string;
}

/** Open (or create) the IndexedDB database */
function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
                // Index by timestamp for ordered retrieval
                store.createIndex("timestamp", "timestamp", { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/** Retrieve all history items, newest first */
export async function getAllHistory(): Promise<HistoryItem[]> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => {
                const items: HistoryItem[] = request.result || [];
                // Sort newest first
                items.sort((a, b) => {
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() ||
                        b.id.localeCompare(a.id);
                });
                resolve(items);
            };
            request.onerror = () => reject(request.error);
        });
    } catch (err) {
        console.error("[HistoryDB] getAllHistory failed:", err);
        return [];
    }
}

/** Add a new history item, pruning oldest if over MAX_HISTORY */
export async function addHistoryItem(item: HistoryItem): Promise<void> {
    try {
        const db = await openDB();

        // Prune if needed
        const all = await getAllHistory();
        if (all.length >= MAX_HISTORY) {
            // Remove the oldest items (last in sorted array) beyond limit
            const toDelete = all.slice(MAX_HISTORY - 1);
            const deleteTx = db.transaction(STORE_NAME, "readwrite");
            const deleteStore = deleteTx.objectStore(STORE_NAME);
            for (const old of toDelete) {
                deleteStore.delete(old.id);
            }
            await new Promise<void>((res, rej) => {
                deleteTx.oncomplete = () => res();
                deleteTx.onerror = () => rej(deleteTx.error);
            });
        }

        // Add new item
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            store.put(item);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (err) {
        console.error("[HistoryDB] addHistoryItem failed:", err);
    }
}

/** Delete a history item by id */
export async function deleteHistoryItem(id: string): Promise<void> {
    try {
        const db = await openDB();
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            store.delete(id);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (err) {
        console.error("[HistoryDB] deleteHistoryItem failed:", err);
    }
}

/** Clear all history */
export async function clearHistory(): Promise<void> {
    try {
        const db = await openDB();
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).clear();
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (err) {
        console.error("[HistoryDB] clearHistory failed:", err);
    }
}

/**
 * Migration helper: migrate existing localStorage history into IndexedDB.
 * Runs once and then clears localStorage history key.
 */
export async function migrateFromLocalStorage(): Promise<void> {
    try {
        const raw = localStorage.getItem("snapcut_history");
        if (!raw) return;

        const items: HistoryItem[] = JSON.parse(raw);
        if (!Array.isArray(items) || items.length === 0) return;

        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        for (const item of items) {
            // Skip blob URLs (they're expired)
            if (item.result?.startsWith("blob:") || item.original?.startsWith("blob:")) continue;
            // Strip original to save space (it's not needed for display)
            store.put({ ...item, original: "" });
        }

        await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });

        // Remove from localStorage after successful migration
        localStorage.removeItem("snapcut_history");
        console.log("[HistoryDB] Migrated", items.length, "items from localStorage to IndexedDB.");
    } catch (err) {
        console.error("[HistoryDB] Migration failed:", err);
    }
}
