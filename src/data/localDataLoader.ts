import { BESTIARY_INDEX, SPELLS_INDEX, getSourceName } from './local/index';
import { resolveMonster } from './resolveMonster';

// Local data cache
const dataCache = new Map<string, any>();

// Cache for resolved monsters (to avoid re-resolving)
const resolvedMonstersCache = new Map<string, any>();

// Static imports for all data files
const localDataFiles: { [key: string]: any } = {
    'bestiary-aatm.json': require('./local/bestiary-aatm.json'),
    'bestiary-ai.json': require('./local/bestiary-ai.json'),
    'bestiary-aitfr-dn.json': require('./local/bestiary-aitfr-dn.json'),
    'bestiary-aitfr-fcd.json': require('./local/bestiary-aitfr-fcd.json'),
    'bestiary-aitfr-isf.json': require('./local/bestiary-aitfr-isf.json'),
    'bestiary-aitfr-thp.json': require('./local/bestiary-aitfr-thp.json'),
    'bestiary-awm.json': require('./local/bestiary-awm.json'),
    'bestiary-bam.json': require('./local/bestiary-bam.json'),
    'bestiary-bgdia.json': require('./local/bestiary-bgdia.json'),
    'bestiary-bgg.json': require('./local/bestiary-bgg.json'),
    'bestiary-bmt.json': require('./local/bestiary-bmt.json'),
    'bestiary-cm.json': require('./local/bestiary-cm.json'),
    'bestiary-coa.json': require('./local/bestiary-coa.json'),
    'bestiary-cos.json': require('./local/bestiary-cos.json'),
    'bestiary-crcotn.json': require('./local/bestiary-crcotn.json'),
    'bestiary-dc.json': require('./local/bestiary-dc.json'),
    'bestiary-dip.json': require('./local/bestiary-dip.json'),
    'bestiary-ditlcot.json': require('./local/bestiary-ditlcot.json'),
    'bestiary-dmg.json': require('./local/bestiary-dmg.json'),
    'bestiary-dod.json': require('./local/bestiary-dod.json'),
    'bestiary-dosi.json': require('./local/bestiary-dosi.json'),
    'bestiary-dsotdq.json': require('./local/bestiary-dsotdq.json'),
    'bestiary-egw.json': require('./local/bestiary-egw.json'),
    'bestiary-erlw.json': require('./local/bestiary-erlw.json'),
    'bestiary-esk.json': require('./local/bestiary-esk.json'),
    'bestiary-ftd.json': require('./local/bestiary-ftd.json'),
    'bestiary-ggr.json': require('./local/bestiary-ggr.json'),
    'bestiary-gos.json': require('./local/bestiary-gos.json'),
    'bestiary-gotsf.json': require('./local/bestiary-gotsf.json'),
    'bestiary-hat-tg.json': require('./local/bestiary-hat-tg.json'),
    'bestiary-hftt.json': require('./local/bestiary-hftt.json'),
    'bestiary-hol.json': require('./local/bestiary-hol.json'),
    'bestiary-hotdq.json': require('./local/bestiary-hotdq.json'),
    'bestiary-idrotf.json': require('./local/bestiary-idrotf.json'),
    'bestiary-imr.json': require('./local/bestiary-imr.json'),
    'bestiary-jttrc.json': require('./local/bestiary-jttrc.json'),
    'bestiary-kftgv.json': require('./local/bestiary-kftgv.json'),
    'bestiary-kkw.json': require('./local/bestiary-kkw.json'),
    'bestiary-llk.json': require('./local/bestiary-llk.json'),
    'bestiary-lmop.json': require('./local/bestiary-lmop.json'),
    'bestiary-lox.json': require('./local/bestiary-lox.json'),
    'bestiary-lr.json': require('./local/bestiary-lr.json'),
    'bestiary-lrdt.json': require('./local/bestiary-lrdt.json'),
    'bestiary-mabjov.json': require('./local/bestiary-mabjov.json'),
    'bestiary-mcv1sc.json': require('./local/bestiary-mcv1sc.json'),
    'bestiary-mcv2dc.json': require('./local/bestiary-mcv2dc.json'),
    'bestiary-mcv3mc.json': require('./local/bestiary-mcv3mc.json'),
    'bestiary-mcv4ec.json': require('./local/bestiary-mcv4ec.json'),
    'bestiary-mff.json': require('./local/bestiary-mff.json'),
    'bestiary-mgelft.json': require('./local/bestiary-mgelft.json'),
    'bestiary-mismv1.json': require('./local/bestiary-mismv1.json'),
    'bestiary-mm.json': require('./local/bestiary-mm.json'),
    'bestiary-mot.json': require('./local/bestiary-mot.json'),
    'bestiary-mpmm.json': require('./local/bestiary-mpmm.json'),
    'bestiary-mpp.json': require('./local/bestiary-mpp.json'),
    'bestiary-mtf.json': require('./local/bestiary-mtf.json'),
    'bestiary-nrh-ass.json': require('./local/bestiary-nrh-ass.json'),
    'bestiary-nrh-at.json': require('./local/bestiary-nrh-at.json'),
    'bestiary-nrh-avitw.json': require('./local/bestiary-nrh-avitw.json'),
    'bestiary-nrh-awol.json': require('./local/bestiary-nrh-awol.json'),
    'bestiary-nrh-coi.json': require('./local/bestiary-nrh-coi.json'),
    'bestiary-nrh-tcmc.json': require('./local/bestiary-nrh-tcmc.json'),
    'bestiary-nrh-tlt.json': require('./local/bestiary-nrh-tlt.json'),
    'bestiary-oota.json': require('./local/bestiary-oota.json'),
    'bestiary-oow.json': require('./local/bestiary-oow.json'),
    'bestiary-pabtso.json': require('./local/bestiary-pabtso.json'),
    'bestiary-phb.json': require('./local/bestiary-phb.json'),
    'bestiary-pota.json': require('./local/bestiary-pota.json'),
    'bestiary-ps-a.json': require('./local/bestiary-ps-a.json'),
    'bestiary-ps-d.json': require('./local/bestiary-ps-d.json'),
    'bestiary-ps-i.json': require('./local/bestiary-ps-i.json'),
    'bestiary-ps-k.json': require('./local/bestiary-ps-k.json'),
    'bestiary-ps-x.json': require('./local/bestiary-ps-x.json'),
    'bestiary-ps-z.json': require('./local/bestiary-ps-z.json'),
    'bestiary-qftis.json': require('./local/bestiary-qftis.json'),
    'bestiary-rmbre.json': require('./local/bestiary-rmbre.json'),
    'bestiary-rot.json': require('./local/bestiary-rot.json'),
    'bestiary-rtg.json': require('./local/bestiary-rtg.json'),
    'bestiary-sads.json': require('./local/bestiary-sads.json'),
    'bestiary-scc.json': require('./local/bestiary-scc.json'),
    'bestiary-sdw.json': require('./local/bestiary-sdw.json'),
    'bestiary-skt.json': require('./local/bestiary-skt.json'),
    'bestiary-slw.json': require('./local/bestiary-slw.json'),
    'bestiary-tce.json': require('./local/bestiary-tce.json'),
    'bestiary-tdcsr.json': require('./local/bestiary-tdcsr.json'),
    'bestiary-tftyp.json': require('./local/bestiary-tftyp.json'),
    'bestiary-toa.json': require('./local/bestiary-toa.json'),
    'bestiary-tofw.json': require('./local/bestiary-tofw.json'),
    'bestiary-ttp.json': require('./local/bestiary-ttp.json'),
    'bestiary-vd.json': require('./local/bestiary-vd.json'),
    'bestiary-veor.json': require('./local/bestiary-veor.json'),
    'bestiary-vgm.json': require('./local/bestiary-vgm.json'),
    'bestiary-vrgr.json': require('./local/bestiary-vrgr.json'),
    'bestiary-wbtw.json': require('./local/bestiary-wbtw.json'),
    'bestiary-wdh.json': require('./local/bestiary-wdh.json'),
    'bestiary-wdmm.json': require('./local/bestiary-wdmm.json'),
    'bestiary-xdmg.json': require('./local/bestiary-xdmg.json'),
    'bestiary-xge.json': require('./local/bestiary-xge.json'),
    'bestiary-xmm.json': require('./local/bestiary-xmm.json'),
    'bestiary-xphb.json': require('./local/bestiary-xphb.json'),
    'spells-aag.json': require('./local/spells-aag.json'),
    'spells-ai.json': require('./local/spells-ai.json'),
    'spells-aitfr-avt.json': require('./local/spells-aitfr-avt.json'),
    'spells-bmt.json': require('./local/spells-bmt.json'),
    'spells-egw.json': require('./local/spells-egw.json'),
    'spells-ftd.json': require('./local/spells-ftd.json'),
    'spells-ggr.json': require('./local/spells-ggr.json'),
    'spells-idrotf.json': require('./local/spells-idrotf.json'),
    'spells-llk.json': require('./local/spells-llk.json'),
    'spells-phb.json': require('./local/spells-phb.json'),
    'spells-sato.json': require('./local/spells-sato.json'),
    'spells-scc.json': require('./local/spells-scc.json'),
    'spells-tce.json': require('./local/spells-tce.json'),
    'spells-tdcsr.json': require('./local/spells-tdcsr.json'),
    'spells-xge.json': require('./local/spells-xge.json'),
    'spells-xphb.json': require('./local/spells-xphb.json'),
};

