import { StyleSheet, Dimensions, Platform } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Define a scaling factor for small screens
const isSmallScreen = windowWidth < 360; // Adjust this value based on your threshold
const scaleFactor = isSmallScreen ? 0.5 : 1; // 70% for small screens, full size otherwise

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20 * scaleFactor,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20 * scaleFactor,
  },
  headerButton: {
    padding: 30 * scaleFactor,
    borderRadius: 60 * scaleFactor,
    marginLeft: 50 * scaleFactor,
    marginRight: 50 * scaleFactor,
    borderWidth: 3 * scaleFactor,
  },
  headerButtonText: {
    fontSize: 22 * scaleFactor,
    color: '#0000000',
    fontWeight: 'bold',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: windowWidth * 0.4 * scaleFactor,
    height: windowWidth * 0.2 * scaleFactor,
    maxHeight: 100 * scaleFactor,
  },
  title: {
    textAlign: 'center',
    fontSize: 36 * scaleFactor,
    fontWeight: 'bold',
    marginBottom: 20 * scaleFactor,
    marginTop: -50 * scaleFactor,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinsLabel: {
    color: "#666",
    marginLeft: 3 * scaleFactor,
    fontSize: 40 * scaleFactor,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20 * scaleFactor,
  },
  categoryImage: {
    width: 175 * scaleFactor,
    height: 175 * scaleFactor,
    marginBottom: 10 * scaleFactor,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 26 * scaleFactor,
    fontWeight: 'bold',
  },
  itemsContainer: {
    paddingTop: 40 * scaleFactor,
    paddingBottom: 20 * scaleFactor,
    marginTop: 30 * scaleFactor,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    borderWidth: 6 * scaleFactor,
    borderColor: '#ddd',
    borderRadius: 10 * scaleFactor,
  },
  item: {
    padding: 10 * scaleFactor,
    marginBottom: 20 * scaleFactor,
    alignItems: 'center',
    borderWidth: 6 * scaleFactor,
    borderColor: '#ddd',
    borderRadius: 10 * scaleFactor,
    width: 300 * scaleFactor,
    height: 300 * scaleFactor,
  },
  itemImage: {
    width: 150 * scaleFactor,
    height: 175 * scaleFactor,
    marginBottom: 10 * scaleFactor,
  },
  itemName: {
    fontSize: 24 * scaleFactor,
    fontWeight: 'bold',
    marginBottom: 5 * scaleFactor,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 20 * scaleFactor,
    color: '#888',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300 * scaleFactor,
    padding: 20 * scaleFactor,
    backgroundColor: '#fff',
    borderRadius: 10 * scaleFactor,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 24 * scaleFactor,
    fontWeight: 'bold',
    marginBottom: 15 * scaleFactor,
  },
  modalImage: {
    width: 175 * scaleFactor,
    height: 175 * scaleFactor,
    marginBottom: 15 * scaleFactor,
  },
  modalItemName: {
    fontSize: 20 * scaleFactor,
    fontWeight: 'bold',
    marginBottom: 10 * scaleFactor,
  },
  modalItemPrice: {
    fontSize: 18 * scaleFactor,
    color: '#888',
    marginBottom: 10 * scaleFactor,
  },
  modalUserCoins: {
    fontSize: 18 * scaleFactor,
    marginBottom: 20 * scaleFactor,
  },
  modalButton: {
    width: '100%',
    padding: 10 * scaleFactor,
    backgroundColor: '#2196F3',
    borderRadius: 10 * scaleFactor,
    borderWidth: 3 * scaleFactor,
    alignItems: 'center',
    marginBottom: 10 * scaleFactor,
  },
  modalButtonText: {
    color: '#000',
    fontSize: 18 * scaleFactor,
  },
});

export default styles;
