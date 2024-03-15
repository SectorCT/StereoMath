import React from "react";
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Button({title, onPress, icon, size, color, stylesProp}: 
    {
        title: string, 
        onPress: () => void, 
        icon: keyof typeof MaterialCommunityIcons.glyphMap, 
        size: number | undefined,
        color: string,
        stylesProp?: StyleProp<ViewStyle>
    }
    ) {
    return (
        <TouchableOpacity onPress={onPress} style={StyleSheet.compose(styles.button, stylesProp)}>
            <MaterialCommunityIcons name={icon} size={size} color={color} />
            <Text style={styles.text}>{title}</Text>
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
        marginLeft: 8,
        // Add styling for your text
    },
});
