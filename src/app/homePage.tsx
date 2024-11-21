import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Dimensions, AppState } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const HomePage: React.FC = () => {
    const router = useRouter();
    const [backgroundColor, setBackgroundColor] = useState<string>('');

    const getRandomBackgroundColor = (): string => {
        const colors = ['#FFEBEE', '#E3F2FD', '#C8E6C9', '#FFF9C4', '#F1F8E9'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const getDarkerShade = (color: string): string => {
        const hex = color.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        r = Math.max(0, r - 30);
        g = Math.max(0, g - 30);
        b = Math.max(0, b - 30);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const loadBackgroundColor = async () => {
        try {
            const savedColor = await AsyncStorage.getItem('backgroundColor');
            if (savedColor) {
                setBackgroundColor(savedColor);
            } else {
                const randomColor = getRandomBackgroundColor();
                setBackgroundColor(randomColor);
                await AsyncStorage.setItem('backgroundColor', randomColor);
            }
        } catch (error) {
            console.error('Error loading background color:', error);
        }
    };

    // Use useFocusEffect to reload color when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadBackgroundColor();
        }, [])
    );

    // Add AppState listener to handle app coming to foreground
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                loadBackgroundColor();
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Initial load
    useEffect(() => {
        loadBackgroundColor();
    }, []);

    const goToPage = (page: string) => {
        router.push(page);
    };

    const getLogoDimensions = () => {
        if (Platform.OS === 'web') {
            return {
                width: Math.min(screenWidth * 0.4, 500),
                height: Math.min(screenWidth * 0.12, 150),
            };
        } else {
            return {
                width: Math.min(screenWidth * 0.7, 300),
                height: Math.min(screenWidth * 0.21, 90),
            };
        }
    };

    const logoDimensions = getLogoDimensions();

    return (
        <View style={[styles.homeContainer, { backgroundColor }]}>
            <View style={[
                styles.logoContainer, 
                Platform.OS === 'web' ? styles.logoContainerWeb : styles.logoContainerMobile
            ]}>
                <Image
                    source={require('../assets/images/GreenPinkLogo.png')}
                    style={[styles.logo, { width: logoDimensions.width, height: logoDimensions.height }]}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.avatar}>
                <Image
                    source={require('../assets/images/bear/bear1.png')}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                />
            </View>

            <View style={styles.buttonContainer}>
                {/* Buttons remain the same... */}
                {/* Journal Button */}
                <TouchableOpacity
                    style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}
                    onPress={() => goToPage('./journalPage/journalPage')}
                >
                    <Text style={styles.buttonText}>Journal</Text>
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="24"
                        height="24"
                        strokeWidth="2"
                        style={styles.icon}
                    >
                        <Path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
                        <Path d="M13 8l2 0" />
                        <Path d="M13 12l2 0" />
                    </Svg>
                </TouchableOpacity>

                {/* Profile Button */}
                <TouchableOpacity
                    style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}
                    onPress={() => goToPage('./profilePage/profilePage')}
                >
                    <Text style={styles.buttonText}>Profile</Text>
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="24"
                        height="24"
                        strokeWidth="2"
                        style={styles.icon}
                    >
                        <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                        <Path d="M4 19c0-2.21 3.58-4 8-4s8 1.79 8 4" />
                    </Svg>
                </TouchableOpacity>

                {/* Store Button */}
                <TouchableOpacity
                    style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}
                    onPress={() => goToPage('./storePage/storePage')}
                >
                    <Text style={styles.buttonText}>Store</Text>
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="24"
                        height="24"
                        strokeWidth="2"
                        style={styles.icon}
                    >
                        <Path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <Path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <Path d="M17 17h-11v-14h-2" />
                        <Path d="M6 5l14 1l-1 7h-13" />
                    </Svg>
                </TouchableOpacity>

                {/* Chat Button */}
                <TouchableOpacity
                    style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}
                    onPress={() => goToPage('./chatPage/chatPage')}
                >
                    <Text style={styles.buttonText}>Chat</Text>
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="24"
                        height="24"
                        strokeWidth="2"
                        style={styles.icon}
                    >
                        <Path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
                    </Svg>
                </TouchableOpacity>

                {/* Closet Button */}
                <TouchableOpacity
                    style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}
                    onPress={() => goToPage('./closetPage/closetPage')}
                >
                    <Text style={styles.buttonText}>Closet</Text>
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="24"
                        height="24"
                        strokeWidth="2"
                        style={styles.icon}
                    >
                        <Path d="M14 6a2 2 0 1 0 -4 0c0 1.667 .67 3 2 4h-.008l7.971 4.428a2 2 0 0 1 1.029 1.749v.823a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-.823a2 2 0 0 1 1.029 -1.749l7.971 -4.428" />
                    </Svg>
                </TouchableOpacity>

                {/* Friends Button */}
                <TouchableOpacity
                    style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}
                    onPress={() => goToPage('./friendsPage/friendsPage')}
                >
                    <Text style={styles.buttonText}>Friends</Text>
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="24"
                        height="24"
                        strokeWidth="2"
                        style={styles.icon}
                    >
                        <Path d="M7 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                        <Path d="M5 22v-5l-1 -1v-4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4l-1 1v5"/>
                        <Path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                        <Path d="M15 22v-4h-2l2 -6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1l2 6h-2v4"/>
                    </Svg>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    logoContainerWeb: {
        top: 40,
    },
    logoContainerMobile: {
        top: 60,
    },
    logo: {
        resizeMode: 'contain',
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    buttonStyle: {
        padding: 18,
        margin: 18,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        marginRight: 14,
    },
    icon: {
        width: 32,
        height: 32,
    },
    avatar: {
        marginBottom: 20,
    },
});

export default HomePage;