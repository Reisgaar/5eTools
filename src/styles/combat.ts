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
  headerActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    width: 40,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  headerModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerModalSeparator: {
    height: 1,
    backgroundColor: theme.border,
    marginBottom: 20,
  },
  headerModalButtonsContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
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
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    width: 200,
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
    fontSize: 16,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 60,
  },
  controlsStartButton: {
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  controlsStartIcon: {
    marginRight: 6,
  },
  controlsStartText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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
    marginBottom: 4,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
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
    marginBottom: 6,
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
  memberButtonSettings: {
    backgroundColor: '#2196F3',
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
    marginBottom: 6,
    marginLeft: 0,
  },
  memberNotesTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    marginHorizontal: -4,
    marginTop: -4,
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
    fontSize: 11,
    flex: 1,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Status Conditions Styles
  statusContainer: {
    marginTop: 4,
    minHeight: 20, // Ensure container has minimum height
  },
  statusContainerTop: {
    marginBottom: 4,
    minHeight: 16, // Slightly smaller for top placement
  },
  statusConditions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusBadge: {
    backgroundColor: '#4A5568', // Better contrast gray for dark mode
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 3,
    marginBottom: 1,
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
    marginBottom: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  // Left column: token and stats
  leftColumn: {
    width: 60,
    alignItems: 'center',
    marginRight: 16,
  },
  groupToken: {
    marginBottom: 8,
  },
  groupTokenImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  tokenButtonsRow: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 60,
  },
  tokenButton: {
    backgroundColor: theme.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 70,
    height: 32,
    marginBottom: 2,
  },
  tokenButtonIcon: {
    marginRight: 3,
  },
  tokenButtonText: {
    color: theme.buttonText || 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Right column: name and combatants
  rightColumn: {
    flex: 1,
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
  combatList: {
    flex: 1,
  },

  // Combat Selection Modal Styles
  selectionContainer: {
    marginBottom: 16,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  selectionTitle: {
    marginRight: 8,
    marginBottom: 0,
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectionQuantityBtn: {
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  selectionQuantityBtnLeft: {
    marginRight: 8,
  },
  selectionQuantityBtnRight: {
    marginLeft: 8,
  },
  selectionQuantityBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectionQuantityInput: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    width: 60,
    textAlign: 'center',
  },
  selectionSection: {
    marginBottom: 16,
  },
  selectionSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectionEmptyText: {
    textAlign: 'center',
    marginVertical: 8,
  },
  selectionScrollView: {
    maxHeight: 200,
  },
  selectionCombatOption: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectionCombatName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectionCombatInfo: {
    fontSize: 12,
  },
  selectionCreateSection: {
    marginBottom: 16,
  },
  selectionCreateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionCreateInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
  },
  selectionCreateBtn: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectionCreateBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
