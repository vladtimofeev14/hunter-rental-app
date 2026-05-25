// Placeholders
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserProfileScreen() {
    return (
        <View style={styles.container}>
            <Text>User Profile Screen Placeholder</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});