import * as FileSystem from 'expo-file-system';
import { BaseStorageProvider } from './BaseStorageProvider';
import { 
    DATA_DIR, 
    MONSTERS_DIR, 
    SPELLS_DIR, 
    COMBATS_DIR,
    BEASTS_INDEX_FILE,
    SPELLS_INDEX_FILE,
    COMBATS_INDEX_FILE,
    PLAYERS_FILE,
    SPELLBOOKS_FILE
} from '../constants';

/**
 * Mobile storage provider using expo-file-system
 */
export class MobileStorageProvider extends BaseStorageProvider {
    
    // Key mapping for abstract keys to actual file paths
    private getStoragePath(key: string): string {
        const pathMap: { [key: string]: string } = {
            'BEASTS_INDEX': BEASTS_INDEX_FILE,
            'SPELLS_INDEX': SPELLS_INDEX_FILE,
            'COMBATS_INDEX': COMBATS_INDEX_FILE,
            'PLAYERS': PLAYERS_FILE,
            'SPELLBOOKS': SPELLBOOKS_FILE
        };
        
        return pathMap[key] || `${DATA_DIR}${key}.json`;
    }
    
    // Index operations
    protected async storeIndex(key: string, data: any): Promise<void> {
        const filePath = this.getStoragePath(key);
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data));
    }
    
    protected async loadIndex(key: string): Promise<any> {
        const filePath = this.getStoragePath(key);
        try {
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (fileInfo.exists) {
                const content = await FileSystem.readAsStringAsync(filePath);
                return JSON.parse(content);
            }
            return null;
        } catch (error) {
            console.warn(`Error loading index ${key}:`, error);
            return null;
        }
    }
    
    protected async deleteIndex(key: string): Promise<void> {
        const filePath = this.getStoragePath(key);
        try {
            await FileSystem.deleteAsync(filePath, { idempotent: true });
        } catch (error) {
            // File might not exist, which is fine
            console.log(`No existing index to clear: ${key}`);
        }
    }
    
    // Individual file operations
    protected async storeIndividual(key: string, data: any): Promise<void> {
        let filePath: string;
        
        if (key.startsWith('MONSTERS_PREFIX')) {
            const filename = key.replace('MONSTERS_PREFIX', '') + '.json';
            filePath = `${MONSTERS_DIR}${filename}`;
        } else if (key.startsWith('SPELLS_PREFIX')) {
            const filename = key.replace('SPELLS_PREFIX', '') + '.json';
            filePath = `${SPELLS_DIR}${filename}`;
        } else if (key.startsWith('COMBATS_PREFIX')) {
            const filename = key.replace('COMBATS_PREFIX', '') + '.json';
            filePath = `${COMBATS_DIR}${filename}`;
        } else {
            filePath = `${DATA_DIR}${key}.json`;
        }
        
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data));
    }
    
    protected async loadIndividual(key: string): Promise<any> {
        let filePath: string;
        
        if (key.startsWith('MONSTERS_PREFIX')) {
            const filename = key.replace('MONSTERS_PREFIX', '') + '.json';
            filePath = `${MONSTERS_DIR}${filename}`;
        } else if (key.startsWith('SPELLS_PREFIX')) {
            const filename = key.replace('SPELLS_PREFIX', '') + '.json';
            filePath = `${SPELLS_DIR}${filename}`;
        } else if (key.startsWith('COMBATS_PREFIX')) {
            const filename = key.replace('COMBATS_PREFIX', '') + '.json';
            filePath = `${COMBATS_DIR}${filename}`;
        } else {
            filePath = `${DATA_DIR}${key}.json`;
        }
        
        try {
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (fileInfo.exists) {
                const content = await FileSystem.readAsStringAsync(filePath);
                return JSON.parse(content);
            }
            return null;
        } catch (error) {
            console.warn(`Error loading individual file ${key}:`, error);
            return null;
        }
    }
    
    protected async deleteIndividual(key: string): Promise<void> {
        let filePath: string;
        
        if (key.startsWith('MONSTERS_PREFIX')) {
            const filename = key.replace('MONSTERS_PREFIX', '') + '.json';
            filePath = `${MONSTERS_DIR}${filename}`;
        } else if (key.startsWith('SPELLS_PREFIX')) {
            const filename = key.replace('SPELLS_PREFIX', '') + '.json';
            filePath = `${SPELLS_DIR}${filename}`;
        } else if (key.startsWith('COMBATS_PREFIX')) {
            const filename = key.replace('COMBATS_PREFIX', '') + '.json';
            filePath = `${COMBATS_DIR}${filename}`;
        } else {
            filePath = `${DATA_DIR}${key}.json`;
        }
        
        try {
            await FileSystem.deleteAsync(filePath, { idempotent: true });
        } catch (error) {
            // File might not exist, which is fine
        }
    }
    
    // Utility operations
    protected async getAllKeys(): Promise<string[]> {
        try {
            const allFiles: string[] = [];
            
            // Get all files from each directory
            const [monsterFiles, spellFiles, combatFiles] = await Promise.all([
                this.getFilesInDirectory(MONSTERS_DIR),
                this.getFilesInDirectory(SPELLS_DIR),
                this.getFilesInDirectory(COMBATS_DIR)
            ]);
            
            // Convert file paths to keys
            monsterFiles.forEach(file => {
                const key = file.replace(MONSTERS_DIR, '').replace('.json', '');
                allFiles.push(`MONSTERS_PREFIX${key}`);
            });
            
            spellFiles.forEach(file => {
                const key = file.replace(SPELLS_DIR, '').replace('.json', '');
                allFiles.push(`SPELLS_PREFIX${key}`);
            });
            
            combatFiles.forEach(file => {
                const key = file.replace(COMBATS_DIR, '').replace('.json', '');
                allFiles.push(`COMBATS_PREFIX${key}`);
            });
            
            return allFiles;
        } catch (error) {
            console.warn('Error getting all keys:', error);
            return [];
        }
    }
    
    protected async clearAll(): Promise<void> {
        try {
            // Clear all directories
            await Promise.all([
                this.clearDirectory(MONSTERS_DIR),
                this.clearDirectory(SPELLS_DIR),
                this.clearDirectory(COMBATS_DIR)
            ]);
            
            // Clear index files
            await Promise.all([
                this.deleteIndex('BEASTS_INDEX'),
                this.deleteIndex('SPELLS_INDEX'),
                this.deleteIndex('COMBATS_INDEX'),
                this.deleteIndex('PLAYERS'),
                this.deleteIndex('SPELLBOOKS')
            ]);
        } catch (error) {
            console.error('Error clearing all data:', error);
        }
    }
    
    // Platform-specific operations
    public async ensureDataDirectory(): Promise<void> {
        const dirs = [DATA_DIR, MONSTERS_DIR, SPELLS_DIR, COMBATS_DIR];
        
        for (const dir of dirs) {
            const dirInfo = await FileSystem.getInfoAsync(dir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
            }
        }
    }
    
    // Helper methods for mobile-specific operations
    private async getFilesInDirectory(directory: string): Promise<string[]> {
        try {
            const dirInfo = await FileSystem.getInfoAsync(directory);
            if (!dirInfo.exists) {
                return [];
            }
            
            const files = await FileSystem.readDirectoryAsync(directory);
            return files.map(file => `${directory}${file}`);
        } catch (error) {
            console.warn(`Error reading directory ${directory}:`, error);
            return [];
        }
    }
    
    private async clearDirectory(directory: string): Promise<void> {
        try {
            const files = await this.getFilesInDirectory(directory);
            await Promise.all(files.map(file => FileSystem.deleteAsync(file, { idempotent: true })));
        } catch (error) {
            console.warn(`Error clearing directory ${directory}:`, error);
        }
    }
    
    // Override storeBeastsIndex to add mobile-specific logging
    public async storeBeastsIndex(beasts: any[]): Promise<void> {
        console.log('storeBeastsIndex (mobile) called with', beasts.length, 'beasts');
        await super.storeBeastsIndex(beasts);
    }
    
    // Override storeSpellsIndex to add mobile-specific logging
    public async storeSpellsIndex(spells: any[]): Promise<void> {
        console.log('storeSpellsIndex (mobile) called with', spells.length, 'spells');
        await super.storeSpellsIndex(spells);
    }
}
