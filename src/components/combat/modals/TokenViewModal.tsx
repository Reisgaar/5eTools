// REACT
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
interface TokenViewModalProps {
  visible: boolean;
  onClose: () => void;
  tokenUrl?: string;
  fallbackUrl?: string; // URL to fallback to if main image fails
  creatureName: string;
  theme: any;
}

/**
 * Modal used to view a token image.
 */
export default function TokenViewModal({
    visible,
    onClose,
    tokenUrl,
    fallbackUrl,
    creatureName,
    theme
}: TokenViewModalProps): JSX.Element {
    const [useFallback, setUseFallback] = React.useState(false);
    const baseStyles = createBaseModalStyles(theme);

    // Reset fallback state when modal opens
    React.useEffect(() => {
        if (visible)
            setUseFallback(false);
    }, [visible]);

    const currentImageUrl = useFallback && fallbackUrl ? fallbackUrl : tokenUrl;
    const displayTitle = creatureName && creatureName.trim() !== '' ? creatureName : 'Creature';

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title={displayTitle}
            footerContent={
                <Text style={baseStyles.modalNoticeText}>
                    Tap outside to close
                </Text>
            }
        >
            {/* Token Image */}
            <View style={styles.imageContainer}>
                {currentImageUrl ? (
                    <Image
                        source={{ uri: currentImageUrl }}
                        style={styles.tokenImage}
                        resizeMode="contain"
                        onError={() => {
                            console.log(`Failed to load image for ${creatureName}`);
                            if (!useFallback && fallbackUrl) {
                                console.log(`Falling back to token image for ${creatureName}`);
                                setUseFallback(true);
                            } else {
                                console.log(`No fallback available for ${creatureName}`);
                            }
                        }}
                    />
                ) : (
                    <View style={[styles.noTokenContainer, { backgroundColor: theme.primary }]}>
                        <Ionicons name="image-outline" size={64} color="white" />
                        <Text style={styles.noTokenText}>No image available</Text>
                    </View>
                )}
            </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        minHeight: 300,
    },
    tokenImage: {
        width: '100%',
        height: '100%',
        maxWidth: 300,
        maxHeight: 300,
        borderRadius: 8,
    },
    noTokenContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    noTokenText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
});
