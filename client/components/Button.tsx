import React from "react";
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Button({ text, textColor, onPress, icon, size, color, stylesProp }:
    {
        text?: string,
        textColor?: string,
        onPress: () => void,
        icon?: keyof typeof MaterialCommunityIcons.glyphMap,
        size?: number,
        color?: string,
        stylesProp?: StyleProp<ViewStyle>
    }
) {
    return (
        <TouchableOpacity onPress={onPress} style={StyleSheet.compose(styles.button, stylesProp)}>
            {text && <Text style={StyleSheet.compose(styles.text, textColor ? {color:textColor} : {})}>{text}</Text>}
            {icon && <MaterialCommunityIcons name={icon} size={size ? size : 20} color={color ? color : "black"} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        height: "auto",
    },
    text: {
        color: 'white',
        fontSize: 20,
        marginLeft: 8,
    },
});
