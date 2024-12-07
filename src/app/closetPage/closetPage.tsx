import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { category_list, clothes_list } from '../../assets/clothing/clothingAssets';
import styles from './styles';
import { logo_list } from '../../assets/logos/logosAssets';
import { avatar_list } from '../../assets/avatars/avatarAssets';
import { useRouter } from 'expo-router';
import createNeo4jDriver from '../utils/databaseSetUp';
import { getDarkerShade } from '../utils/colorUtils';
import { AuthContext } from "../AuthContext"; 

const ClosetPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [avatarImage, setAvatarImage] = useState(avatar_list[0].avatar_image);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [wornItems, setWornItems] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { sessionToken } = useContext(AuthContext);
  const router = useRouter();

  // Set up the Neo4j driver
  const driver = createNeo4jDriver();

  useEffect(() => {
    // Fetch user data from the database
    const fetchUserData = async () => {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (u:User {sessionToken: $sessionToken})-[:OWNS]->(i:Item)
           OPTIONAL MATCH (u)-[:WEARS]->(w:Item)
           RETURN u.avatarImage AS avatarImage, 
                  u.backgroundColor AS backgroundColor, 
                  collect(i.item_id) AS ownedItems,
                  collect(w.item_id) AS wornItems`,
          { sessionToken } 
        );

        if (result.records.length > 0) {
          const record = result.records[0];
          const avatarImage = record.get("avatarImage");
          const backgroundColor = record.get("backgroundColor");
          const ownedItems = record.get("ownedItems");
          const wornItems = record.get("wornItems");

          setAvatarImage(avatarImage || avatar_list[0].avatar_image);
          setBackgroundColor(backgroundColor);
          setOwnedItems(ownedItems);
          setWornItems(wornItems);
        } else {
          Alert.alert("Error", "User not found.");
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
        Alert.alert("Error", "Could not fetch user data.");
      } finally {
        await session.close();
      }
    };

    fetchUserData();
  }, [sessionToken]);

  const handleCategorySelect = (category_id: string) => {
    setSelectedCategory(category_id);
  };

  const handleItemSelect = async (item: any) => {
    const session = driver.session();
    try {
      if (wornItems.includes(item._id)) {
        // Remove the item if it is already worn
        await session.run(
          `MATCH (u:User {sessionToken: $sessionToken})-[r:WEARS]->(i:Item {item_id: $item_id})
           DELETE r`,
          { sessionToken, item_id: item._id }
        );

        setWornItems(prevWornItems => prevWornItems.filter(wornItem => wornItem !== item._id));
      } else {
        // Wear the item if it is not already worn
        await session.run(
          `MATCH (u:User {sessionToken: $sessionToken})
           OPTIONAL MATCH (u)-[r:WEARS]->(w:Item {category: $category})
           DELETE r
           CREATE (u)-[:WEARS]->(i:Item {item_id: $item_id})
           RETURN i`,
          { sessionToken, category: item.category, item_id: item._id }
        );

        setWornItems(prevWornItems => {
          const updatedWornItems = prevWornItems.filter(wornItem => wornItem !== item._id);
          updatedWornItems.push(item._id);
          return updatedWornItems;
        });
      }

      setSelectedItem(item);
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to wear/remove item", error);
      Alert.alert("Error", "Could not wear/remove item. Please try again.");
    } finally {
      await session.close();
    }
  };

  const filteredItems = selectedCategory
    ? clothes_list.filter(item => item.category === selectedCategory && ownedItems.includes(item._id))
    : clothes_list.filter(item => item.category === 'bottoms' && ownedItems.includes(item._id));

  const wornItemsDetails = clothes_list.filter(item => wornItems.includes(item._id));

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/homePage')} style={[styles.headerButton, { backgroundColor: getDarkerShade(backgroundColor) }]}>
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={logo_list.find(logo => logo.logo_id === "1")?.logo_image}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity onPress={() => router.push('/storePage/storePage')} style={[styles.headerButton, { backgroundColor: getDarkerShade(backgroundColor) }]}>
          <Text style={styles.headerButtonText}>Store</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Closet</Text>

      <View style={styles.mainContent}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../assets/images/podium.png')}
            style={styles.podium}
            resizeMode="contain"
          />
          <Image
            testID="avatar"
            source={avatar_list.find(avatar => avatar.avatar_id === avatarImage)?.avatar_image}
            style={styles.avatar}
            resizeMode="contain"
          />
          {wornItemsDetails.map(item => (
            <Image
              key={item._id}
              testID="wornItem"
              source={item.image}
              style={styles.wornItem}
              resizeMode="contain"
            />
          ))}
        </View>

        <View style={styles.rightContainer}>
          {/* Category Selection */}
          <View style={styles.categoryContainer}>
            {category_list.map(category => (
              <TouchableOpacity key={category.category_id} onPress={() => handleCategorySelect(category.category_id)}>
                <Image source={category.category_image} style={styles.categoryImage} resizeMode="contain" />
                <Text style={styles.categoryText}>{category.category_id}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Clothing Items */}
          <View style={styles.itemsContainer}>
            {filteredItems.map(item => (
              <TouchableOpacity key={item._id} onPress={() => handleItemSelect(item)}>
                <View style={styles.item}>
                  <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ClosetPage;