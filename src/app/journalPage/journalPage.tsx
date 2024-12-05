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
import { avatar_list } from '../../assets/avatars/avatarAssets';
import { useRouter } from "expo-router";
import createNeo4jDriver from '../utils/databaseSetUp';
import { getDarkerShade } from '../utils/colorUtils';
import { AuthContext } from "../AuthContext";

interface JournalEntry {
  entryID: number;
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
  const [exp, setExp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streaks, setStreaks] = useState(0);
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

  // Load journal entries
  useEffect(() => {
    const loadUserData = async () => {
      const session = driver.session()
      try {
        const result = await session.run(
          'MATCH (u:User {sessionToken: $sessionToken}) RETURN u.backgroundColor AS backgroundColor, u.avatarImage as avatarImage, u.exp AS exp, u.coins AS coins, u.streaks AS streaks',
          { sessionToken }
        );
        if (result.records.length > 0) {
          const record = result.records[0];
          const backgroundColor = record.get("backgroundColor");
          const avatarImage = record.get("avatarImage");
          setExp(record.get("exp") || 0);
          setCoins(record.get("coins") || 0);
          setStreaks(record.get("streaks") || 0);
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
      const session = driver.session();
      try {
        const result = await session.run(
          `
        MATCH (u:User {sessionToken: $sessionToken})-[:HAS_ENTRY]->(j:Journal)
        RETURN j.entryID AS entryID, j.date AS date, j.title AS title, j.content AS content, j.imageIndex AS imageIndex
        ORDER BY j.date DESC
        `,
          { sessionToken }
        );

        const fetchedEntries = result.records.map((record) => ({
          entryID: record.get('entryID'),
          title: record.get('title'),
          content: record.get('content'),
          date: record.get('date'),
          imageIndex: record.get('imageIndex'),
        }));

        setEntries(fetchedEntries);
      } catch (error) {
        console.error('Failed to load journal entries from Neo4j:', error);
        Alert.alert('Error', 'Could not load journal entries.');
      } finally {
        await session.close();
      }
    };

    loadEntries();
    loadUserData();
    console.log("User properties:", { backgroundColor, avatarImage, exp, coins, streaks });
  }, [sessionToken]);

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
    console.log("imageSet:", { imageSet })
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

  const saveEntry = async () => {
    if (!currentEntry?.title || !currentEntry?.content) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newEntry: JournalEntry = {
      entryID: currentEntry.entryID,
      title: currentEntry.title,
      content: currentEntry.content,
      date: new Date().toISOString(),
      imageIndex: getRandomImageIndex(),
    };

    const session = driver.session();
    try {
      await session.run(
        `
        MATCH (u:User {sessionToken: $sessionToken})
        SET u.coins = u.coins + 5, u.exp = u.exp + 10, u.streak = u.streak + 1
        CREATE (j:Journal {
          entryID: randomUUID(),
          date: $date,
          title: $title,
          content: $content,
          imageIndex: $imageIndex
        })
        MERGE (u)-[:HAS_ENTRY]->(j)
        `,
        {
          sessionToken,
          date: newEntry.date,
          title: newEntry.title,
          content: newEntry.content,
          imageIndex: newEntry.imageIndex,
        }
      );
      console.log('Query result:', session);
      setEntries([newEntry, ...entries]);
      setIsFormVisible(false);
      setSelectedPrompt(null);
      setCurrentEntry(null);
      showRewardGif();
    } catch (error) {
      console.error('Failed to save journal entry to Neo4j:', error);
      Alert.alert('Error', 'Could not save journal entry.');
    } finally {
      await session.close();
    }
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

  const handleDeleteEntry = async () => {
    if (currentDeleteIndex !== null) {
      const entryToDelete = entries[currentDeleteIndex];
      const session = driver.session();
      try {
        // Delete the relationship
        await session.run(
          `
        MATCH (u:User {sessionToken: $sessionToken})-[r:HAS_ENTRY]->(j:Journal {entryID: $entryID})
        DELETE r
        `,
          {
            sessionToken,
            entryID: entryToDelete.entryID, // Ensure `entryID` is unique for each Journal entry
          }
        );

        // Optionally delete the Journal node if no other relationships exist
        await session.run(
          `
        MATCH (j:Journal {entryID: $entryID})
        WHERE NOT (j)<-[:HAS_ENTRY]-()
        DELETE j
        `,
          { entryID: entryToDelete.entryID }
        );

        const updatedEntries = entries.filter((_, index) => index !== currentDeleteIndex);
        setEntries(updatedEntries);
        setIsDeleteConfirmVisible(false);
        setCurrentDeleteIndex(null);
        setCurrentEntry(null);
      } catch (error) {
        console.error('Failed to delete journal entry in Neo4j:', error);
        Alert.alert('Error', 'Could not delete journal entry.');
      } finally {
        await session.close();
      }
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
        <TouchableOpacity style={[styles.outlinedButton, { backgroundColor: getDarkerShade(backgroundColor) }]} onPress={saveEntry}>
          <Text style={styles.buttonText}>Save Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.outlinedButton, styles.promptSelectButton, { backgroundColor: getDarkerShade(backgroundColor) }]}
          onPress={() => setIsModalOpen(true)}
        >
          <Text style={styles.buttonText}>Select Prompt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.outlinedButton, styles.cancelButton, { backgroundColor: getDarkerShade(backgroundColor) }]}
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
          style={[styles.deleteButton, { backgroundColor: getDarkerShade(backgroundColor) }]}
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
        <TouchableOpacity style={[styles.newEntryButton, { backgroundColor: getDarkerShade(backgroundColor) }]} onPress={showNewEntryForm}>
          <Text style={styles.newEntryButtonText}>New Entry</Text>
        </TouchableOpacity>
      )}

      {/* Home Button */}
      <TouchableOpacity style={[styles.homeButton, { backgroundColor: getDarkerShade(backgroundColor), marginTop: 20 }]} onPress={navigateToHomePage}>
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
          <View style={[styles.modalContent, { borderWidth: 4, borderRadius: 15 }]}>
            <View style={{ ...styles.modalHeader, backgroundColor: getDarkerShade(backgroundColor) }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Choose a Writing Prompt</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Text style={[styles.modalCloseButton, { fontSize: 24 }]}>×</Text>
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
                    style={[styles.promptButton, { backgroundColor: getDarkerShade(backgroundColor) }]}
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
            <View style={{ ...styles.deleteModalHeader, backgroundColor: getDarkerShade(backgroundColor) }}>
              <Text style={styles.deleteModalTitle}>Delete Entry</Text>
            </View>
            <View style={styles.deleteModalBody}>
              <Text style={styles.deleteModalText}>
                Are you sure you want to delete this entry? This action cannot be undone.
              </Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity
                  style={[styles.outlinedButton, styles.cancelModalButton, { backgroundColor: getDarkerShade(backgroundColor) }]}
                  onPress={hideDeleteConfirmation}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.outlinedButton, { backgroundColor: getDarkerShade(backgroundColor) }]}
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