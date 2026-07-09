// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { Text, TouchableOpacity, View } from 'react-native';

// Helper for splitting and replacing tags in a string
export function replaceTags(
    text: string,
    theme: any,
    onCreaturePress?: (name: string, source: string) => void,
    onSpellPress?: (name: string, source: string) => void,
    onDamagePress?: (expression: string) => void,
    onHitPress?: (bonus: string) => void,
    onEntryPress?: (category: string, name: string, source: string) => void
): React.ReactNode[] {
    if (!text) return [];
    const tagRegex = /\{@(\w+)([^}]*)\}/g;
    let lastIndex = 0;
    let match;
    const nodes: React.ReactNode[] = [];
    let key = 0;

    // Style for rolls (damage, hit, save)
    const rollStyle = {
        backgroundColor: theme.primary,
        borderRadius: styleConstants.borderRadiusSM,
        paddingHorizontal: styleConstants.paddingXS,
        paddingVertical: styleConstants.padding2XS,
        color: '#fff',
        fontWeight: 'bold' as const,
        marginHorizontal: styleConstants.margin2XS,
    };

    while ((match = tagRegex.exec(text)) !== null) {
        // Add text before the tag
        if (match.index > lastIndex) {
            const textBefore = text.slice(lastIndex, match.index);
            if (textBefore.trim()) {
                nodes.push(<Text key={key++} style={{ color: theme.text }}>{textBefore}</Text>);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [full, tag, rest] = match;
        const params = rest.split('|').map(s => s.trim());
        // Tag handling
        switch (tag) {
            case 'adventure':
            case 'book':
            case 'filter':
            case 'footnote':
            case 'note':
            case 'quickref':
            case 'skillCheck':
            case 'table':
                // Italic, stop at first |
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic', color: theme.text }}>{params[0]}</Text>);
                break;
            case 'i':
            case 'italic':
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic', color: theme.text }}>{params[0]}</Text>);
                break;
            case 'b':
            case 'bold':
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', color: theme.text }}>{params[0]}</Text>);
                break;
            case 'u':
            case 'underline':
            case 'underlineDouble':
                nodes.push(<Text key={key++} style={{ textDecorationLine: 'underline', color: theme.text }}>{params[0]}</Text>);
                break;
            case 's':
            case 'strike':
            case 'strikeDouble':
                nodes.push(<Text key={key++} style={{ textDecorationLine: 'line-through', color: theme.text }}>{params[0]}</Text>);
                break;
            case 'sup':
            case 'sub':
                nodes.push(<Text key={key++} style={{ fontSize: styleConstants.fontSizeXS, color: theme.text }}>{params[0]}</Text>);
                break;
            case 'code':
            case 'kbd':
                nodes.push(<Text key={key++} style={{ fontFamily: 'SpaceMono-Regular', color: theme.text }}>{params[0]}</Text>);
                break;
            case 'highlight':
                nodes.push(<Text key={key++} style={{ backgroundColor: theme.primary + '33', color: theme.text }}>{params[0]}</Text>);
                break;
            // 2024 stat-block action/save labels (e.g. {@actSave dex}, {@actSaveFail}, {@actTrigger})
            case 'actSave': {
                const ab: Record<string, string> = { str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', fontStyle: 'italic', color: theme.text }}>{`${ab[params[0]] || params[0]} Saving Throw: `}</Text>);
                break;
            }
            case 'actSaveSuccess':
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', fontStyle: 'italic', color: theme.text }}>Success: </Text>);
                break;
            case 'actSaveFail':
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', fontStyle: 'italic', color: theme.text }}>Failure: </Text>);
                break;
            case 'actSaveFailBy':
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', fontStyle: 'italic', color: theme.text }}>{`Failure by ${params[0]}: `}</Text>);
                break;
            case 'actSaveSuccessOrFail':
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', fontStyle: 'italic', color: theme.text }}>Success or Failure: </Text>);
                break;
            case 'actTrigger':
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', fontStyle: 'italic', color: theme.text }}>Trigger: </Text>);
                break;
            case 'actResponse':
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', fontStyle: 'italic', color: theme.text }}>Response: </Text>);
                break;
            case 'hitYourSpellAttack':
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', color: theme.text }}>{params[0] || 'your spell attack modifier'}</Text>);
                break;
            case 'dcYourSpellSave':
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', color: theme.text }}>{params[0] || 'your spell save DC'}</Text>);
                break;
            case 'chance':
                nodes.push(<Text key={key++} style={{ color: theme.text }}>{`${params[0]} percent`}</Text>);
                break;
            case 'itemProperty':
            case 'itemMastery':
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic', color: theme.text }}>{params[2] || params[0]}</Text>);
                break;
            case 'atk':
            case 'atkr':
                // Attack type(s), e.g. mw = Melee Weapon Attack
                const atkMap: Record<string, string> = {
                    m: 'Melee Attack',
                    r: 'Ranged Attack',
                    mw: 'Melee Weapon Attack',
                    rw: 'Ranged Weapon Attack',
                    ms: 'Melee Spell Attack',
                    rs: 'Ranged Spell Attack',
                };
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic', color: theme.text }}>{params[0].split(',').map(a => atkMap[a.trim()] || a.trim()).join(', ')}</Text>);
                break;
            case 'damage':
            case 'dice':
            case 'scaledamage':
            case 'scaledice':
                if (onDamagePress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPressIn={() => {
                                console.log('🎲 Dice button pressed:', params[0]);
                                onDamagePress(params[0]);
                            }}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: styleConstants.padding2XS,
                                paddingHorizontal: styleConstants.padding2XS,
                                marginHorizontal: styleConstants.margin2XS,
                                borderRadius: styleConstants.borderRadiusXS,
                                minHeight: 16,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={rollStyle}>{params[0]}</Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(
                        <Text key={key++} style={{ fontWeight: 'bold', color: theme.text }}>{params[0]}</Text>
                    );
                }
                break;
            case 'dc':
                nodes.push(
                    <Text key={key++} style={{ fontWeight: 'bold', color: theme.text }}>{`DC ${params[0]}`}</Text>
                );
                break;
            case 'hit':
                if (onHitPress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPressIn={() => {
                                console.log('⚔️ Hit button pressed:', params[0]);
                                onHitPress(params[0]);
                            }}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: styleConstants.padding2XS,
                                paddingHorizontal: styleConstants.padding2XS,
                                marginHorizontal: styleConstants.margin2XS,
                                borderRadius: styleConstants.borderRadiusXS,
                                minHeight: 16,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={rollStyle}>{`+${params[0]}`}</Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(
                        <Text key={key++} style={{ fontWeight: 'bold', color: theme.text }}>{`+${params[0]}`}</Text>
                    );
                }
                break;
            case 'd20': {
                // Signed d20 modifier, e.g. {@d20 8} -> "+8", {@d20 -1} -> "-1"
                const raw = (params[0] || '0').trim();
                const signed = /^[+-]/.test(raw) ? raw : `+${raw}`;
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', color: theme.text }}>{signed}</Text>);
                break;
            }
            case 'h':
            case 'hom':
                // Ignore
                break;
            case 'recharge':
                // Recharge value
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', color: theme.text }}>{params[0] ? `Recharge ${params[0]}` : 'Recharge'}</Text>);
                break;
            case 'condition':
            case 'status':
            case 'disease':
            case 'action':
            case 'feat':
            case 'background':
            case 'item':
            case 'race':
            case 'class':
            case 'variantrule':
            case 'deity':
            case 'reward':
            case 'hazard':
            case 'trap':
            case 'object':
            case 'vehicle':
            case 'language':
            case 'optfeature':
            case 'charoption':
            case 'sense':
            case 'skill':
            case 'cult':
            case 'boon':
            case 'psionic':
            case 'facility': {
                // e.g. {@condition name|source|displayText} — tappable link to the entry modal.
                const condName = params[0];
                const condSource = params[1] || '';
                const condDisplay = params[2] || params[0];
                if (onEntryPress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPressIn={() => onEntryPress(tag, condName, condSource)}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 0,
                                paddingHorizontal: styleConstants.padding2XS,
                                marginHorizontal: styleConstants.margin2XS,
                                borderRadius: styleConstants.borderRadiusXS,
                                minHeight: 14,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ fontStyle: 'italic', textDecorationLine: 'underline', color: '#4a90e2' }}>
                                {condDisplay}
                            </Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(<Text key={key++} style={{ fontStyle: 'italic', color: theme.text }}>{condDisplay}</Text>);
                }
                break;
            }
            case 'creature':
                // Clickable link to bestiary
                if (onCreaturePress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPressIn={() => {
                                console.log('🐉 Creature button pressed:', params[0], params[1]);
                                onCreaturePress(params[0], params[1]);
                            }}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 0,
                                paddingHorizontal: styleConstants.padding2XS,
                                marginHorizontal: styleConstants.margin2XS,
                                borderRadius: styleConstants.borderRadiusXS,
                                minHeight: 14,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ fontStyle: 'italic', textDecorationLine: 'underline', color: '#4a90e2' }}>
                                {params[0]}
                            </Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(
                        <Text key={key++} style={{ fontStyle: 'italic', textDecorationLine: 'underline', color: '#4a90e2' }}>
                            {params[0]}
                        </Text>
                    );
                }
                break;
            case 'spell':
                // Clickable link to spellbook
                if (onSpellPress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPressIn={() => {
                                console.log('✨ Spell button pressed:', params[0], params[1]);
                                onSpellPress(params[0], params[1]);
                            }}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 0,
                                paddingHorizontal: styleConstants.padding2XS,
                                marginHorizontal: styleConstants.margin2XS,
                                borderRadius: styleConstants.borderRadiusXS,
                                minHeight: 14,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ fontStyle: 'italic', textDecorationLine: 'underline', color: '#4a90e2' }}>
                                {params[0]}
                            </Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(
                        <Text key={key++} style={{ fontStyle: 'italic', textDecorationLine: 'underline', color: '#4a90e2' }}>
                            {params[0]}
                        </Text>
                    );
                }
                break;
            default:
                // Fallback: just show the first param in italic
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic', color: theme.text }}>{params[0]}</Text>);
                break;
        }
        lastIndex = tagRegex.lastIndex;
    }
    // Add any remaining text
    if (lastIndex < text.length) {
        const textAfter = text.slice(lastIndex);
        if (textAfter.trim()) {
            nodes.push(<Text key={key++} style={{ color: theme.text }}>{textAfter}</Text>);
        }
    }
    return nodes;
}

