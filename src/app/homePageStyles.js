import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  homeContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  logoContainer: {
      position: 'absolute',
      alignItems: 'center',
  },
  logoContainerWeb: {
      top: 40,
  },
  logoContainerMobile: {
      top: 60,
  },
  logo: {
      resizeMode: 'contain',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 20,
  },
  buttonStyle: {
      padding: 18,
      margin: 18,
      borderRadius: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
  },
  buttonText: {
      color: 'black',
      fontSize: 20,
      marginRight: 14,
      fontWeight: 'bold',
  },
  icon: {
      width: 32,
      height: 32,
      marginLeft: 10,
  },
});

export default styles;