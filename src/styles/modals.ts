import { StyleSheet } from 'react-native';

export const createModalStyles = (theme: any) => StyleSheet.create({
  // Base Modal Styles
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 24,
    width: 320,
    maxWidth: '90%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: '#eee',
    marginRight: 8,
  },
  modalButtonPrimary: {
    backgroundColor: theme.primary,
    marginLeft: 8,
  },
  modalButtonText: {
    fontWeight: 'bold',
  },
  modalButtonTextSecondary: {
    color: theme.text,
  },
  modalButtonTextPrimary: {
    color: theme.buttonText || 'white',
  },

  // Player Modal Styles
  playerModalContent: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 24,
    width: 320,
    maxWidth: '90%',
    maxHeight: '70%',
  },
  playerModalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 12,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerCheckbox: {
    marginRight: 8,
  },
  playerName: {
    color: theme.text,
    fontWeight: 'bold',
  },
  playerDetails: {
    color: theme.text,
    marginLeft: 8,
    fontSize: 12,
  },
  playerEmptyText: {
    color: theme.noticeText,
    textAlign: 'center',
  },

  // Value Edit Modal Styles
  valueEditModalContent: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 24,
    width: 280,
    maxWidth: '90%',
  },
  valueEditTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  valueEditInput: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: theme.innerBackground,
    color: theme.text,
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
  },

  // Color Picker Modal Styles
  colorPickerModalContent: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 24,
    width: 320,
    maxWidth: '90%',
  },
  colorPickerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  colorPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  colorPickerOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorPickerOptionSelected: {
    borderColor: theme.text,
  },

  // Status Picker Modal Styles
  statusPickerModalContent: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 24,
    width: 320,
    maxWidth: '90%',
    maxHeight: '70%',
  },
  statusPickerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statusPickerList: {
    maxHeight: 300,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  statusCheckbox: {
    marginRight: 12,
  },
  statusText: {
    color: theme.text,
    fontSize: 16,
    flex: 1,
  },

  // Combat Selection Modal Styles
  combatSelectionModalContent: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 24,
    width: 320,
    maxWidth: '90%',
  },
  combatSelectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  quantitySection: {
    marginBottom: 16,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  quantityTitle: {
    color: theme.text,
    marginRight: 8,
    marginBottom: 0,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.primary,
  },
  quantityInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    marginHorizontal: 8,
    backgroundColor: theme.inputBackground,
    color: theme.text,
    borderColor: theme.primary,
  },
  combatListSection: {
    marginBottom: 16,
  },
  combatListTitle: {
    color: theme.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  combatListEmpty: {
    color: theme.noticeText,
    textAlign: 'center',
    marginVertical: 8,
  },
  combatListScroll: {
    maxHeight: 200,
  },
  combatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  combatListItemSelected: {
    backgroundColor: theme.primary + '20',
  },
  combatName: {
    color: theme.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  combatCount: {
    color: theme.noticeText,
    fontSize: 12,
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderColor: theme.primary,
  },
  cancelButtonText: {
    color: theme.primary,
    fontWeight: 'bold',
  },
});