// Shared function to render complex entries including lists
export function renderEntries(
    entries: any,
    indent: number = 0,
    theme: any,
    onCreaturePress?: (name: string, source: string) => void,
    onSpellPress?: (name: string, source: string) => void,
    textStyle: any = {},
    onDamagePress?: (expression: string) => void,
    onHitPress?: (bonus: string) => void,
    onEntryPress?: (category: string, name: string, source: string) => void
): React.ReactNode {
    if (!entries) return null;

    if (typeof entries === 'string') {
        const parsed = replaceTags(entries, theme, onCreaturePress, onSpellPress, onDamagePress, onHitPress, onEntryPress);
        return (
            <Text style={[{ marginLeft: indent, marginBottom: styleConstants.marginXS, color: theme.text, fontSize: styleConstants.fontSizeSM, flexWrap: 'wrap' }, textStyle]}>
                {parsed}
            </Text>
        );
    }

    if (Array.isArray(entries)) {
        return entries.map((entry, idx) => (
            <React.Fragment key={idx}>
                {renderEntries(entry, indent, theme, onCreaturePress, onSpellPress, textStyle, onDamagePress, onHitPress, onEntryPress)}
            </React.Fragment>
        ));
    }

    if (typeof entries === 'object') {
        if (entries.type === 'entries' && entries.name) {
            return (
                <View key={entries.name + indent} style={{ marginLeft: indent + 10, marginBottom: styleConstants.marginXS }}>
                    <Text style={[{ fontWeight: 'bold', marginBottom: styleConstants.margin2XS, color: theme.text, fontSize: styleConstants.fontSizeSM }, textStyle]}>{entries.name}.</Text>
                    {renderEntries(entries.entries, indent + 10, theme, onCreaturePress, onSpellPress, textStyle, onDamagePress, onHitPress, onEntryPress)}
                </View>
            );
        }

        if (entries.type === 'list' && entries.items) {
            return (
                <View style={{ marginLeft: indent, marginBottom: styleConstants.marginXS }}>
                    {entries.items.map((item: any, idx: number) => (
                        <View key={idx} style={{ flexDirection: 'row', marginBottom: styleConstants.margin2XS }}>
                            <Text style={[{ color: theme.text, marginRight: styleConstants.marginSM, fontSize: styleConstants.fontSizeSM }, textStyle]}>•</Text>
                            <View style={[{ flex: 1 }]}>
                                {typeof item === 'string' ? (
                                    <Text style={[{ color: theme.text, fontSize: styleConstants.fontSizeSM, flexWrap: 'wrap' }, textStyle]}>
                                        {replaceTags(item, theme, onCreaturePress, onSpellPress, onDamagePress, onHitPress, onEntryPress)}
                                    </Text>
                                ) : renderEntries(item, 0, theme, onCreaturePress, onSpellPress, textStyle, onDamagePress, onHitPress, onEntryPress)}
                            </View>
                        </View>
                    ))}
                </View>
            );
        }

        if (entries.type === 'table' && entries.rows) {
            // Calculate column widths based on content
            const calculateColumnWidths = () => {
                const numCols = entries.rows[0]?.length || 0;
                const columnWidths = new Array(numCols).fill(1); // Default equal width
                
                // Analyze content to determine optimal widths
                entries.rows.forEach((row: any[]) => {
                    row.forEach((cell: any, colIdx: number) => {
                        const cellText = typeof cell === 'string' ? cell : String(cell);
                        const cellLength = cellText.length;
                        
                        // If column has mostly short content (like numbers), give it less width
                        if (cellLength < 20) {
                            columnWidths[colIdx] = Math.min(columnWidths[colIdx], 0.3);
                        } else if (cellLength > 100) {
                            // If column has very long content, give it more width
                            columnWidths[colIdx] = Math.max(columnWidths[colIdx], 2);
                        }
                    });
                });
                
                // Normalize widths to sum to numCols
                const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
                return columnWidths.map(width => (width / totalWidth) * numCols);
            };
            
            const columnWidths = calculateColumnWidths();
            
            return (
                <View style={{ marginLeft: indent, marginBottom: styleConstants.marginSM }}>
                    {entries.caption && (
                        <Text style={[{ fontWeight: 'bold', marginBottom: styleConstants.marginXS, color: theme.text, fontSize: styleConstants.fontSizeSM }, textStyle]}>
                            {entries.caption}
                        </Text>
                    )}
                    <View style={{ borderWidth: styleConstants.borderXS, borderColor: theme.border, borderRadius: styleConstants.borderRadiusSM }}>
                        {entries.colLabels && (
                            <View style={{ flexDirection: 'row', borderBottomWidth: styleConstants.borderXS, borderBottomColor: theme.border }}>
                                {entries.colLabels.map((label: string, idx: number) => (
                                    <View key={idx} style={{ 
                                        flex: columnWidths[idx] || 1, 
                                        padding: styleConstants.paddingSM, 
                                        backgroundColor: theme.innerBackground || '#f5f5f5',
                                        borderRightWidth: idx < entries.colLabels.length - 1 ? 1 : 0,
                                        borderRightColor: theme.border
                                    }}>
                                        <Text style={[{ fontWeight: 'bold', color: theme.text, fontSize: styleConstants.fontSizeXS }, textStyle]}>
                                            {label}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {entries.rows.map((row: any[], rowIdx: number) => (
                            <View key={rowIdx} style={{ flexDirection: 'row', borderBottomWidth: rowIdx < entries.rows.length - 1 ? 1 : 0, borderBottomColor: theme.border }}>
                                {row.map((cell: any, cellIdx: number) => (
                                    <View key={cellIdx} style={{ 
                                        flex: columnWidths[cellIdx] || 1, 
                                        padding: styleConstants.paddingSM,
                                        borderRightWidth: cellIdx < row.length - 1 ? 1 : 0,
                                        borderRightColor: theme.border,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={[{ color: theme.text, fontSize: styleConstants.fontSizeXS, flexWrap: 'wrap' }, textStyle]}>
                                            {typeof cell === 'string' ? 
                                                replaceTags(cell, theme, onCreaturePress, onSpellPress, onDamagePress, onHitPress, onEntryPress) : 
                                                cell
                                            }
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            );
        }

        if (entries.entries) {
            return renderEntries(entries.entries, indent, theme, onCreaturePress, onSpellPress, textStyle, onDamagePress, onHitPress, onEntryPress);
        }

        // Fallback for unknown object types
        return <Text style={[{ marginLeft: indent, color: theme.text, fontSize: styleConstants.fontSizeSM }, textStyle]}>{JSON.stringify(entries)}</Text>;
    }

    return null;
}

// Parse dice expressions like '12d8 + 5' or '2d6-1'
export function parseDiceExpression(expr: string): { numDice: number, diceType: number, modifier: number } | null {
    // Match patterns like 12d8, 12d8+5, 12d8 - 5, 1d6, 1d6+1, etc.
    const match = expr.replace(/\s+/g, '').match(/^(\d+)d(\d+)([+-]\d+)?$/);
    if (!match) return null;
    const numDice = parseInt(match[1], 10);
    const diceType = parseInt(match[2], 10);
    const modifier = match[3] ? parseInt(match[3], 10) : 0;
    return { numDice, diceType, modifier };
}

// Roll dice given numDice, diceType, and modifier
export function rollDice(numDice: number, diceType: number, modifier: number = 0): { result: number, breakdown: number[] } {
    const breakdown: number[] = [];
    for (let i = 0; i < numDice; i++) {
        breakdown.push(Math.floor(Math.random() * diceType) + 1);
    }
    const result = breakdown.reduce((a, b) => a + b, 0) + modifier;
    return { result, breakdown };
}
