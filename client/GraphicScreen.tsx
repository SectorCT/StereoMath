import { Text, View, StyleSheet } from "react-native";
import BottomSheet from "./BottomSheet";

export default function GraphicScreen(){
    return (
        <View>
            <BottomSheet />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
    },
});
