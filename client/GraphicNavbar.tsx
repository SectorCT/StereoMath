import { Text, View, StyleSheet, Dimensions } from "react-native";
import Button from "./Button";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "./Navigation";

interface Props {
	navigation: StackNavigationProp<NavStackParamList, "GraphicScreen">;
    toggleCameraFocus: () => void;
}

export default function GraphicNavbar({navigation, toggleCameraFocus}: Props){
    return (
        <View style = {styles.container}>
            <Button title="" onPress={() => navigation.goBack()} icon="keyboard-backspace" size={24} color="black"  stylesProp={styles.button}/>
            <Button title="" onPress={() => toggleCameraFocus()} icon="image-filter-center-focus-weak" size={24} color="black"  stylesProp={styles.button}/>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#ffffff',
        borderRadius: 50,
    },
    container: {
        flexDirection: 'row',
        position: "absolute",
        top: 0,
        left: 0,
        height: 100,
        zIndex:1000,
        flex: 1,
        backgroundColor: '#ffffff00',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        width: Dimensions.get("screen").width,
    },
});
