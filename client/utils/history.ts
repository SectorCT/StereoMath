import AsyncStorage from '@react-native-async-storage/async-storage';
import { figureData, historyData } from '../Types';

export async function readHistory() {
    const history = await AsyncStorage.getItem('history');
    const historyData: historyData = JSON.parse(history ? history : 'null');
    return historyData;
}

export async function addProblemToHistory(problem: string, solution: figureData) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateStr = `${day}-${month}-${year}`;

    const history = await AsyncStorage.getItem('history')
    if (history) {
        const newHistory: historyData = JSON.parse(history);
        if (newHistory[dateStr]) {
            for (const entry of newHistory[dateStr]) {
                if (entry.problem.replaceAll(" ", '') === problem.replaceAll(" ", '')) {
                    return;
                }
            }
            newHistory[dateStr].push({ problem, solution });
        } else {
            newHistory[dateStr] = [{ problem, solution }];
        }
        AsyncStorage.setItem('history', JSON.stringify(newHistory));
    } else {
        const history: historyData = {}
        history[dateStr] = [{ problem, solution }];
        AsyncStorage.setItem('history', JSON.stringify(history));
    }
}

export async function findProblemInHistory(problem: string) {
    const history = await AsyncStorage.getItem('history');
    if (!history) return null;
    const historyData: historyData = JSON.parse(history);
    for (const date in historyData) {
        for (const entry of historyData[date]) {
            if (entry.problem.replaceAll(" ", '') === problem.replaceAll(" ", '')) {
                return entry.solution;
            }
        }
    }
    return null;
}

export function clearHistory() {
    AsyncStorage.removeItem('history');
}