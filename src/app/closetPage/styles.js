import { StyleSheet, Dimensions, Platform } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Define a scaling factor for small screens
const isSmallScreen = windowWidth < 375;
const scaleFactor = isSmallScreen ? 0.5 : 1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20 * scaleFactor,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: 15 * scaleFactor,
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
    marginVertical: 10 * scaleFactor,
    marginBottom: 20* scaleFactor,
    marginTop: -30 * scaleFactor,
  },
  mainContent: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', 
  },
  avatar: {
    position: 'absolute',
    top: 0, 
    width: 375 * scaleFactor,
    height: 375 * scaleFactor,
  },
  podium: {
    width: 350 * scaleFactor,
    height: 350 * scaleFactor,
    marginTop: 220 * scaleFactor, 
    zIndex: 0,
  },
  rightContainer: {
    flex: 1,
    backgroundColor: '#5C2E00',
    borderWidth: 6 * scaleFactor,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20 * scaleFactor,
    borderBottomWidth: 6 * scaleFactor,
  },
  categoryImage: {
    width: 100 * scaleFactor,
    height: 100 * scaleFactor,
    marginBottom: 10 * scaleFactor,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 16 * scaleFactor,
    fontWeight: 'bold',
    marginBottom: 15 * scaleFactor,
  },
  itemsContainer: {
    paddingLeft: 20 * scaleFactor,
    paddingRight: 20 * scaleFactor,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
   // backgroundColor: '#804000',
  },
  item: {
    padding: 10 * scaleFactor,
    marginBottom: 50 * scaleFactor,
    alignItems: 'center',
    borderWidth: 3 * scaleFactor,
    borderColor: '#000',
    borderRadius: 10 * scaleFactor,
    width: 150 * scaleFactor,
    height: 175 * scaleFactor,
  },
  itemImage: {
    width: 150 * scaleFactor,
    height: 150 * scaleFactor,
    marginBottom: 10 * scaleFactor,
  },
  itemName: {
    marginTop: 5 * scaleFactor,
    fontSize: 16 * scaleFactor,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wornItem: {
    position: 'absolute',
    top: 0,
    width: 375 * scaleFactor,
    height: 375 * scaleFactor,
  },
});

export default styles;