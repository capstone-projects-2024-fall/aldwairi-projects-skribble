import { StyleSheet, Dimensions, Platform } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: '#99CA9C',
    padding: 20,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    padding: 16,
    gap: 20,
  },
  titleInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#454545',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  contentTextarea: {
    width: '100%',
    minHeight: 150,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#454545',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#000',
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // Logo Styles
  logoContainer: {
    width: '100%',
    height: windowHeight * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logo: {
    width: windowWidth * 0.8,
    height: '100%',
    maxHeight: 100,
  },

  // Form Styles
  journalForm: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  formInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  formTextarea: {
    width: '100%',
    minHeight: 150,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },

  // Button Styles
  centerButtonContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  outlinedButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#05630b',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#045209',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newEntryButton: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#05630b',
    borderRadius: 40,
  },
  newEntryButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  styledButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#05630b',
    borderRadius: 5,
  },
  styledButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    alignItems: 'center',
  },

  // Delete Styles
  deleteButton: {
    backgroundColor: '#05630b',
    borderColor: '#045209',
  },
  deleteConfirmationModal: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  deleteModalHeader: {
    backgroundColor: '#05630b',
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  deleteModalTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  deleteModalBody: {
    padding: 20,
  },
  deleteModalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  deleteModalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmDeleteButton: {
    backgroundColor: '#dc3545',
  },
  cancelDeleteButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmDeleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Journal Entries Grid
  entriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: Platform.select({
      web: 8,
      default: 10,
    }),
    gap: Platform.select({
      web: 10,
      default: 15,
    }),
  },
  journalEntriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },

  // Back Button
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#05630b',
    fontWeight: '600',
  },

  // Entry Styles
  entryHeader: {
    width: '100%',
    marginBottom: 20,
  },
  entryCard: {
    padding: Platform.select({
      web: 4,
      default: 15,
    }),
    width: Platform.select({
      web: windowWidth > 1024 ? (windowWidth - 120) / 3 :
           windowWidth > 768 ? (windowWidth - 90) / 3 :
           (windowWidth - 60) / 2,
      default: (windowWidth - 60) / 2,
    }),
    marginBottom: Platform.select({
      web: 8,
      default: 15,
    }),
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Platform.select({
      web: 10,
      default: 10,
    }),
    ...(Platform.OS === 'web' && {
      height: 280,
    }),
  },
  entryImage: {
    ...(Platform.OS === 'web' ? {
      width: 300,
      height: 300,
    } : {
      width: '100%',
      height: undefined,
      aspectRatio: 1,
    }),
    resizeMode: 'contain',
  },
  entryDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 20,
  },
  entryTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  entryContent: {
    fontSize: 22,
    lineHeight: 28,
    marginVertical: 10,
  },
  entryCardTitle: {
    fontSize: Platform.select({
      web: 24,
      default: 16,
    }),
    fontWeight: '600',
    marginTop: Platform.select({
      web: 2,
      default: 5,
    }),
    textAlign: 'center',
    color: '#333',
    ...(Platform.OS === 'web' && {
      height: 30,
      overflow: 'hidden',
    }),
  },
  entryCardDate: {
    fontSize: Platform.select({
      web: 15,
      default: 12,
    }),
    color: '#666',
    marginTop: Platform.select({
      web: 1,
      default: 5,
    }),
    textAlign: 'center',
    ...(Platform.OS === 'web' && {
      height: 16,
    }),
  },

  // Full Entry View
  fullEntry: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  fullEntryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  fullEntryContent: {
    fontSize: 22,
    lineHeight: 33,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    maxWidth: 500,
  },
  modalHeader: {
    backgroundColor: '#05630b',
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 24,
  },
  modalBody: {
    backgroundColor: '#ededed',
    padding: 24,
    maxHeight: windowHeight * 0.6,
  },

  // Prompt Styles
  promptSelectButton: {
    backgroundColor: '#0066cc',
    borderColor: '#005299',
  },
  promptList: {
    gap: 16,
  },
  promptButton: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  promptButtonText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'left',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Cancel Styles
  cancelDeleteButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  cancelButton: {
    backgroundColor: '#666666',
    borderColor: '#555555',
  },
  cancelModalButton: {
    backgroundColor: '#666666',
    borderColor: '#555555',
  },

  // Confirmation Modal
  confirmationModal: {
    padding: 24,
    alignItems: 'center',
  },
  confirmationTitle: {
    fontSize: 20,
    color: '#dc3545',
    marginBottom: 16,
  },
});