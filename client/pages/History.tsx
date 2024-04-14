import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../components/Navigation";
import { historyData } from "../Types";

import Button from "../components/Button";

import { readHistory, clearHistory } from "../utils/history";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
    navigation: StackNavigationProp<NavStackParamList, "History">;
    route: {};
}

export default function History({ navigation, route }: Props) {
    const [history, setHistory] = useState<historyData | null>(null);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);

    useEffect(() => {
        async function readHistoryAsync() {
            const currHistory = await readHistory();
            if (currHistory) setHistory(currHistory);
        }
        readHistoryAsync();
    }, []);

    const toggleDay = (day: string) => {
        if (expandedDay === day) {
            setExpandedDay(null);
        } else {
            setExpandedDay(day);
        }
    };

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
                    onPress={() => { }}
                    stylesProp={{ opacity: 0 }}
                />
            </View>
            <ScrollView contentContainerStyle={styles.fullHistory}>
                {history ? (
                    Object.keys(history).sort((a, b) => {
                        return new Date(b).getTime() - new Date(a).getTime();
                    }).map((key, index) => {
                        return (
                            <View key={index} style={styles.problemDayContainer}>
                                <TouchableOpacity
                                    key={index}
                                    style={styles.problemDay}
                                    onPress={() => toggleDay(key)}
                                >
                                    <Text>{key}</Text>
                                    <MaterialCommunityIcons
                                        name={(expandedDay === key) ? "arrow-down" : "arrow-right"}
                                        size={24}
                                        color="black"
                                    />

                                </TouchableOpacity>
                                <View style={styles.allProblems}>
                                    {(expandedDay === key) && history[key].map(({ problem, solution }, index) => {
                                        return (
                                            <TouchableOpacity
                                                style={styles.problem}
                                                onPress={() => { navigation.navigate("GraphicScreen", { problem: problem, data: solution }) }}
                                            >
                                                <Text key={index}>
                                                    {problem}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <Text>No history</Text>
                )}
            </ScrollView>
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
                stylesProp={styles.clearButton}
            />
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
    fullHistory: {
        marginTop: 20,
        width: "100%",
        alignItems: "center",
    },
    problemDayContainer: {
        flexDirection: "column",
    },
    problemDay: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 0,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: "100%",
        borderWidth: 1,
        borderColor: "black",

    },
    allProblems: {

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
    clearButton: {
        marginTop: 20,
    },
});