console.log(`📊 Loaded ${Object.keys(localDataFiles).length} data files`);

/**
 * Load data from local JSON files
 */
export async function loadLocalData<T>(filePath: string): Promise<T> {
    if (dataCache.has(filePath)) {
        return dataCache.get(filePath);
    }

    try {
        // Check if we have the file in our static imports
        if (localDataFiles[filePath]) {
            const data = localDataFiles[filePath];
            dataCache.set(filePath, data);
            return data;
        }

        throw new Error(`Local data file not found: ${filePath}`);
    } catch (error) {
        console.error(`Failed to load local data from ${filePath}:`, error);
        throw error;
    }
}

/**
 * Load bestiary data for a specific source
 */
export async function loadBestiaryData(sourceCode: string): Promise<any[]> {
    const fileName = BESTIARY_INDEX[sourceCode as keyof typeof BESTIARY_INDEX];
    if (!fileName) {
        throw new Error(`Unknown bestiary source: ${sourceCode}`);
    }

    const data = await loadLocalData(fileName);
    // Handle the structure: { "monster": [...] }
    if (data && typeof data === 'object' && 'monster' in data && Array.isArray((data as any).monster)) {
        return (data as any).monster;
    }
    // Fallback for direct array
    return Array.isArray(data) ? data : [];
}

