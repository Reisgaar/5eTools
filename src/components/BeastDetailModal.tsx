import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useModal } from 'src/context/ModalContext';
import { ALIGNMENTS, SIZES, STATS } from 'src/data/helpers';
import { parseDiceExpression, renderEntries, rollDice } from 'src/utils/replaceTags';
import Separator from './Separator';

interface BeastDetailModalProps {
    visible: boolean;
    beast: Record<string, any> | null;
    onClose: () => void;
    theme: any;
    onCreaturePress?: (name: string) => void;
    onSpellPress?: (name: string) => void;
}

function getTokenUrl(beast: any): string | null {
    if (!beast.hasToken || !beast.source || !beast.name) return null;
    const encodedName = encodeURIComponent(beast.name);
    return `https://5e.tools/img/bestiary/tokens/${beast.source}/${encodedName}.webp`;
}

function getAbilityMod(score: number) {
    if (typeof score !== 'number') return '';
    const mod = Math.floor((score - 10) / 2);
    return (mod >= 0 ? '+' : '') + mod;
}

function formatArray(arr: any, joiner = ', ') {
    if (!arr) return '';
    if (Array.isArray(arr)) {
        return arr.map((v) => typeof v === 'string' ? v : v.name || JSON.stringify(v)).join(joiner);
    }
    // If it's a string or single value, just return it as string
    if (typeof arr === 'string') return arr;
    if (typeof arr === 'object' && arr.name) return arr.name;
    return String(arr);
}

function formatAC(ac: any): string {
    if (!ac) return 'Unknown';
    if (Array.isArray(ac)) {
        return ac.map(a => formatAC(a)).join(', ');
    }
    if (typeof ac === 'object' && ac !== null) {
        if ('special' in ac) {
            return ac.special;
        }
        if ('number' in ac) {
            return ac.number + (ac.condition ? ` (${ac.condition})` : '');
        }
        // Defensive: avoid infinite recursion
        if (ac === ac.ac || ac === ac.value || ac === ac.armor) {
            // If the value is the same object, break recursion
            return '?';
        }
        const acValue = ac.ac || ac.value || ac.armor;
        const from = ac.from || ac.condition || ac.note;
        if (typeof acValue === 'object' && acValue !== null) {
            // If still an object, but not the same as ac, recurse
            if (acValue !== ac) {
                return formatAC(acValue) + (from ? ` (${formatArray(from)})` : '');
            } else {
                // Defensive: break recursion
                return '?';
            }
        }
        if (acValue !== undefined) {
            return acValue + (from ? ` (${formatArray(from)})` : '');
        }
        // Fallback: show JSON
        return JSON.stringify(ac);
    }
    return String(ac);
}

// Helper function to extract AC value for combat
export function extractACValue(ac: any): number {
    if (!ac) return 0;
    
    // Handle array of AC objects
    if (Array.isArray(ac)) {
        const firstAC = ac[0];
        if (typeof firstAC === 'object' && firstAC !== null) {
            return Number(firstAC.ac || firstAC.value || firstAC.armor || 0);
        }
        return Number(firstAC || 0);
    }
    
    // Handle single AC object
    if (typeof ac === 'object' && ac !== null) {
        return Number(ac.ac || ac.value || ac.armor || 0);
    }
    
    // Handle simple values
    return Number(ac) || 0;
}

function formatHP(hp: any) {
    if (!hp) return '';
    if (typeof hp === 'object') {
        return `${hp.average} (${hp.formula})`;
    }
    return String(hp);
}

function formatSpeed(speed: any): string {
    if (!speed) return '';
    if (typeof speed === 'object') {
        return Object.entries(speed).map(([k, v]) => {
            if (typeof v === 'object' && v !== null) {
                let str = '';
                if ('number' in v) str += v.number;
                if ('condition' in v) str += ` (${v.condition})`;
                return `${k[0].toUpperCase() + k.slice(1)} ${str} ft.`;
            }
            return `${k[0].toUpperCase() + k.slice(1)} ${v} ft.`;
        }).join(', ');
    }
    return String(speed);
}

