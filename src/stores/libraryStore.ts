// REACT
import { create } from 'zustand';

// CONFIG / STORAGE
import { bookContentUrl, adventureContentUrl } from 'src/constants/remote';
import {
    saveDocument,
    loadDocument,
    deleteDocument,
    listDownloaded,
    docKey,
    LibraryType,
} from 'src/utils/libraryStorage';

interface LibraryState {
    downloaded: Set<string>;   // docKeys cached on disk
    downloading: Set<string>;  // docKeys currently being fetched
    error: string | null;

    init: () => Promise<void>;
    download: (type: LibraryType, id: string) => Promise<boolean>;
    remove: (type: LibraryType, id: string) => Promise<void>;
    getDocument: (type: LibraryType, id: string) => Promise<any | null>;
    clearError: () => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
    downloaded: new Set(),
    downloading: new Set(),
    error: null,

    init: async () => {
        const keys = await listDownloaded();
        set({ downloaded: new Set(keys) });
    },

    download: async (type, id) => {
        const key = docKey(type, id);
        if (get().downloading.has(key)) return false;
        set(s => ({ downloading: new Set(s.downloading).add(key), error: null }));
        try {
            const url = type === 'book' ? bookContentUrl(id) : adventureContentUrl(id);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            await saveDocument(type, id, data);
            set(s => {
                const downloading = new Set(s.downloading); downloading.delete(key);
                return { downloading, downloaded: new Set(s.downloaded).add(key) };
            });
            return true;
        } catch (e) {
            console.warn(`Failed to download ${type} ${id}:`, e);
            set(s => {
                const downloading = new Set(s.downloading); downloading.delete(key);
                return { downloading, error: 'Download failed. Check your connection and try again.' };
            });
            return false;
        }
    },

    remove: async (type, id) => {
        await deleteDocument(type, id);
        set(s => {
            const downloaded = new Set(s.downloaded); downloaded.delete(docKey(type, id));
            return { downloaded };
        });
    },

    getDocument: async (type, id) => loadDocument(type, id),

    clearError: () => set({ error: null }),
}));
