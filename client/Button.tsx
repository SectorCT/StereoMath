import React from "react";
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Button({text, onPress, icon, size, color, stylesProp}: 
    {
        text: string, 
        onPress: () => void, 
        icon: keyof typeof MaterialCommunityIcons.glyphMap, 
        size: number | undefined,
        color: string,
        stylesProp?: StyleProp<ViewStyle>
    }
    ) {
    return (
        <TouchableOpacity onPress={onPress} style={StyleSheet.compose(styles.button, stylesProp)}>
            <Text style={styles.text}>{text}</Text>
            <MaterialCommunityIcons name={icon} size={size} color={color} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        // Add any other styling you need for your button
    },
    text: {
        color: 'white',
        fontSize: 20,
        marginLeft: 8,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        // Add styling for your text
    },
});
