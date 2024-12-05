import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, SafeAreaView, Modal, Alert, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { avatar_list } from '../../assets/avatars/avatarAssets';
import createNeo4jDriver from '../utils/databaseSetUp';
import { getDarkerShade } from '../utils/colorUtils';
import { AuthContext } from "../AuthContext";

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
  const { sessionToken } = useContext(AuthContext);
  
  // Set up the Neo4j driver
  const driver = createNeo4jDriver();

  interface Friend {
    id: number;
    name: string;
    avatar: any;
    friendCode: string;
  }
  interface FriendRequest {
    id: number;
    name: string;
    avatar: any;
    friendCode: string;
  }

  const [friendsList, setFriendsList] = useState<FriendRequest[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

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
        `MATCH (u:User {friendCode: $friendRequestCode})
         RETURN u.name AS name, u.avatarImage AS avatarImage`,
        { friendRequestCode }
      );

      if (result.records.length > 0) {
        const record = result.records[0];
        const friendName = record.get("name");
        const friendAvatar = record.get("avatarImage");

        const newRequest = {
          id: friendRequests.length + 1,
          name: friendName,
          avatar: friendAvatar,
          friendCode: friendRequestCode
        };

        setFriendRequests([...friendRequests, newRequest]);
        setFriendRequestCode('');
        setFriendRequestModal(false);
        Alert.alert('Success', `Friend request sent to ${friendName}`);
      } else {
        Alert.alert('Error', 'Friend not found');
      }
    } catch (error) {
      console.error("Failed to send friend request", error);
      Alert.alert("Error", "Could not send friend request. Please try again.");
    } finally {
      await session.close();
    }
  };

  const acceptFriendRequest = async (request: FriendRequest) => {
    const session = driver.session();
    try {
      await session.run(
        `MATCH (u:User {sessionToken: $sessionToken}), (f:User {friendCode: $friendCode})
         MERGE (u)-[:FRIENDS_WITH]->(f)`,
        { sessionToken, friendCode: request.friendCode }
      );

      const updatedRequests = friendRequests.filter(r => r.id !== request.id);
      const updatedFriendsList = [...friendsList, request];
      setFriendRequests(updatedRequests);
      setFriendsList(updatedFriendsList);
      Alert.alert('Success', `${request.name} is now your friend!`);
    } catch (error) {
      console.error("Failed to accept friend request", error);
      Alert.alert("Error", "Could not accept friend request. Please try again.");
    } finally {
      await session.close();
    }
  };

  const rejectFriendRequest = (request: FriendRequest) => {
    const updatedRequests = friendRequests.filter(r => r.id !== request.id);
    setFriendRequests(updatedRequests);
    Alert.alert('Notification', `Friend request from ${request.name} has been rejected`);
  };

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
        style={{
          width: Platform.select({
            web: screenWidth / 3 - 20,
            default: screenWidth / 2 - 20
          }),
          margin: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{
          width: imageSize,
          height: imageSize,
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <Image
            source={item.avatar}
            style={{
              width: '120%',
              height: '105%',
              resizeMode: 'contain',
              margin: '2%',
            }}
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 26,
            color: 'black',
            marginTop: 10,
            alignSelf: 'center'
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFriendRequests = ({ item }: { item: FriendRequest }) => {
    const screenWidth = Dimensions.get('window').width;

    // Responsive sizing for request items
    const avatarSize = Platform.select({
      web: screenWidth / 6, // Larger on web
      default: screenWidth / 4 // Larger on mobile
    });

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          backgroundColor: backgroundColor,
          width: '100%'
        }}
      >
        <View style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          marginRight: 15,
        }}>
          <Image
            source={item.avatar}
            style={{
              paddingTop: '10%',
              width: '115%',
              height: '115%',
              resizeMode: 'contain',
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 18,
            marginBottom: 5
          }}>
            {item.name}
          </Text>
          <Text style={{ color: 'gray' }}>
            Wants to be your friend
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => rejectFriendRequest(item)}
            style={{
              backgroundColor: '#EF4444',
              padding: 10,
              borderRadius: 5,
              marginRight: 10
            }}
          >
            <Text style={{ color: 'white' }}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => acceptFriendRequest(item)}
            style={{
              backgroundColor: headerColor,
              padding: 10,
              borderRadius: 5
            }}
          >
            <Text style={{ color: 'white' }}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
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
      <View style={{ backgroundColor: backgroundColor }}>
        <View style={{
          backgroundColor: headerColor,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15,
          justifyContent: 'space-between'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setSelectedFriend(null)}>
              <Text style={{ color: 'white', marginRight: 15 }}>Back</Text>
            </TouchableOpacity>
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold'
            }}>{selectedFriend.name}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              // Explicit console log to debug
              console.log('Remove button pressed', selectedFriend);
              removeFriend(selectedFriend);
            }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: 8,
              borderRadius: 5
            }}
          >
            <Text style={{ color: 'white' }}>Remove</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <View style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: headerColor,
          }}>
            <Image
              source={selectedFriend.avatar}
              style={{
                width: '90%',
                height: '90%',
                resizeMode: 'contain',
              }}
            />
          </View>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 15
          }}>{selectedFriend.name}</Text>
        </View>
      </View>
    );
  };

  const renderMainContent = () => {
    if (selectedFriend) {
      return renderFriendProfile();
    }

    return (
      <View style={{ backgroundColor: backgroundColor, flex: 1 }}>
        {/* Header */}
        <View style={{
          backgroundColor: headerColor,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 15
        }}>
          <TouchableOpacity 
          onPress={() => router.push('/homePage')}
            style={{
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 8,
              borderRadius: 5
            }}>
            <Text style={{ color: headerColor, marginRight: 15 }}>Back</Text>
          </TouchableOpacity>
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold'
          }}>Friends</Text>
          <TouchableOpacity
            onPress={() => setFriendRequestModal(true)}
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderRadius: 5
            }}
          >
            <Text style={{ color: headerColor}}>Add Friend</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#F3F4F6'
        }}>
          <TouchableOpacity
            style={{
              flex: 1,
              padding: 15,
              alignItems: 'center',
              borderBottomWidth: activeTab === 'friends' ? 2 : 0,
              borderBottomColor: headerColor
            }}
            onPress={() => setActiveTab('friends')}
          >
            <Text style={{
              color: activeTab === 'friends' ? headerColor : 'gray'
            }}>My Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              padding: 15,
              alignItems: 'center',
              borderBottomWidth: activeTab === 'requests' ? 2 : 0,
              borderBottomColor: headerColor
            }}
            onPress={() => setActiveTab('requests')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{
                color: activeTab === 'requests' ? headerColor : 'gray'
              }}>Requests</Text>
              {friendRequests.length > 0 && (
                <View style={{
                  backgroundColor: 'red',
                  borderRadius: 10,
                  width: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 5
                }}>
                  <Text style={{
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}>
                    {friendRequests.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={{ padding: 10, backgroundColor: '#F3F4F6' }}>
          <TextInput
            placeholder="Search friends"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 5
            }}
          />
        </View>

        {/* Friends or Requests List */}
        {activeTab === 'friends' ? (
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
        ) : (
          <FlatList
            data={friendRequests}
            renderItem={renderFriendRequests}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{
              width: '100%'
            }}
          />
        )}

        {/* Friend Request Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={friendRequestModal}
          onRequestClose={() => setFriendRequestModal(false)}
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}>
            <View style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '80%'
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 15
              }}>Send Friend Request</Text>
              <TextInput
                placeholder="Enter friend code"
                value={friendRequestCode}
                onChangeText={setFriendRequestCode}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 15
                }}
              />
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <TouchableOpacity
                  onPress={() => setFriendRequestModal(false)}
                  style={{
                    backgroundColor: '#F3F4F6',
                    padding: 10,
                    borderRadius: 5,
                    flex: 1,
                    marginRight: 10
                  }}
                >
                  <Text style={{
                    textAlign: 'center',
                    color: 'black'
                  }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={sendFriendRequest}
                  style={{
                    backgroundColor: headerColor,
                    padding: 10,
                    borderRadius: 5,
                    flex: 1
                  }}
                >
                  <Text style={{
                    textAlign: 'center',
                    color: 'white'
                  }}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: backgroundColor
    }}>
      {renderMainContent()}
    </SafeAreaView>
  );
};

export default FriendsPage;