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
    width: 300,
    maxWidth: '85%',
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
    width: 340,
    maxWidth: '85%',
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
    width: 340,
    maxWidth: '85%',
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

  // Generic Filter Modal Styles (for non-beast filters)
  filterModalContent: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 24,
    width: 340,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  filterModalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  filterClearButton: {
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
  filterClearButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  filterScrollView: {
    maxHeight: 300,
    marginVertical: 10,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filterOptionContainer: {
    width: '33%',
  },
  filterOptionContainerHalf: {
    width: '50%',
  },
  filterOptionContainerFull: {
    width: '100%',
  },
  filterOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 4,
  },
  filterOptionRowSelected: {
    backgroundColor: theme.primary + '22',
  },
  filterCheckbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  filterCheckboxSelected: {
    backgroundColor: theme.primary,
  },
  filterOptionText: {
    color: theme.text,
    marginLeft: 8,
    fontSize: 14,
  },
  filterApplyButton: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  filterApplyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Generic Selection Modal Styles (for non-beast selections)
  selectionModalContent: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 24,
    width: 360,
    maxWidth: '90%',
    maxHeight: '85%',
  },
  selectionModalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  selectionModalContainer: {
    flex: 1,
    padding: 16,
  },
  selectionSection: {
    marginBottom: 16,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  selectionTitle: {
    color: theme.text,
    marginRight: 8,
    marginBottom: 0,
    fontWeight: 'bold',
  },
  selectionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  selectionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.primary,
  },
  selectionInput: {
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
  selectionListSection: {
    marginBottom: 16,
  },
  selectionListTitle: {
    color: theme.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectionListEmpty: {
    color: theme.noticeText,
    textAlign: 'center',
    marginVertical: 8,
  },
  selectionListScroll: {
    maxHeight: 200,
  },
  selectionListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  selectionListItemSelected: {
    backgroundColor: theme.primary + '20',
  },
  selectionName: {
    color: theme.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectionCount: {
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
