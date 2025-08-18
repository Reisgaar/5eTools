// REACT
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// INTERFACES
interface ImagePickerProps {
    currentImageUri?: string;
    onImageSelected: (uri: string | null) => void;
    theme: any;
}

/**
 * PlayerImagePicker component.
 */
export default function PlayerImagePicker({ currentImageUri, onImageSelected, theme }: ImagePickerProps) {
    const [imageUri, setImageUri] = useState<string | null>(currentImageUri || null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setImageUri(currentImageUri || null);
    }, [currentImageUri]);

    const requestPermissions = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            console.log('Permission status:', status);
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Sorry, we need camera roll permissions to select an image.',
                    [{ text: 'OK' }]
                );
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error requesting permissions:', error);
            Alert.alert('Error', 'Failed to request permissions. Please try again.');
            return false;
        }
    };

    const selectImage = async () => {
        console.log('Starting image selection...');
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            console.log('Permission denied');
            return;
        }

        try {
            setIsLoading(true);
            console.log('Launching image library...');
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            console.log('Image picker result:', result);
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedUri = result.assets[0].uri;
                console.log('Selected image URI:', selectedUri);
                await saveImageToStorage(selectedUri);
            } else {
                console.log('Image selection was canceled or no assets');
            }
        } catch (error) {
            console.error('Error selecting image:', error);
            Alert.alert('Error', 'Failed to select image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const saveImageToStorage = async (uri: string) => {
        try {
            console.log('Saving image to storage...');
            console.log('Source URI:', uri);

            // Create a unique filename
            const timestamp = Date.now();
            const filename = `player_token_${timestamp}.jpg`;
            const destinationUri = `${FileSystem.documentDirectory}player_tokens/${filename}`;

            console.log('Destination URI:', destinationUri);

            // Ensure directory exists
            const dirInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}player_tokens/`);
            console.log('Directory info:', dirInfo);
            if (!dirInfo.exists) {
                console.log('Creating directory...');
                await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}player_tokens/`, { intermediates: true });
            }

            // Copy image to app storage
            console.log('Copying image...');
            await FileSystem.copyAsync({
                from: uri,
                to: destinationUri
            });

            console.log('Image saved successfully');
            setImageUri(destinationUri);
            onImageSelected(destinationUri);
        } catch (error) {
            console.error('Error saving image:', error);
            Alert.alert('Error', 'Failed to save image. Please try again.');
        }
    };

    const removeImage = () => {
        setImageUri(null);
        onImageSelected(null);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: theme.text }]}>Character Token Image</Text>

            <View style={[styles.imageContainer, { borderColor: theme.primary }]}>
                {imageUri ? (
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                        <TouchableOpacity
                            style={[styles.removeButton, { backgroundColor: '#dc2626' }]}
                            onPress={removeImage}
                        >
                            <Ionicons name="close" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.placeholder, { borderColor: theme.primary }]}
                        onPress={selectImage}
                        disabled={isLoading}
                    >
                        <Ionicons
                            name={isLoading ? 'hourglass' : 'camera'}
                            size={32}
                            color={theme.primary}
                        />
                        <Text style={[styles.placeholderText, { color: theme.noticeText }]}>
                            {isLoading ? 'Loading...' : 'Tap to select image'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {!imageUri && (
                <TouchableOpacity
                    style={[styles.selectButton, { backgroundColor: theme.primary }]}
                    onPress={selectImage}
                    disabled={isLoading}
                >
                    <Text style={[styles.selectButtonText, { color: 'white' }]}>
                        {isLoading ? 'Loading...' : 'Select Image'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 20,
        minHeight: 120,
    },
    imageWrapper: {
        position: 'relative',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#333',
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 20,
        minHeight: 100,
        width: '100%',
    },
    placeholderText: {
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
    },
    selectButton: {
        marginTop: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    selectButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
