import { StyleSheet, Dimensions, Platform } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const scaleFactor = windowWidth < 375 ? 0.7 :
                   windowWidth < 768 ? 0.9 :
                   1;

const responsiveSize = (mobileSize, desktopSize) => {
 return Platform.select({
   web: desktopSize,
   default: mobileSize * scaleFactor
 });
};

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
   width: Platform.select({
     web: windowWidth * 0.4,
     default: windowWidth * 0.3 * scaleFactor
   }),
   height: Platform.select({
     web: windowWidth * 0.2,
     default: windowWidth * 0.15 * scaleFactor
   }),
   maxHeight: responsiveSize(60, 100),
 },
 title: {
   textAlign: 'center',
   fontSize: responsiveSize(24, 30),
   fontWeight: 'bold',
   color: 'white',
   marginVertical: responsiveSize(5, 10),
   marginBottom: responsiveSize(10, 20),
   marginTop: Platform.select({
     web: 0,
     default: -15 * scaleFactor
   }),
 },
 mainContent: {
   flexDirection: Platform.select({
     web: 'row',
     default: 'column'
   }),
   flex: 1,
 },
 avatarContainer: {
   flex: 1,
   alignItems: 'center',
   justifyContent: Platform.select({
     web: 'flex-start',
     default: 'center'
   }),
   position: 'relative',
   height: Platform.select({
     web: 'auto',
     default: windowHeight * 0.4
   }),
 },
 avatar: {
   width: responsiveSize(250, 350),
   height: responsiveSize(250, 350),
   position: 'absolute',
   top: Platform.select({
     web: 'auto',
     default: 0
   }),
   zIndex: 1,
 },
 podium: {
   width: responsiveSize(230, 350),
   height: responsiveSize(230, 350),
   marginTop: Platform.select({
     web: 200,
     default: responsiveSize(150, 0)
   }),
   zIndex: 0,
 },
 rightContainer: {
   flex: 1,
   backgroundColor: '#5C2E00',
   borderWidth: responsiveSize(4, 6),
 },
 categoryContainer: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   justifyContent: 'space-around',
   marginBottom: responsiveSize(10, 20),
   borderBottomWidth: responsiveSize(4, 6),
 },
 categoryImage: {
   width: responsiveSize(70, 100),
   height: responsiveSize(70, 100),
   marginBottom: responsiveSize(5, 10),
 },
 categoryText: {
   textAlign: 'center',
   fontSize: responsiveSize(12, 16),
   fontWeight: 'bold',
   marginBottom: responsiveSize(10, 15),
   color: 'white',
 },
 itemsContainer: {
   paddingLeft: responsiveSize(10, 20),
   paddingRight: responsiveSize(10, 20),
   flexDirection: 'row',
   flexWrap: 'wrap',
   justifyContent: 'space-around',
 },
 item: {
   padding: responsiveSize(5, 10),
   marginBottom: responsiveSize(30, 50),
   alignItems: 'center',
   borderWidth: responsiveSize(2, 3),
   borderColor: '#000',
   borderRadius: responsiveSize(8, 10),
   width: responsiveSize(120, 150),
   height: responsiveSize(140, 175),
 },
 itemImage: {
   width: responsiveSize(120, 150),
   height: responsiveSize(120, 150),
   marginBottom: responsiveSize(5, 10),
 },
 itemName: {
   marginTop: responsiveSize(3, 5),
   fontSize: responsiveSize(12, 16),
   fontWeight: 'bold',
   textAlign: 'center',
   color: 'white',
 },
 wornItem: {
   position: 'absolute',
   top: 0,
   width: responsiveSize(250, 350),
   height: responsiveSize(250, 350),
   zIndex: 2,
 },
});


export default styles;