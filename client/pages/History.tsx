import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../components/Navigation";
import { historyData, historyProblemData } from "../Types";

import Button from "../components/Button";

import { readHistory, clearHistory, deleteProblemFromStorage, toggleFavorite } from "../utils/history";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Canva from '../components/Canva/Canva'


function Navigation({ navigation, setIsDeleting, isDeleting }: {
    navigation: StackNavigationProp<NavStackParamList, "History">,
    setIsDeleting: (state: boolean) => void,
    isDeleting: boolean
}) {
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
                onPress={() => { setIsDeleting(!isDeleting) }}
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


function ProblemEntry({ problem, index, navigation, isDeleting, DeleteProblem }: {
    problem: historyProblemData,
    index: number,
    navigation: StackNavigationProp<NavStackParamList, "History">
    isDeleting: boolean
    DeleteProblem: (problem: string) => void
}) {
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

    function toggleFavoriteHandler() {
        problem.isFavorite = !isDayFavorite;
        toggleFavorite(problem.problem);
        setIsDayFavorite(!isDayFavorite);
    }

    useEffect(() => {
        setIsDayFavorite(problem.isFavorite);
    }, [problem.isFavorite]);

    return (
        <TouchableOpacity
            style={styles.problem}
            onPress={() => { navigation.navigate("GraphicScreen", { problem: problem.problem, data: problem.solution }) }}
        >
            <View style={styles.imagePreview}>
                <Canva
                    data={problem.solution}
                    showGrid={false}
                    showVertices={false}
                    enableCameraController={false}
                    backgroundColor="white"
                    centerCameraAroundShape={true}
                />
            </View>
            <View style={styles.problemText}>
                <Text>{problem.problem.replaceAll("\n", " ")}</Text>
            </View>
            {isDeleting ? (
                <Button
                    icon="delete"
                    color="red"
                    onPress={() => {
                        DeleteProblem(problem.problem);
                    }}
                    size={40}
                />
            ) : (
                <Button
                    icon={isDayFavorite ? "star" : "star-outline"}
                    color="#4393e9"
                    onPress={toggleFavoriteHandler}
                    size={40}
                />
            )}

        </TouchableOpacity>
    );
}

function ProblemDay({ date, allProblems, expandedDay, toggleDay, navigation, showOnlyFavorites, isDeleting, DeleteDay}:
    {
        date: string,
        allProblems: historyProblemData[]
        expandedDay: string | null,
        toggleDay: (day: string) => void,
        navigation: StackNavigationProp<NavStackParamList, "History">,
        showOnlyFavorites: boolean,
        isDeleting: boolean,
        DeleteDay: (day: string) => void,
    }) {
    const Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const currentDay = date.split("-")[0];
    const currentMonth = Months[parseInt(date.split("-")[1], 10)];
    const currentYear = date.split("-")[2];

    const [problemsToMap, setProblemsToMap] = useState<historyProblemData[]>(allProblems);

    function DeleteProblem(problem: string) {
        deleteProblemFromStorage(problem);
       
        setProblemsToMap(problemsToMap.filter((problemEntry) => problemEntry.problem !== problem));
        if (problemsToMap.length === 1) {
            DeleteDay(date);
        }
    }

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


    if (problemsToMap.length === 0) return null;
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
                    {problemsToMap.length} {problemsToMap.length === 1 ? "problem" : "problems"}
                </Text>
            </TouchableOpacity>
            {expandedDay === date && (
                problemsToMap.filter((day) => {
                    return !showOnlyFavorites || day.isFavorite;
                }).toReversed().map((problem, index) => {
                    return (
                        <ProblemEntry problem={problem} index={index} navigation={navigation} isDeleting={isDeleting} DeleteProblem={DeleteProblem} />
                    );
                }
                ))}
        </View>
    );
}


function AllProblemDays({ history, expandedDay, toggleDay, navigation, showOnlyFavorites, isDeleting }:
    {
        history: historyData | null,
        expandedDay: string | null,
        toggleDay: (day: string) => void,
        navigation: StackNavigationProp<NavStackParamList, "History">,
        showOnlyFavorites: boolean,
        isDeleting: boolean
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
        },
        noProblemsText: {
            fontSize: 20,
            textAlign: "center",
            marginTop: 20,
        },
    });

    const [daysToMap, setDaysToMap] = useState<string[]>([]);
    useState<historyProblemData[] | null>(null);

    useEffect(() => {
        setDaysToMap(Object.keys(history ?? {}).sort((a, b) => {
            const splitA = a.split("-");
            const splitB = b.split("-");
            return new Date(parseInt(splitB[2]), parseInt(splitB[1]), parseInt(splitB[0])).getTime() - new Date(parseInt(splitA[2]), parseInt(splitA[1]), parseInt(splitA[0])).getTime();
        }).filter((day) => {
            if (!showOnlyFavorites) return true;
            if (!history) return false;

            for (let problem of history[day]) {
                if (problem.isFavorite) return true;
            }
            return false;
        }))
    }, [history, showOnlyFavorites]);


    function DeleteDay(day: string) {
        if (!history) return;
        for (let problem of history[day]) {
            deleteProblemFromStorage(problem.problem);
        }
        delete history[day];
        setDaysToMap(daysToMap.filter((dayEntry) => dayEntry !== day));
    }
    

    return (
        <View style={styles.fullHistoryContainer}>
            <ScrollView contentContainerStyle={styles.fullHistory}>
                {(history && daysToMap.length)  ? daysToMap.map((key, index) => {
                    return (
                        <ProblemDay
                            date={key}
                            allProblems={history[key]}
                            expandedDay={expandedDay}
                            toggleDay={toggleDay}
                            navigation={navigation}
                            showOnlyFavorites={showOnlyFavorites}
                            isDeleting={isDeleting}
                            DeleteDay={DeleteDay}
                        />
                    )
                }) : (
                    <Text style={styles.noProblemsText}>{showOnlyFavorites ? "No bookmarked problems" : "No problems solved yet"}</Text>
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

    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "#ffffff",
        },
    });

    return (
        <View style={styles.container}>
            <Navigation navigation={navigation} setIsDeleting={setIsDeleting} isDeleting={isDeleting} />
            <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            <AllProblemDays
                history={history}
                expandedDay={expandedDay}
                toggleDay={toggleDay}
                navigation={navigation}
                showOnlyFavorites={selectedTab == "bookmarks"}
                isDeleting={isDeleting}
            />
        </View>
    );
}