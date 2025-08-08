import { set, get, del, clear, keys } from 'idb-keyval';
import { BaseStorageProvider } from './BaseStorageProvider';
import { STORAGE_KEYS } from '../constants';

/**
 * Web storage provider using IndexedDB
 */
export class WebStorageProvider extends BaseStorageProvider {
    
    // Key mapping for abstract keys to actual storage keys
    private getStorageKey(abstractKey: string): string {
        const keyMap: { [key: string]: string } = {
            'BEASTS_INDEX': STORAGE_KEYS.BEASTS_INDEX,
            'SPELLS_INDEX': STORAGE_KEYS.SPELLS_INDEX,
            'COMBATS_INDEX': STORAGE_KEYS.COMBATS_INDEX,
            'PLAYERS': STORAGE_KEYS.PLAYERS,
            'SPELLBOOKS': STORAGE_KEYS.SPELLBOOKS,
            'MONSTERS_PREFIX': STORAGE_KEYS.MONSTERS_PREFIX,
            'SPELLS_PREFIX': STORAGE_KEYS.SPELLS_PREFIX,
            'COMBATS_PREFIX': STORAGE_KEYS.COMBATS_PREFIX,
            'SPELL_CLASS_RELATIONS_INDEX': STORAGE_KEYS.SPELL_CLASS_RELATIONS_INDEX,
            'AVAILABLE_CLASSES_INDEX': STORAGE_KEYS.AVAILABLE_CLASSES_INDEX
        };
        
        return keyMap[abstractKey] || abstractKey;
    }
    
    // Index operations
    protected async storeIndex(key: string, data: any): Promise<void> {
        const storageKey = this.getStorageKey(key);
        await set(storageKey, data);
    }
    
    protected async loadIndex(key: string): Promise<any> {
        const storageKey = this.getStorageKey(key);
        return await get(storageKey);
    }
    
    protected async deleteIndex(key: string): Promise<void> {
        const storageKey = this.getStorageKey(key);
        await del(storageKey);
    }
    
    // Individual file operations
    protected async storeIndividual(key: string, data: any): Promise<void> {
        const storageKey = this.getStorageKey(key);
        await set(storageKey, data);
    }
    
    protected async loadIndividual(key: string): Promise<any> {
        const storageKey = this.getStorageKey(key);
        return await get(storageKey);
    }
    
    protected async deleteIndividual(key: string): Promise<void> {
        const storageKey = this.getStorageKey(key);
        await del(storageKey);
    }
    
    // Utility operations
    protected async getAllKeys(): Promise<string[]> {
        return await keys();
    }
    
    protected async clearAll(): Promise<void> {
        await clear();
    }
    
    // Platform-specific operations
    public async ensureDataDirectory(): Promise<void> {
        // No-op for web - IndexedDB handles this automatically
    }
    
    // Override storeBeastsIndex to add web-specific logging
    public override async storeBeastsIndex(beasts: any[]): Promise<void> {
        console.log('storeBeastsIndex (web) called with', beasts.length, 'beasts');
        await super.storeBeastsIndex(beasts);
    }
    
    // Override storeSpellsIndex to add web-specific logging
    public override async storeSpellsIndex(spells: any[]): Promise<void> {
        console.log('storeSpellsIndex (web) called with', spells.length, 'spells');
        await super.storeSpellsIndex(spells);
    }
}
