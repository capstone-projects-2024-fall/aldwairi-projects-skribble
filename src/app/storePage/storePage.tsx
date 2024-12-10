import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { category_list, clothes_list } from '../../assets/clothing/clothingAssets';
import neo4j from 'neo4j-driver';
import styles from './styles';
import { logo_list } from '../../assets/logos/logosAssets';
import { useRouter } from 'expo-router';
import createNeo4jDriver from '../utils/databaseSetUp';
import { getDarkerShade, getLighterShade } from '../utils/colorUtils'; 
import { AuthContext } from '../AuthContext';

/**
 * StorePage is the page where users can view and purchase clothing items using their in-app currency (coins).
 * It allows users to select a category of clothing, view items within that category, and confirm purchases. 
 * The user's available coins and background color are fetched from the database (Neo4j), and the page updates 
 * based on their selections.
 *
 * @returns {React.FC} A functional React component representing the store page.
 */
const StorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { sessionToken, setSessionToken } = useContext(AuthContext);
  const router = useRouter();
  const coinIcon = require('../../assets/images/coin.png');

  // Set up the Neo4j driver
  const driver = createNeo4jDriver();

  useEffect(() => {
    // Fetch user coins from the database
    const fetchUserCoins = async () => {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (u:User {sessionToken: $sessionToken})
           RETURN u.coins AS coins, u.backgroundColor AS backgroundColor`,
          { sessionToken }
        );

        if (result.records.length > 0) {
          const record = result.records[0];
          const backgroundColor = record.get("backgroundColor");
          const coins = Number(record.get("coins"));  
          setUserCoins(coins);
          setBackgroundColor(backgroundColor);
        } else {
          Alert.alert("Error", "User not found.");
        }
      } catch (error) {
        console.error("Failed to fetch user coins", error);
        Alert.alert("Error", "Could not fetch user coins.");
      } finally {
        await session.close();
      }
    };

    fetchUserCoins();
  }, [sessionToken]);

  /**
   * Handles category selection by updating the selected category state.
   * 
   * @param {string} category_id - The ID of the selected category.
   */
  const handleCategorySelect = (category_id: string) => {
    setSelectedCategory(category_id);
  };

   /**
   * Handles item selection by setting the selected item and displaying the purchase modal.
   * 
   * @param {any} item - The item selected for purchase.
   */
  const handleItemSelect = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  /**
   * Handles the purchase of the selected item. If the user has enough coins, it updates
   * the database by subtracting the cost and assigning the item to the user.
   */
  const handlePurchase = async () => {
    if (userCoins >= selectedItem.price) {
      const session = driver.session();
      try {
        await session.run(
          `MATCH (u:User {sessionToken: $sessionToken})
           SET u.coins = u.coins - $price
           CREATE (u)-[:OWNS]->(:Item {item_id: $item_id})
           RETURN u`,
          { sessionToken, price: selectedItem.price, item_id: selectedItem._id } 
        );

        setUserCoins(userCoins - selectedItem.price);
        Alert.alert("Success", "Purchase successful!");
      } catch (error) {
        console.error("Failed to complete purchase", error);
        Alert.alert("Error", "Could not complete purchase.");
      } finally {
        await session.close();
      }
    } else {
      Alert.alert("Error", "Not enough coins.");
    }
    setModalVisible(false);
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
    ? clothes_list.filter(item => item.category === selectedCategory)
    : clothes_list.filter(item => item.category === 'bottoms');

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
        <TouchableOpacity onPress={() => router.push('/closetPage/closetPage')} style={[styles.headerButton, { backgroundColor: getDarkerShade(backgroundColor) }]}>
          <Text style={styles.headerButtonText}>Closet</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Store</Text>

      {/* Category Selection */}
      <View style={styles.categoryContainer}>
        {category_list.map(category => (
          <TouchableOpacity key={category.category_id} style={{ padding: 5, paddingLeft: 40, paddingRight: 40, borderRadius: 5, backgroundColor: getDarkerShade(backgroundColor) }} onPress={() => handleCategorySelect(category.category_id)}>
            <Image source={category.category_image} style={styles.categoryImage} resizeMode="contain" />
            <Text style={styles.categoryText}>{category.category_id}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Coins */}
      <View style={styles.coinsContainer}>
        <Image source={coinIcon} style={{ width: 40, height: 40}} />
        <Text style={styles.coinsLabel}>{userCoins}</Text>
      </View>

      {/* Clothing Items */}
      <View style={styles.itemsContainer}>
        {filteredItems.map(item => (
          <TouchableOpacity key={item._id} onPress={() => handleItemSelect(item)}>
            <View style={styles.item}>
              <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={coinIcon} style={{ width: 20, height: 20, marginRight: 5, marginTop: -7 }} />
                  <Text style={styles.modalItemPrice}>{item.price.toFixed(2)}</Text>
                </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Purchase Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Confirm Purchase</Text>
            {selectedItem && (
              <>
                <Image source={selectedItem.image} style={styles.modalImage} resizeMode="contain" />
                <Text style={styles.modalItemName}>{selectedItem.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={coinIcon} style={{ width: 20, height: 20, marginRight: 5, marginTop: -7 }} />
                  <Text style={styles.modalItemPrice}>{selectedItem.price.toFixed(2)}</Text>
                </View>
                <Text style={styles.modalUserCoins}>Your Coins: {userCoins}</Text>
                <TouchableOpacity style={[styles.modalButton, {backgroundColor: getLighterShade(backgroundColor)}]} onPress={handlePurchase}>
                  <Text style={styles.modalButtonText}>Purchase</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, {backgroundColor: getDarkerShade(backgroundColor)}]}  onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default StorePage;