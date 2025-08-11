import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View, Modal, Platform, Pressable } from 'react-native';
import { useModal } from '../../context/ModalContext';
import { useData } from '../../context/DataContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import { renderEntries, parseDiceExpression, rollDice } from '../../utils/replaceTags';
import { Separator } from '../ui';
import { createSpellStyles } from '../../styles/spellStyles';
import { getModalZIndex } from '../../styles/modals';
import { 
  getFullSchool, 
  formatComponents, 
  formatRange, 
  formatTime, 
  formatDuration,
  formatClasses,
  formatSubclasses,
  formatRaces,
  formatBackgrounds,
  formatFeats,
  formatLevel
} from '../../utils/spellUtils';
import { normalizeString, equalsNormalized, is2024Source } from '../../utils/stringUtils';
import SpellNotFoundModal from '../modals/SpellNotFoundModal';
import CreatureNotFoundModal from '../modals/CreatureNotFoundModal';
import SourceSelectionModal from '../modals/SourceSelectionModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');




export function SpellDetailModal({
    visible,
    spell,
    onClose,
    schoolFullName,
    theme,
    onCreaturePress,
    onSpellPress,
}: {
    visible: boolean,
    spell: any,
    onClose: () => void,
    schoolFullName: string,
    theme: any,
    onCreaturePress?: (name: string, source: string) => void,
    onSpellPress?: (name: string, source: string) => void,
}) {
    const { openDiceModal, openAdvancedDiceModal, openBeastModal, openSpellModal, spellStackDepth } = useModal();
    const { simpleBeasts, simpleSpells } = useData();
    const { useAdvancedDiceRoll } = useAppSettings();
    const styles = createSpellStyles(theme);
    const dynamicZIndex = getModalZIndex(spellStackDepth);

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

    const handleCreaturePressLocal = (name: string, source: string) => {
        console.log('GlobalModals SpellDetailModal onCreaturePress called with:', { name, source });
        console.log('SpellDetailModal - simpleBeasts count:', simpleBeasts.length);
        
        // Get current spell source for 2024 logic
        const currentSpellSource = spell?.source;
        
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
        const isCurrentSpell2024 = is2024Source(currentSpellSource);
        const filteredCreatures = matchingCreatures.filter((b: any) => {
            const isBeast2024 = is2024Source(b.source);
            return isCurrentSpell2024 ? isBeast2024 : !isBeast2024;
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
        console.log('GlobalModals SpellDetailModal onSpellPress called with:', { name, source });
        console.log('SpellDetailModal - simpleSpells count:', simpleSpells.length);
        
        // Get current spell source for 2024 logic
        const currentSpellSource = spell?.source;
        
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
        const isCurrentSpell2024 = is2024Source(currentSpellSource);
        const filteredSpells = matchingSpells.filter((s: any) => {
            const isSpell2024 = is2024Source(s.source);
            return isCurrentSpell2024 ? isSpell2024 : !isSpell2024;
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
            const roll = Math.floor(Math.random() * 20) + 1;
            openDiceModal({
                expression: `1d20+${bonusNum}`,
                result: roll + bonusNum,
                breakdown: [roll],
                modifier: bonusNum !== 0 ? bonusNum : undefined,
                type: 'hit',
            });
        }
    }

    // Helper function to check if spell requires concentration
    const requiresConcentration = (duration: any): boolean => {
        if (!duration) return false;
        
        if (Array.isArray(duration)) {
            return duration.some((d: any) => d && d.concentration === true);
        }
        
        if (typeof duration === 'object') {
            return duration.concentration === true;
        }
        
        return String(duration).toLowerCase().includes('concentration');
    };

    // Check if spell requires concentration
    const isConcentration = spell ? requiresConcentration(spell.duration) : false;

    if (!visible) return null;
    if (!spell) return (
        <Modal visible={visible} animationType="slide" transparent>
            <Pressable style={styles.spellDetailOverlay} onPress={onClose}>
                <View style={[styles.spellDetailContent, { justifyContent: 'center', alignItems: 'center', zIndex: dynamicZIndex }]}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            </Pressable>
        </Modal>
    );

    // Additional safety check
    if (!spell.name || spell.level === undefined) {
        return (
            <Modal visible={visible} animationType="slide" transparent>
                <Pressable style={styles.spellDetailOverlay} onPress={onClose}>
                    <View style={[styles.spellDetailContent, { justifyContent: 'center', alignItems: 'center', zIndex: dynamicZIndex }]}>
                        <Text style={{ color: theme.text }}>Invalid spell data</Text>
                    </View>
                </Pressable>
            </Modal>
        );
    }

    return (
        <>
        <Modal visible={visible} animationType="slide" transparent>
            <View 
                style={styles.spellDetailOverlay} 
                onStartShouldSetResponder={() => true}
                onResponderGrant={() => onClose()}
            >
                <View 
                    style={[styles.spellDetailContent, { zIndex: dynamicZIndex }]}
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={(e) => e.stopPropagation()}
                >
                    {/* Header - Standardized design */}
                    <View style={styles.spellDetailHeader}>
                        <View style={styles.spellDetailHeaderInfo}>
                            <Text style={styles.spellDetailTitle}>{spell.name}</Text>
                            <Text style={styles.spellDetailSubtitle}>
                                {formatLevel(spell.level)} • {getFullSchool(spell.school)}
                                {spell.meta?.ritual && ' (ritual)'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.spellDetailCloseButton}>
                            <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 18 }}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={[styles.spellDetailSeparator, { backgroundColor: theme.border }]} />

                    {/* Single ScrollView for all content */}
                    {Platform.OS === 'web' ? (
                        <ScrollView 
                            style={styles.spellDetailScrollView}
                            contentContainerStyle={styles.spellDetailScrollContent}
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                            scrollEventThrottle={16}
                            bounces={false}
                            alwaysBounceVertical={false}
                        >
                            {/* Spell Details Grid - 2x2 */}
                            <View style={styles.spellDetailGridContainer}>
                                <View style={styles.spellDetailGrid}>
                                    <View style={styles.spellDetailGridItem}>
                                        <Text style={styles.spellDetailGridLabel}>Casting Time</Text>
                                        <View style={styles.spellDetailGridValueContainer}>
                                            {formatTime(spell.time, theme, handleCreaturePressLocal, handleSpellPressLocal, spell.meta?.ritual)}
                                        </View>
                                    </View>
                                    <View style={styles.spellDetailGridItem}>
                                        <Text style={styles.spellDetailGridLabel}>Range</Text>
                                        <View style={styles.spellDetailGridValueContainer}>
                                            {formatRange(spell.range, theme, handleCreaturePressLocal, handleSpellPressLocal)}
                                        </View>
                                    </View>
                                    <View style={styles.spellDetailGridItem}>
                                        <Text style={styles.spellDetailGridLabel}>Components</Text>
                                        <View style={styles.spellDetailGridValueContainer}>
                                            {formatComponents(spell.components, theme, handleCreaturePressLocal, handleSpellPressLocal)}
                                        </View>
                                    </View>
                                    <View style={styles.spellDetailGridItemLast}>
                                        <Text style={styles.spellDetailGridLabel}>Duration</Text>
                                        <View style={styles.spellDetailGridValueContainer}>
                                            {formatDuration(spell.duration, theme, handleCreaturePressLocal, handleSpellPressLocal, isConcentration)}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Spell Description */}
                            <View style={{ marginBottom: 15 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: theme.text }}>Description</Text>
                                {renderEntries(spell.entries, 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                            </View>

                            {/* Higher Level */}
                            {spell.entriesHigherLevel && (
                                <View style={{ marginBottom: 15 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: theme.text }}>At Higher Levels</Text>
                                    {renderHigherLevel(spell.entriesHigherLevel, theme, handleCreaturePressLocal, handleSpellPressLocal)}
                                </View>
                            )}

                            {/* Classes */}
                            {spell.classes && (
                                <View style={{ marginBottom: 15 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: theme.text }}>Classes</Text>
                                    {renderList('Classes', formatClasses(spell.classes), theme)}
                                </View>
                            )}
                        </ScrollView>
                    ) : (
                        <ScrollView 
                            style={styles.spellDetailScrollView}
                            contentContainerStyle={styles.spellDetailScrollContent}
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                            scrollEventThrottle={16}
                            bounces={false}
                            alwaysBounceVertical={false}
                            onStartShouldSetResponder={() => false}
                            onMoveShouldSetResponder={() => true}
                            onResponderGrant={() => {}}
                            onResponderMove={() => {}}
                            onResponderRelease={() => {}}
                        >
                            <View 
                                style={{ flex: 1 }}
                                onStartShouldSetResponder={() => true}
                                onMoveShouldSetResponder={() => false}
                            >
                                {/* Spell Details Grid - 2x2 */}
                                <View style={styles.spellDetailGridContainer}>
                                    <View style={styles.spellDetailGrid}>
                                        <View style={styles.spellDetailGridItem}>
                                            <Text style={styles.spellDetailGridLabel}>Casting Time</Text>
                                            <View style={styles.spellDetailGridValueContainer}>
                                                {formatTime(spell.time, theme, handleCreaturePressLocal, handleSpellPressLocal, spell.meta?.ritual)}
                                            </View>
                                        </View>
                                        <View style={styles.spellDetailGridItem}>
                                            <Text style={styles.spellDetailGridLabel}>Range</Text>
                                            <View style={styles.spellDetailGridValueContainer}>
                                                {formatRange(spell.range, theme, handleCreaturePressLocal, handleSpellPressLocal)}
                                            </View>
                                        </View>
                                        <View style={styles.spellDetailGridItem}>
                                            <Text style={styles.spellDetailGridLabel}>Components</Text>
                                            <View style={styles.spellDetailGridValueContainer}>
                                                {formatComponents(spell.components, theme, handleCreaturePressLocal, handleSpellPressLocal)}
                                            </View>
                                        </View>
                                        <View style={styles.spellDetailGridItemLast}>
                                            <Text style={styles.spellDetailGridLabel}>Duration</Text>
                                            <View style={styles.spellDetailGridValueContainer}>
                                                {formatDuration(spell.duration, theme, handleCreaturePressLocal, handleSpellPressLocal, isConcentration)}
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Spell Description */}
                                <View style={{ marginBottom: 15 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: theme.text }}>Description</Text>
                                    {renderEntries(spell.entries, 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                </View>

                                {/* Higher Level */}
                                {spell.entriesHigherLevel && (
                                    <View style={{ marginBottom: 15 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: theme.text }}>At Higher Levels</Text>
                                        {renderHigherLevel(spell.entriesHigherLevel, theme, handleCreaturePressLocal, handleSpellPressLocal)}
                                    </View>
                                )}

                                {/* Classes */}
                                {spell.classes && (
                                    <View style={{ marginBottom: 15 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: theme.text }}>Classes</Text>
                                        {renderList('Classes', formatClasses(spell.classes), theme)}
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    )}

                    {/* Source - Outside scroll, always at bottom */}
                    {spell.source && (
                        <View style={styles.spellDetailFooter}>
                            <Text style={styles.spellDetailSource}>
                                Source: {spell.source}{spell.page ? `, page ${spell.page}` : ''}{spell.srd ? ' Available in the SRD and Basic Rules.' : ''}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
        
        {/* Modals */}
        <SpellNotFoundModal
            visible={spellNotFoundVisible}
            spellName={spellNotFoundName}
            onClose={() => setSpellNotFoundVisible(false)}
            theme={theme}
        />
        
        <CreatureNotFoundModal
            visible={creatureNotFoundVisible}
            creatureName={creatureNotFoundName}
            onClose={() => setCreatureNotFoundVisible(false)}
            theme={theme}
        />
        
        <SourceSelectionModal
            visible={sourceSelectionVisible}
            title={sourceSelectionData.title}
            message={sourceSelectionData.message}
            options={sourceSelectionData.options}
            onSelect={sourceSelectionData.onSelect}
            onClose={() => setSourceSelectionVisible(false)}
            theme={theme}
        />
    </>
    );
}



function renderHigherLevel(entriesHigherLevel: any, theme: any, onCreaturePress?: (name: string, source: string) => void, onSpellPress?: (name: string, source: string) => void): React.ReactNode {
    if (!entriesHigherLevel) return null;
    if (Array.isArray(entriesHigherLevel)) {
        return entriesHigherLevel.map((e, idx) => (
            <View key={idx} style={{ marginTop: 8 }}>
                <Text style={{ fontWeight: 'bold', color: theme.text, fontSize: 12, marginBottom: 6 }}>Using a Higher-Level Spell Slot.</Text>
                {renderEntries(e.entries, 10, theme, onCreaturePress, onSpellPress)}
            </View>
        ));
    }
    return null;
}

function renderList(label: string, arr: any, theme: any) {
    if (!arr || !arr.length) return null;
    return (
        <Text style={{ color: theme.text, fontSize: 12, marginBottom: 4 }}><Text style={{ fontWeight: 'bold' }}>{label}:</Text> {arr.join(', ')}</Text>
    );
}

 