/**
 * Load spell data for a specific source
 */
export async function loadSpellData(sourceCode: string): Promise<any[]> {
    const fileName = SPELLS_INDEX[sourceCode as keyof typeof SPELLS_INDEX];
    if (!fileName) {
        throw new Error(`Unknown spell source: ${sourceCode}`);
    }

    const data = await loadLocalData(fileName);
    // Handle the structure: { "spell": [...] }
    if (data && typeof data === 'object' && 'spell' in data && Array.isArray((data as any).spell)) {
        return (data as any).spell;
    }
    // Fallback for direct array
    return Array.isArray(data) ? data : [];
}

/**
 * Load all available bestiary data
 */
export async function loadAllBestiaryData(): Promise<{ [source: string]: any[] }> {
    const allData: { [source: string]: any[] } = {};
    
    // First pass: load all monsters without resolving
    for (const [sourceCode, fileName] of Object.entries(BESTIARY_INDEX)) {
        try {
            const data = await loadBestiaryData(sourceCode);
            if (data.length > 0) {
                allData[sourceCode] = data;
                console.log(`✅ Loaded ${data.length} monsters from ${sourceCode}`);
            }
        } catch (error) {
            console.warn(`Failed to load bestiary data for ${sourceCode}:`, error);
            allData[sourceCode] = [];
        }
    }
    
    // Second pass: resolve all monsters that have _copy structures
    const allMonsters = Object.values(allData).flat();
    console.log(`🔄 Resolving ${allMonsters.length} monsters with _copy structures...`);
    
    for (const sourceCode of Object.keys(allData)) {
        allData[sourceCode] = allData[sourceCode].map(monster => {
            try {
                return resolveMonster(monster, allMonsters);
            } catch (error) {
                console.warn(`Failed to resolve monster ${monster.name} (${sourceCode}):`, error);
                return monster; // Return original if resolution fails
            }
        });
    }
    
    console.log(`✅ Monster resolution completed`);
    return allData;
}

