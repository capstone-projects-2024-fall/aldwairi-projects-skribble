import { StyleSheet, Dimensions, Platform } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
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
    title: {
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    categoryImage: {
      width: 175,
      height: 175,
      marginBottom: 10,
    },
    categoryText: {
      textAlign: 'center',
      fontSize: 26,
      fontWeight: 'bold',
    },
    itemsContainer: {
      marginTop: 30,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    item: { 
      padding: 10,
      marginBottom: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      width: 300,
      height: 300,
    },
    itemImage: {
      width: 150,
      height: 175,
      marginBottom: 10,
    },
    itemName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
    },
    itemPrice: {
      fontSize: 20,
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
      width: 300,
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    modalImage: {
      width: 175,
      height: 175,
      marginBottom: 15,
    },
    modalItemName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalItemPrice: {
      fontSize: 18,
      color: '#888',
      marginBottom: 10,
    },
    modalUserCoins: {
      fontSize: 18,
      marginBottom: 20,
    },
    modalButton: {
      width: '100%',
      padding: 10,
      backgroundColor: '#2196F3',
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 10,
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 18,
    },
  });

export default styles;