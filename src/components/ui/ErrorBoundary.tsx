// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// INTERFACES
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * ErrorBoundary component.
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('App crashed:', error, errorInfo);
    }

    handleRestart = () => {
        this.setState({ hasError: false, error: undefined });
    };

    override render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Something went wrong</Text>
                    <Text style={styles.message}>
                    The app encountered an error and needs to restart.
                    </Text>
                    {__DEV__ && this.state.error && (
                        <Text style={styles.errorText}>
                    Error: {this.state.error.message}
                        </Text>
                    )}
                    <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
                        <Text style={styles.buttonText}>Restart App</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: styleConstants.paddingXL,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: styleConstants.fontSize2XL,
        fontWeight: 'bold',
        marginBottom: styleConstants.marginLG,
        color: '#333',
    },
    message: {
        fontSize: styleConstants.fontSizeLG,
        textAlign: 'center',
        marginBottom: 24,
        color: '#666',
    },
    errorText: {
        fontSize: styleConstants.fontSizeSM,
        color: '#999',
        textAlign: 'center',
        marginBottom: 24,
        fontFamily: 'monospace',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: styleConstants.paddingMD,
        borderRadius: styleConstants.borderRadiusMD,
    },
    buttonText: {
        color: 'white',
        fontSize: styleConstants.fontSizeLG,
        fontWeight: 'bold',
    },
});
