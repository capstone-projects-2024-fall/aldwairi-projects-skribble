import { StyleSheet, Dimensions, Platform } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  colorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  colorButton: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#333',
    width: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 45,
    margin: 10,
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: 'black',
  },
  centeredSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20, 
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: "20%", 
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20, 
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 3,
    width: 225,
  },
});

export default styles;