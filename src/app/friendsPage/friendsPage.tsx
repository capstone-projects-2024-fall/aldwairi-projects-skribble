import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, SafeAreaView, Modal, Alert, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { avatar_list } from '../../assets/avatars/avatarAssets';
import { clothes_list } from '../../assets/clothing/clothingAssets';
import createNeo4jDriver from '../utils/databaseSetUp';
import { getDarkerShade } from '../utils/colorUtils';
import { AuthContext } from "../AuthContext";
import styles from './styles';

/**
 * FriendsPage component that allows users to view and manage their friends.
 * Users can send friend requests, view their friends' profiles, and remove friends.
 * This component interacts with a Neo4j database to load and manage friends.
 * 
 * @component
 * @example
 * return <FriendsPage />
 */
const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friendRequestModal, setFriendRequestModal] = useState(false);
  const [friendRequestCode, setFriendRequestCode] = useState('');
  const [headerColor, setHeaderColor] = useState('#3B82F6');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [avatarImage, setAvatarImage] = useState(avatar_list[0].avatar_image);
  const [friendCode, setFriendCode] = useState('');
  const [wornItems, setWornItems] = useState<any[]>([]);
  const { sessionToken } = useContext(AuthContext);

  // Set up the Neo4j driver
  const driver = createNeo4jDriver();

   /**
   * @typedef {Object} Friend
   * @property {number} id - Unique identifier for the friend.
   * @property {string} name - Name of the friend.
   * @property {any} avatar - Avatar image of the friend.
   * @property {any[]} clothes - List of clothes worn by the friend.
   * @property {string} friendCode - Friend code of the friend.
   */
  interface Friend {
    id: number;
    name: string;
    avatar: any;
    clothes: any[];
    friendCode: string;
  }

  const [friendsList, setFriendsList] = useState<Friend[]>([]);

  const router = useRouter();

  /**
   * Load user data from the Neo4j database.
   * Fetches user profile, background color, avatar, and friend code.
   * Also loads the list of friends.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
  useEffect(() => {
    const loadUserData = async () => {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (u:User {sessionToken: $sessionToken})
           RETURN 
            u.backgroundColor AS backgroundColor,
            u.avatarImage AS avatarImage,
            u.friendCode AS friendCode`,
          { sessionToken }
        );
        if (result.records.length > 0) {
          const record = result.records[0];
          const backgroundColor = record.get("backgroundColor");
          const avatarImage = record.get("avatarImage");
          const friendCode = record.get("friendCode");

          //console.log("User properties:", { backgroundColor, avatarImage, friendCode }); // Debugging

          setBackgroundColor(backgroundColor || "#FFFFFF");
          setAvatarImage(avatarImage || avatar_list[0].avatar_image);
          setFriendCode(friendCode);

          // Load friends list
          const friendsResult = await session.run(
            `MATCH (u:User {sessionToken: $sessionToken})-[:FRIENDS_WITH]->(f:User)
            RETURN f.name AS name, f.avatarImage AS avatarImage, f.friendCode AS friendCode`,
            { sessionToken }
          );

          const friends = friendsResult.records.map(record => ({
            id: record.get("friendCode"), 
            name: record.get("name"),
            avatar: record.get("avatarImage"),
            clothes: [], 
            friendCode: record.get("friendCode")
          }));
          
          setFriendsList(friends);
        } else {
          Alert.alert("Error", "User not found.");
        }
      } catch (error) {
        // console.error("Failed to load user data", error);
        Alert.alert("Error", "Could not fetch user data.");
      } finally {
        await session.close();
      }
    };

    loadUserData();
  }, [sessionToken]);

  /**
   * Update header color based on background color.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    setHeaderColor(getDarkerShade(backgroundColor));
  }, [backgroundColor]);

  /**
   * Send a friend request to another user.
   * If the friend code is valid, a relationship is created in the Neo4j database.
   * The new friend is added to the friends list.
   *
   * @async
   * @function
   * @returns {void}
   */
  const sendFriendRequest = async () => {
    if (!friendRequestCode) {
      Alert.alert('Error', 'Please enter a friend code');
      return;
    }
  
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (targetUser:User {friendCode: $friendRequestCode})
         OPTIONAL MATCH (targetUser)-[:WEARS]->(item:Item)
         RETURN targetUser.name AS name, 
                targetUser.avatarImage AS avatarImage,
                collect(item.item_id) AS wornItems`,
        { friendRequestCode }
      );
  
      if (result.records.length > 0) {
        const record = result.records[0];
        const friendName = record.get("name");
        const friendAvatar = record.get("avatarImage");
        const clothes = record.get("wornItems");

        // console.log("Friend properties:", { friendName, friendAvatar, clothes });
  
        // Create a friend request relationship in the database
        await session.run(
          `MATCH (u:User {sessionToken: $sessionToken}), (f:User {friendCode: $friendRequestCode})
          MERGE (u)-[:FRIENDS_WITH]->(f)`,
          { sessionToken, friendRequestCode }
        );
  
        const newFriend = {
          id: friendsList.length + 1,
          name: friendName,
          avatar: friendAvatar, 
          clothes: clothes,
          friendCode: friendRequestCode
        };
  
        setFriendsList([...friendsList, newFriend]);
        setFriendRequestCode('');
        setFriendRequestModal(false);
        Alert.alert('Success', `Friend request sent to ${friendName}`);
      } else {
        Alert.alert('Error', 'Friend not found');
      }
    } catch (error) {
      // console.error("Failed to send friend request", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert("Error", `Could not send friend request. Please try again. Error: ${errorMessage}`);
    } finally {
      await session.close();
    }
  };

  /**
   * Filter and display worn items of a friend.
   *
   * @type {Array}
   */
  const wornItemsDetails = clothes_list.filter(item => wornItems.includes(item._id));

  /**
   * Render a grid item for each friend in the friends list.
   *
   * @function
   * @param {Object} param0 - Object containing the friend item data.
   * @param {Friend} param0.item - The friend object.
   * @returns {React.Element} The rendered grid item.
   */
  const renderFriendGridItem = ({ item }: { item: Friend }) => {
    const screenWidth = Dimensions.get('window').width;

    // Different sizing for web and mobile
    const imageSize = Platform.select({
      web: screenWidth / 4, // Smaller on web
      default: screenWidth / 2.5 // Larger on mobile
    });

    return (
      <TouchableOpacity
        onPress={() => setSelectedFriend(item)}
        style={[styles.friendGridItem, {
          width: Platform.select({
            web: screenWidth / 3 - 20,
            default: screenWidth / 2 - 20
          }),
        }]}
      >
        <View style={[styles.friendGridItemImageContainer, { width: imageSize, height: imageSize }]}>
          <Image
            source={avatar_list.find(avatar => avatar.avatar_id === item.avatar)?.avatar_image}
            style={[styles.friendGridItemImage,{ width: '100%', height: '100%' }]}
            resizeMode="contain"
          />
          {wornItemsDetails.map(item => (
          <Image
            key={item._id}
            source={item.image}
            style={styles.wornItem}
            resizeMode="contain"
          />
        ))}
        </View>
        <Text style={[styles.friendGridItemText, { fontSize: 24 }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * Remove a friend from the friends list.
   * A confirmation alert is shown before removing the friend.
   *
   * @function
   * @param {Friend} friend - The friend to remove.
   * @returns {void}
   */
  const removeFriend = (friend: Friend) => {
    if (Platform.OS === 'web') {
      // Use window.confirm for the web
      const confirmation = window.confirm(`Are you sure you want to remove ${friend.name}?`);
      if (confirmation) {
        setFriendsList((prevFriendsList) =>
          prevFriendsList.filter((f) => f.id !== friend.id)
        );
        setSelectedFriend(null);
      }
    } else {
      // Use Alert.alert for mobile
      Alert.alert(
        'Remove Friend',
        `Are you sure you want to remove ${friend.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => {
              setFriendsList((prevFriendsList) =>
                prevFriendsList.filter((f) => f.id !== friend.id)
              );
              setSelectedFriend(null);
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  /**
   * Render the profile of a selected friend.
   *
   * @function
   * @returns {React.Element} The rendered friend profile.
   */
  const renderFriendProfile = () => {
    if (!selectedFriend) return null;
    return (
      <View style={[styles.friendProfileContainer, { backgroundColor }]}>
        <View style={[styles.friendProfileHeader, { backgroundColor: headerColor }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setSelectedFriend(null)}>
              <Text style={styles.friendProfileBackButton}>Back</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              // Explicit console log to debug
              // console.log('Remove button pressed', selectedFriend);
              removeFriend(selectedFriend);
            }}
            style={styles.friendProfileRemoveButton}
          >
            <Text style={styles.friendProfileRemoveButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.friendProfileImageContainer}>
          <View style={[styles.friendProfileImageWrapper, { borderColor: headerColor }]}>
            <Image
              source={avatar_list.find(avatar => avatar.avatar_id === selectedFriend.avatar)?.avatar_image}
              style={[styles.friendProfileImage, { width: 450, height: 450 }]}
              resizeMode="contain"
            />
            {wornItemsDetails.map(item => (
              <Image
                key={item._id}
                source={item.image}
                style={styles.wornItem}
                resizeMode="contain"
              />
            ))}
          </View>
          <Text style={[styles.friendProfileName, { fontSize: 24 }]}>{selectedFriend.name}</Text>
        </View>
      </View>
    );
  };

  /**import React, { useState, useEffect, useRef } from 'react';
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
/**
 * A collection of predefined supportive messages that the bot can offer to the user.
 * These messages are intended to provide comfort, validation, and support to users 
 * who are seeking help or expressing difficult emotions.
 *
 * @type {Array<string>} An array of strings where each string is a supportive message.
 */
const SUPPORT_MESSAGES = [
  "It's okay to not be okay. Would you like to talk about how you're feeling?",
  "Your feelings are valid. I'm here to listen without judgment.",
  "Taking care of your mental health is important. What would help you feel more supported right now?",
  "Remember, seeking help is a sign of strength, not weakness.",
  "Would you like to explore some coping strategies together?"
];

// Bot responses
/**
 * Generates a supportive response based on the user's message.
 * 
 * This function analyzes the user's message for keywords related to common emotional states 
 * (e.g., sadness, anxiety, or general need for help) and generates a tailored response 
 * offering relevant support. If no specific emotion is identified, a random support message is returned.
 *
 * @param {string} userMessage - The message input provided by the user.
 * @returns {string} A response from the bot offering support or advice based on the user's message.
 * 
 * @example
 * // Example usage:
 * generateSupportResponse("I'm feeling anxious about everything right now.");
 * // Returns: "Anxiety can be challenging. Would you be interested in learning some grounding techniques that might help?"
 */
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

/**
 * ChatPage component that facilitates a mental health support conversation.
 * 
 * This component renders a chat interface where users can send messages and receive responses from a supportive bot.
 * The bot generates responses based on the user's input, offering comforting and supportive messages. 
 * Users can also reset the chat or navigate back to the home page.
 * 
 * @component
 * @example
 * // Example usage:
 * <ChatPage router={router} />
 * 
 * @param {Object} param0 - The component's props.
 * @param {Object} param0.router - The navigation object passed by React Navigation.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const chatPage = ({ router }) => {
  const [messages, setMessages] = useState([
    { id: '0', text: "Welcome to Skribble. How are you feeling today?", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const flatListRef = useRef(null);

  const navigation = useNavigation();

  /**
   * Navigates the user to the home page.
   * 
   * This function is triggered when the user presses the back button.
   */
  const navigateToHomePage = () => {
    navigation.navigate('homePage'); 
  };

  /**
   * Sends the user's message and generates a bot response.
   * 
   * This function is triggered when the user submits a message. It adds the user's message to the chat, generates 
   * a response from the bot, and then updates the state with the new messages.
   */
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

  /**
   * Resets the chat to its initial state.
   * 
   * This function resets the chat messages to the initial welcome message from the bot.
   */
  const resetChat = () => {
    setMessages([
      { id: '0', text: "Welcome to Skribble. How are you feeling today?", sender: 'bot' }
    ]);
  };

   /**
   * Renders each message in the chat.
   * 
   * This function is used by the FlatList component to render messages based on their sender.
   * 
   * @param {Object} item - The message item to be rendered.
   * @param {string} item.id - The unique ID of the message.
   * @param {string} item.text - The message text content.
   * @param {string} item.sender - The sender of the message (either 'user' or 'bot').
   * 
   * @returns {JSX.Element} A view displaying the message.
   */
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
   * Render the main content of the page, including tabs, search bar, and friends list.
   * If a friend is selected, the friend's profile will be shown instead.
   *
   * @function
   * @returns {React.Element} The rendered main content.
   */
  const renderMainContent = () => {
    if (selectedFriend) {
      return renderFriendProfile();
    }

    return (
      <View style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={[styles.headerContainer, { backgroundColor: headerColor }]}>
          <TouchableOpacity 
            onPress={() => router.push('/homePage')}
            style={[styles.headerButton, {backgroundColor: backgroundColor}]}
          >
            <Text style={[styles.headerButtonText, { marginLeft: 20 }]}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Friends</Text>
          <TouchableOpacity
            onPress={() => setFriendRequestModal(true)}
            style={[styles.addFriendButton, , {backgroundColor: backgroundColor}]}
          >
            <Text style={styles.addFriendButtonText}>Add Friend</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'friends' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('friends')}
          >
            <Text style={[
              styles.tabButtonText,
              activeTab === 'friends' && styles.activeTabButtonText,
            ]}>My Friends</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Search friends"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchBar}
          />
        </View>

        {/* Friends List */}
        <FlatList
          data={friendsList.filter(friend =>
            friend.name.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderFriendGridItem}
          keyExtractor={item => item.id.toString()}
          numColumns={Platform.select({
            web: 3,
            default: 2
          })}
          key={Platform.select({
            web: 3,
            default: 2
          })}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 20
          }}
        />

        {/* Friend Request Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={friendRequestModal}
          onRequestClose={() => setFriendRequestModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Send Friend Request</Text>
              <TextInput
                placeholder="Enter friend code"
                value={friendRequestCode}
                onChangeText={setFriendRequestCode}
                style={styles.modalInput}
              />
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  onPress={() => setFriendRequestModal(false)}
                  style={styles.modalCancelButton}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={sendFriendRequest}
                  style={[styles.modalSendButton, { backgroundColor: headerColor }]}
                >
                  <Text style={styles.modalSendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {renderMainContent()}
    </SafeAreaView>
  );
};

export default FriendsPage;