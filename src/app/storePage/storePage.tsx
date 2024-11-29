import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { category_list, clothes_list } from '../../assets/clothing/clothingAssets';

const StorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (category_id: string) => {
    setSelectedCategory(category_id);
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
          <View key={item._id} style={styles.item}>
            <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryImage: {
    width: 175,
    height: 175,
    marginBottom: 10,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
  },
  itemsContainer: {
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '20%', 
    padding: 10,
    marginBottom: 20,
    marginRight: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  itemImage: {
    width: 150,
    height: 175,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
  },
});

export default StorePage;