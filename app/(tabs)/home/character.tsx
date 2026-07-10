// REACT
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// EXPO
import { Stack, useLocalSearchParams } from 'expo-router';

// STORES
import { useAppSettingsStore, useCampaignStore, useCharacterStore } from 'src/stores';

// COMPONENTS
import { Button, SegmentedControl } from 'src/components/ui';
import CharacterWizardModal from 'src/components/characters/CharacterWizardModal';
import InventoryTab from 'src/components/characters/InventoryTab';
import SpellsTab from 'src/components/characters/SpellsTab';
import CreaturesTab from 'src/components/characters/CreaturesTab';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';
import { styleConstants } from 'src/styles/style-constants';

// HOOKS
import { useTabBarInset } from 'src/hooks/useTabBarInset';

// UTILS
import {
    ABILITIES, ABILITY_LABELS, AbilityKey, SKILLS,
    abilityMod, classSummary, formatMod, getAbilities, initiative,
    isSaveProficient, passivePerception, proficiencyBonus, saveBonus,
    skillBonus, skillProficiency, totalLevel,
} from 'src/utils/characterUtils';

const DEFAULT_TOKEN_URL = 'https://5e.tools/img/blank.webp';
type Tab = 'stats' | 'details' | 'inventory' | 'spells' | 'creatures';

// A small labelled value tile (HP, AC, etc.).
function StatTile({ label, value, theme, accent }: { label: string; value: React.ReactNode; theme: any; accent?: boolean }) {
    return (
        <View style={[styles.statTile, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: accent ? theme.primary : theme.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: theme.noticeText }]}>{label}</Text>
        </View>
    );
}

// A proficiency indicator dot: hollow (none), filled (proficient), ringed (expertise).
function ProfDot({ level, theme }: { level: 'none' | 'proficient' | 'expertise'; theme: any }) {
    if (level === 'none') return <View style={[styles.dot, { borderColor: theme.noticeText }]} />;
    return (
        <View style={[styles.dot, { backgroundColor: theme.primary, borderColor: theme.primary, alignItems: 'center', justifyContent: 'center' }]}>
            {level === 'expertise' && <View style={styles.dotInner} />}
        </View>
    );
}

// A "bonus" row for a save or skill.
function BonusRow({ label, bonus, prof, theme, extra }: { label: string; bonus: number; prof: 'none' | 'proficient' | 'expertise'; theme: any; extra?: string }) {
    return (
        <View style={[styles.bonusRow, { borderBottomColor: theme.border }]}>
            <ProfDot level={prof} theme={theme} />
            <Text style={[styles.bonusLabel, { color: theme.text }]}>{label}</Text>
            {extra ? <Text style={[styles.bonusExtra, { color: theme.noticeText }]}>{extra}</Text> : null}
            <Text style={[styles.bonusValue, { color: theme.text }]}>{formatMod(bonus)}</Text>
        </View>
    );
}

function DetailLine({ label, value, theme }: { label: string; value?: string; theme: any }) {
    if (!value) return null;
    return (
        <View style={[styles.detailLine, { borderBottomColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.noticeText }]}>{label}</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{value}</Text>
        </View>
    );
}