function formatSize(size: any) {
    if (!size) return '';
    if (Array.isArray(size)) {
        return size.map((s: keyof typeof SIZES) => SIZES[s] || s).join(', ');
    }
    return SIZES[size as keyof typeof SIZES] || size;
}

function formatAlignment(alignment: any, prefix?: string) {
    if (!alignment) return '';
    // If alignment is a string or array of strings, map initials
    if (typeof alignment === 'string') {
        return ALIGNMENTS[alignment as keyof typeof ALIGNMENTS] || alignment;
    }
    if (Array.isArray(alignment)) {
        return alignment.map((a: keyof typeof ALIGNMENTS) => ALIGNMENTS[a] || a).join(' ');
    }
    // If alignment is an object (special case), show as-is
    if (typeof alignment === 'object') {
        if (alignment.special) return alignment.special;
        if (alignment.alignment) {
            // e.g. { alignment: ["C", "G"], note: "..." }
            const base = Array.isArray(alignment.alignment)
                ? alignment.alignment.map((a: keyof typeof ALIGNMENTS) => ALIGNMENTS[a] || a).join(' ')
                : ALIGNMENTS[alignment.alignment as keyof typeof ALIGNMENTS] || alignment.alignment;
            if (alignment.note) return `${base} (${alignment.note})`;
            if (alignment.chance) return `${base} (${alignment.chance}%)`;
            return base;
        }
        // fallback: show JSON
        return JSON.stringify(alignment);
    }
    return String(alignment);
}

function formatType(type: any): string {
    if (!type) return '';
    if (typeof type === 'string') return type;
    if (typeof type === 'object') {
        let result = type.type || '';
        if (type.tags && Array.isArray(type.tags) && type.tags.length > 0) {
            result += ` (${type.tags.join(', ')})`;
        }
        return result;
    }
    return String(type);
}

function formatSenses(senses: any, passive: any) {
    let s = Array.isArray(senses) ? senses.join(', ') : senses || '';
    if (passive) s += (s ? ', ' : '') + `Passive Perception ${passive}`;
    return s;
}

function formatSaves(saves: any): string {
    if (!saves) return '';
    if (typeof saves === 'object') {
        return Object.entries(saves).map(([ability, bonus]) => `${ability.toUpperCase()} ${bonus}`).join(', ');
    }
    return String(saves);
}

function formatSkills(skills: any): string {
    if (!skills) return '';
    if (typeof skills === 'object') {
        return Object.entries(skills).map(([skill, bonus]) => `${skill} ${bonus}`).join(', ');
    }
    return String(skills);
}

function formatImmunities(immune: any): string {
    if (!immune) return '';
    if (Array.isArray(immune)) {
        return immune.map(item => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && item.immune) {
                const base = Array.isArray(item.immune) ? item.immune.join(', ') : item.immune;
                return `${base}${item.note ? ` (${item.note})` : ''}`;
            }
            return JSON.stringify(item);
        }).join(', ');
    }
    return String(immune);
}

function formatConditionImmunities(conditionImmune: any): string {
    if (!conditionImmune) return '';
    if (Array.isArray(conditionImmune)) {
        return conditionImmune.join(', ');
    }
    return String(conditionImmune);
}

