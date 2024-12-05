import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  backButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardContainer: {
    flex: 1,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',  
    height: 75,    
    resizeMode: 'contain', 
  },
  resetButton: {
    padding: 5,
    width: 50,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
  },
  messageList: {
    padding: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e7eb',
    fontSize:26,
  },
  userMessageText: {
    color: 'white',
    fontSize:26,
  },
  botMessageText: {
    color: 'black',
    fontSize:26,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    marginRight: 10,
    fontSize:24,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 26,
  },
});

export default styles;