/**
 * Load all available spell data
 */
export async function loadAllSpellData(): Promise<{ [source: string]: any[] }> {
    const allData: { [source: string]: any[] } = {};
    
    for (const [sourceCode, fileName] of Object.entries(SPELLS_INDEX)) {
        try {
            const data = await loadSpellData(sourceCode);
            if (data.length > 0) {
                allData[sourceCode] = data;
                console.log(`✅ Loaded ${data.length} spells from ${sourceCode}`);
            }
        } catch (error) {
            console.warn(`Failed to load spell data for ${sourceCode}:`, error);
            allData[sourceCode] = [];
        }
    }
    
    return allData;
}

/**
 * Create an index for bestiary data (similar to your current index structure)
 */
export function createBestiaryIndex(bestiaryData: { [source: string]: any[] }): any[] {
    const index: any[] = [];
    
    Object.entries(bestiaryData).forEach(([sourceCode, monsters]) => {
        monsters.forEach((monster: any) => {
            if (monster.name) {
                index.push({
                    id: `${monster.name}-${sourceCode}`,
                    name: monster.name,
                    cr: monster.cr || monster.CR,
                    type: monster.type,
                    source: sourceCode,
                    sourceName: getSourceName(sourceCode),
                    ac: monster.ac,
                    size: monster.size,
                    alignment: monster.alignment,
                    file: BESTIARY_INDEX[sourceCode as keyof typeof BESTIARY_INDEX]
                });
            }
        });
    });
    
    return index;
}

/**
 * Create an index for spell data
 */
export function createSpellIndex(spellData: { [source: string]: any[] }): any[] {
    const index: any[] = [];
    
    Object.entries(spellData).forEach(([sourceCode, spells]) => {
        spells.forEach((spell: any) => {
            if (spell.name) {
                index.push({
                    id: `${spell.name}-${sourceCode}`,
                    name: spell.name,
                    level: spell.level,
                    school: spell.school,
                    source: sourceCode,
                    sourceName: getSourceName(sourceCode),
                    availableClasses: spell.classes || [],
                    ritual: spell.ritual || false,
                    concentration: spell.concentration || false,
                    file: SPELLS_INDEX[sourceCode as keyof typeof SPELLS_INDEX]
                });
            }
        });
    });
    
    return index;
}

/**
 * Find a specific monster by name and source
 */
export async function findMonster(name: string, source: string): Promise<any | null> {
    try {
        // Check if we have resolved monsters cached
        const cacheKey = `${source}-resolved`;
        let resolvedMonsters = resolvedMonstersCache.get(cacheKey);
        
        if (!resolvedMonsters) {
            // Load and resolve monsters for this source
            const allData = await loadAllBestiaryData();
            resolvedMonsters = allData[source] || [];
            resolvedMonstersCache.set(cacheKey, resolvedMonsters);
        }
        
        return resolvedMonsters.find((monster: any) => 
            monster.name && monster.name.toLowerCase() === name.toLowerCase()
        ) || null;
    } catch (error) {
        console.error(`Failed to find monster ${name} in ${source}:`, error);
        return null;
    }
}

/**
 * Find a specific spell by name and source
 */
export async function findSpell(name: string, source: string): Promise<any | null> {
    try {
        const spells = await loadSpellData(source);
        return spells.find((spell: any) => 
            spell.name && spell.name.toLowerCase() === name.toLowerCase()
        ) || null;
    } catch (error) {
        console.error(`Failed to find spell ${name} in ${source}:`, error);
        return null;
    }
}

/**
 * Clear the data cache
 */
export function clearDataCache(): void {
    dataCache.clear();
    resolvedMonstersCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
    return {
        size: dataCache.size,
        keys: Array.from(dataCache.keys())
    };
}

/**
 * Get available data files
 */
export function getAvailableDataFiles(): string[] {
    return Object.keys(localDataFiles);
}