function formatSpellcasting(spellcasting: any, theme: any, onCreaturePress?: (name: string) => void, onSpellPress?: (name: string) => void, handleDamagePress?: (expr: string) => void, handleHitPress?: (bonus: string) => void) {
    if (!spellcasting) return null;
    if (!Array.isArray(spellcasting)) spellcasting = [spellcasting];
    return spellcasting.map((sc: any, i: number) => (
        <View key={i} style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold', color: theme.text }}>{sc.name || 'Spellcasting'}{sc.displayAs ? ` (${sc.displayAs})` : ''}.</Text>
            {sc.headerEntries && (
                <Text style={{ color: theme.text }}>{renderEntries(sc.headerEntries, 0, theme, onCreaturePress, onSpellPress, {}, handleDamagePress, handleHitPress)}</Text>
            )}
            {/* Spellbook style */}
            {sc.spells && (
                <View style={{ marginTop: 4 }}>
                    {/* Cantrips */}
                    {sc.spells['0'] && (
                        <Text style={{ marginBottom: 2, color: theme.text }}>
                            <Text style={{ fontWeight: 'bold', color: theme.text }}>Cantrips (at will): </Text>
                            {sc.spells['0'].spells.map((spell: string, idx: number) => (
                                <Text style={{ color: theme.text }} key={idx}>{renderEntries(spell, 0, theme, onCreaturePress, onSpellPress, {}, handleDamagePress, handleHitPress)}{idx < sc.spells['0'].spells.length - 1 ? ', ' : ''}</Text>
                            ))}
                        </Text>
                    )}
                    {/* Spell levels 1-9 */}
                    {Object.entries(sc.spells).filter(([lvl]) => lvl !== '0').map(([lvl, data]: [string, any]) => (
                        <Text key={lvl} style={{ marginBottom: 2, color: theme.text }}>
                            <Text style={{ fontWeight: 'bold', color: theme.text }}>Level {lvl}{data.slots ? ` (${data.slots} slots)` : ''}: </Text>
                            {data.spells.map((spell: string, idx: number) => (
                                <Text style={{ color: theme.text }} key={idx}>{renderEntries(spell, 0, theme, onCreaturePress, onSpellPress, {}, handleDamagePress, handleHitPress)}{idx < data.spells.length - 1 ? ', ' : ''}</Text>
                            ))}
                        </Text>
                    ))}
                </View>
            )}
            {/* Daily spells */}
            {sc.daily && (
                <Text style={{ color: theme.text }}>
                    {Object.entries(sc.daily).map(([level, spells]: [string, any], idx: number) => (
                        <Text style={{ color: theme.text }} key={level}>
                            {level.replace('e', '/day')}: {renderEntries(spells, 0, theme, onCreaturePress, onSpellPress, {}, handleDamagePress, handleHitPress)}{idx < Object.entries(sc.daily).length - 1 ? '\n' : ''}
                        </Text>
                    ))}
                </Text>
            )}
        </View>
    ));
}

function preprocessSpellcastingBlock(sc: any) {
    const entries: any[] = [];
    if (sc.headerEntries) {
        if (Array.isArray(sc.headerEntries)) {
            entries.push(...sc.headerEntries);
        } else {
            entries.push(sc.headerEntries);
        }
    }
    if (sc.will) {
        entries.push({ type: 'list', name: 'At will', items: sc.will });
    }
    if (sc.daily) {
        Object.entries(sc.daily).forEach(([freq, spells]) => {
            entries.push({ type: 'list', name: `${freq}/day`, items: spells });
        });
    }
    if (sc.spells) {
        Object.entries(sc.spells).forEach(([level, data]: [string, any]) => {
            if (data && data.spells) {
                entries.push({ type: 'list', name: `Level ${level}${data.slots ? ` (${data.slots} slots)` : ''}`, items: data.spells });
            }
        });
    }
    if (sc.routine) {
        entries.push({ type: 'list', name: 'Routine', items: sc.routine });
    }
    if (sc.ritual) {
        entries.push({ type: 'list', name: 'Ritual', items: sc.ritual });
    }
    if (sc.innate) {
        entries.push({ type: 'list', name: 'Innate', items: sc.innate });
    }
    // Add any other custom fields as needed
    return {
        type: 'entries',
        name: sc.name || 'Spellcasting',
        entries,
    };
}

function formatTraits(traits: any, theme: any, onCreaturePress?: (name: string) => void, onSpellPress?: (name: string) => void) {
    if (!traits) return null;
    if (!Array.isArray(traits)) traits = [traits];
    return traits.map((trait: any, i: number) => (
        <View key={i} style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold', color: theme.text }}>{trait.name}.</Text>
            {Array.isArray(trait.entries)
                ? trait.entries.map((e: any, j: number) => (
                    <View key={j}>{renderEntries(e, 0, theme, onCreaturePress, onSpellPress)}</View>
                ))
                : <View>{renderEntries(trait.entries, 0, theme, onCreaturePress, onSpellPress)}</View>}
        </View>
    ));
}

