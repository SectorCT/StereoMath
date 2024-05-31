import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../components/Navigation";
import { historyData, historyProblemData } from "../Types";

import Button from "../components/Button";

import { readHistory, clearHistory, deleteProblem } from "../utils/history";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Canva from '../components/Canva/Canva'


function Navigation({ navigation }: { navigation: StackNavigationProp<NavStackParamList, "History"> }) {
    const styles = StyleSheet.create({
        navigation: {
            marginTop: 40,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            alignItems: "center",
        },
        text: {
            fontSize: 25,
        },
    })

    return (
        <View style={styles.navigation}>
            <Button
                icon="arrow-left"
                size={25}
                color="black"
                onPress={() => navigation.goBack()}
            />
            <Text style={styles.text}>Solved problems</Text>
            <TouchableOpacity
                onPress={() => { }}
            >
                <Text>Delete</Text>
            </TouchableOpacity>
        </View>
    );
}

function Tabs({ selectedTab, setSelectedTab }: { selectedTab: "history" | "bookmarks", setSelectedTab: (tab: "history" | "bookmarks") => void }) {
    const styles = StyleSheet.create({
        tabs: {
            flexDirection: 'row',
            width: '100%',
            height: 50,
        },
        tab: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 7,
            borderBottomWidth: 1,
            borderBottomColor: '#D9D9D9',
        },
        tabSelected: {
            borderBottomWidth: 2,
            borderBottomColor: '#4393e9',
        },
        tabText: {
            color: '#000000',
            fontSize: 16,
        },
        tabTextSelected: {
            fontWeight: 'bold',
        },
    });

    return (
        <View style={styles.tabs}>
            <TouchableOpacity
                style={[styles.tab, selectedTab === "history" && styles.tabSelected]}
                onPress={() => setSelectedTab("history")}
            >
                <Text style={[styles.tabText, selectedTab === "history" && styles.tabTextSelected]}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, selectedTab === "bookmarks" && styles.tabSelected]}
                onPress={() => setSelectedTab("bookmarks")}
            >
                <Text style={[styles.tabText, selectedTab === "bookmarks" && styles.tabTextSelected]}>Bookmarks</Text>
            </TouchableOpacity>
        </View>
    );

}

function ProblemEntry({ problem, index, navigation }: { problem: historyProblemData, index: number,  navigation: StackNavigationProp<NavStackParamList, "History">}) {
    const styles = StyleSheet.create({
        problem: {
            paddingVertical: 20,
            padding: 10,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "black",
            marginHorizontal: 5,
            marginVertical: 2,
            flexDirection: "row",
        },
        imagePreview: {
            width: 86,
            height: 86,
            backgroundColor: "grey",
            marginRight: 10,
        },
        problemText: {
            flex: 1,
            justifyContent: "center",
        },
    });

    const [isDayFavorite, setIsDayFavorite] = useState(problem.isFavorite);

    function toggleFavorite() {
        setIsDayFavorite(!isDayFavorite);
    }

    return (
        <TouchableOpacity
            style={styles.problem}
            onPress={() => { navigation.navigate("GraphicScreen", {problem:problem.problem, data:problem.solution})}}
        >
            <View style={styles.imagePreview}>
                <Canva
                    data={problem.solution}
                    showGrid={false}
                    showVertices={false}
                    enableCameraController={false}
                />
            </View>
            <View style={styles.problemText}>
                <Text>{problem.problem.replaceAll("\n", " ")}</Text>
            </View>
            <Button
                icon={isDayFavorite ? "star" : "star-outline"}
                color="black"
                onPress={toggleFavorite}
                size={40}
            />
        </TouchableOpacity>
    );
}

