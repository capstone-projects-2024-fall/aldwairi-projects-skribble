import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { category_list, clothes_list } from '../../assets/clothing/clothingAssets';
import neo4j from 'neo4j-driver';
import styles from './styles';

const StorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Initialize Neo4j driver
  const driver = neo4j.driver(
    "neo4j+s://24f2d4b6.databases.neo4j.io", // Replace with your Neo4j URI
    neo4j.auth.basic("neo4j", "SXrtyxnQgr5WBO8yNwulKKI9B1ulfsiLa8SKvlJk5Hc") // Replace with your credentials
  );

  useEffect(() => {
    // Fetch user coins from the database
    const fetchUserCoins = async () => {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (u:User {email: $email})
           RETURN u.coins AS coins`,
          { email: "<current_user_email>" } // Replace with the logged-in user's email
        );

        if (result.records.length > 0) {
          const coins = result.records[0].get("coins").toNumber();
          setUserCoins(coins);
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
  }, []);

  const handleCategorySelect = (category_id: string) => {
    setSelectedCategory(category_id);
  };

  const handleItemSelect = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handlePurchase = async () => {
    if (userCoins >= selectedItem.price) {
      const session = driver.session();
      try {
        await session.run(
          `MATCH (u:User {email: $email})
           SET u.coins = u.coins - $price
           RETURN u`,
          { email: "<current_user_email>", price: selectedItem.price } // Replace with the logged-in user's email
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

  const filteredItems = selectedCategory
    ? clothes_list.filter(item => item.category === selectedCategory)
    : clothes_list;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Store</Text>

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
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
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
                <Text style={styles.modalItemPrice}>Price: ${selectedItem.price.toFixed(2)}</Text>
                <Text style={styles.modalUserCoins}>Your Coins: {userCoins}</Text>
                <TouchableOpacity style={styles.modalButton} onPress={handlePurchase}>
                  <Text style={styles.modalButtonText}>Purchase</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#FF6347' }]} onPress={() => setModalVisible(false)}>
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