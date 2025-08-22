import { loadLocalData, loadBestiaryData, loadSpellData } from './localDataLoader';

/**
 * Test function to verify local data loading works
 */
export async function testLocalDataLoading() {
    console.log('🧪 Testing local data loading...');
    
    try {
        // Test loading MM bestiary data
        console.log('📖 Loading Monster Manual data...');
        const mmData = await loadBestiaryData('MM');
        console.log(`✅ Loaded ${mmData.length} monsters from MM`);
        
        // Test loading PHB spell data
        console.log('✨ Loading Player Handbook spell data...');
        const phbSpells = await loadSpellData('PHB');
        console.log(`✅ Loaded ${phbSpells.length} spells from PHB`);
        
        // Test loading XGE spell data
        console.log('📚 Loading Xanathar\'s Guide spell data...');
        const xgeSpells = await loadSpellData('XGE');
        console.log(`✅ Loaded ${xgeSpells.length} spells from XGE`);
        
        // Show some sample data
        if (mmData.length > 0) {
            const sampleMonster = mmData[0];
            console.log('🐉 Sample monster:', {
                name: sampleMonster.name,
                cr: sampleMonster.cr,
                type: sampleMonster.type,
                size: sampleMonster.size
            });
        }
        
        if (phbSpells.length > 0) {
            const sampleSpell = phbSpells[0];
            console.log('✨ Sample spell:', {
                name: sampleSpell.name,
                level: sampleSpell.level,
                school: sampleSpell.school
            });
        }
        
        console.log('✅ Local data loading test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Local data loading test failed:', error);
        return false;
    }
}

/**
 * Test function to verify data structure
 */
export function testDataStructure() {
    console.log('🔍 Testing data structure...');
    
    try {
        // Test that we can require the data files
        const mmData = require('./local/bestiary-mm.json');
        const phbSpells = require('./local/spells-phb.json');
        const xgeSpells = require('./local/spells-xge.json');
        
        console.log('✅ All data files can be required');
        console.log(`📊 MM has ${Array.isArray(mmData) ? mmData.length : 'invalid'} monsters`);
        console.log(`📊 PHB has ${Array.isArray(phbSpells) ? phbSpells.length : 'invalid'} spells`);
        console.log(`📊 XGE has ${Array.isArray(xgeSpells) ? xgeSpells.length : 'invalid'} spells`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Data structure test failed:', error);
        return false;
    }
}

/**
 * Test function to verify specific data files
 */
export function testSpecificFiles() {
    console.log('🔍 Testing specific data files...');
    
    const files = [
        { name: 'Monster Manual', path: './local/bestiary-mm.json' },
        { name: 'PHB Monsters', path: './local/bestiary-phb.json' },
        { name: 'PHB Spells', path: './local/spells-phb.json' },
        { name: 'XGE Spells', path: './local/spells-xge.json' }
    ];
    
    files.forEach(file => {
        try {
            const data = require(file.path);
            console.log(`✅ ${file.name}: ${Array.isArray(data) ? data.length : 'invalid'} entries`);
        } catch (error) {
            console.error(`❌ ${file.name}: Failed to load - ${error}`);
        }
    });
}
