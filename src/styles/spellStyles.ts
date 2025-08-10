import { StyleSheet } from 'react-native';
import { baseStyles, createThemedStyles } from './baseStyles';

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
    spellDetailOverlay: baseSpellStyles.detailOverlay,
    spellDetailContent: {
      ...baseSpellStyles.detailContent,
      backgroundColor: theme.card,
    },
    spellDetailCloseBtn: baseSpellStyles.detailCloseBtn,
    spellDetailTitle: baseSpellStyles.detailTitle,
    spellDetailSubtitle: baseSpellStyles.detailSubtitle,
    spellDetailField: baseSpellStyles.detailField,
    spellDetailEntry: baseSpellStyles.detailEntry,
    spellDetailGrid: baseSpellStyles.detailGrid,
    spellDetailGridItem: baseSpellStyles.detailGridItem,
    spellDetailGridItemLast: baseSpellStyles.detailGridItemLast,
    spellDetailGridLabel: baseSpellStyles.detailGridLabel,
    spellDetailGridValue: baseSpellStyles.detailGridValue,
    spellDetailScrollView: baseSpellStyles.detailScrollView,
    spellDetailScrollContent: baseSpellStyles.detailScrollContent,
    spellDetailSource: baseSpellStyles.detailSource,

    // Spellbook Modal specific styles
    spellbookModalContent: {
      ...baseSpellStyles.filterModalContent,
      backgroundColor: theme.card,
      width: 360,
      maxHeight: '85%',
    },
    spellbookModalTitle: baseSpellStyles.modalTitle,
    spellbookModalHeader: baseSpellStyles.modalHeader,
    spellbookModalCloseButton: baseSpellStyles.modalCloseButton,
    spellbookItem: baseSpellStyles.listItem,
    spellbookContent: baseSpellStyles.listItemContent,
    spellbookName: baseSpellStyles.listItemName,
    spellbookDescription: baseSpellStyles.listItemDescription,
    spellbookStats: baseSpellStyles.listItemStats,

    // Spell Filter Modal specific styles
    spellFilterModalContent: {
      ...baseSpellStyles.filterModalContent,
      backgroundColor: theme.card,
    },
    spellFilterModalTitle: baseSpellStyles.modalTitle,
    spellFilterClearButton: {
      ...baseSpellStyles.filterClearButton,
      borderColor: theme.primary,
    },
    spellFilterClearButtonText: {
      ...baseSpellStyles.filterClearButtonText,
      color: theme.primary,
    },
    spellFilterScrollView: baseSpellStyles.filterScrollView,
    spellFilterGrid: baseSpellStyles.filterGrid,
    spellFilterOptionContainer: baseSpellStyles.filterOptionContainer,
    spellFilterOptionContainerHalf: baseSpellStyles.filterOptionContainerHalf,
    spellFilterOptionContainerFull: baseSpellStyles.filterOptionContainerFull,
    spellFilterOptionRow: baseSpellStyles.filterOptionRow,
    spellFilterCheckbox: baseSpellStyles.filterCheckbox,
    spellFilterOptionText: baseSpellStyles.filterOptionText,
    spellFilterApplyButton: {
      ...baseSpellStyles.filterApplyButton,
      backgroundColor: theme.primary,
    },
    spellFilterApplyButtonText: baseSpellStyles.filterApplyButtonText,

    // Modal Overlay Styles (reuse base styles)
    modalOverlay: baseSpellStyles.modalOverlay,
    modalContentWrapper: baseSpellStyles.modalContentWrapper,
    modalContent: {
      ...baseSpellStyles.modalContent,
      backgroundColor: theme.card,
    },
    closeIconBtn: baseSpellStyles.closeIconBtn,
  });
};
