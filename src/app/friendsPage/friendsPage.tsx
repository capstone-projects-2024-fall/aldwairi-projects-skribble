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

  interface Friend {
    id: number;
    name: string;
    avatar: any;
    clothes: any[];
    friendCode: string;
  }

  const [friendsList, setFriendsList] = useState<Friend[]>([]);

  const router = useRouter();

  // Load user data
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

          console.log("User properties:", { backgroundColor, avatarImage, friendCode }); // Debugging

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
        console.error("Failed to load user data", error);
        Alert.alert("Error", "Could not fetch user data.");
      } finally {
        await session.close();
      }
    };

    loadUserData();
  }, [sessionToken]);

  // Update header color based on background color
  useEffect(() => {
    setHeaderColor(getDarkerShade(backgroundColor));
  }, [backgroundColor]);

  // get friend information
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

        console.log("Friend properties:", { friendName, friendAvatar, clothes });
  
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
      console.error("Failed to send friend request", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert("Error", `Could not send friend request. Please try again. Error: ${errorMessage}`);
    } finally {
      await session.close();
    }
  };

  const wornItemsDetails = clothes_list.filter(item => wornItems.includes(item._id));

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
              console.log('Remove button pressed', selectedFriend);
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