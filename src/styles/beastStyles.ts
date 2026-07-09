// REACT
import { StyleSheet } from 'react-native';
import { styleConstants } from 'src/styles/style-constants';

// STYLES
import { baseStyles, createThemedStyles } from 'src/styles/baseStyles';

export const createBeastStyles = (theme: any) => {
    const baseBeastStyles = createThemedStyles(baseStyles, theme, {
    // Theme-specific overrides for beast components
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
    // Beast-specific styles that extend base styles
        ...baseBeastStyles,

        // Beast Filter Modal specific styles
        beastFilterModalContent: {
            ...baseBeastStyles.filterModalContent,
            backgroundColor: theme.card,
        },
        beastFilterModalTitle: baseBeastStyles.modalTitle,
        beastFilterClearButton: {
            ...baseBeastStyles.filterClearButton,
            borderColor: theme.primary,
        },
        beastFilterClearButtonText: {
            ...baseBeastStyles.filterClearButtonText,
            color: theme.primary,
        },
        beastFilterScrollView: baseBeastStyles.filterScrollView,
        beastFilterGrid: baseBeastStyles.filterGrid,
        beastFilterOptionContainer: baseBeastStyles.filterOptionContainer,
        beastFilterOptionContainerHalf: baseBeastStyles.filterOptionContainerHalf,
        beastFilterOptionContainerFull: baseBeastStyles.filterOptionContainerFull,
        beastFilterOptionRow: baseBeastStyles.filterOptionRow,
        beastFilterCheckbox: baseBeastStyles.filterCheckbox,
        beastFilterOptionText: baseBeastStyles.filterOptionText,
        beastFilterApplyButton: {
            ...baseBeastStyles.filterApplyButton,
            backgroundColor: theme.primary,
        },
        beastFilterApplyButtonText: baseBeastStyles.filterApplyButtonText,

        // Beast Combat Selection Modal specific styles
        beastCombatSelectionModalContent: {
            ...baseBeastStyles.filterModalContent,
            backgroundColor: theme.card,
            width: 360,
            maxHeight: '85%',
        },
        beastCombatSelectionTitle: baseBeastStyles.modalTitle,
        beastCombatSelectionContainer: {
            flex: 1,
        },
        beastQuantitySection: {
            marginBottom: styleConstants.marginLG,
        },
        beastQuantityRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        beastQuantityTitle: {
            fontSize: styleConstants.fontSizeLG,
            fontWeight: '600',
            marginBottom: styleConstants.marginSM,
            color: theme.text,
        },
        beastQuantityControls: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        beastQuantityButton: {
            width: 40,
            height: 40,
            borderRadius: styleConstants.borderRadius2XL,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.primary,
        },
        beastQuantityInput: {
            width: 60,
            height: 40,
            borderWidth: styleConstants.borderXS,
            borderRadius: styleConstants.borderRadiusMD,
            textAlign: 'center',
            marginHorizontal: styleConstants.marginSM,
            fontSize: styleConstants.fontSizeLG,
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.primary,
        },
        beastCombatListSection: {
            marginBottom: styleConstants.marginLG,
        },
        beastCombatListTitle: {
            fontSize: styleConstants.fontSizeLG,
            fontWeight: '600',
            marginBottom: styleConstants.marginSM,
            color: theme.text,
        },
        beastCombatListEmpty: {
            textAlign: 'center',
            fontStyle: 'italic',
            marginVertical: styleConstants.marginSM,
            color: theme.noticeText,
        },
        beastCombatListScroll: {
            maxHeight: 200,
        },
        beastCombatListItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: styleConstants.paddingMD,
            paddingHorizontal: styleConstants.paddingLG,
            borderBottomWidth: styleConstants.borderXS,
            marginBottom: styleConstants.marginXS,
            borderRadius: styleConstants.borderRadiusSM,
        },
        beastCombatListItemSelected: {
            backgroundColor: theme.primary + '20',
        },
        beastCombatName: {
            fontSize: styleConstants.fontSizeLG,
            fontWeight: '600',
            marginBottom: styleConstants.marginXS,
            color: theme.text,
        },
        beastCombatCount: {
            fontSize: styleConstants.fontSizeMD,
            color: theme.noticeText,
        },
        beastCancelButton: {
            borderWidth: styleConstants.borderXS,
            borderRadius: styleConstants.borderRadiusMD,
            padding: styleConstants.paddingMD,
            alignItems: 'center',
            borderColor: theme.primary,
        },
        beastCancelButtonText: {
            fontWeight: 'bold',
            fontSize: styleConstants.fontSizeLG,
            color: theme.primary,
        },

        // Beast Detail Modal specific styles (now using centralized modals.ts)
        beastDetailRow: {
            flexDirection: 'row',
            marginBottom: styleConstants.marginSM,
            flexWrap: 'wrap',
        },
        beastDetailLabel: {
            fontWeight: 'bold',
            marginRight: styleConstants.marginXS,
            color: theme.text,
        },
        beastDetailValue: {
            flex: 1,
            flexWrap: 'wrap',
            color: theme.text,
        },
    });
};
