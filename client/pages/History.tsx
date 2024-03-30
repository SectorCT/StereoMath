import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../components/Navigation";
import { historyData } from "../Types";

import Button from "../components/Button";

import { readHistory, clearHistory } from "../utils/history";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
    navigation: StackNavigationProp<NavStackParamList, "History">;
    route: {};
}

export default function History({ navigation, route }: Props) {
    const [history, setHistory] = useState<historyData | null>(null);

    useEffect(() => {
        async function readHistoryAsync() {
            const currHistory= await readHistory();
            if(currHistory) setHistory(currHistory);
        }
        readHistoryAsync();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Button
                    icon="arrow-left"
                    size={25}
                    color="black"
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.text}>Solved problems</Text>
                <Button
                    icon="arrow-left-thin"
                    size={25}
                    color="black"
                    onPress={() => {}}
                    stylesProp={{ opacity: 0 }}
                />
            </View>
            <View style={styles.allProblems}> 
                {history ? (
                    Object.keys(history).map((key, index) => {
                        return (
                            <View key={index} style={styles.problemDayContainer}>
                                <Text>{key}</Text>
                                {history[key].map(({problem, solution}, index) => {
                                    return (
                                        <TouchableOpacity 
                                            style={styles.problem}
                                            onPress={() => {navigation.navigate("GraphicScreen", {problem: problem, data: solution})}}
                                        >
                                            <Text key={index}>
                                            {problem}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        );
                    })
                ) : (
                    <Text>No history</Text>
                )}
                <Button
                    text="Clear history"
                    textColor="black"
                    color="red"
                    icon="delete"
                    size={25}
                    onPress={() => {
                        clearHistory();
                        setHistory(null);
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
    },
    header: {
        marginTop: 40,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        alignItems: "center",
    },
    allProblems: {
        marginTop: 20,
        width: "100%",
        alignItems: "center",
    },
    problemDayContainer: {
        margin: 10,
        padding: 10,
        width: "90%",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
    },
    problem: {
        margin: 10,
        padding: 10,
        width: "90%",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
    },
    text: {
        fontSize: 25,
    },
});