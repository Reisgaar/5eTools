import { StyleSheet } from 'react-native';

export const createBeastStyles = (theme: any) => StyleSheet.create({
  // Beast Filter Modal Styles (CR, Type, Source)
  beastFilterModalContent: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 24,
    width: 340,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  beastFilterModalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  beastFilterClearButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-end',
    marginBottom: 6,
    minHeight: 24,
    minWidth: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beastFilterClearButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  beastFilterScrollView: {
    maxHeight: 300,
    marginVertical: 10,
  },
  beastFilterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  beastFilterOptionContainer: {
    width: '33%',
  },
  beastFilterOptionContainerHalf: {
    width: '50%',
  },
  beastFilterOptionContainerFull: {
    width: '100%',
  },
  beastFilterOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 4,
  },
  beastFilterOptionRowSelected: {
    backgroundColor: theme.primary + '22',
  },
  beastFilterCheckbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  beastFilterCheckboxSelected: {
    backgroundColor: theme.primary,
  },
  beastFilterOptionText: {
    color: theme.text,
    marginLeft: 8,
    fontSize: 14,
  },
  beastFilterApplyButton: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  beastFilterApplyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Beast Combat Selection Modal Styles
  beastCombatSelectionModalContent: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 24,
    width: 360,
    maxWidth: '90%',
    maxHeight: '85%',
  },
  beastCombatSelectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
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

  // Beast Detail Modal Styles
  beastDetailOverlay: {
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
  beastDetailContent: {
    width: '90%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'stretch',
    elevation: 4,
    maxHeight: '80%',
  },
  beastDetailCloseBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  beastDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'center',
  },
  beastDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  beastDetailLabel: {
    fontWeight: 'bold',
    marginRight: 6,
  },
  beastDetailValue: {
    flex: 1,
    flexWrap: 'wrap',
  },
});
