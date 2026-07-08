// On-disk storage for downloaded library documents (books & adventures). Content is fetched
// on demand (see src/constants/remote.ts) and cached here so it works offline afterwards.
import * as FileSystem from 'expo-file-system/legacy';

import { DATA_DIR } from 'src/constants/utils';

const LIBRARY_DIR = `${DATA_DIR}library/`;

export type LibraryType = 'book' | 'adventure';

const filePath = (type: LibraryType, id: string) => `${LIBRARY_DIR}${type}-${id.toLowerCase()}.json`;
// Keyed by lowercased id to match the on-disk filenames (so UI checks and disk scans agree).
export const docKey = (type: LibraryType, id: string) => `${type}|${id.toLowerCase()}`;

async function ensureDir(): Promise<void> {
    const info = await FileSystem.getInfoAsync(LIBRARY_DIR);
    if (!info.exists) await FileSystem.makeDirectoryAsync(LIBRARY_DIR, { intermediates: true });
}

export async function saveDocument(type: LibraryType, id: string, data: any): Promise<void> {
    await ensureDir();
    await FileSystem.writeAsStringAsync(filePath(type, id), JSON.stringify(data));
}

export async function loadDocument(type: LibraryType, id: string): Promise<any | null> {
    try {
        const info = await FileSystem.getInfoAsync(filePath(type, id));
        if (!info.exists) return null;
        return JSON.parse(await FileSystem.readAsStringAsync(filePath(type, id)));
    } catch (e) {
        console.warn(`Failed to load ${type} ${id}:`, e);
        return null;
    }
}

export async function deleteDocument(type: LibraryType, id: string): Promise<void> {
    try {
        const info = await FileSystem.getInfoAsync(filePath(type, id));
        if (info.exists) await FileSystem.deleteAsync(filePath(type, id), { idempotent: true });
    } catch (e) {
        console.warn(`Failed to delete ${type} ${id}:`, e);
    }
}

// Returns the set of downloaded doc keys ("book|PHB") currently cached on disk.
export async function listDownloaded(): Promise<string[]> {
    try {
        const info = await FileSystem.getInfoAsync(LIBRARY_DIR);
        if (!info.exists) return [];
        const files = await FileSystem.readDirectoryAsync(LIBRARY_DIR);
        return files
            .filter(f => f.endsWith('.json'))
            .map(f => {
                const stem = f.replace(/\.json$/, '');
                const dash = stem.indexOf('-');
                if (dash < 0) return null;
                const type = stem.slice(0, dash) as LibraryType;
                const id = stem.slice(dash + 1);
                return docKey(type, id);
            })
            .filter((k): k is string => !!k);
    } catch {
        return [];
    }
}
