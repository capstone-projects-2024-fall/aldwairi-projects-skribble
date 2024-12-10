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


/**
 * The ClosetPage component displays a user's clothing items and avatar, allowing the user to 
 * manage their wardrobe and select items to "wear." The page fetches user data from a Neo4j 
 * database and updates the avatar and owned/worn items based on user preferences.
 *
 * - Displays user avatar and worn items.
 * - Allows category selection and filtering of owned items.
 * - Fetches user data, including avatar, background color, owned items, and worn items from the database.
 * - Updates the list of worn items in the database and on the UI.
 * - Allows the user to navigate to the Home and Store pages.
 *
 * @returns {JSX.Element} A React Native component representing the user's closet page.
 */
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

   /**
 * Effect hook to fetch user data from the Neo4j database upon component mount or when the session token changes.
 * 
 * This hook runs a Neo4j query to fetch the user's avatar image, background color, owned items, and worn items.
 * It updates the component's state based on the retrieved data. If the user data is not found or there is an error,
 * an alert is shown to the user.
 * 
 * @returns {void} This hook does not return anything.
 */
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

   /**
   * Handles the selection of a category.
   * 
   * @param {string} category_id The ID of the category to be selected.
   */
  const handleCategorySelect = (category_id: string) => {
    setSelectedCategory(category_id);
  };

  /**
   * Handles the selection of an item. Allows the user to wear or remove an item from the worn items.
   * 
   * @param {Object} item The selected item to wear or remove.
   */
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

  /**
 * Filters the list of clothing items based on the selected category and owned items.
 * 
 * If a category is selected, it filters the items to include only those that match the 
 * selected category and are owned by the user. If no category is selected, it defaults 
 * to filtering for items in the "bottoms" category.
 * 
 * @type {Array<Object>} The list of clothing items that match the selected category and 
 *                       are owned by the user.
 */
  const filteredItems = selectedCategory
    ? clothes_list.filter(item => item.category === selectedCategory && ownedItems.includes(item._id))
    : clothes_list.filter(item => item.category === 'bottoms' && ownedItems.includes(item._id));

  /**
 * Filters the list of clothing items that are currently worn by the user.
 * 
 * It filters the clothing items to include only those whose `_id` matches one of the 
 * items in the wornItems array, which represents the items the user is currently wearing.
 * 
 * @type {Array<Object>} The list of clothing items that are currently worn by the user.
 */
  const wornItemsDetails = clothes_list.filter(item => wornItems.includes(item._id));

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} testID="closetPage">
      {/* Header */}
      <View style={styles.headerContainer} testID="headerContainer">
        <TouchableOpacity
          onPress={() => router.push('/homePage')}
          style={[styles.headerButton, { backgroundColor: getDarkerShade(backgroundColor) }]}
          testID="backButton"
        >
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={logo_list.find(logo => logo.logo_id === "1")?.logo_image}
            style={styles.logo}
            resizeMode="contain"
            testID="logoImage"
          />
        </View>
        <TouchableOpacity
          onPress={() => router.push('/storePage/storePage')}
          style={[styles.headerButton, { backgroundColor: getDarkerShade(backgroundColor) }]}
          testID="storeButton"
        >
          <Text style={styles.headerButtonText}>Store</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title} testID="closetTitle">Closet</Text>

      <View style={styles.mainContent} testID="mainContent">
        {/* Avatar */}
        <View style={styles.avatarContainer} testID="avatarContainer">
          <Image
            source={require('../../assets/images/podium.png')}
            style={styles.podium}
            resizeMode="contain"
            testID="podiumImage"
          />
          <Image
            source={avatar_list.find(avatar => avatar.avatar_id === avatarImage)?.avatar_image}
            style={styles.avatar}
            resizeMode="contain"
            testID="avatarImage"
          />
          {wornItemsDetails.map(item => (
            <Image
              key={item._id}
              source={item.image}
              style={styles.wornItem}
              resizeMode="contain"
              testID={`wornItem-${item._id}`}
            />
          ))}
        </View>

        <View style={styles.rightContainer}>
          {/* Category Selection */}
          <View style={styles.categoryContainer} testID="categoryContainer">
            {category_list.map(category => (
              <TouchableOpacity
                key={category.category_id}
                onPress={() => handleCategorySelect(category.category_id)}
                testID={`category-${category.category_id}`}
              >
                <Image source={category.category_image} style={styles.categoryImage} resizeMode="contain" testID={`categoryImage-${category.category_id}`} />
                <Text style={styles.categoryText} testID={`categoryText-${category.category_id}`}>{category.category_id}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Clothing Items */}
          <View style={styles.itemsContainer} testID="itemsContainer">
            {filteredItems.map(item => (
              <TouchableOpacity key={item._id} onPress={() => handleItemSelect(item)} testID={`item-${item._id}`}>
                <View style={styles.item} testID={`itemView-${item._id}`}>
                  <Image source={item.image} style={styles.itemImage} resizeMode="contain" testID={`itemImage-${item._id}`} />
                  <Text style={styles.itemName} testID={`itemName-${item._id}`}>{item.name}</Text>
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