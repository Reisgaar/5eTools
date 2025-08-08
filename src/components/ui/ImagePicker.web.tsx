import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImagePickerProps {
    currentImageUri?: string;
    onImageSelected: (uri: string | null) => void;
    theme: any;
}

export default function PlayerImagePicker({ currentImageUri, onImageSelected, theme }: ImagePickerProps) {
    const [imageUri, setImageUri] = useState<string | null>(currentImageUri || null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setImageUri(currentImageUri || null);
    }, [currentImageUri]);

    const selectImage = async () => {
        try {
            setIsLoading(true);
            
            // Create a file input element
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = (event) => {
                const file = (event.target as HTMLInputElement).files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const result = e.target?.result as string;
                        if (result) {
                            setImageUri(result);
                            onImageSelected(result);
                        }
                    };
                    reader.readAsDataURL(file);
                }
                setIsLoading(false);
            };
            
            input.click();
        } catch (error) {
            console.error('Error selecting image:', error);
            Alert.alert('Error', 'Failed to select image. Please try again.');
            setIsLoading(false);
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
                            name={isLoading ? "hourglass" : "camera"} 
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


