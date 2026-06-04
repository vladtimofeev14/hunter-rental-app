import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/globalStyles';

export default function LandlordSetupScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text>Landlord Set up Screen Placeholder</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'LandlordTabs' }],
                    })
                }
            >
                <Text style={styles.buttonText}>Save Preferences</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    button: {
        marginTop: 20,
        backgroundColor: colors.deepPurple,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 999,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
});
