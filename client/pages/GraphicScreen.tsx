import { Text, View, StyleSheet } from "react-native";
import BottomSheet from "../BottomSheet";
import MainModel from "../MainModel";
import GraphicNavbar from "../GraphicNavbar";
import { Suspense } from "react";

import { figureData } from "../Types";

const data = {
    "vertices": {
        "A": [0, 0, 0],
        "B": [3, 0, 0],
        "C": [1.5, 2.598, 0],
        "Q": [1.5, 0.866, 4],
        "H": [1.5, 0.866, 0]
    },
    "edges": [
        ["A", "B"],
        ["B", "C"],
        ["C", "A"],
        ["A", "Q"],
        ["B", "Q"],
        ["C", "Q"],
        ["A", "H"],
        ["B", "H"],
        ["C", "H"]
    ],
    "solution":
        ["Ако BG е височината на триъгълника ABQ, то CH ще бъде равно на GH. Тъй като ABQ е правоъгълен триъгълник, можем да използваме   Питагоровата теорема, за да намерим дължината на BG или GH. След  това използваме подобност на триъгълници, за да намерим дължината  на GH."]
} as figureData;

export default function GraphicScreen() {
    return (
        <Suspense fallback={<Text>Loading...</Text>}>
            <View style={styles.container}>
                <GraphicNavbar />
                <MainModel data={data} />
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