function formatActions(actions: any, label = 'Actions', theme: any, onCreaturePress?: (name: string) => void, onSpellPress?: (name: string) => void) {
    if (!actions) return null;
    if (!Array.isArray(actions)) actions = [actions];
    return (
        <View style={{ marginBottom: 10 }}>
            {actions.map((action: any, i: number) => (
                <View key={i} style={{ marginBottom: 8 }}>
                    <Text style={{ fontWeight: 'bold', color: theme.text }}>{action.name}.</Text>
                    {Array.isArray(action.entries)
                        ? action.entries.map((e: any, j: number) => (
                            <View key={j}>{renderEntries(e, 0, theme, onCreaturePress, onSpellPress)}</View>
                        ))
                        : <View>{renderEntries(action.entries, 0, theme, onCreaturePress, onSpellPress)}</View>}
                </View>
            ))}
        </View>
    );
}

function formatCR(cr: any) {
    if (!cr) return '';
    if (typeof cr === 'object') {
        // e.g. { cr: '1/2', xp: 100 }
        let str = '';
        if (cr.cr) str += cr.cr;
        if (cr.xp) str += ` (XP ${cr.xp})`;
        if (cr.pb) str += `; PB +${cr.pb}`;
        return str;
    }
    return String(cr);
}

const BeastDetailModal: React.FC<BeastDetailModalProps> = ({ visible, beast, onClose, theme, onCreaturePress, onSpellPress }) => {
    const [showFullImage, setShowFullImage] = React.useState(false);
    const { openSpellModal, openBeastModal, openDiceModal } = useModal();
    const { simpleSpells, simpleBeasts } = require('src/context/DataContext').useData();

    const handleCreaturePressLocal = (name: string) => {
      // Find the beast object by name
      const beast = simpleBeasts.find((b: any) => b.name.trim().toLowerCase() === name.trim().toLowerCase());
      if (beast) {
        openBeastModal(beast, true);
      }
    };

    const handleSpellPressLocal = (name: string) => {
      // Find the spell object by name
      const spell = simpleSpells.find((s: any) => s.name.trim().toLowerCase() === name.trim().toLowerCase());
      if (spell) {
        openSpellModal(spell, true);
      }
    };

    function handleDamagePress(expr: string) {
        const parsed = parseDiceExpression(expr);
        if (!parsed) return;
        const { numDice, diceType, modifier } = parsed;
        const { result, breakdown } = rollDice(numDice, diceType, modifier);
        openDiceModal({
            expression: expr,
            result,
            breakdown,
            modifier: modifier !== 0 ? modifier : undefined,
            type: 'damage',
            label: '',
        });
    }
    function handleHitPress(bonus: string) {
        const bonusNum = parseInt(bonus, 10) || 0;
        const roll = Math.floor(Math.random() * 20) + 1;
        openDiceModal({
            expression: `1d20 + ${bonusNum}`,
            result: roll + bonusNum,
            breakdown: [roll],
            modifier: bonusNum !== 0 ? bonusNum : undefined,
            type: 'hit',
            label: '',
        });
    }
    
    function handleSaveRoll(statKey: string, statLabel: string) {
        if (!beast) return;
        // Get save bonus from beast.save if present, else use ability mod
        let bonus = 0;
        let bonusStr = '';
        if (beast.save && beast.save[statKey] !== undefined) {
            // beast.save[statKey] can be '+5' or 5
            bonusStr = String(beast.save[statKey]);
            bonus = parseInt(bonusStr, 10) || 0;
        } else {
            // Use ability modifier
            const statValue = beast[statKey];
            bonus = typeof statValue === 'number' ? Math.floor((statValue - 10) / 2) : 0;
            bonusStr = bonus >= 0 ? `+${bonus}` : String(bonus);
        }
        const roll = Math.floor(Math.random() * 20) + 1;
        openDiceModal({
            expression: `1d20 ${bonus >= 0 ? '+' : ''}${bonus}`,
            result: roll + bonus,
            breakdown: [roll],
            modifier: bonus !== 0 ? bonus : undefined,
            type: 'save',
            label: `${statLabel} Saving Throw`,
        });
    }
    
    if (!visible) return null;
    if (!beast) {
        return (
            <View style={styles.overlay} pointerEvents="auto">
                <View style={[styles.content, { backgroundColor: theme.card, justifyContent: 'center', alignItems: 'center' }]}> 
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            </View>
        );
    }

    const tokenUrl = getTokenUrl(beast);
    
    function getFullImageUrl(beast: any): string | null {
        if (!beast.source || !beast.name) return null;
        const encodedName = encodeURIComponent(beast.name);
        return `https://5e.tools/img/bestiary/${beast.source}/${encodedName}.webp`;
    }
    
    const fullImageUrl = getFullImageUrl(beast);
    
    const handleTokenPress = () => {
        if (fullImageUrl) {
            setShowFullImage(!showFullImage);
        }
    };
    console.log(JSON.stringify(beast, null, 2));
    
    return (
        <>
        <View style={styles.overlay} pointerEvents="auto">
            <View style={[styles.content, { backgroundColor: theme.card, paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0, borderWidth: 2, borderColor: theme.primary }]}> 
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 18 }}>✕</Text>
                </TouchableOpacity>

                    {/* Name, Source, Page */}
                    <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 5, borderBottomWidth: 2, borderBottomColor: theme.primary }}>
                        {tokenUrl && (
                            <TouchableOpacity onPress={handleTokenPress}>
                                <Image 
                                    source={{ uri: tokenUrl }} 
                                    style={{ width: 50, height: 50, marginRight: 12, borderRadius: 8 }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        )}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={[styles.title, { alignSelf: 'flex-start', marginBottom: 0, color: theme.text }]}>{beast.name || 'Unknown Beast'}</Text>
                            {/* Size, Type, Alignment */}
                            <Text style={{ color: theme.text, marginBottom: 2, fontSize: 12, fontStyle: 'italic' }}>
                                {formatSize(beast.size)} {formatType(beast.type)}{beast.alignmentPrefix ? `, ${beast.alignmentPrefix}` : ', '}{formatAlignment(beast.alignment)}
                            </Text>
                        </View>
                    </View>


                    {showFullImage && fullImageUrl
                        ? (
                            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                                <Image 
                                    source={{ uri: fullImageUrl }} 
                                    style={{ width: '100%', height: 400, maxHeight: 500, resizeMode: 'contain' }}
                                />
                            </View>
                        )
                        : (
                            <>
                                <View style={{ paddingLeft: 12, paddingRight: 12 }}>
                                    <ScrollView style={{ maxHeight: 500 }}>
                                        <View style={{ height: 5 }}></View>
                                        {/* AC, Initiative, HP, Speed */}
                                        <Separator title='Basics'/>
                                        <Text style={{ color: theme.text, marginBottom: 6, fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>AC</Text> {formatAC(beast.ac)}</Text>
                                        <Text style={{ color: theme.text, marginBottom: 6, fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Initiative</Text> {getAbilityMod(beast.dex)} ({beast.dex})</Text>
                                        <Text style={{ color: theme.text, marginBottom: 6, fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>HP</Text> {formatHP(beast.hp)}</Text>
                                        <Text style={{ color: theme.text, marginBottom: 6, fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Speed</Text> {formatSpeed(beast.speed)}</Text>


                                        {/* Ability Scores */}
                                        <Separator title='Stats and Salvations'/>
                                        <View style={{ flexDirection: 'row', marginVertical: 6, justifyContent: 'space-between' }}>
                                            {STATS.map(({ key, label }) => (
                                                <TouchableOpacity
                                                    key={key}
                                                    style={{
                                                        alignItems: 'center',
                                                        flex: 1,
                                                        marginHorizontal: 2,
                                                        backgroundColor: theme.primary,
                                                        borderRadius: 8,
                                                        paddingVertical: 6,
                                                        paddingHorizontal: 2,
                                                    }}
                                                    activeOpacity={0.7}
                                                    onPress={() => handleSaveRoll(key, label)}
                                                >
                                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>{label}</Text>
                                                    <Text style={{ color: 'white', fontSize: 12 }}>{beast[key]}</Text>
                                                    <Text style={{ color: 'white', fontSize: 12 }}>{getAbilityMod(beast[key])}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        {beast.save && (
                                            <Text style={{ color: theme.text, marginTop: 4, marginBottom: 2 }}><Text style={{ fontWeight: 'bold' }}>Saving Throws:</Text> {formatSaves(beast.save)}</Text>
                                        )}

                                        {/* Senses, Languages, CR */}
                                        <Separator title='Skills and Abilities'/>
                                        {beast.skill && (
                                            <Text style={{ color: theme.text, marginBottom: 6, fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Skills:</Text> {formatSkills(beast.skill)}</Text>
                                        )}
                                        {beast.resist && (
                                            <Text style={{ color: theme.text, marginBottom: 6, fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Damage Resistances:</Text> {formatArray(beast.resist)}</Text>
                                        )}
                                        {beast.immune && (
                                            <Text style={{ color: theme.text, marginBottom: 6, fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Damage Immunities:</Text> {formatImmunities(beast.immune)}</Text>
                                        )}
                                        {beast.conditionImmune && (
                                            <Text style={{ color: theme.text, marginBottom: 6, fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Condition Immunities:</Text> {formatConditionImmunities(beast.conditionImmune)}</Text>
                                        )}
                                        {beast.senses && (
                                            <Text style={{ color: theme.text, marginBottom: 6, fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Senses:</Text> {formatSenses(beast.senses, beast.passive)}</Text>
                                        )}
                                        {beast.languages && (
                                            <Text style={{ color: theme.text, marginBottom: 6, fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Languages:</Text> {formatArray(beast.languages)}</Text>
                                        )}
                                        {beast.cr && (
                                            <Text style={{ color: theme.text, marginBottom: 6, fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>CR:</Text> {formatCR(beast.cr)}</Text>
                                        )}
                                

                                        {/* Traits, Actions, Bonus Actions, Spellcasting */}
                                        {beast.trait && (
                                            <>
                                                <Separator title='Traits'/>
                                                {renderEntries(beast.trait, 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast.spellcasting && (
                                            <>
                                                <Separator title='Spellcasting'/>
                                                {formatSpellcasting(beast.spellcasting, theme, handleCreaturePressLocal, handleSpellPressLocal, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast.action && (
                                            <>
                                                <Separator title='Actions'/>
                                                {renderEntries(beast.action, 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast.bonus && (
                                            <>
                                                <Separator title='Bonus Actions'/>
                                                {renderEntries(beast.bonus, 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast.reaction && (
                                            <>
                                                <Separator title='Reactions'/>
                                                {renderEntries(beast.reaction, 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast.lair && (
                                            <>
                                                <Separator title='Lair Actions'/>
                                                {renderEntries(beast.lair, 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast.legendary && (
                                            <>
                                                <Separator title='Legendary Actions'/>
                                                {beast.legendaryHeader && (
                                                    <Text style={{ color: theme.text, marginBottom: 8, fontStyle: 'italic' }}>
                                                        {beast.legendaryHeader.map((header: string, i: number) => (
                                                            <Text key={i}>{header}{i < beast.legendaryHeader.length - 1 ? '\n' : ''}</Text>
                                                        ))}
                                                    </Text>
                                                )}
                                                {renderEntries(beast.legendary, 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast.mythic && (
                                            <>
                                                <Separator title='Mythic Actions'/>
                                                {renderEntries(beast.mythic, 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {/* Source */}
                                        <Text style={{ color: theme.noticeText, fontStyle: 'italic', marginTop: 8, marginBottom: 18, textAlign: 'right', fontSize: 10 }}>
                                            Source: {beast.source}{beast.page ? `, page ${beast.page}` : ''}{beast.otherSources ? `. Also found in ${formatArray(beast.otherSources.map((s: any) => s.source))}` : ''}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </>
                        )
                    }
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    content: {
        width: '90%',
        borderRadius: 16,
        padding: 20,
        alignItems: 'stretch',
        elevation: 4,
        maxHeight: '80%',
    },
    closeBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        alignSelf: 'center',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    label: {
        fontWeight: 'bold',
        marginRight: 6,
    },
    value: {
        flex: 1,
        flexWrap: 'wrap',
    },
});

export default BeastDetailModal;
