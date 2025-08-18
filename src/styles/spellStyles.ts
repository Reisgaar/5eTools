// REACT
import { StyleSheet, Platform } from 'react-native';

// STYLES
import { baseStyles, createThemedStyles } from 'src/styles/baseStyles';

// Helper function to apply theme colors to base styles
const applyThemeToBaseStyle = (baseStyle: any, theme: any) => {
    return {
        ...baseStyle,
        color: theme.text,
        borderColor: theme.border,
    };
};

export const createSpellStyles = (theme: any) => {
    const baseSpellStyles = createThemedStyles(baseStyles, theme, {
    // Theme-specific overrides for spell components
        modalTitle: {
            ...baseStyles.modalTitle,
            color: theme.text,
        } as any,
        filterOptionText: {
            ...baseStyles.filterOptionText,
            color: theme.text,
        } as any,
        filterCheckbox: {
            ...baseStyles.filterCheckbox,
            borderColor: theme.text,
        } as any,
        detailTitle: {
            ...baseStyles.detailTitle,
            color: theme.text,
        } as any,
        detailSubtitle: {
            ...baseStyles.detailSubtitle,
            color: theme.text,
        } as any,
        detailField: {
            ...baseStyles.detailField,
            color: theme.text,
        } as any,
        detailEntry: {
            ...baseStyles.detailEntry,
            color: theme.text,
        } as any,
        detailGrid: {
            ...baseStyles.detailGrid,
            borderColor: theme.text,
        } as any,
        detailGridLabel: {
            ...baseStyles.detailGridLabel,
            color: theme.text,
        } as any,
        detailGridValue: {
            ...baseStyles.detailGridValue,
            color: theme.text,
        } as any,
        detailScrollView: {
            ...baseStyles.detailScrollView,
            borderColor: theme.text,
        } as any,
        detailSource: {
            ...baseStyles.detailSource,
            color: theme.noticeText,
        } as any,
        listItemName: {
            ...baseStyles.listItemName,
            color: theme.text,
        } as any,
        listItemDescription: {
            ...baseStyles.listItemDescription,
            color: theme.noticeText,
        } as any,
        listItemStats: {
            ...baseStyles.listItemStats,
            color: theme.noticeText,
        } as any,
    });

    return StyleSheet.create({
    // Spell-specific styles that extend base styles
        ...baseSpellStyles,

        // Spell Detail Modal specific styles
        spellDetailOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center', // Back to center
            alignItems: 'center',
            zIndex: 10,
        },
        spellDetailContent: {
            ...baseStyles.detailContent,
            backgroundColor: theme.card,
            zIndex: 10,
            maxHeight: '85%',
            minHeight: 700,
            height: '85%',
            width: '95%',
            maxWidth: 500,
            overflow: 'hidden',
        },
        spellDetailHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        spellDetailHeaderInfo: {
            flex: 1,
            marginRight: 8,
        },
        spellDetailCloseButton: {
            padding: 4,
        },
        spellDetailSeparator: {
            height: 1,

            marginBottom: 16,
        },
        spellDetailGridContainer: {
            paddingHorizontal: 20,
            marginBottom: 8, // Reduced from 15
        },
        spellDetailCloseBtn: baseStyles.detailCloseBtn,
        spellDetailTitle: {
            ...applyThemeToBaseStyle(baseStyles.detailTitle, theme),
            fontSize: 18,
            marginBottom: 4,
        },
        spellDetailSubtitle: {
            ...baseStyles.detailSubtitle,
            color: theme.noticeText,
            fontSize: 12,
            marginBottom: 6,
        },
        spellDetailField: applyThemeToBaseStyle(baseStyles.detailField, theme),
        spellDetailEntry: applyThemeToBaseStyle(baseStyles.detailEntry, theme),
        spellDetailGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 8,
            marginBottom: 20,
            overflow: 'hidden',
        },
        spellDetailGridItem: {
            width: '50%',
            borderWidth: 1,
            borderColor: theme.border,
            padding: 16,
            alignItems: 'center',
        },
        spellDetailGridItemLast: {
            ...baseStyles.detailGridItemLast,
            width: '50%',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
        },
        spellDetailGridLabel: {
            fontWeight: 'bold',
            fontSize: 14,
            color: theme.text,
            marginBottom: 6,
            textAlign: 'center',
        },
        spellDetailGridValue: {
            fontSize: 14,
            color: theme.text,
            textAlign: 'center',
        },
        spellDetailGridValueContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 24,
        },
        spellDetailScrollView: {
            flex: 1,
            paddingHorizontal: 20,
        },
        spellDetailScrollContent: {
            paddingBottom: 16,
        },
        spellDetailSection: {
            marginBottom: 20,
        },
        spellDetailSectionTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.text,
            marginBottom: 12,
            textAlign: 'center',
        },
        spellDetailFooter: {
            alignItems: 'flex-end',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
        spellDetailSource: {
            fontSize: 10,
            color: theme.noticeText,
            fontStyle: 'italic',
            textAlign: 'right',
        },

        // Spellbook Modal specific styles
        spellbookModalContent: {
            ...baseStyles.filterModalContent,
            backgroundColor: theme.card,
            width: 360,
            maxHeight: '85%',
        },
        spellbookModalTitle: baseStyles.modalTitle,
        spellbookModalHeader: baseStyles.modalHeader,
        spellbookModalCloseButton: baseStyles.modalCloseButton,
        spellbookItem: baseStyles.listItem,
        spellbookContent: baseStyles.listItemContent,
        spellbookName: baseStyles.listItemName,
        spellbookDescription: baseStyles.listItemDescription,
        spellbookStats: baseStyles.listItemStats,

        // Spell Filter Modal specific styles
        spellFilterModalContent: {
            ...baseStyles.filterModalContent,
            backgroundColor: theme.card,
        },
        spellFilterModalTitle: baseStyles.modalTitle,
        spellFilterClearButton: {
            ...baseStyles.filterClearButton,
            borderColor: theme.primary,
        },
        spellFilterClearButtonText: {
            ...baseStyles.filterClearButtonText,
            color: theme.primary,
        },
        spellFilterScrollView: baseStyles.filterScrollView,
        spellFilterGrid: baseStyles.filterGrid,
        spellFilterOptionContainer: baseStyles.filterOptionContainer,
        spellFilterOptionContainerHalf: baseStyles.filterOptionContainerHalf,
        spellFilterOptionContainerFull: baseStyles.filterOptionContainerFull,
        spellFilterOptionRow: baseStyles.filterOptionRow,
        spellFilterCheckbox: baseStyles.filterCheckbox,
        spellFilterOptionText: baseStyles.filterOptionText,
        spellFilterApplyButton: {
            ...baseStyles.filterApplyButton,
            backgroundColor: theme.primary,
        },
        spellFilterApplyButtonText: baseStyles.filterApplyButtonText,

        // Modal Overlay Styles (reuse base styles)
        modalOverlay: baseStyles.modalOverlay,
        modalContentWrapper: baseStyles.modalContentWrapper,
        modalContent: {
            ...baseStyles.modalContent,
            backgroundColor: theme.card,
        },
        closeIconBtn: baseStyles.closeIconBtn,
    });
};
