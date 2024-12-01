import { StyleSheet, Dimensions, Platform } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: 30,
    borderRadius: 60,
    marginLeft: 50,
    marginRight: 50,
    borderWidth: 3,
  },
  headerButtonText: {
    fontSize: 22,
    color: '#0000000',
    fontWeight: 'bold',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: windowWidth * 0.4,
    height: windowWidth * 0.2,
    maxHeight: 100,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
    marginBottom: 20,
  },
  mainContent: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', 
  },
  avatar: {
    width: 350,
    height: 350,
    marginBottom: 0, 
    zIndex: 1,
  },
  podium: {
    width: 350,
    height: 350,
    marginTop: -200, 
    zIndex: 0,
  },
  rightContainer: {
    flex: 1,
    backgroundColor: '#5C2E00',
    borderWidth: 6,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 6,
  },
  categoryImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  itemsContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
   // backgroundColor: '#804000',
  },
  item: {
    padding: 10,
    marginBottom: 50,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 10,
    width: 150,
    height: 175,
  },
  itemImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  itemName: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;