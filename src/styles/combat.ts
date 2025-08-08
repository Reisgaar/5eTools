import { StyleSheet } from 'react-native';

export const createCombatStyles = (theme: any) => StyleSheet.create({

  
  // Combat Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.primary,
  },
  headerBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: theme.text,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerMenuButton: {
    padding: 8,
  },
  headerModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerModalContent: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 24,
    width: 280,
    maxWidth: '90%',
  },
  headerModalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  headerModalButton: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  headerModalButtonPrimary: {
    backgroundColor: theme.primary,
  },
  headerModalButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  headerModalButtonInfo: {
    backgroundColor: '#2196F3',
  },
  headerModalButtonDanger: {
    backgroundColor: '#f44336',
  },
  headerModalButtonSecondary: {
    backgroundColor: '#eee',
  },
  headerModalButtonText: {
    fontWeight: 'bold',
  },
  headerModalButtonTextPrimary: {
    color: theme.buttonText || 'white',
  },
  headerModalButtonTextLight: {
    color: 'white',
  },
  headerModalButtonTextDark: {
    color: theme.text,
  },

  // Combat Controls Styles
  controls: {
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  controlsFinishButton: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlsFinishIcon: {
    marginRight: 4,
  },
  controlsFinishText: {
    color: '#c00',
    fontWeight: 'bold',
    fontSize: 12,
  },
  controlsRoundText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.text,
    marginRight: 16,
  },
  controlsNextButton: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginLeft: 8,
  },
  controlsNextText: {
    color: theme.buttonText || 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },



  // Combat Member Styles
  member: {
    marginLeft: 16,
    marginBottom: 8,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  memberNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 20,
    minWidth: 28,
    textAlign: 'center',
    color: theme.text,
  },
  memberBox: {
    backgroundColor: theme.card,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: theme.border,
    flex: 1,
  },
  memberButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  memberButton: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 70,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  memberButtonPrimary: {
    backgroundColor: theme.primary,
  },
  memberButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  memberButtonDanger: {
    backgroundColor: '#f44336',
  },
  memberButtonSmall: {
    width: 60,
  },
  memberLeftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  memberButtonTextLight: {
    color: theme.buttonText || 'white',
  },
  memberButtonTextWhite: {
    color: 'white',
  },
  memberIcon: {
    marginRight: 3,
  },
  memberNotes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 0,
  },
  memberNoteButton: {
    backgroundColor: theme.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 32,
  },
  memberNoteText: {
    fontSize: 12,
    flex: 1,
    fontStyle: 'italic',
  },
  
  // Status Conditions Styles
  statusContainer: {
    marginTop: 4,
    minHeight: 20, // Ensure container has minimum height
  },
  statusConditions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusBadge: {
    backgroundColor: '#4A5568', // Better contrast gray for dark mode
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 2,
  },
  statusBadgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusBadgeTextWeb: {
    fontSize: 10,
  },
  statusBadgeTextMobile: {
    fontSize: 8,
  },
  memberIconColor: {
    color: 'white', // Default color, will be overridden by theme.buttonText
  },
  
  // Combat Group Styles
  groupContainer: {
    backgroundColor: theme.card,
    borderRadius: 8,
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupToken: {
    marginRight: 20,
  },
  groupTokenImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  groupContent: {
    flex: 1,
  },
  groupNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  groupName: {
    flex: 1,
  },
  groupNameText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black', // Will be overridden by theme.text
  },
  groupToggleButton: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  groupToggleButtonGrouped: {
    backgroundColor: '#f44336',
  },
  groupToggleButtonUngrouped: {
    backgroundColor: '#4CAF50',
  },
  groupToggleText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  groupButtonsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  groupButton: {
    backgroundColor: theme.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 70,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  groupButtonText: {
    color: theme.buttonText || 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  groupButtonIcon: {
    marginRight: 3,
  },


  // Notes Toggle Styles
  notesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notesToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesToggleIcon: {
    marginRight: 8,
  },
  notesToggleText: {
    color: theme.text,
    fontWeight: 'bold',
  },

  // Modal Styles
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
  modalInput: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: theme.innerBackground,
    color: theme.text,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: 'black',
  },
  modalButtonTextPrimary: {
    color: theme.buttonText || 'white',
  },

  // Combat List Styles
  listContainer: {
    flex: 1,
    padding: 16,
  },
  listSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 6,
    color: 'black', // Will be overridden by theme.text
  },
  listContainerBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white', // Will be overridden by theme.card
  },
  listCombatNameInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
    backgroundColor: 'white', // Will be overridden by theme.inputBackground
    color: 'black', // Will be overridden by theme.text
  },
  listCreateBtn: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'blue', // Will be overridden by theme.primary
  },
  listCreateBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listCombatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  listCombatOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'white', // Will be overridden by theme.inputBackground
  },
  listCombatName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 0,
    color: 'black', // Will be overridden by theme.text
  },
  listCombatCount: {
    fontSize: 12,
    color: 'gray', // Will be overridden by theme.noticeText
    marginLeft: 8,
  },
  listActiveBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  listActiveBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listActiveCombatBtn: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue', // Will be overridden by theme.primary
  },
  listEmptyText: {
    color: 'gray', // Will be overridden by theme.noticeText
    textAlign: 'center',
    marginVertical: 8,
    fontStyle: 'italic',
    fontSize: 16,
  },
});
