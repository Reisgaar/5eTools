import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Enhanced tag replacement system for 5etools data
export function replaceEnhancedTags(
    text: string,
    theme: any,
    onCreaturePress?: (name: string, source: string) => void,
    onSpellPress?: (name: string, source: string) => void,
    onDamagePress?: (expression: string) => void,
    onHitPress?: (bonus: string) => void,
    onSavePress?: (save: string) => void,
    onConditionPress?: (condition: string) => void,
    onItemPress?: (item: string) => void,
    onFeatPress?: (feat: string) => void
): React.ReactNode[] {
    if (!text) return [];
    
    const tagRegex = /\{@(\w+)([^}]*)\}/g;
    let lastIndex = 0;
    let match;
    const nodes: React.ReactNode[] = [];
    let key = 0;

    // Enhanced styling
    const rollStyle = {
        backgroundColor: theme.primary,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        color: '#fff',
        fontWeight: 'bold' as const,
        marginHorizontal: 2,
    };

    const linkStyle = {
        fontStyle: 'italic' as const,
        textDecorationLine: 'underline' as const,
        color: '#4a90e2',
    };

    const italicStyle = {
        fontStyle: 'italic' as const,
        color: theme.text,
    };

    const boldStyle = {
        fontWeight: 'bold' as const,
        color: theme.text,
    };

    while ((match = tagRegex.exec(text)) !== null) {
        // Add text before the tag
        if (match.index > lastIndex) {
            const textBefore = text.slice(lastIndex, match.index);
            if (textBefore.trim()) {
                nodes.push(<Text key={key++} style={{ color: theme.text }}>{textBefore}</Text>);
            }
        }

        const [full, tag, rest] = match;
        const params = rest.split('|').map(s => s.trim());

        // Enhanced tag handling
        switch (tag) {
            // Combat-related tags
            case 'atk':
            case 'atkr':
                const atkMap: Record<string, string> = {
                    m: 'Melee Attack',
                    r: 'Ranged Attack',
                    mw: 'Melee Weapon Attack',
                    rw: 'Ranged Weapon Attack',
                    ms: 'Melee Spell Attack',
                    rs: 'Ranged Spell Attack',
                };
                const attackTypes = params[0].split(',').map(a => atkMap[a.trim()] || a.trim()).join(', ');
                nodes.push(<Text key={key++} style={italicStyle}>{attackTypes}</Text>);
                break;

            case 'hit':
                if (onHitPress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPress={() => onHitPress(params[0])}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 1,
                                paddingHorizontal: 3,
                                marginHorizontal: 1,
                                borderRadius: 2,
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
                    nodes.push(<Text key={key++} style={boldStyle}>{`+${params[0]}`}</Text>);
                }
                break;

            case 'damage':
            case 'dice':
                if (onDamagePress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPress={() => onDamagePress(params[0])}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 1,
                                paddingHorizontal: 3,
                                marginHorizontal: 1,
                                borderRadius: 2,
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
                    nodes.push(<Text key={key++} style={boldStyle}>{params[0]}</Text>);
                }
                break;

            case 'dc':
                nodes.push(<Text key={key++} style={boldStyle}>{`DC ${params[0]}`}</Text>);
                break;

            case 'save':
                if (onSavePress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPress={() => onSavePress(params[0])}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 1,
                                paddingHorizontal: 3,
                                marginHorizontal: 1,
                                borderRadius: 2,
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
                    nodes.push(<Text key={key++} style={boldStyle}>{params[0]}</Text>);
                }
                break;

            // Creature and spell links
            case 'creature':
                if (onCreaturePress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPress={() => onCreaturePress(params[0], params[1] || 'MM')}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 0,
                                paddingHorizontal: 1,
                                marginHorizontal: 1,
                                borderRadius: 1,
                                minHeight: 14,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={linkStyle}>{params[0]}</Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(<Text key={key++} style={linkStyle}>{params[0]}</Text>);
                }
                break;

            case 'spell':
                if (onSpellPress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPress={() => onSpellPress(params[0], params[1] || 'PHB')}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 0,
                                paddingHorizontal: 1,
                                marginHorizontal: 1,
                                borderRadius: 1,
                                minHeight: 14,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={linkStyle}>{params[0]}</Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(<Text key={key++} style={linkStyle}>{params[0]}</Text>);
                }
                break;

            // Item and feat links
            case 'item':
                if (onItemPress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPress={() => onItemPress(params[0])}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 0,
                                paddingHorizontal: 1,
                                marginHorizontal: 1,
                                borderRadius: 1,
                                minHeight: 14,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={linkStyle}>{params[0]}</Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(<Text key={key++} style={linkStyle}>{params[0]}</Text>);
                }
                break;

            case 'feat':
                if (onFeatPress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPress={() => onFeatPress(params[0])}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 0,
                                paddingHorizontal: 1,
                                marginHorizontal: 1,
                                borderRadius: 1,
                                minHeight: 14,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={linkStyle}>{params[0]}</Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(<Text key={key++} style={linkStyle}>{params[0]}</Text>);
                }
                break;

            // Condition and status
            case 'condition':
                if (onConditionPress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPress={() => onConditionPress(params[0])}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 0,
                                paddingHorizontal: 1,
                                marginHorizontal: 1,
                                borderRadius: 1,
                                minHeight: 14,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={linkStyle}>{params[0]}{params[1] ? ` (${params[1]})` : ''}</Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(<Text key={key++} style={italicStyle}>{params[0]}{params[1] ? ` (${params[1]})` : ''}</Text>);
                }
                break;

            case 'status':
                nodes.push(<Text key={key++} style={italicStyle}>{params[0]}</Text>);
                break;

            // Recharge and special mechanics
            case 'recharge':
                const rechargeText = params[0] ? `Recharge ${params[0]}` : 'Recharge';
                nodes.push(<Text key={key++} style={boldStyle}>{rechargeText}</Text>);
                break;

            case 'h':
            case 'hom':
                // Ignore these tags (they're formatting hints)
                break;

            // Skill and ability checks
            case 'skill':
                nodes.push(<Text key={key++} style={italicStyle}>{params[0]}</Text>);
                break;

            case 'skillCheck':
                nodes.push(<Text key={key++} style={italicStyle}>{params[0]}</Text>);
                break;

            // Other common tags
            case 'b':
            case 'i':
            case 'action':
            case 'adventure':
            case 'book':
            case 'deity':
            case 'disease':
            case 'filter':
            case 'footnote':
            case 'note':
            case 'quickref':
            case 'sense':
            case 'table':
            case 'variantrule':
                nodes.push(<Text key={key++} style={italicStyle}>{params[0]}</Text>);
                break;

            default:
                // Fallback: show the first param in italic
                nodes.push(<Text key={key++} style={italicStyle}>{params[0]}</Text>);
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

// Enhanced entry renderer with better formatting
export function renderEnhancedEntries(
    entries: any,
    indent: number = 0,
    theme: any,
    onCreaturePress?: (name: string, source: string) => void,
    onSpellPress?: (name: string, source: string) => void,
    textStyle: any = {},
    onDamagePress?: (expression: string) => void,
    onHitPress?: (bonus: string) => void,
    onSavePress?: (save: string) => void,
    onConditionPress?: (condition: string) => void,
    onItemPress?: (item: string) => void,
    onFeatPress?: (feat: string) => void
): React.ReactNode {
    if (!entries) return null;

    if (typeof entries === 'string') {
        const parsed = replaceEnhancedTags(
            entries, 
            theme, 
            onCreaturePress, 
            onSpellPress, 
            onDamagePress, 
            onHitPress,
            onSavePress,
            onConditionPress,
            onItemPress,
            onFeatPress
        );
        return (
            <Text style={[{ 
                marginLeft: indent, 
                marginBottom: 6, 
                color: theme.text, 
                fontSize: 12, 
                flexWrap: 'wrap',
                lineHeight: 16
            }, textStyle]}>
                {parsed}
            </Text>
        );
    }

    if (Array.isArray(entries)) {
        return entries.map((entry, idx) => (
            <React.Fragment key={idx}>
                {renderEnhancedEntries(
                    entry, 
                    indent, 
                    theme, 
                    onCreaturePress, 
                    onSpellPress, 
                    textStyle, 
                    onDamagePress, 
                    onHitPress,
                    onSavePress,
                    onConditionPress,
                    onItemPress,
                    onFeatPress
                )}
            </React.Fragment>
        ));
    }

    if (typeof entries === 'object') {
        // Handle different entry types
        if (entries.type === 'entries' && entries.name) {
            return (
                <View key={entries.name + indent} style={{ marginLeft: indent + 10, marginBottom: 4 }}>
                    <Text style={[{ 
                        fontWeight: 'bold', 
                        marginBottom: 2, 
                        color: theme.text, 
                        fontSize: 12 
                    }, textStyle]}>
                        {entries.name}.
                    </Text>
                    {renderEnhancedEntries(
                        entries.entries, 
                        indent + 10, 
                        theme, 
                        onCreaturePress, 
                        onSpellPress, 
                        textStyle, 
                        onDamagePress, 
                        onHitPress,
                        onSavePress,
                        onConditionPress,
                        onItemPress,
                        onFeatPress
                    )}
                </View>
            );
        }

        if (entries.type === 'list' && entries.items) {
            return (
                <View style={{ marginLeft: indent, marginBottom: 4 }}>
                    {entries.items.map((item: any, idx: number) => (
                        <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
                            <Text style={[{ color: theme.text, marginRight: 8, fontSize: 12 }, textStyle]}>•</Text>
                            <View style={{ flex: 1 }}>
                                {typeof item === 'string' ? (
                                    <Text style={[{ 
                                        color: theme.text, 
                                        fontSize: 12, 
                                        flexWrap: 'wrap',
                                        lineHeight: 16
                                    }, textStyle]}>
                                        {replaceEnhancedTags(
                                            item, 
                                            theme, 
                                            onCreaturePress, 
                                            onSpellPress, 
                                            onDamagePress, 
                                            onHitPress,
                                            onSavePress,
                                            onConditionPress,
                                            onItemPress,
                                            onFeatPress
                                        )}
                                    </Text>
                                ) : renderEnhancedEntries(
                                    item, 
                                    0, 
                                    theme, 
                                    onCreaturePress, 
                                    onSpellPress, 
                                    textStyle, 
                                    onDamagePress, 
                                    onHitPress,
                                    onSavePress,
                                    onConditionPress,
                                    onItemPress,
                                    onFeatPress
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            );
        }

        if (entries.type === 'table' && entries.rows) {
            return renderTable(entries, indent, theme, textStyle, onCreaturePress, onSpellPress, onDamagePress, onHitPress, onSavePress, onConditionPress, onItemPress, onFeatPress);
        }

        if (entries.entries) {
            return renderEnhancedEntries(
                entries.entries, 
                indent, 
                theme, 
                onCreaturePress, 
                onSpellPress, 
                textStyle, 
                onDamagePress, 
                onHitPress,
                onSavePress,
                onConditionPress,
                onItemPress,
                onFeatPress
            );
        }

        // Fallback for unknown object types
        return <Text style={[{ marginLeft: indent, color: theme.text, fontSize: 12 }, textStyle]}>{JSON.stringify(entries)}</Text>;
    }

    return null;
}

// Enhanced table renderer
function renderTable(
    table: any,
    indent: number,
    theme: any,
    textStyle: any,
    onCreaturePress?: (name: string, source: string) => void,
    onSpellPress?: (name: string, source: string) => void,
    onDamagePress?: (expression: string) => void,
    onHitPress?: (bonus: string) => void,
    onSavePress?: (save: string) => void,
    onConditionPress?: (condition: string) => void,
    onItemPress?: (item: string) => void,
    onFeatPress?: (feat: string) => void
): React.ReactNode {
    const calculateColumnWidths = () => {
        const numCols = table.rows[0]?.length || 0;
        const columnWidths = new Array(numCols).fill(1);
        
        table.rows.forEach((row: any[]) => {
            row.forEach((cell: any, colIdx: number) => {
                const cellText = typeof cell === 'string' ? cell : String(cell);
                const cellLength = cellText.length;
                
                if (cellLength < 20) {
                    columnWidths[colIdx] = Math.min(columnWidths[colIdx], 0.3);
                } else if (cellLength > 100) {
                    columnWidths[colIdx] = Math.max(columnWidths[colIdx], 2);
                }
            });
        });
        
        const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
        return columnWidths.map(width => (width / totalWidth) * numCols);
    };
    
    const columnWidths = calculateColumnWidths();
    
    return (
        <View style={{ marginLeft: indent, marginBottom: 8 }}>
            {table.caption && (
                <Text style={[{ fontWeight: 'bold', marginBottom: 4, color: theme.text, fontSize: 12 }, textStyle]}>
                    {table.caption}
                </Text>
            )}
            <View style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 4 }}>
                {table.colLabels && (
                    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.border }}>
                        {table.colLabels.map((label: string, idx: number) => (
                            <View key={idx} style={{ 
                                flex: columnWidths[idx] || 1, 
                                padding: 8, 
                                backgroundColor: theme.innerBackground || '#f5f5f5',
                                borderRightWidth: idx < table.colLabels.length - 1 ? 1 : 0,
                                borderRightColor: theme.border
                            }}>
                                <Text style={[{ fontWeight: 'bold', color: theme.text, fontSize: 11 }, textStyle]}>
                                    {label}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
                {table.rows.map((row: any[], rowIdx: number) => (
                    <View key={rowIdx} style={{ 
                        flexDirection: 'row', 
                        borderBottomWidth: rowIdx < table.rows.length - 1 ? 1 : 0, 
                        borderBottomColor: theme.border 
                    }}>
                        {row.map((cell: any, cellIdx: number) => (
                            <View key={cellIdx} style={{ 
                                flex: columnWidths[cellIdx] || 1, 
                                padding: 8,
                                borderRightWidth: cellIdx < row.length - 1 ? 1 : 0,
                                borderRightColor: theme.border,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={[{ color: theme.text, fontSize: 11, flexWrap: 'wrap' }, textStyle]}>
                                    {typeof cell === 'string' ? 
                                        replaceEnhancedTags(
                                            cell, 
                                            theme, 
                                            onCreaturePress, 
                                            onSpellPress, 
                                            onDamagePress, 
                                            onHitPress,
                                            onSavePress,
                                            onConditionPress,
                                            onItemPress,
                                            onFeatPress
                                        ) : 
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
