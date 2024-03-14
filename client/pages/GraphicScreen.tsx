import { Text, View, StyleSheet } from "react-native";
import BottomSheet from "../BottomSheet";
import MainModel from "../MainModel";
import { Suspense } from "react";

export default function GraphicScreen(){
    return (
        <Suspense fallback = {<Text>Loading...</Text>}>
        <View style = {styles.container}>
            <MainModel />
            <BottomSheet />
        </View>
        </Suspense>
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
