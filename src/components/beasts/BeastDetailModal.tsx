// REACT
import React from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Pressable, Platform } from 'react-native';

// STORES
import { useAppSettingsStore } from 'src/stores/appSettingsStore';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';
import { useData } from 'src/context/DataContext';

// UTILS
import { getCachedCreatureImages, getBestCreatureImage } from 'src/utils/imageManager';
import { ALIGNMENTS, SIZES, STATS } from 'src/data/helpers';
import { renderEntries, parseDiceExpression, rollDice } from 'src/utils/replaceTags';
import { 
    normalizeString, 
    getCreatureSourceForBeast, 
    getExcludedCreatureSources, 
    getSpellSourceForBeast, 
    getExcludedSpellSources,
    is2024Source
} from 'src/utils/stringUtils';

// COMPONENTS
import { Separator } from 'src/components/ui';
import SpellNotFoundModal from 'src/components/spells/modals/SpellNotFoundModal';
import CreatureNotFoundModal from 'src/components/beasts/modals/CreatureNotFoundModal';
import SourceSelectionModal from 'src/components/spells/modals/SourceSelectionModal';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';
import { getModalZIndex } from 'src/styles/baseModalStyles';

interface BeastDetailModalProps {
    visible: boolean;
    beast: Record<string, any> | null;
    onClose: () => void;
    theme: any;
    onCreaturePress?: (name: string, source: string) => void;
    onSpellPress?: (name: string, source: string) => void;
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

function formatSpellcasting(spellcasting: any, theme: any, onCreaturePress?: (name: string, source: string) => void, onSpellPress?: (name: string, source: string) => void, handleDamagePress?: (expr: string) => void, handleHitPress?: (bonus: string) => void) {
    if (!spellcasting) return null;
    if (!Array.isArray(spellcasting)) spellcasting = [spellcasting];
    return spellcasting.map((sc: any, i: number) => (
        <View key={i} style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold', color: theme.text }}>{sc.name || 'Spellcasting'}{sc.displayAs ? ` (${sc.displayAs})` : ''}.</Text>
            {sc.headerEntries && (
                renderEntries(sc.headerEntries, 0, theme, onCreaturePress, onSpellPress, {}, handleDamagePress, handleHitPress)
            )}
            {/* Spellbook style */}
            {sc.spells && (
                <View style={{ marginTop: 4 }}>
                    {/* Cantrips */}
                    {sc.spells['0'] && (
                        <Text style={{ marginBottom: 2, color: theme.text }}>
                            <Text style={{ fontWeight: 'bold', color: theme.text }}>Cantrips (at will): </Text>
                            {sc.spells['0'].spells.map((spell: string, idx: number) => (
                                <React.Fragment key={idx}>
                                    {renderEntries(spell, 0, theme, onCreaturePress, onSpellPress, {}, handleDamagePress, handleHitPress)}
                                    {idx < sc.spells['0'].spells.length - 1 ? <Text style={{ color: theme.text }}>{', '}</Text> : null}
                                </React.Fragment>
                            ))}
                        </Text>
                    )}
                    {/* Spell levels 1-9 */}
                    {Object.entries(sc.spells).filter(([lvl]) => lvl !== '0').map(([lvl, data]: [string, any]) => (
                        <Text key={lvl} style={{ marginBottom: 2, color: theme.text }}>
                            <Text style={{ fontWeight: 'bold', color: theme.text }}>Level {lvl}{data.slots ? ` (${data.slots} slots)` : ''}: </Text>
                            {data.spells.map((spell: string, idx: number) => (
                                <React.Fragment key={idx}>
                                    {renderEntries(spell, 0, theme, onCreaturePress, onSpellPress, {}, handleDamagePress, handleHitPress)}
                                    {idx < data.spells.length - 1 ? <Text style={{ color: theme.text }}>{', '}</Text> : null}
                                </React.Fragment>
                            ))}
                        </Text>
                    ))}
                </View>
            )}
            {/* Daily spells */}
            {sc.daily && (
                <View>
                    {Object.entries(sc.daily).map(([level, spells]: [string, any], idx: number) => (
                        <View key={level}>
                            <Text style={{ color: theme.text }}>{level.replace('e', '/day')}: </Text>
                            {renderEntries(spells, 0, theme, onCreaturePress, onSpellPress, {}, handleDamagePress, handleHitPress)}
                            {idx < Object.entries(sc.daily).length - 1 ? <Text style={{ color: theme.text }}>{'\n'}</Text> : null}
                        </View>
                    ))}
                </View>
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

function formatTraits(traits: any, theme: any, onCreaturePress?: (name: string, source: string) => void, onSpellPress?: (name: string, source: string) => void) {
    if (!traits) return null;
    if (!Array.isArray(traits)) traits = [traits];
    return traits.map((trait: any, i: number) => (
        <View key={i} style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold', color: theme.text }}>{trait.name}.</Text>
            {Array.isArray(trait.entries)
                ? trait.entries.map((e: any, j: number) => (
                    <React.Fragment key={j}>{renderEntries(e, 0, theme, onCreaturePress, onSpellPress)}</React.Fragment>
                ))
                : renderEntries(trait.entries, 0, theme, onCreaturePress, onSpellPress)}
        </View>
    ));
}

function formatActions(actions: any, label = 'Actions', theme: any, onCreaturePress?: (name: string, source: string) => void, onSpellPress?: (name: string, source: string) => void) {
    if (!actions) return null;
    if (!Array.isArray(actions)) actions = [actions];
    return (
        <View style={{ marginBottom: 10 }}>
            {actions.map((action: any, i: number) => (
                <View key={i} style={{ marginBottom: 8 }}>
                    <Text style={{ fontWeight: 'bold', color: theme.text }}>{action.name}.</Text>
                    {Array.isArray(action.entries)
                        ? action.entries.map((e: any, j: number) => (
                            <React.Fragment key={j}>{renderEntries(e, 0, theme, onCreaturePress, onSpellPress)}</React.Fragment>
                        ))
                        : renderEntries(action.entries, 0, theme, onCreaturePress, onSpellPress)}
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
    const { currentTheme, useAdvancedDiceRoll} = useAppSettingsStore();
    const { simpleBeasts, simpleSpells, availableClasses, spellClassRelations, isInitialized } = useData();
    const { beastStackDepth, openSpellModal, openBeastModal, openDiceModal, openAdvancedDiceModal } = useModal();
    const styles = createBaseModalStyles(currentTheme);
    const dynamicZIndex = getModalZIndex(beastStackDepth);
    
    // All hooks must be at the top level, before any conditional returns
    const [cachedImageUrl, setCachedImageUrl] = React.useState<string | null>(null);
    const [fullImageUrl, setFullImageUrl] = React.useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = React.useState(false);
    const [imageFailed, setImageFailed] = React.useState(false);
    const [showFullImage, setShowFullImage] = React.useState(false);
    
    // Modal state
    const [spellNotFoundVisible, setSpellNotFoundVisible] = React.useState(false);
    const [spellNotFoundName, setSpellNotFoundName] = React.useState<string>('');
    const [creatureNotFoundVisible, setCreatureNotFoundVisible] = React.useState(false);
    const [creatureNotFoundName, setCreatureNotFoundName] = React.useState<string>('');
    const [sourceSelectionVisible, setSourceSelectionVisible] = React.useState(false);
    const [sourceSelectionData, setSourceSelectionData] = React.useState({
        title: '',
        message: '',
        options: [] as any[],
        onSelect: (option: any) => {}
    });

    // Load cached images when beast changes
    const loadingRef = React.useRef<string | null>(null);
    const lastBeastRef = React.useRef<string | null>(null);
    
    React.useEffect(() => {
        if (beast && beast['source'] && beast['name']) {
            const beastKey = `${beast['source']}/${beast['name']}`;
            
            // Prevent multiple loads for the same beast
            if (lastBeastRef.current === beastKey) {
                return;
            }
            
            // Prevent multiple simultaneous loads
            if (loadingRef.current === beastKey) {
                return;
            }
            
            lastBeastRef.current = beastKey;
            loadingRef.current = beastKey;
            setIsLoadingImage(true);
            setImageFailed(false); // Reset failure state
            
            // Use the new image manager - always load token for header
            getCachedCreatureImages(beast['source'], beast['name'])
                .then(imageInfo => {
                    // Always use token for display in header
                    setCachedImageUrl(imageInfo.cachedTokenUrl || imageInfo.tokenUrl);
                    // Store full image URL separately
                    setFullImageUrl(imageInfo.cachedFullImageUrl || imageInfo.fullImageUrl);
                    setIsLoadingImage(false);
                    loadingRef.current = null;
                })
                .catch(error => {
                    console.error('Error loading cached images:', error);
                    // Fallback to original token URL
                    const encodedName = encodeURIComponent(beast['name']);
                    const fallbackUrl = `https://5e.tools/img/bestiary/tokens/${beast['source']}/${encodedName}.webp`;
                    setCachedImageUrl(fallbackUrl);
                    setFullImageUrl(null);
                    setIsLoadingImage(false);
                    loadingRef.current = null;
                });
        } else {
            setCachedImageUrl(null);
            setFullImageUrl(null);
            setIsLoadingImage(false);
            setImageFailed(false);
            loadingRef.current = null;
            lastBeastRef.current = null;
        }
    }, [beast?.['source'], beast?.['name']]); // Only depend on source and name, not the entire beast object

    // Reset to details view when modal opens
    React.useEffect(() => {
        if (visible && beast) {
            setShowFullImage(false); // Always show details when opening
        }
    }, [visible, beast]);

    const handleTokenPress = async () => {
        if (showFullImage) {
            // If we're showing full image, go back to details (token)
            setShowFullImage(false);
            setImageFailed(false); // Reset failure state
            return;
        }

        // If we're showing details, try to show full image
        if (fullImageUrl) {
            setImageFailed(false); // Reset failure state
            setShowFullImage(true);
        } else {
            console.log('No full image available for this creature');
        }
    };
    
    if (!beast) {
        return (
            <Modal visible={visible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.beastDetailModalContent, { justifyContent: 'center', alignItems: 'center' }]}> 
                        <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                </View>
            </Modal>
        );
    }

    const handleCreaturePressLocal = (name: string, source: string) => {
      console.log('GlobalModals BeastDetailModal onCreaturePress called with:', { name, source });
      console.log('BeastDetailModal - simpleBeasts count:', simpleBeasts.length);
      
      // Get current beast source for 2024 logic
      const currentBeastSource = beast?.['source'];
      
      // Find all matching creatures
      const matchingCreatures = simpleBeasts.filter((b: any) => {
        const nameMatch = normalizeString(b.name) === normalizeString(name);
        return nameMatch;
      });
      
      console.log('Matching creatures:', matchingCreatures.map(c => ({ name: c.name, source: c.source })));
      
      if (matchingCreatures.length === 0) {
        // No creatures found
        setCreatureNotFoundName(name);
        setCreatureNotFoundVisible(true);
        return;
      }
      
      // Filter based on 2024 logic
      const isCurrentBeast2024 = is2024Source(currentBeastSource);
      const filteredCreatures = matchingCreatures.filter((b: any) => {
        const isBeast2024 = is2024Source(b.source);
        return isCurrentBeast2024 ? isBeast2024 : !isBeast2024;
      });
      
      console.log('Filtered creatures:', filteredCreatures.map(c => ({ name: c.name, source: c.source })));
      
      if (filteredCreatures.length === 0) {
        // No creatures found after filtering
        setCreatureNotFoundName(name);
        setCreatureNotFoundVisible(true);
        return;
      }
      
      if (filteredCreatures.length === 1) {
        // Single creature found, open it directly
        openBeastModal(filteredCreatures[0], true);
        return;
      }
      
      // Multiple creatures found, show selection modal
      setSourceSelectionData({
        title: 'Select Creature Source',
        message: `Multiple sources found for "${name}". Please select one:`,
        options: filteredCreatures.map(c => ({ name: c.name, source: c.source, data: c })),
        onSelect: (option: any) => {
          openBeastModal(option.data, true);
          setSourceSelectionVisible(false);
        }
      });
      setSourceSelectionVisible(true);
    };

    const handleSpellPressLocal = (name: string, source: string) => {
      console.log('GlobalModals BeastDetailModal onSpellPress called with:', { name, source });
      console.log('BeastDetailModal - simpleSpells count:', simpleSpells.length);
      
      // Get current beast source for 2024 logic
      const currentBeastSource = beast?.['source'];
      
      // Find all matching spells
      const matchingSpells = simpleSpells.filter((s: any) => {
        const nameMatch = normalizeString(s.name) === normalizeString(name);
        return nameMatch;
      });
      
      console.log('Matching spells:', matchingSpells.map(sp => ({ name: sp.name, source: sp.source })));
      
      if (matchingSpells.length === 0) {
        // No spells found
        setSpellNotFoundName(name);
        setSpellNotFoundVisible(true);
        return;
      }
      
      // Filter based on 2024 logic
      const isCurrentBeast2024 = is2024Source(currentBeastSource);
      const filteredSpells = matchingSpells.filter((s: any) => {
        const isSpell2024 = is2024Source(s.source);
        return isCurrentBeast2024 ? isSpell2024 : !isSpell2024;
      });
      
      console.log('Filtered spells:', filteredSpells.map(sp => ({ name: sp.name, source: sp.source })));
      
      if (filteredSpells.length === 0) {
        // No spells found after filtering
        setSpellNotFoundName(name);
        setSpellNotFoundVisible(true);
        return;
      }
      
      if (filteredSpells.length === 1) {
        // Single spell found, open it directly
        openSpellModal(filteredSpells[0], true);
        return;
      }
      
      // Multiple spells found, show selection modal
      setSourceSelectionData({
        title: 'Select Spell Source',
        message: `Multiple sources found for "${name}". Please select one:`,
        options: filteredSpells.map(s => ({ name: s.name, source: s.source, data: s })),
        onSelect: (option) => {
          openSpellModal(option.data, true);
          setSourceSelectionVisible(false);
        }
      });
      setSourceSelectionVisible(true);
    };

    function handleDamagePress(expr: string) {
        if (useAdvancedDiceRoll) {
            openAdvancedDiceModal({
                damageConfig: {
                    expression: expr,
                    label: 'Damage',
                }
            });
        } else {
            // Use simple dice roll
            const parsed = parseDiceExpression(expr);
            if (!parsed) {
                return;
            }
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
    }
    function handleHitPress(bonus: string) {
        const bonusNum = parseInt(bonus, 10) || 0;
        if (useAdvancedDiceRoll) {
            openAdvancedDiceModal({
                d20Config: {
                    bonus: bonusNum,
                    label: 'Attack',
                    type: 'hit',
                }
            });
        } else {
            // Use simple dice roll
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
    }
    
    function handleSaveRoll(statKey: string, statLabel: string) {
        if (!beast) {
            return;
        }
        // Get save bonus from beast.save if present, else use ability mod
        let bonus = 0;
        if (beast['save'] && beast['save'][statKey] !== undefined) {
            // beast.save[statKey] can be '+5' or 5
            const bonusStr = String(beast['save'][statKey]);
            bonus = parseInt(bonusStr, 10) || 0;
        } else {
            // Use ability modifier
            const statValue = beast[statKey];
            bonus = typeof statValue === 'number' ? Math.floor((statValue - 10) / 2) : 0;
        }
        
        if (useAdvancedDiceRoll) {
            openAdvancedDiceModal({
                d20Config: {
                    bonus,
                    label: `${statLabel} Saving Throw`,
                    type: 'save',
                }
            });
        } else {
            // Use simple dice roll
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
    }
    
    // Debug: Info cargada de la criatura
    // console.log(`Info cargada de la criatura "${beast?.['name']}"`);
    
    return (
        <>
        <Modal visible={visible} animationType="slide" transparent>
            <Pressable 
                style={styles.modalOverlay}
                onPress={onClose}
            >
                <Pressable 
                    style={[styles.beastDetailModalContent, { zIndex: dynamicZIndex }]}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.beastDetailHeader}>
                    <View style={styles.beastDetailHeaderContent}>
                        {(cachedImageUrl) && (
                            <TouchableOpacity onPress={handleTokenPress} style={{ position: 'relative' }}>
                                <Image 
                                    source={{ uri: cachedImageUrl }} 
                                    style={{ width: 50, height: 50, borderRadius: 8 }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        )}
                        <View style={styles.beastDetailHeaderInfo}>
                            <Text style={styles.beastDetailHeaderTitle}>
                                {beast['name'] || 'Unknown Beast'}
                            </Text>
                            <Text style={styles.beastDetailHeaderSubtitle}>
                                {formatSize(beast['size'])} {formatType(beast['type'])}{beast['alignmentPrefix'] ? `, ${beast['alignmentPrefix']}` : ', '}{formatAlignment(beast['alignment'])}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => {
                        onClose();
                    }} style={styles.beastDetailCloseButton}>
                        <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 18 }}>✕</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.beastDetailSeparator, { backgroundColor: theme.border }]} />

                    {showFullImage && (fullImageUrl)
                        ? (
                            <View style={styles.beastDetailImageContainer}>
                                {isLoadingImage ? (
                                    <View style={styles.beastDetailImageLoadingContainer}>
                                        <ActivityIndicator size="large" color={theme.primary} />
                                        <Text style={{ color: theme.text, marginTop: 10 }}>Loading image...</Text>
                                    </View>
                                ) : (
                                    <Image 
                                        source={{ uri: imageFailed ? (cachedImageUrl || '') : (fullImageUrl || '') }} 
                                        style={styles.beastDetailImage}
                                        onError={() => {
                                            console.log(`Failed to load full image for ${beast['name']}`);
                                            // If full image fails, show token instead
                                            setImageFailed(true);
                                        }}
                                    />
                                )}
                            </View>
                        )
                        : (
                            <>
                                <View style={styles.beastDetailBody}>
                                    {Platform.OS === 'web' ? (
                                        <ScrollView 
                                            style={{ flex: 1 }}
                                            contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
                                            showsVerticalScrollIndicator={true}
                                            nestedScrollEnabled={true}
                                            scrollEventThrottle={16}
                                            bounces={false}
                                            alwaysBounceVertical={false}
                                        >
                                            <View style={styles.beastDetailContent}>
                                        {/* AC, Initiative, HP, Speed */}
                                        <Separator title='Basics'/>
                                                <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>AC</Text> {formatAC(beast['ac'])}</Text>
                                                <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Initiative</Text> {getAbilityMod(beast['dex'])} ({beast['dex']})</Text>
                                                <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>HP</Text> {formatHP(beast['hp'])}</Text>
                                                <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Speed</Text> {formatSpeed(beast['speed'])}</Text>

                                        {/* Ability Scores */}
                                        <Separator title='Stats and Salvations'/>
                                                <View style={styles.beastDetailStatsContainer}>
                                            {STATS.map(({ key, label }) => (
                                                <TouchableOpacity
                                                    key={key}
                                                            style={styles.beastDetailStatButton}
                                                    activeOpacity={0.7}
                                                            onPressIn={() => {
                                                                console.log('📊 Stat button pressed:', key, label);
                                                                handleSaveRoll(key, label);
                                                            }}
                                                        >
                                                            <Text style={styles.beastDetailStatText}>{label}</Text>
                                                            <Text style={styles.beastDetailStatValue}>{beast[key]}</Text>
                                                            <Text style={styles.beastDetailStatValue}>{getAbilityMod(beast[key])}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>

                                                {/* Skills and Abilities */}
                                        <Separator title='Skills and Abilities'/>
                                        {beast['skill'] && (
                                                    <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Skills:</Text> {formatSkills(beast['skill'])}</Text>
                                        )}
                                        {beast['resist'] && (
                                                    <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Damage Resistances:</Text> {formatArray(beast['resist'])}</Text>
                                        )}
                                        {beast['immune'] && (
                                                    <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Damage Immunities:</Text> {formatImmunities(beast['immune'])}</Text>
                                        )}
                                        {beast['conditionImmune'] && (
                                                    <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Condition Immunities:</Text> {formatConditionImmunities(beast['conditionImmune'])}</Text>
                                        )}
                                        {beast['senses'] && (
                                                    <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Senses:</Text> {formatSenses(beast['senses'], beast['passive'])}</Text>
                                        )}
                                        {beast['languages'] && (
                                                    <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Languages:</Text> {formatArray(beast['languages'])}</Text>
                                        )}
                                        {beast['cr'] && (
                                                    <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>CR:</Text> {formatCR(beast['cr'])}</Text>
                                                )}
                                        
                                                {/* Traits, Actions, Bonus Actions, Spellcasting */}
                                                {beast['trait'] && (
                                                    <>
                                                        <Separator title='Traits'/>
                                                        {renderEntries(beast['trait'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                                    </>
                                                )}
                                                {beast['spellcasting'] && (
                                                    <>
                                                        <Separator title='Spellcasting'/>
                                                        {formatSpellcasting(beast['spellcasting'], theme, handleCreaturePressLocal, handleSpellPressLocal, handleDamagePress, handleHitPress)}
                                                    </>
                                                )}
                                                {beast['action'] && (
                                                    <>
                                                        <Separator title='Actions'/>
                                                        {renderEntries(beast['action'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                                    </>
                                                )}
                                                {beast['bonus'] && (
                                                    <>
                                                        <Separator title='Bonus Actions'/>
                                                        {renderEntries(beast['bonus'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                                    </>
                                                )}
                                                {beast['reaction'] && (
                                                    <>
                                                        <Separator title='Reactions'/>
                                                        {renderEntries(beast['reaction'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                                    </>
                                                )}
                                                {beast['lair'] && (
                                                    <>
                                                        <Separator title='Lair Actions'/>
                                                        {renderEntries(beast['lair'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                                    </>
                                                )}
                                                {beast['legendary'] && (
                                                    <>
                                                        <Separator title='Legendary Actions'/>
                                                        {beast['legendaryHeader'] && (
                                                            <Text style={{ color: theme.text, marginBottom: 8, fontStyle: 'italic' }}>
                                                                {beast['legendaryHeader'].map((header: string, i: number) => (
                                                                    <Text key={i}>{header}{i < beast['legendaryHeader'].length - 1 ? '\n' : ''}</Text>
                                                                ))}
                                                            </Text>
                                                        )}
                                                        {renderEntries(beast['legendary'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                                    </>
                                                )}
                                                {beast['mythic'] && (
                                                    <>
                                                        <Separator title='Mythic Actions'/>
                                                        {renderEntries(beast['mythic'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                                    </>
                                                )}
                                            </View>
                                        </ScrollView>
                                    ) : (
                                        <View style={{ flex: 1 }}>
                                            <ScrollView 
                                                style={{ flex: 1 }}
                                                contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
                                                showsVerticalScrollIndicator={true}
                                                nestedScrollEnabled={true}
                                                scrollEventThrottle={16}
                                                bounces={false}
                                                alwaysBounceVertical={false}
                                            >
                                                <View style={styles.beastDetailContent}>
                                                    {/* AC, Initiative, HP, Speed */}
                                                    <Separator title='Basics'/>
                                                    <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>AC</Text> {formatAC(beast['ac'])}</Text>
                                                    <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Initiative</Text> {getAbilityMod(beast['dex'])} ({beast['dex']})</Text>
                                                    <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>HP</Text> {formatHP(beast['hp'])}</Text>
                                                    <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Speed</Text> {formatSpeed(beast['speed'])}</Text>

                                                    {/* Ability Scores */}
                                                    <Separator title='Stats and Salvations'/>
                                                    <View style={styles.beastDetailStatsContainer}>
                                                        {STATS.map(({ key, label }) => (
                                                            <TouchableOpacity
                                                                key={key}
                                                                style={styles.beastDetailStatButton}
                                                                activeOpacity={0.7}
                                                                onPressIn={() => {
                                                                    console.log('📊 Stat button pressed:', key, label);
                                                                    handleSaveRoll(key, label);
                                                                }}
                                                            >
                                                                <Text style={styles.beastDetailStatText}>{label}</Text>
                                                                <Text style={styles.beastDetailStatValue}>{beast[key]}</Text>
                                                                <Text style={styles.beastDetailStatValue}>{getAbilityMod(beast[key])}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>

                                                    {/* Skills and Abilities */}
                                                    <Separator title='Skills and Abilities'/>
                                                    {beast['skill'] && (
                                                        <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Skills:</Text> {formatSkills(beast['skill'])}</Text>
                                                    )}
                                                    {beast['resist'] && (
                                                        <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Damage Resistances:</Text> {formatArray(beast['resist'])}</Text>
                                                    )}
                                                    {beast['immune'] && (
                                                        <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Damage Immunities:</Text> {formatImmunities(beast['immune'])}</Text>
                                                    )}
                                                    {beast['conditionImmune'] && (
                                                        <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Condition Immunities:</Text> {formatConditionImmunities(beast['conditionImmune'])}</Text>
                                                    )}
                                                    {beast['senses'] && (
                                                        <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Senses:</Text> {formatSenses(beast['senses'], beast['passive'])}</Text>
                                                    )}
                                                    {beast['languages'] && (
                                                        <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>Languages:</Text> {formatArray(beast['languages'])}</Text>
                                                    )}
                                                    {beast['cr'] && (
                                                        <Text style={styles.beastDetailText}><Text style={styles.beastDetailBoldText}>CR:</Text> {formatCR(beast['cr'])}</Text>
                                                    )}

                                        {/* Traits, Actions, Bonus Actions, Spellcasting */}
                                        {beast['trait'] && (
                                            <>
                                                <Separator title='Traits'/>
                                                {renderEntries(beast['trait'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast['spellcasting'] && (
                                            <>
                                                <Separator title='Spellcasting'/>
                                                {formatSpellcasting(beast['spellcasting'], theme, handleCreaturePressLocal, handleSpellPressLocal, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast['action'] && (
                                            <>
                                                <Separator title='Actions'/>
                                                {renderEntries(beast['action'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast['bonus'] && (
                                            <>
                                                <Separator title='Bonus Actions'/>
                                                {renderEntries(beast['bonus'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast['reaction'] && (
                                            <>
                                                <Separator title='Reactions'/>
                                                {renderEntries(beast['reaction'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast['lair'] && (
                                            <>
                                                <Separator title='Lair Actions'/>
                                                {renderEntries(beast['lair'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast['legendary'] && (
                                            <>
                                                <Separator title='Legendary Actions'/>
                                                {beast['legendaryHeader'] && (
                                                    <Text style={{ color: theme.text, marginBottom: 8, fontStyle: 'italic' }}>
                                                        {beast['legendaryHeader'].map((header: string, i: number) => (
                                                            <Text key={i}>{header}{i < beast['legendaryHeader'].length - 1 ? '\n' : ''}</Text>
                                                        ))}
                                                    </Text>
                                                )}
                                                {renderEntries(beast['legendary'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                        {beast['mythic'] && (
                                            <>
                                                <Separator title='Mythic Actions'/>
                                                {renderEntries(beast['mythic'], 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                            </>
                                        )}
                                                </View>
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>
                                
                                {/* Source Footer */}
                                <View style={[styles.beastDetailFooter, { borderTopColor: theme.border }]}>
                                    <Text style={styles.beastDetailSourceText}>
                                            Source: {beast['source']}{beast['page'] ? `, page ${beast['page']}` : ''}{beast['otherSources'] && beast['otherSources'].length > 0 ? `. Also found in ${formatArray(beast['otherSources'].map((s: any) => s.source))}` : ''}
                                        </Text>
                                </View>
                            </>
                        )
                    }
                </Pressable>
            </Pressable>
        </Modal>
            
            {/* Modals */}
            <SpellNotFoundModal
              visible={spellNotFoundVisible}
              spellName={spellNotFoundName}
              onClose={() => {
                setSpellNotFoundVisible(false);
              }}
              theme={theme}
            />
            
            <CreatureNotFoundModal
              visible={creatureNotFoundVisible}
              creatureName={creatureNotFoundName}
              onClose={() => {
                setCreatureNotFoundVisible(false);
              }}
              theme={theme}
            />
            
            <SourceSelectionModal
              visible={sourceSelectionVisible}
              title={sourceSelectionData.title}
              message={sourceSelectionData.message}
              options={sourceSelectionData.options}
              onSelect={sourceSelectionData.onSelect}
              onClose={() => {
                setSourceSelectionVisible(false);
              }}
              theme={theme}
            />
        </>
    );
};

export default BeastDetailModal;
