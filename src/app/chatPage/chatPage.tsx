import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

// Sample mental health support messages
const SUPPORT_MESSAGES = [
  "It's okay to not be okay. Would you like to talk about how you're feeling?",
  "Your feelings are valid. I'm here to listen without judgment.",
  "Taking care of your mental health is important. What would help you feel more supported right now?",
  "Remember, seeking help is a sign of strength, not weakness.",
  "Would you like to explore some coping strategies together?"
];

// bot responses
const generateSupportResponse = (userMessage) => {
  const lowercaseMessage = userMessage.toLowerCase();
  
  if (lowercaseMessage.includes('sad') || lowercaseMessage.includes('depressed')) {
    return "I hear that you're feeling sad. It's important to acknowledge your feelings. Would you like to discuss some ways to manage these emotions?";
  }
  
  if (lowercaseMessage.includes('anxiety') || lowercaseMessage.includes('anxious')) {
    return "Anxiety can be challenging. Would you be interested in learning some grounding techniques that might help?";
  }
  
  if (lowercaseMessage.includes('help') || lowercaseMessage.includes('support')) {
    return "You're taking a great step by reaching out. Remember, professional help is always available if you need more support.";
  }
  
  // Default supportive response
  return SUPPORT_MESSAGES[Math.floor(Math.random() * SUPPORT_MESSAGES.length)];
};

const chatPage = ({ router }) => {
  const [messages, setMessages] = useState([
    { id: '0', text: "Welcome to Skribble. How are you feeling today?", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const flatListRef = useRef(null);

  const navigation = useNavigation();

  const navigateToHomePage = () => {
    navigation.navigate('homePage'); 
  };

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: `${messages.length}`,
      text: inputMessage,
      sender: 'user'
    };

    // Update messages with user message
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Generate bot response
    const botResponse = {
      id: `${messages.length + 1}`,
      text: generateSupportResponse(inputMessage),
      sender: 'bot'
    };

    // Add bot response after short delay
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);

    // Clear input
    setInputMessage('');
  };

  const resetChat = () => {
    setMessages([
      { id: '0', text: "Welcome to Skribble. How are you feeling today?", sender: 'bot' }
    ]);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer, 
      item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer
    ]}>
      <Text style={item.sender === 'user' ? styles.userMessageText : styles.botMessageText}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={navigateToHomePage}
            accessibilityLabel="Go to Home"
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Image
              source={require('../../assets/images/GreenPinkLogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <TouchableOpacity 
            onPress={resetChat} 
            style={styles.resetButton}
            accessibilityLabel="Reset Chat"
          >
            <Text style={styles.resetButtonText}>↻</Text>
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => 
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />


        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput 
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Share how you're feeling..."
            style={styles.input}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity 
            onPress={sendMessage}
            style={styles.sendButton}
            accessibilityLabel="Send Message"
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



export default chatPage;