import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerButton: {
    padding: 5,
    backgroundColor: 'white',
    padding: 8,
    borderWidth: 3,
    borderRadius: 40,
  },
  headerButtonText: {
    fontSize: 16,
    marginRight: 15,
    color: '#000',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  addFriendButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 3,
    borderRadius: 40,
  },
  addFriendButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    paddingVertical: 10,
  },
  tabButton: {
    padding: 10,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#000',
  },
  activeTabButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  searchBarContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchBar: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 16,
  },
  friendGridItem: {
    margin: 10,
    alignItems: 'center',
  },
  friendGridItemImageContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 5,
  },
  friendGridItemImage: {
    width: '100%',
    height: '100%',
  },
  friendGridItemText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  friendProfileContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
  },
  friendProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  friendProfileBackButton: {
    fontSize: 16,
    color: '#000',
  },
  friendProfileHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  friendProfileRemoveButton: {
    padding: 5,
    borderRadius: 5,
  },
  friendProfileRemoveButtonText: {
    fontSize: 16,
    color: '#000',
  },
  friendProfileImageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  friendProfileImageWrapper: {
    borderRadius: 100,
    borderWidth: 3,
    padding: 5,
  },
  friendProfileImage: {
    width: 50,
    height: 50,
  },
  friendProfileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendRequestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 1,
  },
  friendRequestAvatarContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 10,
  },
  friendRequestAvatar: {
    width: '100%',
    height: '100%',
  },
  friendRequestTextContainer: {
    flex: 1,
  },
  friendRequestName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendRequestMessage: {
    fontSize: 14,
    color: '#000',
  },
  friendRequestButtonsContainer: {
    flexDirection: 'row',
  },
  rejectButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  rejectButtonText: {
    fontSize: 14,
    color: '#000',
  },
  acceptButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  acceptButtonText: {
    fontSize: 14,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  modalCancelButtonText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
  },
  modalSendButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  modalSendButtonText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
  },
  wornItem: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
  },
});

export default styles;
