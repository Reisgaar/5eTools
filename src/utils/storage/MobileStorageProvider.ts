import * as FileSystem from 'expo-file-system';
import { BaseStorageProvider } from './BaseStorageProvider';
import { STORAGE_KEYS } from '../types';
import { 
    DATA_DIR, 
    MONSTERS_DIR, 
    SPELLS_DIR, 
    COMBATS_DIR,
    LEGACY_DATA_DIR,
    LEGACY_MONSTERS_DIR,
    LEGACY_SPELLS_DIR,
    LEGACY_COMBATS_DIR,
    BEASTS_INDEX_FILE,
    SPELLS_INDEX_FILE,
    COMBATS_INDEX_FILE,
    PLAYERS_FILE,
    SPELLBOOKS_FILE
} from '../constants';

/**
 * Mobile storage provider using expo-file-system with persistent data strategy
 */
export class MobileStorageProvider extends BaseStorageProvider {
    
    // Key mapping for abstract keys to actual file paths
    private getStoragePath(key: string): string {
        const pathMap: { [key: string]: string } = {
            'BEASTS_INDEX': BEASTS_INDEX_FILE,
            'SPELLS_INDEX': SPELLS_INDEX_FILE,
            'COMBATS_INDEX': COMBATS_INDEX_FILE,
            'PLAYERS': PLAYERS_FILE,
            'SPELLBOOKS': SPELLBOOKS_FILE,
            'CAMPAIGNS': `${DATA_DIR}campaigns.json`,
    
            'SPELL_CLASS_RELATIONS_INDEX': `${DATA_DIR}spell_class_relations_index.json`,
            'AVAILABLE_CLASSES_INDEX': `${DATA_DIR}available_classes_index.json`
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
            console.warn(`Error deleting index ${key}:`, error);
        }
    }
    
