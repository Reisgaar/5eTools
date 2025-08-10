import { StyleSheet } from 'react-native';
import { baseStyles, createThemedStyles } from './baseStyles';

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
      marginBottom: 16,
    },
    beastQuantityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    beastQuantityTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: theme.text,
    },
    beastQuantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    beastQuantityButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.primary,
    },
    beastQuantityInput: {
      width: 60,
      height: 40,
      borderWidth: 1,
      borderRadius: 8,
      textAlign: 'center',
      marginHorizontal: 8,
      fontSize: 16,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      borderColor: theme.primary,
    },
    beastCombatListSection: {
      marginBottom: 16,
    },
    beastCombatListTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: theme.text,
    },
    beastCombatListEmpty: {
      textAlign: 'center',
      fontStyle: 'italic',
      marginVertical: 8,
      color: theme.noticeText,
    },
    beastCombatListScroll: {
      maxHeight: 200,
    },
    beastCombatListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      marginBottom: 4,
      borderRadius: 6,
    },
    beastCombatListItemSelected: {
      backgroundColor: theme.primary + '20',
    },
    beastCombatName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
      color: theme.text,
    },
    beastCombatCount: {
      fontSize: 14,
      color: theme.noticeText,
    },
    beastCancelButton: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      borderColor: theme.primary,
    },
    beastCancelButtonText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: theme.primary,
    },

    // Beast Detail Modal specific styles
    beastDetailOverlay: baseBeastStyles.detailOverlay,
    beastDetailContent: {
      ...baseBeastStyles.detailContent,
      backgroundColor: theme.card,
    },
    beastDetailCloseBtn: baseBeastStyles.detailCloseBtn,
    beastDetailTitle: baseBeastStyles.detailTitle,
    beastDetailRow: {
      flexDirection: 'row',
      marginBottom: 8,
      flexWrap: 'wrap',
    },
    beastDetailLabel: {
      fontWeight: 'bold',
      marginRight: 6,
      color: theme.text,
    },
    beastDetailValue: {
      flex: 1,
      flexWrap: 'wrap',
      color: theme.text,
    },
  });
};
