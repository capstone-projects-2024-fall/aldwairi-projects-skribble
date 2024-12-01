import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { category_list, clothes_list } from '../../assets/clothing/clothingAssets';
import styles from './styles';
import { logo_list } from '../../assets/logos/logosAssets';
import { avatar_list } from '../../assets/avatars/avatarAssets';
import { useRouter } from 'expo-router';
import createNeo4jDriver from '../utils/databaseSetUp';
import { getDarkerShade } from '../utils/colorUtils'; 

const ClosetPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const router = useRouter();

  // Set up the Neo4j driver
  const driver = createNeo4jDriver();

  useEffect(() => {
    // Fetch user coins from the database
    const fetchUserCoins = async () => {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (u:User {email: $email})
          u.backgroundColor AS backgroundColor
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

  const filteredItems = selectedCategory
    ? clothes_list.filter(item => item.category === selectedCategory)
    : clothes_list;

  return (
    <ScrollView style={styles.container}>
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
            source={avatar_list.find(avatar => avatar.avatar_id === "1")?.avatar_image}
            style={styles.avatar}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/images/podium.png')}
            style={styles.podium}
            resizeMode="contain"
          />
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