    // Individual file operations
    protected async storeIndividual(key: string, data: any): Promise<void> {
        let filePath: string;
        
        if (key.startsWith(STORAGE_KEYS.MONSTERS_PREFIX)) {
            const filename = key.replace(STORAGE_KEYS.MONSTERS_PREFIX, '') + '.json';
            filePath = `${MONSTERS_DIR}${filename}`;
        } else if (key.startsWith(STORAGE_KEYS.SPELLS_PREFIX)) {
            const filename = key.replace(STORAGE_KEYS.SPELLS_PREFIX, '') + '.json';
            filePath = `${SPELLS_DIR}${filename}`;
        } else if (key.startsWith(STORAGE_KEYS.COMBATS_PREFIX)) {
            const filename = key.replace(STORAGE_KEYS.COMBATS_PREFIX, '') + '.json';
            filePath = `${COMBATS_DIR}${filename}`;
        } else {
            filePath = `${DATA_DIR}${key}.json`;
        }
        
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data));
    }
    
    protected async loadIndividual(key: string): Promise<any> {
        let filePath: string;
        
        if (key.startsWith(STORAGE_KEYS.MONSTERS_PREFIX)) {
            const filename = key.replace(STORAGE_KEYS.MONSTERS_PREFIX, '') + '.json';
            filePath = `${MONSTERS_DIR}${filename}`;
        } else if (key.startsWith(STORAGE_KEYS.SPELLS_PREFIX)) {
            const filename = key.replace(STORAGE_KEYS.SPELLS_PREFIX, '') + '.json';
            filePath = `${SPELLS_DIR}${filename}`;
        } else if (key.startsWith(STORAGE_KEYS.COMBATS_PREFIX)) {
            const filename = key.replace(STORAGE_KEYS.COMBATS_PREFIX, '') + '.json';
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
        
        if (key.startsWith(STORAGE_KEYS.MONSTERS_PREFIX)) {
            const filename = key.replace(STORAGE_KEYS.MONSTERS_PREFIX, '') + '.json';
            filePath = `${MONSTERS_DIR}${filename}`;
        } else if (key.startsWith(STORAGE_KEYS.SPELLS_PREFIX)) {
            const filename = key.replace(STORAGE_KEYS.SPELLS_PREFIX, '') + '.json';
            filePath = `${SPELLS_DIR}${filename}`;
        } else if (key.startsWith(STORAGE_KEYS.COMBATS_PREFIX)) {
            const filename = key.replace(STORAGE_KEYS.COMBATS_PREFIX, '') + '.json';
            filePath = `${COMBATS_DIR}${filename}`;
        } else {
            filePath = `${DATA_DIR}${key}.json`;
        }
        
        try {
            await FileSystem.deleteAsync(filePath, { idempotent: true });
        } catch (error) {
            console.warn(`Error deleting individual file ${key}:`, error);
        }
    }
    
    protected async getAllKeys(): Promise<string[]> {
        try {
            const allFiles: string[] = [];
            
            // Get files from all directories
            const [monsterFiles, spellFiles, combatFiles] = await Promise.all([
                this.getFilesInDirectory(MONSTERS_DIR),
                this.getFilesInDirectory(SPELLS_DIR),
                this.getFilesInDirectory(COMBATS_DIR)
            ]);
            
            // Convert file paths to keys
            monsterFiles.forEach(file => {
                const key = file.replace(MONSTERS_DIR, '').replace('.json', '');
                allFiles.push(`${STORAGE_KEYS.MONSTERS_PREFIX}${key}`);
            });
            
            spellFiles.forEach(file => {
                const key = file.replace(SPELLS_DIR, '').replace('.json', '');
                allFiles.push(`${STORAGE_KEYS.SPELLS_PREFIX}${key}`);
            });
            
            combatFiles.forEach(file => {
                const key = file.replace(COMBATS_DIR, '').replace('.json', '');
                allFiles.push(`${STORAGE_KEYS.COMBATS_PREFIX}${key}`);
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
                this.deleteIndex('SPELLBOOKS'),
                this.deleteIndex('SPELL_CLASS_RELATIONS_INDEX'),
                this.deleteIndex('AVAILABLE_CLASSES_INDEX')
            ]);
        } catch (error) {
            console.error('Error clearing all data:', error);
        }
    }
    
    // Platform-specific operations with migration support
    public async ensureDataDirectory(): Promise<void> {
        const dirs = [DATA_DIR, MONSTERS_DIR, SPELLS_DIR, COMBATS_DIR];
        
        for (const dir of dirs) {
            const dirInfo = await FileSystem.getInfoAsync(dir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
            }
        }
        
        // Check for and migrate legacy data
        await this.migrateLegacyData();
    }
    
    /**
     * Migrate data from legacy directories to new persistent structure
     */
    private async migrateLegacyData(): Promise<void> {
        try {
            console.log('🔍 Checking for legacy data to migrate...');
            
            // Check if legacy directories exist
            const legacyDirs = [LEGACY_DATA_DIR, LEGACY_MONSTERS_DIR, LEGACY_SPELLS_DIR, LEGACY_COMBATS_DIR];
            const legacyExists = await Promise.all(
                legacyDirs.map(dir => FileSystem.getInfoAsync(dir))
            );
            
            const hasLegacyData = legacyExists.some(info => info.exists);
            
            if (!hasLegacyData) {
                console.log('✅ No legacy data found to migrate');
                return;
            }
            
            console.log('🔄 Found legacy data, starting migration...');
            
            // Migrate monsters
            if (legacyExists[2].exists) { // LEGACY_MONSTERS_DIR
                await this.migrateDirectory(LEGACY_MONSTERS_DIR, MONSTERS_DIR, 'monsters');
            }
            
            // Migrate spells
            if (legacyExists[3].exists) { // LEGACY_SPELLS_DIR
                await this.migrateDirectory(LEGACY_SPELLS_DIR, SPELLS_DIR, 'spells');
            }
            
            // Migrate combats
            if (legacyExists[4]) { // LEGACY_COMBATS_DIR
                await this.migrateDirectory(LEGACY_COMBATS_DIR, COMBATS_DIR, 'combats');
            }
            
            // Migrate index files
            await this.migrateIndexFiles();
            
            console.log('✅ Legacy data migration completed successfully');
            
            // Clean up legacy directories after successful migration
            await this.cleanupLegacyDirectories();
            
        } catch (error) {
            console.error('❌ Error during legacy data migration:', error);
            // Don't throw - migration failure shouldn't break the app
        }
    }
    
    /**
     * Migrate files from one directory to another
     */
    private async migrateDirectory(fromDir: string, toDir: string, type: string): Promise<void> {
        try {
            const files = await FileSystem.readDirectoryAsync(fromDir);
            console.log(`📁 Migrating ${files.length} ${type} files from ${fromDir} to ${toDir}`);
            
            for (const file of files) {
                const sourcePath = `${fromDir}${file}`;
                const destPath = `${toDir}${file}`;
                
                try {
                    const content = await FileSystem.readAsStringAsync(sourcePath);
                    await FileSystem.writeAsStringAsync(destPath, content);
                    console.log(`✅ Migrated ${file}`);
                } catch (error) {
                    console.warn(`⚠️ Failed to migrate ${file}:`, error);
                }
            }
        } catch (error) {
            console.error(`❌ Error migrating ${type} directory:`, error);
        }
    }
    
    /**
     * Migrate index files from legacy location
     */
    private async migrateIndexFiles(): Promise<void> {
        const indexFiles = [
            { legacy: `${LEGACY_DATA_DIR}beasts_index.json`, new: BEASTS_INDEX_FILE },
            { legacy: `${LEGACY_DATA_DIR}spells_index.json`, new: SPELLS_INDEX_FILE },
            { legacy: `${LEGACY_DATA_DIR}combats_index.json`, new: COMBATS_INDEX_FILE },
            { legacy: `${LEGACY_DATA_DIR}players.json`, new: PLAYERS_FILE },
            { legacy: `${LEGACY_DATA_DIR}spellbooks.json`, new: SPELLBOOKS_FILE },
            { legacy: `${LEGACY_DATA_DIR}campaigns.json`, new: `${DATA_DIR}campaigns.json` },
    
            { legacy: `${LEGACY_DATA_DIR}spell_class_relations_index.json`, new: `${DATA_DIR}spell_class_relations_index.json` },
            { legacy: `${LEGACY_DATA_DIR}available_classes_index.json`, new: `${DATA_DIR}available_classes_index.json` }
        ];
        
        for (const file of indexFiles) {
            try {
                const legacyInfo = await FileSystem.getInfoAsync(file.legacy);
                if (legacyInfo.exists) {
                    const content = await FileSystem.readAsStringAsync(file.legacy);
                    await FileSystem.writeAsStringAsync(file.new, content);
                    console.log(`✅ Migrated index file: ${file.legacy} -> ${file.new}`);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to migrate index file ${file.legacy}:`, error);
            }
        }
    }
    
    /**
     * Clean up legacy directories after successful migration
     */
    private async cleanupLegacyDirectories(): Promise<void> {
        try {
            const legacyDirs = [LEGACY_MONSTERS_DIR, LEGACY_SPELLS_DIR, LEGACY_COMBATS_DIR, LEGACY_DATA_DIR];
            
            for (const dir of legacyDirs) {
                try {
                    const dirInfo = await FileSystem.getInfoAsync(dir);
                    if (dirInfo.exists) {
                        await FileSystem.deleteAsync(dir, { idempotent: true });
                        console.log(`🗑️ Cleaned up legacy directory: ${dir}`);
                    }
                } catch (error) {
                    console.warn(`⚠️ Failed to clean up legacy directory ${dir}:`, error);
                }
            }
        } catch (error) {
            console.error('❌ Error during legacy cleanup:', error);
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
    public override async storeBeastsIndex(beasts: any[]): Promise<void> {
        console.log('storeBeastsIndex (mobile) called with', beasts.length, 'beasts');
        await super.storeBeastsIndex(beasts);
    }
    
    // Override storeSpellsIndex to add mobile-specific logging
    public override async storeSpellsIndex(spells: any[]): Promise<void> {
        console.log('storeSpellsIndex (mobile) called with', spells.length, 'spells');
        await super.storeSpellsIndex(spells);
    }
}