export default function CharacterSheetScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();
    const { campaigns } = useCampaignStore();
    const { players, updatePlayer } = useCharacterStore();

    const character = React.useMemo(() => players.find(c => c.name === name) || null, [players, name]);

    const [tab, setTab] = React.useState<Tab>('stats');
    const [editVisible, setEditVisible] = React.useState(false);

    if (!character) {
        return (
            <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background, padding: styleConstants.paddingXL, alignItems: 'center', justifyContent: 'center' }]}>
                <Stack.Screen options={{ title: 'Character Sheet' }} />
                <Text style={{ color: currentTheme.noticeText, textAlign: 'center' }}>Character not found.</Text>
            </View>
        );
    }

    const abilities = getAbilities(character);
    const level = totalLevel(character);
    const pb = proficiencyBonus(level);
    const maxHp = character.maxHp || 0;
    const curHp = character.currentHp ?? maxHp;

    const adjustHp = (delta: number) => {
        const next = Math.max(0, Math.min(maxHp, curHp + delta));
        updatePlayer(character.name, { currentHp: next });
    };

    return (
        <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background }]}>
            <Stack.Screen options={{ title: character.name }} />

            <ScrollView contentContainerStyle={{ padding: styleConstants.paddingLG, paddingBottom: tabInset }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <Image
                        source={{ uri: character.tokenUrl || DEFAULT_TOKEN_URL }}
                        style={{ width: 60, height: 60, borderRadius: styleConstants.borderRadiusCircle, borderWidth: styleConstants.borderSM, borderColor: currentTheme.primary }}
                    />
                    <View style={{ flex: 1, marginLeft: styleConstants.marginMD }}>
                        <Text style={[styles.name, { color: currentTheme.text }]}>{character.name}</Text>
                        <Text style={{ color: currentTheme.noticeText, fontSize: styleConstants.fontSizeSM }}>
                            {[character.race, classSummary(character)].filter(Boolean).join(' • ') || 'Unclassed'}
                        </Text>
                        <Text style={{ color: currentTheme.noticeText, fontSize: styleConstants.fontSizeSM }}>Level {level}</Text>
                    </View>
                    <Button title="Edit" icon="pencil" size="sm" variant="secondary" onPress={() => setEditVisible(true)} />
                </View>

                {/* Tabs */}
                <View style={{ marginBottom: styleConstants.marginLG }}>
                    <SegmentedControl
                        options={[
                            { key: 'stats', label: 'Stats' },
                            { key: 'details', label: 'Details' },
                            { key: 'inventory', label: 'Items' },
                            { key: 'spells', label: 'Spells' },
                            { key: 'creatures', label: 'Beasts' },
                        ]}
                        value={tab}
                        onChange={k => setTab(k as Tab)}
                    />
                </View>

                {tab === 'stats' && (
                    <>
                        {/* Vitals */}
                        <View style={styles.tileRow}>
                            <StatTile label="AC" value={character.ac || 10} theme={currentTheme} />
                            <StatTile label="Initiative" value={formatMod(initiative(character))} theme={currentTheme} />
                            <StatTile label="Speed" value={`${character.speed ?? 30} ft`} theme={currentTheme} />
                        </View>
                        <View style={styles.tileRow}>
                            <StatTile label="Prof. Bonus" value={formatMod(pb)} theme={currentTheme} accent />
                            <StatTile label="Pass. Percep." value={passivePerception(character)} theme={currentTheme} />
                            <StatTile label="Hit Dice" value={character.hitDice || `${level}d—`} theme={currentTheme} />
                        </View>

                        {/* HP tracker */}
                        <View style={[styles.hpCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
                            <TouchableOpacity onPress={() => adjustHp(-1)} style={[styles.hpBtn, { borderColor: currentTheme.border }]}>
                                <Ionicons name="remove" size={20} color={currentTheme.text} />
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Text style={[styles.hpValue, { color: currentTheme.text }]}>
                                    {curHp}<Text style={{ color: currentTheme.noticeText, fontSize: styleConstants.fontSizeLG }}> / {maxHp}</Text>
                                </Text>
                                <Text style={[styles.statLabel, { color: currentTheme.noticeText }]}>
                                    Hit Points{character.tempHp ? ` (+${character.tempHp} temp)` : ''}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => adjustHp(1)} style={[styles.hpBtn, { borderColor: currentTheme.primary, backgroundColor: currentTheme.primary }]}>
                                <Ionicons name="add" size={20} color={currentTheme.buttonText || '#fff'} />
                            </TouchableOpacity>
                        </View>

                        {/* Ability scores */}
                        <View style={styles.abilityGrid}>
                            {ABILITIES.map(key => (
                                <View key={key} style={[styles.abilityTile, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
                                    <Text style={[styles.abilityAbbr, { color: currentTheme.noticeText }]}>{key.toUpperCase()}</Text>
                                    <Text style={[styles.abilityMod, { color: currentTheme.text }]}>{formatMod(abilityMod(abilities[key]))}</Text>
                                    <Text style={[styles.abilityScore, { color: currentTheme.noticeText }]}>{abilities[key]}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Saving throws */}
                        <Text style={[styles.sectionHeader, { color: currentTheme.text }]}>Saving Throws</Text>
                        <View style={[styles.listCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
                            {ABILITIES.map((key: AbilityKey) => (
                                <BonusRow
                                    key={key}
                                    label={ABILITY_LABELS[key]}
                                    bonus={saveBonus(character, key)}
                                    prof={isSaveProficient(character, key) ? 'proficient' : 'none'}
                                    theme={currentTheme}
                                />
                            ))}
                        </View>

                        {/* Skills */}
                        <Text style={[styles.sectionHeader, { color: currentTheme.text }]}>Skills</Text>
                        <View style={[styles.listCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
                            {SKILLS.map(skill => (
                                <BonusRow
                                    key={skill.key}
                                    label={skill.label}
                                    extra={skill.ability.toUpperCase()}
                                    bonus={skillBonus(character, skill)}
                                    prof={skillProficiency(character, skill.key)}
                                    theme={currentTheme}
                                />
                            ))}
                        </View>
                    </>
                )}

                {tab === 'details' && (
                    <View style={[styles.listCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
                        <DetailLine label="Race" value={[character.race, character.subrace].filter(Boolean).join(' — ')} theme={currentTheme} />
                        <DetailLine label="Class" value={classSummary(character)} theme={currentTheme} />
                        <DetailLine label="Background" value={character.background} theme={currentTheme} />
                        <DetailLine label="Alignment" value={character.alignment} theme={currentTheme} />
                        <DetailLine label="Gender" value={character.gender} theme={currentTheme} />
                        {character.notes ? (
                            <View style={{ paddingVertical: styleConstants.paddingMD }}>
                                <Text style={[styles.detailLabel, { color: currentTheme.noticeText, marginBottom: styleConstants.marginXS }]}>Notes</Text>
                                <Text style={{ color: currentTheme.text, lineHeight: 20 }}>{character.notes}</Text>
                            </View>
                        ) : null}
                    </View>
                )}

                {tab === 'inventory' && <InventoryTab character={character} theme={currentTheme} onUpdate={(patch) => updatePlayer(character.name, patch)} />}
                {tab === 'spells' && <SpellsTab character={character} theme={currentTheme} onUpdate={(patch) => updatePlayer(character.name, patch)} />}
                {tab === 'creatures' && <CreaturesTab character={character} theme={currentTheme} onUpdate={(patch) => updatePlayer(character.name, patch)} />}
            </ScrollView>

            <CharacterWizardModal
                visible={editVisible}
                onClose={() => setEditVisible(false)}
                onSave={(data) => { updatePlayer(character.name, data); setEditVisible(false); }}
                character={character}
                campaigns={campaigns}
                theme={currentTheme}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: styleConstants.marginLG },
    name: { fontSize: styleConstants.fontSizeXL, fontWeight: '800' },

    tileRow: { flexDirection: 'row', gap: styleConstants.gapSM, marginBottom: styleConstants.marginSM },
    statTile: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: styleConstants.paddingMD,
        borderRadius: styleConstants.borderRadiusLG,
        borderWidth: styleConstants.borderXS,
    },
    statValue: { fontSize: styleConstants.fontSizeXL, fontWeight: '800' },
    statLabel: {
        fontSize: styleConstants.fontSizeXS,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: styleConstants.margin2XS,
    },

    hpCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: styleConstants.gapSM,
        padding: styleConstants.paddingMD,
        borderRadius: styleConstants.borderRadiusLG,
        borderWidth: styleConstants.borderXS,
        marginTop: styleConstants.marginSM,
        marginBottom: styleConstants.marginLG,
    },
    hpBtn: {
        width: 44, height: 44,
        borderRadius: styleConstants.borderRadiusCircle,
        borderWidth: styleConstants.borderXS,
        alignItems: 'center', justifyContent: 'center',
    },
    hpValue: { fontSize: styleConstants.fontSize2XL || 28, fontWeight: '800' },

    abilityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: styleConstants.gapSM, marginBottom: styleConstants.marginLG },
    abilityTile: {
        width: '31.5%',
        alignItems: 'center',
        paddingVertical: styleConstants.paddingMD,
        borderRadius: styleConstants.borderRadiusLG,
        borderWidth: styleConstants.borderXS,
    },
    abilityAbbr: { fontSize: styleConstants.fontSizeXS, fontWeight: '700', letterSpacing: 1 },
    abilityMod: { fontSize: styleConstants.fontSizeXL, fontWeight: '800', marginVertical: styleConstants.margin2XS },
    abilityScore: { fontSize: styleConstants.fontSizeSM },

    sectionHeader: {
        fontSize: styleConstants.fontSizeSM,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: styleConstants.marginSM,
    },
    listCard: {
        borderRadius: styleConstants.borderRadiusLG,
        borderWidth: styleConstants.borderXS,
        paddingHorizontal: styleConstants.paddingMD,
        marginBottom: styleConstants.marginLG,
    },
    bonusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: styleConstants.paddingSM + 2,
        borderBottomWidth: styleConstants.borderXS,
    },
    bonusLabel: { flex: 1, fontSize: styleConstants.fontSizeMD, marginLeft: styleConstants.marginMD },
    bonusExtra: { fontSize: styleConstants.fontSizeXS, marginRight: styleConstants.marginMD },
    bonusValue: { fontSize: styleConstants.fontSizeMD, fontWeight: '700', minWidth: 34, textAlign: 'right' },

    dot: {
        width: 16, height: 16,
        borderRadius: styleConstants.borderRadiusCircle,
        borderWidth: styleConstants.borderSM,
    },
    dotInner: { width: 6, height: 6, borderRadius: styleConstants.borderRadiusCircle, backgroundColor: '#fff' },

    detailLine: { paddingVertical: styleConstants.paddingMD, borderBottomWidth: styleConstants.borderXS },
    detailLabel: { fontSize: styleConstants.fontSizeXS, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    detailValue: { fontSize: styleConstants.fontSizeMD, marginTop: styleConstants.margin2XS },

    placeholder: { alignItems: 'center', justifyContent: 'center', paddingVertical: styleConstants.paddingXL * 2 },
});
