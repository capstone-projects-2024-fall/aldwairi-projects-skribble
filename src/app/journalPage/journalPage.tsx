import React, { useState, useEffect, useContext } from 'react';
import { styles } from '../journalPage/styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  SafeAreaView,
  Alert,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { avatar_list } from '../../assets/avatars/avatarAssets';
import { useRouter } from "expo-router";
import createNeo4jDriver from '../utils/databaseSetUp';
import { AuthContext } from "../AuthContext";

interface JournalEntry {
  title: string;
  content: string;
  date: string;
  imageIndex: number;
}

  const JournalPage: React.FC = () => {
    const router = useRouter();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [currentDeleteIndex, setCurrentDeleteIndex] = useState<number | null>(null);
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState<string>('#E3F2FD');
    const [isGifVisible, setIsGifVisible] = useState(false);
    const [avatarImage, setAvatarImage] = useState(avatar_list[0].avatar_image);
    const { sessionToken } = useContext(AuthContext);
    const fadeAnim = useState(new Animated.Value(0))[0];

  const BEAR_IMAGES = [
    require('../../assets/images/bear/bear1.png'),
    require('../../assets/images/bear/bear2.png'),
    require('../../assets/images/bear/bear3.png'),
    require('../../assets/images/bear/bear4.png'),
    require('../../assets/images/bear/bear5.png')
  ];

  const DOG_IMAGES = [
    require('../../assets/images/dog/dog1.png'),
    require('../../assets/images/dog/dog2.png'),
    require('../../assets/images/dog/dog3.png'),
    require('../../assets/images/dog/dog4.png'),
    require('../../assets/images/dog/dog5.png')
  ];

  const PANDA_IMAGES = [
    require('../../assets/images/panda/panda1.png'),
    require('../../assets/images/panda/panda2.png'),
    require('../../assets/images/panda/panda3.png'),
    require('../../assets/images/panda/panda4.png'),
    require('../../assets/images/panda/panda5.png')
  ];

  const PENGUIN_IMAGES = [
    require('../../assets/images/penguin/penguin1.png'),
    require('../../assets/images/penguin/penguin2.png'),
    require('../../assets/images/penguin/penguin3.png'),
    require('../../assets/images/penguin/penguin4.png'),
    require('../../assets/images/penguin/penguin5.png')
  ];

  const TIGER_IMAGES = [
    require('../../assets/images/tiger/tiger1.png'),
    require('../../assets/images/tiger/tiger2.png'),
    require('../../assets/images/tiger/tiger3.png'),
    require('../../assets/images/tiger/tiger4.png'),
    require('../../assets/images/tiger/tiger5.png')
  ];

  const getImageSet = (id: string | null) => {
    console.log("set:", id)
    switch (id) {
      case '1':
        return BEAR_IMAGES;
      case '2':
        return DOG_IMAGES;
      case '3':
        return PANDA_IMAGES;
      case '4':
        return PENGUIN_IMAGES;
      case '5':
        return TIGER_IMAGES;
      default:
        return BEAR_IMAGES; // Default to BEAR_IMAGES if no avatarImageID
    }
  };

  const driver = createNeo4jDriver();

  // Load journal entries from AsyncStorage on component mount
  useEffect(() => {
    const loadUserData = async () => {
      const session = driver.session()
      try {
        const result = await session.run(
          'MATCH (u:User {sessionToken: $sessionToken}) RETURN u.backgroundColor AS backgroundColor, u.avatarImage as avatarImage',
          { sessionToken }
        );
        if (result.records.length > 0) {
          // Directly accessing the fields in the result
          const record = result.records[0];
          // Extract values from the result, handling the INTEGER type if necessary
          const backgroundColor = record.get("backgroundColor");
          const avatarImage = record.get("avatarImage");
          setBackgroundColor(backgroundColor || "#FFFFFF");
          setAvatarImage(avatarImage || avatar_list[0].avatar_image);
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
    const loadEntries = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem('journalEntries');
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries));
        }

        const savedColor = await AsyncStorage.getItem('backgroundColor');
        if (savedColor) {
          setBackgroundColor(savedColor);
        } else {
          setBackgroundColor("#FFEBEE")
        }
      } catch (error) {
        console.error('Error loading entries:', error);
      }
    };
    loadEntries();
    loadUserData();
    console.log("User properties:", { backgroundColor, avatarImage });
  }, [sessionToken]);

  // Save journal entries to AsyncStorage whenever they change
  useEffect(() => {
    const saveEntries = async () => {
      try {
        await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
      } catch (error) {
        console.error('Error saving entries:', error);
      }
    };
    saveEntries();
  }, [entries]);

  const navigateToHomePage = () => {
    router.push('/homePage');
  };

  // Function to show GIF animation
  const showRewardGif = () => {
    setIsGifVisible(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(1100), // Show GIF for 2 seconds
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsGifVisible(false);
    });
  };

  const getRandomImageIndex = (): number => {
    const imageSet = getImageSet(avatarImage);
    console.log("imageSet:", {imageSet})
    return Math.floor(Math.random() * imageSet.length);
  };


  const showNewEntryForm = () => {
    setIsFormVisible(true);
    setCurrentEntry(null);
  };

  const cancelNewEntryForm = () => {
    setIsFormVisible(false);
    setSelectedPrompt(null);
  };

  const saveEntry = () => {
    if (!currentEntry?.title || !currentEntry?.content) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newEntry: JournalEntry = {
      title: currentEntry.title,
      content: currentEntry.content,
      date: new Date().toISOString(),
      imageIndex: getRandomImageIndex(),
    };

    setEntries([newEntry, ...entries]);
    setIsFormVisible(false);
    setSelectedPrompt(null);
    setCurrentEntry(null);
    showRewardGif();
  };

  const handleViewEntry = (index: number) => {
    setCurrentEntry(entries[index]);
    setIsFormVisible(false);
  };

  const handleBack = () => {
    setCurrentEntry(null);
  };

  const showDeleteConfirmation = (index: number) => {
    setCurrentDeleteIndex(index);
    setIsDeleteConfirmVisible(true);
  };

  const hideDeleteConfirmation = () => {
    setIsDeleteConfirmVisible(false);
    setCurrentDeleteIndex(null);
  };

  const handleDeleteEntry = () => {
    if (currentDeleteIndex !== null) {
      const updatedEntries = entries.filter((_, index) => index !== currentDeleteIndex);
      setEntries(updatedEntries);
      setIsDeleteConfirmVisible(false);
      setCurrentDeleteIndex(null);
      setCurrentEntry(null);
    }
  };

  const renderNewEntryForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.titleInput}
        placeholder="Entry Title"
        value={currentEntry?.title || ''}
        onChangeText={(text) => setCurrentEntry({ ...currentEntry || {}, title: text } as JournalEntry)}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.contentTextarea}
        placeholder={selectedPrompt || "Write about your day..."}
        value={currentEntry?.content || ''}
        onChangeText={(text) => setCurrentEntry({ ...currentEntry || {}, content: text } as JournalEntry)}
        multiline
        numberOfLines={5}
        placeholderTextColor="#666"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.outlinedButton} onPress={saveEntry}>
          <Text style={styles.buttonText}>Save Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.outlinedButton, styles.promptSelectButton]}
          onPress={() => setIsModalOpen(true)}
        >
          <Text style={styles.buttonText}>Select Prompt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.outlinedButton, styles.cancelButton]}
          onPress={cancelNewEntryForm}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEntry = () => (
    <View style={styles.fullEntry}>
      <View style={styles.entryHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.entryTitle}>{currentEntry?.title}</Text>
      </View>
      <Text style={styles.entryContent}>{currentEntry?.content}</Text>
      <Text style={styles.entryDate}>
        {currentEntry?.date ? new Date(currentEntry.date).toLocaleString() : ''}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => showDeleteConfirmation(entries.indexOf(currentEntry!))}
        >
          <Text style={styles.buttonText}>Delete Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEntries = () => (
    <ScrollView contentContainerStyle={styles.entriesGrid}>
      {entries.map((entry, index) => (
        <TouchableOpacity
          key={index}
          style={styles.entryCard}
          onPress={() => handleViewEntry(index)}
        >
          <View style={styles.imageContainer}>
            <Image
              source={(getImageSet(avatarImage))[entry.imageIndex]}
              style={styles.entryImage}
            />
          </View>
          <Text style={styles.entryCardTitle}>{entry.title}</Text>
          <Text style={styles.entryCardDate}>
            {new Date(entry.date).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Reward GIF Overlay */}
      {isGifVisible && (
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }
          ]}
        >
          <Image
            source={require('../../assets/gifs/award.gif')}
            resizeMode="contain"
          />
        </Animated.View>
      )}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/GreenPinkLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {!isFormVisible && !currentEntry && (
        <TouchableOpacity style={styles.newEntryButton} onPress={showNewEntryForm}>
          <Text style={styles.newEntryButtonText}>New Entry</Text>
        </TouchableOpacity>
      )}

      {/* Home Button */}
      <TouchableOpacity style={[styles.homeButton]} onPress={navigateToHomePage}>
                <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>

      {isFormVisible && renderNewEntryForm()}
      {!isFormVisible && currentEntry && renderEntry()}
      {!isFormVisible && !currentEntry && renderEntries()}

      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text>Choose a Writing Prompt</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Text style={styles.modalCloseButton}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.promptList}>
                {[
                  'How are you feeling today?',
                  'What did you do today?',
                  'Where did you go today?',
                  'What are you sad about?',
                  'Take deep breaths for a bit...',
                  'Close your eyes and meditate',
                  'Bubble exercise: capture the bad thoughts in a bubble within your head and let them fly up!'
                ].map((prompt, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.promptButton}
                    onPress={() => {
                      setSelectedPrompt(prompt);
                      setIsModalOpen(false);
                    }}
                  >
                    <Text style={styles.promptButtonText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isDeleteConfirmVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={hideDeleteConfirmation}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteConfirmationModal}>
            <View style={styles.deleteModalHeader}>
              <Text style={styles.deleteModalTitle}>Delete Entry</Text>
            </View>
            <View style={styles.deleteModalBody}>
              <Text style={styles.deleteModalText}>
                Are you sure you want to delete this entry? This action cannot be undone.
              </Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity
                  style={[styles.outlinedButton, styles.cancelModalButton]}
                  onPress={hideDeleteConfirmation}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.outlinedButton]}
                  onPress={handleDeleteEntry}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
export default JournalPage;