function ProblemDay({ date, allProblems, expandedDay, toggleDay, navigation }:
    {
        date: string,
        allProblems: historyProblemData[]
        expandedDay: string | null,
        toggleDay: (day: string) => void,
        navigation: StackNavigationProp<NavStackParamList, "History">
    }) {
    const Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const currentDay = date.split("-")[0];
    const currentMonth = Months[parseInt(date.split("-")[1], 10) - 1];
    const currentYear = date.split("-")[2];

    const styles = StyleSheet.create({
        problemDayContainer: {
            width: "100%",
            flexDirection: "column",
            justifyContent: "center",
        },
        problemDayTitle: {
            fontSize: 20,
            fontWeight: "bold",
            marginVertical: 10,
        },
        dayContainer: {
            height: 50,
            justifyContent: "space-between",
            paddingHorizontal: 15,
            flexDirection: "row",
            alignItems: "center",
        },
        expandIcon: {
            marginRight: 6,
            paddingTop: 3,
        },
        dateContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        numberOfProblems: {
            fontSize: 16,
            color: "grey",
        },

    });


    return (
        <View style={styles.problemDayContainer}>
            <TouchableOpacity style={styles.dayContainer}
                onPress={() => toggleDay(date)}
            >
                <View style={styles.dateContainer}>
                    <MaterialCommunityIcons
                        color="black"
                        name={expandedDay === date ? "chevron-up" : "chevron-down"}
                        size={30}
                        style={styles.expandIcon}
                    />
                    <Text style={styles.problemDayTitle}>
                        {currentMonth} {currentDay}, {currentYear}
                    </Text>
                </View>
                <Text style={styles.numberOfProblems}>
                    {allProblems.length} {allProblems.length === 1 ? "problem" : "problems"}
                </Text>
            </TouchableOpacity>
            {expandedDay === date && (
                allProblems.map((problem, index) => {
                    return (
                        <ProblemEntry problem={problem} index={index} navigation={navigation}/>
                    );
                }
            ))}
        </View>
    );
}


function AllProblemDays({ history, expandedDay, toggleDay, navigation }:
    {
        history: historyData | null,
        expandedDay: string | null,
        toggleDay: (day: string) => void,
        navigation: StackNavigationProp<NavStackParamList, "History">
    }
) {
    const styles = StyleSheet.create({
        fullHistoryContainer: {
            width: '100%',
            flex: 1,
            marginTop: 15,
        },
        fullHistory: {
            flexGrow: 1,
        }
    });

    return (
        <View style={styles.fullHistoryContainer}>
            <ScrollView contentContainerStyle={styles.fullHistory}>
                {history ? (
                    Object.keys(history).sort((a, b) => {
                        return new Date(b).getTime() - new Date(a).getTime();
                    }).map((key, index) => {
                        return (
                            <ProblemDay
                                date={key}
                                allProblems={history[key]}
                                expandedDay={expandedDay}
                                toggleDay={toggleDay}
                                navigation={navigation}
                            />
                        )
                    })
                ) : (
                    <Text>No history</Text>
                )}
            </ScrollView>
        </View>
    )
}




interface Props {
    navigation: StackNavigationProp<NavStackParamList, "History">;
    route: {};
}

export default function History({ navigation, route }: Props) {
    const [history, setHistory] = useState<historyData | null>(null);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);

    const [selectedTab, setSelectedTab] = useState<"history" | "bookmarks">("history")

    async function readHistoryAsync() {
        const currHistory = await readHistory();
        if (currHistory) setHistory(currHistory);
    }

    useEffect(() => {

        readHistoryAsync();
    }, []);

    const toggleDay = (day: string) => {
        if (expandedDay === day) {
            setExpandedDay(null);
        } else {
            setExpandedDay(day);
        }
    };

    const [problemToDelete, setProblemToDelete] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <Navigation navigation={navigation} />
            <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            <AllProblemDays history={history} expandedDay={expandedDay} toggleDay={toggleDay} navigation={navigation} />
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
    },
    navigation: {
        marginTop: 40,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        alignItems: "center",
    },
    problemDayContainer: {
        flexDirection: "column",
        justifyContent: "center",
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
        borderBottomWidth: 0,
    },
    lastProblemDay: {
        borderBottomWidth: 1,
    },
    allProblems: {
        borderTopWidth: 1,
    },
    problem: {
        paddingVertical: 20,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "black",
        marginHorizontal: 5,
        marginVertical: 2,
        flexDirection: "row",
    },
    problemText: {
        flex: 1,
    },
    clearButton: {
        marginTop: 20,
    },
});
