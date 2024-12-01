import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, SafeAreaView, Modal, Alert, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendRequestModal, setFriendRequestModal] = useState(false);
  const [friendRequestUsername, setFriendRequestUsername] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [headerColor, setHeaderColor] = useState('#3B82F6');

  const [friendsList, setFriendsList] = useState([
    { id: 1, name: 'JellyBean', avatar: require('../../assets/images/dog/dog5.png') },
    { id: 2, name: 'CookieMonster', avatar: require('../../assets/images/bear/bear3.png') },
    { id: 3, name: 'CloudChaser', avatar: require('../../assets/images/tiger/tiger4.png') },
    { id: 4, name: 'FrostyPenguin', avatar: require('../../assets/images/penguin/penguin2.png') },
    { id: 5, name: 'TurboPanda', avatar: require('../../assets/images/panda/panda4.png') }
  ]);

  const [friendRequests, setFriendRequests] = useState([
    { id: 4, name: 'NightPhantom', avatar: require('../../assets/images/panda/panda1.png') },
    { id: 5, name: 'DarkVortex', avatar: require('../../assets/images/bear/bear2.png') }
  ]);

  // Function to get header color
  const getHeaderColor = (bgColor) => {
    switch (bgColor) {
      case '#99CA9C':
        return '#2F855A';
      case '#9FDDF9':
        return '#2C5282';
      case '#FAC1BE':
        return '#B83280';
      default:
        return '#3B82F6';
    }
  };

  // Load background color
  useEffect(() => {
    const loadBackgroundColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('backgroundColor');
        if (savedColor) {
          setBackgroundColor(savedColor);
          setHeaderColor(getHeaderColor(savedColor));
        }
      } catch (error) {
        console.error('Failed to load background color', error);
      }
    };
    loadBackgroundColor();
  }, []);

  const sendFriendRequest = () => {
    if (!friendRequestUsername) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    const newRequest = {
      id: friendRequests.length + 1,
      name: friendRequestUsername,
      avatar: require('../../assets/images/bear/bear5.png')
    };

    setFriendRequests([...friendRequests, newRequest]);
    setFriendRequestUsername('');
    setFriendRequestModal(false);
    Alert.alert('Success', `Friend request sent to ${friendRequestUsername}`);
  };

  const acceptFriendRequest = (request) => {
    const updatedRequests = friendRequests.filter(r => r.id !== request.id);
    const updatedFriendsList = [...friendsList, request];
    setFriendRequests(updatedRequests);
    setFriendsList(updatedFriendsList);
    Alert.alert('Success', `${request.name} is now your friend!`);
  };

  const rejectFriendRequest = (request) => {
    const updatedRequests = friendRequests.filter(r => r.id !== request.id);
    setFriendRequests(updatedRequests);
    Alert.alert('Notification', `Friend request from ${request.name} has been rejected`);
  };

  const renderFriendGridItem = ({ item }) => {
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
          alignItems: 'center', // Center the image within container
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

  const renderFriendRequests = ({ item }) => {
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

  const renderFriendProfile = () => {
    if (!selectedFriend) return null;
    return (
      <View style={{ backgroundColor: backgroundColor }}>
        <View style={{
          backgroundColor: headerColor,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15
        }}>
          <TouchableOpacity onPress={() => setSelectedFriend(null)}>
            <Text style={{ color: 'white', marginRight: 15 }}>Back</Text>
          </TouchableOpacity>
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold'
          }}>{selectedFriend.name}</Text>
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
            <Text style={{ color: headerColor }}>Add Friend</Text>
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
                placeholder="Enter username"
                value={friendRequestUsername}
                onChangeText={setFriendRequestUsername}
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